"use client";
import { usePathname, useRouter } from "next/navigation";
import { Header } from "@shared/components/Header";
import { Wrapper } from "@shared/components/Wrapper";
import { Input } from "libs/ui-components/src/components/ui/input";
import { Label } from "libs/ui-components/src/components/ui/label";
import { Button } from "libs/ui-components/src/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "libs/ui-components/src/components/ui/select";
import { LuSave } from "react-icons/lu";
import { TbCancel } from "react-icons/tb";
import { useEffect, useState } from "react";
import { api } from "libs/utils/apiClient";
import { useToast } from "libs/ui-components/src/hooks/use-toast";
import { AlertDialog, AlertDialogContent, AlertDialogHeader, AlertDialogTitle, AlertDialogDescription, AlertDialogFooter, AlertDialogAction } from "libs/ui-components/src/components/ui/alert-dialog";
import { formatDateInput } from "libs/utils/formatDate";

interface Diskon {
    code: string;
    name: string;
    category: string;
    serviceCode: string;
    amount: number;
    minItem: number;
    endDate: string;
}

export default function EditDiskon() {
    const { toast } = useToast();
    const pathname = usePathname();
    const id = pathname.split("/").pop();
    const router = useRouter();
    const [diskon, setDiskon] = useState<Diskon | null>(null);
    const [updating, setUpdating] = useState(false);
    const [showConfirmDialog, setShowConfirmDialog] = useState(false);

    useEffect(() => {
        const fetchDiskon = async () => {
            try {
                const result = await api.get(`/promo/id/${id}`);
                setDiskon(result.data);
            } catch (error) {
                console.error("Gagal mengambil data diskon:", error);
            }
        };
        fetchDiskon();
    }, [id]);

    // Handle Change untuk Input
    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setDiskon((prev) => (prev ? { ...prev, [name]: value } : null));
    };

    // Handle Change untuk Select
    const handleSelectChange = (name: keyof Diskon, value: string) => {
        setDiskon((prev) => (prev ? { ...prev, [name]: value } : null));
    };

    const handleSubmit = async () => {
        if (!diskon) return;

        setUpdating(true);
        const updatedData = {
            name: diskon.name,
            category: diskon.category,
            serviceCode: diskon.serviceCode,
            amount: diskon.amount,
            minItem: diskon.minItem,
            endDate: diskon.endDate, // Pastikan format sesuai dengan aturan API
        };

        console.log("data:", updatedData); 
        setUpdating(true);
        try {
            const response = await api.put(`/promo/${id}`, updatedData);

            console.log("Response:", response); 
            toast({
                title: "Berhasil",
                description: "Diskon berhasil diperbarui!",
                variant: "success",
            });
            router.push("/master-data/diskon");
        } catch (error) {
            console.error("Gagal memperbarui diskon:", error);
            toast({
                title: "Gagal",
                description: "Terjadi kesalahan saat mengubah data diskon.",
                variant: "destructive",
            });
        } finally {
            setUpdating(false);
        }
    };

    return (
        <Wrapper>
            <Header label={`Edit Diskon ${diskon ? diskon.name : ""}`} />
            {diskon ? (
                <form className="space-y-4">
                    {/* Kode Diskon */}
                    <div className="flex items-center space-x-4">
                        <Label className="w-1/4 font-semibold">Kode Diskon</Label>
                        <Input name="code" disabled value={diskon.code} />
                    </div>

                    {/* Nama Diskon */}
                    <div className="flex items-center space-x-4">
                        <Label className="w-1/4 font-semibold">Nama Diskon</Label>
                        <Input name="name" value={diskon.name} onChange={handleChange} />
                    </div>

                    {/* Kategori */}
                    <div className="flex items-center space-x-4">
                        <Label className="w-1/4 font-semibold">Kategori</Label>
                        <Select value={diskon.category} onValueChange={(value) => handleSelectChange("category", value)}>
                            <SelectTrigger className="w-full">
                                <SelectValue placeholder="Pilih Kategori" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="SPA">SPA</SelectItem>
                                <SelectItem value="SALON">Salon</SelectItem>
                                <SelectItem value="OTHER">Lainnya</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>

                    {/* Kode Layanan */}
                    <div className="flex items-center space-x-4">
                        <Label className="w-1/4 font-semibold">Kode Layanan</Label>
                        <Input name="serviceCode" value={diskon.serviceCode} onChange={handleChange} />
                    </div>

                    {/* Potongan Harga */}
                    <div className="flex items-center space-x-4">
                        <Label className="w-1/4 font-semibold">Potongan Harga</Label>
                        <Input type="number" name="amount" value={diskon.amount} onChange={handleChange} />
                    </div>

                    {/* Minimal Item */}
                    <div className="flex items-center space-x-4">
                        <Label className="w-1/4 font-semibold">Minimal Item</Label>
                        <Input type="number" name="minItem" value={diskon.minItem} onChange={handleChange} />
                    </div>

                    {/* Masa Berlaku */}
                    <div className="flex items-center space-x-4">
                        <Label className="w-1/4 font-semibold">Masa Berlaku</Label>
                        <Input type="date" name="endDate" value={formatDateInput(diskon.endDate)} onChange={handleChange} />
                    </div>

                    {/* Tombol Aksi */}
                    <div className="flex items-center space-x-4">
                        <div className="w-1/4"></div>
                        <div className="space-x-2 flex w-full">
                            <Button type="button" variant="destructive" onClick={() => router.push("/master-data/diskon")}>
                                <TbCancel />
                                Batal
                            </Button>
                            <Button type="button" className="bg-green-600" onClick={() => setShowConfirmDialog(true)} disabled={updating}>
                                <LuSave />
                                {updating ? "Menyimpan..." : "Simpan"}
                            </Button>
                        </div>
                    </div>
                </form>
            ) : (
                <p className="text-center py-4 text-red-500">Diskon tidak ditemukan!</p>
            )}

            {/* Dialog Konfirmasi Simpan */}
            <AlertDialog open={showConfirmDialog} onOpenChange={setShowConfirmDialog}>
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle>Apakah Anda yakin menyimpan data ini?</AlertDialogTitle>
                        <AlertDialogDescription>
                            Jika "Ya", data akan diperbarui. Jika "Tidak", proses dibatalkan.
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                        <Button variant="outline" onClick={() => setShowConfirmDialog(false)}>Tidak</Button>
                        <AlertDialogAction onClick={handleSubmit}>Ya</AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>
        </Wrapper>
    );
}
