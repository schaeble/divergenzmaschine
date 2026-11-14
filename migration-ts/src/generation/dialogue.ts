// Dialog-Engine (Szene/Dialog). Reine Funktion: erzeugt aus einem StoryKit
// eine Szene. Enthält alle jüngsten Fixes: feste Beat-Positionen, Pool-Dedup,
// Instabilitäts-Guard, echte Regieanweisungen, roter Faden übers Thema.
import type { StoryKit } from "../types";
import { clean, pick, chance, ensurePunct } from "../text-utils";
import { beugeVerb } from "./verben";

const ARCHETYPE_SPEAKERS: Record<string, string[]> = {
  // Ohne Archetyp ein Mensch als Gegenüber (4.389.0): „Das System" und „Der
  // Apparat" sprachen mit jeder Figur, auch mit der Fährfrau am Fluss.
  neutral: ["Die Nachbarin", "Ein Fremder", "Der Wirt", "Die Schwester", "Ein Kind", "Der Alte", "Die Zöllnerin", "Ein Bote"],
  skorpion: ["Die Zeugin", "Der Blick", "Die Hand", "Die Stimme", "Der Vermerk"],
  psychopath: ["Der Gutachter", "Das Protokoll", "Die Instanz", "Der Operator", "Die Akte"],
  entdecker: ["Die Karte", "Der Weg", "Die Tür", "Der Rand", "Das Zeichen"],
};

export function pickSpeakerForArchetype(archId: string): string {
  return pick(ARCHETYPE_SPEAKERS[archId] || ARCHETYPE_SPEAKERS.neutral!);
}

// ── Der Stoff im Dialog (4.389.0) ──────────────────────────────────────────
// Gemessen an 4.386, 100 Szenen: „Und was hat das mit uns zu tun?" und „Das
// ist nur die Oberfläche." standen in 99 davon; vom Was der vier W war in
// keiner die Rede. Jetzt eröffnet das Gegenüber mit dem, was die Figur TUT,
// und Ort, Zeit, Requisit und Motiv kommen in wechselnden Sätzen vor.

/** Kurzer Sprechername: „Ein Nachtportier mit fotografischem Gedächtnis, der
 *  …" → „Nachtportier". Ohne Artikel, damit kein Geschlecht geraten wird;
 *  ein Adjektiv davor bleibt („Alter Mann"). Namen bleiben, wie sie sind. */
export function sprecherName(person: string): string {
  const roh = clean(person || "").split(",")[0]!.trim();
  const m = roh.match(/^(?:ein|eine|einen|der|die|das)\s+(.+)$/i);
  if (!m) return roh;
  const worte = m[1]!.split(/\s+/);
  // Bis zum ersten Nomen (großgeschrieben), höchstens ein Adjektiv davor.
  const i = worte.findIndex((w) => /^[A-ZÄÖÜ]/.test(w));
  if (i < 0) return roh;
  const kopf = worte.slice(Math.max(0, i - 1), i + 1).join(" ");
  return kopf.charAt(0).toUpperCase() + kopf.slice(1);
}

/** Das Was in der Du- oder Ich-Form: nur der erste Teilsatz, das Verb gebeugt,
 *  „sich" angepasst. null, wenn es nicht sicher geht (kein Verb vorn, ein
 *  Possessiv der dritten Person, ein zweites Verb im Teilsatz). */
export function wasInPerson(was: string, person: "du" | "ich"): string | null {
  const teil = clean(was || "").split(/[,;]|\s+(?:und|oder|aber|bevor|bis|weil|während|obwohl|damit|ohne dass)\s+/)[0]!.replace(/[.!?…]+$/, "").trim();
  const worte = teil.split(/\s+/);
  if (worte.length < 2 || worte.length > 12) return null;
  if (/(?<![\p{L}])(sein|seine|seinen|seinem|seiner|seines|ihr|ihre|ihren|ihrem|ihrer|ihres|er|sie|es|ihn|ihm)(?![\p{L}])/iu.test(teil)) return null;
  const verb = beugeVerb(worte[0]!.toLowerCase(), person);
  if (!verb) return null;
  const rest = worte.slice(1).join(" ").replace(/(?<![\p{L}])sich(?![\p{L}])/gu, person === "du" ? "dich" : "mich");
  return `${verb} ${rest}`;
}

const NACHFRAGE = ["Warum?", "Seit wann?", "Stimmt das?", "Und niemand soll es merken?", "Wozu?", "Wie lange noch?", "Weiß das jemand?"];
const ERWIDERUNG = ["Das ist nicht alles.", "Das sagst du jedes Mal.", "Und weiter?", "So einfach ist es nicht.", "Das glaubt dir keiner.", "Davon wird es nicht leichter.", "Du redest drum herum.", "Das hatten wir schon."];
const ORT_ZEILE = ["Warum gerade hier, {W}?", "Hier, {W}, fragt niemand danach.", "{Wc} hört jeder mit.", "{Wc} gelten andere Regeln."];
const ZEIT_ZEILE = ["Ausgerechnet {T}.", "Und das {T}.", "Warum {T}?"];
const PROP_ZEILE = ["Du hast {X} dabei.", "Wozu {X}?", "Leg {X} weg.", "Ich sehe {X}. Was soll das?"];
const MOTIV_ZEILE = ["Siehst du das? {Mc}.", "Da ist es wieder, {M}.", "Und dann {M}. Das auch noch.", "{Mc}. Ich habe es nicht erfunden."];
const WENDE_ZEILE = ["Dann — {X}.", "Und dann, {X}.", "Bis es kippt, {X}."];
const SELBST_ZEILE = ["Ich {X}. Mehr nicht.", "Ich {X}. Das ist alles.", "Ich {X}, und ich höre nicht auf.", "Ja. Ich {X}."];

type PoolKey = "setup" | "conflict" | "twist" | "fallout";
type Pool = Record<PoolKey, string[]>;

/**
 * Erzeugt eine Dialog-Szene.
 * @param kit       Bausteine des Laufs
 * @param lenTarget Ziel-Textlänge (steuert die Anzahl der Repliken)
 */
export function makeDialogueScene(kit: StoryKit, lenTarget = 110): string {
  const aId = kit.archetypeA || "neutral";
  const bId = kit.archetypeB || "neutral";
  const speakerA = kit.speakerA || kit.P;
  const speakerB = kit.speakerB || pickSpeakerForArchetype(bId);
  // Kurze Namen vor dem Doppelpunkt; zwei gleiche (zwei Schwestern) behalten
  // ihre lange Form, damit man sie unterscheiden kann.
  // „eine ohne Rückfahrkarte" ist ein Zusatz zur Figur, kein zweiter Sprecher
  // (stand als „Ohne Papiere:" vor jeder zweiten Zeile).
  // Auch ein abgetrennter Relativsatz ist keiner („Ein Kind, das zu viel
  // weiß" → „Das zu viel weiß:"). Ein Sprecher ist ein Name oder Artikel,
  // höchstens ein Adjektiv, dann ein Nomen.
  const istSprecher = (x: string): boolean => {
    const t = (x || "").trim();
    if (/^(ein|eine|einer)\s+(ohne|mit)\b/i.test(t)) return false;
    return /^(?:(?:ein|eine|der|die|das)\s+)?(?:[a-zäöüß]+\s+)?[A-ZÄÖÜ]/.test(t.charAt(0).toLowerCase() + t.slice(1)) || /^[A-ZÄÖÜ][a-zäöüß]+$/.test(t);
  };
  const echt = (kit.speakers || []).filter((x, k) => k === 0 || istSprecher(x));
  const lang = echt.length >= 2 ? echt : [speakerA, istSprecher(speakerB) ? speakerB : pickSpeakerForArchetype(bId)];
  let kurz = lang.map(sprecherName);
  // Heißen zwei gleich („Kind" und „Kind"), bekommt das Gegenüber einen
  // anderen Namen aus dem Vorrat; hilft das nicht, eine Ziffer.
  if (new Set(kurz).size < kurz.length && kurz.length === 2) {
    for (let k = 0; k < 6 && kurz[0] === kurz[1]; k++) kurz = [kurz[0]!, sprecherName(pickSpeakerForArchetype(bId))];
  }
  const cast = new Set(kurz).size === kurz.length ? kurz : kurz.map((n, k) => (kurz.indexOf(n) === k ? n : `${n} ${k + 1}`));

  // Runden aus dem Wortziel: Eine Zeile trägt samt Sprechername rund neun
  // Wörter (vorher durch sieben geteilt — bei Ziel 200 standen 283 da).
  let rounds = Math.round((lenTarget - 14) / 8) + (kit.instability === 2 ? 2 : kit.instability === 1 ? 1 : 0);
  rounds = Math.max(4, Math.min(40, rounds));
  if (rounds % 2 !== 0) rounds = Math.min(40, rounds + 1);

  const evenAt = (f: number): number => { let x = Math.round(rounds * f); if (x % 2 !== 0) x++; return Math.max(2, Math.min(rounds - 2, x)); };
  const oddAt = (f: number): number => { let x = Math.round(rounds * f); if (x % 2 === 0) x++; return Math.max(3, Math.min(rounds - 1, x)); };
  const BEAT = {
    ortB: oddAt(0.12), propB: oddAt(0.22), zeitB: oddAt(0.3), obstA: evenAt(0.38), surfB: oddAt(0.42),
    motivA: evenAt(0.52), turnA: evenAt(0.64), stakeB: oddAt(0.68), selbstA: evenAt(0.8), endA: rounds - 2, stageB: rounds - 1,
  };

  const phaseFor = (i: number): 0 | 1 | 2 | 3 => {
    const p = i / (rounds - 1);
    if (p < 0.30) return 0;
    if (p < 0.60) return 1;
    if (p < 0.85) return 2;
    return 3;
  };

  const POOLS: Record<string, Pool> = {
    neutral: {
      setup: ["Was genau ist hier los?", "Sag mir, was du gesehen hast.", "Ich versuche, es zu verstehen.", "Wir sind noch nicht sicher.", "Fang von vorne an.", "Was hast du wirklich gesehen?", "Ich höre zu."],
      conflict: ["Du weichst aus.", "Das passt nicht zusammen.", "Du verdrehst die Reihenfolge.", "Du hörst nicht zu.", "Das ergibt keinen Sinn.", "Du lässt etwas weg.", "Bleib bei der Wahrheit."],
      twist: ["Vielleicht war es nie so gemeint.", "Dann dreht sich die Ursache um.", "Es sagt etwas anderes, als wir hören.", "Die Regel gilt, aber anders.", "Vielleicht liegt es an uns.", "Der Grund verschiebt sich.", "Nichts davon war geplant."],
      fallout: ["Also bleibt nur das Ende.", "Dann ist das entschieden.", "Wir gehen von hier weg.", "Damit müssen wir leben.", "Dann ist es vorbei.", "Wir tragen es mit.", "Mehr bleibt nicht."],
    },
    skorpion: {
      setup: ["Ich sehe, dass du etwas verschweigst.", "Du bist näher, als du sein solltest.", "Das ist kein Zufall.", "Sag es – ohne Ausflucht.", "Du zögerst.", "Ich rieche die Lüge."],
      conflict: ["Du kontrollierst die Geschichte.", "Dein Schweigen ist ein Griff um meinen Hals.", "Ich kenne deine Lücken.", "Du willst Besitz, nicht Wahrheit.", "Du hältst etwas fest.", "Gib es zu."],
      twist: ["Dann gehört die Wahrheit niemandem.", "Die Nähe kippt: Jetzt hält es dich fest.", "Du wirst von deinem Satz behalten.", "Was du willst, will dich auch.", "Jetzt kehrt es sich um.", "Deine Nähe wird zur Falle."],
      fallout: ["Du gibst es zu, oder du verlierst alles.", "Ich lasse dich nicht ungeschoren.", "Wir sind jetzt Teil davon.", "Das Ende trägt deinen Namen.", "Du trägst die Schuld.", "Nichts entkommt mir."],
    },
    psychopath: {
      setup: ["Beschreibe den Sachverhalt.", "Emotion ist hier irrelevant.", "Das ist eine Beobachtung.", "Wir messen, was bleibt.", "Nenne die Fakten.", "Gefühle sind Rauschen."],
      conflict: ["Deine Schlüsse sind unzulässig.", "Du verwechselst Gefühl mit Fakt.", "Das ist Inkonsistenz.", "Du überschätzt Bedeutung.", "Dein Schluss ist falsch.", "Das ist unpräzise."],
      twist: ["Dann drehen wir den Vektor um.", "Die Ursache ist das Symptom.", "Du bist das Experiment.", "Die Regel ist nur ein Modell.", "Die Ursache ist Effekt.", "Du bist die Variable."],
      fallout: ["Der Fall ist abgeschlossen.", "Das Ergebnis ist eindeutig.", "Wir protokollieren das.", "Damit ist es erledigt.", "Abgeschlossen.", "Das Ergebnis steht."],
    },
    entdecker: {
      setup: ["Da vorne ist noch etwas.", "Wir gehen weiter.", "Die Richtung ist nicht zufällig.", "Ich will sehen, was dahinter liegt.", "Da vorn ist mehr.", "Komm weiter."],
      conflict: ["Du hältst mich auf.", "Du willst stehen bleiben.", "Du sperrst den Weg.", "Du hast Angst vor der nächsten Tür.", "Du bremst.", "Du fürchtest die Tür."],
      twist: ["Dann öffnet sich der Raum in die falsche Richtung.", "Die Karte beginnt zu laufen.", "Der Weg entdeckt uns.", "Hinter uns ist das Ziel.", "Der Weg dreht sich.", "Das Ziel liegt hinter uns."],
      fallout: ["Wir nehmen mit, was wir können.", "Wir lassen den Rest zurück.", "Es bleibt eine Spur.", "Und dann: weiter.", "Wir ziehen weiter.", "Eine Spur bleibt."],
    },
  };

  // Haltungen: jede Figur bekommt eine eigene Grundhaltung mit eigenen Zeilen,
  // damit der Mittelteil nicht austauschbar wird (glauben vs zweifeln vs abwehren).
  const STANCE_LINES: Record<string, Pool> = {
    glauben: {
      setup: ["Ich weiß, was ich gesehen habe.", "Es war genau so.", "Hör mir zu, es stimmt.", "Ich habe keinen Zweifel.", "Das ist die Wahrheit, ob du willst oder nicht.", "Ich war dabei.", "Frag, wen du willst.", "Ich sage es, wie es ist.", "Daran ist nichts zu deuten."],
      conflict: ["Es ist trotzdem wahr.", "Ich bleibe dabei.", "Du musst mir das glauben.", "Ich habe es selbst erlebt.", "Daran ändert dein Zweifel nichts.", "Ich nehme kein Wort zurück.", "Du warst nicht dort.", "Es wird nicht falsch, weil es dir nicht passt.", "Ich habe keinen Grund zu lügen."],
      twist: ["Also hatte ich recht.", "Dann bestätigt es sich.", "Ich wusste es die ganze Zeit.", "Genau das habe ich gesagt.", "Siehst du — es stimmt.", "Jetzt siehst du es selbst.", "Mehr wollte ich nie sagen.", "So fügt es sich."],
      fallout: ["Ich stehe dazu.", "Es bleibt wahr.", "Ich bereue kein Wort.", "So war es, so bleibt es.", "Ich würde es wieder sagen.", "Dabei bleibt es.", "Das nimmt mir keiner."],
    },
    zweifeln: {
      setup: ["Woher willst du das wissen?", "Bist du sicher?", "Das klingt zu einfach.", "Kann das überhaupt stimmen?", "Ich glaube nichts ohne Beweis.", "Wer hat dir das gesagt?", "Hast du es selbst gesehen?", "Das höre ich zum ersten Mal.", "Und das soll ich glauben?"],
      conflict: ["Das kann nicht stimmen.", "Beweis es mir.", "Da fehlt etwas.", "Warum sollte ich dir glauben?", "Deine Geschichte hat Löcher.", "Gestern klang es anders.", "Zeig es mir.", "Das eine passt nicht zum anderen.", "Du machst es dir leicht."],
      twist: ["Vielleicht hatte ich unrecht.", "Oder es ist ganz anders.", "Und wenn es doch stimmt?", "Jetzt zweifle ich an meinem Zweifel.", "Das ändert die Frage.", "Damit habe ich nicht gerechnet.", "Dann stimmt etwas anderes nicht.", "Sag das noch einmal."],
      fallout: ["Ich bin noch nicht überzeugt.", "Sicher bin ich trotzdem nicht.", "Vielleicht. Vielleicht auch nicht.", "Ich behalte meine Fragen.", "Ich sehe es mir morgen noch einmal an.", "Glauben ist zu viel gesagt.", "Wir werden sehen."],
    },
    abwehren: {
      setup: ["Muss das jetzt sein?", "Lass uns nicht darüber reden.", "Das geht dich nichts an.", "Ich will das nicht.", "Es ist nicht so wichtig.", "Nicht hier.", "Frag jemand anderen.", "Dazu sage ich nichts.", "Später vielleicht."],
      conflict: ["Das führt zu nichts.", "Hör auf zu bohren.", "Ich habe nichts gesagt.", "Lenk nicht ab.", "Reden wir über etwas anderes.", "Lass es gut sein.", "Du hörst, was du hören willst.", "Ich bin müde.", "Das habe ich so nie gemeint."],
      twist: ["Es ist zu spät dafür.", "Jetzt ist es sowieso egal.", "Ich hätte schweigen sollen.", "Vergiss, was ich gesagt habe.", "Dann weißt du es eben.", "Das wollte ich vermeiden.", "Nun ist es heraus.", "Mach damit, was du willst."],
      fallout: ["Es ist erledigt.", "Reden wir nicht mehr davon.", "Vergessen wir das.", "Genug jetzt.", "Ich gehe.", "Mehr sage ich nicht.", "Lass mich in Ruhe."],
    },
  };

  // Haltungen den Figuren zuweisen (kontrastierend, pro Szene gemischt).
  const STANCES = ["glauben", "zweifeln", "abwehren"];
  for (let k = STANCES.length - 1; k > 0; k--) { const j = Math.floor(Math.random() * (k + 1)); [STANCES[k], STANCES[j]] = [STANCES[j]!, STANCES[k]!]; }
  const stanceOf = (castIdx: number): string => STANCES[castIdx % STANCES.length]!;

  const capFirst = (s: string): string => { s = String(s || "").trim(); return s ? s.charAt(0).toUpperCase() + s.slice(1) : s; };
  const stripLead = (s: string): string => String(s || "").replace(/^(und|dann|aber|denn|so|doch)\s+/i, "").trim();
  const topic = clean(kit.motif || kit.W || "").replace(/[.!?…]+$/, "");
  // „Die Weide liegt still." stand hier fest — auch im Ministerium bei Nacht.
  const STAGE = ["Stille.", "Ein langer Blick.", "Keiner spricht weiter.", "Nichts bewegt sich.", "Draußen wird es still.", "Einer von beiden geht."];
  const ort = clean(kit.W || "").replace(/[.!?…]+$/, "");
  const ortKurz = ort.split(",")[0]!.trim();
  const zeit = clean(kit.T || "").replace(/[.!?…]+$/, "").split(",")[0]!.trim();
  const duWas = wasInPerson(kit.A || "", "du");
  const ichWas = wasInPerson(kit.A || "", "ich");
  const fuelleZ = (z: string, w: Record<string, string>): string => z.replace(/\{(\w+)\}/g, (_m, k: string) => w[k] ?? "");
  // Jeder Beat zieht einmal aus seinem Vorrat; ob er überhaupt kommt, hängt
  // an der Länge der Szene (bei vier Runden ist kein Platz für alles).
  const platz = (min: number): boolean => rounds >= min;

  const cleanDialogLine = (s: string): string => {
    s = clean(s);
    s = s.replace(/,\s*([.!?…])/g, "$1").replace(/\s*,\s*,\s*/g, ", ").replace(/„\s+/g, "„")
      .replace(/\s+"/g, '"').replace(/\.{2,}/g, ".").replace(/\s+([,.;:!?])/g, "$1").replace(/\)\s*\.$/, ")");
    return capFirst(s);
  };

  const usedRaw = new Set<string>();
  let prevRaw = "";
  const pickLine = (stance: string, archetype: string, phase: 0 | 1 | 2 | 3): string => {
    const key: PoolKey = phase === 0 ? "setup" : phase === 1 ? "conflict" : phase === 2 ? "twist" : "fallout";
    // Primaer die Haltung; bei ausgepraegtem Archetyp gelegentlich dessen Wuerze.
    const useArch = archetype !== "neutral" && chance(0.4);
    const P = useArch ? (POOLS[archetype] || POOLS.neutral!) : (STANCE_LINES[stance] || POOLS.neutral!);
    const arr = P[key] || [];
    if (!arr.length) return "…";
    const fresh = arr.filter((l) => l !== prevRaw && !usedRaw.has(l));
    let cand: string;
    if (fresh.length) cand = pick(fresh);
    else { const notPrev = arr.filter((l) => l !== prevRaw); cand = notPrev.length ? pick(notPrev) : pick(arr); }
    usedRaw.add(cand); prevRaw = cand;
    return cand;
  };

  const injectBeat = (i: number): string | null => {
    // Die Reihenfolge entscheidet bei gleicher Position (kurze Szenen): Was
    // die Geschichte trägt, kommt zuerst.
    if (i === BEAT.obstA) return ensurePunct(capFirst(stripLead(kit.obstacle)));
    if (i === BEAT.turnA) return fuelleZ(pick(WENDE_ZEILE), { X: stripLead(clean(kit.turn).replace(/[.!?…]+$/, "")) });
    if (i === BEAT.stakeB) return ensurePunct(capFirst(stripLead(kit.stake)));
    // Ein Requisit mit Nebensatz („eine Karte, auf der der Weg fehlt") steht
    // nur dort, wo nach ihm nichts mehr kommt — sonst „… fehlt dabei."
    if (i === BEAT.propB && kit.propAcc) return fuelleZ(pick(/,/.test(kit.propAcc) ? PROP_ZEILE.filter((z) => /\{X\}[.?]/.test(z)) : PROP_ZEILE), { X: kit.propAcc });
    if (i === BEAT.surfB) return pick(ERWIDERUNG);
    if (i === BEAT.ortB && ortKurz && platz(10)) return fuelleZ(pick(ORT_ZEILE), { W: ortKurz, Wc: capFirst(ortKurz) });
    if (i === BEAT.zeitB && zeit && platz(12) && !/^(als|während|bevor|nachdem|wenn|bis)\s/i.test(zeit)) return fuelleZ(pick(ZEIT_ZEILE), { T: zeit });
    if (i === BEAT.motivA && topic && platz(8)) return fuelleZ(pick(MOTIV_ZEILE), { M: topic, Mc: capFirst(topic) });
    if (i === BEAT.selbstA && ichWas && platz(14)) return fuelleZ(pick(SELBST_ZEILE), { X: ichWas });
    if (i === BEAT.endA) return ensurePunct(capFirst(kit.ending));
    if (i === BEAT.stageB) return chance(0.6) ? `(${pick(STAGE)})` : null;
    return null;
  };

  const applyInstability = (line: string, archetype: string, phase: number): string => {
    if (kit.instability !== 2) return line;
    if (/[()]/.test(line) || line.includes("—") || line.includes(":")) return line;

    if (chance(0.32 + phase * 0.06)) {
      const activeVerbs = ["öffnet", "nimmt", "sieht", "hält", "stellt", "schreibt", "trägt", "führt", "bricht", "nennt", "findet", "berührt", "beobachtet", "sucht"];
      const m = line.match(new RegExp(`^(.+?)\\s+(${activeVerbs.join("|")})\\s+(.+?)\\.$`, "i"));
      if (m) {
        const subj = m[1]!.trim(), verb = m[2]!, obj = m[3]!.trim();
        if (obj.length < 40 && subj.toLowerCase() !== obj.toLowerCase() && obj.split(/\s+/).length <= 4 && !obj.includes(subj)) {
          line = `${obj} ${verb} ${subj}.`;
        }
      }
    }
    if (chance(0.22)) {
      if (archetype === "skorpion" && !line.includes("weißt")) line = line.replace(/\.$/, " – und du weißt es.");
      else if (archetype === "psychopath" && !line.includes("Notiert")) line = line.replace(/\.$/, ". Notiert.");
      else if (archetype === "entdecker" && !line.includes("Weiter")) line = line.replace(/\.$/, ". Weiter.");
    }
    return line
      .replace(/\bIch kenne ich\b/gi, "Ich kenne mich").replace(/\bIch nennen\b/gi, "Ich nenne")
      .replace(/\bIch sucht\b/gi, "Ich suche").replace(/\.\s*\./g, ".").replace(/\s{2,}/g, " ").trim();
  };

  const out: string[] = [`SZENE: ${capFirst(ort)}, ${clean(kit.T || "").replace(/[.!?…]+$/, "")}.`];
  // Die Eröffnung gehört dem Gegenüber und nennt, was die Figur tut — in der
  // Du-Form, wo sich das Was sicher beugen lässt, sonst als Hörensagen.
  const gegenueber = cast[1 % cast.length]!;
  const figur = clean(kit.PRaw || kit.P || "").split(",")[0]!.trim();
  const wasKurz = clean(kit.A || "").split(/[,;]/)[0]!.replace(/[.!?…]+$/, "").trim();
  if (duWas) out.push(`${gegenueber}: ${cleanDialogLine(`Du ${duWas}. ${pick(NACHFRAGE)}`)}`);
  else if (figur && wasKurz) out.push(`${gegenueber}: ${cleanDialogLine(`Man erzählt sich, ${/^(Ein|Eine|Der|Die|Das)\s/.test(figur) ? figur.charAt(0).toLowerCase() + figur.slice(1) : figur} ${wasKurz}. ${pick(["Bist du das?", "Stimmt das?", "Meinen sie dich?"])}`)}`);
  for (let i = 0; i < rounds; i++) {
    const isA = i % 2 === 0;
    const ci = i % cast.length;
    const speaker = cast[ci]!;
    const arch = isA ? aId : bId;
    const ph = phaseFor(i);
    let line = injectBeat(i) ?? pickLine(stanceOf(ci), arch, ph);
    line = ensurePunct(line);
    line = applyInstability(line, arch, ph);
    line = cleanDialogLine(line);
    // Eine Regieanweisung gehört keinem Sprecher.
    out.push(/^\(.*\)$/.test(line) ? line : `${speaker}: ${line}`);
  }
  return out.join("\n");
}
