"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { Wrapper } from "@shared/components/Wrapper";
import { Input } from "libs/ui-components/src/components/ui/input";
import { Label } from "libs/ui-components/src/components/ui/label";
import { Button } from "libs/ui-components/src/components/ui/button";
import { useToast } from "libs/ui-components/src/hooks/use-toast";
import { api } from "libs/utils/apiClient";
import { Breadcrumbs } from "@shared/components/ui/Breadcrumbs";
import { RadioGroup, RadioGroupItem } from "@ui-components/components/ui/radio-group";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue, SelectGroup, SelectLabel } from "libs/ui-components/src/components/ui/select";
import { useCategoryStore } from "libs/utils/useCategoryStore";
import { formatRupiah, unformatRupiah } from "libs/utils/formatRupiah";

export default function NewDiscount() {
    const { toast } = useToast();
    const router = useRouter();
    const { catLayananMapping, unitLayananMapping, loading: loadingParams } = useCategoryStore();

    const [formData, setFormData] = useState({
        code: "",
        name: "",
        amount: "",
        promoType: "",
        category: "",
        serviceCode: "",
        minItem: "",
        endDate: "",
    });

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setFormData({ ...formData, [e.target.id]: e.target.value });
    };

    const handleSelectChange = (field: string, value: string) => {
        setFormData({ ...formData, [field]: value });
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
                description: "Promo berhasil ditambahkan!",
                variant: "default",
            });
            router.push("/master-data/diskon");
        } catch (error) {
            toast({
                title: "Gagal",
                description: "Terjadi kesalahan saat menambahkan promo.",
                variant: "destructive",
            });
        }
    };

    return (
        <>
            <Breadcrumbs label="Tambah Promo Baru" />
            <Wrapper>
                <form className="space-y-4" onSubmit={handleSubmit}>
                    <div className="flex items-center space-x-4">
                        <Label htmlFor="code" className="w-1/4 font-semibold ">Kode Promo</Label>
                        <Input placeholder="Masukkan Kode Promo" className="uppercase" id="code" value={formData.code} onChange={handleChange} />
                    </div>
                    <div className="flex items-center space-x-4">
                        <Label htmlFor="name" className="w-1/4 font-semibold">Nama Promo</Label>
                        <Input placeholder="Masukkan Nama Promo" id="name" value={formData.name} onChange={handleChange} />
                    </div>

                    {/* Tipe Promo */}
                    <div className="flex items-center space-x-4">
                        <Label htmlFor="promoType" className="w-[20%] font-semibold">Tipe Potongan</Label>
                        <RadioGroup
                            value={formData.promoType || "Nominal"}
                            onValueChange={(value) => setFormData({ ...formData, promoType: value })}
                            className="flex items-center gap-5"
                        >
                            <div className="flex items-center space-x-2">
                                <RadioGroupItem value="Nominal" id="Nominal" />
                                <Label className="capitalize" htmlFor="Nominal">Nominal</Label>
                            </div>
                            <div className="flex items-center space-x-2">
                                <RadioGroupItem value="Persentase" id="Persentase" />
                                <Label className="capitalize" htmlFor="Persentase">Persentase</Label>
                            </div>
                        </RadioGroup>
                    </div>
                    {formData.promoType !== "Persentase" ? (
                        <div className="flex items-center space-x-4">
                            <Label htmlFor="amount" className="w-1/4 font-semibold">Potongan Rp</Label>
                            <Input
                                className="text-right"
                                placeholder="Masukkan Potongan Harga"
                                type="text"
                                id="amount"
                                value={formatRupiah(formData.amount)}
                                onChange={(e) => {
                                    const value = e.target.value.replace(/[^0-9]/g, "");
                                    setFormData({ ...formData, amount: unformatRupiah(value).toString() });
                                }}
                            />
                        </div>
                    ) : (
                        <div className="flex items-center space-x-4">
                            <Label htmlFor="amount" className="w-1/4 font-semibold">Potongan %</Label>
                            <div className="relative w-full">
                                <Input
                                    className="text-right placeholder:text-start pr-7 no-spinner"
                                    placeholder="Masukkan Potongan Persentase"
                                    type="number"
                                    id="amount"
                                    value={formData.amount}
                                    onChange={handleChange}
                                />
                                <span className="absolute inset-y-0 right-3 flex items-center font-semibold">%</span>
                            </div>
                        </div>
                    )}

                    <div className="flex items-center space-x-4">
                        <Label htmlFor="category" className="w-1/4">
                            Kategori
                        </Label>
                        <Select
                            onValueChange={(value) => handleSelectChange("category", value)}
                            value={formData.category}
                            disabled={loadingParams}
                        >
                            <SelectTrigger className="w-full">
                                <SelectValue placeholder="Pilih Kategori" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectGroup>
                                    <SelectLabel>Kategori</SelectLabel>
                                    {loadingParams ? (
                                        <SelectItem value="loading" disabled>
                                            Loading...
                                        </SelectItem>
                                    ) : (
                                        Object.keys(catLayananMapping).map((key) => (
                                            <SelectItem key={key} value={key}>
                                                {catLayananMapping[key]}
                                            </SelectItem>
                                        ))
                                    )}
                                </SelectGroup>
                            </SelectContent>
                        </Select>
                    </div>

                    <div className="flex items-center space-x-4">
                        <Label htmlFor="unit" className="w-1/4">
                            Layanan
                        </Label>
                        <Select
                            onValueChange={(value) => handleSelectChange("serviceCode", value)}
                            disabled={loadingParams}
                        >
                            <SelectTrigger className="w-full">
                                <SelectValue placeholder="Pilih Layanan" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectGroup>
                                    <SelectLabel>Satuan</SelectLabel>
                                    {loadingParams ? (
                                        <SelectItem value="loading" disabled>
                                            Loading...
                                        </SelectItem>
                                    ) : (
                                        Object.keys(unitLayananMapping).map((key) => (
                                            <SelectItem key={key} value={key}>
                                                {unitLayananMapping[key]}
                                            </SelectItem>
                                        ))
                                    )}
                                </SelectGroup>
                            </SelectContent>
                        </Select>
                    </div>
                    
                    <div className="flex items-center space-x-4">
                        <Label htmlFor="minItem" className="w-1/4 font-semibold">Minimal Item</Label>
                        <Input placeholder="Masukkan Minimal Item" type="number" id="minItem" value={formData.minItem} onChange={handleChange} />
                    </div>
                    <div className="flex items-center space-x-4">
                        <Label htmlFor="endDate" className="w-1/4 font-semibold">Masa Berlaku</Label>
                        <Input type="date" className="flex w-full" id="endDate" value={formData.endDate} onChange={handleChange} />
                    </div>
                    <div className="space-x-2 flex justify-end">
                        <Button type="button" variant="outline2" onClick={() => router.back()}>
                            Kembali
                        </Button>
                        <Button type="submit" variant="main">
                            Simpan
                        </Button>
                    </div>
                </form>
            </Wrapper>
        </>
    );
}
