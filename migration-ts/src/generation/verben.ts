// Verb-Morphologie der Divergenzmaschine — Paradigmen statt Vollformen.
//
// Die Maschine kennt Verben in der dritten Person Singular („bemerkt", „trägt")
// und braucht sie in der ersten, zweiten und im Plural, wenn die Perspektive
// wechselt oder ein Titel gebaut wird. Bisher rieten Heuristiken („-t weg,
// -st dran") und eine handgepflegte Tabelle (VERB_CONJ, 311 Einträge). Beides
// scheitert an starken Verben („trägst" ← „trägt", aber „wir tragen"), an
// Stämmen auf -t/-d („wartest", nicht „wartst"), an Zischlauten („du heißt",
// nicht „heißst") und an -eln/-ern („ich handle", „wir handeln").
//
// Hier steht stattdessen das, was das Deutsche wirklich braucht:
//
//   1. Eine KLEINE Liste der Verben mit Vokalwechsel oder Unregelmäßigkeit
//      im Präsens (a→ä, e→i/ie, sein/haben/wissen/werden, Modalverben) —
//      rund siebzig Grundverben. Alles andere ist im Präsens regelmäßig,
//      auch die starken Verben ohne Wechsel („geht", „kommt", „bleibt").
//   2. Präfixe: „verspricht" ist „ver" + „spricht", „aufgibt" ist „auf" +
//      „gibt". Ein Präfix vor einem Grundverb erbt dessen Paradigma.
//   3. Regeln für die regelmäßigen Verben aus der Form der dritten Person:
//      Bindevokal (-et → -est), Zischlaut (-ßt/-st/-zt/-xt → du = er),
//      -eln/-ern (ich handle, wir handeln), sonst Stamm + e/st/en.
//   4. Eine Sperrliste für Wörter auf -t, die keine Verben sind (alt,
//      jetzt, dort), damit der Rückfall nichts Falsches beugt.
//
// Das ist der erste Schritt der Umstellung „Morphologie statt Heuristik"
// (Vorschlag 2 aus dem Gespräch). Die Datei ist klein (unter 10 kB), lädt
// mit der App und bleibt offline. Wörter, die hier nicht stehen und keine
// Verbform sind, fallen auf null zurück — der Aufrufer lässt sie dann in
// Ruhe.

export type Person = "ich" | "du" | "er" | "wir" | "ihr" | "sie";

/** Grundverben mit Vokalwechsel oder Unregelmäßigkeit im Präsens.
 *  Schlüssel: dritte Person Singular. Wert: [ich, du, wir] — „ihr" ist
 *  immer die Stammform ohne Wechsel (ihr tragt, ihr gebt, ihr seid). */
const STARK: Record<string, [string, string, string, string?]> = {
  // sein · haben · werden · wissen · tun · Modalverben
  ist: ["bin", "bist", "sind", "seid"], hat: ["habe", "hast", "haben", "habt"],
  wird: ["werde", "wirst", "werden", "werdet"], weiß: ["weiß", "weißt", "wissen", "wisst"],
  tut: ["tue", "tust", "tun", "tut"], kann: ["kann", "kannst", "können", "könnt"],
  muss: ["muss", "musst", "müssen", "müsst"], will: ["will", "willst", "wollen", "wollt"],
  soll: ["soll", "sollst", "sollen", "sollt"], darf: ["darf", "darfst", "dürfen", "dürft"],
  mag: ["mag", "magst", "mögen", "mögt"],
  // a → ä
  hält: ["halte", "hältst", "halten", "haltet"], fällt: ["falle", "fällst", "fallen", "fallt"],
  trägt: ["trage", "trägst", "tragen", "tragt"], läuft: ["laufe", "läufst", "laufen", "lauft"],
  schläft: ["schlafe", "schläfst", "schlafen", "schlaft"], fängt: ["fange", "fängst", "fangen", "fangt"],
  lässt: ["lasse", "lässt", "lassen", "lasst"], wächst: ["wachse", "wächst", "wachsen", "wachst"],
  gräbt: ["grabe", "gräbst", "graben", "grabt"], schlägt: ["schlage", "schlägst", "schlagen", "schlagt"],
  rät: ["rate", "rätst", "raten", "ratet"], bläst: ["blase", "bläst", "blasen", "blast"],
  stößt: ["stoße", "stößt", "stoßen", "stoßt"], fährt: ["fahre", "fährst", "fahren", "fahrt"],
  wäscht: ["wasche", "wäschst", "waschen", "wascht"], lädt: ["lade", "lädst", "laden", "ladet"],
  säuft: ["saufe", "säufst", "saufen", "sauft"],
  // e → i / ie
  gibt: ["gebe", "gibst", "geben", "gebt"], nimmt: ["nehme", "nimmst", "nehmen", "nehmt"],
  spricht: ["spreche", "sprichst", "sprechen", "sprecht"], bricht: ["breche", "brichst", "brechen", "brecht"],
  sieht: ["sehe", "siehst", "sehen", "seht"], liest: ["lese", "liest", "lesen", "lest"],
  isst: ["esse", "isst", "essen", "esst"], frisst: ["fresse", "frisst", "fressen", "fresst"],
  misst: ["messe", "misst", "messen", "messt"], vergisst: ["vergesse", "vergisst", "vergessen", "vergesst"],
  hilft: ["helfe", "hilfst", "helfen", "helft"], stirbt: ["sterbe", "stirbst", "sterben", "sterbt"],
  wirft: ["werfe", "wirfst", "werfen", "werft"], trifft: ["treffe", "triffst", "treffen", "trefft"],
  gilt: ["gelte", "giltst", "gelten", "geltet"], tritt: ["trete", "trittst", "treten", "tretet"],
  birgt: ["berge", "birgst", "bergen", "bergt"], quillt: ["quelle", "quillst", "quellen", "quellt"],
  schilt: ["schelte", "schiltst", "schelten", "scheltet"], ficht: ["fechte", "fichtst", "fechten", "fechtet"],
  flicht: ["flechte", "flichtst", "flechten", "flechtet"], verdirbt: ["verderbe", "verdirbst", "verderben", "verderbt"],
  wirbt: ["werbe", "wirbst", "werben", "werbt"], erschrickt: ["erschrecke", "erschrickst", "erschrecken", "erschreckt"],
  sticht: ["steche", "stichst", "stechen", "stecht"], schmilzt: ["schmelze", "schmilzt", "schmelzen", "schmelzt"],
  befiehlt: ["befehle", "befiehlst", "befehlen", "befehlt"], stiehlt: ["stehle", "stiehlst", "stehlen", "stehlt"],
  empfiehlt: ["empfehle", "empfiehlst", "empfehlen", "empfehlt"], geschieht: ["geschehe", "geschiehst", "geschehen", "gescheht"],
  gebiert: ["gebäre", "gebierst", "gebären", "gebärt"], schwillt: ["schwelle", "schwillst", "schwellen", "schwellt"],
};

/** Präfixe, mit denen ein Grundverb sein Paradigma teilt. Längere zuerst. */
const PRAEFIXE = ["zusammen", "zurück", "wieder", "gegen", "hinter", "durch", "unter", "über", "voran", "vorbei",
  "heraus", "herein", "hinaus", "hinein", "herum", "hinauf", "hinab", "herab", "empor", "fort", "los", "weg", "fest",
  "her", "hin", "ver", "ent", "emp", "miss", "zer", "be", "er", "ge", "an", "ab", "auf", "aus", "ein", "mit", "nach",
  "vor", "zu", "um", "bei", "da", "wider"];

/** Wörter auf -t, die keine Verbform sind: Adjektive, Adverbien, Partikeln.
 *  NICHT hier: Partizipien, die zugleich dritte Person sind („bewegt",
 *  „verlangt", „bestimmt", „besetzt") — im Zweifel Verb, der Satzbau entscheidet.
 *  Nicht vollständig — aber die häufigen, die im Text neben einem Subjekt
 *  stehen und sonst „dorten" oder „kalst" würden. */
export const KEIN_VERB = new Set(["alt", "kalt", "laut", "bunt", "hart", "zart", "satt", "glatt", "weit", "breit",
  "rot", "tot", "gut", "spät", "echt", "leicht", "dicht", "recht", "schlecht", "nackt", "fest", "letzt", "jetzt",
  "sanft", "ernst", "wert", "seit", "statt", "samt", "nicht", "mit", "seid", "zuletzt", "zuerst", "oft", "fast",
  "erst", "sonst", "meist", "direkt", "dort", "fort", "sofort", "selbst", "vielleicht", "überhaupt", "bereit",
  "gerecht", "perfekt", "exakt", "absolut", "gesamt", "komplett", "verrückt", "bekannt", "geschickt",
  "welt", "zeit", "nacht", "stadt", "acht", "licht", "wort", "ort", "blut", "brot", "mut", "hut",
  "gebet", "geist", "gott", "kraft", "luft", "haut", "haft", "gift", "schrift", "frucht", "flucht", "sicht",
  "pflicht", "angst", "kunst", "dienst", "frost", "post", "ost", "west", "rest", "test", "text", "wüst",
  "getrennt", "gemischt", "gebrannt", "verschwunden", "gewohnt",
  "gelaunt", "berühmt", "geliebt", "gelebt", "gedacht", "gemacht", "gebracht", "gesagt",
  "gesucht", "gehabt", "gewusst", "gekannt", "genannt", "benannt", "gewollt",
  "verboten", "geöffnet", "ungeahnt",
  "gestern", "heut", "abrupt", "adäquat", "privat", "intakt", "korrekt", "konkret", "moderat", "elegant",
  "brillant", "tolerant", "relevant", "markant", "rasant", "galant", "latent", "dezent", "prominent", "kompetent",
  "konsequent", "permanent", "evident", "eloquent", "intelligent", "gespannt", "entspannt", "gewandt", "verwandt",
  "bewusst", "unbewusst", "robust", "abstrakt", "kompakt", "exakt", "defekt", "perfekt", "insgesamt", "total"]);

const SIBILANT = /(s|ß|z|x|tz|ss)$/;
const GE_VERBEN = /^ge(ht|nügt|hört|horcht|lingt|winnt|langt|schieht|steht|rät|nießt|wöhnt|fährdet|währt|stattet|staltet|denkt|bietet|braucht|hörcht|nest|reicht|dulde?t|fällt|deiht|lobt|leitet|langt|winnt|behrt|bärt|fried[e]?t|fällt|lüstet|mahnt|rinnt|hört)$/;

/** Zerlegt eine Form in [Präfix, Grundform], wenn die Grundform stark ist. */
function starkMitPraefix(form: string): [string, [string, string, string, string?]] | null {
  if (STARK[form]) return ["", STARK[form]!];
  for (const p of PRAEFIXE) {
    if (form.startsWith(p) && form.length > p.length + 2) {
      const rest = form.slice(p.length);
      if (STARK[rest]) return [p, STARK[rest]!];
    }
  }
  return null;
}

/** Ist das Wort (in Kleinschreibung) plausibel eine Verbform der 3. Person
 *  Singular Präsens? Stark: sicher. Sonst: endet auf -t, mindestens drei
 *  Buchstaben, nicht in der Sperrliste, kein Partizip („ge…t", „…iert" als
 *  Partizip lässt sich nicht von „er studiert" trennen — bleibt Verb). */
// ── Infinitiv-Lexikon: IST das ein Verb? ─────────────────────────────────────
// Die vierte Tabelle (verblex.data.ts). Die drei anderen beugen ein Verb, das
// man ihnen gibt; diese sagt, ob ein Wort eines ist. Präfixe werden beim
// Nachschlagen abgestreift (aufhören → hören, verstehen → stehen).
import { VERB_INFINITIVE, VERB_PRAEFIXE, PAST2PRES } from "./verblex.data";

/** Kennt das Lexikon diesen Infinitiv (auch mit Präfix)? */
export function kenntInfinitiv(wort: string): boolean {
  const w = wort.toLowerCase();
  if (VERB_INFINITIVE.has(w)) return true;
  for (const p of VERB_PRAEFIXE) {
    if (w.startsWith(p) && w.length > p.length + 3 && VERB_INFINITIVE.has(w.slice(p.length))) return true;
  }
  return false;
}

/** Zu welchem Infinitiv gehört dieser Stamm? „kipp" → „kippen", „hand(e)l" →
 *  „handeln", „änder" → „ändern", „wart" → „warten". null = keiner bekannt. */
export function infinitivZuStamm(stamm: string): string | null {
  const s = stamm.toLowerCase();
  if (!s) return null;
  const kandidaten = [s + "en", s + "n", s + "eln", s + "ern"];
  if (/e[lr]$/.test(s)) kandidaten.unshift(s + "n");
  // Umlaut-Stämme der starken Verben (fällt → fallen, trägt → tragen, liest → lesen)
  const st = starkMitPraefix(s + "t");
  if (st) return st[0] + st[1][2];
  for (const k of kandidaten) if (kenntInfinitiv(k)) return k;
  return null;
}

/** Ist dieses Wort eine Form (Präsens, Präteritum, Infinitiv, Partizip) eines
 *  Verbs aus dem Lexikon? Strenger als istVerbform, das über Endungen rät. */
export function istLexikonVerb(wort: string): boolean {
  const w = wort.toLowerCase().replace(/[^a-zäöüß]/g, "");
  if (!w || w.length < 3) return false;
  if (starkMitPraefix(w)) return true;
  if (kenntInfinitiv(w)) return true;
  if (PAST2PRES[w]) return true;                                  // starke Präteritumformen (schwieg, hielten)
  if (/^(bin|bist|sind|seid|habe|hast|habt|werde|wirst|werdet|wäre|wären|hätte|hätten|würde|würden|sei|seien)$/.test(w)) return true;
  // Jede Endung einzeln abtrennen — „bestreitet" ist „bestreit"+„et", nicht
  // „bestrei"+„tet"; die kürzeste Zerlegung wäre die falsche.
  for (const suffix of ["etest", "test", "eten", "ten", "ete", "te", "est", "st", "et", "en", "t", "e", "tet"]) {
    if (!w.endsWith(suffix) || w.length - suffix.length < 2) continue;
    const st = w.slice(0, -suffix.length);
    if (/ier$/.test(st)) return true;                              // alle -ieren-Verben
    if (infinitivZuStamm(st)) return true;
  }
  // Partizip II: ge-…-t / ge-…-en, auch mit Präfix (aufgehört); ohne ge bei
  // untrennbaren Präfixen (verstanden, begonnen) über die Präteritum-Tabelle
  const pz = w.match(/^(?:[a-zäöü]{2,8})?ge(.+?)(?:t|en)$/);
  if (pz && infinitivZuStamm(pz[1]!)) return true;
  return false;
}

export function istVerbform(wort: string): boolean {
  const w = wort.toLowerCase();
  if (starkMitPraefix(w)) return true;
  if (KEIN_VERB.has(w)) return false;
  // Das Lexikon zählt als Zeugnis: Eine Form eines bekannten Verbs ist eine
  // Verbform, auch wenn die Endung nicht auf -t ausgeht („kippten").
  if (/^[a-zäöüß]{3,}(t|st|e|en)$/.test(w) && istLexikonVerb(w)) return true;
  if (!/^[a-zäöüß]{3,}t$/.test(w)) return false;
  // „gebracht", „gesagt", „gedacht" sind Partizipien, keine Verbformen;
  // „gehört", „gelingt", „genügt" sind Verben mit ge-Stamm. Die Liste der
  // echten ge-Verben ist kurz — alles andere auf ge…t gilt als Partizip.
  if (/^ge[a-zäöüß]{2,}t$/.test(w)) return GE_VERBEN.test(w);
  return true;
}

/** Beugt eine Verbform der 3. Person Singular auf die gewünschte Person.
 *  null, wenn das Wort keine Verbform ist. Großschreibung bleibt erhalten. */
export function beugeVerb(form3: string, person: Person): string | null {
  const gross = /^[A-ZÄÖÜ]/.test(form3);
  const w = form3.toLowerCase();
  const fertig = (s: string): string => (gross ? s.charAt(0).toUpperCase() + s.slice(1) : s);
  if (person === "er" || person === "sie") return istVerbform(w) ? form3 : null;
  const st = starkMitPraefix(w);
  if (st) {
    const [p, [ich, du, wir, ihr]] = st;
    const f = person === "ich" ? ich : person === "du" ? du : person === "wir" ? wir : (ihr || (wir.replace(/e?n$/, "t")));
    return fertig(p + f);
  }
  if (!istVerbform(w)) return null;
  // Regelmäßig: Stamm aus der dritten Person gewinnen.
  let stamm = w.slice(0, -1);                                  // ohne -t
  const bindevokal = /[td]et$/.test(w) || /(chn|ffn|gn|tm|dm|ckn|kn)et$/.test(w); // wartet, redet, öffnet, rechnet, atmet
  if (bindevokal) stamm = w.slice(0, -2);                      // ohne -et
  if (person === "ihr") return fertig(w);                      // ihr wartet, ihr geht, ihr handelt
  if (person === "wir") {
    if (/e[lr]$/.test(stamm)) return fertig(stamm + "n");      // handeln, ändern
    return fertig(stamm + "en");
  }
  if (person === "du") {
    if (bindevokal) return fertig(stamm + "est");              // wartest, öffnest
    if (SIBILANT.test(stamm)) return fertig(w);                // du heißt, du sitzt, du reist
    return fertig(stamm + "st");
  }
  // ich
  if (/el$/.test(stamm)) return fertig(stamm.slice(0, -2) + "le"); // handle, sammle
  return fertig(stamm + "e");                                   // warte, gehe, ändere
}

/** Alle vier Personen auf einmal — für Tabellen und Prüfstände. */
export function paradigma(form3: string): { ich: string; du: string; er: string; wir: string; ihr: string } | null {
  const ich = beugeVerb(form3, "ich"); if (ich === null) return null;
  return { ich, du: beugeVerb(form3, "du")!, er: form3, wir: beugeVerb(form3, "wir")!, ihr: beugeVerb(form3, "ihr")! };
}
