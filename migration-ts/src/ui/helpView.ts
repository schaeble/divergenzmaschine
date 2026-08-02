// Hilfe-Tab: erkl\u00e4rt Tabs, Studio-Bedienelemente und Funktionen.
import { el } from "./dom";
import { VERSION } from "../version";

const ARCH_SVG = `<svg viewBox="0 0 1040 724" xmlns="http://www.w3.org/2000/svg" font-family="Segoe UI, Helvetica, Arial, sans-serif"><rect x="1" y="1" width="1038" height="722" rx="18" fill="#fbfaf6" stroke="#dcd7cc" stroke-width="1.4"/><circle cx="46" cy="28" r="6" fill="#33a894"/><text x="58" y="32" font-size="13" fill="#1d2430">Gedächtnis &amp; Material</text><circle cx="320" cy="28" r="6" fill="#8b5cf6"/><text x="332" y="32" font-size="13" fill="#1d2430">Erzeugen &amp; Verarbeiten</text><circle cx="610" cy="28" r="6" fill="#d7a531"/><text x="622" y="32" font-size="13" fill="#1d2430">KI-gestützt (Anthropic)</text><text x="520.0" y="58" text-anchor="middle" font-size="13.5" font-weight="600" fill="#2f9e44">↻ Selbstfütterung → Korpus + Pools (Gewicht ×3 / ×2 / ×1)</text><text x="28" y="92" font-size="12.5" font-weight="700" letter-spacing="0.06em" fill="#333c4c">① GEDÄCHTNIS &amp; MATERIAL</text><rect x="28" y="104" width="181" height="66" rx="12" fill="#ddf3ed" stroke="#33a894" stroke-width="1.6"/><rect x="28" y="104" width="6" height="66" rx="3" fill="#33a894"/><text x="118.5" y="128" text-anchor="middle" font-size="15" font-weight="700" fill="#0f4a41">4W-Kontext</text><text x="118.5" y="147" text-anchor="middle" font-size="11.5" fill="#414b5a">Wo·Wann·Wer·Was</text><rect x="224" y="104" width="181" height="66" rx="12" fill="#ddf3ed" stroke="#33a894" stroke-width="1.6"/><rect x="224" y="104" width="6" height="66" rx="3" fill="#33a894"/><text x="314.5" y="128" text-anchor="middle" font-size="15" font-weight="700" fill="#0f4a41">Wortbank</text><text x="314.5" y="147" text-anchor="middle" font-size="11.5" fill="#414b5a">Presets · Auto-Mix</text><rect x="420" y="104" width="181" height="66" rx="12" fill="#ddf3ed" stroke="#33a894" stroke-width="1.6"/><rect x="420" y="104" width="6" height="66" rx="3" fill="#33a894"/><text x="510.5" y="128" text-anchor="middle" font-size="15" font-weight="700" fill="#0f4a41">Korpus</text><text x="510.5" y="147" text-anchor="middle" font-size="11.5" fill="#414b5a">Markov-Modell</text><rect x="616" y="104" width="181" height="66" rx="12" fill="#ddf3ed" stroke="#33a894" stroke-width="1.6"/><rect x="616" y="104" width="6" height="66" rx="3" fill="#33a894"/><text x="706.5" y="128" text-anchor="middle" font-size="15" font-weight="700" fill="#0f4a41">Lebendige Pools</text><text x="706.5" y="147" text-anchor="middle" font-size="11.5" fill="#414b5a">Motiv-Gedächtnis</text><rect x="812" y="104" width="181" height="66" rx="12" fill="#ddf3ed" stroke="#33a894" stroke-width="1.6"/><rect x="812" y="104" width="6" height="66" rx="3" fill="#33a894"/><text x="902.5" y="128" text-anchor="middle" font-size="15" font-weight="700" fill="#0f4a41">Schatzkammer</text><text x="902.5" y="147" text-anchor="middle" font-size="11.5" fill="#414b5a">kuratiertes Archiv</text><line x1="510.5" y1="172" x2="510.5" y2="200" stroke="#59616f" stroke-width="2"/><path d="M505.5,199 L510.5,208 L515.5,199 Z" fill="#59616f"/><text x="526.5" y="190" text-anchor="start" font-size="12" font-style="italic" fill="#4a5262">Markov: Aus / Mix / Stark · 0–40 %</text><text x="28" y="228" font-size="12.5" font-weight="700" letter-spacing="0.06em" fill="#333c4c">② ERZEUGEN</text><rect x="28" y="253" width="181" height="66" rx="12" fill="#eae4fb" stroke="#8b5cf6" stroke-width="1.6"/><rect x="28" y="253" width="6" height="66" rx="3" fill="#8b5cf6"/><text x="118.5" y="277" text-anchor="middle" font-size="16" font-weight="700" fill="#372a6b">Ideen</text><text x="118.5" y="296" text-anchor="middle" font-size="12.5" fill="#414b5a">Prämissen · Assoz.</text><rect x="812" y="253" width="181" height="66" rx="12" fill="#eae4fb" stroke="#8b5cf6" stroke-width="1.6"/><rect x="812" y="253" width="6" height="66" rx="3" fill="#8b5cf6"/><text x="902.5" y="277" text-anchor="middle" font-size="16" font-weight="700" fill="#372a6b">Welt</text><text x="902.5" y="296" text-anchor="middle" font-size="12.5" fill="#414b5a">Omnikognition</text><rect x="224" y="240" width="573" height="92" rx="12" fill="#eae4fb" stroke="#8b5cf6" stroke-width="1.6"/><rect x="224" y="240" width="6" height="92" rx="3" fill="#8b5cf6"/><text x="510.5" y="264" text-anchor="middle" font-size="17" font-weight="700" fill="#372a6b">STUDIO</text><text x="510.5" y="283" text-anchor="middle" font-size="12.5" fill="#414b5a">Struktur · Ton · Form · Perspektive · Rhythmus</text><text x="510.5" y="300" text-anchor="middle" font-size="12.5" fill="#414b5a">Markov · Archetyp · Instabilität · Disruptor · Varianz</text><line x1="510.5" y1="334" x2="510.5" y2="360" stroke="#59616f" stroke-width="2"/><path d="M505.5,359 L510.5,368 L515.5,359 Z" fill="#59616f"/><text x="526.5" y="356" text-anchor="start" font-size="12" font-style="italic" fill="#4a5262">Rohtext</text><text x="28" y="388" font-size="12.5" font-weight="700" letter-spacing="0.06em" fill="#333c4c">③ AUSWÄHLEN — Test &amp; Ranking</text><rect x="28" y="398" width="984" height="66" rx="12" fill="#f0ecfc" stroke="#8b5cf6" stroke-width="1.6"/><rect x="28" y="398" width="6" height="66" rx="3" fill="#8b5cf6"/><text x="520.0" y="422" text-anchor="middle" font-size="17" font-weight="700" fill="#372a6b">Ranking / Bestenauslese</text><text x="520.0" y="441" text-anchor="middle" font-size="12.5" fill="#414b5a">Qualität + Novelty + Überraschung + Grammatik + Constraints</text><line x1="510.5" y1="466" x2="510.5" y2="492" stroke="#59616f" stroke-width="2"/><path d="M505.5,491 L510.5,500 L515.5,491 Z" fill="#59616f"/><text x="526.5" y="488" text-anchor="start" font-size="12" font-style="italic" fill="#4a5262">beste Variante</text><text x="28" y="520" font-size="12.5" font-weight="700" letter-spacing="0.06em" fill="#333c4c">④ AUSARBEITEN</text><rect x="28" y="530" width="483.0" height="86" rx="12" fill="#eae4fb" stroke="#8b5cf6" stroke-width="1.6"/><rect x="28" y="530" width="6" height="86" rx="3" fill="#8b5cf6"/><text x="269.5" y="554" text-anchor="middle" font-size="17" font-weight="700" fill="#372a6b">Werkstatt</text><text x="269.5" y="573" text-anchor="middle" font-size="12.5" fill="#414b5a">Gerüst → Rohfassung → Politur</text><text x="269.5" y="590" text-anchor="middle" font-size="12.5" fill="#414b5a">Erzählbögen · Grammatik-Pass</text><rect x="469.0" y="540" width="32" height="19" rx="9.5" fill="#f4c250" stroke="#d7a531"/><text x="485.0" y="553.5" text-anchor="middle" font-size="11" font-weight="700" fill="#4a3600">KI</text><rect x="529.0" y="530" width="483.0" height="86" rx="12" fill="#eae4fb" stroke="#8b5cf6" stroke-width="1.6"/><rect x="529.0" y="530" width="6" height="86" rx="3" fill="#8b5cf6"/><text x="770.5" y="554" text-anchor="middle" font-size="17" font-weight="700" fill="#372a6b">Montage</text><text x="770.5" y="573" text-anchor="middle" font-size="12.5" fill="#414b5a">Mosaik · Jahreszeit · Divergenz · Kaleidoskop</text><text x="770.5" y="590" text-anchor="middle" font-size="12.5" fill="#414b5a">Emergenz · Hyperlink (KI-Weberei)</text><rect x="970.0" y="540" width="32" height="19" rx="9.5" fill="#f4c250" stroke="#d7a531"/><text x="986.0" y="553.5" text-anchor="middle" font-size="11" font-weight="700" fill="#4a3600">KI</text><text x="520.0" y="634" text-anchor="middle" font-size="12" font-style="italic" fill="#4a5262">Montage → Werkstatt</text><rect x="420.0" y="646" width="200" height="46" rx="12" fill="#ffffff" stroke="#33a894" stroke-width="1.6"/><text x="520.0" y="675" text-anchor="middle" font-size="16" font-weight="700" fill="#1d2430">★ Merken</text><line x1="510.5" y1="616" x2="510.5" y2="638" stroke="#59616f" stroke-width="2"/><path d="M505.5,637 L510.5,646 L515.5,637 Z" fill="#59616f"/><path d="M420.0,669.0 H14 V116 H24" fill="none" stroke="#2f9e44" stroke-width="2" stroke-dasharray="7 5"/><path d="M25,111 L15,116 L25,121 Z" fill="#2f9e44"/></svg>`;


type Part = string | HTMLElement;
type Item = [string, Part[]];

function section(id: string, title: string, rows: Item[]): HTMLElement {
  const ul = el("ul", { class: "help-list" });
  rows.forEach(([k, parts]) => {
    const li = el("li", {}, el("b", {}, k), " — ");
    parts.forEach((p) => li.append(p));
    ul.append(li);
  });
  return el("div", { class: "help-sec", id: "help-" + id }, el("h3", {}, title), ul);
}

// Querverweis: springt zum Zielabschnitt und hebt ihn kurz hervor.
function lnk(label: string, target: string): HTMLElement {
  const a = el("a", { class: "help-jump", href: "#help-" + target }, label);
  a.addEventListener("click", (e) => {
    e.preventDefault();
    const t = document.getElementById("help-" + target);
    if (!t) return;
    t.scrollIntoView({ behavior: "smooth", block: "start" });
    t.classList.remove("help-flash");
    void t.offsetWidth; // Reflow erzwingen, damit die Animation neu startet
    t.classList.add("help-flash");
  });
  return a;
}
// kurze Text+Link-Zeile bequem bauen
const P = (...parts: Part[]): Part[] => parts;

export function mountHelp(root: HTMLElement): void {
  root.innerHTML = "";
  const wrap = el("div", { class: "help" });
  wrap.append(el("p", { class: "muted" }, `Divergenzmaschine v${VERSION} — was die Bedienelemente tun. Blaue Verweise springen zum passenden Abschnitt.`));

  // 1) Architektur zuerst — die Einleitung: wie alles zusammenhängt.
  const arch = el("div", { class: "help-arch help-sec", id: "help-arch" });
  arch.append(el("h3", {}, "Architektur — wie ein Text entsteht"));
  const fig = el("div", { class: "help-arch-fig" });
  fig.innerHTML = ARCH_SVG;
  arch.append(fig);
  arch.append(el("p", { class: "muted" }, "Der grüne Kreislauf: gemerkte Texte füttern Korpus und Pools zurück (Selbstfütterung). KI-Bausteine (Werkstatt, Montage) brauchen einen API-Schlüssel."));
  wrap.append(arch);

  // 2) Tabs — der Überblick über die App (wie die Tableiste oben).
  wrap.append(section("tabs", "Tabs — die App im Überblick", [
    ["Studio", P("Die Hauptbühne: aus ", lnk("4W-Kontext", "kontext"), ", ", lnk("Preset, Ton und Form", "presetton"), " entstehen die Texte. Alle ", lnk("Stil-Regler", "werkzeug"), " (Struktur, Modus, Perspektive, Rhythmus, Markov, Archetyp, Instabilität …), die ", lnk("Aktionen", "aktionen"), " Generieren/Variante/Würfeln/Merken/Tresor, das ", lnk("Editieren mit Passagen-Austausch", "faerben"), " sowie ", lnk("Test & Ranking", "ranking"), ". Eine neue Variante gibt es auch per Pfeil links/rechts im Textfenster oder per Wischen auf dem Handy.")],
    ["Ideen", P("Prämissen-Generator: zehn Profil-Merkmale (Genre, Figurtyp, Ort, Zeit …) formen die Richtung kurzer Story-Ideen. Preset wählen, Regler selbst stellen oder per KI aus einem Thema ein Profil bauen; der Divergenz-Regler steuert die Streuung (zahm → radikal). „→ Studio“ übernimmt eine Prämisse als ", lnk("4W-Kontext", "kontext"), ". Eigene Profile als Preset speicherbar.")],
    ["Welt", P("Omnikognition (Wahrnehmungs-Modus): aus dem Profil eines Lebewesens (Sinne, Zeitgefühl, Selbstmodell, soziale Kognition … zehn Kriterien) werden ", lnk("Perspektive, Rhythmus", "werkzeug"), " und Bildwelt geformt und ins Studio übertragen. Preset wählen, Kriterien selbst stellen oder per „KI-Profil erzeugen“ aus einem Namen bauen; eigene Profile als Preset speichern.")],
    ["Wortbank", P("Das Material-Herz: Presets laden, Auto-Mix, Regeln-Box (wie Einträge zu schreiben sind), „Preset bearbeiten und sichern“ als Editor aller 7 Kategorien (Motive, Haken, Requisiten, Wendungen, Hindernisse, Einsätze, Schlüsse), Mutation, Preset-Assistent und Wortarchiv (KI oder Einfügen, in Gruppen), JSON-Import/Export, „Als Preset speichern“ (schlägt den aktiven Namen vor), „Preset umbenennen“ und „Preset löschen“ für eigene Presets. „Mehrere Presets per KI aktualisieren“ verbessert Presets im Stapel; die ", lnk("Preset-2.0-Felder", "preset2"), " ergänzen den dramaturgischen Überbau. Unten aufklappbar die KI-Wortbank aus 4W plus Zusatzvorgabe.")],
    ["Korpus", P("Eigener Trainingstext für den ", lnk("Markov-Generator", "werkzeug"), ". „Säubern“ segmentiert satzweise und entfernt Fragmente, Kopfzeilen-Reste und doppelte Sätze (neu hinzugefügter Text wird schon beim Hinzufügen gesäubert). Dazu Statistik, Inhalt ein-/ausblenden und TXT-Export; dauerhaft im Browser gespeichert.")],
    ["Oszilloskop", P("Satzrhythmus-Werkzeug in zwei Teilen. (1) Messen: ein Text (letzte Generierung oder Fremdtext wie Kleist/Kafka) wird zu einer Kurve analysiert — Streuung σ, lexikalische Vielfalt, Wiederholungs- und Interpunktionsdichte. (2) Rhythmus-Transplantation: eine Satzlängen-Kurve (aus dem Text abgelesen oder als Muster gewählt) steuert die Generierung — fremder Atem, eigenes Vokabular aus der aktiven ", lnk("Wortbank", "tabs"), ". Kurven lassen sich speichern und laden.")],
    ["Schatzkammer", P("Kuratiertes Archiv der ", lnk("gemerkten Texte", "aktionen"), ". Oben eine Übersicht (Textzahl, Wörter, Ø pro Text) mit anklickbaren Form-Filtern (Prosa, Vers, Szene/Dialog, Werkstatt); jeder Eintrag zeigt Form, Wortzahl, Datum und Kontext. Ansehen, Vorlesen, ins Studio laden, einzeln löschen, alle als TXT exportieren oder die ganze Kammer leeren (Korpus und Pools bleiben). Der ", el("b", {}, "Tresor"), " verbirgt einzelne Texte: per Schloss-Knopf markieren; sie verschwinden aus Liste und Übersicht und werden erst sichtbar, wenn im unbeschrifteten Feld „#g“ eingegeben wird (das ✕ verbirgt sie wieder, ebenso ein Tab-Wechsel). Hinweis: Das ist eine Sicht-Verbergung, keine Verschlüsselung.")],
    ["Montage", P("Fragmente sammeln (aus der Schatzkammer, dem letzten Studio-Text oder frei eingefügt) und nach einem Meta-Bogen zusammensetzen: Mosaik, Jahreszeiten, Divergenz und Kaleidoskop (offline) sowie Emergenz und Hyperlink als KI-Weberei (API-Schlüssel nötig). Reihenfolge per ↑/↓ ändern, Ergebnis kopieren oder in die Schatzkammer merken.")],
    ["Werkstatt", P("Aus einem Rohtext (Studio, Schatzkammer oder eingefügt) wird in drei Stufen eine Kurzgeschichte: 1 Gerüst (Figur, Wunsch, Hindernis, Wendung, Schluss, Szenenschritte — vor dem Schreiben korrigierbar), 2 Rohfassung auf 1/1½/2 Seiten, 3 Politur. Wortbank-Motive und lebendige Pools gehen als editierbare Stilanker mit ein; Projekte sind benennbar und speicherbar. Braucht einen API-Schlüssel.")],
    ["Diagnose", P("Selbsttest: prüft per Knopfdruck, ob jedes eingebaute Feature im Ergebnis nachweisbar ", el("b", {}, "wirkt"), " — kein Qualitätsurteil, nur die Frage, ob der Schalter etwas bewirkt. Je Feature eine Ampel-Kachel (greift · greift sporadisch · greift nicht · nicht prüfbar) und darunter eine Pulsreihe: ein Punkt je Testlauf, leuchtend wenn das Feature gewirkt hat. So erscheinen absichtlich seltene Features (z. B. der ", lnk("Disruptor", "werkzeug"), ") als gepunkteter Streifen statt als Fehler. Fehlende Voraussetzungen (leerer Korpus, kein 2.0-Preset) werden grau übersprungen. Rot heißt zuerst „nachprüfen“, nicht schon „kaputt“.")],
    ["Hilfe", P("Diese Seite: ", lnk("Architektur-Übersicht", "arch"), " sowie Erklärungen zu allen Bedienelementen und Tabs. Oben rechts die Versionsnummer.")],
  ]));


  // 3) Studio-Details in Arbeitsreihenfolge: Kontext → Preset/Ton/Form → Werkzeugkasten → Aktionen → Färben → Ranking → 2.0 → Sichern.
  wrap.append(section("kontext", "Kontextzeile (Wo / Wann / Wer / Was)", [
    ["Wo? / Wann? / Wer? / Was passiert?", P("die vier Grundangaben, aus denen jede Story gebaut wird. Frei tippen. Bei \"Wer?\" ergeben mehrere durch Komma getrennte Namen einen Dialog (reihum); eine Beschreibung mit Relativsatz zählt als eine Person. Feinsteuerung: ", lnk("Stärke der 4W", "staerke"), ".")],
    ["Kontext würfeln", P("füllt Wo/Wann/Wer/Was zufällig aus den Kontext-Pools.")],
    ["Kontext merken", P("aktivierbarer Schalter: sichert die aktuellen vier Felder und lädt sie bei jedem Start wieder. Erneut klicken schaltet aus und löscht den gespeicherten Kontext.")],
    ["Automatische Anpassung", P("frei getippte Angaben werden grammatisch in die Satzform gebracht: „Hafen“ → „im Hafen“, „eine Insel“ → „auf einer Insel“, „Winter“ → „im Winter“, „Dienstag“ → „an einem Dienstag“, „müde Wächterin“ → „eine müde Wächterin“. Bereits fertige Angaben und Eigennamen bleiben unangetastet; bei unsicherem Fall greift die Anpassung bewusst nicht.")],
    ["Hinweis unter dem Feld", P("zeigt live die eingesetzte Form („→ im Hafen“). Bei „Was passiert?“ steht dort stattdessen, welche Satzrolle die Angabe bekommt: eigener Satz, Handlung mit Verb, Vorhaben oder Ereignis-Phrase.")],
    ["Farbcode im Feld", P("der Feldhintergrund bewertet die Eingabe von Rot bis Grün — grün: sicher einsetzbar, gelbgrün: wird automatisch angepasst, gelb: brauchbar, orange/rot: kann nicht sicher eingesetzt werden (hier drohen Grammatikbrüche im Text). Leere Felder bleiben neutral.")],
  ]));

  wrap.append(section("staerke", "Stärke der 4W (nur Prosa, experimentell)", [
    ["Wo / Wann / Wer / Was", P("je ein kleiner Regler direkt unter jedem ", lnk("4W-Feld", "kontext"), ", nur bei Form Prosa sichtbar. Reines Hochregeln: je höher ein Regler, desto mehr Sätze über diese Dimension werden eingewoben (mehr Ort-Atmosphäre, mehr Zeit-Rahmung, mehr über die Figur oder mehr Handlung). Standard 0 = neutral. Die Gesamtlänge bleibt über den Textlängen-Regler stabil; die Gewichtung verschiebt die Verteilung. Wirkt in Echtzeit.")],
  ]));

  wrap.append(section("presetton", "Preset · Ton · Form", [
    ["Preset", P("die aktive ", lnk("Wortbank", "tabs"), " als Ankreuz-Liste: ", el("b", {}, "ein"), " Häkchen lädt dieses Preset, ", el("b", {}, "mehrere"), " Häkchen vereinen ihre Wortbänke zu einem Mix. Beim Start zufällig gewählt; die Auswahl bleibt über den Neustart erhalten und lässt sich per Schloss beim Würfeln festhalten.")],
    ["Auto-Mix würfeln", P("würfelt pro Kategorie ein zufälliges Preset zusammen. Die benutzten Quell-Presets werden in der Liste schattiert und mit Zähler markiert — der Tooltip nennt die Kategorien, die sie beigesteuert haben.")],
    ["Ton", P("färbt den Text ein (Einleitung + verteilte Einschübe). Neutral fügt nichts hinzu. Sichtbar gemacht in der ", lnk("Einspeisungs-Färbung", "faerben"), ".")],
    ["Form", P("Textformat: Prosa (ein Erzähler berichtet), Prosagedicht, Gedicht-Strang, Reim, Haiku, Szene/Dialog (Bühnentext mit Sprecherzeilen und Regieanweisungen), Multi-Shot (Video). Merksatz: Prosa erzählt, Szene/Dialog zeigt. Zeilen-/Versformen werden von der Ton-Einfärbung ausgenommen.")],
  ]));

  wrap.append(section("werkzeug", "Werkzeugkasten (aufklappbar)", [
    ["Schrift · Größe", P("Schriftart (Serif/Times/Sans/Mono) und Größe der Ausgabe; wird lokal gemerkt.")],
    ["Struktur", P("Erzählform: Auto (zufällig), Linear, Reverse, Kreis, Fragment, Objekt, Dramaturgie (", lnk("Preset 2.0", "preset2"), " — baut den Text entlang des Erzählbogens).")],
    ["Modus", P("Realitätsmodus (z. B. bürokratisch, technologisch, mythisch, absurd …).")],
    ["Perspektive", P("Ich-, Du- oder Er/Sie-Erzähler; Verben werden passend konjugiert.")],
    ["Rhythmus · Disruptor · Instabilität", P("steuern Satzlängen-Variation, gezielte Brüche und die Figuren-Instabilität.")],
    ["Spannung (nur Prosa)", P("verschiebt den Spannungs-Höhepunkt in den Text: Oben (12 Uhr), Mitte (3 Uhr) oder Unten (6 Uhr). Nahe dem Peak werden Sätze kurz und hart, Hook-/Motiv-Bilder verdichten sich und ein harter Bruch setzt ein; fern davon ruhige, verbundene Bögen — hilft gegen den Spannungsabfall in langen Texten. Wirkt erst ab längeren Passagen.")],
    ["Markov", P("Anteil, in dem der offline gelernte ", lnk("Markov-Generator (Korpus)", "tabs"), " mitmischt.")],
    ["Archetyp A/B", P("färbt die Sprache aus Archetyp-Wortpools (Neutral, Skorpion, Psychopath, Entdecker); Standard neutral.")],
    ["Varianz · Stil · Sprachschliff", P("Variationsgrad, Schliff-Stil und die automatische Glättung bei der Generierung.")],
    ["Video: Shots / Sekunden", P("nur bei Form Multi-Shot: Anzahl der Einzelszenen und Ziel-Gesamtlänge.")],
  ]));

  wrap.append(section("aktionen", "Aktionen", [
    ["Generieren", P("erzeugt aus den aktuellen Angaben und Einstellungen eine neue Story.")],
    ["Variante", P("sofort eine weitere Zufallsvariante mit unveränderten Einstellungen.")],
    ["Würfeln", P("würfelt alle Stil-Parameter neu (Ton, Form, Struktur, Modus, Perspektive, Rhythmus, Instabilität, Markov, Disruptor, Varianz, Stil, Preset) — lässt Wo/Wann/Wer/Was unangetastet.")],
    ["Kopieren", P("kopiert den angezeigten Text in die Zwischenablage.")],
    ["Merken", P("legt den Text dauerhaft in die ", lnk("Schatzkammer", "tabs"), " (bis 100 Texte) und füttert damit den Korpus.")],
    ["Tresor", P("legt den Text direkt verborgen in den Tresor der ", lnk("Schatzkammer", "tabs"), " — und füttert bewusst ", el("b", {}, "weder"), " Korpus noch lebendige Pools.")],
    ["Pfeile / Wischen", P("die Pfeile links und rechts im Textfenster erzeugen eine neue Variante; auf dem Handy genügt ein Wischen nach links oder rechts über den Text.")],
    ["Lesen", P("Vollbild-Lesemodus mit Werkzeugleiste: A−/A+ (Schriftgröße), Kopieren, Merken, Vorlesen.")],
    ["Vorlesen", P("liest den Text per Browser-Sprachausgabe auf Deutsch vor (offline).")],
    ["Textlänge", P("Ziel-Wortzahl (40–300): steuert bei Prosa das Kürzen/Auffüllen, bei Szene/Dialog die Rundenzahl.")],
  ]));

  wrap.append(section("faerben", "Editieren — Färben & Passagen-Austausch (im Studio)", [
    ["Editieren", P("Schalter unter der Ausgabe (früher „Einspeisungen färben“): macht den Text bearbeitbar und färbt jede Passage nach Herkunft — ", lnk("Wortbank", "presetton"), ", ", lnk("Ton", "presetton"), ", ", lnk("4W-Kontext", "kontext"), ", Lebendige Pools, ", lnk("Markov", "werkzeug"), "; unmarkiert = feste Vorlagen. Die Legende daneben zeigt die Farbzuordnung.")],
    ["Passagen-Austausch", P("Bei aktivem Editieren sind alle Passagen anklickbar — farbige wie unmarkierte. Ein Klick öffnet ein Fenster mit Alternativen aus derselben Quelle (🎲 Neu holt weitere), dazu ✕ Entfernen, ein Freitextfeld und ein vorbefülltes Bearbeitungsfeld, um nur die Grammatik anzupassen ohne die Passage neu zu schreiben. Unmarkierte Stellen öffnen direkt das Textfeld — dort lassen sich fehlende Wörter ergänzen. Steht die Passage am Satzanfang, wird sie automatisch großgeschrieben.")],
    ["Passende Alternativen", P("die Vorschläge werden nach inhaltlicher Nähe zum umgebenden Text sortiert — Kandidaten, die Wörter des Absatzes aufgreifen, stehen oben. „🎲 Neu“ mischt innerhalb der passendsten Vorschläge neu.")],
    ["↩ Rückgängig", P("Chip rechts in der Legende (oder Strg/Cmd+Z) nimmt die letzten Änderungen am Text zurück — bis zu zwölf Schritte. Der Verlauf beginnt bei jeder neuen Generierung von vorn.")],
  ]));

  wrap.append(section("ranking", "Test & Ranking (im Studio, aufklappbar)", [
    ["Probe (50)", P("generiert 50 Varianten und meldet auffällige/doppelte.")],
    ["Ranking (50)", P("bewertet 50 Varianten offline (Längentreue, Wortvielfalt, Satzrhythmus, wenig Wiederholung) und sortiert sie.")],
    ["KI-Ranking (50)", P("lässt Claude alle Varianten literarisch bewerten (Originalität, Kohärenz, Sprache, Sog). Braucht einen API-Schlüssel.")],
    ["Platz 1 / 2 / 3 und Rang-Slider", P("laden Platz 1–3 bzw. blättern per Slider durch alle Ränge.")],
  ]));

  wrap.append(section("preset2", "Preset 2.0 (Dramaturgie)", [
    ["Was 2.0 kann", P("Erweitert eine ", lnk("Wortbank", "tabs"), " um einen dramaturgischen Überbau: Erzählbogen (Einstieg → Mitte → Höhepunkt → Schluss), Auslöser & Veränderungen, typische Konflikte, Zeitanomalien, Weltregeln und Kontext-Pools.")],
    ["Dramaturgie-Struktur", P("Im Studio unter ", lnk("Struktur", "werkzeug"), " die Option „Dramaturgie (Preset 2.0)“: baut den Text entlang des Erzählbogens des aktiven 2.0-Presets.")],
    ["2.0-Felder übernehmen", P("Im Wortbank-Tab editierbar (nur bei aktivem 2.0-Preset); übernimmt Dramaturgie, Pools und Ton. Eigene Presets mit 2.0-Daten sind in der Preset-Liste mit ✦ 2.0 markiert.")],
    ["Per KI aktualisieren", P("Verbessert das aktive Preset per KI (Grammatik/Artikel, mehr Einträge, füllt die Dramaturgie-/2.0-Felder) — das Thema bleibt. „Mehrere Presets per KI aktualisieren“ erledigt das im Stapel. Braucht einen API-Schlüssel.")],
    ["Preset 2.0 erzeugen", P("Baut per KI ein komplettes neues 2.0-Preset aus einer kurzen Vorgabe. Braucht einen API-Schlüssel.")],
  ]));

  wrap.append(section("sichern", "Sichern & Übertragen", [
    ["Exportieren (oben rechts)", P("sichert das GESAMTE Projekt als eine JSON-Datei: Wortbank, Presets, Korpus, Einstellungen, Schatzkammer, Ideen-/Omni-Presets, lebendige Pools und alle Werkstatt-Projekte. Für Backup oder Übertragung auf ein anderes Gerät.")],
    ["Importieren (oben rechts)", P("liest so eine Datei wieder ein und ERSETZT den gesamten aktuellen Stand (mit Rückfrage).")],
    ["Werkstatt-Projekt speichern (im Tab Werkstatt)", P("speichert NUR die aktuelle Geschichte (Quelle, Vorgaben, Gerüst, Fassungen) unter einem Namen im Browser — keine Datei.")],
  ]));

  root.append(wrap);
}
