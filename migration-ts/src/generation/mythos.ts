// Gattung „Gründungsmythos" (4.378.0).
//
// Ein Mythos erklärt, warum etwas IST — die Stadt, ihr Name, ein Brauch. Das
// ist seine prüfbare Zusage: Alles, was am Ende „seitdem" gilt, muss aus der
// Tat stammen, von der erzählt wird. Fünf Abschnitte:
//
//   Urzustand  „Am Anfang war hier nichts als …" — das Gegründete gibt es noch
//              nicht, und was man versucht, nimmt das Land zurück
//   Ankunft    ein Gründer kommt; der erste Versuch scheitert
//   Opfer      eine Stimme verlangt etwas; der Gründer gibt es; nun gelingt es
//   Ordnung    „So entstand …" — und der Name, mit seiner Bedeutung
//   Seitdem    der Brauch, der an das Opfer erinnert
//
// Die Bedeutung des Namens und der Brauch gehören zum OPFER, nicht zum Zufall:
// `pruefeMythos()` liest das Opfer aus dem Text und hält beides dagegen. Und der
// Name darf nicht auftauchen, bevor gegründet ist — ein Mythos, der den Ort
// schon im ersten Satz beim Namen nennt, erzählt nicht, wie er entstand.
import type { Bank, GenInput } from "../types";
import { pick } from "../text-utils";
import { normWhere, normWhen } from "./ctxnorm";
import { fuelle, blickVonTon, erkenneLage, ziehName, type Blick, type LageTyp } from "../features/weltblatt";
import { utopieMaterial } from "../features/utopieMaterial";
import { erkenneHeld, type Held } from "./maerchen";

const cap = (s: string): string => (s ? s[0]!.toUpperCase() + s.slice(1) : s);

interface Urzustand { nichts: string; widerstand: string }
const URZUSTAENDE: Urzustand[] = [
  { nichts: "Schilf und Nebel", widerstand: "Wer ein Haus baute, fand am Morgen nur noch nasses Holz." },
  { nichts: "Steine und Wind", widerstand: "Was einer aufschichtete, trug der Wind in der Nacht davon." },
  { nichts: "Wasser, das nicht wusste, wohin", widerstand: "Was einer an Land zog, holte das Wasser zurück." },
  { nichts: "Wald, so dicht, dass kein Licht auf den Boden fiel", widerstand: "Wer eine Lichtung schlug, fand sie am nächsten Morgen zugewachsen." },
];

export const GRUENDER: Held[] = [
  { ein: "eine Hirtin mit einem lahmen Bein", def: "die Hirtin", rel: "die", pron: "sie", ausEingabe: false },
  { ein: "ein Fischer, der nicht schwimmen konnte", def: "der Fischer", rel: "der", pron: "er", ausEingabe: false },
  { ein: "eine Bärin", def: "die Bärin", rel: "die", pron: "sie", ausEingabe: false },
  { ein: "ein Fremder mit salzigem Haar", def: "der Fremde", rel: "der", pron: "er", ausEingabe: false },
  { ein: "eine alte Schmiedin", def: "die Schmiedin", rel: "die", pron: "sie", ausEingabe: false },
];
const HERKUNFT = ["von jenseits der Berge", "über das Wasser", "aus einem Land, das es nicht mehr gibt", "auf dem letzten Pfad, der noch begehbar war"];

/** `gelingen` als „Verb|Rest" — der Satz beginnt mit „Nun", das Subjekt steht
 *  hinter dem Verb: „Nun zog sie die Furche ein zweites Mal …". */
interface Tat { versuch: string; scheitern: string; gelingen: string }
const TATEN: Tat[] = [
  { versuch: "zog mit einem Pflug eine Furche um den Hügel", scheitern: "am Morgen war die Furche verschwunden", gelingen: "zog|die Furche ein zweites Mal, und diesmal blieb sie" },
  { versuch: "zündete auf dem höchsten Stein ein Feuer an", scheitern: "der Wind blies es aus, ehe die Nacht vorüber war", gelingen: "zündete|das Feuer neu an, und es brannte, bis der Morgen kam, und weiter" },
  { versuch: "legte einen Grundstein", scheitern: "der Grund verschluckte ihn", gelingen: "legte|den Stein ein zweites Mal, und er blieb liegen" },
  { versuch: "grub nach Wasser", scheitern: "die Grube blieb trocken", gelingen: "grub|ein zweites Mal, und Wasser stieg herauf, klar und kalt" },
];
const QUELLEN = ["aus der Tiefe", "aus dem Wind", "aus dem Wasser", "aus dem Stein"];

/** Das Opfer trägt alles, was danach gilt: die Bitte (in Du-Form), die Gabe,
 *  die Bedeutung des Namens und den Brauch. `gabe` und `brauch` mit {Hc}/{P}/{N}. */
export interface Opfer { id: string; du: string; gabe: string; bedeutung: string; brauch: string; ohneName?: boolean }
export const OPFER: Opfer[] = [
  { id: "haar", du: "dein Haar", gabe: "{Pc} schnitt das eigene Haar ab und gab es hin.", bedeutung: "Geschorenes Haupt",
    brauch: "Seitdem schneidet in {N} jeder im Frühjahr eine Locke ab und legt sie auf den Stein am Platz." },
  { id: "stimme", du: "deine Stimme", gabe: "{Pc} gab die eigene Stimme hin und sprach von da an kein Wort mehr.", bedeutung: "Ort der Stille",
    brauch: "Seitdem schweigt in {N} am Gründungstag jeder vom Morgen bis zum Abend." },
  { id: "name", du: "deinen Namen", gabe: "{Pc} gab den eigenen Namen hin, und von da an wusste niemand mehr, wie {P} hieß.", bedeutung: "Die Namenlose",
    brauch: "Seitdem bekommt in {N} jedes Kind seinen Namen erst, wenn es selbst sprechen kann.", ohneName: true },
  { id: "schatten", du: "deinen Schatten", gabe: "{Pc} gab den eigenen Schatten hin, und von da an warf {P} keinen Schatten mehr.", bedeutung: "Ohne Schatten",
    brauch: "Seitdem baut in {N} niemand ein Haus so, dass es auf ein anderes Schatten wirft." },
  { id: "saat", du: "dein letztes Saatkorn", gabe: "{Pc} gab das letzte Saatkorn hin, obwohl der Winter vor der Tür stand.", bedeutung: "Letztes Korn",
    brauch: "Seitdem wird in {N} von jeder Ernte das erste Korn nicht gegessen, sondern vergraben." },
  { id: "schlaf", du: "deinen Schlaf", gabe: "{Pc} gab den eigenen Schlaf hin und hat seitdem kein Auge mehr zugetan.", bedeutung: "Die Wachende",
    brauch: "Seitdem wacht in {N} in jeder Nacht einer, damit die anderen schlafen können." },
];

/** Das Gegründete. `pd`: Dativpronomen für „Man gab ihr den Namen"; bei einem
 *  Namen leer — dann ist der Name das Gegründete selbst. */
export interface Gruendung { def: string; pd: string }
export const GRUENDUNGEN: Gruendung[] = [
  { def: "die Stadt", pd: "ihr" }, { def: "das Dorf", pd: "ihm" }, { def: "der Markt", pd: "ihm" },
  { def: "die Brücke", pd: "ihr" }, { def: "der Hafen", pd: "ihm" },
];
const PD: Record<string, string> = { der: "ihm", die: "ihr", das: "ihm" };

/** Das Was-Feld als Gegründetes: Artikel + Nomen oder ein Name. */
/** Ein Eigenname: ein großgeschriebenes Wort ohne Artikel, das kein bloßes
 *  Landschaftswort ist. Nicht über `istNurName()`: Die Lage-Erkennung hält das
 *  „Tal" in „Talheim" für ein Tal, und der Name fiel stillschweigend weg
 *  (gefunden beim Lesen, 4.378.0). */
export function istEigenname(w: string): boolean {
  const t = (w || "").trim();
  return /^[A-ZÄÖÜ][a-zäöüß]+(?:-[A-ZÄÖÜ][a-zäöüß]+)?$/.test(t)
    && !/^(Wüste|Insel|Wald|Gebirge|Meer|Stadt|Tal|See|Fluss|Berg|Berge|Eis|Oase|Küste|Hafen|Dorf|Ufer|Moor|Steppe|Hügel|Ebene)$/.test(t);
}

export function erkenneGruendung(was: string): (Gruendung & { name: string }) | null {
  const w = (was || "").trim().replace(/[.!?]$/, "");
  if (!w) return null;
  if (istEigenname(w)) return { def: w, pd: "", name: w };
  const h = erkenneHeld(w);
  if (!h || h.ein.startsWith("jemand mit Namen")) return null;
  return { def: h.def, pd: PD[h.rel] || "", name: "" };
}

const SCHLUSS: Record<Blick, string> = {
  // „Und Die Brücke besteht" — großer Artikel mitten im Satz (gefunden beim Lesen).
  hell: "Und {W} besteht bis heute.",
  kuehl: "So wird es überliefert.",
  spott: "So jedenfalls erzählen es die, die davon leben, es zu erzählen.",
  dunkel: "{Hc} aber kehrte nie zurück, und niemand weiß, wohin {P} ging.",
};

export interface Mythosblatt {
  urzustand: Urzustand; gruender: Held; herkunft: string; tat: Tat; quelle: string; opfer: Opfer;
  gruendung: Gruendung; name: string; nameAusEingabe: boolean;
  wo: string; lage: LageTyp | null; wann: string; blick: Blick;
  werte: Record<string, string>;
}

export function ziehMythosblatt(input: GenInput): Mythosblatt {
  const gruender = erkenneHeld(input.who || "") || pick(GRUENDER);
  const benannt = gruender.ein.startsWith("jemand mit Namen");
  // Wer einen Namen trägt, kann ihn nicht opfern und danach weiter so heißen.
  const opfer = pick(OPFER.filter((o) => !(benannt && o.ohneName)));
  const g = erkenneGruendung(input.what || "");
  const woRoh = (input.where || "").trim();
  // Der Name: aus dem Was (ein Name ist das Gegründete selbst), sonst aus dem
  // Wo, sonst gezogen. Ein Name im Wo darf NICHT im Urzustand stehen — dort
  // heißt der Ort „an dieser Stelle".
  const woName = woRoh && istEigenname(woRoh) ? woRoh : "";
  const name = g?.name || woName || ziehName();
  const wo = woRoh && !woName ? (normWhere(woRoh) || woRoh) : "an dieser Stelle";
  const wannEin = (input.when || "").trim();
  const wannRoh = /^(morgen|übermorgen|bald|heute|demnächst|nächste)/i.test(wannEin) ? "" : wannEin;
  const gruendung = g || pick(GRUENDUNGEN);
  return {
    urzustand: pick(URZUSTAENDE), gruender, herkunft: pick(HERKUNFT), tat: pick(TATEN), quelle: pick(QUELLEN), opfer,
    gruendung, name, nameAusEingabe: !!(g?.name || woName),
    wo, lage: woRoh && !woName ? erkenneLage(woRoh) : null,
    wann: wannRoh ? (normWhen(wannRoh) || wannRoh) : "", blick: blickVonTon(input.tone),
    werte: { H: gruender.def, Hc: cap(gruender.def), P: gruender.pron, Pc: cap(gruender.pron), N: name, W: gruendung.def, Wc: cap(gruendung.def) },
  };
}

export interface MythosErgebnis { text: string; fb: Mythosblatt; motiv?: string }

export function buildMythos(input: GenInput, bank?: Partial<Bank>): MythosErgebnis {
  const fb = ziehMythosblatt(input);
  const W = fb.werte, F = (s: string): string => fuelle(s, W);
  const mat = utopieMaterial(bank, fb.lage);
  const motiv = mat.motive.length ? pick(mat.motive) : undefined;
  const lang = (Number.isFinite(input.lenTarget as number) ? (input.lenTarget as number) : 110) > 150;
  const g = fb.gruendung, nameIstGruendung = !g.pd;

  const ur = [
    fb.wann ? `${cap(fb.wann)}, so sagen die Alten, war ${fb.wo} nichts als ${fb.urzustand.nichts}.` : `Am Anfang war ${fb.wo} nichts als ${fb.urzustand.nichts}.`,
    // Heißt das Gegründete wie der Ort, darf es hier nicht beim Namen stehen.
    // „Der Hafen gab es noch nicht" war der falsche Fall: „es gibt" verlangt
    // den Akkusativ. „war noch nicht da" trägt den Nominativ (gefunden beim Lesen).
    nameIstGruendung ? "Eine Stadt gab es noch nicht, kein Haus und keinen Weg." : `${cap(g.def)} war noch nicht da.`,
    fb.urzustand.widerstand,
    ...(motiv ? [`Nur eines war schon da: ${motiv}.`] : []),
  ];
  const ankunft = [
    `Da kam ${/, /.test(fb.gruender.ein) ? fb.gruender.ein + "," : fb.gruender.ein} ${fb.herkunft}.`,
    F(`{Hc} ${fb.tat.versuch}, doch ${fb.tat.scheitern}.`),
    ...(lang ? [F("{Pc} versuchte es wieder und wieder, und jedes Mal nahm das Land es zurück.")] : []),
  ];
  const opfer = [
    F(`Da hörte {H} eine Stimme ${fb.quelle}: „Gib mir ${fb.opfer.du}, dann soll es halten.“`),
    F(fb.opfer.gabe),
    F(`Nun ${fb.tat.gelingen.split("|")[0]} {P} ${fb.tat.gelingen.split("|")[1]}.`),
  ];
  const ordnung = [
    `So entstand ${nameIstGruendung ? fb.name : g.def}.`,
    nameIstGruendung
      ? `In der alten Sprache heißt das ‚${fb.opfer.bedeutung}‘.`
      : `Man gab ${g.pd} den Namen ${fb.name}; in der alten Sprache heißt das ‚${fb.opfer.bedeutung}‘.`,
    ...(lang ? ["Andere kamen dazu, erst wenige, dann viele."] : []),
  ];
  const seitdem = [
    F(fb.opfer.brauch),
    ...(lang ? ["Wer fragt, warum, dem erzählt man diese Geschichte."] : []),
    nameIstGruendung && fb.blick === "hell" ? `Und ${fb.name} besteht bis heute.` : F(SCHLUSS[fb.blick]),
  ];
  const text = [ur, ankunft, opfer, ordnung, seitdem].map((a) => a.join(" ")).join("\n\n");
  return { text, fb, motiv };
}

/** Titel: „Wie Velmar entstand" — aus dem Text lesbar. */
export function mythosTitelAusText(text: string): string {
  const m = (text || "").match(/(?:So entstand ([A-ZÄÖÜ][\p{L}-]+)\.|den Namen ([A-ZÄÖÜ][\p{L}-]+);)/u);
  return m ? `Wie ${m[1] || m[2]} entstand` : "";
}
export const mythosTitel = (fb: Mythosblatt): string => `Wie ${fb.name} entstand`;

// ── Prüfung ─────────────────────────────────────────────────────────────────

/** Prüft einen Gründungsmythos. Das Opfer wird aus dem TEXT gelesen (aus der
 *  Gabe), und Bedeutung und Brauch müssen zu genau diesem Opfer gehören. */
export function pruefeMythos(text: string, fb: Mythosblatt, bank?: Partial<Bank>): string[] {
  const b: string[] = [];
  const W = fb.werte;
  const abs = text.split("\n\n");
  if (abs.length !== 5) b.push("Nicht fünf Abschnitte");
  if (/[{}]|\bundefined\b|\bnull\b|\bNaN\b/.test(text)) b.push("Platzhalter oder Leerwert im Text");
  if (!/^(Am Anfang war |.+, so sagen die Alten, war )/.test(abs[0] || "")) b.push("Urzustand fehlt am Anfang");
  // Kein Name vor der Gründung.
  const nameRe = new RegExp(`(?<!\\p{L})${fb.name.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")}(?!\\p{L})`, "u");
  if ([0, 1, 2].some((i) => nameRe.test(abs[i] || ""))) b.push("Name steht vor der Gründung");
  if (!nameRe.test(abs[3] || "")) b.push("Name fehlt bei der Gründung");
  if (!nameRe.test(abs[4] || "")) b.push("Name fehlt im Seitdem");
  // Welches Opfer erzählt der Text? An der Gabe zu erkennen.
  const gegeben = OPFER.filter((o) => (abs[2] || "").includes(fuelle(o.gabe, W)));
  if (gegeben.length !== 1) b.push(`Opfer nicht eindeutig (${gegeben.length})`);
  const o = gegeben[0];
  if (o) {
    if (!(abs[2] || "").includes(`„Gib mir ${o.du}, dann soll es halten.“`)) b.push("Bitte passt nicht zum Opfer");
    if (!(abs[3] || "").includes(`‚${o.bedeutung}‘`)) b.push("Bedeutung des Namens gehört nicht zum Opfer");
    if (!(abs[4] || "").includes(fuelle(o.brauch, W))) b.push("Brauch gehört nicht zum Opfer");
    for (const x of OPFER) if (x !== o && (text.includes(`‚${x.bedeutung}‘`) || text.includes(fuelle(x.brauch, W)))) b.push(`Bedeutung oder Brauch von „${x.id}" unter dem Opfer „${o.id}"`);
  }
  // Reihenfolge: Versuch und Scheitern vor dem Opfer, Gelingen danach.
  const gel = fuelle(`Nun ${fb.tat.gelingen.split("|")[0]} {P} ${fb.tat.gelingen.split("|")[1]}`, W);
  const iVers = text.indexOf(fb.tat.versuch), iGabe = o ? text.indexOf(fuelle(o.gabe, W)) : -1, iGel = text.indexOf(gel);
  if (iVers < 0 || iGel < 0) b.push("Versuch oder Gelingen fehlt");
  else if (!(iVers < iGabe && iGabe < iGel)) b.push("Reihenfolge Versuch – Opfer – Gelingen verletzt");
  if (!(abs[1] || "").includes(fb.tat.scheitern)) b.push("Erster Versuch scheitert nicht");
  // Das Gegründete: vorher nicht, dann entstanden.
  if (!/^So entstand /m.test(abs[3] || "")) b.push("„So entstand“ fehlt");
  // Der Gründer: eingeführt, nie nach einer Präposition.
  if (!text.includes(fb.gruender.ein)) b.push("Gründer nicht eingeführt");
  if (/^(der|die|das) /.test(fb.gruender.def) && new RegExp(`(?<!\\p{L})(von|mit|bei|aus|nach|zu|für|durch|gegen|ohne|um) ${fb.gruender.def}(?!\\p{L})`, "u").test(text)) b.push("Gründer nach Präposition — falscher Fall");
  if (bank) {
    const mat = utopieMaterial(bank, fb.lage);
    const x = text.match(/Nur eines war schon da: ([^.]+)\./);
    if (x && !mat.motive.includes(x[1]!)) b.push(`Motiv nicht aus dem Preset: „${x[1]}"`);
    if (!x && mat.motive.length) b.push("Preset ohne Wirkung: kein Motiv im Text");
  }
  // Muster aus dem Lesen (4.378.0):
  if (/(?<!\p{L})Der [^.]*? gab es noch nicht/u.test(text)) b.push("Falscher Fall vor „gab es“ (Nominativ statt Akkusativ)");
  if (/(?<!\p{L})(und|Und|aber|als|doch) (Der|Die|Das|Den|Dem)(?!\p{L})/u.test(text)) b.push("Großgeschriebener Artikel mitten im Satz");
  if (/, der [^.,]*? kam [a-zäöü]/.test(text)) b.push("Relativsatz ohne schließendes Komma");
  if (/ {2}|\s[,.;:!?]/.test(text)) b.push("Leerzeichen vor Satzzeichen oder doppelt");
  const dw = text.replace(/(?<!\p{L})(der|die|das|den|dem) \1(?!\p{L})/giu, "$1").match(/(?<!\p{L})(\p{L}+) \1(?!\p{L})/iu);
  if (dw) b.push(`Doppeltes Wort: „${dw[0]}"`);
  if (/[.!?]\s+[a-zäöü]/.test(text.replace(/„[^“]*“/g, "„…“"))) b.push("Satzanfang klein");
  if (/\.\.|\.“\./.test(text)) b.push("Doppelter Punkt");
  return b;
}
