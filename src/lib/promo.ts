/**
 * Site-wide biquíni promotion ("Black Sea" 20% OFF).
 *
 * The discounted price is baked into the catalog (`src/data/products.ts`), so
 * the cart, the checkout server function and Mercado Pago all charge the exact
 * same value — there is no separate discount step that could drift.
 *
 * To end the promo: set `active` to false. Biquínis go back to
 * `BIQUINI_FULL_PRICE`, the crossed-out price, the popup and the banners
 * disappear automatically. To bring back the 10% coupon, also set
 * `COUPON_ENABLED = true` in `src/lib/coupon.ts`.
 */
export const PROMO = {
  active: true,
  discount: 0.2,
  label: "20% OFF",
  /** Shown to customers. Keep in sync with `endsAt`. */
  endsLabel: "5 de dezembro",
  /** Last moment of the promo, Brasília time. Hides popup/banners after this. */
  endsAt: new Date("2026-12-05T23:59:59-03:00"),
} as const;

export const BIQUINI_FULL_PRICE = 79.9;

/** Rounds to cents so the price shown always equals the price charged. */
export function applyPromo(price: number): number {
  if (!PROMO.active) return price;
  return Math.round(price * (1 - PROMO.discount) * 100) / 100;
}

/** Whether promo messaging (popup, marquee, footer) should be displayed now. */
export function isPromoLive(now: Date = new Date()): boolean {
  return PROMO.active && now.getTime() <= PROMO.endsAt.getTime();
}
