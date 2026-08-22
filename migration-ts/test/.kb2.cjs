// src/text-utils.ts
var HAENGT_IN_DER_LUFT = /(^|\s)(ein|eine|einem|einen|einer|eines|der|die|das|dem|den|des|und|oder|aber|wie|als|im|am|beim|zum|zur|vom|von|für|ohne|durch|gegen|bei|seit|während|wegen|trotz|dass|weil|denn|sondern|sowie|bzw|etwa|sehr|dessen|deren|welche[rsmn]?)$/i;
function kuerzeAmBruch(text) {
  let t2 = (text || "").replace(/\s*…\s*$/, "").replace(/\s*[.,;:–—-]+\s*$/, "").trim();
  for (let i = 0; i < 8 && t2 && HAENGT_IN_DER_LUFT.test(t2); i++) {
    const komma = t2.lastIndexOf(",");
    if (komma >= 12) {
      t2 = t2.slice(0, komma).replace(/\s*[.,;:–—-]+\s*$/, "").trim();
      continue;
    }
    const ohneWort = t2.replace(/\s+\S+$/, "").replace(/\s*[.,;:–—-]+\s*$/, "").trim();
    if (!ohneWort || ohneWort === t2) {
      t2 = "";
      break;
    }
    t2 = ohneWort;
  }
  {
    const komma = t2.lastIndexOf(",");
    if (komma >= 12) {
      const schwanz2 = t2.slice(komma + 1).trim();
      const relativ = /^(der|die|das|dem|den|dessen|deren|welche[rsmn]?|wo|worin|woran)\s/i.test(schwanz2);
      const hatVerb = /\b[a-zäöüß]{2,}(?:t|te|en|st|et)\b/.test(schwanz2);
      const endetAufNomen = /[A-ZÄÖÜ][a-zäöüß]+$/.test(schwanz2);
      if (relativ && endetAufNomen && !hatVerb) t2 = t2.slice(0, komma).trim();
    }
  }
  for (let i = 0; i < 4; i++) {
    const m = t2.match(/(\S+)\s+(an|auf|aus|ein|mit|nach|vor|zu|über|unter|um|ab|bei|los|weg|hin|her)$/i);
    if (!m || !/^[A-ZÄÖÜ]/.test(m[1])) break;
    t2 = t2.replace(/\s+\S+$/, "").trim();
  }
  return HAENGT_IN_DER_LUFT.test(t2) ? "" : t2;
}

// ../../kb2.ts
var t = "Rochus zu Lynar geboren, der insbesondere durch Bauten im Dienst deutscher F\xFCrsten";
console.log(JSON.stringify(kuerzeAmBruch(t)));
var schwanz = t.slice(t.lastIndexOf(",") + 1).trim();
console.log("schwanz:", JSON.stringify(schwanz));
console.log("relativ:", /^(der|die|das|dem|den|dessen|deren|welche[rsmn]?|wo|worin|woran)\s/i.test(schwanz));
console.log("hatVerb:", /\b[a-zäöüß]{2,}(?:t|te|en|st|et)\b/.test(schwanz), (schwanz.match(/\b[a-zäöüß]{2,}(?:t|te|en|st|et)\b/) || [])[0]);
console.log("endetAufNomen:", /[A-ZÄÖÜ][a-zäöüß]+$/.test(schwanz));
