import type { ToneData } from "../types";

// Ton-Färbung: ein Eröffnungssatz + einige verteilte Einschübe. Pools bewusst
// groß gehalten, damit sich derselbe Ton über viele Generierungen nicht wiederholt.
export const TONE_DATA: Record<string, ToneData> = {
  "neutral": { "opener": [], "flavor": [] },

  "mystery": {
    "opener": [
      "Was jetzt folgt, lässt sich nicht ganz erklären.",
      "Manches davon ergibt erst im Nachhinein einen Sinn.",
      "Von Anfang an fehlt ein Teil des Bildes.",
      "Später würde niemand sagen können, wann es genau begann.",
      "Es gibt eine Version der Geschichte, und dann die wahre.",
      "Irgendetwas stimmt nicht, lange bevor es jemand bemerkt.",
      "Die Wahrheit liegt näher, als alle glauben - und tiefer."
    ],
    "flavor": [
      "Etwas darin bleibt bewusst unausgesprochen.",
      "Nicht alles lässt sich erklären, so sehr man es auch versucht.",
      "Eine Frage schwingt mit, die niemand laut zu stellen wagt.",
      "Es ist, als fehle ein ganzes Kapitel der Geschichte.",
      "Irgendjemand weiß offensichtlich mehr, als er zugibt.",
      "Die Erklärung dafür kommt nie - oder ist schlimmer als das Rätsel selbst.",
      "Ein Detail passt nicht, und genau daran hängt alles.",
      "Was fehlt, ist lauter als das, was gesagt wird.",
      "Jede Antwort öffnet zwei neue Türen.",
      "Man ahnt, dass die Spur im Kreis führt.",
      "Zwischen den Zeilen wartete eine zweite Geschichte.",
      "Niemand hat den Anfang gesehen, nur die Folgen."
    ]
  },

  "poetic": {
    "opener": [
      "Manche Dinge lassen sich nur in Bildern erzählen.",
      "Es beginnt, wie Erinnerungen beginnen: unscharf und zu hell.",
      "Alles daran hat den Klang von etwas Vergangenem.",
      "Es ist einer jener Momente, die länger dauern als ihre Minute.",
      "Das Licht fällt so, dass Worte fast überflüssig werden.",
      "Vielleicht ist es weniger ein Ereignis als ein Nachhall."
    ],
    "flavor": [
      "Die Worte dafür kommen, wenn überhaupt, erst viel später.",
      "Alles darin klingt wie die Erinnerung an etwas Größeres.",
      "Selbst die Stille schien an diesem Ort eine Farbe zu haben.",
      "Es fühlt sich an wie ein halb vergessenes Gedicht, das jemand zu Ende träumt.",
      "Zwischen den Sätzen liegt mehr als in ihnen.",
      "Wie ein Bild, das länger nachwirkt als die Geschichte dazu.",
      "Die Zeit fließt hier langsamer, fast wie Honig im Winter.",
      "Jede Bewegung hinterließ eine Spur aus Licht.",
      "Es ist schön auf die Weise, die auch wehtut.",
      "Man hört die Dinge atmen, wenn man still genug ist.",
      "Die Ränder der Welt schienen kurz weicher zu werden.",
      "Ein Duft von etwas, das es so nie gegeben hat."
    ]
  },

  "melancholisch": {
    "opener": [
      "Es liegt eine leise Traurigkeit über allem, ganz ohne Grund.",
      "Was bleibt, ist selten das, was man behalten wollte.",
      "Manches endet, lange bevor man es merkt.",
      "Es ist die Art von Nachmittag, an dem alles ein wenig verblasst.",
      "Irgendwo darin steckt ein Abschied, den keiner ausgesprochen hat.",
      "Später würde man sich an diesen Tag erinnern, ohne zu wissen, warum."
    ],
    "flavor": [
      "Etwas darin fühlt sich an wie das Ende eines langen Sommers.",
      "Man vermisste etwas, ohne benennen zu können, was.",
      "Die Dinge haben den sanften Glanz des Vergänglichen.",
      "Es ist weniger Schmerz als eine ruhige, alte Wehmut.",
      "Alles bleibt - nur nicht so, wie es einmal gewesen ist.",
      "Ein Teil davon ist schon Erinnerung, während es noch geschieht.",
      "Die Freude kommt mit einem feinen Riss darin.",
      "Man weiß, dass man diesen Moment später vermissen wird.",
      "Selbst das Licht scheint sich langsam zu verabschieden.",
      "Es ist schön, und genau das macht es schwer."
    ]
  },

  "dark": {
    "opener": [
      "Von der ersten Sekunde an fühlte sich hier nichts richtig an.",
      "Es begann leise - so, wie das Schlimmste meistens beginnt.",
      "Manche Orte warten nur darauf, dass jemand kommt.",
      "Es gibt keinen Ausweg, nur die Illusion davon.",
      "Was folgte, hätte niemand aufhalten können.",
      "Die Dunkelheit hier ist älter als das Haus, das sie birgt."
    ],
    "flavor": [
      "Nichts daran fühlt sich je wirklich sicher an.",
      "Etwas darin roch unverkennbar nach Verlust.",
      "Die Kälte bleibt, auch wenn längst niemand mehr hinsieht.",
      "Es ist die Art von Stille, die etwas Schlimmeres ankündigt.",
      "Irgendwo darunter wartete bereits das nächste Unglück.",
      "Kein Trost weit und breit - nur die Gewissheit, dass es schlimmer werden würde.",
      "Jeder Ausweg führt nur tiefer hinein.",
      "Etwas beobachtete, ohne je gesehen zu werden.",
      "Die Hoffnung ist das Erste, was hier stirbt.",
      "Man spürt, dass die Wände zuhören.",
      "Es ist zu spät, schon bevor es beginnt.",
      "Selbst das Schweigen hat hier Zähne."
    ]
  },

  "unheimlich": {
    "opener": [
      "Alles wirkt vertraut, und genau das ist das Problem.",
      "Irgendetwas ist anders, aber man kann nicht sagen, was.",
      "Die Dinge stehen zu still, um natürlich zu sein.",
      "Es ist, als hätte jemand die Welt fast, aber nicht ganz richtig nachgebaut.",
      "Man hat das Gefühl, nicht allein zu sein - ohne Beweis dafür.",
      "Etwas stimmt mit den Schatten nicht."
    ],
    "flavor": [
      "Die Spiegel scheinen einen Sekundenbruchteil zu spät zu reagieren.",
      "Ein Geräusch, das nur existiert, wenn man nicht hinhört.",
      "Die Gesichter sind richtig, nur das Lächeln sitzt falsch.",
      "Etwas zählt mit, jedes Mal, wenn man die Tür schließt.",
      "Die Uhr geht, aber die Zeit steht.",
      "Man erkennt den Raum wieder, ohne je dort gewesen zu sein.",
      "Die Stille hat eine Form, und sie kommt näher.",
      "Irgendwo atmet etwas im Takt der eigenen Schritte.",
      "Ein Detail ist zu viel im Bild, und keiner sieht es an.",
      "Es fühlt sich an, als würde man erwartet."
    ]
  },

  "uplifting": {
    "opener": [
      "Und doch beginnt hier, allen Umständen zum Trotz, etwas Gutes.",
      "Selbst an diesem Ort lässt sich noch Hoffnung finden.",
      "Manchmal reicht ein einziger Moment, um alles zu wenden.",
      "Es sieht aussichtslos aus - und ist es dann doch nicht.",
      "Irgendwo darin liegt der Anfang von etwas Besserem.",
      "Gerade wenn alles verloren scheint, kommt das Licht zurück."
    ],
    "flavor": [
      "Und doch bleibt, gegen jede Erwartung, ein Rest Hoffnung.",
      "Irgendetwas darin fühlte sich nach einem echten Neuanfang an.",
      "Es ist, als würde sich gerade, ganz leise, etwas zum Guten wenden.",
      "Ein kleiner Trost bleibt trotzdem - und manchmal reicht genau das.",
      "Selbst im Schwierigsten findet sich noch ein Grund zum Weitermachen.",
      "Am Ende zählt nicht der Verlust, sondern das, was bleibt.",
      "Eine unerwartete Freundlichkeit veränderte alles.",
      "Zum ersten Mal seit Langem scheint der Weg wieder offen.",
      "Es ist schwer, aber es lohnt sich.",
      "Manchmal ist der Sturz nur der Anlauf.",
      "Etwas darin richtet sich wieder auf.",
      "Und plötzlich scheint alles möglich."
    ]
  },

  "zaertlich": {
    "opener": [
      "Es geschieht mit einer Behutsamkeit, die man kaum erwarten würde.",
      "Manche Dinge muss man leise erzählen, sonst zerbrechen sie.",
      "Es ist klein und warm und leicht zu übersehen.",
      "Zwischen ihnen liegt eine Sanftheit, für die es kein Wort gibt.",
      "Es beginnt mit einer Geste, die niemand sonst bemerkt.",
      "Alles daran ist sacht, fast wie Atem im Schlaf."
    ],
    "flavor": [
      "Eine Hand, die blieb, obwohl sie gehen durfte.",
      "Es ist die Sorte Nähe, die keine Worte braucht.",
      "Etwas darin passt auf einen auf, ganz unaufdringlich.",
      "Ein Lächeln, so leise, dass man es fast überhört.",
      "Die Welt wird für einen Moment weicher.",
      "Es ist ein kleines Zärtlichsein, mitten im Lärm.",
      "Jemand hält etwas Zerbrechliches, ohne es zu drücken.",
      "Wärme, die keine Gegenleistung will.",
      "Es fühlt sich an wie Ankommen.",
      "Ein Trost, der einfach nur dablieb."
    ]
  },

  "traeumerisch": {
    "opener": [
      "Es ist schwer zu sagen, ob es geschieht oder nur geträumt wird.",
      "Die Ränder der Dinge sind an diesem Tag nicht ganz fest.",
      "Alles treibt ein wenig, wie Boote ohne Anker.",
      "Es fühlt sich an, als wäre man mitten in einem fremden Traum aufgewacht.",
      "Die Logik hat hier Urlaub genommen.",
      "Zeit und Ort sind nur Vorschläge."
    ],
    "flavor": [
      "Die Dinge verwandeln sich, kaum dass man wegsieht.",
      "Ein Zimmer wird zum Meer, ohne dass es jemand stört.",
      "Die Schwerkraft scheint Verhandlungssache zu sein.",
      "Man geht durch Türen, die es vorher nicht gegeben hat.",
      "Farben riechen, und Geräusche haben Gewicht.",
      "Alles ergab Sinn, solange man nicht genauer hinsah.",
      "Die Erinnerung läuft der Gegenwart voraus.",
      "Ein Gedanke wird Landschaft.",
      "Nichts steht fest, und nichts fällt.",
      "Es ist schön und ungereimt wie ein Traum kurz vor dem Erwachen."
    ]
  },

  "nuechtern": {
    "opener": [
      "Der Reihe nach: Es geschah genau so, wie es hier steht.",
      "Ohne Umschweife - das ist, was passierte.",
      "Es gibt daran nichts zu beschönigen.",
      "Die Fakten sind übersichtlich, die Folgen weniger.",
      "Man muss es nicht ausschmücken, es genügt so.",
      "Kurz und ohne Pathos: So liegt der Fall."
    ],
    "flavor": [
      "Mehr ist dazu nicht zu sagen.",
      "Die Sache hat eine klare Ursache und eine klare Folge.",
      "Es hilft nichts, es zu beschönigen.",
      "Alles Weitere ergab sich daraus von selbst.",
      "Nüchtern betrachtet, bleibt wenig Raum für Zweifel.",
      "Die Lage ist, was sie ist.",
      "Man notiert es und geht weiter.",
      "Kein Drama, nur der nächste Schritt.",
      "So einfach, so unausweichlich.",
      "Am Ende zählen nur die Zahlen."
    ]
  },

  "ironisch": {
    "opener": [
      "Natürlich läuft alles nach Plan - nur nicht nach diesem.",
      "Man ahnt schon, wie gut das ausgehen wird.",
      "Es ist, mit Verlaub, eine glänzende Idee. Fast.",
      "Was hätte dabei schon schiefgehen können.",
      "Wie schön, dass wenigstens einer den Überblick behielt. Behauptete er.",
      "Der Plan ist wasserdicht. Das Wasser findet trotzdem einen Weg."
    ],
    "flavor": [
      "Es läuft exakt so gut, wie zu erwarten ist.",
      "Ein voller Erfolg, wenn man die Ziele nachträglich anpasst.",
      "Zum Glück ist ja jemand zuständig - nur nicht anwesend.",
      "Die Ironie daran entging allen Beteiligten.",
      "Man nannte es Strategie, um nicht Zufall sagen zu müssen.",
      "Selbstverständlich hat niemand etwas geahnt. Angeblich.",
      "Ein Meisterwerk der Planung, rückwärts betrachtet.",
      "Alles unter Kontrolle, versichert die Kontrolle.",
      "Bemerkenswert, wie zuverlässig das Unwahrscheinliche eintraf.",
      "Es hätte schlimmer kommen können. Kam es dann auch."
    ]
  },

  "humorous": {
    "opener": [
      "Es hätte ernst werden können - wurde es aber nicht ganz.",
      "Manche Geschichten sind einfach zu absurd, um nicht zu grinsen.",
      "Was folgt, ist mit Ansage albern.",
      "Es beginnt harmlos und entgleitet dann auf komische Weise.",
      "Man sollte das nicht so ernst nehmen. Die Beteiligten taten es auch nicht.",
      "Vorweg: Niemand kommt ernsthaft zu Schaden, nur die Würde."
    ],
    "flavor": [
      "Absurd genug, um fast schon wieder normal zu wirken.",
      "Selbst das Schicksal scheint dabei kurz zu grinsen.",
      "Niemand würde sich das so ausdenken - und genau deshalb ist es lustig.",
      "Es hat, aller Dramatik zum Trotz, etwas unfreiwillig Komisches.",
      "Man bräuchte fast Popcorn, so albern läuft das gerade.",
      "Selbst die Beteiligten müssen sich das Lachen verkneifen.",
      "Es ist ein Chaos, aber ein gut gelauntes.",
      "Die Peinlichkeit ist beeindruckend gleichmütig.",
      "Am Ende lachen alle - manche sogar freiwillig.",
      "Der Ernst der Lage hat sichtlich Feierabend."
    ]
  }
};
