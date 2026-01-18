import Link from 'next/link';

export function Footer() {
    return (
        <footer className="py-12 border-t border-gray-200 mt-auto">
            <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
                <div className="flex items-center gap-2">
                    <div className="w-8 h-8 bg-[#7C9C95] rounded-full flex items-center justify-center">
                        <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 15l4-8 4 8M17 15l-4-8-4 8M12 3v18" />
                        </svg>
                    </div>
                    <span className="font-semibold text-gray-900">SkiNB</span>
                </div>
                <p className="text-sm text-gray-500">
                    © {new Date().getFullYear()} SkiNB. Ski rental marketplace for Europe.
                </p>
                <div className="flex items-center gap-4 text-sm text-gray-500">
                    <Link href="/about" className="hover:text-gray-900 transition-colors">
                        About
                    </Link>
                    <Link href="/faq" className="hover:text-gray-900 transition-colors">
                        FAQ
                    </Link>
                    <Link href="/privacy" className="hover:text-gray-900 transition-colors">
                        Privacy
                    </Link>
                    <Link href="/terms" className="hover:text-gray-900 transition-colors">
                        Terms
                    </Link>
                </div>
            </div>
        </footer>
    );
}
