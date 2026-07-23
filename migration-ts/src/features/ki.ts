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
 *  Bei fehlender Streaming-Unterstützung fällt der Aufrufer auf callClaude zurück. */
export async function callClaudeStream(
  promptText: string, maxTokens: number, onDelta: (chunk: string, full: string) => void, signal?: AbortSignal,
): Promise<{ text: string; truncated: boolean }> {
  if (!loadAiKey()) throw new Error("Kein API-Schlüssel hinterlegt.");
  const model = loadAiModel();
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
        const ev = JSON.parse(payload) as { type?: string; delta?: { type?: string; text?: string; stop_reason?: string } };
        if (ev.type === "content_block_delta" && ev.delta?.type === "text_delta" && ev.delta.text) {
          full += ev.delta.text; onDelta(ev.delta.text, full);
        } else if (ev.type === "message_delta" && ev.delta?.stop_reason) {
          stop = ev.delta.stop_reason;
        }
      } catch { /* Zeile überspringen */ }
    }
  }
  return { text: full.trim(), truncated: stop === "max_tokens" };
}

export function extractJson(raw: string): unknown {
  let s = (raw || "").trim().replace(/^```(?:json)?\s*/i, "").replace(/```\s*$/, "").trim();
  const start = s.indexOf("{"), end = s.lastIndexOf("}");
  if (start === -1) throw new Error("Keine JSON-Antwort erhalten.");
  if (end === -1 || end <= start) throw new Error("Antwort abgeschnitten (kein '}').");
  const body = s.slice(start, end + 1).replace(/,\s*([}\]])/g, "$1");
  return JSON.parse(body);
}

export interface WordbankCtx { where?: string; when?: string; who?: string; what?: string; tone?: string; userPrompt?: string; }

function buildWordbankPrompt(ctx: WordbankCtx): string {
  let p = 'Du erstellst eine "Wortbank" für einen prozeduralen, deutschsprachigen Kreativ-Textgenerator. '
    + "Die Wortbank besteht aus 7 Kategorien mit je 8 bis 10 kurzen, stimmungsvollen deutschen Phrasen "
    + "(keine ganzen Absätze, meist 3-10 Wörter), passend zu folgendem Kontext:\n"
    + `Ort: ${ctx.where || "(offen)"}\nZeit: ${ctx.when || "(offen)"}\nFigur(en): ${ctx.who || "(offen)"}\n`
    + `Handlung: ${ctx.what || "(offen)"}\nTon: ${ctx.tone || "(offen)"}\n`;
  if (ctx.userPrompt) p += `\nZUSÄTZLICHE VORGABE DES NUTZERS (vorrangig): ${ctx.userPrompt}\n`;
  p += "\nKategorien (Beispiele nur zur Orientierung):\n"
    + '- motifs (wiederkehrende, unheimliche/poetische Bilder)\n- hooks (kleine, irritierende Details)\n'
    + '- props (Gegenstände mit Artikel im Akkusativ, z.B. "einen Schlüssel")\n- turns (Wendepunkte, ganzer Satz)\n'
    + '- obstacles (Hindernisse, ganzer Satz)\n- stakes (Satz, beginnend mit "Der Einsatz ist")\n- endings (Schlusssätze)\n\n'
    + "WICHTIG: Deine Antwort MUSS mit { beginnen und mit } enden — nur reines JSON mit genau diesen 7 Schlüsseln "
    + "(motifs, hooks, props, turns, obstacles, stakes, endings), jeweils ein Array von Strings. Keine Erklärungen, kein Markdown.";
  return p;
}

/** Erzeugt eine Wortbank per KI und gibt sie normalisiert zurück (Aufrufer speichert sie als Preset). */
export async function generateAiWordbank(ctx: WordbankCtx): Promise<Bank> {
  const raw = await callClaude(buildWordbankPrompt(ctx), 4096, "{");
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
