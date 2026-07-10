# Divergenzmaschine V4.2 – als App auf Android installieren

Die App ist jetzt eine PWA (Progressive Web App). Sie braucht einmalig eine HTTPS-Adresse im Netz – danach läuft sie auf dem Handy wie eine normale App, auch offline.

## Schritt 1: Kostenlos hosten (einmalig, ca. 5 Minuten)

**Variante A – GitHub Pages (empfohlen):**

1. Kostenloses Konto auf https://github.com anlegen (falls nicht vorhanden)
2. Neues Repository erstellen, z. B. `divergenzmaschine` (Public)
3. Alle Dateien aus diesem Ordner hochladen ("Add file" → "Upload files")
4. Settings → Pages → Branch `main` auswählen → Save
5. Nach 1–2 Minuten ist die App erreichbar unter:
   `https://DEINNAME.github.io/divergenzmaschine/`

**Variante B – Netlify:**

1. Kostenloses Konto auf https://app.netlify.com anlegen
2. "Add new site" → "Deploy manually" → diesen Ordner per Drag & Drop hineinziehen
3. Fertig – Netlify zeigt dir die Adresse an

## Schritt 2: Auf dem Handy installieren

1. Die Adresse in **Chrome auf dem Android-Handy** öffnen
2. Menü (⋮) → **"App installieren"** bzw. **"Zum Startbildschirm hinzufügen"**
3. Die Divergenzmaschine erscheint mit eigenem Icon auf dem Startbildschirm
   und startet im Vollbild ohne Browserleiste

## Gut zu wissen

- **Offline:** Nach dem ersten Öffnen funktioniert die App auch ohne Internet
  (nur die KI-Funktion braucht Netz).
- **Deine Daten** (Presets, Bank, Welt, Verlauf, API-Schlüssel) liegen im
  lokalen Speicher des Handys – sie bleiben beim App-Update erhalten,
  verschwinden aber, wenn du die Website-Daten in Chrome löschst.
- **Updates:** Neue Version einfach wieder hochladen (gleiche Adresse).
  In `sw.js` die Zeile `CACHE = 'divergenzmaschine-v4.2.0'` auf z. B.
  `v4.2.1` ändern, damit das Handy die neue Version sicher lädt.

## Dateien in diesem Ordner

- `index.html` – die Divergenzmaschine (unverändert, nur PWA-Zeilen ergänzt)
- `manifest.webmanifest` – App-Name, Farben, Icons
- `sw.js` – Service Worker für Offline-Betrieb
- `icon-*.png`, `apple-touch-icon.png` – App-Icons
