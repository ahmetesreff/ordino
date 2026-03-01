import { Card, CardHeader, CardTitle, CardContent } from '@repo/ui/card';
import { Button } from '@repo/ui/button';
import { Trash2 } from 'lucide-react';

export default function CartPage() {
    return (
        <div className="max-w-4xl mx-auto space-y-8">
            <h2 className="text-3xl font-bold tracking-tight text-slate-900 border-b pb-4">Alışveriş Sepeti</h2>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                <div className="md:col-span-2 space-y-4">
                    <Card className="shadow-sm">
                        <CardContent className="p-6 flex items-center justify-between">
                            <div>
                                <h3 className="font-bold text-lg">Komili Ayçiçek Yağı PET (5 Litre)</h3>
                                <p className="text-sm text-slate-500">Satıcı: Emin Toptan Gıda (WHS-104)</p>
                                <div className="mt-2 flex items-center space-x-4">
                                    <span className="font-semibold text-blue-600">₺285.50</span>
                                    <span className="text-sm text-slate-400">Min. Spş: 5 Adet</span>
                                </div>
                            </div>
                            <div className="flex flex-col items-end space-y-4">
                                <Button variant="ghost" size="icon" className="text-red-500 hover:text-red-700 hover:bg-red-50">
                                    <Trash2 size={18} />
                                </Button>
                                <div className="flex items-center border rounded-md">
                                    <button className="px-3 py-1 bg-slate-100 hover:bg-slate-200">-</button>
                                    <span className="px-4 font-medium">10</span>
                                    <button className="px-3 py-1 bg-slate-100 hover:bg-slate-200">+</button>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                </div>

                <div className="md:col-span-1">
                    <Card className="shadow-sm bg-slate-50 border-blue-100">
                        <CardHeader className="bg-blue-50/50 border-b">
                            <CardTitle className="text-lg">Sipariş Özeti</CardTitle>
                        </CardHeader>
                        <CardContent className="p-6">
                            <div className="space-y-4 text-sm">
                                <div className="flex justify-between">
                                    <span className="text-slate-500">Ara Toplam</span>
                                    <span className="font-medium">₺2,855.00</span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-slate-500">KDV (%20)</span>
                                    <span className="font-medium">₺571.00</span>
                                </div>
                                <div className="pt-4 border-t flex justify-between font-bold text-lg">
                                    <span>Genel Toplam</span>
                                    <span>₺3,426.00</span>
                                </div>
                            </div>

                            <Button className="w-full mt-6 h-12 text-lg shadow-sm font-semibold tracking-wide">
                                Satın Almayı Tamamla
                            </Button>
                            <p className="text-xs text-center text-slate-500 mt-4 leading-relaxed">
                                Bu aşamadan sonra siparişiniz Havale/EFT işlemi için <strong className="text-slate-700">Beklemeye (Draft)</strong> alınacaktır.
                            </p>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </div>
    );
}
