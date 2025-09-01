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
import { FaEye, FaEyeSlash } from "react-icons/fa";
import KaryawanForm, { MasterKaryawan } from "apps/admin-app/app/master-data/karyawan/form";


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

  const [formData, setFormData] = useState<MasterKaryawan>({
    id: null,
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

  const [errors, setErrors] = useState<FormErrors>({});
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);


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

  const handleSubmit = async (data: MasterKaryawan): Promise<void> => {
    setIsSubmitting(true);

    try {
      await api.post("/user", data);

      toast({
        title: "Berhasil!",
        description: `Karyawan ${data.fullname} berhasil ditambahkan`,
        variant: "default",
      });

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


  return (
    <>
      <KaryawanForm
        toast={toast}
        initialData={formData}
        isEdit={false}
        loadingSubmit={isSubmitting}
        onSubmit={handleSubmit}
      />
    </>
  )
}
