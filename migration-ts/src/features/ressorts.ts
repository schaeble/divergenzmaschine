// Ressorts für die Form „Bericht".
//
// Nach dem Grundsatz des Schemas: Nur die ABWEICHUNGEN definieren, den Rest
// erben. Jedes Ressort bringt eigene Einheiten für die Zahlen, einen eigenen
// Zusatzabschnitt und eine Sonderregel mit — alles andere (Dachzeile,
// Schlagzeile, Vorspann, Hergang, Zitat, Hintergrund, Ausblick, Faktenkasten)
// bleibt, wie es ist.

import type { ZahlRolle } from "./faktenblatt";

export type RessortId =
  | "wirtschaft" | "politik" | "kultur" | "sport"
  | "wissenschaft" | "gesellschaft" | "gesundheit" | "bildung";

export interface RessortEinheit {
  einheit: string; rolle: ZahlRolle; min: number; max: number; rund: number; gen?: string;
}

export interface Ressort {
  id: RessortId;
  label: string;
  /** Rollen der Beteiligten — „Geschäftsführerin" passt nicht ins Feuilleton. */
  rollenF: string[];
  rollenM: string[];
  /** Zusätzliche Einheiten; sie treten neben die allgemeinen. */
  einheiten: RessortEinheit[];
  /** Überschrift des Zusatzabschnitts und seine Einleitung. */
  zusatz: { titel: string; rahmen: string[] };
  /** Was auf dem Spiel steht. Nicht dasselbe wie „betroffen": Betroffen ist,
   *  wer die Folgen trägt; auf dem Spiel steht, was verloren gehen kann. Der
   *  Bericht hatte dafür bisher gar nichts und griff auf die literarischen
   *  Einsätze des Presets zurück — daher „Der Einsatz ist Freiheit: Sie hängt an
   *  einem Stempel" in einem Wirtschaftsbericht. */
  einsatz: string[];
  /** Was der Abschnitt „Ausblick" in diesem Ressort sagen darf. */
  ausblick: string[];
  /** Wer oder was in diesem Ressort betroffen sein kann — OHNE Zahl. Genau das
   *  fehlte: Bei einem Sportbericht sind Verein, Fans, Marketing und Logo
   *  betroffen, nicht „Haushalte". */
  betroffen: string[];
  /** Sonderregel, die die Prüfung kennt. */
  regel: "zweiZahlen" | "lagerAusgewogen" | "wertungGetrennt" | "ergebnisZuerst" | "einschraenkungPflicht" | "keine";
}

export const RESSORTS: Record<RessortId, Ressort> = {
  wirtschaft: {
    id: "wirtschaft", label: "Wirtschaft",
    rollenF: ["Geschäftsführerin", "Betriebsrätin", "Sprecherin", "Analystin"],
    rollenM: ["Geschäftsführer", "Betriebsratsvorsitzender", "Sprecher", "Analyst"],
    betroffen: ["der Betrieb", "die Belegschaft", "die Zulieferer", "die Auftragsbücher", "der Standort", "die Ausbildungsplätze"],
    einheiten: [
      { einheit: "Beschäftigte", rolle: "betroffene", min: 40, max: 900, rund: 10, gen: "Beschäftigten" },
      { einheit: "Zulieferer", rolle: "betroffene", min: 3, max: 120, rund: 1 },
     
      { einheit: "Millionen Euro Umsatz", rolle: "geld", min: 2, max: 900, rund: 1 },
      { einheit: "Standorte", rolle: "vorgaenge", min: 2, max: 40, rund: 1 },
    ],
    zusatz: { titel: "Marktreaktion", rahmen: ["Am Markt heißt es:", "In der Branche gilt:", "Beobachter verweisen auf:"] },
    einsatz: ["der Standort", "die Altersversorgung der Belegschaft", "die Ausbildungsplätze", "der Name des Hauses", "die Lieferkette", "das Werksgelände"],
    ausblick: ["Ob die Zahlen halten, entscheidet sich im nächsten Quartal.",
      "Eine Entscheidung soll in den kommenden Tagen fallen."],
    regel: "zweiZahlen",
  },
  politik: {
    id: "politik", label: "Politik",
    rollenF: ["Abgeordnete", "Sprecherin der Fraktion", "Staatssekretärin", "Fraktionsvorsitzende"],
    rollenM: ["Abgeordneter", "Sprecher der Fraktion", "Staatssekretär", "Fraktionsvorsitzender"],
    betroffen: ["das Verfahren", "die Fraktionen", "die Kommunen", "der Zeitplan", "die Antragsteller"],
    einheiten: [
      { einheit: "Wahlberechtigte", rolle: "betroffene", min: 500, max: 90000, rund: 100, gen: "Wahlberechtigten" },
      { einheit: "Kommunen", rolle: "betroffene", min: 2, max: 200, rund: 1 },
     
      { einheit: "Stimmen", rolle: "vorgaenge", min: 20, max: 700, rund: 1 },
      { einheit: "Sitzungen", rolle: "vorgaenge", min: 2, max: 60, rund: 1 },
    ],
    zusatz: { titel: "Reaktionen", rahmen: ["Aus der Regierung heißt es:", "Die Opposition hält dagegen:", "Aus den Ländern kommt:"] },
    einsatz: ["die Mehrheit", "der Zeitplan des Verfahrens", "das Vertrauen in die Zusage", "die Zuständigkeit der Kommunen", "der Haushaltsansatz"],
    ausblick: ["Der Verfahrensstand bleibt bis zur nächsten Sitzung unverändert.",
      "Ob es zur Abstimmung kommt, ist offen."],
    regel: "lagerAusgewogen",
  },
  kultur: {
    id: "kultur", label: "Kultur",
    rollenF: ["Intendantin", "Kuratorin", "Dramaturgin", "Kritikerin"],
    rollenM: ["Intendant", "Kurator", "Dramaturg", "Kritiker"],
    betroffen: ["das Ensemble", "der Spielplan", "die Abonnenten", "die Werkstätten", "die Nachwuchsarbeit"],
    einheiten: [
      { einheit: "Ensemblemitglieder", rolle: "betroffene", min: 6, max: 200, rund: 1 },
      { einheit: "Abonnenten", rolle: "betroffene", min: 50, max: 8000, rund: 10 },
     
      { einheit: "Vorstellungen", rolle: "vorgaenge", min: 3, max: 200, rund: 1 },
      { einheit: "Minuten Spieldauer", rolle: "dauer", min: 45, max: 240, rund: 5 },
    ],
    zusatz: { titel: "Zum Werk", rahmen: ["Zu sehen ist:", "Die Arbeit zeigt:", "Auf der Bühne steht:"] },
    einsatz: ["der Spielplan der kommenden Saison", "das Ensemble in seiner jetzigen Form", "die Werkstätten", "das Haus als Ort", "die Nachwuchsarbeit"],
    ausblick: ["Ob das Publikum folgt, wird sich zeigen.",
      "Die nächste Aufführung ist angekündigt."],
    regel: "wertungGetrennt",
  },
  sport: {
    id: "sport", label: "Sport",
    rollenF: ["Trainerin", "Kapitänin", "Sportdirektorin", "Torhüterin"],
    rollenM: ["Trainer", "Kapitän", "Sportdirektor", "Torhüter"],
    betroffen: ["der Verein", "die Fans", "das Marketing", "das Logo", "die Mannschaft", "der Nachwuchs", "die Sponsoren", "die Dauerkarten"],
    einheiten: [
      { einheit: "Vereinsmitglieder", rolle: "betroffene", min: 50, max: 40000, rund: 10 },
      { einheit: "Dauerkarten", rolle: "betroffene", min: 100, max: 30000, rund: 100 },
     
      { einheit: "Zuschauer", rolle: "betroffene", min: 200, max: 60000, rund: 100 },
      { einheit: "Minuten", rolle: "dauer", min: 5, max: 120, rund: 1 },
    ],
    zusatz: { titel: "Spielverlauf", rahmen: ["Nach der Pause:", "In der Schlussphase:", "Zur Halbzeit:"] },
    einsatz: ["der Klassenerhalt", "die Lizenz", "die Nachwuchsabteilung", "der Name des Vereins", "die Heimspielstätte", "das Traineramt"],
    ausblick: ["Das Rückspiel steht noch aus.",
      "Ob die Serie hält, entscheidet sich am Wochenende."],
    regel: "ergebnisZuerst",
  },
  wissenschaft: {
    id: "wissenschaft", label: "Wissenschaft",
    rollenF: ["Studienleiterin", "Professorin", "Erstautorin", "Gutachterin"],
    rollenM: ["Studienleiter", "Professor", "Erstautor", "Gutachter"],
    betroffen: ["die Studie", "die Arbeitsgruppe", "die Förderung", "die Veröffentlichung", "die Datenbasis"],
    einheiten: [
      { einheit: "Teilnehmende", rolle: "betroffene", min: 12, max: 4000, rund: 1, gen: "Teilnehmenden" },
      { einheit: "Institute", rolle: "betroffene", min: 2, max: 40, rund: 1 },
     
      { einheit: "Proben", rolle: "vorgaenge", min: 12, max: 4000, rund: 1 },
      { einheit: "Monate Laufzeit", rolle: "dauer", min: 3, max: 96, rund: 1 },
    ],
    zusatz: { titel: "Methode", rahmen: ["Untersucht wurde:", "Erhoben wurden:", "Verglichen wurde:"] },
    einsatz: ["die Förderung", "die Vergleichbarkeit der Daten", "die Veröffentlichung", "der Standort des Instituts", "die Fortsetzung der Reihe"],
    ausblick: ["Eine Wiederholung der Studie steht aus.",
      "Ob sich der Befund bestätigt, ist offen."],
    regel: "einschraenkungPflicht",
  },
  gesellschaft: {
    id: "gesellschaft", label: "Gesellschaft",
    rollenF: ["Sozialarbeiterin", "Anwohnerin", "Vereinsvorsitzende", "Beraterin"],
    rollenM: ["Sozialarbeiter", "Anwohner", "Vereinsvorsitzender", "Berater"],
    betroffen: ["die Nachbarschaft", "die Familien", "das Ehrenamt", "die Beratungsstelle", "der Treffpunkt"],
    einheiten: [
      { einheit: "Haushalte", rolle: "betroffene", min: 20, max: 4000, rund: 10 },
      { einheit: "Familien", rolle: "betroffene", min: 10, max: 2000, rund: 10 },
     
      { einheit: "Haushalte", rolle: "betroffene", min: 20, max: 4000, rund: 10 },
      { einheit: "Beratungen", rolle: "vorgaenge", min: 10, max: 900, rund: 1 },
    ],
    zusatz: { titel: "Vor Ort", rahmen: ["Im Viertel heißt es:", "Nachbarn berichten:", "In der Beratungsstelle:"] },
    einsatz: ["der Treffpunkt im Viertel", "die Beratung vor Ort", "das Ehrenamt", "die Mietbindung", "der Zusammenhalt in der Nachbarschaft"],
    ausblick: ["Wie es im Viertel weitergeht, ist offen.",
      "Eine Entscheidung soll in den kommenden Wochen fallen."],
    regel: "keine",
  },
  gesundheit: {
    id: "gesundheit", label: "Gesundheit",
    rollenF: ["Ärztliche Direktorin", "Pflegedienstleiterin", "Amtsärztin", "Epidemiologin"],
    rollenM: ["Ärztlicher Direktor", "Pflegedienstleiter", "Amtsarzt", "Epidemiologe"],
    betroffen: ["die Versorgung", "die Pflegekräfte", "die Notaufnahme", "die Wartezeiten", "die Angehörigen"],
    einheiten: [
      { einheit: "Patientinnen und Patienten", rolle: "betroffene", min: 30, max: 9000, rund: 10 },
      { einheit: "Pflegekräfte", rolle: "betroffene", min: 10, max: 900, rund: 1 },
     
      { einheit: "Betten", rolle: "groesse", min: 20, max: 1200, rund: 10 },
      { einheit: "Behandlungen", rolle: "vorgaenge", min: 30, max: 9000, rund: 10 },
    ],
    zusatz: { titel: "Einordnung der Lage", rahmen: ["Aus der Klinik heißt es:", "Die Behörde teilt mit:", "In der Versorgung zeigt sich:"] },
    einsatz: ["die Versorgung im Umkreis", "die Notaufnahme", "die Ausbildungsplätze in der Pflege", "die Wartezeiten", "der Standort der Klinik"],
    ausblick: ["Wie sich die Lage entwickelt, bleibt abzuwarten.",
      "Eine Neubewertung ist für die kommende Woche angekündigt."],
    // Bewusst keine Sonderregel mit Zahlenpflicht: Gesundheitsberichte, die
    // Zahlen erzwingen, erfinden welche. Lieber weniger und richtig.
    regel: "keine",
  },
  bildung: {
    id: "bildung", label: "Bildung",
    rollenF: ["Schulleiterin", "Elternsprecherin", "Lehrerin", "Bildungsforscherin"],
    rollenM: ["Schulleiter", "Elternsprecher", "Lehrer", "Bildungsforscher"],
    betroffen: ["der Unterricht", "die Elternhäuser", "das Kollegium", "der Stundenplan", "die Abschlussjahrgänge"],
    einheiten: [
      { einheit: "Schülerinnen und Schüler", rolle: "betroffene", min: 30, max: 2000, rund: 10 },
      { einheit: "Lehrkräfte", rolle: "betroffene", min: 3, max: 200, rund: 1 },
     
      { einheit: "Schülerinnen und Schüler", rolle: "betroffene", min: 30, max: 2000, rund: 10 },
      { einheit: "Unterrichtsstunden", rolle: "dauer", min: 4, max: 400, rund: 2 },
    ],
    zusatz: { titel: "An der Schule", rahmen: ["Im Kollegium heißt es:", "Aus der Elternschaft:", "Im Unterricht zeigt sich:"] },
    einsatz: ["der Ganztag", "das Abschlussjahr", "die Stellen im Kollegium", "der Schulstandort", "die Betreuung am Nachmittag"],
    ausblick: ["Ob die Stunden ersetzt werden, ist offen.",
      "Das nächste Schuljahr soll Klarheit bringen."],
    regel: "keine",
  },
};

export const RESSORT_IDS = Object.keys(RESSORTS) as RessortId[];

/** Ressort aus dem Stoff raten, wenn „Auto" eingestellt ist. Stichwörter, keine
 *  Klugheit — und im Zweifel Gesellschaft, das trägt am meisten. */
const SPUR: [RessortId, RegExp][] = [
  ["sport", /\b(spielt|spielen|spiel|tor|tore|mannschaft|trainer|trainiert|liga|stadion|wettkampf|sieg|niederlage|halbzeit|verein|klub|club|fc|sv|tsv|bvb|meisterschaft|turnier|pokal|elf|kader|transfer|saison)\b/i],
  ["kultur", /\b(bühne|theater|roman|gedicht|ausstellung|museum|konzert|oper|film|publikum|werk)\b/i],
  ["politik", /\b(regierung|partei|fraktion|gesetz|wahl|parlament|abstimmung|minister|verfahren)\b/i],
  ["wissenschaft", /\b(studie|forschung|labor|messung|befund|experiment|hypothese|probe|institut)\b/i],
  ["gesundheit", /\b(klinik|krankenhaus|arzt|ärztin|pflege|patient|diagnose|behandlung|seuche|impf)\b/i],
  ["bildung", /\b(schule|unterricht|klasse|lehrer|lehrerin|prüfung|schüler|universität|studium)\b/i],
  ["wirtschaft", /\b(werft|betrieb|firma|unternehmen|konzern|gmbh|ag|holding|umsatz|markt|produktion|belegschaft|insolvenz|werk|fabrik|filiale|standort|schliessen|schließt|schließen)\b/i],
];

export function rateRessort(text: string): RessortId {
  for (const [id, re] of SPUR) if (re.test(text)) return id;
  return "gesellschaft";
}
