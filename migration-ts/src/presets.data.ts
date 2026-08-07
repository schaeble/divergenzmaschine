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
      "Ich bin frei von jeder Hand.",
      "Der Fluss hat mich losgeschnitten.",
      "Niemand hält mehr das Steuer.",
      "Ich treibe durch ein Meer ohne Karten.",
      "Die Nacht schlug wie eine Welle über mich.",
      "Ich habe meine Anker vergessen.",
      "Kein Hafen ruft meinen Namen."
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
      "das Meer antwortet mit Farben",
      "der Himmel stürzt ins Wasser",
      "die Sterne beginnen zu sinken",
      "etwas unter mir atmet",
      "die Wellen tragen Gesichter",
      "ein Leuchten bricht aus der Tiefe",
      "der Wind wird zu einer Stimme"
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
      "Ich will zurück in ein stilles Becken.",
      "Vielleicht träume ich von einem kleinen Hafen.",
      "Ich sehne mich nach einem klaren Ufer.",
      "Ich bin müde vom grenzenlosen Blau.",
      "Die See schweigt zuletzt."
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
      "Im Schaufenster liegt Schönheit wie eine Drohung.",
      "Ein Duft bleibt an mir hängen, als hätte er Zähne.",
      "Die Stadt atmet langsam, mit schwerem Atem.",
      "Jemand lacht zu leise, um harmlos zu sein.",
      "Zwischen zwei Laternen fällt ein Schatten aus der Zeit.",
      "Ich gehe, als trüge ich meinen Namen wie eine Last.",
      "Etwas Glänzendes liegt im Schmutz und tut unschuldig."
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
      "Und die Stadt schließt ihre Lippen.",
      "Und der Duft bleibt, wie ein Urteil.",
      "Damit ist die Schönheit erledigt.",
      "So bleibt nur Glanz auf kalter Haut.",
      "Und ich gehe, als hätte ich gewonnen – und verloren."
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
      "Der Brief ist da, bevor ich ihn erwarte.",
      "Niemand sagt mir, worum es geht, aber alle tun so.",
      "Die Tür steht offen und ist dennoch verschlossen.",
      "Mein Name klingt plötzlich wie ein Fehler im System.",
      "Die Luft roch nach Papier und geduldeter Angst.",
      "Ich habe eine Nummer, aber keinen Platz.",
      "Der Wachmann nickt, als hätte er mich erfunden."
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
      "Damit ist der Vorgang eröffnet.",
      "Und es gibt keinen nächsten Schalter.",
      "So bleibt nur das Warten als Entscheidung.",
      "Und der Bescheid ist schon gültig.",
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
      "Die Stadt springt mich an.",
      "Ich höre mein Blut in den Drähten.",
      "Die Häuser stehen zu nah, als wollten sie zubeißen.",
      "Ein Schrei hängt zwischen zwei Reklamen.",
      "Meine Schritte klingen wie Anklagen.",
      "Das Licht ist zu hell, um wahr zu sein.",
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
      "Und die Stadt lacht im Neon.",
      "Und der Morgen kommt wie eine Beule.",
      "So blieb ich stehen, weil alles rannte.",
      "Und der Schrei wird leise.",
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
      "Ich trete in den Raum, und der Raum tritt zurück.",
      "Ein Satz liegt auf dem Boden wie eine Banane.",
      "Die Lampe machte Geräusche, als wäre sie nass.",
      "Jemand spricht, aber die Worte kommen aus der Tapete.",
      "Meine Schuhe wissen den Weg, ich nicht.",
      "Ein Vogel bittet um eine Quittung.",
      "Die Tür erinnert sich an mein Gesicht."
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
      "Und als ich erwache, ist der Raum größer.",
      "So bleibt nur der Beweis: ein nasser Schlüssel.",
      "Und die Uhr isst die letzte Minute.",
      "Und die Tür tut, als hätte sie mich nie gekannt."
    ]
  },
  "transzendenz": {
    "motifs": [
      "eine Stimme, die von nirgendwo kommt",
      "ein Atem, der größer ist als der Körper",
      "ein Gedanke ohne Denkenden",
      "eine Schwelle ohne Tür",
      "ein Weiß, das alle Farben enthält",
      "eine Weite hinter geschlossenen Augen",
      "eine Haut, die nicht mehr trennt",
      "ein Licht, das keine Quelle braucht",
      "ein Klang, der vor dem Hören schon da ist",
      "ein Punkt, in dem alles zusammenfällt"
    ],
    "hooks": [
      "der eigene Name klingt plötzlich geliehen",
      "die Stille hat auf einmal einen Klang",
      "etwas antwortet, ohne zu sprechen",
      "die Hände liegen still und arbeiten doch",
      "im Spiegel steht jemand, der nichts behauptet",
      "die Luft trägt mehr, als sie wiegt",
      "das Ich rückt einen Schritt zur Seite"
    ],
    "props": [
      "eine Schale ohne Boden",
      "ein Tuch aus ungefärbtem Leinen",
      "einen Stein, warm ohne Sonne",
      "eine Kerze, die niemand entzündet hat",
      "ein Buch mit leeren Seiten",
      "eine Glocke ohne Klöppel",
      "einen Spiegel ohne Bild",
      "einen Faden ohne Ende",
      "eine Feder, die nicht fällt",
      "eine Schwelle aus abgetretenem Holz"
    ],
    "turns": [
      "die Grenze zwischen innen und außen wird durchlässig",
      "das Wort reicht nicht mehr und hört auf",
      "die Frage verliert ihren Fragenden",
      "aus Suchen wird Stillhalten",
      "das Einzelne wird durchsichtig",
      "die Antwort kommt vor der Frage",
      "das Ich löst sich, ohne zu verschwinden"
    ],
    "obstacles": [
      "jede Beschreibung verfehlt es",
      "das Suchen selbst steht im Weg",
      "die Sprache kehrt immer zum Sprecher zurück",
      "wer es festhält, verliert es",
      "der Verstand verlangt einen Beweis",
      "die Gewohnheit zieht zurück ins Vertraute",
      "die Erfahrung lässt sich nicht wiederholen"
    ],
    "stakes": [
      "Der Einsatz ist Gewissheit: ohne jeden Beweis.",
      "Der Einsatz ist ein Ich, das nichts mehr behauptet.",
      "Der Einsatz ist die Sprache, die zurücktreten muss.",
      "Der Einsatz ist ein Augenblick, der alle anderen enthält.",
      "Der Einsatz ist alles, was man zu wissen glaubt."
    ],
    "endings": [
      "So bleibt nur das Licht, das keiner entzündet hat.",
      "Und die Stille hält, was kein Wort versprochen hat.",
      "So endet das Suchen, ohne dass etwas gefunden ist.",
      "Am Ende steht kein Satz, nur ein Atemzug.",
      "So schließt sich der Raum, der nie einer war."
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
      "Ich trete an Deck, als wäre es ein Urteil.",
      "Der Ozean liegt da wie ein Gesetz, das niemand erklärt.",
      "Ein Schatten unter der Oberfläche macht die Welt schwer.",
      "Der Wind spricht, aber nicht zu uns.",
      "Wir fahren, als jagten wir einem Gedanken nach.",
      "Das Wasser glänzt, als hätte es einen Willen.",
      "Ein Ruf geht über die See und kommt verändert zurück."
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
      "Und das Meer bleibt, wie es ist.",
      "Und wir begreifen, dass die Jagd uns jagt.",
      "So endet es im Nebel, nicht im Sieg.",
      "Und der Horizont tut, als hätte er nichts gesehen.",
      "Und das Logbuch schließt sich wie ein Gebet."
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
      "Das Licht fällt nicht vom Himmel, sondern aus meinem Mund.",
      "Die Glocken läuten rückwärts.",
      "Ich knie, und der Boden antwortet.",
      "Ein Gleichnis steht plötzlich im Raum.",
      "Der Wind roch nach Weihrauch und Regen.",
      "Ein Engel verwechselt meinen Namen.",
      "Das Brot zerbricht, bevor ich es berühre."
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
      "Und das Licht bleibt, auch ohne Sonne.",
      "Und der Stein ist leichter als mein Herz.",
      "Und ich gehe, als hätte ich Flügel.",
      "Und das Brot reicht für alle.",
      "Und der Himmel öffnet sich nach innen."
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
      "Die Worte kommen wie Regen in der Nacht.",
      "Der Ruf erreicht mich vor meinem Namen.",
      "Ich wasche meine Hände, und die Zeit wird klar.",
      "Die Wüste öffnet ein Auge.",
      "Ein Vers steht im Sand.",
      "Die Stille hat einen Rhythmus.",
      "Der Wind spricht arabisch."
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
      "Und die Wüste trägt plötzlich Grün.",
      "Und mein Herz findet seine Qibla.",
      "Und der Vers bleibt in mir.",
      "Und die Nacht ist nicht mehr dunkel.",
      "Und der Garten öffnet sich im Inneren."
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
      "Ich setze mich, und die Welt setzt sich mit mir.",
      "Ein Atemzug dauert ein Jahrhundert.",
      "Die Frage löst sich vor der Antwort.",
      "Ein Blatt fällt, und ich verstehe.",
      "Die Stille ist lauter als der Markt.",
      "Ein Mönch lächelt ohne Grund.",
      "Der Weg beginnt unter meinen Füßen."
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
      "Und der Atem kehrt heim.",
      "Und nichts fehlt.",
      "Und der Kreis ist offen.",
      "Und die Blüte fällt nicht mehr.",
      "Und der Weg ist kein Weg."
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
      "Die Zelle teilt sich zu früh.",
      "Ein Blatt schreibt meinen Namen.",
      "Das Mikroskop vergrößert die Stille.",
      "Ein Herz schlug außerhalb des Körpers.",
      "Ein Tier sieht mich an, als wüsste es mehr."
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
      "Und das Leben wächst weiter, leise.",
      "Und die Mutation bleibt.",
      "So bleibt nur eine Spur im Gewebe.",
      "Und das Herz findet einen neuen Takt.",
      "Und die Natur antwortet nicht."
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
      "Der Boden unter mir denkt nach.",
      "Ein Riss zieht sich durch den Morgen.",
      "Der Stein ist wärmer als meine Hand.",
      "Die Landschaft verschob sich um Millimeter.",
      "Ein Fossil flüstert meinen Namen."
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
      "Und der Berg schweigt wieder.",
      "Und die Schichten schließen sich.",
      "So bleibt nur ein Abdruck im Gestein.",
      "Und der Riss wird zu einer Linie auf Papier.",
      "Und der Staub legt sich wie Schnee."
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
      "Der Himmel atmet näher als sonst.",
      "Ein Stern fällt nicht – er steigt.",
      "Das Teleskop beobachtet mich.",
      "Zwischen zwei Sekunden öffnet sich ein Orbit.",
      "Der Mond ist heute schwerer."
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
      "Und die Sterne rücken ein Stück näher.",
      "Und das Licht bleibt zurück wie ein Echo.",
      "So bleibt nur Staub in meiner Hand.",
      "Und der Planet dreht sich ohne mich weiter.",
      "Und ich falle – nach oben."
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
      "Die Erde blinzelt.",
      "Ein Erdbeben ist nur ein Zucken.",
      "Der Wind spricht in ganzen Sätzen.",
      "Die Gezeiten folgen einem Herzschlag.",
      "Wir leben auf einer Stirn."
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
      "Und der Planet atmet tiefer.",
      "Und wir sind nur eine Phase.",
      "So bleibt ein leiser Herzschlag.",
      "Und die Welt dreht sich weiter – wissend.",
      "Und das Wesen schließt kurz die Augen."
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
      "Der Traum beginnt immer an derselben Stelle.",
      "Es ist nur ein Versprecher.",
      "Ich sagte Mutter, meinte aber etwas anderes.",
      "Die Stille zwischen zwei Worten wird zu laut."
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
      "Und das Unbewusste lächelt.",
      "Und das Symptom verschwindet – vorläufig.",
      "So bleibt nur eine neue Deutung.",
      "Und der Traum beginnt erneut.",
      "Und ich weiß, warum ich es vergessen habe."
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
      "Bro, das ist anders.",
      "Sag ehrlich, fühlst du das?",
      "Das ist so random.",
      "Lowkey ist das krass.",
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
      "Und plötzlich ist es peinlich.",
      "Und alle fühlen es.",
      "So wird es ein Insider.",
      "Und das Meme stirbt.",
      "Und wir sagen einfach: wild."
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
      "Der Raum ist größer als gedacht.",
      "Nichts lenkt ab.",
      "Licht fällt wie ein Entwurf.",
      "Die Wände scheinen zu schweigen.",
      "Die Stadt beginnt im Wohnzimmer."
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
      "Und das Licht bleibt.",
      "Und der Raum atmet.",
      "So steht nur noch Struktur.",
      "Und die Stadt nimmt es auf.",
      "Und das Gebäude wird Idee."
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
      "Eine einfache Frage bringt die Welt ins Wanken.",
      "Der Widerspruch scheint vernünftiger als die Gewissheit.",
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
      "Und die Frage bleibt bestehen.",
      "Und der Zweifel wird zum Anfang.",
      "So entsteht eine neue Perspektive.",
      "Und die Wahrheit lächelt schweigend.",
      "Und das Denken beginnt von vorn."
    ]
  },
  "klimakrise": {
    "motifs": [
      "ein Himmel, der nach Rauch und Ruß riecht",
      "schmelzendes Eis, das den Fluss hinabtreibt",
      "eine Sonne, die zu heiß über den Dächern brennt",
      "Nebel aus Abgasen über der Stadt",
      "ein Wald, der stumm verdorrt, während die Stadt weiterläuft",
      "aschgraue Wolken, die keine Jahreszeit kennen",
      "ein Fluss, der immer weiter zurückweicht",
      "Risse in der Erde wie alte Wunden"
    ],
    "hooks": [
      "ein Thermometer, das rückwärts steigt",
      "ein vergilbtes Kartenblatt zeigt ein Meer, das es nicht mehr gibt",
      "ein Kompass zeigt nur noch nach Süden",
      "ein Bäcker flüstert von einer Dürre, die niemand sah",
      "jemand sammelt Schneeflocken, die längst hätten schmelzen müssen",
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
      "einen Winterhandschuh, der brennend heiß ist",
      "eine Flasche mit stickiger, schwerer Luft",
      "ein Fernrohr, das nur Nebel zeigt",
      "einen Faden aus verbranntem Kornfeld"
    ],
    "turns": [
      "plötzlich weiß niemand mehr, welches Jahr wirklich ist",
      "in der Asche zeichnet sich ein vertrautes Gesicht ab",
      "die Ernte verfault, noch bevor sie geerntet wird",
      "aus dem kalten Keller steigt plötzlich Hitze auf",
      "die Regale bleiben leer, doch der Himmel selbst scheint zu hungern",
      "ein Bericht aus dem Norden spricht von einem Meer, das verschwindet",
      "es zeigt sich, dass die Veränderung älter ist als jede Messung",
      "das Eis unter der Stadt beginnt zu sprechen"
    ],
    "obstacles": [
      "die Straßen sind verstopft von Rauch und Stillstand",
      "der Fluss führt kein Wasser mehr, nur Staub",
      "niemand glaubt der Warnung, die längst vorliegt",
      "die Kälte des Winters bleibt aus, und das macht Angst",
      "die Kornkammern sind leer, obwohl die Saat aufging",
      "der Nebel verschluckt jeden Fluchtweg",
      "die Zuständigen misstrauen jeder Zahl, die nicht passt",
      "die Hitze lähmt selbst die Entschlossenen"
    ],
    "stakes": [
      "Der Einsatz ist das letzte Grün eines sterbenden Gartens.",
      "Der Einsatz ist die Zukunft, die im Rauch verglüht.",
      "Der Einsatz ist eine Küste, die im steigenden Wasser versinkt.",
      "Der Einsatz ist das Vertrauen ganzer Länder in eine gemeinsame Erde.",
      "Der Einsatz ist die letzte Ernte vor der großen Dürre.",
      "Der Einsatz ist die Wahrheit hinter der brennenden Kälte.",
      "Der Einsatz ist ein Bündnis gegen einen unsichtbaren Feind: die Erwärmung selbst.",
      "Der Einsatz ist die Erinnerung an einen Planeten, der einmal kühl war."
    ],
    "endings": [
      "So endet ein Zeitalter im Rauch der eigenen Zukunft.",
      "Und die Asche bedeckt die Stadt wie ein zweites Schweigen.",
      "So schließt sich der Kreis aus Feuer und Eis.",
      "Am Ende bleibt nur die Hitze, die keiner erklären kann.",
      "Die Debatte frisst sich selbst, während die Erde weiter glüht.",
      "So verschwindet eine Landschaft im Nebel der Veränderung.",
      "Der Winter kehrt zurück, doch das Eis folgt ihm nicht mehr.",
      "Am Horizont brennt kein Feuer mehr – nur die Erinnerung daran."
    ]
  },
  "ritterromane": {
    "motifs": [
      "ein Wappen ohne Farbe an kalter Mauer",
      "eine Rüstung, die niemand mehr trägt",
      "das Echo eines Schwertes, das nie gezogen wird",
      "ein Banner, das über dem Bergfried im Wind steht",
      "eine Krone aus Kerzenlicht über dem leeren Saal",
      "ein Ritterhelm mit leeren Augenhöhlen",
      "das Klirren von Kettenhemden im Wind der Schlucht",
      "eine Tafelrunde, an der niemand mehr sitzt",
      "der Geruch von Eisen und altem Leder"
    ],
    "hooks": [
      "ein Schwertgriff lehnt an der Wendeltreppe",
      "jemand hat ein Wappen in den Türbalken geritzt",
      "ein Ritterhandschuh liegt mitten auf dem Weg",
      "der Ruf vom Turm klingt wie ein Herold",
      "über dem Tor steht ein Name in gotischen Lettern",
      "ein Sporn liegt im Hof, ohne Besitzer",
      "die Uhr zeigt eine Zeit, die es im Kalender nicht gibt",
      "ein Siegelring liegt am Brunnenrand",
      "irgendwo singt jemand ein Lied von Rittern, die nie heimkehren"
    ],
    "props": [
      "einen zerbrochenen Schwertgriff",
      "eine Rüstung aus vernietetem Leder",
      "einen Siegelring mit unbekanntem Wappen",
      "eine Standarte aus verblichener Seide",
      "einen Helm mit Rissen wie Kartenlinien",
      "eine Pergamentrolle voller Wegmarken",
      "einen Handschuh aus Kettenmaschen",
      "eine Kerze in einem alten Wandleuchter",
      "einen Dolch, der nach Schmiedefeuer riecht"
    ],
    "turns": [
      "Plötzlich trägt sie ein Wappen, das ihr nicht gehört.",
      "Der Hof verwandelt sich für einen Atemzug in einen Turnierplatz.",
      "Niemand hat gesehen, wie das Duell endet, und doch weiß es die ganze Burg.",
      "Das letzte Tageslicht wird zum Fackelschein im Bergfried.",
      "Die Wette ist nie ein Spiel, sondern ein Schwur.",
      "Aus dem Torbogen kommt der Hall von Hufen, wo keine Pferde stehen.",
      "Ihr Schatten trägt plötzlich einen Umhang, den sie nie besitzt."
    ],
    "obstacles": [
      "Das Fallgitter fällt, ehe jemand hindurch ist.",
      "Der Torwächter fragt nach einem Geleitbrief, den es nicht gibt.",
      "Das Wappen an der Wand lässt sich nicht entziffern.",
      "Der letzte Bote reitet ab, bevor der Schwur eingelöst ist.",
      "Der Gegner der Wette ist längst verschwunden, aber die Schuld bleibt.",
      "Der Hof ist leer, doch das Tor bleibt verriegelt.",
      "Der Nebel im Graben verschluckt jeden Fluchtweg."
    ],
    "stakes": [
      "Der Einsatz ist ihre Ehre als Ritterin ohne Lehen.",
      "Der Einsatz ist ein Schwur, den niemand mehr einfordern kann.",
      "Der Einsatz ist das letzte Wappen ihrer verlorenen Familie.",
      "Der Einsatz ist der Rang, den sie nie erhält.",
      "Der Einsatz ist Vertrauen: in eine Zeit, die keine Ritter mehr kennt.",
      "Der Einsatz ist ihr Name, geschrieben in einem Buch, das niemand liest.",
      "Der Einsatz ist die Krone eines Sieges, den keiner bezeugen wird."
    ],
    "endings": [
      "So verklingt das letzte Echo eines Turniers, das keiner sieht.",
      "Der Weg führt weiter, und mit ihm die Legende, die niemand glaubt.",
      "So schließt sich das Visier für immer.",
      "Am Ende bleibt nur ein Wappen im Staub des Hofes.",
      "So endet die Wette, die niemand bezeugt.",
      "Die Nacht nimmt den Schwur mit sich in den Wald."
    ]
  },
  "liebesromane": {
    "motifs": [
      "ein Herz, das im Takt fremder Schritte schlägt",
      "ein Liebesbrief, versiegelt mit Wachs und Blut",
      "zwei Schatten, die sich unter Kerzenlicht berühren",
      "ein Medaillon mit einem fremden Porträt",
      "eine Rose, die über Nacht welkt",
      "ein Blick über den Ballsaal, der alles verändert",
      "ein Flüstern von Liebe hinter geschlossenen Türen",
      "ein Tanz, der nie zu Ende zu sein scheint"
    ],
    "hooks": [
      "ein Ring, der nicht an ihre Hand passt",
      "ein fremder Akzent im vertrauten Raum",
      "ein Brief ohne Unterschrift, nur mit einem Kuss",
      "ein Duft von fremdem Parfum im Treppenhaus",
      "ein Herzschlag, der zu schnell für Etikette ist",
      "ein verbotenes Lächeln zwischen zwei Fronten",
      "eine Träne auf einem versiegelten Brief"
    ],
    "props": [
      "einen Liebesbrief mit fremdem Wappen",
      "ein Medaillon mit verborgenem Porträt",
      "eine Rose aus einem fremden Garten",
      "einen goldenen Ring ohne Inschrift",
      "ein Taschentuch mit fremden Initialen",
      "eine Locke Haar in einem Samtbeutel",
      "einen Fächer mit geheimer Botschaft",
      "eine Maske vom letzten Fest"
    ],
    "turns": [
      "Plötzlich erkennt sie in dem Fremden den Mann aus ihren Träumen.",
      "Er spricht ihren Namen, als kenne er ihr Herz.",
      "Ein Kuss im Schatten des Torbogens verändert alles.",
      "Sie begreift, dass Liebe gefährlicher ist als jedes Gerücht.",
      "Zwischen all den Stimmen findet ihr Blick nur ihn."
    ],
    "obstacles": [
      "Die Umstände trennen die Liebenden für immer.",
      "Ein Ehering bindet sie an einen anderen Mann.",
      "Er muss abreisen, ehe der Morgen graut.",
      "Ein altes Versprechen verlangt Treue, die ihr Herz nicht geben kann.",
      "Zwei Häuser trennen, was zusammengehört."
    ],
    "stakes": [
      "Der Einsatz ist Liebe: verboten und unsterblich zugleich.",
      "Der Einsatz ist ihr Herz, das dem Falschen gehört.",
      "Der Einsatz ist eine Zukunft zwischen zwei Leben.",
      "Der Einsatz ist die Wahrheit über eine heimliche Liaison.",
      "Der Einsatz ist alles, was sie zu verlieren fürchtet: ihn."
    ],
    "endings": [
      "Und ihre Liebe überdauert selbst das Schweigen.",
      "So bleibt ihr Herz für immer an jenem Ort zurück.",
      "Am Ende zählt nur der Kuss, der die Zeit besiegt.",
      "Die Jahre verblassen, doch ihre Liebe bleibt bestehen.",
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
      "ein Clown, der lautlos durch den Nebel der Manege schreitet",
      "weiße Schminke, die wie Mondlicht schimmert",
      "eine Maske, die immer lächelt, auch wenn niemand lacht",
      "Glockenspiel eines Narren im Wind über dem Zeltdach",
      "rot geschminkte Lippen über blutleeren Lippen",
      "ein Schellenhut, der im Sturm nicht klingelt",
      "Schatten, die tanzen, wo kein Licht sein sollte",
      "ein Kartenspiel, das immer denselben Narren zeigt"
    ],
    "hooks": [
      "ein Handschuh riecht nach Schwarzpulver und Puderzucker",
      "irgendwo lacht jemand, wo niemand stehen sollte",
      "das Zeltgestänge knarrt im Takt eines unsichtbaren Trommlers",
      "ein Clownsschuh steht einsam mitten in der Manege",
      "die Kerzen am Bühnenrand brennen mit grüner Flamme",
      "jemand hat Kreidezeichen an die Zeltplane gemalt",
      "das Pausenzeichen klingt wie eine alte Drehorgel",
      "ein Zettel mit einem gezeichneten Lächeln liegt in der Garderobe"
    ],
    "props": [
      "eine rissige Clownsmaske",
      "einen verrosteten Trapezhaken",
      "eine Trillerpfeife aus Messing",
      "ein zerfleddertes Tarotblatt mit einem Narren",
      "einen Beutel voller Konfetti aus Pergament",
      "eine Laterne mit rotem Glas",
      "einen Dolch mit Perlmuttgriff",
      "eine Spieluhr, die eine Jahrmarktsmelodie spielt",
      "ein Seil, geflochten mit bunten Bändern"
    ],
    "turns": [
      "plötzlich erkennt er das Gesicht unter der Maske als sein eigenes",
      "der Direktor trägt dieselbe Schminke wie der Narr aus seinen Träumen",
      "die Zirkusglocke schlägt dreizehn Mal, und die Nacht wird zum Tag",
      "hinter dem Vorhang wartet kein Publikum, sondern ein leeres Zelt",
      "als der Applaus verstummt, beginnt irgendwo Jahrmarktsmusik zu spielen"
    ],
    "obstacles": [
      "der Boden ist mit Kreidekreuzen übersät, die niemand betreten darf",
      "der Ansager starrt reglos ins Leere, als sei er zu Stein erstarrt",
      "ein Netz aus bunten Bändern versperrt den Ausgang",
      "die Truppe weigert sich, die fremde Manege zu betreten",
      "der Nebel verschluckt jeden Ruf nach Verstärkung",
      "das Sicherungsseil ist mit Narrenstoff geflickt"
    ],
    "stakes": [
      "Der Einsatz ist sein Verstand: gefangen zwischen Rolle und Wahnsinn.",
      "Der Einsatz ist der Applaus: mehr Fluch als Geschenk.",
      "Der Einsatz ist ein Name, den niemand mehr auszusprechen wagt.",
      "Der Einsatz ist die letzte Nacht vor der letzten Vorstellung.",
      "Der Einsatz ist das Lächeln hinter der Maske: echt oder erzwungen?"
    ],
    "endings": [
      "Und irgendwo im Nebel hinter dem Zelt lacht noch immer ein Narr.",
      "So endet die Fahrt, doch die Schminke bleibt auf seiner Haut.",
      "Der Vorhang fällt über die leere Manege, für immer.",
      "Er trägt seither die Maske, die ihn einst jagte.",
      "So schließt sich der Kreis aus Manege und Rummelplatz."
    ]
  },
  "faust": {
    "motifs": [
      "ein Pakt, mit Blut besiegelt",
      "der Schatten des Mephisto über dem Studierzimmer",
      "eine Uhr im Studierzimmer, die rückwärts tickt",
      "zwei Seelen in einer Brust",
      "ein Buch, das niemand lesen darf",
      "das Flüstern verlorener Seelen in den Gassen",
      "ein Spiegel, der ein jüngeres Gesicht zeigt",
      "Rauch ohne Feuer über den Dächern"
    ],
    "hooks": [
      "ein Siegel, das nach Schwefel riecht",
      "eine Handschrift, die sich selbst verändert",
      "ein Fremder, der die eigene Stimme trägt",
      "ein Vertrag mit fehlendem Datum",
      "ein zweiter Schatten hinter dem Gelehrten",
      "ein Brief ohne Absender und ohne Datum",
      "ein Duft von verbranntem Papier im Hörsaal",
      "ein Lachen, das aus der Mauer kommt"
    ],
    "props": [
      "einen Pakt aus vergilbtem Pergament",
      "eine Phiole mit rotem Wachs",
      "einen Ring mit eingraviertem Pentagramm",
      "eine Maske aus mattem Gold",
      "ein Amulett mit Teufelskopf",
      "einen Schlüssel zur verbotenen Kammer",
      "eine Feder, die von selbst schreibt",
      "ein Medaillon mit Mephistos Zeichen",
      "einen verkohlten Brief"
    ],
    "turns": [
      "plötzlich unterschreibt er, was er nie lesen wollte",
      "er erkennt sein eigenes Gesicht im Widersacher",
      "die Menge ruft einen Namen, den niemand kennt",
      "der Pakt verlangt seinen Preis, genau um Mitternacht",
      "aus Freiheit wird ein Handel mit dem Teufel",
      "das Streben folgt einem Plan, den keiner schrieb"
    ],
    "obstacles": [
      "die Kammer ist von Misstrauen umstellt",
      "niemand darf den Pakt je erwähnen",
      "die Diener gehorchen einer fremden Stimme",
      "der Fremde verlangt ein Pfand, das keiner geben will",
      "das Wissen verlangt einen Preis, den niemand nennen will",
      "die Zeit läuft schneller als jeder Plan"
    ],
    "stakes": [
      "Der Einsatz ist eine Seele, im Voraus verpfändet.",
      "Der Einsatz ist die letzte Wahrheit hinter allem Wissen.",
      "Der Einsatz ist ein Pakt, der niemals bricht.",
      "Der Einsatz ist die Freiheit, erkauft mit Schatten.",
      "Der Einsatz ist der Augenblick, der verweilen soll.",
      "Der Einsatz ist das Gleichgewicht zweier Welten."
    ],
    "endings": [
      "So schließt sich der Pakt, unwiderruflich.",
      "Die Glocke schweigt, doch der Teufel lächelt.",
      "Man erinnert sich nur an das Streben, nicht an den Preis.",
      "Der Vertrag ist erfüllt, die Seele bezahlt.",
      "So endet ein Gelehrter, so beginnt eine Legende.",
      "Im Schatten der Bücherwand verstummt die letzte Frage."
    ]
  },
  "lebenreicher": {
    "motifs": [
      "jemand, der Reichtum in fremden Gassen sucht",
      "zwei Fremde, die sich im Dunkeln begegnen",
      "eine Münze, die niemals ihren Glanz verliert",
      "ein Herz, das mehr zählt als Gold",
      "ein Besitz, der leiser wird als das Teilen",
      "ein Ring, der Erinnerung statt Macht bedeutet",
      "ein Brief, der wahren Reichtum beschreibt",
      "eine Kerze, die Freundschaft erhellt",
      "ein Spiegel, der die Seele reicher zeigt"
    ],
    "hooks": [
      "ein Fremder spricht eine unbekannte Sprache in der Dunkelheit",
      "ein vergessenes Geschenk liegt auf der Fensterbank",
      "eine Notiz nennt keinen Namen, nur ein Versprechen",
      "zwei Schatten reichen sich die Hand",
      "ein Duft nach Zimt, wo Blut sein sollte",
      "ein Lächeln, das nicht zum Elend passt",
      "ein Lied klingt vertraut, obwohl es niemand kennt",
      "ein Kind schenkt einem Fremden sein letztes Brot"
    ],
    "props": [
      "einen goldenen Siegelring",
      "eine Schatulle voller Briefe",
      "einen Kelch aus fremder Hand",
      "eine zerlesene Schrift über das Glück",
      "einen einfachen Holzlöffel",
      "ein Medaillon mit zwei Gesichtern",
      "eine Kerze aus geschmolzenem Wachs",
      "einen Beutel mit unbekannten Samen",
      "eine Uhr ohne Zeiger"
    ],
    "turns": [
      "plötzlich zählt nicht mehr der Besitz, sondern die Geste",
      "er erkennt, dass sein Reichtum nie aus Gold bestand",
      "er verschenkt, was er zuvor bewachte",
      "die Menge verstummt vor einem Akt der Güte",
      "aus Feinden werden für einen Moment Freunde",
      "der wahre Schatz liegt in einem geteilten Brot",
      "niemand weiß mehr, wer hier wirklich herrscht"
    ],
    "obstacles": [
      "alle misstrauen jedem freundlichen Wort",
      "das Haus verschließt sich vor echten Gefühlen",
      "Gerüchte vergiften das Vertrauen zwischen Nachbarn",
      "der Fremde wird verdächtigt, etwas zu wollen",
      "die Straßen sind zu gefährlich für offene Worte",
      "niemand glaubt an uneigennützige Gaben",
      "die Zeit drängt, doch die Wahrheit wartet"
    ],
    "stakes": [
      "Der Einsatz ist Menschlichkeit: in einer Zeit des Hasses.",
      "Der Einsatz ist Freundschaft: über Grenzen hinweg.",
      "Der Einsatz ist Würde: wenn alles andere fällt.",
      "Der Einsatz ist Vertrauen: zwischen Fremden, die es nicht müssten.",
      "Der Einsatz ist Erinnerung: an das, was wirklich zählt.",
      "Der Einsatz ist Mitgefühl: in einer kalten Zeit.",
      "Der Einsatz ist Hoffnung: für ein reicheres Morgen."
    ],
    "endings": [
      "So wird aus Gold nur Staub, aus Güte aber Ewigkeit.",
      "Das Haus verfällt, doch die Geste bleibt bestehen.",
      "So endet die Nacht, reicher an Menschlichkeit.",
      "Zwei Vermögen vergehen, ein Herz bleibt bestehen.",
      "So schließt sich der Kreis aus Haben und Geben.",
      "Am Ende zählt nur, was man verschenkt hat.",
      "So bleibt von allen nur, was sie gaben."
    ]
  },
  "tanz": {
    "motifs": [
      "ein Kreis, der sich dreht, ohne dass jemand führt",
      "Schatten, die sich drehen, ohne Musik",
      "der Wind tanzt durch das Gras wie eine unsichtbare Hand",
      "ein altes Lied, das nur die Füße zu kennen scheinen",
      "zwei Paar Schritte im gleichen geheimen Takt",
      "ein Reigen, der sich im Nebel des Saals verliert",
      "aufgewirbelter Staub, der wie Schnee im Mondlicht steht",
      "ein Takt, der älter ist als der Tanz selbst"
    ],
    "hooks": [
      "die Musik setzt aus, doch niemand bleibt stehen",
      "ein Glöckchen läutet, ohne dass jemand es berührt",
      "ein Schatten tanzt einen Takt zu spät",
      "jemand summt eine Melodie, die ihm niemand beibrachte",
      "der Kreis im Staub ist genau so groß wie der Tanz",
      "ein Hund folgt dem Takt mit geneigtem Kopf",
      "die Fußspuren verschwinden, kaum sind sie gesetzt",
      "der Wind hält kurz den Atem an"
    ],
    "props": [
      "eine Geige ohne Saiten",
      "ein verwittertes Glöckchen",
      "einen Kranz aus Wiesenblumen",
      "ein Tuch, das nach Zeit riecht",
      "eine Flöte ohne Löcher",
      "einen Ring aus geflochtenem Draht",
      "eine Laterne ohne Flamme",
      "einen Mantel, warm wie eine Erinnerung"
    ],
    "turns": [
      "plötzlich tanzen alle, als hätte es niemand je verlernt",
      "auf einmal lächeln alle zur gleichen Sekunde",
      "der Boden scheint sich mit ihnen zu drehen",
      "mit dem ersten Schritt wird die Zeit ganz still",
      "der Tanz zieht die Umstehenden in einen stillen Kreis",
      "als der Mond aufgeht, beginnt der Tanz von selbst"
    ],
    "obstacles": [
      "der Saal liegt plötzlich im Halbdunkel",
      "die Füße scheinen den Boden nicht mehr zu berühren",
      "der Tanz will nicht enden, obwohl die Kräfte schwinden",
      "die anderen weichen zurück, als spürten sie etwas Fremdes",
      "kein Lied begleitet die Schritte, und doch geht der Tanz weiter"
    ],
    "stakes": [
      "Der Einsatz ist Erinnerung: an einen Tanz, der jung hält.",
      "Der Einsatz ist Vertrauen: dass der Takt nicht abbricht.",
      "Der Einsatz ist die Zeit selbst, die mit jedem Schritt verrinnt.",
      "Der Einsatz ist die Liebe, die sich im Kreis bewahrt.",
      "Der Einsatz ist das Lächeln, das den Tanz überlebt."
    ],
    "endings": [
      "So geht der Tanz weiter, wenn niemand mehr hinsieht.",
      "Und das Holz erinnert sich an den Takt, wenn der Saal längst leer ist.",
      "So schließt sich der Kreis, Schritt für Schritt.",
      "Am Ende bleibt nur ein Lächeln über dem stillen Boden.",
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
      "ihre Hände finden sich, wie es immer schon ist"
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
      "So wird aus Armut ein Wunder, das lächelt."
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
      "dann erkennt man: sie sind schon immer hier"
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
      "So wird aus zwei Hirten ein Anfang."
    ]
  },
  "staatsphilosophie": {
    "motifs": [
      "ein Gesetzbuch, das niemand je geschrieben hat",
      "ein Zepter aus verwittertem Holz",
      "eine Grenze, die durch das Land läuft, unsichtbar",
      "der Schatten eines Throns über den Köpfen",
      "ein Siegelring, verloren im Gras",
      "ein Vertrag, in Leinen eingewebt",
      "die Stille eines Gesetzes vor seiner Verkündung",
      "ein Herrscherblick in den Augen der Beherrschten",
      "die Wiederkehr eines alten Eids"
    ],
    "hooks": [
      "ein Kind trägt ein Amulett mit einem fremden Wappen",
      "jemand murmelt Worte wie aus einem Gesetzestext",
      "eine Hand zeichnet Linien in den Staub, wie Grenzen",
      "ein Fremder fragt nach dem 'Herrn dieses Landes'",
      "der Wind trägt eine Stimme, die von Pflicht spricht",
      "zwischen den Pflastersteinen liegt ein Siegel aus Ton",
      "alle folgen einer Ordnung, die niemand befahl",
      "ein Stein in der Erde trägt eingeritzte Paragraphen"
    ],
    "props": [
      "einen zerbrochenen Herrscherstab",
      "eine Tontafel mit unleserlichen Gesetzen",
      "eine Schnur, verknotet wie ein Staatsvertrag",
      "einen alten Siegelring",
      "eine Flöte mit eingeritzten Symbolen",
      "ein vergilbtes Pergament ohne Unterschrift",
      "einen Gehstock mit eingeschnitzter Krone",
      "ein verrostetes Schloss ohne Schlüssel",
      "eine Münze mit unbekanntem Antlitz"
    ],
    "turns": [
      "plötzlich zeigt sich im Lärm der Menge eine Ordnung, die einem Gesetz gleicht",
      "ein Lächeln verrät, dass jemand die stumme Verfassung längst versteht",
      "auf einmal scheint die ganze Stadt einem unsichtbaren Herrscher zu gehorchen",
      "ohne Vorwarnung spricht der Wind wie ein Urteil",
      "es scheint, als hätte das Land seit jeher eigene Gesetze"
    ],
    "obstacles": [
      "die Grenze lässt sich nicht mit Worten erklären",
      "niemand erinnert sich, wer die ersten Regeln aufstellte",
      "niemand gehorcht mehr einem Ruf",
      "der alte Vertrag ist im Boden versunken",
      "ein Nebel verwischt jede sichtbare Ordnung"
    ],
    "stakes": [
      "Der Einsatz ist Gerechtigkeit: für ein Land ohne Namen.",
      "Der Einsatz ist Ordnung: bewahrt von niemandem und doch von allen.",
      "Der Einsatz ist Macht: verborgen im Lächeln der Weise.",
      "Der Einsatz ist Frieden: erkauft mit Schweigen.",
      "Der Einsatz ist Herrschaft: über etwas, das niemand sieht."
    ],
    "endings": [
      "So bleibt die Ordnung ungeschrieben, aber lebendig.",
      "Und alle folgen weiterhin einem Gesetz ohne Namen.",
      "So verschwimmt Herrschaft mit Gewohnheit.",
      "Am Ende lächeln alle, als wüssten sie, wer wirklich regiert.",
      "So schließt sich der Kreis von Macht und Stille."
    ]
  },
  "traumbilder": {
    "motifs": [
      "ein Flur, der sich bei jedem Blick neu ordnet",
      "Nebel, der Gesichter formt und wieder löst",
      "ein Zimmer, das im Schlaf zu atmen scheint",
      "eine Uhr, deren Zeiger im Schlaf weiterwandern",
      "eine Treppe, die nach unten führt und höher endet",
      "Wolken, die wie erinnerte Gesichter ziehen",
      "ein Licht zwischen den Bäumen, das niemand entzündet hat",
      "eine Ebene, die sich in einen See aus Schlaf verwandelt"
    ],
    "hooks": [
      "ein Lächeln, das älter wirkt als das Gesicht",
      "Gesichter, die alle in dieselbe Richtung schauen",
      "ein Windhauch, der nach fremden Worten riecht",
      "eine Hand, die zittert, ohne zu frieren",
      "ein Schatten, der jemandem folgt, aber nicht ihm gehört",
      "ein Klang wie ferne Schritte über Wolken",
      "ein Geräusch, das erst beim Aufwachen aufhört",
      "ein Zimmer, das man betritt und längst kennt"
    ],
    "props": [
      "einen Wecker, der rückwärts läuft",
      "einen Schlüssel ohne Schloss",
      "einen Koffer, der mit jedem Schritt leichter wird",
      "einen Becher voller Traumwasser",
      "eine Kette aus getrockneten Blumen",
      "einen Ring, der nachts enger sitzt",
      "eine Schale mit stillem Wasser",
      "einen Spiegel, der eine Spur zu spät reagiert",
      "eine Feder, die im Wind nicht fällt"
    ],
    "turns": [
      "Plötzlich ist klar: hier wird geträumt, und niemand will erwachen.",
      "Die Stimmen verstummen, als jemand den Raum betritt, den es nicht gibt.",
      "Ein Windstoß trägt eine Stimme, die niemand ausgesprochen hat.",
      "Der Boden beginnt sich zu drehen, als läge er in einem Traum.",
      "Im Spiegel bewegt sich das Bild einen Atemzug zu spät.",
      "Der Himmel färbt sich golden, obwohl es Nacht sein sollte."
    ],
    "obstacles": [
      "Alle sprechen eine Sprache, die nur im Traum verständlich ist.",
      "Der Weg zur Tür verschwindet zwischen den Nebelschwaden.",
      "Der Weg zurück liegt offen, doch niemand findet ihn.",
      "Ein unsichtbares Gewicht hält jeden Schritt zurück.",
      "Die Zeit scheint sich zu verdoppeln, ohne Fortschritt zu machen.",
      "Jede Stimme verhallt, bevor sie ihr Ende erreicht."
    ],
    "stakes": [
      "Der Einsatz ist der Schlaf: das Letzte, was verlässlich bleibt.",
      "Der Einsatz ist der Glaube an das Unsichtbare.",
      "Der Einsatz ist die Erinnerung, die beim Erwachen zerfällt.",
      "Der Einsatz ist die Grenze zwischen Traum und Erwachen.",
      "Der Einsatz ist die Gewissheit, wach zu sein.",
      "Der Einsatz ist das, was der Traum nicht hergeben will."
    ],
    "endings": [
      "So verschwimmt der Traum mit dem Zimmer, für immer.",
      "So bleibt nur ein Lächeln, das die Zeit überdauert.",
      "So schließt sich der Raum, kaum dass man ihn benannt hat.",
      "So bleibt vom Traum nur ein Wort, das niemand kennt.",
      "So endet der Traum, doch das Lächeln bleibt wach.",
      "So verklingt alles im ersten Licht des Erwachens."
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
      "Und die Tür fällt ins Schloss.",
      "Und es ist, als hätte der Ort kurz geblinzelt."
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
      "Und es beginnt erst dort.",
      "Und die Tür fällt ins Schloss.",
      "Und der Bescheid bleibt ohne Antwort."
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
      "Und das System schweigt – mit Absicht.",
      "Und der Bildschirm blinkt einmal zu viel.",
      "Und die Datei wirkt nach.",
      "Und vielleicht beginnt es erst hier.",
      "Und alles bleibt korrekt."
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
      "Und der Ort blinzelt.",
      "Und es beginnt erst dort.",
      "Und die Maske bleibt zurück.",
      "Und die Tür fällt ins Schloss."
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
      "Und es ist, als hätte der Ort geblinzelt.",
      "Und vielleicht beginnt es erst hier.",
      "Damit ist es entschieden.",
      "Und die Luft wird dünn.",
      "Und du weißt es schon vorher."
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
      "Und alles bleibt korrekt.",
      "Und es beginnt erst dort.",
      "So schließt sich der Kreis.",
      "Und die Tür fällt ins Schloss.",
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
      "ein Satz, der entfernt wird",
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
      "ein Satz wird entfernt – und wirkt nach",
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
      "Und die Datei wirkt nach.",
      "Und vielleicht beginnt es erst hier.",
      "Und alles bleibt korrekt.",
      "Und der Satz fehlt weiter.",
      "Und es beginnt erst dort."
    ]
  },
  "haute_couture": {
    "motifs": [
      "ein Saum aus flüssigem Silber",
      "eine Naht, die niemand findet",
      "Tüll über nacktem Licht",
      "ein Stoff, der sich erinnert",
      "die Schleppe im leeren Saal",
      "Seide mit dem Puls darunter",
      "ein Schnittmuster ohne Körper",
      "Perlen auf gespannter Haut",
      "der Schatten einer Schulter",
      "ein Kleid, das ohne Trägerin steht"
    ],
    "hooks": [
      "eine Stecknadel liegt falsch",
      "der Spiegel zeigt den Rücken zuerst",
      "ein Faden hängt aus der Naht",
      "das Licht trifft nur den Saum",
      "ein Handschuh fehlt",
      "die Schneiderin schweigt zu lange",
      "ein Maß stimmt seit gestern nicht"
    ],
    "props": [
      "eine Schere",
      "ein Fingerhut",
      "ein Maßband",
      "eine Stecknadel",
      "ein Seidenfaden",
      "eine Schneiderpuppe",
      "ein Perlmuttknopf",
      "ein Kleidersack",
      "ein Handspiegel",
      "ein Bügeleisen"
    ],
    "turns": [
      "die Naht platzt bei der Anprobe",
      "das Modell weigert sich zu gehen",
      "der Stoff verändert im Licht die Farbe",
      "ein Entwurf verschwindet über Nacht",
      "die Schneiderin näht den Saum zu eng",
      "das Kleid passt einer Fremden besser"
    ],
    "obstacles": [
      "der Stoff widersetzt sich der Schere",
      "die Zeit reicht bis zur Schau nicht",
      "die Hände zittern zu sehr",
      "ein Muster lässt sich nicht wiederholen",
      "niemand bezahlt die Seide"
    ],
    "stakes": [
      "der Ruf eines Hauses",
      "die letzte Kollektion",
      "ein Name auf dem Etikett",
      "die Hand, die noch nähen kann",
      "ein einziger Abend"
    ],
    "endings": [
      "Der Saum bleibt offen, das Licht geht aus.",
      "Am Ende trägt es niemand.",
      "Die Puppe steht, die Schneiderin geht.",
      "Das Kleid wartet auf einen Körper, der nicht kommt.",
      "Alle Nadeln liegen ordentlich, alles ist zu spät."
    ]
  },
  "eichendorff": {
    "motifs": [
      "ein Waldhorn in der Ferne",
      "mondbeglänzte Wipfel",
      "ein Brunnen, der nachts spricht",
      "das Rauschen über stillen Gründen",
      "ein Wanderer ohne Ziel",
      "die Sehnsucht in den Tälern",
      "ein Schloss im Dämmerlicht",
      "Sterne über schwarzen Tannen",
      "ein Weg, der ins Offene führt",
      "der Morgen hinter blauen Bergen"
    ],
    "hooks": [
      "ein Lied klingt aus dem Tal herauf",
      "die Wipfel rauschen ohne Wind",
      "jemand ruft einen alten Namen",
      "ein Licht brennt im leeren Schloss",
      "der Weg gabelt sich zweimal gleich",
      "das Horn verstummt mitten im Ton"
    ],
    "props": [
      "ein Wanderstab",
      "ein Waldhorn",
      "ein Ring",
      "ein Brief",
      "eine Laute",
      "ein Mantel",
      "eine Feder",
      "ein Krug"
    ],
    "turns": [
      "der Wanderer kehrt um und findet nichts wieder",
      "das Lied kommt aus dem eigenen Mund",
      "der Wald öffnet sich auf eine fremde Stadt",
      "die Nacht bringt zurück, was der Tag nimmt",
      "ein Fremder kennt den Weg besser"
    ],
    "obstacles": [
      "die Sehnsucht findet kein Ziel",
      "der Wald schließt sich hinter jedem Schritt",
      "die Nacht kommt zu früh",
      "niemand antwortet auf das Horn",
      "das Heimweh zeigt in zwei Richtungen"
    ],
    "stakes": [
      "die Heimat hinter den Bergen",
      "ein Versprechen aus dem Sommer",
      "die eigene Stimme",
      "der letzte helle Abend",
      "ein Name im Wind"
    ],
    "endings": [
      "Das Horn verklingt, die Wipfel rauschen weiter.",
      "Er geht, und der Wald bleibt wach.",
      "Der Morgen kommt und findet niemanden mehr.",
      "Über den Gründen steht der alte Mond.",
      "Die Sehnsucht bleibt, der Weg bleibt offen."
    ]
  },
  "dickens": {
    "motifs": [
      "Nebel über schwarzen Dächern",
      "eine Gasse voller Ruß",
      "ein Kaminfeuer ohne Wärme",
      "gestärkte Kragen und leere Mägen",
      "ein Kontor mit kalten Fenstern",
      "Kinderhände an fremder Arbeit",
      "eine Uhr im Treppenhaus",
      "der Atem in ungeheizten Zimmern",
      "eine Suppe, die nicht reicht",
      "Kerzenstummel im Amtszimmer"
    ],
    "hooks": [
      "ein Waisenjunge steht in der Tür",
      "der Vormund zählt zweimal falsch",
      "ein Testament taucht verspätet auf",
      "jemand klopft im Schuldnerviertel",
      "ein Brief trägt kein Siegel",
      "die Rechnung stimmt seit Jahren nicht"
    ],
    "props": [
      "eine Taschenuhr",
      "ein Federkiel",
      "ein Schuldschein",
      "eine Kerze",
      "ein Kohleneimer",
      "ein Kontobuch",
      "ein Kanten Brot",
      "ein abgetragener Mantel"
    ],
    "turns": [
      "der Wohltäter erweist sich als Gläubiger",
      "ein Kind erbt, was niemand erwartet",
      "der Schreiber weigert sich zu unterschreiben",
      "die Armenkasse ist leer",
      "ein Fremder bezahlt die Schuld"
    ],
    "obstacles": [
      "das Amt schließt vor der Zeit",
      "niemand bürgt für einen Namenlosen",
      "der Winter kommt vor dem Lohn",
      "die Papiere fehlen",
      "der Vormund unterschreibt nicht"
    ],
    "stakes": [
      "ein Platz am Feuer",
      "der Name der Mutter",
      "die Freiheit aus dem Schuldturm",
      "ein Winter ohne Hunger",
      "die Ehre eines Hauses"
    ],
    "endings": [
      "Der Nebel steht, das Kontor bleibt dunkel.",
      "Am Morgen ist die Kerze herunter, die Rechnung offen.",
      "Jemand zahlt, aber es ist zu spät.",
      "Das Kind geht durch die Gasse und zählt seine Schritte.",
      "Die Uhr im Treppenhaus schlägt in ein leeres Haus."
    ]
  },
  "urknall": {
    "motifs": [
      "ein Punkt ohne Ausdehnung",
      "der erste Riss im Nichts",
      "Licht, das älter ist als Raum",
      "eine Temperatur ohne Ort",
      "Materie im Zustand des Werdens",
      "ein Rauschen aus allen Richtungen",
      "gekrümmte Zeit",
      "die Ausdehnung eines Augenblicks",
      "ein Hintergrund aus Wärme",
      "der Abdruck des Anfangs"
    ],
    "hooks": [
      "das Rauschen kommt aus jeder Richtung gleich",
      "eine Konstante verschiebt sich um ein Weniges",
      "der Hintergrund ist wärmer als erwartet",
      "ein Signal ist älter als sein Ursprung",
      "die Ausdehnung beschleunigt sich"
    ],
    "props": [
      "ein Spektrometer",
      "eine Antenne",
      "eine Rechentafel",
      "ein Teleskop",
      "ein Diagramm",
      "ein Detektor",
      "eine Uhr",
      "eine Photoplatte"
    ],
    "turns": [
      "die Messung widerspricht dem Modell",
      "das Rauschen erweist sich als Erinnerung",
      "die Konstante ändert sich mit der Entfernung",
      "jemand rechnet die Zeit rückwärts weiter",
      "der Anfang lässt kein Davor zu"
    ],
    "obstacles": [
      "die Gleichung teilt durch null",
      "kein Instrument reicht so weit zurück",
      "das Licht kommt zu spät an",
      "die Skala versagt bei kleinen Zahlen",
      "niemand kann außerhalb stehen"
    ],
    "stakes": [
      "die erste Sekunde",
      "ein widerlegtes Weltbild",
      "die Herkunft aller Dinge",
      "eine einzige Zahl",
      "das Recht auf eine Frage"
    ],
    "endings": [
      "Das Rauschen bleibt, die Antwort dehnt sich weiter aus.",
      "Alles fliegt auseinander, gleichmäßig und ohne Eile.",
      "Der Anfang liegt hinter jedem Punkt gleich weit.",
      "Die Platte zeigt Wärme, sonst nichts.",
      "Es dehnt sich, und es kühlt."
    ]
  },
  "erotik": {
    "motifs": [
      "ein Abstand, der kleiner wird",
      "Wärme durch dünnen Stoff",
      "ein Blick, der zu lange bleibt",
      "der Puls an einem Handgelenk",
      "Atem im Nacken",
      "ein Schulterblatt im Halbdunkel",
      "die Spur einer Berührung",
      "Haut im Licht der Straßenlampe",
      "ein Zögern vor der Tür",
      "der Schatten zweier Gestalten"
    ],
    "hooks": [
      "eine Hand bleibt eine Sekunde zu lang",
      "jemand nennt einen Namen leiser als nötig",
      "der Stuhl rückt näher",
      "ein Satz bleibt unvollendet",
      "die Tür fällt hinter zwei Leuten zu",
      "ein Blick geht über den Rand des Glases"
    ],
    "props": [
      "ein Glas Wein",
      "ein offenes Fenster",
      "ein Seidenband",
      "ein Schlüssel",
      "ein Mantel über einer Lehne",
      "eine Kerze",
      "ein Spiegel",
      "ein Brief"
    ],
    "turns": [
      "das Schweigen wird zur Antwort",
      "einer geht, der andere bleibt stehen",
      "aus Höflichkeit wird Absicht",
      "die Nähe kippt in Scheu",
      "jemand sagt doch das Wort"
    ],
    "obstacles": [
      "die Zeit reicht nur bis Mitternacht",
      "niemand macht den ersten Schritt",
      "es gibt zu viele Zuschauer",
      "ein Versprechen bindet anderswo",
      "die Worte kommen nicht"
    ],
    "stakes": [
      "ein Abend, der nicht wiederkommt",
      "eine Freundschaft",
      "der eigene Vorsatz",
      "die Wahrheit über ein Gefühl",
      "ein einziges Ja"
    ],
    "endings": [
      "Die Tür bleibt angelehnt.",
      "Am Morgen liegt der Mantel noch über der Lehne.",
      "Sie gehen in verschiedene Richtungen, langsam.",
      "Das Fenster steht offen, das Zimmer ist kühl.",
      "Nichts geschieht, und alles ist gesagt."
    ]
  },
  "hunger": {
    "motifs": [
      "ein leerer Teller im Licht",
      "die Kornkammer ohne Schatten",
      "Brot hinter dickem Glas",
      "ein Magen, der die Stunden zählt",
      "der Geruch aus fremden Fenstern",
      "Hände, die nach nichts greifen",
      "ein Löffel ohne Suppe",
      "die Straße riecht nach Backstube",
      "ein Kind zählt Krumen",
      "Winter über leeren Feldern"
    ],
    "hooks": [
      "die Bäckerei öffnet heute nicht",
      "jemand teilt die letzte Scheibe zu genau",
      "ein Sack Mehl fehlt im Lager",
      "der Preis steigt über Nacht",
      "ein Teller steht zu viel auf dem Tisch"
    ],
    "props": [
      "ein Löffel",
      "ein Krug Wasser",
      "ein Kanten Brot",
      "eine leere Schüssel",
      "ein Sack Mehl",
      "ein Messer",
      "ein Marktkorb",
      "eine Waage"
    ],
    "turns": [
      "das Brot reicht für einen weniger",
      "jemand stiehlt und wird gesehen",
      "der Nachbar teilt, ohne zu fragen",
      "die Vorräte finden sich, aber verdorben",
      "der Hunger geht, die Angst bleibt"
    ],
    "obstacles": [
      "die Felder tragen nichts",
      "der Markt bleibt geschlossen",
      "das Geld reicht bis Dienstag",
      "niemand öffnet die Tür",
      "der Weg zur Stadt ist zu weit"
    ],
    "stakes": [
      "ein Winter",
      "die Kraft für morgen",
      "der Stolz beim Bitten",
      "ein Kind am Tisch",
      "die letzte Scheibe"
    ],
    "endings": [
      "Der Teller bleibt leer, das Licht wird kalt.",
      "Am Morgen ist der Krug noch voll.",
      "Sie teilen, und es reicht nicht.",
      "Draußen backt jemand, hier zählt jemand.",
      "Der Hunger legt sich schlafen und wacht früher auf."
    ]
  },
  "romantik": {
    "motifs": [
      "die blaue Blume am Wegrand",
      "Mondlicht auf altem Stein",
      "eine Ruine im Nebel",
      "Sehnsucht ohne Gegenstand",
      "ein Traum, der weiterträumt",
      "die Nacht als offenes Tor",
      "eine Harfe im leeren Saal",
      "der Wald als Kirche",
      "Sterne über schlafenden Dörfern",
      "ein Herz, das die Ferne wählt"
    ],
    "hooks": [
      "die Blume blüht am falschen Ort",
      "ein Traum wiederholt ein fremdes Zimmer",
      "die Ruine trägt ein frisches Zeichen",
      "jemand singt, was niemand kennt",
      "der Mond steht zweimal im Wasser"
    ],
    "props": [
      "eine getrocknete Blume",
      "ein Medaillon",
      "eine Harfe",
      "ein Notenblatt",
      "ein Spiegel",
      "ein Schlüssel",
      "eine Kerze",
      "ein Buch"
    ],
    "turns": [
      "der Traum tritt aus dem Schlaf heraus",
      "die Ferne erweist sich als Nähe",
      "das Lied kennt die Zukunft",
      "die Ruine erinnert sich an ihren Bau",
      "der Weg führt in die eigene Kindheit"
    ],
    "obstacles": [
      "das Erwachen kommt zu früh",
      "die Blume verliert im Licht ihre Farbe",
      "niemand hört den Ton",
      "die Ferne bleibt Ferne",
      "der Traum lässt sich nicht erzählen"
    ],
    "stakes": [
      "ein Traum, der nicht zurückkommt",
      "die Unschuld eines Sommers",
      "ein Ton, den niemand sonst hört",
      "die Ferne selbst",
      "ein Wort für das Unsagbare"
    ],
    "endings": [
      "Die Blume bleibt blau, der Morgen bleibt grau.",
      "Er erwacht, und die Ferne ist wieder weit.",
      "Das Lied endet, der Saal hört weiter zu.",
      "Über der Ruine steht der Mond und wartet.",
      "Alles bleibt offen wie ein Tor bei Nacht."
    ]
  },
  "hugo": {
    "motifs": [
      "eine Barrikade aus Möbeln",
      "Kanäle unter der Stadt",
      "die Glocke über den Dächern",
      "ein Kerzenleuchter aus Silber",
      "das Kind auf dem Pflaster",
      "ein Gerichtssaal ohne Fenster",
      "Brot und Ketten",
      "die Kathedrale im Regen",
      "eine Nummer statt eines Namens",
      "der Aufruhr in engen Gassen"
    ],
    "hooks": [
      "ein Bischof zählt das Silber nicht nach",
      "ein Kommissar erkennt ein Gesicht wieder",
      "auf dem Pflaster liegt eine Fahne",
      "das Kind singt gegen die Gewehre",
      "ein Name steht in zwei Akten"
    ],
    "props": [
      "ein Leuchter",
      "eine Akte",
      "ein Brotlaib",
      "eine Kette",
      "eine Fahne",
      "ein Gewehr",
      "eine Glocke",
      "ein Passierschein"
    ],
    "turns": [
      "der Verfolger lässt den Verfolgten laufen",
      "die Barrikade hält länger als erwartet",
      "aus Gnade wird ein neues Leben",
      "das Gesetz siegt und verliert dabei",
      "ein Kind fällt, und die Straße erhebt sich"
    ],
    "obstacles": [
      "das Gesetz kennt keine Gnade",
      "die Papiere tragen den alten Namen",
      "die Nacht gehört den Wachen",
      "niemand öffnet die Tore",
      "die Kanäle sind überflutet"
    ],
    "stakes": [
      "ein Name ohne Nummer",
      "das Leben eines Kindes",
      "die Gerechtigkeit selbst",
      "eine Stadt für eine Nacht",
      "die Seele eines Verfolgers"
    ],
    "endings": [
      "Die Barrikade fällt, die Glocke bleibt.",
      "Am Morgen räumt man das Pflaster.",
      "Er geht frei, und niemand versteht warum.",
      "Die Kathedrale steht im Regen wie immer.",
      "Unten in den Kanälen läuft das Wasser weiter."
    ]
  },
  "hafen": {
    "motifs": [
      "Kräne im Morgennebel",
      "ein Poller mit alten Kerben",
      "Öl auf schwarzem Wasser",
      "Container in falscher Ordnung",
      "ein Schiffsbauch voller Fremde",
      "Möwen über leeren Kais",
      "das Tuten in der Nacht",
      "Seile, dick wie Arme",
      "eine Uhr am Kaischuppen",
      "Salz auf jeder Fläche"
    ],
    "hooks": [
      "ein Container steht ohne Papiere da",
      "das Schiff läuft ohne Namen ein",
      "eine Leine löst sich von selbst",
      "jemand wartet seit Tagen am Kai",
      "die Ladeliste zählt einen Posten zu viel"
    ],
    "props": [
      "ein Tau",
      "ein Kompass",
      "eine Laterne",
      "ein Seesack",
      "ein Frachtbrief",
      "ein Anker",
      "eine Trillerpfeife",
      "eine Seekarte"
    ],
    "turns": [
      "das Schiff legt früher ab als angekündigt",
      "der Wartende steigt doch ein",
      "die Ladung gehört jemand anderem",
      "der Kapitän kennt den Namen im Brief",
      "der Nebel hebt sich und zeigt nichts"
    ],
    "obstacles": [
      "die Papiere fehlen",
      "die Flut kommt zu spät",
      "niemand spricht dieselbe Sprache",
      "der Zoll schließt den Kai",
      "das Tau hält nicht"
    ],
    "stakes": [
      "eine Überfahrt",
      "ein Name auf der Liste",
      "die letzte Fracht",
      "ein Wiedersehen",
      "der Weg zurück"
    ],
    "endings": [
      "Das Schiff läuft aus, der Kai bleibt leer.",
      "Am Morgen liegt nur noch Öl auf dem Wasser.",
      "Sie wartet weiter, die Uhr am Schuppen geht falsch.",
      "Die Möwen bleiben, alles andere fährt.",
      "Das Tuten kommt zurück und findet niemanden."
    ]
  },
  "alltag": {
    "motifs": [
      "ein Kühlschrank, der nachts brummt",
      "die immer gleiche Bushaltestelle",
      "Post auf dem Küchentisch",
      "ein Schlüssel im falschen Fach",
      "Wäsche auf dem Balkon",
      "das Licht im Treppenhaus",
      "eine Kaffeetasse mit Rand",
      "der Wecker vor dem Wecker",
      "ein Einkaufszettel ohne Ende",
      "Fernsehen ohne Ton"
    ],
    "hooks": [
      "der Bus kommt heute nicht",
      "ein Umschlag ohne Absender liegt da",
      "der Nachbar grüßt zum ersten Mal",
      "der Aufzug hält im falschen Stock",
      "eine Zahl auf der Rechnung stimmt nicht"
    ],
    "props": [
      "ein Schlüsselbund",
      "eine Kaffeetasse",
      "ein Einkaufszettel",
      "eine Fernbedienung",
      "ein Regenschirm",
      "ein Handy",
      "ein Kalender",
      "ein Blumentopf"
    ],
    "turns": [
      "der freie Tag füllt sich ungefragt",
      "jemand ruft nach Jahren wieder an",
      "der Umzug fällt aus",
      "die Routine bricht an einem Dienstag",
      "der Nachbar bleibt in der Tür stehen"
    ],
    "obstacles": [
      "der Tag hat zu wenig Stunden",
      "niemand ist erreichbar",
      "das Formular verlangt eine Nummer",
      "der Bus fährt nur bis zur Brücke",
      "die Wohnung bleibt zu klein"
    ],
    "stakes": [
      "ein freier Nachmittag",
      "die Miete",
      "ein Anruf, der überfällig ist",
      "der Platz am Fenster",
      "die Ruhe nach Feierabend"
    ],
    "endings": [
      "Der Kühlschrank brummt weiter, das Licht geht aus.",
      "Morgen kommt der Bus wieder pünktlich.",
      "Sie räumt die Tasse weg und macht das Fenster zu.",
      "Im Treppenhaus geht das Licht von selbst aus.",
      "Der Zettel bleibt liegen, unvollständig."
    ]
  },
  "goethe": {
    "motifs": [
      "ein Erlkönig im Nebelstreif",
      "die Grenze zwischen Wald und Feld",
      "ein Werk, das seinen Meister verschlingt",
      "der Faden einer alten Schuld",
      "Marmor unter südlichem Licht",
      "ein Brief an eine Ferne",
      "die Wette zwischen zwei Kräften",
      "ein Garten nach strengem Plan",
      "das Wetterleuchten über Weimar",
      "der Augenblick, der verweilen soll"
    ],
    "hooks": [
      "ein Vater reitet zu schnell",
      "der Lehrling spricht die halbe Formel",
      "ein Brief trägt kein Datum",
      "der Spiegel zeigt eine jüngere Hand",
      "jemand schließt eine Wette ohne Zeugen"
    ],
    "props": [
      "ein Federkiel",
      "ein Siegelring",
      "ein Zauberbesen",
      "eine Wetterfahne",
      "ein Reisekoffer",
      "eine Farbenscheibe",
      "ein Manuskript",
      "ein Wanderstock"
    ],
    "turns": [
      "der Diener gehorcht länger als befohlen",
      "die Wette wendet sich gegen beide",
      "das Werk gelingt und fordert alles",
      "ein Wort zu viel bindet für immer",
      "die Reise führt zurück an den Anfang"
    ],
    "obstacles": [
      "das Wort für den Bann fehlt",
      "zwei Seelen wollen verschiedene Wege",
      "die Zeit lässt sich nicht anhalten",
      "der Meister bleibt fort",
      "die Formel ist nur halb gelernt"
    ],
    "stakes": [
      "ein Augenblick, der bleiben soll",
      "die Seele in einer Wette",
      "das Kind auf dem Pferd",
      "der Ruhm eines Werks",
      "zwei Seelen in einer Brust"
    ],
    "endings": [
      "Der Vater kommt an, das Kind ist still.",
      "Die Besen stehen, das Wasser steigt weiter.",
      "Er sagt das Wort, und alles hält an.",
      "Der Garten bleibt in Ordnung, der Gärtner geht.",
      "Am Ende verweilt nichts, auch nicht der Augenblick."
    ]
  },
  "sinnlich": {
    "motifs": [
      "Regen auf warmem Stein",
      "der Geschmack von Salz auf den Lippen",
      "Wolle an der Innenseite des Arms",
      "ein Geruch aus der Kindheit",
      "das Knistern von Papier",
      "Licht durch geschlossene Lider",
      "kaltes Wasser an den Handgelenken",
      "der Nachhall einer Stimme",
      "Sand zwischen den Fingern",
      "der erste Schluck nach langem Weg"
    ],
    "hooks": [
      "ein Duft kommt ohne Quelle",
      "die Haut spürt ein Geräusch",
      "ein Geschmack weckt ein Datum",
      "das Licht fühlt sich schwer an",
      "eine Berührung klingt nach"
    ],
    "props": [
      "eine Orange",
      "ein Wollschal",
      "eine Schale Wasser",
      "ein Stück Rinde",
      "eine Glocke",
      "ein Tuch",
      "eine Kerze",
      "ein Kieselstein"
    ],
    "turns": [
      "ein Sinn übernimmt die Arbeit des anderen",
      "der Geruch führt an einen Ort zurück",
      "die Berührung verändert die Farbe",
      "das Hören wird zum Sehen",
      "der Geschmack bleibt länger als die Erinnerung"
    ],
    "obstacles": [
      "die Worte fehlen für das Gefühlte",
      "der Duft verfliegt zu schnell",
      "niemand sonst nimmt es wahr",
      "die Haut gewöhnt sich",
      "der Ton liegt außerhalb des Hörens"
    ],
    "stakes": [
      "eine Erinnerung, die nur im Duft lebt",
      "die Schärfe der Wahrnehmung",
      "ein Augenblick vor dem Vergessen",
      "die eigene Haut",
      "ein Name für ein Gefühl"
    ],
    "endings": [
      "Der Regen hört auf, der Stein bleibt warm.",
      "Nichts davon lässt sich sagen.",
      "Sie schließt die Augen und sieht mehr.",
      "Der Duft geht, das Zimmer bleibt.",
      "Am Ende bleibt Salz auf den Lippen."
    ]
  },
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
  "post": "🛰️ Posthuman",
  "haute_couture": "👗 Haute Couture",
  "eichendorff": "🌲 Eichendorff",
  "dickens": "🕯️ Dickens",
  "urknall": "💥 Urknall",
  "erotik": "🌹 Erotik",
  "hunger": "🍞 Hunger",
  "romantik": "🌙 Romantik",
  "hugo": "🔔 Victor Hugo",
  "hafen": "⚓ Am Hafen",
  "alltag": "🏠 Alltag",
  "goethe": "🌿 Goethe",
  "sinnlich": "🖐️ Sinnliche Erfahrung",
};
