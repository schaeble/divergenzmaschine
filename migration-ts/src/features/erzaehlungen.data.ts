// Zehn eingebaute Erzählungen für die Erzählerbank — jede mit einem anderen
// Bogen. Sie füllen auf Wunsch die leeren Plätze („Vorlagen einsetzen") und
// sind so geschrieben, dass die Ableitung (preset2AusText) je Geschichte
// einen anders gewichteten Bogen zieht: wo die Wenden sitzen, wie der Schluss
// sich zum Anfang verhält, ob die Spannung steigt, kreist oder verweigert
// wird. Die Titel nennen die Bauform, damit die Wahl im Studio sprechend ist.
import type { Erzaehlung } from "./erzaehlerbank";

export const ERZAEHLUNGEN_VORLAGEN: Erzaehlung[] = [
  {
    titel: "Steigender Bogen",
    text: "Der Fährmann zählt am Morgen die Ruder. Ein Riemen fehlt. Das Wasser steht still wie ein Gedanke. Die erste Fuhre geht gut, die zweite auch. Ein Passagier lässt eine Münze fallen, die niemand aufhebt. Der Wind dreht gegen Mittag. Die Strömung zieht stärker als sonst. Es geht um die letzte Überfahrt des Tages. Der Fährmann spürt das Seil in den Händen arbeiten. Aber das andere Ufer rückt nicht näher. Die Glocke am Steg schlägt von allein. Dann reißt die Halterung, und die Fähre dreht sich aus der Linie. Plötzlich kippt der Nachmittag ins Dunkle. Die Passagiere schweigen in einer Reihe. Der Fährmann bindet das Seil um den eigenen Arm. Die Fähre erreicht das Ufer schräg und zu spät. Am Ende fehlt eine Münze, und niemand fehlt. Zurück bleibt ein Riemen, der am nächsten Morgen wieder da ist."
  },
  {
    titel: "Kreisschluss",
    text: "Eine Frau kehrt in das Haus ihrer Kindheit zurück und findet die Tür offen. Ein Flur voller Mäntel, die niemandem gehören. Der Geruch von Bohnerwachs und Winter. Sie stellt den Koffer an die Stelle, an der er immer stand. Die Uhr in der Küche geht sieben Minuten vor, wie damals. Ein Fenster, das sich nur von innen öffnen lässt. Es geht um das, was bleibt, wenn man geht. Die Nachbarin grüßt mit dem Namen der Mutter. Aber die Treppe knarrt an einer neuen Stelle. Dann findet sie im Schrank ihren eigenen Kindermantel, frisch gebürstet. Die Zimmer werden kleiner, je länger sie bleibt. Plötzlich versteht sie, dass das Haus sie erwartet hat. Sie öffnet alle Fenster von innen. Am Ende stellt sie den Koffer wieder in den Flur und lässt die Tür offen. Zurück bleibt ein Haus, das auf die Nächste wartet."
  },
  {
    titel: "Rückwärts erzählt",
    text: "Am Ende liegt der Brief ungeöffnet im Fluss. Davor steht ein Mann eine Stunde auf der Brücke. Ein Umschlag mit einem fremden Poststempel. Die Hände sind ruhiger, als sie sein dürften. Davor kauft er am Kiosk eine Zeitung, die er nicht liest. Der Kiosk verkauft an diesem Tag nur an ihn. Es geht um eine Nachricht, die alles ordnen würde. Davor wartet er drei Tage neben dem Briefkasten. Aber der Briefkasten bleibt drei Tage leer. Dann kommt der Brief am vierten Tag, zu früh am Morgen. Ein Absender ohne Namen, eine Schrift wie seine eigene. Plötzlich weiß er, was darin steht, ohne zu öffnen. Davor, ganz am Anfang, schreibt jemand in einer anderen Stadt eine einzige Zeile. Die Zeile lautet: Komm nicht. Zurück bleibt ein Fluss, der Briefe kennt."
  },
  {
    titel: "Retardation — die falsche Entwarnung",
    text: "Im Bergwerk riecht es seit Tagen nach kaltem Rauch. Eine Lampe, die zweimal flackert. Der Steiger klopft die Wände ab und nickt. Die Messung zeigt nichts, die zweite auch nichts. Ein Kanarienvogel singt lauter als sonst. Die Schicht arbeitet weiter, beruhigt und schneller. Es geht um den tiefsten Stollen der Grube. Aber der Geruch kehrt hinter der Entwarnung zurück. Ein Hut voller Staub vom Firstholz. Die dritte Messung fällt aus, weil das Gerät schweigt. Dann knackt das Holz in einer Sprache, die alle kennen. Der Steiger hebt die Hand, und die Lampen gehen aus. Plötzlich läuft die Schicht in vollkommener Ordnung rückwärts. Der Berg lässt sie gehen, einen nach dem anderen. Am Ende zählt der Steiger am Tageslicht die Helme. Die Zahl stimmt, und niemand spricht sie aus. Zurück bleibt ein Vogel, der im Dunkeln weitersingt."
  },
  {
    titel: "Doppelte Wende",
    text: "Die Schachspielerin erkennt die Falle im siebten Zug. Ein Springer am Rand, scheinbar vergessen. Sie lehnt das Opfer ab und steht besser. Der Saal atmet mit den Uhren. Es geht um die Partie ihres Lebens. Der Gegner lächelt, als hätte er das erwartet. Dann opfert er die Dame, und das Brett kippt. Plötzlich ist ihr Vorteil eine Grube. Aber in der Grube liegt ein zweiter Weg, den keiner sah. Ein Bauer, der seit dem ersten Zug wartet. Sie gibt den Turm und dann den zweiten Turm. Der Saal versteht nichts und wird still. Dann wendet sich die Partie zum zweiten Mal. Der Bauer geht seinen letzten Schritt und wird alles. Am Ende reicht der Gegner die Hand über ein leeres Brett. Zurück bleibt ein Springer am Rand, unberührt bis zuletzt."
  },
  {
    titel: "Stiller Bogen — nichts passiert, alles ändert sich",
    text: "Der Leuchtturmwärter hat seit Wochen kein Schiff gesehen. Eine Kanne Tee für einen Menschen. Das Licht dreht sich, ob jemand fährt oder nicht. Er streicht das Geländer, das niemand anfasst. Eine Liste der Stürme, sauber geführt. Das Meer bleibt höflich und fern. Es geht um das Warten selbst. Aber die Vorräte rechnen mit einem zweiten Menschen. Der Funk sagt jeden Abend dasselbe Rauschen. Dann bleibt eines Nachts das Rauschen aus. Nichts geschieht, und nichts geschieht sehr laut. Der Wärter deckt den Tisch für zwei und lacht nicht. Plötzlich versteht er das Licht als Frage. Er beantwortet sie, indem er bleibt. Am Ende fährt kein Schiff vorbei, und es genügt. Zurück bleibt eine zweite Tasse, gewärmt und leer."
  },
  {
    titel: "Eskalation in drei Stufen",
    text: "Am ersten Tag fehlt dem Dorf ein Brunnen. Die Leute holen Wasser vom Bach und lachen darüber. Ein Eimer mit neuem Seil. Am zweiten Tag fehlt dem Dorf der Bach. Das Bett liegt trocken wie ein Sonntag. Die Leute graben und finden feuchten Sand. Es geht um das Wasser und um mehr als das Wasser. Ein Maulwurf flieht in die falsche Richtung. Aber der Regen zieht am Dorf vorbei, dreimal hintereinander. Am dritten Tag fehlt dem Dorf der Himmel. Ein Grau ohne Wolken, ein Licht ohne Quelle. Dann öffnet die älteste Frau den versiegelten Keller. Plötzlich steht dort Wasser bis zur dritten Stufe. Das Dorf trinkt und fragt erst danach. Am Ende kehrt der Bach zurück, als wäre er beleidigt gewesen. Zurück bleibt ein Keller, den keiner mehr versiegelt."
  },
  {
    titel: "Katastrophe zuerst",
    text: "Das Feuer ist am Morgen schon vorbei. Ein Dachstuhl wie ein schwarzes Geweih. Die Bewohner stehen im Garten und halten Tassen. Niemand fehlt, das ist das Erste. Es geht um das, was nach dem Ende beginnt. Der Kater kehrt rußig zurück und wird gefeiert. Aber die Papiere sind Asche, alle Namen darin. Ein Nachbar bringt Brot, ein anderer eine Leiter. Die Versicherung schickt einen Mann mit sauberen Schuhen. Dann findet das Kind im Schutt die eiserne Kassette. Plötzlich ist der Schlüssel wichtiger als das Haus. Die Kassette öffnet sich mit dem zweitältesten Schlüssel. Darin liegt kein Geld, sondern eine Liste der Nachbarn von 1911. Die Familie liest die Namen laut in den Garten. Am Ende bauen dieselben Namen das Dach neu. Zurück bleibt ein Geruch, der nach zwei Wintern geht."
  },
  {
    titel: "Zwei Stränge, ein Treffpunkt",
    text: "Die Botin nimmt den Weg über den Pass, weil die Brücke gesperrt ist. Ein Paket, das nicht klappern darf. Im Tal packt der Uhrmacher seine Werkstatt in vier Kisten. Eine Wand voller stehender Uhren. Die Botin teilt ihr Brot mit einem Hund, der den Weg kennt. Der Uhrmacher verschenkt die Uhren, die niemand abholte. Es geht um eine Lieferung und einen Abschied. Aber der Pass schließt hinter der Botin im Schnee. Der Hund geht voraus, als hätte er den Auftrag. Dann stehen beide zur selben Stunde am selben Tor. Das Paket enthält eine einzige Unruh, klein wie ein Same. Plötzlich schlägt die Wand der stehenden Uhren an. Der Uhrmacher packt die Kisten wieder aus. Am Ende bleibt die Werkstatt, und die Botin bleibt den Winter. Zurück bleibt ein Hund, der zwei Herren dient."
  },
  {
    titel: "Offenes Ende — die Schwebe",
    text: "Auf dem Bahnsteig steht ein Koffer ohne Besitzer. Die Ansage nennt einen Zug, den der Plan nicht kennt. Eine Frau setzt sich neben den Koffer, als gehöre sie dazu. Der Abend riecht nach Eisen und Regen. Es geht um eine Entscheidung, die noch niemand getroffen hat. Ein Schaffner geht vorbei und grüßt den Koffer. Aber der angekündigte Zug fährt auf keinem Gleis ein. Die Uhr über dem Bahnsteig verliert eine Minute. Dann öffnet die Frau den Koffer einen Fingerbreit. Ein Licht fällt heraus, das zu keiner Lampe gehört. Plötzlich stehen mehr Menschen auf dem Bahnsteig, als gekommen sind. Alle sehen auf das Gleis, keiner auf den Koffer. Die Ansage wiederholt sich, freundlicher als zuvor. Am Ende fährt etwas ein, das man nicht beschreiben kann. Ob die Frau einsteigt, weiß der Bahnsteig allein."
  },
];
