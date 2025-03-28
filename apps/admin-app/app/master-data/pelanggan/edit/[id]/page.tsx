"use client";
import { usePathname, useRouter } from 'next/navigation';
import { Header } from "@shared/components/Header";
import { Wrapper } from "@shared/components/Wrapper";
import { Input } from "libs/ui-components/src/components/ui/input";
import { Label } from "libs/ui-components/src/components/ui/label";
import { Button } from "libs/ui-components/src/components/ui/button";
import { Checkbox } from "libs/ui-components/src/components/ui/checkbox";
import { LuSave } from "react-icons/lu";
import { TbCancel } from "react-icons/tb";
import { useEffect, useState } from 'react';
import { api } from "libs/utils/apiClient";
import { useLocationData } from "libs/utils/useLocationData";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
    SelectGroup,
} from "libs/ui-components/src/components/ui/select";
import {
    AlertDialog,
    AlertDialogContent,
    AlertDialogHeader,
    AlertDialogTitle,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogAction,
} from "libs/ui-components/src/components/ui/alert-dialog";
import { useToast } from "libs/ui-components/src/hooks/use-toast"


interface Pelanggan {
    id: string;
    fullname: string;
    noWhatsapp: string;
    address: string;
    province: string;
    city: string;
    district: string;
    subDistrict: string;
    status: number;
}

export default function EditPelanggan() {
    const { toast } = useToast();
    const pathname = usePathname();
    const noWhatsapp = pathname.split('/').pop();
    const router = useRouter();
    const [showConfirmDialog, setShowConfirmDialog] = useState<boolean>(false); // Dialog Konfirmasi
    const [showSuccessDialog, setShowSuccessDialog] = useState<boolean>(false); // Alert muncul setelah sukses
    const [pelanggan, setPelanggan] = useState<Pelanggan | null>(null);
    const [status, setStatus] = useState<boolean>(true);
    const [updating, setUpdating] = useState<boolean>(false);
    const { provinces, cities, districts, subDistricts, loading } = useLocationData(
        pelanggan?.province,
        pelanggan?.city,
        pelanggan?.district
    );

    useEffect(() => {
        const fetchPelanggan = async () => {
            try {
                const result = await api.get(`/customer/${noWhatsapp}`);
                setPelanggan(result.data);
                setStatus(result.data.status === 1);
            } catch (error) {
                console.error("Gagal mengambil data pelanggan:", error);
            }
        };
        fetchPelanggan();
    }, [noWhatsapp]);

    // Handle Change Generic untuk Input Teks
    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setPelanggan(prev => prev ? { ...prev, [name]: value } : null);
    };

    // Handle Change untuk Select (Dropdown)
    const handleSelectChange = (name: keyof Pelanggan, value: string) => {
        setPelanggan(prev => prev ? { ...prev, [name]: value } : null);
    };

    // Handle Change untuk Status Checkbox
    const handleStatusChange = (checked: number) => {
        if (pelanggan) {
            setPelanggan({ ...pelanggan, status: checked ? 1 : 0 });
        }
    };

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        if (!pelanggan) return;

        // Pastikan id pelanggan ada
        const pelangganId = pelanggan.id;
        if (!pelangganId) {
            alert("ID pelanggan tidak ditemukan!");
            return;
        }
        setUpdating(true);
        // Buat data yang sesuai dengan format API
        const updatedData = {
            fullname: pelanggan.fullname,
            address: pelanggan.address,
            province: pelanggan.province,
            city: pelanggan.city,
            district: pelanggan.district,
            subDistrict: pelanggan.subDistrict,
            status: pelanggan.status, // Pastikan status sesuai aturan API
        };

        setUpdating(true);
        try {
            const response = await api.put(`/customer/${pelangganId}`, updatedData);
            console.log("Response:", response);
            toast({
                title: "Berhasil",
                description: "Profil pelanggan berhasil diperbarui!",
                variant: "success",
            });
            router.push('/master-data/pelanggan');
        } catch (error) {
            console.error("Gagal memperbarui data:", error);
            toast({
                title: "Gagal",
                description: "Terjadi kesalahan saat mengubah profil pelanggan.",
                variant: "destructive",
            });
        } finally {
            setUpdating(false);
        }
    };



    return (
        <Wrapper>
            <Header label="Edit Profil Pelanggan" />
            {loading ? (
                <p className="text-center py-4">Memuat data...</p>
            ) : pelanggan ? (
                <form className='space-y-4' onSubmit={handleSubmit}>
                    {/* Nama Lengkap */}
                    <div className="flex items-center space-x-4">
                        <div className="w-1/4 font-semibold">
                            <Label>Nama Lengkap</Label>
                        </div>
                        <Input name="fullname" value={pelanggan.fullname} onChange={handleChange} />
                    </div>

                    {/* Nomor WhatsApp */}
                    <div className="flex items-center space-x-4">
                        <div className="w-1/4 font-semibold">
                            <Label>Nomor WhatsApp</Label>
                        </div>
                        <Input value={pelanggan.noWhatsapp} disabled />
                    </div>

                    {/* Alamat */}
                    <div className="flex items-center space-x-4">
                        <div className="w-1/4 font-semibold">
                            <Label>Alamat</Label>
                        </div>
                        <Input name="address" value={pelanggan.address} onChange={handleChange} />
                    </div>

                    {/* Provinsi */}
                    <div className="flex items-center space-x-4">
                        <div className="w-1/4 font-semibold">
                            <Label>Provinsi</Label>
                        </div>
                        <Select value={pelanggan.province} onValueChange={(value) => handleSelectChange("province", value)}>
                            <SelectTrigger className="w-full">
                                <SelectValue placeholder="Pilih Provinsi" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectGroup>
                                    {provinces.map(prov => (
                                        <SelectItem key={prov.id} value={prov.paramKey}>{prov.paramValue}</SelectItem>
                                    ))}
                                </SelectGroup>
                            </SelectContent>
                        </Select>
                    </div>

                    {/* Kota */}
                    <div className="flex items-center space-x-4">
                        <div className="w-1/4 font-semibold">
                            <Label>Kota</Label>
                        </div>
                        <Select value={pelanggan.city} onValueChange={(value) => handleSelectChange("city", value)}>
                            <SelectTrigger className="w-full">
                                <SelectValue placeholder="Pilih Kota" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectGroup>
                                    {cities.map(city => (
                                        <SelectItem key={city.id} value={city.paramKey}>{city.paramValue}</SelectItem>
                                    ))}
                                </SelectGroup>
                            </SelectContent>
                        </Select>
                    </div>

                    {/* Kecamatan */}
                    <div className="flex items-center space-x-4">
                        <div className="w-1/4 font-semibold">
                            <Label>Kecamatan</Label>
                        </div>
                        <Select value={pelanggan.district} onValueChange={(value) => handleSelectChange("district", value)}>
                            <SelectTrigger className="w-full">
                                <SelectValue placeholder="Pilih Kecamatan" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectGroup>
                                    {districts.map(district => (
                                        <SelectItem key={district.id} value={district.paramKey}>{district.paramValue}</SelectItem>
                                    ))}
                                </SelectGroup>
                            </SelectContent>
                        </Select>
                    </div>

                    {/* Kelurahan */}
                    <div className="flex items-center space-x-4">
                        <div className="w-1/4 font-semibold">
                            <Label>Kelurahan</Label>
                        </div>
                        <Select value={pelanggan.subDistrict} onValueChange={(value) => handleSelectChange("subDistrict", value)}>
                            <SelectTrigger className="w-full">
                                <SelectValue placeholder="Pilih Kelurahan" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectGroup>
                                    {subDistricts.map(sub => (
                                        <SelectItem key={sub.id} value={sub.paramKey}>{sub.paramValue}</SelectItem>
                                    ))}
                                </SelectGroup>
                            </SelectContent>
                        </Select>
                    </div>

                    {/* Status */}
                    <div className="flex items-center space-x-4">
                        <Label htmlFor="status" className="w-[20%] font-semibold">Status</Label>
                        <div className="flex items-center space-x-2">
                            <Checkbox
                                id="status"
                                checked={pelanggan?.status === 1}
                                onCheckedChange={(checked) => handleStatusChange(checked ? 1 : 0)}
                            />
                            <Label htmlFor="status">
                                {pelanggan?.status === 1 ? "Aktif" : "Tidak Aktif"}
                            </Label>
                        </div>
                    </div>

                    <div className="flex items-center space-x-4">
                        <div className="w-1/4"></div>
                        <div className="space-x-2 flex w-full">
                            <Button type="button" variant="destructive" onClick={() => setShowSuccessDialog(true)}>
                                <TbCancel />
                                Batal
                            </Button>
                            {/* Tombol Simpan */}
                            <Button type="button" className="bg-green-600" onClick={() => setShowConfirmDialog(true)} disabled={updating}>
                                <LuSave />
                                {updating ? "Menyimpan..." : "Simpan"}
                            </Button>
                        </div>
                    </div>
                </form>
            ) : (
                <p className="text-center py-4 text-red-500">Pelanggan tidak ditemukan!</p>
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
                        <AlertDialogAction onClick={(e) => { setShowConfirmDialog(false); handleSubmit(e as unknown as React.FormEvent<HTMLFormElement>); }}>
                            Ya
                        </AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>
        </Wrapper>
    );
}
