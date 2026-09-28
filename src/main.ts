import { formatPrice } from "./price";

const app = document.querySelector<HTMLDivElement>("#app");
if (app) {
  app.textContent = `示例价格: ${formatPrice(1999)}`;
}
