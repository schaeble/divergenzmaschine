export const WORLD_FIG_ARCS: Record<string,string[]> = {
 "taucht zum ersten mal auf": [
  "stellt Fragen, die niemand erwartet",
  "wird beobachtet",
  "findet eine erste Spur"
 ],
 "stellt fragen, die niemand erwartet": [
  "wird beobachtet",
  "erhält eine anonyme Warnung",
  "hat ein Geheimnis entdeckt"
 ],
 "findet eine erste spur": [
  "hat ein Geheimnis entdeckt",
  "wird beobachtet",
  "verliert die Spur wieder"
 ],
 "verliert die spur wieder": [
  "stellt Fragen, die niemand erwartet",
  "ist misstrauisch geworden"
 ],
 "erhält eine anonyme warnung": [
  "taucht unter",
  "ignoriert die Warnung",
  "ist misstrauisch geworden"
 ],
 "ignoriert die warnung": [
  "wird gejagt",
  "hat ein Geheimnis entdeckt"
 ],
 "wird beobachtet": [
  "bemerkt die Beobachtung",
  "stellt dem Beobachter eine Falle",
  "taucht unter"
 ],
 "bemerkt die beobachtung": [
  "stellt dem Beobachter eine Falle",
  "taucht unter",
  "hat die Seiten gewechselt"
 ],
 "stellt dem beobachter eine falle": [
  "hat ein Geheimnis entdeckt",
  "hat die Seiten gewechselt",
  "wird gejagt"
 ],
 "taucht unter": [
  "gilt offiziell als vermisst",
  "hinterlässt eine verschlüsselte Nachricht",
  "wird an einem fremden Ort gesehen"
 ],
 "hinterlässt eine verschlüsselte nachricht": [
  "gilt offiziell als vermisst",
  "wird an einem fremden Ort gesehen"
 ],
 "gilt offiziell als vermisst": [
  "wird an einem fremden Ort gesehen",
  "ist zurückgekehrt, verändert",
  "bleibt ein Gerücht"
 ],
 "bleibt ein gerücht": [
  "ist zurückgekehrt, verändert",
  "wird an einem fremden Ort gesehen"
 ],
 "wird an einem fremden ort gesehen": [
  "ist zurückgekehrt, verändert",
  "hat einen neuen Namen angenommen"
 ],
 "ist zurückgekehrt, verändert": [
  "wird misstrauisch beäugt",
  "hat ein Geheimnis entdeckt",
  "sucht alte Verbündete"
 ],
 "sucht alte verbündete": [
  "hat ein Geheimnis entdeckt",
  "wird misstrauisch beäugt"
 ],
 "wird misstrauisch beäugt": [
  "stellt Fragen, die niemand erwartet",
  "taucht unter"
 ],
 "hat ein geheimnis entdeckt": [
  "will das Geheimnis beweisen",
  "wird deshalb erpresst",
  "vertraut sich jemandem an"
 ],
 "vertraut sich jemandem an": [
  "wird verraten",
  "will das Geheimnis beweisen"
 ],
 "wird verraten": [
  "ist misstrauisch geworden",
  "hat die Seiten gewechselt",
  "taucht unter"
 ],
 "wird deshalb erpresst": [
  "zahlt und schweigt",
  "stellt dem Beobachter eine Falle",
  "hat die Seiten gewechselt"
 ],
 "zahlt und schweigt": [
  "ist misstrauisch geworden",
  "wird deshalb erpresst"
 ],
 "will das geheimnis beweisen": [
  "sammelt Beweise",
  "wird gejagt",
  "zweifelt an den eigenen Beweisen"
 ],
 "sammelt beweise": [
  "legt eine eigene Akte an",
  "wird gejagt"
 ],
 "zweifelt an den eigenen beweisen": [
  "verliert die Spur wieder",
  "legt eine eigene Akte an"
 ],
 "legt eine eigene akte an": [
  "wird beobachtet",
  "wurde befördert"
 ],
 "hat die seiten gewechselt": [
  "wird vom alten Lager gejagt",
  "bereut den Wechsel",
  "steigt im neuen Lager auf"
 ],
 "wird vom alten lager gejagt": [
  "taucht unter",
  "entkommt knapp"
 ],
 "bereut den wechsel": [
  "sucht alte Verbündete",
  "taucht unter"
 ],
 "steigt im neuen lager auf": [
  "wurde befördert",
  "wird misstrauisch beäugt"
 ],
 "wird gejagt": [
  "taucht unter",
  "stellt sich",
  "entkommt knapp"
 ],
 "entkommt knapp": [
  "taucht unter",
  "hinterlässt eine verschlüsselte Nachricht"
 ],
 "stellt sich": [
  "verhandelt um Schweigen",
  "ist zurückgekehrt, verändert"
 ],
 "verhandelt um schweigen": [
  "zahlt und schweigt",
  "hat die Seiten gewechselt"
 ],
 "hat einen neuen namen angenommen": [
  "lebt unauffällig",
  "wird trotzdem erkannt"
 ],
 "lebt unauffällig": [
  "wird trotzdem erkannt",
  "ist misstrauisch geworden"
 ],
 "wird trotzdem erkannt": [
  "wird gejagt",
  "verhandelt um Schweigen"
 ],
 "wurde befördert": [
  "missbraucht die neue Macht",
  "wird misstrauisch beäugt",
  "entdeckt Akten, die niemand sehen soll"
 ],
 "missbraucht die neue macht": [
  "wird deshalb erpresst",
  "wird misstrauisch beäugt"
 ],
 "entdeckt akten, die niemand sehen soll": [
  "hat ein Geheimnis entdeckt",
  "legt eine eigene Akte an"
 ],
 "ist misstrauisch geworden": [
  "stellt Fragen, die niemand erwartet",
  "zieht sich zurück",
  "legt eine eigene Akte an"
 ],
 "zieht sich zurück": [
  "taucht unter",
  "lebt unauffällig"
 ]
};
export const WORLD_FIG_FALLBACK: string[] = [
 "wird beobachtet",
 "stellt Fragen, die niemand erwartet",
 "hat ein Geheimnis entdeckt",
 "taucht unter",
 "wurde befördert",
 "ist misstrauisch geworden",
 "sucht alte Verbündete"
];
export const WORLD_ORT_CYCLE: string[] = [
 "wird zum ersten Mal erwähnt",
 "zieht Neugierige an",
 "wird belebt",
 "wird streng bewacht",
 "wird gesperrt",
 "gilt als Tatort",
 "ist verlassen worden",
 "verfällt langsam",
 "liegt in Trümmern",
 "wird heimlich wieder betreten",
 "wird umgebaut",
 "wurde neu eröffnet"
];
export const WORLD_REL_CHAIN: string[] = [
 "begegnen sich zum ersten Mal",
 "tauschen vorsichtig Informationen",
 "verbünden sich",
 "teilen ein Geheimnis",
 "zerstreiten sich über das Geheimnis",
 "sind verfeindet",
 "belauern einander",
 "versöhnen sich vorsichtig"
];
