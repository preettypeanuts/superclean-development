"use client";
import { useRouter } from "next/navigation";
import DiscountForm, { Diskon } from "apps/admin-app/app/master-data/diskon/form";
import { useToast } from "@ui-components/hooks/use-toast";
import { useState } from "react";
import { api } from "@shared/utils/apiClient";
import { ConfirmSaveDialog } from "@ui-components/components/save-dialog";

export default function NewDiscount() {
  const router = useRouter();

  const { toast } = useToast();
  const [formData, setFormData] = useState<Diskon>({
    code: "",
    name: "",
    category: "",
    promoType: "Nominal",
    serviceCode: "",
    amount: 0,
    minItem: 1,
    endDate: "",
  });

  const [showConfirmDialog, setShowConfirmDialog] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleCheckSubmit = () => {
    // Validate form before submission
    if (!validateForm()) {
      toast({
        title: "Validasi Gagal",
        description: "Mohon lengkapi semua field yang wajib diisi dengan benar",
        variant: "destructive",
      });
      return;
    }
    setShowConfirmDialog(true);
  }

  const handleSubmit = async () => {
    // Validate form before submission
    if (!validateForm()) {
      toast({
        title: "Validasi Gagal",
        description: "Mohon lengkapi semua field yang wajib diisi dengan benar",
        variant: "destructive",
      });
      return;
    }

    // Ensure minItem is at least 1 before submission
    const minItemValue = formData.minItem || 1;

    // Konversi data sebelum dikirim ke API
    const formattedData = {
      ...formData,
      amount: Number(formData.amount) || 0, // Pastikan amount berupa number
      minItem: minItemValue, // Pastikan minItem minimal 1
      endDate: formData.endDate ? `${formData.endDate}T12:00:00.000Z` : null, // Format tanggal ke ISO 8601
    };

    try {
      setIsLoading(true);
      await api.post("/promo", formattedData);
      toast({
        title: "Berhasil",
        description: "Promo berhasil ditambahkan!",
        variant: "default",
      });
      router.push("/master-data/diskon");
    } catch (error: any) {
      console.error("Error creating promo:", error);

      // Handle different types of API errors
      let errorMessage = "Terjadi kesalahan saat menambahkan promo.";
      let shouldHighlightCodeField = false;

      // Check for specific error messages
      const errorMsg = error.response?.data?.message || error.message || "";

      if (errorMsg.includes("already exists") || errorMsg.includes("sudah ada") || errorMsg.includes("duplicate")) {
        errorMessage = `Kode promo "${formData.code}" sudah digunakan. Silakan gunakan kode yang berbeda.`;
        shouldHighlightCodeField = true;
      } else if (error.response?.data?.message) {
        errorMessage = error.response.data.message;
      } else if (error.response?.status === 400) {
        errorMessage = "Data yang dikirim tidak valid. Mohon periksa kembali.";
      } else if (error.response?.status === 409) {
        errorMessage = `Kode promo "${formData.code}" sudah digunakan. Silakan gunakan kode yang berbeda.`;
        shouldHighlightCodeField = true;
      } else if (error.response?.status === 422) {
        errorMessage = "Data tidak dapat diproses. Periksa format data yang diinput.";
      } else if (error.response?.status >= 500) {
        errorMessage = "Server sedang mengalami gangguan. Coba lagi nanti.";
      }

      // Highlight the code field if it's a duplicate error
      if (shouldHighlightCodeField) {
        setErrors(prevErrors => ({
          ...prevErrors,
          code: `Kode promo "${formData.code}" sudah digunakan`
        }));
      }

      toast({
        title: "Gagal",
        description: errorMessage,
        variant: "destructive",
      });
    }
    finally {
      setIsLoading(false);
      setShowConfirmDialog(false);
    }
  };

  const [errors, setErrors] = useState({
    code: "",
    name: "",
    amount: "",
    promoType: "",
    category: "",
    serviceCode: "",
    minItem: "",
    endDate: "",
  });

  const validateForm = () => {
    const newErrors = { ...errors };
    let isValid = true;

    // Validate required fields
    if (!formData.code.trim()) {
      newErrors.code = "Kode promo wajib diisi";
      isValid = false;
    } else if (formData.code.length < 3) {
      newErrors.code = "Kode promo minimal 3 karakter";
      isValid = false;
    }

    if (!formData.name.trim()) {
      newErrors.name = "Nama promo wajib diisi";
      isValid = false;
    } else if (formData.name.length < 3) {
      newErrors.name = "Nama promo minimal 3 karakter";
      isValid = false;
    }

    if (!formData.amount) {
      newErrors.amount = "Jumlah potongan wajib diisi";
      isValid = false;
    } else if (formData.promoType === "Persentase" && (formData.amount <= 0 || formData.amount > 100)) {
      newErrors.amount = "Persentase harus antara 1-100";
      isValid = false;
    } else if (formData.promoType !== "Persentase" && formData.amount <= 0) {
      newErrors.amount = "Nominal potongan harus lebih dari 0";
      isValid = false;
    }

    if (!formData.promoType) {
      newErrors.promoType = "Tipe potongan wajib dipilih";
      isValid = false;
    }

    if (!formData.category) {
      newErrors.category = "Kategori wajib dipilih";
      isValid = false;
    }

    if (!formData.serviceCode) {
      newErrors.serviceCode = "Layanan wajib dipilih";
      isValid = false;
    }

    const minItemValue = formData.minItem;
    if (!formData.minItem || minItemValue < 1) {
      newErrors.minItem = "Minimal item harus bernilai 1 atau lebih";
      isValid = false;
    }

    if (!formData.endDate) {
      newErrors.endDate = "Masa berlaku wajib diisi";
      isValid = false;
    } else {
      const selectedDate = new Date(formData.endDate);
      const today = new Date();
      today.setHours(0, 0, 0, 0);

      if (selectedDate < today) {
        newErrors.endDate = "Masa berlaku tidak boleh kurang dari hari ini";
        isValid = false;
      }
    }

    setErrors(newErrors);
    return isValid;
  };

  return <>
    <DiscountForm
      isEditMode={false}
      onSubmit={handleSubmit}
      router={router}
      errors={errors}
      formData={formData}
      setErrors={setErrors}
      setFormData={setFormData}
    />

    {/* Dialog Konfirmasi */}
    <ConfirmSaveDialog
      open={showConfirmDialog}
      onOpenChange={setShowConfirmDialog}
      onConfirm={handleSubmit}
      isLoading={false} // Set to true if you have a loading state
    />
  </>
}



