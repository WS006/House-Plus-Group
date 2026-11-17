// ============================================================
// House Plus Group - Privacy Policy Page
// ============================================================
//
// Written for the Nigeria Data Protection Act (NDPA) 2023 and for what this
// Site actually does: a catalogue plus an enquiry form, with no accounts,
// checkout, payments or newsletter. An earlier version described features the
// Site does not have (order processing, newsletter opt-out, CCPA/GDPR
// compliance claims), which is both inaccurate and a compliance risk.

import { useEffect } from 'react';
import { updatePageMeta } from '@/lib/seo';
import Breadcrumb from '@/components/Breadcrumb';

const LAST_UPDATED = 'November 13, 2026';

export default function Privacy() {
  useEffect(() => {
    updatePageMeta('privacy');
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <section className="bg-gradient-to-r from-[#0f2d5e] to-[#1a3a7a] text-white py-12">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <Breadcrumb items={[{ label: 'Privacy Policy' }]} variant="dark" />
          <h1 className="text-4xl font-black mt-4 mb-3">Privacy Policy</h1>
          <p className="text-white/80">Last Updated: {LAST_UPDATED}</p>
        </div>
      </section>

      {/* Content */}
      <section className="py-12 bg-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="prose prose-sm max-w-none text-gray-700 space-y-8">
            <div>
              <h2 className="text-2xl font-bold text-[#0f2d5e] mb-4">1. Who We Are</h2>
              <p>
                This website (www.houseplus.com.ng) is operated by{' '}
                <strong>HousePlus Group Nigerian Factory</strong>, the Nigerian branch and local
                entity of HousePlus Group (official group website:{' '}
                <a
                  href="https://www.houseplus-ch.com"
                  target="_blank"
                  rel="noopener"
                  className="text-[#b45309] underline underline-offset-2"
                >
                  houseplus-ch.com
                </a>
                ). We are the data controller for personal information collected through this
                Site. Our factory and office are at 8 Eso Cl, Ikeja GRA, Lagos, Nigeria.
              </p>
              <p>
                This Site is a product catalogue and enquiry channel. It does not offer user
                accounts, online checkout, payment processing, or newsletter subscriptions.
              </p>
            </div>

            <div>
              <h2 className="text-2xl font-bold text-[#0f2d5e] mb-4">2. Information We Collect</h2>

              <h3 className="text-xl font-semibold text-gray-800 mb-3 mt-4">
                2.1 Information you submit
              </h3>
              <p>
                When you send an enquiry through our contact or product inquiry forms, we receive
                the details you choose to enter — typically your name, email address, phone number,
                company, country, and your message. We use this only to reply to your enquiry. We do
                not collect payment card details, and there is no account to register.
              </p>

              <h3 className="text-xl font-semibold text-gray-800 mb-3 mt-4">
                2.2 Information collected automatically
              </h3>
              <p>
                Like almost every website, our hosting provider processes technical data needed to
                deliver the pages — for example your IP address, browser type, device, and the pages
                requested. This is used for security and to keep the Site working. We also use
                Cloudflare Web Analytics, a privacy-friendly, cookie-free measurement service that
                reports aggregate page views and referrers; it does not build advertising profiles
                or track you across other websites.
              </p>

              <h3 className="text-xl font-semibold text-gray-800 mb-3 mt-4">
                2.3 Data stored in your browser
              </h3>
              <p>
                The Site stores a few small preferences locally in your browser (localStorage): your
                selected language, your saved/favourite products, and whether you have dismissed the
                cookie notice. These stay on your device and are not sent to us. We do not use
                advertising or cross-site tracking cookies.
              </p>
            </div>

            <div>
              <h2 className="text-2xl font-bold text-[#0f2d5e] mb-4">
                3. How We Use Your Information
              </h2>
              <ul className="list-disc list-inside space-y-2 ml-2">
                <li>To respond to your product and pricing enquiries and to communicate with you about them</li>
                <li>To operate, secure, and improve the Site (including aggregate, anonymous usage statistics)</li>
                <li>To protect against abuse, spam, and security incidents</li>
                <li>To comply with applicable legal obligations</li>
              </ul>
              <p className="mt-3">
                We do not sell your personal information, and we do not use it for automated
                decision-making or targeted advertising.
              </p>
            </div>

            <div>
              <h2 className="text-2xl font-bold text-[#0f2d5e] mb-4">
                4. Third Parties That Process Data
              </h2>
              <p>To run this Site we rely on a small number of service providers:</p>
              <ul className="list-disc list-inside space-y-2 ml-2">
                <li>
                  <strong>Cloudflare</strong> — hosts and delivers the Site, provides DDoS
                  protection and Web Analytics, and obfuscates email addresses shown on the page to
                  reduce spam.
                </li>
                <li>
                  <strong>FormSubmit</strong> — relays the enquiry form submissions to our business
                  mailbox. If that relay is unavailable, the form falls back to opening your own
                  email client with the message pre-filled, in which case the message is sent by you
                  through your email provider.
                </li>
                <li>
                  <strong>Our email provider</strong> — receives and stores the enquiries sent to{' '}
                  <a href="mailto:jack@houseplus-ch.com" className="text-[#b45309] underline underline-offset-2">
                    jack@houseplus-ch.com
                  </a>
                  .
                </li>
              </ul>
              <p className="mt-3">
                These providers process data only to deliver their services to us. Some of them may
                process data outside Nigeria; where that happens we rely on appropriate safeguards
                and on the limited nature of the data involved.
              </p>
            </div>

            <div>
              <h2 className="text-2xl font-bold text-[#0f2d5e] mb-4">
                5. Legal Basis (Nigeria Data Protection Act 2023)
              </h2>
              <p>
                As a Nigerian entity we handle personal data in line with the Nigeria Data
                Protection Act (NDPA) 2023 and the Nigeria Data Protection Commission's guidance. We
                rely on your consent when you submit an enquiry, on steps taken at your request
                before entering a contract, on our legitimate interest in securing and improving the
                Site, and on legal obligations where applicable.
              </p>
            </div>

            <div>
              <h2 className="text-2xl font-bold text-[#0f2d5e] mb-4">6. Data Retention</h2>
              <p>
                We keep enquiry correspondence only as long as needed to handle your request and any
                resulting business relationship, and to meet legal or record-keeping requirements.
                Technical logs are retained by our hosting provider for a limited period for security
                purposes. Browser-stored preferences remain on your device until you clear them.
              </p>
            </div>

            <div>
              <h2 className="text-2xl font-bold text-[#0f2d5e] mb-4">7. Your Rights</h2>
              <p>Under the NDPA you may have the right to:</p>
              <ul className="list-disc list-inside space-y-2 ml-2">
                <li>Be informed about, and request access to, the personal data we hold about you</li>
                <li>Request correction of inaccurate or incomplete data</li>
                <li>Request deletion of your data, subject to legal and operational exceptions</li>
                <li>
                  Object to or request restriction of certain processing, and withdraw consent where
                  processing is based on consent
                </li>
                <li>Request data portability where applicable</li>
                <li>Lodge a complaint with the Nigeria Data Protection Commission (NDPC)</li>
              </ul>
              <p className="mt-3">
                To exercise any of these rights, contact us using the details in section 11. We will
                respond within the timeframes required by applicable law.
              </p>
            </div>

            <div>
              <h2 className="text-2xl font-bold text-[#0f2d5e] mb-4">8. Data Security</h2>
              <p>
                The Site is served over HTTPS with HTTP Strict Transport Security (HSTS) and a
                restrictive Content-Security-Policy, and is delivered through Cloudflare's network.
                While we take reasonable technical and organisational measures to protect your
                information, no method of transmission over the internet is completely secure, and
                we cannot guarantee absolute security.
              </p>
            </div>

            <div>
              <h2 className="text-2xl font-bold text-[#0f2d5e] mb-4">9. Children's Privacy</h2>
              <p>
                This is a business-to-business site not directed at children. We do not knowingly
                collect personal information from children. If you believe a child has submitted
                information to us, please contact us so we can delete it.
              </p>
            </div>

            <div>
              <h2 className="text-2xl font-bold text-[#0f2d5e] mb-4">10. Third-Party Links</h2>
              <p>
                The Site links to our group website, social profiles, and mapping services. This
                policy does not cover those third-party sites; please review their own privacy
                notices before providing information to them.
              </p>
            </div>

            <div>
              <h2 className="text-2xl font-bold text-[#0f2d5e] mb-4">
                11. Contact Us &amp; Changes to This Policy
              </h2>
              <p>
                For questions about this policy, to exercise your rights, or to request a copy of
                it, please contact:
              </p>
              <div className="bg-gray-50 p-6 rounded-lg mt-4 space-y-2">
                <p>
                  <strong>HousePlus Group Nigerian Factory</strong>
                </p>
                <p>
                  Email:{' '}
                  <a href="mailto:jack@houseplus-ch.com" className="text-[#b45309] underline underline-offset-2">
                    jack@houseplus-ch.com
                  </a>
                </p>
                <p>
                  Phone / WhatsApp:{' '}
                  <a
                    href="https://wa.me/2349078080738"
                    className="text-[#b45309] underline underline-offset-2"
                  >
                    +234 907 808 0738
                  </a>
                </p>
                <p>Address: 8 Eso Cl, Ikeja GRA, Lagos, Nigeria</p>
              </div>
              <p className="mt-4">
                We may update this policy as the Site or our legal obligations change. The "Last
                Updated" date above will always reflect the current version.
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
