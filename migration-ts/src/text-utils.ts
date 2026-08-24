// Reine Hilfsfunktionen ohne Zustand — 1:1 aus dem heutigen Code portiert,
// jetzt getypt. Kein DOM-Zugriff.

/** Trimmt und normalisiert Whitespace. */
export function clean(s: unknown): string {
  return (s ?? "").toString().trim().replace(/\s+/g, " ");
}

/** Zufälliges Element aus einer Liste. */
export function pick<T>(arr: readonly T[]): T {
  return arr[Math.floor(Math.random() * arr.length)]!;
}

/** Wie pick(), aber überspringt entartete/zu kurze Einträge (< minWords Wörter). */
export function pickSane(arr: readonly string[], minWords = 2): string {
  const list = Array.isArray(arr) ? arr : [];
  const ok = list.filter(
    (x) => String(x ?? "").trim().split(/\s+/).filter(Boolean).length >= minWords,
  );
  return (ok.length ? pick(ok) : pick(list)) ?? "";
}

/** Zufallsentscheidung mit Wahrscheinlichkeit p (0..1). */
export function chance(p: number): boolean {
  return Math.random() < p;
}

/** Stellt sicher, dass der String mit einem Satzzeichen endet. */
export function ensurePunct(s: string): string {
  s = clean(s);
  if (!s) return "";
  return /[.!?…]$/.test(s) ? s : s + ".";
}

/** Erster Buchstabe groß. */
export function capFirst(s: string): string {
  s = String(s ?? "").trim();
  return s ? s.charAt(0).toUpperCase() + s.slice(1) : s;
}

/** Regex-Sonderzeichen maskieren. */
export function escapeRegExp(s: string): string {
  return s.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

/** Zerlegt einen Text in Sätze (nach . ! ? …). */
/** Punkte, die KEINE Satzgrenze sind.
 *
 *  Gefunden an einer gedruckten Ausgabe: Aus „Am 4. Juli 1991 …" wurde die
 *  Überschrift „Am 4" und ein Textbruch dahinter. Und aus „… der Streich Hurz!
 *  von Hape Kerkeling …" wurde „Hurz! Von Hape Kerkeling" — der Titel endete
 *  den Satz, das nächste Wort begann groß.
 *
 *  Deutsch setzt den Punkt hinter ORDNUNGSZAHLEN: Datumsangaben, „im 19.
 *  Jahrhundert", Gliederungsnummern. Die Heuristik ist bewusst eng — sie greift
 *  nur, wenn nach der Zahl ein Monat, eine Jahrhundertangabe oder eine weitere
 *  Zahl folgt. Ein echter Satzschluss nach einer Zahl („Es waren 144.") bleibt
 *  damit eine Grenze. */
const MONATE = /^(?:Januar|Februar|März|April|Mai|Juni|Juli|August|September|Oktober|November|Dezember|Jahrhunderts?|Jh\.|Hälfte|Auflage|Band|Kapitel|Absatz|Teil)\b/u;
/** Endet der Teil auf einer Ordnungszahl? */
const ORDNUNGSZAHL = /\d\.$/;
/** Endet der Teil auf einer Abkürzung, hinter der es weitergeht? */
// Ein EINZELNER Buchstabe mit Punkt ist im Deutschen immer eine Abkürzung
// („z. B.", „u. a.", Initialen) — ein Satz, der auf einem einzelnen Buchstaben
// endet, kommt in diesem Material nicht vor.
const ABKUERZUNG = /(?:^|\s)(?:[A-Za-zÄÖÜäöü]|ca|bzw|bspw|evtl|ggf|inkl|Nr|St|Dr|Prof|Abs|Art|Bd|Hrsg|usw|etc)\.$/u;

/** Gehören die beiden Teile in Wahrheit zusammen? */
function keineGrenze(vor: string, nach: string): boolean {
  if (ABKUERZUNG.test(vor)) return true;
  if (!ORDNUNGSZAHL.test(vor)) return false;
  // Nach einer Ordnungszahl nur dann weiterlesen, wenn das Folgende zu ihr
  // gehört: ein Monat, eine Jahrhundertangabe, eine weitere Zahl. „Es waren
  // 144. Danach …" bleibt damit eine Grenze.
  return MONATE.test(nach) || /^\d/.test(nach);
}

export function splitSentences(txt: string): string[] {
  const flach = txt.replace(/\s+/g, " ").trim();
  const roh = flach.split(/(?<=[.!?…])\s+/).filter(Boolean);
  // Wieder zusammenfügen, wo die Grenze keine war. Nachträglich statt in einem
  // Muster: Ein einziger Ausdruck, der alle Ausnahmen enthält, ist nach dem
  // dritten Zusatz nicht mehr zu lesen — und genau das ist die Stelle, an der
  // ein späterer Zusatz still danebengeht.
  const raus: string[] = [];
  for (const teil of roh) {
    const vor = raus[raus.length - 1];
    if (vor && keineGrenze(vor, teil)) raus[raus.length - 1] = vor + " " + teil;
    else raus.push(teil);
  }
  return raus;
}

/** Kürzt einen abgeschnittenen Satz an der letzten Fuge.
 *
 *  Der Sammler kappt lange Wikipedia-Sätze nach 170 Zeichen. Bleibt dabei ein
 *  Rest stehen, der mitten in einer Phrase endet, ist er kein Satz mehr:
 *
 *      In der Toskana wird der italienische Festungsbaumeister und Militär
 *      Rochus zu Lynar geboren, der insbesondere durch Bauten im Dienst
 *      deutscher Fürsten wie der.
 *
 *  Vorschlag des Benutzers, und er ist der richtige: am letzten Komma kürzen.
 *  Übrig bleibt „… Rochus zu Lynar geboren." — ein ganzer Satz, nur kürzer.
 *
 *  Erkannt wird der Bruch am LETZTEN WORT. Ein deutscher Satz endet nie auf
 *  einem Artikel, einer Präposition oder einer Konjunktion; steht dort eines
 *  davon, fehlt der Rest. Bleibt nach vier Schnitten immer noch ein Bruchstück
 *  übrig, ist der Fund unbrauchbar und es kommt nichts zurück — ein halber Satz
 *  ist schlechter als kein Satz.
 */
// Bewusst NUR Wörter, die einen deutschen Satz NIE beenden können: Artikel,
// Konjunktionen und Präpositionen ohne Präfixgebrauch. Trennbare Präfixe stehen
// NICHT darin — „Er kommt an.", „Das Licht geht aus.", „Er hört zu." sind ganze
// Sätze. Dieselbe Unterscheidung hat schon der Bruchstück-Filter in
// postprocess.ts gebraucht; die erste Fassung hier machte aus „Er kommt an"
// wieder „Er kommt".
const HAENGT_IN_DER_LUFT = /(^|\s)(ein|eine|einem|einen|einer|eines|der|die|das|dem|den|des|und|oder|aber|wie|als|im|am|beim|zum|zur|vom|von|für|ohne|durch|gegen|bei|seit|während|wegen|trotz|dass|weil|denn|sondern|sowie|bzw|etwa|sehr|dessen|deren|welche[rsmn]?)$/i;

export function kuerzeAmBruch(text: string): string {
  let t = (text || "").replace(/\s*…\s*$/, "").replace(/\s*[.,;:–—-]+\s*$/, "").trim();
  for (let i = 0; i < 8 && t && HAENGT_IN_DER_LUFT.test(t); i++) {
    const komma = t.lastIndexOf(",");
    if (komma >= 12) {
      t = t.slice(0, komma).replace(/\s*[.,;:–—-]+\s*$/, "").trim();
      continue;
    }
    // Kein Komma in Reichweite: das letzte Wort abwerfen. Einen brauchbaren
    // Satz wegen eines hängenden Wortes ganz zu verlieren wäre der schlechtere
    // Tausch — „… seit vielen Jahren auf dem" wird zu „… seit vielen Jahren".
    const ohneWort = t.replace(/\s+\S+$/, "").replace(/\s*[.,;:–—-]+\s*$/, "").trim();
    if (!ohneWort || ohneWort === t) { t = ""; break; }
    t = ohneWort;
  }
  // Der abgeschnittene RELATIVSATZ. „… Rochus zu Lynar geboren, der
  // insbesondere durch Bauten im Dienst deutscher Fürsten" endet auf einem
  // Nomen — die Wortprüfung oben sieht nichts. Ein deutscher Relativsatz steht
  // aber in Verbletztstellung: Endet er auf einem GROSSGESCHRIEBENEN Wort und
  // trägt er nirgends ein kleingeschriebenes Verb, fehlt sein Ende.
  {
    const komma = t.lastIndexOf(",");
    if (komma >= 12) {
      const schwanz = t.slice(komma + 1).trim();
      const relativ = /^(der|die|das|dem|den|dessen|deren|welche[rsmn]?|wo|worin|woran)\s/i.test(schwanz);
      // KEIN \b: In JavaScript ist die Wortgrenze ASCII. Zwischen „F" und „ü"
      // sieht sie eine — und „Fürsten" galt als Verb „ürsten". Deshalb hier
      // explizite Grenzen aus dem deutschen Alphabet.
      const hatVerb = /(?:^|[^A-Za-zÄÖÜäöüß])[a-zäöüß]{2,}(?:t|te|en|st|et)(?![A-Za-zÄÖÜäöüß])/.test(schwanz);
      const endetAufNomen = /[A-ZÄÖÜ][a-zäöüß]+$/.test(schwanz);
      if (relativ && endetAufNomen && !hatVerb) t = t.slice(0, komma).trim();
    }
  }

  // Zweiter Durchgang für die trennbaren Präfixe. Sie beenden einen Satz
  // durchaus („Er kommt an."), aber nur nach einem VERB. Steht davor ein Nomen,
  // ist es keine Verbklammer, sondern ein abgeschnittenes Satzglied: „… seit
  // vielen Jahren auf". Deutsche Nomen sind groß, Verben klein — das ist hier
  // die verlässlichste Auskunft, die die Schreibung hergibt.
  for (let i = 0; i < 4; i++) {
    const m = t.match(/(\S+)\s+(an|auf|aus|ein|mit|nach|vor|zu|über|unter|um|ab|bei|los|weg|hin|her)$/i);
    if (!m || !/^[A-ZÄÖÜ]/.test(m[1]!)) break;
    t = t.replace(/\s+\S+$/, "").trim();
  }
  // KEINE Mindestlänge hier. Die Funktion läuft auch über frei getippte Felder
  // („sucht eine Akte", drei Wörter) — eine Untergrenze hätte die stillschweigend
  // geleert. Wer eine braucht, prüft sie beim Aufrufer.
  return HAENGT_IN_DER_LUFT.test(t) ? "" : t;
}
