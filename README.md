# Divergenzmaschine

Ein Werkzeug für generatives, prozedurales Schreiben auf Deutsch. Es läuft im
Browser, braucht keinen Server und arbeitet im Kern vollständig offline. Statt
Zufallssätze aneinanderzureihen, baut es Texte über eine mehrstufige Pipeline
aus Kontext, Wortbänken, Form und Struktur — und prüft das Ergebnis, bevor es
erscheint.

**Ausprobieren:** https://schaeble.github.io/divergenzmaschine/ts/
**Offline:** Unter [Releases](https://github.com/schaeble/divergenzmaschine/releases)
liegen ausgewählte Fassungen als einzelne HTML-Datei, die die ganze Maschine enthält.
**Als App aufs Handy:** siehe [ANLEITUNG.md](ANLEITUNG.md).

## Was sie kann

- **Formen:** Prosa, Prosagedicht, Gedicht-Strang, Reim, Haiku, Szene/Dialog,
  Multi-Shot (Video), Zeitungsbericht und Meldung.
- **Gattungen:** Utopie, Dystopie, Märchen, Fabel (zwölf Fabeln nach Äsop) und
  Gründungsmythos. Jede hat ein eigenes Gerüst und einen eigenen Prüfer, und die
  vier W — Wo, Wann, Wer, Was — bedeuten in jeder etwas anderes. Gattungen
  wirken in Prosa und im Multi-Shot.
- **Zwei Ansichten:** der volle Reglerkasten mit allen Stellschrauben oder der
  einfache Kopf mit fünf Entscheidungen (Form, Gattung, Wovon, Länge, Reibung).
- **Wortbänken und Presets:** Stilrichtungen einzeln oder gemischt; die Reibung
  bestimmt, wie weit die gemischten Register auseinanderliegen.
- **Würfeln mit Schlössern:** „Alles würfeln“ verändert, was nicht festgehalten
  ist — auf Wunsch auch die Gattung.
- **Gedächtnis:** eigener Korpus mit Markov-Modell, lebendige Pools, die
  Schatzkammer für gelungene Texte, ein Weltensimulator mit Figuren, Orten und
  Zeitstrahl.
- **Zufuhr von außen:** Sammler (Tagesfeed, Bilder, Abschrift), Themenpool,
  Bildwelt und Erzählerbank mit Erzählbögen.
- **Ausarbeitung:** Bestenauslese nach Qualität, Neuheit, Überraschung und
  Grammatik; Werkstatt mit Gerüst, Rohfassung und Politur; Fortsetzungen.
- **Ausgabe:** Lesen, Vorlesen, Merken, Zeitungsseite mit Satz und Umbruch,
  Layout und Druck.
- **Durchschaubar:** Der Schaltplan unter Diagnose zeigt, welcher Regler was
  bewirkt hat; der Wirkungsmesser, wie stark ein Regler den Text verändert.
- **Optional mit KI:** Nur auf Wunsch und mit eigenem Anthropic-API-Schlüssel
  lässt sich ein Text glätten oder kommentieren. Ohne Schlüssel bleibt alles
  offline.

Alle Daten bleiben im Browser. Über **Exportieren / Importieren** wandert das
ganze Projekt als Datei auf einen anderen Rechner oder in einen anderen Browser.

## Aufbau dieses Repos

| Ort | Inhalt |
|---|---|
| Zweig `typescript-migration`, Ordner `migration-ts/` | **Die Quellen.** TypeScript und Vite; siehe [migration-ts/README.md](migration-ts/README.md). |
| Zweig `main` | Nur das Veröffentlichte: der Stand, den GitHub Pages ausliefert. Wird vom Workflow geschrieben, nicht von Hand. |
| `doku/UEBERGABE.md` | Arbeitsstand, Entscheidungen und Fallen im Quelltext — das Gedächtnis des Projekts. |
| `index.html`, `sw.js`, Icons im Wurzelordner | Die ältere Einzeldatei-Fassung (V4.2), unverändert erhalten. |

## Für Entwickler, kurz

```bash
cd migration-ts
npm ci
npm run dev                  # lokaler Server
npm run build                # → dist/index.html, eine Offline-Datei
node scripts/pruefen.mjs     # alle Prüfstände
```

Ein Push auf `typescript-migration`, der etwas unter `migration-ts/` ändert,
baut und veröffentlicht die Seite. Mehr dazu in
[migration-ts/README.md](migration-ts/README.md).
