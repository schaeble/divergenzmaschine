export interface ArchetypeFull {
  label?: string;
  speakers: string[];
  add?: Record<string, string[]>;
  weights?: Record<string, Record<string, number>>;
}
export const ARCHETYPES: Record<string, ArchetypeFull> = {
 "neutral": {
  "label": "Neutral",
  "weights": {
   "mode": {
    "bureau": 1,
    "tech": 1,
    "body": 1,
    "myth": 1,
    "absurd": 1,
    "post": 1
   },
   "structure": {
    "linear": 1,
    "reverse": 1,
    "circle": 1,
    "fragment": 1,
    "object": 1
   },
   "perspective": {
    "third": 1,
    "first": 1,
    "second": 1,
    "we": 1,
    "object": 1
   },
   "rhythm": {
    "breath": 1,
    "staccato": 1,
    "long": 1,
    "fracture": 1,
    "clean": 1
   }
  },
  "add": {
   "motifs": [],
   "hooks": [],
   "props": [],
   "turns": [],
   "obstacles": [],
   "stakes": [],
   "endings": []
  },
  "speakers": [
   "Die Stimme",
   "Das System",
   "Ein Unbekannter",
   "Das Archiv",
   "Der Apparat"
  ]
 },
 "skorpion": {
  "label": "Skorpion",
  "weights": {
   "mode": {
    "body": 2.6,
    "bureau": 1.6,
    "myth": 1.2,
    "absurd": 1.1,
    "tech": 1,
    "post": 1
   },
   "structure": {
    "circle": 2,
    "fragment": 1.6,
    "reverse": 1.3,
    "linear": 1.1,
    "object": 1.2
   },
   "perspective": {
    "second": 2.2,
    "first": 1.7,
    "third": 1.2,
    "we": 1,
    "object": 0.9
   },
   "rhythm": {
    "breath": 2,
    "staccato": 1.4,
    "fracture": 1.2,
    "long": 1,
    "clean": 0.9
   }
  },
  "add": {
   "motifs": [
    "ein Blick, der festhält",
    "eine Nähe, die Kontrolle wird",
    "ein Geheimnis mit Puls",
    "ein Satz, der Besitz markiert"
   ],
   "hooks": [
    "eine Hand auf dem Nacken",
    "ein Flüstern, das an dir klebt",
    "eine Spur, die dich wählt"
   ],
   "turns": [
    "die Nähe kippt in Kontrolle",
    "die Wahrheit wird Besitz",
    "das Begehren wird zur Regel"
   ],
   "obstacles": [
    "du darfst nicht frei sprechen",
    "jemand legt fest, was du meinst",
    "eine Grenze wird unsichtbar gezogen"
   ],
   "stakes": [
    "Der Einsatz ist Bindung.",
    "Der Einsatz ist Kontrolle.",
    "Der Einsatz ist Wahrheit: in deiner Hand."
   ],
   "endings": [
    "Und du wusstest, wem es gehört.",
    "Und der Blick blieb.",
    "Und die Nähe war das Urteil."
   ]
  },
  "speakers": [
   "Die Zeugin",
   "Der Blick",
   "Die Hand",
   "Die Stimme",
   "Der Vermerk"
  ]
 },
 "psychopath": {
  "label": "Psychopath",
  "weights": {
   "mode": {
    "bureau": 2.2,
    "tech": 1.9,
    "absurd": 1.4,
    "post": 1.3,
    "body": 1,
    "myth": 0.9
   },
   "structure": {
    "reverse": 1.9,
    "object": 1.7,
    "fragment": 1.4,
    "linear": 1.1,
    "circle": 1
   },
   "perspective": {
    "third": 2,
    "object": 1.8,
    "first": 1.2,
    "second": 1.1,
    "we": 0.9
   },
   "rhythm": {
    "clean": 2,
    "staccato": 1.6,
    "long": 1.1,
    "fracture": 1.1,
    "breath": 0.9
   }
  },
  "add": {
   "motifs": [
    "ein Protokoll ohne Gefühl",
    "eine Diagnose im Rand",
    "ein Experiment mit Namen",
    "eine Moral als Variable"
   ],
   "hooks": [
    "ein Befund ohne Ursache",
    "ein Blick wie Messung",
    "eine Akte, die kalt bleibt"
   ],
   "turns": [
    "die Erklärung wird zur Waffe",
    "das Subjekt wird Objekt",
    "die Empathie wird gestrichen"
   ],
   "obstacles": [
    "die Zuständigkeit ist unklar",
    "ein Beweis fehlt",
    "die Definition ist nicht abschließend"
   ],
   "stakes": [
    "Der Einsatz ist Gültigkeit.",
    "Der Einsatz ist Kontrolle: über Bedeutung.",
    "Der Einsatz ist Eindeutigkeit."
   ],
   "endings": [
    "Damit ist der Vorgang abgeschlossen.",
    "Und der Befund blieb bestehen.",
    "Und niemand musste fühlen."
   ]
  },
  "speakers": [
   "Der Gutachter",
   "Das Protokoll",
   "Die Instanz",
   "Der Operator",
   "Die Akte"
  ]
 },
 "entdecker": {
  "label": "Entdecker",
  "weights": {
   "mode": {
    "myth": 2.1,
    "mystery": 0,
    "tech": 1.4,
    "absurd": 1.3,
    "body": 1.1,
    "bureau": 1,
    "post": 1
   },
   "structure": {
    "fragment": 1.8,
    "linear": 1.6,
    "circle": 1.3,
    "object": 1.2,
    "reverse": 1
   },
   "perspective": {
    "first": 1.7,
    "we": 1.6,
    "second": 1.2,
    "third": 1.1,
    "object": 1
   },
   "rhythm": {
    "long": 1.8,
    "breath": 1.4,
    "fracture": 1.2,
    "clean": 1,
    "staccato": 0.9
   }
  },
  "add": {
   "motifs": [
    "eine Karte, die weiterführt",
    "ein Rand, der ruft",
    "eine Tür hinter der Tür",
    "ein Zeichen, das Richtung hat"
   ],
   "hooks": [
    "eine Spur im Staub",
    "ein Lichtstreifen im Wasser",
    "eine Kante, die einlädt"
   ],
   "turns": [
    "der Ausgang ist innen",
    "die Spur führt nach innen",
    "die Richtung wird zum Gesetz"
   ],
   "obstacles": [
    "der Weg verschiebt sich",
    "die Karte widerspricht sich",
    "die Tür ist da, aber anders"
   ],
   "stakes": [
    "Der Einsatz ist Mut.",
    "Der Einsatz ist Richtung.",
    "Der Einsatz ist Entdeckung."
   ],
   "endings": [
    "Und du gingst weiter.",
    "Und der Ort öffnete sich.",
    "Und die Richtung blieb."
   ]
  },
  "speakers": [
   "Die Karte",
   "Der Weg",
   "Die Tür",
   "Der Rand",
   "Das Zeichen"
  ]
 }
};
