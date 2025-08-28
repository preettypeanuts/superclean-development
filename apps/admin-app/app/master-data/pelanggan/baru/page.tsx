"use client";
import { useMemo, useState } from "react";
import { api } from "libs/utils/apiClient";
import { useRouter } from "next/navigation";
import { useToast } from "libs/ui-components/src/hooks/use-toast";
import PelangganForm, { MasterPelanggan } from "apps/admin-app/app/master-data/pelanggan/form";

export default function NewPelanggan() {
  const { toast } = useToast();
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const initialFormData = useMemo(() => {
    return {
      noWhatsapp: "",
      fullname: "",
      address: "",
      province: "",
      customerType: "",
      city: "",
      district: "",
      subDistrict: "",
      status: 1,
      id: null,
    } as MasterPelanggan;
  }, []);

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
  const handleSubmit = async (formData: MasterPelanggan) => {
    try {
      // remove formData.id karena tidak diperlukan saat membuat data baru
      const { id, ...dataToSubmit } = formData;
      await api.post("/customer", dataToSubmit);

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

  return (
    <>
      <PelangganForm
        isEdit={false}
        loadingData={false}
        toast={toast}
        pelanggan={initialFormData}
        onSubmit={handleSubmit}
        loadingSubmit={isSubmitting}
      />
    </>
  )
}
