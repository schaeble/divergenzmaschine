// Die existenziellen Fragen der Menschheit — ein FESTER Pool.
//
// Gewünscht: „Für die 4W hätte ich gerne einen Wahl-Schalter neben Thema, mit
// den Existenziellen Fragen der Menschheit. Als festen Pool mit 50 Einträgen.
// Möglichst kurze Eintragungen in den 4W."
//
// Der Unterschied zu Wiki, Abschrift und Thema: Diese drei holen sich ihr
// Material aus dem Netz und sind leer, solange niemand etwas geholt hat. Dieser
// Pool ist eingebaut, steht beim ersten Start bereit und ändert sich nie. Er
// braucht keinen Vorrat, deshalb ist seine Quelle immer offen — wie Welt,
// Ideen und Wahrnehmung.
//
// Zur Form der Einträge:
//
//   Wo    MIT Präposition. Gemessen an `normWhere`: „Königsberg" wird zu „im
//         Königsberg", „Florenz" zu „in der Florenz", „Cambridge" zu „in der
//         Cambridge" — die Genus-Heuristik greift bei Ortsnamen daneben. Was
//         mit einer Präposition beginnt, lässt sie unangetastet. Also steht sie
//         hier schon drin.
//   Wer   Bloßer Name. Eigennamen gehen unverändert durch `normWho`.
//   Wann  Kurz und geprüft: „1687" würde zu „im Jahr 1687" — geschenkt, aber
//         die Jahreszahl mit Zusatz („um 380 v. Chr.") bleibt, wie sie ist.
//   Was   Eine Verbalphrase mit der Frage darin („fragt, was gerecht ist").
//         Nachgesehen im erzeugten Text: Der Nebensatz übersteht den Zusammen-
//         bau — „Sokrates fragt, wo Gott ist." steht als ganzer Satz im Absatz.
//
// Die Paarung ist nicht beliebig: Ort, Zeit und Person gehören zusammen. Ein
// Sokrates in Los Alamos wäre eine Divergenz, die der Benutzer selbst herstellen
// kann, indem er ein Feld sperrt und neu würfelt — der Pool soll ihm dafür
// etwas Ganzes anbieten, kein Durcheinander.
export interface Frage {
  who: string;
  where: string;
  when: string;
  what: string;
}

export const FRAGEN: Frage[] = [
  // ── Vorgeschichte und die ältesten Fragen ────────────────────────────────
  { who: "eine Sammlerin", where: "in der Wiege der Menschheit", when: "vor 200.000 Jahren", what: "fragt, ob der Tod das Ende ist" },
  { who: "ein Jäger", where: "an einer bemalten Höhlenwand", when: "vor 30.000 Jahren", what: "fragt, wohin die Toten gehen" },
  { who: "Mose", where: "am Sinai", when: "in grauer Vorzeit", what: "fragt, wer Gott ist" },
  { who: "Hiob", where: "im Land Uz", when: "in grauer Vorzeit", what: "fragt, warum der Gerechte leidet" },

  // ── Griechenland ─────────────────────────────────────────────────────────
  { who: "Thales", where: "in Milet", when: "um 585 v. Chr.", what: "fragt, woraus die Welt besteht" },
  { who: "Pythagoras", where: "auf Samos", when: "um 530 v. Chr.", what: "fragt, ob die Zahl alles ordnet" },
  { who: "Heraklit", where: "in Ephesos", when: "um 500 v. Chr.", what: "fragt, ob irgendetwas bleibt" },
  { who: "Parmenides", where: "in Elea", when: "um 480 v. Chr.", what: "fragt, ob es das Nichts gibt" },
  { who: "Sokrates", where: "in Athen", when: "399 v. Chr.", what: "fragt, was gerecht ist" },
  { who: "Platon", where: "in Athen", when: "um 380 v. Chr.", what: "fragt, was wirklich ist" },
  { who: "Aristoteles", where: "in Athen", when: "um 335 v. Chr.", what: "fragt, wozu alles da ist" },
  { who: "Diogenes", where: "in Korinth", when: "um 350 v. Chr.", what: "fragt, was ein Mensch braucht" },

  // ── Der Osten ────────────────────────────────────────────────────────────
  { who: "Laozi", where: "in Luoyang", when: "um 500 v. Chr.", what: "fragt, ob der Weg sagbar ist" },
  { who: "Konfuzius", where: "in Qufu", when: "um 490 v. Chr.", what: "fragt, was man dem Nächsten schuldet" },
  { who: "Zhuangzi", where: "in Meng", when: "um 320 v. Chr.", what: "fragt, wer hier träumt" },
  { who: "Siddhartha", where: "in Bodhgaya", when: "um 528 v. Chr.", what: "fragt, woher das Leid kommt" },
  { who: "Nagarjuna", where: "in Nalanda", when: "um 200", what: "fragt, ob etwas für sich besteht" },

  // ── Spätantike und Mittelalter ───────────────────────────────────────────
  { who: "Hypatia", where: "in Alexandria", when: "um 400", what: "fragt, wie die Himmel laufen" },
  { who: "Augustinus", where: "in Hippo", when: "um 400", what: "fragt, was die Zeit ist" },
  { who: "Gregor von Nazianz", where: "in Konstantinopel", when: "381", what: "fragt, ob Gott sich teilen lässt" },
  { who: "Al-Kindi", where: "in Bagdad", when: "um 850", what: "fragt, ob die Welt einen Anfang hat" },
  { who: "Avicenna", where: "in Isfahan", when: "um 1020", what: "fragt, was notwendig existiert" },
  { who: "Averroes", where: "in Córdoba", when: "um 1180", what: "fragt, ob Vernunft und Glaube sich vertragen" },
  { who: "Maimonides", where: "in Kairo", when: "um 1190", what: "fragt, ob man Gott benennen darf" },
  { who: "Hildegard", where: "in Bingen", when: "um 1150", what: "fragt, wovon die Schau kommt" },
  { who: "Thomas von Aquin", where: "in Paris", when: "um 1270", what: "fragt, ob Gott beweisbar ist" },
  { who: "Meister Eckhart", where: "in Köln", when: "um 1320", what: "fragt, wo Gott wohnt" },
  { who: "Wilhelm von Ockham", where: "in Oxford", when: "um 1320", what: "fragt, was man weglassen darf" },
  { who: "Petrarca", where: "auf dem Mont Ventoux", when: "1336", what: "fragt, warum er hinaufsteigt" },

  // ── Neuzeit ──────────────────────────────────────────────────────────────
  { who: "Kopernikus", where: "in Frauenburg", when: "1543", what: "fragt, was im Mittelpunkt steht" },
  { who: "Giordano Bruno", where: "in Venedig", when: "1592", what: "fragt, ob die Welten zahllos sind" },
  { who: "Galilei", where: "in Florenz", when: "1633", what: "fragt, ob die Erde sich bewegt" },
  { who: "Descartes", where: "in Amsterdam", when: "1637", what: "fragt, was sich nicht bezweifeln lässt" },
  { who: "Pascal", where: "in Paris", when: "1654", what: "fragt, ob die Stille des Alls schreckt" },
  { who: "Spinoza", where: "in Den Haag", when: "1670", what: "fragt, ob Gott die Natur ist" },
  { who: "Newton", where: "in Cambridge", when: "1687", what: "fragt, was die Körper zieht" },
  { who: "Leibniz", where: "in Hannover", when: "1697", what: "fragt, warum überhaupt etwas ist" },
  { who: "Hume", where: "in Edinburgh", when: "1748", what: "fragt, ob morgen die Sonne aufgeht" },
  { who: "Kant", where: "in Königsberg", when: "1781", what: "fragt, was er wissen kann" },
  { who: "Kierkegaard", where: "in Kopenhagen", when: "1843", what: "fragt, was er wählen soll" },
  { who: "Darwin", where: "in Down House", when: "1859", what: "fragt, woher die Arten kommen" },
  { who: "Nietzsche", where: "in Sils Maria", when: "1881", what: "fragt, ob alles wiederkehrt" },

  // ── Das letzte Jahrhundert ───────────────────────────────────────────────
  { who: "Einstein", where: "in Bern", when: "1905", what: "fragt, ob die Zeit für alle gleich läuft" },
  { who: "Bohr", where: "in Kopenhagen", when: "1927", what: "fragt, ob der Zufall regiert" },
  { who: "Gödel", where: "in Princeton", when: "1931", what: "fragt, ob alles Wahre beweisbar ist" },
  { who: "Oppenheimer", where: "in Los Alamos", when: "1945", what: "fragt, was er getan hat" },
  { who: "Turing", where: "in Manchester", when: "1950", what: "fragt, ob eine Maschine denkt" },
  { who: "Fermi", where: "in Chicago", when: "1950", what: "fragt, wo denn alle sind" },
  { who: "Arendt", where: "in New York", when: "1963", what: "fragt, wie das Böse gewöhnlich wird" },
  { who: "Sagan", where: "in Arecibo", when: "1974", what: "fragt, ob jemand antwortet" },
];
