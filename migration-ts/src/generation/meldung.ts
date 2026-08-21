// Form „Meldung" — die Kurzmeldung, 25 bis 70 Wörter.
//
// Warum diese Form: Der Zeitungssetzer hatte nur mittellange Beiträge. Drei
// davon füllen eine Seite, und die Rolle „Kasten" blieb leer. Die Meldung ist
// das kurze Format, das dazwischen passt.
//
// Sie ist zugleich die STRENGSTE Form der Maschine — und das ist der eigentliche
// Grund, sie zu bauen. Eine Form taugt hier, wenn sie eine Zusage hat, die sich
// zählen lässt. Die Meldung hat fünf:
//
//   1. Alle vier W stehen im ersten Satz.
//   2. Höchstens vier Sätze, 25–70 Wörter.
//   3. Ein einziges Ereignis — kein zweites Thema.
//   4. Ein Tempus.
//   5. Keine Wertung, keine Zahl, die nicht im Faktenblatt steht.
//
// Deshalb greift sie NICHT in die Wortbank. Jede andere Form erzählt aus dem
// Vorrat; die Meldung referiert ausschließlich aus dem Faktenblatt. Ein
// literarischer Einschub („Der Einsatz ist Freiheit") wäre in einer Meldung
// genau der Fehler, den die vierte Zusage verbietet.
import type { GenInput } from "../types";
import { cap } from "./beats";
import { blickVonTon, type Blick } from "./bericht";
import {
  ziehFaktenblatt, erlaubteZahlen, ALLE_NAMEN, mitAbschlusskomma, WER_ERSATZ,
  type Faktenblatt, type FbZahl,
} from "../features/faktenblatt";
import { looksLikeFullClause, extractLeadVerb } from "./wordcls";
import { type RessortId } from "../features/ressorts";

export interface MeldungErgebnis { text: string; fb: Faktenblatt }

/** Wertende Wörter. Eine Meldung meldet; sie findet nichts gut oder schlimm.
 *  Die Liste ist die Prüfung — deshalb steht sie hier und nicht im Prüfstand. */
const WERTUNG = /\b(herrlich|wunderbar|schrecklich|furchtbar|grausam|unglaublich|erschütternd|empörend|skandalös|traurig|erfreulich|glücklicherweise|leider|zum Glück|katastrophal|dramatisch|schockierend|beeindruckend|großartig|fantastisch|bedauerlich)\b/i;

/** Der Zahlensatz. Zwei Fassungen, weil „Betroffen sind 380 Beschäftigte"
 *  unter einer guten Nachricht wie ein Widerspruch klingt. */
function zahlSatz(z: FbZahl, blick: Blick): string {
  const menge = `${z.verbal || z.wortform} ${z.einheit}`;
  return blick === "gut" ? `Hinzu kommen ${menge}.` : `Betroffen sind ${menge}.`;
}

/** Der Vorspann trägt alle vier W. Der Doppelpunkt ist kein Schmuck, sondern
 *  Statik: Er lässt `fb.was` als eigenen Hauptsatz stehen. Jede Fassung, die
 *  das Was in einen dass-Satz oder hinter eine Umstellung zwingt, muss das
 *  finite Verb verschieben — und das geht bei trennbaren Verben schief
 *  („stellt den Betrieb ein" → „…, dass die Werft den Betrieb ein stellt"). */
/** Trägt das „Was" schon sein eigenes Subjekt?
 *
 *  Der Sammler liefert aus Wikipedia ganze Sätze: „Der Flughafen Salzburg,
 *  Eigenbezeichnung …, ist der zweitgrößte Flughafen Österreichs". Davor noch
 *  das Wer zu setzen ergab „Eine Einrichtung Der Flughafen Salzburg, …" — zwei
 *  Subjekte in einem Satz. In dem Fall spricht der Satz für sich. */
export function tragtEigenesSubjekt(was: string): boolean {
  const w = (was || "").trim();
  if (!w) return false;
  // Groß- oder Kleinschreibung ist gleichgültig: Der Sammler liefert „Der
  // Flughafen Salzburg … ist …", das Studio „ein Zimmer wandert" — beides sind
  // Hauptsätze mit eigenem Subjekt.
  const lead = extractLeadVerb(w);
  return looksLikeFullClause(lead.verb, lead.rest)
    || /^(der|die|das|ein|eine)\s+\S+.*\b(ist|sind|war|waren|wird|werden|hat|haben|liegt|gilt|zählt|gehört|wandert|fährt|steht)\b/i.test(w);
}

/** Steht als „Wer" nur der Platzhalter, darf er nicht in den Satz. */
const werTaugt = (fb: Faktenblatt): boolean => fb.wer.haupt.trim().toLowerCase() !== WER_ERSATZ.toLowerCase();

/** Taugt die Ortsangabe für einen Satz?
 *
 *  Sie muss eine Präposition tragen. Kommt aus dem Sammler ein roher
 *  Nominalausdruck („Baustelle in städtischem Gebiet", „Flughafen Salzburg"),
 *  entstand daraus „ist Baustelle in städtischem Gebiet bekannt geworden" —
 *  ein Satz ohne Ortsangabe, nur mit einem Nomen an ihrer Stelle. Dann bleibt
 *  der Ort lieber ganz weg: Eine Meldung ohne Ort ist unvollständig, eine mit
 *  falschem Deutsch ist kaputt. */
export function ortTauglich(mitPraep: string): boolean {
  const o = (mitPraep || "").trim();
  if (!o) return false;
  return /^(in|im|an|am|auf|bei|beim|vor|hinter|neben|unter|über|zwischen|nahe|innerhalb|außerhalb|entlang)\b/i.test(o);
}

function vorspann(fb: Faktenblatt): string {
  // Nebensätze in Zeit und Ort schließen mit Komma, sonst laufen sie in den
  // Hauptsatz: „In der Stunde, die nicht gezählt wird wurde bekannt …"
  const wann = mitAbschlusskomma(cap(fb.wann.datum));
  const wo = fb.wo.mitPraep;
  const kern = tragtEigenesSubjekt(fb.was) || !werTaugt(fb)
    ? cap(fb.was)
    : `${cap(fb.wer.haupt)} ${fb.was}`;
  const ort = ortTauglich(wo) ? ` ${mitAbschlusskomma(wo)}` : "";
  return `${wann} ist${ort} bekannt geworden: ${kern}.`;
}

/** Woher die Meldung kommt. Eine Meldung nennt ihre Quelle — und die Person
 *  wird MIT Rolle eingeführt, weil sie hier zum ersten und einzigen Mal
 *  vorkommt: eine Kurzform ohne Einführung gäbe es sonst nirgends aufzulösen. */
function quelle(fb: Faktenblatt): string {
  const p = fb.personen[0];
  if (!p) return "";
  // Präsens wie der ganze Rumpf. „Das teilte … mit" wäre die geläufigere
  // Formel, mischt aber Präteritum in einen Text im Zeitungspräsens — und
  // genau das verbietet die vierte Zusage.
  return `Das teilt ${p.rolle} ${p.name} mit.`;
}

/** Der Hergang in einem Satz: der jüngste Schritt aus der Chronologie. */
function schritt(fb: Faktenblatt): string {
  const c = fb.chronologie[1] || fb.chronologie[0];
  // Die Chronologie liefert NOMINALPHRASEN („die erste Meldung"). Ohne eigenes
  // Verb entstand daraus „Im Frühjahr die erste Meldung." — ein Satz ohne
  // Aussage. Das Verb steht deshalb hier.
  return c ? `${cap(c.zeit)} zeichnet sich ${c.was} ab.` : "";
}

const worte = (s: string): number => (s.match(/[A-Za-zÄÖÜäöüß0-9][A-Za-zÄÖÜäöüß0-9.,-]*/g) || []).length;

export function buildMeldung(input: GenInput, ressort: RessortId | "auto" = "auto"): MeldungErgebnis {
  const fb = ziehFaktenblatt(input, ressort);
  const blick = blickVonTon(input.tone || "");

  // Der Längenregler verschiebt nur, WIE VIELE der drei Folgesätze mitkommen —
  // die Meldung bleibt kurz. Eine Meldung, die man auf 300 Wörter zieht, ist
  // keine Meldung mehr, sondern ein schlechter Bericht.
  const ziel = Number.isFinite(input.lenTarget as number) ? (input.lenTarget as number) : 60;
  const wieviel = ziel <= 60 ? 1 : ziel <= 120 ? 2 : 3;

  const saetze = [vorspann(fb)];
  const folge = [
    fb.zahlen[0] ? zahlSatz(fb.zahlen[0]!, blick) : "",
    schritt(fb),
    quelle(fb),
  ].filter(Boolean);

  // Aufgefüllt wird nach WÖRTERN, nicht nach Sätzen. Mit einer festen Satzzahl
  // kam die Meldung je nach Faktenblatt auf 17 Wörter heraus — unter der
  // eigenen Untergrenze von 25.
  const SCHLUSS = "Weitere Angaben liegen zunächst nicht vor.";
  const MAX_SAETZE = 4;
  for (const s of folge) {
    if (saetze.length >= MAX_SAETZE) break;
    if (saetze.length - 1 >= wieviel && worte(saetze.join(" ")) >= 30) break;
    saetze.push(s);
  }
  // Die Schlussformel ist keine Verlegenheit, sondern die ehrliche Antwort auf
  // die Frage, was die Meldung NICHT weiß — und sie füllt die Untergrenze.
  if (saetze.length < MAX_SAETZE && worte(saetze.join(" ")) + worte(SCHLUSS) <= 70) saetze.push(SCHLUSS);

  return { text: saetze.join(" "), fb };
}

// ── Prüfung ────────────────────────────────────────────────────────────────

export interface MeldungMangel { art: string; stelle: string }

/** Satzgrenzen. Zwei Fallen, beide im Lauf aufgetaucht: Eine Ziffer vor dem
 *  Punkt beendet keinen Satz („1902. Zeit"), und ein Titel auch nicht — an
 *  „Prof. Schwarz warnt" zerfiel der erste Satz, und die Prüfung meldete, das
 *  Was fehle im Vorspann. */
const ABK = /(?:Prof|Dr|Ing|Dipl|Nr|St|ca|bzw|usw|evtl|Abs|Art|Jh|Mio|Mrd|[A-ZÄÖÜ])$/;
export function saetzeVon(text: string): string[] {
  const roh = (text || "").split(/(?<!\d)([.!?])(?=\s|$)/);
  const raus: string[] = [];
  let puffer = "";
  for (let i = 0; i < roh.length; i += 2) {
    puffer += (roh[i] || "") + (roh[i + 1] || "");
    const ohne = puffer.trim().replace(/[.!?]$/, "");
    if (ABK.test(ohne.split(/\s+/).pop() || "")) { puffer += " "; continue; }
    if (puffer.trim()) raus.push(puffer.trim());
    puffer = "";
  }
  if (puffer.trim()) raus.push(puffer.trim());
  return raus;
}

/** Prüft die fünf Zusagen. Der Prüfstand ruft dieselbe Funktion, die auch das
 *  Programm benutzen könnte — ein Maß, nicht zwei. */
export function pruefeMeldung(text: string, fb: Faktenblatt): MeldungMangel[] {
  const m: MeldungMangel[] = [];
  const saetze = saetzeVon(text);

  // 1 · Alle vier W im ersten Satz. Geprüft wird gegen die KENNWÖRTER des
  //     Faktenblatts, nicht gegen die Roheingabe: „in Dürrhausen" wird zu
  //     „im Ortskern von Dürrhausen", und der Ortsname ist das, was zählt.
  const erster = saetze[0] || "";
  const kern = (s: string): string => (s.replace(/^(der|die|das|dem|den|im|in|am|an|zu|zur|zum)\s+/i, "").split(/\s+/)[0] || "").replace(/[^A-Za-zÄÖÜäöüß0-9-]/g, "");
  const vier: [string, string][] = [
    ["Wo", kern(fb.wo.ort)],
    ["Wann", kern(fb.wann.datum)],
    ["Wer", kern(fb.wer.haupt)],
    ["Was", kern(fb.was)],
  ];
  for (const [name, wort] of vier) {
    // Trägt das „Was" sein eigenes Subjekt, steht der Wer bewusst NICHT im
    // Satz — sonst stünden zwei Subjekte darin. Dann ist sein Fehlen richtig.
    if (name === "Wer" && (tragtEigenesSubjekt(fb.was) || !werTaugt(fb))) continue;
    // Und eine Ortsangabe ohne Präposition wird bewusst weggelassen.
    if (name === "Wo" && !ortTauglich(fb.wo.mitPraep)) continue;
    if (wort && !erster.toLowerCase().includes(wort.toLowerCase())) {
      m.push({ art: `${name} fehlt im ersten Satz`, stelle: wort });
    }
  }

  // 2 · Umfang.
  const n = worte(text);
  if (n < 25) m.push({ art: "zu kurz", stelle: `${n} Wörter` });
  if (n > 70) m.push({ art: "zu lang", stelle: `${n} Wörter` });
  if (saetze.length > 4) m.push({ art: "zu viele Sätze", stelle: `${saetze.length}` });

  // 3 · Ein Tempus. Präteritum und Präsens dürfen sich nicht mischen — außer im
  //     Vorspann, wo „ist bekannt geworden" (Perfekt) neben dem Präsens des
  //     Ereignisses steht; das ist die Zeitungsform und kein Bruch.
  const rumpf = saetze.slice(1).join(". ");
  const praet = /\b(war|waren|wurde|wurden|hatte|hatten|lagen|lag|teilte|folgte|fiel|kam|kamen|zeichnete)\b/.test(rumpf);
  const praes = /\b(ist|sind|wird|werden|hat|haben|kommt|kommen|steht|stehen|liegt|liegen)\b/.test(rumpf);
  if (praet && praes) m.push({ art: "zwei Tempora im Rumpf", stelle: rumpf.slice(0, 60) });

  // 4 · Keine Wertung.
  const w = text.match(WERTUNG);
  if (w) m.push({ art: "Wertung", stelle: w[0] });

  // 5 · Keine Zahl und kein Name ohne Faktenblatt — dieselbe Regel wie beim
  //     Bericht, hier auf dem kürzeren Text.
  const erlaubt = new Set(erlaubteZahlen(fb));
  for (const roh of text.match(/\d[\d.,]*/g) || []) {
    const z = roh.replace(/[.,]+$/, "");
    if (!erlaubt.has(z)) m.push({ art: "Zahl ohne Faktenblatt", stelle: z });
  }
  const drin = new Set([
    ...fb.personen.flatMap((p) => [p.kurz.toLowerCase(), ...p.name.toLowerCase().split(/\s+/)]),
    ...fb.wer.haupt.toLowerCase().split(/\s+/),
    fb.wer.kurz.toLowerCase(),
  ]);
  for (const name of ALLE_NAMEN) {
    if (drin.has(name.toLowerCase())) continue;
    if (new RegExp("(?<![A-Za-zÄÖÜäöüß])" + name + "(?![A-Za-zÄÖÜäöüß])").test(text)) {
      m.push({ art: "fremder Personenname", stelle: name });
    }
  }
  return m;
}
