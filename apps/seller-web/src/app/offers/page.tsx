import { Card, CardHeader, CardTitle, CardContent } from '@repo/ui/card';
import { Button } from '@repo/ui/button';
import { Input } from '@repo/ui/input';

export default function OffersPage() {
    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <div>
                    <h2 className="text-3xl font-bold tracking-tight text-slate-900">Teklif Yönetimi</h2>
                    <p className="text-slate-500 mt-1">Katalogdaki ürünler için satış fiyatlarınızı belirleyin.</p>
                </div>
                <Button className="bg-emerald-600 hover:bg-emerald-700">+ Yeni Teklif (Fiyat Ver)</Button>
            </div>

            <Card>
                <CardHeader>
                    <div className="flex justify-between items-center">
                        <CardTitle className="text-lg">Aktif Tekliflerim</CardTitle>
                        <div className="flex items-center space-x-2">
                            <Input placeholder="GTIN veya Ürün Ara..." className="w-64" />
                        </div>
                    </div>
                </CardHeader>
                <CardContent>
                    <div className="border rounded-md overflow-hidden">
                        <table className="w-full text-sm text-left">
                            <thead className="bg-slate-50 border-b">
                                <tr>
                                    <th className="px-6 py-3 font-medium text-slate-500">Ürün (Master SKU)</th>
                                    <th className="px-6 py-3 font-medium text-slate-500">Birim Fiyat (KDV Hariç)</th>
                                    <th className="px-6 py-3 font-medium text-slate-500">Stok</th>
                                    <th className="px-6 py-3 font-medium text-slate-500">Min. Sipariş</th>
                                    <th className="px-6 py-3 font-medium text-slate-500 text-right">İşlem</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-100">
                                <tr className="hover:bg-slate-50">
                                    <td className="px-6 py-4">
                                        <div className="font-semibold">Komili Ayçiçek Yağı PET 5 Litre</div>
                                        <div className="text-xs text-slate-400 font-mono">GTIN: 8690555123456</div>
                                    </td>
                                    <td className="px-6 py-4 font-bold text-emerald-700">₺285.50</td>
                                    <td className="px-6 py-4">150 Koli</td>
                                    <td className="px-6 py-4">5 Koli</td>
                                    <td className="px-6 py-4 text-right">
                                        <Button variant="outline" size="sm" className="text-blue-600">Güncelle</Button>
                                    </td>
                                </tr>
                                <tr className="hover:bg-slate-50">
                                    <td className="px-6 py-4">
                                        <div className="font-semibold">Sinangil Çok Amaçlı Un 25 Kg</div>
                                        <div className="text-xs text-slate-400 font-mono">GTIN: 8690555987654</div>
                                    </td>
                                    <td className="px-6 py-4 font-bold text-emerald-700">₺420.00</td>
                                    <td className="px-6 py-4 text-red-500 font-medium">Tükendi (0)</td>
                                    <td className="px-6 py-4">10 Çuval</td>
                                    <td className="px-6 py-4 text-right">
                                        <Button variant="outline" size="sm" className="text-blue-600">Güncelle</Button>
                                    </td>
                                </tr>
                            </tbody>
                        </table>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}
