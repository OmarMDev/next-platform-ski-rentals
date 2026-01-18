import '../styles/globals.css';
import { Footer } from '../components/footer';
import { Header } from '../components/header';

export const metadata = {
    title: {
        template: '%s | SkiNB',
        default: 'SkiNB - Ski Rental Marketplace'
    },
    description: 'Rent ski equipment from locals in Europe'
};

export default function RootLayout({ children }) {
    return (
        <html lang="en">
            <head>
                <link rel="icon" href="/favicon.svg" sizes="any" />
            </head>
            <body className="antialiased text-gray-900 bg-[#F8F8F8]">
                <div className="flex flex-col min-h-screen">
                    <div className="flex flex-col w-full max-w-6xl mx-auto grow px-6 sm:px-12">
                        <Header />
                        <main className="grow py-8">{children}</main>
                        <Footer />
                    </div>
                </div>
            </body>
        </html>
    );
}
