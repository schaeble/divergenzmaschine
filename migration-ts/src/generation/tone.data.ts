import type { ToneData } from "../types";

// Ton-Färbung: ein Eröffnungssatz + einige verteilte Einschübe. Pools bewusst
// groß gehalten, damit sich derselbe Ton über viele Generierungen nicht wiederholt.
export const TONE_DATA: Record<string, ToneData> = {
  "neutral": { "opener": [], "flavor": [] },

  "mystery": {
    "opener": [
      "Was jetzt folgt, lässt sich nicht ganz erklären.",
      "Manches davon ergibt erst im Nachhinein einen Sinn.",
      "Von Anfang an fehlte ein Teil des Bildes.",
      "Später würde niemand sagen können, wann es genau begann.",
      "Es gab eine Version der Geschichte, und dann die wahre.",
      "Irgendetwas stimmte nicht, lange bevor es jemand bemerkte.",
      "Die Wahrheit lag näher, als alle glaubten - und tiefer."
    ],
    "flavor": [
      "Etwas darin blieb bewusst unausgesprochen.",
      "Nicht alles ließ sich erklären, so sehr man es auch versuchte.",
      "Eine Frage schwang mit, die niemand laut zu stellen wagte.",
      "Es war, als fehlte ein ganzes Kapitel der Geschichte.",
      "Irgendjemand wusste offensichtlich mehr, als er zugab.",
      "Die Erklärung dafür kam nie - oder war schlimmer als das Rätsel selbst.",
      "Ein Detail passte nicht, und genau daran hing alles.",
      "Was fehlte, war lauter als das, was gesagt wurde.",
      "Jede Antwort öffnete zwei neue Türen.",
      "Man ahnte, dass die Spur im Kreis führte.",
      "Zwischen den Zeilen wartete eine zweite Geschichte.",
      "Niemand hatte den Anfang gesehen, nur die Folgen."
    ]
  },

  "poetic": {
    "opener": [
      "Manche Dinge lassen sich nur in Bildern erzählen.",
      "Es beginnt, wie Erinnerungen beginnen: unscharf und zu hell.",
      "Alles daran hatte den Klang von etwas Vergangenem.",
      "Es war einer jener Momente, die länger dauern als ihre Minute.",
      "Das Licht fiel so, dass Worte fast überflüssig wurden.",
      "Vielleicht war es weniger ein Ereignis als ein Nachhall."
    ],
    "flavor": [
      "Die Worte dafür kamen, wenn überhaupt, erst viel später.",
      "Alles darin klang wie die Erinnerung an etwas Größeres.",
      "Selbst die Stille schien an diesem Ort eine Farbe zu haben.",
      "Es fühlte sich an wie ein halb vergessenes Gedicht, das jemand zu Ende träumt.",
      "Zwischen den Sätzen lag mehr als in ihnen.",
      "Wie ein Bild, das länger nachwirkt als die Geschichte dazu.",
      "Die Zeit floss hier langsamer, fast wie Honig im Winter.",
      "Jede Bewegung hinterließ eine Spur aus Licht.",
      "Es war schön auf die Weise, die auch wehtut.",
      "Man hörte die Dinge atmen, wenn man still genug war.",
      "Die Ränder der Welt schienen kurz weicher zu werden.",
      "Ein Duft von etwas, das es so nie gegeben hatte."
    ]
  },

  "melancholisch": {
    "opener": [
      "Es lag eine leise Traurigkeit über allem, ganz ohne Grund.",
      "Was bleibt, ist selten das, was man behalten wollte.",
      "Manches endet, lange bevor man es merkt.",
      "Es war die Art von Nachmittag, an dem alles ein wenig verblasst.",
      "Irgendwo darin steckte ein Abschied, den keiner ausgesprochen hatte.",
      "Später würde man sich an diesen Tag erinnern, ohne zu wissen, warum."
    ],
    "flavor": [
      "Etwas darin fühlte sich an wie das Ende eines langen Sommers.",
      "Man vermisste etwas, ohne benennen zu können, was.",
      "Die Dinge hatten den sanften Glanz des Vergänglichen.",
      "Es war weniger Schmerz als eine ruhige, alte Wehmut.",
      "Alles blieb - nur nicht so, wie es einmal gewesen war.",
      "Ein Teil davon war schon Erinnerung, während es noch geschah.",
      "Die Freude kam mit einem feinen Riss darin.",
      "Man wusste, dass man diesen Moment später vermissen würde.",
      "Selbst das Licht schien sich langsam zu verabschieden.",
      "Es war schön gewesen, und genau das machte es schwer."
    ]
  },

  "dark": {
    "opener": [
      "Von der ersten Sekunde an fühlte sich hier nichts richtig an.",
      "Es begann leise - so, wie das Schlimmste meistens beginnt.",
      "Manche Orte warten nur darauf, dass jemand kommt.",
      "Es gab keinen Ausweg, nur die Illusion davon.",
      "Was folgte, hätte niemand aufhalten können.",
      "Die Dunkelheit hier war älter als das Haus, das sie barg."
    ],
    "flavor": [
      "Nichts daran fühlte sich je wirklich sicher an.",
      "Etwas darin roch unverkennbar nach Verlust.",
      "Die Kälte blieb, auch als längst niemand mehr hinsah.",
      "Es war die Art von Stille, die etwas Schlimmeres ankündigt.",
      "Irgendwo darunter wartete bereits das nächste Unglück.",
      "Kein Trost weit und breit - nur die Gewissheit, dass es schlimmer werden würde.",
      "Jeder Ausweg führte nur tiefer hinein.",
      "Etwas beobachtete, ohne je gesehen zu werden.",
      "Die Hoffnung war das Erste, was hier starb.",
      "Man spürte, dass die Wände zuhörten.",
      "Es war zu spät, schon bevor es begann.",
      "Selbst das Schweigen hatte hier Zähne."
    ]
  },

  "unheimlich": {
    "opener": [
      "Alles wirkte vertraut, und genau das war das Problem.",
      "Irgendetwas war anders, aber man konnte nicht sagen, was.",
      "Die Dinge standen zu still, um natürlich zu sein.",
      "Es war, als hätte jemand die Welt fast, aber nicht ganz richtig nachgebaut.",
      "Man hatte das Gefühl, nicht allein zu sein - ohne Beweis dafür.",
      "Etwas stimmte mit den Schatten nicht."
    ],
    "flavor": [
      "Die Spiegel schienen einen Sekundenbruchteil zu spät zu reagieren.",
      "Ein Geräusch, das nur existierte, wenn man nicht hinhörte.",
      "Die Gesichter waren richtig, nur das Lächeln saß falsch.",
      "Etwas zählte mit, jedes Mal, wenn man die Tür schloss.",
      "Die Uhr ging, aber die Zeit stand.",
      "Man erkannte den Raum wieder, ohne je dort gewesen zu sein.",
      "Die Stille hatte eine Form, und sie kam näher.",
      "Irgendwo atmete etwas im Takt der eigenen Schritte.",
      "Ein Detail war zu viel im Bild, und keiner sah es an.",
      "Es fühlte sich an, als würde man erwartet."
    ]
  },

  "uplifting": {
    "opener": [
      "Und doch beginnt hier, allen Umständen zum Trotz, etwas Gutes.",
      "Selbst an diesem Ort ließ sich noch Hoffnung finden.",
      "Manchmal reicht ein einziger Moment, um alles zu wenden.",
      "Es sah aussichtslos aus - und war es dann doch nicht.",
      "Irgendwo darin lag der Anfang von etwas Besserem.",
      "Gerade als alles verloren schien, kam das Licht zurück."
    ],
    "flavor": [
      "Und doch blieb, gegen jede Erwartung, ein Rest Hoffnung.",
      "Irgendetwas darin fühlte sich nach einem echten Neuanfang an.",
      "Es war, als würde sich gerade, ganz leise, etwas zum Guten wenden.",
      "Ein kleiner Trost blieb trotzdem - und manchmal reicht genau das.",
      "Selbst im Schwierigsten fand sich noch ein Grund zum Weitermachen.",
      "Am Ende zählte nicht der Verlust, sondern das, was blieb.",
      "Eine unerwartete Freundlichkeit veränderte alles.",
      "Zum ersten Mal seit Langem schien der Weg wieder offen.",
      "Es war schwer gewesen, aber es hatte sich gelohnt.",
      "Manchmal ist der Sturz nur der Anlauf.",
      "Etwas in ihr richtete sich wieder auf.",
      "Und plötzlich schien alles möglich."
    ]
  },

  "zaertlich": {
    "opener": [
      "Es geschah mit einer Behutsamkeit, die man kaum erwartet hätte.",
      "Manche Dinge muss man leise erzählen, sonst zerbrechen sie.",
      "Es war klein und warm und leicht zu übersehen.",
      "Zwischen ihnen lag eine Sanftheit, für die es kein Wort gab.",
      "Es begann mit einer Geste, die niemand sonst bemerkte.",
      "Alles daran war sacht, fast wie Atem im Schlaf."
    ],
    "flavor": [
      "Eine Hand, die blieb, obwohl sie gehen durfte.",
      "Es war die Sorte Nähe, die keine Worte braucht.",
      "Etwas darin passte auf einen auf, ganz unaufdringlich.",
      "Ein Lächeln, so leise, dass man es fast überhörte.",
      "Die Welt wurde für einen Moment weicher.",
      "Es war ein kleines Zärtlichsein, mitten im Lärm.",
      "Jemand hielt etwas Zerbrechliches, ohne es zu drücken.",
      "Wärme, die keine Gegenleistung wollte.",
      "Es fühlte sich an wie Ankommen.",
      "Ein Trost, der einfach nur dablieb."
    ]
  },

  "traeumerisch": {
    "opener": [
      "Es war schwer zu sagen, ob es geschah oder nur geträumt wurde.",
      "Die Ränder der Dinge waren an diesem Tag nicht ganz fest.",
      "Alles trieb ein wenig, wie Boote ohne Anker.",
      "Es fühlte sich an, als wäre man mitten in einem fremden Traum aufgewacht.",
      "Die Logik hatte hier Urlaub genommen.",
      "Zeit und Ort waren nur Vorschläge."
    ],
    "flavor": [
      "Die Dinge verwandelten sich, kaum dass man wegsah.",
      "Ein Zimmer wurde zum Meer, ohne dass es jemand störte.",
      "Die Schwerkraft schien Verhandlungssache zu sein.",
      "Man ging durch Türen, die es vorher nicht gegeben hatte.",
      "Farben rochen, und Geräusche hatten Gewicht.",
      "Alles ergab Sinn, solange man nicht genauer hinsah.",
      "Die Erinnerung lief der Gegenwart voraus.",
      "Ein Gedanke wurde Landschaft.",
      "Nichts stand fest, und nichts fiel.",
      "Es war schön und ungereimt wie ein Traum kurz vor dem Erwachen."
    ]
  },

  "nuechtern": {
    "opener": [
      "Der Reihe nach: Es geschah genau so, wie es hier steht.",
      "Ohne Umschweife - das ist, was passierte.",
      "Es gibt daran nichts zu beschönigen.",
      "Die Fakten waren übersichtlich, die Folgen weniger.",
      "Man muss es nicht ausschmücken, es genügt so.",
      "Kurz und ohne Pathos: So lag der Fall."
    ],
    "flavor": [
      "Mehr war dazu nicht zu sagen.",
      "Die Sache hatte eine klare Ursache und eine klare Folge.",
      "Es half nichts, es zu beschönigen.",
      "Alles Weitere ergab sich daraus von selbst.",
      "Nüchtern betrachtet, blieb wenig Raum für Zweifel.",
      "Die Lage war, was sie war.",
      "Man notierte es und ging weiter.",
      "Kein Drama, nur der nächste Schritt.",
      "So einfach, so unausweichlich.",
      "Am Ende zählten nur die Zahlen."
    ]
  },

  "ironisch": {
    "opener": [
      "Natürlich lief alles nach Plan - nur nicht nach diesem.",
      "Man ahnt schon, wie gut das ausgehen wird.",
      "Es war, mit Verlaub, eine glänzende Idee. Fast.",
      "Was hätte dabei schon schiefgehen können.",
      "Wie schön, dass wenigstens einer den Überblick behielt. Behauptete er.",
      "Der Plan war wasserdicht. Das Wasser fand trotzdem einen Weg."
    ],
    "flavor": [
      "Es lief exakt so gut, wie zu erwarten war.",
      "Ein voller Erfolg, wenn man die Ziele nachträglich anpasste.",
      "Zum Glück war ja jemand zuständig - nur nicht anwesend.",
      "Die Ironie daran entging allen Beteiligten.",
      "Man nannte es Strategie, um nicht Zufall sagen zu müssen.",
      "Selbstverständlich hatte niemand etwas geahnt. Angeblich.",
      "Ein Meisterwerk der Planung, rückwärts betrachtet.",
      "Alles unter Kontrolle, versicherte die Kontrolle.",
      "Bemerkenswert, wie zuverlässig das Unwahrscheinliche eintraf.",
      "Es hätte schlimmer kommen können. Kam es dann auch."
    ]
  },

  "humorous": {
    "opener": [
      "Es hätte ernst werden können - wurde es aber nicht ganz.",
      "Manche Geschichten sind einfach zu absurd, um nicht zu grinsen.",
      "Was folgt, ist mit Ansage albern.",
      "Es begann harmlos und entglitt dann auf komische Weise.",
      "Man sollte das nicht so ernst nehmen. Die Beteiligten taten es auch nicht.",
      "Vorweg: Niemand kam ernsthaft zu Schaden, nur die Würde."
    ],
    "flavor": [
      "Absurd genug, um fast schon wieder normal zu wirken.",
      "Selbst das Schicksal schien dabei kurz zu grinsen.",
      "Niemand hätte sich das so ausgedacht - und genau deshalb war es lustig.",
      "Es hatte, aller Dramatik zum Trotz, etwas unfreiwillig Komisches.",
      "Man hätte fast Popcorn gebraucht, so albern lief das gerade.",
      "Selbst die Beteiligten mussten sich das Lachen verkneifen.",
      "Es war ein Chaos, aber ein gut gelauntes.",
      "Die Peinlichkeit war beeindruckend gleichmütig.",
      "Am Ende lachten alle - manche sogar freiwillig.",
      "Der Ernst der Lage hatte sichtlich Feierabend."
    ]
  }
};
