export const metadata = {
  title: 'Privacy Policy',
  description: 'SkiNB Privacy Policy - How we handle your data',
};

export default function PrivacyPolicyPage() {
  return (
    <div className="py-8 max-w-3xl mx-auto">
      <div className="bg-white rounded-[32px] p-8 md:p-12 shadow-sm border border-gray-100">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Privacy Policy</h1>
        <p className="text-gray-500 mb-8">Last updated: January 2026</p>
        
        <div className="prose prose-gray max-w-none space-y-6">
          <section>
            <h2 className="text-xl font-semibold text-gray-900 mb-3">1. Introduction</h2>
            <p className="text-gray-600 leading-relaxed">
              Welcome to SkiNB. We respect your privacy and are committed to protecting your personal data. 
              This privacy policy explains how we collect, use, and safeguard your information when you use our platform.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-gray-900 mb-3">2. Information We Collect</h2>
            <p className="text-gray-600 leading-relaxed mb-3">We collect information you provide directly to us, including:</p>
            <ul className="list-disc list-inside text-gray-600 space-y-2">
              <li>Account information (name, email address)</li>
              <li>Profile information you choose to provide</li>
              <li>Listing information (descriptions, images, pricing)</li>
              <li>Communications between users</li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-gray-900 mb-3">3. How We Use Your Information</h2>
            <p className="text-gray-600 leading-relaxed mb-3">We use the information we collect to:</p>
            <ul className="list-disc list-inside text-gray-600 space-y-2">
              <li>Provide, maintain, and improve our services</li>
              <li>Process transactions and send related information</li>
              <li>Send technical notices and support messages</li>
              <li>Respond to your comments and questions</li>
              <li>Protect against fraudulent or illegal activity</li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-gray-900 mb-3">4. Information Sharing</h2>
            <p className="text-gray-600 leading-relaxed">
              We do not sell your personal information. We may share your information with third parties only 
              in the following circumstances: with your consent, to comply with legal obligations, to protect 
              our rights, or with service providers who assist in our operations.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-gray-900 mb-3">5. Data Security</h2>
            <p className="text-gray-600 leading-relaxed">
              We implement appropriate technical and organizational measures to protect your personal data 
              against unauthorized access, alteration, disclosure, or destruction. However, no method of 
              transmission over the Internet is 100% secure.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-gray-900 mb-3">6. Your Rights</h2>
            <p className="text-gray-600 leading-relaxed mb-3">You have the right to:</p>
            <ul className="list-disc list-inside text-gray-600 space-y-2">
              <li>Access and receive a copy of your personal data</li>
              <li>Rectify inaccurate personal data</li>
              <li>Request deletion of your personal data</li>
              <li>Object to processing of your personal data</li>
              <li>Withdraw consent at any time</li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-gray-900 mb-3">7. Cookies</h2>
            <p className="text-gray-600 leading-relaxed">
              We use cookies and similar technologies to provide and improve our services, analyze usage, 
              and for authentication purposes. You can control cookies through your browser settings.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-gray-900 mb-3">8. Changes to This Policy</h2>
            <p className="text-gray-600 leading-relaxed">
              We may update this privacy policy from time to time. We will notify you of any changes by 
              posting the new policy on this page and updating the "Last updated" date.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-gray-900 mb-3">9. Contact Us</h2>
            <p className="text-gray-600 leading-relaxed">
              If you have any questions about this Privacy Policy, please contact us at{' '}
              <a href="mailto:privacy@skinb.eu" className="text-[#7C9C95] hover:text-[#6a8a83]">
                privacy@skinb.eu
              </a>
            </p>
          </section>
        </div>
      </div>
    </div>
  );
}
