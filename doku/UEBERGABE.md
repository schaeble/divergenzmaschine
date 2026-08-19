# Übergabe — Divergenzmaschine

Dieses Blatt reicht, um an einem anderen Rechner oder in einer neuen Sitzung
weiterzuarbeiten. Es liegt im Repo, wandert also mit `git clone` mit.

Stand: **v4.238.1**, Zweig `typescript-migration`.

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

## 7 · Fallen in diesem Quelltext

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
