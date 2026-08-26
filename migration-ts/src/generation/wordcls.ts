// "Was passiert"-Analyse: Leitverb abtrennen, Satz-Erkennung.
import { clean } from "../text-utils";
import { VERB_CONJ, INFINITIVE_VERBS } from "./verbconj.data";
import { NOUN_GENDER } from "./nouns.data";
import { VERB_TOKEN_RE } from "./verbconj";

/** Woerter, die eine GATTUNGSperson bezeichnen (Erwachsene, Bote, Kind …).
 *  Eine kuratierte Liste statt einer Endungs-Heuristik: Wortendungen sind im
 *  Deutschen als Wortart-Merkmal unzuverlaessig, und ein Name wie „Ottilie"
 *  darf nie hineinfallen. Frueher lag sie in faktenblatt.ts; normWho braucht
 *  sie jetzt auch. */
export const PERSON_NOMEN = /(jugendliche|jugendlicher|erwachsene|erwachsener|alte|alter|kranke|kranker|gefangene|gefangener|angestellte|angestellter|beamte|beamter|verwandte|verwandter|bekannte|bekannter|vorsitzende|vorsitzender|abgeordnete|abgeordneter|obdachlose|obdachloser|pensionär|pensionärin|rentner|rentnerin|zeuge|zeugin|täter|täterin|opfer|passant|passantin|kellner|kellnerin|pfarrer|pfarrerin|richter|richterin|händler|händlerin|bauer|bäuerin|förster|försterin|schneider|schneiderin|weber|weberin|uhrmacher|uhrmacherin|archivar|archivarin|übersetzer|übersetzerin|magd|knecht|ritter|ritterin|nonne|mönch|clown|boxer|boxerin|grabräuber|grabräuberin|mädchen|junge|kind|frau|mann|männer|dame|herr|schüler|schülerin|lehrer|lehrerin|wächter|wächterin|arzt|ärztin|bäcker|bäckerin|gärtner|gärtnerin|fischer|fischerin|bote|botin|wanderer|wanderin|reisende|reisender|nachbar|nachbarin|greis|greisin|witwe|witwer|zwilling|bruder|schwester|sohn|tochter|vater|mutter|onkel|tante|neffe|nichte|freund|freundin|gast|fremde|fremder|meister|meisterin|gesell|lehrling|soldat|soldatin|matrose|matrosin|pilot|pilotin|köchin|koch|wirt|wirtin|müller|müllerin|schmied|schmiedin|hirte|hirtin|jäger|jägerin|sammler|sammlerin)$/i;

export interface LeadVerb { verb: string | null; rest: string; isInfinitiveLed?: boolean; }

// Funktionswörter auf -en/-ern/-eln, die KEINE Infinitive sind (Artikel, Pronomen,
// Präpositionen, Adverbien). Ohne diese Liste würde "einen Kran …" als Verb gelesen.
const NOT_INFINITIVE = new Set([
  "einen", "keinen", "seinen", "ihren", "deinen", "unseren", "euren", "diesen", "jenen", "denen", "welchen",
  "allen", "vielen", "beiden", "manchen", "jeden", "solchen", "anderen", "eigenen", "letzten", "ersten",
  "oben", "unten", "innen", "außen", "hinten", "vorn", "vorne", "neben", "eben", "gegen", "wegen", "gegenüber",
  "morgen", "übermorgen", "wochen", "stunden", "sieben", "zehn", "trotzen", "während", "dessen", "deren", "hinein",
]);
// Kleingeschriebene Woerter auf -t, die KEINE Verben sind. Ein deutscher
// Aussagesatz beginnt gross; steht am Anfang der "Was passiert?"-Angabe ein
// kleingeschriebenes Wort, ist es fast immer ein Verb. Die Ausnahmen sind
// Adjektive und Adverbien - eine geschlossene, aufzaehlbare Menge.
const NICHT_VERB_T = new Set([
  "nicht", "jetzt", "erst", "fast", "sonst", "meist", "zuerst", "zuletzt", "selbst", "sogar",
  "seit", "samt", "statt", "mit", "zeit", "trotz", "laut", "gerecht",
  "sanft", "dicht", "leicht", "schlecht", "recht", "direkt", "echt", "exakt", "strikt",
  "perfekt", "konkret", "komplett", "kaputt", "sacht", "glatt", "platt", "nackt", "satt",
  "breit", "bereit", "weit", "spät", "hart", "zart", "kalt", "alt", "bunt", "rot", "gut", "oft",
  "still", "halt", "gesamt", "insgesamt", "bekannt", "verwandt", "berühmt",
  "sofort", "vielleicht", "überhaupt", "zumindest", "höchst", "äußerst", "mindest",
  "bestimmt", "unbedingt", "ernst", "einst", "längst", "jüngst", "umsonst",
  "weltweit", "korrekt", "intakt", "kompakt", "prompt", "getrennt",
  // vierbuchstabige Adjektive und Adverbien auf -t
  "bunt", "echt", "fest", "hart", "kalt", "laut", "matt", "nett", "satt", "weit",
  "zart", "fett", "halt", "wert", "dort", "fort", "stet", "sart",
]);

/** Hat das erste Wort die Form einer finiten Verbform der 3. Person Singular?
 *  Reine Formfrage - ob es semantisch passt, entscheidet der Aufrufer nicht. */
function wirktFinit(w: string): boolean {
  if (w.length < 4 || NICHT_VERB_T.has(w)) return false;
  if (/^ge[a-zäöüß]+t$/.test(w)) return false;      // Partizip: "gesehen", "gemacht"
  return /^[a-zäöüß]+[^aeiouäöü]t$/.test(w) || /^[a-zäöüß]+et$/.test(w);
}

/** Erkennt einen Infinitiv am Satzanfang — auch außerhalb der kuratierten Liste.
 *  Deutsche Infinitive enden auf -en/-eln/-ern; ausgeschlossen werden Funktionswörter
 *  und bekannte Nomen (die Groß-/Kleinschreibung prüft der Aufrufer). */
function looksLikeInfinitive(w: string): boolean {
  if (INFINITIVE_VERBS.has(w)) return true;
  if (w.length < 5 || NOT_INFINITIVE.has(w) || NOUN_GENDER[w]) return false;
  return /(?:[a-zäöüß]{3,})(?:en|ern|eln)$/.test(w);
}

export function extractLeadVerb(text: string): LeadVerb {
  const s = clean(text);
  if (!s) return { verb: null, rest: s };
  // Ein Komma direkt hinter dem Verb („bringt, was niemand hören will") ist
  // erlaubt; es bleibt am Rest, ohne Leerzeichen davor: Die Vorlagen bauen
  // „⟨Figur⟩ ⟨Verb⟩ ⟨Rest⟩" mit einem Zwischenraum, und der Schliff zieht
  // das Leerzeichen vor dem Komma wieder ein. Vorher fiel „bringt," durch das
  // Muster, das Leitverb blieb null, und der Kern galt als ganzer Satz — im
  // Blatt stand „Bringt, was niemand hören will." als eigener Satz, in 70 %
  // der Läufe.
  const m0 = s.match(/^([A-Za-zÄÖÜäöüß]+)(,?)\s+(.+)$/);
  if (!m0) return { verb: null, rest: s };
  const m: [string, string, string] = [m0[0]!, m0[1]!, (m0[2] ? ", " : "") + m0[3]!];
  const raw = m[1]!;
  const w = raw.toLowerCase();
  if (VERB_CONJ[w]) return { verb: raw, rest: m[2]! };
  // Nur kleingeschriebene Wörter können hier Infinitive sein (Nomen sind groß).
  if (/^[a-zäöüß]/.test(raw) && looksLikeInfinitive(w)) {
    return { verb: null, rest: `${m[2]} ${w}`, isInfinitiveLed: true };
  }
  if (/^[a-zäöüß]+iert$/.test(w)) return { verb: raw, rest: m[2]! };
  // B.3: Formen der ersten und zweiten Person. Die Konjugationstabelle kennt nur
  // die dritte ("sieht"), deshalb blieb "sehe 9 Monde am Himmel" ohne Leitverb -
  // und wurde als Nominalphrase hinter "sucht" gehaengt: "Du suchst sehe 9 Monde".
  // Die Endung -e ist von Adjektiven nicht zu trennen, -st dagegen fast eindeutig.
  // Deshalb hier eine gepruefte Liste statt einer Endungsregel.
  // Nicht die Rohform zurueckgeben, sondern die dritte Person: Die Vorlagen bauen
  // "⟨Figur⟩ ⟨Verb⟩ ⟨Rest⟩", und "Murx sehe 9 Monde" waere so falsch wie vorher
  // "Murx will sehe 9 Monde". Die Perspektive konjugiert danach weiter.
  const dritte = ICH_DU_ZU_ER[w];
  if (dritte && /^[a-zäöüß]/.test(raw)) return { verb: dritte, rest: m[2]! };
  // Verb-erst, aber ausserhalb der Konjugationstabelle: "bekommt einen Ausweis",
  // "graebt im Schutt nach Samen". Bisher blieb das Leitverb null, der Kern ging
  // roh in die Vorlagen - so entstanden "Ich will bekommt einen Ausweis" (linear)
  // und "Denn genau das geschieht: bekommt einen Ausweis" (Rekombination), also
  // dieselbe Fehlerklasse wie "Du suchst sehe 9 Monde am Himmel". Die Tabelle zu
  // vergroessern haette nur den naechsten Fall verschoben; entscheidend ist, dass
  // ein kleingeschriebenes Wort am Anfang im Deutschen kein Satzanfang sein kann.
  if (/^[a-zäöüß]/.test(raw) && (EXTRA_FINITE_RE.test(w) || wirktFinit(w))) {
    return { verb: raw, rest: m[2]! };
  }
  return { verb: null, rest: s };
}


const ICH_DU_HAND: Record<string, string> = {
  sehe: "sieht", siehst: "sieht", gehe: "geht", gehst: "geht", komme: "kommt", kommst: "kommt",
  finde: "findet", findest: "findet", glaube: "glaubt", glaubst: "glaubt",
  lebe: "lebt", lebst: "lebt", liege: "liegt", liegst: "liegt", sitze: "sitzt",
  lese: "liest", liest: "liest", schlafe: "schläft", schläfst: "schläft",
  laufe: "läuft", läufst: "läuft", falle: "fällt", fällst: "fällt",
  breche: "bricht", brichst: "bricht", rufe: "ruft", rufst: "ruft",
  weine: "weint", weinst: "weint", lache: "lacht", lachst: "lacht",
  spüre: "spürt", spürst: "spürt", atme: "atmet", atmest: "atmet",
  singe: "singt", singst: "singt", öffne: "öffnet", öffnest: "öffnet",
  erinnere: "erinnert", erinnerst: "erinnert", erkenne: "erkennt", erkennst: "erkennt",
  zerbreche: "zerbricht", zerbrichst: "zerbricht", stolpere: "stolpert", stolperst: "stolpert",
  verharre: "verharrt", verharrst: "verharrt", wandere: "wandert", wanderst: "wandert",
  zittere: "zittert", zitterst: "zittert", flüstere: "flüstert", flüsterst: "flüstert",
  wundere: "wundert", wunderst: "wundert", zögere: "zögert", zögerst: "zögert",
  erwache: "erwacht", erwachst: "erwacht", verschwinde: "verschwindet", verschwindest: "verschwindet",
  begreife: "begreift", begreifst: "begreift", verstehe: "versteht", verstehst: "versteht",
  bleibe: "bleibt", bleibst: "bleibt", ziehe: "zieht", ziehst: "zieht",
};

/**
 * Formen der 1. und 2. Person mit ihrer 3.-Person-Entsprechung. Der grosse Teil
 * wird aus VERB_CONJ ERZEUGT statt gepflegt: Die Tabelle enthaelt zu jedem der
 * rund 80 Verben ohnehin die Formen fuer ich, du, wir und ihr. Eine Handliste
 * bleibt fuer Verben, die dort fehlen. So waechst die Erkennung automatisch mit,
 * wenn die Konjugationstabelle waechst - und es steht nirgends eine Endungsregel,
 * die "leise" oder "eigene" fuer Verben halten koennte.
 */
export const ICH_DU_ZU_ER: Record<string, string> = (() => {
  const m: Record<string, string> = {};
  for (const [dritte, formen] of Object.entries(VERB_CONJ)) {
    for (const p of ["ich", "du", "wir", "ihr"] as const) {
      const f = (formen as Record<string, string>)[p];
      if (f && !m[f]) m[f] = dritte;
    }
  }
  return { ...m, ...ICH_DU_HAND };   // Handliste hat Vorrang
})();

// Kuratierte finite Verben, die NICHT in der Konjugationstabelle stehen und
// keine gängigen Nomen sind - so werden ganze Sätze wie "ein Wunder geschieht"
// oder "die Uhr tickt" korrekt als Klausel erkannt (statt hinter ein Modalverb
// gehängt zu werden).
const EXTRA_FINITE_RE = /\b(geschieht|geschehen|geschah|passiert|passieren|passierte|tickt|ticken|atmet|atmen|wächst|wachsen|wuchs|brennt|brennen|brannte|fällt|fallen|fiel|zerfällt|zerfallen|verschwindet|verschwinden|verschwand|erscheint|erscheinen|erschien|endet|enden|endete|beginnt|beginnen|begann|stirbt|sterben|starb|blüht|blühen|klopft|klopfen|flackert|flackern|zerbricht|zerbrechen|zerbrach|dreht|drehen|schweigt|schweigen|schwieg|singt|singen|sang|wandert|wandern|glüht|glühen|tanzt|tanzen|brüllt|brüllen|reagiert|reagieren|zeigt|zeigen|spricht|sprechen|sprach|antwortet|antworten|erinnert|erinnern|verändert|verändern|zittert|zittern|leuchtet|leuchten|schmilzt|schmelzen|regnet|schneit|blitzt|donnert|bebt|läuft|laufen|lief|rinnt|tropft|fließt|fließen|floss|steigt|steigen|stieg|sinkt|sinken|sank|kreist|kreisen|pulsiert|vibriert|summt|brummt|knistert|raschelt|flüstert|flüstern|schreit|schreien|schrie|weint|weinen|lacht|lachen|verglüht|verblasst|zerrinnt|wartet|warten)\b/i;

export function looksLikeFullClause(leadVerb: string | null, rest: string): boolean {
  if (leadVerb) return false;
  return VERB_TOKEN_RE.test(rest || "") || EXTRA_FINITE_RE.test(rest || "");
}

// "Wer?" in echte Personen zerlegen. Ein Komma trennt normalerweise Personen
// ("Baucis, Philemon"), aber ein nachgestellter Relativsatz, eine Präposition
// oder eine Konjunktion gehört zur VORHERIGEN Person und ist keine neue
// ("eine Nonne, die die Welt bereist hat" = eine Person).
const SP_REL = /^(der|die|das|den|dem|des|deren|dessen|welche[rsmn]?|wo|worin|woran|womit|wovon)\b/i;
const SP_CONJ = /^(als|während|weil|wenn|da|obwohl|nachdem|bevor|sodass|damit|dass|ob|indem|sobald|solange)\b/i;
const SP_PREP = /^(mit|ohne|aus|von|vom|in|im|auf|an|am|für|bei|zu|zum|zur|über|unter|vor|nach|durch|gegen|seit|um|entlang|trotz|wegen|innerhalb|außerhalb|samt|nebst|zwischen|entgegen|gemäß|laut|binnen|jenseits|diesseits)\b/i;
// Das letzte Wort muss KLEIN geschrieben sein, damit es als Verb zählt. Ohne
// diese Bedingung galt „die alten Frauen" als Relativsatz, weil „Frauen" auf
// -en endet — deutsche Verben sind klein, Nomen groß, und das ist hier die
// verlässlichste Auskunft, die die Schreibung hergibt.
// Die zweite Alternative OHNE \b: Die Wortgrenze in JavaScript ist ASCII und
// sieht zwischen „F" und „ü" eine Grenze — „Fürsten" galt dadurch als Verb
// „ürsten", und „die deutschen Fürsten" wurde für einen Relativsatz gehalten.
const SP_ENDS_VERB = /(?:\b(hat|hatte|ist|war|sind|waren|wird|wurde|wurden|kann|konnte|will|wollte|muss|musste|bleibt|blieb|kommt|kam|geht|ging)|(?:^|[^A-Za-zÄÖÜäöüß])[a-zäöüß]{2,}(?:t|te|en|st|et))\.?$/;
/** Begleiter: Wer damit anfängt, ist eine Nominalphrase — also eine Person. */
const SP_DET = /^(der|die|das|den|dem|des|ein|eine|einen|einem|einer|eines|mein|meine|dein|deine|sein|seine|ihr|ihre|unser|unsere|euer|eure|kein|keine|jeder|jede|jedes|dieser|diese|dieses|jener|jene|jenes|beide|alle|zwei|drei|vier)\b/i;

/** Ist dieser Teil hinter dem Komma eine EIGENE Person — oder ein Zusatz zur
 *  vorigen?
 *
 *  Anlass: Ausgabe Nr. 44. Der Kontextwürfel hängt in der Hälfte aller Würfe
 *  einen Zusatz mit Komma an die Figur an („eine Archivarin ohne Namen, voller
 *  ungestellter Fragen"). Das Komma ist aber schon vergeben — es trennt die
 *  Sprecher einer Szene. Vier der zwanzig Zusätze wurden deshalb zur zweiten
 *  Figur und danach zum Satzsubjekt: „Voller ungestellter Fragen tritt einen
 *  Schritt zurück."
 *
 *  Die alte Fassung zählte auf, was ein Zusatz IST (Präposition, Konjunktion,
 *  Relativsatz). Eine Aufzählung kann man nicht vollständig bekommen. Gefragt
 *  wird jetzt umgekehrt: Sieht der Teil aus wie eine Nominalphrase? Er muss mit
 *  einem Begleiter oder einem großgeschriebenen Namen anfangen. Alles andere
 *  gehört zur vorigen Person. */
export function istEigenePerson(teil: string): boolean {
  const p = clean(teil);
  if (!p) return false;
  if (SP_REL.test(p) && SP_ENDS_VERB.test(p)) return false;   // nachgestellter Relativsatz
  if (SP_CONJ.test(p) || SP_PREP.test(p)) return false;
  if (SP_DET.test(p)) return true;
  if (/^[A-ZÄÖÜ]/.test(p)) return true;                        // Eigenname
  // Ein EINZELNES Wort hinter dem Komma ist ein Name, auch klein getippt
  // („baucis, philemon"). Kein Zusatz der App besteht aus einem Wort.
  return !/\s/.test(p);
}

/** Der KOPF einer Figur: ihr Name samt bestimmendem Relativsatz, aber ohne die
 *  angehängte Verzierung.
 *
 *  „eine Archivarin ohne Namen, voller ungestellter Fragen" ist EINE Figur —
 *  aber als Satzsubjekt taugt nur der Kopf. Der Grund ist nicht Stil, sondern
 *  Bruchgefahr: Rhythmus und Disruptor setzen an Kommas Satzgrenzen, und dann
 *  stand die Verzierung plötzlich am Satzanfang und war wieder ein Subjekt:
 *  „Voller ungestellter Fragen greift nach dem, was bleibt."
 *
 *  Ein bestimmender Relativsatz bleibt: „ein Schulmädchen, das Karten fälscht"
 *  ist ohne ihn eine andere Figur. */
export function personKopf(person: string): string {
  const teile = (person || "").split(",").map((x) => clean(x)).filter(Boolean);
  if (teile.length <= 1) return (person || "").trim();
  const raus = [teile[0]!];
  for (let i = 1; i < teile.length; i++) {
    if (SP_REL.test(teile[i]!) && SP_ENDS_VERB.test(teile[i]!)) raus.push(teile[i]!);
  }
  return raus.join(", ");
}

export function splitSpeakers(who: string): string[] {
  const parts = (who || "").split(",").map((s) => clean(s)).filter(Boolean);
  if (parts.length <= 1) return parts;
  const out: string[] = [parts[0]!];
  for (let i = 1; i < parts.length; i++) {
    if (istEigenePerson(parts[i]!)) out.push(parts[i]!);
    else out[out.length - 1] += ", " + parts[i]!;
  }
  return out;
}
