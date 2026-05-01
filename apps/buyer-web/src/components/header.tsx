'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { ShoppingCart, LogOut, PackageSearch, History } from 'lucide-react';
import { getUser, clearAuth } from '../lib/auth';

export default function Header({ cartCount = 0 }: { cartCount?: number }) {
  const router = useRouter();
  const [storeName, setStoreName] = useState('');

  useEffect(() => {
    const user = getUser();
    setStoreName(user?.business?.storeName || user?.email || '');
  }, []);

  function handleLogout() {
    clearAuth();
    router.push('/login');
  }

  return (
    <header className="bg-blue-600 text-white shadow-md sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        <div className="flex items-center space-x-8">
          <h1 className="text-2xl font-black tracking-wider text-white">ORDINO</h1>
          <nav className="hidden md:flex space-x-6 text-sm font-medium text-blue-100">
            <a href="/" className="hover:text-white flex items-center gap-2">
              <PackageSearch size={18} /> Ürün Kataloğu
            </a>
            <a href="/orders" className="hover:text-white flex items-center gap-2">
              <History size={18} /> Siparişlerim
            </a>
          </nav>
        </div>
        <div className="flex items-center space-x-6">
          <a href="/cart" className="relative text-white hover:text-blue-200 transition">
            <ShoppingCart size={24} />
            {cartCount > 0 && (
              <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs font-bold rounded-full h-5 w-5 flex items-center justify-center">
                {cartCount}
              </span>
            )}
          </a>
          <div className="h-6 w-px bg-blue-400" />
          <div className="flex items-center space-x-2 text-sm">
            <span className="font-semibold">{storeName}</span>
            <button onClick={handleLogout} className="text-blue-200 hover:text-white">
              <LogOut size={18} />
            </button>
          </div>
        </div>
      </div>
    </header>
  );
}
