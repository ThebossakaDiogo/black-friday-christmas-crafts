// Single source of truth for prices and checkout links.
export const PRICES = {
  basic: 10.0,
  basicFrom: 19.9,
  upsellAddOn: 10.0,
  premium: 37.9,
  premiumFrom: 147.9,
} as const;

export const upsellTotal = () => Math.round((PRICES.basic + PRICES.upsellAddOn) * 100) / 100;

export const CHECKOUT = {
  basic: "https://pay.seguruspagamentos.com.br/checkout/S3H8M1",
  upsell: "https://pay.seguruspagamentos.com.br/checkout/0HG2T5",
  premium: "https://pay.seguruspagamentos.com.br/checkout/GCJZEG",
} as const;

export const brl = (v: number) =>
  v.toLocaleString("pt-BR", { style: "currency", currency: "BRL" });

/** Forwards ad attribution params (utm_*, fbclid, gclid, src, sck) from the page URL to checkout. */
export function withAttribution(url: string, search: string): string {
  const keep = /^(utm_[a-z]+|fbclid|gclid|ttclid|src|sck)$/;
  const from = new URLSearchParams(search);
  const out = new URL(url);
  from.forEach((v, k) => { if (keep.test(k)) out.searchParams.set(k, v); });
  return out.toString();
}
