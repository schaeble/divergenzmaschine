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
  | "wissenschaft" | "gesellschaft" | "gesundheit" | "bildung" | "wetter";

export interface RessortEinheit {
  einheit: string; rolle: ZahlRolle; min: number; max: number; rund: number; gen?: string;
}

/** Ein Einsatz mit seinem Numerus. Der muss IM Eintrag stehen, nicht geraten
 *  werden: "die Lieferkette" ist Singular, "die Ausbildungsplätze" Plural, und
 *  beide beginnen mit "die". Ohne die Angabe entstand "Auf dem Spiel steht die
 *  Ausbildungsplätze" - ich hatte die ANZAHL der Einträge geprüft statt den
 *  Numerus des Eintrags. */
export interface EinsatzTeil { t: string; pl?: true }
const S = (t: string): EinsatzTeil => ({ t });
const P = (t: string): EinsatzTeil => ({ t, pl: true });

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
  einsatz: EinsatzTeil[];
  /** Was in Aussicht steht, wenn die Nachricht eine gute ist. Gegenstueck zu
   *  `einsatz`: Der Bericht war durchgehend auf Verlust gebaut - „betroffen",
   *  „auf dem Spiel", „die erste Meldung" -, und ein hoffnungsvoller Ton konnte
   *  daran nichts aendern, weil die Woerter selbst die Richtung vorgaben. */
  gewinn: EinsatzTeil[];
  /** Ausblick, wenn die Nachricht eine gute ist. */
  ausblickGut: string[];
  /** Was der Abschnitt „Ausblick" in diesem Ressort sagen darf. */
  ausblick: string[];
  /** Wer oder was in diesem Ressort betroffen sein kann — OHNE Zahl. Genau das
   *  fehlte: Bei einem Sportbericht sind Verein, Fans, Marketing und Logo
   *  betroffen, nicht „Haushalte". */
  betroffen: string[];
  /** Satz, der den Hintergrund eroeffnet. Vorgabe ist „besteht seit ⟨Jahr⟩" —
   *  bei einem Sturmtief ergibt das „Das Ottilie besteht seit 1952". */
  hintergrundKopf?: (wer: string, jahr: string) => string;
  /** Sonderregel, die die Prüfung kennt. */
  regel: "zweiZahlen" | "lagerAusgewogen" | "wertungGetrennt" | "ergebnisZuerst" | "einschraenkungPflicht" | "keine";
}

// Die Untergrenze der Betroffenen-Einheiten liegt bei zwoelf. Eine
// Schlagzeilenzahl darunter traegt den Vorspann nicht: "wurde bekannt, dass 4
// Institute betroffen sind" ist keine Nachricht. Beim ersten Versuch hatte ich
// die Zahlen einzeln angehoben und dabei die Haelfte verfehlt, weil die Zeilen
// nach einer frueheren Umformung anders formatiert waren - der Pruefstand hat
// es gefunden, meine Stichprobe nicht.
export const RESSORTS: Record<RessortId, Ressort> = {
  wirtschaft: {
    id: "wirtschaft", label: "Wirtschaft",
    rollenF: ["Geschäftsführerin", "Betriebsrätin", "Sprecherin", "Analystin", "Standortleiterin", "Ausbilderin"],
    rollenM: ["Geschäftsführer", "Betriebsratsvorsitzender", "Sprecher", "Analyst", "Betriebsrat", "Standortleiter", "Ausbilder"],
    betroffen: ["der Betrieb", "die Belegschaft", "die Zulieferer", "die Auftragsbücher", "der Standort", "die Ausbildungsplätze", "die Auszubildenden", "die Werkshalle", "die Fuhrparks", "die Schichtpläne"],
    einheiten: [
      { einheit: "Beschäftigte", rolle: "betroffene", min: 40, max: 900, rund: 10, gen: "Beschäftigten" },
      { einheit: "Zulieferer", rolle: "betroffene", min: 12, max: 120, rund: 1 },
     
      { einheit: "Millionen Euro Umsatz", rolle: "geld", min: 2, max: 900, rund: 1 },
      { einheit: "Standorte", rolle: "vorgaenge", min: 2, max: 40, rund: 1 },
    ],
    zusatz: { titel: "Marktreaktion", rahmen: ["Am Markt heißt es:", "In der Branche gilt:", "Beobachter verweisen auf:", "Aus der Belegschaft:", "Im Betriebsrat:", "Am Werkstor:"] },
    einsatz: [S("der Standort"), S("die Altersversorgung der Belegschaft"), P("die Ausbildungsplätze"), S("der Name des Hauses"), S("die Lieferkette"), S("das Werksgelände"), S("die Tarifbindung"), S("der Standort selbst")],
    gewinn: [S("ein zweites Werk"), S("die Ausbildungsoffensive"), S("der Ausbau des Standorts"), S("die Rückkehr der Aufträge"), S("ein neuer Tarifvertrag"), S("eine zweite Schicht"), S("ein Ausbildungsverbund"), S("die Übernahme der Auszubildenden")],
    ausblickGut: ["Ob die Zahlen halten, entscheidet sich im nächsten Quartal.", "Die ersten Einstellungen sind fuer den Herbst angekündigt.", "Die Aufträge reichen bis ins nächste Jahr.", "Weitere Einstellungen sind vorgesehen."],
    ausblick: ["Ob die Zahlen halten, entscheidet sich im nächsten Quartal.", "Eine Entscheidung soll in den kommenden Tagen fallen.", "Die Verhandlungen sollen weitergehen.", "Ein Gutachten ist in Auftrag gegeben.", "Die Belegschaft wird kommende Woche informiert."],
    regel: "zweiZahlen",
  },
  politik: {
    id: "politik", label: "Politik",
    rollenF: ["Abgeordnete", "Fraktionssprecherin", "Staatssekretärin", "Fraktionsvorsitzende", "Amtsleiterin", "Bürgermeisterin"],
    rollenM: ["Abgeordneter", "Fraktionssprecher", "Staatssekretär", "Fraktionsvorsitzender", "Amtsleiter", "Bürgermeister"],
    betroffen: ["das Verfahren", "die Fraktionen", "die Kommunen", "der Zeitplan", "die Antragsteller", "die Ausschüsse", "die Verwaltung", "die Bürgersprechstunde", "die Haushaltsplanung", "das Ehrenamt"],
    einheiten: [
      { einheit: "Wahlberechtigte", rolle: "betroffene", min: 500, max: 90000, rund: 100, gen: "Wahlberechtigten" },
      { einheit: "Kommunen", rolle: "betroffene", min: 12, max: 200, rund: 1 },
     
      { einheit: "Stimmen", rolle: "vorgaenge", min: 20, max: 700, rund: 1 },
      { einheit: "Sitzungen", rolle: "vorgaenge", min: 2, max: 60, rund: 1 },
    ],
    zusatz: { titel: "Reaktionen", rahmen: ["Aus der Regierung heißt es:", "Die Opposition hält dagegen:", "Aus den Ländern kommt:", "Im Rathaus:", "Aus der Fraktion:", "In der Sitzung:"] },
    einsatz: [S("die Mehrheit"), S("der Zeitplan des Verfahrens"), S("das Vertrauen in die Zusage"), S("die Zuständigkeit der Kommunen"), S("der Haushaltsansatz"), S("die Mehrheit im Rat"), S("der Haushalt"), P("die Fristen"), S("das Vertrauen in die Verwaltung")],
    gewinn: [S("eine breite Mehrheit"), S("die Zustimmung der Länder"), S("ein früherer Beginn"), S("die Aufstockung der Mittel"), S("eine breitere Mehrheit"), S("ein zusätzlicher Ausschuss"), S("mehr Mittel im Haushalt")],
    ausblickGut: ["Der Beschluss soll in der nächsten Sitzung bestätigt werden.", "Die Umsetzung beginnt im kommenden Jahr.", "Die Vorlage gilt als sicher.", "Weitere Mittel sind zugesagt."],
    ausblick: ["Der Verfahrensstand bleibt bis zur nächsten Sitzung unverändert.", "Ob es zur Abstimmung kommt, ist offen.", "Die Abstimmung ist vertagt.", "Der Ausschuss tagt erneut.", "Eine Stellungnahme steht aus."],
    regel: "lagerAusgewogen",
  },
  kultur: {
    id: "kultur", label: "Kultur",
    rollenF: ["Intendantin", "Kuratorin", "Dramaturgin", "Kritikerin", "Werkstattleiterin", "Regisseurin"],
    rollenM: ["Intendant", "Kurator", "Dramaturg", "Kritiker", "Werkstattleiter", "Regisseur"],
    betroffen: ["das Ensemble", "der Spielplan", "die Abonnenten", "die Werkstätten", "die Nachwuchsarbeit", "die Technik", "die Statisterie", "die Requisite", "das Foyer", "die Bibliothek des Hauses"],
    einheiten: [
      { einheit: "Ensemblemitglieder", rolle: "betroffene", min: 12, max: 200, rund: 1 },
      { einheit: "Abonnenten", rolle: "betroffene", min: 50, max: 8000, rund: 10 },
     
      { einheit: "Vorstellungen", rolle: "vorgaenge", min: 3, max: 200, rund: 1 },
      { einheit: "Minuten Spieldauer", rolle: "dauer", min: 45, max: 240, rund: 5 },
    ],
    zusatz: { titel: "Zum Werk", rahmen: ["Zu sehen ist:", "Die Arbeit zeigt:", "Auf der Bühne steht:", "Aus dem Ensemble:", "An der Kasse:", "In der Probe:"] },
    einsatz: [S("der Spielplan der kommenden Saison"), S("das Ensemble in seiner jetzigen Form"), P("die Werkstätten"), S("das Haus als Ort"), S("die Nachwuchsarbeit"), S("die Uraufführung"), S("der Spielplan"), P("die Gastspiele"), S("das Ensemble selbst")],
    gewinn: [S("eine zweite Spielstätte"), S("die Übernahme ins Repertoire"), S("ein eigenes Nachwuchsstudio"), S("die Verlaengerung der Reihe"), P("neue Abonnements"), S("ein Gastspiel im Ausland")],
    ausblickGut: ["Die nächste Aufführung ist angekündigt.", "Weitere Termine sollen folgen.", "Die Vorstellung wird verlängert.", "Weitere Termine kommen dazu."],
    ausblick: ["Ob das Publikum folgt, wird sich zeigen.", "Die nächste Aufführung ist angekündigt.", "Die Premiere bleibt geplant.", "Die Proben werden fortgesetzt.", "Über den Spielplan wird neu beraten."],
    regel: "wertungGetrennt",
  },
  sport: {
    id: "sport", label: "Sport",
    rollenF: ["Trainerin", "Kapitänin", "Sportdirektorin", "Torhüterin", "Abteilungsleiterin"],
    rollenM: ["Trainer", "Kapitän", "Sportdirektor", "Torhüter", "Abteilungsleiter"],
    betroffen: ["der Verein", "die Fans", "das Marketing", "das Logo", "die Mannschaft", "der Nachwuchs", "die Sponsoren", "die Dauerkarten", "die Jugendabteilung", "die Dauerkartenbesitzer", "der Trainingsbetrieb", "die Geschäftsstelle", "der Fanclub"],
    einheiten: [
      { einheit: "Vereinsmitglieder", rolle: "betroffene", min: 50, max: 40000, rund: 10 },
      { einheit: "Dauerkarten", rolle: "betroffene", min: 100, max: 30000, rund: 100 },
     
      { einheit: "Zuschauer", rolle: "betroffene", min: 200, max: 60000, rund: 100 },
      { einheit: "Minuten", rolle: "dauer", min: 5, max: 120, rund: 1 },
    ],
    zusatz: { titel: "Spielverlauf", rahmen: ["Nach der Pause:", "In der Schlussphase:", "Zur Halbzeit:", "In der Kabine:", "Auf der Tribüne:", "In der Geschäftsstelle:"] },
    einsatz: [S("der Klassenerhalt"), S("die Lizenz"), S("die Nachwuchsabteilung"), S("der Name des Vereins"), S("die Heimspielstätte"), S("das Traineramt"), S("der Aufstieg"), P("die Heimspiele"), S("der Trainingsbetrieb")],
    gewinn: [S("der Aufstieg"), S("ein neuer Hauptsponsor"), S("der Ausbau der Jugendabteilung"), S("die Rückkehr in die Halle"), S("ein neuer Trainingsplatz"), P("zusätzliche Heimspiele"), S("die Rückkehr der Zuschauer")],
    ausblickGut: ["Das Rückspiel steht noch aus.", "Die Vorbereitung beginnt im Sommer.", "Die Serie soll fortgesetzt werden.", "Weitere Zusagen liegen vor."],
    ausblick: ["Das Rückspiel steht noch aus.", "Ob die Serie hält, entscheidet sich am Wochenende.", "Das nächste Spiel entscheidet.", "Der Verband prüft den Vorgang.", "Eine Entscheidung fällt nach der Saison."],
    regel: "ergebnisZuerst",
  },
  wissenschaft: {
    id: "wissenschaft", label: "Wissenschaft",
    rollenF: ["Studienleiterin", "Professorin", "Erstautorin", "Gutachterin", "Institutsleiterin", "Doktorandin", "Laborleiterin"],
    rollenM: ["Studienleiter", "Professor", "Erstautor", "Gutachter", "Institutsleiter", "Doktorand", "Laborleiter"],
    betroffen: ["die Studie", "die Arbeitsgruppe", "die Förderung", "die Veröffentlichung", "die Datenbasis", "die Messreihen", "die Drittmittel", "die Doktoranden", "das Labor", "die Sammlung"],
    einheiten: [
      { einheit: "Teilnehmende", rolle: "betroffene", min: 12, max: 4000, rund: 1, gen: "Teilnehmenden" },
      { einheit: "Institute", rolle: "betroffene", min: 12, max: 40, rund: 1 },
     
      { einheit: "Proben", rolle: "vorgaenge", min: 12, max: 4000, rund: 1 },
      { einheit: "Monate Laufzeit", rolle: "dauer", min: 3, max: 96, rund: 1 },
    ],
    zusatz: { titel: "Methode", rahmen: ["Untersucht wurde:", "Erhoben wurden:", "Verglichen wurde:", "Im Labor:", "Aus der Arbeitsgruppe:", "Am Rande der Tagung:"] },
    einsatz: [S("die Förderung"), S("die Vergleichbarkeit der Daten"), S("die Veröffentlichung"), S("der Standort des Instituts"), S("die Fortsetzung der Reihe"), S("die Förderzusage"), S("die Messreihe"), P("die Nachwuchsstellen"), S("der Zugang zur Sammlung")],
    gewinn: [S("eine Anschlussfoerderung"), S("ein zweiter Standort"), S("die Aufnahme in das Programm"), S("ein gemeinsames Labor"), S("eine zweite Förderperiode"), P("neue Messplätze")],
    ausblickGut: ["Eine Wiederholung der Studie ist geplant.", "Die Ergebnisse sollen offen zugänglich werden.", "Die Förderung ist verlängert.", "Weitere Häuser beteiligen sich."],
    ausblick: ["Eine Wiederholung der Studie steht aus.", "Ob sich der Befund bestätigt, ist offen.", "Die Auswertung dauert an.", "Die Ergebnisse sollen geprüft werden.", "Eine Wiederholung des Versuchs ist geplant."],
    regel: "einschraenkungPflicht",
  },
  gesellschaft: {
    id: "gesellschaft", label: "Gesellschaft",
    rollenF: ["Sozialarbeiterin", "Anwohnerin", "Vereinsvorsitzende", "Beraterin", "Quartiersmanagerin", "Ehrenamtskoordinatorin", "Gemeindereferentin"],
    rollenM: ["Sozialarbeiter", "Anwohner", "Vereinsvorsitzender", "Berater", "Quartiersmanager", "Ehrenamtskoordinator", "Gemeindereferent"],
    betroffen: ["die Nachbarschaft", "die Familien", "das Ehrenamt", "die Beratungsstelle", "der Treffpunkt", "der Sportverein", "die Kirchengemeinde", "die Kita", "die Tafel", "die Nachbarschaftshilfe", "der Schrebergarten", "die Freiwillige Feuerwehr"],
    einheiten: [
      { einheit: "Haushalte", rolle: "betroffene", min: 20, max: 4000, rund: 10 },
      { einheit: "Familien", rolle: "betroffene", min: 12, max: 2000, rund: 10 },
     
      { einheit: "Haushalte", rolle: "betroffene", min: 20, max: 4000, rund: 10 },
      { einheit: "Beratungen", rolle: "vorgaenge", min: 10, max: 900, rund: 1 },
    ],
    zusatz: { titel: "Vor Ort", rahmen: ["Im Viertel heißt es:", "Nachbarn berichten:", "In der Beratungsstelle:", "Am Tresen:", "Im Gemeindehaus:", "Auf dem Wochenmarkt:"] },
    einsatz: [S("der Treffpunkt im Viertel"), S("die Beratung vor Ort"), S("das Ehrenamt"), S("die Mietbindung"), S("der Zusammenhalt in der Nachbarschaft"), S("die Nachbarschaftshilfe"), P("die Öffnungszeiten"), S("das Gemeindehaus"), S("die Tafel")],
    gewinn: [S("ein neuer Treffpunkt"), S("die Verstetigung der Beratung"), S("mehr Plätze im Ehrenamt"), S("ein Nachbarschaftsfonds"), S("ein zweiter Treffpunkt"), P("längere Öffnungszeiten"), S("eine feste Stelle in der Beratung")],
    ausblickGut: ["Das Angebot soll im Frühjahr starten.", "Weitere Häuser haben Interesse angemeldet.", "Die Öffnungszeiten werden ausgeweitet.", "Weitere Freiwillige haben sich gemeldet."],
    ausblick: ["Wie es im Viertel weitergeht, ist offen.", "Eine Entscheidung soll in den kommenden Wochen fallen.", "Der Verein sucht weiter Freiwillige.", "Ein Treffen ist für den Herbst angesetzt.", "Die Stadt prüft eine Förderung."],
    regel: "keine",
  },
  gesundheit: {
    id: "gesundheit", label: "Gesundheit",
    rollenF: ["Ärztliche Direktorin", "Pflegedienstleiterin", "Amtsärztin", "Epidemiologin", "Chefärztin", "Apothekerin"],
    rollenM: ["Ärztlicher Direktor", "Pflegedienstleiter", "Amtsarzt", "Epidemiologe", "Chefarzt", "Apotheker"],
    betroffen: ["die Versorgung", "die Pflegekräfte", "die Notaufnahme", "die Wartezeiten", "die Angehörigen", "der Bereitschaftsdienst", "die Apotheken", "die Hausarztpraxen", "der Krankentransport", "die Physiotherapie"],
    einheiten: [
      { einheit: "Patientinnen und Patienten", rolle: "betroffene", min: 30, max: 9000, rund: 10 },
      { einheit: "Pflegekräfte", rolle: "betroffene", min: 12, max: 900, rund: 1 },
     
      { einheit: "Betten", rolle: "groesse", min: 20, max: 1200, rund: 10 },
      { einheit: "Behandlungen", rolle: "vorgaenge", min: 30, max: 9000, rund: 10 },
    ],
    zusatz: { titel: "Einordnung der Lage", rahmen: ["Aus der Klinik heißt es:", "Die Behörde teilt mit:", "In der Versorgung zeigt sich:", "Auf der Station:", "In der Pflege:", "Am Empfang:"] },
    einsatz: [S("die Versorgung im Umkreis"), S("die Notaufnahme"), P("die Ausbildungsplätze in der Pflege"), P("die Wartezeiten"), S("der Standort der Klinik"), P("die Betten"), S("der Bereitschaftsdienst"), S("die Versorgung im Umland")],
    gewinn: [S("eine zusaetzliche Station"), S("kürzere Wartezeiten"), S("mehr Ausbildungsplätze in der Pflege"), S("ein zweiter Rettungswagen"), S("eine zusätzliche Station"), P("mehr Betten")],
    ausblickGut: ["Die Station soll im Herbst öffnen.", "Die Versorgung im Umkreis wird neu geordnet.", "Die Station soll erweitert werden.", "Weitere Kräfte sind eingestellt."],
    ausblick: ["Wie sich die Lage entwickelt, bleibt abzuwarten.", "Eine Neubewertung ist für die kommende Woche angekündigt.", "Die Aufsicht prüft den Vorgang.", "Eine Übergangslösung wird gesucht.", "Der Betrieb läuft eingeschränkt weiter."],
    // Bewusst keine Sonderregel mit Zahlenpflicht: Gesundheitsberichte, die
    // Zahlen erzwingen, erfinden welche. Lieber weniger und richtig.
    regel: "keine",
  },
  bildung: {
    id: "bildung", label: "Bildung",
    rollenF: ["Schulleiterin", "Elternsprecherin", "Lehrerin", "Bildungsforscherin", "Fachlehrerin"],
    rollenM: ["Schulleiter", "Elternsprecher", "Lehrer", "Bildungsforscher", "Fachlehrer"],
    betroffen: ["der Unterricht", "die Elternhäuser", "das Kollegium", "der Stundenplan", "die Abschlussjahrgänge", "die Elternvertretung", "die Ganztagsbetreuung", "die Werkräume", "die Schulbusse", "die Mensa"],
    einheiten: [
      { einheit: "Schülerinnen und Schüler", rolle: "betroffene", min: 30, max: 2000, rund: 10 },
      { einheit: "Lehrkräfte", rolle: "betroffene", min: 12, max: 200, rund: 1 },
     
      { einheit: "Schülerinnen und Schüler", rolle: "betroffene", min: 30, max: 2000, rund: 10 },
      { einheit: "Unterrichtsstunden", rolle: "dauer", min: 4, max: 400, rund: 2 },
    ],
    zusatz: { titel: "An der Schule", rahmen: ["Im Kollegium heißt es:", "Aus der Elternschaft:", "Im Unterricht zeigt sich:", "Im Lehrerzimmer:", "Auf dem Schulhof:", "In der Elternversammlung:"] },
    einsatz: [S("der Ganztag"), S("das Abschlussjahr"), P("die Stellen im Kollegium"), S("der Schulstandort"), S("die Betreuung am Nachmittag"), P("die Werkräume"), S("die Schulbusverbindung"), S("das Kollegium")],
    gewinn: [S("zusätzliche Klassen"), S("der Ausbau des Ganztags"), S("zusaetzliche Stellen im Kollegium"), S("eine eigene Werkstatt"), S("eine zusätzliche Klasse"), P("neue Werkräume"), S("eine zweite Schulbuslinie")],
    ausblickGut: ["Der Start ist fuer das kommende Schuljahr geplant.", "Die Stellen sollen zum Halbjahr besetzt werden.", "Die Klasse wird eingerichtet.", "Weitere Stellen sind besetzt."],
    ausblick: ["Ob die Stunden ersetzt werden, ist offen.", "Das nächste Schuljahr soll Klarheit bringen.", "Das Schulamt prüft den Fall.", "Die Elternversammlung tagt kommende Woche.", "Eine Lösung soll bis zum Halbjahr stehen."],
    regel: "keine",
  },
  wetter: {
    id: "wetter", label: "Wetter",
    rollenF: ["Meteorologin", "Wetterdienst-Sprecherin", "Einsatzleiterin", "Deichvorsteherin", "Deichgräfin"],
    rollenM: ["Meteorologe", "Wetterdienst-Sprecher", "Einsatzleiter", "Deichvorsteher", "Deichgraf"],
    einheiten: [
      { einheit: "Gemeinden", rolle: "betroffene", min: 12, max: 400, rund: 2 },
      { einheit: "Höfe", rolle: "betroffene", min: 12, max: 800, rund: 2 },
      { einheit: "Liter je Quadratmeter", rolle: "groesse", min: 14, max: 180, rund: 2 },
      { einheit: "Stundenkilometer", rolle: "groesse", min: 60, max: 200, rund: 5 },
      { einheit: "Zentimeter Neuschnee", rolle: "groesse", min: 12, max: 90, rund: 2 },
      { einheit: "Einsätze", rolle: "vorgaenge", min: 20, max: 900, rund: 2 },
      { einheit: "Stunden Dauerregen", rolle: "dauer", min: 4, max: 60, rund: 2 },
    ],
    betroffen: ["die Küste", "der Deich", "die Ernte", "der Bahnverkehr", "die Schulen", "die Feuerwehr", "die Fähren", "die Deichverbände", "der Fährbetrieb", "die Obstbauern", "die Feuerwehren", "der Schienenverkehr", "die Campingplätze"],
    einsatz: [S("die Ernte"), S("der Deich"), S("der Bahnverkehr"), S("die Trinkwasserversorgung"), S("die Fährverbindung"), P("die Fährverbindungen"), S("die Stromversorgung"), S("der Küstenschutz"), S("die Obsternte")],
    gewinn: [S("eine trockene Erntewoche"), S("die Rückkehr des Grundwassers"), S("ein mildes Wochenende"), S("die Entwarnung für die Küste"), S("eine Entspannung der Lage"), P("wieder befahrbare Straßen"), S("die Rückkehr des Fährbetriebs")],
    zusatz: { titel: "Aussichten", rahmen: ["Für morgen gilt:", "Zum Wochenende:", "In der Nacht:", "Am Deich:", "Im Hafen:", "Auf den Feldern:"] },
    hintergrundKopf: (_wer, jahr) => `Vergleichbare Lagen gab es zuletzt ${jahr}.`,
    ausblickGut: ["Die Warnung wird zum Abend aufgehoben.", "Das Hoch soll sich bis zur Wochenmitte halten.", "Die Warnung wurde aufgehoben.", "Der Betrieb läuft wieder an."],
    ausblick: ["Die Warnstufe bleibt vorerst bestehen.", "Wie lange die Lage anhält, ist offen.", "Der Warndienst bleibt bestehen.", "Die Lage wird stündlich neu bewertet.", "Eine Entwarnung steht aus."],
    // Keine Sonderregel: Ein Wetterbericht, der Zahlen erzwingt, erfindet
    // Messwerte - und ein erfundener Messwert ist schlimmer als keiner.
    regel: "keine",
  },
};

export const RESSORT_IDS = Object.keys(RESSORTS) as RessortId[];

/** Ressort aus dem Stoff raten, wenn „Auto" eingestellt ist. Stichwörter, keine
 *  Klugheit — und im Zweifel Gesellschaft, das trägt am meisten. */
// Die Stichwoerter stehen mit \w* am Ende: "Gewittern" ist "gewitter" im Dativ
// Plural, und mit \b am Schluss fiel es durch - der Bericht landete im Ressort
// Gesellschaft.
const SPUR: [RessortId, RegExp][] = [
  ["wetter", /\b(wetter|sturm|orkan|regen|schnee|hitze|frost|gewitter|hochwasser|dürre|dürre|unwetter|hagel|nebel|windböen|tief|hoch|warnstufe|deich|überschwemmung|glatteis|temperatur)\w*/i],
  ["sport", /\b(spielt|spielen|spiel|tor|tore|mannschaft|trainer|trainiert|liga|stadion|wettkampf|sieg|niederlage|halbzeit|verein|klub|club|fc|sv|tsv|bvb|meisterschaft|turnier|pokal|elf|kader|transfer|saison)\w*/i],
  ["kultur", /\b(bühne|theater|roman|gedicht|ausstellung|museum|konzert|oper|film|publikum|werk)\w*/i],
  ["politik", /\b(regierung|partei|fraktion|gesetz|wahl|parlament|abstimmung|minister|verfahren)\w*/i],
  ["wissenschaft", /\b(studie|forschung|labor|messung|befund|experiment|hypothese|probe|institut)\w*/i],
  ["gesundheit", /\b(klinik|krankenhaus|arzt|ärztin|pflege|patient|diagnose|behandlung|seuche|impf)\w*/i],
  ["bildung", /\b(schule|unterricht|klasse|lehrer|lehrerin|prüfung|schüler|universität|studium)\w*/i],
  ["wirtschaft", /\b(werft|betrieb|firma|unternehmen|konzern|gmbh|ag|holding|umsatz|markt|produktion|belegschaft|insolvenz|werk|fabrik|filiale|standort|schliessen|schließt|schließen)\w*/i],
];

export function rateRessort(text: string): RessortId {
  for (const [id, re] of SPUR) if (re.test(text)) return id;
  return "gesellschaft";
}
