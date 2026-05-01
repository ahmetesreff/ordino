import type { Metadata } from 'next';
import './globals.css';
import Sidebar from '../components/sidebar';

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
          <Sidebar />
          <main className="flex-1 ml-64 p-10 bg-slate-50 min-h-screen">
            {children}
          </main>
        </div>
      </body>
    </html>
  );
}
