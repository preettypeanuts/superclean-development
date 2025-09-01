"use client";
import { useEffect, useMemo, useState } from "react";
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
import { FaEye, FaEyeSlash } from "react-icons/fa";

export interface MasterKaryawan {
  id: string | null;
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

type FormFieldKeys = keyof MasterKaryawan;

type KaryawanFormProps = {
  isLoadingData?: boolean;
  initialData: MasterKaryawan;
  isEdit?: boolean;
  toast: any;
  onSubmit: (data: MasterKaryawan) => Promise<void>;
  loadingSubmit?: boolean;
};

export default function KaryawanForm({ isLoadingData, initialData, isEdit, toast, loadingSubmit, onSubmit }: KaryawanFormProps) {
  const router = useRouter();

  const [formData, setFormData] = useState<MasterKaryawan>(initialData);
  useEffect(() => {
    setFormData(initialData);
  }, [initialData]);

  const [errors, setErrors] = useState<FormErrors>({});

  const header = useMemo(() => {
    if (isEdit) {
      return <Breadcrumbs label="Ubah Profil Karyawan" />;
    }
    return <Breadcrumbs label="Tambah Karyawan Baru" />;
  }, [isEdit]);


  if (isEdit && isLoadingData) {
    return (
      <>
        {header}
        <Wrapper>
          <p className="text-center py-4">Memuat data...</p>
        </Wrapper>
      </>
    );
  }

  if (isEdit && !formData.id) {
    return (
      <>
        {header}
        <Wrapper>
          <p className="text-center py-4 text-red-500">Data karyawan tidak ditemukan.</p>
        </Wrapper>
      </>
    );
  }

  const [showPassword, setShowPassword] = useState<boolean>(false);
  const { roleMapping, branchMapping, loading: loadingParams } = useParameterStore();

  // Validation function
  const validateForm = (): boolean => {
    const newErrors: FormErrors = {};

    // Required field validation
    if (!formData.username.trim()) {
      newErrors.username = "Nama pengguna wajib diisi";
    } else if (formData.username.length < 3) {
      newErrors.username = "Nama pengguna minimal 3 karakter";
    } else if (!/^[a-zA-Z0-9_]+$/.test(formData.username)) {
      newErrors.username = "Nama pengguna hanya boleh mengandung huruf, angka, dan underscore";
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

    await onSubmit(formData);
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
      {header}
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
            <div className="relative">
              <Input
                placeholder="Masukkan kata sandi (minimal 6 karakter)"
                type={showPassword ? "text" : "password"}
                id="password"
                value={formData.password}
                onChange={handleChange}
                className={errors.password ? "border-red-500" : ""}
              />

              {/* toggle password */}
              <span
                className="absolute right-2 mr-2 top-1/2 transform -translate-y-1/2 cursor-pointer text-gray-500"
                onClick={() => {
                  setShowPassword(!showPassword);
                }}
              >
                {showPassword ? <FaEye className="text-lg" /> : <FaEyeSlash className="text-lg opacity-50" />}
              </span>
            </div>
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
              disabled={loadingSubmit}
            >
              Kembali
            </Button>
            <Button
              type="submit"
              variant="main"
              disabled={loadingSubmit || loadingParams}
            >
              {loadingSubmit ? "Menyimpan..." : "Simpan"}
            </Button>
          </div>
        </form>
      </Wrapper>
    </>
  );
}
