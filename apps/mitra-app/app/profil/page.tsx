"use client"
import Image from "next/image"
import { PageBanner } from "libs/shared/src/components/mitra/page-banner"
import { Button } from "libs/ui-components/src/components/ui/button"
import { Input } from "libs/ui-components/src/components/ui/input"
import { Label } from "libs/ui-components/src/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "libs/ui-components/src/components/ui/select"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "libs/ui-components/src/components/ui/tabs"
import { LogOut, Calendar, Eye, EyeOff } from "lucide-react"
import { useEffect, useState } from "react"
import { RiLogoutBoxFill } from "react-icons/ri"
import { AiFillCamera } from "react-icons/ai"
import { Dialog, DialogContent } from "libs/ui-components/src/components/ui/dialog"
import { useToast } from "libs/ui-components/src/hooks/use-toast"
import { api, apiClient } from "libs/utils/apiClient"
import { useParameterStore } from "libs/utils/useParameterStore"
import { formatDateInput } from 'libs/utils/formatDate'
import { ConfirmSaveDialog } from "libs/ui-components/src/components/save-dialog"
import { DatePickerInput } from "libs/ui-components/src/components/date-picker-input";
import { useRouter } from "next/navigation"

// Interface untuk data user dari API
interface UserData {
    username: string;
    fullname: string;
    noWhatsapp: string;
    birthDate: string;
    branchId: string;
    // Tambahan field jika ada di API
    email?: string;
    gender?: string;
}

// Komponen Dialog Logout
type LogoutDialogProps = {
    isOpen: boolean;
    onClose: () => void;
    onConfirm: () => void;
};

const LogoutDialog = ({ isOpen, onClose, onConfirm }: LogoutDialogProps) => {
    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent className="max-w-sm w-full">
                <div className="text-center">
                    {/* Illustration */}
                    <div className="mb-6 flex justify-center">
                        <div className="relative">
                            {/* Door */}
                            <div className="w-20 h-24 bg-mainColor rounded-r-lg relative">
                                {/* Door handle */}
                                <div className="absolute right-1 top-10 w-1 h-2 bg-mainColor rounded-full"></div>
                            </div>

                            {/* Person figure */}
                            <div className="absolute -left-8 top-2">
                                {/* Head */}
                                <div className="w-6 h-6 bg-white border-2 border-gray-800 rounded-full mb-1"></div>
                                {/* Body */}
                                <div className="w-4 h-8 bg-white border-2 border-gray-800 rounded-sm mx-1"></div>
                                {/* Arms */}
                                <div className="absolute top-6 -left-1 w-2 h-4 bg-white border-2 border-gray-800 rounded-sm transform rotate-12"></div>
                                <div className="absolute top-6 right-1 w-2 h-4 bg-white border-2 border-gray-800 rounded-sm transform -rotate-45"></div>
                                {/* Legs */}
                                <div className="absolute top-12 left-0 w-1.5 h-6 bg-white border-2 border-gray-800 rounded-sm"></div>
                                <div className="absolute top-12 right-0.5 w-1.5 h-6 bg-white border-2 border-gray-800 rounded-sm"></div>
                            </div>
                        </div>
                    </div>

                    {/* Message */}
                    <p className="text-gray-800 text-base font-medium mb-6">
                        Apakah anda yakin ingin keluar applikasi?
                    </p>

                    {/* Buttons */}
                    <div className="grid grid-cols-2 gap-2">
                        {/* Logout Button */}
                        <Button
                            onClick={onConfirm}
                            variant={"destructive"}
                            className="w-full"
                        >
                            <RiLogoutBoxFill className="mr-1 h-4 w-4" />
                            Log Out
                        </Button>

                        {/* Cancel Button */}
                        <Button
                            variant="outline"
                            onClick={onClose}
                            className="w-full bg-gray-100 hover:bg-gray-200 text-gray-700 font-medium py-3 px-4 rounded-lg transition-colors border-gray-200"
                        >
                            Batal
                        </Button>
                    </div>
                </div>
            </DialogContent>
        </Dialog>
    );
};

export default function ProfilSayaPage() {
    const { toast } = useToast();
    const { branchMapping } = useParameterStore();
    const router = useRouter();


    // State untuk data user dari API
    const [userData, setUserData] = useState<UserData | null>(null);
    const [loading, setLoading] = useState<boolean>(true);

    // State untuk form data profil
    const [profileData, setProfileData] = useState({
        fullname: "",
        noWhatsapp: "",
        birthDate: "",
        email: "", // Jika ada di API
        gender: "" // Jika ada di API
    });

    // State untuk form password
    const [securityData, setSecurityData] = useState({
        password: "",
        retypePassword: ""
    });

    const [showPasswords, setShowPasswords] = useState({
        new: false,
        confirm: false
    });

    const [showLogoutDialog, setShowLogoutDialog] = useState(false);
    const [showConfirmProfile, setShowConfirmProfile] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const [updating, setUpdating] = useState(false);

    // Fetch data user saat komponen mount
    useEffect(() => {
        const fetchUserData = async () => {
            try {
                setLoading(true);
                const res = await apiClient("/profile");
                if (res.status === "success") {
                    const data: UserData = res.data;
                    setUserData(data);
                    setProfileData({
                        fullname: data.fullname || "",
                        noWhatsapp: data.noWhatsapp || "",
                        birthDate: data.birthDate || "",
                        email: data.email || "", // Jika field ini ada
                        gender: data.gender || "" // Jika field ini ada
                    });
                }
            } catch (error) {
                toast({
                    title: "Error!",
                    description: "Gagal memuat data profil",
                    variant: "destructive",
                });
            } finally {
                setLoading(false);
            }
        };

        fetchUserData();
    }, [toast]);

    // Fungsi untuk menangani perubahan tanggal lahir
    const handleDateChange = (field: string) => (value: string) => {
        setProfileData(prev => ({
            ...prev,
            [field]: value
        }));
    };

    const handleProfileChange = (field: string, value: string) => {
        setProfileData(prev => ({
            ...prev,
            [field]: value
        }));
    };

    const handleSecurityChange = (field: string, value: string) => {
        setSecurityData(prev => ({
            ...prev,
            [field]: value
        }));
    };

    const togglePasswordVisibility = (field: 'new' | 'confirm') => {
        setShowPasswords(prev => ({
            ...prev,
            [field]: !prev[field]
        }));
    };

    // Submit update profil
    const submitProfileUpdate = async () => {
        setUpdating(true);
        try {
            // Siapkan data yang akan dikirim (sesuaikan dengan struktur API)
            const updateData = {
                fullname: profileData.fullname,
                noWhatsapp: profileData.noWhatsapp,
                birthDate: profileData.birthDate,
                // Tambahkan field lain jika ada di API
                ...(profileData.email && { email: profileData.email }),
                ...(profileData.gender && { gender: profileData.gender }),
            };

            await api.put("/profile", updateData);
            toast({
                title: "Berhasil!",
                description: "Profil berhasil diperbarui."
            });
            setShowConfirmProfile(false);

            // Refresh data user
            const res = await apiClient("/profile");
            if (res.status === "success") {
                setUserData(res.data);
            }
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

    // Submit update password
    const submitPasswordUpdate = async () => {
        if (securityData.password !== securityData.retypePassword) {
            toast({
                title: "Error!",
                description: "Kata sandi tidak sama.",
                variant: "destructive",
            });
            return;
        }

        setUpdating(true);
        try {
            await api.post("/profile/change-password", {
                password: securityData.password,
                retypePassword: securityData.retypePassword
            });
            toast({
                title: "Berhasil!",
                description: "Kata sandi berhasil diubah."
            });
            setSecurityData({ password: "", retypePassword: "" });
            setShowConfirmPassword(false);
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

    const handleLogout = () => {
        localStorage.removeItem('access_token');
        toast({
            title: "Berhasil!",
            description: "Anda telah berhasil logout.",
        });

        setShowLogoutDialog(false);
        router.push("/login");

    };

    // Loading state
    if (loading) {
        return (
            <main className="pb-[20vh] space-y-7 min-h-screen">
                <PageBanner
                    title="Profil Saya"
                    variant="white"
                    size="compact"
                />
                <div className="px-5 flex justify-center">
                    <p>Memuat data profil...</p>
                </div>
            </main>
        );
    }

    return (
        <main className="pb-[20vh] space-y-7 min-h-screen">
            <PageBanner
                title="Profil Saya"
                variant="white"
                size="compact"
            />

            <div className="px-5 space-y-6">
                {/* Profile Picture */}
                <div className="flex justify-center">
                    <div className="relative">
                        <Image
                            width={80}
                            height={80}
                            className="rounded-full object-cover aspect-square ring-[3px] ring-white shadow-lg"
                            src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=1064&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
                            alt={userData?.fullname || "Profile Picture"}
                        />
                        <div className="absolute -bottom-1 -right-1 w-6 h-6 bg-mainColor rounded-full border-2 border-white flex items-center justify-center">
                            <span className="text-white text-xs">
                                <AiFillCamera />
                            </span>
                        </div>
                    </div>
                </div>

                {/* Tabs */}
                <Tabs defaultValue="data-diri" className="w-full">
                    <TabsList className="w-full">
                        <TabsTrigger
                            value="data-diri"
                            className="text-sm font-medium w-full"
                        >
                            Data Diri
                        </TabsTrigger>
                        <TabsTrigger
                            value="keamanan"
                            className="text-sm font-medium w-full"
                        >
                            Keamanan
                        </TabsTrigger>
                    </TabsList>

                    <TabsContent value="data-diri" className="space-y-4">
                        <div className="border-0">
                            <div className="flex flex-col gap-4">
                                {/* Username (Read Only) */}
                                <div className="space-y-2">
                                    <Label htmlFor="username" className="text-sm font-medium text-gray-900">
                                        Nama Pengguna
                                    </Label>
                                    <Input
                                        id="username"
                                        value={userData?.username || ""}
                                        readOnly
                                        disabled
                                        className="text-sm bg-gray-50"
                                    />
                                </div>

                                {/* Nama Lengkap */}
                                <div className="space-y-2">
                                    <Label htmlFor="fullName" className="text-sm font-medium text-gray-900">
                                        Nama Lengkap
                                    </Label>
                                    <Input
                                        id="fullName"
                                        value={profileData.fullname}
                                        onChange={(e) => handleProfileChange('fullname', e.target.value)}
                                        className="text-sm"
                                        placeholder="Masukkan nama lengkap"
                                    />
                                </div>

                                {/* Email - Jika ada di API */}
                                {userData?.email !== undefined && (
                                    <div className="space-y-2">
                                        <Label htmlFor="email" className="text-sm font-medium text-gray-900">
                                            Email
                                        </Label>
                                        <Input
                                            id="email"
                                            type="email"
                                            value={profileData.email}
                                            onChange={(e) => handleProfileChange('email', e.target.value)}
                                            className="text-sm"
                                            placeholder="Masukkan email"
                                        />
                                    </div>
                                )}

                                {/* No WhatsApp */}
                                <div className="space-y-2">
                                    <Label htmlFor="phone" className="text-sm font-medium text-gray-900">
                                        No WhatsApp
                                    </Label>
                                    <Input
                                        id="phone"
                                        value={profileData.noWhatsapp}
                                        onChange={(e) => handleProfileChange('noWhatsapp', e.target.value)}
                                        className="text-sm"
                                        placeholder="Masukkan nomor WhatsApp"
                                    />
                                </div>

                                {/* Tanggal Lahir */}
                                <div className="space-y-2">
                                    <Label htmlFor="birthDate" className="text-sm font-medium text-gray-900">
                                        Tanggal Lahir
                                    </Label>
                                    <DatePickerInput
                                        value={formatDateInput(profileData.birthDate)}
                                        onChange={handleDateChange("birthDate")}
                                        placeholder="DD/MM/YYYY"
                                        className="text-sm"
                                    />
                                </div>

                                {/* Jenis Kelamin - Jika ada di API */}
                                {userData?.gender !== undefined && (
                                    <div className="space-y-2">
                                        <Label className="text-sm font-medium text-gray-900">
                                            Jenis Kelamin
                                        </Label>
                                        <Select
                                            value={profileData.gender}
                                            onValueChange={(value) => handleProfileChange('gender', value)}
                                        >
                                            <SelectTrigger className="text-sm">
                                                <SelectValue placeholder="Pilih jenis kelamin" />
                                            </SelectTrigger>
                                            <SelectContent>
                                                <SelectItem value="Laki-laki">Laki-laki</SelectItem>
                                                <SelectItem value="Perempuan">Perempuan</SelectItem>
                                            </SelectContent>
                                        </Select>
                                    </div>
                                )}

                                {/* Cabang (Read Only) */}
                                <div className="space-y-2">
                                    <Label htmlFor="branch" className="text-sm font-medium text-gray-900">
                                        Cabang
                                    </Label>
                                    <Input
                                        id="branch"
                                        value={userData ? (branchMapping[userData.branchId] || userData.branchId) : ""}
                                        readOnly
                                        disabled
                                        className="text-sm bg-gray-50"
                                    />
                                </div>

                                {/* Save Button */}
                                <Button
                                    variant={"main"}
                                    className="w-full"
                                    onClick={() => setShowConfirmProfile(true)}
                                >
                                    Simpan
                                </Button>

                                {/* Logout Button */}
                                <div className="mt-10">
                                    <div className="pt-2 border-t">
                                        <Button
                                            variant="ghost"
                                            onClick={() => setShowLogoutDialog(true)}
                                            className="w-full justify-start text-destructive hover:text-red-900 hover:bg-red-50 text-sm py-3"
                                        >
                                            <RiLogoutBoxFill className="mr-3 h-4 w-4" />
                                            Log Out
                                        </Button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </TabsContent>

                    <TabsContent value="keamanan" className="space-y-4">
                        <div className="border-0">
                            <div className="space-y-4">
                                {/* Kata Sandi Baru */}
                                <div className="space-y-2">
                                    <Label htmlFor="newPassword" className="text-sm font-medium text-gray-900">
                                        Kata sandi Baru
                                    </Label>
                                    <div className="relative">
                                        <Input
                                            id="newPassword"
                                            type={showPasswords.new ? "text" : "password"}
                                            value={securityData.password}
                                            onChange={(e) => handleSecurityChange('password', e.target.value)}
                                            className="text-sm pr-10"
                                            placeholder="Masukkan kata sandi baru"
                                        />
                                        <button
                                            type="button"
                                            onClick={() => togglePasswordVisibility('new')}
                                            className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                                        >
                                            {showPasswords.new ? (
                                                <Eye className="h-4 w-4" />
                                            ) : (
                                                <EyeOff className="h-4 w-4" />
                                            )}
                                        </button>
                                    </div>
                                </div>

                                {/* Konfirmasi Kata Sandi */}
                                <div className="space-y-2">
                                    <Label htmlFor="confirmPassword" className="text-sm font-medium text-gray-900">
                                        Konfirmasi Kata Sandi
                                    </Label>
                                    <div className="relative">
                                        <Input
                                            id="confirmPassword"
                                            type={showPasswords.confirm ? "text" : "password"}
                                            value={securityData.retypePassword}
                                            onChange={(e) => handleSecurityChange('retypePassword', e.target.value)}
                                            className="text-sm pr-10"
                                            placeholder="Konfirmasi kata sandi baru"
                                        />
                                        <button
                                            type="button"
                                            onClick={() => togglePasswordVisibility('confirm')}
                                            className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                                        >
                                            {showPasswords.confirm ? (
                                                <Eye className="h-4 w-4" />
                                            ) : (
                                                <EyeOff className="h-4 w-4" />
                                            )}
                                        </button>
                                    </div>
                                </div>

                                {/* Save Button */}
                                <Button
                                    variant={"main"}
                                    className="w-full"
                                    onClick={() => setShowConfirmPassword(true)}
                                >
                                    Simpan
                                </Button>
                            </div>
                        </div>
                    </TabsContent>
                </Tabs>
            </div>

            {/* Confirmation Dialogs */}
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

            {/* Logout Dialog */}
            <LogoutDialog
                isOpen={showLogoutDialog}
                onClose={() => setShowLogoutDialog(false)}
                onConfirm={handleLogout}
            />
        </main>
    )
}