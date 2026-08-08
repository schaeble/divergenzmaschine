export interface RhymeGroup { key: string; words: string[]; }
export const REIM_GROUPS: RhymeGroup[] = [
 {
  "key": "acht",
  "words": [
   "Nacht",
   "Macht",
   "erwacht",
   "entfacht",
   "bedacht",
   "Verdacht",
   "vollbracht",
   "sacht",
   "wacht"
  ]
 },
 {
  "key": "ein",
  "words": [
   "allein",
   "hinein",
   "Schein",
   "Stein",
   "klein",
   "fein",
   "rein",
   "Gebein"
  ]
 },
 {
  "key": "icht",
  "words": [
   "Licht",
   "Gesicht",
   "Pflicht",
   "Bericht",
   "Gedicht",
   "Verzicht",
   "dicht",
   "Sicht",
   "Gewicht",
   "bricht"
  ]
 },
 {
  "key": "and",
  "words": [
   "Rand",
   "Hand",
   "Wand",
   "Sand",
   "Verstand",
   "Land",
   "Band",
   "Brand",
   "Gegenstand",
   "fand"
  ]
 },
 {
  "key": "eise",
  "words": [
   "leise",
   "Kreise",
   "Reise",
   "Weise",
   "beweise",
   "Waise"
  ]
 },
 {
  "key": "aum",
  "words": [
   "Raum",
   "Traum",
   "Baum",
   "Schaum",
   "kaum",
   "Saum",
   "Zaum",
   "Flaum"
  ]
 },
 {
  "key": "ang",
  "words": [
   "lang",
   "Klang",
   "Gesang",
   "Gang",
   "Zwang",
   "bang",
   "Rang"
  ]
 },
 {
  "key": "ur",
  "words": [
   "Spur",
   "Uhr",
   "Figur",
   "Struktur",
   "Natur",
   "pur",
   "Kontur"
  ]
 }
];
export const REIM_TAILS: Record<string,string[]> = {
 "Nacht": [
  "tief in der Nacht",
  "mitten in der Nacht",
  "am Rand der Nacht"
 ],
 "Macht": [
  "mit stiller Macht",
  "ohne jede Macht"
 ],
 "erwacht": [
  "bevor es erwacht",
  "eh der Tag erwacht"
 ],
 "entfacht": [
  "neu entfacht",
  "still entfacht"
 ],
 "bedacht": [
  "kaum bedacht",
  "nie bedacht"
 ],
 "Verdacht": [
  "gegen jeden Verdacht",
  "voller Verdacht"
 ],
 "vollbracht": [
  "halb vollbracht",
  "längst vollbracht"
 ],
 "sacht": [
  "leise und sacht",
  "ganz sacht"
 ],
 "wacht": [
  "während niemand wacht",
  "weil keiner wacht"
 ],
 "allein": [
  "still und allein",
  "ganz allein"
 ],
 "hinein": [
  "tief hinein",
  "bis tief hinein"
 ],
 "Schein": [
  "im falschen Schein",
  "im letzten Schein"
 ],
 "Stein": [
  "hart wie Stein",
  "aus kaltem Stein"
 ],
 "klein": [
  "unendlich klein",
  "stumm und klein"
 ],
 "fein": [
  "dünn und fein",
  "viel zu fein"
 ],
 "rein": [
  "nicht mehr rein",
  "kalt und rein"
 ],
 "Gebein": [
  "bis ins Gebein",
  "tief im Gebein"
 ],
 "Licht": [
  "im letzten Licht",
  "gegen das Licht"
 ],
 "Gesicht": [
  "ohne Gesicht",
  "mit fremdem Gesicht"
 ],
 "Pflicht": [
  "aus alter Pflicht",
  "wie eine Pflicht"
 ],
 "Bericht": [
  "wie im Bericht",
  "ohne Bericht"
 ],
 "Gedicht": [
  "wie ein Gedicht",
  "halb ein Gedicht"
 ],
 "Verzicht": [
  "ein stiller Verzicht",
  "aus Verzicht"
 ],
 "dicht": [
  "nah und dicht",
  "undurchdringlich dicht"
 ],
 "Sicht": [
  "außer Sicht",
  "ohne klare Sicht"
 ],
 "Gewicht": [
  "ohne Gewicht",
  "mit vollem Gewicht"
 ],
 "bricht": [
  "bis es bricht",
  "eh es bricht"
 ],
 "Rand": [
  "hart am Rand",
  "am äußersten Rand"
 ],
 "Hand": [
  "in deiner Hand",
  "mit ruhiger Hand"
 ],
 "Wand": [
  "an der weißen Wand",
  "dicht an der Wand"
 ],
 "Sand": [
  "zerronnen wie Sand",
  "aus feinem Sand"
 ],
 "Verstand": [
  "gegen den Verstand",
  "ohne Verstand"
 ],
 "Land": [
  "weit über Land",
  "im fremden Land"
 ],
 "Band": [
  "wie ein Band",
  "ein unsichtbares Band"
 ],
 "Brand": [
  "wie im stillen Brand",
  "kurz vor dem Brand"
 ],
 "Gegenstand": [
  "bloß ein Gegenstand",
  "wie ein Gegenstand"
 ],
 "fand": [
  "was niemand fand",
  "das keiner fand"
 ],
 "leise": [
  "unendlich leise",
  "beinahe leise"
 ],
 "Kreise": [
  "und zieht seine Kreise",
  "und zieht stille Kreise"
 ],
 "Reise": [
  "wie auf halber Reise",
  "auf später Reise"
 ],
 "Weise": [
  "auf stille Weise",
  "auf alte Weise"
 ],
 "beweise": [
  "das ich nicht beweise",
  "was ich nie beweise"
 ],
 "Waise": [
  "verloren wie eine Waise",
  "allein wie eine Waise"
 ],
 "Raum": [
  "quer durch den Raum",
  "im leeren Raum"
 ],
 "Traum": [
  "wie im Traum",
  "halb im Traum"
 ],
 "Baum": [
  "still wie ein Baum",
  "unterm kahlen Baum"
 ],
 "Schaum": [
  "zerfällt wie Schaum",
  "weiß wie Schaum"
 ],
 "kaum": [
  "man hört es kaum",
  "man sieht es kaum"
 ],
 "Saum": [
  "am dunklen Saum",
  "am äußersten Saum"
 ],
 "Zaum": [
  "hält sich im Zaum",
  "wie im Zaum"
 ],
 "Flaum": [
  "weich wie Flaum",
  "leicht wie Flaum"
 ],
 "lang": [
  "ein Leben lang",
  "eine Nacht lang"
 ],
 "Klang": [
  "mit dunklem Klang",
  "wie ein ferner Klang"
 ],
 "Gesang": [
  "wie ein Gesang",
  "ohne Gesang"
 ],
 "Gang": [
  "auf schmalem Gang",
  "im letzten Gang"
 ],
 "Zwang": [
  "ohne Zwang",
  "wie unter Zwang"
 ],
 "bang": [
  "still und bang",
  "seltsam bang"
 ],
 "Rang": [
  "ohne Namen und Rang",
  "ohne Rang"
 ],
 "Spur": [
  "ohne eine Spur",
  "wie eine Spur"
 ],
 "Uhr": [
  "gegen die Uhr",
  "nach der inneren Uhr"
 ],
 "Figur": [
  "stumm wie eine Figur",
  "wie eine Figur"
 ],
 "Struktur": [
  "ohne Struktur",
  "reine Struktur"
 ],
 "Natur": [
  "gegen die Natur",
  "wie von Natur"
 ],
 "pur": [
  "kalt und pur",
  "hell und pur"
 ],
 "Kontur": [
  "ohne Kontur",
  "nur als Kontur"
 ]
};
export const REIM_RHYTHM_TARGETS = [3, 6, 4, 7, 3, 5];
export const REIM_CONNECTORS = [" — ", ", ", " – "];
export const REIM_DEFAULTS = { targetLines: 12, maxWordsPerLine: 7, stanzaEvery: 4 };
export const REIM_DANGLING_RX = /^(der|die|das|den|dem|des|ein|eine|einen|einem|einer|eines|mein|meine|meinen|meinem|meiner|dein|deine|deinen|sein|seine|seinen|ihr|ihre|ihren|unser|unsere|euer|eure|und|oder|aber|dass|ob|weil|wenn|als|wie|mit|in|im|auf|an|am|für|ohne|durch|über|unter|vor|nach|zu|zum|zur|bei|aus|um|gegen|während|wegen|will|willst|wollen|wollt|kann|kannst|können|könnt|muss|musst|müssen|müsst|soll|sollst|sollen|sollt|darf|darfst|dürfen|dürft|mag|magst|mögen|mögt|möchte|möchtest|möchten|möchtet|ist|sind|war|waren|bin|bist|seid|wird|wirst|werdet|werden|würde|würden|hat|hast|habt|haben|hatte|hatten|bekommt|bekommen|bekam|gibt|gab|nimmt|nahm|macht|sieht|sah|sucht|trägt|trug|hält|hielt|braucht|kennt|nennt|zeigt|bringt|lässt|ließ|setzt|legt|stellt|öffnet|findet|bemerkt|bemerkte|tritt|trat|zieht|zog|greift|griff|wirft|warf|hebt|hob)$/i;
