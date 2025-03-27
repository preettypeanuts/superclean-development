"use client";
import { Wrapper } from "@shared/components/Wrapper";
import { Header } from "@shared/components/Header";
import { Input } from "libs/ui-components/src/components/ui/input";
import { Label } from "libs/ui-components/src/components/ui/label";
import { Button } from "libs/ui-components/src/components/ui/button";
import { LuSave } from "react-icons/lu";
import { TbCancel } from "react-icons/tb";
import { Textarea } from "@ui-components/components/ui/textarea";
import { useState } from "react";
import { useLocationData } from "libs/utils/useLocationData";
import { api } from "libs/utils/apiClient";
import { useRouter } from "next/navigation";
import { useToast } from "libs/ui-components/src/hooks/use-toast";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
    SelectGroup,
} from "libs/ui-components/src/components/ui/select";

export default function NewPelanggan() {
    const { toast } = useToast();
    const router = useRouter();

    const [formData, setFormData] = useState({
        noWhatsapp: "",
        fullname: "",
        address: "",
        province: "",
        city: "",
        district: "",
        subDistrict: "",
        status: true
    });

    // Mengambil data lokasi berdasarkan provinsi, kota, kecamatan yang dipilih
    const { provinces, cities, districts, subDistricts, loading } = useLocationData(
        formData.province,
        formData.city,
        formData.district
    );

    // Fungsi untuk menangani perubahan input teks
    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { id, value } = e.target;
        setFormData((prev) => ({
            ...prev,
            [id]: value
        }));
    };

    // Fungsi untuk menangani perubahan Select dan reset data terkait
    const handleSelectChange = (field: string, value: string) => {
        setFormData((prev) => {
            let updatedData = { ...prev, [field]: value };

            // Reset data jika provinsi berubah
            if (field === "province") {
                updatedData.city = "";
                updatedData.district = "";
                updatedData.subDistrict = "";
            }
            // Reset data jika kota berubah
            if (field === "city") {
                updatedData.district = "";
                updatedData.subDistrict = "";
            }
            // Reset data jika kecamatan berubah
            if (field === "district") {
                updatedData.subDistrict = "";
            }

            return updatedData;
        });
    };

    // Fungsi untuk menangani submit form
    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        console.log("Data yang dikirim:", formData);

        try {
            await api.post("/customer", formData);
            toast({
                title: "Berhasil",
                description: "Pelanggan berhasil ditambahkan!",
                variant: "default",
            });
            router.push("/master-data/pelanggan");
        } catch (error) {
            toast({
                title: "Gagal",
                description: "Terjadi kesalahan saat menambahkan pelanggan.",
                variant: "destructive",
            });
        }
    };

    return (
        <Wrapper>
            <Header label="Tambah Pelanggan Baru" />
            <form className="space-y-4" onSubmit={handleSubmit}>
                {/* Nama Lengkap */}
                <div className="flex items-center space-x-4">
                    <Label htmlFor="fullname" className="w-1/4 font-semibold">Nama Lengkap</Label>
                    <Input 
                        id="fullname" 
                        placeholder="Masukkan Nama Lengkap" 
                        value={formData.fullname} 
                        onChange={handleChange} 
                    />
                </div>

                {/* No Whatsapp */}
                <div className="flex items-center space-x-4">
                    <Label htmlFor="noWhatsapp" className="w-1/4 font-semibold">No. Whatsapp</Label>
                    <Input 
                        id="noWhatsapp" 
                        placeholder="Masukkan nomor Whatsapp" 
                        type="text" 
                        value={formData.noWhatsapp} 
                        onChange={handleChange} 
                    />
                </div>

                {/* Alamat */}
                <div className="flex items-center space-x-4">
                    <Label htmlFor="address" className="w-1/4 font-semibold">Alamat</Label>
                    <Textarea 
                        id="address" 
                        placeholder="Masukkan alamat" 
                        value={formData.address} 
                        onChange={handleChange} 
                    />
                </div>

                {/* Provinsi */}
                <div className="flex items-center space-x-4">
                    <Label className="w-1/4 font-semibold">Provinsi</Label>
                    <Select
                        onValueChange={(value) => handleSelectChange("province", value)}
                        value={formData.province}
                        disabled={loading}
                    >
                        <SelectTrigger className="w-full">
                            <SelectValue placeholder="Pilih Provinsi" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectGroup>
                                {provinces.map((prov) => (
                                    <SelectItem key={prov.id} value={prov.paramKey}>
                                        {prov.paramValue}
                                    </SelectItem>
                                ))}
                            </SelectGroup>
                        </SelectContent>
                    </Select>
                </div>

                {/* Kota */}
                <div className="flex items-center space-x-4">
                    <Label className="w-1/4 font-semibold">Kota</Label>
                    <Select
                        onValueChange={(value) => handleSelectChange("city", value)}
                        value={formData.city}
                        disabled={!formData.province || loading}
                    >
                        <SelectTrigger className="w-full">
                            <SelectValue placeholder="Pilih Kota" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectGroup>
                                {cities.map((city) => (
                                    <SelectItem key={city.id} value={city.paramKey}>
                                        {city.paramValue}
                                    </SelectItem>
                                ))}
                            </SelectGroup>
                        </SelectContent>
                    </Select>
                </div>

                {/* Kecamatan */}
                <div className="flex items-center space-x-4">
                    <Label className="w-1/4 font-semibold">Kecamatan</Label>
                    <Select
                        onValueChange={(value) => handleSelectChange("district", value)}
                        value={formData.district}
                        disabled={!formData.city || loading}
                    >
                        <SelectTrigger className="w-full">
                            <SelectValue placeholder="Pilih Kecamatan" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectGroup>
                                {districts.map((dist) => (
                                    <SelectItem key={dist.id} value={dist.paramKey}>
                                        {dist.paramValue}
                                    </SelectItem>
                                ))}
                            </SelectGroup>
                        </SelectContent>
                    </Select>
                </div>

                {/* Kelurahan */}
                <div className="flex items-center space-x-4">
                    <Label className="w-1/4 font-semibold">Kelurahan</Label>
                    <Select
                        onValueChange={(value) => handleSelectChange("subDistrict", value)}
                        value={formData.subDistrict}
                        disabled={!formData.district || loading}
                    >
                        <SelectTrigger className="w-full">
                            <SelectValue placeholder="Pilih Kelurahan" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectGroup>
                                {subDistricts.map((subDist) => (
                                    <SelectItem key={subDist.id} value={subDist.paramKey}>
                                        {subDist.paramValue}
                                    </SelectItem>
                                ))}
                            </SelectGroup>
                        </SelectContent>
                    </Select>
                </div>

                <div className="flex justify-end space-x-2">
                    <Button type="button" variant="destructive" onClick={() => router.back()}>
                        <TbCancel /> Batal
                    </Button>
                    <Button type="submit">
                        <LuSave /> Simpan
                    </Button>
                </div>
            </form>
        </Wrapper>
    );
}
