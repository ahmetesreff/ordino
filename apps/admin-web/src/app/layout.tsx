import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'ORDINO | Admin Dashboard',
  description: 'Manage ORDINO B2B Platform',
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
          <aside className="w-64 bg-slate-900 text-white min-h-screen p-6 fixed">
            <h1 className="text-2xl font-bold mb-8 tracking-wider">ORDINO <span className="text-blue-500">ADMIN</span></h1>
            <nav className="space-y-4">
              <a href="/verifications" className="block text-slate-300 hover:text-white hover:bg-slate-800 p-2 rounded">Verifications</a>
              <a href="/catalog" className="block text-slate-300 hover:text-white hover:bg-slate-800 p-2 rounded">Master Catalog</a>
              <a href="/orders" className="block text-slate-300 hover:text-white hover:bg-slate-800 p-2 rounded">Orders Overview</a>
              <a href="/escrow" className="block text-slate-300 hover:text-white hover:bg-slate-800 p-2 rounded">Escrow Management</a>
            </nav>
          </aside>
          <main className="flex-1 ml-64 p-10 bg-slate-50 min-h-screen">
            {children}
          </main>
        </div>
      </body>
    </html>
  );
}
