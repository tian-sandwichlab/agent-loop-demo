export function formatPrice(cents: number): string {
  if (!Number.isFinite(cents)) return "--";
  const rounded = Math.round(cents);
  const sign = rounded < 0 ? "-" : "";
  const amount = Math.abs(rounded);
  const yuan = Math.floor(amount / 100);
  const fen = amount % 100;
  return fen === 0 ? `${sign}￥${yuan}` : `${sign}￥${yuan}.${String(fen).padStart(2, "0")}`;
}
