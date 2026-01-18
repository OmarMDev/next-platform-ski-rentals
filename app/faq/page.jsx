export const metadata = {
  title: 'FAQ',
  description: 'Frequently asked questions about SkiNB',
};

const faqs = [
  {
    question: 'What is SkiNB?',
    answer: 'SkiNB is a peer-to-peer marketplace that connects people who want to rent ski and snowboard equipment with locals who have gear available. Think of it as the sharing economy for ski equipment.'
  },
  {
    question: 'How do I rent equipment?',
    answer: 'Simply browse our listings, find the gear you need, and contact the owner directly via email. You\'ll arrange pickup details, rental duration, and payment directly with them.'
  },
  {
    question: 'How do I list my equipment for rent?',
    answer: 'Create an account and request renter status. Once approved, you can create listings with photos, descriptions, and daily rental prices. You\'ll manage your own bookings and communicate directly with renters.'
  },
  {
    question: 'Is my equipment insured?',
    answer: 'SkiNB is a marketplace that connects renters and owners. We recommend both parties discuss and agree on liability, deposits, and any insurance requirements before completing a rental.'
  },
  {
    question: 'What types of equipment can I rent or list?',
    answer: 'You can find all types of ski and snowboard gear including skis, snowboards, boots, poles, helmets, goggles, and other winter sports accessories.'
  },
  {
    question: 'How do payments work?',
    answer: 'Payments are arranged directly between the renter and equipment owner. We recommend agreeing on payment method and any security deposit before the rental begins.'
  },
  {
    question: 'What if the equipment is damaged?',
    answer: 'We encourage renters and owners to inspect equipment together at pickup and return. Any damage policy should be agreed upon beforehand. Owners may request a security deposit to cover potential damages.'
  },
  {
    question: 'How do I become a renter (list equipment)?',
    answer: 'Sign up for an account and contact us to request renter status. We\'ll review your request and upgrade your account so you can start listing your gear.'
  },
  {
    question: 'Is there a fee to use SkiNB?',
    answer: 'Currently, SkiNB is free to use for both renters and equipment owners. We may introduce optional premium features in the future.'
  },
  {
    question: 'What areas do you cover?',
    answer: 'SkiNB is available across Europe. You can find equipment near popular ski resorts and in cities throughout the continent.'
  },
  {
    question: 'How do I contact support?',
    answer: 'You can reach our support team at support@skinb.eu. We typically respond within 24-48 hours.'
  },
  {
    question: 'Can I cancel a rental?',
    answer: 'Cancellation policies are set by individual equipment owners. We recommend discussing cancellation terms before confirming any rental arrangement.'
  }
];

export default function FAQPage() {
  return (
    <div className="py-8 max-w-3xl mx-auto">
      <div className="bg-white rounded-[32px] p-8 md:p-12 shadow-sm border border-gray-100">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Frequently Asked Questions</h1>
        <p className="text-gray-500 mb-8">Everything you need to know about SkiNB</p>
        
        <div className="space-y-6">
          {faqs.map((faq, index) => (
            <div key={index} className="border-b border-gray-100 pb-6 last:border-0 last:pb-0">
              <h2 className="text-lg font-semibold text-gray-900 mb-2">
                {faq.question}
              </h2>
              <p className="text-gray-600 leading-relaxed">
                {faq.answer}
              </p>
            </div>
          ))}
        </div>
        
        <div className="mt-10 p-6 bg-[#7C9C95]/10 rounded-2xl text-center">
          <h3 className="font-semibold text-gray-900 mb-2">Still have questions?</h3>
          <p className="text-gray-600 mb-4">
            Can't find what you're looking for? We're here to help.
          </p>
          <a 
            href="mailto:support@skinb.eu" 
            className="inline-flex px-6 py-3 bg-[#7C9C95] text-white rounded-full font-medium hover:bg-[#6a8a83] transition-all"
          >
            Contact Support
          </a>
        </div>
      </div>
    </div>
  );
}
