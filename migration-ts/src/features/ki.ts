// KI-Anbindung (Anthropic). Der API-Schlüssel bleibt ausschließlich lokal
// (localStorage) und wird nur an api.anthropic.com gesendet — wie im Original.
// Nicht offline testbar (echte API-Calls).
import type { Bank } from "../types";
import { normalizeBankShape } from "../storage";

const AI_KEY = "divergenz_ai_key_v1";
const AI_MODEL = "divergenz_ai_model_v1";
const DEFAULT_MODEL = "claude-sonnet-5";

export function loadAiKey(): string { try { return localStorage.getItem(AI_KEY) || ""; } catch { return ""; } }
export function saveAiKey(k: string): void { try { localStorage.setItem(AI_KEY, k || ""); } catch { /* voll */ } }
export function loadAiModel(): string { try { return localStorage.getItem(AI_MODEL) || DEFAULT_MODEL; } catch { return DEFAULT_MODEL; } }
export function saveAiModel(m: string): void { try { localStorage.setItem(AI_MODEL, m || DEFAULT_MODEL); } catch { /* voll */ } }

interface Msg { role: "user" | "assistant"; content: string; }

export function isOnline(): boolean {
  try { return navigator.onLine !== false; } catch { return true; }
}
const sleep = (ms: number): Promise<void> => new Promise((r) => setTimeout(r, ms));

/** POST an die Messages-API mit Offline-Guard und Retry bei Überlast (429/529/5xx). */
async function postMessages(body: unknown, signal?: AbortSignal): Promise<Response> {
  if (!isOnline()) throw new Error("Keine Internetverbindung — KI-Funktionen sind offline nicht verfügbar.");
  const key = loadAiKey();
  const url = "https://api.anthropic.com/v1/messages";
  const headers = {
    "content-type": "application/json",
    "x-api-key": key,
    "anthropic-version": "2023-06-01",
    "anthropic-dangerous-direct-browser-access": "true",
  };
  const delays = [1000, 2000, 4000];
  let lastErr: unknown;
  for (let attempt = 0; attempt <= delays.length; attempt++) {
    try {
      const res = await fetch(url, { method: "POST", headers, body: JSON.stringify(body), signal });
      // Vorübergehende Überlast -> erneut versuchen; echte Fehler (401/403/400) sofort durchreichen.
      if ((res.status === 429 || res.status === 529 || res.status >= 500) && attempt < delays.length) {
        await sleep(delays[attempt]!); continue;
      }
      return res;
    } catch (e) {
      if (signal?.aborted) throw e;                 // vom Nutzer abgebrochen
      lastErr = e;
      if (attempt < delays.length) { await sleep(delays[attempt]!); continue; }
    }
  }
  throw lastErr instanceof Error ? lastErr : new Error("Netzwerkfehler bei der KI-Anfrage.");
}



async function callClaudeRaw(promptText: string, maxTokens?: number, prefill?: string | null, noThinking = false): Promise<{ text: string; truncated: boolean }> {
  const model = loadAiModel();
  const messages: Msg[] = [{ role: "user", content: promptText }];
  if (prefill) messages.push({ role: "assistant", content: prefill });

  const body = noThinking
    ? { model, max_tokens: maxTokens || 4096, messages, thinking: { type: "disabled" } }
    : { model, max_tokens: maxTokens || 4096, messages };
  const res = await postMessages(body);
  if (!res.ok) {
    let msg = `HTTP ${res.status}`;
    try { const e = await res.json() as { error?: { message?: string } }; if (e?.error?.message) msg = e.error.message; } catch { /* ignore */ }
    throw new Error(msg);
  }
  const data = await res.json() as {
    content?: { type?: string; text?: string }[]; stop_reason?: string;
    usage?: { input_tokens?: number; output_tokens?: number };
  };
  let text = "";
  const kinds: string[] = [];
  if (Array.isArray(data.content)) {
    for (const b of data.content) if (b && typeof b.type === "string") kinds.push(b.type);
    text = data.content.filter((b) => b && b.type === "text" && typeof b.text === "string").map((b) => b.text).join("\n").trim();
  }
  if (text && prefill) text = prefill + text;
  const truncated = data.stop_reason === "max_tokens";
  if (!text) {
    const diag = `Modell ${model} · angefordert ${maxTokens || 4096} · verbraucht ${data.usage?.output_tokens ?? "?"}`
      + ` · Blocktypen [${kinds.join(", ") || "keine"}] · stop_reason ${data.stop_reason || "unbekannt"}`;
    throw new Error(truncated
      ? `Token-Limit erschöpft, bevor Text zurückkam.\n${diag}\n`
        + (kinds.includes("thinking")
          ? "Das Modell hat das Budget für interne Überlegungen verbraucht. Bitte ein Modell ohne erweitertes Nachdenken eintragen (Studio ▸ Einstellungen ▸ KI-Zugang)."
          : "Bitte eine kürzere Ziellänge wählen oder erneut versuchen.")
      : `Antwort ohne Textblock.\n${diag}`);
  }
  return { text, truncated };
}

/** Wie callClaude, meldet aber zusätzlich, ob die Antwort am Token-Limit abgeschnitten wurde. */
export async function callClaudeEx(promptText: string, maxTokens?: number, prefill?: string | null): Promise<{ text: string; truncated: boolean }> {
  const isParamProblem = (m: string): boolean => /thinking|unexpected|unsupported|not supported|invalid/i.test(m);
  const isPrefillProblem = (m: string): boolean => /prefill/i.test(m);

  // Erster Versuch: internes Nachdenken abschalten. Sonst verbrauchen Modelle mit
  // erweitertem Nachdenken das gesamte Token-Budget, bevor Text entsteht.
  try { return await callClaudeRaw(promptText, maxTokens, prefill, true); }
  catch (e) {
    const m = String((e as Error).message || "");
    if (isPrefillProblem(m) && prefill) return await callClaudeRaw(promptText, maxTokens, null, true);
    if (!isParamProblem(m)) throw e;
    // Modell kennt den Parameter nicht -> ohne ihn erneut versuchen.
    try { return await callClaudeRaw(promptText, maxTokens, prefill, false); }
    catch (e2) {
      const m2 = String((e2 as Error).message || "");
      if (isPrefillProblem(m2) && prefill) return await callClaudeRaw(promptText, maxTokens, null, false);
      throw e2;
    }
  }
}

export async function callClaude(promptText: string, maxTokens?: number, prefill?: string | null): Promise<string> {
  return (await callClaudeEx(promptText, maxTokens, prefill)).text;
}

/** Streaming: liefert Text-Deltas live über onDelta und gibt den Gesamttext zurück.
 *  Bei fehlender Streaming-Unterstützung fällt der Aufrufer auf callClaude zurück.
 *
 *  `modell` überschreibt die globale Modellwahl für DIESEN Aufruf — der
 *  KI-Lehrer rechnet mit einem billigeren Modell, ohne die Einstellung des
 *  Studios zu verstellen.
 *
 *  `usage` sind die ECHTEN Tokenzahlen aus der Antwort. Ohne sie bliebe jede
 *  Kostenangabe eine Schätzung, die man nie gegen die Rechnung halten kann. */
export async function callClaudeStream(
  promptText: string, maxTokens: number, onDelta: (chunk: string, full: string) => void,
  signal?: AbortSignal, modell?: string,
): Promise<{ text: string; truncated: boolean; usage: { ein: number; aus: number } }> {
  if (!loadAiKey()) throw new Error("Kein API-Schlüssel hinterlegt.");
  const model = modell || loadAiModel();
  const body = {
    model, max_tokens: maxTokens || 4096, stream: true,
    thinking: { type: "disabled" as const },
    messages: [{ role: "user", content: promptText }],
  };
  const res = await postMessages(body, signal);
  if (!res.ok || !res.body) {
    let msg = `HTTP ${res.status}`;
    try { const e = await res.json() as { error?: { message?: string } }; if (e?.error?.message) msg = e.error.message; } catch { /* egal */ }
    throw new Error(msg);
  }
  const reader = res.body.getReader();
  const dec = new TextDecoder();
  let buf = "", full = "", stop = "";
  // Die Eingabemenge steht im ersten Ereignis, die Ausgabemenge wächst und
  // steht endgültig im letzten. Beide werden mitgelesen, nicht geschätzt.
  let einTok = 0, ausTok = 0;
  for (;;) {
    const { done, value } = await reader.read();
    if (done) break;
    buf += dec.decode(value, { stream: true });
    const lines = buf.split("\n");
    buf = lines.pop() || "";
    for (const line of lines) {
      const t = line.trim();
      if (!t.startsWith("data:")) continue;
      const payload = t.slice(5).trim();
      if (payload === "[DONE]") continue;
      try {
        const ev = JSON.parse(payload) as {
          type?: string; delta?: { type?: string; text?: string; stop_reason?: string };
          message?: { usage?: { input_tokens?: number; output_tokens?: number } };
          usage?: { input_tokens?: number; output_tokens?: number };
        };
        if (ev.type === "message_start") {
          einTok = ev.message?.usage?.input_tokens || 0;
          ausTok = ev.message?.usage?.output_tokens || 0;
        } else if (ev.type === "content_block_delta" && ev.delta?.type === "text_delta" && ev.delta.text) {
          full += ev.delta.text; onDelta(ev.delta.text, full);
        } else if (ev.type === "message_delta") {
          if (ev.delta?.stop_reason) stop = ev.delta.stop_reason;
          if (ev.usage?.output_tokens) ausTok = ev.usage.output_tokens;
          if (ev.usage?.input_tokens) einTok = ev.usage.input_tokens;
        }
      } catch { /* Zeile überspringen */ }
    }
  }
  return { text: full.trim(), truncated: stop === "max_tokens", usage: { ein: einTok, aus: ausTok } };
}

/** Ein Bild plus Text an die Messages-API. Das Bild kommt als Base64 im
 *  Nachrichtenkörper — genau die Form, in der es ohnehin im localStorage liegt.
 *
 *  Kein Streaming: Die Antwort ist JSON und wird als Ganzes ausgewertet;
 *  Häppchen anzuzeigen, die man gleich wieder verwirft, wäre Theater.
 *
 *  `usage` sind die echten Tokenzahlen. Bei Bildern ist das wichtiger als
 *  sonst: Wie viele Token ein Bild kostet, hängt an seiner Fläche, und die
 *  Schätzung dafür ist gröber als bei Text. */
export async function callClaudeBild(
  promptText: string, bild: { media: string; daten: string },
  maxTokens: number, modell?: string, signal?: AbortSignal,
): Promise<{ text: string; truncated: boolean; usage: { ein: number; aus: number } }> {
  if (!loadAiKey()) throw new Error("Kein API-Schlüssel hinterlegt.");
  const body = {
    model: modell || loadAiModel(),
    max_tokens: maxTokens || 2048,
    thinking: { type: "disabled" as const },
    messages: [{
      role: "user",
      content: [
        { type: "image", source: { type: "base64", media_type: bild.media, data: bild.daten } },
        { type: "text", text: promptText },
      ],
    }],
  };
  const res = await postMessages(body, signal);
  if (!res.ok) {
    let msg = `HTTP ${res.status}`;
    try { const e = await res.json() as { error?: { message?: string } }; if (e?.error?.message) msg = e.error.message; } catch { /* egal */ }
    throw new Error(msg);
  }
  const data = await res.json() as {
    content?: { type?: string; text?: string }[]; stop_reason?: string;
    usage?: { input_tokens?: number; output_tokens?: number };
  };
  const text = Array.isArray(data.content)
    ? data.content.filter((b) => b && b.type === "text" && typeof b.text === "string").map((b) => b.text).join("\n").trim()
    : "";
  const usage = { ein: data.usage?.input_tokens || 0, aus: data.usage?.output_tokens || 0 };
  if (!text) {
    throw new Error(data.stop_reason === "max_tokens"
      ? "Token-Limit erschöpft, bevor Text zurückkam — weniger Sätze anfordern."
      : "Antwort ohne Textblock.");
  }
  return { text, truncated: data.stop_reason === "max_tokens", usage };
}

export function extractJson(raw: string): unknown {  const s = (raw || "").trim().replace(/^```(?:json)?\s*/i, "").replace(/```\s*$/, "").trim();
  const start = s.indexOf("{");
  if (start === -1) throw new Error("Keine JSON-Antwort erhalten.");
  // Erstes vollständiges Objekt per balancierter Klammerung extrahieren (Strings/
  // Escapes respektiert), damit Zusatztext NACH dem JSON nicht stört.
  let depth = 0, inStr = false, esc = false, end = -1;
  for (let i = start; i < s.length; i++) {
    const c = s[i]!;
    if (inStr) {
      if (esc) esc = false;
      else if (c === "\\") esc = true;
      else if (c === '"') inStr = false;
      continue;
    }
    if (c === '"') inStr = true;
    else if (c === "{") depth++;
    else if (c === "}") { depth--; if (depth === 0) { end = i; break; } }
  }
  if (end === -1) throw new Error("Antwort abgeschnitten (kein schließendes '}').");
  const body = s.slice(start, end + 1).replace(/,\s*([}\]])/g, "$1");
  return JSON.parse(body);
}


/** Was der Auftrag je Kategorie verlangt — NACHGEZÄHLT am Bestand.
 *
 *  Gefragt wurde: „Spiegelt der Prompt für eigene Presets die aktuelle Fassung
 *  der Presets im Bestand wider?" Er tat es nicht: Die Zahlen
 *  (24/16/22/18/17/11/12) stammten aus der Zeit vor dem Ausbau und lagen bei
 *  turns, obstacles und endings deutlich zu niedrig; „verwandlungen" kam gar
 *  nicht vor, obwohl 41 der 51 eingebauten Presets welche tragen.
 *
 *  Damit die Frage nicht wieder gestellt werden muss, steht die Vorgabe hier als
 *  DATEN und nicht als Fließtext — der Prüfstand hält sie gegen den Bestand und
 *  meldet, sobald beide auseinanderlaufen. `anzahl` ist der Median, `min`/`max`
 *  die beobachtete Spanne, `woerter` die mittlere Länge eines Eintrags. */
export interface KatVorgabe { key: string; anzahl: number; min: number; max: number; woerter: number; text: string }
export const KATEGORIE_VORGABE: KatVorgabe[] = [
  { key: "motifs", anzahl: 22, min: 16, max: 30, woerter: 6,
    text: "wiederkehrende Bilder, Nominalphrase MIT Artikel und eigenem Kopf" },
  { key: "hooks", anzahl: 17, min: 14, max: 20, woerter: 8,
    text: "kleine, irritierende Details oder Sätze" },
  { key: "props", anzahl: 20, min: 15, max: 28, woerter: 4,
    text: 'Gegenstände MIT unbestimmtem Artikel im Akkusativ, z.B. "einen Schlüssel zum Kerker"' },
  { key: "turns", anzahl: 21, min: 18, max: 26, woerter: 8, text: "Wendepunkte, je ein knapper Satz" },
  { key: "obstacles", anzahl: 20, min: 17, max: 26, woerter: 7, text: "Hindernisse, je ein knapper Satz" },
  { key: "stakes", anzahl: 11, min: 7, max: 14, woerter: 9,
    text: 'Sätze, jeder beginnt mit "Der Einsatz ist"' },
  { key: "endings", anzahl: 15, min: 11, max: 18, woerter: 8, text: "Schlusssätze" },
  { key: "verwandlungen", anzahl: 8, min: 4, max: 12, woerter: 0,
    text: "Motivpaare — siehe unten" },
];

export interface WordbankCtx { where?: string; when?: string; who?: string; what?: string; tone?: string; userPrompt?: string; }

export function buildWordbankPrompt(ctx: WordbankCtx): string {
  let p = 'Du erstellst eine "Wortbank" für einen prozeduralen, deutschsprachigen Kreativ-Textgenerator. '
    // Die Zahlen sind gemessen, nicht geraten: Bei 44 Einträgen trägt ein Preset
    // einen 450-Wörter-Bericht auf 56 % der Vorgabe, bei 89 auf 66 %, bei 112
    // auf 87 %, bei 147 auf 95 %. Der Knick liegt bei rund 120 — darüber gewinnt
    // man fast nichts mehr, darunter bricht es ein.
    //
    // NACHTRAG 4.277.0: Die Zahl 120 zählt EINTRÄGE, und das ist das falsche Maß.
    // Über 23 ausgebaute Presets gemessen: Die Zahl der Einträge (120-147) sagt
    // fast nichts über die Treue voraus, die Zahl der WÖRTER dagegen viel —
    // r = 0,80. jugendsprache trägt 123 Einträge mit 557 Wörtern und kommt auf
    // 72 %; bergwelt trägt 128 Einträge mit 923 Wörtern und kommt auf 108 %.
    // Rund 850 Wörter braucht ein Preset für volle Treue, also im Schnitt sieben
    // Wörter je Eintrag. Deshalb steht die Wortzahl jetzt im Auftrag.
    + "Die Wortbank besteht aus 7 Textkategorien mit ZUSAMMEN rund 125 kurzen, stimmungsvollen deutschen "
    + "Phrasen (keine ganzen Absätze, meist 3-10 Wörter), passend zu folgendem Kontext:\n"
    + `Ort: ${ctx.where || "(offen)"}\nZeit: ${ctx.when || "(offen)"}\nFigur(en): ${ctx.who || "(offen)"}\n`
    + `Handlung: ${ctx.what || "(offen)"}\nTon: ${ctx.tone || "(offen)"}\n`;
  if (ctx.userPrompt) p += `\nZUSÄTZLICHE VORGABE DES NUTZERS (vorrangig): ${ctx.userPrompt}\n`;
  p += "\nKategorien mit ANZAHL (die Zahlen bitte einhalten, sie sind gemessen):\n"
    + KATEGORIE_VORGABE.map((k) =>
      `- ${k.key}: ${k.anzahl} ${k.text} (${k.min}–${k.max})` +
      (k.woerter ? `, ~${k.woerter} Wörter je Eintrag` : "") + "\n").join("")
    + "\n"
    + "EINE HAND, NICHT DREI: Alle Einträge müssen aus DERSELBEN Welt stammen — gleiches Register, "
    + "gleiche Bildwelt, gleicher Wortschatz. Das ist keine Stilfrage, sondern gemessen: Ein Preset aus "
    + "einer Hand trägt einen langen Text auf 95 % der Vorgabe, eine Mischung aus drei Presets bei "
    + "GLEICHER Größe nur auf 84 %. Der Generator prüft jeden Anschluss auf Kasus, Tempus und Satztyp und "
    + "verwirft mehr, wenn das Material auseinanderfällt. Lieber 120 Einträge aus einer Welt als 200 aus dreien.\n\n"
    + "WORTZAHL — das eigentliche Maß: Die 120 Einträge sollen ZUSAMMEN rund 850 Wörter tragen, "
    + "im Schnitt also SIEBEN Wörter je Eintrag. Das ist gemessen, nicht geschätzt: Über 23 Presets "
    + "sagt die Zahl der Einträge kaum etwas über die erreichte Textlänge voraus, die Zahl der Wörter "
    + "dagegen deutlich (r = 0,80). Ein Preset mit 123 Einträgen und 557 Wörtern trägt einen "
    + "450-Wörter-Bericht nur auf 72 %; eines mit 128 Einträgen und 923 Wörtern auf 108 %. "
    + "Drei- und Vierwortbrocken (\"Das ist so random.\") füllen die Liste, aber nicht den Text. "
    + "Schreibe also lieber \"ein Wappen ohne Farbe an kalter Mauer\" als \"ein Wappen\".\n\n"
    + "WO die Wörter stehen, entscheidet mit: turns, obstacles und endings tragen den Bericht "
    + "deutlich stärker als props und motifs. In einem Versuch mit fünf Presets brachten hundert "
    + "zusätzliche Wörter in den SATZ-Kategorien rund 9 Prozentpunkte Länge, hundert Wörter in den "
    + "Nominal-Kategorien nur rund 6. Halte turns, obstacles und endings deshalb bei mindestens "
    + "sieben Wörtern — ein vollständiger Satz mit einem Umstand, nicht ein Stichwort. "
    + "Für props gilt das NICHT: Sie stehen im Bestand bei rund vier Wörtern, weil sie als Objekt in "
    + "einen fremden Satz gesetzt werden — \"einen Kompass mit beschlagenem Glas\" ist die richtige Länge, "
    + "ein ganzer Satz wäre dort falsch. Über alle Kategorien tragen die Satz-Kategorien (hooks, turns, "
    + "obstacles, endings) rund 65 Prozent der Wörter; das ist die Verteilung, die der Bestand hat.\n\n"
    + "MOTIVE MÜSSEN ALLEIN STEHEN KÖNNEN: Jedes motif ist eine Nominalphrase mit Artikel und "
    + "eigenem Kopf, am besten mit Relativsatz — \"eine Glocke, die über allen Dächern hängt\". "
    + "NICHT: \"Brot und Ketten\", \"Kanäle unter der Stadt\", \"die Kathedrale im Regen\". "
    + "Solche Bruchstücke haben keinen Kopf, an den der Generator anschließen kann. Gemessen an "
    + "einem Preset mit zehn davon: Der Zusammenbau brach in 33 von 60 Läufen mitten im Text ab, "
    + "der Median lag bei 90 statt 400 Wörtern. Nach dem Umschreiben: 387.\n\n"
    + "Die Zahl 120 ist übrigens KEIN Ziel für sich. Über 23 Presets gemessen sagt die Eintragszahl "
    + "nichts mehr voraus, sobald die Wortzahl bekannt ist (r = -0,04). 90 lange Einträge sind so "
    + "gut wie 120 kurze, solange die 850 Wörter zusammenkommen.\n\n"
    + "UND NICHT MEHR ALS 850: Der Ertrag sättigt. An zwölf nachverdichteten Presets gemessen "
    + "bringen hundert zusätzliche Wörter unterhalb von 85 Prozent Länge noch 11 bis 18 Punkte, "
    + "oberhalb von 91 Prozent nur noch 1 bis 3. Wer über 850 hinausschreibt, gewinnt keine Länge "
    + "mehr, sondern nur noch Abwechslung — das ist ein Grund, aber ein anderer.\n\n"
    + "MOTIVVERWANDLUNGEN — die achte Liste: 41 der 51 eingebauten Presets tragen sie, im Median acht "
    + "Paare. Ein Paar sagt, was aus einem Bild wird, wenn es WIEDERKEHRT: Das erste Vorkommen bleibt "
    + "stehen und führt das Motiv ein, jedes weitere wird verwandelt. Der Leser sieht dasselbe Ding "
    + "zweimal, und beim zweiten Mal ist es etwas anderes geworden.\n"
    + "Form: \"Wort→Wort\", ein Paar je Eintrag, z.B. \"Glocke→Stimme\", \"Harpune→Feder\", \"Akte→Mappe\".\n"
    + "HARTE BEDINGUNG: Beide Wörter müssen DASSELBE GESCHLECHT haben (der/der, die/die, das/das). "
    + "Sonst steht im Text \"das Stille\", weil der Artikel davor nicht mitverwandelt wird — und der "
    + "Generator wirft solche Paare still weg. Nimm Grundwörter im Singular, keine Wortgruppen.\n\n"
    + "KEINE DUBLETTEN: Kein Eintrag darf zweimal vorkommen, auch nicht leicht abgewandelt. "
    + "Ein Eintrag zweimal ist kein zweiter Eintrag.\n\n"
    + "ZEITFORM: Satzartige Einträge (hooks, turns, obstacles, endings) im PRÄSENS. Kein Präteritum, kein Perfekt.\n\n"
    + "WICHTIG: Deine Antwort MUSS mit { beginnen und mit } enden — nur reines JSON mit genau diesen 8 Schlüsseln "
    + "(motifs, hooks, props, turns, obstacles, stakes, endings, verwandlungen), jeweils ein Array von Strings. "
    + "Keine Erklärungen, kein Markdown.";
  return p;
}

/** Erzeugt eine Wortbank per KI und gibt sie normalisiert zurück (Aufrufer speichert sie als Preset). */
export async function generateAiWordbank(ctx: WordbankCtx): Promise<Bank> {
  // 120 statt 50 Einträge brauchen mehr Platz — bei 4096 riss die Antwort mittendrin ab.
  const raw = await callClaude(buildWordbankPrompt(ctx), 8192, "{");
  return normalizeBankShape(extractJson(raw));
}

/** Übergibt einen Text an Claude und gibt eine geglättete Rohfassung zurück. */
export async function elaborateText(text: string, targetWords: number): Promise<string> {
  const n = Math.max(100, Math.min(2000, Math.round(targetWords)));
  const prompt = "Hier ist ein kurzer, oft sperriger Rohtext aus einem experimentellen Textgenerator "
    + "(Divergenzmaschine). Arbeite ihn zu einem zusammenhängenden literarischen Prosatext von etwa " + n + " Wörtern aus: "
    + "entfalte Bilder, Szenen, Figuren und Atmosphäre, vertiefe die vorhandenen Motive und behalte den surrealen, "
    + "dichten Ton bei. Bleibe bei den vorgegebenen Figuren, Orten und der Grundidee; erfinde nichts, was dem Text "
    + "widerspricht. Schreibe auf Deutsch. Gib NUR den ausgearbeiteten Text zurück, ohne Überschrift, Erklärung oder "
    + "Meta-Kommentar.\n\n---\n\n" + text;
  const maxTok = Math.min(8192, Math.ceil(n * 2.4) + 400);
  return callClaude(prompt, maxTok);
}

export async function smoothText(text: string): Promise<string> {
  const prompt = "Hier ist ein maschinell generierter, oft sperriger Rohtext aus einem kreativen Textgenerator "
    + "(Divergenzmaschine). Schreibe daraus eine flüssige, kohärente Rohfassung: behebe Grammatikfehler, "
    + "Logikbrüche und Wiederholungen, glätte den Erzählfluss, behalte aber Figuren, Orte und Handlung bei. "
    + "Gib NUR den überarbeiteten Text zurück, ohne Erklärungen oder Meta-Kommentare.\n\n---\n\n" + text;
  return callClaude(prompt);
}
