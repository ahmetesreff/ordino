import type { Metadata } from 'next';
import './globals.css';
import Header from '../components/header';

export const metadata: Metadata = {
  title: 'ORDINO | Toptan Alışveriş',
  description: 'B2B Toptan Ev Dışı Tüketim',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="bg-slate-50 text-slate-900 min-h-screen flex flex-col">
        <Header />

        <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {children}
        </main>

        <footer className="bg-slate-900 border-t border-slate-200 py-8 mt-auto">
          <div className="max-w-7xl mx-auto px-4 text-center text-slate-500 text-sm">
            © 2026 ORDINO B2B Platformu. Tüm hakları saklıdır. (Kör Pazaryeri Modeli)
          </div>
        </footer>
      </body>
    </html>
  );
}
