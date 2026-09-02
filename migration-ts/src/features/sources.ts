// Herkunftsanalyse eines fertigen Textes: Welcher Anteil stammt aus welcher
// Quelle? Nutzt dasselbe Phrasen-Matching wie die Einspeisungs-Färbung im
// Studio, wertet es aber aus statt es nur einzufärben.
import { loadBank } from "../storage";
import { liveTexts } from "./livepools";
import { TONE_DATA } from "../generation/tone.data";
import { getMarkovTraceFor } from "../generation/markovTrace";
import { getTraceFor } from "../atoms/trace";
import { extractLeadVerb } from "../generation/wordcls";

export type QuellenId = "wortbank" | "ton" | "kontext" | "pools" | "markov" | "vorlage" | "nachbearbeitung" | "dramaturgie" | "korpus";
export interface Segment { s: number; e: number; quelle: QuellenId; }
export interface Herkunft {
  segmente: Segment[];
  anteile: Record<QuellenId, number>;   // 0..1, Anteil der Zeichen
  zeichen: number;
  /** true = Anteile stammen aus der Bauspur (Rekombination), nicht aus dem Textabgleich. */
  exakt: boolean;
  /** Anteil der Pool-Einträge, die wörtlich auch in der Wortbank stehen und dort gezählt werden. */
  poolUeberschneidung: number;
}
export const QUELLEN_LABEL: Record<QuellenId, string> = {
  wortbank: "Wortbank", ton: "Ton", kontext: "4W-Kontext", pools: "Lebendige Pools",
  markov: "Markov", vorlage: "Vorlagen/Schablonen", nachbearbeitung: "Nachbearbeitung", dramaturgie: "Erzählbogen", korpus: "Korpus",
};

/** Die 4W-Werte in allen Formen, in denen sie im Text auftauchen koennen.
 *  Zwei Fallen: Namen wie "Tom" sind kuerzer als die bisherige Mindestlaenge von
 *  vier Zeichen und fielen ganz heraus. Und das Was-Feld wird beim Bauen auf die
 *  dritte Person gebracht ("sehe 9 Monde" -> "sieht 9 Monde"), der Rohwert steht
 *  also nirgends im Text. Beide Formen werden jetzt gesammelt. */
export function w4Varianten(ctx: { where?: string; when?: string; who?: string; what?: string }): string[] {
  const raus: string[] = [];
  const nimm = (x: string): void => {
    const t = (x || "").trim();
    if (!t) return;
    // Kurzes nur, wenn es wie ein Name aussieht - sonst treffen "ist" und "und".
    if (t.length >= 4 || (t.length >= 2 && /^[A-ZÄÖÜ]/.test(t))) raus.push(t);
  };
  for (const v of [ctx.who, ctx.where, ctx.when, ctx.what]) (v || "").split(/[,;]/).forEach(nimm);
  const was = (ctx.what || "").trim();
  if (was) {
    const lead = extractLeadVerb(was);
    if (lead.verb) { nimm(`${lead.verb} ${lead.rest}`); nimm(lead.rest); }
  }
  return raus;
}

interface Treffer { s: number; e: number; quelle: QuellenId; prio: number }
function sammle(phrasen: string[], quelle: QuellenId, prio: number, low: string, acc: Treffer[]): void {
  for (const roh of phrasen) {
    const p = (roh || "").trim(); if (p.length < 5) continue;
    const pl = p.toLowerCase();
    let von = 0, i = low.indexOf(pl, von);
    while (i !== -1) { acc.push({ s: i, e: i + pl.length, quelle, prio }); von = i + pl.length; if (acc.length > 4000) return; i = low.indexOf(pl, von); }
  }
}

/** Zerlegt den Text in Herkunftssegmente. `ctx` sind die 4W-Angaben. */
export function analysiereHerkunft(text: string, tone: string, ctx: { where?: string; when?: string; who?: string; what?: string }): Herkunft {
  const low = (text || "").toLowerCase();
  const acc: Treffer[] = [];
  if (tone && tone !== "neutral") { const td = TONE_DATA[tone]; if (td) sammle([...td.opener, ...td.flavor], "ton", 3, low, acc); }
  sammle(w4Varianten(ctx), "kontext", 2, low, acc);
  try { const b = loadBank() as unknown as Record<string, string[]>; const alle: string[] = [];
    for (const k of Object.keys(b)) if (Array.isArray(b[k])) alle.push(...b[k]!); sammle(alle, "wortbank", 1, low, acc); } catch { /* egal */ }
  try { sammle(liveTexts(), "pools", 1, low, acc); } catch { /* egal */ }
  try { sammle(getMarkovTraceFor(text || ""), "markov", 2, low, acc); } catch { /* egal */ }

  acc.sort((a, b) => a.s - b.s || (b.e - b.s) - (a.e - a.s) || b.prio - a.prio);
  const segmente: Segment[] = [];
  let ende = -1;
  for (const t of acc) { if (t.s < ende) continue; segmente.push({ s: t.s, e: t.e, quelle: t.quelle }); ende = t.e; }

  const zeichen = (text || "").length || 1;
  const anteile = { wortbank: 0, ton: 0, kontext: 0, pools: 0, markov: 0, vorlage: 0, nachbearbeitung: 0, dramaturgie: 0, korpus: 0 } as Record<QuellenId, number>;
  let belegt = 0;
  for (const s of segmente) { anteile[s.quelle] += (s.e - s.s); belegt += (s.e - s.s); }
  anteile.vorlage = Math.max(0, zeichen - belegt);           // unmarkiert = Restgröße (Schätzung)
  for (const k of Object.keys(anteile) as QuellenId[]) anteile[k] = anteile[k] / zeichen;

  // Wie viel Pool-Material geht in der Wortbank-Zählung unter? Beide haben dieselbe
  // Priorität, und die Wortbank wird zuerst gesammelt — Einträge, die in beiden
  // stehen, laufen deshalb unter „Wortbank“. Das ist keine Fehlmessung, aber es
  // erklärt, warum die Pools schmal wirken. Also offenlegen statt umbuchen.
  let poolUeberschneidung = 0;
  try {
    const b = loadBank() as unknown as Record<string, string[]>;
    const bankSet = new Set<string>();
    for (const k of Object.keys(b)) if (Array.isArray(b[k])) for (const x of b[k]!) bankSet.add(x.trim().toLowerCase());
    const lt = liveTexts();
    if (lt.length) {
      let doppelt = 0;
      for (const p of lt) if (bankSet.has(p.trim().toLowerCase())) doppelt++;
      poolUeberschneidung = doppelt / lt.length;
    }
  } catch { /* egal */ }

  // Bauspur schlägt Textabgleich: In der Rekombination weiß die Engine für jeden
  // Baustein, woher er stammt. Dann ist „Vorlagen“ eine Messung statt einer
  // Restgröße — bisher hieß alles Nichtzugeordnete pauschal „Schablonen“.
  const spur = getTraceFor(text);
  if (spur.length) {
    const roh = { wortbank: 0, ton: 0, kontext: 0, pools: 0, markov: 0, vorlage: 0, nachbearbeitung: 0, dramaturgie: 0, korpus: 0 } as Record<QuellenId, number>;
    const mapQ = (q: string): QuellenId =>
      q === "vorlage" ? "vorlage" : q === "kontext" ? "kontext" : q === "markov" ? "markov" : q === "pools" ? "pools" : q === "dramaturgie" ? "dramaturgie" : q === "korpus" ? "korpus" : "wortbank";
    let summe = 0;
    for (const sch of spur) {
      const fl = (sch.fueller || []).reduce((n, f) => n + f.text.length, 0);
      const eigen = Math.max(0, sch.text.length - fl);       // Rahmen ohne seine Füllung
      roh[mapQ(sch.quelle)] += eigen; summe += eigen;
      for (const f of sch.fueller || []) { roh[mapQ(f.quelle)] += f.text.length; summe += f.text.length; }
    }
    if (summe > 0) {
      // Auch das Farbband aus der Bauspur zeichnen. Sonst zeigt es orange Ton-Abschnitte
      // aus dem Textabgleich, waehrend der Ton-Balken 0 % meldet - zwei Antworten auf
      // dieselbe Frage. Nicht wiedergefundene Bausteine bleiben unmarkiert; das ist
      // ehrlicher als sie zu raten.
      const roheSeg: Segment[] = [];
      let cursor = 0;
      const finde = (was: string, ab: number): [number, number] | null => {
        const w = was.toLowerCase().replace(/[.!?…]+$/, "").trim();
        if (w.length < 4) return null;
        const i = low.indexOf(w, ab);
        return i === -1 ? null : [i, i + w.length];
      };
      for (const sch of spur) {
        const span = finde(sch.text, cursor);
        if (!span) continue;
        const q = mapQ(sch.quelle);
        // Fuellungen liegen IM Rahmen und haben eine eigene Herkunft - der Rahmen
        // wird um sie herum aufgeteilt.
        const innen: { s: number; e: number; quelle: QuellenId }[] = [];
        for (const f of sch.fueller || []) {
          const fs = finde(f.text, span[0]);
          if (fs && fs[0] >= span[0] && fs[1] <= span[1]) innen.push({ s: fs[0], e: fs[1], quelle: mapQ(f.quelle) });
        }
        innen.sort((a, b) => a.s - b.s);
        let at = span[0];
        for (const iv of innen) {
          if (iv.s > at) roheSeg.push({ s: at, e: iv.s, quelle: q });
          roheSeg.push({ s: iv.s, e: iv.e, quelle: iv.quelle });
          at = iv.e;
        }
        if (at < span[1]) roheSeg.push({ s: at, e: span[1], quelle: q });
        cursor = span[1];
      }
      // Luecken schliessen: Was die Bauspur nicht kennt, ist nicht automatisch
      // anonym. Ton-Saetze und 4W-Angaben aus der Nachbearbeitung stehen in ihren
      // Quelllisten und lassen sich dort wiederfinden. Der Textabgleich darf also
      // ergaenzen - aber nur in den Bereichen, die kein Baustein belegt.
      const belegtVon = (a: number, b: number): boolean => roheSeg.some((x) => a < x.e && b > x.s);
      const ausLuecke = acc
        .filter((t) => !belegtVon(t.s, t.e))
        .sort((a, b) => a.s - b.s || (b.e - b.s) - (a.e - a.s) || b.prio - a.prio);
      let lEnde = -1;
      for (const t of ausLuecke) {
        if (t.s < lEnde || belegtVon(t.s, t.e)) continue;
        roheSeg.push({ s: t.s, e: t.e, quelle: t.quelle }); lEnde = t.e;
      }
      // 4W-Werte liegen IN den Bausteinen: fuelleKontext ersetzt ⟨ORT⟩, ⟨ZEIT⟩ und
      // ⟨FIGUR⟩ mitten in einer Vorlage. Ohne diese Schicht zaehlen sie zur Vorlage,
      // und "4W-Kontext" stand auf 0 %, obwohl Ort und Zeit im Text zu lesen waren.
      const w4Treffer = acc.filter((t) => t.quelle === "kontext").sort((a, b) => a.s - b.s);
      if (w4Treffer.length) {
        const zerlegt: Segment[] = [];
        for (const sg of roheSeg) {
          let at = sg.s;
          for (const t of w4Treffer) {
            if (t.s < at || t.e > sg.e) continue;
            if (t.s > at) zerlegt.push({ s: at, e: t.s, quelle: sg.quelle });
            zerlegt.push({ s: t.s, e: t.e, quelle: "kontext" });
            at = t.e;
          }
          if (at < sg.e) zerlegt.push({ s: at, e: sg.e, quelle: sg.quelle });
        }
        roheSeg.length = 0; roheSeg.push(...zerlegt);
      }
      roheSeg.sort((a, b) => a.s - b.s);
      if (roheSeg.length) { segmente.length = 0; segmente.push(...roheSeg); }
      // Ueber den ENDTEXT normieren, nicht ueber die Summe der Bausteine. Sonst faellt
      // heraus, was die Nachbearbeitung beisteuert - Ton-Saetze, Verfugung, Perspektive -
      // und der Bauplan meldete "2 Saetze aus der Nachbearbeitung", waehrend in den
      // Balken davon nichts zu sehen war.
      // Anteile ueber den ENDTEXT zaehlen, aus den zusammengefuehrten Segmenten.
      // Was unmarkiert bleibt, ist zuerst Vorlagentext, den die Nachbearbeitung
      // umgeschrieben hat (die Spur weiss, wie viel davon existiert) - erst der
      // Ueberschuss darueber hinaus ist echte Nachbearbeitung.
      const gezaehlt = { wortbank: 0, ton: 0, kontext: 0, pools: 0, markov: 0, vorlage: 0, nachbearbeitung: 0, dramaturgie: 0, korpus: 0 } as Record<QuellenId, number>;
      let markiert = 0;
      for (const sg of segmente) { gezaehlt[sg.quelle] += (sg.e - sg.s); markiert += (sg.e - sg.s); }
      const rest = Math.max(0, zeichen - markiert);
      const vorlageFehlt = Math.max(0, roh.vorlage - gezaehlt.vorlage);
      gezaehlt.vorlage += Math.min(rest, vorlageFehlt);
      gezaehlt.nachbearbeitung = Math.max(0, rest - Math.min(rest, vorlageFehlt));
      for (const k of Object.keys(gezaehlt) as QuellenId[]) anteile[k] = gezaehlt[k] / zeichen;
      return { segmente, anteile, zeichen, exakt: true, poolUeberschneidung };
    }
  }
  return { segmente, anteile, zeichen, exakt: false, poolUeberschneidung };
}

// ── Einstellungs-Schnappschuss (vom Studio bei jeder Generierung gesetzt) ──
const KEY = "dm_last_input_v1";
export interface Schnappschuss {
  preset: string; ton: string; form: string; struktur: string; perspektive: string;
  /** Rohwert des Ton-Auswahlfelds. `ton` traegt die Beschriftung fuer die Anzeige;
   *  fuer den Abgleich mit TONE_DATA wird der Schluessel gebraucht. "Duester" ist
   *  kleingeschrieben nicht "dark", der Ton fiel dadurch stillschweigend aus der Messung. */
  tonId?: string;
  rhythmus: string; markov: string; varianz: string; spannung: string;
  where: string; when: string; who: string; what: string;
  laenge: number; bestenauslese: boolean; zeit: string;
  /** Infoblasen der Erzählerbank (seit 4.337.2): welcher Bogen geladen war,
   *  seine Bauform, und bei „Rekombination mit Bogen" die Phasenfolge. */
  bogen?: string; bauform?: string; phasenfolge?: string;
}
export function saveSchnappschuss(s: Schnappschuss): void { try { localStorage.setItem(KEY, JSON.stringify(s)); } catch { /* voll */ } }
export function loadSchnappschuss(): Schnappschuss | null {
  try { const r = localStorage.getItem(KEY); return r ? (JSON.parse(r) as Schnappschuss) : null; } catch { return null; }
}
