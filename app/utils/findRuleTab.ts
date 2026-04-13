/** Resolves which tab owns a rule by loading grammar, then Murphy, on demand. */
export async function findRuleTab(ruleId: string): Promise<'grammar' | 'murphy' | null> {
  const { DATA } = await import('../data/grammar');
  for (const lvl of DATA) {
    for (const cat of lvl.categories) {
      if (cat.rules.some((r) => r.id === ruleId)) return 'grammar';
    }
  }
  const { MURPHY_DATA } = await import('../data/murphy');
  for (const lvl of MURPHY_DATA) {
    for (const cat of lvl.categories) {
      if (cat.rules.some((r) => r.id === ruleId)) return 'murphy';
    }
  }
  return null;
}
