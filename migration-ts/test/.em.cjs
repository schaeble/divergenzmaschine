"use strict";
var __defProp = Object.defineProperty;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __esm = (fn, res) => function __init() {
  return fn && (res = (0, fn[__getOwnPropNames(fn)[0]])(fn = 0)), res;
};
var __export = (target, all) => {
  for (var name in all)
    __defProp(target, name, { get: all[name], enumerable: true });
};

// src/text-utils.ts
function clean(s) {
  return (s ?? "").toString().trim().replace(/\s+/g, " ");
}
function keineGrenze(vor, nach) {
  if (ABKUERZUNG.test(vor)) return true;
  if (!ORDNUNGSZAHL.test(vor)) return false;
  return MONATE.test(nach) || /^\d/.test(nach);
}
function splitSentences(txt) {
  const flach = txt.replace(/\s+/g, " ").trim();
  const roh = flach.split(/(?<=[.!?…])\s+/).filter(Boolean);
  const raus = [];
  for (const teil of roh) {
    const vor = raus[raus.length - 1];
    if (vor && keineGrenze(vor, teil)) raus[raus.length - 1] = vor + " " + teil;
    else raus.push(teil);
  }
  return raus;
}
var MONATE, ORDNUNGSZAHL, ABKUERZUNG;
var init_text_utils = __esm({
  "src/text-utils.ts"() {
    "use strict";
    MONATE = /^(?:Januar|Februar|März|April|Mai|Juni|Juli|August|September|Oktober|November|Dezember|Jahrhunderts?|Jh\.|Hälfte|Auflage|Band|Kapitel|Absatz|Teil)\b/u;
    ORDNUNGSZAHL = /\d\.$/;
    ABKUERZUNG = /(?:^|\s)(?:[A-Za-zÄÖÜäöü]|ca|bzw|bspw|evtl|ggf|inkl|Nr|St|Dr|Prof|Abs|Art|Bd|Hrsg|usw|etc)\.$/u;
  }
});

// src/generation/cooldown.ts
var init_cooldown = __esm({
  "src/generation/cooldown.ts"() {
    "use strict";
    init_text_utils();
  }
});

// src/atoms/schema.ts
var init_schema = __esm({
  "src/atoms/schema.ts"() {
    "use strict";
  }
});

// src/generation/verblex.data.ts
var GRUND, VERB_PRAEFIXE, PAST2PRES, VERB_INFINITIVE;
var init_verblex_data = __esm({
  "src/generation/verblex.data.ts"() {
    "use strict";
    GRUND = `
achten \xE4chzen ahnen \xE4ndern \xE4rgern arbeiten atmen backen baden bangen bauen beben bedeuten beeilen befehlen beginnen begreifen
behalten bei\xDFen bellen bergen bersten beten betteln beugen bewegen biegen bieten bilden binden bitten blasen bleiben blenden blicken
blinken blinzeln blitzen bl\xFChen bluten bohren borgen brauchen brausen brechen bremsen brennen bringen br\xFCllen brummen buchen b\xFCcken
b\xFCgeln b\xFCrsten danken decken dehnen denken deuten dichten dienen d\xF6sen dr\xE4ngen drehen dreschen dringen drohen dr\xF6hnen drucken dr\xFCcken
dulden dunkeln d\xFCrfen duften d\xFCngen d\xFCnken durchqueren ebben ehren eignen eilen einen eitern ekeln enden entbehren entgleiten erben
erl\xF6schen ernten essen f\xE4cheln fahren fallen falten fangen fassen fasten fauchen fechten fegen fehlen feiern feilen feixen fesseln
feuern finden fischen flackern flattern flechten flehen flicken fliegen fliehen flie\xDFen flimmern flirren fl\xF6ten fluchen fluten
fl\xFCstern folgen fordern forschen fragen fressen freuen frieren f\xFCgen f\xFChlen f\xFChren f\xFCllen funkeln f\xFCrchten fu\xDFen g\xE4hnen g\xE4ren gaffen
geben gedeihen gehen gehorchen geh\xF6ren gelingen gelten genesen genie\xDFen geraten geschehen gewinnen gie\xDFen gl\xE4nzen glauben gleichen
gleiten glimmen glitzern gl\xFChen g\xF6nnen graben grasen greifen grinsen grollen gr\xFCbeln gr\xFCnen gr\xFC\xDFen gucken haben hacken haften hageln
haken hallen halten h\xE4mmern handeln h\xE4ngen harren hassen hasten hauchen hauen h\xE4ufen heben heften hegen heilen hei\xDFen heizen helfen
hemmen herrschen hetzen heulen hinken hocken hoffen holen horchen h\xF6ren huldigen h\xFCllen humpeln hungern hupen h\xFCpfen husten h\xFCten
irren jagen jammern jauchzen jubeln k\xE4mmen k\xE4mpfen kauen kaufen kehren keimen kennen kichern kippen kitzeln klagen klappen klappern
kl\xE4ren klatschen kleben kleiden klettern klingeln klingen klirren klopfen knabbern knacken knallen knarren kneifen kneten knicken
knien knirschen knistern kn\xFCpfen kochen kommen k\xF6nnen kosten krachen kr\xE4hen kr\xE4nken kratzen kreisen kreuzen kriechen kriegen
kritzeln kr\xFCmmen k\xFChlen k\xFCmmern k\xFCrzen k\xFCssen lachen laden lagern l\xE4hmen landen langen lassen lasten lauern laufen lauschen lauten
l\xE4uten leben lecken legen lehnen lehren leiden leihen leisten leiten lenken lernen lesen leuchten lieben liefern liegen lindern
loben locken lodern lohnen l\xF6schen l\xF6sen l\xFCgen lutschen machen mahlen mahnen malen mangeln meiden meinen melden melken merken messen
mischen missen m\xF6gen morden m\xFCssen munkeln murmeln nagen n\xE4hen nahen n\xE4hern n\xE4hren naschen necken nehmen neigen nennen nesteln
nicken nieseln nippen nisten n\xF6rgeln nutzen n\xFCtzen \xF6ffnen opfern ordnen packen passen pausieren peitschen pfeifen pflanzen pflegen
pfl\xFCcken picken plagen platzen plaudern pochen poltern pr\xE4gen prallen prangen prasseln predigen preisen pressen probieren pr\xFCfen
pr\xFCgeln pulsieren pumpen putzen qu\xE4len quellen quietschen raffen ragen rasen rasten raten rauben rauchen r\xE4umen rauschen rechnen
reden regen regnen reiben reichen reifen reihen reimen reisen rei\xDFen reiten rennen retten reuen richten riechen ringen rinnen
ritzen rollen rosten r\xFCcken rudern rufen ruhen r\xFChmen r\xFChren r\xFCtteln s\xE4en sagen sammeln s\xE4umen saugen s\xE4useln schaben schaffen
schallen schalten sch\xE4men scharren sch\xE4tzen schauen schaufeln schaukeln scheiden scheinen scheitern schellen schelten schenken
scheren scheuchen scheuen schicken schieben schielen schie\xDFen schildern schimmern schimpfen schinden schlafen schlagen schleichen
schleifen schleppen schleudern schlie\xDFen schlingen schlucken schl\xFCpfen schmecken schmeicheln schmelzen schmerzen schmieden
schmieren schm\xFCcken schmunzeln schnappen schnarchen schneiden schneien schn\xFCren schnuppern schonen sch\xF6pfen schrauben schreiben
schreien schreiten schrumpfen sch\xFCren sch\xFCrfen sch\xFCtteln sch\xFCtten sch\xFCtzen schwanken schw\xE4rmen schwatzen schweben schweifen
schweigen schwellen schwenken schwimmen schwinden schwingen schwitzen schw\xF6ren segeln segnen sehen sehnen seufzen sichern sichten
sickern sieden siegen singen sinken sinnen sitzen sollen sorgen sp\xE4hen spalten spannen sparen spazieren speien speisen spenden
sperren spielen spinnen spotten sprechen sprengen sprie\xDFen springen spritzen spr\xFChen spucken sp\xFClen sp\xFCren stammeln stammen
stampfen stapeln starren stauben staunen stechen stecken stehen stehlen steigen steinigen stellen sterben steuern sticken
stinken st\xF6hnen stolpern stopfen st\xF6ren sto\xDFen strahlen stranden streben strecken streichen streicheln streiten streuen
stricken str\xF6men st\xFCrmen st\xFCrzen stutzen st\xFCtzen suchen summen s\xFCndigen tadeln tagen tanken tanzen tappen tasten tauchen tauen
taugen taumeln tauschen t\xE4uschen teilen tilgen toben t\xF6nen tosen traben trachten tragen trampeln trauen trauern tr\xE4umen treffen
treiben trennen treten triefen trinken trocknen trommeln tropfen tr\xF6sten trotzen tr\xFCben tun t\xFCrmen \xFCben umarmen urteilen
vergessen verlieren verzeihen wachen wachsen wagen w\xE4hlen w\xE4hnen wahren w\xE4hren wandeln wandern wanken w\xE4rmen warnen warten waschen
weben wechseln wecken wehen wehren weichen weiden weigern weihen weilen weinen weisen weiten welken wenden werben werden werfen
werken wetten wickeln widmen wiegen wimmeln wimmern winden winken wirbeln wirken wischen wissen wittern wohnen w\xF6lben wollen
wuchern w\xFChlen wundern w\xFCnschen w\xFCrdigen w\xFCrgen w\xFCrzen zagen zahlen z\xE4hlen z\xE4hmen zaubern zaudern zausen zehren zeichnen zeigen
zerren zeugen ziehen zielen ziemen zieren zischen zittern z\xF6gern zucken zupfen zw\xE4ngen zweifeln zwingen zwinkern zwitschern
adeln \xE4hneln akzeptieren analysieren antworten applaudieren beantworten begegnen begleiten behaupten beobachten berichten
ber\xFChren beschreiben besitzen bestimmen besuchen betrachten betreten beweisen bezahlen br\xFCten datieren definieren diskutieren
d\xE4mmern d\xE4mpfen dampfen detonieren donnern duschen entdecken entscheiden entschuldigen entwickeln erinnern erkennen erkl\xE4ren
erlauben erleben erreichen erschrecken erwarten erz\xE4hlen existieren fabrizieren fasziniert funktionieren garantieren geb\xE4ren
gefallen gen\xFCgen geschehen gestalten gew\xF6hnen glitschen h\xE4mmern handeln heiraten hindern ignorieren informieren interessieren
kapitulieren kentern klettern kombinieren kontrollieren korrigieren kosten kreisen k\xFCrzen leiden lodern markieren marschieren
meistern montieren murren musizieren notieren n\xF6tigen operieren organisieren passieren pilgern planen pl\xFCndern posieren
probieren produzieren protestieren protokollieren rasieren reagieren regieren reparieren respektieren riskieren rotieren
schmei\xDFen schmettern schnattern sortieren spekulieren studieren telefonieren transportieren trainieren trauen tr\xF6deln
\xFCberlegen verabschieden ver\xE4ndern verbergen verbinden verbrennen verdienen verfolgen verhalten verhandeln verkaufen verlangen
verlassen vermeiden vermuten verraten versagen verschieben verschwinden versichern versprechen verstecken verstehen versuchen
verteidigen vertrauen verwalten verwandeln verweigern verwenden verzichten vollenden wackeln wandeln weinen wirbeln zerbrechen
zerst\xF6ren z\xF6gern zurechtkommen zweifeln
stimmen passen setzen dauern l\xF6sen l\xE4cheln k\xFCndigen retten ticken z\xFCnden siegeln entfernen verl\xE4ngern verstummen beschriften
gabeln erledigen bewilligen best\xE4tigen sichern lohnen stauen stocken t\xF6nen tr\xFCben w\xE4hnen zerren fehlen kosten sparen sperren
st\xFCrzen stapeln stehlen schweigen taumeln t\xF6ten trocknen tr\xF6pfeln \xFCbergehen verschlie\xDFen vertreten verwahren verwirren vollziehen
wachsen wandern weichen wirken wurzeln zerfallen zerflie\xDFen zergehen zerrei\xDFen zerschlagen zersplittern zischen
regeln spiegeln speichern beschleunigen senken f\xE4rben formen altern riegeln fiebern schlitzen rutschen beanstanden erg\xE4nzen
bl\xE4ttern sanden schulden bessern bremsen dunkeln d\xFCstern erkennen ernennen f\xE4rben festigen filtern fl\xFCchten fr\xF6nen g\xE4hnen
h\xE4uten heilen hetzen k\xE4mmen klammern klemmen kneten kramen kr\xE4nkeln kr\xE4useln lasten leimen l\xFCften mildern mustern nachten
n\xE4ssen nieten \xF6len pinseln pl\xE4tschern polstern prallen prunken quirlen r\xE4dern reifen richten r\xF6cheln r\xFCtteln s\xE4ubern salzen
s\xE4umen sch\xE4tzen schaudern schl\xE4ngeln schleimen schlummern schmoren schn\xFCffeln schrubben schw\xE4chen schwelen sengen sondern
spalten spiegeln spitzen sprudeln stauben steuern stochern strampeln streifen striegeln stumpfen sudeln tauen tigern tippen
trampeln t\xFCnchen wabern watscheln wetzen wiehern winseln wispern wittern wuchten zerknittern zetern zieren zittern zotteln zuckeln
abh\xE4ngen ankommen anfangen aufstehen ausgehen bedienen befreien behandeln bemerken benennen beschlie\xDFen bestehen betonen bewahren
bezeichnen bilden bluten br\xFCten b\xFC\xDFen d\xE4mmern deuten drehen ehren einigen empfangen empfehlen entfalten enthalten entlassen entstehen
erfahren erfinden ergeben erhalten erheben erholen erl\xF6sen ermahnen ern\xE4hren er\xF6ffnen erregen ersch\xF6pfen ersticken erstarren erw\xE4hnen
erweitern erzeugen fesseln fl\xFCchten fr\xF6steln funken gebieten gedenken gelangen gemahnen geraten gestehen gew\xE4hren graben grenzen
gr\xFCbeln hadern harken hausen heben herrschen hindern huschen j\xE4ten jucken keuchen klaffen kleckern klimpern knallen kraulen kreischen
kringeln kritzeln kr\xF6nen kuscheln l\xE4rmen leuchten lichten lispeln lugen lungern m\xE4\xDFigen mei\xDFeln mieten mindern m\xFChen murksen nachahmen
nagen n\xE4seln n\xF6rgeln nuscheln pachten pflastern pieksen plappern prahlen prangen prellen prosten quaken qualmen r\xE4uspern rauen r\xE4umen
reizen rieseln rodeln r\xF6hren rumpeln s\xE4beln s\xE4ckeln s\xE4gen sausen sch\xE4umen sch\xE4len schaufeln schnalzen schnaufen schnellen schnippen
schwappen schwirren seihen sichten siezen sinnieren spannen spenden spicken spie\xDFen sprenkeln spuken st\xE4nkern stelzen stemmen sticheln
st\xF6bern stopfen strapazieren strotzen st\xFClpen stutzen t\xE4ndeln taxieren tollen torkeln tr\xE4llern trudeln tuscheln umgarnen verharren
wabbeln walzen wedeln weilen wetteifern wimmeln wringen wuseln zappeln zaubern zechen zergehen zerkn\xFCllen zerlegen zerm\xFCrben zerpfl\xFCcken
zerschellen zertr\xFCmmern zeugen zirpen zocken zurren
`;
    VERB_PRAEFIXE = [
      "zusammen",
      "zur\xFCck",
      "wieder",
      "gegen",
      "hinter",
      "durch",
      "unter",
      "\xFCber",
      "voran",
      "vorbei",
      "heraus",
      "herein",
      "hinaus",
      "hinein",
      "herum",
      "hinauf",
      "hinab",
      "herab",
      "empor",
      "fort",
      "los",
      "weg",
      "fest",
      "auseinander",
      "entgegen",
      "entlang",
      "nieder",
      "umher",
      "davon",
      "dazu",
      "hoch",
      "her",
      "hin",
      "ver",
      "ent",
      "emp",
      "miss",
      "zer",
      "be",
      "er",
      "ge",
      "an",
      "ab",
      "auf",
      "aus",
      "ein",
      "mit",
      "nach",
      "vor",
      "zu",
      "um",
      "bei",
      "da",
      "wider",
      "still",
      "frei",
      "leer",
      "tot",
      "voll",
      "wahr",
      "gut",
      "kaputt"
    ];
    PAST2PRES = {
      // Ergänzt 4.338.2 (Blatt „Vier Kinder": „Das Herz schlug mir bis zum Hals" blieb stehen):
      schlug: "schl\xE4gt",
      schlugen: "schlagen",
      roch: "riecht",
      rochen: "riechen",
      traf: "trifft",
      trafen: "treffen",
      schob: "schiebt",
      schoben: "schieben",
      tat: "tut",
      taten: "tun",
      wusch: "w\xE4scht",
      stritt: "streitet",
      glitt: "gleitet",
      stie\u00DF: "st\xF6\xDFt",
      stie\u00DFen: "sto\xDFen",
      goss: "gie\xDFt",
      band: "bindet",
      banden: "binden",
      zwang: "zwingt",
      fing: "f\xE4ngt",
      fingen: "fangen",
      sandte: "sendet",
      mochte: "mag",
      mochten: "m\xF6gen",
      stahl: "stiehlt",
      galt: "gilt",
      galten: "gelten",
      gelang: "gelingt",
      verband: "verbindet",
      erhielt: "erh\xE4lt",
      erhielten: "erhalten",
      behielt: "beh\xE4lt",
      enthielt: "enth\xE4lt",
      verlie\u00DF: "verl\xE4sst",
      verlie\u00DFen: "verlassen",
      genoss: "genie\xDFt",
      schlich: "schleicht",
      strich: "streicht",
      blies: "bl\xE4st",
      lud: "l\xE4dt",
      luden: "laden",
      schuf: "schafft",
      schufen: "schaffen",
      log: "l\xFCgt",
      betrog: "betr\xFCgt",
      flocht: "flicht",
      kroch: "kriecht",
      krochen: "kriechen",
      schmolz: "schmilzt",
      quoll: "quillt",
      quollen: "quellen",
      verging: "vergeht",
      vergingen: "vergehen",
      entging: "entgeht",
      erging: "ergeht",
      erschrak: "erschrickt",
      war: "ist",
      waren: "sind",
      warst: "bist",
      hatte: "hat",
      hatten: "haben",
      hattest: "hast",
      wurde: "wird",
      wurden: "werden",
      ging: "geht",
      gingen: "gehen",
      kam: "kommt",
      kamen: "kommen",
      sah: "sieht",
      sahen: "sehen",
      gab: "gibt",
      gaben: "geben",
      stand: "steht",
      standen: "stehen",
      blieb: "bleibt",
      blieben: "bleiben",
      hielt: "h\xE4lt",
      hielten: "halten",
      lie\u00DF: "l\xE4sst",
      lie\u00DFen: "lassen",
      fand: "findet",
      fanden: "finden",
      nahm: "nimmt",
      nahmen: "nehmen",
      sprach: "spricht",
      sprachen: "sprechen",
      schrieb: "schreibt",
      schrieben: "schreiben",
      trug: "tr\xE4gt",
      trugen: "tragen",
      fuhr: "f\xE4hrt",
      fuhren: "fahren",
      lief: "l\xE4uft",
      liefen: "laufen",
      sa\u00DF: "sitzt",
      sa\u00DFen: "sitzen",
      lag: "liegt",
      lagen: "liegen",
      hie\u00DF: "hei\xDFt",
      hie\u00DFen: "hei\xDFen",
      zog: "zieht",
      zogen: "ziehen",
      schlief: "schl\xE4ft",
      schliefen: "schlafen",
      rief: "ruft",
      riefen: "rufen",
      fiel: "f\xE4llt",
      fielen: "fallen",
      sang: "singt",
      sangen: "singen",
      trank: "trinkt",
      tranken: "trinken",
      schwieg: "schweigt",
      schwiegen: "schweigen",
      floss: "flie\xDFt",
      flossen: "flie\xDFen",
      stieg: "steigt",
      stiegen: "steigen",
      sank: "sinkt",
      sanken: "sinken",
      bot: "bietet",
      boten: "bieten",
      schloss: "schlie\xDFt",
      schlossen: "schlie\xDFen",
      verlor: "verliert",
      verloren: "verlieren",
      begann: "beginnt",
      begannen: "beginnen",
      geschah: "geschieht",
      geschahen: "geschehen",
      konnte: "kann",
      konnten: "k\xF6nnen",
      musste: "muss",
      mussten: "m\xFCssen",
      wollte: "will",
      wollten: "wollen",
      sollte: "soll",
      sollten: "sollen",
      durfte: "darf",
      durften: "d\xFCrfen",
      wusste: "wei\xDF",
      wussten: "wissen",
      dachte: "denkt",
      dachten: "denken",
      brachte: "bringt",
      brachten: "bringen",
      kannte: "kennt",
      kannten: "kennen",
      erkannte: "erkennt",
      erkannten: "erkennen",
      brannte: "brennt",
      brannten: "brennen",
      nannte: "nennt",
      nannten: "nennen",
      rannte: "rennt",
      rannten: "rennen",
      wandte: "wendet",
      wandten: "wenden",
      sprang: "springt",
      sprangen: "springen",
      schrie: "schreit",
      schrien: "schreien",
      flog: "fliegt",
      flogen: "fliegen",
      floh: "flieht",
      flohen: "fliehen",
      schoss: "schie\xDFt",
      schossen: "schie\xDFen",
      riss: "rei\xDFt",
      rissen: "rei\xDFen",
      biss: "bei\xDFt",
      bissen: "bei\xDFen",
      griff: "greift",
      griffen: "greifen",
      pfiff: "pfeift",
      pfiffen: "pfeifen",
      schnitt: "schneidet",
      schnitten: "schneiden",
      litt: "leidet",
      litten: "leiden",
      trat: "tritt",
      traten: "treten",
      verga\u00DF: "vergisst",
      verga\u00DFen: "vergessen",
      wuchs: "w\xE4chst",
      wuchsen: "wachsen",
      wich: "weicht",
      wichen: "weichen",
      schien: "scheint",
      schienen: "scheinen",
      zerbrach: "zerbricht",
      zerbrachen: "zerbrechen",
      verschwand: "verschwindet",
      verschwanden: "verschwinden",
      erschien: "erscheint",
      erschienen: "erscheinen",
      starb: "stirbt",
      starben: "sterben",
      brach: "bricht",
      brachen: "brechen",
      sprach2: "spricht",
      schwoll: "schwillt",
      schwollen: "schwellen",
      bog: "biegt",
      bogen: "biegen",
      hob: "hebt",
      hoben: "heben",
      wob: "webt",
      woben: "weben",
      klang: "klingt",
      klangen: "klingen",
      sann: "sinnt",
      sannen: "sinnen",
      rann: "rinnt",
      rannen: "rinnen",
      schwamm: "schwimmt",
      schwammen: "schwimmen",
      verschwieg: "verschweigt",
      zerfiel: "zerf\xE4llt",
      zerfielen: "zerfallen",
      entstand: "entsteht",
      entstanden: "entstehen",
      verstand: "versteht",
      verstanden: "verstehen",
      bestand: "besteht",
      bestanden: "bestehen",
      geriet: "ger\xE4t",
      gerieten: "geraten",
      trieb: "treibt",
      trieben: "treiben",
      schrak: "schrickt",
      wies: "weist",
      wiesen: "weisen",
      hing: "h\xE4ngt",
      hingen: "h\xE4ngen",
      schwand: "schwindet",
      schwanden: "schwinden",
      gewann: "gewinnt",
      gewannen: "gewinnen",
      zerriss: "zerrei\xDFt",
      zerrissen2: "zerrei\xDFen",
      empfand: "empfindet",
      empfanden: "empfinden",
      befahl: "befiehlt",
      befahlen: "befehlen",
      half: "hilft",
      halfen: "helfen",
      warf: "wirft",
      warfen: "werfen",
      starrte2: "starrt",
      las: "liest",
      lasen: "lesen",
      a\u00DF: "isst",
      a\u00DFen: "essen",
      bat: "bittet",
      baten: "bitten"
    };
    VERB_INFINITIVE = new Set(GRUND.split(/\s+/).map((w) => w.trim()).filter((w) => w.length > 2));
  }
});

// src/generation/verben.ts
function starkMitPraefix(form) {
  if (STARK[form]) return ["", STARK[form]];
  for (const p of PRAEFIXE) {
    if (form.startsWith(p) && form.length > p.length + 2) {
      const rest = form.slice(p.length);
      if (STARK[rest]) return [p, STARK[rest]];
    }
  }
  return null;
}
function kenntInfinitiv(wort) {
  const w = wort.toLowerCase();
  if (VERB_INFINITIVE.has(w)) return true;
  for (const p of VERB_PRAEFIXE) {
    if (w.startsWith(p) && w.length > p.length + 3 && VERB_INFINITIVE.has(w.slice(p.length))) return true;
  }
  return false;
}
function infinitivZuStamm(stamm) {
  const s = stamm.toLowerCase();
  if (!s) return null;
  const kandidaten = [s + "en", s + "n", s + "eln", s + "ern"];
  if (/e[lr]$/.test(s)) kandidaten.unshift(s + "n");
  const st = starkMitPraefix(s + "t");
  if (st) return st[0] + st[1][2];
  for (const k of kandidaten) if (kenntInfinitiv(k)) return k;
  return null;
}
function istLexikonVerb(wort) {
  const w = wort.toLowerCase().replace(/[^a-zäöüß]/g, "");
  if (!w || w.length < 3) return false;
  if (starkMitPraefix(w)) return true;
  if (kenntInfinitiv(w)) return true;
  if (PAST2PRES[w]) return true;
  if (/^(bin|bist|sind|seid|habe|hast|habt|werde|wirst|werdet|wäre|wären|hätte|hätten|würde|würden|sei|seien)$/.test(w)) return true;
  for (const suffix of ["etest", "test", "eten", "ten", "ete", "te", "est", "st", "et", "en", "t", "e", "tet"]) {
    if (!w.endsWith(suffix) || w.length - suffix.length < 2) continue;
    const st = w.slice(0, -suffix.length);
    if (/ier$/.test(st)) return true;
    if (infinitivZuStamm(st)) return true;
  }
  const pz = w.match(/^(?:[a-zäöü]{2,8})?ge(.+?)(?:t|en)$/);
  if (pz && infinitivZuStamm(pz[1])) return true;
  return false;
}
function istVerbform(wort) {
  const w = wort.toLowerCase();
  if (starkMitPraefix(w)) return true;
  if (KEIN_VERB.has(w)) return false;
  if (/^[a-zäöüß]{3,}(t|st|e|en)$/.test(w) && istLexikonVerb(w)) return true;
  if (!/^[a-zäöüß]{3,}t$/.test(w)) return false;
  if (/^ge[a-zäöüß]{2,}t$/.test(w)) return GE_VERBEN.test(w);
  return true;
}
var STARK, PRAEFIXE, KEIN_VERB, GE_VERBEN;
var init_verben = __esm({
  "src/generation/verben.ts"() {
    "use strict";
    init_verblex_data();
    STARK = {
      // sein · haben · werden · wissen · tun · Modalverben
      ist: ["bin", "bist", "sind", "seid"],
      hat: ["habe", "hast", "haben", "habt"],
      wird: ["werde", "wirst", "werden", "werdet"],
      wei\u00DF: ["wei\xDF", "wei\xDFt", "wissen", "wisst"],
      tut: ["tue", "tust", "tun", "tut"],
      kann: ["kann", "kannst", "k\xF6nnen", "k\xF6nnt"],
      muss: ["muss", "musst", "m\xFCssen", "m\xFCsst"],
      will: ["will", "willst", "wollen", "wollt"],
      soll: ["soll", "sollst", "sollen", "sollt"],
      darf: ["darf", "darfst", "d\xFCrfen", "d\xFCrft"],
      mag: ["mag", "magst", "m\xF6gen", "m\xF6gt"],
      // a → ä
      h\u00E4lt: ["halte", "h\xE4ltst", "halten", "haltet"],
      f\u00E4llt: ["falle", "f\xE4llst", "fallen", "fallt"],
      tr\u00E4gt: ["trage", "tr\xE4gst", "tragen", "tragt"],
      l\u00E4uft: ["laufe", "l\xE4ufst", "laufen", "lauft"],
      schl\u00E4ft: ["schlafe", "schl\xE4fst", "schlafen", "schlaft"],
      f\u00E4ngt: ["fange", "f\xE4ngst", "fangen", "fangt"],
      l\u00E4sst: ["lasse", "l\xE4sst", "lassen", "lasst"],
      w\u00E4chst: ["wachse", "w\xE4chst", "wachsen", "wachst"],
      gr\u00E4bt: ["grabe", "gr\xE4bst", "graben", "grabt"],
      schl\u00E4gt: ["schlage", "schl\xE4gst", "schlagen", "schlagt"],
      r\u00E4t: ["rate", "r\xE4tst", "raten", "ratet"],
      bl\u00E4st: ["blase", "bl\xE4st", "blasen", "blast"],
      st\u00F6\u00DFt: ["sto\xDFe", "st\xF6\xDFt", "sto\xDFen", "sto\xDFt"],
      f\u00E4hrt: ["fahre", "f\xE4hrst", "fahren", "fahrt"],
      w\u00E4scht: ["wasche", "w\xE4schst", "waschen", "wascht"],
      l\u00E4dt: ["lade", "l\xE4dst", "laden", "ladet"],
      s\u00E4uft: ["saufe", "s\xE4ufst", "saufen", "sauft"],
      // e → i / ie
      gibt: ["gebe", "gibst", "geben", "gebt"],
      nimmt: ["nehme", "nimmst", "nehmen", "nehmt"],
      spricht: ["spreche", "sprichst", "sprechen", "sprecht"],
      bricht: ["breche", "brichst", "brechen", "brecht"],
      sieht: ["sehe", "siehst", "sehen", "seht"],
      liest: ["lese", "liest", "lesen", "lest"],
      isst: ["esse", "isst", "essen", "esst"],
      frisst: ["fresse", "frisst", "fressen", "fresst"],
      misst: ["messe", "misst", "messen", "messt"],
      vergisst: ["vergesse", "vergisst", "vergessen", "vergesst"],
      hilft: ["helfe", "hilfst", "helfen", "helft"],
      stirbt: ["sterbe", "stirbst", "sterben", "sterbt"],
      wirft: ["werfe", "wirfst", "werfen", "werft"],
      trifft: ["treffe", "triffst", "treffen", "trefft"],
      gilt: ["gelte", "giltst", "gelten", "geltet"],
      tritt: ["trete", "trittst", "treten", "tretet"],
      birgt: ["berge", "birgst", "bergen", "bergt"],
      quillt: ["quelle", "quillst", "quellen", "quellt"],
      schilt: ["schelte", "schiltst", "schelten", "scheltet"],
      ficht: ["fechte", "fichtst", "fechten", "fechtet"],
      flicht: ["flechte", "flichtst", "flechten", "flechtet"],
      verdirbt: ["verderbe", "verdirbst", "verderben", "verderbt"],
      wirbt: ["werbe", "wirbst", "werben", "werbt"],
      erschrickt: ["erschrecke", "erschrickst", "erschrecken", "erschreckt"],
      sticht: ["steche", "stichst", "stechen", "stecht"],
      schmilzt: ["schmelze", "schmilzt", "schmelzen", "schmelzt"],
      befiehlt: ["befehle", "befiehlst", "befehlen", "befehlt"],
      stiehlt: ["stehle", "stiehlst", "stehlen", "stehlt"],
      empfiehlt: ["empfehle", "empfiehlst", "empfehlen", "empfehlt"],
      geschieht: ["geschehe", "geschiehst", "geschehen", "gescheht"],
      gebiert: ["geb\xE4re", "gebierst", "geb\xE4ren", "geb\xE4rt"],
      schwillt: ["schwelle", "schwillst", "schwellen", "schwellt"]
    };
    PRAEFIXE = [
      "zusammen",
      "zur\xFCck",
      "wieder",
      "gegen",
      "hinter",
      "durch",
      "unter",
      "\xFCber",
      "voran",
      "vorbei",
      "heraus",
      "herein",
      "hinaus",
      "hinein",
      "herum",
      "hinauf",
      "hinab",
      "herab",
      "empor",
      "fort",
      "los",
      "weg",
      "fest",
      "her",
      "hin",
      "ver",
      "ent",
      "emp",
      "miss",
      "zer",
      "be",
      "er",
      "ge",
      "an",
      "ab",
      "auf",
      "aus",
      "ein",
      "mit",
      "nach",
      "vor",
      "zu",
      "um",
      "bei",
      "da",
      "wider"
    ];
    KEIN_VERB = /* @__PURE__ */ new Set([
      "alt",
      "kalt",
      "laut",
      "bunt",
      "hart",
      "zart",
      "satt",
      "glatt",
      "weit",
      "breit",
      "rot",
      "tot",
      "gut",
      "sp\xE4t",
      "echt",
      "leicht",
      "dicht",
      "recht",
      "schlecht",
      "nackt",
      "fest",
      "letzt",
      "jetzt",
      "sanft",
      "ernst",
      "wert",
      "seit",
      "statt",
      "samt",
      "nicht",
      "mit",
      "seid",
      "zuletzt",
      "zuerst",
      "oft",
      "fast",
      "erst",
      "sonst",
      "meist",
      "direkt",
      "dort",
      "fort",
      "sofort",
      "selbst",
      "vielleicht",
      "\xFCberhaupt",
      "bereit",
      "gerecht",
      "perfekt",
      "exakt",
      "absolut",
      "gesamt",
      "komplett",
      "verr\xFCckt",
      "bekannt",
      "geschickt",
      "welt",
      "zeit",
      "nacht",
      "stadt",
      "acht",
      "licht",
      "wort",
      "ort",
      "blut",
      "brot",
      "mut",
      "hut",
      "gebet",
      "geist",
      "gott",
      "kraft",
      "luft",
      "haut",
      "haft",
      "gift",
      "schrift",
      "frucht",
      "flucht",
      "sicht",
      "pflicht",
      "angst",
      "kunst",
      "dienst",
      "frost",
      "post",
      "ost",
      "west",
      "rest",
      "test",
      "text",
      "w\xFCst",
      "getrennt",
      "gemischt",
      "gebrannt",
      "verschwunden",
      "gewohnt",
      "gelaunt",
      "ber\xFChmt",
      "geliebt",
      "gelebt",
      "gedacht",
      "gemacht",
      "gebracht",
      "gesagt",
      "gesucht",
      "gehabt",
      "gewusst",
      "gekannt",
      "genannt",
      "benannt",
      "gewollt",
      "verboten",
      "ge\xF6ffnet",
      "ungeahnt",
      "gestern",
      "heut",
      "abrupt",
      "ad\xE4quat",
      "privat",
      "intakt",
      "korrekt",
      "konkret",
      "moderat",
      "elegant",
      "brillant",
      "tolerant",
      "relevant",
      "markant",
      "rasant",
      "galant",
      "latent",
      "dezent",
      "prominent",
      "kompetent",
      "konsequent",
      "permanent",
      "evident",
      "eloquent",
      "intelligent",
      "gespannt",
      "entspannt",
      "gewandt",
      "verwandt",
      "bewusst",
      "unbewusst",
      "robust",
      "abstrakt",
      "kompakt",
      "exakt",
      "defekt",
      "perfekt",
      "insgesamt",
      "total"
    ]);
    GE_VERBEN = /^ge(ht|nügt|hört|horcht|lingt|winnt|langt|schieht|steht|rät|nießt|wöhnt|fährdet|währt|stattet|staltet|denkt|bietet|braucht|hörcht|nest|reicht|dulde?t|fällt|deiht|lobt|leitet|langt|winnt|behrt|bärt|fried[e]?t|fällt|lüstet|mahnt|rinnt|hört)$/;
  }
});

// src/generation/nouns.data.ts
var NOUN_GENDER;
var init_nouns_data = __esm({
  "src/generation/nouns.data.ts"() {
    "use strict";
    NOUN_GENDER = {
      "abdruck": "m",
      "abend": "m",
      "abgrund": "m",
      "absatz": "m",
      "abschalten": "n",
      "abstand": "m",
      "acker": "m",
      "ader": "f",
      "adressbuch": "n",
      "adresse": "f",
      "ahnung": "f",
      "airpod": "m",
      "akku": "m",
      "akte": "f",
      "aktendeckel": "m",
      "aktennotiz": "f",
      "allee": "f",
      "alptraum": "m",
      "altar": "m",
      "alte": "f",
      "alter": "n",
      "amt": "n",
      "amulett": "n",
      "angebot": "n",
      "angst": "f",
      "anker": "m",
      "antenne": "f",
      "antrag": "m",
      "antwort": "f",
      "apfel": "m",
      "applaus": "m",
      "archiv": "n",
      "arm": "m",
      "armband": "n",
      "armbrust": "f",
      "art": "f",
      "arzt": "m",
      "asche": "f",
      "ast": "m",
      "atelier": "n",
      "atem": "m",
      "atmosph\xE4re": "f",
      "aufkleber": "m",
      "aufnahme": "f",
      "auftrag": "m",
      "auge": "n",
      "augenblick": "m",
      "augenlid": "n",
      "ausdehnung": "f",
      "ausgang": "m",
      "ausnahme": "f",
      "ausrede": "f",
      "ausweis": "m",
      "axiom": "n",
      "baby": "n",
      "bach": "m",
      "backup": "n",
      "badeanstalt": "f",
      "bahn": "f",
      "bahnkarte": "f",
      "balkon": "m",
      "ball": "m",
      "ballade": "f",
      "band": "n",
      "bank": "f",
      "banner": "n",
      "basecap": "n",
      "bau": "m",
      "bauch": "m",
      "bauer": "m",
      "baum": "m",
      "becher": "m",
      "befehl": "m",
      "begriff": "m",
      "beil": "n",
      "bein": "n",
      "benachrichtigung": "f",
      "berg": "m",
      "bergfried": "m",
      "bericht": "m",
      "bescheid": "m",
      "beschluss": "m",
      "besen": "m",
      "besitz": "m",
      "bestand": "m",
      "besuch": "m",
      "betonprobe": "f",
      "bett": "n",
      "beutel": "m",
      "beweis": "m",
      "bibel": "f",
      "bibliothek": "f",
      "biene": "f",
      "bild": "n",
      "bildschirm": "m",
      "binde": "f",
      "birne": "f",
      "blatt": "n",
      "blechb\xFCchse": "f",
      "blechdose": "f",
      "blechkanne": "f",
      "blechtrompete": "f",
      "blei": "n",
      "bleistift": "m",
      "blende": "f",
      "blick": "m",
      "blitz": "m",
      "blume": "f",
      "blumenstrau\xDF": "m",
      "bluse": "f",
      "bl\xFCte": "f",
      "boden": "m",
      "bohne": "f",
      "bohrkern": "m",
      "bohrprobe": "f",
      "boje": "f",
      "bonbon": "n",
      "boot": "n",
      "bote": "m",
      "botschaft": "f",
      "braten": "m",
      "braue": "f",
      "brett": "n",
      "brief": "m",
      "briefumschlag": "m",
      "brille": "f",
      "brot": "n",
      "brotdose": "f",
      "brotlaib": "m",
      "bruch": "m",
      "bruder": "m",
      "brunnen": "m",
      "brust": "f",
      "br\xFCcke": "f",
      "br\xFChe": "f",
      "buch": "n",
      "buchstabe": "m",
      "bucht": "f",
      "bug": "m",
      "burg": "f",
      "bus": "m",
      "busch": "m",
      "butter": "f",
      "b\xE4r": "m",
      "b\xFChne": "f",
      "b\xFCndel": "n",
      "b\xFCrde": "f",
      "cache": "m",
      "cadtablet": "n",
      "caf": "n",
      "caf\xE9": "n",
      "chat": "m",
      "clown": "m",
      "computer": "m",
      "container": "m",
      "couch": "f",
      "dach": "n",
      "dachboden": "m",
      "dame": "f",
      "damm": "m",
      "dashboard": "n",
      "datei": "f",
      "dattel": "f",
      "datum": "n",
      "daumen": "m",
      "deck": "n",
      "decke": "f",
      "deckel": "m",
      "denkmalschutz": "m",
      "deo": "n",
      "detail": "n",
      "detektor": "m",
      "detektorkopf": "m",
      "dewar": "m",
      "diagramm": "n",
      "dichter": "m",
      "dieb": "m",
      "dienst": "m",
      "direktor": "m",
      "dnaspirale": "f",
      "dokument": "n",
      "dolch": "m",
      "donner": "m",
      "dorf": "n",
      "dorn": "m",
      "dose": "f",
      "draht": "m",
      "droschke": "f",
      "druck": "m",
      "duell": "n",
      "duft": "m",
      "durchsage": "f",
      "durchschlag": "m",
      "d\xE4mmerung": "f",
      "ebbe": "f",
      "ebene": "f",
      "echo": "n",
      "ecke": "f",
      "ehre": "f",
      "ei": "n",
      "eid": "m",
      "einspruch": "m",
      "eis": "n",
      "eisen": "n",
      "elch": "m",
      "elend": "n",
      "ellbogen": "m",
      "emoji": "n",
      "engel": "m",
      "enkel": "m",
      "ente": "f",
      "entwurf": "m",
      "ephemeride": "f",
      "erbe": "n",
      "erbse": "f",
      "erdbeben": "n",
      "erde": "f",
      "erinnerung": "f",
      "etikett": "n",
      "eule": "f",
      "ewigkeit": "f",
      "fabel": "f",
      "fabrik": "f",
      "fackel": "f",
      "faden": "m",
      "fahne": "f",
      "fahrschein": "m",
      "fahrt": "f",
      "falle": "f",
      "falte": "f",
      "farbe": "f",
      "farbenscheibe": "f",
      "fass": "n",
      "faust": "f",
      "feder": "f",
      "federkiel": "m",
      "fee": "f",
      "fehlercode": "m",
      "feile": "f",
      "feind": "m",
      "feld": "n",
      "feldbesteck": "n",
      "felder": "n",
      "fell": "n",
      "fellhandschuh": "m",
      "fels": "m",
      "felsen": "m",
      "fenster": "n",
      "fensterplatz": "m",
      "ferkel": "n",
      "ferne": "f",
      "fernglas": "n",
      "fernrohr": "n",
      "ferse": "f",
      "fessel": "f",
      "festung": "f",
      "feuer": "n",
      "feuerzeug": "n",
      "fibel": "f",
      "fieber": "n",
      "filter": "m",
      "finger": "m",
      "fingerhut": "m",
      "fisch": "m",
      "fischer": "m",
      "flakon": "m",
      "flasche": "f",
      "flaute": "f",
      "fleisch": "n",
      "fliege": "f",
      "flo\xDF": "n",
      "fluch": "m",
      "flucht": "f",
      "flur": "m",
      "fluss": "m",
      "flut": "f",
      "fl\xE4che": "f",
      "fl\xF6te": "f",
      "fl\xFCstern": "n",
      "formel": "f",
      "formular": "n",
      "fossil": "n",
      "fossilie": "f",
      "foto": "n",
      "fotografie": "f",
      "frachtbrief": "m",
      "frage": "f",
      "frau": "f",
      "freude": "f",
      "freund": "m",
      "frist": "f",
      "frost": "m",
      "frucht": "f",
      "fr\xFChling": "m",
      "fuchs": "m",
      "fuge": "f",
      "fund": "m",
      "fundament": "n",
      "funke": "m",
      "funkger\xE4t": "n",
      "furcht": "f",
      "furt": "f",
      "fu\xDF": "m",
      "f\xE4hrmann": "m",
      "f\xE4hrplan": "m",
      "f\xE4sser": "n",
      "f\xFCrst": "m",
      "gabe": "f",
      "gabel": "f",
      "gabelung": "f",
      "galaxie": "f",
      "gang": "m",
      "gans": "f",
      "garn": "n",
      "garten": "m",
      "gasse": "f",
      "gast": "m",
      "gebet": "n",
      "gebetbuch": "n",
      "gebete": "n",
      "gebetsschale": "f",
      "gebirge": "n",
      "geb\xE4lk": "n",
      "geb\xE4ude": "n",
      "gedanke": "m",
      "gedanken": "m",
      "gedicht": "n",
      "gedichte": "n",
      "geduld": "f",
      "gefahr": "f",
      "gef\xFChl": "n",
      "gef\xFChlen": "n",
      "gegend": "f",
      "gegensatz": "m",
      "gegenstand": "m",
      "gegens\xE4tze": "m",
      "gegenteil": "n",
      "gegenwart": "f",
      "gegners": "m",
      "geheimnis": "n",
      "gehirn": "n",
      "geh\xE4use": "n",
      "geige": "f",
      "geist": "m",
      "geleitbrief": "m",
      "gel\xE4nde": "n",
      "gel\xFCbde": "n",
      "gemach": "n",
      "gem\xE4lde": "n",
      "gem\xFCse": "n",
      "gep\xE4ck": "n",
      "gericht": "n",
      "geruch": "m",
      "ger\xE4t": "n",
      "ger\xE4usch": "n",
      "ger\xE4usche": "n",
      "ger\xF6ll": "n",
      "ger\xFCcht": "n",
      "ger\xFCchte": "n",
      "ger\xFCst": "n",
      "gesangbuch": "n",
      "geschenk": "n",
      "geschichte": "f",
      "geschichten": "f",
      "geschmack": "m",
      "gesetz": "n",
      "gesetze": "n",
      "gesetzen": "n",
      "gesetzes": "n",
      "gesetzestext": "m",
      "gesicht": "n",
      "gesichter": "n",
      "gespr\xE4ch": "n",
      "gestalt": "f",
      "gestalten": "f",
      "geste": "f",
      "gestein": "n",
      "gesteinsschichten": "f",
      "getreide": "n",
      "getreidek\xF6rner": "n",
      "gewand": "n",
      "gewebe": "n",
      "gewehr": "n",
      "gewehre": "n",
      "geweih": "n",
      "gewicht": "n",
      "gewichte": "n",
      "gewissen": "n",
      "gew\xF6lbe": "n",
      "gezeiten": "f",
      "gier": "f",
      "gie\xDFkanne": "f",
      "gift": "n",
      "gipfel": "m",
      "gitter": "n",
      "glas": "n",
      "glasplatte": "f",
      "glaube": "m",
      "gleichung": "f",
      "gletscher": "m",
      "glocke": "f",
      "gl\xFCck": "n",
      "gold": "n",
      "gott": "m",
      "grab": "n",
      "graben": "m",
      "granitblock": "m",
      "grenze": "f",
      "grotte": "f",
      "grund": "m",
      "grundrissplan": "m",
      "gruppe": "f",
      "gruppenchat": "m",
      "gurke": "f",
      "g\xF6tter": "m",
      "g\xF6ttin": "f",
      "g\xFCrtel": "m",
      "haar": "n",
      "haarnadel": "f",
      "hafen": "m",
      "hagel": "m",
      "hahn": "m",
      "hain": "m",
      "haken": "m",
      "halde": "f",
      "hall": "m",
      "halle": "f",
      "hals": "m",
      "halter": "m",
      "hammer": "m",
      "hand": "f",
      "handbuch": "n",
      "handkarren": "m",
      "handschuh": "m",
      "handschuhspitze": "f",
      "handvoll": "f",
      "handy": "n",
      "hang": "m",
      "harfe": "f",
      "harpune": "f",
      "hase": "m",
      "hass": "m",
      "haus": "n",
      "haut": "f",
      "hecke": "f",
      "heft": "n",
      "held": "m",
      "helm": "m",
      "hemd": "n",
      "henne": "f",
      "herbst": "m",
      "herd": "m",
      "herr": "m",
      "herrscherstab": "m",
      "herz": "n",
      "herzschlag": "m",
      "heuer": "f",
      "hexe": "f",
      "hierarchie": "f",
      "himmel": "m",
      "hintergrund": "m",
      "hintert\xFCr": "f",
      "hirn": "n",
      "hirsch": "m",
      "hirtenstab": "m",
      "hof": "m",
      "hoffnung": "f",
      "holz": "n",
      "honig": "m",
      "hoodie": "m",
      "horn": "n",
      "hose": "f",
      "huhn": "n",
      "hund": "m",
      "hut": "m",
      "h\xE4user": "n",
      "h\xF6henmesser": "m",
      "h\xF6hle": "f",
      "h\xFCfte": "f",
      "h\xFCgel": "m",
      "h\xFCtte": "f",
      "igel": "m",
      "index": "m",
      "insekt": "n",
      "insel": "f",
      "instanz": "f",
      "instastory": "f",
      "instrument": "n",
      "interferometer": "n",
      "jacke": "f",
      "jazz": "m",
      "junge": "m",
      "justiergewicht": "n",
      "j\xE4ger": "m",
      "kabel": "n",
      "kaffee": "m",
      "kai": "m",
      "kaiser": "m",
      "kalb": "n",
      "kalender": "m",
      "kamin": "m",
      "kaminfeuer": "n",
      "kammer": "f",
      "kampf": "m",
      "kanal": "m",
      "kaninchen": "n",
      "kanister": "m",
      "kanne": "f",
      "kanten": "m",
      "kapelle": "f",
      "kapit\xE4n": "m",
      "karawane": "f",
      "karotte": "f",
      "karte": "f",
      "karteikarte": "f",
      "kartoffel": "f",
      "kassenbuch": "n",
      "kathedrale": "f",
      "katze": "f",
      "kaugummi": "m",
      "kehle": "f",
      "kelch": "m",
      "kelle": "f",
      "keller": "m",
      "kerze": "f",
      "kessel": "m",
      "kette": "f",
      "kettenhemd": "n",
      "kiefer": "m",
      "kiel": "m",
      "kies": "m",
      "kilometer": "m",
      "kind": "n",
      "kinder": "n",
      "kinderspielzeug": "n",
      "kinn": "n",
      "kirche": "f",
      "kirsche": "f",
      "kissen": "n",
      "kiste": "f",
      "klammer": "f",
      "klang": "m",
      "klaue": "f",
      "klavier": "n",
      "kleid": "n",
      "kleidersack": "m",
      "kleingeldfach": "n",
      "kleinod": "n",
      "klinge": "f",
      "klingel": "f",
      "klippe": "f",
      "klopfen": "n",
      "knabe": "m",
      "knie": "n",
      "knochen": "m",
      "knopf": "m",
      "knospe": "f",
      "knoten": "m",
      "kn\xE4uel": "n",
      "kn\xF6chel": "m",
      "koffer": "m",
      "kohleneimer": "m",
      "kohleschale": "f",
      "kollege": "m",
      "kollegheft": "n",
      "kollektiv": "n",
      "kolonie": "f",
      "komet": "m",
      "kommentar": "m",
      "kommissar": "m",
      "kompass": "m",
      "kompressor": "m",
      "konstante": "f",
      "konto": "n",
      "kontobuch": "n",
      "kontor": "n",
      "kontorbuch": "n",
      "kontostand": "m",
      "kopf": "m",
      "kopfh\xF6rer": "m",
      "kopie": "f",
      "korb": "m",
      "korken": "m",
      "korn": "n",
      "kraft": "f",
      "kran": "m",
      "krater": "m",
      "kreide": "f",
      "kreis": "m",
      "kreuz": "n",
      "kreuzung": "f",
      "kribbeln": "n",
      "krieg": "m",
      "krieger": "m",
      "kristall": "m",
      "krone": "f",
      "krug": "m",
      "kr\xE4he": "f",
      "kuchen": "m",
      "kuh": "f",
      "kupfer": "n",
      "kuppel": "f",
      "kurbel": "f",
      "kurve": "f",
      "kuss": "m",
      "kutsche": "f",
      "kuvert": "n",
      "k\xE4fer": "m",
      "k\xE4lte": "f",
      "k\xE4se": "m",
      "k\xF6nig": "m",
      "k\xF6nigin": "f",
      "k\xF6rper": "m",
      "k\xFCche": "f",
      "k\xFChlbox": "f",
      "k\xFChlfalle": "f",
      "k\xFCken": "n",
      "k\xFCste": "f",
      "labyrinth": "n",
      "ladebalken": "m",
      "ladekabel": "n",
      "ladeliste": "f",
      "lager": "n",
      "lagune": "f",
      "laib": "m",
      "lamm": "n",
      "lampe": "f",
      "land": "n",
      "lanze": "f",
      "laterne": "f",
      "laub": "n",
      "laufzettel": "m",
      "laute": "f",
      "lawine": "f",
      "leder": "n",
      "lederbeutel": "m",
      "legende": "f",
      "lehen": "n",
      "lehrer": "m",
      "leid": "n",
      "leine": "f",
      "leitdetail": "n",
      "leitung": "f",
      "leuchten": "n",
      "leuchtturm": "m",
      "licht": "n",
      "lichtstreifen": "m",
      "lider": "n",
      "liebe": "f",
      "lied": "n",
      "lilie": "f",
      "lineal": "n",
      "linie": "f",
      "lippe": "f",
      "liste": "f",
      "loch": "n",
      "locke": "f",
      "log": "n",
      "logbuch": "n",
      "logfile": "n",
      "los": "n",
      "lot": "n",
      "luft": "f",
      "lupe": "f",
      "lust": "f",
      "l\xE4cheln": "n",
      "l\xE4nder": "n",
      "l\xE4rm": "m",
      "l\xF6cher": "n",
      "l\xF6ffel": "m",
      "l\xF6we": "m",
      "l\xFCcke": "f",
      "l\xFCge": "f",
      "macht": "f",
      "magen": "m",
      "mala": "f",
      "maler": "m",
      "manege": "f",
      "manifest": "n",
      "mann": "m",
      "mantel": "m",
      "manuskript": "n",
      "mappe": "f",
      "marmelade": "f",
      "masche": "f",
      "maschine": "f",
      "maske": "f",
      "mast": "m",
      "matte": "f",
      "mauer": "f",
      "maus": "f",
      "ma\xDF": "n",
      "ma\xDFband": "n",
      "ma\xDFstab": "m",
      "medaillon": "n",
      "meer": "n",
      "mehl": "n",
      "mei\xDFel": "m",
      "melodie": "f",
      "meme": "n",
      "menge": "f",
      "merkblatt": "n",
      "messer": "n",
      "messprotokoll": "n",
      "messreihe": "f",
      "messung": "f",
      "metall": "n",
      "meter": "m",
      "metronom": "n",
      "miene": "f",
      "mikrofon": "n",
      "mikroskop": "n",
      "milch": "f",
      "millimeter": "m",
      "minute": "f",
      "mitleid": "n",
      "mittag": "m",
      "mittel": "n",
      "mitternacht": "f",
      "modell": "n",
      "modellplaneten": "m",
      "moment": "m",
      "monat": "m",
      "mond": "m",
      "moor": "n",
      "morgen": "m",
      "moschee": "f",
      "motor": "m",
      "mus": "n",
      "muschel": "f",
      "muskel": "m",
      "muster": "n",
      "mut": "m",
      "mutter": "f",
      "m\xE4dchen": "n",
      "m\xE4hne": "f",
      "m\xF6hre": "f",
      "m\xF6nch": "m",
      "m\xF6rder": "m",
      "m\xF6we": "f",
      "m\xFCcke": "f",
      "m\xFChle": "f",
      "m\xFCller": "m",
      "m\xFCnze": "f",
      "m\xFCtze": "f",
      "nachbar": "m",
      "nachbarort": "m",
      "nachlass": "m",
      "nachmittag": "m",
      "nachricht": "f",
      "nacht": "f",
      "nachtigall": "f",
      "nacken": "m",
      "nadel": "f",
      "nadelkissen": "n",
      "nagel": "m",
      "naht": "f",
      "name": "m",
      "napf": "m",
      "narbe": "f",
      "nase": "f",
      "nebel": "m",
      "neffe": "m",
      "neid": "m",
      "neigung": "f",
      "neigungsmesser": "m",
      "nelke": "f",
      "nest": "n",
      "nester": "n",
      "netz": "n",
      "nische": "f",
      "nonne": "f",
      "note": "f",
      "notenblatt": "n",
      "notiz": "f",
      "notizblock": "m",
      "notizbuch": "n",
      "nummer": "f",
      "nuss": "f",
      "nymphe": "f",
      "n\xE4he": "f",
      "obst": "n",
      "ofen": "m",
      "ohr": "n",
      "oma": "f",
      "omen": "n",
      "onkel": "m",
      "opfer": "n",
      "opferschale": "f",
      "opiumdose": "f",
      "orakel": "n",
      "orange": "f",
      "organ": "n",
      "orgel": "f",
      "ort": "m",
      "ozean": "m",
      "paar": "n",
      "paket": "n",
      "pakt": "m",
      "papier": "n",
      "paradoxon": "n",
      "paragraph": "m",
      "parameter": "m",
      "park": "m",
      "passagier": "m",
      "passierschein": "m",
      "pegelstab": "m",
      "peilstock": "m",
      "peitsche": "f",
      "pendel": "n",
      "pergamentrolle": "f",
      "perle": "f",
      "perlmuttknopf": "m",
      "person": "f",
      "petrischale": "f",
      "petroleumlampe": "f",
      "pfad": "m",
      "pfand": "n",
      "pfandschein": "m",
      "pfeffer": "m",
      "pfeife": "f",
      "pferd": "n",
      "pfirsich": "m",
      "pflaster": "n",
      "pflaume": "f",
      "pflug": "m",
      "pf\xFCtze": "f",
      "phiole": "f",
      "photoplatte": "f",
      "pickel": "m",
      "pilz": "m",
      "ping": "m",
      "pinzette": "f",
      "pipette": "f",
      "plakat": "n",
      "plan": "m",
      "plane": "f",
      "planet": "m",
      "planke": "f",
      "platte": "f",
      "platz": "m",
      "platzhalter": "m",
      "poller": "m",
      "port": "m",
      "portal": "n",
      "postkarte": "f",
      "powerbank": "f",
      "priester": "m",
      "prisma": "n",
      "probe": "f",
      "programm": "n",
      "protokoll": "n",
      "prozess": "m",
      "puls": "m",
      "pulver": "n",
      "punkt": "m",
      "puppe": "f",
      "qualle": "f",
      "quelle": "f",
      "quittung": "f",
      "rad": "n",
      "rampe": "f",
      "rand": "m",
      "randnotiz": "f",
      "ranke": "f",
      "ranzen": "m",
      "ratte": "f",
      "rauch": "m",
      "raumkapsel": "f",
      "rausch": "m",
      "rauschen": "n",
      "rechentafel": "f",
      "recht": "n",
      "regal": "n",
      "regel": "f",
      "regen": "m",
      "regenmesser": "m",
      "register": "n",
      "reh": "n",
      "reich": "n",
      "reif": "m",
      "reigen": "m",
      "reihe": "f",
      "reinraumhaube": "f",
      "reise": "f",
      "reisemantel": "m",
      "rei\xDFverschluss": "m",
      "reklame": "f",
      "rest": "m",
      "rettung": "f",
      "rezept": "n",
      "richter": "m",
      "riegel": "m",
      "riff": "n",
      "rinde": "f",
      "ring": "m",
      "rippe": "f",
      "riss": "m",
      "ritter": "m",
      "ritterhelm": "m",
      "rohr": "n",
      "roman": "m",
      "rose": "f",
      "ruder": "n",
      "ruf": "m",
      "ruine": "f",
      "rumpf": "m",
      "r\xE4tsel": "n",
      "r\xFCcken": "m",
      "saal": "m",
      "sachbearbeiter": "m",
      "sack": "m",
      "saft": "m",
      "sage": "f",
      "sahne": "f",
      "saite": "f",
      "salat": "m",
      "salz": "n",
      "samen": "m",
      "sammlung": "f",
      "sand": "m",
      "sandsack": "m",
      "sanduhr": "f",
      "sarg": "m",
      "satellit": "m",
      "sattel": "m",
      "sattelgurt": "m",
      "satz": "m",
      "saum": "m",
      "savanne": "f",
      "schacht": "m",
      "schaf": "n",
      "schale": "f",
      "schalter": "m",
      "scham": "f",
      "schatten": "m",
      "schatulle": "f",
      "schaufel": "f",
      "schere": "f",
      "schicht": "f",
      "schicksal": "n",
      "schiff": "n",
      "schiffssextanten": "m",
      "schiffszwieback": "m",
      "schild": "n",
      "schirm": "m",
      "schlaf": "m",
      "schlag": "m",
      "schlamm": "m",
      "schlange": "f",
      "schleife": "f",
      "schloss": "n",
      "schlucht": "f",
      "schl\xFCssel": "m",
      "schl\xFCsselbund": "m",
      "schmerz": "m",
      "schmied": "m",
      "schmiede": "f",
      "schminkkasten": "m",
      "schnecke": "f",
      "schnee": "m",
      "schneiderpuppe": "f",
      "schnitt": "m",
      "schnittbogen": "m",
      "schnittstelle": "f",
      "schnur": "f",
      "schokolade": "f",
      "schrank": "m",
      "schrei": "m",
      "schreiber": "m",
      "schrein": "m",
      "schrift": "f",
      "schritt": "m",
      "schuh": "m",
      "schuld": "f",
      "schuldschein": "m",
      "schule": "f",
      "schulter": "f",
      "schuppen": "m",
      "schuss": "m",
      "schwamm": "m",
      "schwein": "n",
      "schwelle": "f",
      "schwert": "n",
      "schwertgriff": "m",
      "schwertgurt": "m",
      "schwester": "f",
      "schw\xE4che": "f",
      "sch\xE4del": "m",
      "sch\xE4rpe": "f",
      "sch\xFCrze": "f",
      "sch\xFCssel": "f",
      "screenshot": "m",
      "see": "m",
      "seekarte": "f",
      "seele": "f",
      "seesack": "m",
      "segel": "n",
      "segeltuch": "n",
      "segen": "m",
      "sehne": "f",
      "sehnsucht": "f",
      "seidenfaden": "m",
      "seil": "n",
      "seismograph": "m",
      "seismographen": "m",
      "seite": "f",
      "sekunde": "f",
      "senf": "m",
      "sensor": "m",
      "sessel": "m",
      "sieb": "n",
      "siegel": "n",
      "siegelring": "m",
      "signal": "n",
      "signalflagge": "f",
      "silbe": "f",
      "silber": "n",
      "sinn": "m",
      "sirene": "f",
      "skala": "f",
      "skalpell": "n",
      "skelett": "n",
      "skizze": "f",
      "smartphone": "n",
      "socke": "f",
      "sofa": "n",
      "sohn": "m",
      "soldat": "m",
      "sommer": "m",
      "sonne": "f",
      "sonnenbrille": "f",
      "so\xDFe": "f",
      "spalt": "m",
      "speicher": "m",
      "spektrogramm": "n",
      "spektrometer": "n",
      "sperre": "f",
      "spiegel": "m",
      "spiegelscherben": "m",
      "spiel": "n",
      "spinne": "f",
      "sporn": "m",
      "sprache": "f",
      "sprung": "m",
      "spule": "f",
      "spur": "f",
      "stab": "m",
      "stadt": "f",
      "stahlstrebe": "f",
      "stamm": "m",
      "standarte": "f",
      "stapel": "m",
      "statue": "f",
      "staub": "m",
      "stecknadel": "f",
      "steg": "m",
      "steig": "m",
      "steigb\xFCgel": "m",
      "steigeisen": "n",
      "stein": "m",
      "stelle": "f",
      "stempel": "m",
      "stempelger\xE4usch": "n",
      "stempelhalter": "m",
      "steppe": "f",
      "stern": "m",
      "sternbilder": "n",
      "sternwarte": "f",
      "stethoskop": "n",
      "stiefel": "m",
      "stier": "m",
      "stille": "f",
      "stimme": "f",
      "stirn": "f",
      "stock": "m",
      "stoff": "m",
      "stollen": "m",
      "stolz": "m",
      "story": "f",
      "strand": "m",
      "strauch": "m",
      "stra\xDFe": "f",
      "streichholzschachtel": "f",
      "streit": "m",
      "strich": "m",
      "strom": "m",
      "strophe": "f",
      "str\xF6mung": "f",
      "stube": "f",
      "stufe": "f",
      "stuhl": "m",
      "stunde": "f",
      "stundenplan": "m",
      "sturm": "m",
      "sturmlaterne": "f",
      "st\xE4rke": "f",
      "st\xFCck": "n",
      "sumpf": "m",
      "suppe": "f",
      "suppenkelle": "f",
      "symbol": "n",
      "symptom": "n",
      "system": "n",
      "s\xE4ge": "f",
      "s\xE4ule": "f",
      "tabelle": "f",
      "tafel": "f",
      "tafelrunde": "f",
      "tag": "m",
      "takt": "m",
      "tal": "n",
      "talar": "m",
      "tante": "f",
      "tanz": "m",
      "tasche": "f",
      "taschenradio": "n",
      "tasse": "f",
      "tau": "n",
      "taube": "f",
      "tee": "m",
      "teer": "m",
      "teeschale": "f",
      "teich": "m",
      "teil": "m",
      "telefon": "n",
      "teleskop": "n",
      "teller": "m",
      "teppich": "m",
      "termin": "m",
      "terminal": "n",
      "terminzettel": "m",
      "teufel": "m",
      "thermometer": "n",
      "thermoskanne": "f",
      "thron": "m",
      "ticket": "n",
      "tier": "n",
      "tiger": "m",
      "tiktoksound": "m",
      "tintenfass": "n",
      "tisch": "m",
      "tochter": "f",
      "tod": "m",
      "tomate": "f",
      "ton": "m",
      "tonband": "n",
      "tonschale": "f",
      "tontafel": "f",
      "topf": "m",
      "tor": "n",
      "torte": "f",
      "trapezhaken": "m",
      "traube": "f",
      "trauer": "f",
      "traum": "m",
      "trend": "m",
      "treppe": "f",
      "treue": "f",
      "trillerpfeife": "f",
      "trinkhorn": "n",
      "trommel": "f",
      "truhe": "f",
      "tr\xE4ne": "f",
      "tuch": "n",
      "tulpe": "f",
      "tunnel": "m",
      "turm": "m",
      "turnbeutel": "m",
      "turnier": "n",
      "turnierplatz": "m",
      "turnierstab": "m",
      "t\xFCr": "f",
      "t\xFCte": "f",
      "ufer": "n",
      "uhr": "f",
      "umriss": "m",
      "umschlag": "m",
      "ungl\xFCck": "n",
      "untergrund": "m",
      "unterschrift": "f",
      "untersuchungsliege": "f",
      "update": "n",
      "urne": "f",
      "urteil": "n",
      "vater": "m",
      "verdacht": "m",
      "verfahren": "n",
      "vergangenheit": "f",
      "vermerk": "m",
      "vers": "m",
      "verstand": "m",
      "vertrag": "m",
      "vertrauen": "n",
      "video": "n",
      "virus": "n",
      "visier": "n",
      "vogel": "m",
      "vollmacht": "f",
      "vordruck": "m",
      "vorhang": "m",
      "vormund": "m",
      "vorrat": "m",
      "vorratsgl\xE4ser": "n",
      "vulkan": "m",
      "wachs": "n",
      "wachstuch": "n",
      "wagen": "m",
      "wahrheit": "f",
      "waisenjunge": "m",
      "wal": "m",
      "wald": "m",
      "waldhorn": "n",
      "wand": "f",
      "wanderstab": "m",
      "wanderstock": "m",
      "wanderung": "f",
      "wange": "f",
      "wappen": "n",
      "wappenschild": "n",
      "warnung": "f",
      "warnweste": "f",
      "wartemarke": "f",
      "warze": "f",
      "wasser": "n",
      "wasserflasche": "f",
      "wasserhahn": "m",
      "weg": "m",
      "wegmarke": "f",
      "weide": "f",
      "wein": "m",
      "weite": "f",
      "wei\xDF": "n",
      "welle": "f",
      "werk": "n",
      "werkstatt": "f",
      "werkzeug": "n",
      "wert": "m",
      "wespe": "f",
      "wetter": "n",
      "wetterfahne": "f",
      "widerstand": "m",
      "wiese": "f",
      "wille": "m",
      "wimper": "f",
      "wind": "m",
      "windhauch": "m",
      "windsto\xDF": "m",
      "winter": "m",
      "witz": "m",
      "woche": "f",
      "wolf": "m",
      "wolke": "f",
      "wollschal": "m",
      "wort": "n",
      "wrack": "n",
      "wunde": "f",
      "wunder": "n",
      "wunsch": "m",
      "wurm": "m",
      "wurzel": "f",
      "wut": "f",
      "w\xE4chter": "m",
      "w\xE4lder": "m",
      "w\xE4rme": "f",
      "w\xE4rmestein": "m",
      "w\xE4schekorb": "m",
      "w\xF6rter": "n",
      "w\xFCrfel": "m",
      "w\xFCste": "f",
      "zahl": "f",
      "zahn": "m",
      "zange": "f",
      "zauberbesen": "m",
      "zaun": "m",
      "zeh": "m",
      "zeichen": "n",
      "zeile": "f",
      "zeit": "f",
      "zeitgeber": "m",
      "zeitmarke": "f",
      "zelle": "f",
      "zelt": "n",
      "zentimeter": "m",
      "zepter": "n",
      "zettel": "m",
      "zeuge": "m",
      "ziffer": "f",
      "zigarettenstummel": "m",
      "zigarre": "f",
      "zimmer": "n",
      "zirkel": "m",
      "zitrone": "f",
      "zittern": "n",
      "zorn": "m",
      "zucker": "m",
      "zug": "m",
      "zukunft": "f",
      "zunderbeutel": "m",
      "zunge": "f",
      "zweifel": "m",
      "zweig": "m",
      "zweitschl\xFCssel": "m",
      "zwieback": "m",
      "zwiebel": "f",
      "z\xE4hlrahmen": "m",
      "z\xF6gern": "n",
      "\xE4rmel": "m",
      "\xE4rztin": "f",
      "\xF6l": "n",
      "\xF6llampe": "f",
      "\xF6llaterne": "f",
      "\xF6lschl\xFCssel": "m"
    };
  }
});

// src/generation/nouns2.data.ts
var NOUN_GENDER_2;
var init_nouns2_data = __esm({
  "src/generation/nouns2.data.ts"() {
    "use strict";
    NOUN_GENDER_2 = {
      // ── Häufigste ──
      ende: "n",
      jahr: "n",
      mal: "n",
      anfang: "m",
      leben: "n",
      auskunft: "f",
      welt: "f",
      fr\u00FChjahr: "n",
      fall: "m",
      arbeit: "f",
      sache: "f",
      zufall: "m",
      form: "f",
      ziel: "n",
      kontrolle: "f",
      reihenfolge: "f",
      wissen: "n",
      post: "f",
      ernte: "f",
      geld: "n",
      mund: "m",
      schweigen: "n",
      wette: "f",
      schminke: "f",
      kurs: "m",
      original: "n",
      text: "m",
      gras: "n",
      warten: "n",
      ruhe: "f",
      mitte: "f",
      seide: "f",
      familie: "f",
      tiefe: "f",
      norden: "m",
      s\u00FCden: "m",
      osten: "m",
      westen: "m",
      blut: "n",
      horizont: "m",
      ursache: "f",
      absicht: "f",
      wirt: "m",
      jagd: "f",
      herkunft: "f",
      essen: "n",
      r\u00FCckkehr: "f",
      rahmen: "m",
      w\u00FCrde: "f",
      w\u00E4sche: "f",
      miete: "f",
      verlangen: "n",
      marke: "f",
      griff: "m",
      wache: "f",
      vernunft: "f",
      markt: "m",
      pegel: "m",
      halbdunkel: "n",
      rolle: "f",
      grad: "m",
      streben: "n",
      fach: "n",
      weise: "f",
      wipfel: "m",
      kohle: "f",
      lehne: "f",
      tide: "f",
      ru\u00DF: "m",
      idee: "f",
      gemeinde: "f",
      jahrhundert: "n",
      ernst: "m",
      betrag: "m",
      unterschied: "m",
      material: "n",
      annahme: "f",
      merkmal: "n",
      radio: "n",
      hitze: "f",
      herold: "m",
      grat: "m",
      kasse: "f",
      zoll: "m",
      heimweh: "n",
      laden: "m",
      f\u00E4hre: "f",
      herzog: "m",
      inhalt: "m",
      titel: "m",
      problem: "n",
      sicht: "f",
      beh\u00F6rde: "f",
      winkel: "m",
      hilfe: "f",
      pass: "m",
      viertel: "n",
      jahrzehnt: "n",
      anrede: "f",
      rost: "m",
      ekel: "m",
      tat: "f",
      methode: "f",
      zwang: "m",
      heimkehr: "f",
      umkehr: "f",
      norm: "f",
      leere: "f",
      umlauf: "m",
      flamme: "f",
      einsicht: "f",
      messing: "n",
      personal: "n",
      widerspruch: "m",
      schluss: "m",
      stroh: "n",
      rang: "m",
      vieh: "n",
      garderobe: "f",
      g\u00FCte: "f",
      anlass: "m",
      anwalt: "m",
      rat: "m",
      code: "m",
      bad: "n",
      handgelenk: "n",
      scheibe: "f",
      zustand: "m",
      eile: "f",
      saatgut: "n",
      fracht: "f",
      automat: "m",
      lehre: "f",
      ding: "n",
      verzicht: "m",
      zweck: "m",
      waffe: "f",
      blech: "n",
      trost: "m",
      versuch: "m",
      ironie: "f",
      d\u00FCrre: "f",
      fest: "n",
      aufsicht: "f",
      kapitel: "n",
      aussicht: "f",
      absinth: "m",
      parf\u00FCm: "n",
      schmutz: "m",
      knick: "m",
      andacht: "f",
      spitze: "f",
      szene: "f",
      erfolg: "m",
      ausguck: "m",
      bord: "m",
      sieg: "m",
      klausel: "f",
      haupttext: "m",
      sachverhalt: "m",
      tinte: "f",
      stand: "m",
      wortlaut: "m",
      klinke: "f",
      kanzel: "f",
      verrat: "m",
      mulde: "f",
      februar: "m",
      parasit: "m",
      pr\u00E4parat: "n",
      wesen: "n",
      lava: "f",
      schwefel: "m",
      lauf: "m",
      spa\u00DF: "m",
      m\u00F6bel: "n",
      b\u00FCro: "n",
      hauptsache: "f",
      saat: "f",
      fehde: "f",
      portr\u00E4t: "n",
      reue: "f",
      konfetti: "n",
      trapez: "n",
      narr: "m",
      truppe: "f",
      pudel: "m",
      jugend: "f",
      abschied: "m",
      bronze: "f",
      tempel: "m",
      geschlecht: "n",
      stra\u00DFenanfang: "m",
      brauch: "m",
      wiederkehr: "f",
      h\u00E4lfte: "f",
      pappe: "f",
      kante: "f",
      eintrag: "m",
      format: "n",
      giebel: "m",
      heimat: "f",
      armenkasse: "f",
      materie: "f",
      mensch: "m",
      glied: "n",
      betrieb: "m",
      m\u00FCll: "m",
      kleingeld: "n",
      ruhm: "m",
      ritt: "m",
      sch\u00E4rfe: "f",
      ankunft: "f",
      symmetrie: "f",
      adressat: "m",
      kreislauf: "m",
      aufstieg: "m",
      f\u00FClle: "f",
      bitte: "f",
      brand: "m",
      waise: "f",
      gesang: "m",
      subjekt: "n",
      objekt: "n",
      moral: "f",
      schilf: "n",
      diagnose: "f",
      gr\u00F6\u00DFe: "f",
      wahl: "f",
      sturz: "m",
      gischt: "f",
      ekstase: "f",
      becken: "n",
      putz: "m",
      minze: "f",
      samt: "m",
      pause: "f",
      knauf: "m",
      apotheke: "f",
      kost\u00FCm: "n",
      versto\u00DF: "m",
      satzanfang: "m",
      sprint: "m",
      beule: "f",
      banane: "f",
      tapete: "f",
      galerie: "f",
      kl\u00F6ppel: "m",
      predigt: "f",
      zierrat: "m",
      wachwechsel: "m",
      wimpel: "m",
      rah: "f",
      streitfall: "m",
      docht: "m",
      wundmal: "n",
      pforte: "f",
      gebot: "n",
      fl\u00FCgel: "m",
      l\u00E4nge: "f",
      kamel: "n",
      achse: "f",
      schlegel: "m",
      affe: "m",
      nirwana: "n",
      alkohol: "m",
      instinkt: "m",
      balance: "f",
      aushub: "m",
      kalk: "m",
      r\u00F6hre: "f",
      basalt: "m",
      salzs\u00E4ure: "f",
      erdkruste: "f",
      schichtfolge: "f",
      sohle: "f",
      profil: "n",
      schneeschmelze: "f",
      orbit: "m",
      funkspruch: "m",
      meteorit: "m",
      stromausfall: "m",
      theorie: "f",
      nervengeflecht: "n",
      bodenprofil: "n",
      senke: "f",
      gebiet: "n",
      phase: "f",
      honorar: "n",
      kordel: "f",
      spind: "m",
      tonfall: "m",
      tempo: "n",
      schattenkante: "f",
      stahl: "m",
      graupappe: "f",
      st\u00FCtze: "f",
      perspektive: "f",
      tank: "m",
      stillstand: "m",
      pumpe: "f",
      debatte: "f",
      bahre: "f",
      fackelru\u00DF: "m",
      kerbe: "f",
      t\u00FCrsturz: "m",
      groll: "m",
      seuche: "f",
      lunge: "f",
      pferdegeschirr: "n",
      zeltgest\u00E4nge: "n",
      marsch: "m",
      schaumgummi: "m",
      knall: "m",
      zeltmitte: "f",
      trick: "m",
      wurf: "m",
      pult: "n",
      pentagramm: "n",
      handel: "m",
      r\u00FCcktritt: "m",
      zimt: "m",
      akt: "m",
      schatz: "m",
      betrug: "m",
      kopfende: "n",
      parkett: "n",
      lack: "m",
      leib: "m",
      efeu: "m",
      anstand: "m",
      schafwolle: "f",
      milde: "f",
      wiege: "f",
      schar: "f",
      gunst: "f",
      volk: "n",
      staat: "m",
      antlitz: "n",
      fleck: "m",
      alibi: "n",
      kamera: "f",
      vorfall: "m",
      quelltext: "m",
      ritual: "n",
      schl\u00E4fe: "f",
      wetterwechsel: "m",
      anzeige: "f",
      jahresende: "n",
      weile: "f",
      t\u00FCll: "m",
      schleppe: "f",
      b\u00FCgel: "m",
      dampf: "m",
      kragen: "m",
      kerzenstummel: "m",
      klasse: "f",
      monatsende: "n",
      tausendstel: "n",
      durchlauf: "m",
      jahrtausend: "n",
      scheu: "f",
      taxi: "n",
      mittwoch: "m",
      erz: "n",
      diebstahl: "m",
      nachtwache: "f",
      schleuse: "f",
      \u00FCbernahme: "f",
      luke: "f",
      sp\u00FCle: "f",
      ampel: "f",
      sperrm\u00FCll: "m",
      speiche: "f",
      henkel: "m",
      routine: "f",
      mai: "m",
      wolle: "f",
      schluck: "m",
      biologie: "f",
      geologie: "f",
      astrologie: "f",
      philosophie: "f",
      krise: "f",
      trag\u00F6die: "f",
      urknall: "m",
      stift: "m",
      mine: "f",
      abwehr: "f",
      mole: "f",
      zerfall: "m",
      masse: "f",
      handbreit: "f",
      verfall: "m",
      tischkante: "f",
      beute: "f",
      rache: "f",
      font\u00E4ne: "f",
      zuversicht: "f",
      unruhe: "f",
      energie: "f",
      enge: "f",
      april: "m",
      rekord: "m",
      normalzustand: "m",
      h\u00F6he: "f",
      abstieg: "m",
      requisit: "n",
      schwindel: "m",
      orakelspruch: "m",
      erlass: "m",
      aufstand: "m",
      gehorsam: "m",
      blackbox: "f",
      silhouette: "f",
      mode: "f",
      not: "f",
      urform: "f",
      ruhestand: "m",
      schaden: "m",
      anlauf: "m",
      dienstjahr: "n",
      witwe: "f",
      ensemble: "n",
      kommune: "f",
      sekte: "f",
      rettungstrupp: "m",
      exil: "n",
      zentrale: "f",
      zensurbeh\u00F6rde: "f",
      doktortitel: "m",
      naturschutzgebiet: "n",
      boulevard: "m",
      hotel: "n",
      kino: "n",
      verkehr: "m",
      kellerclub: "m",
      kabine: "f",
      auto: "n",
      kaserne: "f",
      internat: "n",
      wahlkabine: "f",
      anstalt: "f",
      mittagspause: "f",
      choleraepidemie: "f",
      monarchie: "f",
      hungersnot: "f",
      null: "f",
      route: "f",
      kampagne: "f",
      karriere: "f",
      neuanfang: "m",
      sorte: "f",
      verhandlungssache: "f",
      folge: "f",
      ablauf: "m",
      strategie: "f",
      apparat: "m",
      psychopath: "m",
      variable: "f",
      empathie: "f",
      amsel: "f",
      schneefall: "m",
      abendrot: "n",
      wechsel: "m",
      // ── Nachschlag: Alltag, Körper, Haus, Natur, Amt ──
      auge: "n",
      name: "m",
      glaube: "m",
      wille: "m",
      gedanke: "m",
      friede: "m",
      funke: "m",
      k\u00E4se: "m",
      junge: "m",
      kunde: "m",
      l\u00F6we: "m",
      hase: "m",
      bote: "m",
      zeuge: "m",
      riese: "m",
      rabe: "m",
      falke: "m",
      ochse: "m",
      bursche: "m",
      knabe: "m",
      neffe: "m",
      erbe: "m",
      buchstabe: "m",
      same: "m",
      schatten: "m",
      wagen: "m",
      boden: "m",
      garten: "m",
      ofen: "m",
      regen: "m",
      faden: "m",
      haken: "m",
      hafen: "m",
      morgen: "m",
      tropfen: "m",
      kissen: "n",
      zeichen: "n",
      kuchen: "m",
      knochen: "m",
      r\u00FCcken: "m",
      segen: "m",
      bogen: "m",
      balken: "m",
      riegel: "m",
      ballen: "m",
      fels: "m",
      haus: "n",
      glas: "n",
      bus: "m",
      fluss: "m",
      kuss: "m",
      guss: "m",
      gru\u00DF: "m",
      fu\u00DF: "m",
      hass: "m",
      kompass: "m",
      atlas: "m",
      kreis: "m",
      preis: "m",
      eis: "n",
      reis: "m",
      gleis: "n",
      flei\u00DF: "m",
      geheimnis: "n",
      ergebnis: "n",
      zeugnis: "n",
      bed\u00FCrfnis: "n",
      verh\u00E4ltnis: "n",
      ereignis: "n",
      erlebnis: "n",
      b\u00FCndnis: "n",
      hindernis: "n",
      gef\u00E4ngnis: "n",
      wildnis: "f",
      finsternis: "f",
      fenster: "n",
      zimmer: "n",
      wasser: "n",
      messer: "n",
      feuer: "n",
      kupfer: "n",
      silber: "n",
      pulver: "n",
      wetter: "n",
      alter: "n",
      ufer: "n",
      lager: "n",
      opfer: "n",
      muster: "n",
      kloster: "n",
      register: "n",
      theater: "n",
      fieber: "n",
      leder: "n",
      futter: "n",
      gitter: "n",
      ruder: "n",
      wunder: "n",
      orchester: "n",
      zepter: "n",
      semester: "n",
      polster: "n",
      pflaster: "n",
      laster: "n",
      meter: "m",
      liter: "m",
      zentrum: "n",
      datum: "n",
      museum: "n",
      t\u00FCr: "f",
      hand: "f",
      stern: "m",
      schritt: "m",
      brief: "m",
      weg: "m",
      stimme: "f",
      spur: "f",
      lippe: "f",
      frage: "f",
      perle: "f",
      glocke: "f",
      uhr: "f",
      herz: "n",
      dach: "n",
      stra\u00DFe: "f",
      regel: "f",
      vorrat: "m",
      schicht: "f",
      schaf: "n",
      nummer: "f",
      schuh: "m",
      grenze: "f",
      gutachten: "n",
      satz: "m",
      wort: "n",
      seele: "f",
      teil: "m",
      blume: "f",
      richtung: "f",
      monat: "m",
      zahn: "m",
      ort: "m",
      wand: "f",
      vorhang: "m",
      umstand: "m",
      sandsack: "m",
      kraft: "f",
      bein: "n",
      kanal: "m",
      sinn: "m",
      netz: "n",
      pflasterstein: "m",
      handschuh: "m",
      protokoll: "n",
      system: "n",
      kreidestrich: "m",
      bruchteil: "m",
      tor: "n",
      kran: "m",
      beweis: "m",
      nacht: "f",
      stadt: "f",
      grund: "m",
      zug: "m",
      riff: "n",
      plakat: "n",
      baum: "m",
      erbgang: "m",
      exemplar: "n",
      symptom: "n",
      plan: "m",
      umriss: "m",
      riss: "m",
      bahngleis: "n",
      regal: "n",
      blick: "m",
      bergpass: "m",
      faust: "f",
      stuhl: "m",
      freund: "m",
      stamm: "m",
      tanzschuh: "m",
      dienst: "m",
      ma\u00DF: "n",
      arm: "m",
      kinderhand: "f",
      tisch: "m",
      seil: "n",
      frachtbrief: "m",
      termin: "m",
      formular: "n",
      messwert: "m",
      gegenstand: "m",
      vogel: "m",
      exponat: "n",
      fahrgast: "m",
      meer: "n",
      anruf: "m",
      vorschlag: "m",
      punkt: "m",
      boot: "n",
      paar: "n",
      gast: "m",
      stein: "m",
      stunde: "f",
      minute: "f",
      tag: "m",
      woche: "f",
      seite: "f",
      farbe: "f",
      papier: "n",
      nachbar: "m",
      wolke: "f",
      zeug: "n",
      kind: "n",
      mann: "m",
      frau: "f",
      vater: "m",
      mutter: "f",
      bruder: "m",
      schwester: "f",
      sohn: "m",
      tochter: "f",
      herr: "m",
      dame: "f",
      lehrer: "m",
      arzt: "m",
      pfarrer: "m",
      priester: "m",
      k\u00F6nig: "m",
      k\u00F6nigin: "f",
      kaiser: "m",
      soldat: "m",
      bauer: "m",
      fischer: "m",
      b\u00E4cker: "m",
      schneider: "m",
      schmied: "m",
      m\u00FCller: "m",
      j\u00E4ger: "m",
      hirte: "m",
      knecht: "m",
      magd: "f",
      w\u00E4chter: "m",
      richter: "m",
      h\u00E4ndler: "m",
      fremde: "m",
      kurier: "m",
      agent: "m",
      spion: "m",
      dieb: "m",
      r\u00E4uber: "m",
      m\u00F6rder: "m",
      opferlamm: "n",
      engel: "m",
      teufel: "m",
      geist: "m",
      gott: "m",
      g\u00F6ttin: "f",
      heiliger: "m",
      m\u00F6nch: "m",
      nonne: "f",
      abt: "m",
      bischof: "m",
      papst: "m",
      ritter: "m",
      knappe: "m",
      graf: "m",
      gr\u00E4fin: "f",
      f\u00FCrst: "m",
      prinz: "m",
      prinzessin: "f",
      zauberer: "m",
      hexe: "f",
      drache: "m",
      zwerg: "m",
      elf: "m",
      troll: "m",
      wolf: "m",
      b\u00E4r: "m",
      fuchs: "m",
      hirsch: "m",
      reh: "n",
      pferd: "n",
      hund: "m",
      katze: "f",
      maus: "f",
      ratte: "f",
      schlange: "f",
      fisch: "m",
      m\u00F6we: "f",
      taube: "f",
      kr\u00E4he: "f",
      eule: "f",
      biene: "f",
      fliege: "f",
      spinne: "f",
      k\u00E4fer: "m",
      schmetterling: "m",
      wurm: "m",
      ameise: "f",
      frosch: "m",
      kr\u00F6te: "f",
      eidechse: "f",
      schwan: "m",
      ente: "f",
      gans: "f",
      huhn: "n",
      hahn: "m",
      kuh: "f",
      stier: "m",
      ziege: "f",
      esel: "m",
      schwein: "n",
      lamm: "n",
      // Schwache Maskulina auf -e, die die -e→f-Regel sonst fälschlich fängt
      kollege: "m",
      experte: "m",
      matrose: "m",
      pate: "m",
      sklave: "m",
      laie: "m",
      insasse: "m",
      gatte: "m",
      bulle: "m",
      schurke: "m",
      geselle: "m",
      gef\u00E4hrte: "m",
      genosse: "m",
      komplize: "m",
      jude: "m",
      zar: "m",
      franzose: "m",
      chinese: "m",
      russe: "m",
      grieche: "m",
      t\u00FCrke: "m",
      ire: "m",
      schwede: "m",
      d\u00E4ne: "m",
      psychologe: "m",
      biologe: "m",
      geologe: "m",
      soziologe: "m",
      arch\u00E4ologe: "m",
      philosoph: "m",
      // Neutra auf -e
      interesse: "n",
      geb\u00E4ude: "n",
      gem\u00E4lde: "n",
      gebirge: "n",
      getreide: "n",
      gefolge: "n",
      gel\u00E4nde: "n",
      gewebe: "n",
      gew\u00F6lbe: "n",
      getriebe: "n",
      gef\u00FCge: "n",
      gelage: "n",
      gerede: "n",
      gehege: "n",
      gewerbe: "n"
    };
  }
});

// src/generation/declension.ts
function istSubstantivierterInfinitiv(w) {
  if (!/^[a-zäöüß]{4,}en$/.test(w)) return false;
  const stamm = w.slice(0, -2);
  return istVerbform(stamm + "t") || istVerbform(stamm + "et");
}
function guessGender(noun) {
  const w = (noun || "").toLowerCase().replace(/[^a-zäöüß]/g, "");
  const known = NOUN_GENDER2[w];
  if (known === "m" || known === "f" || known === "n") return known;
  let best = "";
  for (const k in NOUN_GENDER2) {
    if (k.length >= 3 && w.length >= k.length + 2 && w.endsWith(k) && k.length > best.length) best = k;
  }
  if (best) return NOUN_GENDER2[best];
  if (/(ung|heit|keit|schaft|tät|ion|ik|enz|anz|ei|ade|age|üre|itis|ur)$/.test(w)) return "f";
  if (/(chen|lein|ment|tum|um|nis|ma)$/.test(w)) return "n";
  if (/(ling|ismus|ant|ent|ist|eur|or|ich|ig|ast)$/.test(w)) return "m";
  if (istSubstantivierterInfinitiv(w)) return "n";
  if (/^ge[a-zäöüß]{3,}e$/.test(w)) return "n";
  if (/e$/.test(w) && w.length >= 4 && !E_AUSNAHME.test(w)) return "f";
  if (/er$/.test(w)) return "m";
  return void 0;
}
var NOUN_GENDER2, E_AUSNAHME;
var init_declension = __esm({
  "src/generation/declension.ts"() {
    "use strict";
    init_text_utils();
    init_verben();
    init_nouns_data();
    init_nouns2_data();
    NOUN_GENDER2 = { ...NOUN_GENDER_2, ...NOUN_GENDER };
    E_AUSNAHME = /^(ge[a-zäöüß]+e|.*(auge|ende|käse|junge|erbe|interesse))$/;
  }
});

// src/generation/verbconj.data.ts
var VERB_CONJ, INFINITIVE_VERBS;
var init_verbconj_data = __esm({
  "src/generation/verbconj.data.ts"() {
    "use strict";
    VERB_CONJ = {
      "bemerkt": {
        "ich": "bemerke",
        "du": "bemerkst",
        "wir": "bemerken",
        "ihr": "bemerkt"
      },
      "nimmt": {
        "ich": "nehme",
        "du": "nimmst",
        "wir": "nehmen",
        "ihr": "nehmt"
      },
      "steht": {
        "ich": "stehe",
        "du": "stehst",
        "wir": "stehen",
        "ihr": "steht"
      },
      "h\xE4lt": {
        "ich": "halte",
        "du": "h\xE4ltst",
        "wir": "halten",
        "ihr": "haltet"
      },
      "sucht": {
        "ich": "suche",
        "du": "suchst",
        "wir": "suchen",
        "ihr": "sucht"
      },
      "versucht": {
        "ich": "versuche",
        "du": "versuchst",
        "wir": "versuchen",
        "ihr": "versucht"
      },
      "will": {
        "ich": "will",
        "du": "willst",
        "wir": "wollen",
        "ihr": "wollt"
      },
      "kann": {
        "ich": "kann",
        "du": "kannst",
        "wir": "k\xF6nnen",
        "ihr": "k\xF6nnt"
      },
      "muss": {
        "ich": "muss",
        "du": "musst",
        "wir": "m\xFCssen",
        "ihr": "m\xFCsst"
      },
      "darf": {
        "ich": "darf",
        "du": "darfst",
        "wir": "d\xFCrfen",
        "ihr": "d\xFCrft"
      },
      "mag": {
        "ich": "mag",
        "du": "magst",
        "wir": "m\xF6gen",
        "ihr": "m\xF6gt"
      },
      "soll": {
        "ich": "soll",
        "du": "sollst",
        "wir": "sollen",
        "ihr": "sollt"
      },
      "m\xF6chte": {
        "ich": "m\xF6chte",
        "du": "m\xF6chtest",
        "wir": "m\xF6chten",
        "ihr": "m\xF6chtet"
      },
      "ist": {
        "ich": "bin",
        "du": "bist",
        "wir": "sind",
        "ihr": "seid"
      },
      "wird": {
        "ich": "werde",
        "du": "wirst",
        "wir": "werden",
        "ihr": "werdet"
      },
      "geht": {
        "ich": "gehe",
        "du": "gehst",
        "wir": "gehen",
        "ihr": "geht"
      },
      "kommt": {
        "ich": "komme",
        "du": "kommst",
        "wir": "kommen",
        "ihr": "kommt"
      },
      "bleibt": {
        "ich": "bleibe",
        "du": "bleibst",
        "wir": "bleiben",
        "ihr": "bleibt"
      },
      "\xF6ffnet": {
        "ich": "\xF6ffne",
        "du": "\xF6ffnest",
        "wir": "\xF6ffnen",
        "ihr": "\xF6ffnet"
      },
      "schlie\xDFt": {
        "ich": "schlie\xDFe",
        "du": "schlie\xDFt",
        "wir": "schlie\xDFen",
        "ihr": "schlie\xDFt"
      },
      "fragt": {
        "ich": "frage",
        "du": "fragst",
        "wir": "fragen",
        "ihr": "fragt"
      },
      "f\xFChrt": {
        "ich": "f\xFChre",
        "du": "f\xFChrst",
        "wir": "f\xFChren",
        "ihr": "f\xFChrt"
      },
      "begreift": {
        "ich": "begreife",
        "du": "begreifst",
        "wir": "begreifen",
        "ihr": "begreift"
      },
      "bricht": {
        "ich": "breche",
        "du": "brichst",
        "wir": "brechen",
        "ihr": "brecht"
      },
      "kippt": {
        "ich": "kippe",
        "du": "kippst",
        "wir": "kippen",
        "ihr": "kippt"
      },
      "l\xF6scht": {
        "ich": "l\xF6sche",
        "du": "l\xF6schst",
        "wir": "l\xF6schen",
        "ihr": "l\xF6scht"
      },
      "tut": {
        "ich": "tue",
        "du": "tust",
        "wir": "tun",
        "ihr": "tut"
      },
      "macht": {
        "ich": "mache",
        "du": "machst",
        "wir": "machen",
        "ihr": "macht"
      },
      "sieht": {
        "ich": "sehe",
        "du": "siehst",
        "wir": "sehen",
        "ihr": "seht"
      },
      "gibt": {
        "ich": "gebe",
        "du": "gibst",
        "wir": "geben",
        "ihr": "gebt"
      },
      "tr\xE4gt": {
        "ich": "trage",
        "du": "tr\xE4gst",
        "wir": "tragen",
        "ihr": "tragt"
      },
      "h\xF6rt": {
        "ich": "h\xF6re",
        "du": "h\xF6rst",
        "wir": "h\xF6ren",
        "ihr": "h\xF6rt"
      },
      "findet": {
        "ich": "finde",
        "du": "findest",
        "wir": "finden",
        "ihr": "findet"
      },
      "ber\xFChrt": {
        "ich": "ber\xFChre",
        "du": "ber\xFChrst",
        "wir": "ber\xFChren",
        "ihr": "ber\xFChrt"
      },
      "beobachtet": {
        "ich": "beobachte",
        "du": "beobachtest",
        "wir": "beobachten",
        "ihr": "beobachtet"
      },
      "kennt": {
        "ich": "kenne",
        "du": "kennst",
        "wir": "kennen",
        "ihr": "kennt"
      },
      "nennt": {
        "ich": "nenne",
        "du": "nennst",
        "wir": "nennen",
        "ihr": "nennt"
      },
      "sp\xFCrt": {
        "ich": "sp\xFCre",
        "du": "sp\xFCrst",
        "wir": "sp\xFCren",
        "ihr": "sp\xFCrt"
      },
      "wei\xDF": {
        "ich": "wei\xDF",
        "du": "wei\xDFt",
        "wir": "wissen",
        "ihr": "wisst"
      },
      "braucht": {
        "ich": "brauche",
        "du": "brauchst",
        "wir": "brauchen",
        "ihr": "braucht"
      },
      "w\xFCnscht": {
        "ich": "w\xFCnsche",
        "du": "w\xFCnschst",
        "wir": "w\xFCnschen",
        "ihr": "w\xFCnscht"
      },
      "hofft": {
        "ich": "hoffe",
        "du": "hoffst",
        "wir": "hoffen",
        "ihr": "hofft"
      },
      "tr\xE4umt": {
        "ich": "tr\xE4ume",
        "du": "tr\xE4umst",
        "wir": "tr\xE4umen",
        "ihr": "tr\xE4umt"
      },
      "plant": {
        "ich": "plane",
        "du": "planst",
        "wir": "planen",
        "ihr": "plant"
      },
      "f\xFCrchtet": {
        "ich": "f\xFCrchte",
        "du": "f\xFCrchtest",
        "wir": "f\xFCrchten",
        "ihr": "f\xFCrchtet"
      },
      "wartet": {
        "ich": "warte",
        "du": "wartest",
        "wir": "warten",
        "ihr": "wartet"
      },
      "glaubt": {
        "ich": "glaube",
        "du": "glaubst",
        "wir": "glauben",
        "ihr": "glaubt"
      },
      "denkt": {
        "ich": "denke",
        "du": "denkst",
        "wir": "denken",
        "ihr": "denkt"
      },
      "f\xFChlt": {
        "ich": "f\xFChle",
        "du": "f\xFChlst",
        "wir": "f\xFChlen",
        "ihr": "f\xFChlt"
      },
      "verlangt": {
        "ich": "verlange",
        "du": "verlangst",
        "wir": "verlangen",
        "ihr": "verlangt"
      },
      "erwartet": {
        "ich": "erwarte",
        "du": "erwartest",
        "wir": "erwarten",
        "ihr": "erwartet"
      },
      "riskiert": {
        "ich": "riskiere",
        "du": "riskierst",
        "wir": "riskieren",
        "ihr": "riskiert"
      },
      "wagt": {
        "ich": "wage",
        "du": "wagst",
        "wir": "wagen",
        "ihr": "wagt"
      },
      "flieht": {
        "ich": "fliehe",
        "du": "fliehst",
        "wir": "fliehen",
        "ihr": "flieht"
      },
      "jagt": {
        "ich": "jage",
        "du": "jagst",
        "wir": "jagen",
        "ihr": "jagt"
      },
      "folgt": {
        "ich": "folge",
        "du": "folgst",
        "wir": "folgen",
        "ihr": "folgt"
      },
      "verfolgt": {
        "ich": "verfolge",
        "du": "verfolgst",
        "wir": "verfolgen",
        "ihr": "verfolgt"
      },
      "rettet": {
        "ich": "rette",
        "du": "rettest",
        "wir": "retten",
        "ihr": "rettet"
      },
      "verr\xE4t": {
        "ich": "verrate",
        "du": "verr\xE4tst",
        "wir": "verraten",
        "ihr": "verratet"
      },
      "vergisst": {
        "ich": "vergesse",
        "du": "vergisst",
        "wir": "vergessen",
        "ihr": "vergesst"
      },
      "hatte": {
        "ich": "hatte",
        "du": "hattest",
        "wir": "hatten",
        "ihr": "hattet"
      },
      "war": {
        "ich": "war",
        "du": "warst",
        "wir": "waren",
        "ihr": "wart"
      },
      "wollte": {
        "ich": "wollte",
        "du": "wolltest",
        "wir": "wollten",
        "ihr": "wolltet"
      },
      "tat": {
        "ich": "tat",
        "du": "tatest",
        "wir": "taten",
        "ihr": "tatet"
      },
      "machte": {
        "ich": "machte",
        "du": "machtest",
        "wir": "machten",
        "ihr": "machtet"
      },
      "kam": {
        "ich": "kam",
        "du": "kamst",
        "wir": "kamen",
        "ihr": "kamt"
      },
      "ging": {
        "ich": "ging",
        "du": "gingst",
        "wir": "gingen",
        "ihr": "gingt"
      },
      "f\xFChrte": {
        "ich": "f\xFChrte",
        "du": "f\xFChrtest",
        "wir": "f\xFChrten",
        "ihr": "f\xFChrtet"
      },
      "schloss": {
        "ich": "schloss",
        "du": "schlossest",
        "wir": "schlossen",
        "ihr": "schlosst"
      },
      "fragte": {
        "ich": "fragte",
        "du": "fragtest",
        "wir": "fragten",
        "ihr": "fragtet"
      },
      "begriff": {
        "ich": "begriff",
        "du": "begriffst",
        "wir": "begriffen",
        "ihr": "begrifft"
      },
      "stellt": {
        "ich": "stelle",
        "du": "stellst",
        "wir": "stellen"
      },
      "erkennt": {
        "ich": "erkenne",
        "du": "erkennst",
        "wir": "erkennen"
      },
      "zeigt": {
        "ich": "zeige",
        "du": "zeigst",
        "wir": "zeigen"
      },
      "greift": {
        "ich": "greife",
        "du": "greifst",
        "wir": "greifen"
      },
      "legt": {
        "ich": "lege",
        "du": "legst",
        "wir": "legen"
      },
      "betrachtet": {
        "ich": "betrachte",
        "du": "betrachtest",
        "wir": "betrachten"
      },
      "setzt": {
        "ich": "setze",
        "du": "setzt",
        "wir": "setzen"
      },
      "merkt": {
        "ich": "merke",
        "du": "merkst",
        "wir": "merken"
      },
      "pr\xFCft": {
        "ich": "pr\xFCfe",
        "du": "pr\xFCfst",
        "wir": "pr\xFCfen"
      }
    };
    INFINITIVE_VERBS = /* @__PURE__ */ new Set(["entdecken", "finden", "verstehen", "erreichen", "verlassen", "retten", "zerst\xF6ren", "beweisen", "\xFCberleben", "fliehen", "gewinnen", "verlieren", "\xF6ffnen", "schlie\xDFen", "verschwinden", "sterben", "bleiben", "ankommen", "entkommen", "aufwachen", "vergessen", "lernen", "ver\xE4ndern", "kontrollieren", "sch\xFCtzen", "befreien", "heilen", "erschaffen", "reparieren", "beenden", "anfangen", "beginnen", "erinnern", "wissen", "glauben", "tr\xE4umen", "hoffen", "k\xE4mpfen", "siegen", "sprechen", "schweigen", "warten", "folgen", "fragen", "antworten", "erkl\xE4ren", "gehen", "kommen"]);
  }
});

// src/generation/verbconj.ts
var VERB_TOKEN_RE;
var init_verbconj = __esm({
  "src/generation/verbconj.ts"() {
    "use strict";
    init_verbconj_data();
    init_beats();
    init_verben();
    VERB_TOKEN_RE = new RegExp("\\b(" + Object.keys(VERB_CONJ).join("|") + ")\\b", "i");
  }
});

// src/generation/wordcls.ts
function wirktFinit(w) {
  if (w.length < 4 || NICHT_VERB_T.has(w)) return false;
  if (/^ge[a-zäöüß]+t$/.test(w)) return false;
  return /^[a-zäöüß]+[^aeiouäöü]t$/.test(w) || /^[a-zäöüß]+et$/.test(w);
}
function looksLikeInfinitive(w) {
  if (INFINITIVE_VERBS.has(w)) return true;
  if (w.length < 5 || NOT_INFINITIVE.has(w) || NOUN_GENDER[w]) return false;
  return /(?:[a-zäöüß]{3,})(?:en|ern|eln)$/.test(w);
}
function extractLeadVerb(text) {
  const s = clean(text);
  if (!s) return { verb: null, rest: s };
  const m0 = s.match(/^([A-Za-zÄÖÜäöüß]+)(,?)\s+(.+)$/);
  if (!m0) return { verb: null, rest: s };
  const m = [m0[0], m0[1], (m0[2] ? ", " : "") + m0[3]];
  const raw = m[1];
  const w = raw.toLowerCase();
  if (VERB_CONJ[w]) return { verb: raw, rest: m[2] };
  if (/^[a-zäöüß]/.test(raw) && looksLikeInfinitive(w)) {
    return { verb: null, rest: `${m[2]} ${w}`, isInfinitiveLed: true };
  }
  if (/^[a-zäöüß]+iert$/.test(w)) return { verb: raw, rest: m[2] };
  const dritte = ICH_DU_ZU_ER[w];
  if (dritte && /^[a-zäöüß]/.test(raw)) return { verb: dritte, rest: m[2] };
  if (/^[a-zäöüß]/.test(raw) && (EXTRA_FINITE_RE.test(w) || wirktFinit(w))) {
    return { verb: raw, rest: m[2] };
  }
  return { verb: null, rest: s };
}
function looksLikeFullClause(leadVerb, rest) {
  if (leadVerb) return false;
  return VERB_TOKEN_RE.test(rest || "") || EXTRA_FINITE_RE.test(rest || "");
}
var NOT_INFINITIVE, NICHT_VERB_T, ICH_DU_HAND, ICH_DU_ZU_ER, EXTRA_FINITE_RE;
var init_wordcls = __esm({
  "src/generation/wordcls.ts"() {
    "use strict";
    init_text_utils();
    init_verbconj_data();
    init_nouns_data();
    init_verbconj();
    NOT_INFINITIVE = /* @__PURE__ */ new Set([
      "einen",
      "keinen",
      "seinen",
      "ihren",
      "deinen",
      "unseren",
      "euren",
      "diesen",
      "jenen",
      "denen",
      "welchen",
      "allen",
      "vielen",
      "beiden",
      "manchen",
      "jeden",
      "solchen",
      "anderen",
      "eigenen",
      "letzten",
      "ersten",
      "oben",
      "unten",
      "innen",
      "au\xDFen",
      "hinten",
      "vorn",
      "vorne",
      "neben",
      "eben",
      "gegen",
      "wegen",
      "gegen\xFCber",
      "morgen",
      "\xFCbermorgen",
      "wochen",
      "stunden",
      "sieben",
      "zehn",
      "trotzen",
      "w\xE4hrend",
      "dessen",
      "deren",
      "hinein"
    ]);
    NICHT_VERB_T = /* @__PURE__ */ new Set([
      "nicht",
      "jetzt",
      "erst",
      "fast",
      "sonst",
      "meist",
      "zuerst",
      "zuletzt",
      "selbst",
      "sogar",
      "seit",
      "samt",
      "statt",
      "mit",
      "zeit",
      "trotz",
      "laut",
      "gerecht",
      "sanft",
      "dicht",
      "leicht",
      "schlecht",
      "recht",
      "direkt",
      "echt",
      "exakt",
      "strikt",
      "perfekt",
      "konkret",
      "komplett",
      "kaputt",
      "sacht",
      "glatt",
      "platt",
      "nackt",
      "satt",
      "breit",
      "bereit",
      "weit",
      "sp\xE4t",
      "hart",
      "zart",
      "kalt",
      "alt",
      "bunt",
      "rot",
      "gut",
      "oft",
      "still",
      "halt",
      "gesamt",
      "insgesamt",
      "bekannt",
      "verwandt",
      "ber\xFChmt",
      "sofort",
      "vielleicht",
      "\xFCberhaupt",
      "zumindest",
      "h\xF6chst",
      "\xE4u\xDFerst",
      "mindest",
      "bestimmt",
      "unbedingt",
      "ernst",
      "einst",
      "l\xE4ngst",
      "j\xFCngst",
      "umsonst",
      "weltweit",
      "korrekt",
      "intakt",
      "kompakt",
      "prompt",
      "getrennt",
      // vierbuchstabige Adjektive und Adverbien auf -t
      "bunt",
      "echt",
      "fest",
      "hart",
      "kalt",
      "laut",
      "matt",
      "nett",
      "satt",
      "weit",
      "zart",
      "fett",
      "halt",
      "wert",
      "dort",
      "fort",
      "stet",
      "sart"
    ]);
    ICH_DU_HAND = {
      sehe: "sieht",
      siehst: "sieht",
      gehe: "geht",
      gehst: "geht",
      komme: "kommt",
      kommst: "kommt",
      finde: "findet",
      findest: "findet",
      glaube: "glaubt",
      glaubst: "glaubt",
      lebe: "lebt",
      lebst: "lebt",
      liege: "liegt",
      liegst: "liegt",
      sitze: "sitzt",
      lese: "liest",
      liest: "liest",
      schlafe: "schl\xE4ft",
      schl\u00E4fst: "schl\xE4ft",
      laufe: "l\xE4uft",
      l\u00E4ufst: "l\xE4uft",
      falle: "f\xE4llt",
      f\u00E4llst: "f\xE4llt",
      breche: "bricht",
      brichst: "bricht",
      rufe: "ruft",
      rufst: "ruft",
      weine: "weint",
      weinst: "weint",
      lache: "lacht",
      lachst: "lacht",
      sp\u00FCre: "sp\xFCrt",
      sp\u00FCrst: "sp\xFCrt",
      atme: "atmet",
      atmest: "atmet",
      singe: "singt",
      singst: "singt",
      \u00F6ffne: "\xF6ffnet",
      \u00F6ffnest: "\xF6ffnet",
      erinnere: "erinnert",
      erinnerst: "erinnert",
      erkenne: "erkennt",
      erkennst: "erkennt",
      zerbreche: "zerbricht",
      zerbrichst: "zerbricht",
      stolpere: "stolpert",
      stolperst: "stolpert",
      verharre: "verharrt",
      verharrst: "verharrt",
      wandere: "wandert",
      wanderst: "wandert",
      zittere: "zittert",
      zitterst: "zittert",
      fl\u00FCstere: "fl\xFCstert",
      fl\u00FCsterst: "fl\xFCstert",
      wundere: "wundert",
      wunderst: "wundert",
      z\u00F6gere: "z\xF6gert",
      z\u00F6gerst: "z\xF6gert",
      erwache: "erwacht",
      erwachst: "erwacht",
      verschwinde: "verschwindet",
      verschwindest: "verschwindet",
      begreife: "begreift",
      begreifst: "begreift",
      verstehe: "versteht",
      verstehst: "versteht",
      bleibe: "bleibt",
      bleibst: "bleibt",
      ziehe: "zieht",
      ziehst: "zieht"
    };
    ICH_DU_ZU_ER = (() => {
      const m = {};
      for (const [dritte, formen] of Object.entries(VERB_CONJ)) {
        for (const p of ["ich", "du", "wir", "ihr"]) {
          const f = formen[p];
          if (f && !m[f]) m[f] = dritte;
        }
      }
      return { ...m, ...ICH_DU_HAND };
    })();
    EXTRA_FINITE_RE = /\b(geschieht|geschehen|geschah|passiert|passieren|passierte|tickt|ticken|atmet|atmen|wächst|wachsen|wuchs|brennt|brennen|brannte|fällt|fallen|fiel|zerfällt|zerfallen|verschwindet|verschwinden|verschwand|erscheint|erscheinen|erschien|endet|enden|endete|beginnt|beginnen|begann|stirbt|sterben|starb|blüht|blühen|klopft|klopfen|flackert|flackern|zerbricht|zerbrechen|zerbrach|dreht|drehen|schweigt|schweigen|schwieg|singt|singen|sang|wandert|wandern|glüht|glühen|tanzt|tanzen|brüllt|brüllen|reagiert|reagieren|zeigt|zeigen|spricht|sprechen|sprach|antwortet|antworten|erinnert|erinnern|verändert|verändern|zittert|zittern|leuchtet|leuchten|schmilzt|schmelzen|regnet|schneit|blitzt|donnert|bebt|läuft|laufen|lief|rinnt|tropft|fließt|fließen|floss|steigt|steigen|stieg|sinkt|sinken|sank|kreist|kreisen|pulsiert|vibriert|summt|brummt|knistert|raschelt|flüstert|flüstern|schreit|schreien|schrie|weint|weinen|lacht|lachen|verglüht|verblasst|zerrinnt|wartet|warten)\b/i;
  }
});

// src/features/waechterStatistik.ts
var init_waechterStatistik = __esm({
  "src/features/waechterStatistik.ts"() {
    "use strict";
  }
});

// src/generation/coherence.ts
function schwachesPraeteritum(w, satz) {
  const l = w.toLowerCase();
  if (kenntInfinitiv(l) || kenntInfinitiv(l.replace(/e$/, "en")) || kenntInfinitiv(l.replace(/en$/, "n"))) return false;
  const m = l.match(/^([a-zäöüß]{2,}?)(e?te|e?ten|e?test)$/);
  if (!m) return false;
  const inf = infinitivZuStamm(m[1]);
  if (inf) return true;
  const re = new RegExp("\\b" + w + "\\b(?=\\s+[A-Z\xC4\xD6\xDC])");
  return !re.test(satz) && !KEIN_VERB.has(m[1] + "t") && !KEIN_VERB.has(m[1]);
}
function isPastTense(s) {
  const t = s || "";
  if (PRAES_MARK.test(t)) return false;
  if (PRAET_STRONG.test(t)) return true;
  if (PRAET_WEAK.test(t) && weakLooksVerbal(t) && !ADJ_CONTEXT.test(t)) return true;
  return (t.toLowerCase().match(/[a-zäöüß]+/g) || []).some((w) => !!PAST2PRES[w]);
}
function properNames(text) {
  const out = /* @__PURE__ */ new Set();
  for (const sent of splitSentences(text)) {
    const w = sent.trim().split(/\s+/);
    for (let i = 1; i < w.length; i++) {
      const raw = w[i].replace(/[^A-Za-zÄÖÜäöüß-]/g, "");
      if (raw.length < 3 || !/^[A-ZÄÖÜ]/.test(raw)) continue;
      const lowRaw = raw.toLowerCase();
      if (NAME_STOP.has(lowRaw)) continue;
      if (NOUN_GENDER[lowRaw]) continue;
      const prev = (w[i - 1] || "").replace(/[^A-Za-zÄÖÜäöüß]/g, "");
      if (DETERMINER.test(prev) || PREP.test(prev)) continue;
      out.add(raw);
    }
  }
  return [...out];
}
var PRAET_STRONG, PRAET_WEAK, PRAES_MARK, ADJ_CONTEXT, weakLooksVerbal, NAME_STOP, DETERMINER, PREP;
var init_coherence = __esm({
  "src/generation/coherence.ts"() {
    "use strict";
    init_text_utils();
    init_verben();
    init_verblex_data();
    init_waechterStatistik();
    init_nouns_data();
    PRAET_STRONG = /\b(war|waren|warst|hatte|hatten|wurde|wurden|ging|gingen|kam|kamen|sah|sahen|gab|gaben|stand|standen|blieb|blieben|hielt|hielten|ließ|ließen|fand|fanden|nahm|nahmen|sprach|sprachen|schrieb|schrieben|trug|trugen|fuhr|fuhren|lief|liefen|saß|saßen|lag|lagen|hieß|hießen|zog|zogen|schlief|schliefen|rief|riefen|fiel|fielen|sang|sangen|trank|tranken|schwieg|schwiegen|floss|flossen|stieg|stiegen|sank|sanken|bot|boten|schloss|schlossen|verlor|verloren|begann|begannen|geschah|geschahen|konnte|konnten|musste|mussten|wollte|wollten|sollte|sollten|durfte|durften|wusste|wussten|dachte|dachten|brachte|brachten)\b/i;
    PRAET_WEAK = /\b[a-zäöüß]{3,}(te|ten|test)\b/;
    PRAES_MARK = /\b(ist|sind|bin|bist|seid|hat|habe|hast|haben|habt|wird|werden|wirst|kann|kannst|können|muss|musst|müssen|will|willst|wollen|soll|sollen|darf|dürfen|weiß|wissen|geht|gehen|kommt|kommen|sieht|sehen|steht|stehen|bleibt|bleiben|liegt|liegen|gibt|geben|nimmt|nehmen|spricht|sprechen|trägt|tragen|läuft|laufen|fällt|fallen|geschieht|passiert|beginnt|endet|wartet|antwortet|arbeitet|bedeutet|beobachtet|berichtet|schlägt|zeigt|dauert|öffnet|schließt|klingt|riecht|scheint|hört|fühlt|wirkt|führt|dreht|zieht|hält|läuft|fließt|wächst|sinkt|steigt|schweigt|spricht|denkt|kennt|nennt|trägt|findet|verliert|verschwindet)\b/i;
    ADJ_CONTEXT = /(?:\b(?:der|die|das|den|dem|des|ein|eine|einen|einem|einer|eines|kein|keine|mein|meine|dein|deine|sein|seine|ihr|ihre|unser|unsere|jede|jeder|jedes|diese|dieser|dieses|manche|viele|alle)\s+[a-zäöüß]*)?\b[a-zäöüß]{3,}(?:te|ten)\b(?=\s+[A-ZÄÖÜ])/;
    weakLooksVerbal = (t) => {
      const m = t.match(/\b[a-zäöüß]{3,}(te|ten|test|tet)\b/g);
      if (!m) return false;
      return m.some((w) => schwachesPraeteritum(w, t));
    };
    NAME_STOP = /* @__PURE__ */ new Set(["der", "die", "das", "den", "dem", "des", "ein", "eine", "einen", "einem", "einer", "und", "oder", "aber", "denn", "doch", "dann", "als", "wie", "was", "wer", "wo", "wann", "warum", "ich", "du", "er", "sie", "es", "wir", "ihr", "man", "hier", "dort", "jetzt", "noch", "nur", "auch", "schon", "immer", "nie", "sehr", "so", "zu", "im", "am", "auf", "in", "an", "mit", "von", "f\xFCr", "bei", "nach", "vor", "\xFCber", "unter", "durch", "um", "ohne", "seit", "damals", "sp\xE4ter", "zuerst", "zuletzt", "stille", "nein", "ja", "fast", "vielleicht", "genau", "warte", "gut", "dabei", "dazu", "dann"]);
    DETERMINER = /^(der|die|das|den|dem|des|ein|eine|einen|einem|einer|eines|mein|meine|meinen|meinem|meiner|dein|deine|sein|seine|seinen|seinem|ihr|ihre|ihren|ihrem|unser|unsere|euer|eure|kein|keine|keinen|keinem|jeder|jede|jedes|dieser|diese|dieses|diesem|diesen|jener|jene|manche|viele|alle|beide|im|am|zum|zur|ins|ans|vom|beim|aufs|durchs|übers|unters)$/i;
    PREP = /^(in|an|auf|bei|mit|von|zu|nach|über|unter|vor|hinter|neben|zwischen|durch|für|ohne|um|gegen|seit|trotz|wegen|während|aus)$/i;
  }
});

// src/atoms/derive.ts
function subjektOf(t, typ) {
  if (!["hauptsatz", "nebensatz", "rahmen", "kopf"].includes(typ)) return null;
  const s = " " + t.toLowerCase() + " ";
  if (/\b(ich|mir|mich)\b/.test(s)) return { person: 1, numerus: "sg", genus: null };
  if (/\b(wir|uns)\b/.test(s)) return { person: 1, numerus: "pl", genus: null };
  if (/\b(du|dir|dich)\b/.test(s)) return { person: 2, numerus: "sg", genus: null };
  if (/\b(ihr|euch)\b/.test(s)) return { person: 2, numerus: "pl", genus: null };
  const m = t.match(/\b(?:der|die|das|ein|eine)\s+([A-ZÄÖÜ][a-zäöüß-]+)/);
  const g = m ? guessGender(m[1]) : void 0;
  const genus = g === "m" ? "mask" : g === "f" ? "fem" : g === "n" ? "neut" : null;
  const plural = /\b(sie|die)\s+\w+en\b/.test(t.toLowerCase()) || /\b(sind|waren|haben|werden)\b/.test(t.toLowerCase());
  return { person: 3, numerus: plural ? "pl" : "sg", genus };
}
function hatFinitesVerb(seg) {
  const ws = seg.match(/[A-Za-zÄÖÜäöüß]+/g) || [];
  for (let i = 0; i < ws.length; i++) {
    const w = ws[i];
    if (/^[A-ZÄÖÜ]/.test(w)) continue;
    const l = w.toLowerCase();
    const prev = (ws[i - 1] || "").toLowerCase(), next = ws[i + 1] || "";
    const attributiv = DET_ODER_PREP.has(prev) || /^[A-ZÄÖÜ]/.test(next);
    if ((prev === "ich" || next.toLowerCase() === "ich") && /^[a-zäöüß]{3,}e$/.test(l) && !DET_ODER_PREP.has(l)) return true;
    if (VERB_CONJ[l]) return true;
    if (SEIN_HABEN_WERDEN.test(l)) return true;
    if (PRAET_FORM.test(l)) return true;
    if (KURZVERB.test(l)) return true;
    if (/t$/.test(l) && !attributiv && istVerbform(l)) return true;
    if (/en$/.test(l) && l.length >= 5 && !EN_KEIN_VERB.has(l) && !attributiv && (VERB_CONJ[l.slice(0, -2) + "t"] || VERB_CONJ[l.slice(0, -2) + "et"] || istVerbform(l.slice(0, -2) + "t"))) return true;
    if (/^(?!ge)[a-zäöüß]{4,}(?:t|te|en|ten)$/.test(l) && !NOMEN_ENDUNG.test(l) && !KEIN_VERB.has(l) && !EN_KEIN_VERB.has(l)) return true;
  }
  const first = (seg.match(/^([A-ZÄÖÜ][a-zäöüß]+)/) || [])[1];
  if (first) {
    const l = first.toLowerCase();
    if (VERB_CONJ[l] || SEIN_HABEN_WERDEN.test(l) || PRAET_FORM.test(l)) return true;
  }
  return looksLikeFullClause(null, seg);
}
function deriveAtom(raw) {
  const text = (raw || "").trim();
  const unsicher = [];
  const wcount = woerter(text);
  const end = (text.match(/[.!?:;—]$/) || [""])[0];
  const lead = extractLeadVerb(text);
  const haupt = text.split(",")[0];
  const hatFinit = !!lead.verb || hatFinitesVerb(haupt);
  let typ;
  if (/:$/.test(text)) typ = "kopf";
  else if (text.includes("\u27E8")) typ = "rahmen";
  else if (wcount === 1) typ = "einwort";
  else if (KONNEKTOR.test(text)) typ = "konnektor";
  else if (SUBJUNKTION.test(text) && hatFinit) typ = "nebensatz";
  else if (REL.test(text) && hatFinit && /,/.test(text) === false && /\ben\b|\bt\b/.test("")) typ = "nebensatz";
  else if (hatFinit) typ = "hauptsatz";
  else if (PREP2.test(text)) typ = "praepositionalphrase";
  else if (ARTIKEL.test(text) || /\b[A-ZÄÖÜ][a-zäöüß-]{2,}/.test(text)) typ = "nominalphrase";
  else typ = "fragment";
  if (PREP2.test(text) && hatFinit) unsicher.push("typ (Inversion?)");
  if (typ === "fragment" && wcount >= 6) unsicher.push("typ (langes Fragment?)");
  let kasus = null;
  if (typ === "nominalphrase") {
    const a = (text.match(/^(\S+)/) || [""])[0].toLowerCase();
    const kern = (text.match(/\b([A-ZÄÖÜ][a-zäöüß-]{2,})/) || [])[1];
    const g = kern ? guessGender(kern) : void 0;
    if (/^(einen|den)$/.test(a)) kasus = "akk";
    else if (/^(einem|dem|einer)$/.test(a)) kasus = "dat";
    else if (a === "der") {
      kasus = g === "f" ? "dat" : g === "m" ? "nom" : null;
      if (!kasus) unsicher.push("kasus (der: Nom/Dat)");
    } else if (/^(eines|des)$/.test(a)) kasus = "gen";
    else if (/^(ein|eine|die|das)$/.test(a)) {
      kasus = "nom_akk";
      unsicher.push("kasus (nom/akk mehrdeutig)");
    } else unsicher.push("kasus");
  }
  const kadenz = end === ":" ? "schwebend" : end ? "fallend" : "offen";
  const tempus = typ === "nominalphrase" || typ === "fragment" || typ === "praepositionalphrase" || typ === "einwort" ? "kein" : isPastTense(text) ? "praeteritum" : "praesens";
  const bezug = PRON_START.test(text) ? { pronomen: (text.match(/^\S+/) || [""])[0].toLowerCase(), genus: /^(sie|ihr|ihnen)/i.test(text) ? "fem" : "mask", numerus: "sg" } : null;
  if (bezug) unsicher.push("verlangt_bezug (Genus gesch\xE4tzt)");
  const s = silben(text);
  return {
    text,
    typ,
    bietet: { kasus, kadenz },
    subjekt: subjektOf(text, typ),
    tempus,
    fuehrt_ein: properNames(text),
    verlangt_bezug: bezug,
    oeffnet: typ === "kopf",
    rhythmus: { woerter: wcount, silben: s, tiefe: tiefe(text), endzeichen: end, gewicht: wcount <= 4 ? "kurz" : wcount <= 9 ? "mittel" : "lang" },
    unsicher
  };
}
var SEIN_HABEN_WERDEN, KURZVERB, PRAET_FORM, EN_KEIN_VERB, DET_ODER_PREP, NOMEN_ENDUNG, PREP2, SUBJUNKTION, REL, KONNEKTOR, ARTIKEL, PRON_START, silben, woerter, tiefe;
var init_derive = __esm({
  "src/atoms/derive.ts"() {
    "use strict";
    init_wordcls();
    init_coherence();
    init_declension();
    init_verben();
    init_verbconj_data();
    SEIN_HABEN_WERDEN = /^(ist|sind|bin|bist|seid|war|waren|warst|hat|habe|hast|haben|habt|hatte|hatten|wird|werden|wirst|werdet|wurde|wurden|kann|kannst|können|könnt|konnte|muss|musst|müssen|müsst|will|willst|wollen|wollt|soll|sollen|darf|dürfen|mag|mögen|weiß|wissen|bleibt|bleiben|blieb|gibt|geben|gab)$/;
    KURZVERB = /^(löst|geht|ruft|tut|gibt|lebt|hebt|legt|sagt|sieht|hält|fällt|zieht|trägt|liegt|kommt|nimmt|läuft|steht|dreht|führt|hört|fühlt|zählt|setzt|passt|weint|lacht|denkt|kennt|nennt|misst|sinkt|steigt|klingt|singt|fehlt|blickt|wirkt|reißt|bricht|spricht|wächst)$/;
    PRAET_FORM = /(?:^|^[a-zäöüß]{2,6})(lag|lagen|stand|standen|ging|gingen|kam|kamen|sah|sahen|nahm|nahmen|hielt|hielten|ließ|ließen|fand|fanden|zog|zogen|trug|trugen|fiel|fielen|rief|riefen|sprach|schrieb|floss|stieg|sank|klang|hing|schien|trieb|brach|schloss|verlor|begann|geschah|roch|rochen|sass|saßen|riss|rissen|sprang|sprangen|schlug|schlugen|traf|trafen|griff|griffen|lief|liefen|wusste|wussten|verschwand|verschwanden|blieb|blieben|hieß|hießen|wuchs|wuchsen|schob|schoben|bog|bogen|schwieg|schwiegen)$/;
    EN_KEIN_VERB = /* @__PURE__ */ new Set([
      "gegen",
      "neben",
      "wegen",
      "zwischen",
      "entgegen",
      "oben",
      "unten",
      "eben",
      "dr\xFCben",
      "drau\xDFen",
      "drinnen",
      "morgen",
      "selten",
      "ansonsten",
      "meisten",
      "wenigsten",
      "offen",
      "eigen",
      "golden",
      "seiden",
      "wollen",
      "einen",
      "keinen",
      "meinen",
      "seinen",
      "ihren",
      "deinen",
      "unseren",
      "euren",
      "deren",
      "dessen",
      "allen",
      "vielen",
      "manchen",
      "welchen",
      "jeden",
      "diesen",
      "jenen",
      "denen",
      "ihnen",
      "sieben",
      "tausenden",
      "hunderten",
      "anderen",
      "einigen",
      "wenigen",
      "beiden",
      "solchen",
      "eigenen",
      "ersten",
      "zweiten",
      "dritten",
      "letzten",
      "n\xE4chsten",
      "besten",
      "ganzen",
      "halben",
      "fernen",
      "nahen",
      "hohen",
      "tiefen",
      "langen",
      "kurzen",
      "alten",
      "neuen",
      "jungen",
      "kleinen",
      "gro\xDFen",
      "roten",
      "gr\xFCnen",
      "blauen",
      "schwarzen",
      "wei\xDFen",
      "kalten",
      "warmen",
      "leeren",
      "vollen",
      "toten",
      "fremden",
      "stillen",
      "dunklen",
      "hellen",
      "innen",
      "au\xDFen",
      "hinten",
      "vorn",
      "mitten",
      "unterdessen",
      "indessen",
      "\xFCbrigen",
      "wegen",
      "trotzdem",
      "zusammen",
      "gegen\xFCber",
      "dr\xFCben"
    ]);
    DET_ODER_PREP = /* @__PURE__ */ new Set([
      "der",
      "die",
      "das",
      "des",
      "dem",
      "den",
      "ein",
      "eine",
      "einen",
      "einem",
      "einer",
      "eines",
      "kein",
      "keine",
      "keinen",
      "keinem",
      "keiner",
      "mein",
      "meine",
      "meinen",
      "meinem",
      "meiner",
      "dein",
      "deine",
      "deinen",
      "sein",
      "seine",
      "seinen",
      "seinem",
      "seiner",
      "ihr",
      "ihre",
      "ihren",
      "ihrem",
      "ihrer",
      "unser",
      "unsere",
      "unseren",
      "im",
      "am",
      "vom",
      "zum",
      "zur",
      "beim",
      "ins",
      "ans",
      "mit",
      "von",
      "zu",
      "aus",
      "bei",
      "nach",
      "seit",
      "auf",
      "an",
      "in",
      "\xFCber",
      "unter",
      "vor",
      "hinter",
      "neben",
      "zwischen",
      "durch",
      "f\xFCr",
      "ohne",
      "um",
      "gegen",
      "wegen",
      "trotz",
      "w\xE4hrend",
      "dieser",
      "diese",
      "diesen",
      "diesem",
      "dieses",
      "jeder",
      "jede",
      "jeden",
      "jedem",
      "jedes",
      "welcher",
      "welche",
      "welchen",
      "welchem",
      "manche",
      "manchen",
      "solche",
      "solchen",
      "viele",
      "vielen",
      "wenige",
      "wenigen",
      "einige",
      "einigen",
      "beide",
      "beiden",
      "zwei",
      "drei",
      "vier",
      "f\xFCnf",
      "sechs",
      "sieben",
      "acht",
      "neun",
      "zehn",
      "ganz",
      "sehr",
      "zu",
      "so",
      "wie",
      "als",
      "etwas",
      "nichts"
    ]);
    NOMEN_ENDUNG = /(ung|heit|keit|schaft|tät|ion|nis|tum|chen|lein|ment)$/;
    PREP2 = /^(in|im|an|am|auf|bei|beim|mit|von|vom|zu|zum|zur|nach|über|unter|vor|hinter|neben|zwischen|durch|für|ohne|um|gegen|seit|trotz|wegen|während|aus|entlang|inmitten|jenseits|abseits)\b/i;
    SUBJUNKTION = /^(dass|weil|obwohl|wenn|nachdem|bevor|ob|indem|sobald|solange|falls|sodass)\b/i;
    REL = /^(der|die|das|den|dem|des|welche[rsmn]?)\s+\S+\s/i;
    KONNEKTOR = /^(und|oder|aber|doch|denn|sondern|dann|dabei|also|somit|trotzdem|dennoch|außerdem|zudem)(\s+\w+)?$/i;
    ARTIKEL = /^(ein|eine|einen|einem|einer|eines|der|die|das|den|dem|des|kein|keine|mein|meine|dein|deine|sein|seine|ihr|ihre|dieser|diese|dieses|jener|jene)\b/i;
    PRON_START = /^(er|sie|es|ihm|ihr|ihn|ihnen|dessen|deren|diese[rs]?|jene[rs]?)\b/i;
    silben = (t) => {
      const w = t.toLowerCase().match(/[a-zäöüß]+/g) || [];
      return w.reduce((n, x) => n + Math.max(1, (x.match(/[aeiouäöüy]+/g) || []).length), 0);
    };
    woerter = (t) => (t.match(/\S+/g) || []).length;
    tiefe = (t) => (t.match(/,\s*(dass|weil|obwohl|wenn|als|während|nachdem|bevor|damit|ob|indem|der|die|das|den|dem|welche)/gi) || []).length;
  }
});

// src/features/knobs.ts
var init_knobs = __esm({
  "src/features/knobs.ts"() {
    "use strict";
  }
});

// src/atoms/atomisieren.ts
var init_atomisieren = __esm({
  "src/atoms/atomisieren.ts"() {
    "use strict";
    init_derive();
    init_waechterStatistik();
  }
});

// src/atoms/assemble.ts
var init_assemble = __esm({
  "src/atoms/assemble.ts"() {
    "use strict";
    init_schema();
    init_declension();
    init_derive();
    init_knobs();
    init_atomisieren();
  }
});

// src/generation/beats.ts
var init_beats = __esm({
  "src/generation/beats.ts"() {
    "use strict";
    init_text_utils();
    init_cooldown();
    init_assemble();
  }
});

// src/generation/dramaturgie.ts
var SCHLAG_STANDARD, SCHLAG_NAMEN;
var init_dramaturgie = __esm({
  "src/generation/dramaturgie.ts"() {
    "use strict";
    init_text_utils();
    init_beats();
    SCHLAG_STANDARD = ["einstieg", "hook", "regel", "mitte", "mitte2", "konflikt", "ausloeser", "wende", "zeit", "hoehepunkt", "einsatz", "schluss"];
    SCHLAG_NAMEN = /* @__PURE__ */ new Set([...SCHLAG_STANDARD]);
  }
});

// src/features/textpreset.ts
function teilstuecke(text) {
  return (text || "").replace(/\s+/g, " ").split(/(?<=[.!?…])\s+/).flatMap((s) => s.split(/\s*[;—–]\s*/)).map((s) => clean(s).replace(/^[„"«»]+|[.!?…„"«»]+$/g, "").trim()).filter((s) => {
    const w = s.split(/\s+/).filter(Boolean).length;
    return w >= 3 && w <= 22;
  });
}
function kategorieFuer(stueck, istSchluss) {
  const typ = deriveAtom(stueck).typ;
  const wc = stueck.split(/\s+/).filter(Boolean).length;
  if (typ === "nominalphrase") return wc <= 5 ? "props" : "motifs";
  if (typ !== "hauptsatz") return "motifs";
  if (istSchluss) return "endings";
  if (WIDERSTAND.test(stueck)) return "obstacles";
  if (WENDE.test(stueck)) return "turns";
  if (SPIEL.test(stueck)) return "stakes";
  return wc <= 14 ? "hooks" : "motifs";
}
function presetAusText(text) {
  const stuecke = teilstuecke(text);
  const bank = { motifs: [], hooks: [], props: [], turns: [], obstacles: [], stakes: [], endings: [] };
  const schlussGrenze = Math.max(0, stuecke.length - 2);
  const gesehen = /* @__PURE__ */ new Set();
  stuecke.forEach((s, i) => {
    const key = s.toLowerCase();
    if (gesehen.has(key)) return;
    gesehen.add(key);
    bank[kategorieFuer(s, i >= schlussGrenze && deriveAtom(s).typ === "hauptsatz")].push(s);
  });
  for (const k of KATEGORIEN) {
    if (bank[k].length) continue;
    const vollste = KATEGORIEN.filter((x) => bank[x].length > 1).sort((a, b) => bank[b].length - bank[a].length)[0];
    if (vollste) bank[k].push(bank[vollste].pop());
  }
  const woerter2 = (text || "").split(/\s+/).filter(Boolean).length;
  return { bank, woerter: woerter2, stuecke: gesehen.size };
}
function preset2AusText(text) {
  const p = presetAusText(text);
  const b = p.bank;
  const konflikte = [...b.stakes, ...b.hooks].map((s) => (s.match(/\bes geht um\s+(.{3,60})$/i) || [])[1]).filter((x) => !!x);
  const drama = {
    einstieg: b.hooks.slice(0, 3),
    mitte: b.motifs.slice(0, 4),
    hoehepunkt: b.turns.slice(0, 2),
    schluss: b.endings.slice(0, 3),
    ausloeser: b.props.slice(0, 5),
    veraenderungen: b.turns.slice(0, 4),
    konflikte: konflikte.slice(0, 5),
    zeitanomalien: [],
    regeln: []
  };
  const pools = [.../* @__PURE__ */ new Set([...b.props, ...b.motifs])];
  return { ...p, drama, pools };
}
var KATEGORIEN, WIDERSTAND, WENDE, SPIEL;
var init_textpreset = __esm({
  "src/features/textpreset.ts"() {
    "use strict";
    init_derive();
    init_text_utils();
    KATEGORIEN = ["motifs", "hooks", "props", "turns", "obstacles", "stakes", "endings"];
    WIDERSTAND = /\b(aber|doch|kein|keine|keinen|nicht|niemand|nichts|nie|niemals|fehlt|fehlen|scheitert|verweigert|bleibt aus|reicht nicht|zu spät|vergebens|umsonst)\b/i;
    WENDE = /^(dann|plötzlich|auf einmal|mit einem mal|seitdem|von da an)\b|\b(kippt|kippen|beginnt|beginnen|bricht|brechen|verwandelt|wendet|ändert|dreht sich|wird zu|wechselt)\b/i;
    SPIEL = /\b(es geht um|auf dem spiel|einsatz|entscheidet|entscheiden|zählt|zählen|gehört|gilt|bedeutet|kostet|verliert|gewinnt)\b/i;
  }
});

// src/features/storage-status.ts
var init_storage_status = __esm({
  "src/features/storage-status.ts"() {
    "use strict";
  }
});

// src/generation/verwandlung.ts
function geschlecht(w) {
  const kern = (w || "").trim().split(/\s+/).pop() || "";
  return guessGender(kern.replace(/[^A-Za-zÄÖÜäöüß]/g, ""));
}
function pruefePaar(roh) {
  const m = String(roh).split(/\s*(?:→|->|>)\s*/);
  if (m.length !== 2) return { ok: false, grund: "kein Pfeil zwischen zwei W\xF6rtern" };
  const von = m[0].trim(), nach = m[1].trim();
  if (!von || !nach) return { ok: false, grund: "eine Seite ist leer" };
  if (von.toLowerCase() === nach.toLowerCase()) return { ok: false, grund: "beide Seiten gleich" };
  const g1 = geschlecht(von), g2 = geschlecht(nach);
  if (!g1) return { ok: false, grund: `Geschlecht von \u201E${von}\u201C unbekannt` };
  if (!g2) return { ok: false, grund: `Geschlecht von \u201E${nach}\u201C unbekannt` };
  if (g1 !== g2) return { ok: false, grund: `verschiedenes Geschlecht (${g1} gegen ${g2})` };
  return { ok: true, grund: "" };
}
var init_verwandlung = __esm({
  "src/generation/verwandlung.ts"() {
    "use strict";
    init_text_utils();
    init_declension();
  }
});

// src/constants.ts
var BANK_KEYS, DEFAULT_BANK;
var init_constants = __esm({
  "src/constants.ts"() {
    "use strict";
    BANK_KEYS = [
      "motifs",
      "hooks",
      "props",
      "turns",
      "obstacles",
      "stakes",
      "endings"
    ];
    DEFAULT_BANK = {
      motifs: [
        "eine Uhr, die r\xFCckw\xE4rts tickt",
        "eine T\xFCr, die von innen atmet",
        "ein Spiegelbild, das zu sp\xE4t reagiert",
        "ein Formular mit einem Feld zu viel",
        "ein Kabel, das warm wird, ohne Strom",
        "eine Narbe, die sich erinnert",
        "ein Name, der nicht ausgesprochen werden kann",
        "ein Licht, das die falschen Dinge zeigt",
        "ein Ger\xE4usch, das nur in Gedanken existiert",
        "eine Karte, die Orte erfindet"
      ],
      hooks: [
        "eine rote Feder im falschen Winkel",
        "ein Lichtstreifen, der aus dem Nichts kommt",
        "ein leises Klopfen hinter der Wand",
        "ein Foto, das ein Detail mehr zeigt als gestern",
        "ein Schatten, der nicht zur Figur passt",
        "eine Nachricht ohne Absender",
        "eine T\xFCr, die pl\xF6tzlich nicht mehr T\xFCr sein will"
      ],
      props: [
        "einen Schl\xFCssel",
        "eine Karte",
        "eine M\xFCnze",
        "ein Foto",
        "ein Notizbuch",
        "eine Lampe",
        "ein St\xFCck Kreide",
        "einen Kompass",
        "einen Ausweis",
        "ein Siegel"
      ],
      turns: [
        "pl\xF6tzlich passt die Zeit nicht mehr zu den Uhren",
        "die Spur f\xFChrt nicht nach au\xDFen, sondern nach innen",
        "das Offensichtliche wird unbenennbar",
        "etwas antwortet \u2013 ohne Stimme",
        "die Logik bleibt bestehen, aber in falscher Reihenfolge"
      ],
      obstacles: [
        "die T\xFCr ist verschlossen",
        "jemand h\xF6rt mit",
        "die eigene Wahrnehmung wackelt",
        "eine Regel gilt, die niemand erkl\xE4rt",
        "die Akte tr\xE4gt das falsche Datum"
      ],
      stakes: [
        "Der Einsatz ist Mut.",
        "Der Einsatz ist Zeit: Ein Teil des Abends kommt nicht zur\xFCck.",
        "Der Einsatz ist Wahrheit: Etwas am Selbstbild verschiebt sich.",
        "Der Einsatz ist Vertrauen: in sich selbst."
      ],
      endings: [
        "Damit ist es entschieden.",
        "So schlie\xDFt sich der Kreis.",
        "Und vielleicht beginnt es erst hier.",
        "Und die T\xFCr fiel ins Schloss.",
        "Und es war, als h\xE4tte der Ort kurz geblinzelt."
      ]
    };
  }
});

// src/storage.ts
function normalizeBankShape(bank) {
  const out = structuredClone(DEFAULT_BANK);
  const src = bank ?? {};
  for (const k of BANK_KEYS) {
    const v2 = src[k];
    if (Array.isArray(v2)) out[k] = v2.map(clean).filter(Boolean);
  }
  const v = src["verwandlungen"];
  if (Array.isArray(v)) {
    const gut = v.map(clean).filter(Boolean).filter((x) => pruefePaar(x).ok);
    if (gut.length) out.verwandlungen = gut;
  }
  return out;
}
var init_storage = __esm({
  "src/storage.ts"() {
    "use strict";
    init_storage_status();
    init_verwandlung();
    init_constants();
    init_text_utils();
  }
});

// src/features/ki.ts
var ki_exports = {};
__export(ki_exports, {
  KATEGORIE_VORGABE: () => KATEGORIE_VORGABE,
  buildWordbankPrompt: () => buildWordbankPrompt,
  callClaude: () => callClaude,
  callClaudeBild: () => callClaudeBild,
  callClaudeEx: () => callClaudeEx,
  callClaudeStream: () => callClaudeStream,
  elaborateText: () => elaborateText,
  extractJson: () => extractJson,
  generateAiWordbank: () => generateAiWordbank,
  isOnline: () => isOnline,
  loadAiKey: () => loadAiKey,
  loadAiModel: () => loadAiModel,
  saveAiKey: () => saveAiKey,
  saveAiModel: () => saveAiModel,
  smoothText: () => smoothText
});
function loadAiKey() {
  try {
    return localStorage.getItem(AI_KEY) || "";
  } catch {
    return "";
  }
}
function saveAiKey(k) {
  try {
    localStorage.setItem(AI_KEY, k || "");
  } catch {
  }
}
function loadAiModel() {
  try {
    return localStorage.getItem(AI_MODEL) || DEFAULT_MODEL;
  } catch {
    return DEFAULT_MODEL;
  }
}
function saveAiModel(m) {
  try {
    localStorage.setItem(AI_MODEL, m || DEFAULT_MODEL);
  } catch {
  }
}
function isOnline() {
  try {
    return navigator.onLine !== false;
  } catch {
    return true;
  }
}
async function postMessages(body, signal) {
  if (!isOnline()) throw new Error("Keine Internetverbindung \u2014 KI-Funktionen sind offline nicht verf\xFCgbar.");
  const key = loadAiKey();
  const url = "https://api.anthropic.com/v1/messages";
  const headers = {
    "content-type": "application/json",
    "x-api-key": key,
    "anthropic-version": "2023-06-01",
    "anthropic-dangerous-direct-browser-access": "true"
  };
  const delays = [1e3, 2e3, 4e3];
  let lastErr;
  for (let attempt = 0; attempt <= delays.length; attempt++) {
    try {
      const res = await fetch(url, { method: "POST", headers, body: JSON.stringify(body), signal });
      if ((res.status === 429 || res.status === 529 || res.status >= 500) && attempt < delays.length) {
        await sleep(delays[attempt]);
        continue;
      }
      return res;
    } catch (e) {
      if (signal?.aborted) throw e;
      lastErr = e;
      if (attempt < delays.length) {
        await sleep(delays[attempt]);
        continue;
      }
    }
  }
  throw lastErr instanceof Error ? lastErr : new Error("Netzwerkfehler bei der KI-Anfrage.");
}
async function callClaudeRaw(promptText, maxTokens, prefill, noThinking = false) {
  const model = loadAiModel();
  const messages = [{ role: "user", content: promptText }];
  if (prefill) messages.push({ role: "assistant", content: prefill });
  const body = noThinking ? { model, max_tokens: maxTokens || 4096, messages, thinking: { type: "disabled" } } : { model, max_tokens: maxTokens || 4096, messages };
  const res = await postMessages(body);
  if (!res.ok) {
    let msg = `HTTP ${res.status}`;
    try {
      const e = await res.json();
      if (e?.error?.message) msg = e.error.message;
    } catch {
    }
    throw new Error(msg);
  }
  const data = await res.json();
  let text = "";
  const kinds = [];
  if (Array.isArray(data.content)) {
    for (const b of data.content) if (b && typeof b.type === "string") kinds.push(b.type);
    text = data.content.filter((b) => b && b.type === "text" && typeof b.text === "string").map((b) => b.text).join("\n").trim();
  }
  if (text && prefill) text = prefill + text;
  const truncated = data.stop_reason === "max_tokens";
  if (!text) {
    const diag = `Modell ${model} \xB7 angefordert ${maxTokens || 4096} \xB7 verbraucht ${data.usage?.output_tokens ?? "?"} \xB7 Blocktypen [${kinds.join(", ") || "keine"}] \xB7 stop_reason ${data.stop_reason || "unbekannt"}`;
    throw new Error(truncated ? `Token-Limit ersch\xF6pft, bevor Text zur\xFCckkam.
${diag}
` + (kinds.includes("thinking") ? "Das Modell hat das Budget f\xFCr interne \xDCberlegungen verbraucht. Bitte ein Modell ohne erweitertes Nachdenken eintragen (Studio \u25B8 Einstellungen \u25B8 KI-Zugang)." : "Bitte eine k\xFCrzere Ziell\xE4nge w\xE4hlen oder erneut versuchen.") : `Antwort ohne Textblock.
${diag}`);
  }
  return { text, truncated };
}
async function callClaudeEx(promptText, maxTokens, prefill) {
  const isParamProblem = (m) => /thinking|unexpected|unsupported|not supported|invalid/i.test(m);
  const isPrefillProblem = (m) => /prefill/i.test(m);
  try {
    return await callClaudeRaw(promptText, maxTokens, prefill, true);
  } catch (e) {
    const m = String(e.message || "");
    if (isPrefillProblem(m) && prefill) return await callClaudeRaw(promptText, maxTokens, null, true);
    if (!isParamProblem(m)) throw e;
    try {
      return await callClaudeRaw(promptText, maxTokens, prefill, false);
    } catch (e2) {
      const m2 = String(e2.message || "");
      if (isPrefillProblem(m2) && prefill) return await callClaudeRaw(promptText, maxTokens, null, false);
      throw e2;
    }
  }
}
async function callClaude(promptText, maxTokens, prefill) {
  return (await callClaudeEx(promptText, maxTokens, prefill)).text;
}
async function callClaudeStream(promptText, maxTokens, onDelta, signal, modell) {
  if (!loadAiKey()) throw new Error("Kein API-Schl\xFCssel hinterlegt.");
  const model = modell || loadAiModel();
  const body = {
    model,
    max_tokens: maxTokens || 4096,
    stream: true,
    thinking: { type: "disabled" },
    messages: [{ role: "user", content: promptText }]
  };
  const res = await postMessages(body, signal);
  if (!res.ok || !res.body) {
    let msg = `HTTP ${res.status}`;
    try {
      const e = await res.json();
      if (e?.error?.message) msg = e.error.message;
    } catch {
    }
    throw new Error(msg);
  }
  const reader = res.body.getReader();
  const dec = new TextDecoder();
  let buf = "", full = "", stop = "";
  let einTok = 0, ausTok = 0;
  for (; ; ) {
    const { done, value } = await reader.read();
    if (done) break;
    buf += dec.decode(value, { stream: true });
    const lines = buf.split("\n");
    buf = lines.pop() || "";
    for (const line of lines) {
      const t = line.trim();
      if (!t.startsWith("data:")) continue;
      const payload = t.slice(5).trim();
      if (payload === "[DONE]") continue;
      try {
        const ev = JSON.parse(payload);
        if (ev.type === "message_start") {
          einTok = ev.message?.usage?.input_tokens || 0;
          ausTok = ev.message?.usage?.output_tokens || 0;
        } else if (ev.type === "content_block_delta" && ev.delta?.type === "text_delta" && ev.delta.text) {
          full += ev.delta.text;
          onDelta(ev.delta.text, full);
        } else if (ev.type === "message_delta") {
          if (ev.delta?.stop_reason) stop = ev.delta.stop_reason;
          if (ev.usage?.output_tokens) ausTok = ev.usage.output_tokens;
          if (ev.usage?.input_tokens) einTok = ev.usage.input_tokens;
        }
      } catch {
      }
    }
  }
  return { text: full.trim(), truncated: stop === "max_tokens", usage: { ein: einTok, aus: ausTok } };
}
async function callClaudeBild(promptText, bild, maxTokens, modell, signal) {
  if (!loadAiKey()) throw new Error("Kein API-Schl\xFCssel hinterlegt.");
  const body = {
    model: modell || loadAiModel(),
    max_tokens: maxTokens || 2048,
    thinking: { type: "disabled" },
    messages: [{
      role: "user",
      content: [
        { type: "image", source: { type: "base64", media_type: bild.media, data: bild.daten } },
        { type: "text", text: promptText }
      ]
    }]
  };
  const res = await postMessages(body, signal);
  if (!res.ok) {
    let msg = `HTTP ${res.status}`;
    try {
      const e = await res.json();
      if (e?.error?.message) msg = e.error.message;
    } catch {
    }
    throw new Error(msg);
  }
  const data = await res.json();
  const text = Array.isArray(data.content) ? data.content.filter((b) => b && b.type === "text" && typeof b.text === "string").map((b) => b.text).join("\n").trim() : "";
  const usage = { ein: data.usage?.input_tokens || 0, aus: data.usage?.output_tokens || 0 };
  if (!text) {
    throw new Error(data.stop_reason === "max_tokens" ? "Token-Limit ersch\xF6pft, bevor Text zur\xFCckkam \u2014 weniger S\xE4tze anfordern." : "Antwort ohne Textblock.");
  }
  return { text, truncated: data.stop_reason === "max_tokens", usage };
}
function extractJson(raw) {
  const s = (raw || "").trim().replace(/^```(?:json)?\s*/i, "").replace(/```\s*$/, "").trim();
  const start = s.indexOf("{");
  if (start === -1) throw new Error("Keine JSON-Antwort erhalten.");
  let depth = 0, inStr = false, esc = false, end = -1;
  for (let i = start; i < s.length; i++) {
    const c = s[i];
    if (inStr) {
      if (esc) esc = false;
      else if (c === "\\") esc = true;
      else if (c === '"') inStr = false;
      continue;
    }
    if (c === '"') inStr = true;
    else if (c === "{") depth++;
    else if (c === "}") {
      depth--;
      if (depth === 0) {
        end = i;
        break;
      }
    }
  }
  if (end === -1) throw new Error("Antwort abgeschnitten (kein schlie\xDFendes '}').");
  const body = s.slice(start, end + 1).replace(/,\s*([}\]])/g, "$1");
  return JSON.parse(body);
}
function buildWordbankPrompt(ctx) {
  let p = `Du erstellst eine "Wortbank" f\xFCr einen prozeduralen, deutschsprachigen Kreativ-Textgenerator. Die Wortbank besteht aus 7 Textkategorien mit ZUSAMMEN rund 125 kurzen, stimmungsvollen deutschen Phrasen (keine ganzen Abs\xE4tze, meist 3-10 W\xF6rter), passend zu folgendem Kontext:
Ort: ${ctx.where || "(offen)"}
Zeit: ${ctx.when || "(offen)"}
Figur(en): ${ctx.who || "(offen)"}
Handlung: ${ctx.what || "(offen)"}
Ton: ${ctx.tone || "(offen)"}
`;
  if (ctx.userPrompt) p += `
ZUS\xC4TZLICHE VORGABE DES NUTZERS (vorrangig): ${ctx.userPrompt}
`;
  p += "\nKategorien mit ANZAHL (die Zahlen bitte einhalten, sie sind gemessen):\n" + KATEGORIE_VORGABE.map((k) => `- ${k.key}: ${k.anzahl} ${k.text} (${k.min}\u2013${k.max})` + (k.woerter ? `, ~${k.woerter} W\xF6rter je Eintrag` : "") + "\n").join("") + '\nEINE HAND, NICHT DREI: Alle Eintr\xE4ge m\xFCssen aus DERSELBEN Welt stammen \u2014 gleiches Register, gleiche Bildwelt, gleicher Wortschatz. Das ist keine Stilfrage, sondern gemessen: Ein Preset aus einer Hand tr\xE4gt einen langen Text auf 95 % der Vorgabe, eine Mischung aus drei Presets bei GLEICHER Gr\xF6\xDFe nur auf 84 %. Der Generator pr\xFCft jeden Anschluss auf Kasus, Tempus und Satztyp und verwirft mehr, wenn das Material auseinanderf\xE4llt. Lieber 120 Eintr\xE4ge aus einer Welt als 200 aus dreien.\n\nWORTZAHL \u2014 das eigentliche Ma\xDF: Die 120 Eintr\xE4ge sollen ZUSAMMEN rund 850 W\xF6rter tragen, im Schnitt also SIEBEN W\xF6rter je Eintrag. Das ist gemessen, nicht gesch\xE4tzt: \xDCber 23 Presets sagt die Zahl der Eintr\xE4ge kaum etwas \xFCber die erreichte Textl\xE4nge voraus, die Zahl der W\xF6rter dagegen deutlich (r = 0,80). Ein Preset mit 123 Eintr\xE4gen und 557 W\xF6rtern tr\xE4gt einen 450-W\xF6rter-Bericht nur auf 72 %; eines mit 128 Eintr\xE4gen und 923 W\xF6rtern auf 108 %. Drei- und Vierwortbrocken ("Das ist so random.") f\xFCllen die Liste, aber nicht den Text. Schreibe also lieber "ein Wappen ohne Farbe an kalter Mauer" als "ein Wappen".\n\nWO die W\xF6rter stehen, entscheidet mit: turns, obstacles und endings tragen den Bericht deutlich st\xE4rker als props und motifs. In einem Versuch mit f\xFCnf Presets brachten hundert zus\xE4tzliche W\xF6rter in den SATZ-Kategorien rund 9 Prozentpunkte L\xE4nge, hundert W\xF6rter in den Nominal-Kategorien nur rund 6. Halte turns, obstacles und endings deshalb bei mindestens sieben W\xF6rtern \u2014 ein vollst\xE4ndiger Satz mit einem Umstand, nicht ein Stichwort. F\xFCr props gilt das NICHT: Sie stehen im Bestand bei rund vier W\xF6rtern, weil sie als Objekt in einen fremden Satz gesetzt werden \u2014 "einen Kompass mit beschlagenem Glas" ist die richtige L\xE4nge, ein ganzer Satz w\xE4re dort falsch. \xDCber alle Kategorien tragen die Satz-Kategorien (hooks, turns, obstacles, endings) rund 65 Prozent der W\xF6rter; das ist die Verteilung, die der Bestand hat.\n\nMOTIVE M\xDCSSEN ALLEIN STEHEN K\xD6NNEN: Jedes motif ist eine Nominalphrase mit Artikel und eigenem Kopf, am besten mit Relativsatz \u2014 "eine Glocke, die \xFCber allen D\xE4chern h\xE4ngt". NICHT: "Brot und Ketten", "Kan\xE4le unter der Stadt", "die Kathedrale im Regen". Solche Bruchst\xFCcke haben keinen Kopf, an den der Generator anschlie\xDFen kann. Gemessen an einem Preset mit zehn davon: Der Zusammenbau brach in 33 von 60 L\xE4ufen mitten im Text ab, der Median lag bei 90 statt 400 W\xF6rtern. Nach dem Umschreiben: 387.\n\nDie Zahl 120 ist \xFCbrigens KEIN Ziel f\xFCr sich. \xDCber 23 Presets gemessen sagt die Eintragszahl nichts mehr voraus, sobald die Wortzahl bekannt ist (r = -0,04). 90 lange Eintr\xE4ge sind so gut wie 120 kurze, solange die 850 W\xF6rter zusammenkommen.\n\nUND NICHT MEHR ALS 850: Der Ertrag s\xE4ttigt. An zw\xF6lf nachverdichteten Presets gemessen bringen hundert zus\xE4tzliche W\xF6rter unterhalb von 85 Prozent L\xE4nge noch 11 bis 18 Punkte, oberhalb von 91 Prozent nur noch 1 bis 3. Wer \xFCber 850 hinausschreibt, gewinnt keine L\xE4nge mehr, sondern nur noch Abwechslung \u2014 das ist ein Grund, aber ein anderer.\n\nMOTIVVERWANDLUNGEN \u2014 die achte Liste: 41 der 51 eingebauten Presets tragen sie, im Median acht Paare. Ein Paar sagt, was aus einem Bild wird, wenn es WIEDERKEHRT: Das erste Vorkommen bleibt stehen und f\xFChrt das Motiv ein, jedes weitere wird verwandelt. Der Leser sieht dasselbe Ding zweimal, und beim zweiten Mal ist es etwas anderes geworden.\nForm: "Wort\u2192Wort", ein Paar je Eintrag, z.B. "Glocke\u2192Stimme", "Harpune\u2192Feder", "Akte\u2192Mappe".\nHARTE BEDINGUNG: Beide W\xF6rter m\xFCssen DASSELBE GESCHLECHT haben (der/der, die/die, das/das). Sonst steht im Text "das Stille", weil der Artikel davor nicht mitverwandelt wird \u2014 und der Generator wirft solche Paare still weg. Nimm Grundw\xF6rter im Singular, keine Wortgruppen.\n\nKEINE DUBLETTEN: Kein Eintrag darf zweimal vorkommen, auch nicht leicht abgewandelt. Ein Eintrag zweimal ist kein zweiter Eintrag.\n\nZEITFORM: Satzartige Eintr\xE4ge (hooks, turns, obstacles, endings) im PR\xC4SENS. Kein Pr\xE4teritum, kein Perfekt.\n\nWICHTIG: Deine Antwort MUSS mit { beginnen und mit } enden \u2014 nur reines JSON mit genau diesen 8 Schl\xFCsseln (motifs, hooks, props, turns, obstacles, stakes, endings, verwandlungen), jeweils ein Array von Strings. Keine Erkl\xE4rungen, kein Markdown.';
  return p;
}
async function generateAiWordbank(ctx) {
  const raw = await callClaude(buildWordbankPrompt(ctx), 8192, "{");
  return normalizeBankShape(extractJson(raw));
}
async function elaborateText(text, targetWords) {
  const n = Math.max(100, Math.min(2e3, Math.round(targetWords)));
  const prompt = "Hier ist ein kurzer, oft sperriger Rohtext aus einem experimentellen Textgenerator (Divergenzmaschine). Arbeite ihn zu einem zusammenh\xE4ngenden literarischen Prosatext von etwa " + n + " W\xF6rtern aus: entfalte Bilder, Szenen, Figuren und Atmosph\xE4re, vertiefe die vorhandenen Motive und behalte den surrealen, dichten Ton bei. Bleibe bei den vorgegebenen Figuren, Orten und der Grundidee; erfinde nichts, was dem Text widerspricht. Schreibe auf Deutsch. Gib NUR den ausgearbeiteten Text zur\xFCck, ohne \xDCberschrift, Erkl\xE4rung oder Meta-Kommentar.\n\n---\n\n" + text;
  const maxTok = Math.min(8192, Math.ceil(n * 2.4) + 400);
  return callClaude(prompt, maxTok);
}
async function smoothText(text) {
  const prompt = "Hier ist ein maschinell generierter, oft sperriger Rohtext aus einem kreativen Textgenerator (Divergenzmaschine). Schreibe daraus eine fl\xFCssige, koh\xE4rente Rohfassung: behebe Grammatikfehler, Logikbr\xFCche und Wiederholungen, gl\xE4tte den Erz\xE4hlfluss, behalte aber Figuren, Orte und Handlung bei. Gib NUR den \xFCberarbeiteten Text zur\xFCck, ohne Erkl\xE4rungen oder Meta-Kommentare.\n\n---\n\n" + text;
  return callClaude(prompt);
}
var AI_KEY, AI_MODEL, DEFAULT_MODEL, sleep, KATEGORIE_VORGABE;
var init_ki = __esm({
  "src/features/ki.ts"() {
    "use strict";
    init_storage();
    AI_KEY = "divergenz_ai_key_v1";
    AI_MODEL = "divergenz_ai_model_v1";
    DEFAULT_MODEL = "claude-sonnet-5";
    sleep = (ms) => new Promise((r) => setTimeout(r, ms));
    KATEGORIE_VORGABE = [
      {
        key: "motifs",
        anzahl: 22,
        min: 16,
        max: 30,
        woerter: 6,
        text: "wiederkehrende Bilder, Nominalphrase MIT Artikel und eigenem Kopf"
      },
      {
        key: "hooks",
        anzahl: 17,
        min: 14,
        max: 20,
        woerter: 8,
        text: "kleine, irritierende Details oder S\xE4tze"
      },
      {
        key: "props",
        anzahl: 20,
        min: 15,
        max: 28,
        woerter: 4,
        text: 'Gegenst\xE4nde MIT unbestimmtem Artikel im Akkusativ, z.B. "einen Schl\xFCssel zum Kerker"'
      },
      { key: "turns", anzahl: 21, min: 18, max: 26, woerter: 8, text: "Wendepunkte, je ein knapper Satz" },
      { key: "obstacles", anzahl: 20, min: 17, max: 26, woerter: 7, text: "Hindernisse, je ein knapper Satz" },
      {
        key: "stakes",
        anzahl: 11,
        min: 7,
        max: 14,
        woerter: 9,
        text: 'S\xE4tze, jeder beginnt mit "Der Einsatz ist"'
      },
      { key: "endings", anzahl: 15, min: 11, max: 18, woerter: 8, text: "Schlusss\xE4tze" },
      {
        key: "verwandlungen",
        anzahl: 8,
        min: 4,
        max: 12,
        woerter: 0,
        text: "Motivpaare \u2014 siehe unten"
      }
    ];
  }
});

// src/features/erzaehlerbank.ts
var erzaehlerbank_exports = {};
__export(erzaehlerbank_exports, {
  ARCHIV_JE_BAUFORM: () => ARCHIV_JE_BAUFORM,
  BAUFORM_ANWEISUNG: () => BAUFORM_ANWEISUNG,
  SCHLAGFOLGEN: () => SCHLAGFOLGEN,
  ableiteSchlagfolge: () => ableiteSchlagfolge,
  archivEintraege: () => archivEintraege,
  archivFuer: () => archivFuer,
  archiviere: () => archiviere,
  bauePromptErzaehlung: () => bauePromptErzaehlung,
  bauformAendern: () => bauformAendern,
  bogenAus: () => bogenAus,
  bogenBeschriftung: () => bogenBeschriftung,
  bogenFuerErzeugung: () => bogenFuerErzeugung,
  eintragId: () => eintragId,
  eintragNachId: () => eintragNachId,
  kiErzaehlung: () => kiErzaehlung,
  ladeArbeitsplatz: () => ladeArbeitsplatz,
  ladeArchiv: () => ladeArchiv,
  ladeQuelle: () => ladeQuelle,
  letzterGezogen: () => letzterGezogen,
  loescheAusArchiv: () => loescheAusArchiv,
  loescheEintrag: () => loescheEintrag,
  migriereAltePlaetze: () => migriereAltePlaetze,
  platzBrauchbar: () => platzBrauchbar,
  setzeQuelle: () => setzeQuelle,
  speichereArbeitsplatz: () => speichereArbeitsplatz,
  speichereArchiv: () => speichereArchiv
});
function ladeArbeitsplatz() {
  migriereAltePlaetze();
  try {
    const e = JSON.parse(localStorage.getItem(ARBEITSPLATZ_KEY) || "null");
    const f = String(e?.folge || "");
    return {
      titel: String(e?.titel || "").slice(0, 60),
      text: String(e?.text || ""),
      folge: SCHLAGFOLGEN[f] ? f : "standard",
      geburt: typeof e?.geburt === "string" ? e.geburt : void 0
    };
  } catch {
    return { titel: "", text: "", folge: "standard" };
  }
}
function speichereArbeitsplatz(e) {
  try {
    localStorage.setItem(ARBEITSPLATZ_KEY, JSON.stringify(e));
  } catch {
  }
}
function ladeQuelle() {
  migriereAltePlaetze();
  const q = localStorage.getItem(QUELLE_KEY) || "preset";
  return q === "preset" || q === "wuerfeln" || /^a:/.test(q) ? q : "preset";
}
function setzeQuelle(q) {
  try {
    localStorage.setItem(QUELLE_KEY, q);
  } catch {
  }
}
function platzBrauchbar(e) {
  return (e.text || "").split(/\s+/).filter(Boolean).length >= 40;
}
function bogenAus(e) {
  if (!e || !platzBrauchbar(e)) return null;
  const drama = preset2AusText(e.text).drama;
  if (e.folge === "eigen") drama.folge = ableiteSchlagfolge(e.text);
  else if (e.folge && SCHLAGFOLGEN[e.folge]) drama.folge = SCHLAGFOLGEN[e.folge].folge;
  return drama;
}
function eintragId(e) {
  const basis = `${e.folge || "standard"}|${titelNorm(e.titel) || archivNorm(e)}`;
  let h = 0;
  for (let i = 0; i < basis.length; i++) h = h * 31 + basis.charCodeAt(i) >>> 0;
  return `a:${e.folge || "standard"}:${h.toString(36)}`;
}
function archivEintraege() {
  migriereAltePlaetze();
  const a = ladeArchiv();
  const out = [];
  for (const k of Object.keys(SCHLAGFOLGEN)) for (const e of a[k] || []) out.push({ ...e, id: eintragId(e) });
  for (const [k, l] of Object.entries(a)) if (!SCHLAGFOLGEN[k]) for (const e of l) out.push({ ...e, id: eintragId(e) });
  return out;
}
function eintragNachId(id) {
  return archivEintraege().find((e) => e.id === id) || null;
}
function letzterGezogen() {
  return letzter;
}
function bogenFuerErzeugung() {
  const q = ladeQuelle();
  letzter = null;
  if (q === "preset") return null;
  if (q === "wuerfeln") {
    const brauchbar = archivEintraege().filter((e2) => platzBrauchbar(e2));
    if (!brauchbar.length) return null;
    letzter = brauchbar[Math.floor(Math.random() * brauchbar.length)];
    return bogenAus(letzter);
  }
  const e = eintragNachId(q);
  if (!e || !platzBrauchbar(e)) return null;
  letzter = e;
  return bogenAus(e);
}
function bogenBeschriftung() {
  const q = ladeQuelle();
  if (letzter) return { bogen: `${q === "wuerfeln" ? "gew\xFCrfelt: " : ""}${letzter.titel || "Ohne Titel"}`, bauform: SCHLAGFOLGEN[letzter.folge || "standard"]?.name || letzter.folge || "" };
  if (q === "preset") return { bogen: "aus Preset", bauform: "Steigender Bogen" };
  return { bogen: q === "wuerfeln" ? "w\xFCrfeln \u2014 kein brauchbarer Eintrag im Archiv" : "gew\xE4hlter Eintrag fehlt im Archiv", bauform: "" };
}
function migriereAltePlaetze() {
  if (migriert) return;
  migriert = true;
  try {
    const roh = localStorage.getItem(ALTE_BANK_KEY);
    if (!roh) return;
    const alte = JSON.parse(roh);
    const q = localStorage.getItem(QUELLE_KEY) || "preset";
    let gewaehlt = null;
    if (Array.isArray(alte)) alte.forEach((p, i) => {
      const e = { titel: String(p?.titel || "").slice(0, 60), text: String(p?.text || ""), folge: SCHLAGFOLGEN[String(p?.folge || "")] ? String(p?.folge) : "standard", geburt: typeof p?.geburt === "string" ? p.geburt : void 0 };
      if (!platzBrauchbar(e)) return;
      archiviere(e);
      if (String(i) === q || !gewaehlt && q !== "preset" && q !== "wuerfeln" && !/^[0-9]$/.test(q)) gewaehlt = e;
      if (!gewaehlt && q === "preset" && i === 0) gewaehlt = e;
    });
    if (gewaehlt) {
      localStorage.setItem(ARBEITSPLATZ_KEY, JSON.stringify(gewaehlt));
      if (/^[0-9]$/.test(q)) localStorage.setItem(QUELLE_KEY, eintragId(gewaehlt));
    }
    localStorage.removeItem(ALTE_BANK_KEY);
  } catch {
  }
}
function ableiteSchlagfolge(text) {
  const stuecke = teilstuecke(text);
  const grenze = Math.max(0, stuecke.length - 2);
  const roh = [];
  let ersterHaken = true;
  stuecke.forEach((st, i) => {
    const kat = kategorieFuer(st, i >= grenze && deriveAtom(st).typ === "hauptsatz");
    let schlag;
    switch (kat) {
      case "hooks":
        schlag = ersterHaken ? "einstieg" : "hook";
        ersterHaken = false;
        break;
      case "props":
        schlag = "ausloeser";
        break;
      case "motifs":
        schlag = "mitte";
        break;
      case "obstacles":
        schlag = "konflikt";
        break;
      case "turns":
        schlag = "wende";
        break;
      case "stakes":
        schlag = "einsatz";
        break;
      case "endings":
        schlag = "schluss";
        break;
      default:
        schlag = "mitte";
    }
    if (roh[roh.length - 1] !== schlag) roh.push(schlag);
  });
  if (!roh.length) return SCHLAGFOLGEN["standard"].folge;
  const letzteWende = roh.lastIndexOf("wende");
  if (letzteWende >= 0) roh[letzteWende] = "hoehepunkt";
  let folge = roh.filter((x) => x !== "einstieg" && x !== "schluss");
  folge.unshift("einstieg");
  folge.push("schluss");
  const gelenk = /* @__PURE__ */ new Set(["einstieg", "hoehepunkt", "schluss", "einsatz"]);
  while (folge.length > 12) {
    const weg = folge.findIndex((x, i) => !gelenk.has(x) && i % 2 === 1);
    if (weg < 0) break;
    folge.splice(weg, 1);
    folge = folge.filter((x, i) => i === 0 || x !== folge[i - 1]);
  }
  return folge;
}
function bauePromptErzaehlung(folgeId, thema) {
  const bau = BAUFORM_ANWEISUNG[folgeId] || BAUFORM_ANWEISUNG["standard"];
  const t = (thema || "").trim();
  return [
    "Schreibe eine sehr kurze deutsche Erz\xE4hlung, 120 bis 170 W\xF6rter, Pr\xE4sens, konkrete Bilder, keine Anf\xFChrungszeichen, keine Aufz\xE4hlungen.",
    `Bauform: ${bau}.`,
    t ? `Thema oder Ausgangspunkt: ${t}.` : "Thema frei w\xE4hlen \u2014 alltagsnah, mit einem leisen Riss.",
    "Kurze Haupts\xE4tze bevorzugen; ein bis zwei reine Bilds\xE4tze ohne Verb sind erw\xFCnscht (sie werden als Bilder und Requisiten gelesen); mindestens ein Satz mit \u201EEs geht um ...\u201C.",
    'Antworte NUR mit JSON, ohne Erkl\xE4rung: {"titel": "...", "text": "..."} \u2014 der Titel h\xF6chstens vier W\xF6rter.'
  ].join("\n");
}
async function kiErzaehlung(folgeId, thema) {
  const { callClaude: callClaude2, extractJson: extractJson2 } = await Promise.resolve().then(() => (init_ki(), ki_exports));
  const raw = await callClaude2(bauePromptErzaehlung(folgeId, thema), 800);
  const j = extractJson2(raw);
  const titel = String(j && j.titel || "").trim().slice(0, 60);
  const text = String(j && j.text || "").trim();
  if (!platzBrauchbar({ titel, text })) throw new Error("Die KI-Antwort tr\xE4gt keine brauchbare Erz\xE4hlung (zu kurz oder leer).");
  return { titel: titel || "Ohne Titel", text, folge: folgeId };
}
function ladeArchiv() {
  try {
    const r = JSON.parse(localStorage.getItem(ARCHIV_KEY) || "{}");
    if (!r || typeof r !== "object" || Array.isArray(r)) return {};
    const out = {};
    for (const [k, v] of Object.entries(r))
      if (Array.isArray(v)) out[k] = v.filter((e) => !!e && typeof e === "object" && typeof e.text === "string").map((e) => ({ titel: String(e.titel || "").slice(0, 60), text: String(e.text), folge: k, geburt: typeof e.geburt === "string" ? e.geburt : void 0 }));
    return out;
  } catch {
    return {};
  }
}
function speichereArchiv(a) {
  try {
    localStorage.setItem(ARCHIV_KEY, JSON.stringify(a));
  } catch {
  }
}
function archiviere(e) {
  if (!platzBrauchbar(e)) return;
  const folge = e.folge || "standard";
  const a = ladeArchiv();
  const liste = a[folge] || [];
  const tKey = titelNorm(e.titel);
  const gleich = (x) => tKey ? titelNorm(x.titel) === tKey : archivNorm(x) === archivNorm(e);
  const vorhanden = liste.find(gleich);
  let geburt = e.geburt || vorhanden?.geburt;
  if (!geburt) for (const [, l] of Object.entries(a)) {
    const alt = l.find(gleich);
    if (alt) {
      geburt = alt.geburt || alt.folge;
      break;
    }
  }
  geburt = geburt || folge;
  a[folge] = [{ titel: e.titel || "Ohne Titel", text: e.text, folge, geburt }, ...liste.filter((x) => !gleich(x))].slice(0, ARCHIV_JE_BAUFORM);
  speichereArchiv(a);
}
function archivFuer(folge) {
  return ladeArchiv()[folge] || [];
}
function loescheAusArchiv(folge, index) {
  const a = ladeArchiv();
  const liste = a[folge] || [];
  if (index < 0 || index >= liste.length) return;
  a[folge] = liste.filter((_, i) => i !== index);
  speichereArchiv(a);
}
function loescheEintrag(id) {
  const a = ladeArchiv();
  for (const [k, l] of Object.entries(a)) a[k] = l.filter((e) => eintragId(e) !== id);
  speichereArchiv(a);
}
function bauformAendern(id, folge) {
  const e = eintragNachId(id);
  if (!e || !SCHLAGFOLGEN[folge]) return null;
  loescheEintrag(id);
  const neu = { titel: e.titel, text: e.text, folge, geburt: e.geburt || e.folge };
  archiviere(neu);
  return eintragId(neu);
}
var archivNorm, titelNorm, SCHLAGFOLGEN, ARBEITSPLATZ_KEY, ALTE_BANK_KEY, QUELLE_KEY, letzter, migriert, BAUFORM_ANWEISUNG, ARCHIV_KEY, ARCHIV_JE_BAUFORM;
var init_erzaehlerbank = __esm({
  "src/features/erzaehlerbank.ts"() {
    "use strict";
    init_dramaturgie();
    init_textpreset();
    init_derive();
    archivNorm = (e) => `${e.titel}\u241E${e.text}`.toLowerCase().replace(/\s+/g, " ").trim();
    titelNorm = (t) => (t || "").toLowerCase().replace(/\s+/g, " ").trim();
    SCHLAGFOLGEN = {
      standard: { name: "Steigender Bogen", folge: SCHLAG_STANDARD },
      kreis: { name: "Kreisschluss", folge: ["einstieg", "hook", "regel", "mitte", "konflikt", "ausloeser", "wende", "hoehepunkt", "einsatz", "schluss", "einstieg"] },
      rueckwaerts: { name: "R\xFCckw\xE4rts", folge: ["schluss", "hoehepunkt", "wende", "ausloeser", "konflikt", "mitte", "regel", "hook", "einstieg"] },
      retardation: { name: "Sp\xE4te Wende", folge: ["einstieg", "hook", "regel", "mitte", "konflikt", "mitte2", "regel", "ausloeser", "wende", "hoehepunkt", "einsatz", "schluss"] },
      doppelt: { name: "Doppelte Wende", folge: ["einstieg", "hook", "mitte", "ausloeser", "wende", "konflikt", "ausloeser", "wende", "hoehepunkt", "einsatz", "schluss"] },
      still: { name: "Stiller Bogen", folge: ["einstieg", "hook", "regel", "mitte", "konflikt", "mitte2", "zeit", "einsatz", "schluss"] },
      eskalation: { name: "Eskalation", folge: ["einstieg", "hook", "mitte", "mitte", "mitte", "konflikt", "ausloeser", "wende", "hoehepunkt", "einsatz", "schluss"] },
      katastrophe: { name: "Katastrophe zuerst", folge: ["hoehepunkt", "einstieg", "hook", "mitte", "konflikt", "ausloeser", "wende", "einsatz", "schluss"] },
      straenge: { name: "Zwei Str\xE4nge", folge: ["einstieg", "mitte", "einstieg", "mitte", "konflikt", "ausloeser", "wende", "hoehepunkt", "einsatz", "schluss"] },
      offen: { name: "Offenes Ende", folge: ["einstieg", "hook", "regel", "mitte", "konflikt", "ausloeser", "wende", "hoehepunkt", "einsatz"] },
      // Punkt 4 des Zielbilds: die Schlagfolge aus der Geschichte ABLEITEN statt
      // sie zuzuweisen. Die Folge steht hier leer — sie wird je Platz aus dem
      // Text berechnet (ableiteSchlagfolge), sobald diese Bauform gewählt ist.
      eigen: { name: "Eigene \u2014 aus dem Text abgeleitet", folge: [] }
    };
    ARBEITSPLATZ_KEY = "dm_erzaehler_arbeitsplatz_v1";
    ALTE_BANK_KEY = "dm_erzaehlerbank_v1";
    QUELLE_KEY = "dm_erzaehler_quelle_v1";
    letzter = null;
    migriert = false;
    BAUFORM_ANWEISUNG = {
      standard: "ein klassisch steigender Bogen: ruhiger Anfang, wachsende St\xF6rung, Krise kurz vor Schluss, knappe Aufl\xF6sung",
      kreis: "ein Kreisschluss: das Ende kehrt erkennbar zum Bild des Anfangs zur\xFCck, leicht verschoben",
      rueckwaerts: "r\xFCckw\xE4rts erz\xE4hlt: beginne mit dem Ende, arbeite dich in Etappen (mehrmals \u201EDavor\u201C) zum Anfang vor, der Anfang erkl\xE4rt alles",
      retardation: "mit sp\xE4ter Wende: lange scheinbare Entwarnung, die St\xF6rung kehrt leise zur\xFCck, die Wende kommt sp\xE4t und schnell",
      doppelt: "mit doppelter Wende: eine erste Wende kippt die Lage, eine zweite kippt sie erneut in eine unerwartete Richtung",
      still: "ein stiller Bogen: \xE4u\xDFerlich geschieht fast nichts, die Ver\xE4nderung ist innerlich; keine Ausrufe, keine Katastrophe",
      eskalation: "eine Eskalation in drei Stufen: dreimal dasselbe Muster, jedes Mal gr\xF6\xDFer, dann die Folge",
      katastrophe: "Katastrophe zuerst: das schlimme Ereignis steht im ersten Satz, danach die Aufarbeitung und ein leiser Fund",
      straenge: "zwei Str\xE4nge: zwei Figuren getrennt erz\xE4hlt, abwechselnd, die sich am Ende an einem Ort treffen",
      offen: "offenes Ende: die Spannung baut sich auf, die Aufl\xF6sung wird verweigert; der letzte Satz l\xE4sst es in der Schwebe",
      eigen: "eine freie Bauform: die Geschichte bestimmt ihre eigene Reihenfolge \u2014 wo die Wende steht, steht sie; die Maschine leitet die Schlagfolge hinterher aus dem Text ab"
    };
    ARCHIV_KEY = "dm_erzaehler_archiv_v1";
    ARCHIV_JE_BAUFORM = 20;
  }
});

// test/erzmigration.ts
var import_jsdom = require("jsdom");
var dom = new import_jsdom.JSDOM("<!doctype html><html><body></body></html>", { url: "https://x.test/" });
globalThis.localStorage = dom.window.localStorage;
var TEXT = "Ein Text, der lang genug ist, um brauchbar zu sein, mit vielen W\xF6rtern darin. ".repeat(5);
localStorage.setItem("dm_erzaehlerbank_v1", JSON.stringify([
  { titel: "Alt eins", text: TEXT, folge: "still", geburt: "still" },
  { titel: "", text: "" },
  { titel: "Alt drei", text: TEXT + "Drei.", folge: "offen" }
]));
localStorage.setItem("dm_erzaehler_quelle_v1", "2");
var fails = [];
var geprueft = 0;
var bestanden = 0;
var ist = (name, wert, soll) => {
  geprueft++;
  if (wert === soll) bestanden++;
  else fails.push(`${name}: \u201E${String(wert)}\u201C \u2014 erwartet \u201E${String(soll)}\u201C`);
};
Promise.resolve().then(() => (init_erzaehlerbank(), erzaehlerbank_exports)).then((m) => {
  const alle = m.archivEintraege();
  ist("beide vollen Pl\xE4tze liegen im Archiv", alle.length, 2);
  ist("mit ihrer Bauform", alle.find((e) => e.titel === "Alt drei").folge, "offen");
  ist("und ihrer Geburt", alle.find((e) => e.titel === "Alt eins").geburt, "still");
  ist("der gew\xE4hlte Platz wurde zum Arbeitsplatz", m.ladeArbeitsplatz().titel, "Alt drei");
  ist("und bleibt im Studio gew\xE4hlt (\xFCber die Kennung)", m.eintragNachId(m.ladeQuelle()).titel, "Alt drei");
  ist("die alte Bank ist abger\xE4umt", localStorage.getItem("dm_erzaehlerbank_v1"), null);
  console.log(`Pr\xFCfstand Erz\xE4hlerbank-Migration \u2014 ${geprueft} Pr\xFCfungen, ${bestanden} bestanden`);
  if (fails.length) {
    console.error(`
\u274C Erz\xE4hlerbank-Migration: ${fails.length} Fehler:`);
    fails.forEach((f) => console.error("  - " + f));
    globalThis.process.exit(1);
  } else console.log(`
\u2705 Erz\xE4hlerbank-Migration: alle ${geprueft} Pr\xFCfungen bestanden.`);
});
