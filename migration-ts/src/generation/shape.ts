// Form-Shaper: Disruptor, Rhythmus, Absätze, Perspektive, Pronominalisierung.
// Perspektive ist bewusst schlank (Name→Pronomen, ohne die große VERB_CONJ-
// Konjugationstabelle); die "du"-Kongruenz übernimmt coherenceRepairV2.
import { clean, pick, chance, splitSentences, escapeRegExp } from "../text-utils";
import { chooseInsertPos, isFragmentSentence, cap } from "./beats";
import { VERB_CONJ } from "./verbconj.data";
import { KEIN_NOMEN } from "./polish";
import { conjugateVerbToken } from "./verbconj";
import { ICH_DU_ZU_ER } from "./wordcls";
import { guessGender } from "./declension";

export interface DisruptorResult { text: string; fired: boolean; kind: string; }

export function applyDisruptor(text: string, level: string): DisruptorResult {
  const p = level === "off" ? 0 : level === "on" ? 0.33 : 0.17;
  if (!chance(p)) return { text, fired: false, kind: "–" };
  const kinds: { kind: string; fn: (t: string) => string }[] = [
    { kind: "Zeitbruch", fn: (t) => t + " Drei Jahre später ist die gleiche Stelle noch da, aber das Geräusch ist älter." },
    { kind: "Erzählerwechsel", fn: (t) => t.replace(/\n\n/g, "\n\n—\n\n") + "\n\nIch übernehme hier. Nur kurz. Nur, um das Offensichtliche zu sagen." },
    { kind: "Metakommentar", fn: (t) => t + "\n\n(Diese Geschichte weiß, dass sie erzählt wird.)" },
    { kind: "Wiederholung", fn: (t) => { const s = splitSentences(t); if (s.length < 3) return t; return t + "\n\n" + s[Math.floor(s.length * 0.65)]; } },
    { kind: "Fragmentierung", fn: (t) => { const s = splitSentences(t); if (s.length < 4) return t; s.splice(Math.floor(s.length / 2), 0, "—"); return s.join(" "); } },
  ];
  const k = pick(kinds);
  return { text: k.fn(text), fired: true, kind: k.kind };
}

const FRAGMENTS = ["Stille.", "Zu nah.", "Zu klar.", "Ein Fehler.", "Noch nicht.", "Dann.", "Nein.", "Vielleicht.", "Fast.", "Genau jetzt."];

/** Womit ein Teilsatz anfängt, der NIE allein stehen kann. */
const NEBENSATZ_ANFANG = /^(der|die|das|dem|den|des|deren|dessen|welche[rsmn]?|wo|worin|woran|worauf|als|wenn|weil|obwohl|während|nachdem|bevor|damit|dass|ob|sodass|indem|sobald|solange|bis|seit|falls|wobei|wodurch|womit)\b/i;

export function applyRhythm(text: string, rhythm: string): string {
  const s = splitSentences(text);
  const insertFrag = (prob: number): void => {
    if (chance(prob)) { const pos = chooseInsertPos(s); if (pos >= 0) s.splice(pos, 0, pick(FRAGMENTS)); }
  };
  if (rhythm === "clean") return s.join(" ");
  if (rhythm === "breath") {
    insertFrag(0.55);
    if (s.length >= 5 && chance(0.45)) { const i = Math.floor(1 + Math.random() * (s.length - 2)); s[i] = "Und " + s[i]!.charAt(0).toLowerCase() + s[i]!.slice(1); }
  }
  if (rhythm === "staccato") {
    insertFrag(0.75);
    if (s.length >= 4 && chance(0.6)) {
      const i = Math.floor(1 + Math.random() * (s.length - 2)); const t = s[i]!; const cut = t.indexOf(", ");
      // Dieselbe Regel wie in applyTension: Ein Komma vor einem Nebensatz ist
      // keine Satzgrenze.
      if (cut > 10 && cut < 80 && !NEBENSATZ_ANFANG.test(t.slice(cut + 2))) { s[i] = t.slice(0, cut) + "."; s.splice(i + 1, 0, t.slice(cut + 2)); }
    }
    if (chance(0.35)) { const at = Math.min(2, s.length); if (!isFragmentSentence(s[at - 1] || "") && !isFragmentSentence(s[at] || "")) s.splice(at, 0, pick(["Stille.", "Warte.", "So.", "Gut."])); }
  }
  if (rhythm === "long") {
    if (s.length >= 6 && chance(0.6)) {
      const i = Math.floor(1 + Math.random() * (s.length - 3)); const first = s[i]!.replace(/[.!?…]+$/, ""); const next = s[i + 1]!;
      const joiner = /^(und|aber|doch|denn|sondern)\b/i.test(next) ? ", " : (chance(0.5) ? ", und " : "; ");
      s[i] = first + joiner + next.charAt(0).toLowerCase() + next.slice(1); s.splice(i + 1, 1);
    }
    if (chance(0.4)) s.push("Und während all das geschieht, bleibt etwas in der Luft hängen, als wäre es nie für Menschen gedacht gewesen.");
  }
  if (rhythm === "fracture") {
    insertFrag(0.70);
    if (s.length >= 5 && chance(0.6)) { const i = Math.floor(1 + Math.random() * (s.length - 2)); s[i] = s[i]!.replace(/[.!?…]+$/, "") + " —"; s.splice(i + 1, 0, "und genau dort bricht die Erklärung ab."); }
    if (chance(0.45)) s.splice(Math.floor(s.length * 0.65), 0, "(Dieser Satz war nicht geplant.)");
  }
  return s.join(" ");
}

// Spannungs-Hüllkurve: verschiebt die Intensität an eine Position im Text.
// Nahe dem Peak: kurze, harte Sätze (Komma-Splits + Fragmente). Fern: ruhige,
// verbundene Bögen. Grammatik-sichere Operationen (wie applyRhythm). Nur Prosa.
const TENSION_CENTER: Record<string, number> = { top: 0.15, mid: 0.5, low: 0.85 };
export interface TensionMaterial { motifs?: string[]; hooks?: string[]; }
export function applyTension(text: string, peak?: string, material?: TensionMaterial): string {
  if (!peak || peak === "off") return text;
  const center = TENSION_CENTER[peak];
  if (center === undefined) return text;
  const s = splitSentences(text);
  if (s.length < 5) return text; // erst bei längeren Passagen spürbar
  const width = 0.26;
  const intensity = (i: number, n: number): number => {
    const pos = n <= 1 ? 0 : i / (n - 1);
    const d = (pos - center) / width;
    return Math.exp(-0.5 * d * d); // 0..1
  };
  // 1) Anspannen nahe Peak: lange, komma-getrennte Sätze in Staccato brechen (rückwärts, indexstabil)
  for (let i = s.length - 1; i >= 0; i--) {
    const it = intensity(i, s.length);
    if (it > 0.6 && chance(it * 0.7)) {
      const t = s[i]!; const cut = t.indexOf(", ");
      // NICHT an jedem Komma trennen. Führt es einen Nebensatz oder Relativsatz
      // ein, ist der Teil dahinter kein eigener Satz — im Blatt stand „Das
      // Karten fälscht sucht die Spur", weil „ein Schulmädchen, das Karten
      // fälscht" hier auseinandergeschnitten wurde.
      const rest = t.slice(cut + 2);
      const unteilbar = NEBENSATZ_ANFANG.test(rest);
      if (cut > 10 && cut < 90 && !unteilbar) { s[i] = t.slice(0, cut) + "."; s.splice(i + 1, 0, cap(rest)); }
    }
  }
  // Ein, zwei kurze Fragmente direkt am Peak einstreuen
  for (let pass = 0; pass < 2; pass++) {
    const idx = Math.round(center * (s.length - 1));
    if (idx > 0 && idx < s.length && chance(0.55) && !isFragmentSentence(s[idx - 1] || "") && !isFragmentSentence(s[idx] || "")) {
      s.splice(idx, 0, pick(FRAGMENTS));
    }
  }
  // 2) Entspannen fern vom Peak: kurze Nachbarsätze zu ruhigen Bögen verbinden
  for (let i = 0; i < s.length - 1; i++) {
    if (s.length <= 4) break;
    const it = intensity(i, s.length);
    if (it < 0.3 && chance((0.3 - it) * 1.2)) {
      const first = s[i]!.replace(/[.!?…]+$/, ""); const next = s[i + 1]!;
      if ((first.length + next.length) < 160 && !isFragmentSentence(first) && !isFragmentSentence(next)) {
        const joiner = /^(und|aber|doch|denn|sondern)\b/i.test(next) ? ", " : (chance(0.5) ? ", und " : "; ");
        // Nach "; " bleibt die Groß-/Kleinschreibung erhalten (Nomen wie „Regen“); bei Komma-Fortsetzung klein.
        const cont = joiner === "; " ? next : next.charAt(0).toLowerCase() + next.slice(1);
        s[i] = first + joiner + cont; s.splice(i + 1, 1); i--;
      }
    }
  }
  // 3) Verdichten am Peak: Hook-/Motiv-Bilder als kurze, harte Bild-Sätze einstreuen
  const mat = [...(material?.hooks || []), ...(material?.motifs || [])].map((x) => (x || "").trim()).filter((x) => x.length >= 4);
  if (mat.length) {
    for (let k = 0; k < 2; k++) {
      const cand = pick(mat);
      if (!cand || s.join(" ").toLowerCase().includes(cand.toLowerCase())) continue;
      if (!chance(0.7)) continue;
      const idx = Math.max(1, Math.min(s.length, Math.round(center * (s.length - 1)) + k));
      s.splice(idx, 0, cap(cand.replace(/[.!?…]+$/, "")) + ".");
    }
  }
  // 4) Positionsabhängiger Disruptor: harter Bruch direkt am Peak
  {
    const idx = Math.round(center * (s.length - 1));
    if (idx > 0 && idx < s.length - 1 && chance(0.5)) {
      const t = s[idx]!.replace(/[.!?…]+$/, "");
      if (t.length > 12 && !isFragmentSentence(t)) { s[idx] = t + " —"; s.splice(idx + 1, 0, pick(["und genau hier kippt es.", "kein Zurück.", "jetzt.", "und nichts hält mehr."])); }
    }
  }
  return s.join(" ");
}

export function paragraphize(txt: string): string {
  const s = splitSentences(txt);
  if (s.length <= 3) return txt;
  const breaks = new Set<number>();
  const target = chance(0.6) ? 2 : 1;
  while (breaks.size < target) breaks.add(Math.min(s.length - 2, Math.max(1, Math.floor(1 + Math.random() * (s.length - 2)))));
  const out: string[] = [];
  for (let i = 0; i < s.length; i++) { out.push(s[i]!); if (breaks.has(i)) out.push("\n\n"); }
  return out.join(" ").replace(/\s+\n\n\s+/g, "\n\n").trim();
}

export function guessPronoun(P: string): string {
  const p = clean(P);
  if (/^(der|ein)\s/i.test(p)) return "er";
  if (/^(die|eine)\s/i.test(p)) return "sie";
  if (/^das\s/i.test(p)) return "es";
  if (/(a|e|in)$/i.test(p)) return "sie";
  return "er";
}

// ── Perspektive „Objekt" ──────────────────────────────────────────────────
// Sie setzte bis 4.261.0 nur eine Regieanweisung vor jeden Absatz:
// „(das Objekt) Ein Augenblick dauert eine ganze Straße …". Das ist keine
// Perspektive, das ist ein Etikett — und im Zeitungssatz wurde daraus die
// Überschrift (Ausgabe Nr. 40, Aufmacher).
//
// Jetzt spricht das Ding. Der RAHMEN steht in der ersten Person, der Körper des
// Absatzes bleibt in der dritten: Ein Gegenstand, der von Menschen erzählt, tut
// das in der dritten Person. Jede andere Fassung müsste jedes Verb im Text
// umbeugen — genau daran ist die Umstellung „Ich/Du/Wir" schon einmal
// gescheitert. Die Rahmensätze sind deshalb in sich abgeschlossen und hängen an
// keinem Wort des Textes.
/** Wörter auf -t, die keine Verben sind. Ohne sie machte die Beugung aus
 *  „alt" ein „alst". */
const KEIN_VERB_AUF_T = new Set(["alt", "kalt", "laut", "bunt", "hart", "zart", "satt", "glatt",
  "weit", "breit", "rot", "tot", "gut", "spät", "echt", "leicht", "dicht", "recht", "schlecht",
  "nackt", "fest", "letzt", "jetzt", "sanft", "ernst", "wert", "leer", "seit", "statt", "samt",
  "nicht", "mit", "seid", "zuletzt", "zuerst", "oft", "fast", "erst", "sonst", "meist", "direkt"]);

/** Wörter, nach denen ein Subjekt folgen darf. */
const SUBJ_FUGE = /^(und|oder|aber|denn|doch|sondern|dann|da|weil|dass|als|wenn|während|obwohl|bevor|nachdem|sobald|solange|ob|wie|so|auch|nur|jetzt|dort|hier|heute|gestern|morgen|plötzlich|dabei|dadurch|deshalb|trotzdem|später|zuerst|zuletzt|außerdem|schließlich)$/i;

const DEF_ART: Record<string, string> = { m: "der", f: "die", n: "das" };
/** „Antrag" → „der Antrag". Ohne Artikel entstand „Ich bin Prozess". */
export function objektName(o: string): string {
  const t = clean(o);
  if (!t) return "das Ding";
  if (/^(der|die|das|den|dem|des|ein|eine|einen|einem|einer|eines)\s/i.test(t)) return t;
  const kern = t.split(" ")[0]!.replace(/[^A-Za-zÄÖÜäöüß]/g, "");
  return `${DEF_ART[guessGender(kern) || "n"]} ${t}`;
}
const DING_VORRAT = ["Tür", "Uhr", "Karteikarte", "Lampe", "Schlüssel", "Fenster", "Bank",
  "Treppe", "Spiegel", "Kiste", "Zettel", "Mauer", "Stuhl", "Leitung", "Schwelle"];
export const OBJEKT_EINSTIEG = [
  // NICHT „… und zaehle mit.": Der Bruchstueck-Filter braucht dort ein finites
  // Verb, und hatFinitesVerb() erkennt die erste Person nicht. Ein Rahmensatz,
  // der von einem unzuverlaessigen Erkenner abhaengt, ist ein Rahmensatz auf Zeit.
  "Ich bin %O. Ich liege hier und zähle die Tage.",
  "Ich bin %O. Man hat mich hier vergessen.",
  "Ich bin %O. Niemand fragt mich, und ich sehe alles.",
  "Ich bin %O. Ich habe keine Augen und trotzdem einen Blick.",
  "Ich bin %O. Ich bleibe, wo man mich hingestellt hat.",
  "Ich bin %O. Man geht an mir vorbei, seit Jahren.",
];
/** Erkennt den Rahmensatz am Textanfang — zwei Sätze, der erste nennt das Ding.
 *  Die Nachbearbeitung braucht das, um ihre Ton-Einleitung NICHT davorzusetzen:
 *  Die Zeitung baut ihre Überschrift aus dem Textanfang, und der Rahmen stand
 *  sonst abgeschnitten in der Zeile („… So liegt der Fall. Ich bin das …"). */
export const OBJEKT_KOPF_RE = /^(Ich bin (?:der|die|das) [^.!?]{1,40}\.\s+[^.!?]{1,70}\.)\s*/;

const OBJEKT_ZWISCHENRUF = ["Ich sehe zu.", "Ich liege dabei.", "Ich zähle mit.",
  "Ich rühre mich nicht.", "Ich habe Zeit.", "Ich merke es mir."];

export function applyPerspective(paras: string[], perspective: string, who: string, objName: string): string[] {
  const P = clean(who) || "Jemand";
  const O = objektName(clean(objName) || pick(DING_VORRAT));
  const swap = (s: string, person: string, pronoun: string): string => {
    if (!P) return s;
    try {
      // Ohne "i" wurde die Figur am Satzanfang nicht gefunden: gesucht wurde "ich",
      // dort steht aber "Ich". Der Baustein blieb dann unveraendert stehen.
      const re = new RegExp("([A-Za-zÄÖÜäöüß]+\\s+)?\\b" + escapeRegExp(P) + "\\b(\\s+[A-Za-zÄÖÜäöüß]+)?", "gi");
      return s.replace(re, (_m: string, before?: string, after?: string, ...rest: unknown[]) => {
        // Nicht in Zusammensetzungen ersetzen: Sonst wird aus "Über-Ich" ein
        // "Über-du". Der Bindestrich davor macht den Unterschied.
        const idx = rest[rest.length - 2] as number;
        const voll = rest[rest.length - 1] as string;
        const posP = voll.toLowerCase().indexOf(P.toLowerCase(), idx);
        if (posP > 0 && /[-–\wÄÖÜäöüß]/.test(voll.charAt(posP - 1))) return _m;
        // Nicht die Grossschreibung des Originals uebernehmen: Ein Eigenname ist
        // IMMER gross, ein Pronomen nur am Satzanfang. So entstand "bemerke Ich
        // einen Stempel" und "Was Ich will". Massgeblich ist die Stelle im Text.
        const davor = voll.slice(0, posP).replace(/\s+$/, "");
        const gross = davor === "" || /[.!?…:;—–„"»(]$/.test(davor);
        const pron = gross ? pronoun.charAt(0).toUpperCase() + pronoun.slice(1) : pronoun;
        const bw = before ? before.trim() : "";
        const aw = after ? after.trim() : "";
        // Erst auf die dritte Person bringen: Die Konjugationstabelle ist danach
        // geschluesselt, ein Baustein kann aber schon eine Person tragen
        // ("ich bemerke"). Ohne diesen Schritt blieb er stehen und ergab
        // "du bemerke eine Erinnerung".
        const bw3 = ICH_DU_ZU_ER[bw.toLowerCase()] || bw;
        const aw3 = ICH_DU_ZU_ER[aw.toLowerCase()] || aw;
        // Rueckfall fuer schwache Verben ohne Tabelleneintrag. Das Endungs-t der
        // dritten Person wird ERSETZT, nicht ergaenzt: "erinnert" -> "erinnerst",
        // nicht "erinnertst". Bei Stamm auf -e ("wartet" -> "warte") faellt das
        // zusaetzliche e weg.
        const beuge = (v: string): string => {
          if (VERB_CONJ[v.toLowerCase()]) return conjugateVerbToken(v, person);
          if (!/[a-zäöüß]{3,}t$/.test(v)) return v;
          const stamm = v.slice(0, -1);                       // ohne das End-t
          const hatE = /e$/.test(stamm);
          if (person === "du") return stamm + "st";
          if (person === "ich") return hatE ? stamm : stamm + "e";
          if (person === "wir") return hatE ? stamm + "n" : stamm + "en";
          return v;
        };
        // Vier Buchstaben reichen: „erbt" fiel durch das alte {4,} und ergab
        // „Du erbt ein Amt" — gemessen in 28 % der Du-Texte. Adjektive auf -t
        // („alt", „kalt") stehen in der Sperrliste, sonst würde daraus „kalst".
        const kennt = (v: string): boolean =>
          !!VERB_CONJ[v.toLowerCase()]
          || (/^[a-zäöüß]{3,}t$/.test(v) && !KEIN_VERB_AUF_T.has(v.toLowerCase()));

        // ── Nur in SUBJEKTSTELLUNG ersetzen ──────────────────────────────
        // Gemeldet an einem gesammelten Wikipedia-Satz: „In der Toskana wird
        // der italienische Festungsbaumeister und Militär du geboren." Der Name
        // steckt dort in einer Apposition — an dieser Stelle kann kein Pronomen
        // stehen, in keiner Sprache. Gemessen: 31 % der Du-Texte.
        //
        // Subjektstellung heißt: am Satzanfang, nach einem Satzzeichen, nach
        // einer Konjunktion — oder nach einem finiten Verb (Inversion: „Am
        // Morgen bemerkt der Sohn eines Fälschers …"). Steht davor ein Nomen
        // oder ein Adjektiv, bleibt der Satz in der dritten Person. Eine
        // gemischte Perspektive ist in deutscher Prosa üblich; ein Pronomen in
        // einer Apposition ist es nicht.
        const letztesWort = (davor.match(/[A-Za-zÄÖÜäöüß-]+$/) || [""])[0]!;
        const subjektstelle = gross
          || /[,;]$/.test(davor)
          || SUBJ_FUGE.test(letztesWort)
          || (!!bw && kennt(bw3));
        if (!subjektstelle) return _m;

        if (bw && kennt(bw3)) return beuge(bw3) + " " + pron + (after || "");
        if (aw && kennt(aw3)) return (before || "") + pron + " " + beuge(aw3);
        return (before || "") + pron + (after || "");
      });
    } catch {
      return s.replace(new RegExp("\\b" + escapeRegExp(P) + "\\b", "gi"), pronoun);
    }
  };
  const toFirst = (s: string) => swap(s, "ich", "ich");
  const toSecond = (s: string) => swap(s, "du", "du");
  const toWe = (s: string) => swap(s, "wir", "wir");
  // Im Wechsel („split") wird das Ding nur kurz hörbar: Der volle Rahmen mit
  // Namen wiederholte sich sonst alle vier Absätze.
  const toObject = (s: string) => `${pick(OBJEKT_ZWISCHENRUF)} ${s}`;
  if (perspective === "third") return paras;
  if (perspective === "first") return paras.map(toFirst);
  if (perspective === "second") return paras.map(toSecond);
  if (perspective === "we") return paras.map(toWe);
  if (perspective === "object") {
    // Nur der EINSTIEG, keine Schlusszeile. Eine solche stand in 12 von 30
    // gemessenen Texten am Ende nicht mehr da, wo sie hingehoert: Die
    // Nachbearbeitung haengt weiter an, und die Satzlaengen-Zusammenziehung
    // zerlegte sie. Ein Rahmen, der nur manchmal haelt, ist keiner.
    const einstieg = pick(OBJEKT_EINSTIEG).replace("%O", O);
    return paras.map((p, i) => (i === 0 ? `${einstieg} ${p}` : p));
  }
  // WAECHTER-OK: bewusste Teilmenge. Ein fester Reigen über die Absätze, kein
  // Abbild der Reglerliste. „we" fehlt absichtlich — ein Wir-Absatz mitten in
  // einem Er-Text liest sich wie ein Fehler, nicht wie ein Wechsel.
  const cycle = ["first", "second", "third", "object"];
  return paras.map((p, i) => {
    const k = cycle[i % cycle.length];
    if (k === "first") return toFirst(p);
    if (k === "second") return toSecond(p);
    if (k === "object") return toObject(p);
    return p;
  });
}

export function pronominalize(text: string, P: string, pronoun: string): string {
  const name = clean(P);
  if (!name || !pronoun) return text;
  let re: RegExp;
  try { re = new RegExp(`^${escapeRegExp(name)}\\s+[a-zäöüß]`); } catch { return text; }
  let seen = false, lastReplaced = false;
  return text.split(/\n\n+/).map((par) => {
    const s = splitSentences(par);
    for (let i = 0; i < s.length; i++) {
      if (!re.test(s[i]!)) continue;
      if (!seen) { seen = true; lastReplaced = false; continue; }
      if (lastReplaced) { lastReplaced = false; continue; }
      s[i] = cap(pronoun) + s[i]!.slice(name.length);
      lastReplaced = true;
    }
    return s.join(" ");
  }).join("\n\n");
}

// ── Satzlänge ─────────────────────────────────────────────────────────────
// Gemessen lag der Median bei 5 Wörtern, die Hälfte aller Sätze bei höchstens
// fünf, nur ein Prozent bei fünfzehn oder mehr. Deutsche Erzählprosa liegt eher
// bei fünfzehn bis achtzehn. Ursache ist die Bauweise: Ein Atom ergibt einen
// Satz, und Atome sind im Schnitt sechs Wörter lang. Der Rhythmus-Regler half
// nicht — "Lange Bögen" verband höchstens EIN Paar je Text und verschob den
// Schnitt um 0,2 Wörter.
//
// Deshalb hier ein eigener Schritt: Nachbarsätze werden verbunden, bis der
// Schnitt die Zielmarke erreicht. Verbunden wird nur, wo es grammatisch sicher
// ist — lieber ein kurzer Satz zu viel als ein falscher.

/** Fängt der Satz schon mit einer Verknüpfung an? Dann ist er bereits gebunden. */
const SCHON_GEBUNDEN = /^(und|doch|aber|oder|denn|dann|dabei|also|trotzdem|dennoch|sondern|nur|zuerst|zuletzt|währenddessen)/i;

/** Darf zwischen diesen beiden verbunden werden? */
function darfVerbinden(a: string, b: string, obergrenze: number): boolean {
  if (!a || !b) return false;
  // Ankündigungen und offene Gedankenstriche binden schon nach vorn.
  if (/[:;—–]\s*$/.test(a.replace(/[.!?…]+$/, ""))) return false;
  if (!/[.!?…]$/.test(a.trim())) return false;          // kein sauberer Schluss
  if (/[?!]$/.test(a.trim())) return false;             // Frage und Ausruf bleiben stehen
  if (SCHON_GEBUNDEN.test(b)) return false;
  if (/^[„»"(]/.test(b) || /[“«")]$/.test(a)) return false;   // Zitate nicht anfassen
  const wa = (a.match(/[A-Za-zÄÖÜäöüß]+/g) || []).length;
  const wb = (b.match(/[A-Za-zÄÖÜäöüß]+/g) || []).length;
  if (!wa || !wb) return false;
  return wa + wb <= obergrenze;
}

/** Verbindet zwei Sätze. Ein Satzglied ohne finites Verb wird angehängt wie eine
 *  Apposition (Gedankenstrich), zwei ganze Sätze mit Komma und Konjunktion. */
function verbinde(a: string, b: string, satzartig: boolean): string {
  const kopf = a.trim().replace(/[.!?…]+$/, "");
  const rest = b.trim();
  // Kleinschreiben nur, wenn das erste Wort sicher KEIN Nomen ist. Deutsche
  // Nomen bleiben auch mitten im Satz gross - ohne diese Pruefung entstand
  // "... — wäsche auf dem Balkon".
  const wort = (rest.match(/^[A-Za-zÄÖÜäöüß]+/) || [""])[0]!.toLowerCase();
  const darfKlein = KEIN_NOMEN.has(wort) || !!VERB_CONJ[wort];
  const weiter = darfKlein ? rest.charAt(0).toLowerCase() + rest.slice(1) : rest;
  if (!satzartig) return `${kopf} — ${weiter}`;
  // Kein ", denn": Das behauptet einen Grund, den der Text nicht hergibt.
  return `${kopf}${pick([", und ", "; ", " — "])}${weiter}`;
}

/** Hebt kurze Sätze an die Marke, indem Nachbarn verbunden werden. 0 lässt alles
 *  unverändert.
 *
 *  Die Marke ist eine OBERGRENZE, kein Mittelwert: Verbunden wird nur, solange
 *  das Ergebnis darunter bleibt, längere Sätze entstehen also nie durch diesen
 *  Schritt. Gemessen liegt der Schnitt bei Marke 15 bei rund 9 Wörtern. Bei 9
 *  verschwinden vor allem die Stummelsätze (1–3 Wörter von 15 auf 6 Prozent),
 *  die Zahl der Sätze ab zwölf Wörtern bleibt unverändert bei 1,5 je Text. */
/** Wirft einen Satz weg, der seinem Vorgänger wörtlich gleicht.
 *
 *  Gemessen in 200 Texten über beide Bauwege: 22 (11 %) enthielten zwei gleiche
 *  Nachbarsätze — „Der Fluss hat mich losgeschnitten. Der Fluss hat mich
 *  losgeschnitten." Es gibt keinen Fall, in dem das gewollt wäre; die Kreis-
 *  Struktur wiederholt ihren Anfang am ENDE, nicht daneben.
 *
 *  Verglichen wird ohne Satzzeichen und ohne Groß-/Kleinschreibung: Die
 *  Zusammenziehung schreibt den zweiten Satz klein und hängt ihn mit einem
 *  Gedankenstrich an — „Aus Symmetrie wird Unterschied — aus Symmetrie wird
 *  Unterschied." ist dieselbe Dublette, nur verkleidet. */
export function entferneDubletten(text: string): string {
  const kern = (x: string): string => x
    .replace(/^[—–\s]+/, "").replace(/[.!?…,;:—–\s]+$/, "")
    .replace(/\s+/g, " ").toLowerCase().trim();
  const ohne = text.split(/\n{2,}/).map((absatz) => {
    const s = splitSentences(absatz);
    if (s.length < 2) return absatz;
    const raus: string[] = [];
    for (const satz of s) {
      const k = kern(satz);
      // Nur der DIREKTE Nachbar. Eine Wiederholung mit Abstand ist ein Mittel.
      if (k && raus.length && kern(raus[raus.length - 1]!) === k) continue;
      raus.push(satz);
    }
    return raus.join(" ");
  }).join("\n\n");
  // Die verkleidete Dublette: Die Zusammenziehung hat die beiden schon mit
  // Gedankenstrich, Semikolon oder „, und" verbunden. splitSentences sieht dann
  // EINEN Satz — „Aus Symmetrie wird Unterschied — aus Symmetrie wird
  // Unterschied." Deshalb hier zusätzlich die Fuge selbst betrachten.
  return ohne.replace(/([^.!?…\n]{6,})\s*(?:—|–|;|,\s+und)\s*([^.!?…\n]{6,})/g,
    (ganz: string, links: string, rechts: string) =>
      (kern(links) && kern(links) === kern(rechts) ? links.replace(/\s+$/, "") : ganz));
}

export function applySatzlaenge(text: string, ziel: number): string {
  if (!ziel || ziel < 6) return text;
  const w = (x: string): number => (x.match(/[A-Za-zÄÖÜäöüß]+/g) || []).length;
  // Absatzweise, damit über eine Leerzeile hinweg nichts zusammenwächst.
  return text.split(/\n{2,}/).map((absatz) => {
    let s = splitSentences(absatz);
    if (s.length < 2) return absatz;
    // NICHT auf den Mittelwert steuern. Der erste Versuch tat das und lief in
    // eine Falle: Fünf kräftig verbundene Sätze am Anfang heben den Schnitt über
    // die Marke, danach bricht die Schleife ab - und die restlichen dreissig
    // Sätze bleiben so kurz wie vorher. Genau das fällt beim Lesen auf.
    // Stattdessen: Jede Fuge schliessen, deren Ergebnis noch unter der Marke
    // bleibt. Das hebt alle kurzen Sätze gleichmässig und begrenzt sich selbst,
    // weil ein Satz auf Ziellänge keinen weiteren Partner mehr aufnimmt.
    // Ein Fünftel bleibt kurz. Bei Ziel 15 lag der Anteil der Sätze mit höchstens
    // fünf Wörtern sonst bei null - der abgesetzte Kurzsatz ist in diesen Texten
    // aber ein Mittel und kein Mangel.
    const bleibtKurz = new Set<string>(s.filter(() => chance(0.2)));
    for (let runde = 0; runde < 200; runde++) {
      let beste = -1, kuerzeste = Infinity;
      for (let i = 0; i + 1 < s.length; i++) {
        const n = w(s[i]!) + w(s[i + 1]!);
        if (n > ziel) continue;
        if (bleibtKurz.has(s[i]!) || bleibtKurz.has(s[i + 1]!)) continue;
        if (!darfVerbinden(s[i]!, s[i + 1]!, ziel)) continue;
        if (n < kuerzeste) { kuerzeste = n; beste = i; }
      }
      if (beste < 0) break;
      const satzartig = hatFinitesVerbLeicht(s[beste]!);
      s = [...s.slice(0, beste), verbinde(s[beste]!, s[beste + 1]!, satzartig), ...s.slice(beste + 2)];
    }
    return s.join(" ");
  }).join("\n\n");
}

/** Grobe Frage: Steckt im Satz überhaupt ein finites Verb? Entscheidet nur über
 *  die Art der Fuge (Gedankenstrich gegen Konjunktion), nicht über das Ob. */
function hatFinitesVerbLeicht(satz: string): boolean {
  return (satz.match(/[a-zäöüß]{3,}/g) || []).some((w) => !!VERB_CONJ[w] || /^(ist|sind|war|waren|hat|haben|wird|werden|kann|muss|will|bleibt|steht|geht|kommt)$/.test(w));
}
