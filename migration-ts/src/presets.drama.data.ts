// Dramaturgie-Bögen für die eingebauten Presets — fest im Programm, nicht per KI.
//
// Warum hier und nicht über „Aktives Preset auf 2.0 heben“: Der KI-Weg erzeugt ein
// NUTZER-Preset gleichen Namens, also ein Duplikat im Lager, und kostet bei jedem
// Preset erneut. Was zur Standardausstattung gehört, gehört in den Quelltext.
//
// Feldformen (aus buildDramaturgie abgelesen, nicht geraten):
//   einstieg       Teilsatz → „⟨Einstieg⟩.“        z. B. „alles liegt an seinem Platz“
//   mitte          Teilsatz → „⟨Mitte⟩.“
//   hoehepunkt     Teilsatz → „Und dann: ⟨…⟩.“
//   konflikte      Nominalphrase → „Es geht um ⟨…⟩.“
//   ausloeser      Nominalphrase → „Dann, unvermittelt: ⟨…⟩.“
//   veraenderungen Teilsatz, läuft durch frameTurn
//   zeitanomalien  ganzer Satz
//   regeln         ganzer Satz
//   schluss        Stilwort; von buildDramaturgie derzeit nicht gelesen, für später
// Alles im Präsens, wie die Bank-Einträge.
import type { DramaData } from "./generation/dramaturgie";

const D = (
  einstieg: string[], mitte: string[], hoehepunkt: string[],
  konflikte: string[], ausloeser: string[], veraenderungen: string[],
  zeitanomalien: string[], regeln: string[], schluss: string[],
): DramaData => ({ einstieg, mitte, hoehepunkt, schluss, ausloeser, veraenderungen, konflikte, zeitanomalien, regeln });

export const BUILTIN_DRAMA: Record<string, DramaData> = {
  kafka: D(
    ["alles liegt an seinem Platz, und genau das beunruhigt", "die Formulare sind bereits ausgefüllt", "niemand hat die Tür geöffnet, sie stand offen"],
    ["die Zuständigkeit wandert von Zimmer zu Zimmer", "eine Auskunft widerspricht der vorigen, beide sind gültig", "der Gang verzweigt sich, jede Abzweigung führt zurück"],
    ["die Akte trägt den eigenen Namen", "das Verfahren war längst abgeschlossen"],
    ["eine Auskunft, die niemand gibt", "eine Frist ohne Anfang", "eine Schuld ohne Anklage"],
    ["ein Bescheid ohne Absender", "eine Unterschrift, die niemand leisten kann", "ein Stempel auf dem falschen Blatt"],
    ["die Zuständigkeit wechselt", "der Vorgang beginnt von vorn", "die Frage verwandelt sich in ihre Antwort"],
    ["Die Frist läuft rückwärts.", "Der Termin liegt bereits hinter dem Antrag."],
    ["Wer fragt, bekommt eine Nummer.", "Jede Auskunft ist vorläufig und endgültig zugleich."],
    ["offen", "beklemmend"],
  ),
  bureau: D(
    ["die Warteschlange bewegt sich nicht", "der Schalter ist besetzt und leer zugleich", "auf dem Tisch liegt ein Stift ohne Mine"],
    ["ein Formular verlangt ein zweites", "die Nummer wird aufgerufen, gehört aber niemandem", "der Aktenschrank öffnet sich in einen weiteren Flur"],
    ["die Zuständigkeit wird endgültig ungeklärt", "das eigene Aktenzeichen erlischt"],
    ["eine Zuständigkeit, die niemand annimmt", "einen Vorgang ohne Ende", "eine Bestätigung, die sich selbst widerruft"],
    ["ein Formular in dreifacher Ausfertigung", "eine Wartenummer aus einem anderen Jahr", "ein Dienstsiegel ohne Behörde"],
    ["der Vorgang wird umgeleitet", "die Frist verlängert sich von selbst", "das Verfahren beginnt still von vorn"],
    ["Der Sprechtag liegt immer gestern.", "Die Bearbeitungszeit wächst mit jeder Nachfrage."],
    ["Kein Vorgang endet, er ruht nur.", "Wer wartet, wird Teil des Verfahrens."],
    ["offen", "resigniert"],
  ),
  mystery: D(
    ["das Haus ist zu still für die Uhrzeit", "im Flur brennt Licht, das niemand angelassen hat", "die Tür fällt zu, bevor jemand sie berührt"],
    ["eine Spur führt zurück in den eigenen Weg", "der Zeuge erinnert sich an etwas, das nicht geschah", "hinter der Wand geht jemand denselben Gang"],
    ["die Erklärung stimmt, und macht alles schlimmer", "der Fund war die ganze Zeit sichtbar"],
    ["eine Wahrheit, die niemand hören will", "ein Verschwinden ohne Lücke", "einen Zeugen, der sich selbst widerspricht"],
    ["ein Schlüssel, der nirgends passt", "ein Anruf ohne Stimme", "ein Foto mit einer Person zu viel"],
    ["die Spur kehrt sich um", "der Verdacht wechselt die Richtung", "das Vertraute wird fremd"],
    ["Zwischen zwei Blicken vergeht eine Nacht.", "Die Uhr im Nebenzimmer geht anders."],
    ["Nichts verschwindet, es wird nur nicht mehr gesucht.", "Wer genau hinsieht, wird selbst gesehen."],
    ["offen", "unheimlich"],
  ),
  freud: D(
    ["das Zimmer ist auf angenehme Weise zu warm", "der Satz bricht ab, bevor er gefährlich wird", "das Sofa erinnert sich an alle, die darauf lagen"],
    ["ein Wort rutscht heraus und meint ein anderes", "die Erinnerung ändert sich beim Erzählen", "der Traum liefert die Antwort auf die falsche Frage"],
    ["das Verdrängte spricht mit vertrauter Stimme", "der Widerstand gibt genau an der Stelle nach"],
    ["einen Wunsch, den niemand zugibt", "eine Erinnerung, die sich selbst erfindet", "eine Angst mit fremdem Gesicht"],
    ["ein Versprecher im falschen Moment", "ein wiederkehrender Traum", "ein Name, der nicht einfallen will"],
    ["das Verdrängte kehrt zurück", "die Deutung dreht den Sinn um", "der Wunsch zeigt sein Gegenteil"],
    ["Die Kindheit liegt näher als gestern.", "Ein Satz dauert länger, als er braucht."],
    ["Nichts wird vergessen, es wird nur woanders abgelegt.", "Jede Abwehr verrät, was sie schützt."],
    ["offen", "analytisch"],
  ),
  rimbaud: D(
    ["das Wasser trägt Licht, das nicht vom Himmel stammt", "der Kiel schneidet durch eine Farbe ohne Namen", "die Küste löst sich auf, ohne zu verschwinden"],
    ["der Horizont wechselt die Seite", "das Meer schreibt und löscht denselben Satz", "der Mast singt in einer fremden Sprache"],
    ["das Schiff gehorcht keinem Kurs mehr", "der Rausch schlägt in Klarheit um"],
    ["eine Freiheit ohne Ufer", "einen Rausch, der nüchtern macht", "eine Fahrt ohne Ziel und ohne Umkehr"],
    ["ein Sturm aus heiterem Licht", "ein trunkenes Boot", "ein Wort in einer erfundenen Sprache"],
    ["die Farben kippen", "das Meer verwandelt sich in Sprache", "der Körper löst sich in Bewegung auf"],
    ["Ein Tag dauert eine Farbe lang.", "Die Nacht beginnt mitten am Nachmittag."],
    ["Wer sieht, verbrennt.", "Jede Ordnung ist nur eine müde Farbe."],
    ["offen", "rauschhaft"],
  ),
  traumbilder: D(
    ["der Raum ist größer als von außen", "der Schlaf hat noch nicht ganz aufgehört", "die Tür führt in dasselbe Zimmer zurück"],
    ["der Flur ordnet sich bei jedem Blick neu", "eine Treppe endet höher, als sie begann", "die Gesichter wechseln, ohne sich zu ändern"],
    ["das Erwachen misslingt zweimal", "der Traum erklärt sich und bleibt unverständlich"],
    ["eine Grenze zwischen Schlaf und Wachen", "eine Erinnerung, die beim Zugreifen zerfällt", "einen Raum, den es nicht gibt"],
    ["ein Wecker, der rückwärts läuft", "ein Schlüssel ohne Schloss", "ein Geräusch, das erst beim Aufwachen aufhört"],
    ["der Boden beginnt sich zu drehen", "die Zeit verdoppelt sich ohne Fortschritt", "das Spiegelbild reagiert zu spät"],
    ["Eine Minute enthält eine ganze Nacht.", "Die Uhr springt, sobald niemand hinsieht."],
    ["Im Traum ist jede Richtung nach unten.", "Wer den Traum benennt, verliert ihn."],
    ["offen", "schwebend"],
  ),
  ritterromane: D(
    ["die Burg liegt tiefer im Nebel als gestern", "das Tor steht offen, was es nie tut", "die Rüstung hängt bereit, obwohl niemand rief"],
    ["der Wald verschiebt die Wege", "ein Eid bindet stärker als die Vernunft", "der Gegner trägt das eigene Wappen"],
    ["das Schwert gehorcht der falschen Hand", "der Sieg entwertet die Sache"],
    ["eine Ehre, die niemand einfordert", "einen Eid gegen das eigene Herz", "eine Treue, die zu spät kommt"],
    ["ein Horn aus großer Ferne", "ein Bote ohne Botschaft", "ein Handschuh vor den Füßen"],
    ["die Treue kehrt sich um", "aus dem Feind wird ein Spiegel", "die Bahn des Ritts biegt ab"],
    ["Der Ritt dauert länger als der Weg.", "Zwischen Aufbruch und Ankunft altert die Burg."],
    ["Ein Eid wiegt schwerer als ein Leben.", "Wer den Wald betritt, kehrt anders zurück."],
    ["offen", "heroisch"],
  ),
  alltag: D(
    ["der Wasserkocher schaltet ab, sonst ist es still", "die Post liegt seit drei Tagen ungeöffnet da", "der Tag beginnt genau wie der vorige"],
    ["eine Kleinigkeit steht plötzlich schief", "der gewohnte Weg dauert heute länger", "ein Gespräch bricht an derselben Stelle ab"],
    ["die Gewohnheit trägt nicht mehr", "das Kleine wird auf einmal groß"],
    ["eine Frage, die nie gestellt wird", "eine Gewohnheit, die niemand gewählt hat", "einen Abstand, der langsam wächst"],
    ["ein Anruf zur falschen Zeit", "ein vergessener Schlüssel", "eine Rechnung ohne Betrag"],
    ["die Ordnung verrutscht", "das Gewohnte wird sichtbar", "der Tag kippt in eine andere Richtung"],
    ["Der Nachmittag zieht sich, der Abend fehlt.", "Die Woche wiederholt einen Tag zu oft."],
    ["Was täglich geschieht, wird nicht bemerkt.", "Jede Gewohnheit verbirgt eine Entscheidung."],
    ["offen", "nüchtern"],
  ),
  hafen: D(
    ["die Kräne stehen still, das Wasser nicht", "ein Schiff liegt länger als angemeldet", "das Licht kommt vom Wasser, nicht vom Himmel"],
    ["die Ladung stimmt nicht mit den Papieren überein", "die Flut nimmt mehr mit, als sie brachte", "ein Name auf dem Rumpf ist übermalt"],
    ["die Leinen fallen ohne Befehl", "das Schiff fährt ohne Fracht hinaus"],
    ["eine Abfahrt ohne Wiederkehr", "eine Ladung, die niemand bestellt hat", "ein Warten, das zum Beruf wird"],
    ["ein Signal aus dem Nebel", "ein Container ohne Papiere", "eine Boje, die nicht auf der Karte steht"],
    ["die Tide dreht", "das Warten kippt in Aufbruch", "der Anker hält plötzlich nicht mehr"],
    ["Die Ebbe kommt zweimal.", "Zwischen zwei Sirenen vergeht ein Jahr."],
    ["Das Wasser vergisst schneller als der Kai.", "Wer bleibt, wird zum Teil der Mole."],
    ["offen", "salzig"],
  ),
  urknall: D(
    ["es gibt kein Vorher, an dem man ansetzen könnte", "der Raum ist noch nicht auseinandergefaltet", "alles liegt in einem Punkt und drängt"],
    ["die Kräfte trennen sich voneinander", "aus Symmetrie wird Unterschied", "das Licht findet zum ersten Mal einen Weg"],
    ["die Materie entscheidet sich für sich selbst", "der Raum reißt in alle Richtungen auf"],
    ["einen Anfang ohne Zeugen", "ein Gleichgewicht, das kippen muss", "eine Ordnung, die aus Zufall entsteht"],
    ["ein Ungleichgewicht um ein Milliardstel", "eine Schwankung im Nichts", "ein erster Zerfall"],
    ["die Symmetrie bricht", "aus Strahlung wird Masse", "die Kräfte gehen getrennte Wege"],
    ["Eine Sekunde enthält alle späteren.", "Die Zeit beginnt erst, als es etwas zu messen gibt."],
    ["Nichts kann schneller sein als das Licht dazwischen.", "Jede Ordnung zahlt mit Wärme."],
    ["offen", "kosmisch"],
  ),
  dickens: D(
    ["der Nebel steht in der Gasse wie ein Möbelstück", "im Kontor brennt eine Kerze zu wenig", "der Regen macht die Stadt kleiner"],
    ["eine Schuld wird höflich eingefordert", "ein Kind trägt die Last eines Erwachsenen", "die Wohltätigkeit rechnet mit"],
    ["die Herkunft holt alles ein", "die Großzügigkeit kommt spät und trotzdem"],
    ["eine Schuld, die vererbt wird", "eine Armut mit tadellosen Manieren", "eine Güte, die sich nicht lohnt"],
    ["ein Brief mit schwarzem Rand", "eine Erbschaft aus unbekannter Hand", "ein Name in einem alten Register"],
    ["das Vermögen wechselt die Seite", "aus dem Fremden wird ein Verwandter", "die Kälte weicht zu spät"],
    ["Der Winter dauert drei Kapitel.", "Die Kindheit vergeht in einem Satz."],
    ["Jede Schuld findet ihren Schuldner.", "Wer arm ist, muss auch noch höflich sein."],
    ["offen", "wehmütig"],
  ),
  erotik: D(
    ["der Abstand ist eine Handbreit zu klein", "die Stille zwischen zwei Sätzen wird laut", "die Luft steht zwischen ihnen wie Stoff"],
    ["ein Blick dauert einen Atemzug zu lang", "die Höflichkeit hält nicht mehr stand", "eine Berührung geschieht wie versehentlich"],
    ["die Zurückhaltung gibt nach", "die Grenze verschwindet, ohne überschritten zu werden"],
    ["ein Verlangen, das niemand ausspricht", "eine Nähe, die alles ändert", "eine Grenze, die beide bewachen"],
    ["ein Blick zu viel", "eine Berührung an der Schulter", "ein Satz, der zu spät zurückgenommen wird"],
    ["die Distanz kippt", "das Ungesagte wird Körper", "aus Höflichkeit wird Hunger"],
    ["Eine Minute dehnt sich über den Abend.", "Zwischen zwei Atemzügen liegt eine Woche."],
    ["Was ungesagt bleibt, wirkt stärker.", "Jede Nähe verschiebt die Grenze."],
    ["offen", "sinnlich"],
  ),
};

/** Dramaturgie eines eingebauten Presets — null, wenn (noch) keine hinterlegt ist. */
export function builtinDrama(id: string): DramaData | null {
  return BUILTIN_DRAMA[id.replace(/^builtin:/, "")] ?? null;
}
