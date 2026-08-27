// Prüfstand Verben: Die Morphologie (generation/verben.ts).
//
// Paradigmen statt Vollformen: eine kleine Liste der Verben mit Vokalwechsel
// oder Unregelmäßigkeit im Präsens, Präfixe erben das Paradigma, alles andere
// folgt Regeln (Bindevokal, Zischlaut, -eln/-ern). Jede Zeile hier ist ein
// Fall, an dem die alte Näherung scheiterte oder scheitern konnte.
import { paradigma, beugeVerb, istVerbform } from "../src/generation/verben";
import { deriveAtom, hatFinitesVerb } from "../src/atoms/derive";

const fails: string[] = [];
let geprueft = 0, bestanden = 0;
const ist = (name: string, wert: unknown, soll: unknown): void => {
  geprueft++;
  if (wert === soll) bestanden++;
  else fails.push(`${name}: „${String(wert)}“ — erwartet „${String(soll)}“`);
};
const wahr = (name: string, b: boolean): void => ist(name, b, true);
const p = (f: string): string => { const x = paradigma(f); return x ? `${x.ich}/${x.du}/${x.er}/${x.wir}/${x.ihr}` : "null"; };

// ── 1 · Regelmäßig ──────────────────────────────────────────────────────────
ist("bemerkt", p("bemerkt"), "bemerke/bemerkst/bemerkt/bemerken/bemerkt");
ist("geht (kurzer Stamm)", p("geht"), "gehe/gehst/geht/gehen/geht");
ist("kommt", p("kommt"), "komme/kommst/kommt/kommen/kommt");
ist("erbt (vier Buchstaben)", p("erbt"), "erbe/erbst/erbt/erben/erbt");
// Bindevokal: Stamm auf -t/-d und Konsonantenhäufung
ist("wartet → wartest, nicht wartst", p("wartet"), "warte/wartest/wartet/warten/wartet");
ist("findet", p("findet"), "finde/findest/findet/finden/findet");
ist("öffnet → öffnest", p("öffnet"), "öffne/öffnest/öffnet/öffnen/öffnet");
ist("rechnet", p("rechnet"), "rechne/rechnest/rechnet/rechnen/rechnet");
ist("atmet", p("atmet"), "atme/atmest/atmet/atmen/atmet");
ist("antwortet", p("antwortet"), "antworte/antwortest/antwortet/antworten/antwortet");
// Zischlaut: du = er
ist("heißt → du heißt", p("heißt"), "heiße/heißt/heißt/heißen/heißt");
ist("sitzt", p("sitzt"), "sitze/sitzt/sitzt/sitzen/sitzt");
ist("reist", p("reist"), "reise/reist/reist/reisen/reist");
ist("fasst", p("fasst"), "fasse/fasst/fasst/fassen/fasst");
// -eln / -ern
ist("handelt → ich handle, wir handeln", p("handelt"), "handle/handelst/handelt/handeln/handelt");
ist("sammelt", p("sammelt"), "sammle/sammelst/sammelt/sammeln/sammelt");
ist("ändert → ich ändere, wir ändern", p("ändert"), "ändere/änderst/ändert/ändern/ändert");
ist("erinnert", p("erinnert"), "erinnere/erinnerst/erinnert/erinnern/erinnert");

// ── 2 · Vokalwechsel und Unregelmäßige ──────────────────────────────────────
ist("trägt → wir tragen", p("trägt"), "trage/trägst/trägt/tragen/tragt");
ist("hält", p("hält"), "halte/hältst/hält/halten/haltet");
ist("läuft", p("läuft"), "laufe/läufst/läuft/laufen/lauft");
ist("gibt", p("gibt"), "gebe/gibst/gibt/geben/gebt");
ist("nimmt", p("nimmt"), "nehme/nimmst/nimmt/nehmen/nehmt");
ist("sieht", p("sieht"), "sehe/siehst/sieht/sehen/seht");
ist("liest → du liest", p("liest"), "lese/liest/liest/lesen/lest");
ist("lässt", p("lässt"), "lasse/lässt/lässt/lassen/lasst");
ist("tritt", p("tritt"), "trete/trittst/tritt/treten/tretet");
ist("ist", p("ist"), "bin/bist/ist/sind/seid");
ist("hat", p("hat"), "habe/hast/hat/haben/habt");
ist("wird", p("wird"), "werde/wirst/wird/werden/werdet");
ist("weiß", p("weiß"), "weiß/weißt/weiß/wissen/wisst");
ist("kann", p("kann"), "kann/kannst/kann/können/könnt");
ist("will", p("will"), "will/willst/will/wollen/wollt");

// ── 3 · Präfixe erben das Paradigma ─────────────────────────────────────────
ist("verspricht", p("verspricht"), "verspreche/versprichst/verspricht/versprechen/versprecht");
ist("zerbricht", p("zerbricht"), "zerbreche/zerbrichst/zerbricht/zerbrechen/zerbrecht");
ist("aufgibt", p("aufgibt"), "aufgebe/aufgibst/aufgibt/aufgeben/aufgebt");
ist("unterlässt", p("unterlässt"), "unterlasse/unterlässt/unterlässt/unterlassen/unterlasst");
ist("behält", p("behält"), "behalte/behältst/behält/behalten/behaltet");
ist("geschieht", p("geschieht"), "geschehe/geschiehst/geschieht/geschehen/gescheht");

// ── 4 · Was kein Verb ist, bleibt in Ruhe ───────────────────────────────────
ist("alt", beugeVerb("alt", "du"), null);
ist("dort", beugeVerb("dort", "wir"), null);
ist("jetzt", beugeVerb("jetzt", "ich"), null);
ist("Zeit", beugeVerb("Zeit", "du"), null);
ist("gesagt (Partizip)", beugeVerb("gesagt", "du"), null);
ist("gebracht (Partizip)", beugeVerb("gebracht", "wir"), null);
ist("gehört ist aber ein Verb", p("gehört"), "gehöre/gehörst/gehört/gehören/gehört");
ist("gelingt ebenso", p("gelingt"), "gelinge/gelingst/gelingt/gelingen/gelingt");
wahr("istVerbform: bemerkt", istVerbform("bemerkt"));
wahr("istVerbform: nicht ‚selbst‘", !istVerbform("selbst"));
wahr("istVerbform: nicht ‚Nacht‘", !istVerbform("Nacht"));

// ── 5 · Großschreibung bleibt ───────────────────────────────────────────────
ist("Bringt → Bringst", beugeVerb("Bringt", "du"), "Bringst");
ist("Trägt → Tragen", beugeVerb("Trägt", "wir"), "Tragen");

// ── 6 · Wirkung in der Atom-Klassifikation (typisierte Slots) ───────────────
// Der Assembler füllt Slots nach Typ: Ein Ding-Slot nimmt Nominalphrasen, kein
// Hauptsatz. Die Klassifikation übersah Verben, die die Tabelle nicht kannte
// oder die auf eine Nomen-Endung ausgehen: „die Perlen reichen für ein
// Vorderteil" galt als Nominalphrase (-chen) und stand als Ding hinter
// „bemerkt der Bote". Gemessen über 6472 Preset-Atome: 61 Umstufungen, alle
// von Nominalphrase/Fragment zu Hauptsatz, alle korrekt (gilt, gehört,
// gelingt, gerät, ruht, tagt, rät, reichen, hören, gehen).
ist("reichen ist ein Verb, kein Diminutiv", hatFinitesVerb("die Perlen reichen für ein Vorderteil"), true);
ist("gilt (nicht in der Tabelle)", deriveAtom("die Auskunft gilt rückwirkend").typ, "hauptsatz");
ist("gehört", deriveAtom("die Nacht gehört den Wachen").typ, "hauptsatz");
ist("gerät", deriveAtom("das Experiment gerät außer Kontrolle").typ, "hauptsatz");
ist("hören (Plural)", deriveAtom("die Nachbarn hören jedes Wort durch die Wand").typ, "hauptsatz");
// Gegenproben: Nominalphrasen bleiben Nominalphrasen.
ist("ein Mädchen mit Fahrrad", deriveAtom("ein Mädchen mit einem roten Fahrrad").typ, "nominalphrase");
ist("eine Frist, die rückwärts läuft", deriveAtom("eine Frist, die rückwärts läuft").typ, "nominalphrase");
ist("ein offenes Fenster (Adjektiv auf -en)", deriveAtom("ein offenes Fenster im Treppenhaus").typ, "nominalphrase");

console.log(`Prüfstand Verben — ${geprueft} Prüfungen, ${bestanden} bestanden`);
const proc = globalThis as unknown as { process?: { exit: (c: number) => void } };
if (fails.length) {
  console.error(`\n❌ Verben: ${fails.length} Fehler:`);
  fails.forEach((f) => console.error("  - " + f));
  proc.process?.exit(1);
} else {
  console.log(`\n✅ Verben: alle ${geprueft} Prüfungen bestanden.`);
}
