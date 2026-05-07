export function formatPercent(value: number): string {
  return `${value}%`;
}

export function truncate(str: string, length: number): string {
  return str.length > length ? str.slice(0, length) + '...' : str;
}
