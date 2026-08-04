// Annotations-Prompt für den einmaligen Atom-Lauf.
// Bewusst NUR die Felder, die Urteil verlangen — typ, rhythmus, tempus, fuehrt_ein
// und subjekt liefert der Offline-Ableiter zuverlässiger (Kalibrierprobe: 92 %).
// Der Offline-Wert wird mitgeschickt und dient als Gegenprobe: Weicht die KI ab,
// kommt der Eintrag in die Handprüfliste statt blind übernommen zu werden.
import { REGISTER } from "./schema";

export const ANNOTATION_SYSTEM = `Du annotierst deutsche Textbausteine für einen Textgenerator. Du bekommst eine
nummerierte Liste von Sätzen oder Satzteilen und gibst für jeden Eintrag ein JSON-Objekt zurück.

STRENG VERBOTEN: den Text ändern, korrigieren, kürzen, ergänzen, umstellen oder Einträge auslassen.
Du beschreibst nur, du bearbeitest nicht. Absurde, unvollständige oder rätselhafte Einträge werden
ebenso annotiert wie normale — sie sind Absicht.

Gib AUSSCHLIESSLICH ein JSON-Array zurück, ohne Markdown-Zäune, ohne Vorrede. Ein Objekt pro
Eingabeeintrag, in derselben Reihenfolge, mit dem Feld "n" gleich der Eingabenummer.

FELDER:

typ — genau einer von: hauptsatz | nebensatz | nominalphrase | praepositionalphrase | rahmen
  | fragment | einwort | konnektor | kopf
  "kopf" endet mit Doppelpunkt und kündigt etwas an. "rahmen" hat eine offene Leerstelle ⟨SLOT⟩.
  Zu jedem Eintrag ist ein maschinell bestimmter Vorschlag angegeben — weiche nur ab, wenn er
  klar falsch ist, und setze dann "typ_abweichung": true.

verlangt — NUR bei typ "rahmen": { "rolle": "objekt"|"subjekt"|"ergaenzung",
  "kasus": "nom"|"gen"|"dat"|"akk", "art": "nominalphrase"|"hauptsatz" }. Sonst null.

bietet_kasus — nur bei "nominalphrase": "nom" | "gen" | "dat" | "akk";
  bei gleicher Form für Nominativ und Akkusativ: "nom_akk". Sonst null.

kadenz — Klangfall am Ende: "fallend" (Punkt/Ausrufezeichen), "schwebend" (Doppelpunkt,
  Gedankenstrich, Fragezeichen), "offen" (kein Endzeichen).

schliesst — true, wenn der Eintrag als Nachsatz zu einem Doppelpunkt taugt (also allein
  nach "X spürt:" stehen könnte). Sonst false.

welt — Array von 0–3 groben Weltzugehörigkeiten, nur wenn der Eintrag deutlich in eine gehört:
  kafkaesk | maerchen | technik | natur | stadt | see | krieg | verfall | traum | buerokratie
  | koerper | religion | kindheit | historie. Weltneutrale Einträge bekommen [].

bildfeld — Array von 1–3 Motivklassen, woraus das Bild stammt:
  haus | wasser | licht | dunkel | tier | pflanze | koerper | kleidung | speise | metall
  | papier | zeit | klang | bewegung | wetter | verkehr | geld | schrift | tod | suesse.

register — ${REGISTER.join(" | ")}

bruchgrad — wie stark der Eintrag den Lesefluss bricht:
  0 = fügt sich glatt in jede Umgebung
  1 = leicht auffällig
  2 = deutlicher Bildsprung oder Kategorienwechsel
  3 = harter Bruch, Aussage kollidiert mit gewöhnlicher Logik
  (Beispiel für 3: "Ich bin Rauschen." — ein Sprecher setzt sich mit einem physikalischen
   Phänomen gleich.)

person_wandelbar — false, wenn eine Umschreibung auf eine andere grammatische Person den
  Eintrag zerstören würde (Zitate, feste Wendungen, Eigennamenformeln). Sonst true.

tempus_wandelbar — false bei Zitaten und festen Wendungen, sonst true.

fest — true bei wörtlichen Zitaten, Titeln, Eigennamen in Anführungszeichen.`;

export const ANNOTATION_BEISPIEL = `Annotiere:
1. [typ-vorschlag: hauptsatz] Die Kornkammern sind leer, obwohl die Saat aufging.
2. [typ-vorschlag: fragment] ganz ohne Ruder
3. [typ-vorschlag: kopf] Baucis spürt:

Erwartete Antwort:
[
 {"n":1,"typ":"hauptsatz","typ_abweichung":false,"verlangt":null,"bietet_kasus":null,
  "kadenz":"fallend","schliesst":true,"welt":["natur"],"bildfeld":["speise","pflanze"],
  "register":"nuechtern","bruchgrad":1,"person_wandelbar":true,"tempus_wandelbar":true,"fest":false},
 {"n":2,"typ":"fragment","typ_abweichung":false,"verlangt":null,"bietet_kasus":null,
  "kadenz":"offen","schliesst":false,"welt":["see"],"bildfeld":["bewegung"],
  "register":"lakonisch","bruchgrad":1,"person_wandelbar":false,"tempus_wandelbar":false,"fest":false},
 {"n":3,"typ":"kopf","typ_abweichung":false,"verlangt":null,"bietet_kasus":null,
  "kadenz":"schwebend","schliesst":false,"welt":[],"bildfeld":["koerper"],
  "register":"nuechtern","bruchgrad":0,"person_wandelbar":true,"tempus_wandelbar":true,"fest":false}
]`;

/** Baut den User-Turn für einen Block: Text mit maschinellem Typ-Vorschlag. */
export function buildAnnotationBlock(items: { text: string; typVorschlag: string }[]): string {
  return "Annotiere:\n" + items.map((it, i) => `${i + 1}. [typ-vorschlag: ${it.typVorschlag}] ${it.text}`).join("\n");
}
