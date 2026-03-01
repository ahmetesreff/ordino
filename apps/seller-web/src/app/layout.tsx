import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'ORDINO | Toptancı Paneli',
  description: 'Toptancı Satış ve Teklif Yönetimi',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="bg-slate-50 text-slate-900 min-h-screen">
        <div className="flex bg-slate-100 min-h-screen">
          <aside className="w-64 bg-emerald-900 text-white min-h-screen p-6 fixed shadow-xl z-10">
            <h1 className="text-2xl font-bold mb-2 tracking-wider">ORDINO</h1>
            <p className="text-emerald-300 text-xs mb-8 uppercase tracking-widest font-semibold">Satıcı Paneli</p>
            <nav className="space-y-4">
              <a href="/" className="block text-emerald-100 hover:text-white hover:bg-emerald-800 p-2 rounded transition">Dashboard</a>
              <a href="/offers" className="block text-emerald-100 hover:text-white hover:bg-emerald-800 p-2 rounded transition">Tekliflerim (Offers)</a>
              <a href="/orders" className="block text-emerald-100 hover:text-white hover:bg-emerald-800 p-2 rounded transition relative">
                Gelen Siparişler
                <span className="absolute top-2 right-2 flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-red-500"></span>
                </span>
              </a>
              <a href="/finances" className="block text-emerald-100 hover:text-white hover:bg-emerald-800 p-2 rounded transition">Cari & Finansman</a>
            </nav>
            <div className="absolute bottom-6 left-6 right-6 p-4 border-t border-emerald-800">
              <p className="text-sm font-semibold truncate">Emin Toptan Gıda</p>
              <p className="text-xs text-emerald-400">WHS-104</p>
            </div>
          </aside>
          <main className="flex-1 ml-64 p-10 bg-slate-50 min-h-screen">
            {children}
          </main>
        </div>
      </body>
    </html>
  );
}
