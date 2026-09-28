export function formatPrice(cents: number): string {
  const sign = cents < 0 ? "-" : "";
  const amount = Math.abs(cents);
  const yuan = Math.floor(amount / 100);
  const fen = amount % 100;
  return fen === 0 ? `${sign}￥${yuan}` : `${sign}￥${yuan}.${String(fen).padStart(2, "0")}`;
}
