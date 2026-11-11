export function buildChartData(data, caseType) {
  const series = data?.[caseType];
  if (!series || typeof series !== 'object') return [];
  const result = []; let previous;
  for (const [date, value] of Object.entries(series)) {
    if (!Number.isFinite(value)) { previous = undefined; continue; }
    if (previous !== undefined) result.push({ x: date, y: value - previous });
    previous = value;
  }
  return result;
}
