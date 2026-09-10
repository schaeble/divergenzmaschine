"use strict";
var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __esm = (fn, res) => function __init() {
  return fn && (res = (0, fn[__getOwnPropNames(fn)[0]])(fn = 0)), res;
};
var __export = (target, all) => {
  for (var name in all)
    __defProp(target, name, { get: all[name], enumerable: true });
};
var __copyProps = (to, from, except, desc) => {
  if (from && typeof from === "object" || typeof from === "function") {
    for (let key of __getOwnPropNames(from))
      if (!__hasOwnProp.call(to, key) && key !== except)
        __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
  }
  return to;
};
var __toCommonJS = (mod) => __copyProps(__defProp({}, "__esModule", { value: true }), mod);

// src/features/waechterStatistik.ts
var waechterStatistik_exports = {};
__export(waechterStatistik_exports, {
  EBENE2: () => EBENE2,
  ZAEHLER_NAMEN: () => ZAEHLER_NAMEN,
  ladeStatistik: () => ladeStatistik,
  statistikKurz: () => statistikKurz,
  statistikZuruecksetzen: () => statistikZuruecksetzen,
  zaehle: () => zaehle,
  zaehleWennAnders: () => zaehleWennAnders
});
function zaehleWennAnders(was, vorher, nachher) {
  if (vorher === nachher) return;
  const a = vorher.split(/(?<=[.!?…])\s+/), b = nachher.split(/(?<=[.!?…])\s+/);
  let i = 0;
  while (i < a.length && i < b.length && a[i] === b[i]) i++;
  zaehle(was, `${(a[i] || "").slice(0, 70)} \u2192 ${(b[i] || "").slice(0, 70)}`);
}
function leer() {
  return { zaehler: {}, beispiele: {}, seit: (/* @__PURE__ */ new Date()).toISOString() };
}
function ladeStatistik() {
  if (cache) return cache;
  try {
    const raw = typeof localStorage === "undefined" ? null : localStorage.getItem(KEY);
    const v = raw ? JSON.parse(raw) : null;
    cache = v && v.zaehler && v.beispiele ? v : leer();
  } catch {
    cache = leer();
  }
  return cache;
}
function speichern() {
  if (schreibTimer !== null) return;
  schreibTimer = setTimeout(() => {
    schreibTimer = null;
    try {
      if (typeof localStorage !== "undefined" && cache) localStorage.setItem(KEY, JSON.stringify(cache));
    } catch {
    }
  }, 1e3);
}
function zaehle(was, beispiel) {
  const st = ladeStatistik();
  st.zaehler[was] = (st.zaehler[was] || 0) + 1;
  if (beispiel) {
    const b = st.beispiele[was] || [];
    const kurz = beispiel.trim().slice(0, 140);
    if (!b.includes(kurz)) {
      b.unshift(kurz);
      st.beispiele[was] = b.slice(0, BEISPIELE_JE);
    }
  }
  speichern();
}
function statistikZuruecksetzen() {
  cache = leer();
  try {
    if (typeof localStorage !== "undefined") localStorage.setItem(KEY, JSON.stringify(cache));
  } catch {
  }
}
function statistikKurz() {
  const st = ladeStatistik();
  const regeln = ["regel1", "regel2", "regel3", "regel4", "regel5", "regel6", "regel7", "regel8"];
  let verworfen = 0;
  let haeufigste = null;
  let max = 0;
  for (const r of regeln) {
    const n = st.zaehler[r] || 0;
    verworfen += n;
    if (n > max) {
      max = n;
      haeufigste = r;
    }
  }
  const angenommen = st.zaehler.angenommen || 0;
  return {
    verworfen,
    angenommen,
    quote: verworfen + angenommen ? verworfen / (verworfen + angenommen) : 0,
    haeufigste,
    umgeschrieben: st.zaehler.umgeschrieben || 0,
    zerlegt: (st.zaehler.atomZerlegt || 0) + (st.zaehler.atomGekuerzt || 0)
  };
}
var EBENE2, ZAEHLER_NAMEN, KEY, BEISPIELE_JE, cache, schreibTimer;
var init_waechterStatistik = __esm({
  "src/features/waechterStatistik.ts"() {
    "use strict";
    EBENE2 = /* @__PURE__ */ new Set([
      "schliff_kleinesPronomen",
      "schliff_kommaVorInversion",
      "schliff_fragezeichen",
      "schliff_nomenNachAdverb",
      "schliff_nominativFragment",
      "schliff_formelnGlaetten",
      "schliff_kleinerArtikel",
      "schliff_pluralKongruenz",
      "schliff_polishGerman",
      "schliff_figurenkomma",
      "kohaerenzPass",
      "kohaerenzGefallen",
      "kohaerenzRepariert",
      "markovKurz",
      "markovWenigWoerter",
      "markovWiederholung",
      "markovFunktionswoerter",
      "markovSatzlaenge",
      "markovSatzzeichen",
      "markovBruchstueck",
      "fuellerStopp",
      "korpusHygiene"
    ]);
    ZAEHLER_NAMEN = {
      regel1: "W\xE4chter 1 \xB7 h\xE4ngendes Ende",
      regel2: "W\xE4chter 2 \xB7 ohne Verb, ohne Kopf",
      regel3: "W\xE4chter 3 \xB7 gebrochene Klausel",
      regel4: "W\xE4chter 4 \xB7 Inversion ohne Subjekt",
      regel5: "W\xE4chter 5 \xB7 \u201El\xE4sst sich\u201C ohne Infinitiv",
      regel6: "W\xE4chter 6 \xB7 zwei finite Verben",
      regel7: "W\xE4chter 7 \xB7 halbes Zitat",
      regel8: "W\xE4chter 8 \xB7 \u201Ees gibt\u201C ohne Gegenstand",
      angenommen: "W\xE4chter \xB7 durchgelassen",
      umgeschrieben: "Umschreiber \xB7 Pr\xE4teritum \u2192 Pr\xE4sens",
      unklar: "Umschreiber \xB7 unklar, verworfen",
      praeteritumVerworfen: "Umschreiber \xB7 Pr\xE4teritum blieb, verworfen",
      atomZerlegt: "Atomisierung \xB7 zerlegt",
      atomGekuerzt: "Atomisierung \xB7 Nebensatz abgeschnitten",
      atomGanzZuLang: "Atomisierung \xB7 zu lang, ganz gelassen",
      schliff_kleinesPronomen: "Schliff \xB7 Pronomen/Adverb nach Strich klein",
      schliff_kommaVorInversion: "Schliff \xB7 Komma vor der Inversion",
      schliff_fragezeichen: "Schliff \xB7 Fragezeichen",
      schliff_nomenNachAdverb: "Schliff \xB7 Nomen nach Satzadverb gro\xDF",
      schliff_nominativFragment: "Schliff \xB7 Nominativ im Fragment",
      schliff_formelnGlaetten: "Schliff \xB7 Formeln gegl\xE4ttet",
      schliff_kleinerArtikel: "Schliff \xB7 Artikel klein in der Satzmitte",
      schliff_pluralKongruenz: "Schliff \xB7 Plural-Kongruenz",
      schliff_polishGerman: "Schliff \xB7 Sprachschliff (Artikel, Genus, Namen)",
      schliff_figurenkomma: "Schliff \xB7 Figurenkomma geschlossen",
      kohaerenzPass: "Koh\xE4renz \xB7 Lauf 1 (Br\xFCche, Wiederholungen)",
      kohaerenzGefallen: "Koh\xE4renz \xB7 Satz gefallen (themenfremd)",
      kohaerenzRepariert: "Koh\xE4renz \xB7 Lauf 2 hat ge\xE4ndert",
      markovKurz: "Markov-Sanity \xB7 zu kurz",
      markovWenigWoerter: "Markov-Sanity \xB7 unter f\xFCnf W\xF6rter",
      markovWiederholung: "Markov-Sanity \xB7 ein Wort dominiert",
      markovFunktionswoerter: "Markov-Sanity \xB7 nur Funktionsw\xF6rter",
      markovSatzlaenge: "Markov-Sanity \xB7 Satzl\xE4nge unpassend",
      markovSatzzeichen: "Markov-Sanity \xB7 Satzzeichen geh\xE4uft",
      markovBruchstueck: "Markov-Sanity \xB7 Bruchst\xFCck am Ende",
      fuellerStopp: "F\xFCller \xB7 aufgeh\xF6rt, nichts Frisches mehr",
      korpusHygiene: "Korpus-Hygiene \xB7 Selbstreinigung"
    };
    KEY = "dm_waechter_statistik_v1";
    BEISPIELE_JE = 5;
    cache = null;
    schreibTimer = null;
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
function beugeVerb(form3, person) {
  const gross = /^[A-ZÄÖÜ]/.test(form3);
  const w = form3.toLowerCase();
  const fertig = (s) => gross ? s.charAt(0).toUpperCase() + s.slice(1) : s;
  if (person === "er" || person === "sie") return istVerbform(w) ? form3 : null;
  const st = starkMitPraefix(w);
  if (st) {
    const [p, [ich, du, wir, ihr]] = st;
    const f = person === "ich" ? ich : person === "du" ? du : person === "wir" ? wir : ihr || wir.replace(/e?n$/, "t");
    return fertig(p + f);
  }
  if (!istVerbform(w)) return null;
  let stamm = w.slice(0, -1);
  const bindevokal = /[td]et$/.test(w) || /(chn|ffn|gn|tm|dm|ckn|kn)et$/.test(w);
  if (bindevokal) stamm = w.slice(0, -2);
  if (person === "ihr") return fertig(w);
  if (person === "wir") {
    if (/e[lr]$/.test(stamm)) return fertig(stamm + "n");
    return fertig(stamm + "en");
  }
  if (person === "du") {
    if (bindevokal) return fertig(stamm + "est");
    if (SIBILANT.test(stamm)) return fertig(w);
    return fertig(stamm + "st");
  }
  if (/el$/.test(stamm)) return fertig(stamm.slice(0, -2) + "le");
  return fertig(stamm + "e");
}
var STARK, PRAEFIXE, KEIN_VERB, SIBILANT, GE_VERBEN;
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
    SIBILANT = /(s|ß|z|x|tz|ss)$/;
    GE_VERBEN = /^ge(ht|nügt|hört|horcht|lingt|winnt|langt|schieht|steht|rät|nießt|wöhnt|fährdet|währt|stattet|staltet|denkt|bietet|braucht|hörcht|nest|reicht|dulde?t|fällt|deiht|lobt|leitet|langt|winnt|behrt|bärt|fried[e]?t|fällt|lüstet|mahnt|rinnt|hört)$/;
  }
});

// src/generation/satzwaechter.ts
function pruefeSatz(satz) {
  const bare = satz.trim().replace(/[.!?…]+$/, "").trim();
  if (!bare) return 2;
  const ws = woerter(bare);
  if (!ws.length) return 2;
  const letztes = ws[ws.length - 1].toLowerCase();
  if (HAENGENDES_ENDE.has(letztes)) return 1;
  const hatVerb = ws.some((w, i) => verbKandidat(w, i === 0));
  if (!hatVerb) {
    if (ws.length > 12) return 2;
    const kern = bare.replace(/^(und|aber|doch|dann|denn|oder|nur|auch)\s+/i, "");
    const kopf = kern.split(/\s+/)[0] || "";
    const ADVERB_KOPF = /^(irgendwo|irgendwann|irgendwie|dort|hier|heute|morgen|gestern|vielleicht|manchmal|so|bald|überall|nirgends|nirgendwo|draußen|drinnen|oben|unten|jetzt|damals|dennoch|trotzdem|deshalb|darum|davor|danach|zuerst|zuletzt|womöglich|angeblich|vermutlich|wahrscheinlich)$/i;
    const nomenKopf = /^[A-ZÄÖÜ]/.test(kopf) && !ADVERB_KOPF.test(kopf) && !FUNKTION.has(kopf.toLowerCase());
    const prepKopf = /^(in|im|ins|über|überm|unter|unterm|auf|aufs|an|am|ans|bei|beim|hinter|vor|vorm|neben|zwischen|aus|von|vom|nach|zu|zum|zur|mit|durch|gegen|um|seit|während|trotz|wegen)$/i.test(kopf);
    if (ws.length > 5 && !NP_KOPF.test(kern) && !nomenKopf && !prepKopf) return 2;
  }
  for (const teil of bare.split(/,\s*/).slice(1)) {
    const tw = woerter(teil);
    if (!tw.length || !/^(was|wer|der|die|das|dem|den|wo|wie)$/i.test(tw[0])) continue;
    const undIdx = tw.findIndex((w, i) => i > 0 && /^(und|oder)$/i.test(w));
    if (undIdx > 1 && verbKandidat(tw[undIdx + 1] || "", false) && !tw.slice(1, undIdx).some((w) => verbKandidat(w, false))) return 3;
  }
  const PREP_KOPF = /^(in|im|ins|über|überm|unter|unterm|auf|aufs|an|am|ans|bei|beim|hinter|vor|vorm|neben|zwischen|aus|von|vom|nach|zum|zur|mit|durch|gegen|seit|trotz|wegen)$/i;
  for (const teil of bare.split(/,\s*/)) {
    const tw = woerter(teil);
    if (tw.length < 4 || !PREP_KOPF.test(tw[0])) continue;
    if (/^(dem|denen|deren|dessen|welche[rmn]?)$/i.test(tw[1] || "")) continue;
    if (tw.slice(1).some((w) => /^zu$/i.test(w))) continue;
    const vi = tw.findIndex((w, i) => i > 1 && verbKandidat(w, false));
    if (vi < 2) continue;
    if (tw.slice(1, vi).some((w) => /^(es|er|sie|wir|ich|du|man|jemand|niemand|etwas|nichts|alles)$/i.test(w))) continue;
    const rest = tw.slice(vi + 1);
    if (/^(wie|als)$/i.test(rest[0] || "") && rest.length <= 2) return 4;
  }
  for (const teil of bare.split(/[,;]\s*|\s+(?:und|aber|oder|doch|sondern)\s+/i)) {
    if (!/\bl(ä|ie)(ss|ß)t?\s+(es\s+)?sich\b/i.test(teil)) continue;
    const tw = woerter(teil);
    const letztes2 = (tw[tw.length - 1] || "").toLowerCase();
    if (!letztes2 || /^[A-ZÄÖÜ]/.test(tw[tw.length - 1] || "")) continue;
    if (FUNKTION.has(letztes2) || ADJEKTIV.has(letztes2) || HILFSVERB.has(letztes2)) continue;
    if (/t$/.test(letztes2) && !/(en|eln|ern)$/.test(letztes2)) return 5;
  }
  const finit = (w) => {
    const l = w.toLowerCase();
    if (HILFSVERB.has(l)) return true;
    return /^[a-zäöüß]{3,}t$/.test(l) && !FUNKTION.has(l) && !ADJEKTIV.has(l) && !KEIN_VERB.has(l) && istVerbform(l);
  };
  for (const teil of bare.split(/[,;:—–]\s*/)) {
    const tw = woerter(teil);
    for (let i = 0; i + 3 < tw.length; i++) {
      if (!finit(tw[i]) || !/^(der|die|das|den|dem|ein|eine|einen|einem)$/i.test(tw[i + 1])) continue;
      if (!/^[A-ZÄÖÜ]/.test(tw[i + 2])) continue;
      if (HILFSVERB.has(tw[i + 3].toLowerCase())) return 6;
    }
  }
  {
    const auf = (bare.match(/[„»]/g) || []).length, zu = (bare.match(/[“«]/g) || []).length;
    if (auf !== zu) return 7;
  }
  for (const teil of bare.split(/[,;:—–]\s*/))
    if (/^es gibt(\s+(jetzt|hier|dort|noch|nur|auch|bald|immer|nie))?$/i.test(teil.trim())) return 8;
  return 0;
}
function stueckPlausibel(text) {
  const saetze = (text || "").split(/(?<=[.!?…])\s+/).map((s) => s.trim()).filter(Boolean);
  if (!saetze.length) return false;
  for (const satz of saetze) {
    const regel = pruefeSatz(satz);
    if (regel) {
      zaehle(`regel${regel}`, satz);
      return false;
    }
  }
  zaehle("angenommen", Math.random() < 0.1 ? text : void 0);
  return true;
}
var FUNKTION, HAENGENDES_ENDE, ADJEKTIV, HILFSVERB, verbKandidat, woerter, NP_KOPF;
var init_satzwaechter = __esm({
  "src/generation/satzwaechter.ts"() {
    "use strict";
    init_verben();
    init_waechterStatistik();
    FUNKTION = /* @__PURE__ */ new Set([
      "der",
      "die",
      "das",
      "den",
      "dem",
      "des",
      "ein",
      "eine",
      "einen",
      "einem",
      "einer",
      "eines",
      "und",
      "oder",
      "aber",
      "doch",
      "denn",
      "sondern",
      "als",
      "wie",
      "dass",
      "ob",
      "weil",
      "wenn",
      "ohne",
      "mit",
      "von",
      "aus",
      "an",
      "auf",
      "in",
      "im",
      "am",
      "f\xFCr",
      "zu",
      "zum",
      "zur",
      "bei",
      "beim",
      "nach",
      "vor",
      "\xFCber",
      "unter",
      "neben",
      "zwischen",
      "hinter",
      "durch",
      "gegen",
      "um",
      "seit",
      "es",
      "sich",
      "man",
      "sie",
      "er",
      "wir",
      "ich",
      "du",
      "ihr",
      "was",
      "wer",
      "wo",
      "so",
      "nur",
      "auch",
      "noch",
      "schon",
      "sehr",
      "nicht",
      "kein",
      "keine",
      "jeder",
      "jede",
      "jedes",
      "alle"
    ]);
    HAENGENDES_ENDE = /* @__PURE__ */ new Set([
      "der",
      "den",
      "dem",
      "des",
      "und",
      "oder",
      "aber",
      "sondern",
      "als",
      "dass",
      "weil",
      "wenn",
      "f\xFCr",
      "zwischen",
      "seit"
      // NICHT in der Liste: alles, was im Deutschen legitim am Satzende steht —
      // trennbare Verbpartikel („geht auf", „holt ihn ein", „gibt nach"),
      // Infinitiv-zu („um wahr zu sein"), Vergleiche („schwer wie Blei"),
      // Pronomen und Zahlwörter („der Grat trägt nur einen", „statt einem",
      // „will es sehr"). Die Gegenprobe über 6930 eingebaute Sätze hat die
      // Liste auf diesen Kern gestutzt.
    ]);
    ADJEKTIV = /* @__PURE__ */ new Set([
      "fest",
      "echt",
      "leicht",
      "schlecht",
      "recht",
      "dicht",
      "glatt",
      "satt",
      "bunt",
      "kalt",
      "alt",
      "laut",
      "tot",
      "rot",
      "gut",
      "weit",
      "hart",
      "zart",
      "nett",
      "matt",
      "sp\xE4t",
      "bereit",
      "breit",
      "nackt",
      "exakt",
      "direkt",
      "perfekt",
      "korrekt",
      "konkret",
      "komplett",
      "ernst",
      "feist",
      "meist",
      "erst",
      "zun\xE4chst",
      "h\xF6chst",
      "\xE4u\xDFerst",
      "einst",
      "sonst",
      "fast",
      "blo\xDF"
    ]);
    HILFSVERB = /* @__PURE__ */ new Set([
      "bin",
      "bist",
      "sind",
      "seid",
      "war",
      "warst",
      "waren",
      "wart",
      "sei",
      "w\xE4re",
      "w\xE4ren",
      "hab",
      "habe",
      "hast",
      "haben",
      "habt",
      "hatte",
      "hatten",
      "h\xE4tte",
      "h\xE4tten",
      "werde",
      "wirst",
      "wird",
      "werden",
      "werdet",
      "wurde",
      "wurden",
      "w\xFCrde",
      "w\xFCrden",
      "kann",
      "kannst",
      "k\xF6nnen",
      "k\xF6nnt",
      "konnte",
      "konnten",
      "k\xF6nnte",
      "k\xF6nnten",
      "muss",
      "musst",
      "m\xFCssen",
      "m\xFCsst",
      "musste",
      "mussten",
      "m\xFCsste",
      "darf",
      "darfst",
      "d\xFCrfen",
      "d\xFCrft",
      "durfte",
      "durften",
      "d\xFCrfte",
      "soll",
      "sollst",
      "sollen",
      "sollt",
      "sollte",
      "sollten",
      "mag",
      "magst",
      "m\xF6gen",
      "m\xF6gt",
      "mochte",
      "m\xF6chte",
      "m\xF6chten",
      "will",
      "willst",
      "wollen",
      "wollt",
      "wollte",
      "wollten",
      "l\xE4sst",
      "lie\xDF",
      "lie\xDFen",
      "gibt",
      "gab",
      "gaben",
      "tut",
      "tat",
      "schw\xF6r",
      "schw\xF6re"
    ]);
    verbKandidat = (roh, istErstes = false) => {
      if (!istErstes && /^[A-ZÄÖÜ]/.test(roh)) return false;
      const w = roh.toLowerCase().replace(/[^a-zäöüß]/g, "");
      if (!w || FUNKTION.has(w) || KEIN_VERB.has(w) || ADJEKTIV.has(w)) return false;
      if (HILFSVERB.has(w) || istVerbform(w)) return true;
      return /(t|st|e|en|eln|ern|elt|ert)$/.test(w) && !/(heit|keit|ung|schaft|tät|ment|iert)$/.test(w) && !/(em|er|es)$/.test(w) && w.length >= 3;
    };
    woerter = (s) => s.split(/\s+/).map((w) => w.replace(/[„“"»«().!?…;:]+/g, "")).filter(Boolean);
    NP_KOPF = /^(der|die|das|ein|eine|einen|kein|keine|zwei|drei|viele|manche|jede[rs]?|irgendein|lauter)\b/i;
  }
});

// src/text-utils.ts
function clean(s) {
  return (s ?? "").toString().trim().replace(/\s+/g, " ");
}
function pick(arr) {
  return arr[Math.floor(Math.random() * arr.length)];
}
function chance(p) {
  return Math.random() < p;
}
function escapeRegExp(s) {
  return s.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
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
function namensErsetzer(name) {
  const mitArtikel = /^(ein|eine|einen|einem|einer|der|die|das|den|dem|des)\s/i.test(name);
  return (m) => mitArtikel && /^[a-zäöü]/.test(m) ? name.charAt(0).toLowerCase() + name.slice(1) : name;
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
function toPresent(entry) {
  const unsure = [];
  let changed = false;
  const words = (entry || "").split(/(\s+)/);
  for (let i = 0; i < words.length; i++) {
    const roh = words[i];
    const zeichen = (roh.match(/[.,;:!?…»“"]+$/) || [""])[0];
    const w = zeichen ? roh.slice(0, -zeichen.length) : roh;
    if (!/^[A-Za-zÄÖÜäöüß]+$/.test(w)) continue;
    const low2 = w.toLowerCase();
    const base = PAST2PRES[low2];
    if (base) {
      const prev = (words.slice(0, i).reverse().find((x) => /^[A-Za-zÄÖÜäöüß]+$/.test(x)) || "").toLowerCase();
      const next = (words.slice(i + 1).find((x) => /^[A-Za-zÄÖÜäöüß]+$/.test(x)) || "").toLowerCase();
      const pf = PERSON_FORMS[low2];
      const subj = /^(ich|du|wir|ihr)$/.test(prev) ? prev : /^(ich|du|wir|ihr)$/.test(next) ? next : "";
      let form = base;
      if (pf && subj && pf[subj]) form = pf[subj];
      else if (subj) {
        const b = beugeVerb(base, subj);
        if (!b) {
          unsure.push(w);
          continue;
        }
        form = b;
      }
      words[i] = (/^[A-ZÄÖÜ]/.test(w) ? form.charAt(0).toUpperCase() + form.slice(1) : form) + zeichen;
      changed = true;
      continue;
    }
    if (/^[a-zäöüß]{4,}(te|ete)$/.test(low2)) unsure.push(w);
  }
  return { text: words.join(""), changed, unsure };
}
function praesensUmschreiben(entry) {
  const first = toPresentSicher(entry);
  const words = first.text.split(/(\s+)/);
  let changed = first.changed;
  const ARTIKEL = /^(der|die|das|den|dem|des|ein|eine|einen|einem|einer|eines|kein|keine|keinen|mein|meine|meinen|dein|deine|sein|seine|seinen|ihr|ihre|ihren|unser|unsere|jede|jeder|jedes|diese|dieser|dieses|manche|viele|alle|zwei|drei|im|am|zum|zur|beim|ins|vom)$/i;
  const KONJUNKTIV = /^(müsste|müssten|könnte|könnten|dürfte|dürften|möchte|möchten|hätte|hätten|wäre|wären|würde|würden|sollte|sollten|wollte|wollten)$/i;
  const MODAL_DAVOR = /^(zu|kann|kannst|können|muss|musst|müssen|will|willst|wollen|soll|sollen|darf|dürfen|mag|mögen|lässt|lassen|möchte|könnte|müsste|sollte|wollte|dürfte)$/i;
  const rein = (x) => x.replace(/[^A-Za-zÄÖÜäöüß]/g, "");
  const EINDEUTIG = /(?:[td]|chn|ffn|gn|tm|dm|ckn|kn)ete(?:n|st|t)?$/;
  const belegtPraeteritum = first.changed || (first.text.match(/\b[a-zäöüß]{3,}ete(?:n|st)?\b/g) || []).some((x) => EINDEUTIG.test(x));
  let unklar = 0;
  for (let i = 0; i < words.length; i++) {
    const roh = words[i];
    const satzzeichen = (roh.match(/[.,;:!?…»“"]+$/) || [""])[0];
    const w = satzzeichen ? roh.slice(0, -satzzeichen.length) : roh;
    const m = w.match(/^([a-zäöüß]{3,}?)(e?te|e?ten|e?test)$/);
    if (!m || KONJUNKTIV.test(w)) continue;
    const stamm = m[1], endung = m[2];
    const eindeutig = /^e/.test(endung) && EINDEUTIG.test(w);
    if (/^e/.test(endung) && !eindeutig) continue;
    if (/(^|[a-zäöü])ge[a-zäöüß]{3,}$/.test(stamm) && !/^(geh|gel|gen|ger|geb|ges)/.test(stamm)) continue;
    if (/t$/.test(stamm) && !eindeutig) continue;
    const davor = words.slice(0, i).map(rein).filter(Boolean);
    const prev = (davor[davor.length - 1] || "").toLowerCase();
    const naechst = words.slice(i + 1).map(rein).find(Boolean) || "";
    if (ARTIKEL.test(prev) && /^[A-ZÄÖÜ]/.test(naechst)) continue;
    if (/ten$/.test(endung) && MODAL_DAVOR.test(prev)) continue;
    if (KEIN_VERB.has(stamm + "t") || KEIN_VERB.has(stamm)) continue;
    if (kenntInfinitiv(w) || kenntInfinitiv(w.replace(/e$/, "en")) || kenntInfinitiv(w.replace(/en$/, "n"))) continue;
    const inf = infinitivZuStamm(stamm);
    if (!inf) {
      if (/^[A-ZÄÖÜ]/.test(naechst) || /ten$/.test(endung) || ARTIKEL.test(prev)) continue;
      if (!eindeutig && !belegtPraeteritum && istVerbform(stamm + "t")) unklar++;
      continue;
    }
    const bindevokal = /^e/.test(endung);
    const dritte = bindevokal ? stamm + "et" : stamm + "t";
    let neu;
    if (/^ich$/i.test(prev)) neu = beugeVerb(dritte, "ich") || dritte;
    else if (/^du$/i.test(prev)) neu = beugeVerb(dritte, "du") || dritte;
    else if (/ten$/.test(endung)) neu = beugeVerb(dritte, "wir") || dritte;
    else neu = dritte;
    if (neu !== w) {
      words[i] = neu + satzzeichen;
      changed = true;
    }
  }
  const text = words.join("");
  const ok = !isPastTense(text) && unklar === 0;
  if (ok && changed) zaehle("umgeschrieben", `${entry} \u2192 ${text}`);
  else if (!ok && unklar) zaehle("unklar", entry);
  else if (!ok) zaehle("praeteritumVerworfen", entry);
  return { text, ok, changed };
}
function toPresentSicher(entry) {
  const AUX = /\b(hat|haben|habe|hast|habt|hatte|hatten|ist|sind|bin|bist|seid|war|waren|wird|werden|wurde|wurden|worden)\b/i;
  const perfekt = AUX.test(entry);
  const words = entry.split(/(\s+)/);
  const marker = [];
  let erstesWort = true;
  let vorher = "";
  for (let i = 0; i < words.length; i++) {
    const w = words[i];
    if (!/^[A-Za-zÄÖÜäöüß]/.test(w)) continue;
    const konjNachAls = vorher === "als" && /^(wollte|wollten|sollte|sollten|könnte|könnten|müsste|hätte|hätten|wäre|wären|würde|würden)/i.test(w);
    const ambig = /^(verloren|verstanden|entstanden|bestanden|erschienen)[.,;:!?]*$/i.test(w) && !/^(wir|sie|die|alle|beide|viele|manche|einige|leute|kinder|männer|frauen)$/.test(vorher);
    const schuetzen = !erstesWort && /^[A-ZÄÖÜ]/.test(w) || perfekt && /en[.,;:!?]*$/.test(w) || konjNachAls || ambig;
    vorher = w.toLowerCase().replace(/[^a-zäöüß]/g, "");
    erstesWort = false;
    if (schuetzen) {
      marker.push(w);
      words[i] = `\xA7${marker.length - 1}\xA7`;
    }
  }
  const r = toPresent(words.join(""));
  let text = r.text;
  marker.forEach((w, k) => {
    text = text.replace(`\xA7${k}\xA7`, w);
  });
  return { text, changed: r.changed, unsure: r.unsure };
}
var PRAET_STRONG, PRAET_WEAK, PRAES_MARK, ADJ_CONTEXT, weakLooksVerbal, PERSON_FORMS;
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
    PERSON_FORMS = {
      war: { ich: "bin", du: "bist", wir: "sind", ihr: "seid", sie: "ist", er: "ist", es: "ist" },
      waren: { wir: "sind", sie: "sind", ihr: "seid" },
      hatte: { ich: "habe", du: "hast", wir: "haben", ihr: "habt", sie: "hat", er: "hat", es: "hat" },
      hatten: { wir: "haben", sie: "haben", ihr: "habt" },
      wurde: { ich: "werde", du: "wirst", wir: "werden", sie: "wird", er: "wird", es: "wird" },
      konnte: { ich: "kann", du: "kannst", wir: "k\xF6nnen", sie: "kann", er: "kann", es: "kann" },
      musste: { ich: "muss", du: "musst", wir: "m\xFCssen", sie: "muss", er: "muss", es: "muss" },
      wollte: { ich: "will", du: "willst", wir: "wollen", sie: "will", er: "will", es: "will" },
      sollte: { ich: "soll", du: "sollst", wir: "sollen", sie: "soll", er: "soll", es: "soll" },
      wusste: { ich: "wei\xDF", du: "wei\xDFt", wir: "wissen", sie: "wei\xDF", er: "wei\xDF", es: "wei\xDF" }
    };
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

// src/features/knobs.ts
function loadKnobs() {
  try {
    const r = localStorage.getItem(KEY2);
    if (!r) return { ...KNOB_VORGABE };
    const p = JSON.parse(r);
    return {
      fuegeteil: klemm(Number(p.fuegeteil) || KNOB_VORGABE.fuegeteil, KNOB_SPANNE.fuegeteil),
      w4max: klemm(Number(p.w4max) || KNOB_VORGABE.w4max, KNOB_SPANNE.w4max),
      abstand: klemm(Number(p.abstand) || KNOB_VORGABE.abstand, KNOB_SPANNE.abstand),
      bogen: klemm(p.bogen === void 0 ? KNOB_VORGABE.bogen : Number(p.bogen), KNOB_SPANNE.bogen),
      ton: klemm(p.ton === void 0 ? KNOB_VORGABE.ton : Number(p.ton), KNOB_SPANNE.ton),
      korpus: klemm(p.korpus === void 0 ? KNOB_VORGABE.korpus : Number(p.korpus), KNOB_SPANNE.korpus),
      phrase: klemm(p.phrase === void 0 ? KNOB_VORGABE.phrase : Number(p.phrase), KNOB_SPANNE.phrase),
      satzlaenge: klemm(p.satzlaenge === void 0 ? KNOB_VORGABE.satzlaenge : Number(p.satzlaenge), KNOB_SPANNE.satzlaenge),
      atomgroesse: klemm(p.atomgroesse === void 0 ? KNOB_VORGABE.atomgroesse : Number(p.atomgroesse), KNOB_SPANNE.atomgroesse)
    };
  } catch {
    return { ...KNOB_VORGABE };
  }
}
var KNOB_VORGABE, KNOB_SPANNE, KEY2, klemm;
var init_knobs = __esm({
  "src/features/knobs.ts"() {
    "use strict";
    KNOB_VORGABE = { fuegeteil: 25, w4max: 2, abstand: 12, bogen: 100, ton: 100, korpus: 0, phrase: 5, satzlaenge: 9, atomgroesse: 14 };
    KNOB_SPANNE = {
      fuegeteil: { min: 10, max: 35, step: 5 },
      w4max: { min: 1, max: 4, step: 1 },
      abstand: { min: 6, max: 24, step: 2 },
      bogen: { min: 0, max: 250, step: 25 },
      ton: { min: 0, max: 250, step: 25 },
      korpus: { min: 0, max: 60, step: 10 },
      phrase: { min: 0, max: 8, step: 1 },
      satzlaenge: { min: 0, max: 21, step: 3 },
      atomgroesse: { min: 0, max: 24, step: 2 }
    };
    KEY2 = "dm_knobs_v1";
    klemm = (v, s) => Math.max(s.min, Math.min(s.max, v));
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
function isFragmentSentence(s) {
  const n = clean(s).split(/\s+/).filter(Boolean).length;
  return n > 0 && n <= 3;
}
function chooseInsertPos(sentences) {
  if (!sentences || sentences.length < 2) return -1;
  const candidates = [];
  for (let pos = 1; pos <= sentences.length; pos++) {
    const prev = sentences[pos - 1];
    const next = sentences[pos];
    if (isFragmentSentence(prev)) continue;
    if (next !== void 0 && isFragmentSentence(next)) continue;
    const w = clean(prev).split(/\s+/).filter(Boolean).length;
    candidates.push({ pos, weight: Math.max(1, w - 4) });
  }
  if (!candidates.length) return -1;
  let sum = 0;
  for (const c of candidates) sum += c.weight;
  let r = Math.random() * sum;
  for (const c of candidates) {
    r -= c.weight;
    if (r <= 0) return c.pos;
  }
  return candidates[candidates.length - 1].pos;
}
function insertToneFlavor(text, line) {
  const paras = text.split(/\n\n+/);
  let target = 0;
  for (let i = 1; i < paras.length; i++) if (paras[i].length > paras[target].length) target = i;
  const sentences = splitSentences(paras[target]);
  if (sentences.length < 2) {
    paras[target] = (paras[target] + " " + line).trim();
    return paras.join("\n\n");
  }
  let idx = chooseInsertPos(sentences);
  if (idx < 0) idx = sentences.length;
  sentences.splice(idx, 0, line);
  paras[target] = sentences.join(" ");
  return paras.join("\n\n");
}
var CLAUSE_VERBS;
var init_beats = __esm({
  "src/generation/beats.ts"() {
    "use strict";
    init_text_utils();
    init_cooldown();
    init_assemble();
    CLAUSE_VERBS = /* @__PURE__ */ new Set(["antworten", "antwortet", "atmen", "atmet", "bebt", "begann", "beginnen", "beginnt", "beobachten", "beobachtet", "ber\xFChren", "ber\xFChrt", "bin", "bist", "bleiben", "bleibt", "blieb", "blitzt", "brannte", "brennen", "brennt", "brummt", "br\xFCllen", "br\xFCllt", "dachte", "darf", "denken", "denkt", "donnert", "drehen", "dreht", "drehte", "durfte", "d\xFCrfen", "enden", "endet", "endete", "erinnern", "erinnert", "fahren", "fallen", "fand", "fiel", "fielen", "finden", "findet", "fliegen", "fliegt", "fliehen", "flieht", "flie\xDFen", "flie\xDFt", "flog", "floss", "fl\xFCstern", "fl\xFCstert", "folgen", "folgt", "folgte", "formen", "formt", "fragen", "fragt", "fragte", "fuhr", "f\xE4hrt", "f\xE4llt", "f\xFChlen", "f\xFChlt", "f\xFChren", "f\xFChrt", "f\xFChrte", "f\xFCrchten", "f\xFCrchtet", "gab", "gaben", "galt", "geben", "gehen", "geht", "gelten", "geschah", "geschehen", "geschieht", "gibt", "gilt", "ging", "gingen", "glauben", "glaubt", "haben", "habt", "halten", "hat", "hatte", "hatten", "hielt", "hielten", "hoffen", "hofft", "h\xE4lt", "h\xE4tte", "h\xF6ren", "h\xF6rt", "h\xF6rte", "ist", "jagen", "jagt", "kam", "kamen", "kann", "kannte", "kennen", "kennt", "kippen", "kippt", "knistert", "kommen", "kommt", "konnte", "konnten", "kreisen", "kreist", "k\xF6nnen", "lachen", "lacht", "lag", "lagen", "laufen", "leuchten", "leuchtet", "lief", "liefen", "liegen", "liegt", "l\xE4uft", "l\xF6schen", "l\xF6scht", "machen", "macht", "machte", "machten", "mag", "muss", "musste", "mussten", "m\xF6chte", "m\xF6chten", "m\xF6gen", "m\xFCssen", "nahm", "nahmen", "nehmen", "nimmt", "passieren", "passiert", "passierte", "planen", "plant", "pulsiert", "raschelt", "reagieren", "reagiert", "regnet", "retten", "rettet", "rief", "rinnt", "riskiert", "rufen", "ruft", "sah", "sahen", "sang", "sank", "sa\xDF", "schlafen", "schlief", "schlie\xDFen", "schlie\xDFt", "schloss", "schl\xE4ft", "schmelzen", "schmilzt", "schneit", "schreien", "schreit", "schrie", "schweigen", "schweigt", "schwieg", "sehen", "seid", "sieht", "sind", "singen", "singt", "sinken", "sinkt", "sitzen", "sitzt", "soll", "sollen", "sollte", "sprach", "sprachen", "sprang", "sprechen", "spricht", "springen", "springt", "stand", "standen", "stehen", "steht", "steigen", "steigt", "stieg", "suchen", "sucht", "suchte", "summt", "tanzen", "tanzt", "tat", "taten", "ticken", "tickt", "tragen", "tropft", "trug", "trugen", "tr\xE4gt", "tr\xE4umen", "tr\xE4umt", "tun", "tut", "unterschreiben", "unterschreibt", "verfolgen", "verfolgt", "vergessen", "vergisst", "verlangen", "verlangt", "verraten", "verr\xE4t", "ver\xE4ndern", "ver\xE4ndert", "vibriert", "wachsen", "wagen", "wagt", "wandern", "wandert", "war", "waren", "warten", "wartet", "wartete", "wechseln", "wechselt", "weigern", "weigert", "weinen", "weint", "wei\xDF", "werden", "werdet", "wiederholen", "wiederholt", "will", "wird", "wirst", "wissen", "wollen", "wollte", "wollten", "wurde", "wurden", "wusste", "w\xE4chst", "w\xE4re", "w\xE4ren", "w\xFCrde", "w\xFCrden", "zeigen", "zeigt", "zeigte", "zerbrechen", "zerbricht", "ziehen", "zieht", "zittern", "zittert", "zog", "zogen", "\xF6ffnen", "\xF6ffnet", "\xFCberschreiben", "\xFCberschreibt"]);
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
function istEigenePerson(teil) {
  const p = clean(teil);
  if (!p) return false;
  if (SP_REL.test(p) && SP_ENDS_VERB.test(p)) return false;
  if (SP_CONJ.test(p) || SP_PREP.test(p)) return false;
  if (SP_DET.test(p)) return true;
  if (/^[A-ZÄÖÜ]/.test(p)) return true;
  return !/\s/.test(p);
}
function personKopf(person) {
  const teile = (person || "").split(",").map((x) => clean(x)).filter(Boolean);
  if (teile.length <= 1) return (person || "").trim();
  const raus = [teile[0]];
  for (let i = 1; i < teile.length; i++) {
    if (SP_REL.test(teile[i]) && SP_ENDS_VERB.test(teile[i])) raus.push(teile[i]);
  }
  return raus.join(", ");
}
function splitSpeakers(who) {
  const parts = (who || "").split(",").map((s) => clean(s)).filter(Boolean);
  if (parts.length <= 1) return parts;
  const out = [parts[0]];
  for (let i = 1; i < parts.length; i++) {
    if (istEigenePerson(parts[i])) out.push(parts[i]);
    else out[out.length - 1] += ", " + parts[i];
  }
  return out;
}
var PERSON_NOMEN, NOT_INFINITIVE, NICHT_VERB_T, ICH_DU_HAND, ICH_DU_ZU_ER, EXTRA_FINITE_RE, SP_REL, SP_CONJ, SP_PREP, SP_ENDS_VERB, SP_DET;
var init_wordcls = __esm({
  "src/generation/wordcls.ts"() {
    "use strict";
    init_text_utils();
    init_verbconj_data();
    init_nouns_data();
    init_verbconj();
    PERSON_NOMEN = /(jugendliche|jugendlicher|erwachsene|erwachsener|alte|alter|kranke|kranker|gefangene|gefangener|angestellte|angestellter|beamte|beamter|verwandte|verwandter|bekannte|bekannter|vorsitzende|vorsitzender|abgeordnete|abgeordneter|obdachlose|obdachloser|pensionär|pensionärin|rentner|rentnerin|zeuge|zeugin|täter|täterin|opfer|passant|passantin|kellner|kellnerin|pfarrer|pfarrerin|richter|richterin|händler|händlerin|bauer|bäuerin|förster|försterin|schneider|schneiderin|weber|weberin|uhrmacher|uhrmacherin|archivar|archivarin|übersetzer|übersetzerin|magd|knecht|ritter|ritterin|nonne|mönch|clown|boxer|boxerin|grabräuber|grabräuberin|mädchen|junge|kind|frau|mann|männer|dame|herr|schüler|schülerin|lehrer|lehrerin|wächter|wächterin|arzt|ärztin|bäcker|bäckerin|gärtner|gärtnerin|fischer|fischerin|bote|botin|wanderer|wanderin|reisende|reisender|nachbar|nachbarin|greis|greisin|witwe|witwer|zwilling|bruder|schwester|sohn|tochter|vater|mutter|onkel|tante|neffe|nichte|freund|freundin|gast|fremde|fremder|meister|meisterin|gesell|lehrling|soldat|soldatin|matrose|matrosin|pilot|pilotin|köchin|koch|wirt|wirtin|müller|müllerin|schmied|schmiedin|hirte|hirtin|jäger|jägerin|sammler|sammlerin)$/i;
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
    SP_REL = /^(der|die|das|den|dem|des|deren|dessen|welche[rsmn]?|wo|worin|woran|womit|wovon)\b/i;
    SP_CONJ = /^(als|während|weil|wenn|da|obwohl|nachdem|bevor|sodass|damit|dass|ob|indem|sobald|solange)\b/i;
    SP_PREP = /^(mit|ohne|aus|von|vom|in|im|auf|an|am|für|bei|zu|zum|zur|über|unter|vor|nach|durch|gegen|seit|um|entlang|trotz|wegen|innerhalb|außerhalb|samt|nebst|zwischen|entgegen|gemäß|laut|binnen|jenseits|diesseits)\b/i;
    SP_ENDS_VERB = /(?:\b(hat|hatte|ist|war|sind|waren|wird|wurde|wurden|kann|konnte|will|wollte|muss|musste|bleibt|blieb|kommt|kam|geht|ging)|(?:^|[^A-Za-zÄÖÜäöüß])[a-zäöüß]{2,}(?:t|te|en|st|et))\.?$/;
    SP_DET = /^(der|die|das|den|dem|des|ein|eine|einen|einem|einer|eines|mein|meine|dein|deine|sein|seine|ihr|ihre|unser|unsere|euer|eure|kein|keine|jeder|jede|jedes|dieser|diese|dieses|jener|jene|jenes|beide|alle|zwei|drei|vier)\b/i;
  }
});

// src/atoms/derive.ts
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
var SEIN_HABEN_WERDEN, KURZVERB, PRAET_FORM, EN_KEIN_VERB, DET_ODER_PREP, NOMEN_ENDUNG;
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
  }
});

// src/atoms/atomisieren.ts
function atomisiere(text, max) {
  const teile = atomisiereRoh(text, max);
  const t = trimSatz(text || "");
  if (t && max >= 6 && wc(t) > max) {
    if (teile.length > 1) zaehle("atomZerlegt", `${t} \u2192 ${teile.join(" | ")}`);
    else if (teile.length === 1 && teile[0] !== t) zaehle("atomGekuerzt", `${t} \u2192 ${teile[0]}`);
    else zaehle("atomGanzZuLang", t);
  }
  return teile;
}
function atomisiereRoh(text, max) {
  const t = trimSatz(text || "");
  if (!t) return [];
  if (!max || max < 6 || wc(t) <= max) return [t];
  const harte = t.split(/\s*(?:—|–|;|:)\s+/).map(trimSatz).filter((x) => wc(x) >= 3);
  if (harte.length > 1) return harte.flatMap((x) => atomisiereRoh(x, max));
  const koord = t.match(/^(.+?),\s+(und|aber|doch|denn|sondern)\s+(.+)$/i);
  if (koord && hatFinitesVerb(koord[1]) && hatFinitesVerb(koord[3]) && wc(koord[1]) >= 3 && wc(koord[3]) >= 3)
    return [...atomisiereRoh(koord[1], max), ...atomisiereRoh(koord[3], max)];
  const ns = t.match(NEBENSATZ);
  if (ns && ns.index !== void 0) {
    const haupt = trimSatz(t.slice(0, ns.index));
    if (tragfaehig(haupt) && wc(haupt) >= 4) return atomisiereRoh(haupt, max);
  }
  return [t];
}
var wc, trimSatz, NP_KOPF2, NEBENSATZ, tragfaehig;
var init_atomisieren = __esm({
  "src/atoms/atomisieren.ts"() {
    "use strict";
    init_derive();
    init_waechterStatistik();
    wc = (s) => (s.match(/[A-Za-zÄÖÜäöüß]+/g) || []).length;
    trimSatz = (s) => s.trim().replace(/^[,;:—–\s]+|[,;:—–\s]+$/g, "").trim();
    NP_KOPF2 = /^(der|die|das|ein|eine|einen|einem|einer|kein|keine|zwei|drei|manche|viele|jede[rs]?|alle)\b/i;
    NEBENSATZ = /,\s+(der|die|das|dem|den|dessen|deren|welche[rsmn]?|dass|weil|wenn|als|während|obwohl|nachdem|bevor|sobald|solange|seit|seitdem|damit|sodass|ohne|um|statt|anstatt|wo|worin|was|wer|wie|ob|falls|indem)\b[^,]*$/i;
    tragfaehig = (s) => wc(s) >= 3 && (hatFinitesVerb(s) || NP_KOPF2.test(s));
  }
});

// src/constants.ts
var STORAGE_CORPUS, CORPUS_MAX;
var init_constants = __esm({
  "src/constants.ts"() {
    "use strict";
    STORAGE_CORPUS = "divergenz_persistent_corpus_v1";
    CORPUS_MAX = 16e4;
  }
});

// src/features/storage-status.ts
function isQuotaError(e) {
  if (!(e instanceof DOMException)) return false;
  return e.name === "QuotaExceededError" || e.name === "NS_ERROR_DOM_QUOTA_REACHED" || e.code === 22 || e.code === 1014;
}
function notifyStorageFull(where) {
  try {
    if (!banner) {
      banner = document.createElement("div");
      banner.setAttribute("role", "alert");
      banner.style.cssText = "position:fixed;left:0;right:0;top:0;z-index:9999;padding:10px 14px;background:#7f1d1d;color:#fff;font:14px/1.4 system-ui,sans-serif;display:flex;gap:12px;align-items:center;justify-content:center;box-shadow:0 2px 8px rgba(0,0,0,.4)";
      const x = document.createElement("button");
      x.textContent = "\u2715";
      x.style.cssText = "background:transparent;border:0;color:#fff;font-size:16px;cursor:pointer";
      x.addEventListener("click", () => {
        banner?.remove();
        banner = null;
      });
      const span = document.createElement("span");
      span.id = "storage-msg";
      banner.append(span, x);
      document.body.appendChild(banner);
    }
    const msg = banner.querySelector("#storage-msg");
    if (msg) msg.textContent = `Speicher voll \u2014 \u201E${where}" konnte nicht gesichert werden. Bitte Korpus k\xFCrzen, Schatzkammer aufr\xE4umen oder ein Projekt exportieren und Daten l\xF6schen.`;
  } catch {
  }
}
function safeSet(key, value, where) {
  try {
    localStorage.setItem(key, value);
    return true;
  } catch (e) {
    if (isQuotaError(e)) notifyStorageFull(where);
    return false;
  }
}
var banner;
var init_storage_status = __esm({
  "src/features/storage-status.ts"() {
    "use strict";
    banner = null;
  }
});

// src/features/livepools.ts
function extractPhrases(text) {
  const src = (text || "").replace(/\s+/g, " ").trim();
  if (!src) return [];
  const out = /* @__PURE__ */ new Set();
  for (const sentence of src.split(/[.!?…]+\s+/)) {
    const toks = sentence.split(" ").map(clip).filter(Boolean);
    for (let i = 0; i < toks.length; i++) {
      const w = toks[i];
      if (!isNoun(w)) continue;
      const p1 = i >= 1 ? toks[i - 1].toLowerCase() : "";
      const p2 = i >= 2 ? toks[i - 2].toLowerCase() : "";
      const art = ART_NOM[p1] || (/^[a-zäöüß-]{4,}$/.test(p1) ? ART_NOM[p2] : void 0);
      if (art) {
        out.add(art + " " + w);
        continue;
      }
      if (PREP.has(p1)) out.add(w);
    }
  }
  return [...out];
}
function loadLive() {
  try {
    const v = JSON.parse(localStorage.getItem(LP_KEY) || "[]");
    return Array.isArray(v) ? v.filter((x) => x && typeof x.t === "string") : [];
  } catch {
    return [];
  }
}
function saveLive(list) {
  safeSet(LP_KEY, JSON.stringify(list), "Lebendige Pools");
}
function feedLivePools(text, weight) {
  const phrases = extractPhrases(text);
  if (!phrases.length) return;
  const list = loadLive();
  const idx = new Map(list.map((e, i) => [e.t, i]));
  const now = Date.now();
  for (const p of phrases) {
    const at = idx.get(p);
    if (at === void 0) {
      list.push({ t: p, n: weight, d: now });
      idx.set(p, list.length - 1);
    } else {
      list[at].n += weight;
      list[at].d = now;
    }
  }
  if (list.length > LP_CAP) {
    list.sort((a, b) => b.n - a.n || b.d - a.d);
    list.length = LP_CAP;
  }
  saveLive(list);
}
var LP_KEY, LP_CAP, LIVE_W, STOP_NOUN, ART_NOM, PREP, clip, isNoun;
var init_livepools = __esm({
  "src/features/livepools.ts"() {
    "use strict";
    init_storage_status();
    LP_KEY = "divergenz_live_pools_v1";
    LP_CAP = 300;
    LIVE_W = { schatz: 3, korpus: 2, gen: 1 };
    STOP_NOUN = /* @__PURE__ */ new Set([
      "Ich",
      "Er",
      "Sie",
      "Es",
      "Wir",
      "Ihr",
      "Du",
      "Man",
      "Herr",
      "Frau",
      "Herrn",
      "Jahr",
      "Jahre",
      "Jahren",
      "Mal",
      "Weise",
      "Art",
      "Teil",
      "Ende",
      "Anfang",
      "Seite",
      "Stelle"
    ]);
    ART_NOM = {
      ein: "ein",
      einen: "ein",
      einem: "ein",
      eines: "ein",
      eine: "eine",
      einer: "eine"
    };
    PREP = /* @__PURE__ */ new Set([
      "auf",
      "aus",
      "vor",
      "in",
      "mit",
      "ohne",
      "gegen",
      "durch",
      "von",
      "zu",
      "bei",
      "nach",
      "\xFCber",
      "unter",
      "um",
      "wie",
      "als",
      "zwischen"
    ]);
    clip = (s) => s.replace(/^[^A-Za-zÄÖÜäöüß]+|[^A-Za-zÄÖÜäöüß]+$/g, "");
    isNoun = (w) => /^[A-ZÄÖÜ][A-Za-zÄÖÜäöüß-]{3,}$/.test(w) && !STOP_NOUN.has(w) && w.length <= 24;
  }
});

// src/corpus.ts
var corpus_exports = {};
__export(corpus_exports, {
  GERUEST_ZEILE: () => GERUEST_ZEILE,
  MarkovModel: () => MarkovModel,
  appendToPersistentCorpus: () => appendToPersistentCorpus,
  buildModelFromCorpus: () => buildModelFromCorpus,
  corpusHygiene: () => corpusHygiene,
  corpusSanitize: () => corpusSanitize,
  isSaneMarkov: () => isSaneMarkov,
  letzteReinigung: () => letzteReinigung,
  loadPersistentCorpus: () => loadPersistentCorpus,
  savePersistentCorpus: () => savePersistentCorpus,
  selbstreinigungAn: () => selbstreinigungAn,
  setzeSelbstreinigung: () => setzeSelbstreinigung,
  smoothMarkov: () => smoothMarkov
});
function loadPersistentCorpus() {
  try {
    return localStorage.getItem(STORAGE_CORPUS) || "";
  } catch {
    return "";
  }
}
function savePersistentCorpus(text) {
  safeSet(STORAGE_CORPUS, text, "Korpus");
}
function corpusSanitize(text) {
  let s = (text ?? "").toString();
  s = s.split(/\r?\n/).filter((z) => !/^\s*(SEQUENZ\s*—|(?:WER|WO|WANN|WAS|GESAMTLÄNGE)\s*:)/.test(z)).map((z) => z.replace(/^\s*(?:Shot\s*\d+\s*\([^)]*\)|(?:DE|EN)\s*:)\s*/, "")).join("\n");
  s = s.replace(/\([^()]*\)/g, " ");
  s = s.replace(/\b(?:gegen|um|ab|seit|bis)\s+\d{1,2}:\d{2}\b\s*(?:—|–)?\s*/gi, "");
  s = s.replace(/\b\d{1,2}:\d{2}\b\s*—\s*/g, "");
  s = s.replace(/\b(Schluss|Notiz|Rand|Gestern|Jetzt|Später|Drei Tage später)\s*—\s*/g, "");
  s = s.replace(/\bSZENE:\s*/g, "");
  s = s.split(/\r?\n/).filter((z) => !GERUEST_ZEILE.test(z)).join("\n");
  s = s.replace(/Faktenkasten\s*·[^\n]*?(?:\.(?=\s+[A-ZÄÖÜ])|$)/g, " ");
  s = s.replace(/—\s*(?=[.—])/g, "");
  s = s.replace(/\.{2,}/g, ".");
  s = s.replace(/\s+/g, " ").trim();
  return s;
}
function corpusHygiene(text) {
  const src = corpusSanitize(text || "");
  const sentences = src.split(/(?<=[.!?…])\s+/).map((x) => x.trim()).filter(Boolean);
  const charsBefore = (text || "").length;
  const seen = /* @__PURE__ */ new Set();
  const kept = [];
  let duplicates = 0;
  for (const raw of sentences) {
    const letters = (raw.match(/[a-zäöüßA-ZÄÖÜ]/g) || []).length;
    const words = raw.match(/[a-zäöüßA-ZÄÖÜ]{2,}/g) || [];
    if (words.length < 4) continue;
    if (letters / raw.length < 0.45) continue;
    if (!words.some((w) => /[aeiouäöüy]/i.test(w))) continue;
    const upper = words.filter((w) => /^[A-ZÄÖÜ]/.test(w)).length;
    if (words.length < 8 && upper / words.length > 0.7) continue;
    const norm = raw.toLowerCase().replace(/\s+/g, " ");
    if (seen.has(norm)) {
      duplicates++;
      continue;
    }
    seen.add(norm);
    kept.push(/[.!?…]$/.test(raw) ? raw : raw + ".");
  }
  let out = kept.join(" ");
  if (out.length > CORPUS_MAX) {
    out = out.slice(out.length - CORPUS_MAX);
    const cut = out.indexOf(" ");
    if (cut > 0) out = out.slice(cut + 1);
  }
  return { text: out, stats: {
    sentencesBefore: sentences.length,
    sentencesAfter: kept.length,
    removed: sentences.length - kept.length,
    duplicates,
    charsBefore,
    charsAfter: out.length
  } };
}
function selbstreinigungAn() {
  try {
    const v = localStorage.getItem(SELBSTREINIGUNG_KEY);
    return v === null ? true : v === "1";
  } catch {
    return true;
  }
}
function setzeSelbstreinigung(an2) {
  try {
    localStorage.setItem(SELBSTREINIGUNG_KEY, an2 ? "1" : "0");
  } catch {
  }
}
function letzteReinigung() {
  return letzte;
}
function appendToPersistentCorpus(textToAdd) {
  const add = corpusSanitize(clean(textToAdd));
  if (!add) return;
  try {
    feedLivePools(add, LIVE_W.korpus);
  } catch {
  }
  let corpus = loadPersistentCorpus();
  const sep = corpus.trim().length ? "\n\n" : "";
  corpus = corpus + sep + add;
  if (corpus.length > CORPUS_MAX) {
    corpus = corpus.slice(corpus.length - CORPUS_MAX);
    const cut = corpus.indexOf("\n\n");
    if (cut > 0 && cut < 5e3) corpus = corpus.slice(cut + 2);
  }
  if (selbstreinigungAn()) {
    const h = corpusHygiene(corpus);
    if (h.stats.removed > 0 || h.stats.duplicates > 0) {
      corpus = h.text;
      zaehle("korpusHygiene", `${h.stats.removed} entfernt (${h.stats.duplicates} Duplikate)`);
    }
    letzte = { ...h.stats, zeit: (/* @__PURE__ */ new Date()).toLocaleTimeString("de-DE") };
  }
  savePersistentCorpus(corpus);
}
function isSaneMarkov(s) {
  if (!s || s.length < 20) {
    zaehle("markovKurz", s);
    return false;
  }
  const words = s.split(/\s+/);
  if (words.length < 5) {
    zaehle("markovWenigWoerter", s);
    return false;
  }
  const freq = {};
  for (const w of words) freq[w] = (freq[w] || 0) + 1;
  const maxFreq = Math.max(...Object.values(freq));
  if (maxFreq / words.length > 0.5) {
    zaehle("markovWiederholung", s);
    return false;
  }
  const functionWords = /* @__PURE__ */ new Set([
    "der",
    "die",
    "das",
    "den",
    "dem",
    "des",
    "ein",
    "eine",
    "einen",
    "einem",
    "einer",
    "eines",
    "in",
    "auf",
    "an",
    "bei",
    "mit",
    "nach",
    "von",
    "aus",
    "vor",
    "hinter",
    "\xFCber",
    "unter",
    "neben",
    "zwischen"
  ]);
  let fn = 0;
  for (const w of words) if (functionWords.has(w.toLowerCase())) fn++;
  if (fn / words.length > 0.6) {
    zaehle("markovFunktionswoerter", s);
    return false;
  }
  const sentences = s.split(/[.!?]+/).filter(Boolean);
  for (const sentence of sentences) {
    const n = sentence.trim().split(/\s+/).length;
    if (n > 30 || n < 2) {
      zaehle("markovSatzlaenge", s);
      return false;
    }
  }
  const phrases = [];
  for (let i = 0; i < words.length - 2; i++) phrases.push(words.slice(i, i + 3).join(" "));
  const pc = {};
  for (const p of phrases) pc[p] = (pc[p] || 0) + 1;
  for (const c of Object.values(pc)) if (c >= 3) {
    zaehle("markovSatzzeichen", s);
    return false;
  }
  if (/\b(Schluss|Notiz|Rand)\s*—|\bSZENE:|dass\s*—|,\s*dass\s*$/i.test(s)) {
    zaehle("markovBruchstueck", s);
    return false;
  }
  if (/[—–]\s*$/.test(s.trim())) {
    zaehle("markovBruchstueck", s);
    return false;
  }
  const AUX_MK = /* @__PURE__ */ new Set(["bin", "bist", "ist", "sind", "seid", "war", "warst", "waren", "wart", "hatte", "hattest", "hatten", "hat", "habe", "hast", "habt", "haben", "wurde", "wurdest", "wurden", "wird", "werde", "werden", "w\xE4re", "w\xE4rst", "w\xE4ren"]);
  const CONN_MK = /* @__PURE__ */ new Set(["und", "oder", "aber", "denn", "sondern", "doch", "weil", "dass", "wenn", "als", "w\xE4hrend", "obwohl", "damit", "sodass", "bevor", "nachdem", "ob", "wie", "wo", "der", "die", "das", "dem", "den"]);
  for (let i = 0; i < words.length; i++) {
    const wi = words[i].toLowerCase().replace(/[^a-zäöüß]/g, "");
    if (!AUX_MK.has(wi)) continue;
    for (let j = i + 1; j <= Math.min(words.length - 1, i + 3); j++) {
      const wj = words[j].toLowerCase().replace(/[^a-zäöüß]/g, "");
      if (CONN_MK.has(wj) || /[,;:]/.test(words[j])) break;
      const finite = /(t|te|ten|st)$/.test(wj) && CLAUSE_VERBS.has(wj) && !/^ge/.test(wj) && !AUX_MK.has(wj);
      if (finite) return false;
    }
  }
  const lw = words.map((w) => w.toLowerCase().replace(/[^a-zäöüß]/g, ""));
  for (let i = 0; i < lw.length; i++) {
    if (lw[i].length < 5) continue;
    for (let j = i + 1; j <= Math.min(lw.length - 1, i + 3); j++) {
      if (lw[j] === lw[i]) return false;
    }
  }
  if (!stueckPlausibel(s)) return false;
  return true;
}
function smoothMarkov(s) {
  let words = (s || "").trim().split(/\s+/).filter(Boolean);
  if (!words.length) return "";
  const norm = (w) => w.toLowerCase().replace(/[^a-zäöüß]/g, "");
  const dedup = [];
  for (const w of words) {
    const prev = dedup[dedup.length - 1];
    if (prev && norm(prev) && norm(prev) === norm(w)) continue;
    dedup.push(w);
  }
  words = dedup;
  while (words.length > 3 && MK_TAIL_STOP.has(norm(words[words.length - 1]))) words.pop();
  let t = words.join(" ").replace(/\s+([,.;:!?…])/g, "$1").trim();
  t = t.replace(/[\s,;:—–-]+$/, "");
  if (t && !/[.!?…]$/.test(t)) t += ".";
  t = t.replace(/^([a-zäöüß])/, (c) => c.toUpperCase());
  return t;
}
function buildModelFromCorpus(order = 2) {
  const model = new MarkovModel(order);
  const corpus = loadPersistentCorpus();
  if (corpus) model.addText(corpus);
  return model;
}
var GERUEST_ZEILE, SELBSTREINIGUNG_KEY, letzte, MK_TAIL_STOP, MarkovModel;
var init_corpus = __esm({
  "src/corpus.ts"() {
    "use strict";
    init_waechterStatistik();
    init_constants();
    init_text_utils();
    init_storage_status();
    init_beats();
    init_satzwaechter();
    init_livepools();
    GERUEST_ZEILE = /^\s*(Faktenkasten\b|Kurz gemeldet\s*$|Fiktive Zeitung\b|Zeitzeichen\s*[·|]|Nr\.\s*\d+\s*[·|]|UNABHÄNGIG\b|SEQUENZ\s*—|(?:WER|WO|WANN|WAS|GESAMTLÄNGE)\s*:)/;
    SELBSTREINIGUNG_KEY = "dm_korpus_selbstreinigung_v1";
    letzte = null;
    MK_TAIL_STOP = /* @__PURE__ */ new Set([
      "und",
      "oder",
      "aber",
      "denn",
      "sondern",
      "doch",
      "wie",
      "als",
      "ob",
      "dass",
      "weil",
      "w\xE4hrend",
      "der",
      "die",
      "das",
      "den",
      "dem",
      "des",
      "ein",
      "eine",
      "einen",
      "einem",
      "einer",
      "zu",
      "in",
      "auf",
      "an",
      "mit",
      "von",
      "aus",
      "vor",
      "f\xFCr",
      "bei",
      "nach",
      "\xFCber",
      "unter",
      "noch",
      "nur",
      "auch",
      "so",
      "dann",
      "genau",
      "im",
      "am",
      "beim",
      "zum",
      "zur",
      "ins",
      "vom",
      "ans",
      "aufs",
      "f\xFCrs",
      "durchs",
      "\xFCbers",
      "ums"
    ]);
    MarkovModel = class {
      constructor(order = 2) {
        this.map = /* @__PURE__ */ new Map();
        this.starts = [];
        this.order = Math.max(1, order);
      }
      get size() {
        return this.map.size;
      }
      /** Fügt einen Text inkrementell hinzu. */
      addText(text) {
        const clean1 = corpusSanitize(text);
        for (const sentence of clean1.split(/(?<=[.!?…])\s+/)) {
          const tokens = sentence.split(/\s+/).filter(Boolean);
          if (tokens.length <= this.order) continue;
          this.starts.push(tokens.slice(0, this.order).join(" "));
          for (let i = 0; i + this.order < tokens.length; i++) {
            const key = tokens.slice(i, i + this.order).join(" ");
            const next = tokens[i + this.order];
            const arr = this.map.get(key);
            if (arr) arr.push(next);
            else this.map.set(key, [next]);
          }
        }
      }
      /** Mittlere Überraschung (bits) eines Textes unter dem eigenen Modell, 0..1 normiert.
       *  Hoch = der Text folgt unwahrscheinlichen Übergängen (informationsreich),
       *  niedrig = er reproduziert den Korpus (klischeehaft). Nur bekannte Keys zählen. */
      surprise(text) {
        const clean1 = corpusSanitize(text);
        let bits = 0, n = 0;
        for (const sentence of clean1.split(/(?<=[.!?…])\s+/)) {
          const toks = sentence.split(/\s+/).filter(Boolean);
          for (let i = 0; i + this.order < toks.length; i++) {
            const key = toks.slice(i, i + this.order).join(" ");
            const choices = this.map.get(key);
            if (!choices || !choices.length) continue;
            const next = toks[i + this.order];
            let c = 0;
            for (const x of choices) if (x === next) c++;
            const p = c > 0 ? c / choices.length : 1 / (choices.length + 1);
            bits += -Math.log2(p);
            n++;
          }
        }
        if (n < 2) return -1;
        return Math.max(0, Math.min(1, bits / n / 8));
      }
      /** Erzeugt einen Text (bis maxWords Wörter). */
      generate(maxWords = 40) {
        if (!this.starts.length) return "";
        let key = this.starts[Math.floor(Math.random() * this.starts.length)];
        const out = key.split(" ");
        const hart = Math.ceil(maxWords * 1.5);
        while (out.length < hart) {
          const choices = this.map.get(key);
          if (!choices || !choices.length) break;
          const next = choices[Math.floor(Math.random() * choices.length)];
          out.push(next);
          key = out.slice(out.length - this.order).join(" ");
          if (/[.!?…]$/.test(next) && out.length >= this.order + 2) break;
        }
        if (!/[.!?…]$/.test(out[out.length - 1] || "")) {
          let i = out.length - 1;
          while (i >= 0 && !/[.!?…]$/.test(out[i])) i--;
          if (i < this.order + 1) return "";
          out.length = i + 1;
        }
        return out.join(" ");
      }
    };
  }
});

// src/generation/nlp.ts
function tokenize(text) {
  return (text || "").replace(/\r/g, "").replace(/([.,!?;:()„""""—])/g, " $1 ").replace(/\s+/g, " ").trim().split(" ").filter(Boolean);
}
function coherenceWords(s) {
  return tokenize(String(s || "").toLowerCase()).filter((w) => w.length > 3 && !COHERENCE_STOPWORDS.has(w));
}
var COHERENCE_STOPWORDS;
var init_nlp = __esm({
  "src/generation/nlp.ts"() {
    "use strict";
    COHERENCE_STOPWORDS = new Set(
      "aber alle allem allen aller alles als also am an andere anderen auch auf aus bei bin bis bist da dabei dann das dass dem den denn der des dessen die dies diese diesem diesen dieser dieses doch dort du durch ein eine einem einen einer eines er es etwas fuer f\xFCr gegen hab habe haben hat hatte hier hin hinter ich ihm ihn ihr ihre im in ist ja jede jedem jeden jeder jedes kann kein keine man mehr mein mich mir mit muss nach nicht nichts noch nun nur ob oder ohne schon sein seine sich sie sind so ueber \xFCber um und uns unser unter vom von vor war waren was wenn werden wie wieder will wir wird wo zu zum zur".split(" ")
    );
  }
});

// src/generation/tone.data.ts
var TONE_DATA;
var init_tone_data = __esm({
  "src/generation/tone.data.ts"() {
    "use strict";
    TONE_DATA = {
      "neutral": { "opener": [], "flavor": [] },
      "mystery": {
        "opener": [
          "Was jetzt folgt, l\xE4sst sich nicht ganz erkl\xE4ren.",
          "Manches davon ergibt erst im Nachhinein einen Sinn.",
          "Von Anfang an fehlt ein Teil des Bildes.",
          "Sp\xE4ter w\xFCrde niemand sagen k\xF6nnen, wann es genau begann.",
          "Es gibt eine Version der Geschichte, und dann die wahre.",
          "Irgendetwas stimmt nicht, lange bevor es jemand bemerkt.",
          "Die Wahrheit liegt n\xE4her, als alle glauben - und tiefer.",
          "Der Anfang liegt weiter zur\xFCck, als es den Anschein hat.",
          "Was hier steht, ist die zweitbeste Erkl\xE4rung.",
          "Niemand hat es kommen sehen, und alle wussten es.",
          "Es beginnt mit einer Zahl, die nicht stimmt.",
          "Zwei Zeugen, zwei Geschichten, ein Abend.",
          "Am Ende fehlt genau ein Satz."
        ],
        "flavor": [
          "Etwas darin bleibt bewusst unausgesprochen.",
          "Nicht alles l\xE4sst sich erkl\xE4ren, so sehr man es auch versucht.",
          "Eine Frage schwingt mit, die niemand laut zu stellen wagt.",
          "Es ist, als fehle ein ganzes Kapitel der Geschichte.",
          "Irgendjemand wei\xDF offensichtlich mehr, als er zugibt.",
          "Die Erkl\xE4rung daf\xFCr kommt nie - oder ist schlimmer als das R\xE4tsel selbst.",
          "Ein Detail passt nicht, und genau daran h\xE4ngt alles.",
          "Was fehlt, ist lauter als das, was gesagt wird.",
          "Jede Antwort \xF6ffnet zwei neue T\xFCren.",
          "Man ahnt, dass die Spur im Kreis f\xFChrt.",
          "Zwischen den Zeilen wartete eine zweite Geschichte.",
          "Niemand hat den Anfang gesehen, nur die Folgen.",
          "Ein Name f\xE4llt zu oft, um zuf\xE4llig zu sein.",
          "Die Reihenfolge stimmt, die Uhrzeit nicht.",
          "Wer zuh\xF6rt, h\xF6rt zwei Dinge gleichzeitig.",
          "Ein Zeuge widerspricht sich freundlich.",
          "Etwas wurde wegger\xE4umt, bevor jemand fragte.",
          "Der k\xFCrzeste Weg wird nie genommen.",
          "Ein Zufall wiederholt sich und hei\xDFt dann anders.",
          "Es bleibt eine T\xFCr, die niemand aufschlie\xDFt."
        ]
      },
      "poetic": {
        "opener": [
          "Manche Dinge lassen sich nur in Bildern erz\xE4hlen.",
          "Es beginnt, wie Erinnerungen beginnen: unscharf und zu hell.",
          "Alles daran hat den Klang von etwas Vergangenem.",
          "Es ist einer jener Momente, die l\xE4nger dauern als ihre Minute.",
          "Das Licht f\xE4llt so, dass Worte fast \xFCberfl\xFCssig werden.",
          "Vielleicht ist es weniger ein Ereignis als ein Nachhall.",
          "Der Tag beginnt, als h\xE4tte er nichts vor.",
          "Zuerst ist da nur ein Ger\xE4usch, das nicht aufh\xF6rt.",
          "Es ist eine Stunde ohne Namen.",
          "Das Licht steht schief und bleibt so.",
          "Zwischen zwei Atemz\xFCgen liegt der ganze Anfang.",
          "Alles hier ist zu leise f\xFCr seine Gr\xF6\xDFe."
        ],
        "flavor": [
          "Die Worte daf\xFCr kommen, wenn \xFCberhaupt, erst viel sp\xE4ter.",
          "Alles darin klingt wie die Erinnerung an etwas Gr\xF6\xDFeres.",
          "Selbst die Stille schien an diesem Ort eine Farbe zu haben.",
          "Es f\xFChlt sich an wie ein halb vergessenes Gedicht, das jemand zu Ende tr\xE4umt.",
          "Zwischen den S\xE4tzen liegt mehr als in ihnen.",
          "Wie ein Bild, das l\xE4nger nachwirkt als die Geschichte dazu.",
          "Die Zeit flie\xDFt hier langsamer, fast wie Honig im Winter.",
          "Jede Bewegung hinterlie\xDF eine Spur aus Licht.",
          "Es ist sch\xF6n auf die Weise, die auch wehtut.",
          "Man h\xF6rt die Dinge atmen, wenn man still genug ist.",
          "Die R\xE4nder der Welt schienen kurz weicher zu werden.",
          "Ein Duft von etwas, das es so nie gegeben hat.",
          "Das Licht bleibt an den Kanten h\xE4ngen.",
          "Die Luft tr\xE4gt weiter als der Ruf.",
          "Etwas Kleines behauptet sich gegen den Raum.",
          "Ein Schatten legt sich hin und bleibt.",
          "Die Farben werden langsamer als die Formen.",
          "Der Klang bleibt l\xE4nger als sein Grund.",
          "Ein Rest W\xE4rme steht noch im T\xFCrrahmen.",
          "Zwischen den Dingen w\xE4chst eine Stille an."
        ]
      },
      "melancholisch": {
        "opener": [
          "Es liegt eine leise Traurigkeit \xFCber allem, ganz ohne Grund.",
          "Was bleibt, ist selten das, was man behalten wollte.",
          "Manches endet, lange bevor man es merkt.",
          "Es ist die Art von Nachmittag, an dem alles ein wenig verblasst.",
          "Irgendwo darin steckt ein Abschied, den keiner ausgesprochen hat.",
          "Sp\xE4ter w\xFCrde man sich an diesen Tag erinnern, ohne zu wissen, warum.",
          "Es h\xE4tte auch anders kommen k\xF6nnen, aber nicht sehr.",
          "Vieles davon ist schon vorbei, w\xE4hrend es geschieht.",
          "Der Abschied hat lange vorher angefangen.",
          "Man merkt es erst, wenn es ruhiger wird.",
          "Was bleibt, ist kleiner als erwartet.",
          "Es ist ein Tag zum Aufr\xE4umen."
        ],
        "flavor": [
          "Etwas darin f\xFChlt sich an wie das Ende eines langen Sommers.",
          "Man vermisste etwas, ohne benennen zu k\xF6nnen, was.",
          "Die Dinge haben den sanften Glanz des Verg\xE4nglichen.",
          "Es ist weniger Schmerz als eine ruhige, alte Wehmut.",
          "Alles bleibt - nur nicht so, wie es einmal gewesen ist.",
          "Ein Teil davon ist schon Erinnerung, w\xE4hrend es noch geschieht.",
          "Die Freude kommt mit einem feinen Riss darin.",
          "Man wei\xDF, dass man diesen Moment sp\xE4ter vermissen wird.",
          "Selbst das Licht scheint sich langsam zu verabschieden.",
          "Es ist sch\xF6n, und genau das macht es schwer.",
          "Was gewesen ist, nimmt mehr Platz ein als das \xDCbrige.",
          "Ein Zimmer, das gr\xF6\xDFer wurde, ohne zu wachsen.",
          "Die Gewohnheit bleibt, der Grund ist fort.",
          "Man legt es zur\xFCck, wo es nie hingeh\xF6rte.",
          "Der zweite Stuhl steht weiter am Tisch.",
          "Es fehlt niemand, und doch ist es leer.",
          "Ein Satz bleibt unbeantwortet und st\xF6rt nicht mehr.",
          "Die Jahreszeit wechselt schneller als der Blick."
        ]
      },
      "dark": {
        "opener": [
          "Von der ersten Sekunde an f\xFChlte sich hier nichts richtig an.",
          "Es begann leise - so, wie das Schlimmste meistens beginnt.",
          "Manche Orte warten nur darauf, dass jemand kommt.",
          "Es gibt keinen Ausweg, nur die Illusion davon.",
          "Was folgte, h\xE4tte niemand aufhalten k\xF6nnen.",
          "Die Dunkelheit hier ist \xE4lter als das Haus, das sie birgt.",
          "Nichts davon endet gut, und das ist bekannt.",
          "Es beginnt mit einer Rechnung, die offen bleibt.",
          "Die Sache war lange faul, bevor sie roch.",
          "Von hier f\xFChrt kein Weg zur\xFCck, nur weiter.",
          "Jemand hat entschieden, und niemand hat gefragt.",
          "Der Preis stand von Anfang an fest."
        ],
        "flavor": [
          "Nichts daran f\xFChlt sich je wirklich sicher an.",
          "Etwas darin roch unverkennbar nach Verlust.",
          "Die K\xE4lte bleibt, auch wenn l\xE4ngst niemand mehr hinsieht.",
          "Es ist die Art von Stille, die etwas Schlimmeres ank\xFCndigt.",
          "Irgendwo darunter wartete bereits das n\xE4chste Ungl\xFCck.",
          "Kein Trost weit und breit - nur die Gewissheit, dass es schlimmer werden w\xFCrde.",
          "Jeder Ausweg f\xFChrt nur tiefer hinein.",
          "Etwas beobachtete, ohne je gesehen zu werden.",
          "Die Hoffnung ist das Erste, was hier stirbt.",
          "Man sp\xFCrt, dass die W\xE4nde zuh\xF6ren.",
          "Es ist zu sp\xE4t, schon bevor es beginnt.",
          "Selbst das Schweigen hat hier Z\xE4hne.",
          "Was sch\xFCtzt, kostet mehr, als es h\xE4lt.",
          "Der Ausweg ist verstellt, seit Wochen.",
          "Es wird k\xE4lter, wo vorher gewartet wurde.",
          "Der Schaden ist alt und tr\xE4gt einen neuen Namen.",
          "Niemand meldet sich, und das ist die Antwort.",
          "Die Frist l\xE4uft, auch wenn niemand z\xE4hlt.",
          "Was fehlt, wird nicht ersetzt.",
          "Am Ende bleibt jemand zur\xFCck, der nicht gemeint war."
        ]
      },
      "unheimlich": {
        "opener": [
          "Alles wirkt vertraut, und genau das ist das Problem.",
          "Irgendetwas ist anders, aber man kann nicht sagen, was.",
          "Die Dinge stehen zu still, um nat\xFCrlich zu sein.",
          "Es ist, als h\xE4tte jemand die Welt fast, aber nicht ganz richtig nachgebaut.",
          "Man hat das Gef\xFChl, nicht allein zu sein - ohne Beweis daf\xFCr.",
          "Etwas stimmt mit den Schatten nicht.",
          "Etwas ist verstellt worden, und niemand wei\xDF von wem.",
          "Es riecht nach einem Raum, der lange zu war.",
          "Die Zahlen stimmen, die Stimmung nicht.",
          "Von drau\xDFen sieht alles gew\xF6hnlich aus.",
          "Man sollte hier nicht stehen bleiben.",
          "Der Ort hat gewartet."
        ],
        "flavor": [
          "Die Spiegel scheinen einen Sekundenbruchteil zu sp\xE4t zu reagieren.",
          "Ein Ger\xE4usch, das nur existiert, wenn man nicht hinh\xF6rt.",
          "Die Gesichter sind richtig, nur das L\xE4cheln sitzt falsch.",
          "Etwas z\xE4hlt mit, jedes Mal, wenn man die T\xFCr schlie\xDFt.",
          "Die Uhr geht, aber die Zeit steht.",
          "Man erkennt den Raum wieder, ohne je dort gewesen zu sein.",
          "Die Stille hat eine Form, und sie kommt n\xE4her.",
          "Irgendwo atmet etwas im Takt der eigenen Schritte.",
          "Ein Detail ist zu viel im Bild, und keiner sieht es an.",
          "Es f\xFChlt sich an, als w\xFCrde man erwartet.",
          "Das Ger\xE4usch kommt von innen, nicht von der Stra\xDFe.",
          "Etwas atmet mit, kaum h\xF6rbar.",
          "Der Boden gibt an einer Stelle nach.",
          "Zwei T\xFCren f\xFChren in denselben Raum.",
          "Es wird still, sobald man hinsieht.",
          "Eine Uhr geht nach und niemand stellt sie.",
          "Der Abdruck passt zu keiner Hand.",
          "Was hier bleibt, war schon vorher da."
        ]
      },
      "uplifting": {
        "opener": [
          "Und doch beginnt hier, allen Umst\xE4nden zum Trotz, etwas Gutes.",
          "Selbst an diesem Ort l\xE4sst sich noch Hoffnung finden.",
          "Manchmal reicht ein einziger Moment, um alles zu wenden.",
          "Es sieht aussichtslos aus - und ist es dann doch nicht.",
          "Irgendwo darin liegt der Anfang von etwas Besserem.",
          "Gerade wenn alles verloren scheint, kommt das Licht zur\xFCck.",
          "Es f\xE4ngt klein an und bleibt nicht klein.",
          "Etwas geht auf, das lange gelegen hat.",
          "Der Tag hat mehr vor als gedacht.",
          "Einer f\xE4ngt an, und dann sind es viele.",
          "Es gibt gute Gr\xFCnde, heute zu bleiben.",
          "Der Anfang ist gemacht, mehr braucht es nicht."
        ],
        "flavor": [
          "Und doch bleibt, gegen jede Erwartung, ein Rest Hoffnung.",
          "Irgendetwas darin f\xFChlte sich nach einem echten Neuanfang an.",
          "Es ist, als w\xFCrde sich gerade, ganz leise, etwas zum Guten wenden.",
          "Ein kleiner Trost bleibt trotzdem - und manchmal reicht genau das.",
          "Selbst im Schwierigsten findet sich noch ein Grund zum Weitermachen.",
          "Am Ende z\xE4hlt nicht der Verlust, sondern das, was bleibt.",
          "Eine unerwartete Freundlichkeit ver\xE4nderte alles.",
          "Zum ersten Mal seit Langem scheint der Weg wieder offen.",
          "Es ist schwer, aber es lohnt sich.",
          "Manchmal ist der Sturz nur der Anlauf.",
          "Etwas darin richtet sich wieder auf.",
          "Und pl\xF6tzlich scheint alles m\xF6glich.",
          "Etwas l\xF6st sich, ohne dass jemand zieht.",
          "Zwei, die nichts verband, arbeiten zusammen.",
          "Der Weg wird breiter, je weiter man geht.",
          "Was fehlt, wird von selbst erg\xE4nzt.",
          "Der Raum f\xFCllt sich, ohne eng zu werden.",
          "Aus einer Zusage werden drei.",
          "Es reicht diesmal f\xFCr alle.",
          "Der zweite Versuch gelingt leichter."
        ]
      },
      "zaertlich": {
        "opener": [
          "Es geschieht mit einer Behutsamkeit, die man kaum erwarten w\xFCrde.",
          "Manche Dinge muss man leise erz\xE4hlen, sonst zerbrechen sie.",
          "Es ist klein und warm und leicht zu \xFCbersehen.",
          "Zwischen ihnen liegt eine Sanftheit, f\xFCr die es kein Wort gibt.",
          "Es beginnt mit einer Geste, die niemand sonst bemerkt.",
          "Alles daran ist sacht, fast wie Atem im Schlaf.",
          "Es wird niemand laut in dieser Geschichte.",
          "Jemand h\xE4lt etwas fest, ohne zu dr\xFCcken.",
          "Der Anfang ist so behutsam, dass man ihn \xFCbersieht.",
          "Es ist eine Stunde, in der nichts verlangt wird.",
          "Man macht Platz, bevor gefragt wird.",
          "Alles hier hat Zeit."
        ],
        "flavor": [
          "Eine Hand, die blieb, obwohl sie gehen durfte.",
          "Es ist die Sorte N\xE4he, die keine Worte braucht.",
          "Etwas darin passt auf einen auf, ganz unaufdringlich.",
          "Ein L\xE4cheln, so leise, dass man es fast \xFCberh\xF6rt.",
          "Die Welt wird f\xFCr einen Moment weicher.",
          "Es ist ein kleines Z\xE4rtlichsein, mitten im L\xE4rm.",
          "Jemand h\xE4lt etwas Zerbrechliches, ohne es zu dr\xFCcken.",
          "W\xE4rme, die keine Gegenleistung will.",
          "Es f\xFChlt sich an wie Ankommen.",
          "Ein Trost, der einfach nur dablieb.",
          "Eine Hand bleibt liegen, wo sie ist.",
          "Es wird leiser gesprochen als n\xF6tig.",
          "Jemand deckt zu, ohne zu wecken.",
          "Der Weg wird k\xFCrzer gemacht, ohne davon zu reden.",
          "Etwas Warmes bleibt stehen und wartet.",
          "Man reicht das Bessere weiter.",
          "Ein Name wird ausgesprochen wie eine Zusage.",
          "Es ist Platz genug f\xFCr zwei Meinungen."
        ]
      },
      "traeumerisch": {
        "opener": [
          "Es ist schwer zu sagen, ob es geschieht oder nur getr\xE4umt wird.",
          "Die R\xE4nder der Dinge sind an diesem Tag nicht ganz fest.",
          "Alles treibt ein wenig, wie Boote ohne Anker.",
          "Es f\xFChlt sich an, als w\xE4re man mitten in einem fremden Traum aufgewacht.",
          "Die Logik hat hier Urlaub genommen.",
          "Zeit und Ort sind nur Vorschl\xE4ge.",
          "Die Reihenfolge ist hier nicht das Wichtigste.",
          "Es beginnt mittendrin, wie immer.",
          "Etwas geht auf, das keine T\xFCr hat.",
          "Der Weg f\xFChrt weiter, obwohl er endet.",
          "Zwei Orte fallen zusammen, ohne sich zu st\xF6ren.",
          "Es ist sp\xE4ter, als es sein d\xFCrfte."
        ],
        "flavor": [
          "Die Dinge verwandeln sich, kaum dass man wegsieht.",
          "Ein Zimmer wird zum Meer, ohne dass es jemand st\xF6rt.",
          "Die Schwerkraft scheint Verhandlungssache zu sein.",
          "Man geht durch T\xFCren, die es vorher nicht gegeben hat.",
          "Farben riechen, und Ger\xE4usche haben Gewicht.",
          "Alles ergab Sinn, solange man nicht genauer hinsah.",
          "Die Erinnerung l\xE4uft der Gegenwart voraus.",
          "Ein Gedanke wird Landschaft.",
          "Nichts steht fest, und nichts f\xE4llt.",
          "Es ist sch\xF6n und ungereimt wie ein Traum kurz vor dem Erwachen.",
          "Ein Raum \xF6ffnet sich, wo keiner war.",
          "Die Treppe f\xFChrt zweimal nach oben.",
          "Etwas wiederholt sich mit anderem Ausgang.",
          "Der Weg kennt sein Ziel besser als der Gehende.",
          "Ein Fenster zeigt eine andere Jahreszeit.",
          "Die Entfernung \xE4ndert sich beim Hinsehen.",
          "Man kommt an, ohne gegangen zu sein.",
          "Etwas Bekanntes tr\xE4gt einen fremden Namen."
        ]
      },
      "nuechtern": {
        "opener": [
          "Der Reihe nach: Es geschah genau so, wie es hier steht.",
          "Ohne Umschweife - das ist, was passierte.",
          "Es gibt daran nichts zu besch\xF6nigen.",
          "Die Fakten sind \xFCbersichtlich, die Folgen weniger.",
          "Man muss es nicht ausschm\xFCcken, es gen\xFCgt so.",
          "Kurz und ohne Pathos: So liegt der Fall.",
          "Der Vorgang ist \xFCberschaubar.",
          "Es liegt eine Reihenfolge vor.",
          "Die Zust\xE4ndigkeit ist gekl\xE4rt.",
          "Der Rahmen steht, der Rest folgt.",
          "Es gibt dazu eine Akte.",
          "Die Sache ist erledigt, bis auf zwei Punkte."
        ],
        "flavor": [
          "Mehr ist dazu nicht zu sagen.",
          "Die Sache hat eine klare Ursache und eine klare Folge.",
          "Es hilft nichts, es zu besch\xF6nigen.",
          "Alles Weitere ergab sich daraus von selbst.",
          "N\xFCchtern betrachtet, bleibt wenig Raum f\xFCr Zweifel.",
          "Die Lage ist, was sie ist.",
          "Man notiert es und geht weiter.",
          "Kein Drama, nur der n\xE4chste Schritt.",
          "So einfach, so unausweichlich.",
          "Am Ende z\xE4hlen nur die Zahlen.",
          "Der Vorgang ist abgelegt.",
          "Eine Frist wurde notiert.",
          "Zwei Angaben widersprechen sich geringf\xFCgig.",
          "Der Ablauf wurde eingehalten.",
          "Die Unterlagen liegen vollst\xE4ndig vor.",
          "Es bleibt bei der bisherigen Regelung.",
          "Der Fall wird weitergeleitet.",
          "Eine R\xFCckmeldung steht noch aus."
        ]
      },
      "ironisch": {
        "opener": [
          "Nat\xFCrlich l\xE4uft alles nach Plan - nur nicht nach diesem.",
          "Man ahnt schon, wie gut das ausgehen wird.",
          "Es ist, mit Verlaub, eine gl\xE4nzende Idee. Fast.",
          "Was h\xE4tte dabei schon schiefgehen k\xF6nnen.",
          "Wie sch\xF6n, dass wenigstens einer den \xDCberblick behielt. Behauptete er.",
          "Der Plan ist wasserdicht. Das Wasser findet trotzdem einen Weg.",
          "Es lief alles nach Plan, nur nicht nach diesem.",
          "Eine hervorragende Gelegenheit, es nicht zu tun.",
          "Man kann viel falsch machen, und man tut es.",
          "Der Anfang war gut gemeint.",
          "Zum Gl\xFCck gibt es eine Zust\xE4ndigkeit.",
          "Alles bestens, sagt jedenfalls das Formular."
        ],
        "flavor": [
          "Es l\xE4uft exakt so gut, wie zu erwarten ist.",
          "Ein voller Erfolg, wenn man die Ziele nachtr\xE4glich anpasst.",
          "Zum Gl\xFCck ist ja jemand zust\xE4ndig - nur nicht anwesend.",
          "Die Ironie daran entging allen Beteiligten.",
          "Man nannte es Strategie, um nicht Zufall sagen zu m\xFCssen.",
          "Selbstverst\xE4ndlich hat niemand etwas geahnt. Angeblich.",
          "Ein Meisterwerk der Planung, r\xFCckw\xE4rts betrachtet.",
          "Alles unter Kontrolle, versichert die Kontrolle.",
          "Bemerkenswert, wie zuverl\xE4ssig das Unwahrscheinliche eintraf.",
          "Es h\xE4tte schlimmer kommen k\xF6nnen. Kam es dann auch.",
          "Der Vorschlag wird gelobt und abgeheftet.",
          "Zust\xE4ndig ist, wer gerade nicht da ist.",
          "Man einigt sich darauf, sich zu einigen.",
          "Die L\xF6sung wartet auf ein passendes Problem.",
          "Ein Ausschuss besch\xE4ftigt sich damit, gr\xFCndlich.",
          "Der k\xFCrzeste Weg wurde gepr\xFCft und verworfen.",
          "Es gibt jetzt ein Merkblatt dazu.",
          "Alle sind einverstanden, aber anders."
        ]
      },
      "humorous": {
        "opener": [
          "Es h\xE4tte ernst werden k\xF6nnen - wurde es aber nicht ganz.",
          "Manche Geschichten sind einfach zu absurd, um nicht zu grinsen.",
          "Was folgt, ist mit Ansage albern.",
          "Es beginnt harmlos und entgleitet dann auf komische Weise.",
          "Man sollte das nicht so ernst nehmen. Die Beteiligten taten es auch nicht.",
          "Vorweg: Niemand kommt ernsthaft zu Schaden, nur die W\xFCrde.",
          "Es ging schief, aber mit Anlauf.",
          "Zwei Dinge fehlten: der Plan und der Rest.",
          "Man h\xE4tte es wissen k\xF6nnen, wollte aber nicht.",
          "Der Anfang war schon das Beste daran.",
          "Es gab Kaffee, sonst nichts.",
          "Jemand hat das ernst gemeint."
        ],
        "flavor": [
          "Absurd genug, um fast schon wieder normal zu wirken.",
          "Selbst das Schicksal scheint dabei kurz zu grinsen.",
          "Niemand w\xFCrde sich das so ausdenken - und genau deshalb ist es lustig.",
          "Es hat, aller Dramatik zum Trotz, etwas unfreiwillig Komisches.",
          "Man br\xE4uchte fast Popcorn, so albern l\xE4uft das gerade.",
          "Selbst die Beteiligten m\xFCssen sich das Lachen verkneifen.",
          "Es ist ein Chaos, aber ein gut gelauntes.",
          "Die Peinlichkeit ist beeindruckend gleichm\xFCtig.",
          "Am Ende lachen alle - manche sogar freiwillig.",
          "Der Ernst der Lage hat sichtlich Feierabend.",
          "Der Zettel dazu ist unauffindbar, nat\xFCrlich.",
          "Es fehlt genau das eine Teil.",
          "Zwei halten es f\xFCr erledigt, drei nicht.",
          "Der Ersatz ist besser als das Original, leider.",
          "Es funktioniert, solange niemand hinsieht.",
          "Der Hund hat es gesehen und schweigt.",
          "Man einigt sich auf sp\xE4ter.",
          "Ein Erfolg, wenn man nicht so genau hinschaut."
        ]
      }
    };
  }
});

// src/generation/tone.shape.ts
function toneRegister(tone) {
  return tone && TONE_SHAPE[tone]?.register || null;
}
function applyToneRegister(text, tone) {
  const reg = toneRegister(tone);
  if (!reg || !text) return text;
  if (reg === "plain") {
    let t = text.replace(/\b(gleichsam|wie Honig im Winter|wie ein halb vergessenes Gedicht[^.,;]*)\b/gi, "").replace(/\s{2,}/g, " ");
    t = t.split(/\n\n+/).map((para) => {
      const sents = para.split(/(?<=[.!?…])\s+/);
      const out = [];
      for (const sen of sents) {
        const wc2 = sen.split(/\s+/).filter(Boolean).length;
        if (wc2 > 16) {
          const parts = sen.split(/,\s+(?=und |aber |denn |während |sodass |wobei )/);
          if (parts.length > 1) {
            parts.forEach((p, i) => {
              let seg = p.replace(/^,?\s*(und|aber|denn|während|sodass|wobei)\s+/i, "").trim();
              if (!seg) return;
              seg = cap1(seg);
              if (!/[.!?…]$/.test(seg)) seg += ".";
              out.push(i === 0 && /[.!?…]$/.test(p) ? cap1(p.trim()) : seg);
            });
            continue;
          }
        }
        out.push(sen);
      }
      return out.join(" ");
    }).join("\n\n");
    return t.replace(/\s+([,.;:!?…])/g, "$1").replace(/\s{2,}/g, " ").trim();
  }
  if (reg === "wry") {
    const tags = ["\u2014 angeblich.", "\u2014 so hie\xDF es.", "\u2014 was auch immer das hei\xDFen sollte.", "\u2014 nat\xFCrlich.", "\u2014 wie praktisch.", "\u2014 oder so \xE4hnlich."];
    let ti = Math.floor(Math.random() * tags.length);
    let gesetzt = 0, vorherGesetzt = false;
    return text.split(/\n\n+/).map((para) => {
      const sents = para.split(/(?<=[.!?…])\s+/);
      return sents.map((sen) => {
        const wc2 = sen.split(/\s+/).filter(Boolean).length;
        if (gesetzt < 3 && !vorherGesetzt && wc2 >= 5 && wc2 <= 18 && /[.]$/.test(sen) && !/[()"„:—–]/.test(sen) && Math.random() < 0.3) {
          const tag = tags[ti % tags.length];
          ti++;
          gesetzt++;
          vorherGesetzt = true;
          return sen.replace(/\.$/, " " + tag);
        }
        vorherGesetzt = false;
        return sen;
      }).join(" ");
    }).join("\n\n");
  }
  return text;
}
var TONE_SHAPE, cap1;
var init_tone_shape = __esm({
  "src/generation/tone.shape.ts"() {
    "use strict";
    TONE_SHAPE = {
      neutral: {},
      mystery: { rhythm: "long" },
      poetic: { rhythm: "breath", register: "lyrical" },
      melancholisch: { rhythm: "long", register: "lyrical" },
      dark: { rhythm: "fracture", register: "dark" },
      unheimlich: { rhythm: "fracture", register: "dark" },
      uplifting: { rhythm: "clean" },
      zaertlich: { rhythm: "breath", register: "lyrical" },
      traeumerisch: { rhythm: "breath", register: "lyrical" },
      nuechtern: { rhythm: "clean", register: "plain" },
      ironisch: { rhythm: "clean", register: "wry" },
      humorous: { rhythm: "staccato", register: "wry" }
    };
    cap1 = (s) => s ? s[0].toUpperCase() + s.slice(1) : s;
  }
});

// src/features/zeitlupe.ts
function zeitlupeStufe(name, text) {
  if (!an) return;
  const st = { name, text: String(text || ""), kurz: STUFEN_ERKLAERUNG[name] || "" };
  if (name === "Bau" && schritteLaufend.length) {
    st.schritte = schritteLaufend;
    schritteLaufend = [];
  }
  laufend.push(st);
}
var an, laufend, STUFEN_ERKLAERUNG, schritteLaufend;
var init_zeitlupe = __esm({
  "src/features/zeitlupe.ts"() {
    "use strict";
    an = false;
    laufend = [];
    STUFEN_ERKLAERUNG = {
      "Bau": "Die Struktur f\xFCllt ihre Schl\xE4ge oder der Zusammenbau zieht seine Atome \u2014 der Rohtext.",
      "Ensemble": "Mehrere Personen im Wer werden als Ensemble eingewoben.",
      "Betonung": "Die vier W kommen zu Wort: Ort, Zeit, Figur, Vorgang werden in eigenen Zeilen betont.",
      "St\xF6rung": "Der Disruptor bricht: Echo, Fragmentierung, ein Strich mitten im Text.",
      "Rhythmus": "Satzl\xE4ngen nach dem Rhythmus-Regler: Staccato teilt, Fluss verbindet.",
      "Spannung": "Regler oder Kurve: S\xE4tze werden an tragf\xE4higen Kommas geteilt, Fragmente eingestreut, am Peak verdichtet.",
      "Perspektive": "Ich, Du, Wir oder dritte Person \u2014 Pronomen und Verben folgen.",
      "Schliff": "Kongruenz, Fragezeichen, Nominativ, Formeln, Artikel, Namen \u2014 Regel f\xFCr Regel, jede aus einem Blatt.",
      "Ton": "Die Ton-Einf\xE4rbung: Einleitung, Flavor-S\xE4tze, Register.",
      "Satzl\xE4nge": "Dubletten fallen, kurze Nachbarn werden bis zur Obergrenze verbunden.",
      "Koh\xE4renz": "Themenfremde S\xE4tze fallen, Reparaturen an Br\xFCchen; der Bogen sch\xFCtzt seine W\xF6rter.",
      "Auff\xFCllen": "Auf die Ziell\xE4nge: Bilder, Wenden, Haken aus dem Preset oder Ketten aus dem Korpus \u2014 bis nichts Frisches mehr da ist.",
      "Verwandlung": "Motivverwandlungen z\xE4hlen Vorkommen im fertigen Text und tauschen beim Wiederkehren.",
      "Ende": "Der letzte kleine Schliff: Artikel, Pronomen, Komma vor der Inversion."
    };
    schritteLaufend = [];
  }
});

// src/generation/polish.ts
function ergaenzeArtikel(satz) {
  const m = satz.match(/^([A-ZÄÖÜ][a-zäöüß]{2,})(\s+)(.+)$/);
  if (!m) return satz;
  const [, nomen, luecke, rest] = m;
  if (KEIN_NOMEN.has(nomen.toLowerCase())) return satz;
  const kern = rest.split(",")[0];
  if (!extractLeadVerb(kern).verb) return satz;
  const g = NOUN_GENDER[nomen.toLowerCase()];
  if (g !== "m" && g !== "f" && g !== "n") return satz;
  if (/^(sind|waren|werden|haben|hatten|bleiben|stehen|liegen|kommen|gehen|zeigen|wirken)\b/i.test(rest)) return satz;
  const art = g === "f" ? "Die" : g === "n" ? "Das" : "Der";
  return `${art} ${nomen}${luecke}${rest}`;
}
function polishGerman(text, opts = {}) {
  const { who = "" } = opts;
  let t = String(text ?? "");
  t = t.replace(/\r\n/g, "\n").replace(/[ \t]+\n/g, "\n").replace(/ /g, " ").replace(/[ \t]{2,}/g, " ").replace(/\n{3,}/g, "\n\n").replace(/[ \t]+([,.;:!?])/g, "$1").replace(/([,.;:!?])([A-Za-zÄÖÜäöü])/g, "$1 $2").replace(/\(\s+/g, "(").replace(/\s+\)/g, ")").replace(/,+/g, ",").replace(/,\s*,/g, ", ").replace(/:\s*:/g, ":").replace(/([A-Za-zÄÖÜäöü0-9])\.\.(?=\s|$)/g, "$1\u2026").replace(/\.\.(?!\.)/g, ".").trim();
  if (who.trim()) {
    const w = who.trim().replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
    const wieder = namensErsetzer(who.trim());
    try {
      t = t.replace(new RegExp(`(?<![\\p{L}\\p{N}_])${w}(?![\\p{L}\\p{N}_])`, "giu"), wieder);
    } catch {
      t = t.replace(new RegExp(`\\b${w}\\b`, "gi"), wieder);
    }
  }
  for (let k = 0; k < 6; k++) {
    const next = t.replace(
      /\b([A-Za-zÄÖÜäöüß]{2,})[ \t]+\1\b/gi,
      (m, w) => DOPPELT_ERLAUBT.has(w.toLowerCase()) ? m : w
    );
    if (next === t) break;
    t = next;
  }
  t = t.split(/(?<=[.!?…])(\s+)/).map((teil) => /^\s+$/.test(teil) ? teil : ergaenzeArtikel(teil)).join("");
  return t.trim();
}
var DOPPELT_ERLAUBT, KEIN_NOMEN;
var init_polish = __esm({
  "src/generation/polish.ts"() {
    "use strict";
    init_nouns_data();
    init_text_utils();
    init_wordcls();
    DOPPELT_ERLAUBT = /* @__PURE__ */ new Set([
      "der",
      "die",
      "das",
      "den",
      "dem",
      "des",
      "ein",
      "eine",
      "einen",
      "einem",
      "einer",
      "eines",
      "wie",
      "so",
      "als",
      "was",
      "wer",
      "wen",
      "wem",
      "dass",
      "da",
      "und",
      "nur",
      "noch",
      "sie",
      "ihr"
    ]);
    KEIN_NOMEN = /* @__PURE__ */ new Set([
      "der",
      "die",
      "das",
      "den",
      "dem",
      "des",
      "ein",
      "eine",
      "einen",
      "einem",
      "einer",
      "eines",
      "kein",
      "keine",
      "mein",
      "dein",
      "sein",
      "ihr",
      "unser",
      "euer",
      "dieser",
      "diese",
      "dieses",
      "jeder",
      "jede",
      "jedes",
      "alle",
      "viele",
      "manche",
      "beide",
      "und",
      "aber",
      "doch",
      "denn",
      "dann",
      "dabei",
      "damit",
      "dort",
      "hier",
      "jetzt",
      "nur",
      "noch",
      "auch",
      "schon",
      "wenn",
      "weil",
      "dass",
      "als",
      "wie",
      "was",
      "wer",
      "wo",
      "warum",
      "ich",
      "du",
      "er",
      "sie",
      "es",
      "wir",
      "man",
      "jemand",
      "niemand",
      "nichts",
      "etwas",
      "alles",
      "im",
      "am",
      "auf",
      "in",
      "an",
      "mit",
      "ohne",
      "von",
      "vor",
      "nach",
      "bei",
      "zu",
      "\xFCber",
      "unter",
      "zwischen",
      "seit",
      "f\xFCr",
      "zwei",
      "drei",
      "vier",
      "f\xFCnf",
      "sechs",
      "sieben",
      "acht",
      "neun",
      "zehn",
      "hundert",
      "tausend"
    ]);
  }
});

// src/generation/shape.ts
function darfVerbinden(a, b, obergrenze) {
  if (!a || !b) return false;
  if (/[:;—–]\s*$/.test(a.replace(/[.!?…]+$/, ""))) return false;
  if (!/[.!?…]$/.test(a.trim())) return false;
  if (/[?!]$/.test(a.trim())) return false;
  if (SCHON_GEBUNDEN.test(b)) return false;
  if (/^[„»"(]/.test(b) || /[“«")]$/.test(a)) return false;
  const wa = (a.match(/[A-Za-zÄÖÜäöüß]+/g) || []).length;
  const wb = (b.match(/[A-Za-zÄÖÜäöüß]+/g) || []).length;
  if (!wa || !wb) return false;
  return wa + wb <= obergrenze;
}
function verbinde(a, b, satzartig) {
  const kopf = a.trim().replace(/[.!?…]+$/, "");
  const rest = b.trim();
  const wort = (rest.match(/^[A-Za-zÄÖÜäöüß]+/) || [""])[0].toLowerCase();
  const darfKlein = KEIN_NOMEN.has(wort) || !!VERB_CONJ[wort];
  const weiter = darfKlein ? rest.charAt(0).toLowerCase() + rest.slice(1) : rest;
  if (!satzartig) return `${kopf} \u2014 ${weiter}`;
  return `${kopf}${pick([", und ", "; ", " \u2014 "])}${weiter}`;
}
function entferneDubletten(text) {
  const kern = (x) => x.replace(/^[—–\s]+/, "").replace(/[.!?…,;:—–\s]+$/, "").replace(/\s+/g, " ").toLowerCase().trim();
  const ohne = text.split(/\n{2,}/).map((absatz) => {
    const s = splitSentences(absatz);
    if (s.length < 2) return absatz;
    const raus = [];
    for (const satz of s) {
      const k = kern(satz);
      if (k && raus.length && kern(raus[raus.length - 1]) === k) continue;
      raus.push(satz);
    }
    return raus.join(" ");
  }).join("\n\n");
  return ohne.replace(
    /([^.!?…\n]{6,})\s*(?:—|–|;|,\s+und)\s*([^.!?…\n]{6,})/g,
    (ganz, links, rechts) => kern(links) && kern(links) === kern(rechts) ? links.replace(/\s+$/, "") : ganz
  );
}
function applySatzlaenge(text, ziel) {
  if (!ziel || ziel < 6) return text;
  const w = (x) => (x.match(/[A-Za-zÄÖÜäöüß]+/g) || []).length;
  return text.split(/\n{2,}/).map((absatz) => {
    let s = splitSentences(absatz);
    if (s.length < 2) return absatz;
    const bleibtKurz = new Set(s.filter(() => chance(0.2)));
    for (let runde = 0; runde < 200; runde++) {
      let beste = -1, kuerzeste = Infinity;
      for (let i = 0; i + 1 < s.length; i++) {
        const n = w(s[i]) + w(s[i + 1]);
        if (n > ziel) continue;
        if (bleibtKurz.has(s[i]) || bleibtKurz.has(s[i + 1])) continue;
        if (!darfVerbinden(s[i], s[i + 1], ziel)) continue;
        if (n < kuerzeste) {
          kuerzeste = n;
          beste = i;
        }
      }
      if (beste < 0) break;
      const satzartig = hatFinitesVerbLeicht(s[beste]);
      s = [...s.slice(0, beste), verbinde(s[beste], s[beste + 1], satzartig), ...s.slice(beste + 2)];
    }
    return s.join(" ");
  }).join("\n\n");
}
function hatFinitesVerbLeicht(satz) {
  return (satz.match(/[a-zäöüß]{3,}/g) || []).some((w) => !!VERB_CONJ[w] || /^(ist|sind|war|waren|hat|haben|wird|werden|kann|muss|will|bleibt|steht|geht|kommt)$/.test(w));
}
var OBJEKT_KOPF_RE, SCHON_GEBUNDEN;
var init_shape = __esm({
  "src/generation/shape.ts"() {
    "use strict";
    init_text_utils();
    init_beats();
    init_verbconj_data();
    init_polish();
    init_verbconj();
    init_wordcls();
    init_verben();
    init_declension();
    OBJEKT_KOPF_RE = /^(Ich bin (?:der|die|das) [^.!?]{1,40}\.\s+[^.!?]{1,70}\.)\s*/;
    SCHON_GEBUNDEN = /^(und|doch|aber|oder|denn|dann|dabei|also|trotzdem|dennoch|sondern|nur|zuerst|zuletzt|währenddessen)/i;
  }
});

// src/generation/ctxnorm.ts
function normWho(s) {
  const t = (s || "").trim();
  if (!t) return t;
  const parts = t.split(",").map((p) => p.trim()).filter(Boolean);
  const fixed = parts.map((p, i) => {
    const m = p.match(/^([a-zäöüß][a-zäöüß-]*)\s+([A-ZÄÖÜ][A-Za-zÄÖÜäöüß-]*)$/);
    if (m && !/^(der|die|das|ein|eine|einen|einem|einer|eines|mein|meine|dein|deine|sein|seine|ihr|ihre|unser|unsere|euer|eure|kein|keine|jeder|jede|jedes|dieser|diese|dieses)$/i.test(m[1])) {
      const g = guessGender(m[2]) || (/in$/.test(m[2].toLowerCase()) ? "f" : void 0);
      if (g === "f") return `eine ${m[1]} ${m[2]}`;
      if (g === "m" || g === "n") return `ein ${m[1]} ${m[2]}`;
    }
    if (i === 0 && /^[A-ZÄÖÜa-zäöüß][a-zäöüß-]+$/.test(p) && PERSON_NOMEN.test(p) && !/^(männer|leute)$/i.test(p)) {
      const wort = cap2(p);
      const klein = p.toLowerCase();
      if (/er$/.test(klein) && PERSON_NOMEN.test(klein.slice(0, -1))) return `ein ${wort}`;
      if (/e$/.test(klein) && PERSON_NOMEN.test(klein + "r")) return `eine ${wort}`;
      const g = guessGender(wort);
      if (g === "f") return `eine ${wort}`;
      if (g === "m" || g === "n") return `ein ${wort}`;
    }
    return i === 0 || istEigenePerson(p) ? cap2(p) : low(p);
  });
  return fixed.join(", ");
}
var cap2, low;
var init_ctxnorm = __esm({
  "src/generation/ctxnorm.ts"() {
    "use strict";
    init_declension();
    init_nouns_data();
    init_nouns2_data();
    init_wordcls();
    cap2 = (s) => s ? s.charAt(0).toUpperCase() + s.slice(1) : s;
    low = (s) => s ? s.charAt(0).toLowerCase() + s.slice(1) : s;
  }
});

// src/generation/dramaturgie.ts
function loadDramaData() {
  if (bogenOverride) return bogenOverride;
  try {
    const r = localStorage.getItem(DKEY);
    return r ? JSON.parse(r) : null;
  } catch {
    return null;
  }
}
var DKEY, bogenOverride, SCHLAG_STANDARD, SCHLAG_NAMEN;
var init_dramaturgie = __esm({
  "src/generation/dramaturgie.ts"() {
    "use strict";
    init_text_utils();
    init_zeitlupe();
    init_beats();
    DKEY = "dm_dramaturgie_v1";
    bogenOverride = null;
    SCHLAG_STANDARD = ["einstieg", "hook", "regel", "mitte", "mitte2", "konflikt", "ausloeser", "wende", "zeit", "hoehepunkt", "einsatz", "schluss"];
    SCHLAG_NAMEN = /* @__PURE__ */ new Set([...SCHLAG_STANDARD]);
  }
});

// src/generation/postprocess.ts
var postprocess_exports = {};
__export(postprocess_exports, {
  beugeNachDu: () => beugeNachDu,
  coherencePass: () => coherencePass,
  coherenceRepairV2: () => coherenceRepairV2,
  formelnGlaetten: () => formelnGlaetten,
  fragezeichen: () => fragezeichen,
  istAbgeschnitten: () => istAbgeschnitten,
  istPluralFigur: () => istPluralFigur,
  kleinerArtikel: () => kleinerArtikel,
  kleinesPronomen: () => kleinesPronomen,
  kommaVorInversion: () => kommaVorInversion,
  nomenNachAdverb: () => nomenNachAdverb,
  nominativFragment: () => nominativFragment,
  pluralKongruenz: () => pluralKongruenz,
  postProcessText: () => postProcessText,
  schliesseFigurenkomma: () => schliesseFigurenkomma
});
function glaetten(t) {
  return t.replace(/[ \t]{2,}/g, " ").replace(/[ \t]+\n/g, "\n").replace(/\n{3,}/g, "\n\n").replace(/[ \t]+([,.;:!?])/g, "$1").trim();
}
function istAbgeschnitten(bare) {
  if (!bare || bare.split(/\s+/).length > 12) return false;
  if (ABGESCHNITTEN.test(bare)) return true;
  const ns = bare.match(NEBENSATZ_ENDE);
  if (ns) {
    const woerter2 = ns[2].split(/\s+/);
    if (woerter2.length <= 6 && !woerter2.some(verbMoeglich)) return true;
  }
  return NUR_OHNE_VERB.test(bare) && !hatFinitesVerb(bare);
}
function schliesseFigurenkomma(text, who) {
  const roh = (who || "").trim();
  if (!roh || !roh.includes(",")) return text;
  const figur = personKopf(splitSpeakers(normWho(roh))[0] || "");
  if (!figur.includes(",")) return text;
  try {
    const re = new RegExp("(" + escapeRegExp(figur) + ")(\\s+)(?=[a-z\xE4\xF6\xFC\xDF])", "gi");
    return text.replace(re, "$1,$2");
  } catch {
    return text;
  }
}
function coherencePass(text, input) {
  try {
    if (isLineForm(input)) return text;
    const t = String(text || "").replace(/\.\s*\.+/g, ".");
    const paras = t.split(/\n{2,}/);
    const freq = {};
    coherenceWords(t).forEach((w) => {
      freq[w] = (freq[w] || 0) + 1;
    });
    const motif = new Set(Object.keys(freq).filter((w) => freq[w] >= 2));
    [input?.who, input?.where, input?.what].forEach((s) => coherenceWords(s || "").forEach((w) => motif.add(w)));
    const bogen = loadDramaData();
    if (bogen) {
      for (const feld of [
        bogen.einstieg,
        bogen.mitte,
        bogen.hoehepunkt,
        bogen.ausloeser,
        bogen.veraenderungen,
        bogen.konflikte,
        bogen.zeitanomalien,
        bogen.regeln
      ]) {
        for (const satz of feld || []) coherenceWords(satz).forEach((w) => motif.add(w));
      }
    }
    const allowBreaks = input?.disruptor === "on";
    const maxRemove = Math.max(1, Math.floor(splitSentences(t).length * 0.25));
    let removed = 0;
    const outParas = [];
    paras.forEach((p, pi) => {
      const sents = splitSentences(p);
      const kept = sents.filter((s, si) => {
        const bare = s.trim().replace(/["»«)\]]+$/, "").replace(/[.!?…]+$/, "").trim();
        if (istAbgeschnitten(bare)) {
          removed++;
          return false;
        }
        if (removed >= maxRemove) return true;
        const late = pi === paras.length - 1 && sents.length >= 4 && si >= Math.floor(sents.length / 2);
        if (late) {
          const cw = coherenceWords(s);
          if (cw.length >= 2 && !cw.some((w) => motif.has(w))) {
            if (allowBreaks && Math.random() < 0.5) return true;
            removed++;
            return false;
          }
        }
        return true;
      });
      if (kept.length) outParas.push(kept.join(" "));
    });
    const result = outParas.join("\n\n").trim();
    return result.length >= 60 ? result : text;
  } catch {
    return text;
  }
}
function coherenceRepairV2(t, input) {
  t = String(t ?? "");
  t = t.replace(/\(\s*[A-ZÄÖÜ][\wäöüß-]{2,}\s*\)/g, " ");
  t = t.replace(/,\s*([.!?…])/g, "$1");
  t = t.replace(/([.!?…])\s*,/g, ",");
  t = t.replace(/\s*,\s*,\s*/g, ", ");
  t = t.replace(/„\s+/g, "\u201E").replace(/\s+"/g, '"');
  t = t.replace(/([.!?…])\s*\1+/g, "$1");
  if ((t.match(/"/g) || []).length % 2 === 1) t = t.replace(/"/g, "");
  {
    const o = (t.match(/„/g) || []).length, c = (t.match(/[“”]/g) || []).length;
    if (o !== c) t = t.replace(/[„“”]/g, "");
  }
  t = t.replace(/\bich'(?=\s)/gi, "meine").replace(/\bdu'(?=\s)/gi, "deine").replace(/\bwir'(?=\s)/gi, "unsere").replace(/\ber'(?=\s)/gi, "seine").replace(/\bsie'(?=\s)/gi, "ihre").replace(/\bes'(?=\s)/gi, "seine");
  t = t.replace(/(:\s+)([a-zäöüß][^.!?…]*)/g, (m, p1, rest) => looksLikeFullClause(null, rest) || /^(warum|weshalb|wieso|wie|was|wer|wen|wem|wann|wo|wohin|woher|ob)\b/i.test(rest) ? p1 + rest.charAt(0).toUpperCase() + rest.slice(1) : m);
  String(input?.who || "").split(/[,;]/).map((x) => x.trim()).filter(Boolean).forEach((n) => {
    const esc = escapeRegExp(n);
    const wieder = namensErsetzer(n);
    try {
      t = t.replace(new RegExp("\\b(" + esc + ")(s|')?\\b", "giu"), (_m, kern, suf) => wieder(kern) + (suf || ""));
    } catch {
    }
  });
  if (isLineForm(input)) {
    return glaetten(t);
  }
  const ABS = "\u241E";
  t = t.replace(/[ \t]*\n{2,}[ \t]*/g, " " + ABS + " ");
  const sents = t.split(/(?<=[.!?…])\s+/).filter(Boolean);
  const kept = [];
  for (let s of sents) {
    const bare = s.trim().replace(/["“”»«]+$/, "").replace(/[.!?…]+$/, "").trim();
    const opens = (s.match(/„/g) || []).length, closes = (s.match(/[“”»]/g) || []).length;
    if (/\bSatz\s+„/.test(s) && opens > closes) continue;
    if (/,\s+(die|der|das|dem|den|des)\s+(die|der|das|dem|den|des)\s+\p{L}+$/iu.test(bare)) continue;
    if (opens > closes) s = s.replace(/„\s*/g, "");
    s = beugeNachDu(s);
    const _st = s.trim();
    if (kept.length && kept[kept.length - 1] === _st) continue;
    kept.push(_st);
  }
  t = kept.join(" ").replace(/\s*\u241E\s*/g, "\n\n");
  t = t.replace(/(\bich und [A-ZÄÖÜ][\wäöüß]+[^.!?…]*?)\bsie sich\b/gu, "$1wir uns");
  t = t.replace(/([A-ZÄÖÜ][\wäöüß]+ und ich[^.!?…]*?)\bsie sich\b/gu, "$1wir uns");
  const CONN = [/\bDann kippt es\b/gi, /\bDabei:\s*plötzlich\b/gi, /\bUnd immer wieder\b/gi, /\bAm Ende bleibt klar\b/gi];
  CONN.forEach((re) => {
    let n = 0;
    t = t.replace(re, (m) => ++n > 1 ? "" : m);
  });
  t = glaetten(t).replace(/„[ \t]+/g, "\u201E");
  return t;
}
function kleinerArtikel(t) {
  return (t || "").replace(/[ \t]+([,;.!?])/g, "$1").replace(
    /([^\s.!?…:„"»(])([ \t]+)(Ein|Eine|Einen|Einem|Einer|Eines|Der|Die|Das|Den|Dem|Des)\b/g,
    (_m, vor, sp, w) => vor + sp + w.charAt(0).toLowerCase() + w.slice(1)
  );
}
function beugeNachDu(s) {
  const di = s.search(/\bdu\b/i);
  if (di < 0) return s;
  const head = s.slice(0, di);
  let tail = s.slice(di);
  const wechsel = tail.search(/[,;:—–(]|\b(?:aber|und|doch|denn|sondern|oder|während|als)\s+(?:er|sie|es|man|wir|ihr|der|die|das|ein|eine|etwas|nichts|jemand|niemand)\b/i);
  let rest = "";
  if (wechsel > 0) {
    rest = tail.slice(wechsel);
    tail = tail.slice(0, wechsel);
  }
  DU.forEach(([re, rep]) => {
    tail = tail.replace(re, rep);
  });
  return head + tail + rest;
}
function kommaVorInversion(t) {
  return (t || "").replace(NEBENSATZ2, "$1, $2 $3");
}
function istPluralFigur(who) {
  const w = (who || "").trim();
  if (!w) return false;
  if (/^(zwei|drei|vier|fünf|sechs|sieben|acht|neun|zehn|beide|alle|viele|einige|mehrere|manche|zwölf|hundert)\b/i.test(w)) return true;
  if (/\b(und|&)\b/.test(w) && !/,/.test(w)) return true;
  if (/^[A-ZÄÖÜ][a-zäöüß]+(en|innen|leute|kinder|eltern)$/.test(w) && !/(chen|lein)$/.test(w)) return true;
  const m = w.match(/^die\s+([A-ZÄÖÜ][a-zäöüß-]+)$/i);
  if (m) {
    const n = m[1].toLowerCase();
    if (/(innen|leute|kinder|eltern|geschwister|männer|frauen)$/.test(n)) return true;
    return /en$/.test(n) && !/(chen|lein)$/.test(n);
  }
  return false;
}
function pluralKongruenz(t, who) {
  const name = (who || "").trim();
  if (!name || !istPluralFigur(name)) return t;
  const esc = escapeRegExp(name);
  const beuge = (v) => {
    const p = beugeVerb(v, "wir");
    return p && p !== v ? p : v;
  };
  let out = t.replace(new RegExp(`(\\b${esc})\\s+([a-z\xE4\xF6\xFC\xDF]+t)\\b`, "giu"), (m, n, v) => istVerbform(v) ? `${n} ${beuge(v)}` : m);
  out = out.replace(new RegExp(`\\b([a-z\xE4\xF6\xFC\xDF]+t)\\s+(${esc})\\b`, "giu"), (m, v, n) => istVerbform(v) ? `${beuge(v)} ${n}` : m);
  return out;
}
function nomenNachAdverb(t) {
  return (t || "").replace(
    /(^|[.!?…]\s+|\n)(Dann|Und dann|Nur|Doch|Jetzt|Plötzlich|Danach|Zuletzt)\s+([a-zäöüß]{3,}),/g,
    (m, vor, adv, w) => guessGender(w) ? `${vor}${adv} ${w.charAt(0).toUpperCase()}${w.slice(1)},` : m
  );
}
function nominativFragment(t) {
  return (t || "").replace(
    /(^|[.!?…]\s+|\n)(Einen|Den|Einem|Dem)\s+([A-ZÄÖÜ][a-zäöüß]+)([^.!?…\n]*[.!?…])/g,
    (m, vor, art, nomen, rest) => {
      if (hatFinitesVerb(`${art} ${nomen}${rest}`)) return m;
      if (/\b(ein|eine|einen|einem|einer|der|die|das|den|dem)\b/i.test(rest)) return m;
      if (art === "Einen") return `${vor}Ein ${nomen}${rest}`;
      if (art === "Den") return `${vor}Der ${nomen}${rest}`;
      const g = guessGender(nomen);
      if (art === "Einem") return g === "m" || g === "n" ? `${vor}Ein ${nomen}${rest}` : m;
      return g === "m" ? `${vor}Der ${nomen}${rest}` : g === "n" ? `${vor}Das ${nomen}${rest}` : m;
    }
  );
}
function formelnGlaetten(t) {
  return (t || "").replace(/\s+—\s+(dann|danach|plötzlich)\s*([;.!?])/gi, "$2").replace(/\b(an|auf|über|von|in|mit|nach) (wie|als) (der|die|das|den|dem|des|ein|eine|einen|einem|einer)\b/g, "$1 $3").replace(/\b(Dann|Und dann|Plötzlich|Danach)\s+—\s+(dann|plötzlich|danach),/gi, (_m, a) => `${a},`).replace(/([.!?…])\s+—\s+([a-zäöüß])/g, (_m, p, c) => `${p} ${c.toUpperCase()}`);
}
function kleinesPronomen(t) {
  return (t || "").replace(/([;—–][ \t]+)(Ich|Er|Es|Wir|Du|Man|Ihr|Angeblich|Natürlich|Vielleicht|Jedenfalls|Immerhin|Trotzdem|Allerdings|Jetzt|Dann|Hier|Dort|Aber|Und|Doch|Oder|Nur|Noch|Schon|Mittags|Morgens|Abends|Nachts|Heute|Gestern|Morgen|Später|Manchmal|Damals|Irgendwann|Vormittags|Nachmittags|Fast|Beinahe|Kaum|Knapp|Bald|Erst|Zuletzt|Endlich)\b/g, (_m, sp, w) => sp + w.toLowerCase()).replace(
    /(,[ \t]+)(Wo|Wenn|Als|Weil|Dass|Obwohl|Während|Nachdem|Bevor|Sobald|Solange|Damit|Ob|Der|Die|Das|Dem|Den|Deren|Dessen)\b(?=\s)/g,
    (_m, sp, w) => sp + w.charAt(0).toLowerCase() + w.slice(1)
  );
}
function fragezeichen(t) {
  return (t || "").replace(
    /(^|[.!?…:]\s+|\n)(Wo|Was|Wer|Wie|Warum|Wann|Wohin|Woher|Weshalb|Wieso|Wem|Wen)\s+(ist|sind|war|waren|hat|haben|wird|werden|kommt|bleibt|will|kann|soll|darf|muss|geht|steht|bist|bin|seid|weiß|wissen)\b([^.!?…\n]{0,50})\./g,
    (m, vor, fw, v, rest) => rest.split(/\s+/).filter(Boolean).length <= 6 && !rest.includes(",") ? `${vor}${fw} ${v}${rest}?` : m
  );
}
function postProcessText(txt, input) {
  let t = (txt ?? "").toString();
  t = t.replace(/(^|[.!?…]\s+)([a-zäöü])/g, (_m, p1, p2) => p1 + p2.toUpperCase());
  t = t.replace(/\b(und|oder|aber|denn|sondern|sowie|nur|auch|selbst|sogar|erst|schon|noch|doch|nun|dann)(\s+)(die|der|das|den|dem|des|ein|eine|einen|einem|einer|sie|er|es|man|wir|ich|du|ihr|ihre|sein|seine|dann|dabei|dadurch|vielleicht|plötzlich)\b/gi, (_m, c, sp, w) => c + sp + w.charAt(0).toLowerCase() + w.slice(1));
  const z = (was, f) => {
    const v = t;
    t = f(t);
    zaehleWennAnders(was, v, t);
  };
  z("schliff_kleinesPronomen", kleinesPronomen);
  z("schliff_kommaVorInversion", kommaVorInversion);
  z("schliff_fragezeichen", fragezeichen);
  z("schliff_nomenNachAdverb", nomenNachAdverb);
  z("schliff_nominativFragment", nominativFragment);
  z("schliff_formelnGlaetten", formelnGlaetten);
  z("schliff_kleinerArtikel", kleinerArtikel);
  const name = (input?.who ?? "").toString().trim();
  if (name) {
    const esc = escapeRegExp(name);
    const wieder = namensErsetzer(name);
    try {
      t = t.replace(new RegExp(`(?<![\\p{L}\\p{N}_])${esc}(?![\\p{L}\\p{N}_])`, "giu"), wieder);
    } catch {
      t = t.replace(new RegExp(`\\b${esc}\\b`, "gi"), wieder);
    }
  }
  z("schliff_pluralKongruenz", (x) => pluralKongruenz(x, name));
  zeitlupeStufe("Schliff", t);
  if (!isLineForm(input) && input?.tone && TONE_DATA[input.tone]) {
    const td = TONE_DATA[input.tone];
    if (td.opener.length) {
      const kopf = t.match(OBJEKT_KOPF_RE);
      t = kopf ? `${kopf[1]} ${pick(td.opener)} ${t.slice(kopf[0].length)}` : `${pick(td.opener)} ${t}`;
    }
    if (td.flavor.length) {
      const wc2 = t.trim().split(/\s+/).filter(Boolean).length;
      const f = (loadKnobs().ton || 0) / 100;
      const inserts = Math.max(0, Math.min(7, Math.round(Math.max(1, Math.round(wc2 / 90)) * f)));
      const vorrat = [...td.flavor].sort(() => Math.random() - 0.5).filter((f2) => !t.toLowerCase().includes(f2.toLowerCase().replace(/[.!?…]+$/, "")));
      for (let i = 0; i < inserts && i < vorrat.length; i++) t = insertToneFlavor(t, vorrat[i]);
    }
    t = applyToneRegister(t, input.tone);
    zeitlupeStufe("Ton", t);
  }
  if (!isLineForm(input)) t = entferneDubletten(t);
  if (!isLineForm(input)) {
    t = applySatzlaenge(t, loadKnobs().satzlaenge);
    zeitlupeStufe("Satzl\xE4nge", t);
  }
  if (!isLineForm(input)) t = entferneDubletten(t);
  z("schliff_polishGerman", (x) => polishGerman(x, { who: name }));
  z("schliff_figurenkomma", (x) => schliesseFigurenkomma(x, input?.who));
  z("kohaerenzPass", (x) => coherencePass(x, input));
  {
    const v = t;
    t = coherenceRepairV2(t, input);
    if (v !== t) {
      const vs = new Set(t.split(/(?<=[.!?…])\s+/).map((x) => x.trim()));
      const gefallen = v.split(/(?<=[.!?…])\s+/).map((x) => x.trim()).filter((x) => x && !vs.has(x) && !t.includes(x.slice(0, 30)));
      if (gefallen.length) for (const g of gefallen) zaehle("kohaerenzGefallen", g);
      else zaehleWennAnders("kohaerenzRepariert", v, t);
    }
  }
  zeitlupeStufe("Koh\xE4renz", t);
  t = t.replace(/(^|[.!?…]\s+)([a-zäöü])/g, (_m, p1, p2) => p1 + p2.toUpperCase());
  t = t.replace(/\b(und|oder|aber|denn|sondern|sowie|nur|auch|selbst|sogar|erst|schon|noch|doch|nun|dann)(\s+)(die|der|das|den|dem|des|ein|eine|einen|einem|einer|sie|er|es|man|wir|ich|du|ihr|ihre|sein|seine|dann|dabei|dadurch|vielleicht|plötzlich)\b/gi, (_m, c, sp, w) => c + sp + w.charAt(0).toLowerCase() + w.slice(1));
  return t.trim();
}
var LINE_FORMS, isLineForm, ABGESCHNITTEN, NUR_OHNE_VERB, NEBENSATZ_ENDE, FUNKTION2, verbMoeglich, DU, NEBENSATZ2;
var init_postprocess = __esm({
  "src/generation/postprocess.ts"() {
    "use strict";
    init_text_utils();
    init_verben();
    init_wordcls();
    init_text_utils();
    init_nlp();
    init_tone_data();
    init_knobs();
    init_tone_shape();
    init_zeitlupe();
    init_waechterStatistik();
    init_beats();
    init_polish();
    init_shape();
    init_derive();
    init_declension();
    init_wordcls();
    init_ctxnorm();
    init_dramaturgie();
    LINE_FORMS = /* @__PURE__ */ new Set(["script", "video", "strang", "reim", "haiku", "poem"]);
    isLineForm = (input) => !!input && !!input.form && LINE_FORMS.has(input.form);
    ABGESCHNITTEN = /(^|\s)(eine|einem|einen|einer|eines|der|die|dem|den|des|und|oder|aber|wie|als|im|am|bei|für|ohne)$/i;
    NUR_OHNE_VERB = /(^|\s)(mit|an|auf|zu|vor|nach|aus|ist|sind|wird|ein|das)$/i;
    NEBENSATZ_ENDE = /,\s+(der|die|das|dem|den|deren|dessen)\s+([a-zäöüß][^,;:]*)$/;
    FUNKTION2 = /* @__PURE__ */ new Set([
      "es",
      "er",
      "sie",
      "ich",
      "du",
      "wir",
      "ihr",
      "man",
      "sich",
      "mich",
      "dich",
      "uns",
      "euch",
      "ihn",
      "ihm",
      "mir",
      "dir",
      "der",
      "die",
      "das",
      "dem",
      "den",
      "des",
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
      "mein",
      "meine",
      "meinen",
      "meinem",
      "sein",
      "seine",
      "seinen",
      "seinem",
      "ihre",
      "ihren",
      "ihrem",
      "dein",
      "deine",
      "deinen",
      "deinem",
      "unser",
      "unsere",
      "in",
      "im",
      "an",
      "am",
      "auf",
      "aus",
      "bei",
      "mit",
      "nach",
      "von",
      "vom",
      "zu",
      "zum",
      "zur",
      "vor",
      "\xFCber",
      "unter",
      "hinter",
      "neben",
      "zwischen",
      "durch",
      "f\xFCr",
      "ohne",
      "um",
      "gegen",
      "seit",
      "bis",
      "und",
      "oder",
      "aber",
      "noch",
      "schon",
      "mehr",
      "auch",
      "nur",
      "so",
      "da",
      "hier",
      "dort",
      "wo",
      "wie",
      "als",
      "wenn",
      "dann",
      "immer",
      "nie",
      "wieder",
      "heute",
      "gestern",
      "morgen",
      "zu",
      "sehr",
      "ganz",
      "etwas",
      "nichts",
      "alles",
      "viel",
      "wenig",
      "zwei",
      "drei",
      "vier",
      "f\xFCnf",
      "einmal",
      "zweimal",
      "l\xE4ngst",
      "gerade",
      "eben",
      "erst",
      "kaum",
      "fast",
      "genau",
      "pl\xF6tzlich",
      "jemand",
      "niemand",
      "jeder",
      "jede",
      "jedes",
      "alle",
      "beide",
      "zusammen",
      "allein",
      "anders",
      "weiter",
      "zur\xFCck",
      "hinauf",
      "hinab",
      "hinaus",
      "hinein",
      "heraus",
      "herein",
      "oben",
      "unten",
      "innen",
      "au\xDFen",
      "links",
      "rechts",
      "vorn",
      "hinten",
      "drinnen",
      "drau\xDFen",
      "fort",
      "weg",
      "los"
    ]);
    verbMoeglich = (w) => /^[a-zäöüß]{2,}$/.test(w) && !FUNKTION2.has(w) && !KEIN_VERB.has(w) && !/(em|er|es)$/.test(w);
    DU = [
      [/\btritt\b/g, "trittst"],
      [/\bhält\b/g, "h\xE4ltst"],
      [/\bnimmt\b/g, "nimmst"],
      [/\bsieht\b/g, "siehst"],
      [/\bgeht\b/g, "gehst"],
      [/\bsteht\b/g, "stehst"],
      [/\bträgt\b/g, "tr\xE4gst"],
      [/\bführt\b/g, "f\xFChrst"],
      [/\bfindet\b/g, "findest"],
      [/\bsucht\b/g, "suchst"],
      [/\bkommt\b/g, "kommst"],
      [/\bbricht\b/g, "brichst"]
    ];
    NEBENSATZ2 = /(,\s+(?:wo|wohin|woher|wenn|als|weil|dass|obwohl|während|nachdem|bevor|sobald|solange|der|die|das|dem|den|deren|dessen)\s[^,.;:!?—–]{3,60}?[a-zäöüß])\s+(bemerk(?:t|e|st|en)|sieht|sehe|siehst|sehen|find(?:et|e|est|en)|entdeck(?:t|e|st|en)|erkenn(?:t|e|st|en)|trifft|treffe|triffst|treffen|hört|höre|hörst|hören|wartet|warte|wartest|warten|steht|stehe|stehst|stehen|beginnt|beginne|beginnst|beginnen|verliert|verliere|verlierst|verlieren)\s+(ich|du|wir|er|sie|es|man|[A-ZÄÖÜ][a-zäöüß]+)\b/g;
  }
});

// test/waechterstat.ts
var import_jsdom = require("jsdom");
var import_fs = require("fs");
init_waechterStatistik();
init_satzwaechter();
init_coherence();
init_atomisieren();
var dom = new import_jsdom.JSDOM("<!doctype html><html><body></body></html>", { url: "https://x.test/" });
globalThis.localStorage = dom.window.localStorage;
globalThis.window = dom.window;
var fails = [];
var geprueft = 0;
var bestanden = 0;
var ist = (name, wert, soll) => {
  geprueft++;
  if (wert === soll) bestanden++;
  else fails.push(`${name}: \u201E${String(wert)}\u201C \u2014 erwartet \u201E${String(soll)}\u201C`);
};
var wahr = (name, b, zusatz = "") => ist(name + (zusatz ? ` (${zusatz})` : ""), b, true);
statistikZuruecksetzen();
ist("frisch: nichts gez\xE4hlt", statistikKurz().verworfen + statistikKurz().angenommen, 0);
ist("Regel 1 erkannt", pruefeSatz("Eine bleiche Boje \xFCber dem Wasser und"), 1);
ist("Regel 3 erkannt", pruefeSatz("Ein Spiegelbild zeigt den Ritter als das, was nach dem Sinn und wird ausgeschlossen."), 3);
ist("Regel 6 erkannt", pruefeSatz("Gerade wenn alles verloren scheint, kommt das Licht wird heller."), 6);
ist("plausibel = 0", pruefeSatz("Der Morgen liegt grau \xFCber der Weide."), 0);
stueckPlausibel("Der Morgen liegt grau. Irgendwo wie W\xE4rme ohne Ursache fest.");
stueckPlausibel("Der Morgen liegt grau \xFCber der Weide.");
{
  const st = ladeStatistik();
  ist("Regel 2 gez\xE4hlt", st.zaehler.regel2, 1);
  wahr("mit Beispiel", (st.beispiele.regel2 || [])[0] === "Irgendwo wie W\xE4rme ohne Ursache fest.");
  ist("durchgelassen gez\xE4hlt", st.zaehler.angenommen, 1);
}
praesensUmschreiben("Das Herz schlug mir bis zum Hals.");
atomisiere("Die F\xE4hre erreicht das Ufer schr\xE4g und zu sp\xE4t, und niemand fehlt an diesem Abend am Steg", 14);
atomisiere("Ein Sturm bringt in drei Tagen den Regen eines ganzen Jahres \xFCber das Tal und die H\xF6fe dar\xFCber", 14);
{
  const st = ladeStatistik();
  ist("umgeschrieben gez\xE4hlt", st.zaehler.umgeschrieben, 1);
  wahr("mit Vorher \u2192 Nachher", /schlug .* → .*schlägt/.test((st.beispiele.umgeschrieben || [])[0] || ""));
  ist("zerlegt gez\xE4hlt", st.zaehler.atomZerlegt, 1);
  ist("zu lang ganz gelassen gez\xE4hlt", st.zaehler.atomGanzZuLang, 1);
}
for (let i = 0; i < 8; i++) zaehle("regel4", `Beispiel ${i}`);
{
  const k = statistikKurz();
  ist("h\xE4ufigste Regel", k.haeufigste, "regel4");
  ist("h\xF6chstens f\xFCnf Beispiele je Z\xE4hler", (ladeStatistik().beispiele.regel4 || []).length, 5);
  wahr("Quote zwischen 0 und 1", k.quote > 0 && k.quote < 1);
}
statistikZuruecksetzen();
ist("zur\xFCckgesetzt", statistikKurz().verworfen, 0);
{
  const sp = (0, import_fs.readFileSync)("src/features/schaltplan.ts", "utf8");
  wahr("Schaltplan hat den Knoten Satz-W\xE4chter", /knoten\("waechter", 1, "Satz-Wächter"/.test(sp));
  const dg = (0, import_fs.readFileSync)("src/ui/diagnoseView.ts", "utf8");
  wahr("Diagnose hat die Tafel mit Beispielen und R\xFCcksetzknopf", /Wächter-Statistik — was die Regeln tun/.test(dg) && /Zähler zurücksetzen/.test(dg));
}
{
  const { EBENE2: EBENE22, zaehleWennAnders: zaehleWennAnders2 } = (init_waechterStatistik(), __toCommonJS(waechterStatistik_exports));
  const { isSaneMarkov: isSaneMarkov2 } = (init_corpus(), __toCommonJS(corpus_exports));
  const { postProcessText: postProcessText2 } = (init_postprocess(), __toCommonJS(postprocess_exports));
  statistikZuruecksetzen();
  wahr("Ebene 2 kennt \xFCber zwanzig W\xE4chter", EBENE22.size >= 20, String(EBENE22.size));
  wahr("jeder hat einen Namen", [...EBENE22].every((z) => !!ZAEHLER_NAMEN[z]));
  isSaneMarkov2("zu kurz.");
  isSaneMarkov2("Und dann \u2014");
  ist("Markov-Sanity z\xE4hlt je Grund", (ladeStatistik().zaehler["markovKurz"] || 0) >= 1, true);
  zaehleWennAnders2("schliff_fragezeichen", "Wer wei\xDF das.", "Wer wei\xDF das?");
  zaehleWennAnders2("schliff_fragezeichen", "Gleich.", "Gleich.");
  ist("eine Regel z\xE4hlt nur, wenn sie ge\xE4ndert hat", ladeStatistik().zaehler["schliff_fragezeichen"], 1);
  wahr("mit Vorher \u2192 Nachher", /Wer weiß das\. → Wer weiß das\?/.test((ladeStatistik().beispiele["schliff_fragezeichen"] || [])[0] || ""));
  postProcessText2("Der Bote geht \u2014 Dann bleibt er stehen. Was z\xE4hlt, ist der Weg. Ein Satz \xFCber Quantenphysik und Steuerrecht.", { tone: "neutral", form: "prose", who: "Der Bote" });
  wahr("der Schliff hat im Bau gez\xE4hlt", Object.keys(ladeStatistik().zaehler).some((k) => k.startsWith("schliff_")));
  const dg = (0, import_fs.readFileSync)("src/ui/diagnoseView.ts", "utf8");
  wahr("die Diagnose hat den Schalter \u201Eerweitert\u201C und zeigt Ebene 2 dahinter", /id: "diag-waechter-erweitert"/.test(dg) && /dm_waechter_erweitert_v1/.test(dg) && /Zweite Ebene — Schliff, Kohärenz, Markov-Sanity, Füller, Korpus/.test(dg));
  statistikZuruecksetzen();
}
console.log(`Pr\xFCfstand W\xE4chter-Statistik \u2014 ${geprueft} Pr\xFCfungen, ${bestanden} bestanden`);
var proc = globalThis;
if (fails.length) {
  console.error(`
\u274C W\xE4chter-Statistik: ${fails.length} Fehler:`);
  fails.forEach((f) => console.error("  - " + f));
  proc.process?.exit(1);
} else {
  console.log(`
\u2705 W\xE4chter-Statistik: alle ${geprueft} Pr\xFCfungen bestanden.`);
}
