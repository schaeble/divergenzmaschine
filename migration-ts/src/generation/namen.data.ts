// Vornamen mit Genus — für den Namen-Wächter (4.365.0).
//
// Gewünscht: Ein Wächter, der in Wortbank- und Erzählerbank-Einträgen Namen
// (Vera, Tom …) automatisch in sie/er umwandelt, damit das Material keine
// Figur mitbringt — die Figur setzt der Wer. Hier die Namen, die er kennt:
// häufige deutsche und internationale Vornamen, weiblich und männlich.
// Nicht enthalten: Namen, die auch Wörter sind (August, Heide, Sommer,
// Stern), und Namen ohne klares Genus (Robin, Kim, Sascha, Andrea) — die
// würden mehr verderben als heilen. Wer einen Namen vermisst, trägt ihn ein.
const W = `
Anna Anne Anja Antje Astrid Barbara Beate Bettina Birgit Brigitte Britta Carla Carmen Carolin Caroline Charlotte Christa Christiane Christina Christine Claudia
Clara Cornelia Dagmar Daniela Doris Dorothea Edith Elena Elfriede Elisabeth Elke Ella Ellen Elsa Else Emilia Emma Erika Erna Esther Eva Franziska Frieda Friederike
Gabriele Gerda Gertrud Gisela Greta Gudrun Hanna Hannah Hedwig Helene Helga Henriette Hilde Hildegard Ilse Ines Inge Ingeborg Ingrid Irene Iris Irmgard Isabel Isabella
Jana Jasmin Jennifer Jessica Johanna Judith Julia Juliane Jutta Karin Karla Katharina Kathrin Katja Kerstin Klara Kristin Laura Lea Lena Leonie Lieselotte Lilli Lina Lisa
Lotte Luise Lydia Magdalena Maja Manuela Margarete Margot Maria Marianne Marie Marion Marlene Marta Martha Martina Mathilde Melanie Meta Michaela Mia Miriam Monika
Nadine Nadja Natalie Nele Nicole Nina Nora Olga Paula Petra Regina Renate Rita Rosa Rosemarie Ruth Sabine Sandra Sarah Sibylle Silke Silvia Simone Sofia Sophia Sophie
Stefanie Stephanie Susanne Svenja Tanja Theresa Ulla Ulrike Ursula Ute Valentina Vera Verena Veronika Viktoria Waltraud Wilhelmine Yvonne Zoe
Alice Amelie Beatrice Bianca Camilla Cécile Diana Dora Edda Eleonore Elise Emilie Fanny Flora Gerlinde Hertha Ida Irma Jolanda Josefine Käthe Klementine Konstanze Leni
Liesbeth Lore Lucia Magda Mara Margit Mechthild Nadia Ottilie Philippa Romy Sieglinde Selma Sina Thea Trude Ulrika Vanessa Vivien Wanda Wiebke Xenia
`;
const M = `
Achim Adam Adrian Albert Alexander Alfred Alois Andreas Anton Armin Arno Arnold Arthur Axel Benedikt Benjamin Bernd Bernhard Bertram Björn Bodo Boris Bruno Burkhard
Carsten Christian Christoph Claus Clemens Conrad Daniel David Dennis Detlef Dieter Dietmar Dietrich Dirk Dominik Eberhard Eckhard Edgar Eduard Egon Elias Emil Erich
Erik Ernst Erwin Eugen Fabian Falk Felix Ferdinand Florian Frank Franz Fred Friedrich Fritz Georg Gerd Gerhard Gernot Gottfried Gregor Günter Günther Gustav Hagen Hannes
Hans Harald Hartmut Heiner Heinrich Heinz Helmut Henning Herbert Hermann Holger Horst Hubert Hugo Ingo Jakob Jan Jens Joachim Jochen Johann Johannes Jonas Jonathan Jörg
Josef Julian Julius Jürgen Kai Karl Karsten Kaspar Klaus Konrad Konstantin Kurt Lars Leo Leon Leonhard Leopold Lorenz Lothar Ludwig Lukas Lutz Manfred Marcel Marco Marcus
Mario Markus Martin Mathias Matthias Max Maximilian Michael Moritz Niklas Nikolaus Nils Norbert Olaf Oliver Oskar Otto Patrick Paul Peter Philipp Rainer Ralf Reinhard Reiner
Richard Robert Roland Rolf Roman Rudolf Rüdiger Samuel Sebastian Siegfried Simon Stefan Steffen Stephan Sven Theodor Thomas Tim Timo Tobias Tom Torsten Udo Ulrich Uwe
Valentin Viktor Vincent Volker Walter Werner Wilhelm Willi Wolfgang Xaver
Alfons Anselm Balthasar Benno Caspar Cornelius Cyrill Eberhart Ehrenfried Elmar Emanuel Erhard Ewald Fridolin Gerald Gero Gilbert Gundolf Hanno Hartwig Heimo Hilmar Ignaz
Isidor Jasper Jost Justus Kilian Knut Leander Linus Lorenzo Magnus Malte Mattes Nepomuk Ole Ottmar Pankraz Quirin Raimund Rasmus Remigius Rupert Severin Silvester Tassilo
Tilman Titus Urban Veit Wendelin Wigbert
`;
export const VORNAMEN: Map<string, "f" | "m"> = new Map();
for (const n of W.split(/\s+/).filter(Boolean)) VORNAMEN.set(n, "f");
for (const n of M.split(/\s+/).filter(Boolean)) VORNAMEN.set(n, "m");
