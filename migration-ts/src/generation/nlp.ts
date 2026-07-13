// Sprach-Helfer für den Kohärenz-Schliff (aus dem Live-Code portiert).

export function tokenize(text: string): string[] {
  return (text || "")
    .replace(/\r/g, "")
    .replace(/([.,!?;:()„""""—])/g, " $1 ")
    .replace(/\s+/g, " ")
    .trim()
    .split(" ")
    .filter(Boolean);
}

export const COHERENCE_STOPWORDS = new Set(
  ("aber alle allem allen aller alles als also am an andere anderen auch auf aus bei bin bis bist da dabei dann das dass dem den denn der des dessen die dies diese diesem diesen dieser dieses doch dort du durch ein eine einem einen einer eines er es etwas fuer für gegen hab habe haben hat hatte hier hin hinter ich ihm ihn ihr ihre im in ist ja jede jedem jeden jeder jedes kann kein keine man mehr mein mich mir mit muss nach nicht nichts noch nun nur ob oder ohne schon sein seine sich sie sind so ueber über um und uns unser unter vom von vor war waren was wenn werden wie wieder will wir wird wo zu zum zur")
    .split(" "),
);

export function coherenceWords(s: string): string[] {
  return tokenize(String(s || "").toLowerCase())
    .filter((w) => w.length > 3 && !COHERENCE_STOPWORDS.has(w));
}
