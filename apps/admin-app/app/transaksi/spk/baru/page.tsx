"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Wrapper } from "@shared/components/Wrapper";
import { Header } from "@shared/components/Header";
import { Input } from "libs/ui-components/src/components/ui/input";
import { Label } from "libs/ui-components/src/components/ui/label";
import { Button } from "libs/ui-components/src/components/ui/button";
import { LuSave } from "react-icons/lu";
import { TbArrowBack } from "react-icons/tb";
import { useToast } from "libs/ui-components/src/hooks/use-toast";
import { api } from "libs/utils/apiClient";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue, SelectGroup, SelectLabel } from "libs/ui-components/src/components/ui/select";
import { useCategoryStore } from "libs/utils/useCategoryStore";
import { RupiahInput } from "libs/ui-components/src/components/rupiah-input"
import { RadioGroup, RadioGroupItem } from "libs/ui-components/src/components/ui/radio-group"
import { Breadcrumbs } from "@shared/components/ui/Breadcrumbs";

export default function NewSPK() {
    const { toast } = useToast();
    const router = useRouter();
    const { catLayananMapping, unitLayananMapping, loading: loadingParams } = useCategoryStore();

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

    const handleSelectChange = (key: keyof typeof formData, value: string) => {
        setFormData({ ...formData, [key]: value });
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        console.log("Data sebelum dikirim:", formData);

        const formattedData = {
            ...formData,
            amount: Number(formData.amount) || 0,
            minItem: Number(formData.minItem) || 0,
            endDate: formData.endDate ? `${formData.endDate}T12:00:00.000Z` : null,
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
        <>
            <Breadcrumbs label="Tambah SPK" />
            <Wrapper>
                <form className="space-y-4" onSubmit={handleSubmit}>
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
                                <SelectValue placeholder="Pilih kategori layanan" />
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
                            // onValueChange={(value) => handleSelectChange("serviceCode", value)}
                            disabled={loadingParams}
                        >
                            <SelectTrigger className="w-full">
                                <SelectValue placeholder="Pilih layanan" />
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
                        <Label htmlFor="code" className="w-1/4 font-semibold">Jumlah</Label>
                        <Input placeholder="Masukkan Kode Diskon" type="number" id="code" value={formData.code} onChange={handleChange} />
                    </div>

                    {/* Tampilkan RadioGroup hanya jika kategori GENERAL atau BLOWER */}
                    {(formData.category === "GENERAL" || formData.category === "BLOWER") && (
                        <div className="flex items-center space-x-4">
                            <Label htmlFor="tipe" className="w-[20%] font-semibold">Tipe</Label>
                            <RadioGroup defaultValue="option-one" className="flex items-center gap-5">
                                <div className="flex items-center space-x-2">
                                    <RadioGroupItem value="vakum" id="vakum" />
                                    <Label htmlFor="vakum">Vakum</Label>
                                </div>
                                <div className="flex items-center space-x-2">
                                    <RadioGroupItem value="cuci" id="cuci" />
                                    <Label htmlFor="cuci">Cuci</Label>
                                </div>
                            </RadioGroup>
                        </div>
                    )}

                    <div className="flex items-center space-x-4">
                        <Label htmlFor="amount" className="w-1/4 font-semibold">Harga</Label>
                        <RupiahInput
                            placeholder="Rp. 0"
                            onValueChange={(value) => console.log("Nilai angka:", value)}
                        />
                    </div>

                    <div className="flex items-center space-x-4">
                        <Label htmlFor="promo" className="w-1/4 font-semibold">Promo</Label>
                        <RupiahInput
                            placeholder="Rp. 0"
                            onValueChange={(value) => console.log("Nilai angka:", value)}
                        />
                    </div>

                    <div className="flex items-center space-x-4">
                        <div className="w-1/4"></div>
                        <div className="space-x-2 flex w-full">
                            <Button type="button" variant="secondary" onClick={() => router.back()}>
                                <TbArrowBack />
                                Kembali
                            </Button>
                            <Button type="submit" variant="submit">
                                <LuSave />
                                Simpan
                            </Button>
                        </div>
                    </div>
                </form>
            </Wrapper>
        </>
    );
}
