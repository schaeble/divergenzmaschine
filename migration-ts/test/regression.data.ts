// Regressionsfälle (Ablaufplan 1.6): bekannte Negativtexte mit Sollwerten.
// Zweck: Nach jedem Umbau belegen können, dass die Pathologie erkannt WIRD —
// nicht bloß behaupten, es sei besser geworden.
//
// Die Texte hier bilden die Fehlermuster nach. Wo dir der Originaltext vorliegt,
// ersetze `text` — die Sollwerte bleiben gültig, weil sie die Pathologie messen.

export interface Regressionsfall {
  id: string;
  titel: string;
  text: string;
  /** Was der Fall zeigt und welche Metrik ihn fangen muss. */
  pathologie: string;
  erwartung: {
    phraseRepeatMin?: number;    // Phrasenwiederholung MUSS mindestens so hoch sein
    tenseBreakMin?: number;
    castSpreadMin?: number;
    perspBreakMin?: number;
    slotBruch?: boolean;
    zweitslot?: boolean;       // Vorlage mit zwei Slots verschiedener Art         // enthält einen Slot-Splice (Rahmen schluckt Hauptsatz)
  };
}

export const REGRESSIONSFAELLE: Regressionsfall[] = [
  {
    id: "zuckerkringel-splice",
    titel: "Zuckerkringel-Splice",
    // Ein Rahmen mit Akkusativ-Leerstelle hat einen ganzen Hauptsatz geschluckt.
    text: "Ich kenne auf der Türklinke klebt ein Zuckerkringel. Die Frist ist rückwirkend. "
        + "Baucis will das Formular lügt. Der Ausgang ist innen.",
    pathologie: "Rahmen mit ⟨AKK⟩-Slot nimmt einen Hauptsatz statt einer Nominalphrase auf. "
              + "Muss durch die Slot-Typprüfung strukturell unmöglich sein.",
    erwartung: { slotBruch: true },
  },
  {
    id: "schafsweiden-schleife",
    titel: "Schafsweiden-Schleife",
    // Ging als Sieger aus 50 Kandidaten hervor, obwohl Phrasen mehrfach wiederkehren.
    text: "Auf der Schafsweide bemerkt Baucis eine rote Feder im falschen Winkel. "
        + "Auf der Schafsweide steht Baucis vor einer roten Feder. "
        + "Der Einsatz ist Kontrolle. Auf der Schafsweide bemerkt Baucis den Riss. "
        + "Der Einsatz ist Kontrolle. Eine rote Feder im falschen Winkel bleibt liegen.",
    pathologie: "Wiederkehrende Drei- und Viergramme („auf der Schafsweide bemerkt Baucis“, "
              + "„der Einsatz ist Kontrolle“). Muss von der Phrasenwiederholung abgewertet werden.",
    erwartung: { phraseRepeatMin: 0.10 },
  },
  {
    id: "tempus-sprung",
    titel: "Zeitebenen-Sprung",
    text: "Der Hafen lag still im Nebel. Ein Mann ging über den Steg. "
        + "Die Kornkammern sind leer. Man erkannte nichts. Die Uhr tickt weiter.",
    pathologie: "Präteritum und Präsens wechseln mitten im Text.",
    erwartung: { tenseBreakMin: 0.15 },
  },
  {
    id: "figuren-streuung",
    titel: "Figuren-Streuung",
    text: "Baucis wartet am Fenster. Zar Peter unterschreibt den Erlass. "
        + "Ludwig zögert im Saal. Der Bäcker aus Konstanz klopft. Philemon schweigt.",
    pathologie: "Fünf Figurenkerne in einem Absatz — die Aufmerksamkeit zerfällt.",
    erwartung: { castSpreadMin: 0.2 },
  },
  {
    id: "perspektiv-bruch",
    titel: "Perspektivbruch",
    text: "Tom wartet am Kai. Er nimmt die Glocke. Aber du darfst nicht frei sprechen. "
        + "Der Kran steht still. Ich sehe nichts.",
    pathologie: "Du- und Ich-Formen in einer Er-Erzählung.",
    erwartung: { perspBreakMin: 0.2 },
  },
  {
    id: "zweitslot-kollision",
    titel: "Zweitslot-Kollision",
    text: "Du hattest Die Luft roch nach Papier und geduldeter Angst schon in der Hand, denn ein taumelnder Mast.",
    erwartung: { zweitslot: true },
  },
];
