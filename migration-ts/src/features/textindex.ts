// Der Textindex: was bei jedem erzeugten Text eingestellt war.
//
// WOZU. Diese Maschine misst inzwischen viel — ob ein Regler wirkt, ob eine
// Liste vollständig ist, ob die Register weit auseinanderliegen. Sie misst nur
// nie das, worauf es ankommt: welche Einstellungen zu einem Text führen, den
// man behalten will.
//
// Der beste Text dieses Projekts entstand aus Bergwelt + Formalismus +
// Griechische Tragödie. Das wissen wir, weil Juergen es erzählt hat. Wäre es
// aufgeschrieben worden, ließe sich die Frage stellen: Trägt die Mischung, oder
// war es ein guter Wurf?
//
// DESHALB WIRD JEDER TEXT AUFGEZEICHNET, nicht nur der behaltene. Ein Index nur
// über Behaltenes beantwortet nichts — er zeigt, was gute Texte gemeinsam
// haben, aber nicht, ob die schlechten es auch hatten. Erst der Vergleich
// beider Klassen sagt etwas.
//
// Der Eintrag enthält KEINEN Text. Er ist ein Beleg, kein zweites Archiv: Die
// Texte stehen in der Schatzkammer, und den Index doppelt zu füllen hieße, den
// Speicher zweimal zu verbrauchen und beide Stände auseinanderlaufen zu lassen.

export const INDEX_KEY = "divergenz_textindex_v1";
/** Wie viele Einträge aufbewahrt werden. Rund 300 Byte je Stück; achthundert
 *  sind ein Vierteljahr bei zehn Texten am Tag und belegen 240 KB. Darüber
 *  fällt das Älteste heraus. */
export const INDEX_DECKEL = 800;

export interface IndexEintrag {
  /** Kennung des Textes — dieselbe Rechnung wie in der Schatzkammer, damit
   *  „behalten" nachgetragen werden kann, ohne den Text zu speichern. */
  schluessel: string;
  /** ISO-Zeit auf die Minute. Sekunden helfen beim Auswerten nicht und machen
   *  jeden Eintrag um acht Zeichen länger. */
  zeit: string;
  form: string;
  woerter: number;
  /** Presets, aus denen die Bank gemischt war. */
  presets: string[];
  /** Abstand der Register — 0 heißt ein Register, 1 die beiden entferntesten. */
  spreizung: number;
  /** Reglerstellungen, kurz gehalten. */
  regler: Record<string, string>;
  /** Wer, Wo, Wann, Was. */
  ctx: { who: string; where: string; when: string; what: string };
  /** Anteile der Herkunft in Prozent, größter zuerst. */
  herkunft: Record<string, number>;
  /** Wurde der Text behalten? Wird NACHGETRAGEN, wenn er in die Schatzkammer
   *  wandert — beim Erzeugen weiß es noch niemand. */
  behalten: boolean;
}

/** Kennung eines Textes. Kurz und stabil: Dieselbe Zeichenkette ergibt
 *  dieselbe Kennung, und zwei verschiedene Texte fast nie dieselbe. */
export function textSchluessel(text: string): string {
  const t = (text || "").replace(/\s+/g, " ").trim().toLowerCase();
  let h1 = 0x811c9dc5, h2 = 0x1000193;
  for (let i = 0; i < t.length; i++) {
    h1 = ((h1 ^ t.charCodeAt(i)) * 0x01000193) >>> 0;
    h2 = ((h2 + t.charCodeAt(i)) * 0x85ebca6b) >>> 0;
  }
  return h1.toString(36) + h2.toString(36) + "-" + t.length.toString(36);
}

/** Zählt Wörter — dieselbe Rechnung wie überall sonst im Projekt. */
export const woerterVon = (t: string): number => (t.match(/\S+/g) || []).length;

/** Herkunftsanteile in Prozent. Die Eingabe ist eine Liste von Quellennamen,
 *  einer je Satz oder Abschnitt.
 *
 *  Gerundet auf ganze Prozent: Nachkommastellen täuschen bei zwanzig Sätzen
 *  eine Genauigkeit vor, die es nicht gibt. */
export function anteile(quellen: string[]): Record<string, number> {
  const n = quellen.length;
  if (!n) return {};
  const zahl: Record<string, number> = {};
  for (const q of quellen) zahl[q] = (zahl[q] || 0) + 1;
  const raus: Record<string, number> = {};
  for (const [k, v] of Object.entries(zahl).sort((a, b) => b[1] - a[1])) {
    raus[k] = Math.round((v / n) * 100);
  }
  return raus;
}

export function ladeIndex(): IndexEintrag[] {
  try {
    const r = JSON.parse(localStorage.getItem(INDEX_KEY) || "[]") as unknown;
    if (!Array.isArray(r)) return [];
    return (r as IndexEintrag[]).filter((e) => e && typeof e.schluessel === "string");
  } catch { return []; }
}

export function sichereIndex(l: IndexEintrag[]): boolean {
  try { localStorage.setItem(INDEX_KEY, JSON.stringify(l)); return true; } catch { return false; }
}

/** Einen Eintrag aufnehmen. Ein bekannter Schlüssel ERSETZT den alten und
 *  rutscht ans Ende: Derselbe Text zweimal erzeugt ist keine zweite Beobachtung
 *  — die Einstellung war dieselbe, sonst wäre der Text ein anderer. */
export function mischeIndex(alt: IndexEintrag[], neu: IndexEintrag, deckel = INDEX_DECKEL): IndexEintrag[] {
  const raus = alt.filter((e) => e.schluessel !== neu.schluessel);
  raus.push(neu);
  return deckel > 0 && raus.length > deckel ? raus.slice(raus.length - deckel) : raus;
}

/** Trägt nach, dass ein Text behalten wurde. Gibt zurück, ob der Eintrag
 *  gefunden wurde — ein Text aus der Zeit vor dem Index hat keinen. */
export function markiereBehalten(liste: IndexEintrag[], schluessel: string): boolean {
  const e = liste.find((x) => x.schluessel === schluessel);
  if (!e || e.behalten) return false;
  e.behalten = true;
  return true;
}

// ── Auswertung ──────────────────────────────────────────────────────────────
// Die eigentliche Frage: Welche Einstellung führt zu Texten, die behalten
// werden? Beantwortbar wird sie nur im VERGLEICH — deshalb steht neben der
// Quote immer, wie viele Texte sie stützen.

export interface Befund {
  wert: string;
  /** Wie oft diese Einstellung vorkam. */
  gesamt: number;
  behalten: number;
  /** Behaltensquote in Prozent. */
  quote: number;
}

/** Wertet den Index nach einem Merkmal aus, häufigste Quote zuerst.
 *
 *  `mindestens` filtert Einstellungen mit zu wenigen Beobachtungen heraus. Eine
 *  Quote von 100 Prozent aus einem einzigen Text ist keine Auskunft, sondern
 *  ein Zufall mit drei Stellen. */
export function werteAus(
  liste: IndexEintrag[], merkmal: (e: IndexEintrag) => string[], mindestens = 3,
): Befund[] {
  const zahl = new Map<string, { gesamt: number; behalten: number }>();
  for (const e of liste) {
    for (const w of new Set(merkmal(e))) {
      const v = zahl.get(w) || { gesamt: 0, behalten: 0 };
      v.gesamt++;
      if (e.behalten) v.behalten++;
      zahl.set(w, v);
    }
  }
  return [...zahl.entries()]
    .filter(([, v]) => v.gesamt >= mindestens)
    .map(([wert, v]) => ({ wert, gesamt: v.gesamt, behalten: v.behalten, quote: Math.round((v.behalten / v.gesamt) * 100) }))
    .sort((a, b) => b.quote - a.quote || b.gesamt - a.gesamt);
}

/** Die Grundquote: Wie viel wird überhaupt behalten?
 *
 *  Sie ist der Maßstab für alles andere. Eine Einstellung mit 30 Prozent ist
 *  gut, wenn im Mittel 20 behalten werden, und schlecht, wenn es 50 sind —
 *  dieselbe Rolle wie die Blindprobe beim Wirkungsmesser. */
export function grundquote(liste: IndexEintrag[]): number {
  if (!liste.length) return 0;
  return Math.round((liste.filter((e) => e.behalten).length / liste.length) * 100);
}

/** Der Index als CSV, für die Auswertung außerhalb der App.
 *
 *  CSV und nicht JSON: „Nachträglich auswerten" heißt Tabelle. Semikolon als
 *  Trenner, weil deutsche Tabellenprogramme sonst jede Zeile in eine Spalte
 *  legen. */
export function alsCsv(liste: IndexEintrag[]): string {
  const reglerNamen = [...new Set(liste.flatMap((e) => Object.keys(e.regler || {})))].sort();
  const quellNamen = [...new Set(liste.flatMap((e) => Object.keys(e.herkunft || {})))].sort();
  const kopf = ["zeit", "form", "woerter", "behalten", "presets", "spreizung",
    "wer", "wo", "wann", "was", ...reglerNamen, ...quellNamen.map((q) => "h_" + q)];
  const feld = (v: unknown): string => {
    const s = String(v ?? "");
    return /[";\n]/.test(s) ? '"' + s.split('"').join('""') + '"' : s;
  };
  const zeilen = liste.map((e) => [
    e.zeit, e.form, e.woerter, e.behalten ? 1 : 0, (e.presets || []).join(" + "), e.spreizung,
    e.ctx?.who, e.ctx?.where, e.ctx?.when, e.ctx?.what,
    ...reglerNamen.map((r) => e.regler?.[r] ?? ""),
    ...quellNamen.map((q) => e.herkunft?.[q] ?? 0),
  ].map(feld).join(";"));
  return [kopf.join(";"), ...zeilen].join("\n");
}
