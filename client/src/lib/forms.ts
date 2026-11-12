/**
 * Inquiry / contact form delivery.
 *
 * The site is statically hosted on GitHub Pages, so there is no backend to POST
 * to. Previously both forms only wrote to `localStorage` and showed a success
 * toast — the lead never left the visitor's browser. This module makes the
 * submission actually reach the business, with graceful degradation:
 *
 *   1. If VITE_FORM_ENDPOINT is configured (Formspree, Cloudflare Worker, etc.)
 *      POST the payload there as JSON.
 *   2. Otherwise fall back to opening the visitor's mail client with the
 *      enquiry pre-filled, and report `fallback: 'mailto'` so the UI can tell
 *      the visitor what happened instead of claiming a silent success.
 *
 * Local storage is still written, but only as a record for the in-browser demo
 * admin panel — never as the primary delivery path.
 */

import { messagesStore } from './store';

const ENDPOINT = (import.meta.env.VITE_FORM_ENDPOINT as string | undefined)?.trim();

/** Business inbox that receives enquiries when no API endpoint is configured. */
export const CONTACT_EMAIL = 'jack@houseplus-ch.com';

export interface InquiryPayload {
  name: string;
  email: string;
  phone: string;
  country: string;
  subject: string;
  message: string;
  product?: string;
  quantity?: string;
  requirements?: string;
  type: 'contact' | 'inquiry';
}

export type DeliveryResult =
  | { ok: true; via: 'endpoint' }
  | { ok: true; via: 'mailto' }
  | { ok: false; error: string };

function buildMailtoUrl(payload: InquiryPayload): string {
  const lines = [
    `Name: ${payload.name}`,
    `Email: ${payload.email}`,
    `Phone: ${payload.phone}`,
    `Country: ${payload.country}`,
    payload.product ? `Product: ${payload.product}` : '',
    payload.quantity ? `Quantity: ${payload.quantity}` : '',
    '',
    payload.message || payload.requirements || '',
  ].filter(Boolean);

  const subject = payload.product
    ? `Product inquiry: ${payload.product}`
    : payload.subject
      ? `Website enquiry: ${payload.subject}`
      : 'Website enquiry';

  return `mailto:${CONTACT_EMAIL}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(lines.join('\n'))}`;
}

/**
 * Sends an enquiry. Never throws: returns a discriminated result the caller can
 * turn into an honest message ("we've emailed you" vs "mail app opened").
 */
export async function submitInquiry(payload: InquiryPayload): Promise<DeliveryResult> {
  // Always keep a local record for the demo admin panel.
  try {
    messagesStore.add({
      name: payload.name,
      email: payload.email,
      phone: payload.phone,
      country: payload.country,
      subject: payload.subject || (payload.product ? `Inquiry: ${payload.product}` : 'Website enquiry'),
      message: payload.message || payload.requirements || '',
      product: payload.product,
      quantity: payload.quantity,
      requirements: payload.requirements,
      type: payload.type,
    });
  } catch {
    /* localStorage may be unavailable (private mode) — not fatal */
  }

  if (ENDPOINT) {
    try {
      const res = await fetch(ENDPOINT, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
        body: JSON.stringify({ ...payload, submittedAt: new Date().toISOString() }),
      });
      if (res.ok) return { ok: true, via: 'endpoint' };
      return { ok: false, error: `Server responded ${res.status}` };
    } catch (err) {
      return { ok: false, error: err instanceof Error ? err.message : 'Network error' };
    }
  }

  // No endpoint configured: hand off to the visitor's mail client so the
  // enquiry still reaches a human.
  window.location.href = buildMailtoUrl(payload);
  return { ok: true, via: 'mailto' };
}

/** True when submissions are delivered automatically rather than via mailto. */
export function hasFormEndpoint(): boolean {
  return Boolean(ENDPOINT);
}
