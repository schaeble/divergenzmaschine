# Übergabe — Divergenzmaschine

Dieses Blatt reicht, um an einem anderen Rechner oder in einer neuen Sitzung
weiterzuarbeiten. Es liegt im Repo, wandert also mit `git clone` mit.

Stand: **v4.279.0**, Zweig `typescript-migration`.

---

## 1 · Was das ist

Ein offline-fähiger, prozeduraler Textgenerator auf Deutsch, als PWA. Er baut
Texte aus Wortbank-Bausteinen („Atomen") und wählt unter mehreren Fassungen die
beste aus. Kein Sprachmodell im Betrieb — alles regelbasiert und offline.

- **Läuft** unter `https://schaeble.github.io/divergenzmaschine/ts/`
- **Quelltext** im Repo, alles Wesentliche unter `migration-ts/`
- **Sprache der Oberfläche und der Kommentare: Deutsch.** Auch Commit-Nachrichten.

## 2 · Aufsetzen

```
git clone -b typescript-migration https://github.com/schaeble/divergenzmaschine.git
cd divergenzmaschine/migration-ts
npm install
npm test          # Property, Regression, zwei Prüfstände
npm run build     # erzeugt dist/index.html (ein einziges Bündel)
```

Veröffentlicht wird über GitHub Pages, ausgelöst von jedem Push, der
`migration-ts/**` berührt. Nach dem Push dauert es ein bis zwei Minuten;
`…/ts/version.txt` sagt, was draußen ist. **Achtung:** Die Adresse wird
zwischengespeichert — mit `?v=irgendwas` anhängen, sonst sieht man eine alte
Zahl. Im Browser hält der Service Worker die alte Fassung; Strg+Umschalt+R.

Vor jedem Push: `npm version <neu> --no-git-tag-version && node scripts/sync-version.mjs && npm run build`.
Das Skript trägt die Version in `public/version.txt`, `dist/version.txt`,
`src/version.ts` und den Cache-Namen des Service Workers nach.

## 3 · Wie hier gearbeitet wird

Das ist der wichtigste Abschnitt. Die Regeln sind nicht Geschmack, sie sind aus
Fehlern entstanden.

**Erst messen, dann reparieren, dann umbauen.** Jede Änderung am Textbau bekommt
eine Zahl vorher und eine nachher, mit demselben Maß. Ohne Vorher-Zahl ist eine
Nachher-Zahl wertlos.

**Den Detektor prüfen, bevor man ihm glaubt.** Ein rotes Ergebnis heißt zuerst
„nachprüfen". In diesem Projekt haben mehrfach Messungen Unsinn gezählt, bevor
sie stimmten: ein Muster hielt jedes großgeschriebene deutsche Nomen für einen
Eigennamen; ein Zahlmuster verschluckte den Satzpunkt und las „1902. Zeit" als
Menge; ein Vergleich lief gegen Rohtext mit Satzzeichen und traf nie.

**Eine Sperre, die nie zuschlägt, sieht aus wie eine, die funktioniert.** Jede
neue Prüfung braucht einen Gegentest mit absichtlich eingebautem Fehler. Wenn
sie dabei nicht anschlägt, ist sie keine.

**Ein Maß, das nur eine Seite prüft, belohnt den Fehler auf der anderen.** Ein
Anschnitt-Maß, das nur Zeilenenden prüfte, meldete 2 %, während jede zweite
Zeile mitten im Satz begann.

**Der Mittelwert ist nicht der Eindruck.** Auf die Verteilung steuern, nicht auf
das Mittel.

**Ein Gewinn kann mit einer Schuld erkauft sein.** Als die Phrasenwiederholung
von 93 % auf 2 % fiel, sank die Längenquote von 71 % auf 52 % — die alte Quote
war teilweise Wiederholung gewesen. Das ist keine Verschlechterung, sondern eine
ehrlichere Messung.

**Ein Regler, der nichts bewegt, ist schlimmer als keiner.** Vor jedem neuen
Bedienelement messen, was das vorhandene wirklich ausrichtet.

**Was zur Standardausstattung gehört, gehört in den Quelltext** — nicht in einen
KI-Lauf, der Duplikate erzeugt und pro Preset kostet.

**Der Benutzer findet, was die Tests nicht sehen.** Sechs Fehler in Folge kamen
aus seinen Screenshots, während die Läufe „100 % ohne Befund" meldeten. Deshalb:
selbst eine Matrix schwieriger Eingaben durchspielen, und **jeder gefundene
Fehler wird zu einem Muster im Prüfstand**, nicht nur zu einer Reparatur.

## 4 · Die Prüfstände

Beide laufen bei `npm test` mit.

| Datei | was |
|---|---|
| `test/property.ts` | Eigenschaften über 200 Prosa- und 20 Dialogläufe |
| `test/regression.ts` | sechs benannte Fehlerfälle |
| `test/pruefstand.ts` | Bericht: 2880 Läufe (8 Wer × 9 Was × 5 Wann × 4 Wo × 2 Töne), 12 Verbotsmuster, 7 semantische Prüfungen |
| `test/pruefstand-formen.ts` | alle Formen: 2520 Läufe, Muster aus echten Funden, Strukturprüfungen je Form |
| `test/meldung.ts` | Meldung: 2880 Läufe über dieselbe Matrix wie der Bericht, dazu neun Gegenproben |
| `test/sammler.ts` | Sammler: 61 Prüfungen gegen nachgebildete Feed-Daten, mit Gegentests |
| `test/bildrahmen.ts` | Bildrahmen: 67 Prüfungen, 560 Skalier- und 1600 Rasterfälle als Matrix |
| `test/varianz.ts` | Varianzmesser: Ähnlichkeit, Bänder, Gegenfall Dublette — 26 Prüfungen |
| `test/studio.ts` | Studio: „Alles würfeln", Schließkreuze, Ton-Vorräte — 19 Prüfungen |
| `test/musterseite.ts` | Musterseiten: Spaltenverteilung, Deckung, Wortziele — 71 Prüfungen |
| `test/umbruch.ts` | Seitenumbruch: Verteilung, Fußauffüllung, Aufmacher, Füllgrad |
| `test/wirkung.ts` | Wirkungsmesser: Blindprobe unter der Schwelle, Form darüber, Rechnung |
| `test/zeitung.ts` | Zeitungssetzer: Layout-Logik, jsdom-Rundgang und ein Abgleich der Stilvorlage gegen die Rechnung (74 Prüfungen) |

Der Formen-Prüfstand trennt **Formen im Gebrauch** (Prosa, Reim, Haiku,
Multi-Shot) vom **Beiwerk** (Prosagedicht, Gedicht-Strang, Szene). Das Beiwerk
hat bekannte Mängel; sie werden gezählt, aber getrennt ausgewiesen, damit die
Warnwirkung erhalten bleibt.

## 5 · Aufbau

```
migration-ts/src/
  atoms/          Assembler: Atome mit geprüfter Schnittstelle
    rekombination.ts   der Kern (449 Z.) — Pool bauen, ziehen, verfugen
    assemble.ts        passt(), dekliniere(), fuelleSlot(), ziehe()
    derive.ts          Merkmale eines Atoms ableiten (Typ, Tempus, Rhythmus)
    schema.ts          Anschlussregeln als EINE Typmatrix
    trace.ts           Bauspur: welches Atom wurde wann gesetzt
  generation/     Textbau je Form
    buildStory.ts      die Weiche: welche Form nimmt welchen Weg
    bericht.ts         Form „Bericht" (390 Z.) mit vier Konsistenzprüfungen
    postprocess.ts     Nachbearbeitung: Ton, Sprachschliff, Kohärenz
    shape.ts           Rhythmus, Absätze, Perspektive, Satzlänge
    haiku/reim/strang  Versformen
    video.ts           Multi-Shot
  features/
    faktenblatt.ts     einmalige Ziehung vor dem Bericht (379 Z.)
    ressorts.ts        neun Zeitungsressorts (280 Z.)
    knobs.ts           die acht Stellschrauben
    umwelt.ts          Bauplan F: Zeichen, die die Auswahl richten
    scoring.ts         Bestenauslese
  ui/
    studio.ts          der Haupt-Tab (1300+ Z.)
    printView.ts       Druckschicht, sechs Profile
    zeitungView.ts     Zeitungssetzer (391 Z.)
    umbruch.ts         Spalten- und Seitenumbruch, prüfbar getrennt
```

## 6 · Stand

**Formen:** Prosa, Prosagedicht, Gedicht-Strang, Reim, Haiku, Szene/Dialog,
Multi-Shot, **Bericht**, **Meldung**. (`drama` existiert im Quelltext, steht aber nicht in
der Auswahlliste — entweder aufnehmen oder entfernen.)

**Acht Stellschrauben** (`knobs.ts`), Vorgaben:
Fügeteil-Deckel 25 %, 4W-Deckel 2×, Nachlege-Abstand 12, Erzählbogen 100 %,
Ton-Einschübe 100 %, Korpus-Bausteine 0, Phrasensperre 5 Wörter, Satzlänge 9.

**Bericht:** Faktenblatt (einmalige Ziehung, alle Abschnitte lesen daraus),
Gerüst „Zeitungsbericht", neun Ressorts (Wirtschaft, Politik, Kultur, Sport,
Wissenschaft, Gesellschaft, Gesundheit, Bildung, Wetter), fünf
Konsistenzprüfungen, Blickrichtung über den Ton (Hoffnungsvoll/Humorvoll/
Zärtlich melden Gewinn statt Verlust).

**Sammler** (seit 4.220.0): eigener Reiter. Holt den öffentlichen Tagesfeed der
deutschen Wikipedia (Artikel des Tages, „Was geschah am …", In den Nachrichten)
für einen zufälligen Tag des zurückliegenden Jahres und zerlegt jeden Fund in
4W-Vorschläge. Person/Ort werden aus den Strukturdaten bestimmt (Koordinaten,
Kurzbeschreibung), Orte haben Vorrang; Unsicheres bleibt leer und lässt beim
Übernehmen den Studio-Wert stehen. Übergabe über `dm_pending_ctx` wie bei Ideen
und Schatzkammer. Reine Zerlegung in `features/wikisammler.ts`, Netzabruf davon
getrennt — deshalb ohne Netz prüfbar.

Seit 4.221.0 hat der Sammler einen **Vorrat**: Jeder geholte Tag wird unter
`divergenz_sammler_vorrat_v1` abgelegt (Deckel 300, das Älteste fällt heraus).
Der Präfix genügt, damit `sammleRest()` ihn in die Projektdatei nimmt — ein
eigenes Feld braucht es nicht. Die Taste **Wiki** im Studio, neben „Kontext
würfeln“, zieht daraus einen zufälligen Fund und füllt die vier Felder; leere
Werte des Fundes lassen das Feld stehen, gesperrte Felder bleiben unberührt.
Sie greift nie ins Netz.

**Bildrahmen im Zeitungssetzer** (seit 4.222.0): „Bild einfügen" legt ein Bild
vom Gerät in eine eigene Schicht ÜBER dem Satz (`.zk-bilder`, absolut in der
`.zk-seite`). Verschieben per Zeiger, Aufziehen am Griff unten rechts unter
Wahrung des Seitenverhältnisses. Kein Textumfluss — der müsste in die
Höhenmessung eingreifen, und die entscheidet über den Seitenumbruch. Die
Geometrie steht rein in `features/zeitungsbilder.ts` und ist deshalb ohne
Browser prüfbar; die Bilder werden auf 1400 px verkleinert unter
`divergenz_zeitung_bilder_v1` abgelegt (Präfix → Projektdatei). Gezeichnet wird
NACH dem Nachmessen und VOR dem Kopieren für den Druck, sonst fehlen sie auf
dem Papier. Dazu ein **Zurück-Knopf**: ein Stapel von 40 Momentaufnahmen über
Kopf, Spalten, Seitenzahl, Beitragsauswahl und Bilder.

**Layouts** (seit 4.223.0): Der ganze Setzer lässt sich benannt sichern
(`divergenz_zeitung_layouts_v1`, bis 12). Beiträge merken sich über einen
Textschlüssel, NICHT über den Listenindex — die Schatzkammer wächst, ein
gespeicherter Index zeigte danach auf einen fremden Text.

**Zwei Fehler aus dem Betrieb (4.223.0), beide vom Benutzer gefunden:**
Ein verschobenes Bild sprang beim nächsten Zeichnen zurück, und der
Druckdialog öffnete, ohne die Seite zu laden. Konsequenzen im Quelltext:
Ziehen hängt jetzt am **Fenster** statt am Zeigerfang (`setPointerCapture`
bricht still und lässt die Bewegung enden, sobald der Zeiger den Rahmen
verlässt); die Bildschicht bekommt ihren Bezugsrahmen **am Element**
(`style.position`), nicht nur aus der Stilvorlage; und die Druckfassung
entsteht in `mappeBauen()` als eigener Schritt, den der Drucken-Knopf
unmittelbar vor `window.print()` selbst auslöst — vorher war sie eine
Nebenwirkung des Zeichnens, und jeder Abbruch dort ließ den Browser ein
Dokument drucken, in dem `body > *:not(.dm-print-aktiv)` alles ausblendet.
Dazu ein Prüfstand, der den Setzer in jsdom wirklich öffnet.

**Feste Bildplätze** (seit 4.230.0): Die Taste ▤ Plätze zeigt leere Felder im
Spaltenraster — je Spalte drei Bänder, zwischen ihnen 8 px Fuge. Ein Klick
darauf öffnet die Dateiwahl, und das Bild bekommt die Maße des PLATZES, nicht
seine eigenen; beschnitten wird über `object-fit:cover`. Damit gibt es nichts
zu skalieren, was der eigentliche Grund war, dass der Bildteil auf dem Handy
nicht benutzbar war. Reine Rechnung in `plaetze()`, `platzBesetzt()` und
`rahmenAusPlatz()`; der senkrechte Bereich wird am echten `.zk-spaltebox`
gemessen (`spaltenbereich()`), weil er an Kopfhöhe und Aufmacher hängt. Die
Unterkante ist geklemmt: drei einzeln gerundete Bänder ergaben zusammen einen
Pixel zu viel, und der stand unter der Fußlinie. Ein Bild in einem Platz ist
ein ganz gewöhnlicher Bildrahmen — Textumbruch, Verschieben, Löschen und Druck
laufen unverändert. Die Platzfelder fliegen aus der Druckkopie.

**Spaltenraster** (seit 4.224.0): Die Taste ▦ Raster lässt Bilder auf dem
Raster der Seite einrasten — Breite auf ganze Spalten (Steg 6 mm aus
`.zk-raster{gap:0 6mm}`), linke Kante auf einen Spaltenanfang, Oberkante auf
5 mm. Die HÖHE wird nie gerastert: Sie folgt dem Seitenverhältnis, und
Verzerren ist der eine Fehler, den man einem Bild sofort ansieht. Reine
Rechnung in `rasteRahmen()`. Beim Einschalten werden vorhandene Bilder sofort
ausgerichtet — eine Taste, die erst beim nächsten Ziehen wirkt, sieht
wirkungslos aus.

**Textumbruch am Bild** (seit 4.225.0): Jede vom Bild berührte Spalte bekommt
als ERSTES Kind einen unsichtbaren Gleitkasten (`.zk-bildplatz`, `float:left;
width:100%`) mit `margin-top` = Bandanfang und `height` = Bandhöhe. Zeilen
darüber und darunter bleiben stehen, Zeilen im Band rutschen unter das Bild.
Ein eingeschobener Block hätte nur Absatzgrenzen getroffen, nie Zeilengrenzen.
Reihenfolge in `zeichne()`: Seiten setzen → **Platzhalter** → Nachmessen →
Kürzen → Bildschicht → Druckfassung. Der Platzhalter muss VOR die Nachmessung,
sonst steht am Ende doch Text hinter der Fußlinie. Die Nachmessung zählt
seither `.zk-beitrag`, nicht `children` — sonst hielte sie den Platzhalter für
einen Beitrag und würfe den letzten Text hinaus. Der Aufmacher ist ausgenommen
(CSS-Spalten; ein Gleitkasten wirkt dort nur in seiner eigenen Spalte).

**Seitenmaß (ab 4.226.0): 174 × 264 mm.** Die Ränder stehen als `RAND_OBEN`
(15), `RAND_UNTEN` (18), `RAND_SEITE` (18) in `zeitungView.ts` UND in `@page`
— beide müssen übereinstimmen. Vorher rechnete die Verteilung mit 297 − 2×20 =
257 mm, gedruckt wurden 297 − 20 − 22 = 255 mm: zwei Millimeter zu viel, eine
halbe Zeile, die unten abgeschnitten wurde.

**Vorschau ≠ Druck — die dritte Fundstelle** (4.227.0): Die Druckregel
`.dm-print-aktiv .dm-inhalt{margin-top:8mm}` hält beim EINZELTEXT die feste
Kopfzeile frei. Sie traf auch die Zeitungsseite und schob dort jeden
Beitragsrumpf um 8 mm nach unten — nur im Druck. Der Satz stand tiefer als in
der Vorschau, das absolut gesetzte Bild schien nach oben zu springen, und die
Spalten liefen um rund zwei Zeilen länger als gemessen. Jetzt für
`[data-profil="zeitungsseite"]` zurückgenommen.

Seither prüft `test/zeitung.ts` die **Stilvorlage gegen die Rechnung**: gleiche
Seitenhöhe in Vorschau und Druck, Übereinstimmung mit `SEITE_H`/`SEITE_B`, und
`@page`-Ränder gleich `RAND_OBEN/UNTEN/SEITE`. Diese Geometrien sind schon
dreimal auseinandergelaufen; der Abgleich kostet nichts und sieht, was sonst
erst das Papier zeigt.

**Gleitkästen stapeln sich** (4.237.2): Der Platzhalter für ein Bild ist ein
Float. Zwei Bilder in EINER Spalte bekamen je ihren absoluten Abstand von oben
als `margin-top` — aber der zweite Float beginnt unter dem ersten, nicht am
Spaltenkopf. Die Abstände addierten sich zu einem Block höher als die Spalte
und schoben allen Text hinaus („der Text über den Bildern verschwindet").
`baenderStapeln()` rechnet jetzt Abstände VON BAND ZU BAND und verschmilzt
Überlappungen; die Zusage ist geprüft: Die Summe aus Abständen und Höhen endet
an der Unterkante des letzten Bandes.

**Warum der Gleitkasten weg ist** (4.238.1): Der Platzhalter war ein `float`.
Ein Gleitkasten schiebt nur die ZEILEN, die in sein Band fallen — ein Beitrag,
der kurz über dem Bild anfängt, wurde zerrissen (Überschrift oben, Rumpf
darunter) und dabei HÖHER als gemessen. Die Verteilung rechnete mit der Messung
ohne Bild, die Nachmessung warf den Beitrag hinaus: Ein Bild löschte den Text
der Spalte. Jetzt trägt der erste Beitrag eines Abschnitts einen `vorabstand`
(margin-top), der ihn genau an die Bildunterkante setzt. Damit gilt: gemessene
Höhe = tatsächliche Höhe. `.zk-bildplatz` und `baenderStapeln()` sind entfallen.

**Bilder sperren Bänder in der Verteilung** (4.238.0): `umbrechen()` bekommt
`luecken` — je Spalte die gesperrten Bänder in Spaltenkoordinaten — und füllt
Abschnitt für Abschnitt (`freieAbschnitte()`). Vorher wusste die Verteilung
nichts von den Bildern: Sie legte einen zu langen Beitrag in die Spalte, der
Gleitkasten schob ihn unter das Bild hinaus, und die Nachmessung warf ihn ganz
heraus — ein eingefügtes Bild löschte den Text der ganzen Spalte. Gekürzt wird
nur im LETZTEN Abschnitt, denn `kuerzeAmFuss()` greift am Spaltenfuß, nicht
oberhalb eines Bildes.

**Kürzen am Spaltenfuß**: Was auch nach dem Entfernen ganzer Beiträge noch
übersteht — ein einzelner zu langer Beitrag —, wird satzweise gekürzt
(`satzWeg()`), statt von `overflow:hidden` auf halber Zeile abgeschnitten zu
werden. Gemessen wird an der FUSSLINIE (`getBoundingClientRect`), nicht an
`scrollHeight`: Der Spaltenkasten ist ein Rasterfeld und WÄCHST mit seinem
Inhalt — die heraushängende Zeile machte ihn höher, statt einen Überlauf zu
melden, und die Prüfung sah nichts. Dazu 3 mm Reserve für den Unterschied
zwischen Bildschirm und Papier (andere Silbentrennung, eine Zeile mehr).
Reihenfolge: Sätze, dann Absätze, dann ganze Beiträge.

**Meldung** (seit 4.228.0, `generation/meldung.ts`): die Kurzmeldung, 25–70
Wörter. Gebaut wurde sie, weil dem Zeitungssetzer das kurze Format fehlte —
und weil sie die strengsten prüfbaren Zusagen aller Formen hat: alle vier W im
ersten Satz, höchstens vier Sätze, ein Ereignis, ein Tempus, keine Wertung,
keine Zahl und kein Name ohne Faktenblatt. `pruefeMeldung()` prüft genau diese
fünf; der Prüfstand ruft dieselbe Funktion, die auch das Programm benutzen
könnte — ein Maß, nicht zwei.

Sie greift als EINZIGE Form nicht in die Wortbank, sondern referiert nur aus
dem Faktenblatt. Zwei Bauentscheidungen, die aus Fehlversuchen stammen: Der
Doppelpunkt im Vorspann („Am Donnerstag ist in Dürrhausen bekannt geworden:
Die Werft stellt den Betrieb ein.") ist Statik, kein Schmuck — jede Fassung,
die das Was in einen dass-Satz zwingt, muss das finite Verb verschieben und
zerlegt trennbare Verben. Und der Rumpf steht durchgehend im Präsens; die
geläufige Formel „Das teilte … mit" mischte Präteritum hinein und verletzte
die eigene vierte Zusage. Im Zeitungssetzer geht die Meldung automatisch in
die Rolle „Kasten" und setzt unter „Kurz gemeldet".

**Umbruch: drei Fehler auf einmal** (4.237.1). Die Verteilung war bis dahin
ungeprüft — und trug den Fehler „1 von 101 Beiträgen gesetzt":

1. Die Spaltenschleife probierte nur den VORDERSTEN offenen Beitrag. Passte der
   nicht, endete die Spalte; weil er auch in der nächsten Spalte vorn stand,
   endete auch die. Eine Schatzkammer mit langen Texten ergab eine Seite mit
   nichts als dem Aufmacher. Jetzt wird die Warteschlange durchsucht.
2. `fuellgrad()` maß den Aufmacher in SPALTENbreite statt in voller Breite —
   dreifache Höhe. Die fast leere Seite meldete „Füllung 71 %". Jetzt benutzt
   sie dieselbe `aufmacherhoehe` wie die Verteilung.
3. Blieb am Spaltenfuß Luft übrig, blieb sie leer. Neu: `mindestRest` (22 mm im
   Setzer) — ist mehr Platz als eine Überschrift mit ein paar Zeilen braucht,
   kommt der nächste Beitrag hinein und wird von `kuerzeAmFuss()` unten
   gekappt. Das ist der Zeitungssatz: lieber ein Beitrag, der unten aufhört,
   als eine halbleere Spalte.

**Seiten füllen würfelt** (seit 4.237.0): Vorher zog die Füllung reihum nach
Form — dieselbe Folge bei jedem Klick, also jedes Mal dasselbe Blatt. Jetzt
wird gemischt, und `zeichne()` benutzt diese `reihenfolge` statt der sortierten
Indizes. Das ist der Punkt: Der Umbruch füllt von vorn und lässt den Rest
fallen; bei sortierter Folge kam das Ende der Schatzkammer NIE aufs Blatt.
Rollen werden gesetzt, nicht gewürfelt: ein Aufmacher (kein Vers, keine
Meldung, mindestens 60 Wörter), Verse und Meldungen in den Kasten, der Rest in
die Spalten; fehlt ein Kasten-Kandidat, wird der kürzeste Beitrag dazu gemacht.

**Musterseiten** (seit 4.254.0, `features/musterseite.ts`): Die Anordnung steht
VOR dem Text. Grund ist eine Rechnung, keine Meinung: Eine Spalte von 54 mm
fasst bei 9 pt rund 200–280 Wörter, und die Beiträge der Maschine haben 200–250
— jeder Text ist genau eine Spalte, es gibt nichts zu verteilen. Deshalb sah
jede Seite gleich aus, egal wie oft der Umbruch verbessert wurde.

Ein Schema ist eine Liste von Reihen mit relativen Höhen und relativen Breiten.
Erst die Spaltenzahl macht daraus ganze Spalten (`verteileSpalten`, größter
Bruchteil, Mindestbreite 1) — dieselbe Musterseite ergibt bei 3, 4 und 5
Spalten verschiedene Seiten. `schemaPlaetze()` liefert die Plätze, `wortZiel()`
die Wortzahl je Platz (Fläche × Wörter je Seite), `formFuer()` die Form nach
Fläche: ≤ 70 Wörter Meldung, kleiner Kasten Vers, Aufmacher Bericht.

Gesetzt wird in `baueSchemaSeite()` mit CSS-Raster: feste Reihenhöhen, feste
Spaltenspannen, kein Umbruch, keine Nachmessung. Was zu lang ist, kürzt
`kuerzeImPlatz()`; ein leerer Platz bekommt eine Vignette. Der Autopilot
bestellt bei gewähltem Schema für JEDEN Platz einen Text in dessen Länge und
Form — das ist „auf Maß schreiben", der Vorteil einer Maschine gegenüber einer
Redaktion. Das Schema wandert im Layout mit (`Layout.schema`), und beim Laden
stellt der Setzer die Reihenfolge der Teile wieder her: Teil 1 in Platz 1.

**Woher die Varianz im Autopiloten kommt** (4.255.0). Der Befund lautete: „Ich
sehe wenig Varianz — über Omnikognition und Ideen kann ich viel schaffen, aber
kaum etwas kommt an." Er stimmte, und zwar aus drei Gründen:

1. Die Kontextquelle „idee" rief `generateIdeaBatch(1)` OHNE Konfiguration —
   also die zahmste Vorgabe. Eigene Ideen-Profile und der Divergenz-Regler
   kamen nie an. Jetzt wird ein Profil gezogen (eigene zuerst, dann die
   eingebauten) und über `ideaProfileToConfig` übergeben.
2. Die **Omnikognition war überhaupt nicht angeschlossen.** Sie ist die
   stärkste Varianzquelle der App, weil sie als einzige eine eigene WORTBANK
   liefert: `buildSenseBank(channels)` baut Motive, Haken und Wendungen aus den
   Sinneskanälen (Schall, Vibration, Geruch, E-Feld, Magnetfeld, Temperatur).
   Neue Quelle `wahrnehmung`: Sie liefert die vier W aus `profileToStudio(p)`
   und setzt zusätzlich Perspektive, Rhythmus, Auflösung, Modus, Ton und
   Betonung. Die FORM bleibt beim Platz — sie gehört zur Seite, nicht zur
   Wahrnehmung.
3. Das Protokoll zählte die GEWÜNSCHTE Quelle, nicht die benutzte. War der
   Vorrat leer, stand dort „Sammler-Vorrat", obwohl die Welt eingesprungen war.
   `holeKontext()` gibt jetzt die tatsächliche Quelle zurück; das Protokoll
   nennt sie und dazu die vier W jedes Beitrags.

**Varianzmesser** (seit 4.256.0, `features/varianz.ts`): Wie verschieden sind
die Beiträge EINER Ausgabe? Gemessen wird die Ähnlichkeit zum NÄCHSTEN
Nachbarn, nicht der Durchschnitt aller Paare — bei zwölf Beiträgen gibt es 66
Paare, und zwei fast gleiche verschwinden im Mittel, während der Leser sie
sofort sieht. Zwei Ebenen, weil beide für sich täuschen: Inhaltswörter
(Jaccard, trifft gleiche Motive) und Dreiwortgruppen (trifft wörtliche
Übernahmen aus derselben Wortbank, zählt doppelt). Bänder: ab 0,75 grün, ab
0,55 gelb, darunter rot. Die Anzeige im Autopiloten nennt zusätzlich die
ÄHNLICHSTEN PAARE als Belegstelle und die Vielfalt der Einstellungen (Formen,
Wortbänke, 4W-Quellen, Längen) — eine Farbe ohne Begründung wäre ein Urteil.

**Reihenfolge der Beiträge** (zur Erinnerung, oft gefragt): Ohne Musterseite
baut `baueBesetzung()` fest: 1. Aufmacher (Bericht oder Prosa, 50:50),
2. Kasten (Haiku 40 %, sonst Meldung), 3. Rest aus einem Beutel mit fester
Mischung. Die 4W-Quellen laufen REIHUM, nicht gezogen. Mit Musterseite kommt
die Reihenfolge aus den Plätzen, Form und Länge ebenso; die Quellen laufen
weiter reihum. Im Setzer entscheidet `reihenfolge` — bei einer Musterseite
Teil 1 in Platz 1.

**Der Bericht, nach einem gedruckten Blatt** (4.257.0). Fünf Befunde aus einer
echten Ausgabe, alle auf derselben Seite:

1. **Der Vorspann wiederholte die Schlagzeile** wörtlich. Der Setzer erkennt
   die Dublette und streicht sie — übrig blieb ein Bericht, der mit einer
   Passivkonstruktion ohne Subjekt beginnt („Während der Mittagspause wurde
   bekannt, dass rund 1.300 Haushalte betroffen sind"). Wer? Stand nur in der
   Überschrift. Der Vorspann setzt jetzt die Zeit voran: „Während der
   Mittagspause: Das Schulmädchen gibt die Spur bewusst auf."
2. **„Das Schulmädchen besteht seit 1965."** `istPerson()` verlangte einen
   Eigennamen aus zwei großgeschriebenen Wörtern. Eine Gattungsbezeichnung
   („ein Schulmädchen") fiel durch und galt als Einrichtung — samt der
   Laufbahn-Spanne einer Einrichtung (12–110 Jahre statt 4–38). Neu:
   `istGattungsperson()` prüft das GRUNDWORT, denn im Deutschen bestimmt das
   letzte Glied das Kompositum: „Schulmädchen" ist ein Mädchen,
   „Mädchenschule" eine Schule. Die Kurzform behält dann ihren Artikel.
3. **„Im Frühjahr zeichnete sich die erste Meldung ab."** stand wörtlich in
   jedem Bericht und in jeder Meldung — bei acht Beiträgen viermal auf einer
   Seite. Ursache: `zeit` und `was` der zweiten Chronologiezeile waren
   Konstanten im Faktenblatt. Jetzt acht Zeiten × sechs Ereignisse × drei
   Satzfassungen.
4. **Derselbe Satz zweimal hintereinander.** Die Dublettensperre merkte sich
   den ROHEN Eintrag, gedruckt wurde der um Satzzeichen gekürzte — zwei
   Einträge, die sich nur im Schlusspunkt unterschieden, kamen beide durch.
   `satzSchluessel()` normalisiert jetzt.
5. **Ich-Sätze im Bericht.** Aus dem Preset-Vorrat, der für Prosa gedacht ist:
   „Ich sehne mich nach einem klaren Ufer" mitten im Hergang. Kein Widerspruch
   zu den Fakten, aber ein Perspektivbruch — ein Bericht referiert in der
   dritten Person. `satzOhneZahl()` verwirft sie.

Der Prüfstand `test/pruefstand.ts` hat außerdem **nie den Rückgabewert
gesetzt**: Ein Lauf mit Befunden lief grün durch. Er scheitert jetzt, und die
fünf Befunde stehen als Muster darin (drei Verbotsmuster, zwei eigene
Prüfungen) samt einer Varianzprüfung auf die Vorgeschichte.

**Die Meldung, nach dem zweiten Blatt** (4.258.0). Vier Befunde, alle im
Vorspann, alle aus Angaben, die der Sammler liefert:

1. **„Im lange vor den Namen"**, **„Im Mittags, Frühsommer"** —
   `mitPraeposition()` setzte blind ein „im" davor. Neu: Zeitadverbien
   (`ZEIT_ADVERB`) und Angaben mit Komma tragen sich selbst.
2. **„In der Stunde, die nicht gezählt wird wurde bekannt …"** — ein Nebensatz
   in Zeit oder Ort braucht ein Abschlusskomma (`mitAbschlusskomma()`).
3. **„ist Baustelle in städtischem Gebiet bekannt geworden"** — ein roher
   Nominalausdruck an der Stelle einer Ortsangabe. `ortTauglich()` verlangt
   eine Präposition; sonst bleibt der Ort weg. Eine Meldung ohne Ort ist
   unvollständig, eine mit falschem Deutsch ist kaputt.
4. **„Eine Einrichtung Der Flughafen Salzburg, …"** — zwei Subjekte. Trägt das
   „Was" schon einen eigenen Hauptsatz (`tragtEigenesSubjekt()`) oder ist das
   „Wer" nur der Platzhalter `WER_ERSATZ`, steht nach dem Doppelpunkt allein
   das Was. Die 4W-Prüfung überspringt dann folgerichtig den Wer.

**Ressort-Vorrat verdoppelt** (4.258.0): `betroffen` von 5–8 auf 9–14,
`einsatz` auf 8–10, `gewinn` auf 6–8, Zusatzrahmen und Ausblicke auf je 6,
Rollen auf 7. Grund: Bei fünf Einträgen stand in jedem Bericht desselben
Ressorts dieselbe Aufzählung. Der Prüfstand hält jetzt Mindestgrößen fest,
verbietet Dubletten INNERHALB einer Liste (über Listen hinweg ist eine
Wiederholung richtig — „das Ehrenamt" kann betroffen sein UND auf dem Spiel
stehen) und misst, wie oft dieselbe Aufzählung wiederkehrt: 2850 Fassungen in
2880 Läufen.

**Dateiname beim Drucken**: `druckName()` nimmt jetzt die Ausgabennummer
dazu — „Zeitzeichen 21.08.2026 Nr. 36". Zwei Ausgaben am selben Tag hießen
sonst gleich.

**Der Hergang** (4.259.0). Aus Ausgabe 37: Nach dem ersten Faktensatz standen
fünfzehn Bilder aus dem Preset hintereinander, dann wieder Fakten. Nicht die
Bilder sind das Problem, sondern ihre Häufung.

`mische()` verteilt sie jetzt zwischen die Faktensätze und deckelt sie auf
deren Zahl — höchstens so viele Vorratssätze wie Faktensätze, nie zwei
nebeneinander. Bei großer Ziellänge wird der Bericht dadurch kürzer als
bestellt; das ist der Preis.

Kurze Bildfetzen („Eine violette Brandung.") bekommen einen Rahmen: „Geblieben
ist eine violette Brandung." Dabei ein ehrliches Eingeständnis im Quelltext: Es
gibt hier KEINEN verlässlichen Test auf einen deutschen Hauptsatz.
`hatFinitesVerb` hält „Eine violette Brandung" für einen Satz,
`looksLikeFullClause` hält „Der Himmel stürzt ins Wasser" für keinen — beide
sind für ihre eigene Aufgabe gebaut. Gerahmt wird deshalb nur, was kurz ist
(bis vier Wörter), kein Hilfsverb enthält und auch von `looksLikeFullClause`
nicht als Satz erkannt wird. Im Zweifel lieber nicht rahmen.

Die Rahmen verlangen jetzt alle den NOMINATIV. „Die Rede ist von eine violette
Brandung" war Dativ; „Erinnert wird an" und „Im Ort verbindet man damit"
verlangen den Akkusativ und gehen im Maskulinum schief („an ein Mast"). Der
Vorrat liefert im Nominativ — also nur Rahmen, die den brauchen.

Neu im Prüfstand: der **Vorratsanteil** — wie viele Sätze tragen keine
Faktenmarke? 57 % nach der Änderung, 66 % davor; über 60 % schlägt er an.

**„Alles würfeln"** (4.260.0, Studio): ein Knopf neben „Kontext würfeln", der
die vier W aus der WELT zieht (`worldFillContext()` — Figur bevorzugt aus den
gespannten, „Was" aus ihrem Status) UND alle Stilregler würfelt. Der
Unterschied zum vorhandenen Würfel ist die Herkunft: fester Zufallsvorrat dort,
gelebter Weltzustand hier. Gesperrte Felder und Regler bleiben — geprüft, denn
sonst wäre das Schloss wertlos.

Fünfter Stapel (4.279.0): **6 weitere Presets — Stand 27 von 51.** Und ein
Fehler, der seit Jahren im Blatt stand.

| Preset | Einträge | Wörter | Bericht 450 | Prosa 400 |
|---|---|---|---|---|
| faust | 125 | 916 | 103,9 % | 94,5 % |
| expressionismus | 127 | 858 | 103,5 % | 96,1 % |
| buddhismus | 127 | 868 | 104,0 % | 93,7 % |
| tech | 123 | 858 | 103,1 % | 93,8 % |
| eichendorff | 119 | 845 | 104,5 % | 96,2 % |
| hugo | 119 | 843 | 105,0 % | 95,5 % |

**Zuerst die Streichung einer eigenen Regel.** Bis 4.278 stand in Auftrag, Hilfe
und Übergabe: „Der Knick liegt bei rund 120 Einträgen." Nachgemessen, indem aus
vier ausgebauten Presets 25 % der Einträge entfernt wurden — einmal die
kürzesten, einmal zufällig:

| | Einträge | Wörter | Bericht |
|---|---|---|---|
| bergwelt ganz | 128 | 923 | 107,8 % |
| ohne die kürzesten 25 % | 93 | 738 | 95,0 % |
| ohne 25 % zufällig | 93 | 676 | 88,5 % |

Beide gestutzten Fassungen haben dieselbe Eintragszahl und liegen 6,5 Punkte
auseinander — genau so weit, wie ihre Wortzahl auseinanderliegt. Über alle 23
Presets: **Eintragszahl gegen Rest nach Wörtern r = −0,04.** Die Eintragszahl
sagt nichts mehr voraus, sobald die Wortzahl bekannt ist. Der „Knick bei 120"
war ein Nebeneffekt davon, dass längere Listen mehr Wörter tragen. 90 lange
Einträge sind so gut wie 120 kurze. Steht so im Auftrag, in der Hilfe und hier.

**Dann der alte Fehler: „hugo" hat den Zusammenbau abgewürgt.** Bei Ziel 400
Wörter lag der Median bei **90**, einzelne Texte hatten **17 Wörter**. Der
Assembler brach in 33 von 60 Läufen mit leerer Kandidatenliste ab, mitten in der
Exposition. Ausgeschlossen wurden der Reihe nach: Pool-Größe (153 Atome gegen
159 bei faust), Wortzahl, Eintragszahl, Anteil kasusgebundener Nominalphrasen
(5 % gegen 6 % im Mittel), Bruchstück-Filter (kein Treffer).

Die Ursache lag in der **Form von zehn Motiven**: „Brot und Ketten", „Kanäle
unter der Stadt", „die Kathedrale im Regen", „der Aufruhr in engen Gassen" —
Bruchstücke ohne eigenen Kopf, an die kein Atom anschließt. Umgeschrieben zu
vollen Nominalphrasen mit Relativsatz („ein Laib Brot neben einer Kette"):
**Median 387, kein Lauf mehr unter 120 Wörtern.** Neue Regel im Auftrag an die
KI: Jedes Motiv ist eine Nominalphrase mit Artikel und eigenem Kopf.

**Prüfstand Struktur § 8 fängt diese Klasse ab jetzt ab:** Kein Preset darf in
12 Läufen mehr als zwei Texte unter 120 Wörtern liefern. Der Prüfstand misst
nicht die Länge — die schwankt mit dem Material —, sondern den ABBRUCH.
Gegenprobe: mit den alten hugo-Motiven schlägt er an (5 von 12).

**Ein zu grobes Verbotsmuster.** „Kopfsatz ohne Aussage" lautete
`\b\w+ (stellt fest|begreift|bemerkt|nimmt wahr)\.` und traf damit JEDEN Satz,
der auf eines dieser Verben endet. Der neue buddhismus-Eintrag „Ein Schüler
sitzt seit dem Morgen und hat nichts bemerkt." schlug prompt an — ein
vollständiger, richtiger Satz, 9 von 2880 Läufen. Gemeint war ein Rahmen mit
leerem Slot („Die Archivarin bemerkt."), also zählt jetzt die Länge: höchstens
drei Wörter vor dem Verb. Mit Gegenprobe in derselben Datei.

**Und die dritte Schranke im Rauschen.** „linear findet ein Schlussbild" stand
bei 25 von 40; gemessen sind es im Mittel 27,1 mit einer Spanne von 21 bis 33 —
jeder vierte Lauf wurde grundlos rot. Jetzt 18. Damit ist in dieser Sitzung die
dritte Schranke aufgefallen, die **knapp unter den Wert eines einzelnen Laufs**
gesetzt worden war (Höhepunkt 3 %, Blindprobe 2,5, Schlussbild 25). Das ist ein
Muster und keine Häufung: **Wer eine Schranke aus einer Messung ableitet, würfelt.
Schranken gehören außerhalb der gemessenen Streuung.**

Genustabelle 1239 → 1259.

**Noch 24 Presets.** Am dünnsten unter den ausgebauten: geologie (688), freud
(695), biologie (710).

Nachverdichtung (4.278.0): **Die fünf dünnen Presets aufgefüllt — und dabei
gemessen, WO Wörter zählen.**

Statt alle fünf gleich zu behandeln, wurde je Gruppe genau eine Sache geändert.
Das macht aus einer Korrelation einen Eingriffsversuch.

- **Gruppe Satz** (nur hooks, turns, obstacles, endings verlängert): urknall, dickens
- **Gruppe Nomen** (nur motifs, props, stakes verlängert): alltag, hafen
- **Beides**: jugendsprache

| Preset | Gruppe | Wörter | Bericht 450 | Punkte je 100 Wörter |
|---|---|---|---|---|
| urknall | Satz | 623 → 855 | 89,3 → 106,5 % | **7,4** |
| dickens | Satz | 634 → 814 | 90,9 → 108,6 % | **9,8** |
| alltag | Nomen | 624 → 794 | 83,5 → 94,6 % | 6,5 |
| hafen | Nomen | 640 → 770 | 88,1 → 95,5 % | 5,7 |
| jugendsprache | beides | 557 → 765 | 72,1 → 93,7 % | 10,4 |

**Ein Wort in einer Satz-Kategorie ist rund 1,6-mal so viel wert wie eines in
einer Nominal-Kategorie.** Das passt zu den Korrelationen, die vorher gemessen
wurden (obstacles r = 0,82, endings 0,78, turns 0,73 gegen props 0,59 und motifs
0,57) — aber es ist jetzt ein Eingriff und keine Beobachtung mehr.

**Und eine Vorhersage, vor der Messung aufgeschrieben.** modernarchitecture lag
bei 673 Wörtern und 90 %. Nach der Regel sollten 180 zusätzliche Wörter in den
Satz-Kategorien es auf rund 855 Wörter und 107 % bringen. Gemessen: **840 Wörter,
106,5 %.** Die Regel sagt also nicht nur die Richtung, sondern die Größe voraus.
Das ist der Grund, warum die Nachverdichtung von modernarchitecture in diesem
Stapel steckt, obwohl es erst gestern ausgebaut wurde.

Neu im Auftrag an die KI, in der Hilfe und im Prüfstand: **turns, obstacles und
endings mindestens sieben Wörter — ein Satz mit einem Umstand, kein Stichwort.**
Die alten Einträge dieser Presets zeigten genau das Gegenteil: „Ornament
verschwindet", „Kostenexplosion", „Stadtverdichtung", „cringe-Moment" standen als
Nominalphrasen in Satz-Kategorien.

**Nebenbefund beim Prüfen.** Der Schliff-Prüfstand zählt, wie viele Preset-Sätze
der Bruchstück-Filter fälschlich greift. Nach der Nachverdichtung waren es sieben
statt der erlaubten fünf. Drei davon waren meine: elliptische Zeitangaben („die
Uhr über der Spüle, drei Minuten vor") — umgeschrieben. **Vier sind älter und
echte Fehlgriffe des Filters:** „ein Widerstand baut sich auf" endet auf eine
trennbare Vorsilbe, „der Kreis öffnet sich für einen" auf ein Pronomen. Das ist
dieselbe Familie wie der `formeWas`-Fehler aus 4.264. Gemessen betrifft es 4 von
rund 2800 Einträgen (0,14 %) — zu wenig für einen Eingriff in eine Funktion, die
auch auf Sammler-Funde läuft, wo dieselben Wörter meist WIRKLICH ein Abbruch
sind. Vermerkt, nicht gebaut.

**Nächste drei nach Wortzahl:** geologie (688), freud (695), biologie (710). Die
Schranke im Prüfstand steht bei 650 und nicht bei 850 — sie soll merken, wenn
jemand kürzt, nicht ein Ziel erzwingen, das noch nicht überall erreicht ist.

Vierter Stapel (4.277.0): **6 weitere Presets — Stand 23 von 51.** Und die
Erkenntnis, dass die Zahl 120 das falsche Maß war.

| Preset | Einträge | Wörter | Bericht 450 | Prosa 400 |
|---|---|---|---|---|
| griechischetragoedie | 122 | 837 | 101 % | 95 % |
| hunger | 124 | 712 | 96 % | 98 % |
| modernarchitecture | 125 | 673 | 90 % | 96 % |
| freud | 121 | 695 | 80 % | 94 % |
| bureau | 125 | 748 | 79 % | 94 % |
| astrologie | 121 | 722 | 78 % | 95 % |

**Drei von sechs unter 81 % — und damit war das Muster nicht mehr zu übersehen.**
jugendsprache (72 %) und biologie (83 %) fielen aus demselben Grund heraus, und
zweimal stand hier die Vermutung, es liege an kurzen Einträgen. Jetzt gemessen,
über alle 23 ausgebauten Presets:

**Der Zusammenhang zwischen der WORTZAHL einer Bank und der erreichten
Berichtslänge liegt bei r = 0,80. Der zwischen Eintragszahl und Länge liegt nahe
null.**

| Preset | Einträge | Wörter | Ø je Eintrag | Bericht |
|---|---|---|---|---|
| jugendsprache | 123 | 557 | 4,5 | 72 % |
| astrologie | 121 | 722 | 6,0 | 78 % |
| … | | | | |
| melville | 130 | 808 | 6,2 | 99 % |
| tanz | 123 | 884 | 7,2 | 104 % |
| bergwelt | 128 | 923 | 7,2 | 108 % |

Die Eintragszahlen liegen alle zwischen 120 und 147 und erklären nichts. Die
Wortzahlen liegen zwischen 557 und 923 und erklären fast alles. **Rund 850
Wörter braucht ein Preset für volle Treue — im Schnitt sieben Wörter je
Eintrag.** Das steht jetzt im Auftrag an die KI (`ki.ts` und `preset2.ts`), in
der Hilfe und im Prüfstand, der die Wortzahl mit ausdruckt und die dünnsten drei
beim Namen nennt.

Damit ist auch klar, was als Nächstes ansteht und was nicht: **jugendsprache
(557), urknall (623), alltag (624), dickens (634) und hafen (640) sind bei den
Einträgen fertig und bei den Wörtern nicht.** Sie brauchen keine neuen Zeilen,
sondern längere.

**Und eine Selbstkorrektur.** Die Übergabe zu 4.276.0 beschrieb, dass die
Höhepunkt-Schranke im Prüfstand Struktur von 3 % auf 8 % gesetzt wurde. Im
Quelltext war sie das nicht — ein Skript hatte die Änderung überschrieben, und
der Commit ging so hinaus. Aufgefallen ist es, weil der Prüfstand im nächsten
Lauf wieder grundlos rot wurde. Jetzt gesetzt und über fünf Läufe geprüft. Merke:
**Wer eine Schranke verschiebt, prüft danach, ob sie verschoben IST** — dieselbe
Regel, die dieses Papier für Detektoren aufstellt, gilt für die eigenen Eingriffe.

**Genustabelle: 1167 → 1239 Einträge.** Der Prüfstand aus 4.276.0 hat wieder
geliefert, und diesmal zeigte er eine ganze Klasse: `guessGender` gibt bei
unbekanntem Wort auf `-er` maskulin zurück. Von 142 solchen Wörtern im Material
waren rund fünfzig falsch — Wartezimmer, Schaufenster, Trinkwasser, Quecksilber,
Speisekammer, Opfer. Der Fehler saß nicht in der `-er`-Regel, sondern davor: Die
Kompositumsregel sucht das längste bekannte Wortende, und „Zimmer", „Fenster",
„Wasser", „Kammer", „Pulver" standen gar nicht in der Tabelle. **35 Grundwörter
eingetragen — 32 Zusammensetzungen lösen sich seitdem richtig auf.** Drei kippten
dabei in die andere Richtung (Höhenmesser über „Messer", Platzhalter über
„Alter", Passagier über „Gier") und haben nun eigene Einträge. Das ist der Preis
der Regel: Jedes Grundwort hilft vielen Zusammensetzungen und schadet wenigen.

Dritter Stapel (4.276.0): **6 weitere Presets — Stand 17 von 51.** Und zwei
Prüfstände, die nicht das geprüft haben, was auf ihnen stand.

| Preset | Einträge | Bericht 450 | Prosa 400 | Phrasenwdh |
|---|---|---|---|---|
| melville | 130 | 97 % | 96 % | 0,006 |
| geologie | 129 | 91 % | 96 % | 0,003 |
| clown | 127 | 104 % | 96 % | 0,005 |
| haute_couture | 125 | 95 % | 97 % | 0,007 |
| tanz | 123 | 105 % | 97 % | 0,008 |
| biologie | 126 | **83 %** | 93 % | 0,006 |

biologie bleibt beim Bericht zurück, aus demselben Grund wie jugendsprache im
Stapel davor: kurze Einträge („ein Ei ohne Schale"). Zweiter Beleg für dieselbe
Sache — die Zahl 120 misst Einträge, der Bericht braucht Wörter.

**Neu: 53 Motivverwandlungen für die sechs Presets** — und daraus ein Befund.
`leseVerwandlungen` wirft ein Paar mit unbekanntem oder ungleichem Geschlecht
STILL weg. 18 der 53 fielen durch. Die meisten, weil ein Wort in der
Genustabelle fehlte. **Zwei fielen durch, weil `guessGender` FALSCH riet, nicht
gar nicht:** Die Kompositumsregel sucht das längste bekannte Wortende und findet
in „Direktor" das sächliche „Tor", in „Gestein" das maskuline „Stein". Ein
fehlendes Genus lässt den Artikel weg; ein falsches schreibt „der Gestein" in
den Satz. Gemessen an allen 2275 Preset-Nomen: 3 von 20 geratenen Ge-Wörtern und
1 von 6 -or-Wörtern sind falsch — zu wenig für eine neue Regel, genug für
Einträge in der Tabelle. Prüfstand Verwandlung § 8 hält ab jetzt fest, dass kein
eingebautes Paar still verfällt (Gegenprobe: „Harpune→Anker" schlägt an).

**Zwei Schranken saßen im Rauschen.** Beide sind neu vermessen worden, statt sie
zu verschieben, bis es grün wird.

*Der Höhepunkt (Prüfstand Struktur).* Schranke war 3 % von 153; der wahre Wert
liegt bei 2,1 % mit einer Spanne von 1 bis 6 Ausfällen — die Schranke saß mit
4,59 mitten darin und schlug in jedem fünften Lauf grundlos an. Jetzt 8 %: über
dem Höchstwert, weit unter dem Zustand, gegen den die Prüfung gebaut wurde
(34 %).

*Die Blindprobe (Prüfstand Wirkungsmesser).* Schranke war 2,5; in zwei von fünf
Gesamtläufen rot. 21 Wiederholungen je Stellung von N:

| N | Mittel | Spanne | über 2,5 |
|---|---|---|---|
| 24 | 1,72 ± 0,09 | 1,11–2,58 | 2 von 21 |
| 40 | 2,07 ± 0,12 | 1,27–3,80 | 2 von 21 |
| 120 | 1,87 ± 0,11 | 0,98–2,82 | 3 von 21 |

Daraus zwei Schlüsse, und der zweite widerspricht der Hilfe:

1. **Der Nullpunkt des Wirkungsmessers ist nicht 1, sondern rund 1,9.** Ein
   Regler, der nachweislich nichts ändert, misst 1,9. „Wirkung" ist ein
   Höchstwert über neun Maße, und der Höchstwert mehrerer verrauschter
   Quotienten ist nach oben verzerrt.
2. **Mehr Läufe senken den Blindwert nicht.** Von 24 auf 120 bleibt er innerhalb
   von zwei Standardfehlern gleich. Die Hilfe behauptete bis 4.275 das Gegenteil
   („bei 40 fällt sie auf 1,74, bei 60 auf 1,72") — das waren drei
   Einzelmessungen aus einer Verteilung, die von 1,0 bis 3,8 streut. Rauschen,
   als Trend gelesen, von genau der Sorte, gegen die dieses Papier sonst
   argumentiert. Hilfe korrigiert.

Die Schranke steht jetzt bei 3,5, und die Einordnung wird am gemessenen
Nullpunkt geprüft (`band(1.9) === "rauschen"`) statt am gewürfelten Wert des
Laufs. **Offen und bewusst nicht entschieden:** Das Band „schwach" beginnt im
Erzeugnis bei 2,5, aber ein toter Regler erreicht in 10 % der Läufe 2,8. Nach
der Messung müsste die Grenze bei 3,0 liegen. Das ändert, was der Benutzer bei
schon gesehenen Reglern liest (der Disruptor mit 3,34 fiele von „knapp darüber"
auf „vom Zufall nicht zu unterscheiden") — deshalb liegt es beim Benutzer.

**Nebenbei:** Die Genustabelle enthielt 51 doppelte Schlüssel (ohne
Widerspruch). `npm test` sieht das nicht, weil esbuild Dubletten schluckt;
`npm run build` sieht es, weil `tsc --noEmit` davorsteht. Tabelle entdoppelt und
alphabetisch sortiert, 1167 Einträge. **Merke: veröffentlicht wird mit
`npm run build`, nicht mit `npx vite build`** — sonst fällt der Typprüfer aus.

Zweiter Stapel (4.275.1): **6 weitere Presets ausgebaut — Stand 11 von 51.**

ritterromane 129, bergwelt 128, mystery-Nachbarn klimakrise 128, jugendsprache
123, dickens 124, urknall 121. Gemessen:

| Preset | Einträge | Bericht 450 | Prosa 400 | Phrasenwdh |
|---|---|---|---|---|
| ritterromane | 129 | 106 % | 97 % | 0,007 |
| bergwelt | 128 | 108 % | 96 % | 0,011 |
| klimakrise | 128 | 104 % | 93 % | 0,010 |
| dickens | 124 | 91 % | 100 % | 0,007 |
| urknall | 121 | 91 % | 98 % | 0,006 |
| jugendsprache | 123 | **73 %** | 95 % | 0,009 |

**jugendsprache fällt heraus, und das ist kein Fehler:** Seine Einträge sind
kurz („Das ist so random."), also tragen 123 Einträge dort weniger Wörter als
anderswo. Die Prosa erreicht trotzdem 95 %. Für den Bericht wäre eine Zahl in
WÖRTERN das bessere Maß als eine in Einträgen — vermerkt, nicht gebaut.

**Nebenbefund, zum vierten Mal in Folge:** Die Genusprüfung schlug bei 49 neuen
Requisiten an. 89 Nomen ergänzt. Wer Material schreibt, schreibt die Genustabelle
mit — das gehört zum Arbeitsgang und nicht in die Nachbereitung.

Begonnen (4.275.0): **Der Ausbau der Presets auf 120 Einträge.**

Die Zahl steht seit 4.274.1 fest. Jetzt wird sie umgesetzt — an drei Stellen:

**1 · Die Prompts ziehen mit.** `buildWordbankPrompt()` und der 2.0-Prompt
verlangten je Kategorie 5 bis 12 Einträge, zusammen also rund 50 — genau die
alte Größe. Sie verlangen jetzt **je Kategorie eine Zahl** (motifs 24, hooks 16,
props 22, turns 18, obstacles 17, stakes 11, endings 12 = 120) und begründen
sie mit der Messung. Dazu zwei neue Absätze: **„EINE HAND, NICHT DREI"** (mit
der Zahl 95 gegen 84) und **„KEINE DUBLETTEN"**. Und das Token-Fenster von 4096
auf 8192 — bei 120 Einträgen riss die Antwort sonst mittendrin ab.

**2 · Vier Presets ausgebaut.** kafka 48→135, mystery 48→129, alltag 48→121,
hafen 48→120. Gemessen bestätigt sich die Vorhersage an vier unabhängigen
Presets:

| Preset | Einträge | Bericht 450 | Prosa 400 | Phrasenwdh |
|---|---|---|---|---|
| haute_couture | 48 | 56 % | 54 % | 0,021 |
| alltag | 121 | 85 % | 97 % | 0,008 |
| hafen | 120 | 90 % | 100 % | 0,012 |
| mystery | 129 | 96 % | 94 % | 0,010 |
| kafka | 135 | 95 % | 95 % | 0,007 |
| philosophie | 147 | 96 % | 94 % | 0,006 |

**3 · Die Hilfe korrigiert einen Rat, der falsch geworden ist.** Sie riet, für
lange Texte mehrere Presets anzukreuzen. Das galt, solange die einzelnen klein
waren — jetzt steht dort die Zahl 120 und der Satz, dass eines aus einer Hand
eine Mischung schlägt.

**Stand: 5 von 51.** Der Prüfstand nennt die ausgebauten beim Namen und prüft
für jedes, dass es 400 Wörter Prosa auf mindestens 80 % trägt — Einträge zu
zählen ist keine Messung. 46 Presets fehlen, Median 49 Einträge.

**Nebenbefund, zum dritten Mal:** Die Genusprüfung schlug bei 21 neuen
Requisiten an. Beim Ausbauen ist das der Regelfall, nicht die Ausnahme — 46
Nomen ergänzt.

Gemessen (4.274.1): **Wie groß muss ein Preset sein?** Die Weiche aus der
Zwischenbilanz ist entschieden — und die Antwort ist kleiner als gedacht.

Dasselbe Material, nur weniger davon (Teilmengen von Philosophie):

| Einträge | Bericht bei Ziel 450 | Prosa bei Ziel 400 |
|---|---|---|
| 44 | 56 % | 52 % |
| 67 | 59 % | 71 % |
| 89 | 66 % | 88 % |
| **112** | **87 %** | **94 %** |
| 133 | 94 % | 93 % |
| 147 | 95 % | 94 % |

**Der Knick liegt bei rund 120 Einträgen.** Darüber gewinnt man fast nichts
mehr, darunter bricht es ein. Nicht 500, nicht 48 — etwa 120.

**Und die zweite Zahl ist die überraschende:** Philosophie mit 147 Einträgen ist
so gut wie oder besser als **zehn vereinte Presets mit 509**:

| | 48 Einträge | Philosophie 147 | zehn vereint 509 |
|---|---|---|---|
| Bericht 450 | 55 % | **95 %** | 91 % |
| Bericht 600 | 44 % | **78 %** | 74 % |
| Prosa 400 | 51 % | **96 %** | 89 % |
| Phrasenwiederholung | 0,014 | 0,007 | 0,004 |

Gegenprobe bei GLEICHER Größe (147 aus einer Hand gegen 146 aus dreien):
**95 % gegen 84 %** beim Bericht, **94 % gegen 86 %** bei der Prosa.

**Nicht die Menge allein zählt, sondern dass das Material zusammenpasst.** Der
Assembler verwirft weniger, wenn Kasus, Tempus und Ton der Bausteine zueinander
finden — eine gemischte Bank bietet mehr Einträge, aber weniger brauchbare
Verbindungen je Eintrag.

**Folge für die Arbeit an den Presets:** Ein Preset auf 120 Einträge bringen ist
besser, als drei zu mischen. Auto-Mix bleibt ein Mittel für Überraschung, nicht
für Länge.

Die Zahl steht jetzt als Prüfung fest: Philosophie allein muss einen
450-Wörter-Bericht auf mindestens 85 % tragen.

Gebaut (4.274.0): **Motivverwandlung — das erste Feld einer „Narrative DNA".**

Vorgelegt war ein DNA-Format mit vierzig Feldern. Gezählt trägt es **26
einsetzbare Wörter**, ein Preset im Median **270** — als Antwort auf fehlende
Masse taugt es also nicht. Es ist Steuerung, keine Sprache.

Genommen wurde das eine Feld, das reines MATERIAL ist statt einer Regel in
Prosa: `motivrekursion.transformation`. Eine Liste von Paaren kann man
aufschreiben und ausführen; „Ein Zufall erzeugt mindestens zwei neue Fragen"
kann man nicht.

**Wie es arbeitet:** `bank.verwandlungen` trägt Paare („Bibliothek→Sammlung").
Kehrt ein Motiv wieder, wird es beim ZWEITEN Mal zu seinem Ziel — das erste
bleibt, denn ohne Einführung ist die Verwandlung keine. Gemessen: In 85 % der
Texte kommt mindestens ein Motivwort doppelt vor, und die Verwandlung greift in
**87 % der Texte, rund zweimal je Text**.

**Die harte Bedingung: beide Wörter brauchen dasselbe Geschlecht.** Sonst steht
„das Stille" im Text — der Artikel davor wird nicht mitverwandelt. Ihn
mitzuändern ginge nur halb: Aus „das" ließe sich nicht ablesen, ob Nominativ
oder Akkusativ gemeint war, und bei maskulinen Zielen unterscheiden die sich.
Ein Paar, das nur manchmal stimmt, wird deshalb abgelehnt — mit Begründung
(`pruefePaar`). Von den fünf Paaren des Vorschlags kämen drei nicht durch.

**`verwandlungen` ist KEINE Bank-Kategorie.** `KEINE_KATEGORIE` in `types.ts`
nimmt sie überall aus, wo über die Kategorien gelaufen wird — sonst stünde
„Bibliothek→Sammlung" als Satz im Blatt. Auto-Mix und Mehrfachauswahl führen sie
mit.

**Und: Philosophie hat Masse bekommen.** 48 → **147 Einträge** (828 Wörter),
jede Kategorie mindestens verdoppelt, dazu zwölf Verwandlungen. Das ist das
erste Preset über 100; der Median der übrigen liegt weiter bei 48.

**Nebenbei:** Die Prüfung aus 4.266 („jedes Preset-Nomen hat ein Geschlecht")
hat sofort angeschlagen — sechs der neuen Requisiten fehlten in der Tabelle.
Genau dafür ist sie da.

**Neu:** `test/verwandlung.ts`, 42 Prüfungen, vier Gegenproben.

Gefragt (4.273.0): **„Wie können denn die Regler unter 2,5 zu stärkeren
Ausschlägen kommen?"** Zwei Antworten, beide gemessen — und die erste war ein
Fehler im Instrument, nicht in den Reglern.

**1 · Der Wirkungsmesser drehte an Stellungen, die es nicht gibt.**
`reglerListe()` hatte eine ABGESCHRIEBENE Liste, und sie war veraltet:

| Regler | gemessen | wirklich | falsch |
|---|---|---|---|
| Disruptor | none, cut, echo, swap | auto, off, on | **4 von 4** |
| Archetyp A | neutral, wanderer, waechter, trickster, schoepfer | neutral, skorpion, psychopath, entdecker | **4 von 5** |
| Ton | … melancholic, ironic … | … melancholisch, ironisch … | 2 von 6 |
| Markov | off, mix, strong | off, mix, on | 1 von 3 |
| Perspektive | … split | (kein split) | 1 von 6 |

Der Generator machte aus jeder unbekannten Stellung dasselbe — der Regler war
also eine zweite Blindprobe. Disruptor: **1,25 mit den erfundenen Stellungen,
3,34 mit den echten.**

Die Stellungen kommen jetzt aus `optionen.ts`, derselben Quelle wie die
Auswahlfelder. „auto" fällt weg: Es würfelt selbst und verschmiert die Messung.

**2 · Die Zahl der Läufe.** Die Blindprobe im Bild des Benutzers stand bei 2,46
— sie lag also selbst im Wirkungsband, und alles darunter war nicht schwach,
sondern ununterscheidbar. Gemessen, fünf Wiederholungen je Stufe:

| Läufe | Blindprobe (Median) | Spanne |
|---|---|---|
| 14 | 2,10 | 1,33–2,33 |
| 24 | 2,06 | 1,49–2,89 |
| 40 | **1,74** | 1,14–2,09 |
| 60 | 1,72 | 1,31–2,00 |

Vorgabe deshalb 40 statt 24, dazu die Stufe 90. Und der Hinweis unter dem
Ergebnis sagt jetzt, was zu tun ist, statt nur zu warnen.

**Was bleibt:** Modus (1,40) und Struktur (1,72) liegen auch mit richtigen
Stellungen und vielen Läufen nahe am Rauschen. Das ist kein Fehler des
Instruments — die neun Maße sehen schlicht nicht, was diese Regler tun. Ein Maß
dafür zu erfinden wäre der falsche Weg: „Ein Maß, das nur für dieses Instrument
erfunden wird, misst das Instrument."

**Neu am Prüfstand Wirkungsmesser:** Jede gemessene Stellung muss in der
Optionsliste stehen — die Prüfung, die den abgeschriebenen Stand verhindert
hätte. 22 → 53 Prüfungen, zwei Gegenproben.

Gewünscht und gebaut (4.272.0): **Themenpool im Sammler — 4W aus Wikidata.**

Gefragt war ein Themenpool („berühmte Filme und ihre Protagonisten,
Persönlichkeiten aus der Politik"), gefüllt über die KI, und dazu: „Oder kann
ich das kostenlos über einen Prompt über Wiki generieren?"

**Antwort: kostenlos ja — aber nicht mit einem Prompt, sondern mit Wikidata.**
Dort steht dieselbe Wissensbasis wie hinter Wikipedia, nur STRUKTURIERT: Beruf,
Geburtsort, Jahr, Werk als eigene Felder. Genau die vier W, ohne dass sie aus
einem Fließtext geraten werden müssen — derselbe Grundsatz, nach dem schon der
Tagesfeed zerlegt wird.

Drei Gründe, warum das der KI vorzuziehen ist:

* Jeder Eintrag trägt eine **Q-Nummer**. Man kann nachsehen, ob es die Person
  gibt. Ein Sprachmodell erfindet plausible Namen — für einen Pool, der echte
  Menschen enthalten soll, ist das der schlechteste Tausch.
* Es kostet nichts und braucht keinen Schlüssel.
* Die Felder kommen fertig getrennt, statt aus Prosa geschätzt zu werden.

Der Preis: Es gibt nur die Themen, für die eine Abfrage hinterlegt ist. Acht
sind es (Filmfiguren, Regie, Politik, Erfindungen, Musik, Entdeckungen,
Literatur, Bauwerke); SPARQL schreibt man nicht nebenbei.

**Neu:** `features/themenpool.ts` (Abfragen, Zerlegung, eigener Vorrat, Deckel
400), `ui/themenpoolView.ts` (Abschnitt im Sammler), Taste „Thema" im Studio und
der Pool als **vierte Quelle** in `offeneQuellen`/`ziehQuelle`.

**Entwurfsentscheidung, die beim Messen entstand:** Je Thema ein eigenes
Handlungsverb (`wasSatz`). Ein allgemeines trug nicht — „arbeitet an Die
Dreigroschenoper" hatte den Kasus verfehlt, und eine Filmfigur „arbeitet" nicht
an ihrem Film. Jetzt: „schreibt „X"", „dreht „X"", „ersinnt X", „ist X".
Werktitel stehen in Anführungszeichen, dann müssen sie nicht gebeugt werden.

**Drei Fallen der Wikidata-Antwort, alle geprüft:** Ohne Beschriftung liefert
sie die nackte Q-Nummer zurück (die gehört nicht in einen Text); dieselbe Zeile
kommt mehrfach, sobald eine optionale Angabe mehrere Werte hat; und Jahre vor
Christus stehen negativ da.

**Ungeprüft und nicht prüfbar:** ob Wikidata antwortet. Der Sandkasten dieses
Bauraums kommt nicht ins Wikimedia-Netz — dasselbe gilt seit jeher für den
Tagesfeed. Geprüft ist die Zerlegung gegen nachgebildete Antworten, die Form
der Abfragen, der Vorrat und das Ziehen. Ein grüner Lauf sagt nichts über den
Dienst; das sieht nur der Browser.

**Neu:** `test/themenpool.ts`, 114 Prüfungen, vier Gegenproben.

Gemeldet und behoben (4.271.1): **„Die Schrift in den Shots ist kaum lesbar."**
`.kling-shot span` hatte `color:#e7ebf2` fest in der Regel — den Textton des
DUNKLEN Themes. Im hellen Thema „Papier" ist `--text` fast schwarz, und die
Shots standen weiß auf weiß. Dazu `.kling-link:hover` mit dem dunklen
Akzent-Hover: Der blaue Knopf wurde beim Überfahren violett.

**Neu am Prüfstand Studio, und wichtiger als der Einzelfall:** Kein Selektor
außerhalb der Theme-Blöcke darf mehr einen Farbwert benutzen, den ein Theme als
Variable führt. Ausgenommen ist `#fff` — Weiß auf einer Akzentfläche und das
Papier der Druckseite sind gewollt und gerade nicht themenabhängig. Von 19
verdächtigen Stellen war genau eine ein Fehler; die Prüfung hält das jetzt fest.

**Falle:** Die erste Fassung der Prüfung schlug auf ihrem eigenen Kommentar an —
der nennt die alte Farbe, um zu erklären, warum sie weg musste. CSS-Kommentare
werden jetzt vorher entfernt.

Zwei Befunde am Bericht (4.271.0):

**1 · „Bei Berichten fällt das Wetter kurz."** Gemessen galt das für ALLE
Ressorts — und schlimmer: Der Bericht wurde bei großen Zielen KÜRZER.

| Ziel | vorher | nachher (ein Preset) | nachher (zehn Presets) |
|---|---|---|---|
| 220 | 237 (108 %) | 236 | 241 (110 %) |
| 320 | 212 (66 %) | 244 | 329 (103 %) |
| 450 | 189 (42 %) | 251 | 409 (91 %) |
| 600 | 186 (31 %) | 267 | 446 (74 %) |

Ursache: `mische()` deckelt die freien Sätze auf die Zahl der FAKTENsätze, und
die Fakten lagen fest (2–3 Zahlen, 3 Chronologieschritte, 2 Zitate). `extra`
wuchs bis 22, die Schleifen sammelten 23 freie Sätze — und der Deckel warf alle
bis auf fünf weg.

**Der Deckel bleibt.** Er hält das Verhältnis Fakt zu Bild, und das ist der
Grund, warum der Bericht ein Bericht ist. Stattdessen wachsen die FAKTEN mit dem
Ziel: bis zu drei Zahlen mehr, bis zu zwei Chronologieschritte mehr, eine dritte
Stimme ab Ziel 380. Dazu zwei neue Abschnitte, beide faktisch: **Chronik**
(die Zwischenschritte) und **In Zahlen** (was in Hergang und Hintergrund nicht
untergekommen ist).

**Die verbleibende Grenze ist die Wortbank**, nicht mehr die Bauart: mit einem
einzelnen Preset (51 Einträge) endet der Bericht bei 43 % einer
600-Wörter-Vorgabe, mit zehn vereinten Presets bei 74 %. Für lange Berichte
mehrere Presets ankreuzen — dasselbe gilt seit jeher für die Rekombination.

**2 · „Immer wieder Meter-Angaben."** „Ausdehnung: 278 Meter" stand in etwa
jedem zweiten Bericht von sieben der neun Ressorts. Gesundheit und Wetter hatten
schon eigene Größen und deshalb gar keine Meter — genau das war der Hinweis.

Jetzt führt JEDES Ressort seine eigene Größe: Meter Kaimauer und Quadratmeter
Hallenfläche (Wirtschaft), Sitze und Stimmbezirke (Politik), Sitzplätze und
Exponate (Kultur), Punkte und Meter Laufbahn (Sport), Messreihen und Datensätze
(Wissenschaft), Quadratmeter Nutzfläche und Plätze (Gesellschaft), Klassenräume
und Wochenstunden (Bildung). Die nackten Einheiten „Meter" und „Quadratmeter"
sind aus der allgemeinen Liste entfernt.

**Warum das reicht:** `ziehFaktenblatt` nimmt aus der allgemeinen Liste nur
Rollen, die das Ressort NICHT abdeckt. Da jedes Ressort jetzt eine `groesse`
führt, kann keine allgemeine mehr einspringen. Die Prüfung setzt genau dort an —
die Gegenprobe „einem Ressort die Größe nehmen" bringt die nackten Meter sofort
zurück.

**Neu:** `test/ressort.ts`, 22 Prüfungen, vier Gegenproben.

Behoben (4.270.0): **Die Dramaturgie verlor ihren Höhepunkt.**

Sie ist die einzige Struktur, die noch über die Schablonen baut, und die
einzige, die aus dem ERZÄHLBOGEN des Presets schöpft statt aus den sieben
Bank-Kategorien. Ihr Versprechen ist der vollständige Bogen — und sie hielt es
nicht: Der Höhepunkt fehlte in **41 von 120 Texten (34 %)**.

Ursache war `coherencePass`. Die Regel wirft im letzten Absatz ab der Mitte
jeden Satz weg, dessen Inhaltswörter nichts mit dem Motivgeflecht teilen. Der
Höhepunkt steht am Ende, und sein Wortlaut („die Akte trägt den eigenen Namen")
teilt oft kein Wort mit dem übrigen Text — genau das Merkmal, an dem die Regel
ein verirrtes Atom erkennt. Bisektiert: Mit ausgeschalteter Regel 0 von 120, mit
ihr 41.

Behoben an der Wurzel: **Der Erzählbogen gehört zum Motivgeflecht — er IST es.**
Alle Wörter der acht Bogen-Felder gehen jetzt in die Motivmenge. Damit gilt kein
Wortlaut des Bogens mehr als unverbunden, und die Regel bleibt für alles andere
scharf.

Gemessen über ALLE 51 Presets mit Bogen, je drei Läufe, drei Ziellängen:
Einstieg 0 Ausfälle, Mitte 0, Höhepunkt 1–3 von 204 (unter 1,5 %).

**Falle beim Messen:** Der erste Matcher verlangte drei aufeinanderfolgende
Inhaltswörter und meldete deshalb jeden kurzen Bogen-Eintrag als fehlend — 11
von 204 „Ausfällen" waren meine Messung, nicht das Programm. Kurze Einträge
brauchen eine eigene Regel (alle Wörter müssen vorkommen).

**Zweiter Befund, nicht behoben:** `enforceWordTarget` kürzt einen zu langen
Text VOM ENDE her. Bei einer Ziellänge unter der Rohlänge fällt damit der
Schluss des Bogens weg. In der Messung trat das nicht auf (die
Dramaturgie-Texte liegen bei 190–199 Wörtern), bei kleinen Zielen ist es aber
angelegt.

Prüfstand Struktur 34 → 40, zwei Gegenproben.

Gefragt und umgebaut (4.269.0): **„Wie unterscheiden sich Linear bis Objekt von
der Rekombination — und können sie dem Sinn nach genauso gebaut werden?"**

Gemessen zuerst, je 120 Texte mit festgehaltenen übrigen Einstellungen:

| | Phrasenwdh. | Tempusbruch | Perspektivbruch | Wörter (Ziel 200) |
|---|---|---|---|---|
| linear | 0,039 | 0,078 | 0,059 | 191 |
| reverse | 0,040 | **0,183** | 0,096 | 191 |
| circle | 0,057 | 0,075 | 0,066 | 191 |
| fragment | 0,056 | 0,080 | 0,057 | 191 |
| object | 0,047 | 0,081 | **0,190** | 191 |
| rekombination | **0,010** | 0,057 | 0,046 | 171 |

Und die Ähnlichkeit untereinander: Die fünf Schablonen glichen einander zu
**0,57–0,63**, die Rekombination lag bei **0,37–0,41** zu allen. Die Wahl
zwischen den fünf änderte also weniger als die Wahl des Bauwegs.

**Die Antwort: ja — die fünf sind dem Sinn nach keine eigenen Maschinen,
sondern ANORDNUNGEN.** Der Assembler baut ohnehin in Phasen (Exposition,
Verdichtung, Umschlag, Schluss). Linear erzählt sie vorwärts, Reverse
rückwärts, der Kreis kehrt am Ende zur Exposition zurück, das Fragment springt,
das Objekt dehnt die Mitte. `STRUKTUR_PHASEN` in `assemble.ts` hält die fünf
Folgen; jede hat zehn Schritte.

Nach dem Umbau: Phrasenwiederholung 0,010–0,012 bei allen, Tempusbruch
0,045–0,055, Perspektivbruch 0,046–0,050. Reverse von 0,183 auf 0,050, Objekt
von 0,190 auf 0,048. Der Preis ist die Länge: 172–179 statt 191 von 200.

**Das Risiko war die Angleichung — sie ist nicht eingetreten.** Die fünf gleichen
einander jetzt zu 0,41–0,47 statt 0,57–0,63: Sie sind einander UNÄHNLICHER
geworden, nicht ähnlicher.

**Belegt an der Stelle des Schlussbildes:** linear 100 % der Textlänge, reverse
7 %, circle 76 %. Die Anordnung kommt also wirklich an.

**Drei Fallen dabei:**

1. `if (zielWoerter - woerterJetzt() > ENDE_MARGE)` filterte das Schlussbild weg,
   solange noch viel Text fehlte. Bei Reverse liegt die Phase „schluss" am
   ANFANG — die Regel hat das Schlussbild in 80 von 80 Läufen entfernt. Sie gilt
   jetzt nur, wenn die Struktur den Bogen vorwärts erzählt (`schlussAmEnde`).
2. Dasselbe für `if (a.kategorie === "endings") break;` — bei Reverse hätte das
   den Text nach dem ersten Atom beendet.
3. **Phase ≠ Stelle im Text.** „Der Kreis schließt sich:" gehört ans ENDE DES
   TEXTES. Als Phasenmarke „schluss" stand der Satz bei Reverse im ersten
   Absatz. Kennsätze tragen deshalb `stelle: "anfang" | "ende"`, nicht `phase`.

**Nicht zusagbar:** dass der Kennsatz NIE nach vorn rutscht. Der Assembler setzt
ihn bei 82 % der Ziellänge, danach hängt `enforceWordTarget` noch an. Der
Prüfstand sagt deshalb den MEDIAN zu (90 %), nicht den Einzelfall — zwei
schärfere Fassungen waren Wackelkandidaten.

**Auffang:** Die alten Schablonenbauer bleiben. Liefert der Assembler nichts
(leere Wortbank), wird gebaut wie bisher.

**Neu:** `test/struktur.ts`, 34 Prüfungen, vier Gegenproben.

Aus Ausgabe Nr. 46 und den zwei offenen Punkten (4.268.0):

**1 · „Der Jugendliche besteht seit 1861."** Die Bestandsformel gilt für
Einrichtungen. Die Vorgabe war: alles, was keine ERKANNTE Person ist, ist eine
Einrichtung — und die Liste der Gattungspersonen ist eine Aufzählung. Jetzt
umgekehrt: `istEinrichtung()` (Rechtsform, Amt, Verein, Werk, Theater …) muss
zutreffen, sonst gibt es den neutralen Satz „Der Vorgang reicht bis … zurück."
Lieber blass als falsch. `PERSON_NOMEN` zusätzlich um rund 40 Einträge erweitert.

**2 · „Ein Schulmädchen, das Karten fälscht bemerkt: …"** Der nachgestellte
Relativsatz der Figur wurde nie geschlossen. `schliesseFigurenkomma()` setzt das
Komma — möglich nur, WEIL die Figur wörtlich bekannt ist; ein allgemeiner
Relativsatz-Erkenner wäre hier so unzuverlässig wie alle anderen. Dazu:
`applyTension()` und `applyRhythm()` trennten an JEDEM Komma und schnitten die
Figur auseinander („Das Karten fälscht sucht die Spur"). `NEBENSATZ_ANFANG`
hält sie davon ab.

**3 · „HOCH IN · WETTER"** — ein Fehler MEINER Reparatur aus 4.265: `dachOrt()`
kappte auch an einem bloßen „der", und aus „hoch in der Luft" wurde „Hoch in".
Jetzt fallen führende Umstandswörter weg, und gekappt wird nur an eindeutigen
Marken (wo/worin/woran/welcher).

**4 · Der Faktenkasten mitten im Absatz.** Die Zeilenregel aus 4.265 greift
nicht, wenn er in einem Satz steht. Jetzt zusätzlich satzweise — bis zu einem
Punkt, dem ein Großbuchstabe folgt, denn der Punkt in „3.660" ist keiner.

**5 · Der abgeschnittene Relativsatz** („…, der insbesondere durch Bauten im
Dienst deutscher Fürsten") endet auf einem Nomen; die Wortprüfung sah nichts.
Ein deutscher Relativsatz steht in Verbletztstellung — endet er auf einem
GROSSGESCHRIEBENEN Wort und trägt kein kleingeschriebenes Verb, fehlt sein Ende.

**Falle, die zweimal zugeschlagen hat: `\b` ist in JavaScript ASCII.** Zwischen
„F" und „ü" sieht die Wortgrenze eine Grenze — „Fürsten" galt dadurch als Verb
„ürsten". Betroffen waren `SP_ENDS_VERB` (seit 4.265) und die neue
Relativsatz-Regel. Für deutsche Wörter immer explizite Grenzen:
`(?:^|[^A-Za-zÄÖÜäöüß])…(?![A-Za-zÄÖÜäöüß])`.

Prüfstand Nr. 44 74 → 90, acht Gegenproben.

**Wichtig für die Beurteilung von Ausgaben:** Nr. 46 wurde vor 4.267 gesetzt.
Der Lynar-Satz und der Faktenkasten darin waren bereits behoben — sie standen
nur noch in dieser Ausgabe. Vor dem Reparieren immer erst nachstellen, ob der
Befund mit dem aktuellen Stand überhaupt noch auftritt.

Vorgeschlagen und gebaut (4.267.0): **Abgeschnittene Sammler-Funde am Komma
kürzen.** Im Blatt stand „… wird der italienische Festungsbaumeister und Militär
Rochus zu Lynar geboren, der insbesondere durch Bauten im Dienst deutscher
Fürsten wie der." `wasPhrase()` kappt lange Wikipedia-Auszüge nach 170 Zeichen
und suchte nur nach einem Satzende; fand es keines, brach es mitten in der
Phrase ab. Jetzt wird am letzten Komma gekürzt — dort endet die letzte
vollständige Fügung. Übrig bleibt ein ganzer Satz, nur kürzer.

Dazu `kuerzeAmBruch()` in `text-utils.ts`, das auch rettet, was schon
abgeschnitten im Vorrat liegt (`formeWas` ruft es). Ohne Komma fällt das
hängende Wort weg statt des ganzen Fundes.

**Zwei Fallen dabei, beide beim Messen aufgefallen:**

1. Die Liste der hängenden Wörter darf KEINE trennbaren Präfixe enthalten. Die
   erste Fassung machte aus „Er kommt an" ein „Er kommt". Dieselbe
   Unterscheidung braucht schon `istAbgeschnitten()` in `postprocess.ts`.
   Ein Präfix am Ende wird nur dann abgeworfen, wenn das Wort davor
   GROSSGESCHRIEBEN ist — „… seit vielen Jahren auf" ist abgeschnitten,
   „Er kommt an" nicht.
2. Eine Mindestlänge in `kuerzeAmBruch()` wäre verheerend: Die Funktion läuft
   auch über frei getippte Felder. Eine Untergrenze von fünf Wörtern hätte
   „sucht eine Akte" stillschweigend geleert.

Prüfstand Nr. 44 63 → 74, drei Gegenproben.

Gefragt (4.266.0): **„Wie kann die Textmaschine mit der Perspektive Du bei so
einer Vorgabe umgehen?"** Vorgelegt war ein Absatz mit drei verschiedenen
Fehlern, alle nachgemessen:

**1 · Das Pronomen stand in einer Apposition.** „In der Toskana wird der
italienische Festungsbaumeister und Militär **du** geboren." Der Figurenname kam
aus dem Sammler und stand im selben gesammelten Satz — `swap()` ersetzte ihn
überall, auch dort, wo kein Pronomen stehen kann. Gemessen: 31 % der Du-Texte.
Ersetzt wird jetzt nur in SUBJEKTSTELLUNG: am Satzanfang, nach Satzzeichen, nach
einer Konjunktion oder nach einem finiten Verb (Inversion). Steht davor ein
Nomen oder Adjektiv, bleibt der Satz in der dritten Person. Der Preis ist eine
gemischte Perspektive im selben Text — in deutscher Prosa üblich, ein Pronomen
in einer Apposition nicht.

**2 · Kurze Verben wurden nicht gebeugt.** „Du erbt ein Amt." Die Erkennung
verlangte `{4,}` Buchstaben vor dem -t, „erbt" hat drei. Gemessen: 28 % der
Du-Texte. Jetzt `{3,}` mit einer Sperrliste für Adjektive auf -t
(`KEIN_VERB_AUF_T`) — sonst würde aus „alt" ein „alst".

**3 · Der Akkusativ entstand nicht.** „Du hältst **ein leerer Thron** unter einem
Baum fest." `declineHookPhrase()` gibt die Phrase unverändert zurück, wenn das
Geschlecht des Nomens unbekannt ist — und **166 Nomen** der Presets hatten
keinen Eintrag in `NOUN_GENDER`: Thron, Takt, Duft, Vertrag, Umschlag … Alle
eingetragen. Der Prüfstand Perspektive fordert das jetzt für JEDES Nomen, das
ein Preset mit unbestimmtem Artikel führt.

**Merksatz zu 3:** Das ist die dritte Ausgabe in Folge, in der eine fehlende
Genus-Angabe den Fehler verursacht hat (4.262: Frist/Beweis, 4.266: 166 Nomen).
Wer ein Preset erweitert, muss `NOUN_GENDER` mit erweitern — die Endungsregel
rät, und sie rät oft falsch.

Prüfstand Perspektive 32 → 45, drei Gegenproben.

Aus der Analyse von Ausgabe Nr. 44 (4.265.0) — fünf Reparaturen, alle vorher
gemessen:

**§ 1 · Der Kontextwürfel baute eine zweite Figur.** `roll()` hängt in der
Hälfte aller Würfe einen Zusatz mit KOMMA an die Figur an. Das Komma ist aber
schon vergeben: Es trennt die Sprecher einer Szene. 4 der 20 Zusätze rutschten
durch `splitSpeakers()` und wurden zum Satzsubjekt: „Voller ungestellter Fragen
tritt einen Schritt zurück." Die alte Fassung zählte auf, was ein Zusatz IST —
eine Aufzählung wird nie vollständig. `istEigenePerson()` fragt jetzt umgekehrt:
Sieht der Teil aus wie eine Nominalphrase (Begleiter oder großgeschriebener
Name)? Alles andere gehört zur vorigen Person. Dazu `personKopf()`: Als
SATZSUBJEKT taugt nur der Kopf ohne Verzierung — Rhythmus und Disruptor machen
aus dem Komma eine Satzgrenze, und dann stand die Verzierung wieder am
Satzanfang. Ein bestimmender Relativsatz bleibt („ein Schulmädchen, das Karten
fälscht"). Und `rekombination.ts` trennte an derselben Stelle von Hand am Komma
statt über `splitSpeakers` — 35 % der Sätze bekamen dort die Verzierung als
Nebenfigur.

**§ 2 · Die Meldung prüfte ihr fremdes Material nicht.** Alle vier Meldungen aus
Nr. 44 nachgestellt: `pruefeMeldung` meldete in allen vier NICHTS. Behoben:
Platzhalter „am Ort" ersatzlos gestrichen (eine Meldung ohne Ort lässt ihn weg,
statt ihn zu behaupten), „tagsüber" in die Zeitadverbien (daher „Im tagsüber bei
teilweise bewölktem Himmel"), `formeWas()` formt Sammler-Material um
(Klammereinschub, weiches Trennzeichen, alles hinter dem ersten Satzende und
hinter einem Semikolon), und der Vorspann kennt jetzt DREI Fälle statt zwei —
eine bloße Nominalphrase steht allein hinter dem Doppelpunkt, statt ein Subjekt
davorgesetzt zu bekommen („Die Person eine Wandmalerei"). Vier neue Prüfungen.

**Falle bei § 2:** Die erste Fassung der neuen Prüfung suchte nach einem
FEHLENDEN PRÄDIKAT und meldete 1400 von 2880 tadellosen Meldungen. Einen
verlässlichen Erkenner für das finite Verb im deutschen Hauptsatz gibt es hier
nicht. Gesucht wird jetzt nach der FORM des Fehlers: zwei Nominalphrasen
hintereinander.

**§ 3 · Zwei Türen, ein Schloss.** `corpusSanitize()` reinigte nur das
Markov-Lernen; der Regler „Korpus-Bausteine" las den Korpus ROH. So kam
„Faktenkasten · Betroffen: 3.840 Haushalte" in einen Prosaabsatz. Beide Wege
gehen jetzt durch dieselbe Reinigung, und `GERUEST_ZEILE` kennt auch den
Faktenkasten, „Kurz gemeldet" und die Fußzeile der Zeitung selbst. Nebenbei: Die
Zeitstempel-Regel entfernte die Uhrzeit und ließ die Präposition stehen —
„Gegen und der Blick blieb."

**§ 4 · Satzdubletten.** Gemessen 22 von 200 Texten (11 %).
`entferneDubletten()` wirft den zweiten von zwei gleichen Nachbarsätzen weg,
auch die verkleidete Fassung mit Gedankenstrich. Sie läuft GANZ ZUM SCHLUSS,
nach `enforceWordTarget` — das Auffüllen auf die Ziellänge war die Hauptquelle,
vorher zu putzen half fast nichts. Neu 0 von 200.

**§ 5 + § 6 · Dachzeile und Kurzname.** `dachOrt()` wirft auch den unbestimmten
Artikel, alles hinter dem ersten Komma und einen angehängten Relativsatz weg;
bleibt etwas über 28 Zeichen übrig, gibt es KEINEN Ort und die Dachzeile trägt
nur das Ressort. `kurzPerson()` nimmt das letzte Wort nur noch, wenn kein
Begleiter davorsteht und die Angabe kurz ist — „das Register aller falschen
Namen" wurde sonst zu „Namen".

**Prüfstand angepasst:** Die Regel „Abschnitt unter 12 Zeichen = leer" traf jetzt
die kurze, richtige Dachzeile („Bildung"). Sie gilt nur noch ab dem zweiten
Abschnitt; die Dachzeile wird stattdessen auf Platzhalter und Länge geprüft —
eine schärfere Regel, keine weichere.

**Neu:** `test/nr44.ts`, 63 Prüfungen, neun Gegenproben.

Gefragt und geändert (4.264.0): **„Wird bei Alles würfeln auch Wiki und
Abschrift mitgenommen?"** Bis dahin nicht — der Knopf zog die vier W allein aus
der Welt, während zwei gefüllte Vorräte danebenlagen. Jetzt wird die QUELLE
mitgewürfelt: Welt, Wiki-Vorrat oder Bildvorrat. Die Welt ist immer dabei (sie
legt sich selbst an), Wiki und Abschrift nur mit gefülltem Vorrat — sonst würfe
der Knopf mal ins Leere, ohne dass man sähe, warum. Die Regel steht rein und
geprüft in `features/kontext.ts` (`offeneQuellen`, `ziehQuelle`; der Zufall ist
ein Parameter, sonst ließe sich „jede Quelle kommt vor" nicht messen).

Die Hinweiszeile unterscheidet jetzt drei Fälle statt zwei: „Wiki · Titel: 3 von
4 Feldern", „alle vier Felder sind gesperrt" und „Welt: nichts Neues dabei".
Bei einem Vorrat mit einem einzigen Fund passiert das Dritte dauernd, und es
sah bisher aus wie das Zweite.

**Hilfe vollständig überarbeitet** — Reiter Autopilot, KI-Lehrer, Drucken; Form
Bericht; Wiki, Abschrift und die Schlösser in der Kontextzeile; die
Perspektive Objekt; die Stellschrauben, ihre Schlösser und die Sofortwirkung im
Werkzeugkasten; die Ansicht „Struktur" mit den Chips und den ziehbaren Balken;
Varianzanzeige und Musterseite beim Autopiloten.

**Neu: `test/hilfe.ts`, 24 Prüfungen.** Eine Hilfe veraltet lautlos — sie wird
nicht ausgeführt. Der Prüfstand liest die Reiterliste AUS `app.ts` (eine Kopie
veraltete genauso) und fordert für jeden einen eigenen Eintrag, prüft jeden
Querverweis gegen die vorhandenen Abschnitte und hält 19 Neuerungen als Marke
fest. Dazu die alte Falle: ein gerades `"` als schließendes deutsches
Anführungszeichen beendet in TypeScript die Zeichenkette — das hat `helpView.ts`
schon mehrfach zerlegt und wird jetzt gemeldet statt gebaut.

**Aufgeräumt:** Drei Regex-Prüfungen im Prüfstand Studio, die den Klick-Rumpf von
„Alles würfeln" im Quelltext nachlasen, sind weg. Sie mussten bei jeder
Umformulierung nachgezogen werden und haben nie einen Fehler gefunden; was der
Knopf tut, wird jetzt an der laufenden Oberfläche gemessen.

**Falle:** Prüfungen auf einen erzeugten Satz dürfen NICHT auf dem Schlusspunkt
bestehen. Die Satzlängen-Zusammenziehung bindet ihn an seinen Nachbarn und
nimmt ihm das Satzzeichen — das ergab einen Wackelkandidaten mit 1 Fehler in 60.

Aus Ausgabe Nr. 41 (4.263.0): Die Objektperspektive steht, aber die Probe hat
zwei ältere Filter aufgedeckt, die mehr wegwarfen als gedacht.

**Der Bruchstück-Filter in `coherencePass()`.** Er fragte nur: „Endet der Satz
auf einem Funktionswort?" Gemessen warf er damit **73 tadellose Preset-Sätze**
weg — 3 % aller Bank-Sätze bis zwölf Wörter: „Die Stadt springt mich an.", „ein
Blick löst Panik aus", „Und das Meer bleibt, wie es ist." Deutsche Sätze enden
sehr wohl auf einem trennbaren Präfix oder auf der Kopula. Jetzt zwei Klassen
(`istAbgeschnitten()`): Artikel und Konjunktionen bleiben verboten, trennbare
Präfixe und `ist/sind/wird` nur ohne finites Verb im Satz. Neu 1 statt 73.

**Das Gerüst der eigenen Multi-Shot-Ausgabe im Korpus.** „WAS: will die Spur
bewusst auf" stand mitten in einem Prosaabsatz. Wer eine Sequenz in den Korpus
legt, legt ihre Kopfzeilen mit hinein. `corpusSanitize()` wirft sie jetzt
zeilenweise weg (VOR dem Entfernen der Klammern, sonst ist „(3s)" schon weg),
behält aber die Sätze hinter `Shot n (3s)` und `DE:`. Dieselbe Marke prüft der
Korpus-Zweig in `rekombination.ts`.

**Falle:** `hatFinitesVerb()` erkennt die ERSTE PERSON nicht. Deshalb heißt der
Rahmensatz „… und zähle die Tage." und nicht „… und zähle mit." — sonst hätte
ihn der Bruchstück-Filter weiter geschluckt (gemessen 9 von 60).

**Neu:** `test/schliff.ts`, 43 Prüfungen, zwei Gegenproben.

**Noch offen, in Nr. 41 gesehen, nicht angefasst:** „Kaum ausgesprochen, Die
Sonne steht still" (Großschreibung nach Komma), „ist in der Flughafen Salzburg
bekannt geworden" (Kasus bei Sammler-Namen im Meldungsrahmen), „Die Burg liegt
tiefer im Nebel des Saals verliert" (zwei Verben aus zwei Bausteinen).

Gemeldet und behoben (4.262.0): **Die Perspektive „Objekt" stand im Text.**
Ausgabe Nr. 40, Aufmacher: „(das Objekt) Ein Augenblick dauert eine ganze
Straße …". `applyPerspective()` setzte für diese Perspektive nur eine
Regieanweisung vor jeden Absatz — ein Etikett, keine Perspektive. Der
Zeitungssetzer baut die Überschrift aus dem Textanfang, also stand es fett auf
der Seite.

Jetzt spricht das Ding: ein Rahmensatz in der ERSTEN Person am Anfang, der
Körper des Absatzes bleibt in der DRITTEN. Das ist keine Bequemlichkeit — ein
Gegenstand, der von Menschen erzählt, tut das in der dritten Person, und jede
andere Fassung müsste jedes Verb im Text umbeugen. Genau daran ist die
Umstellung „Ich/Du/Wir" schon einmal gescheitert.

Drei Nebenbefunde beim Messen:

* Der Rekombinationsweg hatte das Wort `"das Objekt"` fest im Programm. Er zieht
  jetzt ein Ding aus dem Realitätsmodus.
* „Ich bin Prozess." — `buildObjectCentric()` setzte das Nomen ohne Artikel.
  Neu: `objektName()` in `shape.ts`.
* Die Endungsregel von `guessGender()` riet bei „Frist" maskulin und bei
  „Beweis" neutrum. Alle 58 Nomen der Realitätsmodi stehen jetzt in
  `NOUN_GENDER`, und der Prüfstand schlägt an, sobald jemand eines hinzufügt,
  ohne es einzutragen.

**Falle:** Die Ton-Einleitung wird in `postProcessText()` VOR den Text gesetzt.
Sie hätte den Rahmensatz nach hinten geschoben und die Überschrift wieder
mitten im Satz abgeschnitten. `OBJEKT_KOPF_RE` hält sie dahinter. Wer die
Rahmensätze ändert, muss diese Regex mitändern.

**Verworfen und warum:** Eine Schlusszeile („Sie nennen es Zufall. Ich nenne es
Erinnerung.") stand in 12 von 30 gemessenen Texten am Ende nicht mehr da, wo sie
hingehört — die Nachbearbeitung hängt weiter an, die Satzlängen-Zusammenziehung
zerlegt sie. Ein Rahmen, der nur manchmal hält, ist keiner.

**Neu:** `test/perspektive.ts`, 31 Prüfungen, vier Gegenproben.

Gemeldet und behoben (4.261.0): **„Bei dem Werkzeugkasten funktioniert das
Schloss nicht."** Der Verdacht des Benutzers traf: Werkzeugkasten und die Chips
unter der Ansicht „Struktur" zeigen DASSELBE Auswahlfeld, waren aber nicht
gleichgeschaltet. Gemessen an der laufenden Oberfläche (jsdom): Der Chip erzeugte
sofort neu, das Feld im Werkzeugkasten NICHT — `liveRegen` hing nur an fünf von
sechzehn Reglern (Preset, Ton, Form, Spannung, Figurendisziplin). Struktur,
Modus, Perspektive, Rhythmus, Instabilität, Markov, Disruptor, Varianz änderten
still den Zustand und ließen den alten Text stehen. Und nur das Feld im
Werkzeugkasten trug ein Schloss; am Chip ließ sich dieselbe Einstellung
unbemerkt wieder umstellen, wobei der gemerkte Schlosswert stumm mitwanderte.

Jetzt: `liveRegen` an allen Reglern, ein Schloss an beiden Stellen mit
gemeinsamem Zustand, und die Stellschrauben (Fügeteil-Deckel, Satzlänge …)
haben erstmals überhaupt eines — samt `regle(ist, gesperrt?)`, das eine
gesperrte Schraube nicht mehr nachregelt.

**Falle:** Ein Schloss kann seit dieser Fassung an mehreren Stellen im DOM
stehen. `lockPainters` führt die Maler deshalb MIT ihrem Knopf und wirft
abgehängte weg — die Chipzeile wird bei jeder Erzeugung neu gebaut.

**Neu am Prüfstand Studio:** Er baut das Studio jetzt wirklich auf. jsdom mit
`pretendToBeVisual` und rund zwanzig gesetzten Globals trägt `mountStudio()`;
Knöpfe werden geklickt, Werte gelesen, Erzeugungen über den Schnappschuss
gezählt. Die Kopfzeile des Prüfstands behauptete acht Monate lang das Gegenteil.
Was jsdom NICHT kann: Layout rechnen — wie es aussieht, bleibt ungeprüft.

Gemeldet und behoben (4.260.1): **„Wer wird nicht gewürfelt."** Gemessen: Eine
frische Welt hatte GENAU EINE Figur und EINEN Ort — dreißig Züge ergaben
dreißigmal dasselbe. `WELT_SAAT` legt jetzt sechs Figuren und sechs Orte an,
und die gespannten Figuren werden BEVORZUGT statt ausschließlich gezogen (zwei
von drei Zügen): Hat nur eine Spannung, kam sonst immer dieselbe. Jetzt 6
verschiedene Figuren und 5 Orte in 30 Zügen.

Und die Frage nach den Schlössern: Sie gelten — aber die Antwort stand nur im
Klickzusammenhang eines 1600-Zeilen-Moduls. Die Regel ist jetzt eine reine
Funktion (`features/kontext.ts`, `uebernehmeKontext()`) mit eigenen Prüfungen:
Gesperrtes Feld bleibt, leerer Vorschlag überschreibt nichts. Die Knopfzeile
meldet außerdem, wie viele der vier Felder wirklich bewegt wurden — „alle vier
Felder sind gesperrt" ist etwas anderes als „nichts passiert".

**Ton-Vorräte verdoppelt**: 12 Eröffnungen und 18–20 Einschübe je Ton (vorher 6
und 10–12). Der Prüfstand hält Mindestgrößen fest, verbietet Dubletten und
prüft, dass kein Einschub in zwei Tönen steht — ein Ton, dessen Sätze auch
anderswo vorkommen, ist kein eigener Ton.

**Schließkreuz** in Test & Ranking, Werkzeugkasten und Einstellungen. Es klappt
zu statt umzuschalten (`stopPropagation`), und es ist nur im offenen Feld
sichtbar.

**Druck:** sechs Profile (zeitung, fliesstext, vers, haiku, buehne, shots) plus
der **Zeitungssetzer** mit gestaltbarem Kopf, Automatik über mehrere Seiten und
Nachmessen am fertigen Satz.

**Bildsammler** (seit 4.234.0, im Reiter „Sammler" unter dem Tagesfeed): Fotos
werden zu Korpussätzen und 4W-Kontext — der erste Weg in die Maschine hinein,
der nicht über Sprache führt. Das Bild wird geschickt und NICHT behalten; es
bleibt nur Text, deshalb gibt es hier weder eine Bilderzahl noch ein
Speicherlimit. Der Kern ist nicht die Anbindung (`callClaudeBild` in `ki.ts`,
Base64 im Nachrichtenkörper), sondern der **Beutefilter** in
`features/bildsammler.ts`: Ein Modell, das man um eine Bildbeschreibung bittet,
liefert „Das Bild zeigt …", und als Korpusfutter ist das Gift — jeder Eintrag
begänne gleich, und die Maschine würfelte fortan „Das Bild zeigt"-Sätze. Der
Prompt verbietet jeden Bildbezug, `verraetBild()` setzt es durch (ein Prompt ist
eine Bitte, kein Riegel), und die 4W-Felder laufen durch denselben Filter, weil
sie im Studio in JEDEN erzeugten Text wandern. Nichts geht ungesehen in den
Korpus: Zwischen Antwort und Übernahme steht eine Vorschau mit einzeln
abwählbaren Sätzen, und das Verworfene ist aufklappbar — daran sieht man, ob
der Prompt taugt oder der Filter zu scharf steht. Kostenkonto gemeinsam mit dem
KI-Lehrer.

**Bildvorrat und Abschrift** (seit 4.235.0): Der Bildsammler legt seine 4W in
einen EIGENEN Vorrat (`divergenz_bildvorrat_v1`), aus dem im Studio die Taste
„Abschrift" zieht — so wie „Wiki" aus dem Sammler-Vorrat zieht. Zwei Ablagen
und nicht eine, weil das Material verschieden ist: Der Feed gibt Ereignisse,
ein Foto gibt Dinge und Orte. Kennung ist NICHT der Dateiname (Handykameras
vergeben ihn nach einem Zurücksetzen erneut), sondern die vier Felder, jedes
für sich normalisiert.

Daneben der Bereich **Abschrift** im Sammler: Text von einer abfotografierten
Seite, als zusammenhängender Text in den Korpus. Er ist das Gegenteil des
Bildsammlers, obwohl beide `callClaudeBild` benutzen — hier wird NICHT
gefiltert und NICHT formuliert. Eine Abschrift zu filtern hieße, sie zu
fälschen. Der Wert des Prompts steckt in den Verboten: nicht ergänzen, nicht
modernisieren, nicht verbessern, Unleserliches als `[unleserlich]` statt
geraten. Vorgabe ist hier Sonnet und nicht Haiku — ein Verlesen an Fraktur
kostet mehr als der Preisunterschied, weil es unbemerkt im Korpus landet. Der
Text bleibt vor der Übernahme änderbar; Nachbessern ist die Regel.

**Bildwelt** (seit 4.236.0, ersetzt den Reiter „Montage"): Wortbänke aus
Bildern. Gelesen wird im Sammler unter „Bilder als Material" — dasselbe Foto
durch mehrere Blickwinkel (die sechs Realitätsmodi aus `modes.data.ts`, keine
eigene Liste), je Blickwinkel Substantive, Verben und kurze Fügungen. Drei
Entscheidungen tragen den Bau: MODUS statt Stil (jede Lesung gleich flach, die
Reibung entsteht erst beim Rekombinieren), AUFSUMMIEREN statt ein Preset je
Bild (fünfzehn Substantive tragen nichts), ETIKETT statt Schublade (freies
Textfeld, die Maschine deutet nichts davon — was beim Sammeln getrennt wird,
bekommt man nicht mehr zusammen).

Doppelte Bilder: Fingerabdruck ist SHA-256 über die Datei, und der Schlüssel
ist **Abdruck UND Modus** — eine Sperre nur über den Abdruck verhinderte genau
die Mehrfachlesung, die den Reiz ausmacht. Geprüft wird VOR dem Senden. Grenze:
Ein neu komprimiertes Bild (Messenger, Drehen) hat einen anderen Abdruck und
gilt als neu.

Kosten: Die Wortbänke laufen als zweiter Aufruf über dasselbe Bild, alle
offenen Blickwinkel auf einmal. Das Bild wird dabei ein zweites Mal bezahlt;
die Alternative — eine einzige Riesenantwort für Sätze, 4W und Bänke — hätte
bei einem Formfehler beides verloren. Ein Fehlschlag bei den Bänken lässt die
Sätze stehen.

**Reiterleiste einstellbar** (seit 4.240.0): Unter Studio ▸ Einstellungen ▸
Reiter lassen sich Reiter ein- und ausblenden und sortieren
(`features/reiter.ts`, `divergenz_reiter_v1`). Zwei Fallen sind dort abgefangen:
Ein SPÄTER hinzugekommener Reiter muss erscheinen — die gespeicherte Ordnung
ist nur eine Namensliste, und würde allein sie angezeigt, bliebe er für immer
unsichtbar; er wird deshalb an seiner angestammten Stelle eingefügt, nicht
hinten angehängt (auch wenn er dabei in eine eigene Anordnung gerät — sichtbar
schlägt unangetastet). Und das Studio lässt sich nicht ausblenden, weil die
Einstellung darin liegt; wäre am Ende gar nichts sichtbar, wird die Ausblendung
ignoriert. Beide Sperren stehen in der Rechnung und nicht nur in der
Oberfläche, damit sie auch bei einem Stand aus der Projektdatei greifen.

Die Namensliste wird beim Start von `ui/app.ts` über `setzeKanon()` eingetragen
und im Studio mit `derKanon()` geholt — eine Liste und nicht zwei; ein direkter
Zugriff wäre ein Ringschluss der Einbindungen. Änderungen melden sich über das
Fensterereignis `dm-reiter`, aus demselben Grund.

**Drucken und Zeitungsseite** sind seit 4.240.0 Reiter statt Knöpfe neben
„Generieren". Sie öffnen ein Fenster und wechseln die Ansicht NICHT. Ihren Text
holen sie aus `dm_last_text`, die Form aus `dm_last_form` (vom Studio bei jedem
Formwechsel geschrieben).

**Autopilot** (seit 4.241.0): Ein Druck, eine ganze Ausgabe — Beiträge
erzeugen, Rollen verteilen, Layout ablegen, Ausgabennummer hochzählen.
Vollständig OHNE bezahlte KI: `features/autopilot.ts` plant,
`ui/autopilotView.ts` schaltet die vorhandenen Bausteine zusammen (Bank,
Presets, Markov-Korpus, Sammler-Vorrat, Bildvorrat, Kontextwürfel). Die
Kostenfreiheit steht nicht nur im Kommentar: `test/autopilot.ts` liest den
Quelltext der Ansicht und schlägt an, sobald dort `features/ki`, `callClaude`
oder ein anderer bezahlter Baustein auftaucht.

Drei Stellen, die leicht falsch gehen: Die Texte MÜSSEN in die Schatzkammer,
weil ein Layout seine Beiträge über `textSchluessel` genau dort wiedersucht.
Die Ausgabennummer wird erst hochgezählt, wenn das Layout wirklich liegt —
sonst trüge die nächste Zeitung eine Nummer, die es nie gab. Und der Layoutname
enthält zwingend die Nummer, weil `legeLayout` gleichnamige Layouts ERSETZT.

`oeffneZeitungssetzer` nimmt einen dritten Parameter: den Namen eines Layouts,
das beim Öffnen sofort angewandt wird. Dafür wurde die Anwendung aus dem
Klick-Zuhörer in `wendeLayoutAn()` herausgelöst.

**Reglerwerte stehen EINMAL** in `generation/optionen.ts` (seit 4.245.0).
Studio und Autopilot ziehen daraus. Vorher hatte der Autopilot eigene, nie
abgeglichene Listen — von fünf gewürfelten Reglern enthielten vier überwiegend
Werte, die es nicht gibt („ringkomposition", „duester", „wechsel", „mild",
„er", „sie"). Ein unbekannter Wert erzeugt keine Meldung, er tut nur nichts:
Die Maschine variierte zum Schein. `test/autopilot.ts` würfelt 1000 Läufe und
prüft jeden Wert gegen die echte Liste.

**Tagesfeed in den Korpus** (seit 4.246.0): Der Feed hatte bis dahin gar keinen
Ausgang zum Korpus — ein Fund konnte nur ins Studio (die vier W), sein Text
wurde angezeigt und weggeworfen. Jetzt trägt jeder Fund neben `text` (gekürzt,
für die Karte) ein Feld `volltext` (ungekürzt, für den Korpus); die alte
Kappung bei 260 Zeichen war für das Was-Feld gedacht und hat rund die Hälfte
jeder Zusammenfassung verworfen. Jahrestage: 14 → 40, weil der Feed dreißig bis
sechzig liefert und die Ereignissätze die beste Ware darin sind (Handlung statt
Definition). `istLexikon()` kennzeichnet Funde, die wie eine Lexikondefinition
beginnen („X war ein…", „Y ist eine Gemeinde in…") — sie werden ABGEWÄHLT
vorgelegt, nicht verworfen: einförmig ist nicht falsch. Geprüft wird nur der
Anfang, weil dort bei Wikipedia die Definition steht.

`mostread` aus dem Feed bleibt bewusst ungenutzt: vierzig Definitionen am Tag
wären genau die Einseitigkeit, gegen die der Filter gebaut ist.

**Kürzen am Spaltenfuß ist formbewusst** (seit 4.247.0). `darfKuerzen()`:
Bericht und Meldung dürfen von hinten verlieren — sie sind als umgekehrte
Pyramide gebaut, dort steht das Unwichtigste. Alles andere nicht: Einem Gedicht
die letzte Zeile zu nehmen heißt nicht kürzen, sondern ihm die Pointe nehmen,
und bei Prosa steht am Ende oft die Wendung. Solche Beiträge fallen GANZ weg —
auch als einziger einer Spalte, denn ein Text, der über die Fußlinie
hinausläuft, steht auf dem Papier im Nichts.

Der Grundsatz dahinter: Ein fehlender Text ist bloß abwesend und wird gemeldet;
ein angeschnittener verfälscht das Urteil über ihn. Deshalb steht unter der
Statuszeile jetzt ein Protokoll, das jeden gekürzten und jeden entfallenen
Beitrag beim Titel nennt. `beitrag()` legt dafür Form und Titel als
`data`-Attribute ans Element — vorher kannte die Nachmessung nur einen Kasten
mit Absätzen.

**Füller am Spaltenfuß** (seit 4.248.0, Stufe 2): Die Löcher, die das
formbewusste Kürzen hinterlässt, werden geschlossen. GEMESSEN statt geschätzt —
für jede Spalte die tatsächliche Restluft, dann ein Kandidat probeweise
eingesetzt und wieder herausgenommen, wenn er doch nicht passt. Eine Staffel
fester Formatgrößen wäre geraten: Ein Loch ist mal vier Millimeter groß und mal
achtzig.

Kandidaten sind Beiträge aus der Schatzkammer, die NICHT auf dem Blatt stehen —
kein neuer Generator, kein Vorrat. `waehleFueller()` nimmt den GRÖSSTEN, der
noch hineinpasst (ein Haiku in einem 60-mm-Loch lässt vierzig Millimeter Weiß
stehen); bei gleicher Höhe gewinnt die Kurzform. Was übrig bleibt, bekommt eine
`vignette()`: eine gerechnete SVG-Zierleiste, deterministisch aus einem Samen,
passt in jede Höhe und braucht keinen Speicher.

Füller werden im Protokoll benannt, nicht im Satz markiert: Ein Text, der nur
dort steht, weil eine Spalte aufgehen musste, könnte das Beste der Seite sein
oder das Schwächste — beides sollte man beim Lesen wissen. Eine Marke auf dem
Papier wäre dagegen eine Bedienspur.

## 7 · Fallen in diesem Quelltext

- **`let` im Setzer steht in einer Reihenfolge.** `oeffneZeitungssetzer()` ist
  eine sehr lange Funktion; `wendeLayoutAn()` steht darin weit oben, der
  Aufruf über `layoutSofort` ebenfalls — der Autopilot öffnet den Setzer so.
  Jede `let`-Bindung, die weiter unten steht und von `wendeLayoutAn()` gelesen
  wird, ist zu diesem Zeitpunkt gesperrt und wirft „Cannot access … before
  initialization". Der Fehler bricht den ganzen Setzer ab: Der Knopf tut
  scheinbar nichts. Zustand deshalb IMMER oben zu den übrigen Zuständen legen,
  nicht neben das Bedienelement, das ihn benutzt.

- **Deutsche Nomen sind groß.** „Großgeschrieben mitten im Satz" taugt nicht als
  Eigennamen-Erkennung. `properNames` in `coherence.ts` löst das bereits —
  benutzen, nicht neu bauen.
- **Endungen sind keine Numerusmarker.** Wagen, Boden, Garten, Regen, Schatten
  sind Singular auf -en. Für „ist das ein Plural?" gibt es `sachNomen` in
  `faktenblatt.ts` mit Ausschlusslisten.
- **`\d[\d.]*` verschluckt den Satzpunkt.** Für Zahlen `\d+(?:\.\d+)*`.
- **Der bestimmte Artikel verrät das Genus** zuverlässiger als jede
  Endungsheuristik — `dekliniere()` nutzt das.
- **Die Nachbearbeitung darf Zeilenumbrüche nicht plätten.** `glaetten()` in
  `postprocess.ts` fasst nur Leerzeichen an. Wer dort `\s` benutzt, zerstört
  Absätze und Verse.
- **Der Bericht läuft NICHT durch `postProcessText`.** Sie ergänzt Artikel und
  streut Ton ein — beides fügt einem Bericht Fakten hinzu oder nimmt sie weg.
- **Messen geht nur im Browser.** Deshalb steckt der Umbruch in `umbruch.ts` und
  bekommt die Messung als Funktion herein: im Programm `getBoundingClientRect`,
  im Test eine Ersatzfunktion. `getBoundingClientRect` liefert **keine
  Außenabstände** — die müssen dazugerechnet werden.
- **Vorschau und Druck müssen dieselbe Geometrie haben.** Die Zeitungsseite
  benutzt in beiden Fällen 174 × 255 mm, den Bereich innerhalb der
  `@page`-Ränder.

**Wirkungsmesser** (seit 4.236.0, `features/wirkung.ts` + `ui/wirkungView.ts`,
im Reiter Diagnose): Er fährt jeden Regler einzeln durch alle Stellungen, hält
alles andere fest und misst je N Texte mit den vorhandenen Maßen. Der Wert ist
**Ausschlag / Rauschen** — die Spanne der Mittelwerte über die Stellungen,
geteilt durch die mittlere Streuung innerhalb einer Stellung. Unter 1 bewegt ein
Regler weniger als der Zufall zwischen zwei Läufen derselben Einstellung.

Seit 4.238.0 ist das Maß **umgerechnet**: Wirkung = Ausschlag ÷ dem Ausschlag,
den das Rauschen allein erzeugt hätte (`Rauschen · d₂(k) / √n`). Ohne diese
Korrektur wuchs der Zufallsausschlag mit der Zahl der Stellungen — ein Ton mit
sechs Stellungen stand bei 1,7, die Blindprobe mit dreien bei 0,6, und beide
bewegten gleich viel: nichts. Die Bandgrenzen (2,5 / 4 / 10) liegen nicht bei
1, weil die Wirkung das STÄRKSTE von neun Maßen ist und ein Maximum über dem
Mittel liegt; gemessen liegt das Zufallsniveau bei 1,3–1,9. Die Blindprobe
zeigt es in jedem Lauf.

Die Balken sind in vier Bänder eingefärbt (): grau unter 1, gelb bis 2,
grün bis 5, Akzentfarbe darüber — und der senkrechte Strich im Balken markiert
die Rauschschwelle auf derselben Skala. Kein Qualitätsurteil: Ein starker
Regler ist nicht besser, nur wirksamer.

Die **Blindprobe** ist ein Regler in derselben Liste, der nichts ändert. Sie
muss unter 1 bleiben; steht sie darüber, misst das Instrument Rauschen als
Wirkung und alle anderen Zahlen sind wertlos. Sie ist der eingebaute Gegentest
und steht deshalb IM Instrument, nicht nur im Prüfstand.

Kein Optimum, mit Absicht: Der Raum hat rund 10¹² Kombinationen, die Maße
widersprechen einander, und der Mittelwert ist nicht der Eindruck. Erster
Befund (Prosa, N=14): Form 16, Perspektive 8, Struktur 4, Ton 1,7, Modus 1,0 —
Ton und Modus liegen am Rand des Rauschens.

**Reglerstellung in der Schatzkammer** (4.236.0): Jeder gemerkte Text trägt
jetzt `set` — die Reglerstellung, aus der er entstand, mit genau den
Schlüsseln, die `dm_pending_studio` wieder einsetzen kann. „→ Studio" holt
damit die Einstellung zurück. Ältere Einträge haben kein `set`; jede
Auswertung muss damit rechnen. Damit wird die Sammlung zum Messgerät: Was der
Benutzer behält, ist das einzige belastbare „gut" dieses Programms.

## 8 · Was offen ist

- **Haiku-Anschnitte**: 12–18 % in einigen Presets; 5-7-5 wird zu 97,5 %
  getroffen (Rest genau +1 Silbe).
- **Gedicht-Strang** verfehlt die Ziellänge in rund 260 von 1080 Läufen
  (Beiwerk, bewusst zurückgestellt).
- **Bauspur für die Versformen** fehlt — Herkunftsmessung und Farbcodes
  schätzen dort.
- **`castDiscipline`** bestraft nur neu eingeführte Eigennamen, nicht den
  umgekehrten Fall („Tim" gesetzt, dann „Ein Junge").
- **Zeitungssetzer**: gleiche Überschriften können nebeneinander stehen; die
  Automatik überspringt Dubletten noch nicht.
- **Evolution (Bauplan A–F)**: F (die Umwelt) ist gebaut und wirkt auf die
  Auswahl. Gemessen: Gift wirkt (Aufnahme 9,6 → 5,9 %), Nahrung kaum, auf
  Fremdzeichen gar nicht. Der Befund sagt, wohin es weitergeht — die Umwelt muss
  die **Variation** erreichen, nicht nur die Auswahl.

- **Sammler**: Der Aufbau des Wikipedia-Feeds ist hier nie gegen den echten
  Dienst geprüft worden (die Bauumgebung kommt nicht ins Wikipedia-Netz). Die
  Zerlegung ist gegen fehlende Felder abgesichert und läuft gegen nachgebildete
  Beispieldaten; bleibt der Reiter im Browser leer, zuerst die Adressen in
  `feedAdressen()` gegen die aktuelle Wikimedia-Dokumentation halten.

## 9 · Wo die übrigen Papiere liegen

`merkliste-divergenzmaschine.md`, `plan-formen-divergenzmaschine.md`,
`baupläne-evolution-divergenzmaschine.md` und `umzug-checkliste.md` lagen bisher
nur im lokalen Arbeitsordner. Sie gehören hierher in `doku/`, damit sie mit dem
Repo wandern — beim nächsten Mal mit hineinlegen.

## 10 · Die Daten der App

Presets, Korpus, Schatzkammer, Regler, Umwelt und Werkstatt-Projekte liegen im
**localStorage des Browsers**, nicht im Repo. Sie wandern über den Knopf
**Exportieren** oben rechts (eine JSON-Datei) und **Importieren** auf dem
anderen Rechner. Seit v4.216.0 enthält der Export auch die Stellschrauben und
die Umwelt — ältere Dateien nicht.
