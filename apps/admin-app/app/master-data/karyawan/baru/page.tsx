"use client";
import { useState } from "react";
import { Wrapper } from "@shared/components/Wrapper";
import { Input } from "libs/ui-components/src/components/ui/input";
import { Label } from "libs/ui-components/src/components/ui/label";
import { Button } from "libs/ui-components/src/components/ui/button";
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
import { DatePickerInput } from "libs/ui-components/src/components/date-picker-input";
import { Breadcrumbs } from "@shared/components/ui/Breadcrumbs";

// Types and Interfaces
interface FormData {
    username: string;
    fullname: string;
    noWhatsapp: string;
    password: string;
    branchId: string;
    roleId: string;
    birthDate: string; // Format: YYYY-MM-DD
    joinDate: string; // Format: YYYY-MM-DD
    status: 1 | 2; // 1 = Active, 2 = Inactive
}

interface FormErrors {
    username?: string;
    fullname?: string;
    noWhatsapp?: string;
    password?: string;
    branchId?: string;
    roleId?: string;
    birthDate?: string;
    joinDate?: string;
}

interface ApiErrorResponse {
    message?: string;
    errors?: Record<string, string[]>;
}

interface ApiError extends Error {
    response?: {
        status: number;
        data: ApiErrorResponse;
    };
    request?: unknown;
}

// Type for form field keys
type FormFieldKeys = keyof FormData;

// Type for parameter store
interface ParameterStore {
    roleMapping: Record<string, string> | null;
    branchMapping: Record<string, string> | null;
    loading: boolean;
}

export default function NewKaryawan(): JSX.Element {
    const { toast } = useToast();
    const router = useRouter();
    const { roleMapping, branchMapping, loading: loadingParams }: ParameterStore = useParameterStore();

    const [formData, setFormData] = useState<FormData>({
        username: "",
        fullname: "",
        noWhatsapp: "",
        password: "",
        branchId: "",
        roleId: "",
        birthDate: "",
        joinDate: "",
        status: 1,
    });

    console.log(formData)

    const [errors, setErrors] = useState<FormErrors>({});
    const [isSubmitting, setIsSubmitting] = useState<boolean>(false);

    // Validation function
    const validateForm = (): boolean => {
        const newErrors: FormErrors = {};

        if (!formData.username.trim()) {
            newErrors.username = "Nama pengguna wajib diisi";
        } else if (formData.username.length < 3) {
            newErrors.username = "Nama pengguna minimal 3 karakter";
        } else if (!/^(?!.*\.\.)(?!\.)(?!.*\.$)[a-zA-Z0-9_.]+$/.test(formData.username)) {
            newErrors.username = "Nama pengguna hanya boleh huruf, angka, underscore, dan titik (tidak boleh diawali/diakhiri titik atau ada titik ganda)";
        }


        if (!formData.fullname.trim()) {
            newErrors.fullname = "Nama lengkap wajib diisi";
        } else if (formData.fullname.length < 2) {
            newErrors.fullname = "Nama lengkap minimal 2 karakter";
        }

        if (!formData.noWhatsapp.trim()) {
            newErrors.noWhatsapp = "Nomor WhatsApp wajib diisi";
        } else if (!/^(\+62|62|0)[0-9]{9,13}$/.test(formData.noWhatsapp.replace(/\s/g, ''))) {
            newErrors.noWhatsapp = "Format nomor WhatsApp tidak valid";
        }

        if (!formData.password.trim()) {
            newErrors.password = "Kata sandi wajib diisi";
        } else if (formData.password.length < 6) {
            newErrors.password = "Kata sandi minimal 6 karakter";
        }

        if (!formData.birthDate) {
            newErrors.birthDate = "Tanggal lahir wajib diisi";
        } else {
            const birthYear = new Date(formData.birthDate).getFullYear();
            const currentYear = new Date().getFullYear();
            if (currentYear - birthYear < 17) {
                newErrors.birthDate = "Usia minimal 17 tahun";
            } else if (currentYear - birthYear > 70) {
                newErrors.birthDate = "Usia maksimal 70 tahun";
            }
        }

        if (!formData.joinDate) {
            newErrors.joinDate = "Tanggal bergabung wajib diisi";
        } else {
            const joinDate = new Date(formData.joinDate);
            const today = new Date();
            if (joinDate > today) {
                newErrors.joinDate = "Tanggal bergabung tidak boleh melebihi hari ini";
            }
        }

        if (!formData.branchId) {
            newErrors.branchId = "Cabang wajib dipilih";
        }

        if (!formData.roleId) {
            newErrors.roleId = "Akses pengguna wajib dipilih";
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>): void => {
        const { id, name, value } = e.target;
        const fieldName = (id || name) as FormFieldKeys;

        setFormData(prev => ({ ...prev, [fieldName]: value }));

        // Clear error when user starts typing
        if (errors[fieldName]) {
            setErrors(prev => ({ ...prev, [fieldName]: undefined }));
        }
    };

    const handleSelectChange = (id: FormFieldKeys, value: string | number): void => {
        setFormData(prev => ({ ...prev, [id]: value }));

        // Clear error when user selects value
        if (errors[id]) {
            setErrors(prev => ({ ...prev, [id]: undefined }));
        }
    };

    const handleDateChange = (field: 'birthDate' | 'joinDate') => (date: string): void => {
        setFormData(prev => ({ ...prev, [field]: date }));

        // Clear error when user selects date
        if (errors[field]) {
            setErrors(prev => ({ ...prev, [field]: undefined }));
        }
    };

    const handleCheckboxChange = (checked: boolean | 'indeterminate'): void => {
        const status: 1 | 2 = checked === true ? 1 : 2;
        handleSelectChange('status', status);
    };

    const getErrorMessage = (error: ApiError): { title: string; message: string } => {
        let errorMessage = "Terjadi kesalahan saat menambahkan karyawan";
        let errorTitle = "Gagal Menambahkan Karyawan";

        if (error.response) {
            const status = error.response.status;
            const data = error.response.data;

            switch (status) {
                case 400:
                    errorTitle = "Data Tidak Valid";
                    if (data.message) {
                        errorMessage = data.message;
                    } else if (data.errors) {
                        const backendErrors: FormErrors = {};
                        Object.keys(data.errors).forEach((key) => {
                            const typedKey = key as keyof FormErrors;
                            if (data.errors && data.errors[key] && data.errors[key][0]) {
                                backendErrors[typedKey] = data.errors[key][0];
                            }
                        });
                        setErrors(backendErrors);
                        errorMessage = "Mohon periksa kembali data yang diisi";
                    } else {
                        errorMessage = "Data yang dikirim tidak valid";
                    }
                    break;
                case 409:
                    errorTitle = "Data Sudah Ada";
                    errorMessage = data.message || "Username atau nomor WhatsApp sudah digunakan";
                    break;
                case 422:
                    errorTitle = "Validasi Gagal";
                    errorMessage = data.message || "Data tidak memenuhi syarat validasi";
                    break;
                case 500:
                    errorTitle = "Kesalahan Server";
                    errorMessage = "Terjadi kesalahan pada server. Silakan coba lagi nanti";
                    break;
                case 401:
                    errorTitle = "Tidak Terotorisasi";
                    errorMessage = "Sesi Anda telah berakhir. Silakan login kembali";
                    break;
                case 403:
                    errorTitle = "Akses Ditolak";
                    errorMessage = "Anda tidak memiliki akses untuk menambahkan karyawan";
                    break;
                default:
                    errorMessage = `Kesalahan ${status}: ${data.message || 'Terjadi kesalahan tidak terduga'}`;
            }
        } else if (error.request) {
            errorTitle = "Masalah Koneksi";
            errorMessage = "Tidak dapat terhubung ke server. Periksa koneksi internet Anda";
        }

        return { title: errorTitle, message: errorMessage };
    };

    const resetForm = (): void => {
        setFormData({
            username: "",
            fullname: "",
            noWhatsapp: "",
            password: "",
            branchId: "",
            roleId: "",
            birthDate: "",
            joinDate: "",
            status: 1,
        });
        setErrors({});
    };

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>): Promise<void> => {
        e.preventDefault();

        if (!validateForm()) {
            toast({
                title: "Form Tidak Valid",
                description: "Mohon periksa kembali data yang diisi",
                variant: "destructive",
            });
            return;
        }

        setIsSubmitting(true);

        try {
            console.log("Data yang dikirim:", formData);

            await api.post("/user", formData);

            toast({
                title: "Berhasil!",
                description: `Karyawan ${formData.fullname} berhasil ditambahkan`,
                variant: "default",
            });

            resetForm();

            setTimeout(() => {
                router.push("/master-data/karyawan");
            }, 1000);

        } catch (error) {
            console.error("Error adding employee:", error);

            const apiError = error as ApiError;
            const { title, message } = getErrorMessage(apiError);

            toast({
                title,
                description: message,
                variant: "destructive",
            });
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleBackClick = (): void => {
        router.push("/master-data/karyawan");
    };

    const renderFormField = (
        label: string,
        fieldName: FormFieldKeys,
        required: boolean = true,
        children: React.ReactNode
    ): JSX.Element => (
        <div className="flex items-start space-x-4">
            <Label className="w-1/4 font-semibold mt-2">
                {label}
            </Label>
            <div className="flex-1">
                {children}
                {errors[fieldName] && (
                    <p className="text-red-500 text-sm mt-1">{errors[fieldName]}</p>
                )}
            </div>
        </div>
    );

    return (
        <>
            <Breadcrumbs label="Tambah Karyawan Baru" />
            <Wrapper>
                <form className="space-y-4" onSubmit={handleSubmit}>
                    {renderFormField("Nama Pengguna", "username", true,
                        <Input
                            placeholder="Masukkan Nama Pengguna"
                            id="username"
                            value={formData.username}
                            onChange={handleChange}
                            className={errors.username ? "border-red-500" : ""}
                        />
                    )}

                    {renderFormField("Nama Lengkap", "fullname", true,
                        <Input
                            placeholder="Masukkan Nama lengkap karyawan"
                            id="fullname"
                            value={formData.fullname}
                            onChange={handleChange}
                            className={errors.fullname ? "border-red-500" : ""}
                        />
                    )}

                    {renderFormField("No WhatsApp", "noWhatsapp", true,
                        <Input
                            placeholder="Masukkan no WhatsApp (contoh: 08123456789)"
                            type="text"
                            id="noWhatsapp"
                            value={formData.noWhatsapp}
                            onChange={handleChange}
                            className={errors.noWhatsapp ? "border-red-500" : ""}
                        />
                    )}

                    {renderFormField("Kata Sandi", "password", true,
                        <Input
                            placeholder="Masukkan kata sandi (minimal 6 karakter)"
                            type="password"
                            id="password"
                            value={formData.password}
                            onChange={handleChange}
                            className={errors.password ? "border-red-500" : ""}
                        />
                    )}

                    {renderFormField("Tanggal Lahir", "birthDate", true,
                        <DatePickerInput
                            value={formData.birthDate}
                            onChange={handleDateChange("birthDate")}
                            placeholder="DD/MM/YYYY"
                            className={errors.birthDate ? "border-red-500" : ""}
                        />
                    )}

                    {renderFormField("Tanggal Bergabung", "joinDate", true,
                        <DatePickerInput
                            value={formData.joinDate}
                            onChange={handleDateChange("joinDate")}
                            placeholder="DD/MM/YYYY"
                            className={errors.joinDate ? "border-red-500" : ""}
                        />
                    )}

                    {renderFormField("Cabang", "branchId", true,
                        <Select
                            onValueChange={(value: string) => handleSelectChange("branchId", value)}
                            value={formData.branchId}
                            disabled={loadingParams}
                        >
                            <SelectTrigger className={`w-full ${errors.branchId ? "border-red-500" : ""}`}>
                                <SelectValue placeholder={loadingParams ? "Memuat cabang..." : "Pilih Lokasi Cabang"} />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectGroup>
                                    <SelectLabel>Cabang</SelectLabel>
                                    {loadingParams ? (
                                        <SelectItem value="loading" disabled>Loading...</SelectItem>
                                    ) : branchMapping && Object.keys(branchMapping).length > 0 ? (
                                        Object.keys(branchMapping).map((key: string) => (
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
                    )}

                    {renderFormField("Akses Pengguna", "roleId", true,
                        <Select
                            onValueChange={(value: string) => handleSelectChange("roleId", value)}
                            value={formData.roleId}
                            disabled={loadingParams}
                        >
                            <SelectTrigger className={`w-full ${errors.roleId ? "border-red-500" : ""}`}>
                                <SelectValue placeholder={loadingParams ? "Memuat role..." : "Pilih Akses Pengguna"} />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectGroup>
                                    <SelectLabel>Role</SelectLabel>
                                    {loadingParams ? (
                                        <SelectItem value="loading" disabled>Loading...</SelectItem>
                                    ) : roleMapping && Object.keys(roleMapping).length > 0 ? (
                                        Object.keys(roleMapping).map((key: string) => (
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
                    )}

                    <div className="flex items-center space-x-4">
                        <Label className="w-1/4 font-semibold">Status</Label>
                        <div className="flex items-center space-x-2">
                            <Checkbox
                                checked={formData.status === 1}
                                onCheckedChange={handleCheckboxChange}
                            />
                            <Label>{formData.status === 1 ? "Aktif" : "Tidak Aktif"}</Label>
                        </div>
                    </div>

                    <div className="flex justify-end w-full space-x-2 pt-4">
                        <Button
                            type="button"
                            variant="outline2"
                            onClick={handleBackClick}
                            disabled={isSubmitting}
                        >
                            Kembali
                        </Button>
                        <Button
                            type="submit"
                            variant="main"
                            disabled={isSubmitting || loadingParams}
                        >
                            {isSubmitting ? "Menyimpan..." : "Simpan"}
                        </Button>
                    </div>
                </form>
            </Wrapper>
        </>
    );
}