/**
 * Option A: Fixed density method
 * @param width number of columns
 * @param height number of rows
 * @param density fractional bomb density (e.g. 0.15 for 15%)
 */
export function bombsByDensity( width: number, height: number, density = 0.15): number {
  const area = width * height;
  return Math.max(1, Math.floor(area * density));
}

/**
 * Option B: Square‑root rule
 * Uses square root of total cells as bomb count (common small‑board heuristic)
 */
export function bombsBySqrt(width: number, height: number): number {
  const area = width * height;
  return Math.max(1, Math.floor(Math.sqrt(area)));
}

/**
 * Option C: Combined strategy
 * Picks the minimum between density-based and sqrt-based counts,
 * but ensures there’s at least one bomb and at most (area - 1).
 */
export function bombsCombined( width: number, height: number, density = 0.1 ): number {
  const area = width * height;
  const byDensity = Math.floor(area * density);
  const bySqrt = Math.floor(Math.sqrt(area));
  const raw = Math.min(byDensity, bySqrt);
  return Math.max(1, Math.min(raw, area - 1));
}
