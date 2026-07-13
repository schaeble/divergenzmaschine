// Sprachschliff (polishGerman) — regelbasierte Grammatik-/Zeichen-Glättung.
// 1:1 aus dem Live-Code portiert (self-contained).

interface PolishOpts {
  who?: string; style?: string;
  fixCapitalization?: boolean; fixSpacing?: boolean; fixPunctuation?: boolean;
}

export function polishGerman(text: string, opts: PolishOpts = {}): string {
  const {
    who = "",
    style = "surreal_precise",
    fixCapitalization = true,
    fixSpacing = true,
    fixPunctuation = true
  } = opts;

  let t = String(text ?? "");

  const escRE = (s: string): string => String(s).replace(/[.*+?^${}()|[\]\\]/g, "\\$&");

  if (fixSpacing) {
    t = t
      .replace(/\r\n/g, "\n")
      .replace(/[ \t]+\n/g, "\n")
      .replace(/ /g, " ")
      .replace(/[ \t]{2,}/g, " ")
      .replace(/\n{3,}/g, "\n\n")
      .replace(/\s+([,.;:!?])/g, "$1")
      .replace(/([,.;:!?])([A-Za-zÄÖÜäöü])/g, "$1 $2")
      .replace(/\(\s+/g, "(")
      .replace(/\s+\)/g, ")")
      .trim();
  }

  if (fixCapitalization) {
    t = t.replace(/^(\s*)([a-zäöü])/u, (_m,p1,p2)=> p1 + p2.toUpperCase());
    t = t.replace(/([.!?…]\s+|\n+)([a-zäöü])/gu, (_m,p1,p2)=> p1 + p2.toUpperCase());
  }

  if (who && who.trim()) {
    const w = who.trim();
    try {
      const rx = new RegExp(`(?<![\\p{L}\\p{N}_])${escRE(w)}(?![\\p{L}\\p{N}_])`, "giu");
      t = t.replace(rx, w);
    } catch {
      const rx2 = new RegExp(`\\b${escRE(w)}\\b`, "gi");
      t = t.replace(rx2, w);
    }
  }

  if (style === "surreal_precise") {
    // Verbesserte Artikelzuordnung mit Kontext
// Verbesserte Artikelzuordnung mit Kontext - ERWEITERTE LISTE
	const articleFix: [string, string][] = [
	  // Basis-Nomen (bereits vorhanden)
	  ["Karte", "die"], ["Geruch", "der"], ["Summen", "das"], ["Korridor", "der"],
	  ["Sensor", "der"], ["Raum", "der"], ["Archiv", "das"], ["Spiegel", "der"],
	  ["Text", "der"], ["Einsatz", "der"], ["Plan", "der"], ["Regel", "die"],
	  ["Wahrheit", "die"], ["Zeit", "die"], ["Mut", "der"], ["Tür", "die"],
	  ["Fenster", "das"], ["Lampe", "die"], ["Blick", "der"], ["Stimme", "die"],
	  ["Akte", "die"], ["Signal", "das"], ["System", "das"], ["Protokoll", "das"],
	  ["Formular", "das"], ["Stempel", "der"], ["Antrag", "der"], ["Frist", "die"],

	  // NEUE EINTRÄGE - Alltagsgegenstände
	  ["Tisch", "der"], ["Stuhl", "der"], ["Bett", "das"], ["Schrank", "der"],
	  ["Fensterbank", "die"], ["Vorhänge", "die"], ["Teppich", "der"], ["Wand", "die"],
	  ["Decke", "die"], ["Boden", "der"], ["Treppe", "die"], ["Flur", "der"],

	  // NEUE EINTRÄGE - Technik/Objekte
	  ["Bildschirm", "der"], ["Tastatur", "die"], ["Maus", "die"], ["Kabel", "das"],
	  ["Stecker", "der"], ["Steckdose", "die"], ["Lampe", "die"], ["Schalter", "der"],
	  ["Gerät", "das"], ["Maschine", "die"], ["Apparat", "der"], ["Anzeige", "die"],

	  // NEUE EINTRÄGE - Abstrakta
	  ["Gedanke", "der"], ["Idee", "die"], ["Konzept", "das"], ["Theorie", "die"],
	  ["Möglichkeit", "die"], ["Chance", "die"], ["Risiko", "das"], ["Gefahr", "die"],
	  ["Hoffnung", "die"], ["Angst", "die"], ["Freude", "die"], ["Trauer", "die"],

	  // NEUE EINTRÄGE - Personen/Rollen
	  ["Mensch", "der"], ["Frau", "die"], ["Mann", "der"], ["Kind", "das"],
	  ["Arzt", "der"], ["Ärztin", "die"], ["Lehrer", "der"], ["Schüler", "der"],
	  ["Kollege", "der"], ["Kollegin", "die"], ["Chef", "der"], ["Chefin", "die"],

	  // NEUE EINTRÄGE - Orte/Räume
	  ["Zimmer", "das"], ["Wohnung", "die"], ["Haus", "das"], ["Gebäude", "das"],
	  ["Straße", "die"], ["Platz", "der"], ["Stadt", "die"], ["Dorf", "das"],
	  ["Wald", "der"], ["Feld", "das"], ["Berg", "der"], ["Tal", "das"],

	  // NEUE EINTRÄGE - Zeitbegriffe
	  ["Tag", "der"], ["Nacht", "die"], ["Morgen", "der"], ["Abend", "der"],
	  ["Stunde", "die"], ["Minute", "die"], ["Sekunde", "die"], ["Augenblick", "der"],
	  ["Vergangenheit", "die"], ["Gegenwart", "die"], ["Zukunft", "die"],

	  // NEUE EINTRÄGE - Bürokratie (für bureau-Modus)
	  ["Bescheid", "der"], ["Verfügung", "die"], ["Genehmigung", "die"], ["Ablehnung", "die"],
	  ["Antragsformular", "das"], ["Eingangsbestätigung", "die"], ["Aktenzeichen", "das"],
	  ["Register", "das"], ["Kopie", "die"], ["Original", "das"], ["Dokument", "das"],

	  // NEUE EINTRÄGE - Natur (für myth-Modus)
	  ["Fluss", "der"], ["See", "der"], ["Meer", "das"], ["Ozean", "der"],
	  ["Stein", "der"], ["Fels", "der"], ["Erde", "die"], ["Himmel", "der"],
	  ["Sonne", "die"], ["Mond", "der"], ["Stern", "der"], ["Wolke", "die"],

	  // NEUE EINTRÄGE - Körper (für body-Modus)
	  ["Herz", "das"], ["Lunge", "die"], ["Magen", "der"], ["Haut", "die"],
	  ["Blut", "das"], ["Träne", "die"], ["Schweiß", "der"], ["Hand", "die"],
	  ["Fuß", "der"], ["Kopf", "der"], ["Gesicht", "das"], ["Auge", "das"]
	];

    for (const [noun, art] of articleFix) {
      const n = escRE(noun);
      // Präzisere Regex: Nicht ersetzen, wenn bereits ein Artikel oder Possessivpronomen vorhanden
      const rx = new RegExp(
        `(^|\\n|[.!?…]\\s+|\\bund\\s+|\\bdoch\\s+|\\bDoch\\s+|\\bDann\\s+|\\bPlötzlich\\s+)` +
        `(?!(die|der|das|den|dem|des|ein|eine|einen|einem|einer|eines|mein|dein|sein|ihr|unser|euer)\\s+)` +
        `(${n})\\b`,
        "giu"
      );
      t = t.replace(rx, (_m, p1, _p2, p3) => `${p1}${art} ${p3}`);
    }

    // Verbesserte Adjektivendungen
    t = t
      .replace(/\bein\s+([a-zäöü]+)es\s+(Stempel|Geruch|Korridor|Spiegel|Sensor|Plan|Blick)\b/gi,
        (_m, adj, noun) => `ein ${adj}er ${noun}`)
      .replace(/\bein\s+([a-zäöü]+)es\s+(Lampe|Uhr|Tür|Stimme|Akte)\b/gi,
        (_m, adj, noun) => `eine ${adj}e ${noun}`)
      .replace(/\bein\s+([a-zäöü]+)es\s+(Fenster|Signal|System|Protokoll|Archiv)\b/gi,
        (_m, adj, noun) => `ein ${adj}es ${noun}`);

    t = t
      .replace(/\bIch\s+sucht\b/gi, "Ich suche")
      .replace(/\bich\s+sucht\b/g, "ich suche")
      .replace(/\bIch\s+such\b/gi, "Ich suche")
      .replace(/\bIch\s+wollte\s+will\b/gi, "Ich wollte")
      .replace(/\bich\s+wollte\s+will\b/g, "ich wollte")
      .replace(/\bwill\s+will\b/gi, "will")
      .replace(/\bsteht\s+ich\b/gi, "stehe ich")
      .replace(/\bStand\s+ich\b/gi, "Stand ich");

    t = t
      .replace(/\bdreht\s+die\s+Logik\b/gi, "dreht sich die Logik")
      .replace(/\bdrehte\s+die\s+Logik\b/gi, "drehte sich die Logik");

    t = t
      .replace(/\bvor\s+ein\b/gi, "vor einem")
      .replace(/\bvor\s+eine\b/gi, "vor einer")
      .replace(/\bvor\s+einem\s+([a-zäöü]+)es\s+(Signal|Fenster|Zeichen|Muster|Paradoxon)\b/gi, "vor einem $1en $2")
      .replace(/\bvor\s+einem\s+([a-zäöü]+)er\s+(Stempel|Geruch|Korridor|Spiegel|Sensor)\b/gi, "vor einem $1en $2");

    t = t.replace(/(Beim dritten Mal ist es anders:\s*)([^.]+)\s+\1/gi, "$1$2 ");
    t = t.replace(/\bals\s+Beim\b/gi, "als");
    t = t.replace(/([A-Za-zÄÖÜäöü0-9])\.\.(?=\s|$)/g, "$1…");
    t = t.replace(/\.\.(?!\.)/g, ".");

    t = t.replace(/\bbemerkt ich\b/gi, "bemerke ich");
    t = t.replace(/\bIch bemerkt\b/g, "Ich bemerke");
    t = t.replace(/\bIch nimmt\b/gi, "Ich nehme");
    t = t.replace(/\bWir hatte\b/gi, "Wir hatten");
    t = t.replace(/\bwill wird\b/gi, "will");
    t = t.replace(/\bwill selig\b/gi, "will selig werden");

    const ent: [string, string][] = [
      ["Zettel","der"], ["Symbol","das"], ["Boden","der"], ["Lampe","die"], ["Tür","die"],
      ["Korridor","der"], ["Aktenzeichen","das"], ["Stimme","die"], ["Atem","der"],
      ["Geruch","der"], ["Schlüssel","der"], ["Fenster","das"], ["Signal","das"]
    ];

    for (const [noun, art] of ent) {
      const n = noun.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
      const re = new RegExp(`(^|\\n|[.!?…]\\s+|\\bund\\s+|\\bdoch\\s+)(?!die\\s+|der\\s+|das\\s+|den\\s+|dem\\s+|des\\s+|ein\\s+|eine\\s+|einen\\s+|einem\\s+|einer\\s+)(${n})\\b`, "giu");
      t = t.replace(re, (_m,p1,p2)=> `${p1}${art} ${p2}`);
    }

    t = t.replace(/\bein verschobenes Stimme\b/gi, "eine verschobene Stimme");
    t = t.replace(/\bein verzerrte Aktenzeichen\b/gi, "ein verzerrtes Aktenzeichen");
    t = t.replace(/\beinen geheime Geruch\b/gi, "einen geheimen Geruch");
    t = t.replace(/\bein zu genaues Boden\b/gi, "ein zu genauer Boden");
    t = t.replace(/\bein mattes Atem\b/gi, "ein matter Atem");
  }

  if (fixPunctuation) {
    t = t
      .replace(/,+/g, ",")
      .replace(/\s+,/g, ",")
      .replace(/,\s*,/g, ", ")
      .replace(/\s+\./g, ".")
      .replace(/:\s*:/g, ":");
  }

  t = (function dedupeAdjacentWords(s: string): string {
    let out = s;
    try {
      const rx = /\b([\p{L}\p{N}_]+)\s+\1\b/giu;
      for (let k = 0; k < 6; k++) {
        const next = out.replace(rx, "$1");
        if (next === out) break;
        out = next;
      }
      return out;
    } catch {
      const rx2 = /\b([A-Za-zÄÖÜäöüß0-9_]+)\s+\1\b/gi;
      for (let k = 0; k < 6; k++) {
        const next = out.replace(rx2, "$1");
        if (next === out) break;
        out = next;
      }
      return out;
    }
  })(t);

  return t.trim();
}