import Link from 'next/link';
import { AuthButton } from './auth-button';

const navItems = [
    { linkText: 'Home', href: '/' },
    { linkText: 'All Rentals', href: '/rentals' }
];

export function Header() {
    return (
        <nav className="flex items-center justify-between py-6">
            <div className="flex items-center gap-8">
                <Link href="/" className="flex items-center gap-2">
                    <div className="w-10 h-10 bg-[#7C9C95] rounded-full flex items-center justify-center">
                        <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 15l4-8 4 8M17 15l-4-8-4 8M12 3v18" />
                        </svg>
                    </div>
                    <span className="text-xl font-bold text-gray-900">SkiNB</span>
                </Link>
                {!!navItems?.length && (
                    <ul className="hidden md:flex items-center gap-6">
                        {navItems.map((item, index) => (
                            <li key={index}>
                                <Link 
                                    href={item.href} 
                                    className="text-sm font-medium text-gray-600 hover:text-gray-900 transition-colors uppercase tracking-wide"
                                >
                                    {item.linkText}
                                </Link>
                            </li>
                        ))}
                    </ul>
                )}
            </div>
            <AuthButton />
        </nav>
    );
}
