/**
 * Inquiry / contact form delivery.
 *
 * The site is statically hosted on GitHub Pages, so there is no backend to POST
 * to. Previously both forms only wrote to `localStorage` and showed a success
 * toast — the lead never left the visitor's browser. This module makes the
 * submission actually reach the business, with graceful degradation:
 *
 *   1. POST the payload as JSON to `VITE_FORM_ENDPOINT`, or to FormSubmit's
 *      no-signup AJAX relay by default (which emails CONTACT_EMAIL).
 *   2. If that request fails for any reason, open the visitor's mail client
 *      with the enquiry pre-filled and report `via: 'mailto'` so the UI can
 *      tell them what happened instead of claiming a silent success.
 *
 * Local storage is still written, but only as a record for the in-browser demo
 * admin panel — never as the primary delivery path.
 */

import { messagesStore } from './store';

const CONFIGURED_ENDPOINT = (import.meta.env.VITE_FORM_ENDPOINT as string | undefined)?.trim();

/** Business inbox that receives enquiries when no API endpoint is configured. */
export const CONTACT_EMAIL = 'jack@houseplus-ch.com';

/**
 * Default delivery relay: FormSubmit's AJAX endpoint needs no account or
 * backend and forwards the submission to CONTACT_EMAIL as an email. The first
 * submission triggers a one-time confirmation link sent to that inbox.
 *
 * Override with VITE_FORM_ENDPOINT (e.g. a Formspree form or Cloudflare
 * Worker) to route enquiries somewhere else.
 */
const ENDPOINT = CONFIGURED_ENDPOINT || `https://formsubmit.co/ajax/${CONTACT_EMAIL}`;

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
        body: JSON.stringify({
          ...payload,
          submittedAt: new Date().toISOString(),
          _subject: payload.product ? `Product inquiry: ${payload.product}` : 'Website enquiry',
          _template: 'table',
          _captcha: 'false',
        }),
      });
      if (res.ok) {
        // FormSubmit (and some relays) answer HTTP 200 with
        // {"success":"false","message":"..."} when the form is not yet
        // activated, so an OK status alone does not mean the lead was sent.
        const data = await res.json().catch(() => null);
        const delivered =
          data === null || data.success === true || data.success === 'true';
        if (delivered) return { ok: true, via: 'endpoint' };
      }
      // Relay rejected or is misconfigured; don't lose the lead — fall through
      // to the mail-client hand-off below.
    } catch {
      /* network/CORS failure — same fallback */
    }
  }

  // Hand off to the visitor's mail client so the enquiry still reaches a human.
  window.location.href = buildMailtoUrl(payload);
  return { ok: true, via: 'mailto' };
}

/** True when automatic relay delivery is configured (overridable via env). */
export function hasFormEndpoint(): boolean {
  return Boolean(ENDPOINT);
}
