export function formatPrice(cents: number): string {
  return `¥${Math.floor(cents / 10) / 10}`;
}
