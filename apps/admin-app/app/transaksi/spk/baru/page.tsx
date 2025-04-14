"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Wrapper } from "@shared/components/Wrapper";
import { Header } from "@shared/components/Header";
import { Input } from "libs/ui-components/src/components/ui/input";
import { Label } from "libs/ui-components/src/components/ui/label";
import { Button } from "libs/ui-components/src/components/ui/button";
import { LuSave } from "react-icons/lu";
import { TbCancel } from "react-icons/tb";
import { useToast } from "libs/ui-components/src/hooks/use-toast";
import { api } from "libs/utils/apiClient";

export default function NewSPK() {
    const { toast } = useToast();
    const router = useRouter();

    const [formData, setFormData] = useState({
        code: "",
        name: "",
        amount: "",
        category: "",
        serviceCode: "",
        minItem: "",
        endDate: "",
    });

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setFormData({ ...formData, [e.target.id]: e.target.value });
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        console.log("Data sebelum dikirim:", formData);

        // Konversi data sebelum dikirim ke API
        const formattedData = {
            ...formData,
            amount: Number(formData.amount) || 0, // Pastikan amount berupa number
            minItem: Number(formData.minItem) || 0, // Pastikan minItem berupa number
            endDate: formData.endDate ? `${formData.endDate}T12:00:00.000Z` : null, // Format tanggal ke ISO 8601
        };

        console.log("Data yang dikirim:", formattedData);

        try {
            await api.post("/promo", formattedData);
            toast({
                title: "Berhasil",
                description: "Diskon berhasil ditambahkan!",
                variant: "default",
            });
            router.push("/master-data/diskon");
        } catch (error) {
            toast({
                title: "Gagal",
                description: "Terjadi kesalahan saat menambahkan diskon.",
                variant: "destructive",
            });
        }
    };

    return (
        <Wrapper>
            <Header label="Tambah Diskon Baru" />
            <form className="space-y-4" onSubmit={handleSubmit}>
                <div className="flex items-center space-x-4">
                    <Label htmlFor="code" className="w-1/4 font-semibold">Kode Diskon</Label>
                    <Input placeholder="Masukkan Kode Diskon" id="code" value={formData.code} onChange={handleChange} />
                </div>
                <div className="flex items-center space-x-4">
                    <Label htmlFor="name" className="w-1/4 font-semibold">Nama Diskon</Label>
                    <Input placeholder="Masukkan Nama Diskon" id="name" value={formData.name} onChange={handleChange} />
                </div>
                <div className="flex items-center space-x-4">
                    <Label htmlFor="amount" className="w-1/4 font-semibold">Potongan Harga</Label>
                    <Input placeholder="Masukkan Potongan Harga" type="number" id="amount" value={formData.amount} onChange={handleChange} />
                </div>
                <div className="flex items-center space-x-4">
                    <Label htmlFor="category" className="w-1/4 font-semibold">Kategori</Label>
                    <Input placeholder="Masukkan Kategori" id="category" value={formData.category} onChange={handleChange} />
                </div>
                <div className="flex items-center space-x-4">
                    <Label htmlFor="serviceCode" className="w-1/4 font-semibold">Layanan</Label>
                    <Input placeholder="Masukkan Kode Layanan" id="serviceCode" value={formData.serviceCode} onChange={handleChange} />
                </div>
                <div className="flex items-center space-x-4">
                    <Label htmlFor="minItem" className="w-1/4 font-semibold">Minimal Item</Label>
                    <Input placeholder="Masukkan Minimal Item" type="number" id="minItem" value={formData.minItem} onChange={handleChange} />
                </div>
                <div className="flex items-center space-x-4">
                    <Label htmlFor="endDate" className="w-1/4 font-semibold">Masa Berlaku</Label>
                    <Input type="date" className="flex w-full" id="endDate" value={formData.endDate} onChange={handleChange} />
                </div>
                <div className="flex items-center space-x-4">
                    <div className="w-1/4"></div>
                    <div className="space-x-2 flex w-full">
                        <Button type="button" variant="destructive" className="text-foreground w-[10lvw]" onClick={() => router.back()}>
                            <TbCancel />
                            Batal
                        </Button>
                        <Button type="submit" variant="default" className="bg-success text-foreground hover:bg-green-600 w-[10lvw]">
                            <LuSave />
                            Simpan
                        </Button>
                    </div>
                </div>
            </form>
        </Wrapper>
    );
}
