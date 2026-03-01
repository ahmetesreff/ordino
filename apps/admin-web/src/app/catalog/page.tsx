import { Card, CardHeader, CardTitle, CardContent } from '@repo/ui/card';
import { Button } from '@repo/ui/button';
import { Input } from '@repo/ui/input';

export default function CatalogPage() {
    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <h2 className="text-3xl font-bold tracking-tight">Master Catalog</h2>
                <Button>+ Add New Master SKU</Button>
            </div>

            <Card>
                <CardHeader>
                    <CardTitle>Catalog Items</CardTitle>
                    <div className="flex items-center space-x-2 mt-4">
                        <Input placeholder="Search by GTIN or Product Name..." className="max-w-sm" />
                        <Button variant="secondary">Filter Categories</Button>
                    </div>
                </CardHeader>
                <CardContent>
                    <div className="rounded-md border mt-4 overflow-hidden">
                        <table className="w-full text-sm text-left">
                            <thead className="bg-slate-100 text-slate-700">
                                <tr>
                                    <th className="px-4 py-3 font-medium">GTIN</th>
                                    <th className="px-4 py-3 font-medium">Brand</th>
                                    <th className="px-4 py-3 font-medium">Product Name</th>
                                    <th className="px-4 py-3 font-medium">Pack Size</th>
                                    <th className="px-4 py-3 font-medium text-right">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y">
                                <tr className="hover:bg-slate-50 transition-colors">
                                    <td className="px-4 py-3 font-mono text-xs">8690555123456</td>
                                    <td className="px-4 py-3 font-semibold">Komili</td>
                                    <td className="px-4 py-3">Ayçiçek Yağı PET</td>
                                    <td className="px-4 py-3 text-slate-500">5 Litre</td>
                                    <td className="px-4 py-3 text-right">
                                        <Button variant="ghost" size="sm" className="text-blue-600">Edit</Button>
                                    </td>
                                </tr>
                                <tr className="hover:bg-slate-50 transition-colors">
                                    <td className="px-4 py-3 font-mono text-xs">8690555987654</td>
                                    <td className="px-4 py-3 font-semibold">Sinangil</td>
                                    <td className="px-4 py-3">Çok Amaçlı Buğday Unu</td>
                                    <td className="px-4 py-3 text-slate-500">25 Kg Çuval</td>
                                    <td className="px-4 py-3 text-right">
                                        <Button variant="ghost" size="sm" className="text-blue-600">Edit</Button>
                                    </td>
                                </tr>
                                <tr className="hover:bg-slate-50 transition-colors">
                                    <td className="px-4 py-3 font-mono text-xs">8690666112233</td>
                                    <td className="px-4 py-3 font-semibold">Torku</td>
                                    <td className="px-4 py-3">Toz Şeker</td>
                                    <td className="px-4 py-3 text-slate-500">50 Kg Çuval</td>
                                    <td className="px-4 py-3 text-right">
                                        <Button variant="ghost" size="sm" className="text-blue-600">Edit</Button>
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
