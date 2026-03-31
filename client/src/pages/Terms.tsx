// ============================================================
// House Plus Group - Terms of Service Page
// ============================================================

import { useEffect } from 'react';
import { useLanguage } from '@/contexts/LanguageContext';
import { updatePageMeta } from '@/lib/seo';

export default function Terms() {
  const { t } = useLanguage();

  useEffect(() => {
    updatePageMeta('terms');
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <section className="bg-gradient-to-r from-[#0f2d5e] to-[#1a3a7a] text-white py-12">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <h1 className="text-4xl font-black mb-3">Terms of Service</h1>
          <p className="text-white/80">Last Updated: March 31, 2026</p>
        </div>
      </section>

      {/* Content */}
      <section className="py-12 bg-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="prose prose-sm max-w-none text-gray-700 space-y-6">
            {/* Introduction */}
            <div>
              <h2 className="text-2xl font-bold text-[#0f2d5e] mb-4">1. Agreement to Terms</h2>
              <p>
                These Terms of Service ("Terms") constitute a legally binding agreement between you ("User," "you," or "your") and House Plus Group ("Company," "we," "us," or "our"). By accessing and using the website www.houseplus.com.ng (the "Site") and any services provided through the Site, you agree to be bound by these Terms. If you do not agree with any part of these Terms, you may not use the Site.
              </p>
              <p>
                We reserve the right to modify these Terms at any time. Changes will be effective immediately upon posting to the Site. Your continued use of the Site following any modifications constitutes your acceptance of the revised Terms.
              </p>
            </div>

            {/* Use License */}
            <div>
              <h2 className="text-2xl font-bold text-[#0f2d5e] mb-4">2. Use License</h2>
              <p>
                House Plus Group grants you a limited, non-exclusive, non-transferable, and revocable license to access and use the Site for lawful purposes only. This license does not include the right to:
              </p>
              <ul className="list-disc list-inside space-y-2 ml-2">
                <li>Modify or copy the materials on the Site</li>
                <li>Use the materials for commercial purposes or for public display</li>
                <li>Attempt to decompile or reverse engineer any software contained on the Site</li>
                <li>Remove any copyright or other proprietary notations from the materials</li>
                <li>Transfer the materials to another person or "mirror" the materials on any other server</li>
                <li>Violate any applicable laws or regulations</li>
                <li>Infringe upon any intellectual property rights</li>
                <li>Harass, abuse, or threaten any person or entity</li>
              </ul>
            </div>

            {/* Disclaimer of Warranties */}
            <div>
              <h2 className="text-2xl font-bold text-[#0f2d5e] mb-4">3. Disclaimer of Warranties</h2>
              <p>
                The Site and all materials, information, and services provided on the Site are provided on an "AS IS" and "AS AVAILABLE" basis without warranties of any kind, either express or implied. House Plus Group disclaims all warranties, including but not limited to:
              </p>
              <ul className="list-disc list-inside space-y-2 ml-2">
                <li>Warranties of merchantability or fitness for a particular purpose</li>
                <li>Warranties of title or non-infringement</li>
                <li>Warranties that the Site will be uninterrupted, error-free, or secure</li>
                <li>Warranties regarding the accuracy, completeness, or reliability of content</li>
              </ul>
              <p className="mt-3">
                We do not warrant that the Site will meet your requirements or that the Site will be available at all times or in all locations.
              </p>
            </div>

            {/* Limitation of Liability */}
            <div>
              <h2 className="text-2xl font-bold text-[#0f2d5e] mb-4">4. Limitation of Liability</h2>
              <p>
                In no event shall House Plus Group, its officers, directors, employees, or agents be liable for any indirect, incidental, special, consequential, or punitive damages, including but not limited to damages for loss of profits, goodwill, use, data, or other intangible losses arising out of or in connection with your use of the Site, even if we have been advised of the possibility of such damages.
              </p>
              <p>
                Our total liability to you for any claims arising out of or relating to these Terms or your use of the Site shall not exceed the amount you paid to us, if any, in the twelve months preceding the claim.
              </p>
            </div>

            {/* Product Information and Pricing */}
            <div>
              <h2 className="text-2xl font-bold text-[#0f2d5e] mb-4">5. Product Information and Pricing</h2>
              
              <h3 className="text-xl font-semibold text-gray-800 mb-3 mt-4">5.1 Accuracy of Information</h3>
              <p>
                We strive to provide accurate product descriptions, specifications, and pricing information on the Site. However, we do not warrant that all product descriptions, pricing, or other content on the Site is accurate, complete, or error-free. We reserve the right to correct any errors or omissions.
              </p>

              <h3 className="text-xl font-semibold text-gray-800 mb-3 mt-4">5.2 Pricing</h3>
              <p>
                All prices are subject to change without notice. We reserve the right to refuse or cancel any order. Prices are in USD unless otherwise stated. Actual pricing may vary based on quantity, customization, and other factors. Please contact us for current pricing and availability.
              </p>

              <h3 className="text-xl font-semibold text-gray-800 mb-3 mt-4">5.3 Product Availability</h3>
              <p>
                Products are subject to availability. We reserve the right to discontinue any product at any time. If a product is unavailable, we will notify you and offer alternatives or a full refund.
              </p>
            </div>

            {/* Orders and Payments */}
            <div>
              <h2 className="text-2xl font-bold text-[#0f2d5e] mb-4">6. Orders and Payments</h2>
              
              <h3 className="text-xl font-semibold text-gray-800 mb-3 mt-4">6.1 Order Acceptance</h3>
              <p>
                By submitting an order, you are making an offer to purchase products from House Plus Group. We reserve the right to accept or reject any order at our sole discretion. An order is not binding until we send you a confirmation email.
              </p>

              <h3 className="text-xl font-semibold text-gray-800 mb-3 mt-4">6.2 Payment Terms</h3>
              <p>
                Payment must be received before shipment of products, unless we agree to alternative payment terms in writing. We accept various payment methods as indicated on the Site. All payments must be made in the currency specified.
              </p>

              <h3 className="text-xl font-semibold text-gray-800 mb-3 mt-4">6.3 Taxes and Duties</h3>
              <p>
                You are responsible for any applicable taxes, duties, tariffs, or other governmental charges related to your purchase. Prices do not include these charges unless explicitly stated.
              </p>
            </div>

            {/* Shipping and Delivery */}
            <div>
              <h2 className="text-2xl font-bold text-[#0f2d5e] mb-4">7. Shipping and Delivery</h2>
              
              <h3 className="text-xl font-semibold text-gray-800 mb-3 mt-4">7.1 Shipping Terms</h3>
              <p>
                We will use reasonable efforts to ship orders within the timeframe specified. However, we do not guarantee delivery dates. Shipping times may vary based on destination, customs clearance, and other factors beyond our control.
              </p>

              <h3 className="text-xl font-semibold text-gray-800 mb-3 mt-4">7.2 Risk of Loss</h3>
              <p>
                Risk of loss transfers to you upon delivery to the shipping carrier. We recommend purchasing shipping insurance for valuable orders. We are not responsible for loss, damage, or theft during transit.
              </p>

              <h3 className="text-xl font-semibold text-gray-800 mb-3 mt-4">7.3 Shipping Costs</h3>
              <p>
                Shipping costs will be calculated and displayed before you complete your order. Shipping costs are non-refundable unless the order is cancelled by us or the product is defective.
              </p>
            </div>

            {/* Returns and Refunds */}
            <div>
              <h2 className="text-2xl font-bold text-[#0f2d5e] mb-4">8. Returns and Refunds</h2>
              
              <h3 className="text-xl font-semibold text-gray-800 mb-3 mt-4">8.1 Return Policy</h3>
              <p>
                Products may be returned within 30 days of delivery if they are unused, in original condition, and in original packaging. Custom or made-to-order products are generally non-returnable. Please contact us to initiate a return.
              </p>

              <h3 className="text-xl font-semibold text-gray-800 mb-3 mt-4">8.2 Refund Process</h3>
              <p>
                Upon receipt and inspection of returned products, we will issue a refund to your original payment method within 7-10 business days. Refunds do not include original shipping costs. Return shipping costs are the responsibility of the customer unless the return is due to our error or a defective product.
              </p>

              <h3 className="text-xl font-semibold text-gray-800 mb-3 mt-4">8.3 Defective Products</h3>
              <p>
                If you receive a defective or damaged product, please contact us immediately with photos or video evidence. We will replace the product or issue a full refund, including return shipping costs.
              </p>
            </div>

            {/* Intellectual Property Rights */}
            <div>
              <h2 className="text-2xl font-bold text-[#0f2d5e] mb-4">9. Intellectual Property Rights</h2>
              <p>
                All content on the Site, including text, graphics, logos, images, videos, and software, is the property of House Plus Group or its content suppliers and is protected by international copyright, trademark, and other intellectual property laws. You may not reproduce, distribute, transmit, display, or perform any content from the Site without our prior written permission.
              </p>
              <p>
                House Plus Group and related logos are trademarks of House Plus Group. You may not use these trademarks without our prior written consent.
              </p>
            </div>

            {/* User Responsibilities */}
            <div>
              <h2 className="text-2xl font-bold text-[#0f2d5e] mb-4">10. User Responsibilities</h2>
              <p>
                You agree to use the Site only for lawful purposes and in a way that does not infringe upon the rights of others or restrict their use and enjoyment of the Site. You agree not to:
              </p>
              <ul className="list-disc list-inside space-y-2 ml-2">
                <li>Harass, threaten, or abuse any person or entity</li>
                <li>Post or transmit obscene, offensive, or defamatory content</li>
                <li>Attempt to gain unauthorized access to the Site or its systems</li>
                <li>Interfere with the functioning of the Site</li>
                <li>Engage in any form of hacking or data theft</li>
                <li>Violate any applicable laws or regulations</li>
                <li>Engage in spam or unsolicited communications</li>
              </ul>
            </div>

            {/* Indemnification */}
            <div>
              <h2 className="text-2xl font-bold text-[#0f2d5e] mb-4">11. Indemnification</h2>
              <p>
                You agree to indemnify, defend, and hold harmless House Plus Group and its officers, directors, employees, and agents from any claims, damages, losses, liabilities, and expenses arising out of or related to your use of the Site, your violation of these Terms, or your violation of any applicable laws or the rights of any third party.
              </p>
            </div>

            {/* Termination */}
            <div>
              <h2 className="text-2xl font-bold text-[#0f2d5e] mb-4">12. Termination</h2>
              <p>
                We reserve the right to terminate your access to the Site at any time, without notice, if we determine that you have violated these Terms or engaged in any unlawful or inappropriate conduct. Upon termination, all rights granted to you under these Terms will cease.
              </p>
            </div>

            {/* Governing Law */}
            <div>
              <h2 className="text-2xl font-bold text-[#0f2d5e] mb-4">13. Governing Law and Jurisdiction</h2>
              <p>
                These Terms are governed by and construed in accordance with the laws of Nigeria, without regard to its conflict of law principles. You agree to submit to the exclusive jurisdiction of the courts located in Lagos, Nigeria for any disputes arising out of or relating to these Terms or your use of the Site.
              </p>
            </div>

            {/* Dispute Resolution */}
            <div>
              <h2 className="text-2xl font-bold text-[#0f2d5e] mb-4">14. Dispute Resolution</h2>
              <p>
                Before initiating any legal proceedings, you agree to attempt to resolve any disputes with House Plus Group through good faith negotiation. If negotiation fails, you agree to submit the dispute to binding arbitration in accordance with the rules of the International Chamber of Commerce.
              </p>
            </div>

            {/* Severability */}
            <div>
              <h2 className="text-2xl font-bold text-[#0f2d5e] mb-4">15. Severability</h2>
              <p>
                If any provision of these Terms is found to be invalid or unenforceable, that provision will be severed, and the remaining provisions will continue in full force and effect.
              </p>
            </div>

            {/* Entire Agreement */}
            <div>
              <h2 className="text-2xl font-bold text-[#0f2d5e] mb-4">16. Entire Agreement</h2>
              <p>
                These Terms, together with our Privacy Policy and any other policies or agreements referenced herein, constitute the entire agreement between you and House Plus Group regarding your use of the Site and supersede all prior and contemporaneous agreements, understandings, and negotiations.
              </p>
            </div>

            {/* Contact Information */}
            <div>
              <h2 className="text-2xl font-bold text-[#0f2d5e] mb-4">17. Contact Us</h2>
              <p>
                If you have any questions about these Terms of Service, please contact us:
              </p>
              <div className="bg-gray-50 p-6 rounded-lg mt-4 space-y-2">
                <p><strong>House Plus Group</strong></p>
                <p>Email: <a href="mailto:jack@houseplus-ch.com" className="text-[#f59e0b] hover:underline">jack@houseplus-ch.com</a></p>
                <p>Phone: <a href="https://wa.me/2349078080738" className="text-[#f59e0b] hover:underline">+234 907 808 0738</a></p>
                <p>Address: 8 Eso Cl, Ikeja GRA, Lagos, Nigeria</p>
              </div>
            </div>

            {/* Compliance */}
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-6 mt-8">
              <p className="text-sm text-gray-700">
                <strong>Compliance Notice:</strong> These Terms of Service comply with international e-commerce standards and regulations. House Plus Group is committed to fair dealing and consumer protection in all jurisdictions where we operate.
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
