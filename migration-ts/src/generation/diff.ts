// Wort-Diff zweier Texte (LCS) für die Änderungsansicht der Werkstatt.
export type DiffOp = { type: "same" | "del" | "ins"; text: string };

// In Wort- und Whitespace-Token zerlegen (Zeilenumbrüche bleiben erhalten).
function tokenize(s: string): string[] {
  return (s || "").match(/\s+|[^\s]+/g) || [];
}

/** Wort-genauer Diff von a → b. Gelöschtes = del, Neues = ins. */
export function diffWords(a: string, b: string): DiffOp[] {
  const A = tokenize(a), B = tokenize(b);
  const n = A.length, m = B.length;
  // LCS-Längentabelle (O(n·m); für einige hundert Token unkritisch).
  const dp: number[][] = Array.from({ length: n + 1 }, () => new Array<number>(m + 1).fill(0));
  for (let i = n - 1; i >= 0; i--)
    for (let j = m - 1; j >= 0; j--)
      dp[i]![j] = A[i] === B[j] ? dp[i + 1]![j + 1]! + 1 : Math.max(dp[i + 1]![j]!, dp[i]![j + 1]!);

  const ops: DiffOp[] = [];
  const push = (type: DiffOp["type"], text: string): void => {
    const last = ops[ops.length - 1];
    if (last && last.type === type) last.text += text; else ops.push({ type, text });
  };
  let i = 0, j = 0;
  while (i < n && j < m) {
    if (A[i] === B[j]) { push("same", A[i]!); i++; j++; }
    else if (dp[i + 1]![j]! >= dp[i]![j + 1]!) { push("del", A[i]!); i++; }
    else { push("ins", B[j]!); j++; }
  }
  while (i < n) { push("del", A[i]!); i++; }
  while (j < m) { push("ins", B[j]!); j++; }
  return ops;
}

export function diffStats(ops: DiffOp[]): { del: number; ins: number } {
  const count = (t: DiffOp["type"]): number =>
    ops.filter((o) => o.type === t).reduce((s, o) => s + (o.text.match(/[^\s]+/g) || []).length, 0);
  return { del: count("del"), ins: count("ins") };
}
