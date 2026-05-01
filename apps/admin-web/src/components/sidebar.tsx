'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { LogOut } from 'lucide-react';
import { getUser, clearAuth } from '../lib/auth';

export default function Sidebar() {
  const router = useRouter();
  const [email, setEmail] = useState('');

  useEffect(() => {
    const user = getUser();
    setEmail(user?.email || '');
  }, []);

  function handleLogout() {
    clearAuth();
    router.push('/login');
  }

  return (
    <aside className="w-64 bg-slate-900 text-white min-h-screen p-6 fixed">
      <h1 className="text-2xl font-bold mb-8 tracking-wider">
        ORDINO <span className="text-blue-500">ADMIN</span>
      </h1>
      <nav className="space-y-2">
        <a href="/verifications" className="block text-slate-300 hover:text-white hover:bg-slate-800 p-2 rounded transition">
          Verifications
        </a>
        <a href="/catalog" className="block text-slate-300 hover:text-white hover:bg-slate-800 p-2 rounded transition">
          Master Catalog
        </a>
        <a href="/orders" className="block text-slate-300 hover:text-white hover:bg-slate-800 p-2 rounded transition">
          Orders Overview
        </a>
        <a href="/escrow" className="block text-slate-300 hover:text-white hover:bg-slate-800 p-2 rounded transition">
          Escrow Management
        </a>
      </nav>
      <div className="absolute bottom-6 left-6 right-6 border-t border-slate-700 pt-4">
        <p className="text-sm text-slate-300 truncate">{email}</p>
        <button
          onClick={handleLogout}
          className="mt-3 flex items-center gap-2 text-xs text-slate-400 hover:text-white transition"
        >
          <LogOut size={14} /> Çıkış Yap
        </button>
      </div>
    </aside>
  );
}
