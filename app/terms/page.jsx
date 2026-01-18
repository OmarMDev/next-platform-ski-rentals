export const metadata = {
  title: 'Terms of Service',
  description: 'SkiNB Terms of Service - Rules and guidelines for using our platform',
};

export default function TermsOfServicePage() {
  return (
    <div className="py-8 max-w-3xl mx-auto">
      <div className="bg-white rounded-[32px] p-8 md:p-12 shadow-sm border border-gray-100">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Terms of Service</h1>
        <p className="text-gray-500 mb-8">Last updated: January 2026</p>
        
        <div className="prose prose-gray max-w-none space-y-6">
          <section>
            <h2 className="text-xl font-semibold text-gray-900 mb-3">1. Acceptance of Terms</h2>
            <p className="text-gray-600 leading-relaxed">
              By accessing or using SkiNB, you agree to be bound by these Terms of Service. If you do not 
              agree to these terms, please do not use our platform.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-gray-900 mb-3">2. Description of Service</h2>
            <p className="text-gray-600 leading-relaxed">
              SkiNB is a peer-to-peer marketplace that connects people who want to rent ski and snowboard 
              equipment with those who have equipment available for rent. We provide the platform but are 
              not a party to any rental agreements between users.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-gray-900 mb-3">3. User Accounts</h2>
            <p className="text-gray-600 leading-relaxed mb-3">To use certain features of our platform, you must:</p>
            <ul className="list-disc list-inside text-gray-600 space-y-2">
              <li>Create an account with accurate and complete information</li>
              <li>Maintain the security of your account credentials</li>
              <li>Be at least 18 years old</li>
              <li>Accept responsibility for all activities under your account</li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-gray-900 mb-3">4. Listing Equipment</h2>
            <p className="text-gray-600 leading-relaxed mb-3">If you list equipment for rent, you agree to:</p>
            <ul className="list-disc list-inside text-gray-600 space-y-2">
              <li>Provide accurate descriptions and images of your equipment</li>
              <li>Ensure equipment is safe and in good working condition</li>
              <li>Set fair and transparent pricing</li>
              <li>Honor confirmed rental agreements</li>
              <li>Comply with all applicable laws and regulations</li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-gray-900 mb-3">5. Renting Equipment</h2>
            <p className="text-gray-600 leading-relaxed mb-3">If you rent equipment, you agree to:</p>
            <ul className="list-disc list-inside text-gray-600 space-y-2">
              <li>Use equipment responsibly and for its intended purpose</li>
              <li>Return equipment on time and in the same condition</li>
              <li>Report any damage or issues promptly</li>
              <li>Pay the agreed rental price</li>
              <li>Follow any instructions provided by the equipment owner</li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-gray-900 mb-3">6. Prohibited Activities</h2>
            <p className="text-gray-600 leading-relaxed mb-3">You may not:</p>
            <ul className="list-disc list-inside text-gray-600 space-y-2">
              <li>Use the platform for any illegal purpose</li>
              <li>Post false, misleading, or fraudulent content</li>
              <li>Harass, abuse, or harm other users</li>
              <li>Attempt to circumvent our fees or systems</li>
              <li>Scrape or collect user data without permission</li>
              <li>Interfere with the proper functioning of the platform</li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-gray-900 mb-3">7. Liability and Disclaimers</h2>
            <p className="text-gray-600 leading-relaxed">
              SkiNB provides the platform "as is" without warranties of any kind. We are not responsible 
              for the quality, safety, or legality of listed equipment, the accuracy of listings, or the 
              ability of users to complete transactions. Users engage in rentals at their own risk.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-gray-900 mb-3">8. Indemnification</h2>
            <p className="text-gray-600 leading-relaxed">
              You agree to indemnify and hold harmless SkiNB and its officers, directors, employees, and 
              agents from any claims, damages, or expenses arising from your use of the platform or 
              violation of these terms.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-gray-900 mb-3">9. Termination</h2>
            <p className="text-gray-600 leading-relaxed">
              We reserve the right to suspend or terminate your account at any time for violations of 
              these terms or for any other reason at our discretion. You may also delete your account 
              at any time.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-gray-900 mb-3">10. Changes to Terms</h2>
            <p className="text-gray-600 leading-relaxed">
              We may modify these terms at any time. Continued use of the platform after changes 
              constitutes acceptance of the new terms. We will notify users of significant changes.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-gray-900 mb-3">11. Governing Law</h2>
            <p className="text-gray-600 leading-relaxed">
              These terms are governed by applicable European Union laws and regulations. Any disputes 
              shall be resolved in accordance with EU consumer protection guidelines.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-gray-900 mb-3">12. Contact Us</h2>
            <p className="text-gray-600 leading-relaxed">
              If you have any questions about these Terms of Service, please contact us at{' '}
              <a href="mailto:legal@skinb.eu" className="text-[#7C9C95] hover:text-[#6a8a83]">
                legal@skinb.eu
              </a>
            </p>
          </section>
        </div>
      </div>
    </div>
  );
}
