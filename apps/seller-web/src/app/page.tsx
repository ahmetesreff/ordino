import { Card, CardHeader, CardTitle, CardContent } from '@repo/ui/card';
import { Button } from '@repo/ui/button';
import { ChevronRight } from 'lucide-react';

export default function SellerDashboard() {
  return (
    <div className="space-y-8">
      <h2 className="text-3xl font-bold tracking-tight text-slate-900">Hoşgeldiniz, Emin Toptan Gıda</h2>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        <Card className="border-l-4 border-emerald-500 shadow-sm">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-slate-500 uppercase tracking-wider">Bekleyen Siparişler</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-slate-800">6</div>
            <p className="text-xs font-semibold text-emerald-600 mt-2 flex items-center">
              Aksiyona Geç <ChevronRight size={14} className="ml-1" />
            </p>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-blue-500 shadow-sm">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-slate-500 uppercase tracking-wider">Aktif Teklifler (Offers)</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-slate-800">124</div>
            <p className="text-xs text-slate-500 mt-2">Katalogdaki ürünlerdeki yayındaki fiyatlarınız</p>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-amber-500 shadow-sm">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-slate-500 uppercase tracking-wider">Aylık Ciro (Tahsil Edilen)</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-slate-800">₺245.890</div>
            <p className="text-xs text-slate-500 mt-2">+12% geçen aya göre</p>
          </CardContent>
        </Card>
      </div>

      <div className="mt-8">
        <h3 className="text-xl font-bold mb-4">Son Operasyonlar</h3>
        <Card>
          <div className="p-0">
            <table className="w-full text-sm text-left">
              <thead className="bg-slate-50 border-b">
                <tr>
                  <th className="px-6 py-4 font-medium text-slate-500">Sipariş No</th>
                  <th className="px-6 py-4 font-medium text-slate-500">Tutar</th>
                  <th className="px-6 py-4 font-medium text-slate-500">Durum</th>
                  <th className="px-6 py-4 font-medium text-slate-500">Tarih</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                <tr className="hover:bg-slate-50">
                  <td className="px-6 py-4 font-mono font-medium text-emerald-700">ORD-170852-942</td>
                  <td className="px-6 py-4 font-semibold">₺3,426.00</td>
                  <td className="px-6 py-4">
                    <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded text-xs font-semibold">ÖDENDİ - ONAY BEKLİYOR</span>
                  </td>
                  <td className="px-6 py-4 text-slate-500">Bugün, 14:30</td>
                </tr>
                <tr className="hover:bg-slate-50">
                  <td className="px-6 py-4 font-mono font-medium text-emerald-700">ORD-170851-118</td>
                  <td className="px-6 py-4 font-semibold">₺12,450.00</td>
                  <td className="px-6 py-4">
                    <span className="bg-amber-100 text-amber-800 px-2 py-1 rounded text-xs font-semibold">KARGOYA VERİLECEK</span>
                  </td>
                  <td className="px-6 py-4 text-slate-500">Bugün, 09:15</td>
                </tr>
              </tbody>
            </table>
          </div>
        </Card>
      </div>
    </div>
  );
}
