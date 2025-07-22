"use client";
import { Wrapper } from "@shared/components/Wrapper";
import { Header } from "@shared/components/Header";
import { Input } from "libs/ui-components/src/components/ui/input";
import { Label } from "libs/ui-components/src/components/ui/label";
import { Button } from "libs/ui-components/src/components/ui/button";
import { LuSave } from "react-icons/lu";
import { TbArrowBack } from "react-icons/tb";
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
import { Checkbox } from "@ui-components/components/ui/checkbox";
import { Breadcrumb } from "@ui-components/components/ui/breadcrumb";
import { Breadcrumbs } from "@shared/components/ui/Breadcrumbs";
import { RadioGroup, RadioGroupItem } from "@ui-components/components/ui/radio-group";

// Interface untuk error response
interface ApiError {
    message?: string;
    code?: string;
    details?: string;
    status?: number;
}

export default function NewPelanggan() {
    const { toast } = useToast();
    const router = useRouter();
    const [isSubmitting, setIsSubmitting] = useState(false);

    const [formData, setFormData] = useState({
        noWhatsapp: "",
        fullname: "",
        address: "",
        province: "",
        customerType: "",
        city: "",
        district: "",
        subDistrict: "",
        status: 1
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
    const handleSelectChange = (field: string, value: string | boolean) => {
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

    // Fungsi untuk validasi form
    const validateForm = (): string | null => {
        if (!formData.fullname.trim()) {
            return "Nama lengkap harus diisi";
        }
        if (!formData.noWhatsapp.trim()) {
            return "Nomor WhatsApp harus diisi";
        }
        if (!/^\d+$/.test(formData.noWhatsapp.trim())) {
            return "Nomor WhatsApp harus berupa angka";
        }
        if (!formData.customerType) {
            return "Tipe pelanggan harus dipilih";
        }
        if (!formData.address.trim()) {
            return "Alamat harus diisi";
        }
        if (!formData.province) {
            return "Provinsi harus dipilih";
        }
        if (!formData.city) {
            return "Kota harus dipilih";
        }
        if (!formData.district) {
            return "Kecamatan harus dipilih";
        }
        if (!formData.subDistrict) {
            return "Kelurahan harus dipilih";
        }
        return null;
    };

    // Fungsi untuk menghandle error berdasarkan tipe
    const handleApiError = (error: any) => {
        console.error("API Error:", error);

        let errorMessage = "Terjadi kesalahan saat menambahkan pelanggan.";
        let errorTitle = "Gagal";

        // Handle error berdasarkan response status
        if (error.response) {
            const status = error.response.status;
            const responseData = error.response.data;

            switch (status) {
                case 400:
                    errorTitle = "Data Tidak Valid";
                    if (responseData?.message) {
                        errorMessage = responseData.message;
                    } else {
                        errorMessage = "Data yang dikirim tidak valid. Silakan periksa kembali.";
                    }
                    break;

                case 409:
                    errorTitle = "Data Sudah Ada";
                    errorMessage = "Data pelanggan dengan nomor WhatsApp ini sudah terdaftar.";
                    break;

                case 422:
                    errorTitle = "Validasi Gagal";
                    if (responseData?.errors) {
                        const errors = Object.values(responseData.errors).flat();
                        errorMessage = errors.join(", ");
                    } else {
                        errorMessage = "Data tidak memenuhi syarat validasi.";
                    }
                    break;

                case 500:
                    errorTitle = "Server Error";
                    // Handle specific database errors
                    if (error.message && error.message.includes("Duplicate entry")) {
                        if (error.message.includes("Unique_No_whatsapp")) {
                            errorTitle = "Nomor WhatsApp Sudah Terdaftar";
                            errorMessage = "Nomor WhatsApp yang Anda masukkan sudah terdaftar di sistem. Silakan gunakan nomor lain.";
                        } else {
                            errorTitle = "Data Sudah Ada";
                            errorMessage = "Data yang Anda masukkan sudah ada di sistem.";
                        }
                    } else if (responseData?.message) {
                        errorMessage = responseData.message;
                    } else {
                        errorMessage = "Terjadi kesalahan pada server. Silakan coba lagi nanti.";
                    }
                    break;

                case 503:
                    errorTitle = "Layanan Tidak Tersedia";
                    errorMessage = "Layanan sedang tidak tersedia. Silakan coba lagi nanti.";
                    break;

                default:
                    if (responseData?.message) {
                        errorMessage = responseData.message;
                    }
                    break;
            }
        } else if (error.request) {
            // Network error
            errorTitle = "Koneksi Bermasalah";
            errorMessage = "Tidak dapat terhubung ke server. Periksa koneksi internet Anda.";
        } else if (error.message) {
            // Handle specific error messages
            if (error.message.includes("Duplicate entry")) {
                if (error.message.includes("Unique_No_whatsapp")) {
                    errorTitle = "Nomor WhatsApp Sudah Terdaftar";
                    errorMessage = "Nomor WhatsApp yang Anda masukkan sudah terdaftar di sistem. Silakan gunakan nomor lain.";
                } else {
                    errorTitle = "Data Sudah Ada";
                    errorMessage = "Data yang Anda masukkan sudah ada di sistem.";
                }
            } else if (error.message.includes("timeout")) {
                errorTitle = "Timeout";
                errorMessage = "Permintaan memakan waktu terlalu lama. Silakan coba lagi.";
            } else {
                errorMessage = error.message;
            }
        }

        toast({
            title: errorTitle,
            description: errorMessage,
            variant: "destructive",
        });
    };

    // Fungsi untuk menangani submit form
    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        
        // Validasi form sebelum submit
        const validationError = validateForm();
        if (validationError) {
            toast({
                title: "Validasi Gagal",
                description: validationError,
                variant: "destructive",
            });
            return;
        }

        setIsSubmitting(true);
        
        try {
            console.log("Data yang dikirim:", formData);
            
            await api.post("/customer", formData);
            
            toast({
                title: "Berhasil",
                description: "Pelanggan berhasil ditambahkan!",
                variant: "default",
            });
            
            router.push("/master-data/pelanggan");
        } catch (error) {
            handleApiError(error);
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleCheckboxChange = (id: string, value: string | number) => {
        setFormData({ ...formData, [id]: value });
    };

    return (
        <>
            <Breadcrumbs label="Tambah Pelanggan Baru" />
            <Wrapper>
                <form className="space-y-4" onSubmit={handleSubmit}>
                    {/* Nama Lengkap */}
                    <div className="flex items-center space-x-4">
                        <Label htmlFor="fullname" className="w-1/4 font-semibold">
                            Nama Lengkap 
                        </Label>
                        <Input
                            id="fullname"
                            placeholder="Masukkan Nama Lengkap"
                            value={formData.fullname}
                            onChange={handleChange}
                            disabled={isSubmitting}
                        />
                    </div>

                    {/* No Whatsapp */}
                    <div className="flex items-center space-x-4">
                        <Label htmlFor="noWhatsapp" className="w-1/4 font-semibold">
                            No Whatsapp 
                        </Label>
                        <Input
                            id="noWhatsapp"
                            placeholder="Masukkan nomor Whatsapp"
                            type="text"
                            value={formData.noWhatsapp}
                            onChange={handleChange}
                            disabled={isSubmitting}
                        />
                    </div>
                    
                    {/* Tipe Pelanggan */}
                    <div className="flex items-center space-x-4">
                        <Label htmlFor="customerType" className="w-[20%] font-semibold">
                            Tipe 
                        </Label>
                        <RadioGroup
                            value={formData.customerType}
                            onValueChange={(value) => handleSelectChange("customerType", value)}
                            className="flex items-center gap-5"
                            disabled={isSubmitting}
                        >
                            <div className="flex items-center space-x-2">
                                <RadioGroupItem value="Pribadi" id="Pribadi" />
                                <Label className="capitalize" htmlFor="Pribadi">pribadi</Label>
                            </div>
                            <div className="flex items-center space-x-2">
                                <RadioGroupItem value="Perusahaan" id="Perusahaan" />
                                <Label className="capitalize" htmlFor="Perusahaan">Perusahaan</Label>
                            </div>
                        </RadioGroup>
                    </div>

                    {/* Alamat */}
                    <div className="flex items-center space-x-4">
                        <Label htmlFor="address" className="w-1/4 font-semibold">
                            Alamat 
                        </Label>
                        <Textarea
                            id="address"
                            className="resize-none"
                            placeholder="Masukkan alamat"
                            value={formData.address}
                            onChange={handleChange}
                            disabled={isSubmitting}
                        />
                    </div>

                    {/* Provinsi */}
                    <div className="flex items-center space-x-4">
                        <Label className="w-1/4 font-semibold">
                            Provinsi 
                        </Label>
                        <Select
                            onValueChange={(value) => handleSelectChange("province", value)}
                            value={formData.province}
                            disabled={loading || isSubmitting}
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
                        <Label className="w-1/4 font-semibold">
                            Kota 
                        </Label>
                        <Select
                            onValueChange={(value) => handleSelectChange("city", value)}
                            value={formData.city}
                            disabled={!formData.province || loading || isSubmitting}
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
                        <Label className="w-1/4 font-semibold">
                            Kecamatan 
                        </Label>
                        <Select
                            onValueChange={(value) => handleSelectChange("district", value)}
                            value={formData.district}
                            disabled={!formData.city || loading || isSubmitting}
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
                        <Label className="w-1/4 font-semibold">
                            Kelurahan 
                        </Label>
                        <Select
                            onValueChange={(value) => handleSelectChange("subDistrict", value)}
                            value={formData.subDistrict}
                            disabled={!formData.district || loading || isSubmitting}
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

                    <div className="flex items-center space-x-4">
                        <Label className="w-[20%] font-semibold">Status</Label>
                        <div className="flex items-center space-x-2">
                            <Checkbox
                                checked={formData.status === 1}
                                onCheckedChange={(checked) => handleCheckboxChange("status", checked ? 1 : 2)}
                                disabled={isSubmitting}
                            />
                            <Label>{formData.status === 1 ? "Aktif" : "Tidak Aktif"}</Label>
                        </div>
                    </div>

                    <div className="flex justify-end space-x-2">
                        <Button 
                            type="button" 
                            variant="outline2" 
                            onClick={() => router.back()}
                            disabled={isSubmitting}
                        >
                            <TbArrowBack className="w-4 h-4 mr-2" />
                            Kembali
                        </Button>
                        <Button 
                            type="submit" 
                            variant="main"
                            disabled={isSubmitting}
                        >
                            {isSubmitting ? (
                                <>
                                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                                    Menyimpan...
                                </>
                            ) : (
                                <>
                                    <LuSave className="w-4 h-4 mr-2" />
                                    Simpan
                                </>
                            )}
                        </Button>
                    </div>
                </form>
            </Wrapper>
        </>
    );
}