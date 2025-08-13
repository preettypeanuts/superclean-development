"use client"
import Image from "next/image"
import { PageBanner } from "libs/shared/src/components/mitra/page-banner"
import { Button } from "libs/ui-components/src/components/ui/button"
import { Input } from "libs/ui-components/src/components/ui/input"
import { Label } from "libs/ui-components/src/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "libs/ui-components/src/components/ui/select"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "libs/ui-components/src/components/ui/tabs"
import { Card, CardContent } from "libs/ui-components/src/components/ui/card"
import { LogOut, Calendar, Eye, EyeOff } from "lucide-react"
import { useState } from "react"
import { RiLogoutBoxFill } from "react-icons/ri"
import { AiFillCamera } from "react-icons/ai";

export default function ProfilSayaPage() {
    const [profileData, setProfileData] = useState({
        fullName: "Mirna Putri",
        email: "mirnaptr@gmail.com",
        phone: "081288908784456",
        birthDate: "22/06/1997",
        gender: "Perempuan"
    })

    const [securityData, setSecurityData] = useState({
        currentPassword: "P@ssw0rd123",
        newPassword: "P@ssw0rd123",
        confirmPassword: "P@ssw0rd123"
    })

    const [showPasswords, setShowPasswords] = useState({
        current: false,
        new: false,
        confirm: false
    })

    const handleInputChange = (field: string, value: string) => {
        setProfileData(prev => ({
            ...prev,
            [field]: value
        }))
    }

    const handleSecurityChange = (field: string, value: string) => {
        setSecurityData(prev => ({
            ...prev,
            [field]: value
        }))
    }

    const togglePasswordVisibility = (field: 'current' | 'new' | 'confirm') => {
        setShowPasswords(prev => ({
            ...prev,
            [field]: !prev[field]
        }))
    }

    return (
        <main className="pb-[20vh] space-y-7 bg-gray-50 min-h-screen">
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
                            alt="Profile Picture"
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
                                {/* Nama Lengkap */}
                                <div className="space-y-2">
                                    <Label htmlFor="fullName" className="text-sm font-medium text-gray-900">
                                        Nama Lengkap
                                    </Label>
                                    <Input
                                        id="fullName"
                                        value={profileData.fullName}
                                        onChange={(e) => handleInputChange('fullName', e.target.value)}
                                        className="text-sm"
                                        placeholder="Masukkan nama lengkap"
                                    />
                                </div>

                                {/* Email */}
                                <div className="space-y-2">
                                    <Label htmlFor="email" className="text-sm font-medium text-gray-900">
                                        Email
                                    </Label>
                                    <Input
                                        id="email"
                                        type="email"
                                        value={profileData.email}
                                        onChange={(e) => handleInputChange('email', e.target.value)}
                                        className="text-sm"
                                        placeholder="Masukkan email"
                                    />
                                </div>

                                {/* No Telpon */}
                                <div className="space-y-2">
                                    <Label htmlFor="phone" className="text-sm font-medium text-gray-900">
                                        No Telpon
                                    </Label>
                                    <Input
                                        id="phone"
                                        value={profileData.phone}
                                        onChange={(e) => handleInputChange('phone', e.target.value)}
                                        className="text-sm"
                                        placeholder="Masukkan nomor telepon"
                                    />
                                </div>

                                {/* Tanggal Lahir */}
                                <div className="space-y-2">
                                    <Label htmlFor="birthDate" className="text-sm font-medium text-gray-900">
                                        Tanggal Lahir
                                    </Label>
                                    <div className="relative">
                                        <Input
                                            id="birthDate"
                                            value={profileData.birthDate}
                                            onChange={(e) => handleInputChange('birthDate', e.target.value)}
                                            className="text-sm pr-10"
                                            placeholder="DD/MM/YYYY"
                                        />
                                        <Calendar className="absolute right-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                                    </div>
                                </div>

                                {/* Jenis Kelamin */}
                                <div className="space-y-2">
                                    <Label className="text-sm font-medium text-gray-900">
                                        Jenis Kelamin
                                    </Label>
                                    <Select
                                        value={profileData.gender}
                                        onValueChange={(value) => handleInputChange('gender', value)}
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

                                {/* Save Button */}
                                <Button
                                    variant={"main"}
                                    className="w-full"
                                >
                                    Simpan
                                </Button>

                                {/* Logout Button */}
                                <div className="mt-10">
                                    <div className="pt-2 border-t">
                                        <Button
                                            variant="ghost"
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
                                {/* Kata Sandi Saat Ini */}
                                <div className="space-y-2">
                                    <Label htmlFor="currentPassword" className="text-sm font-medium text-gray-900">
                                        Kata Sandi Saat Ini
                                    </Label>
                                    <div className="relative">
                                        <Input
                                            id="currentPassword"
                                            type={showPasswords.current ? "text" : "password"}
                                            value={securityData.currentPassword}
                                            onChange={(e) => handleSecurityChange('currentPassword', e.target.value)}
                                            className="text-sm pr-10"
                                            placeholder="Masukkan kata sandi saat ini"
                                        />
                                        <button
                                            type="button"
                                            onClick={() => togglePasswordVisibility('current')}
                                            className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                                        >
                                            {showPasswords.current ? (
                                                <Eye className="h-4 w-4" />
                                            ) : (
                                                <EyeOff className="h-4 w-4" />
                                            )}
                                        </button>
                                    </div>
                                </div>

                                {/* Kata Sandi Baru */}
                                <div className="space-y-2">
                                    <Label htmlFor="newPassword" className="text-sm font-medium text-gray-900">
                                        Kata sandi Baru
                                    </Label>
                                    <div className="relative">
                                        <Input
                                            id="newPassword"
                                            type={showPasswords.new ? "text" : "password"}
                                            value={securityData.newPassword}
                                            onChange={(e) => handleSecurityChange('newPassword', e.target.value)}
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
                                            value={securityData.confirmPassword}
                                            onChange={(e) => handleSecurityChange('confirmPassword', e.target.value)}
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
                                >
                                    Simpan
                                </Button>
                            </div>
                        </div>
                    </TabsContent>
                </Tabs>


            </div>
        </main>
    )
}