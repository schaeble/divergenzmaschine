// Speicher-Status: macht einen vollen localStorage sichtbar (statt still zu
// scheitern) und schätzt die Belegung. Roadmap 1.3.

/** Erkennt einen „Speicher voll"-Fehler über Browsergrenzen hinweg. */
export function isQuotaError(e: unknown): boolean {
  if (!(e instanceof DOMException)) return false;
  return e.name === "QuotaExceededError"
    || e.name === "NS_ERROR_DOM_QUOTA_REACHED"
    || e.code === 22 || e.code === 1014;
}

let banner: HTMLElement | null = null;

/** Zeigt einen dauerhaften, schließbaren Hinweis, dass ein Speichern scheiterte. */
export function notifyStorageFull(where: string): void {
  try {
    if (!banner) {
      banner = document.createElement("div");
      banner.setAttribute("role", "alert");
      banner.style.cssText =
        "position:fixed;left:0;right:0;top:0;z-index:9999;padding:10px 14px;"
        + "background:#7f1d1d;color:#fff;font:14px/1.4 system-ui,sans-serif;"
        + "display:flex;gap:12px;align-items:center;justify-content:center;box-shadow:0 2px 8px rgba(0,0,0,.4)";
      const x = document.createElement("button");
      x.textContent = "✕";
      x.style.cssText = "background:transparent;border:0;color:#fff;font-size:16px;cursor:pointer";
      x.addEventListener("click", () => { banner?.remove(); banner = null; });
      const span = document.createElement("span");
      span.id = "storage-msg";
      banner.append(span, x);
      document.body.appendChild(banner);
    }
    const msg = banner.querySelector("#storage-msg");
    if (msg) msg.textContent =
      `Speicher voll — „${where}" konnte nicht gesichert werden. `
      + "Bitte Korpus kürzen, Schatzkammer aufräumen oder ein Projekt exportieren und Daten löschen.";
  } catch { /* DOM nicht verfügbar */ }
}

/** Sicheres Schreiben: meldet einen vollen Speicher sichtbar, schluckt anderes. */
export function safeSet(key: string, value: string, where: string): boolean {
  try { localStorage.setItem(key, value); return true; }
  catch (e) { if (isQuotaError(e)) notifyStorageFull(where); return false; }
}

const fmt = (bytes: number): string =>
  bytes >= 1024 * 1024 ? (bytes / 1024 / 1024).toFixed(1) + " MB" : Math.round(bytes / 1024) + " KB";

export interface StorageReport { localBytes: number; usage?: number; quota?: number; text: string; }

/** Belegung: exakte localStorage-Größe + (falls verfügbar) Origin-Schätzung. */
export async function storageReport(): Promise<StorageReport> {
  let localBytes = 0;
  try {
    for (let i = 0; i < localStorage.length; i++) {
      const k = localStorage.key(i); if (k === null) continue;
      const v = localStorage.getItem(k) || "";
      localBytes += (k.length + v.length) * 2; // UTF-16
    }
  } catch { /* gesperrt */ }

  let usage: number | undefined, quota: number | undefined;
  try {
    if (navigator.storage?.estimate) { const e = await navigator.storage.estimate(); usage = e.usage; quota = e.quota; }
  } catch { /* nicht verfügbar */ }

  let text = `localStorage: ${fmt(localBytes)}`;
  if (usage !== undefined && quota) {
    const pct = Math.round((usage / quota) * 100);
    text += ` · Origin gesamt: ${fmt(usage)} / ${fmt(quota)} (${pct} %)`;
  }
  return { localBytes, usage, quota, text };
}

// ── Aufschlüsselung ─────────────────────────────────────────────────────────
// Eine Summe sagt nur, OB es eng wird, nicht WO. Und die Entscheidung, ob ein
// Umzug nach IndexedDB fällig ist oder ein einzelner Posten aufgeräumt gehört,
// hängt genau daran — sonst baut man eine Datenbank gegen eine Vermutung.

export interface Posten {
  /** Schlüssel im Speicher. */
  key: string;
  /** Verständlicher Name, falls bekannt. */
  name: string;
  bytes: number;
  /** Anteil an der Gesamtbelegung in Prozent. */
  anteil: number;
  /** Wandert der Posten in die Projektdatei? */
  wandert: boolean;
}

/** Namen für die bekannten Schlüssel. Ein Nutzer soll nicht raten müssen, was
 *  „dm_zeitung_v1" ist. Unbekannte behalten ihren Schlüssel — eine erfundene
 *  Beschriftung wäre schlimmer als gar keine. */
const NAMEN: Record<string, string> = {
  "divergenz_persistent_corpus_v1": "Korpus",
  "dm_treasury_v1": "Schatzkammer",
  "divergenz_zeitung_bilder_v1": "Bilder im Zeitungssetzer",
  "divergenz_zeitung_layouts_v1": "Zeitungslayouts",
  "dm_zeitung_v1": "Zeitungskopf",
  "divergenz_bildwelt_v1": "Bildwelt (Wortbänke)",
  "divergenz_bildvorrat_v1": "Bildvorrat (4W)",
  "divergenz_sammler_vorrat_v1": "Sammler-Vorrat",
  "divergenz_autopilot_ktx_v1": "Autopilot: Kontext-Gedächtnis",
  "divergenz_lehrer_konto_v1": "KI-Lehrer: Konto",
  "divergenz_wordbanks_v1": "Wortbänke",
  "divergenz_presets2_v1": "Presets 2.0",
  "divergenz_settings_v1": "Einstellungen",
  "divergenz_reiter_v1": "Reiterleiste",
  "dm_last_text": "Letzter Studiotext",
  "divergenz_live_pools_v1": "Live-Pools",
};

/** Was in die Projektdatei wandert: alles mit diesen Präfixen.
 *
 *  Beim Bauen wäre mir hier fast ein falscher Alarm unterlaufen. In
 *  `features/project.ts` gibt es eine Liste `REST_AUSNAHME` mit
 *  `dm_treasury_v1`, `divergenz_settings_v1` und `divergenz_live_pools_v1` —
 *  die sieht nach „wird nicht exportiert" aus, meint aber das Gegenteil: Diese
 *  drei werden über EIGENE Felder der Datei gesichert und sollen nur nicht
 *  doppelt im Sammelfeld liegen. Eine Anzeige „Schatzkammer wandert nicht mit"
 *  wäre falsch gewesen und hätte zu einer unnötigen Sicherung geführt. */
const EXPORT_PRAEFIX = ["dm_", "divergenz_"];

/** Größe eines Eintrags in Byte. UTF-16, wie im Browser gespeichert — und der
 *  Schlüssel zählt mit, sonst fehlen bei vielen kleinen Einträgen spürbar. */
export function postenGroesse(key: string, wert: string): number {
  return (key.length + (wert || "").length) * 2;
}

/** Alle Einträge, größter zuerst. `roh` ist einsetzbar, damit der Prüfstand
 *  ohne Browser rechnen kann. */
export function schluesselePosten(roh: [string, string][]): Posten[] {
  const gesamt = roh.reduce((a, [k, v]) => a + postenGroesse(k, v), 0);
  return roh
    .map(([k, v]) => {
      const bytes = postenGroesse(k, v);
      return {
        key: k,
        name: NAMEN[k] || k,
        bytes,
        anteil: gesamt ? Math.round((bytes / gesamt) * 1000) / 10 : 0,
        wandert: EXPORT_PRAEFIX.some((p) => k.startsWith(p)),
      };
    })
    .sort((a, b) => b.bytes - a.bytes);
}

/** Die Posten aus dem echten Speicher. */
export function lesePosten(): Posten[] {
  const roh: [string, string][] = [];
  try {
    for (let i = 0; i < localStorage.length; i++) {
      const k = localStorage.key(i);
      if (k === null) continue;
      roh.push([k, localStorage.getItem(k) || ""]);
    }
  } catch { /* gesperrt */ }
  return schluesselePosten(roh);
}

export const formatBytes = fmt;
