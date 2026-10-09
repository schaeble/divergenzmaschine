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
import type { Bank, GenInput } from "../types";
import { pick } from "../text-utils";
import { ziehWeltblatt, fuelle, LAGEN, type Weltblatt, type LageTyp, type WeltArt } from "../features/weltblatt";
import { utopieMaterial, ZAHLWORT } from "../features/utopieMaterial";

/** Ein Satz mit Rang: ohne Rang Pflicht, sonst wird er nach Rang (klein
 *  zuerst) ergänzt, bis die Ziellänge erreicht ist. */
interface Satz { s: string; rang?: number }
export type AbschnittId = "ankunft" | "ordnung" | "alltag" | "kehrseite" | "abschied";
interface Abschnitt { id: AbschnittId; saetze: Satz[] }

/** Was aus dem Preset gezogen wurde — je Rahmen höchstens ein Eintrag. */
export interface PresetWahl { motiv?: string; wendung?: string; verwandlung?: [string, string]; requisit?: string }

export interface UtopieErgebnis { text: string; fb: Weltblatt; folge: AbschnittId[]; preset: PresetWahl }

const cap1 = (s: string): string => (s ? s[0]!.toUpperCase() + s.slice(1) : s);

// ── Die zwei Fassungen (4.375.0) ────────────────────────────────────────────
// Utopie und Dystopie teilen Weltblatt, Gerüst und Prüfung. Verschieden sind
// die Rahmensätze: Wo der Gast in der Utopie Wasser und ein Bett bekommt, nimmt
// man ihm in der Dystopie die Papiere ab. Die Kehrseite der Utopie wird in der
// Dystopie zum RISS — zu dem, was die Leute trotzdem tun. Die Einleitung sagt
// „im Verborgenen", nicht „trotzdem": Jeder Riss beginnt selbst mit
// „Trotzdem …", und „was man trotzdem tut. Trotzdem wird getauscht" stand
// doppelt da (gefunden beim Lesen, 4.375.0).
const RAHMEN: Record<WeltArt, Record<string, string>> = {
  utopie: {
    gastOrt: "{ankunft} fragte niemand nach meinem Namen.",
    gastSatz: "Man gab mir Wasser und ein Bett und sagte mir als Erstes den Satz, auf dem {N} gebaut ist: „{satz}“",
    gastSieht: "Ich sah zu und schrieb mit.",
    gastKehr: "{abend} erzählte mir jemand von dem, worüber man in {N} nicht gern spricht.",
    gastKarte: "Ich zeichnete {N} in meine Karte, mit einem dünnen Strich.",
    gastFort: "Am Morgen meiner Abreise war {N} still wie am ersten Tag.",
    bewSatz: "Bei uns gilt ein Satz, den jedes Kind kennt: „{satz}“",
    bewFremd: "{ankunft} fragt ihn niemand nach seinem Namen, nur, ob er müde ist.",
    bewKehr: "Es gibt etwas, worüber wir nicht gern sprechen.",
    bewFort: "Der Fremde ist längst weitergezogen. Ich bin geblieben, wie fast alle.",
    gehWarten: "Ich stehe {ort} und warte.",
    gehSatz: "Ich bin hier aufgewachsen, mit dem Satz, den jedes Kind kennt: „{satz}“",
    gehAlltag: "Ich werde vieles vermissen.",
    gehKehr: "Und dann ist da das, worüber man in {N} nicht gern spricht.",
    gehGrund: "Ich gehe, weil ich diesen Preis nicht länger zahlen will.",
    knapp: "Das Kostbarste in {N} ist {knapp}; man geht sparsam damit um und redet nicht darüber.",
    nachbruch: "Die Alten erinnern sich an die Zeit davor; sie sprechen nicht gern darüber.",
    zukunft: "Was vorher war, kennt man in {N} nur aus Büchern.",
    vergangenheit: "Von der übrigen Welt weiß man in {N} wenig, und man vermisst nichts.",
    wendung: "Eine Geschichte, die man in {N} gern erzählt: {w}.",
    verwandlung: "In {N} sagt man nicht „{a}“, sondern „{b}“.",
  },
  dystopie: {
    gastOrt: "{ankunft} wurde mein Name in ein Buch geschrieben, bevor ich ihn gesagt hatte.",
    gastSatz: "Man nahm mir die Papiere ab und ließ mich den Satz nachsprechen, auf dem {N} gebaut ist: „{satz}“",
    gastSieht: "Ich sah zu und schrieb nichts auf.",
    gastKehr: "{abend} zeigte mir jemand, was in {N} im Verborgenen geschieht.",
    gastKarte: "Meine Karte von {N} musste ich beim Abschied abgeben.",
    gastFort: "Am Morgen meiner Abreise wurde ich {zumOrt} begleitet, freundlich und ohne ein Wort.",
    bewSatz: "Bei uns gilt ein Satz, den jedes Kind aufsagen muss: „{satz}“",
    bewFremd: "{ankunft} wird er gefragt, wie lange er bleibt, und die Antwort wird aufgeschrieben.",
    bewKehr: "Es gibt etwas, das wir im Verborgenen tun.",
    bewFort: "Der Fremde ist weitergezogen, oder er ist geblieben; man erfährt es nicht. Ich bin geblieben, wie alle.",
    gehWarten: "Ich stehe {ort} und warte auf die Dunkelheit.",
    gehSatz: "Ich bin hier aufgewachsen, mit dem Satz, den jedes Kind aufsagen muss: „{satz}“",
    gehAlltag: "Ich werde weniges vermissen, und das Wenige sehr.",
    gehKehr: "Und dann ist da das, was in {N} im Verborgenen geschieht.",
    gehGrund: "Ich gehe, bevor sie merken, dass ich gehe.",
    knapp: "Das Kostbarste in {N} ist {knapp}; es wird zugeteilt, und wer mehr will, muss es begründen.",
    nachbruch: "Die Alten erinnern sich an die Zeit davor; man hat ihnen geraten, es nicht zu tun.",
    zukunft: "Was vorher war, steht in keinem Buch, das man ausleihen darf.",
    vergangenheit: "Von der übrigen Welt weiß man in {N} nur, was verlesen wird.",
    wendung: "Eine Geschichte, die man in {N} nur leise erzählt: {w}.",
    verwandlung: "In {N} darf man nicht „{a}“ sagen, nur „{b}“.",
  },
};

/** Ein Rahmensatz der aktuellen Fassung, gefüllt mit den Werten des Blatts. */
const R = (fb: Weltblatt, k: string, extra: Record<string, string> = {}): string =>
  fuelle(RAHMEN[fb.art][k]!, { ...fb.werte, ankunft: fb.lage.ankunft, satz: fb.satz, ...extra });

/** Sätze, die nur in EINER Fassung vorkommen. Der Prüfer sucht die der anderen
 *  Fassung — eine Utopie-Zeile in einer Dystopie wäre ein Bruch. */
const MARKEN: Record<WeltArt, RegExp[]> = {
  utopie: [/fragte niemand nach meinem Namen/, /sagte mir als Erstes den Satz/, /den jedes Kind kennt/, /nicht gern spricht|nicht gern sprechen/, /diesen Preis nicht länger/, /gern erzählt:/, /sagt man nicht „/],
  dystopie: [/bevor ich ihn gesagt hatte/, /Satz nachsprechen/, /aufsagen muss/, /im Verborgenen/, /bevor sie merken/, /nur leise erzählt:/, /darf man nicht „/],
};

/** Die vier Rahmen. Der Prüfer liest sie mit `PRESET_RAHMEN` zurück — beide
 *  stehen deshalb nebeneinander. */
// „Was man in N zuerst sieht" stand beim Gast im dritten Absatz — also gerade
// nicht zuerst (gefunden beim Lesen, 4.374.0). Beide Rahmen sind jetzt
// ortsfest und passen an jede Stelle.
const MOTIV_RAHMEN = ["Mitten auf dem Platz: {m}.", "Am Rand des Platzes: {m}."];
function presetSaetze(fb: Weltblatt, pw: PresetWahl): { motiv?: Satz; wendung?: Satz; verwandlung?: Satz; requisit?: Satz } {
  const N = fb.name;
  return {
    // Das Motiv ist Pflicht: Wer ein Preset ankreuzt, soll es im Text finden.
    motiv: pw.motiv ? { s: fuelle(pick(MOTIV_RAHMEN), { N, m: pw.motiv }) } : undefined,
    wendung: pw.wendung ? { s: R(fb, "wendung", { w: cap1(pw.wendung) }), rang: 1 } : undefined,
    verwandlung: pw.verwandlung ? { s: R(fb, "verwandlung", { a: pw.verwandlung[0], b: pw.verwandlung[1] }), rang: 1 } : undefined,
    requisit: pw.requisit ? { s: `In jedem Haus in ${N} liegt ${pw.requisit}.`, rang: 2 } : undefined,
  };
}
let PS: ReturnType<typeof presetSaetze> = {};

const worte = (s: string): number => (s.match(/[A-Za-zÄÖÜäöüß0-9]+/g) || []).length;

/** Antwort in direkter Rede vor „, sagte sie": Der Schlusspunkt fällt weg,
 *  Frage- und Ausrufezeichen bleiben. */
const redeVorBegleitsatz = (a: string): string => a.replace(/\.$/, "");

function frageSaetze(fb: Weltblatt): Satz[] {
  const f = fuelle(fb.texte.frage.frage, fb.werte);
  const a = fuelle(fb.texte.frage.antwort, fb.werte);
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
  fb.texte.ordnung.forEach((x, i) => s.push(i === 0 ? { s: fuelle(x, W) } : { s: fuelle(x, W), rang: 1 }));
  if (fb.zeit === "nachbruch") s.push({ s: R(fb, "nachbruch") });
  if (fb.zeit === "zukunft") s.push({ s: R(fb, "zukunft"), rang: 3 });
  if (fb.zeit === "vergangenheit") s.push({ s: R(fb, "vergangenheit"), rang: 3 });
  if (PS.verwandlung) s.push(PS.verwandlung);
  if (mitFrage) s.push(...frageSaetze(fb));
  return { id: "ordnung", saetze: s };
}

const BLICK_ALLTAG: Record<WeltArt, Record<Weltblatt["blick"], string>> = {
  utopie: {
    hell: "Niemand hat es eilig, und trotzdem wird alles fertig.",
    dunkel: "Manchmal sehen alle zur selben Zeit weg.",
    spott: "Es ist alles sehr vernünftig, und man merkt es an jeder Ecke.",
    kuehl: "Ordnung herrscht, ohne dass jemand sie ausruft.",
  },
  dystopie: {
    hell: "Und doch summt jemand, wenn er sich unbeobachtet glaubt.",
    dunkel: "Alle sehen zur selben Zeit weg; man hat es geübt.",
    spott: "Es ist alles sehr vernünftig, und wer daran zweifelt, bekommt es erklärt, ausführlich.",
    kuehl: "Ordnung herrscht, und jeden Morgen wird sie ausgerufen.",
  },
};

function alltag(fb: Weltblatt, vorweg: Satz[] = []): Abschnitt {
  const W = fb.werte;
  const s: Satz[] = [...vorweg, ...(PS.motiv ? [PS.motiv] : []), { s: fb.brauch.text }, { s: fb.brauch.alltag }];
  if (PS.wendung) s.push(PS.wendung);
  if (PS.requisit) s.push(PS.requisit);
  fb.texte.alltag.forEach((x, i) => s.push(i === 0 ? { s: fuelle(x, W) } : { s: fuelle(x, W), rang: 1 }));
  s.push({ s: R(fb, "knapp"), rang: 2 });
  s.push({ s: BLICK_ALLTAG[fb.art][fb.blick], rang: 2 });
  if (fb.gesetz.alltag) s.push({ s: fb.gesetz.alltag, rang: 3 });
  if (fb.erzaehler.art === "gast") s.push({ s: R(fb, "gastSieht"), rang: 4 });
  return { id: "alltag", saetze: s };
}

const BLICK_KEHRSEITE: Record<WeltArt, Record<Weltblatt["blick"], string>> = {
  utopie: {
    hell: "Man verschweigt es nicht; man hofft nur, dass es weniger wird.",
    dunkel: "Wer danach fragt, bekommt keine Antwort, nur einen Blick.",
    spott: "Man ist in {N} sehr stolz darauf, das offen zuzugeben.",
    kuehl: "",
  },
  dystopie: {
    hell: "Es sind wenige, aber es werden nicht weniger.",
    dunkel: "Wer davon weiß, sagt es niemandem.",
    spott: "Offiziell gibt es das nicht, und offiziell ist in {N} alles.",
    kuehl: "",
  },
};

function kehrseite(fb: Weltblatt, einleitung: string, nachsatz?: string): Abschnitt {
  const W = fb.werte;
  const s: Satz[] = [{ s: einleitung }];
  fb.texte.kehrseite.forEach((x, i) => s.push(i === 0 ? { s: fuelle(x, W) } : { s: fuelle(x, W), rang: 1 }));
  const b = BLICK_KEHRSEITE[fb.art][fb.blick];
  if (b) s.push({ s: fuelle(b, W), rang: fb.blick === "spott" ? undefined : 2 });
  if (nachsatz) s.push({ s: nachsatz });
  return { id: "kehrseite", saetze: s };
}

// Schlüsse je Fassung, Blickwinkel und Blick. Kein Schluss nennt eine Zahl.
type Schluesse = Record<"gast" | "bewohner" | "gehend", Record<Weltblatt["blick"], string[]>>;
const SCHLUSS_DYS: Schluesse = {
  gast: {
    hell: ["Ich weiß nicht, ob sie es schaffen. Aber ich habe gesehen, dass sie es versuchen.",
      "Seitdem achte ich überall darauf, wer an den richtigen Stellen schweigt."],
    dunkel: ["Als ich mich umdrehte, stand niemand mehr {ort}. Man hatte mich schon vergessen; so ist es vorgesehen.",
      "Ich habe {N} in keine Karte eingetragen. Man soll nicht hinfinden."],
    spott: ["Zu Hause erzählte ich von {N}, und man fand es dort sehr ordentlich. Ich habe nicht widersprochen.",
      "Man hat mir eine Bescheinigung mitgegeben, dass ich nichts gesehen habe. Sie ist sehr schön gestempelt."],
    kuehl: ["Ich habe aufgeschrieben, was ich gesehen habe, und weggelassen, was ich gehört habe.",
      "Hier endet mein Bericht über {N}. Er wurde vor meiner Abreise gelesen."],
  },
  bewohner: {
    hell: ["Ich bleibe. Jemand muss die Sätze leise anders betonen."],
    dunkel: ["Manchmal gehe ich {zumOrt} und sehe denen nach, die gehen. Dann gehe ich schnell wieder nach Hause, bevor es jemand bemerkt."],
    spott: ["Wenn er wiederkommt, werde ich ihm sagen, dass alles noch genauso ist. Das wird geprüft und stimmt dann auch."],
    kuehl: ["Mehr darf über {N} nicht gesagt werden."],
  },
  gehend: {
    hell: ["Hinter mir wird es hell. Ich nehme nichts mit außer dem Satz, und den werde ich draußen anders betonen."],
    dunkel: ["Niemand ist gekommen, um mich zu verabschieden. Wer kommt, wird notiert."],
    spott: ["Draußen, sagt man, braucht man für alles einen Grund. Ich habe einen. Er steht in keinem Buch."],
    kuehl: ["Mein Weg führt nach Süden. Was aus {N} wird, steht dort im Buch."],
  },
};
const SCHLUSS: Schluesse = {
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

const schluss = (fb: Weltblatt): Schluesse => (fb.art === "dystopie" ? SCHLUSS_DYS : SCHLUSS);

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
    { s: R(fb, "gastOrt") },
    { s: R(fb, "gastSatz") },
    zeitSatz(fb),
  ] };
  const abend = pick(["Am vierten Abend", "Am letzten Abend vor meiner Abreise", "Am dritten Abend"]);
  const abschied: Abschnitt = { id: "abschied", saetze: [
    { s: karte ? R(fb, "gastKarte") : R(fb, "gastFort") },
    { s: fuelle(pick(schluss(fb).gast[fb.blick]), fb.werte) },
  ] };
  return [ankunft, ordnung(fb, true), alltag(fb), kehrseite(fb, R(fb, "gastKehr", { abend })), abschied];
}

function bauBewohner(fb: Weltblatt): Abschnitt[] {
  const N = fb.name;
  const vorweg: Satz[] = [
    { s: `Ich lebe in ${N}, seit ich denken kann.` },
    ...selbstVorstellung(fb),
    ...lageSatz(fb),
    { s: R(fb, "bewSatz") },
    zeitSatz(fb),
  ];
  const ankunft: Abschnitt = { id: "ankunft", saetze: [
    { s: `Manchmal kommt ein Fremder nach ${N}.` },
    { s: `Nach ${fb.tage} Tagen ${fb.lage.weg} sind die meisten müde.`, rang: 2 },
    { s: R(fb, "bewFremd") },
    ...frageSaetze(fb),
  ] };
  const abschied: Abschnitt = { id: "abschied", saetze: [
    { s: R(fb, "bewFort") },
    { s: fuelle(pick(schluss(fb).bewohner[fb.blick]), fb.werte) },
  ] };
  return [alltag(fb, vorweg), ordnung(fb, false), ankunft, kehrseite(fb, R(fb, "bewKehr")), abschied];
}

function bauGehend(fb: Weltblatt): Abschnitt[] {
  const N = fb.name;
  const anfang: Abschnitt = { id: "abschied", saetze: [
    { s: R(fb, "gehWarten") },
    { s: `Morgen bin ich nicht mehr in ${N}.` },
    ...selbstVorstellung(fb),
    ...lageSatz(fb),
    { s: R(fb, "gehSatz") },
    zeitSatz(fb),
  ] };
  const aufbruch: Abschnitt = { id: "ankunft", saetze: [
    { s: fuelle(pick(schluss(fb).gehend[fb.blick]), fb.werte) },
  ] };
  return [anfang, ordnung(fb, true), alltag(fb, [{ s: R(fb, "gehAlltag") }]),
    kehrseite(fb, R(fb, "gehKehr"), R(fb, "gehGrund")), aufbruch];
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

export function buildUtopie(input: GenInput, bank?: Partial<Bank>, art: WeltArt = "utopie"): UtopieErgebnis {
  const fb = ziehWeltblatt(input, art);
  // Das Preset liefert Material, gefiltert für die gezogene Lage.
  const mat = utopieMaterial(bank, fb.lageTyp);
  const pw: PresetWahl = {
    motiv: mat.motive.length ? pick(mat.motive) : undefined,
    wendung: mat.wendungen.length ? pick(mat.wendungen) : undefined,
    verwandlung: mat.verwandlungen.length ? pick(mat.verwandlungen) : undefined,
    requisit: mat.requisiten.length ? pick(mat.requisiten) : undefined,
  };
  PS = presetSaetze(fb, pw);
  const abschnitte = fb.erzaehler.art === "bewohner" ? bauBewohner(fb)
    : fb.erzaehler.art === "gehend" ? bauGehend(fb) : bauGast(fb);
  const ziel = Number.isFinite(input.lenTarget as number) ? (input.lenTarget as number) : 110;
  const text = setze(abschnitte, ziel);
  PS = {};
  return { text, fb, folge: abschnitte.map((a) => a.id), preset: pw };
}

/** Die Überschrift einer Utopie oder Dystopie: der Name der Welt. Die
 *  allgemeine Titelregel baut aus Wer und Was — aus „eine, die gehen muss" und
 *  „Niemand lügt." wurde „Eine und Niemand lügt" (gefunden im Bild, 4.375.0).
 *  Der Name steht im ersten Absatz jeder Erzählhaltung hinter „nach" oder „in". */
export function utopieTitel(text: string): string {
  const erster = (text || "").split("\n\n")[0] || "";
  const m = erster.match(/\b(?:nach|in) ([A-ZÄÖÜ][a-zäöüß]+(?:-[A-ZÄÖÜ][a-zäöüß]+)?)[,.]/);
  return m ? m[1]! : "";
}

// ── Prüfung ─────────────────────────────────────────────────────────────────

const zahlenIn = (s: string): string[] => (s.match(ZAHLWORT) || []).map((z) => z.toLowerCase());

/** Prüft einen Utopie-Text gegen sein Blatt. Leere Liste = ohne Befund.
 *  `eingabe` sind die rohen vier W: Was der Nutzer selbst schreibt, darf im
 *  Text stehen, auch wenn es eine Lage-Marke oder eine Zahl ist. */
export function pruefeUtopie(text: string, fb: Weltblatt, eingabe = "", bank?: Partial<Bank>): string[] {
  const b: string[] = [];
  // Preset-Material: Jeder Rahmen muss Material aus DIESER Bank tragen, für
  // DIESE Lage tauglich. Und wenn die Bank Motive für die Lage hat, muss eins
  // im Text stehen — sonst wäre das Preset wieder ein Regler ohne Wirkung.
  if (bank) {
    const m = utopieMaterial(bank, fb.lageTyp);
    const N = fb.name.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
    const funde: string[] = [];
    for (const r of [/Mitten auf dem Platz: ([^.]+)\./g, /Am Rand des Platzes: ([^.]+)\./g]) {
      for (const x of text.matchAll(r)) { funde.push("m"); if (!m.motive.includes(x[1]!)) b.push(`Motiv nicht aus dem Preset: „${x[1]}"`); }
    }
    for (const x of text.matchAll(new RegExp(`Eine Geschichte, die man in ${N} (?:gern|nur leise) erzählt: ([^.]+)\\.`, "g"))) {
      const w = x[1]![0]!.toLowerCase() + x[1]!.slice(1);
      if (!m.wendungen.includes(w) && !m.wendungen.includes(x[1]!)) b.push(`Wendung nicht aus dem Preset: „${x[1]}"`);
    }
    for (const x of text.matchAll(/(?:sagt man nicht „([^“]+)“, sondern|darf man nicht „([^“]+)“ sagen, nur) „([^“]+)“/g)) {
      x[1] = x[1] || x[2]; x[2] = x[3];
      if (!m.verwandlungen.some(([p, q]) => p === x[1] && q === x[2])) b.push(`Verwandlung nicht aus dem Preset: ${x[1]}→${x[2]}`);
    }
    for (const x of text.matchAll(new RegExp(`In jedem Haus in ${N} liegt ([^.]+)\\.`, "g"))) {
      if (!m.requisiten.includes(x[1]!)) b.push(`Requisit nicht aus dem Preset: „${x[1]}"`);
    }
    if (m.motive.length && !funde.length) b.push("Preset ohne Wirkung: kein Motiv im Text");
  }
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
  if (!text.includes(fuelle(fb.texte.kehrseite[0]!, fb.werte))) b.push(fb.art === "dystopie" ? "Riss der Prämisse fehlt" : "Kehrseite der Prämisse fehlt");
  // Die Fassungen dürfen sich nicht mischen, und die eigene muss erkennbar sein.
  const andere: WeltArt = fb.art === "dystopie" ? "utopie" : "dystopie";
  for (const r of MARKEN[andere]) if (r.test(text)) b.push(`Satz der Fassung „${andere}" in einer ${fb.art === "dystopie" ? "Dystopie" : "Utopie"}: ${r.source}`);
  if (!MARKEN[fb.art].some((r) => r.test(text))) b.push(`Keine Marke der Fassung „${fb.art}"`);
  if (!text.includes(fb.brauch.text)) b.push("Brauch fehlt");
  // Vorrang des Wo: Marken anderer Lagen dürfen nicht stehen.
  for (const [t, d] of Object.entries(LAGEN) as [LageTyp, typeof LAGEN[LageTyp]][]) {
    if (t === fb.lageTyp || !d.marken) continue;
    if (d.marken.test(text) && !d.marken.test(eingabe) && !d.marken.test(fb.wo)) b.push(`Marke der Lage „${t}" in einem Text der Lage „${fb.lageTyp}"`);
  }
  // Satzbau, zählbar.
  if (/ {2}|\s[,.;:!?]/.test(text)) b.push("Leerzeichen vor Satzzeichen oder doppelt");
  // Artikel doppelt ist oft richtig: „die Bank, auf der der Herold saß",
  // „etwas, das das Original vergessen hat" (Preset-Material, 4.374.0).
  const dw = text.replace(/(?<!\p{L})(der|die|das|den|dem) \1(?!\p{L})/giu, "$1").match(/(?<!\p{L})(\p{L}+) \1(?!\p{L})/iu);
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
