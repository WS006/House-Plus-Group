// ============================================================
// House Plus Group - Privacy Policy Page
// ============================================================

import { useEffect } from 'react';
import { useLanguage } from '@/contexts/LanguageContext';
import { updatePageMeta } from '@/lib/seo';

export default function Privacy() {
  const { t } = useLanguage();

  useEffect(() => {
    updatePageMeta('privacy');
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <section className="bg-gradient-to-r from-[#0f2d5e] to-[#1a3a7a] text-white py-12">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <h1 className="text-4xl font-black mb-3">Privacy Policy</h1>
          <p className="text-white/80">Last Updated: March 31, 2026</p>
        </div>
      </section>

      {/* Content */}
      <section className="py-12 bg-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="prose prose-sm max-w-none text-gray-700 space-y-6">
            {/* Introduction */}
            <div>
              <h2 className="text-2xl font-bold text-[#0f2d5e] mb-4">1. Introduction</h2>
              <p>
                House Plus Group ("Company," "we," "us," "our," or "our Company") is committed to protecting your privacy. This Privacy Policy explains how we collect, use, disclose, and safeguard your information when you visit our website www.houseplus.com.ng (the "Site") and use our services.
              </p>
              <p>
                Please read this Privacy Policy carefully. If you do not agree with our policies and practices, please do not use our Site. By accessing and using the Site, you acknowledge that you have read, understood, and agree to be bound by all the provisions of this Privacy Policy.
              </p>
            </div>

            {/* Information We Collect */}
            <div>
              <h2 className="text-2xl font-bold text-[#0f2d5e] mb-4">2. Information We Collect</h2>
              
              <h3 className="text-xl font-semibold text-gray-800 mb-3 mt-4">2.1 Information You Provide Directly</h3>
              <p>We collect information you voluntarily provide when you:</p>
              <ul className="list-disc list-inside space-y-2 ml-2">
                <li>Fill out contact forms on our Site</li>
                <li>Request product information or quotes</li>
                <li>Subscribe to our newsletter</li>
                <li>Send us emails or messages</li>
                <li>Create an account on our Site</li>
                <li>Place orders for products or services</li>
              </ul>
              <p className="mt-3">This information may include your name, email address, phone number, company name, job title, mailing address, and any other information you choose to provide.</p>

              <h3 className="text-xl font-semibold text-gray-800 mb-3 mt-4">2.2 Information Collected Automatically</h3>
              <p>When you visit our Site, we automatically collect certain information about your device and browsing activity:</p>
              <ul className="list-disc list-inside space-y-2 ml-2">
                <li>IP address and device identifiers</li>
                <li>Browser type and version</li>
                <li>Operating system</li>
                <li>Pages visited and time spent on pages</li>
                <li>Referring and exit pages</li>
                <li>Click streams and search queries</li>
                <li>Cookies and similar tracking technologies</li>
              </ul>

              <h3 className="text-xl font-semibold text-gray-800 mb-3 mt-4">2.3 Cookies and Tracking Technologies</h3>
              <p>
                We use cookies, web beacons, and similar tracking technologies to enhance your experience on our Site. These technologies help us understand how you use our Site, remember your preferences, and deliver personalized content. You can control cookie settings through your browser preferences, though some features of our Site may not function properly if cookies are disabled.
              </p>
            </div>

            {/* How We Use Your Information */}
            <div>
              <h2 className="text-2xl font-bold text-[#0f2d5e] mb-4">3. How We Use Your Information</h2>
              <p>We use the information we collect for the following purposes:</p>
              <ul className="list-disc list-inside space-y-2 ml-2">
                <li>To provide, maintain, and improve our products and services</li>
                <li>To respond to your inquiries and customer service requests</li>
                <li>To process your orders and send related information</li>
                <li>To send promotional emails and newsletters (with your consent)</li>
                <li>To analyze Site usage and trends to improve user experience</li>
                <li>To detect, prevent, and address fraud and security issues</li>
                <li>To comply with legal obligations and enforce our Terms of Service</li>
                <li>To personalize content and recommendations</li>
                <li>To conduct market research and surveys</li>
                <li>To monitor and analyze Site performance and traffic</li>
              </ul>
            </div>

            {/* Information Sharing */}
            <div>
              <h2 className="text-2xl font-bold text-[#0f2d5e] mb-4">4. Information Sharing and Disclosure</h2>
              
              <h3 className="text-xl font-semibold text-gray-800 mb-3 mt-4">4.1 Third-Party Service Providers</h3>
              <p>
                We may share your information with third-party service providers who assist us in operating our Site and conducting our business, including email service providers, analytics providers, payment processors, and hosting providers. These service providers are contractually obligated to use your information only as necessary to provide services to us.
              </p>

              <h3 className="text-xl font-semibold text-gray-800 mb-3 mt-4">4.2 Business Transfers</h3>
              <p>
                If House Plus Group is involved in a merger, acquisition, bankruptcy, or sale of assets, your information may be transferred as part of that transaction. We will provide notice before your information becomes subject to a different privacy policy.
              </p>

              <h3 className="text-xl font-semibold text-gray-800 mb-3 mt-4">4.3 Legal Requirements</h3>
              <p>
                We may disclose your information when required by law, such as in response to a subpoena, court order, or government request, or when we believe in good faith that disclosure is necessary to protect our rights, your safety, or the safety of others.
              </p>

              <h3 className="text-xl font-semibold text-gray-800 mb-3 mt-4">4.4 With Your Consent</h3>
              <p>
                We may share your information with third parties for purposes other than those listed above only with your explicit consent.
              </p>
            </div>

            {/* Data Security */}
            <div>
              <h2 className="text-2xl font-bold text-[#0f2d5e] mb-4">5. Data Security</h2>
              <p>
                We implement appropriate technical and organizational measures to protect your personal information against unauthorized access, alteration, disclosure, or destruction. These measures include encryption, secure servers, firewalls, and access controls. However, no method of transmission over the Internet or electronic storage is completely secure. While we strive to protect your information, we cannot guarantee absolute security.
              </p>
            </div>

            {/* Your Rights and Choices */}
            <div>
              <h2 className="text-2xl font-bold text-[#0f2d5e] mb-4">6. Your Rights and Choices</h2>
              
              <h3 className="text-xl font-semibold text-gray-800 mb-3 mt-4">6.1 Access and Correction</h3>
              <p>
                You have the right to access, review, and request corrections to your personal information. To do so, please contact us using the information provided in the "Contact Us" section below.
              </p>

              <h3 className="text-xl font-semibold text-gray-800 mb-3 mt-4">6.2 Opt-Out</h3>
              <p>
                You may opt out of receiving promotional emails from us by clicking the "unsubscribe" link in any promotional email or by contacting us directly. Please note that even if you opt out of promotional emails, we will continue to send you transactional emails related to your orders and account.
              </p>

              <h3 className="text-xl font-semibold text-gray-800 mb-3 mt-4">6.3 Cookie Control</h3>
              <p>
                You can control cookies through your browser settings. Most browsers allow you to refuse cookies or alert you when cookies are being sent. However, blocking cookies may affect the functionality of our Site.
              </p>

              <h3 className="text-xl font-semibold text-gray-800 mb-3 mt-4">6.4 Data Deletion</h3>
              <p>
                You may request deletion of your personal information, subject to certain legal and operational exceptions. Please contact us to submit a deletion request.
              </p>
            </div>

            {/* International Data Transfers */}
            <div>
              <h2 className="text-2xl font-bold text-[#0f2d5e] mb-4">7. International Data Transfers</h2>
              <p>
                House Plus Group is based in China and operates globally. Your information may be transferred to, stored in, and processed in countries other than your country of residence, including countries that may not have the same data protection laws. By using our Site, you consent to the transfer of your information to countries outside your country of residence, which may have different data protection rules.
              </p>
            </div>

            {/* Children's Privacy */}
            <div>
              <h2 className="text-2xl font-bold text-[#0f2d5e] mb-4">8. Children's Privacy</h2>
              <p>
                Our Site is not intended for children under the age of 13. We do not knowingly collect personal information from children under 13. If we become aware that we have collected information from a child under 13, we will take steps to delete such information and terminate the child's account. If you believe we have collected information from a child under 13, please contact us immediately.
              </p>
            </div>

            {/* Third-Party Links */}
            <div>
              <h2 className="text-2xl font-bold text-[#0f2d5e] mb-4">9. Third-Party Links</h2>
              <p>
                Our Site may contain links to third-party websites and services that are not operated by House Plus Group. This Privacy Policy does not apply to third-party websites, and we are not responsible for their privacy practices. We encourage you to review the privacy policies of any third-party sites before providing your information.
              </p>
            </div>

            {/* Policy Updates */}
            <div>
              <h2 className="text-2xl font-bold text-[#0f2d5e] mb-4">10. Changes to This Privacy Policy</h2>
              <p>
                We may update this Privacy Policy from time to time to reflect changes in our practices, technology, legal requirements, or other factors. We will notify you of material changes by updating the "Last Updated" date at the top of this policy and, if required, by obtaining your consent. Your continued use of the Site following the posting of revised Privacy Policy means that you accept and agree to the changes.
              </p>
            </div>

            {/* Contact Us */}
            <div>
              <h2 className="text-2xl font-bold text-[#0f2d5e] mb-4">11. Contact Us</h2>
              <p>
                If you have questions about this Privacy Policy or our privacy practices, please contact us:
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
                <strong>Compliance Notice:</strong> This Privacy Policy complies with international privacy standards including GDPR principles, CCPA requirements, and other applicable data protection regulations. House Plus Group is committed to protecting your privacy rights regardless of your location.
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
