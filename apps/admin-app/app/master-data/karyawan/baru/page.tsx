"use client";
import { useState } from "react";
import { Wrapper } from "@shared/components/Wrapper";
import { Header } from "@shared/components/Header";
import { Input } from "libs/ui-components/src/components/ui/input";
import { Label } from "libs/ui-components/src/components/ui/label";
import { Button } from "libs/ui-components/src/components/ui/button";
import { LuSave } from "react-icons/lu";
import { TbArrowBack } from "react-icons/tb";
import { useParameterStore } from "libs/utils/useParameterStore";
import { api } from "libs/utils/apiClient";
import { useRouter } from "next/navigation";
import { Checkbox } from "libs/ui-components/src/components/ui/checkbox";
import { useToast } from "libs/ui-components/src/hooks/use-toast"
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
    SelectGroup,
    SelectLabel
} from "libs/ui-components/src/components/ui/select";
import { formatDateInput } from "libs/utils/formatDate";

export default function NewKaryawan() {
    const { toast } = useToast();

    const router = useRouter();
    const { roleMapping, branchMapping, loading: loadingParams } = useParameterStore();

    const [formData, setFormData] = useState({
        username: "",
        fullname: "",
        noWhatsapp: "",
        password: "",
        branchId: "",
        roleId: "",
        // joinDate: "",
        status: 1, // Default ke "Aktif" true
    });

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { id, name, value } = e.target;
        setFormData({ ...formData, [id || name]: value });
    };

    const handleSelectChange = (id: string, value: string | number) => {
        setFormData({ ...formData, [id]: value });
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        console.log("Data yang dikirim:", formData);

        try {
            await api.post("/user", formData);
            toast({
                title: "Berhasil",
                description: "Karyawan berhasil ditambahkan!",
                variant: "default",
            });
            router.push("/master-data/karyawan");
        } catch (error) {
            toast({
                title: "Gagal",
                description: "Terjadi kesalahan saat menambahkan karyawan.",
                variant: "destructive",
            });
        }
    };

    return (
        <Wrapper>
            <Header label="Tambah Karyawan Baru" />
            <form className="space-y-4" onSubmit={handleSubmit}>
                <div className="flex items-center space-x-4">
                    <Label htmlFor="username" className="w-1/4 font-semibold">Nama Pengguna</Label>
                    <Input placeholder="Masukkan Nama Pengguna" id="username" value={formData.username} onChange={handleChange} />
                </div>
                <div className="flex items-center space-x-4">
                    <Label htmlFor="fullname" className="w-1/4 font-semibold">Nama Lengkap</Label>
                    <Input placeholder="Masukkan lengkap karyawan" id="fullname" value={formData.fullname} onChange={handleChange} />
                </div>
                <div className="flex items-center space-x-4">
                    <Label htmlFor="noWhatsapp" className="w-1/4 font-semibold">No Whatsapp</Label>
                    <Input placeholder="Masukkan no Whatsapp" type="text" id="noWhatsapp" value={formData.noWhatsapp} onChange={handleChange} />
                </div>
                <div className="flex items-center space-x-4">
                    <Label htmlFor="password" className="w-1/4 font-semibold">Kata sandi</Label>
                    <Input placeholder="Masukkan kata sandi" type="text" id="password" value={formData.password} onChange={handleChange} />
                </div>

                          <div className="flex items-center space-x-4">
                            <Label className="w-1/4 font-semibold">Tanggal Daftar</Label>
                            <Input type="text" name="noWhatsapp" value={formatDateInput(formData.joinDate)} onChange={handleChange} />
                          </div>
                <div className="flex items-center space-x-4">
                    <Label htmlFor="branchId" className="w-1/4">Cabang</Label>
                    <Select
                        onValueChange={(value) => handleSelectChange("branchId", value)}
                        value={formData.branchId}
                        disabled={loadingParams}
                    >
                        <SelectTrigger className="w-full">
                            <SelectValue placeholder={loadingParams ? "Memuat cabang..." : "Pilih lokasi cabang"} />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectGroup>
                                <SelectLabel>Cabang</SelectLabel>
                                {loadingParams ? (
                                    <SelectItem value="loading" disabled>Loading...</SelectItem>
                                ) : branchMapping && Object.keys(branchMapping).length > 0 ? (
                                    Object.keys(branchMapping).map((key) => (
                                        <SelectItem key={key} value={key}>
                                            {branchMapping[key]}
                                        </SelectItem>
                                    ))
                                ) : (
                                    <SelectItem value="unavailable" disabled>Data tidak tersedia</SelectItem>
                                )}
                            </SelectGroup>
                        </SelectContent>
                    </Select>
                </div>
                <div className="flex items-center space-x-4">
                    <Label htmlFor="roleId" className="w-1/4">Akses Pengguna</Label>
                    <Select
                        onValueChange={(value) => handleSelectChange("roleId", value)}
                        value={formData.roleId}
                        disabled={loadingParams}
                    >
                        <SelectTrigger className="w-full">
                            <SelectValue placeholder={loadingParams ? "Memuat role..." : "Pilih akses pengguna"} />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectGroup>
                                <SelectLabel>Role</SelectLabel>
                                {loadingParams ? (
                                    <SelectItem value="loading" disabled>Loading...</SelectItem>
                                ) : roleMapping && Object.keys(roleMapping).length > 0 ? (
                                    Object.keys(roleMapping).map((key) => (
                                        <SelectItem key={key} value={key}>
                                            {roleMapping[key]}
                                        </SelectItem>
                                    ))
                                ) : (
                                    <SelectItem value="unavailable" disabled>Data tidak tersedia</SelectItem>
                                )}
                            </SelectGroup>
                        </SelectContent>
                    </Select>
                </div>
                <div className="flex items-center space-x-4">
                    <Label className="w-[20%] font-semibold">Status</Label>
                    <div className="flex items-center space-x-2">
                        <Checkbox
                            disabled
                            checked={formData.status === 1}
                            onCheckedChange={(checked) => handleSelectChange("status", checked ? 1 : 2)}
                        />
                        <Label>{formData.status === 1 ? "Aktif" : "Tidak Aktif"}</Label>
                    </div>
                </div>
                <div className="flex items-center space-x-4">
                    <div className="w-1/4"></div>
                    <div className="space-x-2 flex w-full">
                        <Button type="button" variant="secondary" onClick={() => router.push("/master-data/karyawan")}>
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
    );
}
