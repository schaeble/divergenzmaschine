// src/text-utils.ts
var HAENGT_IN_DER_LUFT = /(^|\s)(ein|eine|einem|einen|einer|eines|der|die|das|dem|den|des|und|oder|aber|wie|als|im|am|beim|zum|zur|vom|von|für|ohne|durch|gegen|bei|seit|während|wegen|trotz|dass|weil|denn|sondern|sowie|bzw|etwa|sehr|dessen|deren|welche[rsmn]?)$/i;
function kuerzeAmBruch(text) {
  let t = (text || "").replace(/\s*…\s*$/, "").replace(/\s*[.,;:–—-]+\s*$/, "").trim();
  for (let i = 0; i < 8 && t && HAENGT_IN_DER_LUFT.test(t); i++) {
    const komma = t.lastIndexOf(",");
    if (komma >= 12) {
      t = t.slice(0, komma).replace(/\s*[.,;:–—-]+\s*$/, "").trim();
      continue;
    }
    const ohneWort = t.replace(/\s+\S+$/, "").replace(/\s*[.,;:–—-]+\s*$/, "").trim();
    if (!ohneWort || ohneWort === t) {
      t = "";
      break;
    }
    t = ohneWort;
  }
  return HAENGT_IN_DER_LUFT.test(t) ? "" : t;
}

// src/features/wikisammler.ts
function entHtml(s) {
  return (s || "").replace(/<[^>]*>/g, " ").replace(/&nbsp;/g, " ").replace(/&amp;/g, "&").replace(/&lt;/g, "<").replace(/&gt;/g, ">").replace(/&quot;/g, '"').replace(/&#39;/g, "'").replace(/\s+/g, " ").trim();
}
function wasPhrase(roh, max = 170) {
  let t = entHtml(roh);
  t = t.replace(/^\d{1,4}\s*[:–-]\s*/, "");
  t = t.replace(/\s*\(\s*\*[^)]*\)/, "");
  if (t.length > max) {
    const teil = t.slice(0, max);
    const p = Math.max(teil.lastIndexOf(". "), teil.lastIndexOf("; "));
    if (p > 40) t = teil.slice(0, p);
    else {
      const komma = teil.lastIndexOf(",");
      t = komma > 40 ? teil.slice(0, komma) : teil.replace(/\s+\S*$/, "") + " \u2026";
    }
  }
  return kuerzeAmBruch(t.replace(/\s*[.]\s*$/, "").trim());
}

// ../../kbm.ts
var st = {};
globalThis.localStorage = { getItem: (k) => st[k] ?? null, setItem: (k, v) => {
  st[k] = String(v);
}, removeItem: (k) => {
  delete st[k];
} };
globalThis.window = { localStorage: globalThis.localStorage };
var PROBEN = [
  "In der Toskana wird der italienische Festungsbaumeister und Milit\xE4r Rochus zu Lynar geboren, der insbesondere durch Bauten im Dienst deutscher F\xFCrsten wie der Markgrafen von Brandenburg bekannt wurde.",
  "Der deutsche Leichtathlet Owen Ansah gewinnt bei den Europameisterschaften in Rom \xFCber 100 Meter die Bronzemedaille und wird damit der erste deutsche Sprinter seit vielen Jahren auf dem Podest.",
  "Die Schriftstellerin Marie von Ebner-Eschenbach wird geboren.",
  "Bei einem schweren Erdbeben in der Region Kahramanmara\u015F kommen nach offiziellen Angaben mehrere zehntausend Menschen ums Leben, zahlreiche Geb\xE4ude st\xFCrzen ein und die Rettungsarbeiten dauern wochenlang an.",
  "Das Bundesverfassungsgericht entscheidet, dass die Regelung mit dem Grundgesetz unvereinbar ist und bis zum Ende des Jahres durch den Gesetzgeber neu gefasst werden muss, weil sie gegen den Gleichheitssatz verst\xF6\xDFt."
];
var HAENGT = /(^|\s)(ein|eine|einem|einen|einer|eines|der|die|das|dem|den|des|und|oder|aber|wie|als|im|am|bei|für|ohne|mit|an|auf|zu|von|vom|aus|nach|vor|über|unter|durch|gegen|seit|um|dass|weil|denn)$/i;
var bruch = 0;
for (const p of PROBEN) {
  const r = wasPhrase(p);
  const kaputt = HAENGT.test(r.replace(/\s*…$/, "").trim());
  if (kaputt) bruch++;
  console.log((kaputt ? "\u2717 " : "\u2713 ") + JSON.stringify(r));
}
console.log("\nabgeschnittene Reste:", bruch, "von", PROBEN.length);
