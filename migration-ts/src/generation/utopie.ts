// Welt „Utopie" — Prosa aus einem Weltblatt (4.373.0).
//
// Fünf Abschnitte: Ankunft, Ordnung, Alltag, Kehrseite, Abschied. Ihre
// REIHENFOLGE hängt am Blickwinkel (Wer):
//
//   Gast      Ankunft · Ordnung · Alltag · Kehrseite · Abschied  (klassisch)
//   Bewohner  Alltag · Ordnung · Ankunft eines Fremden · Kehrseite · Abschied
//   Gehend    Abschied · Ordnung · Alltag · Kehrseite · Aufbruch
//
// Jeder Satz liest aus dem Weltblatt; keiner erfindet eine Zahl, einen Namen
// oder eine Regierungsform. Was im Blatt steht, steht im Text genau so — das
// prüft `pruefeUtopie()`, und der Prüfstand hält jede Prüfung mit einer
// Gegenprobe fest.
//
// Wie der Bericht läuft die Utopie NICHT durch die Nachbearbeitung: Ton-
// Einschübe und Satzauslese würden Sätze hinzufügen oder wegnehmen, die das
// Blatt nicht kennt. Der Ton wirkt stattdessen als „Blick" (hell, dunkel,
// Spott, kühl) auf Schluss und Kehrseite.
import type { GenInput } from "../types";
import { pick } from "../text-utils";
import { ziehWeltblatt, fuelle, LAGEN, type Weltblatt, type LageTyp } from "../features/weltblatt";

/** Ein Satz mit Rang: ohne Rang Pflicht, sonst wird er nach Rang (klein
 *  zuerst) ergänzt, bis die Ziellänge erreicht ist. */
interface Satz { s: string; rang?: number }
export type AbschnittId = "ankunft" | "ordnung" | "alltag" | "kehrseite" | "abschied";
interface Abschnitt { id: AbschnittId; saetze: Satz[] }

export interface UtopieErgebnis { text: string; fb: Weltblatt; folge: AbschnittId[] }

const lc = (s: string): string => (s ? s[0]!.toLowerCase() + s.slice(1) : s);
const worte = (s: string): number => (s.match(/[A-Za-zÄÖÜäöüß0-9]+/g) || []).length;

/** Antwort in direkter Rede vor „, sagte sie": Der Schlusspunkt fällt weg,
 *  Frage- und Ausrufezeichen bleiben. */
const redeVorBegleitsatz = (a: string): string => a.replace(/\.$/, "");

function frageSaetze(fb: Weltblatt): Satz[] {
  const f = fuelle(fb.grundsatz.frage.frage, fb.werte);
  const a = fuelle(fb.grundsatz.frage.antwort, fb.werte);
  const sp = fb.sprecher;
  switch (fb.erzaehler.art) {
    case "bewohner": return [{ s: `Einer von ihnen hat mich einmal gefragt, ${f}.` }, { s: `Ich habe gesagt: „${a}“` }];
    case "gehend": return [{ s: `Als Kind fragte ich ${sp.akk}, ${f}.` }, { s: `„${redeVorBegleitsatz(a)}“, sagte ${sp.pron}.` }];
    default: return [{ s: `Ich fragte ${sp.akk}, ${f}.` }, { s: `„${redeVorBegleitsatz(a)}“, sagte ${sp.pron}.` }];
  }
}

/** Der Rahmen der Zeit. Liegt die Welt in der Vergangenheit, steht er im
 *  Präteritum, sonst passt er sich der Erzählhaltung an. */
function zeitSatz(fb: Weltblatt): Satz {
  if (fb.zeit === "vergangenheit") return { s: `So war es ${fb.wann}.` };
  switch (fb.erzaehler.art) {
    case "bewohner": return { s: `Ich schreibe das ${fb.wann} auf.` };
    case "gehend": return { s: `Das alles geschieht ${fb.wann}.` };
    // Der Gast erzählt im Präteritum. Liegt die Welt in der Zukunft, ergab
    // „Das war …" Unsinn: „Das war morgen." (gefunden beim Lesen, 4.373.0).
    default: return { s: fb.zeit === "zukunft" ? `Mein Bericht spielt ${fb.wann}.` : `Das war ${fb.wann}.` };
  }
}

/** Steht der Name schon in der Ortsangabe („auf der Insel Velmar"), ergäbe
 *  „Velmar liegt auf der Insel Velmar" eine Doppelung. Dann entfällt der Satz. */
function lageSatz(fb: Weltblatt): Satz[] {
  if (fb.nameAusEingabe && fb.woAusEingabe) return [];
  return [{ s: `${fb.name} liegt ${fb.wo}.` }];
}

function selbstVorstellung(fb: Weltblatt): Satz[] {
  const e = fb.erzaehler;
  if (e.name) return [{ s: `Ich heiße ${e.name}.` }];
  if (e.rolleIchBin) return [{ s: `Ich bin ${e.rolleIchBin}.` }];
  return [];
}

function ordnung(fb: Weltblatt, mitFrage: boolean): Abschnitt {
  const g = fb.grundsatz, W = fb.werte;
  const s: Satz[] = [{ s: fb.regierung.text }];
  // Ist der Grundsatz selbst das Gesetz, stünde derselbe Satz zweimal da.
  if (!(g.id === "gesetz" && !fb.satzAusEingabe)) s.push({ s: fb.gesetz.text });
  g.ordnung.forEach((x, i) => s.push(i === 0 ? { s: fuelle(x, W) } : { s: fuelle(x, W), rang: 1 }));
  if (fb.zeit === "nachbruch") s.push({ s: "Die Alten erinnern sich an die Zeit davor; sie sprechen nicht gern darüber." });
  if (fb.zeit === "zukunft") s.push({ s: `Was vorher war, kennt man in ${fb.name} nur aus Büchern.`, rang: 3 });
  if (fb.zeit === "vergangenheit") s.push({ s: `Von der übrigen Welt weiß man in ${fb.name} wenig, und man vermisst nichts.`, rang: 3 });
  if (mitFrage) s.push(...frageSaetze(fb));
  return { id: "ordnung", saetze: s };
}

const BLICK_ALLTAG: Record<Weltblatt["blick"], string> = {
  hell: "Niemand hat es eilig, und trotzdem wird alles fertig.",
  dunkel: "Manchmal sehen alle zur selben Zeit weg.",
  spott: "Es ist alles sehr vernünftig, und man merkt es an jeder Ecke.",
  kuehl: "Ordnung herrscht, ohne dass jemand sie ausruft.",
};

function alltag(fb: Weltblatt, vorweg: Satz[] = []): Abschnitt {
  const g = fb.grundsatz, W = fb.werte;
  const s: Satz[] = [...vorweg, { s: fb.brauch.text }, { s: fb.brauch.alltag }];
  g.alltag.forEach((x, i) => s.push(i === 0 ? { s: fuelle(x, W) } : { s: fuelle(x, W), rang: 1 }));
  s.push({ s: `Das Kostbarste in ${fb.name} ist ${fb.lage.knapp}; man geht sparsam damit um und redet nicht darüber.`, rang: 2 });
  s.push({ s: BLICK_ALLTAG[fb.blick], rang: 2 });
  if (fb.gesetz.alltag) s.push({ s: fb.gesetz.alltag, rang: 3 });
  if (fb.erzaehler.art === "gast") s.push({ s: "Ich sah zu und schrieb mit.", rang: 4 });
  return { id: "alltag", saetze: s };
}

const BLICK_KEHRSEITE: Record<Weltblatt["blick"], string> = {
  hell: "Man verschweigt es nicht; man hofft nur, dass es weniger wird.",
  dunkel: "Wer danach fragt, bekommt keine Antwort, nur einen Blick.",
  spott: "Man ist in {N} sehr stolz darauf, das offen zuzugeben.",
  kuehl: "",
};

function kehrseite(fb: Weltblatt, einleitung: string, nachsatz?: string): Abschnitt {
  const W = fb.werte;
  const s: Satz[] = [{ s: einleitung }];
  fb.grundsatz.kehrseite.forEach((x, i) => s.push(i === 0 ? { s: fuelle(x, W) } : { s: fuelle(x, W), rang: 1 }));
  const b = BLICK_KEHRSEITE[fb.blick];
  if (b) s.push({ s: fuelle(b, W), rang: fb.blick === "spott" ? undefined : 2 });
  if (nachsatz) s.push({ s: nachsatz });
  return { id: "kehrseite", saetze: s };
}

// Schlüsse je Blickwinkel und Blick. Kein Schluss nennt eine Zahl.
const SCHLUSS: Record<"gast" | "bewohner" | "gehend", Record<Weltblatt["blick"], string[]>> = {
  gast: {
    hell: ["Ich weiß nicht, ob ich zurückkomme. Aber ich habe etwas dagelassen, falls jemand es braucht.",
      "Seitdem messe ich jeden Ort, an den ich komme, an {N}. Keiner hält stand, und das ist gut so."],
    dunkel: ["Als ich mich umdrehte, stand niemand mehr {ort}. Ich glaube, sie waren froh.",
      "Ich habe {N} in keine Karte eingetragen. Manche Orte sollte man nicht finden."],
    spott: ["Ich habe mir vorgenommen wiederzukommen, sobald ich etwas habe, das ich auf den Platz legen kann. Es kann dauern.",
      "Zu Hause erzählte ich von {N}, und man fragte mich zuerst, wie das Essen war."],
    kuehl: ["Ich habe aufgeschrieben, was ich gesehen habe. Was davon stimmt, mag ein anderer prüfen.",
      "Hier endet mein Bericht über {N}."],
  },
  bewohner: {
    hell: ["Ich würde nirgends anders leben wollen. Das sage ich nicht, weil man es hier sagen muss."],
    dunkel: ["Manchmal gehe ich {zumOrt} und sehe denen nach, die gehen. Dann gehe ich wieder nach Hause."],
    spott: ["Wenn er wiederkommt, werde ich ihm sagen, dass alles noch genauso ist. Das stimmt meistens."],
    kuehl: ["Mehr gibt es über {N} nicht zu sagen."],
  },
  gehend: {
    hell: ["Hinter mir wird es hell. Ich nehme nichts mit außer dem Satz, den ich nicht vergessen kann."],
    dunkel: ["Niemand ist gekommen, um mich zu verabschieden. Das gehört dazu."],
    spott: ["Draußen, sagt man, braucht man für alles einen Grund. Ich habe einen. Mal sehen, ob er dort etwas gilt."],
    kuehl: ["Mein Weg führt nach Süden. Was aus {N} wird, erfahre ich nicht mehr."],
  },
};

const GRUENDE = ["ohne es zu suchen", "weil man mir gesagt hatte, es gebe diesen Ort nicht", "weil das Wetter mich dorthin trieb"];

function bauGast(fb: Weltblatt): Abschnitt[] {
  const N = fb.name, e = fb.erzaehler;
  const karte = /karto|landvermess|geograf|geograph/i.test(e.rolle);
  const grund = karte ? "weil meine Karte dort aufhörte" : pick([...GRUENDE, "weil meine Karte dort aufhörte"]);
  const erster = e.rolle ? `Ich kam als ${e.rolle} nach ${N}, ${grund}.` : `Ich kam nach ${N}, ${grund}.`;
  const ankunft: Abschnitt = { id: "ankunft", saetze: [
    ...(e.name ? [{ s: `Ich heiße ${e.name}.` }] : []),
    { s: erster },
    ...lageSatz(fb),
    { s: `Nach ${fb.tage} Tagen ${fb.lage.weg} sah ich es zum ersten Mal.`, rang: 2 },
    { s: `${fb.lage.ankunft} fragte niemand nach meinem Namen.` },
    { s: `Man gab mir Wasser und ein Bett und sagte mir als Erstes den Satz, auf dem ${N} gebaut ist: „${fb.satz}“` },
    zeitSatz(fb),
  ] };
  const abend = pick(["Am vierten Abend", "Am letzten Abend vor meiner Abreise", "Am dritten Abend"]);
  const abschied: Abschnitt = { id: "abschied", saetze: [
    { s: karte ? `Ich zeichnete ${N} in meine Karte, mit einem dünnen Strich.` : `Am Morgen meiner Abreise war ${N} still wie am ersten Tag.` },
    { s: fuelle(pick(SCHLUSS.gast[fb.blick]), fb.werte) },
  ] };
  return [ankunft, ordnung(fb, true), alltag(fb),
    kehrseite(fb, `${abend} erzählte mir jemand von dem, worüber man in ${N} nicht gern spricht.`), abschied];
}

function bauBewohner(fb: Weltblatt): Abschnitt[] {
  const N = fb.name;
  const vorweg: Satz[] = [
    { s: `Ich lebe in ${N}, seit ich denken kann.` },
    ...selbstVorstellung(fb),
    ...lageSatz(fb),
    { s: `Bei uns gilt ein Satz, den jedes Kind kennt: „${fb.satz}“` },
    zeitSatz(fb),
  ];
  const ankunft: Abschnitt = { id: "ankunft", saetze: [
    { s: `Manchmal kommt ein Fremder nach ${N}.` },
    { s: `Nach ${fb.tage} Tagen ${fb.lage.weg} sind die meisten müde.`, rang: 2 },
    { s: `${fb.lage.ankunft} fragt ihn niemand nach seinem Namen, nur, ob er müde ist.` },
    ...frageSaetze(fb),
  ] };
  const abschied: Abschnitt = { id: "abschied", saetze: [
    { s: "Der Fremde ist längst weitergezogen. Ich bin geblieben, wie fast alle." },
    { s: fuelle(pick(SCHLUSS.bewohner[fb.blick]), fb.werte) },
  ] };
  return [alltag(fb, vorweg), ordnung(fb, false), ankunft,
    kehrseite(fb, "Es gibt etwas, worüber wir nicht gern sprechen."), abschied];
}

function bauGehend(fb: Weltblatt): Abschnitt[] {
  const N = fb.name;
  const anfang: Abschnitt = { id: "abschied", saetze: [
    { s: `Ich stehe ${lc(fb.lage.ankunft)} und warte.` },
    { s: `Morgen bin ich nicht mehr in ${N}.` },
    ...selbstVorstellung(fb),
    ...lageSatz(fb),
    { s: `Ich bin hier aufgewachsen, mit dem Satz, den jedes Kind kennt: „${fb.satz}“` },
    zeitSatz(fb),
  ] };
  const aufbruch: Abschnitt = { id: "ankunft", saetze: [
    { s: fuelle(pick(SCHLUSS.gehend[fb.blick]), fb.werte) },
  ] };
  return [anfang, ordnung(fb, true), alltag(fb, [{ s: "Ich werde vieles vermissen." }]),
    kehrseite(fb, `Und dann ist da das, worüber man in ${N} nicht gern spricht.`, "Ich gehe, weil ich diesen Preis nicht länger zahlen will."),
    aufbruch];
}

/** Ergänzt Rang-Sätze, bis die Ziellänge erreicht ist. Pflichtsätze bleiben
 *  immer — eine Utopie ohne Kehrseite wäre kürzer, aber keine mehr. */
function setze(abschnitte: Abschnitt[], ziel: number): string {
  const an = new Set<Satz>();
  for (const a of abschnitte) for (const x of a.saetze) if (x.rang === undefined) an.add(x);
  const zaehle = (): number => abschnitte.reduce((n, a) => n + a.saetze.filter((x) => an.has(x)).reduce((m, x) => m + worte(x.s), 0), 0);
  const kandidaten = abschnitte.flatMap((a) => a.saetze.filter((x) => x.rang !== undefined)).sort((p, q) => p.rang! - q.rang!);
  for (const k of kandidaten) { if (zaehle() >= ziel) break; an.add(k); }
  return abschnitte
    .map((a) => a.saetze.filter((x) => an.has(x) && x.s.trim()).map((x) => x.s.trim()).join(" "))
    .filter(Boolean).join("\n\n");
}

export function buildUtopie(input: GenInput): UtopieErgebnis {
  const fb = ziehWeltblatt(input);
  const abschnitte = fb.erzaehler.art === "bewohner" ? bauBewohner(fb)
    : fb.erzaehler.art === "gehend" ? bauGehend(fb) : bauGast(fb);
  const ziel = Number.isFinite(input.lenTarget as number) ? (input.lenTarget as number) : 110;
  return { text: setze(abschnitte, ziel), fb, folge: abschnitte.map((a) => a.id) };
}

// ── Prüfung ─────────────────────────────────────────────────────────────────

// Wortgrenzen ausdrücklich über Buchstaben, nicht über \b: Für \b ist „ß" kein
// Wortzeichen, und „Dreißig" wurde als „drei" gelesen (gefunden beim ersten
// Lauf, 4.373.0). Längere Zahlwörter stehen vorn, damit „zweihundert" nicht
// als „zwei" endet.
const ZAHLWORT = /(?<![\p{L}\d])(einundzwanzig|zweihundert|dreizehn|vierzehn|fünfzehn|sechzehn|siebzehn|achtzehn|neunzehn|dreißig|vierzig|fünfzig|sechzig|zwanzig|hundert|tausend|zwölf|zwei|drei|vier|fünf|sechs|sieben|acht|neun|zehn|elf|\d+)(?![\p{L}\d])/giu;

const zahlenIn = (s: string): string[] => (s.match(ZAHLWORT) || []).map((z) => z.toLowerCase());

/** Prüft einen Utopie-Text gegen sein Blatt. Leere Liste = ohne Befund.
 *  `eingabe` sind die rohen vier W: Was der Nutzer selbst schreibt, darf im
 *  Text stehen, auch wenn es eine Lage-Marke oder eine Zahl ist. */
export function pruefeUtopie(text: string, fb: Weltblatt, eingabe = ""): string[] {
  const b: string[] = [];
  if (/[{}]|\bundefined\b|\bnull\b|\bNaN\b/.test(text)) b.push("Platzhalter oder Leerwert im Text");
  if ((text.match(new RegExp(`(?<!\\p{L})${fb.name}(?!\\p{L})`, "gu")) || []).length < 2) b.push(`Name „${fb.name}" seltener als zweimal`);
  if (!text.includes(`„${fb.satz}“`)) b.push("Grundsatz nicht wörtlich zitiert");
  // Zahlen: nur, was das Blatt gezogen hat oder der Nutzer geschrieben hat.
  const erlaubt = new Set([...fb.zahlen, ...zahlenIn(fb.wann), ...zahlenIn(fb.wo), ...zahlenIn(fb.satz), ...zahlenIn(eingabe)].map((z) => z.toLowerCase()));
  const fremd = [...new Set(zahlenIn(text).filter((z) => !erlaubt.has(z)))];
  if (fremd.length) b.push(`Zahl nicht im Blatt: ${fremd.join(", ")}`);
  // Regierung: Jeder „Rat der …" muss der gezogene sein.
  for (const m of text.matchAll(/\bRat der (\S+?)[.,;:\s]/g)) {
    if (!fb.regierung.text.includes(`Rat der ${m[1]}`)) b.push(`Rat der ${m[1]} steht nicht im Blatt`);
  }
  if (!text.includes(fuelle(fb.grundsatz.kehrseite[0]!, fb.werte))) b.push("Kehrseite der Prämisse fehlt");
  if (!text.includes(fb.brauch.text)) b.push("Brauch fehlt");
  // Vorrang des Wo: Marken anderer Lagen dürfen nicht stehen.
  for (const [t, d] of Object.entries(LAGEN) as [LageTyp, typeof LAGEN[LageTyp]][]) {
    if (t === fb.lageTyp || !d.marken) continue;
    if (d.marken.test(text) && !d.marken.test(eingabe) && !d.marken.test(fb.wo)) b.push(`Marke der Lage „${t}" in einem Text der Lage „${fb.lageTyp}"`);
  }
  // Satzbau, zählbar.
  if (/ {2}|\s[,.;:!?]/.test(text)) b.push("Leerzeichen vor Satzzeichen oder doppelt");
  const dw = text.match(/(?<!\p{L})(\p{L}+) \1(?!\p{L})/iu);
  if (dw) b.push(`Doppeltes Wort: „${dw[0]}"`);
  if (/[.!?]\s+[a-zäöü]/.test(text.replace(/„[^“]*“/g, "„…“"))) b.push("Satzanfang klein");
  if (/\.\.|\.“\./.test(text)) b.push("Doppelter Punkt");
  // Muster aus dem Lesen (4.373.0) — jeder gefundene Fehler wird ein Muster.
  if (/Das war (morgen|übermorgen|bald|eines Tages|im Jahr (2[1-9]|[3-9])\d\d)/.test(text)) b.push("Präteritum mit Zukunftszeit („Das war morgen“)");
  if (/\bam Tor\b/.test(text) && fb.lage.ankunft !== "Am Tor" && !/\bam Tor\b/.test(fb.wo)) b.push("Schluss am Tor, Ankunft woanders");
  if (/„Niemand regiert[.;]/.test(text) && /Regiert wird/.test(text)) b.push("„Niemand regiert“ und „Regiert wird“ im selben Text");
  // Blickwinkel: Der erste Absatz verrät, wer erzählt.
  const erster = text.split("\n\n")[0] || "";
  const soll = { gast: /^(Ich heiße \S+ )?Ich kam\b/, bewohner: /^Ich lebe\b/, gehend: /^Ich stehe\b/ }[fb.erzaehler.art];
  if (!soll.test(erster)) b.push(`Erster Absatz passt nicht zum Blickwinkel „${fb.erzaehler.art}"`);
  if (text.split("\n\n").length !== 5) b.push("Nicht fünf Abschnitte");
  return b;
}
