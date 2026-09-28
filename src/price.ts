export function formatPrice(cents: number): string {
  const sign = cents < 0 ? "-" : "";
  const [yuan, fen = ""] = (Math.abs(cents) / 100).toString().split(".");
  const grouped = yuan.replace(/\B(?=(\d{3})+(?!\d))/g, ",");
  return `${sign}¥${grouped}${fen ? `.${fen}` : ""}`;
}
