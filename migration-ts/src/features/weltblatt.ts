// Das Weltblatt — die einmalige Ziehung vor einer Utopie (4.373.0).
//
// Warum ein Blatt und nicht der Vorrat: Eine Utopie taugt nur, wenn sie in sich
// stimmt. Heißt die Regierung im zweiten Absatz „Rat der Dreißig", darf sie im
// vierten nicht „Rat der Vierzig" heißen; liegt der Ort in der Wüste, flickt
// dort niemand Netze. Das leistet nur eine Ziehung, aus der ALLE Abschnitte
// lesen — dasselbe Verfahren wie das Faktenblatt des Berichts.
//
// Die vier W haben hier eine andere Aufgabe als im Bericht. Dort beschreiben
// sie ein Ereignis, hier legen sie die Welt fest:
//
//   Wo   → Lage, und damit, was knapp ist und womit gerechnet wird
//   Wann → Zeitlage (Vergangenheit, Zukunft, nach einem Bruch)
//   Wer  → Blickwinkel: Gast, Bewohner oder jemand, der gehen muss
//   Was  → der Grundsatz, um den sich alles dreht — und daraus die Kehrseite
//
// Die Regel bei Widersprüchen: Was der Nutzer einträgt, hat IMMER Vorrang vor
// der Ziehung. Leere Felder werden gezogen.
import type { GenInput } from "../types";
import { pick } from "../text-utils";
import { normWhere, normWhen } from "../generation/ctxnorm";

// ── Lage ────────────────────────────────────────────────────────────────────

export type LageTyp = "eis" | "wueste" | "insel" | "gebirge" | "wald" | "tal" | "stadt" | "ort";

export interface LageDaten {
  /** Erkennung im Wo-Feld. Reihenfolge der Prüfung siehe LAGE_REIHE. */
  re: RegExp | null;
  /** Lagen für ein leeres Wo-Feld, schon mit Präposition. */
  lagen: string[];
  /** Das Kostbarste — knapp ist an jedem Ort etwas anderes. */
  knapp: string;
  /** Womit gerechnet wird (nach „in"): „in Stunden", „in Krügen Wasser". */
  mass: string;
  /** Die typische Arbeit, verbletzt für Nebensätze: „wer Netze flickt". */
  arbeit: string;
  /** Wo man ankommt, satzfähig am Satzanfang: „Am Steg". */
  ankunft: string;
  /** Unterwegs: „Nach drei Tagen {weg} …". */
  weg: string;
  /** Wörter, die NUR zu dieser Lage gehören. Der Prüfstand sucht sie in Texten
   *  anderer Lagen — so wird der Vorrang der Ortsangabe zählbar. */
  marken: RegExp | null;
}

export const LAGEN: Record<LageTyp, LageDaten> = {
  eis: {
    re: /\b(eis|gletscher|pol|polar|schnee|frost|tundra|packeis)/i,
    lagen: ["unter dem Eis eines Gletschers", "am Rand des ewigen Eises", "in einer Senke, die neun Monate im Jahr verschneit ist"],
    knapp: "Wärme", mass: "Scheiten Holz", arbeit: "Eis hackt", ankunft: "Am Windfang",
    weg: "über das Eis", marken: /\b(Windfang|Eis hackt|Gletscher)/,
  },
  wueste: {
    re: /\b(wüste|sand|düne|oase|steppe|salzpfanne)/i,
    lagen: ["in einer Oase am Rand der Salzwüste", "zwischen zwei Dünenketten", "in einem ausgetrockneten Flussbett"],
    knapp: "Wasser", mass: "Krügen Wasser", arbeit: "Zisternen reinigt", ankunft: "Am Brunnen vor dem Tor",
    weg: "durch den Sand", marken: /\b(Zisterne\w*|Düne\w*|Sand)\b/,
  },
  insel: {
    re: /\b(insel|meer|küste|strand|hafen|bucht|eiland|atoll|riff)/i,
    lagen: ["auf einer Insel im Nordmeer", "auf einer flachen Insel hinter den Riffen", "auf einem Atoll, das bei Sturm halb unter Wasser steht"],
    knapp: "Holz", mass: "Stunden", arbeit: "Netze flickt", ankunft: "Am Steg",
    weg: "auf dem Meer", marken: /\b(Netze|Steg|Meer)\b/,
  },
  gebirge: {
    re: /\b(berg|gebirge|alpen|gipfel|pass|hochland|hochtal|fels)/i,
    lagen: ["in einem Hochtal, das nur über einen Pass zu erreichen ist", "auf einem Felsplateau über den Wolken", "an einem Hang, der zu steil für Wagen ist"],
    knapp: "ebener Boden", mass: "Tagwerken", arbeit: "Terrassen mauert", ankunft: "Am Passtor",
    weg: "im Fels", marken: /\b(Passtor|Terrassen|Fels)\b/,
  },
  wald: {
    re: /\b(wald|forst|dschungel|urwald|lichtung|bäume)/i,
    lagen: ["auf einer Lichtung tief im Wald", "in den Kronen eines alten Waldes", "an einem Bach mitten im Urwald"],
    knapp: "Licht", mass: "Stunden", arbeit: "Bäume auslichtet", ankunft: "Am Rand der Lichtung",
    weg: "unter den Bäumen", marken: /\b(Lichtung|Bäume)\b/,
  },
  tal: {
    re: /\b(tal|fluss|ufer|see|delta|sumpf|moor)/i,
    lagen: ["in einem Tal, das jedes Frühjahr überschwemmt wird", "auf Pfählen über einem großen See", "im Delta eines breiten Flusses"],
    knapp: "trockenes Land", mass: "Stunden", arbeit: "Deiche ausbessert", ankunft: "An der Furt",
    weg: "am Fluss entlang", marken: /\b(Deiche|Furt)\b/,
  },
  stadt: {
    re: /\b(stadt|metropole|hochhaus|türme|turm|straße|viertel|ruine)/i,
    lagen: ["in einer Stadt, die auf den Trümmern einer älteren steht", "in einer Stadt ohne Mauern", "in den oberen Stockwerken einer verlassenen Stadt"],
    knapp: "Platz", mass: "Stunden", arbeit: "Straßen kehrt", ankunft: "Am Stadttor",
    weg: "auf alten Straßen", marken: /\b(Stadttor|Straßen kehrt)\b/,
  },
  ort: {
    re: null,
    lagen: [],
    knapp: "Zeit", mass: "Stunden", arbeit: "Brot backt", ankunft: "Am Tor",
    weg: "unterwegs", marken: null,
  },
};

/** Reihenfolge der Erkennung. „Eine Stadt unter dem Eis" ist zuerst Eis: Dort
 *  ist Wärme knapp, nicht Platz. */
const LAGE_REIHE: LageTyp[] = ["eis", "wueste", "insel", "gebirge", "wald", "tal", "stadt"];

export function erkenneLage(wo: string): LageTyp | null {
  const w = (wo || "").trim();
  if (!w) return null;
  for (const t of LAGE_REIHE) if (LAGEN[t].re!.test(w)) return t;
  return null;
}

/** Ist das Wo nur ein Eigenname („Velmar", „Neu-Amaurot")? Dann wird er der
 *  Name der Welt, und die Lage wird gezogen. */
export function istNurName(wo: string): boolean {
  const w = (wo || "").trim();
  return /^[A-ZÄÖÜ][a-zäöüß]+(?:[- ][A-ZÄÖÜ][a-zäöüß]+)?$/.test(w) && !erkenneLage(w);
}

/** Ein Eigenname innerhalb der Ortsangabe: „auf der Insel Velmar". */
function nameAusWo(wo: string): string {
  const m = (wo || "").match(/\b(?:Insel|Stadt|Republik|Land|Tal|Oase|Kolonie|Siedlung)\s+([A-ZÄÖÜ][a-zäöüß]+(?:-[A-ZÄÖÜ][a-zäöüß]+)?)/);
  return m ? m[1]! : "";
}

// ── Name ────────────────────────────────────────────────────────────────────

const SILBE_A = ["Vel", "Ar", "Ost", "Mer", "Tal", "Is", "Kor", "Lun", "Sel", "Am", "Bri", "Hel", "Nor", "Ul", "Eb", "Ter", "Sol", "Wen"];
const SILBE_B = ["mar", "dun", "wen", "ora", "lis", "heim", "ia", "et", "ond", "ane", "run", "ago", "ur", "ela"];

export function ziehName(): string {
  for (let i = 0; i < 20; i++) {
    const a = pick(SILBE_A), b = pick(SILBE_B);
    // Zwei Vokale an der Fuge lesen sich schlecht („Iaia", „Amia" geht noch).
    if (/[aeiou]$/i.test(a) && /^[aeiou]/i.test(b)) continue;
    if (a.toLowerCase().endsWith(b.slice(0, 2))) continue;
    return a + b;
  }
  return "Velmar";
}

// ── Grundsatz (Was) ─────────────────────────────────────────────────────────

/** Eine Frage, die der Erzähler stellt oder gestellt bekommt, mit Antwort. */
export interface Frage { frage: string; antwort: string }

export interface Grundsatz {
  id: string;
  /** Erkennung im Was-Feld. */
  re: RegExp | null;
  /** Wortlaut, wenn das Was-Feld leer ist. */
  satz: string;
  ordnung: string[];
  alltag: string[];
  /** Der Preis GENAU dieser Prämisse. Der erste Satz ist Pflicht. */
  kehrseite: string[];
  frage: Frage;
  /** Erzwingt eine Regierungs- oder Gesetzesform, die zur Prämisse gehört. */
  regierung?: string;
  gesetz?: string;
}

// Platzhalter in allen Vorlagen: {N} Name · {mass} · {arbeit} · {knapp} ·
// {zahlA} Arbeitsstunden · {zahlG} Gesetzeszahl. Zahlen stehen NIE fest im
// Wortlaut, sondern immer im Blatt — sonst könnte der Prüfstand nicht zählen.
export const GRUNDSAETZE: Grundsatz[] = [
  {
    id: "geld", re: /\b(geld|münze|bezahl|kauf|preis|lohn|tausch|währung|reichtum)/i,
    satz: "Es gibt kein Geld.",
    ordnung: ["Gerechnet wird in {mass}.", "Wer {arbeit}, bekommt dafür Brot, Unterricht oder ein Bett für die Nacht, und niemand schreibt mit, wer wem etwas schuldet."],
    alltag: ["Auf dem Markt liegt alles offen, und niemand steht hinter den Tischen.", "Ein Junge trägt einen Korb Brot vorbei und nickt nur, als jemand einen Laib herausnimmt."],
    kehrseite: ["Wer {N} verlässt, hat nichts, womit er draußen bezahlen könnte.", "Wer krank ist und nichts leisten kann, lebt von dem, was die anderen leisten. Man sagt, das sei kein Problem. Man sagt es auffallend oft."],
    frage: { frage: "wie man ohne Geld spart", antwort: "Gar nicht. Wofür auch?" },
  },
  {
    id: "eigentum", re: /\b(besitz|eigentum|gehört|eigen|privat|habe)/i,
    satz: "Niemand besitzt etwas.",
    ordnung: ["Häuser, Wagen und Werkzeug gehören niemandem; man benutzt sie, solange man sie braucht, und lässt sie dann stehen.", "Wer ein Haus verlässt, fegt es aus, damit der Nächste einziehen kann."],
    alltag: ["Vor jeder Tür steht ein Paar Stiefel, und niemand weiß, wem es zuletzt gepasst hat.", "Eine Säge geht an einem Vormittag durch viele Hände."],
    kehrseite: ["Auch der Brief, den man schreibt, gehört einem nicht; jeder darf ihn lesen.", "Wer etwas behalten will, versteckt es. Man nennt das in {N} nicht Diebstahl, sondern Heimweh."],
    frage: { frage: "was man in {N} überhaupt sein Eigen nennen darf", antwort: "Den eigenen Namen. Und den nur, solange man ihn benutzt." },
  },
  {
    id: "gesetz", re: /\b(gesetz|regel|verbot|recht|paragraph|paragraf|vorschrift)/i,
    satz: "Jedes Gesetz verfällt nach {zahlG} Jahren, wenn es niemand neu spricht.",
    ordnung: ["Kein Gesetz wird in Stein gehauen; alle stehen auf weichem Holz.", "Wer ein Gesetz behalten will, muss es auf dem Platz laut sprechen, vor allen."],
    alltag: ["Manche sprechen jedes Jahr dieselben Gesetze, aus Gewohnheit, und niemand hört mehr zu."],
    kehrseite: ["Was niemand neu spricht, gilt nicht mehr. Einmal verfiel das Verbot, einander zu schlagen, für einen ganzen Sommer, weil jeder glaubte, ein anderer werde es sprechen."],
    frage: { frage: "welches Gesetz in {N} das älteste ist", antwort: "Das, an das sich alle halten, obwohl es keiner mehr spricht." },
    gesetz: "verfall",
  },
  {
    id: "erinnerung", re: /\b(vergess|vergiss|erinner|gedächtnis|chronik|aufschreib|archiv)/i,
    satz: "Niemand darf vergessen.",
    ordnung: ["Jeder schreibt am Abend auf, was er am Tag getan hat, und die Bücher stehen offen im Archiv.", "Wer etwas nicht mehr weiß, geht hin und liest nach."],
    alltag: ["Im Archiv sitzen Kinder und lesen, was ihre Großeltern an einem Dienstag gegessen haben.", "Streit dauert in {N} nie lange; man schlägt nach, wer was gesagt hat."],
    kehrseite: ["Auch was man vergessen möchte, steht im Buch. Wer einmal einen Fehler gemacht hat, kann ihn jeden Tag nachlesen, und die anderen auch."],
    frage: { frage: "ob man etwas auch durchstreichen darf", antwort: "Durchstreichen ja. Aber der Strich wird mit aufgeschrieben." },
  },
  {
    id: "los", re: /\b(regier|herrsch|macht|könig|wahl|wähl|los|amt|ämter|anführer|staat|obrigkeit)/i,
    satz: "Niemand regiert; alle Ämter werden ausgelost.",
    ordnung: ["Darum hat in {N} niemand ein Amt, das er sich gewünscht hat."],
    alltag: ["Am Tag der Auslosung stehen alle auf dem Platz; wer gezogen wird, seufzt, und die anderen klatschen erleichtert."],
    kehrseite: ["Wer nicht ausgelost werden will, muss {N} verlassen. Es sind nicht viele, aber jedes Jahr einige."],
    frage: { frage: "wie man in {N} ein guter Herrscher wird", antwort: "Gar nicht. Man hat Pech, und dann gibt man sich Mühe." },
    regierung: "rat",
  },
  {
    id: "wahrheit", re: /\b(lüg|lug|wahrheit|ehrlich|wahr)/i,
    satz: "Niemand lügt.",
    ordnung: ["Wer etwas sagt, steht dafür ein, auch ein Jahr später.", "Höflichkeit besteht in {N} darin, eine Frage nicht zu stellen, deren Antwort man nicht hören will."],
    alltag: ["Auf dem Markt sagt der Bäcker, welches Brot von gestern ist, und man nimmt es trotzdem."],
    kehrseite: ["Man sagt einem Kranken, wie es um ihn steht. Man sagt einem Kind, dass sein Bild nicht gut ist. Viele Kinder in {N} hören irgendwann auf zu malen."],
    frage: { frage: "ob man in {N} nie jemanden schont", antwort: "Doch. Wir schweigen." },
  },
  {
    id: "arbeit", re: /\b(arbeit|beruf|muße|müßig|faul|freizeit)/i,
    satz: "Niemand arbeitet mehr als {zahlA} Stunden am Tag.",
    ordnung: ["Was dann noch zu tun ist, bleibt liegen bis morgen.", "Wer schneller fertig ist, hilft nicht den anderen, sondern geht nach Hause; so ist es gemeint."],
    alltag: ["Am Nachmittag sitzen die Leute auf den Treppen, spielen, streiten über Bücher oder schlafen."],
    kehrseite: ["Die Nachmittage sind lang. Manche halten sie nicht aus und gehen heimlich wieder an die Arbeit, und man sieht sie an wie Trinker."],
    frage: { frage: "was man mit der übrigen Zeit macht", antwort: "Das fragt hier jeder jeden. Eine Antwort hat noch niemand." },
  },
  {
    id: "waffen", re: /\b(waffe|krieg|gewalt|frieden|soldat|armee|kampf)/i,
    satz: "Es gibt keine Waffen.",
    ordnung: ["Selbst die Messer in den Küchen sind stumpf an der Spitze.", "Streit wird auf dem Platz ausgetragen, mit Worten, bis einer müde wird."],
    alltag: ["Die Kinder spielen Fangen, aber niemand spielt Krieg; das Wort kennen sie nur aus Büchern."],
    kehrseite: ["Als einmal Bewaffnete kamen, konnte niemand sie aufhalten. Sie nahmen, was sie wollten, und zogen weiter. Man spricht nicht gern darüber."],
    frage: { frage: "was man tut, wenn jemand angreift", antwort: "Wir hoffen, dass er sich langweilt." },
  },
  {
    id: "zeit", re: /\b(uhr|uhren|kalender|pünktlich|eile|datum)/i,
    satz: "Es gibt keine Uhren.",
    ordnung: ["Man beginnt, wenn es hell wird, und hört auf, wenn es dunkel wird.", "Geburtstage feiert man, wenn einem danach ist."],
    alltag: ["Eine Verabredung heißt in {N}: irgendwann am Nachmittag, und alle kommen."],
    kehrseite: ["Wer stirbt, stirbt ohne Datum. Auf den Grabsteinen steht nur ein Name, und nach einer Weile weiß niemand mehr, wann jemand gelebt hat."],
    frage: { frage: "wie man weiß, ob man zu spät ist", antwort: "Gar nicht. Man ist da, oder man ist nicht da." },
  },
  {
    id: "fremde", re: /\b(fremd|grenze|aufnahme|flucht|flüchtling|zuwander|jeder darf)/i,
    satz: "Jeder Fremde darf bleiben.",
    ordnung: ["Wer ankommt, bekommt am ersten Abend ein Bett und am zweiten eine Arbeit.", "Niemand fragt, woher einer kommt; man fragt, was er kann."],
    alltag: ["In den Gassen hört man mehrere Sprachen, und die Kinder wechseln zwischen ihnen, ohne es zu merken."],
    kehrseite: ["{N} ist voll. Die Neuen schlafen in den Scheunen, und die Alten sagen es nicht laut, aber man sieht es ihnen an."],
    frage: { frage: "ob es je zu viele werden", antwort: "Das fragen wir uns jeden Winter." },
  },
];

/** Für einen eigenen Grundsatz, den keine Prämisse erkennt. Die Kehrseite
 *  bleibt allgemein — eine erfundene, die nicht zum Satz passt, wäre schlimmer. */
export const GRUNDSATZ_FREI: Grundsatz = {
  id: "frei", re: null, satz: "",
  ordnung: ["Alles in {N} ist auf diesen einen Satz gebaut.", "Die Kinder lernen den Satz, bevor sie lesen lernen."],
  alltag: ["Man merkt den Grundsatz an Kleinigkeiten: daran, wie die Leute grüßen, und daran, worüber sie nicht reden."],
  kehrseite: ["Wer den Grundsatz nicht teilt, darf bleiben, aber er wird nicht mehr gefragt. Nach einer Weile gehen die meisten von selbst.", "Einen Preis hat der Satz auch. Man nennt ihn nicht, aber man zahlt ihn."],
  frage: { frage: "was geschieht, wenn sich jemand nicht daran hält", antwort: "Das ist noch nicht vorgekommen. Sagen wir." },
};

export function erkenneGrundsatz(was: string): Grundsatz | null {
  const w = (was || "").trim();
  if (!w) return null;
  return GRUNDSAETZE.find((g) => g.re!.test(w)) || null;
}

// ── Regierung, Gesetz, Brauch ───────────────────────────────────────────────

interface FormMitZahl { id: string; zahlen: string[]; text: string; alltag?: string }

/** {Z} Zahl klein, {ZG} Zahl groß (als Nomen: „Rat der Dreißig"), {alter}. */
const REGIERUNGEN: FormMitZahl[] = [
  { id: "rat", zahlen: ["zwölf", "dreißig", "neun", "einundzwanzig"],
    text: "Regiert wird {N} vom Rat der {ZG}. Die {ZG} werden jedes Jahr ausgelost, aus allen, die älter als {alter} sind." },
  { id: "versammlung", zahlen: [],
    text: "Regiert wird {N} von allen: Am ersten Tag jedes Monats versammeln sich alle auf dem Platz und entscheiden, was zu entscheiden ist." },
  { id: "aelteste", zahlen: ["sieben", "neun"],
    text: "Regiert wird {N} von den {Z} Ältesten; stirbt einer, rückt der Jüngste nach, der lesen kann." },
  { id: "reihe", zahlen: ["sieben", "zehn", "dreißig"],
    text: "In {N} regiert, wer gerade an der Reihe ist: Jedes Amt wechselt nach {Z} Tagen." },
];

const GESETZE: FormMitZahl[] = [
  { id: "verfall", zahlen: ["sieben", "fünf", "zehn"],
    text: "Jedes Gesetz verfällt nach {Z} Jahren, wenn es niemand neu spricht.",
    alltag: "Auf dem Platz hängen die Gesetze auf Holztafeln; viele sind schon blass." },
  { id: "hoechstzahl", zahlen: ["zwölf", "zehn", "zwanzig"],
    text: "Es darf nie mehr als {Z} Gesetze geben; wer ein neues will, muss ein altes streichen.",
    alltag: "Über das Streichen wird länger gestritten als über das Schreiben." },
  { id: "kind", zahlen: ["acht", "zehn"],
    text: "Jedes Gesetz muss so geschrieben sein, dass es ein Kind von {Z} Jahren versteht.",
    alltag: "Vor jeder Abstimmung liest ein Kind den Entwurf laut vor, und was es nicht versteht, wird neu geschrieben." },
];

const BRAEUCHE: FormMitZahl[] = [
  { id: "waage", zahlen: [],
    text: "Einmal im Jahr, am Waagentag, legt jeder auf den Platz, was er zu viel hat.",
    alltag: "Am Waagentag legt ein Mann seinen zweiten Mantel ab und geht ohne ihn nach Hause. Niemand sieht ihm nach." },
  { id: "schweigen", zahlen: [],
    text: "An einem Tag im Jahr spricht in {N} niemand ein Wort.",
    alltag: "Am Tag des Schweigens hört man nur Türen und Schritte, und abends lachen alle zu laut." },
  { id: "haeuser", zahlen: ["sieben", "zehn"],
    text: "Alle {Z} Jahre tauschen die Familien ihre Häuser, damit sich niemand an eines gewöhnt.",
    alltag: "Am Tauschtag stehen die Möbel auf der Straße, und Kinder laufen hin und her, um zu sehen, wo sie diesmal wohnen." },
  { id: "namen", zahlen: [],
    text: "Jeder darf sich einmal im Leben einen neuen Namen geben.",
    alltag: "Eine alte Frau stellt sich mit dem Namen eines Vogels vor; sie hat ihn erst im letzten Winter gewählt." },
];

// ── Wer: der Blickwinkel ────────────────────────────────────────────────────

export type ErzaehlerArt = "gast" | "bewohner" | "gehend";

const RE_GEHEND = /\b(geh(en|t)\s+muss|muss\s+gehen|verbannt|ausgesto(ß|ss)en|verlässt|verlassen\s+muss|flieht|abschied|letzte[nr]? tag)/i;
const RE_BEWOHNER = /\b(bewohner\w*|einheimisch\w*|bürger\w*|geboren|von hier|aus\s+[A-ZÄÖÜ]\w+|älteste\w*|fischer\w*|bäcker\w*|lehrer\w*|kind\b)/i;

export interface Erzaehler {
  art: ErzaehlerArt;
  /** Rolle ohne Artikel, für „als …"/„Ich bin …": „Reisender", „Fischerin". */
  rolle: string;
  /** Rolle für „Ich bin …": Mit Adjektiv braucht sie den Artikel („ein
   *  alter Kartograf"), als bloßes Nomen nicht („Fischerin"). */
  rolleIchBin: string;
  /** Eigenname, wenn das Wer nur ein Name ist. */
  name: string;
}

export function erkenneErzaehler(wer: string): Erzaehler {
  const roh = ((wer || "").split(/[,;]/)[0] || "").trim();
  // Das Komma gehört bei „eine, die gehen muss" zur Figur — also auf dem
  // ganzen Feld prüfen, nicht nur auf dem ersten Teil.
  if (RE_GEHEND.test(wer || "")) return { art: "gehend", rolle: "", rolleIchBin: "", name: "" };
  if (!roh) return { art: "gast", rolle: "", rolleIchBin: "", name: "" };
  const art: ErzaehlerArt = RE_BEWOHNER.test(roh) ? "bewohner" : "gast";
  // Ein bloßer Name: ein oder zwei großgeschriebene Wörter ohne Artikel, und
  // keins davon endet wie eine Personenbezeichnung (-er, -in, -ende, -graf).
  const nurName = /^[A-ZÄÖÜ][a-zäöüß]+(?: [A-ZÄÖÜ][a-zäöüß]+)?$/.test(roh)
    && !/(er|in|e|graf|graph|mann|frau|ling)$/.test(roh.split(" ").pop()!);
  if (nurName) return { art, rolle: "", rolleIchBin: "", name: roh };
  const rolle = roh.replace(/^(ein|eine|der|die|das)\s+/i, "");
  // „Ich bin ein alter Kartograf", aber „Ich bin Fischerin": Steht vorn ein
  // Adjektiv (klein), bleibt der unbestimmte Artikel.
  const mitArtikel = /^[a-zäöü]/.test(rolle);
  const art0 = (roh.match(/^(ein|eine)\s+/i) || [""])[0].toLowerCase();
  const rolleIchBin = mitArtikel ? (art0 || (/e$/.test(rolle.split(" ")[0]!) ? "eine " : "ein ")) + rolle : rolle;
  return { art, rolle, rolleIchBin, name: "" };
}

// ── Wann: die Zeitlage ──────────────────────────────────────────────────────

export type ZeitLage = "vergangenheit" | "zukunft" | "nachbruch" | "offen";

export function erkenneZeit(wann: string): ZeitLage | null {
  const w = (wann || "").trim();
  if (!w) return null;
  if (/\bnach\s+(dem|der|den)\b.*\b(krieg|flut|zusammenbruch|katastrophe|ende|seuche|brand|beben|sturm|untergang|kollaps)/i.test(w)) return "nachbruch";
  const jahr = w.match(/\b(\d{3,4})\b/);
  if (jahr) return parseInt(jahr[1]!, 10) > 2026 ? "zukunft" : "vergangenheit";
  if (/\b(zukunft|künftig|morgen|übermorgen|eines tages|in hundert|in tausend|kommend)/i.test(w)) return "zukunft";
  if (/\b(vor\s+\w+\s+(jahren|zeiten|jahrhunderten)|vor langer zeit|einst|damals|früher|mittelalter|antike)/i.test(w)) return "vergangenheit";
  return "offen";
}

const ZEIT_VORRAT: Record<Exclude<ZeitLage, "offen">, string[]> = {
  vergangenheit: ["vor vielen Jahren", "in einem Sommer, an den sich sonst niemand erinnert", "vor zweihundert Jahren"],
  zukunft: ["im Jahr 2300", "lange nach unserer Zeit", "in einem der kommenden Jahrhunderte"],
  nachbruch: ["nach dem letzten Krieg", "im Jahr nach der großen Flut", "nach dem Zusammenbruch"],
};

// ── Ton → Blick ─────────────────────────────────────────────────────────────

export type Blick = "hell" | "dunkel" | "spott" | "kuehl";

// WAECHTER-OK: keine Abschrift von TONE_OPTS, sondern eine EINTEILUNG der
// Töne in vier Blicke. Ein Ton, der hier fehlt, fällt auf „hell" — das ist
// gewollt; der Prüfstand Utopie fährt alle Blicke.
export function blickVonTon(ton: string): Blick {
  const t = (ton || "").toLowerCase();
  if (["dark", "unheimlich", "melancholisch", "mystery"].includes(t)) return "dunkel";
  if (["ironisch", "humorous"].includes(t)) return "spott";
  if (t === "nuechtern") return "kuehl";
  return "hell";
}

// ── Sprecher (die Einheimischen, die antworten) ─────────────────────────────

export interface Sprecher { nom: string; akk: string; pron: string }
const SPRECHER: Sprecher[] = [
  { nom: "eine Frau", akk: "eine Frau", pron: "sie" },
  { nom: "ein alter Mann", akk: "einen alten Mann", pron: "er" },
  { nom: "die Lehrerin", akk: "die Lehrerin", pron: "sie" },
  { nom: "der Wirt", akk: "den Wirt", pron: "er" },
];

// ── Das Blatt ───────────────────────────────────────────────────────────────

export interface Weltblatt {
  name: string;
  nameAusEingabe: boolean;
  lageTyp: LageTyp;
  lage: LageDaten;
  /** Lage mit Präposition: „auf einer Insel im Nordmeer". */
  wo: string;
  woAusEingabe: boolean;
  grundsatz: Grundsatz;
  /** Der Wortlaut, wie er im Text zitiert wird (aufgelöst, mit Satzzeichen). */
  satz: string;
  satzAusEingabe: boolean;
  regierung: { id: string; text: string };
  gesetz: { id: string; text: string; alltag: string };
  brauch: { id: string; text: string; alltag: string };
  erzaehler: Erzaehler;
  zeit: ZeitLage;
  wann: string;
  wannAusEingabe: boolean;
  blick: Blick;
  sprecher: Sprecher;
  tage: string;
  /** Jede Zahl, die der Text tragen darf — gezogen, nicht geschrieben. */
  zahlen: string[];
  /** Die Werte für die Platzhalter der Textbausteine. */
  werte: Record<string, string>;
}

const cap = (s: string): string => (s ? s[0]!.toUpperCase() + s.slice(1) : s);

/** Ersetzt die Platzhalter. Ein unbekannter Platzhalter bleibt stehen — der
 *  Prüfstand sucht nach geschweiften Klammern und meldet ihn. */
export function fuelle(s: string, werte: Record<string, string>): string {
  return s.replace(/\{(\w+)\}/g, (m, k: string) => (werte[k] !== undefined ? werte[k]! : m));
}

export function ziehWeltblatt(input: GenInput): Weltblatt {
  const woRoh = (input.where || "").trim();
  const wannRoh = (input.when || "").trim();
  const wasRoh = (input.what || "").trim();

  // Wo: Typ erkennen; ein bloßer Name wird zum Namen der Welt.
  let name = "", nameAusEingabe = false, wo = "", woAusEingabe = false;
  let lageTyp: LageTyp;
  if (woRoh && istNurName(woRoh)) {
    name = woRoh; nameAusEingabe = true;
    lageTyp = pick(LAGE_REIHE);
    wo = pick(LAGEN[lageTyp].lagen);
  } else if (woRoh) {
    lageTyp = erkenneLage(woRoh) || "ort";
    wo = normWhere(woRoh) || woRoh; woAusEingabe = true;
    const n = nameAusWo(woRoh);
    if (n) { name = n; nameAusEingabe = true; }
  } else {
    lageTyp = pick(LAGE_REIHE);
    wo = pick(LAGEN[lageTyp].lagen);
  }
  if (!name) name = ziehName();
  const lage = LAGEN[lageTyp];

  // Was: erkannte Prämisse oder freier Grundsatz.
  const erkannt = erkenneGrundsatz(wasRoh);
  const grundsatz = wasRoh ? (erkannt || GRUNDSATZ_FREI) : pick(GRUNDSAETZE);

  // Regierung und Gesetz: Die Prämisse kann eine Form erzwingen.
  let reg = grundsatz.regierung ? REGIERUNGEN.find((r) => r.id === grundsatz.regierung)! : pick(REGIERUNGEN);
  // „Niemand regiert." und gleich danach „Regiert wird … vom Rat" widersprach
  // sich (gefunden beim Lesen, 4.373.0). Bei dieser Prämisse ist der Rat
  // ausdrücklich KEINE Regierung.
  if (grundsatz.id === "los") reg = { ...reg, text: "Statt einer Regierung gibt es in {N} den Rat der {ZG}. Die {ZG} werden jedes Jahr ausgelost, aus allen, die älter als {alter} sind." };
  const ges = grundsatz.gesetz ? GESETZE.find((g) => g.id === grundsatz.gesetz)! : pick(GESETZE);
  // Der Brauch darf nicht zur Prämisse quer stehen: Häusertausch setzt Besitz voraus.
  const brauchVorrat = BRAEUCHE.filter((b) => !(grundsatz.id === "eigentum" && b.id === "haeuser"));
  const br = pick(brauchVorrat);

  const zahlR = reg.zahlen.length ? pick(reg.zahlen) : "";
  const alter = reg.id === "rat" ? pick(["sechzehn", "achtzehn", "vierzehn"]) : "";
  const zahlG = pick(ges.zahlen);
  const zahlB = br.zahlen.length ? pick(br.zahlen) : "";
  const zahlA = pick(["drei", "vier", "fünf"]);
  const tage = pick(["drei", "fünf", "sieben", "elf"]);

  // Der Ort der Ankunft, für Sätze mitten im Satz: „am Steg", „zum Steg".
  // Ein Schluss sprach sonst vom Tor, auch wo man am Steg angekommen war.
  const ort = lage.ankunft[0]!.toLowerCase() + lage.ankunft.slice(1);
  const zumOrt = ort.replace(/^am /, "zum ").replace(/^an der /, "zur ");
  const werte: Record<string, string> = {
    N: name, mass: lage.mass, arbeit: lage.arbeit, knapp: lage.knapp, ort, zumOrt,
    zahlA, zahlG, alter, Z: zahlR, ZG: cap(zahlR),
  };

  const satzRoh = wasRoh || fuelle(grundsatz.satz, werte);
  const satz = cap(satzRoh.replace(/\s+/g, " ").replace(/[\s.!?…]*$/, "")) + (/[!?…]$/.test(satzRoh.trim()) ? satzRoh.trim().slice(-1) : ".");

  const zeitErk = erkenneZeit(wannRoh);
  const zeit: ZeitLage = zeitErk || pick(["vergangenheit", "zukunft", "nachbruch"] as const);
  const wann = wannRoh ? (normWhen(wannRoh) || wannRoh) : pick(ZEIT_VORRAT[zeit === "offen" ? "vergangenheit" : zeit]);

  const zahlen = [zahlR, alter, zahlG, zahlB, tage, ...(grundsatz.id === "arbeit" ? [zahlA] : [])].filter(Boolean);

  return {
    name, nameAusEingabe, lageTyp, lage, wo, woAusEingabe,
    grundsatz, satz, satzAusEingabe: !!wasRoh,
    regierung: { id: reg.id, text: fuelle(reg.text, werte) },
    gesetz: { id: ges.id, text: fuelle(ges.text, { ...werte, Z: zahlG }), alltag: fuelle(ges.alltag || "", werte) },
    brauch: { id: br.id, text: fuelle(br.text, { ...werte, Z: zahlB }), alltag: fuelle(br.alltag || "", werte) },
    erzaehler: erkenneErzaehler(input.who || ""),
    zeit, wann, wannAusEingabe: !!wannRoh,
    blick: blickVonTon(input.tone),
    sprecher: pick(SPRECHER),
    tage,
    zahlen,
    werte,
  };
}

