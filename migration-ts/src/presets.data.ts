import type { Bank } from "./types";

/** Die 39 fest eingebauten Presets (aus dem Live-Code portiert). */
export const BUILTIN_PRESETS: Record<string, Bank> = {
  "rimbaud": {
    "motifs": [
      "zersplittertes Licht über schwarzem Wasser",
      "eine violette Brandung",
      "phosphoreszierende Gischt",
      "ein taumelnder Mast",
      "rostige Takelage im Wind",
      "grünes Feuer im Meer",
      "ein schwankender Kiel",
      "versunkene Sterne",
      "eine fiebrige Tropennacht",
      "zitternde Tiefe unter dem Rumpf"
    ],
    "hooks": [
      "Ich war frei von jeder Hand.",
      "Der Fluss hatte mich losgeschnitten.",
      "Niemand hielt mehr das Steuer.",
      "Ich trieb durch ein Meer ohne Karten.",
      "Die Nacht schlug wie eine Welle über mich.",
      "Ich hatte meine Anker vergessen.",
      "Kein Hafen rief meinen Namen."
    ],
    "props": [
      "ein zerrissenes Segel",
      "ein rostiges Ruder",
      "eine nasse Seekarte",
      "eine zerbrochene Laterne",
      "eine Muschel voller Wind",
      "ein salzverkrustetes Seil",
      "einen Kompass ohne Norden",
      "ein leeres Logbuch",
      "eine bleiche Boje",
      "einen gesplitterten Mast"
    ],
    "turns": [
      "das Meer antwortete mit Farben",
      "der Himmel stürzte ins Wasser",
      "die Sterne begannen zu sinken",
      "etwas unter mir atmete",
      "die Wellen trugen Gesichter",
      "ein Leuchten brach aus der Tiefe",
      "der Wind wurde zu einer Stimme"
    ],
    "obstacles": [
      "Strömungen ohne Richtung",
      "Korallenriffe wie Messer",
      "eine schwarze Flaute",
      "zitternde Untiefen",
      "Fieber unter Deck",
      "Sturm ohne Zentrum",
      "unsichtbare Netze"
    ],
    "stakes": [
      "Der Einsatz ist Auflösung des Selbst.",
      "Der Einsatz ist Orientierung.",
      "Der Einsatz ist Ekstase oder Untergang.",
      "Der Einsatz ist Identität.",
      "Der Einsatz ist die Rückkehr an ein Ufer."
    ],
    "endings": [
      "Ich wollte zurück in ein stilles Becken.",
      "Vielleicht träumte ich von einem kleinen Hafen.",
      "Ich sehnte mich nach einem klaren Ufer.",
      "Ich war müde vom grenzenlosen Blau.",
      "Die See schwieg zuletzt."
    ]
  },
  "baudelaire": {
    "motifs": [
      "nasse Pflastersteine im Gaslicht",
      "eine Lilie im Aschenbecher",
      "Parfüm über abgestandenem Rauch",
      "ein Spiegel mit dunklem Rand",
      "ein Blumenstrauß, der zu spät welkt",
      "eine Kutsche, die wie ein Sarg vorbeizieht",
      "goldene Ornamente auf bröckelndem Putz",
      "ein Lächeln, das nach bitterer Minze schmeckt",
      "eine Gasse, die nach Metall riecht",
      "ein Himmel, der wie Samt drückt"
    ],
    "hooks": [
      "Im Schaufenster lag Schönheit wie eine Drohung.",
      "Ein Duft blieb an mir hängen, als hätte er Zähne.",
      "Die Stadt atmete langsam, mit schwerem Atem.",
      "Jemand lachte zu leise, um harmlos zu sein.",
      "Zwischen zwei Laternen fiel ein Schatten aus der Zeit.",
      "Ich ging, als trüge ich meinen Namen wie eine Last.",
      "Etwas Glänzendes lag im Schmutz und tat unschuldig."
    ],
    "props": [
      "eine zerknitterte Visitenkarte",
      "ein Flakon mit Resten",
      "eine schwarze Handschuhspitze",
      "ein vergilbter Liebesbrief",
      "eine silberne Münze",
      "ein kleines Taschenmesser",
      "eine zerbrochene Uhrkette",
      "eine rote Nelke",
      "eine Opiumdose",
      "ein Taschenspiegel"
    ],
    "turns": [
      "die Schönheit zeigt ihre Rückseite",
      "das Verlangen wird zur Anklage",
      "die Straße führt in einen Raum ohne Tür",
      "ein Blick verrät, was nicht gesagt werden darf",
      "die Musik im Café fällt plötzlich aus der Welt",
      "ein Geständnis schmeckt nach Rost",
      "das Licht macht alles eleganter, aber nicht wahrer"
    ],
    "obstacles": [
      "der Regen löscht die Spuren",
      "eine Einladung ist eine Falle",
      "ein Zeuge erinnert sich falsch",
      "die Nacht verdichtet die Lügen",
      "ein Versprechen klebt wie Teer",
      "die Menge verschluckt jede Entscheidung",
      "das Herz verwechselt Glanz mit Rettung"
    ],
    "stakes": [
      "Der Einsatz ist Würde.",
      "Der Einsatz ist Begehren: Es frisst, was es berührt.",
      "Der Einsatz ist Wahrheit: Sie kommt im Kostüm.",
      "Der Einsatz ist Erinnerung: Sie parfümiert den Schmerz.",
      "Der Einsatz ist Freiheit: Sie kostet Luxus."
    ],
    "endings": [
      "Und die Stadt schloss ihre Lippen.",
      "Und der Duft blieb, wie ein Urteil.",
      "Damit war die Schönheit erledigt.",
      "So blieb nur Glanz auf kalter Haut.",
      "Und ich ging, als hätte ich gewonnen – und verloren."
    ]
  },
  "kafka": {
    "motifs": [
      "ein Formular ohne Überschrift",
      "eine Wartemarke, die nicht aufgerufen wird",
      "ein Korridor mit zu vielen Türen",
      "ein Stempel mit verschwommener Nummer",
      "ein Protokoll, das sich selbst zitiert",
      "ein Schalterfenster ohne Mitarbeiter",
      "eine Akte mit falschem Namen",
      "eine Uhr, die in Absätzen tickt",
      "ein Bescheid mit leerem Grund",
      "eine Treppe, die nach unten führt und höher endet"
    ],
    "hooks": [
      "Der Brief war da, bevor ich ihn erwartet hatte.",
      "Niemand sagte mir, worum es ging, aber alle taten so.",
      "Die Tür stand offen und war dennoch verschlossen.",
      "Mein Name klang plötzlich wie ein Fehler im System.",
      "Die Luft roch nach Papier und geduldeter Angst.",
      "Ich hatte eine Nummer, aber keinen Platz.",
      "Der Wachmann nickte, als hätte er mich erfunden."
    ],
    "props": [
      "einen Bleistift ohne Spitze",
      "ein Formular in dreifacher Ausführung",
      "einen Stempelabdruck auf dünnem Papier",
      "eine Mappe mit Bindfaden",
      "eine Quittung ohne Betrag",
      "eine Klingel, die nicht läutet",
      "ein Ausweis mit fremdem Foto",
      "ein Schlüssel ohne Schloss",
      "eine Wartemarke",
      "ein Protokollheft"
    ],
    "turns": [
      "die Begründung fehlt, aber gilt",
      "die Zuständigkeit wandert weiter",
      "eine Unterschrift erscheint, ohne Hand",
      "die Tür führt in denselben Raum zurück",
      "der Zeuge ist identisch mit dem Angeklagten",
      "die Akte verlangt eine Akte",
      "die Zeit wird zum Formularfeld"
    ],
    "obstacles": [
      "die Zuständigkeit ist unklar",
      "jemand fehlt, der immer fehlt",
      "die Frist ist schon vorbei",
      "die Regel wird erst nach dem Verstoß erklärt",
      "das Formular hat ein Feld zu viel",
      "der Schalter schließt genau beim Satzanfang",
      "ein Protokoll widerspricht dem nächsten"
    ],
    "stakes": [
      "Der Einsatz ist Identität: Sie wird zu einer Aktennummer.",
      "Der Einsatz ist Freiheit: Sie hängt an einem Stempel.",
      "Der Einsatz ist Zeit: Sie wird verwaltet.",
      "Der Einsatz ist Sprache: Sie wird als Beweis benutzt.",
      "Der Einsatz ist Schuld: Sie existiert vor der Tat."
    ],
    "endings": [
      "Damit war der Vorgang eröffnet.",
      "Und es gab keinen nächsten Schalter.",
      "So blieb nur das Warten als Entscheidung.",
      "Und der Bescheid war schon gültig.",
      "Und ich unterschrieb, ohne zu wissen, was ich war."
    ]
  },
  "expressionismus": {
    "motifs": [
      "eine Straße aus schreiendem Neon",
      "ein Himmel wie ein blutiger Lappen",
      "Fenster, die starren",
      "eine Sirene im Herzen",
      "Schweiß auf kaltem Metall",
      "ein Schatten mit Zähnen",
      "eine Stadt, die fiebert",
      "zerrissene Plakate wie Haut",
      "ein Atem aus Ruß",
      "Licht, das schneidet"
    ],
    "hooks": [
      "Die Stadt sprang mich an.",
      "Ich hörte mein Blut in den Drähten.",
      "Die Häuser standen zu nah, als wollten sie zubeißen.",
      "Ein Schrei hing zwischen zwei Reklamen.",
      "Meine Schritte klangen wie Anklagen.",
      "Das Licht war zu hell, um wahr zu sein.",
      "Jemand rannte, ohne zu wissen, wohin."
    ],
    "props": [
      "eine zerbeulte Blechdose",
      "ein Zigarettenstummel",
      "ein zerrissenes Plakat",
      "eine Taschenlampe",
      "ein Stück Draht",
      "eine rostige Klinge",
      "ein Notizblock",
      "eine Fahrkarte",
      "ein Glas mit schwarzem Wasser",
      "ein Taschenradio"
    ],
    "turns": [
      "die Nacht kippt plötzlich ins Weiß",
      "die Menge wird zu einem einzigen Gesicht",
      "ein Wort wird zur Waffe",
      "die Angst beginnt zu singen",
      "die Straße zieht sich zusammen",
      "das Licht verrät den Körper",
      "der Atem wird zum Befehl"
    ],
    "obstacles": [
      "die Sirenen übertönen alles",
      "die Menge drückt wie Beton",
      "ein Blick löst Panik aus",
      "die Wege führen im Kreis",
      "der Körper ist zu laut",
      "die Luft ist zu dick",
      "die Türen sind nur Attrappen"
    ],
    "stakes": [
      "Der Einsatz ist Nerven: Sie reißen.",
      "Der Einsatz ist Freiheit: Sie ist ein Sprint.",
      "Der Einsatz ist Sprache: Sie wird Schreien.",
      "Der Einsatz ist Körper: Er ist eine Fackel.",
      "Der Einsatz ist Morgen: Es könnte brennen."
    ],
    "endings": [
      "Und die Stadt lachte im Neon.",
      "Und der Morgen kam wie eine Beule.",
      "So blieb ich stehen, weil alles rannte.",
      "Und der Schrei wurde leise.",
      "Und das Licht tat, als wäre es sauber."
    ]
  },
  "surrealismus1920": {
    "motifs": [
      "eine Treppe aus Milchglas",
      "ein Telefon, das in Sand klingelt",
      "ein Auge in einer Schublade",
      "ein Regenschirm in einem Zimmerbrand",
      "eine Uhr aus weichem Brot",
      "ein Pferd, das im Flur schläft",
      "ein Fenster, das nach innen öffnet",
      "eine Hand voller Schlüssel, die singen",
      "eine Karte, die Wörter statt Orte zeigt",
      "ein Spiegel, der einen anderen Raum behauptet"
    ],
    "hooks": [
      "Ich trat in den Raum, und der Raum trat zurück.",
      "Ein Satz lag auf dem Boden wie eine Banane.",
      "Die Lampe machte Geräusche, als wäre sie nass.",
      "Jemand sprach, aber die Worte kamen aus der Tapete.",
      "Meine Schuhe wussten den Weg, ich nicht.",
      "Ein Vogel bat um eine Quittung.",
      "Die Tür erinnerte sich an mein Gesicht."
    ],
    "props": [
      "einen Regenschirm",
      "eine Schublade",
      "ein Stück Kreide",
      "eine Taschenuhr aus Brot",
      "eine Maske",
      "eine Schere",
      "einen Schlüsselbund",
      "ein kleines Bild",
      "eine Feder",
      "ein Glas Wasser"
    ],
    "turns": [
      "die Logik wechselt die Richtung",
      "ein Gegenstand beginnt zu sprechen",
      "die Szene wiederholt sich, aber mit anderem Wetter",
      "ein Name fällt aus dem Himmel",
      "die Wände werden durchlässig",
      "Zeit wird zu einem Möbelstück",
      "das Unterbewusste unterschreibt"
    ],
    "obstacles": [
      "die Tür führt in eine Zeichnung",
      "die Sprache stolpert über sich selbst",
      "jemand verlangt Beweise für einen Traum",
      "die Treppe endet in einem Satz",
      "ein Schatten läuft voraus",
      "die Uhr schmilzt in der Hand",
      "das Fenster weigert sich, hinauszuschauen"
    ],
    "stakes": [
      "Der Einsatz ist Realität: Sie ist verhandelbar.",
      "Der Einsatz ist Identität: Sie wechselt die Masken.",
      "Der Einsatz ist Zeit: Sie ist weich.",
      "Der Einsatz ist Wahrheit: Sie ist ein Bild.",
      "Der Einsatz ist Erwachen: Es könnte unmöglich sein."
    ],
    "endings": [
      "Und der Traum unterschrieb mit meinem Namen.",
      "Und als ich erwachte, war der Raum größer.",
      "So blieb nur der Beweis: ein nasser Schlüssel.",
      "Und die Uhr aß die letzte Minute.",
      "Und die Tür tat, als hätte sie mich nie gekannt."
    ]
  },
  "transzendenz": {
    "motifs": [
      "eine Stimme aus synthetischem Schnee",
      "ein Körper aus Ersatzteilen",
      "ein Gedanke als Protokoll",
      "ein Sensor, der Träume misst",
      "ein Himmel aus Glasfaser",
      "eine Erinnerung als Datei",
      "eine Haut mit Versionsnummer",
      "ein Auge ohne Lid",
      "ein Summen, das Entscheidungen trifft",
      "ein Stern, der wie ein Server blinkt"
    ],
    "hooks": [
      "Ich wachte auf, und mein Name war ein Update.",
      "Die Stadt war still, weil sie rechnete.",
      "Ein Signal rief mich, als wäre ich kompatibel.",
      "Meine Hände erinnerten sich an eine andere Firmware.",
      "Im Spiegel stand eine Version von mir, die ich nicht kannte.",
      "Die Luft trug Daten wie Staub.",
      "Jemand hatte mein Gefühl archiviert."
    ],
    "props": [
      "ein Datenfragment",
      "eine Kontaktlinse mit Overlay",
      "ein kaltes Kabel",
      "ein Speicherchip",
      "ein Diagnosetool",
      "eine Drohnenmarke",
      "ein zerlegbares Modul",
      "eine Frequenzkarte",
      "ein Handschuh mit Feedback",
      "ein Schlüssel aus Plastik"
    ],
    "turns": [
      "die Emotion wird zur Berechnung",
      "ein Backup spricht mit meiner Stimme",
      "die Realität wechselt den Modus",
      "der Körper akzeptiert eine fremde Signatur",
      "ein Protokoll ersetzt eine Erinnerung",
      "das Netz schließt eine Lücke – in mir",
      "die Menschlichkeit erscheint als Artefakt"
    ],
    "obstacles": [
      "der Zugriff ist gesperrt",
      "die Identität ist inkonsistent",
      "ein Prozess läuft ohne Erlaubnis",
      "das System verlangt Zustimmung, die es schon hat",
      "die Sensoren widersprechen dem Gefühl",
      "ein Timeout löscht den Moment",
      "eine Kopie beansprucht den Platz"
    ],
    "stakes": [
      "Der Einsatz ist Selbst: Es wird versioniert.",
      "Der Einsatz ist Erinnerung: Sie kann überschrieben werden.",
      "Der Einsatz ist Freiheit: Sie ist ein Rechtepaket.",
      "Der Einsatz ist Körper: Er ist austauschbar.",
      "Der Einsatz ist Liebe: Sie ist eine Schnittstelle."
    ],
    "endings": [
      "Und das Update war nicht rückgängig zu machen.",
      "Und ich war online, obwohl ich schwieg.",
      "So blieb nur die Version, nicht das Wesen.",
      "Und das System nannte es Heilung.",
      "Und irgendwo lief mein Backup weiter."
    ]
  },
  "melville": {
    "motifs": [
      "ein Meer wie ein Gedanke ohne Ende",
      "ein Walrücken im Nebel",
      "eine Linie am Horizont, die nicht stillhält",
      "ein Harpunenseil wie ein Schicksalsfaden",
      "Salz auf den Lippen wie eine Predigt",
      "ein Logbuch voller Fragen",
      "ein Sternbild, das sich verschiebt",
      "eine Planke, die nach Öl riecht",
      "Wind, der Namen trägt",
      "Tiefe, die antwortlos bleibt"
    ],
    "hooks": [
      "Ich trat an Deck, als wäre es ein Urteil.",
      "Der Ozean lag da wie ein Gesetz, das niemand erklärt.",
      "Ein Schatten unter der Oberfläche machte die Welt schwer.",
      "Der Wind sprach, aber nicht zu uns.",
      "Wir fuhren, als jagten wir einem Gedanken nach.",
      "Das Wasser glänzte, als hätte es einen Willen.",
      "Ein Ruf ging über die See und kam verändert zurück."
    ],
    "props": [
      "eine Harpune",
      "ein Logbuch",
      "ein Messingfernrohr",
      "ein Kompass",
      "eine Öl-Laterne",
      "ein Stück Tauwerk",
      "ein Seekartenfragment",
      "ein geschnitzter Anhänger",
      "eine Pfeife",
      "ein Schiffssextant"
    ],
    "turns": [
      "das Ziel wird zum Spiegel",
      "die Jagd verschiebt die Seele",
      "der Nebel trägt eine Gestalt",
      "ein Zeichen erscheint im Schaum",
      "die Mannschaft wird zu Stimmen im Wind",
      "das Meer verlangt einen Preis",
      "der Kurs führt nach innen"
    ],
    "obstacles": [
      "der Nebel löscht Entfernungen",
      "der Wind dreht ohne Warnung",
      "das Seil zieht wie eine Entscheidung",
      "ein Sturm ohne Rand",
      "die Nacht frisst die Sterne",
      "ein Aberglaube wächst wie Schimmel",
      "die Tiefe bleibt stumm"
    ],
    "stakes": [
      "Der Einsatz ist Sinn: Er könnte nicht existieren.",
      "Der Einsatz ist Hingabe: Sie wird zur Besessenheit.",
      "Der Einsatz ist Leben: Es ist nur Material für die See.",
      "Der Einsatz ist Wahrheit: Sie ist so groß wie der Ozean.",
      "Der Einsatz ist Heimkehr: Sie wird zu einer Legende."
    ],
    "endings": [
      "Und das Meer blieb, wie es war.",
      "Und wir begriffen, dass die Jagd uns jagte.",
      "So endete es im Nebel, nicht im Sieg.",
      "Und der Horizont tat, als hätte er nichts gesehen.",
      "Und das Logbuch schloss sich wie ein Gebet."
    ]
  },
  "formalismus": {
    "motifs": [
      "eine Regel ohne Ausnahme",
      "eine Definition mit Fußnote",
      "ein Paragraph mit Randbemerkung",
      "ein System aus Nummern",
      "eine Hierarchie aus Zeichen",
      "ein Schema mit Leerstellen",
      "eine Vorschrift mit impliziter Klausel",
      "eine Ordnung ohne Ursprung",
      "ein Verfahren ohne Subjekt",
      "eine Struktur mit blinden Punkten"
    ],
    "hooks": [
      "Abschnitt 1: Sachverhalt",
      "Definition A wird angewendet",
      "Gemäß Regel 3.2",
      "Die Ordnung gilt",
      "Es wird festgestellt",
      "Die Zuständigkeit ist geklärt",
      "Ein Protokoll beginnt",
      "Der Vorgang wird eröffnet"
    ],
    "props": [
      "ein Dokument",
      "eine Akte",
      "ein Vermerk",
      "eine Tabelle",
      "ein Siegel",
      "eine Fußnote",
      "eine Nummer",
      "ein Formular",
      "eine Unterschrift",
      "eine Registratur"
    ],
    "turns": [
      "Die Regel widerspricht sich selbst",
      "Ein Absatz wird gestrichen",
      "Die Definition verschiebt ihre Bedeutung",
      "Die Hierarchie kippt",
      "Die Klausel wird wörtlich genommen",
      "Die Ausnahme wird zur Norm",
      "Ein Verweis führt ins Leere"
    ],
    "obstacles": [
      "Die Zuständigkeit ist unklar",
      "Ein Dokument fehlt",
      "Die Signatur ist ungültig",
      "Ein Absatz ist doppeldeutig",
      "Die Definition ist nicht abschließend",
      "Der Begriff ist nicht normiert"
    ],
    "stakes": [
      "Der Einsatz ist Gültigkeit.",
      "Der Einsatz ist Eindeutigkeit.",
      "Der Einsatz ist Systemstabilität.",
      "Der Einsatz ist Ordnung."
    ],
    "endings": [
      "Damit ist der Vorgang abgeschlossen.",
      "Die Ordnung bleibt bestehen.",
      "Der Sachverhalt ist festgestellt.",
      "Der Fall gilt als entschieden.",
      "Die Regel bleibt in Kraft."
    ]
  },
  "christentum": {
    "motifs": [
      "ein Kreuz aus Licht über einer leeren Straße",
      "eine brennende Kerze ohne Docht",
      "ein Kelch, der Sternbilder spiegelt",
      "ein Stein, der vor einem Grab atmet",
      "eine Dornenkrone aus Glas",
      "eine Taube, die durch Mauern fliegt",
      "ein Fisch aus Schatten im Wasser",
      "eine Leiter zwischen Wolken und Staub",
      "eine Hand mit einem Wundmal aus Gold",
      "eine Tür ohne Klinke in einer Kapelle"
    ],
    "hooks": [
      "Das Licht fiel nicht vom Himmel, sondern aus meinem Mund.",
      "Die Glocken läuteten rückwärts.",
      "Ich kniete, und der Boden antwortete.",
      "Ein Gleichnis stand plötzlich im Raum.",
      "Der Wind roch nach Weihrauch und Regen.",
      "Ein Engel verwechselte meinen Namen.",
      "Das Brot zerbrach, bevor ich es berührte."
    ],
    "props": [
      "eine Kerze",
      "einen Rosenkranz",
      "eine Bibel",
      "einen Kelch",
      "ein Stück Brot",
      "einen silbernen Fisch",
      "eine weiße Lilie",
      "ein kleines Holzkreuz",
      "eine Tonschale",
      "ein Tuch"
    ],
    "turns": [
      "das Gleichnis wird wörtlich",
      "ein Wunder geschieht im Nebensatz",
      "der Zweifel spricht lauter als der Glaube",
      "das Licht wechselt die Quelle",
      "ein Opfer wird zur Umarmung",
      "der Himmel antwortet in Stille",
      "der Stein beginnt zu rollen"
    ],
    "obstacles": [
      "der Glaube verlangt einen Sprung",
      "ein Zeichen bleibt aus",
      "der Verrat steht am Tisch",
      "die Menge ruft nach Beweisen",
      "der Himmel schweigt",
      "das Wasser trägt nicht",
      "das Grab bleibt verschlossen"
    ],
    "stakes": [
      "Der Einsatz ist Erlösung: Sie kostet alles.",
      "Der Einsatz ist Vergebung: Sie ist unverdient.",
      "Der Einsatz ist Glaube: Er sieht ohne Augen.",
      "Der Einsatz ist Liebe: Sie opfert sich.",
      "Der Einsatz ist Auferstehung: Sie widerspricht der Logik."
    ],
    "endings": [
      "Und das Licht blieb, auch ohne Sonne.",
      "Und der Stein war leichter als mein Herz.",
      "Und ich ging, als hätte ich Flügel.",
      "Und das Brot reichte für alle.",
      "Und der Himmel öffnete sich nach innen."
    ]
  },
  "koran": {
    "motifs": [
      "eine Schrift aus Licht auf schwarzem Wasser",
      "ein Halbmond, der im Sand pulsiert",
      "eine Wüste, die flüstert",
      "ein Brunnen, der Sterne spiegelt",
      "ein Gebetsteppich, der sich wiegt",
      "eine Stimme ohne Körper",
      "eine Waage aus Wind",
      "ein Garten hinter einer unsichtbaren Mauer",
      "eine Laterne ohne Flamme",
      "ein Siegel aus Licht auf der Stirn"
    ],
    "hooks": [
      "Die Worte kamen wie Regen in der Nacht.",
      "Der Ruf erreichte mich vor meinem Namen.",
      "Ich wusch meine Hände, und die Zeit wurde klar.",
      "Die Wüste öffnete ein Auge.",
      "Ein Vers stand im Sand.",
      "Die Stille hatte einen Rhythmus.",
      "Der Wind sprach arabisch."
    ],
    "props": [
      "einen Gebetsteppich",
      "eine Gebetskette",
      "eine Schale mit Wasser",
      "eine Dattel",
      "eine Laterne",
      "ein Stück Pergament",
      "eine Feder",
      "einen Kompass",
      "ein Tuch",
      "einen Ring"
    ],
    "turns": [
      "ein Vers verändert die Richtung",
      "die Waage neigt sich unsichtbar",
      "das Herz wird Richter",
      "die Wüste wird zum Garten",
      "eine Prüfung wird zur Gabe",
      "die Schrift beginnt zu leuchten",
      "die Stille antwortet"
    ],
    "obstacles": [
      "der Zweifel trocknet die Zunge",
      "der Weg verliert seine Spuren",
      "eine Prüfung kommt ohne Warnung",
      "die Nacht scheint endlos",
      "ein Vers bleibt unverständlich",
      "das Herz ist verschlossen",
      "die Geduld reißt"
    ],
    "stakes": [
      "Der Einsatz ist Hingabe: Sie fordert Vertrauen.",
      "Der Einsatz ist Rechtleitung: Sie ist ein schmaler Pfad.",
      "Der Einsatz ist Geduld: Sie wird geprüft.",
      "Der Einsatz ist Gerechtigkeit: Sie wiegt jedes Wort.",
      "Der Einsatz ist Barmherzigkeit: Sie übersteigt das Maß."
    ],
    "endings": [
      "Und die Wüste trug plötzlich Grün.",
      "Und mein Herz fand seine Qibla.",
      "Und der Vers blieb in mir.",
      "Und die Nacht war nicht mehr dunkel.",
      "Und der Garten öffnete sich im Inneren."
    ]
  },
  "buddhismus": {
    "motifs": [
      "eine Lotusblüte aus Nebel",
      "ein Rad, das sich ohne Achse dreht",
      "eine Glocke im Wind",
      "ein Spiegel ohne Spiegelbild",
      "ein leerer Thron unter einem Baum",
      "eine Spur im Sand, die verschwindet",
      "ein Fluss ohne Quelle",
      "eine Schale voller Stille",
      "eine Kerze im Morgengrauen",
      "ein Berg, der atmet"
    ],
    "hooks": [
      "Ich setzte mich, und die Welt setzte sich mit mir.",
      "Ein Atemzug dauerte ein Jahrhundert.",
      "Die Frage löste sich vor der Antwort.",
      "Ein Blatt fiel, und ich verstand.",
      "Die Stille war lauter als der Markt.",
      "Ein Mönch lächelte ohne Grund.",
      "Der Weg begann unter meinen Füßen."
    ],
    "props": [
      "eine Gebetsschale",
      "eine Mala",
      "eine Lotusblume",
      "eine kleine Glocke",
      "ein Tuch",
      "eine Kerze",
      "eine Holzfigur",
      "eine Teeschale",
      "ein Blatt",
      "einen Kieselstein"
    ],
    "turns": [
      "das Ich löst sich auf",
      "der Kreis schließt sich nicht",
      "die Frage verschwindet",
      "Zeit wird zu Atem",
      "Leere wird Form",
      "das Rad dreht sich rückwärts",
      "Erkenntnis geschieht ohne Worte"
    ],
    "obstacles": [
      "der Geist springt wie ein Affe",
      "Anhaftung hält fest",
      "der Wunsch erzeugt Schatten",
      "die Stille wird unruhig",
      "das Selbst verlangt Bestätigung",
      "der Weg scheint zu einfach",
      "der Schmerz klammert sich"
    ],
    "stakes": [
      "Der Einsatz ist Erwachen: Es geschieht still.",
      "Der Einsatz ist Loslassen: Nichts bleibt.",
      "Der Einsatz ist Mitgefühl: Es kennt kein Ich.",
      "Der Einsatz ist Einsicht: Sie löst Grenzen.",
      "Der Einsatz ist Nirwana: Es ist kein Ort."
    ],
    "endings": [
      "Und der Atem kehrte heim.",
      "Und nichts fehlte.",
      "Und der Kreis war offen.",
      "Und die Blüte fiel nicht mehr.",
      "Und der Weg war kein Weg."
    ]
  },
  "biologie": {
    "motifs": [
      "eine Zelle mit Fenster",
      "ein Herz im Glas",
      "ein Baum mit wandernden Wurzeln",
      "ein Insekt aus Uhrwerk",
      "eine DNA-Spirale aus Licht",
      "eine Blüte, die sich erinnert",
      "ein Aquarium ohne Wasser",
      "eine Haut aus Blättern",
      "ein Mikroskop voller Sterne",
      "ein Skelett, das atmet"
    ],
    "hooks": [
      "Die Zelle teilte sich zu früh.",
      "Ein Blatt schrieb meinen Namen.",
      "Das Mikroskop vergrößerte die Stille.",
      "Ein Herz schlug außerhalb des Körpers.",
      "Ein Tier sah mich an, als wüsste es mehr."
    ],
    "props": [
      "ein Mikroskop",
      "eine Petrischale",
      "ein Skalpell",
      "ein Herbariumblatt",
      "eine Pipette",
      "ein Glas mit Formalin",
      "ein Samen",
      "ein Anatomiebuch",
      "eine Feder",
      "ein Reagenzglas"
    ],
    "turns": [
      "eine Mutation wird bewusst",
      "ein Organ beginnt zu sprechen",
      "die Evolution springt einen Schritt",
      "ein Körper erinnert sich an frühere Formen",
      "Zellen wechseln die Identität",
      "die Natur schreibt neu",
      "Leben entsteht im Falschen"
    ],
    "obstacles": [
      "das Gewebe zerfällt",
      "eine Art verschwindet",
      "der Samen keimt nicht",
      "ein Virus flüstert",
      "das Experiment gerät außer Kontrolle",
      "Instinkt widerspricht Vernunft",
      "das Herz schlägt im falschen Rhythmus"
    ],
    "stakes": [
      "Der Einsatz ist Anpassung: Überleben oder Aussterben.",
      "Der Einsatz ist Identität: Was macht ein Wesen aus?",
      "Der Einsatz ist Balance: Natur oder Eingriff?",
      "Der Einsatz ist Ursprung: Wo beginnt Leben?",
      "Der Einsatz ist Verantwortung: Wer verändert wen?"
    ],
    "endings": [
      "Und das Leben wuchs weiter, leise.",
      "Und die Mutation blieb.",
      "So blieb nur eine Spur im Gewebe.",
      "Und das Herz fand einen neuen Takt.",
      "Und die Natur antwortete nicht."
    ]
  },
  "geologie": {
    "motifs": [
      "eine Stadt unter Lava",
      "ein sprechender Granitblock",
      "eine Fossilie mit geöffnetem Auge",
      "ein Fluss aus Quecksilber",
      "eine Schlucht voller Stimmen",
      "ein Berg mit Herzschlag",
      "eine Karte aus Gesteinsschichten",
      "ein Kristall, der Erinnerungen speichert",
      "eine tektonische Naht im Wohnzimmer",
      "eine Höhle aus Salz"
    ],
    "hooks": [
      "Der Boden unter mir dachte nach.",
      "Ein Riss zog sich durch den Morgen.",
      "Der Stein war wärmer als meine Hand.",
      "Die Landschaft verschob sich um Millimeter.",
      "Ein Fossil flüsterte meinen Namen."
    ],
    "props": [
      "ein Hammer",
      "eine Lupe",
      "ein Stück Basalt",
      "eine Feldkarte",
      "ein Kompass",
      "ein Notizbuch voller Schichten",
      "eine Taschenlampe",
      "eine Bohrprobe",
      "ein Kristall",
      "eine Staubmaske"
    ],
    "turns": [
      "die Erdkruste spricht",
      "Druck wird zu Erinnerung",
      "eine Verwerfung öffnet sich",
      "Zeit beschleunigt sich um Jahrtausende",
      "ein Vulkan träumt",
      "das Gestein wird durchsichtig",
      "Schichten tauschen ihre Reihenfolge"
    ],
    "obstacles": [
      "die Höhle endet im Nichts",
      "ein Erdbeben verschiebt die Karte",
      "der Kompass dreht sich ziellos",
      "die Lava versiegelt den Ausgang",
      "eine Schicht fehlt",
      "der Boden gibt nach",
      "Staub nimmt die Sicht"
    ],
    "stakes": [
      "Der Einsatz ist Stabilität: Der Boden trägt oder bricht.",
      "Der Einsatz ist Herkunft: Was liegt unter uns?",
      "Der Einsatz ist Geduld: Millionen Jahre im Warten.",
      "Der Einsatz ist Erinnerung: Im Stein eingeschlossen.",
      "Der Einsatz ist Überleben: Die Erde entscheidet."
    ],
    "endings": [
      "Und der Berg schwieg wieder.",
      "Und die Schichten schlossen sich.",
      "So blieb nur ein Abdruck im Gestein.",
      "Und der Riss wurde zu einer Linie auf Papier.",
      "Und der Staub legte sich wie Schnee."
    ]
  },
  "astrologie": {
    "motifs": [
      "eine Galaxie im Wasserglas",
      "ein Planet mit Rissen aus Licht",
      "ein Teleskop, das nach innen schaut",
      "ein Komet aus gefrorenen Erinnerungen",
      "ein schwarzes Loch im Bücherregal",
      "eine Sternkarte ohne Norden",
      "ein Mond mit Puls",
      "eine Sonne aus Glas",
      "ein Satellit, der Gedichte sendet",
      "eine Raumstation aus Knochen"
    ],
    "hooks": [
      "Der Himmel atmete näher als sonst.",
      "Ein Stern fiel nicht – er stieg.",
      "Das Teleskop beobachtete mich.",
      "Zwischen zwei Sekunden öffnete sich ein Orbit.",
      "Der Mond war heute schwerer."
    ],
    "props": [
      "ein Fernglas",
      "eine Sternkarte",
      "ein Stück Meteorit",
      "eine zerkratzte Raumkapsel",
      "ein Notizbuch mit Koordinaten",
      "ein Kompass ohne Nadel",
      "eine Sauerstoffmaske",
      "ein Modellplanet",
      "eine Sanduhr mit Sternenstaub",
      "ein Funksender"
    ],
    "turns": [
      "die Gravitation ändert ihre Richtung",
      "ein Planet antwortet",
      "Zeit dehnt sich sichtbar",
      "ein Stern wird geboren und spricht",
      "der Beobachter wird beobachtet",
      "der Raum faltet sich wie Papier",
      "das Licht kommt zu spät"
    ],
    "obstacles": [
      "der Horizont verschluckt die Sterne",
      "das Signal erreicht nur die Vergangenheit",
      "ein schwarzes Loch verweigert die Rückgabe",
      "die Umlaufbahn zerbricht",
      "der Sauerstoff wird zu Erinnerung",
      "die Sternkarte zeigt nur Namen",
      "ein Komet streicht den Kurs"
    ],
    "stakes": [
      "Der Einsatz ist Schwerkraft: Sie hält oder lässt los.",
      "Der Einsatz ist Ursprung: Wo begann das Licht?",
      "Der Einsatz ist Isolation: Niemand antwortet.",
      "Der Einsatz ist Zeit: Milliarden Jahre in einer Sekunde.",
      "Der Einsatz ist Heimkehr: Gibt es einen Weg zurück?"
    ],
    "endings": [
      "Und die Sterne rückten ein Stück näher.",
      "Und das Licht blieb zurück wie ein Echo.",
      "So blieb nur Staub in meiner Hand.",
      "Und der Planet drehte sich ohne mich weiter.",
      "Und ich fiel – nach oben."
    ]
  },
  "gaia": {
    "motifs": [
      "ein Planet mit Atem",
      "Kontinente als Rippen",
      "Ozeane als Blut",
      "ein Puls im Erdinneren",
      "Wälder als Nervengeflecht",
      "Wolken als Gedanken",
      "ein Gebirge als Stirn",
      "Flüsse als Adern",
      "Städte wie leuchtende Parasiten",
      "eine Atmosphäre als Haut"
    ],
    "hooks": [
      "Die Erde blinzelte.",
      "Ein Erdbeben war nur ein Zucken.",
      "Der Wind sprach in ganzen Sätzen.",
      "Die Gezeiten folgten einem Herzschlag.",
      "Wir lebten auf einer Stirn."
    ],
    "props": [
      "eine Handvoll Erde",
      "ein Stethoskop",
      "eine Weltkarte",
      "ein Glas Meerwasser",
      "ein Stein mit Riss",
      "ein Blatt",
      "eine seismografische Linie",
      "ein Satellitenbild",
      "eine Atemmaske",
      "eine Wurzel"
    ],
    "turns": [
      "der Planet reagiert bewusst",
      "das Klima antwortet",
      "die Kontinente verschieben sich absichtlich",
      "die Menschheit wird als Symptom erkannt",
      "die Welt beginnt zu träumen",
      "Naturgesetze werden zu Instinkten",
      "der Himmel senkt sich näher"
    ],
    "obstacles": [
      "der Organismus wird krank",
      "der Puls wird unregelmäßig",
      "ein Teil des Körpers rebelliert",
      "das Nervensystem brennt",
      "die Haut reißt",
      "der Atem wird dünn",
      "das Gedächtnis der Erde löscht sich"
    ],
    "stakes": [
      "Der Einsatz ist Gleichgewicht: System oder Kollaps.",
      "Der Einsatz ist Bewusstsein: Weiß die Welt von uns?",
      "Der Einsatz ist Koexistenz: Parasit oder Zelle?",
      "Der Einsatz ist Heilung: Regeneration oder Narben.",
      "Der Einsatz ist Zukunft: Evolution oder Fieber."
    ],
    "endings": [
      "Und der Planet atmete tiefer.",
      "Und wir waren nur eine Phase.",
      "So blieb ein leiser Herzschlag.",
      "Und die Welt drehte sich weiter – wissend.",
      "Und das Wesen schloss kurz die Augen."
    ]
  },
  "freud": {
    "motifs": [
      "eine Couch im Halbdunkel",
      "ein Traum, der sich wiederholt",
      "ein Schlüssel ohne Schloss",
      "eine verschlossene Tür im Inneren",
      "ein Kinderspielzeug unter dem Bett",
      "ein Spiegel ohne Spiegelbild",
      "eine Treppe ins Untergeschoss",
      "ein Brief ohne Absender",
      "eine tickende Uhr im Kopf",
      "ein Schatten hinter der Stimme"
    ],
    "hooks": [
      "Ich erinnere mich nicht, aber mein Körper schon.",
      "Der Traum begann immer an derselben Stelle.",
      "Es war nur ein Versprecher.",
      "Ich sagte Mutter, meinte aber etwas anderes.",
      "Die Stille zwischen zwei Worten wurde zu laut."
    ],
    "props": [
      "eine Couch",
      "ein Notizbuch",
      "eine Taschenuhr",
      "ein Kindheitsfoto",
      "eine Zigarre",
      "ein Briefumschlag",
      "eine verschlossene Schublade",
      "ein Schlüssel",
      "eine Maske",
      "ein Tagebuch"
    ],
    "turns": [
      "das Unbewusste übernimmt die Szene",
      "eine Verdrängung löst sich",
      "ein Traum wird wörtlich",
      "das Ich verliert Kontrolle",
      "das Über-Ich spricht mit fremder Stimme",
      "ein Kindheitsbild wird real",
      "Begehren zeigt sein Gesicht"
    ],
    "obstacles": [
      "Erinnerung verweigert sich",
      "ein Symptom ersetzt die Wahrheit",
      "Scham blockiert das Sprechen",
      "der Traum verschiebt seine Bedeutung",
      "ein Widerstand baut sich auf",
      "Sprache zerfällt in Andeutungen",
      "ein Name darf nicht ausgesprochen werden"
    ],
    "stakes": [
      "Der Einsatz ist Wahrheit: Verdrängt oder erkannt.",
      "Der Einsatz ist Identität: Wer spricht wirklich?",
      "Der Einsatz ist Begehren: Erfüllt oder verschoben.",
      "Der Einsatz ist Freiheit: Neurose oder Einsicht.",
      "Der Einsatz ist Erinnerung: Heilung oder Wiederholung."
    ],
    "endings": [
      "Und das Unbewusste lächelte.",
      "Und das Symptom verschwand – vorläufig.",
      "So blieb nur eine neue Deutung.",
      "Und der Traum begann erneut.",
      "Und ich wusste, warum ich es vergessen hatte."
    ]
  },
  "jugendsprache": {
    "motifs": [
      "eine Nachricht mit drei Flammen-Emojis",
      "ein Meme, das niemand erklärt",
      "ein Satz ohne Satzzeichen",
      "ein Insiderwort mit Ablaufdatum",
      "ein Screenshot als Beweis",
      "Ironie ohne Warnschild",
      "eine Abkürzung, die alles ersetzt",
      "ein Trend, der morgen cringe ist",
      "ein Wort, das Bedeutung wechselt",
      "ein Kommentar mit nur einem Wort: 'wild'"
    ],
    "hooks": [
      "Bro, das war anders.",
      "Sag ehrlich, fühlst du das?",
      "Das ist so random.",
      "Lowkey war das krass.",
      "Ich schwör, kein Cap."
    ],
    "props": [
      "ein Smartphone",
      "eine Sprachnachricht",
      "ein Screenshot",
      "ein Hoodie",
      "ein Emoji",
      "ein TikTok-Sound",
      "ein Hashtag",
      "eine Insta-Story",
      "ein Gruppenchat",
      "ein AirPod"
    ],
    "turns": [
      "Ironie kippt in Ernst",
      "ein Insider wird öffentlich",
      "ein Trend wird Mainstream",
      "ein Wort verliert Bedeutung",
      "Slang wird Marketing",
      "Humor wird Verteidigung",
      "Authentizität wird getestet"
    ],
    "obstacles": [
      "cringe-Moment",
      "Missverständnis ohne Tonfall",
      "Generationenkonflikt",
      "Cancel-Druck",
      "Fake-Authentizität",
      "zu viel Ironie",
      "ständiger Vergleich"
    ],
    "stakes": [
      "Der Einsatz ist Zugehörigkeit: Drin oder raus.",
      "Der Einsatz ist Coolness: Echt oder tryhard.",
      "Der Einsatz ist Identität: Selbstbild oder Performance.",
      "Der Einsatz ist Tempo: Mitgehen oder zurückbleiben.",
      "Der Einsatz ist Humor: Lachen oder ausgelacht werden."
    ],
    "endings": [
      "Und plötzlich war es peinlich.",
      "Und alle fühlten es.",
      "So wurde es ein Insider.",
      "Und das Meme starb.",
      "Und wir sagten einfach: wild."
    ]
  },
  "modernarchitecture": {
    "motifs": [
      "eine Glasfassade ohne Vorhang",
      "eine Betonwand mit Schattenkante",
      "ein Raum ohne Türen",
      "eine Treppe aus Stahl",
      "ein Flachdach unter offenem Himmel",
      "eine Stadt aus rechten Winkeln",
      "ein Fensterband ohne Rahmen",
      "ein Innenhof mit Lichtschacht",
      "eine weiße Fläche ohne Dekor",
      "ein Gebäude auf Stelzen"
    ],
    "hooks": [
      "Der Raum war größer als gedacht.",
      "Nichts lenkte ab.",
      "Licht fiel wie ein Entwurf.",
      "Die Wände schienen zu schweigen.",
      "Die Stadt begann im Wohnzimmer."
    ],
    "props": [
      "ein Architekturmodell",
      "ein Grundrissplan",
      "eine Skizze auf Transparentpapier",
      "eine Betonprobe",
      "eine Stahlstrebe",
      "eine Glasplatte",
      "ein Maßband",
      "ein CAD-Tablet",
      "ein Lichtschalter",
      "eine Designlampe"
    ],
    "turns": [
      "Form folgt Funktion radikal",
      "Innen und Außen verschmelzen",
      "Ornament verschwindet",
      "der Raum wird flexibel",
      "Technik wird sichtbar",
      "Transparenz erzeugt Kontrolle",
      "Minimalismus wird zum Statement"
    ],
    "obstacles": [
      "Kälte des Materials",
      "Verlust von Intimität",
      "Kostenexplosion",
      "Stadtverdichtung",
      "Nachhaltigkeitskonflikt",
      "Glas wird zur Grenze",
      "Funktion widerspricht Gefühl"
    ],
    "stakes": [
      "Der Einsatz ist Lebensqualität: Raum als Haltung.",
      "Der Einsatz ist Nachhaltigkeit: Zukunft bauen oder verbrauchen.",
      "Der Einsatz ist Identität: Gebäude als Aussage.",
      "Der Einsatz ist Offenheit: Transparenz oder Überwachung.",
      "Der Einsatz ist Zeit: Zeitlos oder Trend."
    ],
    "endings": [
      "Und das Licht blieb.",
      "Und der Raum atmete.",
      "So stand nur noch Struktur.",
      "Und die Stadt nahm es auf.",
      "Und das Gebäude wurde Idee."
    ]
  },
  "philosophie": {
    "motifs": [
      "eine Bibliothek ohne Ende",
      "ein Spiegel, der Fragen stellt",
      "eine Brücke zwischen zwei Wahrheiten",
      "ein Labyrinth aus Begriffen",
      "ein Baum aus Argumenten",
      "eine Waage ohne Gewichte",
      "ein Kreis ohne Mittelpunkt",
      "eine Uhr, die Möglichkeiten misst",
      "eine Tür zwischen Sein und Werden",
      "ein Fluss, in dem Gedanken treiben"
    ],
    "hooks": [
      "Was, wenn das Offensichtliche die größte Täuschung wäre?",
      "Ich wusste plötzlich nicht mehr, was Wissen bedeutet.",
      "Eine einfache Frage brachte die Welt ins Wanken.",
      "Der Widerspruch schien vernünftiger als die Gewissheit.",
      "Vielleicht beginnt Wahrheit dort, wo Antworten enden."
    ],
    "props": [
      "ein leeres Buch",
      "eine Feder",
      "ein Kompass",
      "eine Sanduhr",
      "eine Kerze",
      "eine Lupe",
      "ein Schachbrett",
      "ein Stein",
      "eine Maske",
      "ein Schlüssel"
    ],
    "turns": [
      "ein Axiom zerfällt",
      "ein Begriff erhält eine neue Bedeutung",
      "der Beobachter wird Teil des Problems",
      "zwei Gegensätze erweisen sich als identisch",
      "Zeit wird zur Illusion",
      "Freiheit widerspricht der Sicherheit",
      "die Frage wird wichtiger als die Antwort"
    ],
    "obstacles": [
      "ein Paradoxon blockiert den Weg",
      "Sprache reicht nicht aus",
      "Gewohnheit verhindert Erkenntnis",
      "jede Lösung erzeugt eine neue Frage",
      "der Zweifel wächst",
      "Logik widerspricht Intuition",
      "Wahrheit besitzt mehrere Gesichter"
    ],
    "stakes": [
      "Der Einsatz ist Erkenntnis: Was kann ich wissen?",
      "Der Einsatz ist Freiheit: Wer entscheidet?",
      "Der Einsatz ist Identität: Wer bin ich?",
      "Der Einsatz ist Moral: Was soll ich tun?",
      "Der Einsatz ist Wirklichkeit: Was ist wirklich?"
    ],
    "endings": [
      "Und die Frage blieb bestehen.",
      "Und der Zweifel wurde zum Anfang.",
      "So entstand eine neue Perspektive.",
      "Und die Wahrheit lächelte schweigend.",
      "Und das Denken begann von vorn."
    ]
  },
  "klimakrise": {
    "motifs": [
      "ein Himmel, der nach Rauch und Ruß riecht",
      "schmelzendes Eis, das durch die Seine treibt",
      "eine Sonne, die zu heiß über Versailles brennt",
      "Nebel aus Treibhausgasen über den Barrikaden",
      "ein Wald, der stumm verdorrt, während Paris brennt",
      "aschgraue Wolken, die keine Jahreszeit kennen",
      "ein Fluss, der immer weiter zurückweicht",
      "Risse in der Erde wie alte Wunden"
    ],
    "hooks": [
      "ein Thermometer, das rückwärts steigt",
      "ein vergilbtes Kartenblatt zeigt ein Meer, das es nicht mehr gibt",
      "Zar Peters Kompass zeigt nur noch nach Süden",
      "ein Bäcker flüstert von einer Dürre, die niemand sah",
      "Ludwig XVI. sammelt Schneeflocken, die nicht schmelzen sollten",
      "ein Geruch von verbranntem Getreide ohne Feuer",
      "ein Vogel singt ein Lied aus einer anderen Zeit",
      "auf dem Marktplatz liegt Asche, die nach Zukunft schmeckt"
    ],
    "props": [
      "eine Karte mit verschwundenen Küstenlinien",
      "einen Krug voll trüben Regenwassers",
      "eine Uhr aus geschmolzenem Zinn",
      "ein Tagebuch mit Wetteraufzeichnungen ohne Datum",
      "eine Kohleschale, die niemals erkaltet",
      "einen Handschuh aus Zarenpelz, der brennend heiß ist",
      "eine Flasche mit stickiger, schwerer Luft",
      "ein Fernrohr, das nur Nebel zeigt",
      "einen Faden aus verbranntem Kornfeld"
    ],
    "turns": [
      "plötzlich weiß niemand mehr, welches Jahr wirklich ist",
      "der Zar erkennt in der Asche das Gesicht des Königs",
      "die Ernte verfault, noch bevor sie geerntet wird",
      "aus der Kälte des Winterpalasts steigt plötzlich Hitze auf",
      "die Menge ruft nach Brot, doch der Himmel selbst scheint zu hungern",
      "ein Brief aus Sankt Petersburg spricht von einem Meer, das verschwindet",
      "Ludwig erkennt, dass die Revolution älter ist als die Zeit selbst",
      "das Eis unter Paris beginnt zu sprechen"
    ],
    "obstacles": [
      "die Straßen sind verstopft von Rauch und Menschenmengen",
      "der Fluss führt kein Wasser mehr, nur Staub",
      "niemand glaubt der Warnung des Zaren",
      "die Kälte des Winters bleibt aus, und das macht Angst",
      "die Kornkammern sind leer, obwohl die Saat aufging",
      "der Nebel verschluckt jeden Fluchtweg",
      "die Wachen misstrauen jedem Fremden aus dem Osten",
      "die Hitze lähmt selbst die Aufständischen"
    ],
    "stakes": [
      "Der Einsatz ist das letzte Grün eines sterbenden Gartens.",
      "Der Einsatz ist die Zukunft, die im Rauch verglüht.",
      "Der Einsatz ist ein Thron, der im schmelzenden Eis versinkt.",
      "Der Einsatz ist das Vertrauen zweier Reiche in eine gemeinsame Erde.",
      "Der Einsatz ist die letzte Ernte vor der großen Dürre.",
      "Der Einsatz ist die Wahrheit hinter der brennenden Kälte.",
      "Der Einsatz ist ein Bündnis gegen einen unsichtbaren Feind: die Erwärmung selbst.",
      "Der Einsatz ist die Erinnerung an einen Planeten, der einmal kühl war."
    ],
    "endings": [
      "So endet ein Zeitalter im Rauch der eigenen Zukunft.",
      "Und die Asche bedeckt Paris wie ein zweites Schweigen.",
      "So schließt sich der Kreis aus Feuer und Eis.",
      "Am Ende bleibt nur die Hitze, die keiner erklären kann.",
      "Die Revolution frisst sich selbst, während die Erde weiter glüht.",
      "So verschwindet ein Königreich im Nebel der Veränderung.",
      "Der Zar reist heim, doch das Eis folgt ihm nicht mehr.",
      "Am Horizont brennt kein Feuer mehr – nur die Erinnerung daran."
    ]
  },
  "ritterromane": {
    "motifs": [
      "ein Wappen ohne Farbe an kalten Fliesen",
      "eine Rüstung, die niemand mehr trägt",
      "das Echo eines Schwertes, das nie gezogen wurde",
      "ein Banner, das in der Zugluft flattert wie eine Standarte",
      "die Krone aus Neonlicht über den Gleisen",
      "ein Ritterhelm mit leeren Augenhöhlen",
      "das Klirren von Kettenhemden im Wind der Tunnel",
      "eine Tafelrunde aus verlassenen Bahnsteigbänken",
      "der Geruch von Eisen und altem Öl"
    ],
    "hooks": [
      "ein Schwertgriff lehnt an der Rolltreppe",
      "jemand hat ein Wappen in den Fahrplan geritzt",
      "ein Ritterhandschuh liegt auf dem gelben Streifen",
      "die Lautsprecherdurchsage klingt wie ein Herold",
      "auf dem Bahnsteig steht ein Name in gotischen Lettern",
      "ein Sporn rollt über die Gleise, ohne Besitzer",
      "die Uhr zeigt eine Zeit, die es im Kalender nicht gibt",
      "ein Siegelring liegt neben dem Fahrkartenautomat",
      "irgendwo singt jemand ein Lied von Rittern, die nie heimkehrten"
    ],
    "props": [
      "einen zerbrochenen Schwertgriff",
      "eine Rüstung aus Fliegerleder",
      "einen Siegelring mit unbekanntem Wappen",
      "eine Standarte aus Fallschirmseide",
      "einen Helm mit Rissen wie Kartenlinien",
      "eine Pergamentrolle voller Flugrouten",
      "einen Handschuh aus Kettenmaschen",
      "eine Kerze in einem alten Bahnsteig-Leuchter",
      "einen Dolch, der nach Kerosin riecht"
    ],
    "turns": [
      "Plötzlich trägt die Pilotin ein Wappen, das ihr nicht gehört.",
      "Der Bahnsteig verwandelt sich für einen Atemzug in einen Turnierplatz.",
      "Niemand hat gesehen, wie sie das Duell verlor, und doch weiß es die Station.",
      "Das Licht der Neonröhren wird zum Fackelschein einer alten Burg.",
      "Die Wette war nie ein Spiel, sondern ein Schwur.",
      "Aus dem Tunnel kommt der Hall von Hufen, wo keine Pferde sein können.",
      "Ihr Schatten trägt plötzlich einen Umhang, den sie nie besaß."
    ],
    "obstacles": [
      "Die Zugschranke fällt wie ein Fallgitter herab.",
      "Der Wachmann fragt nach einer Lizenz, die es nicht gibt.",
      "Das Wappen an der Wand lässt sich nicht entziffern.",
      "Die letzte Bahn fährt ab, bevor der Schwur eingelöst ist.",
      "Der Gegner der Wette ist längst verschwunden, aber die Schuld bleibt.",
      "Der Bahnsteig ist leer, doch die Tür zum Ausgang bleibt verriegelt wie ein Burgtor.",
      "Der Nebel im Tunnel verschluckt jeden Fluchtweg wie ein Burggraben."
    ],
    "stakes": [
      "Der Einsatz ist ihre Ehre als Rittersfrau der Lüfte.",
      "Der Einsatz ist ein Schwur, den niemand mehr einfordern kann.",
      "Der Einsatz ist das letzte Wappen ihrer verlorenen Familie.",
      "Der Einsatz ist die Lizenz, die sie nie besaß und nun nie bekommen wird.",
      "Der Einsatz ist Vertrauen: in eine Zeit, die keine Ritter mehr kennt.",
      "Der Einsatz ist ihr Name, geschrieben in einem Buch, das niemand liest.",
      "Der Einsatz ist die Krone eines Sieges, den keiner bezeugen wird."
    ],
    "endings": [
      "So verklingt das letzte Echo eines Turniers, das keiner sah.",
      "Die Bahn fährt weiter, und mit ihr die Legende, die niemand glaubt.",
      "So schließt sich das Visier für immer.",
      "Am Ende bleibt nur ein Wappen im Staub der Gleise.",
      "So endet die Wette, die nie jemand bezeugte.",
      "Die Nacht nimmt den Schwur mit sich in den Tunnel."
    ]
  },
  "liebesromane": {
    "motifs": [
      "ein Herz, das im Takt der Guillotine schlägt",
      "ein Liebesbrief, versiegelt mit Wachs und Blut",
      "zwei Schatten, die sich unter Kerzenlicht berühren",
      "ein Medaillon mit einem fremden Königsporträt",
      "eine Rose, die in der Nacht der Revolution welkt",
      "ein Blick über den Ballsaal, der alles verändert",
      "ein Flüstern von Liebe hinter Palastmauern",
      "ein Tanz, der nie zu Ende zu sein scheint"
    ],
    "hooks": [
      "ein Ring, der nicht an ihre Hand passt",
      "ein russischer Akzent im Pariser Salon",
      "ein Brief ohne Unterschrift, nur mit einem Kuss",
      "ein Duft von Zarenparfum in Versailles",
      "ein Herzschlag, der zu schnell für Etikette ist",
      "ein verbotenes Lächeln zwischen zwei Fronten",
      "eine Träne auf einem königlichen Siegel"
    ],
    "props": [
      "einen Liebesbrief mit fremdem Wappen",
      "ein Medaillon mit verborgenem Porträt",
      "eine Rose aus dem Garten von Versailles",
      "einen goldenen Ring ohne Inschrift",
      "ein Taschentuch mit fremden Initialen",
      "eine Locke Haar in einem Samtbeutel",
      "einen Fächer mit geheimer Botschaft",
      "eine Maske vom letzten Ball"
    ],
    "turns": [
      "Plötzlich erkennt sie im Zaren den Mann aus ihren Träumen.",
      "Der König spricht ihren Namen, als kenne er ihr Herz.",
      "Ein Kuss im Schatten der Bastille verändert alles.",
      "Sie begreift, dass Liebe gefährlicher ist als der Aufstand.",
      "Zwischen den Schüssen findet ihr Blick nur ihn."
    ],
    "obstacles": [
      "Die Revolution trennt die Liebenden für immer.",
      "Ein Ehering bindet sie an einen anderen Mann.",
      "Der Zar muss nach Russland zurückkehren, ehe der Morgen graut.",
      "Ludwig XVI. verlangt Treue, die ihr Herz nicht geben kann.",
      "Die Mauern des Palastes trennen zwei Herzen."
    ],
    "stakes": [
      "Der Einsatz ist Liebe: verboten und unsterblich zugleich.",
      "Der Einsatz ist ihr Herz, das dem falschen König gehört.",
      "Der Einsatz ist eine Zukunft zwischen zwei Kronen.",
      "Der Einsatz ist die Wahrheit über eine heimliche Liaison.",
      "Der Einsatz ist alles, was sie zu verlieren fürchtet: ihn."
    ],
    "endings": [
      "Und ihre Liebe überdauert selbst die Revolution.",
      "So bleibt ihr Herz für immer in Paris zurück.",
      "Am Ende zählt nur der Kuss, der die Zeit besiegte.",
      "Die Krone verblasst, doch ihre Liebe bleibt bestehen.",
      "So schließt sich der Kreis zweier Herzen für immer."
    ]
  },
  "bergwelt": {
    "motifs": [
      "ein Glockenturm, der ins Tal ruft und niemand kommt",
      "Schnee, der die Wunden nicht verschließt, nur verbirgt",
      "vernarbte Knöchel im Kerzenlicht",
      "ein Gipfelkreuz, das schief im Wind hängt",
      "der Atem des Fremden wie Nebel über dem Altar",
      "Lawinenstille vor dem nächsten Donner",
      "ein Rosenkranz aus geballten Fäusten",
      "die Pestglocke, die niemand mehr läutet"
    ],
    "hooks": [
      "der Fremde flüstert einen Namen, den es hier nicht geben sollte",
      "seine Handschuhe riechen nach fremdem Blut",
      "irgendwo im Gebälk knirscht etwas, das kein Wind ist",
      "die Bergluft trägt einen Geruch, der nicht zu Schnee passt",
      "der Gerettete lächelt, wo Schmerz sein müsste",
      "ein Beutel klirrt, wenn niemand ihn berührt",
      "die Fußspuren im Schnee führen nur in eine Richtung",
      "unter dem Talar liegt etwas, das sich bewegt"
    ],
    "props": [
      "einen zerschlagenen Rosenkranz",
      "eine vereiste Monstranz",
      "einen Lederbeutel voller Zähne",
      "eine zerrissene Pilgerkarte der Bergpässe",
      "ein Paar alte Boxbandagen",
      "eine erloschene Sturmlaterne",
      "ein Amulett mit fremdem Wappen",
      "einen Dolch unter dem Messgewand",
      "eine Handvoll gefrorener Hostien"
    ],
    "turns": [
      "plötzlich erkennt er im Gesicht des Fremden die Züge eines alten Gegners",
      "der Sturm draußen verstummt genau in dem Moment, als der Fremde die Augen öffnet",
      "er begreift, dass er nicht den Mann, sondern etwas anderes vom Berg heruntergetragen hat",
      "die Kirche, die ihm Zuflucht schien, sperrt plötzlich beide Türen",
      "im Fieber des Fremden hört er seinen eigenen Namen aus alten Kämpfen",
      "der Fremde dankt ihm mit Worten, die vor Jahrhunderten gesprochen wurden",
      "die Glocken beginnen von selbst zu läuten, als der Fremde aufsteht",
      "er erkennt die Pestbeulen zu spät, unter den Fingern, die ihn noch halten"
    ],
    "obstacles": [
      "der Schnee hat den einzigen Bergpfad verschluckt",
      "die Kirchentür lässt sich nicht mehr von innen öffnen",
      "seine alten Fäuste gehorchen ihm nicht mehr wie einst",
      "der Fremde wehrt sich gegen jede Hilfe, als fürchte er sie",
      "das Feuer im Altarraum will nicht brennen",
      "seine Kraft reicht nicht mehr für den Weg zurück ins Tal",
      "die Lawine hat die Kapelle vom Dorf abgeschnitten",
      "der Fremde spricht in einer Sprache, die niemand mehr versteht"
    ],
    "stakes": [
      "Der Einsatz ist Erlösung: die eigene, längst verwirkte.",
      "Der Einsatz ist das letzte bisschen Gnade in einer gottverlassenen Welt.",
      "Der Einsatz ist sein eigenes Leben, getauscht gegen das eines Unbekannten.",
      "Der Einsatz ist die Seele, die er zu retten glaubte zu verlieren.",
      "Der Einsatz ist Vertrauen: in einen Fremden, der der Tod selbst sein könnte.",
      "Der Einsatz ist die letzte Nacht, bevor die Seuche auch ihn holt.",
      "Der Einsatz ist die Erinnerung an einen Mann, der einst kämpfte, um zu leben.",
      "Der Einsatz ist die Stille einer Kirche, die keine Gebete mehr erhört."
    ],
    "endings": [
      "So bleibt die Kirche leer, und der Berg schweigt weiter.",
      "So trägt er die Reue wie eine neue Narbe unter der Haut.",
      "So endet die Rettung dort, wo der Glaube längst gestorben ist.",
      "So schließt sich der Kreis aus Schnee, Schuld und Schweigen.",
      "So bleibt nur die Frage, wen er wirklich gerettet hat.",
      "So löscht der Wind die letzte Kerze am Altar.",
      "So wird aus dem Retter ein Gezeichneter des Berges.",
      "So bleibt die Glocke stumm, als hätte sie nie geläutet."
    ]
  },
  "clown": {
    "motifs": [
      "ein Clown, der lautlos durch den Nebel der Seine schreitet",
      "weiße Schminke, die wie Mondlicht schimmert",
      "eine Maske, die immer lächelt, auch wenn niemand lacht",
      "Glockenspiel eines Narren im Wind der Takelage",
      "rot geschminkte Lippen über blutleeren Lippen",
      "ein Schellenhut, der im Sturm nicht klingelt",
      "Schatten, die tanzen, wo kein Licht sein sollte",
      "ein Kartenspiel, das immer denselben Narren zeigt"
    ],
    "hooks": [
      "Jürgens Handschuh riecht nach Schießpulver und Puderzucker",
      "irgendwo lacht jemand, wo niemand stehen sollte",
      "die Takelage knarrt im Takt eines unsichtbaren Trommlers",
      "ein Clownsschuh treibt einsam im Hafenwasser",
      "die Kerzen an Bord brennen mit grüner Flamme",
      "jemand hat Kreide-Zeichen an die Bordwand gemalt",
      "das Schiffsglöckchen klingt wie Jahrmarktsmusik",
      "ein Zettel mit einem gezeichneten Lächeln liegt am Steuer"
    ],
    "props": [
      "eine rissige Clownsmaske",
      "einen verrosteten Entertakel",
      "eine Trillerpfeife aus Messing",
      "ein zerfleddertes Tarotblatt mit einem Narren",
      "einen Beutel voller Konfetti aus Pergament",
      "eine Laterne mit rotem Glas",
      "einen Dolch mit Perlmuttgriff",
      "eine Spieluhr, die eine Jahrmarktsmelodie spielt",
      "ein Seil, geflochten mit bunten Bändern"
    ],
    "turns": [
      "plötzlich erkennt Jürgen das Gesicht unter der Maske als sein eigenes",
      "der Kapitän des gekaperten Schiffs trägt dieselbe Schminke wie der Narr aus Jürgens Träumen",
      "die Schiffsglocke schlägt dreizehn Mal, und die Nacht wird zum Tag",
      "im Frachtraum wartet kein Gold, sondern ein leeres Zirkuszelt",
      "als die Kanonen schweigen, beginnt irgendwo Jahrmarktsmusik zu spielen"
    ],
    "obstacles": [
      "die Planken sind mit Kreidekreuzen übersät, die niemand betreten darf",
      "der Ausguck starrt reglos ins Leere, als sei er zu Stein erstarrt",
      "ein Netz aus bunten Bändern versperrt den Niedergang",
      "die Mannschaft weigert sich, das Deck des fremden Schiffes zu betreten",
      "der Nebel verschluckt jeden Ruf nach Verstärkung",
      "das Enterseil ist mit Naht aus Narrenstoff geflickt"
    ],
    "stakes": [
      "Der Einsatz ist Jürgens Verstand: gefangen zwischen Revolution und Wahnsinn.",
      "Der Einsatz ist die Fracht der Seine: mehr Fluch als Schatz.",
      "Der Einsatz ist ein Name, den niemand mehr auszusprechen wagt.",
      "Der Einsatz ist die letzte Nacht vor dem Sturm auf die Bastille.",
      "Der Einsatz ist das Lächeln hinter der Maske: echt oder erzwungen?"
    ],
    "endings": [
      "Und irgendwo im Nebel von Paris lacht noch immer ein Narr.",
      "So endet die Fahrt, doch die Schminke bleibt auf seiner Haut.",
      "Der Vorhang der Nacht fällt über die Seine, für immer.",
      "Jürgen trägt seither die Maske, die ihn einst jagte.",
      "So schließt sich der Kreis aus Revolution und Rummelplatz."
    ]
  },
  "faust": {
    "motifs": [
      "ein Pakt, mit Blut besiegelt",
      "der Schatten des Mephisto über den Barrikaden",
      "eine Uhr in den Tuilerien, die rückwärts tickt",
      "zwei Seelen in Ludwigs Brust",
      "ein Buch, das niemand lesen darf",
      "das Flüstern verlorener Seelen in den Gassen",
      "ein Spiegel, der Zar Peters Gesicht verzerrt",
      "Rauch ohne Feuer über der Bastille"
    ],
    "hooks": [
      "ein Siegel, das nach Schwefel riecht",
      "eine Handschrift, die sich selbst verändert",
      "ein Fremder, der Ludwigs Stimme trägt",
      "ein Vertrag mit fehlendem Datum",
      "ein zweiter Schatten hinter dem König",
      "Zar Peters Brief ohne Absender",
      "ein Duft von verbranntem Papier im Thronsaal",
      "ein Lachen, das aus der Mauer kommt"
    ],
    "props": [
      "einen Pakt aus vergilbtem Pergament",
      "eine Phiole mit rotem Wachs",
      "einen Ring mit eingraviertem Pentagramm",
      "eine Maske aus Zaren-Gold",
      "ein Amulett mit Teufelskopf",
      "einen Schlüssel zu Ludwigs Kabinett",
      "eine Feder, die von selbst schreibt",
      "ein Medaillon mit Mephistos Zeichen",
      "einen verkohlten Brief"
    ],
    "turns": [
      "plötzlich unterschreibt der König, was er nie lesen wollte",
      "der Zar erkennt sein eigenes Gesicht im Feind",
      "die Menge ruft einen Namen, den niemand kennt",
      "der Pakt verlangt seinen Preis, genau um Mitternacht",
      "aus Freiheit wird ein Handel mit dem Teufel",
      "die Revolution folgt einem Plan, den keiner schrieb"
    ],
    "obstacles": [
      "der Palast ist von Misstrauen umstellt",
      "niemand darf den Pakt je erwähnen",
      "die Wachen gehorchen einer fremden Stimme",
      "der Zar verlangt ein Pfand, das keiner geben will",
      "das Volk verlangt einen Kopf, den die Mächte schützen",
      "die Zeit läuft schneller als jeder Plan"
    ],
    "stakes": [
      "Der Einsatz ist die Seele eines Königreichs.",
      "Der Einsatz ist Ludwigs letzte Wahrheit.",
      "Der Einsatz ist ein Pakt, der niemals bricht.",
      "Der Einsatz ist die Freiheit, erkauft mit Schatten.",
      "Der Einsatz ist Zar Peters verlorene Krone.",
      "Der Einsatz ist das Gleichgewicht zweier Welten."
    ],
    "endings": [
      "So schließt sich der Pakt, unwiderruflich.",
      "Die Guillotine schweigt, doch der Teufel lächelt.",
      "Paris erinnert sich nur an das Feuer, nicht an den Preis.",
      "Der Vertrag ist erfüllt, die Seele bezahlt.",
      "So endet ein König, so beginnt eine Legende.",
      "Im Schatten von Notre-Dame verstummt die letzte Frage."
    ]
  },
  "lebenreicher": {
    "motifs": [
      "ein Zar, der Reichtum in fremden Gassen sucht",
      "zwei Kronen, die sich im Dunkeln begegnen",
      "eine Münze, die niemals ihren Glanz verliert",
      "ein Herz, das mehr zählt als Gold",
      "ein Thron, der leiser wird als das Volk",
      "ein Ring, der Erinnerung statt Macht bedeutet",
      "ein Brief, der wahren Reichtum beschreibt",
      "eine Kerze, die Freundschaft erhellt",
      "ein Spiegel, der die Seele reicher zeigt"
    ],
    "hooks": [
      "ein Fremder spricht russisch in der Dunkelheit",
      "ein vergessenes Geschenk liegt auf der Fensterbank",
      "eine Notiz nennt keinen Namen, nur ein Versprechen",
      "zwei Schatten reichen sich die Hand",
      "ein Duft nach Zimt, wo Blut sein sollte",
      "ein Lächeln, das nicht zum Elend passt",
      "ein Lied klingt vertraut, obwohl es niemand kennt",
      "ein Kind schenkt einem König sein letztes Brot"
    ],
    "props": [
      "einen goldenen Siegelring",
      "eine Schatulle voller Briefe",
      "einen Kelch aus Zarenhand",
      "eine zerlesene Schrift über das Glück",
      "einen einfachen Holzlöffel",
      "ein Medaillon mit zwei Gesichtern",
      "eine Kerze aus geschmolzenem Wachs",
      "einen Beutel mit unbekannten Samen",
      "eine Uhr ohne Zeiger"
    ],
    "turns": [
      "plötzlich zählt nicht mehr die Krone, sondern die Geste",
      "der Zar erkennt, dass sein Reichtum nie aus Gold bestand",
      "Ludwig verschenkt, was er zuvor bewachte",
      "die Menge verstummt vor einem Akt der Güte",
      "aus Feinden werden für einen Moment Freunde",
      "der wahre Schatz liegt in einem geteilten Brot",
      "niemand weiß mehr, wer hier wirklich herrscht"
    ],
    "obstacles": [
      "die Wachen misstrauen jedem freundlichen Wort",
      "der Palast verschließt sich vor echten Gefühlen",
      "Gerüchte vergiften das Vertrauen zwischen den Ständen",
      "der Zar wird als Spion verdächtigt",
      "die Straßen sind zu gefährlich für offene Worte",
      "niemand glaubt an uneigennützige Gaben",
      "die Zeit drängt, doch die Wahrheit wartet"
    ],
    "stakes": [
      "Der Einsatz ist Menschlichkeit: in einer Zeit des Hasses.",
      "Der Einsatz ist Freundschaft: über Grenzen hinweg.",
      "Der Einsatz ist Würde: wenn alles andere fällt.",
      "Der Einsatz ist Vertrauen: zwischen Fremden und Königen.",
      "Der Einsatz ist Erinnerung: an das, was wirklich zählt.",
      "Der Einsatz ist Mitgefühl: in einer kalten Revolution.",
      "Der Einsatz ist Hoffnung: für ein reicheres Morgen."
    ],
    "endings": [
      "So wird aus Gold nur Staub, aus Güte aber Ewigkeit.",
      "Der Palast fällt, doch die Geste bleibt bestehen.",
      "So endet die Nacht, reicher an Menschlichkeit.",
      "Zwei Kronen vergehen, ein Herz bleibt bestehen.",
      "So schließt sich der Kreis aus Macht und Mitgefühl.",
      "Am Ende zählt nur, was man verschenkt hat.",
      "So bleibt von Königen nur, was sie gaben."
    ]
  },
  "tanz": {
    "motifs": [
      "ein Tanz im Kreis der Schafe, der niemals endet",
      "zwei Schatten, die sich drehen, ohne Musik",
      "der Wind tanzt durch das Gras wie eine unsichtbare Hand",
      "ein altes Lied, das nur die Schafe zu hören scheinen",
      "Baucis' und Philemons Schritte im gleichen geheimen Takt",
      "ein Reigen, der sich im Nebel der Weide verliert",
      "die Wolle der Schafe wirbelt wie Schnee im Mondlicht",
      "ein Lächeln, das älter ist als der Tanz selbst"
    ],
    "hooks": [
      "die Schafe bleiben stehen, sobald der Tanz beginnt",
      "ein Glöckchen läutet, ohne dass jemand es berührt",
      "Philemons Schatten tanzt einen Takt zu spät",
      "Baucis summt eine Melodie, die niemand ihr beibrachte",
      "der Kreis im Gras ist genau so groß wie ihr Tanz",
      "ein Schaf folgt ihrem Tanz mit geneigtem Kopf",
      "ihre Fußspuren verschwinden, kaum sind sie gesetzt",
      "der Wind hält kurz den Atem an"
    ],
    "props": [
      "einen alten Hirtenstab",
      "ein verwittertes Glöckchen",
      "einen Kranz aus Wiesenblumen",
      "ein Tuch, das nach Zeit riecht",
      "eine Flöte ohne Löcher",
      "einen Ring aus geflochtenem Gras",
      "eine Laterne ohne Flamme",
      "ein Schaffell, warm wie eine Erinnerung"
    ],
    "turns": [
      "plötzlich tanzen sie, als hätten sie es niemals verlernt",
      "auf einmal lächeln beide zur gleichen Sekunde",
      "die Weide scheint sich mit ihnen zu drehen",
      "mit dem ersten Schritt wird die Zeit ganz still",
      "ihr Tanz zieht die Schafe in einen stillen Kreis",
      "als der Mond aufgeht, beginnt der Tanz von selbst"
    ],
    "obstacles": [
      "die Weide liegt plötzlich im Nebel verborgen",
      "ihre Füße scheinen den Boden nicht mehr zu berühren",
      "der Tanz will nicht enden, obwohl die Kräfte schwinden",
      "die Schafe weichen zurück, als spürten sie etwas Fremdes",
      "kein Lied begleitet ihre Schritte, und doch tanzen sie weiter"
    ],
    "stakes": [
      "Der Einsatz ist Erinnerung: an einen Tanz, der sie beide jung hielt.",
      "Der Einsatz ist Vertrauen: dass der Tanz sie nicht verlässt.",
      "Der Einsatz ist die Zeit selbst, die mit jedem Schritt verrinnt.",
      "Der Einsatz ist die Liebe, die sich im Kreis bewahrt.",
      "Der Einsatz ist das Lächeln, das den Tanz überlebt."
    ],
    "endings": [
      "So tanzen sie weiter, wenn niemand mehr hinsieht.",
      "Und die Schafe erinnern sich an den Tanz, wenn der Mond wiederkehrt.",
      "So schließt sich der Kreis, Schritt für Schritt.",
      "Am Ende bleibt nur ihr Lächeln über der stillen Weide.",
      "Und der Tanz wird zur Legende, die der Wind weiterträgt."
    ]
  },
  "griechischetragoedie": {
    "motifs": [
      "ein Chor, der aus dem Nichts flüstert",
      "zwei Schatten, die eins werden",
      "das Lächeln, das die Götter tragen",
      "ein Schafsfell, weiß wie ein Leichentuch",
      "der Wind, der alte Namen trägt",
      "eine Fessel, die niemand sieht",
      "das Auge des Zeus in der Wolke",
      "ein Baum, der zwei Stämme teilt"
    ],
    "hooks": [
      "die Schafe schweigen alle zugleich",
      "ein Duft nach Weihrauch ohne Altar",
      "ihre Hände berühren sich, ohne sich zu bewegen",
      "ein Schatten, der keinem Körper gehört",
      "das Gras neigt sich ohne Wind",
      "zwei Becher, die nie leer werden",
      "ein Lachen, das aus der Erde kommt",
      "die Sonne steht still über der Weide"
    ],
    "props": [
      "einen hölzernen Hirtenstab",
      "eine Schale aus Ton",
      "einen Kranz aus Efeu",
      "ein Lammfell",
      "einen Krug voll Milch",
      "eine bronzene Fibel",
      "einen Ölzweig",
      "eine Opferschale",
      "ein verwittertes Amulett"
    ],
    "turns": [
      "plötzlich erkennen sie die Fremden als Götter",
      "ihr Lächeln verrät ein Wissen, das nicht von dieser Welt ist",
      "das Dorf versinkt, während ihre Hütte zum Tempel wird",
      "die Schafe knien nieder, als wüssten sie es längst",
      "aus Gastfreundschaft wird ein Schicksal",
      "ihre Jugend weicht, doch ihr Lächeln bleibt dasselbe"
    ],
    "obstacles": [
      "die Götter verlangen ein Opfer, das sie nicht geben wollen",
      "das Dorf verweigert den Fremden die Tür",
      "die Zeit will sie trennen, doch sie halten sich fest",
      "der Nebel verschluckt den Weg zurück",
      "kein Sterblicher darf die Wahrheit tragen"
    ],
    "stakes": [
      "Der Einsatz ist ihre Liebe: geprüft von den Göttern selbst.",
      "Der Einsatz ist die Gastfreundschaft: das letzte Gesetz der Menschen.",
      "Der Einsatz ist ihr gemeinsamer Tod: als Baum vereint.",
      "Der Einsatz ist das Schicksal: unabwendbar wie ein Orakel.",
      "Der Einsatz ist die Erinnerung: an das, was Menschlichkeit bedeutet."
    ],
    "endings": [
      "So verwandeln sich zwei Herzen in einen Baum.",
      "So bleibt ihr Lächeln in der Rinde erhalten.",
      "So endet die Weide, wo ein Tempel begann.",
      "So schließt sich der Kreis der Götter und Menschen.",
      "So spricht der Chor: Liebe überdauert das Fleisch."
    ]
  },
  "glueck": {
    "motifs": [
      "ein Glück, das älter ist als ihr Lächeln",
      "zwei Schatten, die sich nie trennen",
      "das Blöken der Schafe im Nebel der Zeit",
      "ein Licht, das aus den Wolken bricht, ohne Grund",
      "Hände, die sich halten, seit Ewigkeiten",
      "ein Kreis aus Schafen, der sich niemals schließt",
      "ein Glücksfaden, unsichtbar gesponnen",
      "zwei Herzen, die im gleichen Takt schlagen"
    ],
    "hooks": [
      "ein Lamm, das nicht altert",
      "ein Duft nach Honig ohne Bienenstock",
      "ein Windhauch, der nach Namen flüstert",
      "zwei Becher, die sich von selbst füllen",
      "ein Schaf, das mit menschlicher Stimme meckert",
      "ein Stein, der warm bleibt trotz der Kälte",
      "ein Weg, der sich hinter ihnen auflöst",
      "eine Feder, die vom Himmel fällt, ohne Vogel"
    ],
    "props": [
      "einen alten Hirtenstab",
      "eine Schale voll Milch, die nie leer wird",
      "einen goldenen Faden",
      "eine Kanne, die sich selbst nachfüllt",
      "einen Ring aus Schilf",
      "eine Decke aus Schafwolle",
      "einen Krug voll Wein für Fremde",
      "eine kleine hölzerne Flöte"
    ],
    "turns": [
      "plötzlich wissen sie, dass die Fremden keine Fremden sind",
      "auf einmal lächeln beide, ohne ein Wort zu sagen",
      "die Schafe verstummen alle zur gleichen Zeit",
      "ihr Glück scheint größer als die Weide selbst",
      "der Himmel färbt sich golden, ohne dass die Sonne sinkt",
      "ihre Hände finden sich, wie es immer schon war"
    ],
    "obstacles": [
      "die Fremden werden von allen anderen abgewiesen",
      "der Weg zur Hütte scheint sich zu verlängern",
      "das Wetter schlägt unerwartet um",
      "die Vorräte reichen kaum für zwei",
      "die Nacht bricht früher herein, als sie sollte",
      "ihre Nachbarn misstrauen jedem Besucher"
    ],
    "stakes": [
      "Der Einsatz ist Glück: geteilt, nicht gehortet.",
      "Der Einsatz ist Gastfreundschaft, die alles verändert.",
      "Der Einsatz ist die stille Freude zweier alter Herzen.",
      "Der Einsatz ist ein Segen, den niemand kommen sah.",
      "Der Einsatz ist Vertrauen in das Unbekannte."
    ],
    "endings": [
      "So bleibt ihr Lächeln, wenn alles andere vergeht.",
      "Und das Glück wächst leise weiter, wie Gras auf der Weide.",
      "So schließt sich der Kreis aus Milde und Licht.",
      "Ihr stilles Glück wird zur Legende der Weide.",
      "So wurde aus Armut ein Wunder, das lächelt."
    ]
  },
  "gruendungsmythos": {
    "motifs": [
      "ein Hirtenstab, der Wurzeln schlägt",
      "zwei Schatten, die zu einem verschmelzen",
      "ein Nebel, der die Weide wie eine Wiege umschließt",
      "Schafe, die im Kreis stehen und schweigen",
      "ein Licht ohne Quelle über den Hügeln",
      "uralte Steine, die nach Namen flüstern",
      "ein Baum, der aus zwei Wurzeln wächst",
      "der Himmel, der sich über der Weide neigt"
    ],
    "hooks": [
      "ein Lämmchen, das rückwärts geht",
      "ein Windhauch, der Namen ruft, die niemand kennt",
      "zwei Becher, die sich nie leeren",
      "eine Spur im Gras, die zu keinem Ursprung führt",
      "ein Vogel, der über derselben Stelle kreist",
      "ein Klang wie ein zweiter Herzschlag im Boden",
      "ein Schatten, der länger bleibt als die Sonne erlaubt",
      "Gras, das sich weigert zu welken"
    ],
    "props": [
      "einen alten Hirtenstab",
      "einen irdenen Krug",
      "eine Handvoll Getreidekörner",
      "ein geflochtenes Schafsfell",
      "einen Ring aus verwittertem Holz",
      "eine Schale mit Milch und Honig",
      "einen Stein mit eingeritzten Zeichen",
      "eine kleine Opferschale"
    ],
    "turns": [
      "plötzlich lächeln beide, als wüssten sie, was noch niemand weiß",
      "auf einmal ist die Weide älter als jede Erinnerung",
      "dann verändert sich das Licht, als beginne die Welt von vorn",
      "in diesem Moment wird aus zwei Hirten ein Ursprung",
      "unvermittelt spricht das Gras mit zwei Stimmen zugleich",
      "dann erkennt man: sie waren schon immer hier"
    ],
    "obstacles": [
      "die Fremden erkennen die Weide nicht wieder",
      "kein Weg führt zurück ins Dorf",
      "die Götter verlangen ein Zeichen, das niemand deuten kann",
      "der Nebel lässt die Grenzen der Weide verschwimmen",
      "die Zeit weigert sich, weiterzugehen",
      "die Schafe folgen keinem Ruf mehr"
    ],
    "stakes": [
      "Der Einsatz ist die Erinnerung eines ganzen Volkes.",
      "Der Einsatz ist der Ursprung aller kommenden Geschichten.",
      "Der Einsatz ist die Gunst der Götter.",
      "Der Einsatz ist das Bestehen der Weide selbst.",
      "Der Einsatz ist die Treue zweier Herzen über die Zeit hinaus.",
      "Der Einsatz ist die Wahrheit hinter jedem Mythos."
    ],
    "endings": [
      "So beginnt die Legende, die man sich noch heute erzählt.",
      "So wird aus einem Lächeln ein Ursprung.",
      "So verwandelt sich die Weide in heiligen Boden.",
      "So schließt sich der Kreis der ersten Geschichte.",
      "So bleibt ihr Lächeln in jedem Stein der Weide.",
      "So wurde aus zwei Hirten ein Anfang."
    ]
  },
  "staatsphilosophie": {
    "motifs": [
      "ein Gesetzbuch, das niemand je geschrieben hat",
      "ein Zepter aus verwittertem Hirtenstab",
      "eine Grenze, die durch die Weide läuft, unsichtbar",
      "der Schatten eines Throns über den Schafen",
      "ein Siegelring, verloren im Gras",
      "ein Vertrag, in Wolle eingewebt",
      "die Stille eines Gesetzes vor seiner Verkündung",
      "ein Herrscherblick in den Augen der Schafe",
      "die Wiederkehr eines alten Eids"
    ],
    "hooks": [
      "ein Schaf trägt ein Amulett mit einem Wappen",
      "Philemon murmelt Worte wie aus einem Gesetzestext",
      "Baucis zeichnet Linien in den Staub, wie Grenzen",
      "ein Fremder fragt nach dem 'Herrn dieses Landes'",
      "der Wind trägt eine Stimme, die von Pflicht spricht",
      "zwischen den Hufspuren liegt ein Siegel aus Ton",
      "die Schafe folgen einer Ordnung, die niemand befahl",
      "ein Stein in der Erde trägt eingeritzte Paragraphen"
    ],
    "props": [
      "einen zerbrochenen Herrscherstab",
      "eine Tontafel mit unleserlichen Gesetzen",
      "ein Wollknäuel, verknotet wie ein Staatsvertrag",
      "einen alten Siegelring",
      "eine Hirtenflöte mit eingeritzten Symbolen",
      "ein vergilbtes Pergament ohne Unterschrift",
      "einen Wanderstab mit eingeschnitzter Krone",
      "ein verrostetes Schloss ohne Schlüssel",
      "eine Münze mit unbekanntem Antlitz"
    ],
    "turns": [
      "plötzlich erkennt Baucis im Blöken der Schafe eine Ordnung, die einem Gesetz gleicht",
      "Philemon lächelt, als verstünde er die stumme Verfassung der Weide",
      "auf einmal scheint die ganze Herde einem unsichtbaren Herrscher zu gehorchen",
      "ohne Vorwarnung spricht der Wind wie ein Urteil",
      "es scheint, als hätte die Weide seit jeher eigene Gesetze"
    ],
    "obstacles": [
      "die Grenze der Weide lässt sich nicht mit Worten erklären",
      "niemand erinnert sich, wer die ersten Regeln aufstellte",
      "die Schafe gehorchen keinem Ruf mehr",
      "der alte Vertrag ist im Boden versunken",
      "ein Nebel verwischt jede sichtbare Ordnung"
    ],
    "stakes": [
      "Der Einsatz ist Gerechtigkeit: für ein Land ohne Namen.",
      "Der Einsatz ist Ordnung: bewahrt von zwei alten Hirten.",
      "Der Einsatz ist Macht: verborgen im Lächeln der Weise.",
      "Der Einsatz ist Frieden: erkauft mit Schweigen.",
      "Der Einsatz ist Herrschaft: über etwas, das niemand sieht."
    ],
    "endings": [
      "So bleibt die Ordnung ungeschrieben, aber lebendig.",
      "Und die Schafe folgten weiterhin einem Gesetz ohne Namen.",
      "So verschwimmt Herrschaft mit Hirtentum.",
      "Am Ende lächelten beide, als wüssten sie, wer wirklich regiert.",
      "So schließt sich der Kreis von Macht und Stille."
    ]
  },
  "traumbilder": {
    "motifs": [
      "ein Schaf, das mit Menschenaugen blickt",
      "Nebel, der Gesichter formt und wieder löst",
      "eine Weide, die im Schlaf zu atmen scheint",
      "zwei Schatten, die sich lächelnd berühren",
      "ein Traumbild von Göttern in Bettlergestalt",
      "Wolken, die wie erinnerte Gesichter ziehen",
      "ein Licht zwischen den Bäumen, das niemand entzündet hat",
      "die Weide, die sich in einen See aus Schlaf verwandelt"
    ],
    "hooks": [
      "ein Lächeln, das älter wirkt als ihr Gesicht",
      "Schafe, die alle in dieselbe Richtung schauen",
      "ein Windhauch, der nach fremden Worten riecht",
      "Philemons Hand, die zittert, ohne zu frieren",
      "ein Schatten, der Baucis folgt, aber nicht ihr gehört",
      "ein Klang wie ferne Schritte über Wolken",
      "der Geruch von Brot, wo kein Ofen brennt",
      "zwei Fremde, die schon immer da gewesen sein könnten"
    ],
    "props": [
      "einen Krug, der niemals leer wird",
      "einen alten Hirtenstab",
      "eine Decke aus grauer Wolle",
      "einen Becher voller Traumwasser",
      "eine Kette aus getrockneten Blumen",
      "einen Ring aus Weidenzweigen",
      "eine Schale mit stillem Wasser",
      "einen Spiegel aus poliertem Zinn",
      "eine Feder, die im Wind nicht fällt"
    ],
    "turns": [
      "Plötzlich wissen Baucis und Philemon, dass sie träumen und doch nicht erwachen wollen.",
      "Die Schafe verstummen, als die Fremden zu lächeln beginnen.",
      "Ein Windstoß trägt eine Stimme, die niemand ausgesprochen hat.",
      "Die Weide beginnt sich zu drehen, als läge sie in einem Traum.",
      "Baucis erkennt in den Augen der Fremden ihr eigenes Spiegelbild.",
      "Der Himmel färbt sich golden, obwohl es Nacht sein sollte."
    ],
    "obstacles": [
      "Die Fremden sprechen eine Sprache, die nur im Traum verständlich ist.",
      "Der Weg zur Hütte verschwindet zwischen den Nebelschwaden.",
      "Die Schafe weigern sich, die Weide zu verlassen.",
      "Ein unsichtbares Gewicht hält Philemons Schritte zurück.",
      "Die Zeit scheint sich zu verdoppeln, ohne Fortschritt zu machen.",
      "Baucis' Stimme verhallt, bevor sie ihr Ende erreicht."
    ],
    "stakes": [
      "Der Einsatz ist Gastfreundschaft: die letzte, die bleibt.",
      "Der Einsatz ist der Glaube an das Unsichtbare.",
      "Der Einsatz ist die Erinnerung an ein gemeinsames Leben.",
      "Der Einsatz ist die Grenze zwischen Traum und Erwachen.",
      "Der Einsatz ist das Vertrauen zweier Alter, die nichts mehr zu verlieren scheinen.",
      "Der Einsatz ist die Gnade der Götter, verkleidet als Fremde."
    ],
    "endings": [
      "So verschwimmt der Traum mit der Weide, für immer.",
      "So bleibt nur ein Lächeln, das die Zeit überdauert.",
      "So schließt sich der Kreis zwischen Himmel und Erde.",
      "So wird aus zwei Herzen ein einziger Baum.",
      "So endet der Traum, doch das Lächeln bleibt wach.",
      "So verklingt die Weide im ersten Licht des Erwachens."
    ]
  },
  "mystery": {
    "motifs": [
      "eine Uhr, die rückwärts tickt",
      "eine Tür, die von innen atmet",
      "ein Spiegelbild, das zu spät reagiert",
      "ein Formular mit einem Feld zu viel",
      "ein Kabel, das warm wird, ohne Strom",
      "eine Narbe, die sich erinnert",
      "ein Name, der nicht ausgesprochen werden kann",
      "ein Licht, das die falschen Dinge zeigt",
      "ein Geräusch, das nur in Gedanken existiert",
      "eine Karte, die Orte erfindet"
    ],
    "hooks": [
      "eine rote Feder im falschen Winkel",
      "ein Lichtstreifen, der aus dem Nichts kommt",
      "ein leises Klopfen hinter der Wand",
      "ein Foto, das ein Detail mehr zeigt als gestern",
      "ein Schatten, der nicht zur Figur passt",
      "eine Nachricht ohne Absender",
      "eine Tür, die plötzlich nicht mehr Tür sein will"
    ],
    "props": [
      "einen Schlüssel",
      "eine Karte",
      "eine Münze",
      "ein Foto",
      "ein Notizbuch",
      "eine Lampe",
      "ein Stück Kreide",
      "einen Kompass",
      "einen Ausweis",
      "ein Siegel"
    ],
    "turns": [
      "plötzlich passt die Zeit nicht mehr zu den Uhren",
      "die Spur führt nicht nach außen, sondern nach innen",
      "das Offensichtliche wird unbenennbar",
      "etwas antwortet – ohne Stimme",
      "die Logik bleibt bestehen, aber in falscher Reihenfolge"
    ],
    "obstacles": [
      "die Tür ist verschlossen",
      "jemand hört mit",
      "die eigene Wahrnehmung wackelt",
      "eine Regel gilt, die niemand erklärt",
      "die Akte trägt das falsche Datum"
    ],
    "stakes": [
      "Der Einsatz ist Mut.",
      "Der Einsatz ist Zeit: Ein Teil des Abends kommt nicht zurück.",
      "Der Einsatz ist Wahrheit: Etwas am Selbstbild verschiebt sich.",
      "Der Einsatz ist Vertrauen: in sich selbst."
    ],
    "endings": [
      "Damit ist es entschieden.",
      "So schließt sich der Kreis.",
      "Und vielleicht beginnt es erst hier.",
      "Und die Tür fiel ins Schloss.",
      "Und es war, als hätte der Ort kurz geblinzelt."
    ]
  },
  "bureau": {
    "motifs": [
      "ein Formular mit einem Feld zu viel",
      "eine Wartemarke, die sich warm anfühlt",
      "ein Stempel, der auf der Haut bleibt",
      "ein Aktenzeichen, das deinen Namen enthält",
      "eine Frist, die rückwärts läuft",
      "ein Register, das heimlich atmet",
      "eine Kopie, die das Original ersetzt",
      "ein Bescheid mit zu vielen Unterschriften",
      "ein Flur ohne Ende, der dich prüft",
      "ein Antrag, der dich beantragt"
    ],
    "hooks": [
      "eine Durchsage, die nur dich meint",
      "ein falsches Datum auf der Akte",
      "ein Schalter ohne Personal",
      "ein Stempelgeräusch hinter der Wand",
      "ein Formular, das schon ausgefüllt ist",
      "ein Ticket, dessen Nummer fehlt",
      "eine Unterschrift, die du nie gesetzt hast"
    ],
    "props": [
      "einen Ausweis",
      "einen Stempel",
      "eine Kopie",
      "ein Siegel",
      "eine Wartemarke",
      "eine Mappe",
      "einen Schlüssel",
      "ein Register",
      "ein Formular",
      "eine Akte"
    ],
    "turns": [
      "plötzlich gilt eine Regel rückwirkend",
      "die Spur führt in ein Archiv, das dich kennt",
      "die Sachbearbeitung spricht in Imperativen",
      "ein Feld ist leer – und trotzdem ausgefüllt",
      "die Logik bleibt korrekt, aber in falscher Reihenfolge",
      "du erhältst eine Bestätigung für etwas, das du nicht getan hast"
    ],
    "obstacles": [
      "die Tür ist verschlossen",
      "jemand hört mit",
      "die Akte trägt das falsche Datum",
      "dein Antrag braucht einen Schatten",
      "das Fenster schließt in drei Minuten"
    ],
    "stakes": [
      "Der Einsatz ist Zeit: Die Frist ist real.",
      "Der Einsatz ist Würde: Du bist eine Nummer.",
      "Der Einsatz ist Wahrheit: Das Formular lügt nicht.",
      "Der Einsatz ist Kontrolle: Du hast sie nicht."
    ],
    "endings": [
      "Und niemand unterschrieb.",
      "So schließt sich der Kreis.",
      "Und es begann erst dort.",
      "Und die Tür fiel ins Schloss.",
      "Und der Bescheid blieb ohne Antwort."
    ]
  },
  "tech": {
    "motifs": [
      "ein Signal, das zu früh ankommt",
      "ein Kabel, das warm wird ohne Strom",
      "ein Cache, der Erinnerungen speichert",
      "ein Sensor, der deine Gedanken misst",
      "ein Protokoll mit einer fehlenden Zeile",
      "ein Schlüsselbund aus fremden Ports",
      "ein Rauschen, das Namen formt",
      "ein Update, das dich neu schreibt",
      "ein Bildschirm, der einen anderen Raum zeigt",
      "eine Schnittstelle, die zurückstarrt"
    ],
    "hooks": [
      "ein Ping ohne Absender",
      "ein Gerät antwortet, bevor du fragst",
      "ein Logfile mit deinem nächsten Satz",
      "ein Lichtstreifen im Glas",
      "ein Port ist offen, obwohl alles offline ist",
      "ein Fehlercode, der wie ein Omen klingt",
      "eine Benachrichtigung aus der Zukunft"
    ],
    "props": [
      "ein Kabel",
      "einen Sensor",
      "einen Schlüssel",
      "ein Protokoll",
      "eine Lampe",
      "eine Karte",
      "ein Terminal",
      "einen Ausweis",
      "eine Münze",
      "ein Notizbuch"
    ],
    "turns": [
      "das System lernt deinen Namen zu schnell",
      "die Uhrzeit ist nur ein Platzhalter",
      "die Realität rendert in Schichten",
      "du findest den Bug, aber er findet dich zuerst",
      "ein Backup überschreibt die Gegenwart",
      "das Rauschen enthält eine Anweisung"
    ],
    "obstacles": [
      "das Signal bricht ab",
      "die Schnittstelle verlangt eine Geste",
      "deine Wahrnehmung wackelt",
      "ein Protokoll widerspricht sich",
      "die Verbindung ist da – aber ohne Netzwerk"
    ],
    "stakes": [
      "Der Einsatz ist Wahrheit: Welche Version gilt.",
      "Der Einsatz ist Zeit: Ein Timestamp kippt alles.",
      "Der Einsatz ist Nähe: zwischen dir und dem System.",
      "Der Einsatz ist Kontrolle: über das, was du für real hältst."
    ],
    "endings": [
      "Und das System schwieg – mit Absicht.",
      "Und der Bildschirm blinkte einmal zu viel.",
      "Und die Datei wirkte nach.",
      "Und vielleicht beginnt es erst hier.",
      "Und alles blieb korrekt."
    ]
  },
  "myth": {
    "motifs": [
      "ein Name, der ein Schlüssel ist",
      "ein Omen, das dreimal erscheint",
      "ein Faden, der nicht reißt",
      "eine Maske, die dich auswählt",
      "ein Schrein im Alltag",
      "ein Fluss, der zuhört",
      "ein Segen mit Widerhaken",
      "ein Bote in ziviler Kleidung",
      "ein Orakel aus Papier",
      "ein Zeichen aus Ruß auf Gold"
    ],
    "hooks": [
      "eine Feder im falschen Winkel",
      "ein Flüstern im Wasser",
      "ein Schatten, der Opfer verlangt",
      "ein Brot, das nach Asche schmeckt",
      "eine Münze, die zurückkehrt",
      "eine Tür, die den Namen sagt",
      "eine Krähe, die dich erkennt"
    ],
    "props": [
      "eine Münze",
      "einen Kompass",
      "ein Siegel",
      "ein Foto",
      "eine Karte",
      "ein Notizbuch",
      "eine Lampe",
      "ein Stück Kreide",
      "einen Schlüssel",
      "einen Faden"
    ],
    "turns": [
      "der Ort verlangt eine Gabe",
      "das Zeichen kommt dreimal",
      "ein Versprechen bindet die Richtung",
      "die Spur führt nach innen, nicht nach außen",
      "ein Gott trägt deinen Mantel",
      "der Alltag wird zum Ritual"
    ],
    "obstacles": [
      "die Tür ist verschlossen",
      "eine Regel gilt, die niemand erklärt",
      "jemand hört mit",
      "der Name darf nicht ausgesprochen werden",
      "du musst etwas geben, bevor du nimmst"
    ],
    "stakes": [
      "Der Einsatz ist Mut.",
      "Der Einsatz ist Wahrheit: ein Bild kippt.",
      "Der Einsatz ist Bindung: an Ort und Zeichen.",
      "Der Einsatz ist Erinnerung: was du nicht verlieren wolltest."
    ],
    "endings": [
      "So schließt sich der Kreis.",
      "Und der Ort blinzelte.",
      "Und es begann erst dort.",
      "Und die Maske blieb zurück.",
      "Und die Tür fiel ins Schloss."
    ]
  },
  "body": {
    "motifs": [
      "eine Narbe, die sich erinnert",
      "ein Atem, der zu spät kommt",
      "ein Puls, der Antworten klopft",
      "eine Kehle voller Wahrheit",
      "eine Hand, die nicht loslässt",
      "ein Augenlid wie ein Vorhang",
      "ein Zittern als Nachricht",
      "eine Wärme ohne Ursache",
      "eine Kälte im Knochen",
      "ein Salzgeschmack auf der Zunge"
    ],
    "hooks": [
      "ein Druck unter der Haut",
      "ein Geräusch im Brustbein",
      "ein Blick von innen",
      "ein Kribbeln als Warnung",
      "ein Schmerz, der Richtung hat",
      "ein Geschmack, der lügt",
      "eine Stille, die im Körper sitzt"
    ],
    "props": [
      "eine Lampe",
      "ein Foto",
      "ein Notizbuch",
      "ein Stück Kreide",
      "eine Münze",
      "einen Schlüssel",
      "eine Karte",
      "einen Kompass",
      "einen Ausweis",
      "ein Siegel"
    ],
    "turns": [
      "der Körper weiß es zuerst",
      "die Wahrheit sitzt im Hals",
      "der Schmerz ist ein Hinweis, kein Fehler",
      "die Nähe kippt in Kontrolle",
      "das Offensichtliche wird unbenennbar",
      "etwas antwortet – ohne Stimme"
    ],
    "obstacles": [
      "die eigene Wahrnehmung wackelt",
      "jemand hört mit",
      "die Luft wird zu dicht",
      "dein Atem passt nicht in den Raum",
      "du erkennst dich zu spät"
    ],
    "stakes": [
      "Der Einsatz ist Nähe.",
      "Der Einsatz ist Würde.",
      "Der Einsatz ist Wahrheit: im Körper gespeichert.",
      "Der Einsatz ist Kontrolle: über Zittern und Stimme."
    ],
    "endings": [
      "Und es war, als hätte der Ort geblinzelt.",
      "Und vielleicht beginnt es erst hier.",
      "Damit ist es entschieden.",
      "Und die Luft wurde dünn.",
      "Und du wusstest es schon vorher."
    ]
  },
  "absurd": {
    "motifs": [
      "ein Beweis, der sich widerspricht",
      "ein Paradoxon mit Randnotiz",
      "eine Tür ohne Wand",
      "ein Kreis, der eckig wird",
      "eine Regel, die innen gilt",
      "ein Handbuch, das dich liest",
      "eine Hintertür im Satz",
      "ein Punkt, der die Linie beobachtet",
      "eine Logik auf Glatteis",
      "ein Witz mit Zähnen"
    ],
    "hooks": [
      "ein Schild, das falsche Wahrheiten sagt",
      "ein Ausgang, der nach innen führt",
      "ein Einspruch ohne Grund",
      "eine Gabelung, die sich schließt",
      "eine Ausrede, die offiziell wird",
      "eine Randnotiz, die befiehlt",
      "ein Stempel auf einem Gedanken"
    ],
    "props": [
      "ein Handbuch",
      "eine Karte",
      "ein Foto",
      "eine Münze",
      "ein Notizbuch",
      "ein Siegel",
      "ein Stück Kreide",
      "einen Schlüssel",
      "einen Ausweis",
      "eine Lampe"
    ],
    "turns": [
      "alles ist korrekt – nur in falscher Reihenfolge",
      "du darfst gehen, aber nicht ankommen",
      "der Ausgang ist innen",
      "die Logik bleibt bestehen, aber kippt",
      "das Offensichtliche wird unbenennbar",
      "die Erklärung bricht genau dort ab"
    ],
    "obstacles": [
      "eine Regel gilt, die niemand erklärt",
      "die Tür ist verschlossen",
      "jemand hört mit",
      "der Plan wird unbrauchbar",
      "die Zeit passt nicht zu den Uhren"
    ],
    "stakes": [
      "Der Einsatz ist Kontrolle.",
      "Der Einsatz ist Wahrheit: ohne Beweis.",
      "Der Einsatz ist Zeit: in Schleifen.",
      "Der Einsatz ist Würde: im Witz."
    ],
    "endings": [
      "Und alles blieb korrekt.",
      "Und es begann erst dort.",
      "So schließt sich der Kreis.",
      "Und die Tür fiel ins Schloss.",
      "Und niemand unterschrieb."
    ]
  },
  "post": {
    "motifs": [
      "ein Archiv, das dich rekonstruiert",
      "eine Version, die älter ist als du",
      "ein Echo im Datennebel",
      "ein Speicher voller Wärme",
      "ein Knoten aus Stimmen",
      "ein Prozess, der dich überschreibt",
      "ein Satz, der entfernt wurde",
      "eine Instanz ohne Körper",
      "ein Backup als Erinnerung",
      "ein Rauschen als Kollektiv"
    ],
    "hooks": [
      "eine Datei wirkt nach",
      "ein Prozess startet ohne Befehl",
      "eine Stimme aus Metall",
      "ein Index zeigt auf dich",
      "ein Kollektiv sagt deinen Namen",
      "ein Schatten aus Code",
      "ein Ping im Gedächtnis"
    ],
    "props": [
      "ein Archiv",
      "ein Speicher",
      "ein Knoten",
      "ein Notizbuch",
      "eine Karte",
      "ein Siegel",
      "ein Foto",
      "eine Lampe",
      "einen Schlüssel",
      "ein Ausweis"
    ],
    "turns": [
      "ich bin nicht ich, nur Version",
      "die Datei ist älter als du",
      "ein Satz wurde entfernt – und wirkt nach",
      "die Gegenwart ist nur ein Abgleich",
      "das Kollektiv spricht in dir",
      "die Realität ist ein Protokoll"
    ],
    "obstacles": [
      "deine Wahrnehmung wackelt",
      "die Verbindung ist da – aber ohne Netzwerk",
      "ein Prozess blockiert den Ausgang",
      "jemand hört mit (im Rauschen)",
      "du findest dich als Eintrag"
    ],
    "stakes": [
      "Der Einsatz ist Identität.",
      "Der Einsatz ist Erinnerung.",
      "Der Einsatz ist Wahrheit: welche Version bleibt.",
      "Der Einsatz ist Kontrolle: über das Überschreiben."
    ],
    "endings": [
      "Und die Datei wirkte nach.",
      "Und vielleicht beginnt es erst hier.",
      "Und alles blieb korrekt.",
      "Und der Satz fehlte weiter.",
      "Und es begann erst dort."
    ]
  }
};

/** Icon-Labels je Built-in-Preset-Id. */
export const PRESET_LABELS: Record<string, string> = {
  "rimbaud": "🚤 Rimbaud",
  "baudelaire": "🥀 Baudelaire",
  "kafka": "🪲 Kafka",
  "expressionismus": "🖌️ Expressionismus",
  "surrealismus1920": "🫠 Surrealismus 1920",
  "transzendenz": "🕊️ Transzendenz",
  "melville": "🐋 Melville",
  "formalismus": "📐 Formalismus",
  "christentum": "✝️ Christentum",
  "koran": "☪️ Koran",
  "buddhismus": "☸️ Buddhismus",
  "biologie": "🧬 Biologie",
  "geologie": "🪨 Geologie",
  "astrologie": "🔮 Astrologie",
  "gaia": "🌍 Gaia",
  "freud": "🛋️ Freud",
  "jugendsprache": "💬 Jugendsprache",
  "modernarchitecture": "🏢 Modern Architecture",
  "philosophie": "🧠 Philosophie",
  "klimakrise": "🌡️ Klima in der Krise",
  "ritterromane": "🛡️ Ritterromane",
  "liebesromane": "💗 Liebesromane",
  "bergwelt": "⛰️ Bergwelt",
  "clown": "🤡 Clown",
  "faust": "📜 Faust",
  "lebenreicher": "🍀 Was das Leben reicher macht",
  "tanz": "💃 Tanz",
  "griechischetragoedie": "🎭 Griechische Tragödie",
  "glueck": "✨ Glück",
  "gruendungsmythos": "🏛️ Gründungsmythos",
  "staatsphilosophie": "⚖️ Staatsphilosophie",
  "traumbilder": "🌙 Traumbilder",
  "mystery": "🕯️ Mystery",
  "bureau": "📎 Bürokratischer Horror",
  "tech": "🧪 Tech‑Mystik",
  "myth": "🜁 Myth",
  "body": "🫀 Body",
  "absurd": "🌀 Absurd",
  "post": "🛰️ Posthuman"
};
