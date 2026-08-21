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
      "Die Wahrheit liegt näher, als alle glauben - und tiefer.",
      "Der Anfang liegt weiter zurück, als es den Anschein hat.",
      "Was hier steht, ist die zweitbeste Erklärung.",
      "Niemand hat es kommen sehen, und alle wussten es.",
      "Es beginnt mit einer Zahl, die nicht stimmt.",
      "Zwei Zeugen, zwei Geschichten, ein Abend.",
      "Am Ende fehlt genau ein Satz."
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
      "Niemand hat den Anfang gesehen, nur die Folgen.",
      "Ein Name fällt zu oft, um zufällig zu sein.",
      "Die Reihenfolge stimmt, die Uhrzeit nicht.",
      "Wer zuhört, hört zwei Dinge gleichzeitig.",
      "Ein Zeuge widerspricht sich freundlich.",
      "Etwas wurde weggeräumt, bevor jemand fragte.",
      "Der kürzeste Weg wird nie genommen.",
      "Ein Zufall wiederholt sich und heißt dann anders.",
      "Es bleibt eine Tür, die niemand aufschließt."
    ]
  },

  "poetic": {
    "opener": [
      "Manche Dinge lassen sich nur in Bildern erzählen.",
      "Es beginnt, wie Erinnerungen beginnen: unscharf und zu hell.",
      "Alles daran hat den Klang von etwas Vergangenem.",
      "Es ist einer jener Momente, die länger dauern als ihre Minute.",
      "Das Licht fällt so, dass Worte fast überflüssig werden.",
      "Vielleicht ist es weniger ein Ereignis als ein Nachhall.",
      "Der Tag beginnt, als hätte er nichts vor.",
      "Zuerst ist da nur ein Geräusch, das nicht aufhört.",
      "Es ist eine Stunde ohne Namen.",
      "Das Licht steht schief und bleibt so.",
      "Zwischen zwei Atemzügen liegt der ganze Anfang.",
      "Alles hier ist zu leise für seine Größe."
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
      "Ein Duft von etwas, das es so nie gegeben hat.",
      "Das Licht bleibt an den Kanten hängen.",
      "Die Luft trägt weiter als der Ruf.",
      "Etwas Kleines behauptet sich gegen den Raum.",
      "Ein Schatten legt sich hin und bleibt.",
      "Die Farben werden langsamer als die Formen.",
      "Der Klang bleibt länger als sein Grund.",
      "Ein Rest Wärme steht noch im Türrahmen.",
      "Zwischen den Dingen wächst eine Stille an."
    ]
  },

  "melancholisch": {
    "opener": [
      "Es liegt eine leise Traurigkeit über allem, ganz ohne Grund.",
      "Was bleibt, ist selten das, was man behalten wollte.",
      "Manches endet, lange bevor man es merkt.",
      "Es ist die Art von Nachmittag, an dem alles ein wenig verblasst.",
      "Irgendwo darin steckt ein Abschied, den keiner ausgesprochen hat.",
      "Später würde man sich an diesen Tag erinnern, ohne zu wissen, warum.",
      "Es hätte auch anders kommen können, aber nicht sehr.",
      "Vieles davon ist schon vorbei, während es geschieht.",
      "Der Abschied hat lange vorher angefangen.",
      "Man merkt es erst, wenn es ruhiger wird.",
      "Was bleibt, ist kleiner als erwartet.",
      "Es ist ein Tag zum Aufräumen."
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
      "Es ist schön, und genau das macht es schwer.",
      "Was gewesen ist, nimmt mehr Platz ein als das Übrige.",
      "Ein Zimmer, das größer wurde, ohne zu wachsen.",
      "Die Gewohnheit bleibt, der Grund ist fort.",
      "Man legt es zurück, wo es nie hingehörte.",
      "Der zweite Stuhl steht weiter am Tisch.",
      "Es fehlt niemand, und doch ist es leer.",
      "Ein Satz bleibt unbeantwortet und stört nicht mehr.",
      "Die Jahreszeit wechselt schneller als der Blick."
    ]
  },

  "dark": {
    "opener": [
      "Von der ersten Sekunde an fühlte sich hier nichts richtig an.",
      "Es begann leise - so, wie das Schlimmste meistens beginnt.",
      "Manche Orte warten nur darauf, dass jemand kommt.",
      "Es gibt keinen Ausweg, nur die Illusion davon.",
      "Was folgte, hätte niemand aufhalten können.",
      "Die Dunkelheit hier ist älter als das Haus, das sie birgt.",
      "Nichts davon endet gut, und das ist bekannt.",
      "Es beginnt mit einer Rechnung, die offen bleibt.",
      "Die Sache war lange faul, bevor sie roch.",
      "Von hier führt kein Weg zurück, nur weiter.",
      "Jemand hat entschieden, und niemand hat gefragt.",
      "Der Preis stand von Anfang an fest."
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
      "Selbst das Schweigen hat hier Zähne.",
      "Was schützt, kostet mehr, als es hält.",
      "Der Ausweg ist verstellt, seit Wochen.",
      "Es wird kälter, wo vorher gewartet wurde.",
      "Der Schaden ist alt und trägt einen neuen Namen.",
      "Niemand meldet sich, und das ist die Antwort.",
      "Die Frist läuft, auch wenn niemand zählt.",
      "Was fehlt, wird nicht ersetzt.",
      "Am Ende bleibt jemand zurück, der nicht gemeint war."
    ]
  },

  "unheimlich": {
    "opener": [
      "Alles wirkt vertraut, und genau das ist das Problem.",
      "Irgendetwas ist anders, aber man kann nicht sagen, was.",
      "Die Dinge stehen zu still, um natürlich zu sein.",
      "Es ist, als hätte jemand die Welt fast, aber nicht ganz richtig nachgebaut.",
      "Man hat das Gefühl, nicht allein zu sein - ohne Beweis dafür.",
      "Etwas stimmt mit den Schatten nicht.",
      "Etwas ist verstellt worden, und niemand weiß von wem.",
      "Es riecht nach einem Raum, der lange zu war.",
      "Die Zahlen stimmen, die Stimmung nicht.",
      "Von draußen sieht alles gewöhnlich aus.",
      "Man sollte hier nicht stehen bleiben.",
      "Der Ort hat gewartet."
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
      "Es fühlt sich an, als würde man erwartet.",
      "Das Geräusch kommt von innen, nicht von der Straße.",
      "Etwas atmet mit, kaum hörbar.",
      "Der Boden gibt an einer Stelle nach.",
      "Zwei Türen führen in denselben Raum.",
      "Es wird still, sobald man hinsieht.",
      "Eine Uhr geht nach und niemand stellt sie.",
      "Der Abdruck passt zu keiner Hand.",
      "Was hier bleibt, war schon vorher da."
    ]
  },

  "uplifting": {
    "opener": [
      "Und doch beginnt hier, allen Umständen zum Trotz, etwas Gutes.",
      "Selbst an diesem Ort lässt sich noch Hoffnung finden.",
      "Manchmal reicht ein einziger Moment, um alles zu wenden.",
      "Es sieht aussichtslos aus - und ist es dann doch nicht.",
      "Irgendwo darin liegt der Anfang von etwas Besserem.",
      "Gerade wenn alles verloren scheint, kommt das Licht zurück.",
      "Es fängt klein an und bleibt nicht klein.",
      "Etwas geht auf, das lange gelegen hat.",
      "Der Tag hat mehr vor als gedacht.",
      "Einer fängt an, und dann sind es viele.",
      "Es gibt gute Gründe, heute zu bleiben.",
      "Der Anfang ist gemacht, mehr braucht es nicht."
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
      "Und plötzlich scheint alles möglich.",
      "Etwas löst sich, ohne dass jemand zieht.",
      "Zwei, die nichts verband, arbeiten zusammen.",
      "Der Weg wird breiter, je weiter man geht.",
      "Was fehlt, wird von selbst ergänzt.",
      "Der Raum füllt sich, ohne eng zu werden.",
      "Aus einer Zusage werden drei.",
      "Es reicht diesmal für alle.",
      "Der zweite Versuch gelingt leichter."
    ]
  },

  "zaertlich": {
    "opener": [
      "Es geschieht mit einer Behutsamkeit, die man kaum erwarten würde.",
      "Manche Dinge muss man leise erzählen, sonst zerbrechen sie.",
      "Es ist klein und warm und leicht zu übersehen.",
      "Zwischen ihnen liegt eine Sanftheit, für die es kein Wort gibt.",
      "Es beginnt mit einer Geste, die niemand sonst bemerkt.",
      "Alles daran ist sacht, fast wie Atem im Schlaf.",
      "Es wird niemand laut in dieser Geschichte.",
      "Jemand hält etwas fest, ohne zu drücken.",
      "Der Anfang ist so behutsam, dass man ihn übersieht.",
      "Es ist eine Stunde, in der nichts verlangt wird.",
      "Man macht Platz, bevor gefragt wird.",
      "Alles hier hat Zeit."
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
      "Ein Trost, der einfach nur dablieb.",
      "Eine Hand bleibt liegen, wo sie ist.",
      "Es wird leiser gesprochen als nötig.",
      "Jemand deckt zu, ohne zu wecken.",
      "Der Weg wird kürzer gemacht, ohne davon zu reden.",
      "Etwas Warmes bleibt stehen und wartet.",
      "Man reicht das Bessere weiter.",
      "Ein Name wird ausgesprochen wie eine Zusage.",
      "Es ist Platz genug für zwei Meinungen."
    ]
  },

  "traeumerisch": {
    "opener": [
      "Es ist schwer zu sagen, ob es geschieht oder nur geträumt wird.",
      "Die Ränder der Dinge sind an diesem Tag nicht ganz fest.",
      "Alles treibt ein wenig, wie Boote ohne Anker.",
      "Es fühlt sich an, als wäre man mitten in einem fremden Traum aufgewacht.",
      "Die Logik hat hier Urlaub genommen.",
      "Zeit und Ort sind nur Vorschläge.",
      "Die Reihenfolge ist hier nicht das Wichtigste.",
      "Es beginnt mittendrin, wie immer.",
      "Etwas geht auf, das keine Tür hat.",
      "Der Weg führt weiter, obwohl er endet.",
      "Zwei Orte fallen zusammen, ohne sich zu stören.",
      "Es ist später, als es sein dürfte."
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
      "Es ist schön und ungereimt wie ein Traum kurz vor dem Erwachen.",
      "Ein Raum öffnet sich, wo keiner war.",
      "Die Treppe führt zweimal nach oben.",
      "Etwas wiederholt sich mit anderem Ausgang.",
      "Der Weg kennt sein Ziel besser als der Gehende.",
      "Ein Fenster zeigt eine andere Jahreszeit.",
      "Die Entfernung ändert sich beim Hinsehen.",
      "Man kommt an, ohne gegangen zu sein.",
      "Etwas Bekanntes trägt einen fremden Namen."
    ]
  },

  "nuechtern": {
    "opener": [
      "Der Reihe nach: Es geschah genau so, wie es hier steht.",
      "Ohne Umschweife - das ist, was passierte.",
      "Es gibt daran nichts zu beschönigen.",
      "Die Fakten sind übersichtlich, die Folgen weniger.",
      "Man muss es nicht ausschmücken, es genügt so.",
      "Kurz und ohne Pathos: So liegt der Fall.",
      "Der Vorgang ist überschaubar.",
      "Es liegt eine Reihenfolge vor.",
      "Die Zuständigkeit ist geklärt.",
      "Der Rahmen steht, der Rest folgt.",
      "Es gibt dazu eine Akte.",
      "Die Sache ist erledigt, bis auf zwei Punkte."
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
      "Am Ende zählen nur die Zahlen.",
      "Der Vorgang ist abgelegt.",
      "Eine Frist wurde notiert.",
      "Zwei Angaben widersprechen sich geringfügig.",
      "Der Ablauf wurde eingehalten.",
      "Die Unterlagen liegen vollständig vor.",
      "Es bleibt bei der bisherigen Regelung.",
      "Der Fall wird weitergeleitet.",
      "Eine Rückmeldung steht noch aus."
    ]
  },

  "ironisch": {
    "opener": [
      "Natürlich läuft alles nach Plan - nur nicht nach diesem.",
      "Man ahnt schon, wie gut das ausgehen wird.",
      "Es ist, mit Verlaub, eine glänzende Idee. Fast.",
      "Was hätte dabei schon schiefgehen können.",
      "Wie schön, dass wenigstens einer den Überblick behielt. Behauptete er.",
      "Der Plan ist wasserdicht. Das Wasser findet trotzdem einen Weg.",
      "Es lief alles nach Plan, nur nicht nach diesem.",
      "Eine hervorragende Gelegenheit, es nicht zu tun.",
      "Man kann viel falsch machen, und man tut es.",
      "Der Anfang war gut gemeint.",
      "Zum Glück gibt es eine Zuständigkeit.",
      "Alles bestens, sagt jedenfalls das Formular."
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
      "Es hätte schlimmer kommen können. Kam es dann auch.",
      "Der Vorschlag wird gelobt und abgeheftet.",
      "Zuständig ist, wer gerade nicht da ist.",
      "Man einigt sich darauf, sich zu einigen.",
      "Die Lösung wartet auf ein passendes Problem.",
      "Ein Ausschuss beschäftigt sich damit, gründlich.",
      "Der kürzeste Weg wurde geprüft und verworfen.",
      "Es gibt jetzt ein Merkblatt dazu.",
      "Alle sind einverstanden, aber anders."
    ]
  },

  "humorous": {
    "opener": [
      "Es hätte ernst werden können - wurde es aber nicht ganz.",
      "Manche Geschichten sind einfach zu absurd, um nicht zu grinsen.",
      "Was folgt, ist mit Ansage albern.",
      "Es beginnt harmlos und entgleitet dann auf komische Weise.",
      "Man sollte das nicht so ernst nehmen. Die Beteiligten taten es auch nicht.",
      "Vorweg: Niemand kommt ernsthaft zu Schaden, nur die Würde.",
      "Es ging schief, aber mit Anlauf.",
      "Zwei Dinge fehlten: der Plan und der Rest.",
      "Man hätte es wissen können, wollte aber nicht.",
      "Der Anfang war schon das Beste daran.",
      "Es gab Kaffee, sonst nichts.",
      "Jemand hat das ernst gemeint."
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
      "Der Ernst der Lage hat sichtlich Feierabend.",
      "Der Zettel dazu ist unauffindbar, natürlich.",
      "Es fehlt genau das eine Teil.",
      "Zwei halten es für erledigt, drei nicht.",
      "Der Ersatz ist besser als das Original, leider.",
      "Es funktioniert, solange niemand hinsieht.",
      "Der Hund hat es gesehen und schweigt.",
      "Man einigt sich auf später.",
      "Ein Erfolg, wenn man nicht so genau hinschaut."
    ]
  }
};
