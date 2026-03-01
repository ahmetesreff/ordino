import { Card, CardContent } from '@repo/ui/card';
import { Button } from '@repo/ui/button';
import { ShoppingCart, Star } from 'lucide-react';

const MOCK_SKUS = [
  { id: 1, name: "Komili Ayçiçek Yağı PET", size: "5 Litre", brand: "Komili", lowestPrice: 285.50, stock: true },
  { id: 2, name: "Sinangil Çok Amaçlı Un", size: "25 Kg", brand: "Sinangil", lowestPrice: 420.00, stock: true },
  { id: 3, name: "Torku Toz Şeker", size: "50 Kg", brand: "Torku", lowestPrice: 1250.00, stock: false },
  { id: 4, name: "İçim Yarım Yağlı Süt", size: "1 L x 12", brand: "İçim", lowestPrice: 299.90, stock: true },
];

export default function BuyerCatalog() {
  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-extrabold text-slate-900">Toptan Ürün Kataloğu</h2>
          <p className="text-slate-500 mt-1">Bölgenizdeki en uygun toptan fiyatlar (KDV Hariç)</p>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {MOCK_SKUS.map((sku) => (
          <Card key={sku.id} className="group overflow-hidden flex flex-col hover:border-blue-300 transition-all shadow-sm hover:shadow-md">
            <div className="h-48 bg-slate-100 flex items-center justify-center p-6 relative">
              <span className="absolute top-3 left-3 bg-white px-2 py-1 text-xs font-bold rounded text-slate-600 shadow-sm border border-slate-200">
                {sku.brand}
              </span>
              <div className="w-24 h-24 bg-slate-300 rounded-lg opacity-20 group-hover:scale-110 transition-transform duration-500"></div>
            </div>

            <CardContent className="p-5 flex-1 flex flex-col">
              <div className="text-xs text-slate-500 font-medium mb-1">{sku.size}</div>
              <h3 className="font-bold text-lg leading-tight text-slate-900 mb-4 line-clamp-2">{sku.name}</h3>

              <div className="mt-auto">
                <div className="flex items-baseline mb-4">
                  <span className="text-2xl font-black text-blue-600">₺{sku.lowestPrice.toFixed(2)}</span>
                  <span className="text-xs text-slate-500 ml-1">/ad</span>
                </div>

                {sku.stock ? (
                  <Button className="w-full font-bold shadow-sm" size="lg">
                    <ShoppingCart className="mr-2 h-5 w-5" /> Sepete Ekle
                  </Button>
                ) : (
                  <Button variant="secondary" className="w-full font-bold" size="lg" disabled>
                    Tükendi
                  </Button>
                )}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
