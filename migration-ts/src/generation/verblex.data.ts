// Infinitiv-Lexikon — die vierte Tabelle der Morphologie.
//
// Die drei vorhandenen Tabellen (Präsens-Paradigmen in verben.ts, Personal-
// formen in verbconj.data.ts, Präteritum→Präsens in coherence.ts) beugen ein
// Verb, wenn man es ihnen gibt. Sie beantworten nicht: IST dieses Wort ein
// Verb? Ohne diese Antwort riet istVerbform über Endungen (alles auf -t, was
// nicht gesperrt ist), und kein Wächter konnte „die Sohlen halten" von „die
// Sohlen hielten" trennen, ohne eines von beiden zu beschädigen.
//
// Hier stehen Grundverben als Infinitive. Präfixe (auf-, an-, ver-, be-,
// zurück- ...) werden beim Nachschlagen abgestreift — kenntVerb("aufhören")
// findet „hören". Die Liste ist Handarbeit, nach Häufigkeit gewählt, und
// gegen die 6930 eingebauten Bausteine geprüft (test/verblex.ts). Wer ein
// Verb vermisst, trägt es hier ein — alphabetisch, ein Wort je Eintrag.
const GRUND = `
achten ächzen ahnen ändern ärgern arbeiten atmen backen baden bangen bauen beben bedeuten beeilen befehlen beginnen begreifen
behalten beißen bellen bergen bersten beten betteln beugen bewegen biegen bieten bilden binden bitten blasen bleiben blenden blicken
blinken blinzeln blitzen blühen bluten bohren borgen brauchen brausen brechen bremsen brennen bringen brüllen brummen buchen bücken
bügeln bürsten danken decken dehnen denken deuten dichten dienen dösen drängen drehen dreschen dringen drohen dröhnen drucken drücken
dulden dunkeln dürfen duften düngen dünken durchqueren ebben ehren eignen eilen einen eitern ekeln enden entbehren entgleiten erben
erlöschen ernten essen fächeln fahren fallen falten fangen fassen fasten fauchen fechten fegen fehlen feiern feilen feixen fesseln
feuern finden fischen flackern flattern flechten flehen flicken fliegen fliehen fließen flimmern flirren flöten fluchen fluten
flüstern folgen fordern forschen fragen fressen freuen frieren fügen fühlen führen füllen funkeln fürchten fußen gähnen gären gaffen
geben gedeihen gehen gehorchen gehören gelingen gelten genesen genießen geraten geschehen gewinnen gießen glänzen glauben gleichen
gleiten glimmen glitzern glühen gönnen graben grasen greifen grinsen grollen grübeln grünen grüßen gucken haben hacken haften hageln
haken hallen halten hämmern handeln hängen harren hassen hasten hauchen hauen häufen heben heften hegen heilen heißen heizen helfen
hemmen herrschen hetzen heulen hinken hocken hoffen holen horchen hören huldigen hüllen humpeln hungern hupen hüpfen husten hüten
irren jagen jammern jauchzen jubeln kämmen kämpfen kauen kaufen kehren keimen kennen kichern kippen kitzeln klagen klappen klappern
klären klatschen kleben kleiden klettern klingeln klingen klirren klopfen knabbern knacken knallen knarren kneifen kneten knicken
knien knirschen knistern knüpfen kochen kommen können kosten krachen krähen kränken kratzen kreisen kreuzen kriechen kriegen
kritzeln krümmen kühlen kümmern kürzen küssen lachen laden lagern lähmen landen langen lassen lasten lauern laufen lauschen lauten
läuten leben lecken legen lehnen lehren leiden leihen leisten leiten lenken lernen lesen leuchten lieben liefern liegen lindern
loben locken lodern lohnen löschen lösen lügen lutschen machen mahlen mahnen malen mangeln meiden meinen melden melken merken messen
mischen missen mögen morden müssen munkeln murmeln nagen nähen nahen nähern nähren naschen necken nehmen neigen nennen nesteln
nicken nieseln nippen nisten nörgeln nutzen nützen öffnen opfern ordnen packen passen pausieren peitschen pfeifen pflanzen pflegen
pflücken picken plagen platzen plaudern pochen poltern prägen prallen prangen prasseln predigen preisen pressen probieren prüfen
prügeln pulsieren pumpen putzen quälen quellen quietschen raffen ragen rasen rasten raten rauben rauchen räumen rauschen rechnen
reden regen regnen reiben reichen reifen reihen reimen reisen reißen reiten rennen retten reuen richten riechen ringen rinnen
ritzen rollen rosten rücken rudern rufen ruhen rühmen rühren rütteln säen sagen sammeln säumen saugen säuseln schaben schaffen
schallen schalten schämen scharren schätzen schauen schaufeln schaukeln scheiden scheinen scheitern schellen schelten schenken
scheren scheuchen scheuen schicken schieben schielen schießen schildern schimmern schimpfen schinden schlafen schlagen schleichen
schleifen schleppen schleudern schließen schlingen schlucken schlüpfen schmecken schmeicheln schmelzen schmerzen schmieden
schmieren schmücken schmunzeln schnappen schnarchen schneiden schneien schnüren schnuppern schonen schöpfen schrauben schreiben
schreien schreiten schrumpfen schüren schürfen schütteln schütten schützen schwanken schwärmen schwatzen schweben schweifen
schweigen schwellen schwenken schwimmen schwinden schwingen schwitzen schwören segeln segnen sehen sehnen seufzen sichern sichten
sickern sieden siegen singen sinken sinnen sitzen sollen sorgen spähen spalten spannen sparen spazieren speien speisen spenden
sperren spielen spinnen spotten sprechen sprengen sprießen springen spritzen sprühen spucken spülen spüren stammeln stammen
stampfen stapeln starren stauben staunen stechen stecken stehen stehlen steigen steinigen stellen sterben steuern sticken
stinken stöhnen stolpern stopfen stören stoßen strahlen stranden streben strecken streichen streicheln streiten streuen
stricken strömen stürmen stürzen stutzen stützen suchen summen sündigen tadeln tagen tanken tanzen tappen tasten tauchen tauen
taugen taumeln tauschen täuschen teilen tilgen toben tönen tosen traben trachten tragen trampeln trauen trauern träumen treffen
treiben trennen treten triefen trinken trocknen trommeln tropfen trösten trotzen trüben tun türmen üben umarmen urteilen
vergessen verlieren verzeihen wachen wachsen wagen wählen wähnen wahren währen wandeln wandern wanken wärmen warnen warten waschen
weben wechseln wecken wehen wehren weichen weiden weigern weihen weilen weinen weisen weiten welken wenden werben werden werfen
werken wetten wickeln widmen wiegen wimmeln wimmern winden winken wirbeln wirken wischen wissen wittern wohnen wölben wollen
wuchern wühlen wundern wünschen würdigen würgen würzen zagen zahlen zählen zähmen zaubern zaudern zausen zehren zeichnen zeigen
zerren zeugen ziehen zielen ziemen zieren zischen zittern zögern zucken zupfen zwängen zweifeln zwingen zwinkern zwitschern
adeln ähneln akzeptieren analysieren antworten applaudieren beantworten begegnen begleiten behaupten beobachten berichten
berühren beschreiben besitzen bestimmen besuchen betrachten betreten beweisen bezahlen brüten datieren definieren diskutieren
dämmern dämpfen dampfen detonieren donnern duschen entdecken entscheiden entschuldigen entwickeln erinnern erkennen erklären
erlauben erleben erreichen erschrecken erwarten erzählen existieren fabrizieren fasziniert funktionieren garantieren gebären
gefallen genügen geschehen gestalten gewöhnen glitschen hämmern handeln heiraten hindern ignorieren informieren interessieren
kapitulieren kentern klettern kombinieren kontrollieren korrigieren kosten kreisen kürzen leiden lodern markieren marschieren
meistern montieren murren musizieren notieren nötigen operieren organisieren passieren pilgern planen plündern posieren
probieren produzieren protestieren protokollieren rasieren reagieren regieren reparieren respektieren riskieren rotieren
schmeißen schmettern schnattern sortieren spekulieren studieren telefonieren transportieren trainieren trauen trödeln
überlegen verabschieden verändern verbergen verbinden verbrennen verdienen verfolgen verhalten verhandeln verkaufen verlangen
verlassen vermeiden vermuten verraten versagen verschieben verschwinden versichern versprechen verstecken verstehen versuchen
verteidigen vertrauen verwalten verwandeln verweigern verwenden verzichten vollenden wackeln wandeln weinen wirbeln zerbrechen
zerstören zögern zurechtkommen zweifeln
stimmen passen setzen dauern lösen lächeln kündigen retten ticken zünden siegeln entfernen verlängern verstummen beschriften
gabeln erledigen bewilligen bestätigen sichern lohnen stauen stocken tönen trüben wähnen zerren fehlen kosten sparen sperren
stürzen stapeln stehlen schweigen taumeln töten trocknen tröpfeln übergehen verschließen vertreten verwahren verwirren vollziehen
wachsen wandern weichen wirken wurzeln zerfallen zerfließen zergehen zerreißen zerschlagen zersplittern zischen
regeln spiegeln speichern beschleunigen senken färben formen altern riegeln fiebern schlitzen rutschen beanstanden ergänzen
blättern sanden schulden bessern bremsen dunkeln düstern erkennen ernennen färben festigen filtern flüchten frönen gähnen
häuten heilen hetzen kämmen klammern klemmen kneten kramen kränkeln kräuseln lasten leimen lüften mildern mustern nachten
nässen nieten ölen pinseln plätschern polstern prallen prunken quirlen rädern reifen richten röcheln rütteln säubern salzen
säumen schätzen schaudern schlängeln schleimen schlummern schmoren schnüffeln schrubben schwächen schwelen sengen sondern
spalten spiegeln spitzen sprudeln stauben steuern stochern strampeln streifen striegeln stumpfen sudeln tauen tigern tippen
trampeln tünchen wabern watscheln wetzen wiehern winseln wispern wittern wuchten zerknittern zetern zieren zittern zotteln zuckeln
abhängen ankommen anfangen aufstehen ausgehen bedienen befreien behandeln bemerken benennen beschließen bestehen betonen bewahren
bezeichnen bilden bluten brüten büßen dämmern deuten drehen ehren einigen empfangen empfehlen entfalten enthalten entlassen entstehen
erfahren erfinden ergeben erhalten erheben erholen erlösen ermahnen ernähren eröffnen erregen erschöpfen ersticken erstarren erwähnen
erweitern erzeugen fesseln flüchten frösteln funken gebieten gedenken gelangen gemahnen geraten gestehen gewähren graben grenzen
grübeln hadern harken hausen heben herrschen hindern huschen jäten jucken keuchen klaffen kleckern klimpern knallen kraulen kreischen
kringeln kritzeln krönen kuscheln lärmen leuchten lichten lispeln lugen lungern mäßigen meißeln mieten mindern mühen murksen nachahmen
nagen näseln nörgeln nuscheln pachten pflastern pieksen plappern prahlen prangen prellen prosten quaken qualmen räuspern rauen räumen
reizen rieseln rodeln röhren rumpeln säbeln säckeln sägen sausen schäumen schälen schaufeln schnalzen schnaufen schnellen schnippen
schwappen schwirren seihen sichten siezen sinnieren spannen spenden spicken spießen sprenkeln spuken stänkern stelzen stemmen sticheln
stöbern stopfen strapazieren strotzen stülpen stutzen tändeln taxieren tollen torkeln trällern trudeln tuscheln umgarnen verharren
wabbeln walzen wedeln weilen wetteifern wimmeln wringen wuseln zappeln zaubern zechen zergehen zerknüllen zerlegen zermürben zerpflücken
zerschellen zertrümmern zeugen zirpen zocken zurren
`;

/** Präfixe, die beim Nachschlagen abgestreift werden — von lang nach kurz. */
export const VERB_PRAEFIXE = ["zusammen", "zurück", "wieder", "gegen", "hinter", "durch", "unter", "über", "voran", "vorbei",
  "heraus", "herein", "hinaus", "hinein", "herum", "hinauf", "hinab", "herab", "empor", "fort", "los", "weg", "fest", "auseinander",
  "entgegen", "entlang", "nieder", "umher", "davon", "dazu", "hoch", "her", "hin", "ver", "ent", "emp", "miss", "zer", "be", "er",
  "ge", "an", "ab", "auf", "aus", "ein", "mit", "nach", "vor", "zu", "um", "bei", "da", "wider", "still", "frei", "leer", "tot", "voll", "wahr", "gut", "kaputt"];

// Präteritum → Präsens der starken Verben (aus coherence.ts hierher gezogen,
// damit Morphologie und Umschreiber dieselbe Tabelle lesen).
export const PAST2PRES: Record<string, string> = {
  // Ergänzt 4.338.2 (Blatt „Vier Kinder": „Das Herz schlug mir bis zum Hals" blieb stehen):
  schlug: "schlägt", schlugen: "schlagen", roch: "riecht", rochen: "riechen", traf: "trifft", trafen: "treffen",
  schob: "schiebt", schoben: "schieben", tat: "tut", taten: "tun", wusch: "wäscht", stritt: "streitet", glitt: "gleitet",
  stieß: "stößt", stießen: "stoßen", goss: "gießt", band: "bindet", banden: "binden", zwang: "zwingt", fing: "fängt", fingen: "fangen",
  sandte: "sendet", mochte: "mag", mochten: "mögen", stahl: "stiehlt", galt: "gilt", galten: "gelten", gelang: "gelingt",
  verband: "verbindet", erhielt: "erhält", erhielten: "erhalten", behielt: "behält", enthielt: "enthält", verließ: "verlässt", verließen: "verlassen",
  genoss: "genießt", schlich: "schleicht", strich: "streicht", blies: "bläst", lud: "lädt", luden: "laden", schuf: "schafft", schufen: "schaffen",
  log: "lügt", betrog: "betrügt", flocht: "flicht", kroch: "kriecht", krochen: "kriechen", schmolz: "schmilzt", quoll: "quillt", quollen: "quellen",
  verging: "vergeht", vergingen: "vergehen", entging: "entgeht", erging: "ergeht", erschrak: "erschrickt",
  war: "ist", waren: "sind", warst: "bist", hatte: "hat", hatten: "haben", hattest: "hast",
  wurde: "wird", wurden: "werden", ging: "geht", gingen: "gehen", kam: "kommt", kamen: "kommen",
  sah: "sieht", sahen: "sehen", gab: "gibt", gaben: "geben", stand: "steht", standen: "stehen",
  blieb: "bleibt", blieben: "bleiben", hielt: "hält", hielten: "halten", ließ: "lässt", ließen: "lassen",
  fand: "findet", fanden: "finden", nahm: "nimmt", nahmen: "nehmen", sprach: "spricht", sprachen: "sprechen",
  schrieb: "schreibt", schrieben: "schreiben", trug: "trägt", trugen: "tragen", fuhr: "fährt", fuhren: "fahren",
  lief: "läuft", liefen: "laufen", saß: "sitzt", saßen: "sitzen", lag: "liegt", lagen: "liegen",
  hieß: "heißt", hießen: "heißen", zog: "zieht", zogen: "ziehen", schlief: "schläft", schliefen: "schlafen",
  rief: "ruft", riefen: "rufen", fiel: "fällt", fielen: "fallen", sang: "singt", sangen: "singen",
  trank: "trinkt", tranken: "trinken", schwieg: "schweigt", schwiegen: "schweigen", floss: "fließt", flossen: "fließen",
  stieg: "steigt", stiegen: "steigen", sank: "sinkt", sanken: "sinken", bot: "bietet", boten: "bieten",
  schloss: "schließt", schlossen: "schließen", verlor: "verliert", verloren: "verlieren",
  begann: "beginnt", begannen: "beginnen", geschah: "geschieht", geschahen: "geschehen",
  konnte: "kann", konnten: "können", musste: "muss", mussten: "müssen", wollte: "will", wollten: "wollen",
  sollte: "soll", sollten: "sollen", durfte: "darf", durften: "dürfen", wusste: "weiß", wussten: "wissen",
  dachte: "denkt", dachten: "denken", brachte: "bringt", brachten: "bringen", kannte: "kennt", kannten: "kennen",
  erkannte: "erkennt", erkannten: "erkennen", brannte: "brennt", brannten: "brennen", nannte: "nennt", nannten: "nennen",
  rannte: "rennt", rannten: "rennen", wandte: "wendet", wandten: "wenden", sprang: "springt", sprangen: "springen",
  schrie: "schreit", schrien: "schreien", flog: "fliegt", flogen: "fliegen", floh: "flieht", flohen: "fliehen",
  schoss: "schießt", schossen: "schießen", riss: "reißt", rissen: "reißen", biss: "beißt", bissen: "beißen",
  griff: "greift", griffen: "greifen", pfiff: "pfeift", pfiffen: "pfeifen", schnitt: "schneidet", schnitten: "schneiden",
  litt: "leidet", litten: "leiden", trat: "tritt", traten: "treten", vergaß: "vergisst", vergaßen: "vergessen",
  wuchs: "wächst", wuchsen: "wachsen", wich: "weicht", wichen: "weichen", schien: "scheint", schienen: "scheinen",
  zerbrach: "zerbricht", zerbrachen: "zerbrechen", verschwand: "verschwindet", verschwanden: "verschwinden",
  erschien: "erscheint", erschienen: "erscheinen", starb: "stirbt", starben: "sterben",
  brach: "bricht", brachen: "brechen", sprach2: "spricht", schwoll: "schwillt", schwollen: "schwellen",
  bog: "biegt", bogen: "biegen", hob: "hebt", hoben: "heben", wob: "webt", woben: "weben",
  klang: "klingt", klangen: "klingen", sann: "sinnt", sannen: "sinnen", rann: "rinnt", rannen: "rinnen",
  schwamm: "schwimmt", schwammen: "schwimmen", verschwieg: "verschweigt", zerfiel: "zerfällt", zerfielen: "zerfallen",
  entstand: "entsteht", entstanden: "entstehen", verstand: "versteht", verstanden: "verstehen",
  bestand: "besteht", bestanden: "bestehen", geriet: "gerät", gerieten: "geraten",
  trieb: "treibt", trieben: "treiben", schrak: "schrickt", wies: "weist", wiesen: "weisen",
  hing: "hängt", hingen: "hängen", schwand: "schwindet", schwanden: "schwinden",
  gewann: "gewinnt", gewannen: "gewinnen", zerriss: "zerreißt", zerrissen2: "zerreißen",
  empfand: "empfindet", empfanden: "empfinden", befahl: "befiehlt", befahlen: "befehlen",
  half: "hilft", halfen: "helfen", warf: "wirft", warfen: "werfen", starrte2: "starrt",
  las: "liest", lasen: "lesen", aß: "isst", aßen: "essen", bat: "bittet", baten: "bitten",
};

export const VERB_INFINITIVE: Set<string> = new Set(GRUND.split(/\s+/).map((w) => w.trim()).filter((w) => w.length > 2));
