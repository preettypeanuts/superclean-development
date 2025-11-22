"use client";
import { Wrapper } from "@shared/components/Wrapper";
import { usePathname, useRouter } from "next/navigation";

import { Breadcrumbs } from "@shared/components/ui/Breadcrumbs";
import DiscountForm, { Diskon, DiskonErrors } from "apps/admin-app/app/master-data/promo/form";
import { useToast } from "libs/ui-components/src/hooks/use-toast";
import { api } from "libs/utils/apiClient";
import { Dispatch, useEffect, useState } from "react";


export default function EditDiskon() {
  const router = useRouter();
  const { toast } = useToast();
  const pathname = usePathname();
  const id = pathname.split("/").pop();

  const [formData, setFormData] = useState<Diskon | null>(null);
  const [errors, setErrors] = useState<DiskonErrors>({
    code: "",
    name: "",
    amount: "",
    promoType: "",
    category: "",
    serviceCode: "",
    minItem: "",
    endDate: "",
  });

  useEffect(() => {
    const fetchDiskon = async () => {
      try {
        const result = await api.get(`/promo/id/${id}`);
        const { code, name, category, promoType, serviceCode, amount, minItem, endDate } = result.data;
        setFormData({
          code,
          name,
          category,
          promoType,
          serviceCode,
          amount: Number(amount),
          minItem: Number(minItem),
          endDate: endDate ? new Date(endDate).toISOString().split("T")[0] : "",
        });
      } catch (error) {
        console.error("Gagal mengambil data diskon:", error);
      }
    };
    fetchDiskon();
  }, [id]);

  const validateForm = () => {
    if (!formData) return false;

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

  const handleSubmit = async () => {
    if (!validateForm()) {
      toast({
        title: "Validasi Gagal",
        description: "Mohon lengkapi semua field yang wajib diisi dengan benar",
        variant: "destructive",
      });
      return;
    }

    if (!formData) return;

    const updatedData = {
      name: formData.name,
      category: formData.category,
      promoType: formData.promoType,
      serviceCode: formData.serviceCode,
      amount: formData.amount,
      minItem: formData.minItem,
      endDate: formData.endDate,
    };

    try {
      const response = await api.put(`/promo/${id}`, updatedData);
      toast({
        title: "Berhasil",
        description: "Diskon berhasil diperbarui!",
        variant: "success",
      });
      router.push("/master-data/promo");
    } catch (error) {
      console.error("Gagal memperbarui diskon:", error);
      toast({
        title: "Gagal",
        description: "Terjadi kesalahan saat mengubah data diskon.",
        variant: "destructive",
      });
    }
  };

  if (!formData) {
    return <>
      <Breadcrumbs label={`Edit Promo`} />
      <Wrapper>
        <p className="text-center py-4 text-red-500">Diskon tidak ditemukan!</p>
      </Wrapper>
    </>
  }

  return (
    <>
      <DiscountForm
        isEditMode={true}
        onSubmit={handleSubmit}
        router={router}
        formData={formData}
        errors={errors}
        setErrors={setErrors}
        setFormData={setFormData as Dispatch<React.SetStateAction<Diskon>>}
        id={id} />
    </>
  );
}
