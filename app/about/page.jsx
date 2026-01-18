export const metadata = {
  title: 'About Us',
  description: 'Learn about SkiNB - The ski rental marketplace for Europe',
};

export default function AboutPage() {
  return (
    <div className="py-8 max-w-3xl mx-auto">
      <div className="bg-white rounded-[32px] p-8 md:p-12 shadow-sm border border-gray-100">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">About SkiNB</h1>
        
        <div className="prose prose-gray max-w-none space-y-6">
          <section>
            <h2 className="text-xl font-semibold text-gray-900 mb-3">Our Mission</h2>
            <p className="text-gray-600 leading-relaxed">
              SkiNB was founded with a simple idea: make skiing more accessible and affordable for everyone. 
              We connect ski enthusiasts across Europe, enabling them to rent quality equipment from locals 
              instead of expensive rental shops.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-gray-900 mb-3">What We Do</h2>
            <p className="text-gray-600 leading-relaxed">
              We're a peer-to-peer marketplace that brings together people who have ski and snowboard 
              equipment with those who need it. Whether you're a seasoned skier with extra gear or a 
              beginner looking to try the sport without a big investment, SkiNB is here for you.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-gray-900 mb-3">Why Choose SkiNB?</h2>
            <ul className="list-disc list-inside text-gray-600 space-y-3">
              <li>
                <span className="font-medium text-gray-900">Save Money</span> — Rent from locals at a 
                fraction of traditional rental shop prices
              </li>
              <li>
                <span className="font-medium text-gray-900">Quality Gear</span> — Access well-maintained 
                equipment from passionate ski enthusiasts
              </li>
              <li>
                <span className="font-medium text-gray-900">Local Experience</span> — Connect with locals 
                who can share tips about the best slopes and hidden gems
              </li>
              <li>
                <span className="font-medium text-gray-900">Sustainable</span> — Give equipment a second 
                life instead of letting it collect dust
              </li>
              <li>
                <span className="font-medium text-gray-900">Flexible</span> — Find exactly what you need, 
                when you need it, with convenient local pickup
              </li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-gray-900 mb-3">Our Community</h2>
            <p className="text-gray-600 leading-relaxed">
              SkiNB is more than just a rental platform — it's a community of ski and snowboard lovers 
              who share a passion for the mountains. Our users range from professional athletes with 
              top-tier equipment to families looking to introduce their kids to winter sports.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-gray-900 mb-3">Get Started</h2>
            <p className="text-gray-600 leading-relaxed">
              Ready to hit the slopes? Browse our listings to find the perfect gear for your next 
              adventure. Have equipment sitting in your garage? List it on SkiNB and earn extra income 
              while helping others enjoy the sport you love.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-gray-900 mb-3">Contact Us</h2>
            <p className="text-gray-600 leading-relaxed">
              Have questions or feedback? We'd love to hear from you! Reach out at{' '}
              <a href="mailto:hello@skinb.eu" className="text-[#7C9C95] hover:text-[#6a8a83]">
                hello@skinb.eu
              </a>
            </p>
          </section>
        </div>
      </div>
    </div>
  );
}
