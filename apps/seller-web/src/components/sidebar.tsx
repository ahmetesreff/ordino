'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { LogOut } from 'lucide-react';
import { getUser, clearAuth } from '../lib/auth';

export default function Sidebar() {
  const router = useRouter();
  const [storeName, setStoreName] = useState('');
  const [bizCode, setBizCode] = useState('');

  useEffect(() => {
    const user = getUser();
    setStoreName(user?.business?.storeName || user?.email || '');
    setBizCode(user?.business?.bizCode || '');
  }, []);

  function handleLogout() {
    clearAuth();
    router.push('/login');
  }

  return (
    <aside className="w-64 bg-emerald-900 text-white min-h-screen p-6 fixed shadow-xl z-10">
      <h1 className="text-2xl font-bold mb-2 tracking-wider">ORDINO</h1>
      <p className="text-emerald-300 text-xs mb-8 uppercase tracking-widest font-semibold">Satıcı Paneli</p>
      <nav className="space-y-2">
        <a href="/" className="block text-emerald-100 hover:text-white hover:bg-emerald-800 p-2 rounded transition">
          Dashboard
        </a>
        <a href="/offers" className="block text-emerald-100 hover:text-white hover:bg-emerald-800 p-2 rounded transition">
          Tekliflerim
        </a>
        <a href="/orders" className="block text-emerald-100 hover:text-white hover:bg-emerald-800 p-2 rounded transition relative">
          Gelen Siparişler
          <span className="absolute top-2.5 right-2 flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75" />
            <span className="relative inline-flex rounded-full h-2 w-2 bg-red-500" />
          </span>
        </a>
        <a href="/finances" className="block text-emerald-100 hover:text-white hover:bg-emerald-800 p-2 rounded transition">
          Cari & Finansman
        </a>
      </nav>
      <div className="absolute bottom-6 left-6 right-6 border-t border-emerald-800 pt-4">
        <p className="text-sm font-semibold truncate">{storeName}</p>
        {bizCode && <p className="text-xs text-emerald-400">{bizCode}</p>}
        <button
          onClick={handleLogout}
          className="mt-3 flex items-center gap-2 text-xs text-emerald-300 hover:text-white transition"
        >
          <LogOut size={14} /> Çıkış Yap
        </button>
      </div>
    </aside>
  );
}
