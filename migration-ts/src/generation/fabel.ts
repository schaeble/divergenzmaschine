// Gattung „Fabel" (4.377.0).
//
// Zwei Tiere mit festen Eigenschaften, eine Begegnung, Rede und Gegenrede,
// eine Wende — und eine Lehre, die aus der Handlung FOLGT. Das ist die Zusage
// der Fabel, und sie lässt sich prüfen: Jede Lehre gehört zu genau einem
// Schema, und `pruefeFabel()` liest das Schema aus der Handlung selbst ab,
// nicht aus dem Blatt. Eine Lehre aus einer anderen Fabel fällt so auf.
//
// Vier Abschnitte: Eingang (wer, wo, die Lage) · Rede und Gegenrede · Wende ·
// Lehre. Die Fabel kennt keine Zeit — das Wann-Feld bleibt ohne Wirkung und
// wird im Studio gesperrt.
//
// Die Tiere tragen alle vier Fälle und ihre Pronomen ausdrücklich: Schwache
// Nomen beugen anders („den Löwen", „dem Hasen"), und aus der Endung lässt sich
// das nicht ablesen.
import type { Bank, GenInput } from "../types";
import { pick } from "../text-utils";
import { normWhere } from "./ctxnorm";
import { fuelle, blickVonTon, erkenneLage, type Blick, type LageTyp } from "../features/weltblatt";
import { utopieMaterial } from "../features/utopieMaterial";

const cap = (s: string): string => (s ? s[0]!.toUpperCase() + s.slice(1) : s);

export type Eigenschaft = "list" | "eitel" | "fleiss" | "sorglos" | "stark" | "klein" | "beharrlich" | "hochmut" | "gier" | "schwach" | "schnabel"
  // 4.391.0, für sechs weitere Fabeln:
  | "schwarz" | "pracht" | "neid" | "gross" | "verwoehnt" | "genuegsam";

export interface Tier {
  nomen: string;
  ein: string; nom: string; akk: string; dat: string;
  /** Pronomen: er/sie/es, ihn/sie/es, ihm/ihr/ihm, Possessivstamm sein/ihr. */
  p: string; pa: string; pd: string; poss: string;
  /** Schwach gebeugt: Akkusativ/Dativ tragen -(e)n. */
  schwach: boolean;
  eigen: Eigenschaft[];
}

const m = (nomen: string, eigen: Eigenschaft[], schwach = false): Tier => {
  const n = schwach ? nomen + (nomen.endsWith("e") ? "n" : "en") : nomen;
  return { nomen, ein: `ein ${nomen}`, nom: `der ${nomen}`, akk: `den ${n}`, dat: `dem ${n}`, p: "er", pa: "ihn", pd: "ihm", poss: "sein", schwach, eigen };
};
const f = (nomen: string, eigen: Eigenschaft[]): Tier =>
  ({ nomen, ein: `eine ${nomen}`, nom: `die ${nomen}`, akk: `die ${nomen}`, dat: `der ${nomen}`, p: "sie", pa: "sie", pd: "ihr", poss: "ihr", schwach: false, eigen });
const n = (nomen: string, eigen: Eigenschaft[]): Tier =>
  ({ nomen, ein: `ein ${nomen}`, nom: `das ${nomen}`, akk: `das ${nomen}`, dat: `dem ${nomen}`, p: "es", pa: "es", pd: "ihm", poss: "sein", schwach: false, eigen });

export const TIERE: Tier[] = [
  m("Fuchs", ["list"]),
  m("Rabe", ["eitel", "schwarz"], true),
  f("Krähe", ["eitel", "schwarz"]),
  m("Pfau", ["eitel", "pracht"]),
  f("Ameise", ["fleiss"]),
  m("Biber", ["fleiss"]),
  f("Grille", ["sorglos"]),
  m("Löwe", ["stark"], true),
  m("Bär", ["stark"], true),
  f("Maus", ["klein"]),
  f("Schildkröte", ["beharrlich"]),
  m("Igel", ["beharrlich"]),
  m("Hase", ["hochmut"], true),
  m("Wolf", ["gier"]),
  n("Lamm", ["schwach"]),
  n("Zicklein", ["schwach"]),
  m("Storch", ["schnabel"]),
  m("Kranich", ["schnabel"]),
  m("Frosch", ["neid"]),
  m("Ochse", ["gross"], true),
  f("Stadtmaus", ["verwoehnt"]),
  f("Feldmaus", ["genuegsam"]),
];

interface Schema {
  id: string;
  name: string;
  rolleA: Eigenschaft; rolleB: Eigenschaft;
  /** Erkennung einer eingetragenen Lehre. */
  re: RegExp;
  lage: string[]; rede: string[]; wende: string[];
  /** Ein Satz, der nur bei längerem Text dazukommt. */
  extra: string;
  lehre: string[];
}

// Platzhalter: {A} Nominativ bestimmt, {Ac} groß, {Aa} Akkusativ, {Ad} Dativ,
// {Ap}/{Apa}/{Apd} Pronomen, {Aposs} Possessivstamm — dasselbe für B.
// Ein Pronomen nur, wo es eindeutig ist: „Der Hase lachte über den Igel, weil
// er so langsam war" — wer? (gefunden beim Lesen, 4.377.0).
export const SCHEMATA: Schema[] = [
  { id: "wettlauf", name: "Wettlauf", rolleA: "hochmut", rolleB: "beharrlich",
    re: /hochmut|überheblich|langsam|beharrlich|geduld|eile|vorsprung|schnell|fall/i,
    lage: ["{Ac} lachte jeden Tag über {Ba}, weil {B} so langsam war."],
    rede: ["„Wollen wir um die Wette laufen?“, fragte {B} eines Morgens.", "„Mit dir?“, rief {A}. „Bis du am Ziel bist, ist es Winter.“", "Aber {Ap} sagte zu."],
    wende: ["{Ac} lief los, sah sich nach einer Weile um und legte sich unter einen Busch, um ein wenig zu schlafen.", "{Bc} aber ging Schritt für Schritt weiter, ohne ein einziges Mal anzuhalten.", "Als {A} aufwachte, war {B} schon am Ziel."],
    extra: "Die anderen Tiere sahen zu und sagten nichts.",
    lehre: ["Wer sich seines Vorsprungs zu sicher ist, verliert ihn.", "Beharrlichkeit kommt weiter als Hochmut."] },
  { id: "kaese", name: "Käse", rolleA: "list", rolleB: "eitel",
    re: /schmeichel|lob|eitel|gefieder/i,
    lage: ["{Bc} saß auf einem Ast und hielt ein Stück Käse im Schnabel.", "{Ac} sah es von unten und bekam Hunger."],
    rede: ["„Wie schön du bist“, sagte {A}. „Wenn deine Stimme so schön ist wie dein Gefieder, gibt es im ganzen Wald kein schöneres Tier.“"],
    wende: ["{Bc} wollte zeigen, wie schön {Bp} singen konnte, und öffnete den Schnabel.", "Der Käse fiel hinunter, und {A} schnappte ihn und lief davon.", "„Deine Stimme habe ich nicht gelobt“, rief {Ap} noch, „nur dein Gefieder.“"],
    extra: "Es war ein guter Käse, und es war der letzte.",
    lehre: ["Wer Schmeicheleien glaubt, bezahlt dafür.", "Hüte dich vor dem, der dich lobt, wenn er etwas von dir will."] },
  { id: "vorsorge", name: "Vorsorge", rolleA: "fleiss", rolleB: "sorglos",
    re: /vorsorg|fleiß|faul|sommer|winter|vorrat|arbeit|\bnot\b/i,
    lage: ["Den ganzen Sommer trug {A} Vorräte in {Aposs}en Bau, während {B} im Gras saß und sang."],
    rede: ["„Warum arbeitest du bei diesem Wetter?“, fragte {B}.", "„Weil es nicht immer Sommer ist“, sagte {A}."],
    wende: ["Als der Winter kam, klopfte {B} hungrig bei {Ad} an.", "„Was hast du im Sommer getan?“, fragte {A}.", "„Ich habe gesungen“, sagte {B}.", "„Dann tanz jetzt“, sagte {A} und schloss die Tür."],
    extra: "Draußen fiel der erste Schnee.",
    lehre: ["Wer nicht vorsorgt, solange es leicht ist, hat nichts, wenn es schwer wird.", "Für die Not sorgt man, solange keine Not ist."] },
  { id: "netz", name: "Netz", rolleA: "stark", rolleB: "klein",
    re: /klein|hilf|dank|verachte|gering/i,
    lage: ["{Ac} schlief im Schatten, als {B} über {Aposs}e Pfote lief und {Apa} weckte."],
    rede: ["{Ac} packte {Ba} und wollte {Bpa} fressen.", "„Lass mich laufen“, bat {B}. „Vielleicht kann ich dir einmal helfen.“", "{Ac} lachte über so viel Frechheit und ließ {Bpa} laufen."],
    wende: ["Wenige Tage später verfing sich {A} in einem Netz, das Jäger gespannt hatten.", "{Bc} hörte die Hilferufe, kam herbei und nagte die Maschen durch, bis {A} frei war."],
    extra: "Die Jäger fanden am Abend nur noch ein leeres Netz.",
    lehre: ["Auch der Kleinste kann dem Größten helfen.", "Verachte niemanden, weil er klein ist."] },
  { id: "bach", name: "Bach", rolleA: "gier", rolleB: "schwach",
    re: /gewalt|unrecht|vorwand|mächtig|stärker|grund/i,
    lage: ["{Ac} und {B} tranken an demselben Bach, {A} oben und {B} weiter unten."],
    rede: ["„Du trübst mir das Wasser“, sagte {A}.", "„Wie könnte ich“, sagte {B}, „das Wasser fließt doch von dir zu mir.“", "„Dann hast du mich im vorigen Jahr beleidigt.“", "„Da war ich noch gar nicht geboren.“"],
    wende: ["„Dann war es eben jemand aus deiner Familie“, sagte {A} und fraß {Bpa}."],
    extra: "Der Bach floss weiter, als wäre nichts gewesen.",
    lehre: ["Wer Unrecht tun will, findet immer einen Grund.", "Gegen den Mächtigen hilft das bessere Argument nicht."] },
  { id: "teller", name: "Teller und Krug", rolleA: "list", rolleB: "schnabel",
    re: /wie du mir|heimzahl|rache|hereinleg|gleiches|vergelt/i,
    lage: ["{Ac} lud {Ba} zum Essen ein und setzte {Bpd} die Suppe auf einem flachen Teller vor.", "{Bc} konnte mit dem langen Schnabel nichts davon fassen, und {A} leckte den Teller allein leer."],
    rede: ["„Hat es dir nicht geschmeckt?“, fragte {A} freundlich.", "„Komm morgen zu mir“, sagte {B}."],
    wende: ["Am nächsten Tag stellte {B} das Essen in einen Krug mit engem Hals.", "{Bc} aß mit dem langen Schnabel, und {A} saß hungrig daneben und leckte nur den Rand."],
    extra: "Gegrüßt haben sie einander danach nicht mehr.",
    lehre: ["Wie du mir, so ich dir.", "Wer andere hereinlegt, muss damit rechnen, dass es ihm genauso ergeht."] },
  // ── Sechs weitere (4.391.0) ──────────────────────────────────────────────
  // Gemessen an 4.386: 254 verschiedene Sätze in 120 Fabeln, 44 davon mit
  // demselben Anfang. Stoffe nach Äsop, neu erzählt. `extra` wird nicht
  // gefüllt — dort keine Platzhalter.
  { id: "hoehle", name: "Höhle", rolleA: "stark", rolleB: "list",
    re: /spur|einladung|schaden der anderen/i,
    lage: ["{Ac} war alt geworden und konnte nicht mehr jagen.", "Also legte {Ap} sich in {Aposs}e Höhle und ließ verbreiten, {Ap} sei krank."],
    rede: ["Ein Tier nach dem anderen kam zu Besuch, und keines kam wieder heraus.", "Zuletzt kam {B}, blieb aber vor dem Eingang stehen.", "„Komm doch näher“, rief {A}, „ich höre so schlecht.“"],
    wende: ["„Lieber nicht“, sagte {B}.", "„Ich sehe viele Spuren, die hineinführen, und keine, die herausführt.“", "Dann ging {B} davon."],
    extra: "In der Höhle blieb es an diesem Abend still.",
    lehre: ["Der Kluge lernt aus dem Schaden der anderen.", "Sieh auf die Spuren, bevor du einer Einladung folgst."] },
  { id: "knochen", name: "Knochen", rolleA: "gier", rolleB: "schnabel",
    re: /lohn|undank|dem bösen|räuber/i,
    lage: ["{Ac} hatte zu hastig gefressen, und ein Knochen steckte {Apd} quer im Hals."],
    rede: ["„Zieh ihn mir heraus“, bat {A} {Ba}, „ich will dich reich belohnen.“", "{Bc} steckte den langen Schnabel tief in den Rachen und zog den Knochen heraus."],
    wende: ["„Und mein Lohn?“, fragte {B}.", "„Du hast deinen Kopf heil aus meinem Rachen gezogen“, sagte {A}. „Das ist Lohn genug.“"],
    extra: "Der Knochen blieb im Gras liegen.",
    lehre: ["Wer dem Bösen dient, darf froh sein, wenn er heil davonkommt.", "Von einem Räuber erwarte keinen Dank."] },
  { id: "federn", name: "Fremde Federn", rolleA: "schwarz", rolleB: "pracht",
    re: /fremde[nr]? federn|schmückt/i,
    lage: ["{Ac} fand ein paar Federn, die {B} verloren hatte, und steckte sie sich zwischen die eigenen."],
    rede: ["So geschmückt stolzierte {A} umher und sah die alten Gefährten nicht mehr an.", "„Wer bist du denn?“, fragte {B}."],
    wende: ["{Bc} erkannte die eigenen Federn sofort und riss sie {Ad} wieder aus.", "Zerzaust kehrte {A} zu den alten Gefährten zurück, aber die wollten {Aa} auch nicht mehr kennen."],
    extra: "Die Federn trug der Wind davon.",
    lehre: ["Wer sich mit fremden Federn schmückt, steht am Ende ohne da.", "Wer mehr scheinen will, als er ist, verliert auch das, was er war."] },
  { id: "aufblasen", name: "Aufblasen", rolleA: "neid", rolleB: "gross",
    re: /aufblas|größer scheinen|zerplatz|bewunder/i,
    lage: ["{Ac} saß am Ufer und sah {Ba} auf der Wiese stehen.", "So groß wollte {A} auch sein."],
    rede: ["„Seht her“, rief {A} den anderen zu und blies sich auf. „Bin ich jetzt so groß?“", "„Noch lange nicht“, sagten sie und zeigten auf {Ba}."],
    wende: ["{Ac} blies sich weiter auf, und noch ein Stück, und noch eines.", "Dann gab es einen Knall."],
    extra: "Auf der Wiese hatte niemand etwas bemerkt.",
    lehre: ["Wer größer scheinen will, als er ist, zerplatzt daran.", "Nicht jeder kann werden, was er bewundert."] },
  { id: "tafel", name: "Reiche Tafel", rolleA: "verwoehnt", rolleB: "genuegsam",
    re: /in ruhe|in angst|karg|in frieden|in furcht/i,
    lage: ["{Ac} besuchte {Ba} und fand das Essen dort ärmlich, nichts als Körner und Wurzeln."],
    rede: ["„Komm mit zu mir“, sagte {A}, „bei mir gibt es Käse und Kuchen, so viel du willst.“", "{Bc} ging mit, und die Tafel war wirklich reich gedeckt."],
    wende: ["Kaum saßen sie am Tisch, ging die Tür auf, und beide flohen in ein Loch.", "Das geschah dreimal an diesem Abend.", "„Behalte deinen Kuchen“, sagte {B}. „Ich esse meine Körner in Ruhe.“"],
    extra: "Der Kuchen stand am Morgen noch da.",
    lehre: ["Lieber wenig in Ruhe als viel in Angst.", "Ein karger Tisch in Frieden ist besser als ein reicher in Furcht."] },
  { id: "brunnen", name: "Brunnen", rolleA: "list", rolleB: "schwach",
    re: /hineinspring|herauskomm|in der klemme|brunnen/i,
    lage: ["{Ac} war in einen Brunnen gefallen und kam nicht wieder heraus."],
    rede: ["Da schaute {B} über den Rand und fragte, ob das Wasser gut sei.", "„Herrlich“, rief {A}, „komm herunter und trink.“", "{Bc} sprang hinein."],
    wende: ["Sofort stieg {A} {Bd} auf den Rücken, von dort auf den Rand und war draußen.", "„Wer hineinspringt“, rief {A} hinunter, „sollte vorher wissen, wie er wieder herauskommt.“"],
    extra: "Im Brunnen wurde es Abend.",
    lehre: ["Sieh nach, wie du herauskommst, bevor du hineinspringst.", "Trau keinem Rat von einem, der in der Klemme sitzt."] },
];

export const FABEL_ORTE = ["am Rand eines Waldes", "auf einer Wiese am Fluss", "in einem alten Garten", "an einem Hang über dem Dorf"];

/** Die Lehre je Blick. Der Satz der Lehre steht immer unverändert darin. */
const LEHRE_RAHMEN: Record<Blick, string> = {
  hell: "Die Lehre daraus: {L}",
  kuehl: "Lehre: {L}",
  spott: "Die Lehre daraus: {L} Gelernt hat sie bis heute keiner.",
  dunkel: "Die Lehre daraus: {L} Aber wer sie braucht, hört sie selten.",
};

// ── Erkennung ───────────────────────────────────────────────────────────────

/** Tiere im Wer-Feld, in der Reihenfolge ihres Auftretens. */
export function erkenneTiere(wer: string): Tier[] {
  const w = wer || "";
  const funde = TIERE.map((t) => ({ t, i: w.search(new RegExp(`(?<!\\p{L})${t.nomen}(?!\\p{L})`, "iu")) }))
    .filter((x) => x.i >= 0).sort((a, b) => a.i - b.i);
  return funde.map((x) => x.t);
}

/** Eine eingebaute Lehre gehört IMMER zu ihrer Fabel — erst der Wortlaut,
 *  dann die Stichwörter. Vorher entschied nur das erste passende Stichwort:
 *  „Gegen den Mächtigen hilft …" landete wegen „hilft" beim Netz statt beim
 *  Bach (gefunden vom Prüfstand Gattungswurf, 4.381.0). */
export function erkenneLehre(was: string): Schema | null {
  const w = (was || "").trim();
  if (!w) return null;
  const norm = (x: string): string => x.toLowerCase().replace(/[.!?…\s]+$/, "");
  return SCHEMATA.find((s) => s.lehre.some((l) => norm(l) === norm(w))) || SCHEMATA.find((s) => s.re.test(w)) || null;
}

const passt = (s: Schema, a: Tier, b: Tier): boolean => a.eigen.includes(s.rolleA) && b.eigen.includes(s.rolleB);

/** Schema und Rollen zu einer Tierliste — in beiden Reihenfolgen. */
export function schemaFuerTiere(tiere: Tier[], vorgabe?: Schema | null): { s: Schema; a: Tier; b: Tier } | null {
  const kandidaten: { s: Schema; a: Tier; b: Tier }[] = [];
  for (const s of vorgabe ? [vorgabe] : SCHEMATA) {
    if (tiere.length >= 2) {
      const [x, y] = tiere as [Tier, Tier];
      if (passt(s, x, y)) kandidaten.push({ s, a: x, b: y });
      if (passt(s, y, x)) kandidaten.push({ s, a: y, b: x });
    } else if (tiere.length === 1) {
      const t = tiere[0]!;
      if (t.eigen.includes(s.rolleA)) kandidaten.push({ s, a: t, b: pick(TIERE.filter((u) => u !== t && u.eigen.includes(s.rolleB))) });
      if (t.eigen.includes(s.rolleB)) kandidaten.push({ s, a: pick(TIERE.filter((u) => u !== t && u.eigen.includes(s.rolleA))), b: t });
    }
  }
  return kandidaten.length ? pick(kandidaten) : null;
}

// ── Das Blatt ───────────────────────────────────────────────────────────────

export interface Fabelblatt {
  schema: Schema;
  a: Tier; b: Tier;
  wo: string; lage: LageTyp | null;
  lehre: string;
  lehreAusEingabe: boolean;
  /** Was die Eingabe nicht hergab — für den Hinweis im Studio. */
  tiereAusEingabe: boolean;
  blick: Blick;
  werte: Record<string, string>;
}

const werteFuer = (a: Tier, b: Tier): Record<string, string> => ({
  A: a.nom, Ac: cap(a.nom), Aa: a.akk, Ad: a.dat, Ap: a.p, Apa: a.pa, Apd: a.pd, Aposs: a.poss,
  B: b.nom, Bc: cap(b.nom), Ba: b.akk, Bd: b.dat, Bp: b.p, Bpa: b.pa, Bpd: b.pd, Bposs: b.poss,
});

export function ziehFabelblatt(input: GenInput): Fabelblatt {
  const wasRoh = (input.what || "").trim();
  const vorgabe = erkenneLehre(wasRoh);
  // Vorrang: Eine erkannte Lehre bestimmt das Schema; die Tiere müssen dazu
  // passen, sonst werden sie gezogen.
  const ausTieren = schemaFuerTiere(erkenneTiere(input.who || ""), vorgabe);
  const wahl = ausTieren || (() => {
    const s = vorgabe || pick(SCHEMATA);
    const a = pick(TIERE.filter((t) => t.eigen.includes(s.rolleA)));
    const b = pick(TIERE.filter((t) => t !== a && t.eigen.includes(s.rolleB)));
    return { s, a, b };
  })();
  const woRoh = (input.where || "").trim();
  const lehre = vorgabe ? cap(wasRoh.replace(/\s+/g, " ").replace(/[\s.]*$/, "")) + (/[!?…]$/.test(wasRoh) ? "" : ".") : pick(wahl.s.lehre);
  return {
    schema: wahl.s, a: wahl.a, b: wahl.b,
    wo: woRoh ? (normWhere(woRoh) || woRoh) : pick(FABEL_ORTE), lage: woRoh ? erkenneLage(woRoh) : null,
    lehre, lehreAusEingabe: !!vorgabe, tiereAusEingabe: !!ausTieren,
    blick: blickVonTon(input.tone),
    werte: werteFuer(wahl.a, wahl.b),
  };
}

// ── Vorrat für die Länge (4.388.0) ─────────────────────────────────────────
// Gemessen an 4.386: Die Fabel hatte bei Ziel 110 wie bei Ziel 500 rund 115
// Wörter — der Regler bewegte einen einzigen Satz. Eine Fabel bleibt kurz;
// aber zwischen knapp und ausgemalt liegt Platz. Diese Sätze passen zu jeder
// der Fabeln: ein Porträt je Tier aus seiner Eigenschaft, der Ort, die
// Zeugen. Sie kommen der Reihe nach dazu, bis das Wortziel erreicht ist.
const PORTRAET: Record<Eigenschaft, string[]> = {
  list: ["{N} war bekannt dafür, dass {p} für jede Tür einen Schlüssel fand.", "{N} kam immer zu dem, was {p} wollte, und selten auf geradem Weg."],
  eitel: ["{N} putzte sich jeden Morgen, bevor {p} irgendetwas anderes tat.", "{N} hörte nichts lieber als das, was man über {pa} sagte."],
  fleiss: ["{N} stand vor allen anderen auf und ging nach allen anderen schlafen.", "{N} ließ keinen Tag aus."],
  sorglos: ["{N} dachte nie weiter als bis zum Abend.", "{N} nahm jeden Tag, wie er kam."],
  stark: ["{N} fürchtete niemanden, und alle wussten es.", "{N} musste nie zweimal bitten."],
  klein: ["{N} war so klein, dass man {pa} leicht übersah.", "Von {d} nahm kaum jemand Notiz."],
  beharrlich: ["{N} ließ sich von nichts aus der Ruhe bringen.", "{N} fing nichts an, was {p} nicht zu Ende brachte."],
  hochmut: ["{N} hielt sich für schneller als den Wind.", "{N} hatte noch nie verloren und hielt das für ein Gesetz."],
  gier: ["{N} hatte immer Hunger, auch wenn {p} satt war.", "{N} nahm, was {p} bekommen konnte."],
  schwach: ["{N} tat keinem etwas und rechnete damit, dass es umgekehrt genauso war.", "{N} war noch nicht lange auf der Welt."],
  schnabel: ["{N} war stolz auf seinen langen Schnabel.", "{N} aß langsam und mit Bedacht."],
  schwarz: ["{N} war schwarz vom Schnabel bis zum Schwanz und fand das zu wenig.", "{N} sah gern den Bunten nach."],
  pracht: ["{N} trug ein Rad aus hundert Augen und wusste es.", "{N} zeigte sich gern und oft."],
  neid: ["{N} wollte immer sein, was {p} gerade sah.", "{N} fand sich selbst zu klein."],
  gross: ["{N} kaute und sah niemanden an.", "{N} war so breit wie ein Heuwagen."],
  verwoehnt: ["{N} kannte nur gedeckte Tische.", "{N} hatte noch nie nach Essen suchen müssen."],
  genuegsam: ["{N} brauchte nicht viel und hatte es.", "{N} schlief gut."],
};
const ORT_SATZ = ["Es war ein stiller Ort, und jeder kannte jeden.", "Dort geschah selten etwas, worüber man lange sprach.", "Ein Tag war wie der andere."];
const ZEUGEN = ["Am Abend wussten es alle.", "Noch im nächsten Jahr erzählte man sich davon.", "Wer dabei gewesen war, vergaß es nicht."];
const portraet = (t: Tier, rolle: Eigenschaft): string =>
  pick(PORTRAET[rolle]).replace(/\{N\}/g, cap(t.nom)).replace(/\{p\}/g, t.p).replace(/\{pa\}/g, t.pa).replace(/\{d\}/g, t.dat);
const worte = (x: string): number => (x.match(/[A-Za-zÄÖÜäöüß]+/g) || []).length;
interface FSatz { s: string; rang?: number }

// ── Der Bau ─────────────────────────────────────────────────────────────────

export interface FabelErgebnis { text: string; fb: Fabelblatt; motiv?: string }

export function buildFabel(input: GenInput, bank?: Partial<Bank>): FabelErgebnis {
  const fb = ziehFabelblatt(input);
  const W = fb.werte, s = fb.schema;
  const F = (x: string): string => fuelle(x, W);
  const mat = utopieMaterial(bank, fb.lage);
  const motiv = mat.motive.length ? pick(mat.motive) : undefined;
  const ziel = Number.isFinite(input.lenTarget as number) ? (input.lenTarget as number) : 110;
  const requisit = mat.requisiten.length ? pick(mat.requisiten) : undefined;

  // Pflichtsätze ohne Rang; die übrigen kommen nach Rang dazu, bis das
  // Wortziel erreicht ist. Rang 1 ist der eine Satz, den es vorher gab.
  const eingang: FSatz[] = [
    { s: `${cap(fb.a.ein)} und ${fb.b.ein} lebten ${fb.wo}.` },
    { s: pick(ORT_SATZ), rang: 4 },
    ...(motiv ? [{ s: `Nicht weit davon: ${motiv}.` }] : []),
    ...(requisit ? [{ s: `Am Wegrand lag ${requisit}, und niemand fragte danach.`, rang: 6 }] : []),
    { s: portraet(fb.a, s.rolleA), rang: 2 },
    { s: portraet(fb.b, s.rolleB), rang: 3 },
    ...s.lage.map((x) => ({ s: F(x) })),
  ];
  const rede: FSatz[] = s.rede.map((x) => ({ s: F(x) }));
  const wende: FSatz[] = [...s.wende.map((x) => ({ s: F(x) })), { s: s.extra, rang: 1 }, { s: pick(ZEUGEN), rang: 5 }];
  const lehre: FSatz[] = [{ s: fuelle(LEHRE_RAHMEN[fb.blick], { L: fb.lehre }) }];
  const abschnitte = [eingang, rede, wende, lehre];
  const an = new Set<FSatz>(abschnitte.flat().filter((x) => x.rang === undefined));
  const zaehle = (): number => [...an].reduce((n, x) => n + worte(x.s), 0);
  for (const k of abschnitte.flat().filter((x) => x.rang !== undefined).sort((a, b) => a.rang! - b.rang!)) { if (zaehle() >= ziel) break; an.add(k); }
  const text = abschnitte.map((a) => a.filter((x) => an.has(x)).map((x) => x.s).join(" ")).join("\n\n");
  return { text, fb, motiv };
}

/** Titel: „Der Fuchs und der Rabe". */
export const fabelTitel = (fb: Fabelblatt): string => `${cap(fb.a.nom)} und ${fb.b.nom}`;

/** Derselbe Titel aus dem Text — das Studio hat nur den Text. */
export function fabelTitelAusText(text: string): string {
  const m = (text || "").match(/^(?:Ein|Eine) (\p{L}+) und (?:ein|eine) (\p{L}+) lebten/u);
  if (!m) return "";
  const a = TIERE.find((t) => t.nomen === m[1]), b = TIERE.find((t) => t.nomen === m[2]);
  return a && b ? `${cap(a.nom)} und ${b.nom}` : "";
}

// ── Prüfung ─────────────────────────────────────────────────────────────────

/** Prüft eine Fabel. Das Schema wird aus der HANDLUNG gelesen — aus der Wende
 *  im Text —, nicht aus dem Blatt; nur so fällt eine Lehre auf, die zu einer
 *  anderen Fabel gehört. */
export function pruefeFabel(text: string, fb: Fabelblatt, bank?: Partial<Bank>): string[] {
  const b: string[] = [];
  const abs = text.split("\n\n");
  if (abs.length !== 4) b.push("Nicht vier Abschnitte");
  if (/[{}]|\bundefined\b|\bnull\b|\bNaN\b/.test(text)) b.push("Platzhalter oder Leerwert im Text");
  // Welche Fabel erzählt der Text? Die erste Zeile der Wende verrät es.
  const erzaehlt = SCHEMATA.filter((s) => text.includes(fuelle(s.wende[0]!, fb.werte)));
  if (erzaehlt.length !== 1) b.push(`Handlung keinem Schema eindeutig zuzuordnen (${erzaehlt.length})`);
  const sch = erzaehlt[0];
  // Die Lehre: letzter Abschnitt, im Rahmen des Blicks, und sie gehört zur Handlung.
  const letzter = abs[abs.length - 1] || "";
  if (letzter !== fuelle(LEHRE_RAHMEN[fb.blick], { L: fb.lehre })) b.push("Lehre steht nicht im Rahmen am Ende");
  if (sch) {
    const gehoert = sch.lehre.includes(fb.lehre) || (fb.lehreAusEingabe && sch.re.test(fb.lehre));
    if (!gehoert) b.push(`Lehre passt nicht zur Handlung „${sch.name}"`);
    for (const s of SCHEMATA) if (s !== sch) for (const l of s.lehre) if (letzter.includes(l)) b.push(`Lehre aus der Fabel „${s.name}" unter „${sch.name}"`);
    // Die Rollen: Die Tiere müssen die Eigenschaft haben, die die Handlung verlangt.
    if (!fb.a.eigen.includes(sch.rolleA)) b.push(`${cap(fb.a.nom)} hat nicht die Eigenschaft „${sch.rolleA}"`);
    if (!fb.b.eigen.includes(sch.rolleB)) b.push(`${cap(fb.b.nom)} hat nicht die Eigenschaft „${sch.rolleB}"`);
  }
  // Die Tiere: unbestimmt eingeführt, dann bestimmt — jedes mindestens zweimal.
  const klein = text.toLowerCase();
  for (const t of [fb.a, fb.b]) {
    const iEin = klein.indexOf(t.ein.toLowerCase());
    if (iEin < 0) b.push(`${t.nomen} nicht eingeführt`);
    const formen = new Set([t.nom, t.akk, t.dat].map((x) => x.toLowerCase()));
    let z = 0; for (const x of formen) z += klein.split(x).length - 1;
    if (z < 2) b.push(`${t.nomen} seltener als zweimal genannt`);
    // Schwache Nomen: „den Löwe", „dem Hase" sind falsch.
    if (t.schwach && new RegExp(`(?<!\\p{L})(den|dem|des) ${t.nomen}(?!\\p{L})`, "u").test(text)) b.push(`Falscher Fall: „${t.nomen}" schwach gebeugt`);
  }
  // Preset-Motiv aus genau dieser Bank.
  if (bank) {
    const mat = utopieMaterial(bank, fb.lage);
    const x = text.match(/Nicht weit davon: ([^.]+)\./);
    if (x && !mat.motive.includes(x[1]!)) b.push(`Motiv nicht aus dem Preset: „${x[1]}"`);
    if (!x && mat.motive.length) b.push("Preset ohne Wirkung: kein Motiv im Text");
  }
  // Satzbau.
  if (/ {2}|\s[,.;:!?]/.test(text)) b.push("Leerzeichen vor Satzzeichen oder doppelt");
  const dw = text.replace(/(?<!\p{L})(der|die|das|den|dem) \1(?!\p{L})/giu, "$1").match(/(?<!\p{L})(\p{L}+) \1(?!\p{L})/iu);
  if (dw) b.push(`Doppeltes Wort: „${dw[0]}"`);
  if (/[.!?]\s+[a-zäöü]/.test(text.replace(/„[^“]*“/g, "„…“"))) b.push("Satzanfang klein");
  if (/\.\.|\.“\./.test(text)) b.push("Doppelter Punkt");
  return b;
}
