// Dialog-Engine (Szene/Dialog). Reine Funktion: erzeugt aus einem StoryKit
// eine Szene. Enthält alle jüngsten Fixes: feste Beat-Positionen, Pool-Dedup,
// Instabilitäts-Guard, echte Regieanweisungen, roter Faden übers Thema.
import type { StoryKit } from "../types";
import { clean, pick, chance, ensurePunct } from "../text-utils";

const ARCHETYPE_SPEAKERS: Record<string, string[]> = {
  neutral: ["Die Stimme", "Das System", "Ein Unbekannter", "Das Archiv", "Der Apparat"],
  skorpion: ["Die Zeugin", "Der Blick", "Die Hand", "Die Stimme", "Der Vermerk"],
  psychopath: ["Der Gutachter", "Das Protokoll", "Die Instanz", "Der Operator", "Die Akte"],
  entdecker: ["Die Karte", "Der Weg", "Die Tür", "Der Rand", "Das Zeichen"],
};

export function pickSpeakerForArchetype(archId: string): string {
  return pick(ARCHETYPE_SPEAKERS[archId] || ARCHETYPE_SPEAKERS.neutral!);
}

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
  const cast = (kit.speakers && kit.speakers.length >= 2) ? kit.speakers : [speakerA, speakerB];

  let rounds = Math.round(lenTarget / 7) + (kit.instability === 2 ? 2 : kit.instability === 1 ? 1 : 0);
  rounds = Math.max(4, Math.min(30, rounds));
  if (rounds % 2 !== 0) rounds = Math.min(30, rounds + 1);

  const evenAt = (f: number): number => { let x = Math.round(rounds * f); if (x % 2 !== 0) x++; return Math.max(2, Math.min(rounds - 2, x)); };
  const oddAt = (f: number): number => { let x = Math.round(rounds * f); if (x % 2 === 0) x++; return Math.max(3, Math.min(rounds - 1, x)); };
  const BEAT = {
    propB: oddAt(0.22), obstA: evenAt(0.38), surfB: oddAt(0.42),
    turnA: evenAt(0.64), stakeB: oddAt(0.68), endA: rounds - 2, stageB: rounds - 1,
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
      setup: ["Ich weiß, was ich gesehen habe.", "Es war genau so.", "Hör mir zu, es stimmt.", "Ich habe keinen Zweifel.", "Das ist die Wahrheit, ob du willst oder nicht."],
      conflict: ["Es ist trotzdem wahr.", "Ich bleibe dabei.", "Du musst mir das glauben.", "Ich habe es selbst erlebt.", "Daran ändert dein Zweifel nichts."],
      twist: ["Also hatte ich recht.", "Dann bestätigt es sich.", "Ich wusste es die ganze Zeit.", "Genau das habe ich gesagt.", "Siehst du — es stimmt."],
      fallout: ["Ich stehe dazu.", "Es bleibt wahr.", "Ich bereue kein Wort.", "So war es, so bleibt es."],
    },
    zweifeln: {
      setup: ["Woher willst du das wissen?", "Bist du sicher?", "Das klingt zu einfach.", "Kann das überhaupt stimmen?", "Ich glaube nichts ohne Beweis."],
      conflict: ["Das kann nicht stimmen.", "Beweis es mir.", "Da fehlt etwas.", "Warum sollte ich dir glauben?", "Deine Geschichte hat Löcher."],
      twist: ["Vielleicht hatte ich unrecht.", "Oder es ist ganz anders.", "Und wenn es doch stimmt?", "Jetzt zweifle ich an meinem Zweifel."],
      fallout: ["Ich bin noch nicht überzeugt.", "Sicher bin ich trotzdem nicht.", "Vielleicht. Vielleicht auch nicht.", "Ich behalte meine Fragen."],
    },
    abwehren: {
      setup: ["Muss das jetzt sein?", "Lass uns nicht darüber reden.", "Das geht dich nichts an.", "Ich will das nicht.", "Es ist nicht so wichtig."],
      conflict: ["Das führt zu nichts.", "Hör auf zu bohren.", "Ich habe nichts gesagt.", "Lenk nicht ab.", "Reden wir über etwas anderes."],
      twist: ["Es ist zu spät dafür.", "Jetzt ist es sowieso egal.", "Ich hätte schweigen sollen.", "Vergiss, was ich gesagt habe."],
      fallout: ["Es ist erledigt.", "Reden wir nicht mehr davon.", "Vergessen wir das.", "Genug jetzt."],
    },
  };

  // Haltungen den Figuren zuweisen (kontrastierend, pro Szene gemischt).
  const STANCES = ["glauben", "zweifeln", "abwehren"];
  for (let k = STANCES.length - 1; k > 0; k--) { const j = Math.floor(Math.random() * (k + 1)); [STANCES[k], STANCES[j]] = [STANCES[j]!, STANCES[k]!]; }
  const stanceOf = (castIdx: number): string => STANCES[castIdx % STANCES.length]!;

  const capFirst = (s: string): string => { s = String(s || "").trim(); return s ? s.charAt(0).toUpperCase() + s.slice(1) : s; };
  const stripLead = (s: string): string => String(s || "").replace(/^(und|dann|aber|denn|so|doch)\s+/i, "").trim();
  const topic = clean(kit.motif || kit.W || "").replace(/[.!?…]+$/, "");
  const STAGE = ["Stille.", "Ein langer Blick.", "Keiner spricht weiter.", "Der Wind trägt den Rest fort.", "Die Weide liegt still.", "Nichts bewegt sich."];

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
    if (i === 0) return topic ? `Das Thema: ${topic}.` : "Sag mir, was du gesehen hast.";
    if (i === 1) return topic ? "Und was hat das mit uns zu tun?" : "Was genau meinst du?";
    if (i === BEAT.propB && kit.propAcc) return `Du hast ${kit.propAcc} dabei.`;
    if (i === BEAT.obstA) return ensurePunct(capFirst(stripLead(kit.obstacle)));
    if (i === BEAT.surfB) return "Das ist nur die Oberfläche.";
    if (i === BEAT.turnA) return `Dann — ${capFirst(stripLead(clean(kit.turn).replace(/[.!?…]+$/, "")))}.`;
    if (i === BEAT.stakeB) return ensurePunct(capFirst(stripLead(kit.stake)));
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

  const out: string[] = [`SZENE: ${kit.W}, ${kit.T}.`];
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
    out.push(`${speaker}: ${line}`);
  }
  return out.join("\n");
}
