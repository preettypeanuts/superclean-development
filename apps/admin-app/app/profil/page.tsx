"use client";
import { useEffect, useState } from "react";
import { api, apiClient } from "../../../../libs/utils/apiClient";
import { useToast } from "@ui-components/hooks/use-toast";
import { useParameterStore } from "../../../../libs/utils/useParameterStore";
import { Button } from "@ui-components/components/ui/button";
import { Wrapper } from "@shared/components/Wrapper";
import { Label } from "@ui-components/components/ui/label";
import { Input } from "@ui-components/components/ui/input";
import { Breadcrumbs } from "@shared/components/ui/Breadcrumbs";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@ui-components/components/ui/tabs";
import { useRouter } from "next/navigation";
import { formatDateInput } from '@shared/utils/formatDate';
import { ConfirmSaveDialog } from "@ui-components/components/save-dialog";
interface UserData {
    username: string;
    fullname: string;
    noWhatsapp: string;
    birthDate: string;
    branchId: string;
}

export default function ProfilPage() {
    const { toast } = useToast();
    const router = useRouter();
    const { branchMapping } = useParameterStore();

    const [userData, setUserData] = useState<UserData | null>(null);
    const [formData, setFormData] = useState({
        fullname: "",
        noWhatsapp: "",
        birthDate: "",
    });
    const [passwordData, setPasswordData] = useState({
        password: "",
        retypePassword: "",
    });

    const [editingPassword, setEditingPassword] = useState(false);
    const [showConfirmProfile, setShowConfirmProfile] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const [updating, setUpdating] = useState(false);

    useEffect(() => {
        const fetchData = async () => {
            const res = await apiClient("/profile");
            if (res.status === "success") {
                const data = res.data;
                setUserData(data);
                setFormData({
                    fullname: data.fullname || "",
                    noWhatsapp: data.noWhatsapp || "",
                    birthDate: data.birthDate || "",
                });
            }
        };
        fetchData();
    }, []);

    const submitProfileUpdate = async () => {
        setUpdating(true);
        try {
            await api.put("/profile", formData);
            toast({ title: "Berhasil!", description: "Profil berhasil diperbarui." });
            setShowConfirmProfile(false);
            window.location.reload();
        } catch (error) {
            toast({
                title: "Error!",
                description: `Gagal memperbarui profil. Error: ${error instanceof Error ? error.message : String(error)}`,
                variant: "destructive",
            });
        } finally {
            setUpdating(false);
        }
    };

    const submitPasswordUpdate = async () => {
        if (passwordData.password !== passwordData.retypePassword) {
            toast({
                title: "Error!",
                description: "Kata sandi tidak sama.",
                variant: "destructive",
            });
            setShowConfirmPassword(false);
            return;
        }

        setUpdating(true);
        try {
            await api.post("/profile/change-password", passwordData);
            toast({ title: "Berhasil!", description: "Kata sandi berhasil diubah." });
            setPasswordData({ password: "", retypePassword: "" });
            setEditingPassword(false);
            setShowConfirmPassword(false);
            window.location.reload();
        } catch (error) {
            toast({
                title: "Error!",
                description: "Gagal mengubah kata sandi. Coba lagi nanti.",
                variant: "destructive",
            });
        } finally {
            setUpdating(false);
        }
    };

    if (!userData) return <p>Loading...</p>;

    return (
        <>
            <Breadcrumbs label="Profil Pengguna" />
            <Wrapper>
                <Tabs defaultValue="profil" className="-mt-2">
                    <TabsList>
                        <TabsTrigger value="profil">Profil</TabsTrigger>
                        <TabsTrigger value="password">Ubah Kata Sandi</TabsTrigger>
                    </TabsList>
                    <div className="w-full border-t my-3 -mx-10" />

                    <TabsContent value="profil">
                        <div className="space-y-4">
                            <FormRow label="Nama Pengguna">
                                <Input value={userData.username} readOnly disabled />
                            </FormRow>

                            <FormRow label="Nama Lengkap">
                                <Input
                  required
                  validation={/^[a-zA-Z\s]+$/}
                  label="Nama Lengkap"
                  placeholder="Masukkan nama lengkap"
                                    value={formData.fullname}
                                    onChange={(e) => setFormData({ ...formData, fullname: e.target.value })}
                                />
                            </FormRow>

              <FormRow label="No Whatsapp" error={!formData.noWhatsapp ? "No Whatsapp tidak boleh kosong" : ""}>
                                <Input
                  required
                  validation={/^(?:\+62|08)[0-9]{8,14}$/}
                  label="No Whatsapp"
                  placeholder="Masukkan no Whatsapp"
                                    value={formData.noWhatsapp}
                                    onChange={(e) => setFormData({ ...formData, noWhatsapp: e.target.value })}
                                />
                            </FormRow>

                            <FormRow label="Tanggal Lahir">
                                <Input
                                    type="date"
                  required
                                    value={formatDateInput(formData.birthDate)}
                                    onChange={(e) => setFormData({ ...formData, birthDate: e.target.value })}
                                />
                            </FormRow>

                            <FormRow label="Cabang">
                                <Input value={branchMapping[userData.branchId] || userData.branchId} readOnly disabled />
                            </FormRow>

                            <div className="flex justify-end mt-6 gap-2">
                                <Button onClick={() => router.back()} variant="outline2">Kembali</Button>
                                <Button onClick={() => setShowConfirmProfile(true)} variant="main">
                                    Simpan Perubahan
                                </Button>
                            </div>
                        </div>
                    </TabsContent>

                    <TabsContent value="password">
                        <div className="space-y-4">
                            <FormRow label="Kata Sandi Baru">
                                <Input
                                    type="password"
                                    placeholder={!editingPassword ? "********" : "Masukkan kata sandi baru"}
                                    value={passwordData.password}
                                    onChange={(e) => setPasswordData({ ...passwordData, password: e.target.value })}
                                />
                            </FormRow>

                            <FormRow label="Ulangi Kata Sandi Baru">
                                <Input
                                    type="password"
                                    placeholder={!editingPassword ? "********" : "Ulangi kata sandi baru"}
                                    value={passwordData.retypePassword}
                                    onChange={(e) => setPasswordData({ ...passwordData, retypePassword: e.target.value })}
                                />
                            </FormRow>

                            <div className="flex justify-end mt-6 gap-2">
                                <Button onClick={() => router.back()} variant="outline2">Kembali</Button>
                                <Button onClick={() => setShowConfirmPassword(true)} variant="main">
                                    Simpan Perubahan
                                </Button>
                            </div>
                        </div>
                    </TabsContent>
                </Tabs>

                {/* Dialog Konfirmasi */}
                <ConfirmSaveDialog
                    title="Simpan perubahan profil?"
                    open={showConfirmProfile}
                    onOpenChange={setShowConfirmProfile}
                    onConfirm={submitProfileUpdate}
                    isLoading={updating}
                />

                <ConfirmSaveDialog
                    title="Simpan perubahan kata sandi?"
                    open={showConfirmPassword}
                    onOpenChange={setShowConfirmPassword}
                    onConfirm={submitPasswordUpdate}
                    isLoading={updating}
                />
            </Wrapper>
        </>
    );
}

// Komponen baris form reusable
function FormRow({ label, children }: { label: string; children: React.ReactNode }) {
    return (
        <div className="flex items-center space-x-4">
            <Label className="w-1/4">{label}</Label>
            {children}
        </div>
    );
}
