/** Helper function for comparing a query with a target for searching */
export function compare(query: string, target: string): boolean {
  if (!query?.trim()) return true;
  if (!target?.trim()) return false;

  const queries = query.toLowerCase().trim().split(/\s+/);
  const targets = target.toLowerCase().trim().split(/\s+/);

  return queries.every(q => targets.some(t => t.includes(q)));
}