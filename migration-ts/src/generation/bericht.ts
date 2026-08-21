// Form „Bericht" — Gerüstschema „Zeitungsbericht" (Pilot).
//
// Der Bericht ist die erste Form, die NICHT aus dem Vorrat erzählt, sondern aus
// einem Faktenblatt referiert. Der Unterschied ist grundsätzlich: Die anderen
// Formen dürfen sich widersprechen, ein Bericht nicht.
//
// Prinzip: umgekehrte Pyramide. Erst das Wichtigste (Vorspann), dann der
// Hergang, dann Zitat, Hintergrund und Ausblick.

import type { Bank, GenInput } from "../types";
import { pick } from "../text-utils";
import { cap } from "./beats";
import { hatFinitesVerb } from "../atoms/derive";
import { isFirstPerson, isSecondPerson } from "./coherence";

import { ziehFaktenblatt, erlaubteZahlen, ALLE_NAMEN, ROLLE_LABEL, type Faktenblatt, type FbPerson, type FbZahl } from "../features/faktenblatt";
import { buildVersAtome } from "../atoms/rekombination";
import { RESSORTS, type RessortId } from "../features/ressorts";

/** Blickrichtung des Berichts. Der Ton bestimmt sie: "Hoffnungsvoll",
 *  "Humorvoll" und "Zärtlich" melden Gewinn, alles andere meldet Verlust oder
 *  bleibt sachlich. Ohne diese Unterscheidung stand in jedem Blatt "betroffen
 *  sind", "auf dem Spiel steht", "die erste Meldung" - Wörter, die die Richtung
 *  vorgeben, gleich wie der Ton eingestellt war. */
export type Blick = "gut" | "sachlich";
const GUTE_TOENE = new Set(["uplifting", "humorous", "zaertlich"]);
export const blickVonTon = (ton: string): Blick =>
  GUTE_TOENE.has((ton || "").toLowerCase()) ? "gut" : "sachlich";

/** Wortwahl je Blickrichtung. Eine Tabelle statt verstreuter Bedingungen: So
 *  laesst sich nachlesen, worin sich die beiden Fassungen unterscheiden. */
const WORTE = {
  sachlich: {
    vorspann: (n: string) => `wurde, dass ${n} betroffen sind`,
    ersteMeldung: "die erste Meldung",
    // Das Bezugswort steckt im Satz: "der Schritt, ueber DEN". Als ich nur das
    // Nomen austauschte, stand "folgte der Schritt, ueber die ...".
    schritt: (wer: string) => `folgte der Schritt, über den ${wer} nun informiert`,
    haelfte: (l: string, w: string) => `Betroffen ist damit ${l} — ${w}.`,
    einsatz: (mehr: boolean, x: string) => `Auf dem Spiel ${mehr ? "stehen" : "steht"} ${x}.`,
    weitere: (x: string) => `Betroffen sind außerdem ${x}.`,
  },
  gut: {
    vorspann: (n: string) => `wurde, dass ${n} hinzukommen`,
    ersteMeldung: "die erste Zusage",
    schritt: (wer: string) => `folgte die Entscheidung, über die ${wer} nun informiert`,
    haelfte: (l: string, w: string) => `${cap(l)} — ${w} — entsteht im ersten Jahr.`,
    einsatz: (mehr: boolean, x: string) => `In Aussicht ${mehr ? "stehen" : "steht"} ${x}.`,
    weitere: (x: string) => `Profitieren werden außerdem ${x}.`,
  },
} as const;

/** Erst- und Zweitnennung: Wer schon eingeführt ist, wird nur noch kurz genannt. */
class Buchfuehrung {
  private drin = new Set<string>();
  person(p: FbPerson): string {
    if (this.drin.has(p.id)) return p.kurz;
    this.drin.add(p.id);
    return `${p.rolle} ${p.name}`;
  }
  eingefuehrt(p: FbPerson): boolean { return this.drin.has(p.id); }
  organisation(fb: Faktenblatt): string {
    if (this.drin.has("wer")) return fb.wer.kurz;
    this.drin.add("wer");
    return fb.wer.haupt;
  }
}

// Der Bericht hat einen eigenen Einsatz - den des Ressorts. Die literarische
// Formel des Presets daneben ergibt zwei Bedeutungen desselben Wortes in einem
// Text: "Der Einsatz ist Identität: Sie wechselt die Masken" direkt neben "Auf
// dem Spiel steht der Standort".
const EINSATZ_FORMEL = /^(Der Einsatz ist|Es geht um|Auf dem Spiel steht|Alles dreht sich um|Was zählt, ist|Am Ende bleibt nur|Verlieren hieße)\b/i;

// Ausgeschriebene Zahlen. Die Zahlenpruefung sah nur Ziffern - "ein Bündel aus
// sieben Rabenfedern" stand deshalb ungerueegt im Bericht, eine Menge, die in
// keinem Faktenblatt steht. "ein" und "eine" bleiben draussen: Das sind
// meistens Artikel, keine Zahlwoerter.
const ZAHLWORT = /(?<![a-zäöüß])(zwei|drei|vier|fünf|sechs|sieben|acht|neun|zehn|elf|zwölf|dreizehn|vierzehn|fünfzehn|sechzehn|siebzehn|achtzehn|neunzehn|zwanzig|dreißig|vierzig|fünfzig|hundert|tausend|dutzend|hunderte|tausende|dutzende)(?![a-zäöüß])/i;

/** Ein Satz aus dem Vorrat, der keine Ziffer enthält — Zahlen kommen NUR aus
 *  dem Faktenblatt, sonst bricht die Konsistenzprüfung. */
/** Der Schlüssel, unter dem ein Satz als „schon benutzt" gilt.
 *
 *  Vorher wurde der ROHE Eintrag gemerkt, gedruckt aber der um Satzzeichen
 *  gekürzte. Zwei Einträge, die sich nur im Schlusspunkt unterscheiden, kamen
 *  damit beide durch — im Blatt stand „Jemand hat an etwas gedacht. Jemand hat
 *  an etwas gedacht." unmittelbar hintereinander. */
function satzSchluessel(s: string): string {
  return (s || "").toLowerCase().replace(/[.!?…,;:]+/g, "").replace(/\s+/g, " ").trim();
}

/** Ein Bericht referiert in der dritten Person. Im Blatt standen mitten im
 *  Hergang Sätze wie „Ich sehne mich nach einem klaren Ufer" und „Ich bin müde
 *  vom grenzenlosen Blau" — aus dem Preset-Vorrat, der für Prosa gedacht ist.
 *  Sie sind kein Widerspruch zu den Fakten, aber ein Perspektivbruch, und sie
 *  machen den Hergang unlesbar. */
const istIchOderDu = (s: string): boolean => isFirstPerson(s) || isSecondPerson(s);

function satzOhneZahl(bank: Bank, kats: (keyof Bank)[], benutzt: Set<string>, zusatz: string[] = []): string | null {
  const kandidaten: string[] = [];
  for (const k of kats) for (const x of bank[k] || []) {
    if (/\d/.test(x) || ZAHLWORT.test(x) || EINSATZ_FORMEL.test(x) || istIchOderDu(x)) continue;
    if (benutzt.has(satzSchluessel(x))) continue;
    kandidaten.push(x);
  }
  // Zusatzvorrat aus den Atomen: Zehn Eintraege je Kategorie reichen fuer einen
  // kurzen Bericht, nicht fuer einen langen - bei Ziel 400 blieb es sonst bei
  // 66 Prozent der Marke, weil kein Satz mehr uebrig war.
  for (const x of zusatz) {
    if (/\d/.test(x) || ZAHLWORT.test(x) || EINSATZ_FORMEL.test(x) || istIchOderDu(x) || benutzt.has(satzSchluessel(x))) continue;
    kandidaten.push(x);
  }
  if (!kandidaten.length) return null;
  const s = pick(kandidaten);
  benutzt.add(satzSchluessel(s));
  return s.replace(/[.!?…]+$/, "");
}

function schlagzeile(fb: Faktenblatt): string {
  // Ohne Artikel am Anfang, ohne Zahl — Zeitungskonvention und zugleich die
  // Regel, an der sich die Prüfung festmacht.
  const wer = fb.wer.haupt.replace(/^(der|die|das)\s+/i, "");
  return cap(`${wer} ${fb.was}`);
}

function dachzeile(fb: Faktenblatt): string {
  // Vorher stand hier fest "Wirtschaft", weil `art` beim Ziehen immer auf
  // "organisation" gesetzt wurde: Es gab genau eine Zeitungsseite.
  return `${fb.wo.ort} · ${RESSORTS[fb.ressort].label}`;
}

/** Der Vorspann.
 *
 *  Er darf die Schlagzeile NICHT wörtlich wiederholen. Vorher lautete beides
 *  „Ein Schulmädchen gibt die Spur bewusst auf" — der Setzer erkennt die
 *  Dublette und streicht sie, und übrig blieb ein Bericht, der mit einer
 *  Passivkonstruktion ohne Subjekt beginnt: „Während der Mittagspause wurde
 *  bekannt, dass rund 1.300 Haushalte betroffen sind." Wer? Stand nur noch in
 *  der Überschrift.
 *
 *  Deshalb trägt der erste Satz jetzt Ort UND Zeit — das ist ohnehin der
 *  Nachrichtenvorspann — und der zweite beginnt mit dem Partizip, damit die
 *  Zeitangabe nicht zweimal vorn steht. */
function vorspann(fb: Faktenblatt, b: Buchfuehrung, blick: Blick): string {
  const z = fb.zahlen[0];
  const w = WORTE[blick];
  // Zeit voran, Doppelpunkt, dann die Tatsache. Der Ort steht schon in der
  // Dachzeile („HÜRTGENWALD · GESELLSCHAFT") und käme hier ein zweites Mal.
  const s1 = `${cap(fb.wann.datum)}: ${cap(b.organisation(fb))} ${fb.was}.`;
  const s2 = z
    ? `Bekannt ${w.vorspann(`${z.verbal || z.wortform} ${z.einheit}`)}.`
    : `Bekannt wurde es erst später.`;
  return `${s1} ${s2}`;
}

function hergang(fb: Faktenblatt, bank: Bank, b: Buchfuehrung, benutzt: Set<string>, extra: number, vorrat: string[], blick: Blick): string {
  const teile: string[] = [];
  const w = WORTE[blick];
  const c2 = fb.chronologie[1], c3 = fb.chronologie[2];
  if (c2) {
    // Drei Fassungen statt einer. „Im Frühjahr zeichnete sich die erste Meldung
    // ab" stand wörtlich in jedem Bericht — bei acht Beiträgen viermal auf
    // derselben Seite.
    const was2 = blick === "gut" ? w.ersteMeldung : c2.was;
    const fassungen = [
      `${cap(c2.zeit)} zeichnete sich ${was2} ab.`,
      `${cap(c2.zeit)} gab es ${was2}.`,
      // Ohne Präposition: „mit der erste Anfrage" war der erste Versuch — der
      // Artikel wurde gebeugt, das Adjektiv nicht. Ein Doppelpunkt braucht
      // keinen Kasus.
      `Angefangen hatte es ${c2.zeit}: ${was2}.`,
    ];
    teile.push(pick(fassungen));
  }
  for (let i = 0; i < 1 + extra; i++) {
    const roh = satzOhneZahl(bank, ["obstacles", "turns"], benutzt, vorrat);
    if (roh) teile.push(`${cap(roh)}.`);
  }
  const z2 = fb.zahlen[1];
  if (z2) teile.push(zahlSatz(z2));
  if (c3) teile.push(`${cap(c3.zeit)} ${w.schritt(b.organisation(fb))}.`);
  const a1 = fb.abgeleitet[0];
  if (a1) teile.push(w.haelfte(a1.label, a1.wortform));
  // Was außerdem betroffen ist, sagt das Ressort. Ohne das stand in einem
  // Sportbericht "1.700 Haushalte betroffen" - eine Groesse, die mit dem
  // Ereignis nichts zu tun hatte.
  // Was auf dem Spiel steht - der Abschnitt, den ein Bericht braucht und der
  // bisher fehlte. Frueher lieferte das Preset seine literarischen Einsaetze,
  // und in einem Wirtschaftsbericht stand "Der Einsatz ist Freiheit".
  const R0 = RESSORTS[fb.ressort];
  const eins = blick === "gut" ? R0.gewinn : R0.einsatz;
  if (eins.length) {
    const zwei = reihenfolge(eins).slice(0, 1 + Math.min(1, Math.floor(extra / 4)));
    // Plural, sobald MEHRERE Teile genannt werden oder EIN Teil selbst Plural
    // ist. Die blosse Zahl der Teile reichte nicht: "Auf dem Spiel steht die
    // Ausbildungsplätze".
    const mehr = zwei.length > 1 || zwei.some((x) => x.pl);
    teile.push(w.einsatz(mehr, aufzaehlung(zwei.map((x) => x.t))));
  }
  const bt = RESSORTS[fb.ressort].betroffen;
  if (bt.length >= 3) {
    // Nicht wiederholen, was schon als Zahl dasteht: "14.800 Dauerkarten
    // betroffen ... Betroffen sind ausserdem die Dauerkarten".
    const schon = fb.zahlen.map((z) => z.einheit.toLowerCase());
    const frei = bt.filter((x) => !schon.some((e) => x.toLowerCase().includes(e)));
    const aus = reihenfolge(frei.length >= 2 ? frei : bt).slice(0, 2 + Math.min(2, Math.floor(extra / 3)));
    teile.push(w.weitere(aufzaehlung(aus)));
  }
  return teile.join(" ");
}

function zitat(fb: Faktenblatt, bank: Bank, b: Buchfuehrung, benutzt: Set<string>, welche: number, vorrat: string[]): string {
  const p = fb.personen[welche];
  if (!p || !p.zitierfaehig) return "";
  const kern = satzOhneZahl(bank, ["hooks", "stakes"], benutzt, vorrat) || "Wir haben lange gewartet";
  return `„${cap(kern)}“, sagte ${b.person(p)}.`;
}

function hintergrund(fb: Faktenblatt, bank: Bank, b: Buchfuehrung, benutzt: Set<string>, extra: number, vorrat: string[]): string {
  const teile: string[] = [];
  const c1 = fb.chronologie[0];
  // Eine Person "besteht" nicht seit 1988. Im Beispiel stand "Der Kraus besteht
  // seit 1988", weil `art` fest auf "organisation" stand.
  const RK = RESSORTS[fb.ressort].hintergrundKopf;
  if (c1) teile.push(RK ? RK(b.organisation(fb), c1.zeit)
    : fb.wer.art === "person"
      ? `${cap(b.organisation(fb))} ist seit ${c1.zeit} dabei.`
      : `${cap(b.organisation(fb))} besteht seit ${c1.zeit}.`);
  // Rahmen nur fuer Nominalphrasen. Der Vorrat aus Atomen liefert auch ganze
  // Saetze, und "Geblieben ist die Zuständigkeit ist unklar" hat zwei finite
  // Verben. Jeder Rahmen zudem hoechstens einmal - beim Reihum-Zaehlen stand
  // "Im Ort verbindet man damit" zweimal im selben Absatz.
  const rahmen = ["Im Ort verbindet man damit", "Erinnert wird an", "Geblieben ist"];
  let r = 0;
  for (let i = 0; i < 1 + extra; i++) {
    const roh = satzOhneZahl(bank, ["motifs", "props"], benutzt, vorrat);
    if (!roh) continue;
    if (!hatFinitesVerb(roh) && r < rahmen.length) teile.push(`${rahmen[r++]} ${roh}.`);
    else teile.push(`${cap(roh)}.`);
  }
  const z3 = fb.zahlen[2];
  if (z3) teile.push(zahlSatz(z3));
  return teile.join(" ");
}

function ausblick(fb: Faktenblatt, blick: Blick): string {
  // Kein neuer Fakt — nur eine offene Frage oder ein Termin. Deshalb greift der
  // Abschnitt ausschliesslich auf bereits Genanntes zurueck.
  const R = RESSORTS[fb.ressort];
  return blick === "gut"
    ? pick([...R.ausblickGut, `Wie es ${fb.wo.mitPraep} weitergeht, wird sich zeigen.`])
    : pick([...R.ausblick,
      `Wie es ${fb.wo.mitPraep} weitergeht, ist offen.`,
      `Ob der Schritt zurückgenommen wird, blieb ${fb.wann.relativ} unbeantwortet.`]);
}

/** Satz zu einer Zahl, passend zu ihrer Rolle. Eine Zahl ohne Rolle bekam vorher
 *  einen beliebigen Rahmen — daher "Zuletzt waren es 9 Stunden", ein Satz, der
 *  nichts behauptete. */
function zahlSatz(z: FbZahl): string {
  const n = `${z.wortform} ${z.einheit}`;
  switch (z.rolle) {
    case "betroffene": return `Betroffen sind ${n}.`;
    case "sache": return pick([`Zuletzt waren es ${n} im Jahr.`, `Es geht um ${n}.`, `${cap(n)} standen zuletzt in den Büchern.`]);
    case "dauer": return `${cap(n)} dauerte es.`;   // ressortneutral: "stand der Betrieb still" passte nur zur Wirtschaft
    case "groesse": return `Gemessen wurden ${n}.`;
    case "vorgaenge": return `${cap(n)} liegen inzwischen vor.`;
    case "geld": return `Es geht um ${n}.`;
    default: return `${cap(n)}.`;
  }
}

/** Deutsche Aufzaehlung: Komma, Komma, "und". */
function aufzaehlung(xs: string[]): string {
  if (xs.length <= 1) return xs[0] || "";
  return xs.slice(0, -1).join(", ") + " und " + xs[xs.length - 1];
}

/** Zufaellige Reihenfolge, ohne die Vorlage zu veraendern. */
function reihenfolge<T>(a: T[]): T[] {
  const x = a.slice();
  for (let i = x.length - 1; i > 0; i--) { const j = Math.floor(Math.random() * (i + 1)); [x[i], x[j]] = [x[j]!, x[i]!]; }
  return x;
}

export interface BerichtErgebnis { text: string; fb: Faktenblatt; hergang: string; }

export function buildBericht(bank: Bank, input: GenInput, ressort: RessortId | "auto" = "auto"): BerichtErgebnis {
  const fb = ziehFaktenblatt(input, ressort);
  const b = new Buchfuehrung();
  const benutzt = new Set<string>();
  // Laengenregler: Das Geruest steht fest, die Zahl der erzaehlenden Saetze nicht.
  // Ein Bericht ohne Zusatz traegt rund 124 Woerter. Der Faktor ist gemessen und
  // nicht geschaetzt: Eine Zusatzrunde bringt ueber alle Presets rund 15 Woerter
  // - mit dem ersten Schaetzwert 26 blieb die Marke bei 78 Prozent, mit 15 lag sie
  // rund zehn Prozent darueber. 17 trifft.
  const ziel = Number.isFinite(input.lenTarget as number) ? (input.lenTarget as number) : 240;
  const extra = Math.max(0, Math.min(22, Math.round((ziel - 124) / 17)));
  // Kopf-Atome wie "⟨FIGUR⟩ begreift:" verlieren beim Abschneiden des Doppelpunkts
  // ihren Rumpf und ergeben "Ritter Ltd stellt fest." - ein Satz ohne Aussage.
  // Fuenf Woerter als Untergrenze nehmen sie heraus; bei vier rutschte die
  // zweiteilige Form ("stellt fest", "nimmt wahr") noch durch.
  const vorrat = buildVersAtome(bank, input).filter((x) => x.split(/\s+/).length >= 5);
  const blick = blickVonTon(input.tone || "");

  const abschnitte: string[] = [];
  abschnitte.push(dachzeile(fb));
  const zeile = schlagzeile(fb);
  // Die Schlagzeile ist verbraucht: Ihr Wortlaut steckt auch im Atomvorrat
  // (er stammt aus „Was passiert?"), und im Blatt stand „Ein Schulmädchen gibt
  // die Spur bewusst auf" ein zweites Mal mitten im Hergang.
  benutzt.add(satzSchluessel(zeile));
  benutzt.add(satzSchluessel(fb.was));
  abschnitte.push(zeile);
  abschnitte.push(vorspann(fb, b, blick));
  const hergangText = hergang(fb, bank, b, benutzt, extra, vorrat, blick);
  abschnitte.push(hergangText);
  const z1 = zitat(fb, bank, b, benutzt, 0, vorrat);
  if (z1) abschnitte.push(z1);
  abschnitte.push(hintergrund(fb, bank, b, benutzt, extra, vorrat));
  const z2 = zitat(fb, bank, b, benutzt, 1, vorrat);
  if (z2) abschnitte.push(z2);
  // Einordnung ist im Schema optional - sie kommt dazu, wenn Platz da ist, und
  // bringt laut Regel KEINE neue Zahl.
  if (extra >= 3) {
    const teile: string[] = [];
    for (let i = 0; i < extra - 2; i++) {
      const roh = satzOhneZahl(bank, ["turns", "obstacles", "motifs"], benutzt, vorrat);
      if (roh) teile.push(`${cap(roh)}.`);
    }
    if (teile.length) abschnitte.push(`Zur Einordnung: ${teile.join(" ")}`);
  }
  // Zusatzabschnitt des Ressorts - die einzige Abweichung vom Grundgeruest.
  {
    const R = RESSORTS[fb.ressort];
    const teile: string[] = [];
    for (let i = 0; i < Math.min(R.zusatz.rahmen.length, 1 + Math.floor(extra / 3)); i++) {
      const roh = satzOhneZahl(bank, ["hooks", "turns", "stakes"], benutzt, vorrat);
      if (roh) teile.push(`${R.zusatz.rahmen[i]} ${roh}.`);
    }
    if (teile.length) abschnitte.push(`${R.zusatz.titel}: ${teile.join(" ")}`);
  }
  abschnitte.push(ausblick(fb, blick));

  const kasten = [
    `Faktenkasten`,
    // Auch die Beschriftung dreht sich: "Betroffen: 480 Beschaeftigte" unter
    // einer guten Nachricht liest sich wie ein Widerspruch.
    ...fb.zahlen.map((z) => `· ${z.rolle === "betroffene" && blick === "gut" ? "Neu" : ROLLE_LABEL[z.rolle]}: ${z.wortform} ${z.einheit}`),
    ...fb.chronologie.map((c) => `· ${c.zeit}: ${c.was}`),
  ].join("\n");

  return { text: abschnitte.filter(Boolean).join("\n\n") + "\n\n" + kasten, fb, hergang: hergangText };
}

// ── Konsistenzprüfung (offline, nach dem Rendern) ─────────────────────────
// Vier billige Prüfungen, die den Löwenanteil der typischen Berichtsfehler
// abfangen. Sie prüfen das ERGEBNIS, nicht die Absicht — ein Bericht, der sie
// besteht, kann immer noch langweilig sein, aber er widerspricht sich nicht.

export interface BerichtMangel { art: string; stelle: string; }

export function pruefeBericht(text: string, fb: Faktenblatt, hergang = ""): BerichtMangel[] {
  const m: BerichtMangel[] = [];
  const erlaubtZ = new Set(erlaubteZahlen(fb));

  // 1. Jede Ziffernfolge muss aus dem Faktenblatt stammen.
  // Satzzeichen abschneiden: "210." ist die Zahl 210 am Satzende, nicht eine
  // unbekannte Zahl "210.". Der erste Versuch meldete 408 solcher Scheinfunde.
  for (const roh of text.match(/\d[\d.,]*/g) || []) {
    const z = roh.replace(/[.,]+$/, "");
    if (!erlaubtZ.has(z)) m.push({ art: "Zahl ohne Faktenblatt", stelle: z });
  }

  // 1b. Auch ausgeschriebene Zahlen muessen aus dem Faktenblatt stammen.
  const fbText = JSON.stringify(fb).toLowerCase();
  for (const w of text.match(new RegExp(ZAHLWORT.source, "gi")) || []) {
    if (!fbText.includes(w.toLowerCase())) m.push({ art: "Zahlwort ohne Faktenblatt", stelle: w });
  }

  // 2. Kein fremder PERSONENNAME. Nicht "jeder Eigenname": properNames haelt im
  //    Deutschen zwangslaeufig auch Gattungsnamen fuer Namen - der erste Versuch
  //    meldete 1856 Funde, darunter "Wirtschaft". Geprueft wird deshalb gegen den
  //    Ziehvorrat: Steht ein Name aus dem Vorrat im Text, der nicht im
  //    Faktenblatt dieses Berichts vorkommt, ist er hereingerutscht.
  const drin = new Set([
    ...fb.personen.flatMap((p) => [p.kurz.toLowerCase(), ...p.name.toLowerCase().split(/\s+/)]),
    // Der Name aus "Wer?" gehoert dazu: "Reinhard Kraus" wurde als fremd
    // gemeldet, weil "Reinhard" auch im Ziehvorrat steht.
    ...fb.wer.haupt.toLowerCase().split(/\s+/),
    fb.wer.kurz.toLowerCase(),
  ]);
  for (const name of ALLE_NAMEN) {
    if (drin.has(name.toLowerCase())) continue;
    if (new RegExp("(?<![A-Za-zÄÖÜäöüß])" + name + "(?![A-Za-zÄÖÜäöüß])").test(text)) {
      m.push({ art: "fremder Personenname", stelle: name });
    }
  }

  // 3. Jedes Zitat braucht einen Sprecher, der zitierfähig UND eingeführt ist.
  const zitate = text.match(/„[^“]*“,\s*sagte\s+([^.]+)\./g) || [];
  for (const z of zitate) {
    const wer = (z.match(/sagte\s+([^.]+)\./) || [])[1] || "";
    const p = fb.personen.find((x) => wer.includes(x.kurz) || wer.includes(x.name));
    if (!p) m.push({ art: "Zitat ohne bekannten Sprecher", stelle: wer.trim() });
    else if (!p.zitierfaehig) m.push({ art: "Sprecher nicht zitierfähig", stelle: p.name });
  }

  // 4. Chronologie monoton — aber NUR im Hergang. Über den ganzen Bericht wäre
  //    die Prüfung falsch gedacht: Die umgekehrte Pyramide nennt das jüngste
  //    Ereignis zuerst (Vorspann) und geht im Hintergrund bis zur Gründung
  //    zurück. Genau das ist die Form, kein Fehler. Erzählt wird der Reihe nach
  //    allein im Hergang, und dort gilt die Monotonie.
  // 4a. Jahreszahlen der Chronologie muessen aufsteigen. Die Pruefung unten
  //     vergleicht Textpositionen; ob 1971 nach 1855 liegt, sieht sie nicht.
  const jahre = fb.chronologie
    .map((c) => ({ id: c.id, jahr: Number((c.zeit.match(/\b(1[0-9]{3}|2[0-9]{3})\b/) || [])[1]) }))
    .filter((x) => Number.isFinite(x.jahr));
  for (let i = 1; i < jahre.length; i++) {
    if (jahre[i]!.jahr < jahre[i - 1]!.jahr) {
      m.push({ art: "Jahreszahlen der Chronologie verdreht", stelle: `${jahre[i - 1]!.jahr} vor ${jahre[i]!.jahr}` });
      break;
    }
  }

  if (hergang) {
    // Klein vergleichen: Der Abschnitt schreibt die Zeitmarke am Satzanfang gross
    // ("Im Frühjahr"), im Faktenblatt steht sie klein. Mit indexOf auf die Rohform
    // lieferte die Prüfung durchweg -1 und meldete deshalb nie etwas - eine
    // Prüfung, die immer besteht, ist keine.
    const hgLow = hergang.toLowerCase();
    const pos = fb.chronologie.map((c) => ({ id: c.id, at: hgLow.indexOf(c.zeit.toLowerCase()) })).filter((x) => x.at >= 0);
    for (let i = 1; i < pos.length; i++) {
      if (pos[i]!.at < pos[i - 1]!.at) {
        m.push({ art: "Chronologie im Hergang nicht monoton", stelle: `${pos[i - 1]!.id} nach ${pos[i]!.id}` });
        break;
      }
    }
  }
  return m;
}
