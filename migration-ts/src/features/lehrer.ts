// KI-Lehrer: der Studiotext geht an Claude und kommt bearbeitet zurück.
//
// Alles Rechnende steht hier und nicht in der Ansicht, damit es ohne Browser
// und ohne einen einzigen bezahlten Aufruf prüfbar ist: die Prompts, die
// Token- und Kostenschätzung und das laufende Konto.
//
// Warum überhaupt ein Lehrer: Ein Generator verführt zum endlosen Neuwürfeln,
// weil Bewerten anstrengender ist als Erzeugen. Eine Instanz, die den fertigen
// Text noch einmal anfasst, zwingt zum Innehalten.
//
// Und der Gegenzug, der in JEDEM Prompt steht: Ein Sprachmodell zieht von sich
// aus zur Mitte — es glättet, normalisiert, macht schöner. Das ist die
// Gegenbewegung zur Divergenz. Ohne ausdrückliche Anweisung frisst der Lehrer
// das Projekt langsam auf.

export type Auftragsart = "grammatik" | "plot" | "gedicht" | "prosa";

export interface Auftragsform {
  art: Auftragsart;
  /** Beschriftung der Schaltfläche. */
  name: string;
  /** Was der Auftrag tut — steht unter der Auswahl. */
  kurz: string;
  /** Braucht dieser Auftrag eine Vorstellung des Nutzers? */
  wunschNoetig: boolean;
  /** Aufforderung über dem Wunschfeld. */
  wunschLabel: string;
  wunschPlatzhalter: string;
}

export const AUFTRAEGE: Auftragsform[] = [
  {
    art: "grammatik", name: "Streng nach Grammatik",
    kurz: "Korrigiert Rechtschreibung, Zeichensetzung und Grammatik — sonst nichts. "
      + "Wortwahl, Ton und Schiefe bleiben, wie sie sind. Am Ende eine Liste der Eingriffe.",
    wunschNoetig: false,
    wunschLabel: "Zusätzliche Vorgabe (optional)",
    wunschPlatzhalter: "z. B. „alte Rechtschreibung beibehalten“ oder „Kommas nach Duden“",
  },
  {
    art: "plot", name: "Plot, den ich mir wünsche",
    kurz: "Formt den Text auf eine Handlung hin, die du vorgibst. Figuren, Orte und Bilder "
      + "bleiben; die Reihenfolge und das Gefälle ändern sich.",
    wunschNoetig: true,
    wunschLabel: "Welchen Plot wünschst du dir?",
    wunschPlatzhalter: "z. B. „Die Ermittlerin merkt zu spät, dass sie selbst die Gesuchte ist.“",
  },
  {
    art: "gedicht", name: "Ein Gedicht dazu",
    kurz: "Macht aus dem Material ein Gedicht — nach deinem Einfall, nicht nach Schema.",
    wunschNoetig: true,
    wunschLabel: "Was fällt dir dazu ein?",
    wunschPlatzhalter: "z. B. „vier Strophen, jede endet mit demselben Wort, kein Reim“",
  },
  {
    art: "prosa", name: "Prosa, die ich immer schreiben wollte",
    kurz: "Schreibt den Text als die Prosa aus, die dir vorschwebt — Ton, Tempo und Haltung "
      + "gibst du vor.",
    wunschNoetig: true,
    wunschLabel: "Welche Prosa wolltest du immer schreiben?",
    wunschPlatzhalter: "z. B. „lange Sätze, kühler Blick, niemand erklärt etwas“",
  },
];

export function auftragVon(art: string): Auftragsform {
  return AUFTRAEGE.find((a) => a.art === art) || AUFTRAEGE[0]!;
}

/** Steht in jedem Prompt. Ohne diesen Satz glättet das Modell die Eigenart weg,
 *  die der ganze Grund für die Maschine ist. */
const GEGENZUG =
  "WICHTIG: Der Text kommt aus einem experimentellen Generator und ist absichtlich sperrig. "
  + "Glätte ihn nicht zur Mitte hin. Behalte Brüche, ungewöhnliche Fügungen und harte Übergänge, "
  + "wo sie tragen. Mache nichts nur deshalb schöner, weil es schöner ginge.";

const NUR_TEXT =
  "Gib NUR das Ergebnis zurück — keine Überschrift, keine Einleitung, kein Meta-Kommentar.";

/** Der Prompt für einen Auftrag. Reine Zeichenkette, damit der Prüfstand ihn
 *  ansehen kann, ohne etwas zu bezahlen. */
export function bauePrompt(art: Auftragsart, text: string, wunsch: string, woerter: number): string {
  const t = (text || "").trim();
  const w = (wunsch || "").trim();
  const n = Math.max(40, Math.min(3000, Math.round(woerter) || 300));
  const material = "\n\n--- TEXT ---\n\n" + t;

  if (art === "grammatik") {
    return "Du bist Korrektor für einen deutschsprachigen literarischen Text. "
      + "Korrigiere AUSSCHLIESSLICH Rechtschreibung, Zeichensetzung, Groß- und Kleinschreibung, "
      + "Beugung und Satzbau, soweit er grammatisch falsch ist. "
      + "Ändere KEINE Wortwahl, keinen Ton, keine Bilder, keine Reihenfolge, und kürze nichts. "
      + "Ein ungewöhnlicher, aber grammatisch richtiger Satz bleibt unangetastet.\n"
      + GEGENZUG + "\n"
      + (w ? `\nZusätzliche Vorgabe des Nutzers (vorrangig): ${w}\n` : "")
      + "\nGib zuerst den korrigierten Text zurück. Danach eine Zeile mit genau "
      + "„— Änderungen —“ und darunter eine knappe Liste der Eingriffe, je einer pro Zeile, "
      + "in der Form „falsch → richtig (Grund in drei bis fünf Wörtern)“. "
      + "Hast du nichts geändert, schreibe unter die Zeile „keine“."
      + material;
  }

  if (art === "gedicht") {
    return "Du arbeitest mit dem Material eines deutschsprachigen Textgenerators. "
      + "Mache daraus ein Gedicht auf Deutsch.\n"
      + `Der Einfall des Nutzers, dem du folgst: ${w || "(keiner genannt — dann finde die Form aus dem Material)"}\n`
      + "Nimm Wörter, Bilder und Figuren aus dem Text; erfinde nur, was die Form verlangt. "
      + "Kein Reimzwang, keine gefällige Rundung, kein Schlussvers, der alles erklärt.\n"
      + GEGENZUG + "\n" + NUR_TEXT
      + material;
  }

  if (art === "plot") {
    return "Du arbeitest mit dem Rohtext eines deutschsprachigen Textgenerators. "
      + `Schreibe ihn zu einem zusammenhängenden Text von etwa ${n} Wörtern um, der folgender Handlung folgt:\n`
      + `${w || "(keine genannt — dann lege die Handlung frei, die im Material schon angelegt ist)"}\n`
      + "Figuren, Orte, Gegenstände und Bilder aus dem Text bleiben erhalten; du ordnest sie neu und "
      + "gibst ihnen ein Gefälle. Erfinde so wenig hinzu wie möglich. Deutsch.\n"
      + GEGENZUG + "\n" + NUR_TEXT
      + material;
  }

  return "Du arbeitest mit dem Rohtext eines deutschsprachigen Textgenerators. "
    + `Schreibe daraus literarische Prosa von etwa ${n} Wörtern.\n`
    + `Ton, Tempo und Haltung gibt der Nutzer vor: ${w || "(nichts genannt — dann folge dem Ton des Materials)"}\n`
    + "Bleibe bei den vorgegebenen Figuren, Orten und der Grundidee; erfinde nichts, was dem Text "
    + "widerspricht. Deutsch.\n"
    + GEGENZUG + "\n" + NUR_TEXT
    + material;
}

// ── Token und Kosten ────────────────────────────────────────────────────────
// Beides ist SCHÄTZUNG und wird auch so genannt. Die echten Zahlen kommen nach
// dem Lauf von der API zurück und wandern ins Konto; die Schätzung dient nur
// dazu, vor dem Klick zu wissen, ob es um Cent oder um Euro geht.

/** Grobe Tokenzahl für deutschen Text. Deutsch tokenisiert schlechter als
 *  Englisch (lange zusammengesetzte Wörter, Umlaute), und neuere Modelle
 *  erzeugen zusätzlich mehr Token für denselben Text. Lieber zu hoch schätzen
 *  als zu niedrig: Eine Schätzung, die die Rechnung unterbietet, ist schlimmer
 *  als gar keine. */
export function schaetzeTokens(text: string): number {
  const s = text || "";
  if (!s) return 0;
  return Math.ceil(s.length / 3);
}

export interface Modell {
  id: string; name: string;
  /** US-Dollar je Million Token. */
  ein: number; aus: number;
}

/** Stand 17. August 2026. Preise ändern sich — deshalb wird der benutzte Satz
 *  in der Oberfläche IMMER mit angezeigt. Ist er falsch, sieht man es sofort,
 *  statt einer stillen Fehlrechnung zu vertrauen. */
export const PREIS_STAND = "17.08.2026";
export const MODELLE: Modell[] = [
  { id: "claude-haiku-4-5", name: "Haiku 4.5 — am günstigsten", ein: 1, aus: 5 },
  { id: "claude-sonnet-5", name: "Sonnet 5 — Mittelweg", ein: 2, aus: 10 },
  { id: "claude-opus-5", name: "Opus 5 — am teuersten", ein: 5, aus: 25 },
];
export function modellVon(id: string): Modell {
  return MODELLE.find((m) => m.id === id) || MODELLE[0]!;
}

/** Kosten in US-Dollar. */
export function kostenUsd(einTok: number, ausTok: number, m: Modell): number {
  return (Math.max(0, einTok) * m.ein + Math.max(0, ausTok) * m.aus) / 1_000_000;
}

/** Euro-Betrag als Zeichenkette. Unter einem Cent wird nicht auf 0,00 €
 *  gerundet — „0,00 €“ läse sich wie „kostenlos“, und das ist es nicht. */
export function euro(usd: number, kurs: number): string {
  const e = usd * (kurs > 0 ? kurs : 1);
  if (e > 0 && e < 0.005) return "unter 1 Cent";
  return e.toLocaleString("de-DE", { minimumFractionDigits: 2, maximumFractionDigits: 2 }) + " €";
}

// ── Konto ───────────────────────────────────────────────────────────────────
// Was ein Lauf gekostet hat, weiß man erst hinterher. Aufaddiert wird mit den
// ECHTEN Tokenzahlen aus der Antwort, nicht mit der Schätzung — sonst führte
// das Konto den Fehler der Schätzung dauerhaft mit.

export const KONTO_KEY = "divergenz_lehrer_konto_v1";

export interface Konto { laeufe: number; ein: number; aus: number; usd: number }
export const KONTO_LEER: Konto = { laeufe: 0, ein: 0, aus: 0, usd: 0 };

export function ladeKonto(): Konto {
  try {
    const r = JSON.parse(localStorage.getItem(KONTO_KEY) || "null") as Partial<Konto> | null;
    if (!r) return { ...KONTO_LEER };
    return {
      laeufe: Number(r.laeufe) || 0, ein: Number(r.ein) || 0,
      aus: Number(r.aus) || 0, usd: Number(r.usd) || 0,
    };
  } catch { return { ...KONTO_LEER }; }
}

export function bucheKonto(k: Konto, einTok: number, ausTok: number, m: Modell): Konto {
  return {
    laeufe: k.laeufe + 1,
    ein: k.ein + Math.max(0, einTok),
    aus: k.aus + Math.max(0, ausTok),
    usd: k.usd + kostenUsd(einTok, ausTok, m),
  };
}

export function sichereKonto(k: Konto): void {
  try { localStorage.setItem(KONTO_KEY, JSON.stringify(k)); } catch { /* voll */ }
}

/** Wie viele Antwort-Token höchstens. Der Deckel ist die wirksamste Bremse:
 *  Ausgabe kostet das Fünffache der Eingabe, und ein Modell füllt aus, was man
 *  ihm lässt. Die Grammatik-Korrektur braucht ungefähr die Länge des Textes
 *  plus die Änderungsliste. */
export function maxToken(art: Auftragsart, text: string, woerter: number): number {
  if (art === "grammatik") return Math.min(8192, Math.ceil(schaetzeTokens(text) * 1.6) + 600);
  const n = Math.max(40, Math.min(3000, Math.round(woerter) || 300));
  return Math.min(8192, Math.ceil(n * 2.4) + 300);
}

// ── Was ist neu? ────────────────────────────────────────────────────────────
// Der Lehrer gibt einen fertigen Text zurück, und man sieht ihm nicht an, was
// aus dem eigenen Material stammt und was er hinzugebracht hat. Genau das ist
// aber die Frage, die man an ihn hat.
//
// Zwei Verfahren, weil zwei verschiedene Fragen dahinterstehen:
//
//   „genau“      — Wort-für-Wort-Vergleich (längste gemeinsame Folge). Sagt:
//                  DIESE Stelle stand vorher nicht da. Richtig bei der
//                  Korrektur, wo sich fast nichts ändert.
//   „wortschatz“ — Ein Wort gilt als neu, wenn es im Ausgangstext überhaupt
//                  nicht vorkam. Richtig beim Umschreiben, wo der genaue
//                  Vergleich alles markieren würde und damit nichts.
//
// Welches benutzt wurde, wird IMMER mitgeteilt. Eine Farbe, deren Bedeutung
// man nicht kennt, ist schlimmer als keine Farbe.

export interface Stueck { text: string; neu: boolean }
export type Verfahren = "genau" | "wortschatz";

/** Text in Wörter und Zwischenräume zerlegen, verlustfrei: aneinandergehängt
 *  ergeben die Teile wieder den Text. Zeilenumbrüche bleiben dadurch erhalten —
 *  bei einem Gedicht ist das nicht nebensächlich. */
export function teile(s: string): string[] {
  return (s || "").split(/(\s+)/).filter((t) => t !== "");
}

/** Vergleichsform eines Teils. Satzzeichen am Rand und Groß-/Kleinschreibung
 *  sollen keinen Unterschied machen — sonst gälte „Werkzeugen.“ gegenüber
 *  „Werkzeugen“ als neu, und die Markierung wäre Rauschen. */
export function schluessel(t: string): string {
  if (/^\s+$/.test(t)) return " ";
  const k = t.toLowerCase().replace(/^[^\p{L}\p{N}]+|[^\p{L}\p{N}]+$/gu, "");
  return k || t.toLowerCase();
}

/** Obergrenze für den genauen Vergleich. Er braucht Platz im Verhältnis
 *  alt × neu; bei zwei langen, völlig verschiedenen Texten wäre das sowohl
 *  teuer als auch nutzlos. */
export const GENAU_GRENZE = 1_500_000;

function zusammenfassen(stuecke: Stueck[]): Stueck[] {
  const raus: Stueck[] = [];
  for (const s of stuecke) {
    const letzt = raus[raus.length - 1];
    if (letzt && letzt.neu === s.neu) letzt.text += s.text;
    else raus.push({ text: s.text, neu: s.neu });
  }
  return raus;
}

/** Markiert im NEUEN Text, was gegenüber dem alten hinzugekommen ist.
 *  Ausgegeben werden immer die Teile des neuen Textes — der alte bestimmt nur
 *  die Kennzeichnung. */
export function markiereNeu(alt: string, neu: string): { stuecke: Stueck[]; verfahren: Verfahren } {
  const b = teile(neu);
  if (!b.length) return { stuecke: [], verfahren: "genau" };
  const a = teile(alt);
  if (!a.length) return { stuecke: zusammenfassen(b.map((t) => ({ text: t, neu: !/^\s+$/.test(t) }))), verfahren: "genau" };

  const ka = a.map(schluessel), kb = b.map(schluessel);

  // Gemeinsamer Anfang und gemeinsames Ende zuerst abziehen. Bei der Korrektur
  // ist danach fast nichts mehr übrig, und der teure Teil entfällt ganz.
  let vorn = 0;
  while (vorn < ka.length && vorn < kb.length && ka[vorn] === kb[vorn]) vorn++;
  let hinten = 0;
  while (hinten < ka.length - vorn && hinten < kb.length - vorn
    && ka[ka.length - 1 - hinten] === kb[kb.length - 1 - hinten]) hinten++;

  const ma = ka.slice(vorn, ka.length - hinten);
  const mb = kb.slice(vorn, kb.length - hinten);
  const kopf: Stueck[] = b.slice(0, vorn).map((t) => ({ text: t, neu: false }));
  const fuss: Stueck[] = b.slice(b.length - hinten).map((t) => ({ text: t, neu: false }));

  if (ma.length * mb.length > GENAU_GRENZE) {
    const vorrat = new Set(ka);
    const mitte = mb.map((k, i) => ({ text: b[vorn + i]!, neu: k !== " " && !vorrat.has(k) }));
    return { stuecke: zusammenfassen([...kopf, ...mitte, ...fuss]), verfahren: "wortschatz" };
  }

  // Längste gemeinsame Folge. Uint32Array statt verschachtelter Felder: Bei
  // 1,5 Mio. Zellen ist der Unterschied zwischen „läuft“ und „ruckelt“.
  const n = ma.length, m = mb.length;
  const t = new Uint32Array((n + 1) * (m + 1));
  for (let i = n - 1; i >= 0; i--) {
    for (let j = m - 1; j >= 0; j--) {
      t[i * (m + 1) + j] = ma[i] === mb[j]
        ? t[(i + 1) * (m + 1) + j + 1]! + 1
        : Math.max(t[(i + 1) * (m + 1) + j]!, t[i * (m + 1) + j + 1]!);
    }
  }
  const mitte: Stueck[] = [];
  let i = 0, j = 0;
  while (j < m) {
    if (i < n && ma[i] === mb[j]) { mitte.push({ text: b[vorn + j]!, neu: false }); i++; j++; }
    else if (i < n && t[(i + 1) * (m + 1) + j]! >= t[i * (m + 1) + j + 1]!) i++;
    else { mitte.push({ text: b[vorn + j]!, neu: mb[j] !== " " }); j++; }
  }
  return { stuecke: zusammenfassen([...kopf, ...mitte, ...fuss]), verfahren: "genau" };
}

/** Wie viel des Ergebnisses ist neu — in Prozent der Wörter. Eine Zahl neben
 *  der Farbe: „fast alles neu“ ist ein anderer Befund als „drei Wörter“. */
export function anteilNeu(stuecke: Stueck[]): number {
  let alle = 0, neu = 0;
  for (const s of stuecke) {
    const w = (s.text.match(/\S+/g) || []).length;
    alle += w;
    if (s.neu) neu += w;
  }
  return alle ? Math.round((neu / alle) * 100) : 0;
}
