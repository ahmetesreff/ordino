import type { Metadata } from 'next';
import './globals.css';
import { ShoppingCart, LogOut, PackageSearch, History } from 'lucide-react';

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
        {/* Navbar */}
        <header className="bg-blue-600 text-white shadow-md sticky top-0 z-50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
            <div className="flex items-center space-x-8">
              <h1 className="text-2xl font-black tracking-wider text-white">ORDINO</h1>
              <nav className="hidden md:flex space-x-6 text-sm font-medium text-blue-100">
                <a href="/" className="hover:text-white flex items-center gap-2"><PackageSearch size={18} /> Ürün Kataloğu</a>
                <a href="/orders" className="hover:text-white flex items-center gap-2"><History size={18} /> Siparişlerim</a>
              </nav>
            </div>
            <div className="flex items-center space-x-6">
              <a href="/cart" className="relative text-white hover:text-blue-200 transition">
                <ShoppingCart size={24} />
                <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs font-bold rounded-full h-5 w-5 flex items-center justify-center">
                  3
                </span>
              </a>
              <div className="h-6 w-px bg-blue-400"></div>
              <div className="flex items-center space-x-2 text-sm">
                <span className="font-semibold">Şefin Yeri Ltd. Şti.</span>
                <button className="text-blue-200 hover:text-white"><LogOut size={18} /></button>
              </div>
            </div>
          </div>
        </header>

        {/* Main Content */}
        <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {children}
        </main>

        {/* Footer */}
        <footer className="bg-slate-900 border-t border-slate-200 py-8 mt-auto">
          <div className="max-w-7xl mx-auto px-4 text-center text-slate-500 text-sm">
            © 2026 ORDINO B2B Platformu. Tüm hakları saklıdır. (Kör Pazaryeri Modeli)
          </div>
        </footer>
      </body>
    </html>
  );
}
