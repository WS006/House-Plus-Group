// ============================================================
// House Plus Group - Terms of Service Page
// ============================================================
//
// These Terms match what the Site actually is: a catalogue plus an enquiry
// channel, with no online sales. The earlier version described checkout,
// shipping and returns, which the Site does not offer.

import { useEffect } from 'react';
import { updatePageMeta } from '@/lib/seo';
import Breadcrumb from '@/components/Breadcrumb';

const LAST_UPDATED = 'November 13, 2026';

export default function Terms() {
  useEffect(() => {
    updatePageMeta('terms');
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <section className="bg-gradient-to-r from-[#0f2d5e] to-[#1a3a7a] text-white py-12">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <Breadcrumb items={[{ label: 'Terms of Service' }]} variant="dark" />
          <h1 className="text-4xl font-black mt-4 mb-3">Terms of Service</h1>
          <p className="text-white/80">Last Updated: {LAST_UPDATED}</p>
        </div>
      </section>

      {/* Content */}
      <section className="py-12 bg-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="prose prose-sm max-w-none text-gray-700 space-y-8">
            <div>
              <h2 className="text-2xl font-bold text-[#0f2d5e] mb-4">1. About These Terms</h2>
              <p>
                These Terms govern your use of www.houseplus.com.ng (the "Site"), operated by{' '}
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
                ). By accessing or using the Site you agree to these Terms. If you do not agree,
                please do not use the Site.
              </p>
            </div>

            <div>
              <h2 className="text-2xl font-bold text-[#0f2d5e] mb-4">
                2. What This Site Is (and Is Not)
              </h2>
              <p>
                The Site is a product catalogue and business enquiry channel for wholesale, OEM/ODM
                and export customers. It lets you browse products and send us an enquiry. It does{' '}
                <strong>not</strong> provide user accounts, a shopping cart, online checkout, or
                payment processing, and we do not publish prices on the Site.
              </p>
              <p>
                Any sale, specification, price, lead time, warranty or delivery term is agreed
                separately in a written quotation or contract between you and us. Nothing on the Site
                constitutes a binding offer to sell.
              </p>
            </div>

            <div>
              <h2 className="text-2xl font-bold text-[#0f2d5e] mb-4">
                3. Enquiries and Quotations
              </h2>
              <p>
                When you submit an enquiry you agree that we may contact you to discuss it. Please
                ensure the information you provide is accurate and that you have the right to share
                it. Quotations we issue are valid only for the period stated in the quotation and
                may depend on quantity, destination, and customisation.
              </p>
            </div>

            <div>
              <h2 className="text-2xl font-bold text-[#0f2d5e] mb-4">4. Product Information</h2>
              <p>
                We take care to describe our products accurately, but specifications, images,
                certifications, and availability are indicative and may change. Product images are
                illustrative. Final specifications are those confirmed in your written quotation or
                contract. Any certification claims should be verified against the documents supplied
                with the goods.
              </p>
            </div>

            <div>
              <h2 className="text-2xl font-bold text-[#0f2d5e] mb-4">5. Acceptable Use</h2>
              <p>You may use the Site for lawful business purposes only. You agree not to:</p>
              <ul className="list-disc list-inside space-y-2 ml-2">
                <li>Use the Site to send unsolicited, fraudulent, or misleading enquiries</li>
                <li>
                  Attempt to gain unauthorised access to the Site or its systems, or introduce
                  malicious code
                </li>
                <li>Scrape, mirror, or systematically copy the Site without our written permission</li>
                <li>Misrepresent your identity or affiliation with another organisation</li>
                <li>Use the Site in any way that infringes applicable law or third-party rights</li>
              </ul>
            </div>

            <div>
              <h2 className="text-2xl font-bold text-[#0f2d5e] mb-4">6. Intellectual Property</h2>
              <p>
                The Site's text, design, logos, and images are owned by or licensed to HousePlus
                Group and are protected by applicable intellectual property laws. You may view and
                print pages for your own business evaluation, but you may not reproduce, distribute,
                or use our trademarks or content for commercial purposes without our prior written
                consent.
              </p>
            </div>

            <div>
              <h2 className="text-2xl font-bold text-[#0f2d5e] mb-4">7. Disclaimers</h2>
              <p>
                The Site and its content are provided on an "as is" and "as available" basis. While
                we work to keep information current and accurate, we do not warrant that the Site
                will always be available, error-free, or that its content is complete. To the extent
                permitted by law, we disclaim implied warranties of merchantability, fitness for a
                particular purpose, and non-infringement.
              </p>
            </div>

            <div>
              <h2 className="text-2xl font-bold text-[#0f2d5e] mb-4">8. Limitation of Liability</h2>
              <p>
                To the maximum extent permitted by law, HousePlus Group Nigerian Factory and its
                affiliates are not liable for indirect, incidental, special, consequential, or
                punitive damages, or for loss of profits, data, or business opportunities, arising
                from your use of (or inability to use) the Site. Nothing in these Terms limits
                liability that cannot lawfully be limited, including liability for fraud or for death
                or personal injury caused by negligence.
              </p>
            </div>

            <div>
              <h2 className="text-2xl font-bold text-[#0f2d5e] mb-4">
                9. Third-Party Links and Services
              </h2>
              <p>
                The Site links to our group website, social media profiles, and mapping services, and
                uses third-party providers to host and deliver it. We are not responsible for the
                content or practices of third-party sites, which are governed by their own terms and
                privacy policies.
              </p>
            </div>

            <div>
              <h2 className="text-2xl font-bold text-[#0f2d5e] mb-4">10. Privacy</h2>
              <p>
                How we handle personal information is described in our{' '}
                <a href="/privacy" className="text-[#b45309] underline underline-offset-2">
                  Privacy Policy
                </a>
                , which forms part of these Terms.
              </p>
            </div>

            <div>
              <h2 className="text-2xl font-bold text-[#0f2d5e] mb-4">
                11. Governing Law and Disputes
              </h2>
              <p>
                These Terms are governed by the laws of the Federal Republic of Nigeria, without
                prejudice to any mandatory protections available to you under applicable law. If a
                dispute arises, we ask that you first contact us so we can try to resolve it in good
                faith before starting formal proceedings.
              </p>
            </div>

            <div>
              <h2 className="text-2xl font-bold text-[#0f2d5e] mb-4">12. Changes and Contact</h2>
              <p>
                We may update these Terms as the Site evolves. The "Last Updated" date above shows
                the current version, and continued use of the Site after a change means you accept
                the revised Terms.
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
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
