# Übergabe — Divergenzmaschine

Dieses Blatt reicht, um an einem anderen Rechner oder in einer neuen Sitzung
weiterzuarbeiten. Es liegt im Repo, wandert also mit `git clone` mit.

Stand: **v4.220.0**, Zweig `typescript-migration`.

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
| `test/sammler.ts` | Sammler: 43 Prüfungen gegen nachgebildete Feed-Daten, mit Gegentests |

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
Multi-Shot, **Bericht**. (`drama` existiert im Quelltext, steht aber nicht in
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

**Druck:** sechs Profile (zeitung, fliesstext, vers, haiku, buehne, shots) plus
der **Zeitungssetzer** mit gestaltbarem Kopf, Automatik über mehrere Seiten und
Nachmessen am fertigen Satz.

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
