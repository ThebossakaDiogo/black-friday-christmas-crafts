import { describe, it, expect } from "vitest";
import { PRICES, upsellTotal, withAttribution } from "./offer";

describe("offer pricing", () => {
  it("entry plan costs R$10,00", () => expect(PRICES.basic).toBe(10));
  it("upsell adds R$10,00", () => expect(upsellTotal()).toBe(20));
  it("premium costs R$37,90", () => expect(PRICES.premium).toBe(37.9));
  it("forwards utm params only", () => {
    const u = withAttribution("https://x.com/c", "?utm_source=fb&foo=1&fbclid=abc");
    expect(u).toContain("utm_source=fb");
    expect(u).toContain("fbclid=abc");
    expect(u).not.toContain("foo=1");
  });
});
