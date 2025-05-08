"use client";

import { useEffect, useState } from "react";
import { api, apiClient } from "../../../../libs/utils/apiClient";
import { useToast } from "@ui-components/hooks/use-toast";
import { useParameterStore } from "../../../../libs/utils/useParameterStore";
import { Button } from "@ui-components/components/ui/button";
import { Wrapper } from "@shared/components/Wrapper";
import { Header } from "@shared/components/Header";
import { Label } from "@ui-components/components/ui/label";
import { Input } from "@ui-components/components/ui/input";
import { LuSave } from "react-icons/lu";

interface UserData {
    username: string;
    fullname: string;
    noWhatsapp: string;
    branchId: string;
}

export default function ProfilPage() {
    const { toast } = useToast();

    const [userData, setUserData] = useState<UserData | null>(null);
    const [formData, setFormData] = useState({
        fullname: "",
        noWhatsapp: "",
    });
    const [passwordData, setPasswordData] = useState({
        password: "",
        retypePassword: "",
    });
    const [editingPassword, setEditingPassword] = useState(false);
    const { branchMapping } = useParameterStore();

    useEffect(() => {
        const fetchData = async () => {
            const res = await apiClient("/profile");
            if (res.status === "success") {
                const data = res.data;
                setUserData(data);
                setFormData({
                    fullname: data.fullname || "",
                    noWhatsapp: data.noWhatsapp || "",
                });
            }
        };
        fetchData();
    }, []);

    const handleProfileSave = async () => {
        try {
            await api.put("/profile", {
                fullname: formData.fullname,
                noWhatsapp: formData.noWhatsapp,
            });
            toast({
                title: "Berhasil!",
                description: "Profil berhasil diperbarui.",
            });
            window.location.reload(); 
        } catch (error) {
            console.error("Gagal memperbarui profil:", error);
            toast({
                title: "Error!",
                description: `Gagal memperbarui profil. Error: ${
                    error instanceof Error ? error.message : String(error)
                }`,
                variant: "destructive",
            });
        }
    };

    const handlePasswordSave = async () => {
        if (passwordData.password !== passwordData.retypePassword) {
            toast({
                title: "Error!",
                description: "Kata sandi tidak sama.",
                variant: "destructive",
            });
            return;
        }

        const confirm = window.confirm("Apakah yakin mengubah kata sandi?");
        if (!confirm) return;

        try {
            await api.post("/profile/change-password", {
                password: passwordData.password,
                retypePassword: passwordData.retypePassword,
            });
            toast({
                title: "Berhasil!",
                description: "Kata sandi berhasil diubah.",
            });
            setPasswordData({ password: "", retypePassword: "" });
            setEditingPassword(false);
            window.location.reload(); 
        } catch (error) {
            console.error("Gagal mengubah kata sandi:", error);
            toast({
                title: "Error!",
                description: "Gagal mengubah kata sandi. Coba lagi nanti.",
                variant: "destructive",
            });
        }
    };

    if (!userData) return <p>Loading...</p>;

    return (
        <Wrapper>
            <Header label="Profil Pengguna" desc="Informasi pengguna yang sedang login." />
            <div className="space-y-4">
                <div className="flex items-center space-x-4">
                    <Label htmlFor="username" className="w-1/4">Nama Pengguna</Label>
                    <Input
                        id="username"
                        value={userData.username}
                        readOnly
                        disabled
                    />
                </div>

                <div className="flex items-center space-x-4">
                    <Label htmlFor="fullname" className="w-1/4">Nama Lengkap</Label>
                    <Input
                        id="fullname"
                        value={formData.fullname}
                        onChange={(e) => setFormData({ ...formData, fullname: e.target.value })}
                    />
                </div>

                <div className="flex items-center space-x-4">
                    <Label htmlFor="noWhatsapp" className="w-1/4">No Whatsapp</Label>
                    <Input
                        id="noWhatsapp"
                        value={formData.noWhatsapp}
                        onChange={(e) => setFormData({ ...formData, noWhatsapp: e.target.value })}
                    />
                </div>

                <div className="flex items-center space-x-4">
                    <Label htmlFor="branch" className="w-1/4">Cabang</Label>
                    <Input
                        id="branch"
                        value={branchMapping[userData.branchId] || userData.branchId}
                        readOnly
                        disabled
                    />
                </div>

                <div className="flex items-center space-x-4">
                    <Label className="w-[20%]"></Label>
                    <Button variant="submit" onClick={handleProfileSave}>
                        <LuSave />
                        Simpan
                    </Button>
                </div>
            </div>

            <div className="w-full border-t my-7"></div>

            <div className="space-y-4">
                <h2 className="font-bold text-lg -md">Ubah Kata Sandi</h2>

                <div className="flex items-center space-x-4">
                    <Label className="w-1/4">Kata Sandi</Label>
                    <Input
                        type="password"
                        placeholder={!editingPassword ? "********" : "Masukkan kata sandi baru"}
                        disabled={!editingPassword}
                        value={passwordData.password}
                        onChange={(e) =>
                            setPasswordData({ ...passwordData, password: e.target.value })
                        }
                    />
                </div>

                <div className="flex items-center space-x-4">
                    <Label className="w-1/4">Ulangi Kata Sandi</Label>
                    <Input
                        type="password"
                        placeholder={!editingPassword ? "********" : "Ulangi kata sandi baru"}
                        disabled={!editingPassword}
                        value={passwordData.retypePassword}
                        onChange={(e) =>
                            setPasswordData({
                                ...passwordData,
                                retypePassword: e.target.value,
                            })
                        }
                    />
                </div>

                <div className="flex items-center space-x-4">
                    <Label className="w-[20%]"></Label>
                    <div className="flex items-center gap-2">
                        <Button onClick={() => setEditingPassword(true)}>Ubah</Button>
                        <Button
                            variant="submit"
                            className={editingPassword ? "opacity-100" : "opacity-0"}
                            onClick={handlePasswordSave}
                        >
                            <LuSave />
                            Simpan
                        </Button>
                    </div>
                </div>
            </div>
        </Wrapper>
    );
}
