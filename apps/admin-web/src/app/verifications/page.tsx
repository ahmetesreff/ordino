import { Card, CardHeader, CardTitle, CardContent } from '@repo/ui/card';
import { Button } from '@repo/ui/button';

export default function VerificationsPage() {
    return (
        <div className="space-y-6">
            <div>
                <h2 className="text-3xl font-bold tracking-tight">Business Verifications</h2>
                <p className="text-slate-500 mt-2">Approve or reject B2B user registrations.</p>
            </div>

            <div className="grid gap-6">
                <Card className="border-orange-200">
                    <CardHeader className="bg-orange-50 rounded-t-lg border-b border-orange-100">
                        <CardTitle className="text-orange-800 flex justify-between items-center">
                            <span>Şefin Yeri Restoran (Buyer)</span>
                            <span className="text-xs bg-orange-200 text-orange-900 px-2 py-1 rounded-full uppercase tracking-wider">Pending</span>
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="pt-6">
                        <div className="grid grid-cols-2 gap-4 text-sm">
                            <div>
                                <span className="text-slate-500 block">Tax Number (VKN):</span>
                                <span className="font-mono bg-slate-100 px-1 py-0.5 rounded">1234567890</span>
                            </div>
                            <div>
                                <span className="text-slate-500 block">Tax Office:</span>
                                <span className="font-medium">Beyoğlu VD</span>
                            </div>
                            <div className="col-span-2">
                                <span className="text-slate-500 block">Company Name:</span>
                                <span className="font-medium">Şef Gıda Turizm San. Tic. Ltd. Şti.</span>
                            </div>
                        </div>
                        <div className="mt-6 flex space-x-3">
                            <Button className="bg-green-600 hover:bg-green-700">Approve</Button>
                            <Button variant="destructive">Reject</Button>
                            <Button variant="outline">Request Info</Button>
                        </div>
                    </CardContent>
                </Card>

                <Card className="border-orange-200">
                    <CardHeader className="bg-orange-50 rounded-t-lg border-b border-orange-100">
                        <CardTitle className="text-orange-800 flex justify-between items-center">
                            <span>Emin Toptan Gıda (Seller)</span>
                            <span className="text-xs bg-orange-200 text-orange-900 px-2 py-1 rounded-full uppercase tracking-wider">Pending</span>
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="pt-6">
                        <div className="grid grid-cols-2 gap-4 text-sm">
                            <div>
                                <span className="text-slate-500 block">Tax Number (VKN):</span>
                                <span className="font-mono bg-slate-100 px-1 py-0.5 rounded">9876543210</span>
                            </div>
                            <div>
                                <span className="text-slate-500 block">Tax Office:</span>
                                <span className="font-medium">Kağıthane VD</span>
                            </div>
                            <div className="col-span-2">
                                <span className="text-slate-500 block">Company Name:</span>
                                <span className="font-medium">Emin Toptancılık ve Dağıtım A.Ş.</span>
                            </div>
                        </div>
                        <div className="mt-6 flex space-x-3">
                            <Button className="bg-green-600 hover:bg-green-700">Approve</Button>
                            <Button variant="destructive">Reject</Button>
                            <Button variant="outline">Request Info</Button>
                        </div>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}
