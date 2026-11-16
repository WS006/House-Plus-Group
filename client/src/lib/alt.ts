// ============================================================
// Image alt text
//
// Alt text is the only description of a photograph that a crawler or a screen
// reader ever gets, so it carries the product name, the category and the place
// it comes from — the same three facts the surrounding copy states. Kept in one
// function so a product card on the home page and the same product on its own
// page describe the image identically.
// ============================================================

/** Category slug (product vocabulary) -> human-readable context. */
const CATEGORY_CONTEXT: Record<string, string> = {
  solar: 'solar energy equipment',
  appliances: 'home appliance',
  'home-appliances': 'home appliance',
  '3c': '3C electronics',
  '3c-electronics': '3C electronics',
};

/**
 * Alt text for a catalogue product photograph.
 *
 * `name` is whatever the page renders (localised on product pages), `category`
 * accepts either the product slug ('3c') or the category-page slug
 * ('3c-electronics').
 */
export function productAlt(name: string, category: string, note?: string): string {
  const context = CATEGORY_CONTEXT[category] ?? 'product';
  const base = `${name} — ${context} supplied factory-direct by HousePlus Group Nigerian Factory, Nigeria`;
  return note ? `${base}. ${note}` : base;
}
