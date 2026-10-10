// Gattung „Märchen" (4.376.0).
//
// Die erste Gattung mit einem eigenen Gerüst, das nicht auf dem Weltblatt der
// Utopie aufbaut. Fünf Abschnitte, nach der Morphologie des Zaubermärchens auf
// das Nötigste verkürzt:
//
//   Eingang    „Es war einmal …" — der Held, der Ort, der Mangel, der Aufbruch
//   Auszug     ein Helfer bittet um etwas, der Held gibt; zum Dank eine Gabe,
//              an eine Bedingung geknüpft
//   Prüfungen  zuerst, danach — zwei Prüfungen aus eigener Kraft
//   Zuletzt    der Gegner; überwunden nur mit der Gabe. Die Bedingung wird
//              gehalten oder (Blick „dunkel") gebrochen
//   Heimkehr   der Mangel ist behoben, die Schlussformel je Blick
//
// Ein Märchenblatt wird einmal gezogen; jeder Abschnitt liest daraus. Die Gabe
// wird gegeben, BEVOR sie gebraucht wird; der Gegner tritt mit unbestimmtem
// Artikel auf, bevor er mit bestimmtem weiterlebt — das prüft
// `pruefeMaerchen()`.
//
// Der Held steht in den Vorlagen IMMER im Nominativ. Ein Akkusativ wäre bei
// schwachen Nomen falsch („den Prinz"), und aus dem Wer-Feld kommt jedes Nomen.
import type { Bank, GenInput } from "../types";
import { pick } from "../text-utils";
import { normWhere, normWhen } from "./ctxnorm";
import { fuelle, blickVonTon, erkenneLage, type Blick, type LageTyp } from "../features/weltblatt";
import { utopieMaterial } from "../features/utopieMaterial";

const cap = (s: string): string => (s ? s[0]!.toUpperCase() + s.slice(1) : s);

/** Eine Nominalphrase mit Relativsatz („den Schlüssel, mit dem der Morgen
 *  aufgeschlossen wird") braucht hinter sich ein Komma, wenn der Satz weiterläuft.
 *  Ohne stand „… aufgeschlossen wird zu holen" (gefunden beim Lesen, 4.376.0). */
const mitKomma = (np: string): string => (/, /.test(np) ? np + "," : np);

// ── Held (Wer) ──────────────────────────────────────────────────────────────

export interface Held {
  /** Erste Nennung: „ein armer Schneider", „der jüngste Sohn", „Mara". */
  ein: string;
  /** Jede weitere Nennung, im Nominativ: „der arme Schneider". */
  def: string;
  /** Relativpronomen, wenn das Geschlecht bekannt ist; bei Namen leer. */
  rel: "der" | "die" | "das" | "";
  /** Für die zweite Nennung im selben Satz: er/sie/es; bei Namen der Name.
   *  „Das Waisenkind gab, was das Waisenkind hatte" (gefunden beim Lesen). */
  pron: string;
  ausEingabe: boolean;
}

const PRON: Record<"der" | "die" | "das", string> = { der: "er", die: "sie", das: "es" };

/** Nomen, die mit „ein" sächlich sind. Die Endung -chen/-lein trägt das selbst. */
// Am ENDE des Nomens, nicht als ganzes Wort: Zusammensetzungen tragen das
// Geschlecht ihres letzten Glieds. „ein Findelkind" wurde sonst „der
// Findelkind" (gefunden beim Würfeln, 4.381.0).
const NEUTRA = /(kind|mädchen|fräulein|männlein|pferd|schaf|lamm|huhn|tier|volk|geißlein|rehlein|kalb|fohlen|ferkel)$/i;

/** Liest einen Helden aus dem Wer-Feld. `null`, wenn sich nichts sicher
 *  bilden lässt — dann wird gezogen. */
export function erkenneHeld(wer: string): Held | null {
  const roh = ((wer || "").split(",")[0] || "").trim();
  if (!roh) return null;
  // Ein bloßer Name, ein oder zwei Wörter, großgeschrieben.
  if (/^[A-ZÄÖÜ][a-zäöüß]+(?: [A-ZÄÖÜ][a-zäöüß]+)?$/.test(roh) && !/(er|in|e|ling|chen|lein)$/.test(roh)) {
    // „Es war einmal Mara. Mara lebte …" las sich holprig; „jemand mit Namen"
    // trägt ein Relativpronomen.
    return { ein: `jemand mit Namen ${roh}`, def: roh, rel: "der", pron: roh, ausEingabe: true };
  }
  const best = roh.match(/^(der|die|das)\s+(.+)$/i);
  if (best) {
    const a = best[1]!.toLowerCase() as "der" | "die" | "das";
    return { ein: `${a} ${best[2]}`, def: `${a} ${best[2]}`, rel: a, pron: PRON[a], ausEingabe: true };
  }
  const unb = roh.match(/^(ein|eine)\s+(.+)$/i);
  if (!unb) return null;
  const art = unb[1]!.toLowerCase(), rest = unb[2]!;
  const worte = rest.split(" ");
  const i = worte.findIndex((w) => /^[A-ZÄÖÜ]/.test(w));
  if (i < 0) return null;
  const adj = worte.slice(0, i), nomen = worte[i]!;
  if (adj.some((w) => !/^[a-zäöüß]+$/.test(w))) return null;
  if (art === "eine") return { ein: `eine ${rest}`, def: `die ${rest}`, rel: "die", pron: "sie", ausEingabe: true };
  // „ein": männlich oder sächlich. Das Adjektiv verrät es (-er / -es), ohne
  // Adjektiv das Nomen.
  let g: "der" | "das";
  if (adj.length) {
    const letzt = adj[adj.length - 1]!;
    if (/er$/.test(letzt)) g = "der"; else if (/es$/.test(letzt)) g = "das"; else return null;
  } else g = /(chen|lein)$/.test(nomen) || NEUTRA.test(nomen) ? "das" : "der";
  const adjDef = adj.map((w) => w.replace(/(er|es)$/, "e"));
  return { ein: `ein ${rest}`, def: `${g} ${[...adjDef, ...worte.slice(i)].join(" ")}`, rel: g, pron: PRON[g], ausEingabe: true };
}

export const HELDEN: Held[] = [
  { ein: "ein armer Schneider", def: "der arme Schneider", rel: "der", pron: "er", ausEingabe: false },
  { ein: "eine arme Müllerstochter", def: "die arme Müllerstochter", rel: "die", pron: "sie", ausEingabe: false },
  { ein: "ein Hirtenjunge", def: "der Hirtenjunge", rel: "der", pron: "er", ausEingabe: false },
  { ein: "eine junge Gänsehirtin", def: "die junge Gänsehirtin", rel: "die", pron: "sie", ausEingabe: false },
  { ein: "ein Waisenkind", def: "das Waisenkind", rel: "das", pron: "es", ausEingabe: false },
  { ein: "der jüngste Sohn eines Fischers", def: "der jüngste Sohn", rel: "der", pron: "er", ausEingabe: false },
  { ein: "eine Köhlerstochter", def: "die Köhlerstochter", rel: "die", pron: "sie", ausEingabe: false },
  { ein: "ein Schusterlehrling", def: "der Schusterlehrling", rel: "der", pron: "er", ausEingabe: false },
];

// ── Ort, Mangel, Helfer, Gabe, Gegner ──────────────────────────────────────

export const ORTE: { wo: string; lage: LageTyp }[] = [
  { wo: "hinter den sieben Bergen", lage: "gebirge" },
  { wo: "in einem Dorf am Rand des großen Waldes", lage: "wald" },
  { wo: "in einer Mühle an einem Bach", lage: "tal" },
  { wo: "in einer Fischerhütte am Meer", lage: "insel" },
  { wo: "in einem Städtchen mit schiefen Türmen", lage: "stadt" },
];

interface Mangel { satz: string; ziel: string; loesung: string }
/** Mangel im Präteritum — der Erzählton des Märchens. `ziel` im Akkusativ. */
const MAENGEL: Mangel[] = [
  { satz: "Eines Tages war der Brunnen versiegt, und niemand wusste, warum.", ziel: "einen Krug Wasser aus der Quelle am Ende der Welt",
    loesung: "goss das Wasser in den Brunnen, und der Brunnen füllte sich wieder bis an den Rand." },
  { satz: "Eines Tages hatte die Königstochter das Lachen verloren, und kein Spielmann konnte es ihr wiederbringen.", ziel: "eine goldene Feder vom Vogel, der am Rand der Welt singt",
    loesung: "brachte die Feder ins Schloss, und als die Königstochter sie sah, lachte sie zum ersten Mal seit Jahren." },
  { satz: "Eines Tages wurde es im ganzen Land nicht mehr Morgen; die Sonne blieb hinter den Bergen.", ziel: "den Schlüssel, mit dem der Morgen aufgeschlossen wird",
    loesung: "schloss den Morgen auf, und die Sonne kam über die Berge, als wäre nichts gewesen." },
  { satz: "Eines Tages wurde der Vater krank, und kein Kraut half ihm.", ziel: "die Blume, die nur um Mitternacht blüht",
    loesung: "legte die Blume auf das Bett des Vaters, und am Morgen stand der Vater auf und verlangte Suppe." },
  { satz: "Eines Tages waren alle Glocken des Landes gestohlen, und niemand wusste mehr, wann Sonntag war.", ziel: "die Glocken",
    loesung: "brachte die Glocken zurück, und am nächsten Sonntag läuteten sie alle zugleich." },
  { satz: "Eines Tages wuchs das Korn nicht mehr, und im Winter würde das Brot fehlen.", ziel: "das Samenkorn der allerersten Ernte",
    loesung: "säte das Korn, und im Sommer stand das Feld so hoch wie nie zuvor." },
];
/** Für einen eingetragenen Mangel: kein erfundenes Ziel — „um zu holen, was
 *  fehlte". Vorher holte der Held bei einem versiegten Brunnen eine Feder vom
 *  Vogel Greif (gefunden beim Lesen, 4.376.0). */
const ZIEL_FREI = "";
const LOESUNG_FREI = "kam wieder heim, und kaum war das Gefundene im Haus, war alles wieder, wie es sein sollte.";

interface Helfer { akk: string; def: string; bitte: string }
const HELFER: Helfer[] = [
  { akk: "ein altes Mütterchen", def: "das Mütterchen", bitte: "ein Stück Brot" },
  { akk: "einen Fuchs mit einem lahmen Bein", def: "der Fuchs", bitte: "einen Verband für sein Bein" },
  { akk: "eine weiße Taube", def: "die Taube", bitte: "ein paar Körner" },
  { akk: "einen grauen Mann unter einer Brücke", def: "der graue Mann", bitte: "einen Schluck Wasser" },
  { akk: "eine Kröte am Brunnenrand", def: "die Kröte", bitte: "einen Tropfen Milch" },
];

interface Gabe { akk: string; nom: string; einsatz: string }
const GABEN: Gabe[] = [
  { akk: "ein Tuch, das sich von selbst deckt", nom: "das Tuch", einsatz: "{Hc} breitete das Tuch aus, und es deckte sich mit so viel Essen, dass {G} sich satt aß und darüber einschlief." },
  { akk: "einen Kamm aus Knochen", nom: "der Kamm", einsatz: "{Hc} warf den Kamm hinter sich, und ein dichter Wald wuchs empor, in dem {G} sich verirrte." },
  { akk: "eine kleine Flöte", nom: "die Flöte", einsatz: "{Hc} blies auf der Flöte, und die Tiere des Waldes kamen so zahlreich, dass {G} vor Schreck davonlief." },
  { akk: "einen Faden, der nie reißt", nom: "der Faden", einsatz: "{Hc} spannte den Faden über den Weg, und {G} stolperte darüber und stürzte in eine tiefe Schlucht." },
  { akk: "einen Spiegel aus Silber", nom: "der Spiegel", einsatz: "{Hc} hob den Spiegel, und {G} erblickte sich selbst und erstarrte zu Stein." },
];

interface Bedingung { satz: string; gehalten: string; gebrochen: string }
const BEDINGUNGEN: Bedingung[] = [
  { satz: "Schau dich nicht um, bis du wieder zu Hause bist.",
    gehalten: "Auf dem ganzen Heimweg sah {H} sich kein einziges Mal um.",
    gebrochen: "Kurz vor dem Dorf aber sah {H} sich doch um, und seitdem sieht {P} immer auch, was hinter einem liegt." },
  { satz: "Sprich unterwegs mit niemandem.",
    gehalten: "Auf dem ganzen Heimweg sprach {H} mit niemandem, nicht einmal mit sich selbst.",
    gebrochen: "Auf dem Heimweg aber grüßte {H} einen Wanderer, und von da an konnte {P} nur noch flüstern." },
  { satz: "Iss nichts, was dir unterwegs angeboten wird.",
    gehalten: "Auf dem ganzen Heimweg nahm {H} keinen Bissen an, so verlockend er auch roch.",
    gebrochen: "Auf dem Heimweg aber nahm {H} einen Apfel an, und von da an hatte {P} nie wieder Hunger, aber auch nie wieder Freude am Essen." },
  { satz: "Verrate keinem, woher du die Gabe hast.",
    gehalten: "Und wer auch fragte, {H} verriet keinem, woher die Gabe stammte.",
    gebrochen: "Zu Hause aber erzählte {H} allen, woher die Gabe stammte, und am nächsten Morgen war sie verschwunden." },
];

interface Gegner { ein: string; def: string }
const GEGNER: Gegner[] = [
  { ein: "ein Riese", def: "der Riese" },
  { ein: "eine Hexe mit eisernen Zähnen", def: "die Hexe" },
  { ein: "ein Drache", def: "der Drache" },
  { ein: "ein Zauberer in einem schwarzen Mantel", def: "der Zauberer" },
  { ein: "ein Wolf, so groß wie ein Haus", def: "der Wolf" },
];

const ZIELORTE = ["an das Ende der Welt", "auf den höchsten Berg des Landes", "in ein Schloss aus Eis", "an einen See, in dem der Mond wohnt"];

/** Zwei Prüfungen aus eigener Kraft. `{Z}` ist „Zuerst" bzw. „Danach". */
const PRUEFUNGEN = [
  "{Z} kam {H} an einen Fluss ohne Brücke. Der Fährmann verlangte einen Lohn, den {H} nicht hatte; da half {P} ihm einen ganzen Tag beim Flicken der Netze, und am Abend durfte {P} ins Boot steigen.",
  "{Z} kam {H} an eine Mühle, deren Rad stillstand. Der Müller sagte, wer das Rad wieder zum Laufen bringe, dürfe weiterziehen. {Hc} fand den Stein, der sich in den Speichen verkeilt hatte, und das Rad drehte sich wieder.",
  "{Z} kam {H} in einen dunklen Wald, in dem sich jeder verirrte. {Hc} fragte die Bäume nach dem Weg, und die älteste Eiche neigte ihre Zweige in die richtige Richtung.",
  "{Z} kam {H} an ein Tor, das nur aufging, wenn man ein Rätsel löste: Was wird größer, je mehr man davon wegnimmt? „Ein Loch“, sagte {H}, und das Tor sprang auf.",
  "{Z} kam {H} zu einem Bauern, dessen Kuh keine Milch mehr gab. {Hc} sang der Kuh die ganze Nacht ein Lied vor, und am Morgen war der Eimer voll.",
  "{Z} kam {H} an einen Berg aus Glas, an dem niemand hinaufkam. {Hc} wartete, bis es fror, und stieg dann über das Eis hinauf, das sich an seinen Flanken gebildet hatte.",
];

/** Schlussformeln je Blick. „sie" ist hier das unbestimmte „alle". */
const SCHLUSS: Record<Blick, string> = {
  hell: "Und wenn sie nicht gestorben sind, dann leben sie noch heute.",
  spott: "Und wenn sie nicht gestorben sind, dann streiten sie noch heute darüber, wer es eigentlich gewesen ist.",
  dunkel: "Und wer es nicht glaubt, der mag selbst {zielortK} gehen und nachsehen.",
  // „Mehr ist von der jüngste Sohn nicht überliefert" — der Held nach einer
  // Präposition steht im falschen Fall (gefunden beim Lesen, 4.376.0).
  kuehl: "Was danach geschah, ist nicht überliefert.",
};

// ── Das Blatt ───────────────────────────────────────────────────────────────

export interface Maerchenblatt {
  held: Held;
  wo: string;
  lage: LageTyp | null;
  wann: string;
  /** Eingetragener Mangel, wörtlich (dann in Anführung), sonst leer. */
  mangelEingabe: string;
  mangel: Mangel | null;
  ziel: string;
  helfer: Helfer;
  gabe: Gabe;
  bedingung: Bedingung;
  gegner: Gegner;
  zielort: string;
  pruefungen: [string, string];
  blick: Blick;
  /** Die Bedingung wird beim Blick „dunkel" gebrochen. */
  gebrochen: boolean;
  werte: Record<string, string>;
}

export function ziehMaerchenblatt(input: GenInput): Maerchenblatt {
  const held = erkenneHeld(input.who || "") || pick(HELDEN);
  const woRoh = (input.where || "").trim();
  const ort = woRoh ? { wo: normWhere(woRoh) || woRoh, lage: erkenneLage(woRoh) } : pick(ORTE);
  // „Morgen, so erzählt man, lebte …" geht nicht: Eine Eingangsformel im
  // Präteritum verträgt keine Zeitangabe, die nach vorn zeigt. Dann bleibt es
  // beim „Es war einmal".
  const wannEin = (input.when || "").trim();
  const wannRoh = /^(morgen|übermorgen|bald|heute|demnächst|nächste)/i.test(wannEin) ? "" : wannEin;
  const wasRoh = (input.what || "").trim();
  const mangel = wasRoh ? null : pick(MAENGEL);
  const p1 = pick(PRUEFUNGEN);
  const p2 = pick(PRUEFUNGEN.filter((p) => p !== p1));
  const blick = blickVonTon(input.tone);
  const zielort = pick(ZIELORTE);
  const gegner = pick(GEGNER);
  return {
    held, wo: ort.wo, lage: ort.lage, wann: wannRoh ? (normWhen(wannRoh) || wannRoh) : "",
    mangelEingabe: wasRoh ? cap(wasRoh.replace(/\s+/g, " ").replace(/[\s.]*$/, "")) + (/[!?…]$/.test(wasRoh) ? "" : ".") : "",
    mangel, ziel: mangel ? mangel.ziel : ZIEL_FREI,
    helfer: pick(HELFER), gabe: pick(GABEN), bedingung: pick(BEDINGUNGEN), gegner, zielort,
    pruefungen: [p1, p2], blick, gebrochen: blick === "dunkel",
    werte: { H: held.def, Hc: cap(held.def), P: held.pron, G: gegner.def, zielort, zielortK: mitKomma(zielort) },
  };
}

// ── Der Bau ─────────────────────────────────────────────────────────────────

interface Satz { s: string; rang?: number }
export interface PresetWahlM { motiv?: string; wendung?: string; verwandlung?: [string, string] }
export interface MaerchenErgebnis { text: string; fb: Maerchenblatt; preset: PresetWahlM }

const worte = (s: string): number => (s.match(/[A-Za-zÄÖÜäöüß0-9]+/g) || []).length;

export function buildMaerchen(input: GenInput, bank?: Partial<Bank>): MaerchenErgebnis {
  const fb = ziehMaerchenblatt(input);
  const W = fb.werte, H = fb.held;
  const f = (s: string): string => fuelle(s, W);

  // Preset-Material, gefiltert für die Lage (wenn eine erkannt ist).
  const mat = utopieMaterial(bank, fb.lage);
  const pw: PresetWahlM = {
    motiv: mat.motive.length ? pick(mat.motive) : undefined,
    wendung: mat.wendungen.length ? pick(mat.wendungen) : undefined,
    verwandlung: mat.verwandlungen.length ? pick(mat.verwandlungen) : undefined,
  };

  // 1 · Eingang
  const eingang: Satz[] = [];
  if (fb.wann) eingang.push({ s: `${cap(fb.wann)}, so erzählt man, lebte ${H.ein} ${fb.wo}.` });
  else if (H.rel) eingang.push({ s: `Es war einmal ${H.ein}, ${H.rel} lebte ${fb.wo}.` });
  else eingang.push({ s: `Es war einmal ${H.ein}.` }, { s: `${cap(H.def)} lebte ${fb.wo}.` });
  eingang.push({ s: f("{Hc} besaß nicht viel, aber was {P} besaß, teilte {P} gern."), rang: 2 });
  eingang.push({ s: fb.mangel ? fb.mangel.satz : `Eines Tages hieß es im ganzen Land: „${fb.mangelEingabe}“` });
  eingang.push({ s: f(fb.ziel ? `Da machte sich {H} auf den Weg, um ${mitKomma(fb.ziel)} zu holen.` : "Da machte sich {H} auf den Weg, um zu holen, was fehlte.") });

  // 2 · Auszug
  const auszug: Satz[] = [
    { s: f(`Unterwegs traf {H} ${fb.helfer.akk}.`) },
    { s: `${cap(fb.helfer.def)} bat um ${fb.helfer.bitte}.` },
    { s: f("{Hc} gab, was {P} hatte, obwohl es nicht viel war.") },
    { s: f(`Zum Dank bekam {H} ${fb.gabe.akk}.`) },
    { s: `„${fb.bedingung.satz.replace(/\.$/, "")}“, sagte ${fb.helfer.def}.` },
  ];
  if (pw.motiv) auszug.push({ s: f(`Unterwegs sah {H} vieles, und manches vergaß {P} nie: ${pw.motiv}.`) });
  if (pw.wendung) auszug.push({ s: f(`In einem Dorf hörte {H} erzählen: ${cap(pw.wendung)}.`), rang: 1 });
  auszug.push({ s: "Es war ein weiter Weg, und die Schuhe wurden dünn.", rang: 2 });

  // 3 · Zwei Prüfungen aus eigener Kraft
  const pruef: Satz[] = [
    { s: fuelle(fb.pruefungen[0], { ...W, Z: "Zuerst" }) },
    { s: fuelle(fb.pruefungen[1], { ...W, Z: "Danach" }) },
  ];

  // 4 · Zuletzt: der Gegner und die Gabe
  const zuletzt: Satz[] = [
    { s: f(`Zuletzt kam {H} ${fb.zielort}.`) },
    { s: `Dort aber wachte ${fb.gegner.ein}.` },
    { s: f(fb.gabe.einsatz) },
    { s: f(fb.ziel ? `Da nahm {H} ${mitKomma(fb.ziel)} und machte sich auf den Heimweg.` : "Da nahm {H}, was fehlte, und machte sich auf den Heimweg.") },
    { s: f(fb.gebrochen ? fb.bedingung.gebrochen : fb.bedingung.gehalten) },
  ];

  // 5 · Heimkehr
  const heim: Satz[] = [
    { s: f(`{Hc} ${fb.mangel ? fb.mangel.loesung : LOESUNG_FREI}`) },
  ];
  if (pw.verwandlung) heim.push({ s: `Seitdem sagt man dort nicht mehr „${pw.verwandlung[0]}“, sondern „${pw.verwandlung[1]}“.`, rang: 1 });
  heim.push({ s: f(SCHLUSS[fb.blick]) });

  const abschnitte = [eingang, auszug, pruef, zuletzt, heim];
  const ziel = Number.isFinite(input.lenTarget as number) ? (input.lenTarget as number) : 110;
  const an = new Set<Satz>(abschnitte.flat().filter((x) => x.rang === undefined));
  const zaehle = (): number => [...an].reduce((n, x) => n + worte(x.s), 0);
  for (const k of abschnitte.flat().filter((x) => x.rang !== undefined).sort((a, b) => a.rang! - b.rang!)) {
    if (zaehle() >= ziel) break;
    an.add(k);
  }
  const text = abschnitte.map((a) => a.filter((x) => an.has(x)).map((x) => x.s).join(" ")).join("\n\n");
  return { text, fb, preset: pw };
}

/** Derselbe Titel, aus dem fertigen Text gelesen — das Studio hat nur den
 *  Text, nicht das Blatt. Der Prüfstand hält beide Wege gegeneinander. */
export function maerchenTitelAusText(text: string): string {
  const h = (text || "").match(/Da machte sich (.+?) auf den Weg/);
  const g = GABEN.find((x) => (text || "").includes(`Zum Dank bekam ${h ? h[1] : ""} ${x.akk}`));
  return h && g ? `${cap(h[1]!)} und ${g.nom}` : "";
}

/** Titel: Held und Gabe — „Der arme Schneider und der Kamm". */
export function maerchenTitel(fb: Maerchenblatt): string {
  return `${cap(fb.held.def)} und ${fb.gabe.nom}`;
}

// ── Prüfung ─────────────────────────────────────────────────────────────────

/** Prüft ein Märchen gegen sein Blatt. Leere Liste = ohne Befund. */
export function pruefeMaerchen(text: string, fb: Maerchenblatt, bank?: Partial<Bank>): string[] {
  const b: string[] = [];
  const W = fb.werte;
  const abs = text.split("\n\n");
  if (abs.length !== 5) b.push("Nicht fünf Abschnitte");
  if (/[{}]|\bundefined\b|\bnull\b|\bNaN\b/.test(text)) b.push("Platzhalter oder Leerwert im Text");
  // Eingangsformel.
  if (!/^(Es war einmal |.+, so erzählt man, lebte )/.test(abs[0] || "")) b.push("Eingangsformel fehlt");
  // Der Held: erst unbestimmt eingeführt, dann bestimmt weitergeführt.
  const iEin = text.indexOf(fb.held.ein), iDef = text.indexOf(fb.held.def, iEin + fb.held.ein.length);
  if (iEin < 0) b.push("Held nicht eingeführt");
  if ((text.match(new RegExp(fb.held.def.replace(/[.*+?^${}()|[\]\\]/g, "\\$&"), "gi")) || []).length < 4) b.push("Held seltener als viermal genannt");
  if (iDef >= 0 && iEin > iDef) b.push("Held bestimmt vor unbestimmt");
  // Die drei Stationen in Reihenfolge.
  const z = ["Zuerst kam", "Danach kam", "Zuletzt kam"].map((m) => text.indexOf(m));
  if (z.some((i) => i < 0) || !(z[0]! < z[1]! && z[1]! < z[2]!)) b.push("Prüfungen nicht in der Folge Zuerst – Danach – Zuletzt");
  for (const m of ["Zuerst kam", "Danach kam", "Zuletzt kam"]) if (text.split(m).length > 2) b.push(`„${m}" doppelt`);
  // Die Gabe: gegeben vor dem Einsatz, eingesetzt im vierten Abschnitt.
  const iGabe = text.indexOf(fb.gabe.akk), iEinsatz = text.indexOf(fuelle(fb.gabe.einsatz, W));
  if (iGabe < 0) b.push("Gabe nicht gegeben");
  if (iEinsatz < 0) b.push("Gabe nicht eingesetzt");
  else if (iGabe > iEinsatz) b.push("Gabe eingesetzt, bevor sie gegeben wurde");
  else if (!(abs[3] || "").includes(fuelle(fb.gabe.einsatz, W))) b.push("Gabe nicht im Abschnitt „Zuletzt\"");
  // Der Gegner: unbestimmt vor bestimmt.
  // Ohne Rücksicht auf Groß-/Kleinschreibung: „Der Riese" am Satzanfang ist
  // dieselbe Nennung — die Gegenprobe fand, dass die erste Fassung sie übersah.
  const klein = text.toLowerCase();
  const gEin = klein.indexOf(fb.gegner.ein.toLowerCase()), gDef = klein.indexOf(fb.gegner.def.toLowerCase());
  if (gEin < 0) b.push("Gegner nicht eingeführt");
  else if (gDef >= 0 && gDef < gEin) b.push("Gegner bestimmt vor unbestimmt");
  // Die Bedingung: genannt; gehalten oder gebrochen je nach Blick — nie beides.
  if (!text.includes(fb.bedingung.satz.replace(/\.$/, ""))) b.push("Bedingung nicht genannt");
  const geh = text.includes(fuelle(fb.bedingung.gehalten, W)), geb = text.includes(fuelle(fb.bedingung.gebrochen, W));
  if (fb.gebrochen ? !geb || geh : !geh || geb) b.push(`Bedingung ${fb.gebrochen ? "nicht gebrochen" : "nicht gehalten"}`);
  // Mangel und Lösung.
  if (fb.mangel) {
    if (!text.includes(fb.mangel.satz)) b.push("Mangel fehlt");
    if (!text.includes(fb.mangel.loesung)) b.push("Lösung fehlt");
  } else if (!text.includes(`„${fb.mangelEingabe}“`)) b.push("Eingetragener Mangel fehlt");
  // Schlussformel als letzter Satz.
  if (!text.trim().endsWith(fuelle(SCHLUSS[fb.blick], W))) b.push("Schlussformel fehlt oder steht nicht am Ende");
  // Preset-Material aus genau dieser Bank.
  if (bank) {
    const m = utopieMaterial(bank, fb.lage);
    let motiv = 0;
    for (const x of text.matchAll(/manches vergaß .+? nie: ([^.]+)\./g)) { motiv++; if (!m.motive.includes(x[1]!)) b.push(`Motiv nicht aus dem Preset: „${x[1]}"`); }
    for (const x of text.matchAll(/hörte .+? erzählen: ([^.]+)\./g)) {
      const w = x[1]![0]!.toLowerCase() + x[1]!.slice(1);
      if (!m.wendungen.includes(w) && !m.wendungen.includes(x[1]!)) b.push(`Wendung nicht aus dem Preset: „${x[1]}"`);
    }
    for (const x of text.matchAll(/sagt man dort nicht mehr „([^“]+)“, sondern „([^“]+)“/g)) {
      if (!m.verwandlungen.some(([p, q]) => p === x[1] && q === x[2])) b.push(`Verwandlung nicht aus dem Preset: ${x[1]}→${x[2]}`);
    }
    if (m.motive.length && !motiv) b.push("Preset ohne Wirkung: kein Motiv im Text");
  }
  // Muster aus dem Lesen (4.376.0):
  // Relativsatz ohne schließendes Komma, wenn der Satz weiterläuft.
  const esc = (x: string): string => x.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
  for (const np of [fb.ziel, fb.zielort].filter((x) => /, /.test(x))) {
    if (new RegExp(esc(np) + " [a-zäöü]").test(text)) b.push(`Komma nach Relativsatz fehlt: „${np} …"`);
  }
  // Der Held direkt nach einer Präposition stünde im falschen Fall.
  if (/^(der|die|das) /.test(fb.held.def)) {
    if (new RegExp(`(?<!\\p{L})(von|mit|bei|aus|nach|zu|für|durch|gegen|ohne|um) ${esc(fb.held.def)}(?!\\p{L})`, "u").test(text)) b.push("Held nach Präposition — falscher Fall");
  }
  // Satzbau, zählbar — dieselben Prüfungen wie bei der Utopie.
  if (/ {2}|\s[,.;:!?]/.test(text)) b.push("Leerzeichen vor Satzzeichen oder doppelt");
  const dw = text.replace(/(?<!\p{L})(der|die|das|den|dem) \1(?!\p{L})/giu, "$1").match(/(?<!\p{L})(\p{L}+) \1(?!\p{L})/iu);
  if (dw) b.push(`Doppeltes Wort: „${dw[0]}"`);
  if (/[.!?]\s+[a-zäöü]/.test(text.replace(/„[^“]*“/g, "„…“"))) b.push("Satzanfang klein");
  if (/\.\.|\.“\./.test(text)) b.push("Doppelter Punkt");
  return b;
}
