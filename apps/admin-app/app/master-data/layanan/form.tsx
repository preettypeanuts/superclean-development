"use client";
import { useState } from "react";
import { Wrapper } from "@shared/components/Wrapper";
import { Input } from "libs/ui-components/src/components/ui/input";
import { Label } from "libs/ui-components/src/components/ui/label";
import { Button } from "libs/ui-components/src/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
  SelectGroup,
  SelectLabel,
} from "libs/ui-components/src/components/ui/select";
import { LuSave } from "react-icons/lu";
import { TbArrowBack } from "react-icons/tb";
import { useCategoryStore } from "libs/utils/useCategoryStore";
import { api } from "libs/utils/apiClient";
import { useRouter } from "next/navigation";
import { useToast } from "libs/ui-components/src/hooks/use-toast";
import { Checkbox } from "libs/ui-components/src/components/ui/checkbox";
import { Breadcrumbs } from "@shared/components/ui/Breadcrumbs";
import { formatRupiah, unformatRupiah } from "libs/utils/formatRupiah";


export interface Layanan {
  code: string;
  name: string;
  category: string;
  unit: string;
  vacuumPrice: number;
  cleanPrice: number;
  status: 1 | 0;
}

export interface LayananFormProps {
  layanan?: Layanan;
}

export default function LayananForm() {
  const { toast } = useToast();
  const router = useRouter();

  const { unitLayananMapping, catLayananMapping, loading: loadingParams } = useCategoryStore();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [formData, setFormData] = useState<Layanan>({
    code: "",
    name: "",
    category: "",
    unit: "",
    vacuumPrice: 0,
    cleanPrice: 0,
    status: 1,
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.id]: e.target.value });
  };

  const handleSelectChange = (id: string, value: string | number) => {
    if (id === "category") {
      const isGeneral = value === "GENERAL" ? 1 : 0;
      setFormData({
        ...formData,
        category: String(value),
        vacuumPrice: isGeneral ? 0 : formData.vacuumPrice,
        cleanPrice: isGeneral ? 0 : formData.cleanPrice,
      });
    } else {
      setFormData({ ...formData, [id]: value });
    }
  };

  // Fungsi untuk validasi form
  const validateForm = (): string | null => {
    if (!formData.code.trim()) {
      return "Kode layanan harus diisi";
    }
    if (!formData.name.trim()) {
      return "Nama layanan harus diisi";
    }
    if (!formData.category) {
      return "Kategori harus dipilih";
    }
    if (!formData.unit) {
      return "Satuan harus dipilih";
    }
    // Validasi harga untuk kategori tertentu
    if (formData.category !== "GENERAL" && formData.category !== "BLOWER") {
      if (unformatRupiah(formData.vacuumPrice) <= 0) {
        return "Harga vacuum harus lebih dari 0";
      }
    }
    if (unformatRupiah(formData.cleanPrice) <= 0) {
      return "Harga cuci harus lebih dari 0";
    }
    return null;
  };

  // Fungsi untuk menghandle error berdasarkan tipe
  const handleApiError = (error: any) => {
    console.error("API Error:", error);

    let errorMessage = "Terjadi kesalahan saat menambahkan layanan.";
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
          errorMessage = "Data layanan dengan kode ini sudah terdaftar.";
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
            if (error.message.includes("code") || error.message.includes("Unique_Code")) {
              errorTitle = "Kode Layanan Sudah Terdaftar";
              errorMessage = "Kode layanan yang Anda masukkan sudah terdaftar di sistem. Silakan gunakan kode lain.";
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
        if (error.message.includes("code") || error.message.includes("Unique_Code")) {
          errorTitle = "Kode Layanan Sudah Terdaftar";
          errorMessage = "Kode layanan yang Anda masukkan sudah terdaftar di sistem. Silakan gunakan kode lain.";
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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Validasi form sebelum submit
    const validationError = validateForm();
    if (validationError) {
      toast({
        title: "Validasi Gagal",
        description: validationError,
        variant: "destructive",
      });
      return;
    }

    setIsSubmitting(true);

    const payload = {
      code: formData.code,
      name: formData.name,
      category: formData.category,
      unit: formData.unit,
      vacuumPrice: unformatRupiah(formData.vacuumPrice),
      cleanPrice: unformatRupiah(formData.cleanPrice),
      status: Number(formData.status),
    };

    console.log("Payload yang dikirim:", JSON.stringify(payload, null, 2));

    try {
      await api.post("/service", payload);
      toast({
        title: "Berhasil",
        description: "Layanan berhasil ditambahkan!",
        variant: "default",
      });
      router.push("/master-data/layanan");
    } catch (error: any) {
      console.error("Error response:", error.response?.data || error.message);
      handleApiError(error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <>
      <Breadcrumbs label="Tambah Layanan Baru" />
      <Wrapper>
        <form className="space-y-4" onSubmit={handleSubmit}>
          <div className="flex items-center space-x-4">
            <Label htmlFor="code" className="w-1/4 font-semibold">
              Kode Layanan
            </Label>
            <Input
              placeholder="Masukkan kode layanan"
              id="code"
              value={formData.code}
              onChange={handleChange}
              disabled={isSubmitting}
            />
          </div>
          <div className="flex items-center space-x-4">
            <Label htmlFor="name" className="w-1/4 font-semibold">
              Nama Layanan
            </Label>
            <Input
              placeholder="Masukkan nama layanan"
              id="name"
              value={formData.name}
              onChange={handleChange}
              disabled={isSubmitting}
            />
          </div>
          <div className="flex items-center space-x-4">
            <Label htmlFor="category" className="w-1/4">
              Kategori
            </Label>
            <Select
              onValueChange={(value) => handleSelectChange("category", value)}
              value={formData.category}
              disabled={loadingParams || isSubmitting}
            >
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Pilih kategori layanan" />
              </SelectTrigger>
              <SelectContent>
                <SelectGroup>
                  <SelectLabel>Kategori</SelectLabel>
                  {loadingParams ? (
                    <SelectItem value="loading" disabled>
                      Loading...
                    </SelectItem>
                  ) : (
                    Object.keys(catLayananMapping).map((key) => (
                      <SelectItem key={key} value={key}>
                        {catLayananMapping[key]}
                      </SelectItem>
                    ))
                  )}
                </SelectGroup>
              </SelectContent>
            </Select>
          </div>
          <div className="flex items-center space-x-4">
            <Label htmlFor="unit" className="w-1/4">
              Satuan
            </Label>
            <Select
              onValueChange={(value) => handleSelectChange("unit", value)}
              value={formData.unit}
              disabled={loadingParams || isSubmitting}
            >
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Pilih satuan layanan" />
              </SelectTrigger>
              <SelectContent>
                <SelectGroup>
                  <SelectLabel>Satuan</SelectLabel>
                  {loadingParams ? (
                    <SelectItem value="loading" disabled>
                      Loading...
                    </SelectItem>
                  ) : (
                    Object.keys(unitLayananMapping).map((key) => (
                      <SelectItem key={key} value={key}>
                        {unitLayananMapping[key]}
                      </SelectItem>
                    ))
                  )}
                </SelectGroup>
              </SelectContent>
            </Select>
          </div>

          <div className="flex items-center space-x-4">
            <Label htmlFor="vacuumPrice" className="w-1/4 font-semibold">
              Harga Vacuum
            </Label>
            <Input
              className="text-right"
              type="text"
              id="vacuumPrice"
              disabled={formData.category === "GENERAL" || formData.category === "BLOWER" || isSubmitting}
              value={formatRupiah(formData.vacuumPrice)}
              onChange={handleChange}
            />
          </div>

          <div className="flex items-center space-x-4">
            <Label htmlFor="cleanPrice" className="w-1/4 font-semibold">
              Harga Cuci
            </Label>
            <Input
              className="text-right"
              type="text"
              id="cleanPrice"
              value={formatRupiah(formData.cleanPrice)}
              onChange={handleChange}
              disabled={isSubmitting}
            />
          </div>

          <div className="flex items-center space-x-4">
            <Label className="w-[20%] font-semibold">Status</Label>
            <div className="flex items-center space-x-2">
              <Checkbox
                checked={formData.status === 1}
                onCheckedChange={(checked) => handleSelectChange("status", checked ? 1 : 0)}
                disabled={isSubmitting}
              />
              <Label>{formData.status === 1 ? "Aktif" : "Tidak Aktif"}</Label>
            </div>
          </div>
          <div className="space-x-2 flex justify-end w-full">
            <Button
              type="button"
              variant="outline2"
              onClick={() => router.back()}
              disabled={isSubmitting}
            >
              <TbArrowBack className="w-4 h-4 mr-2" />
              Kembali
            </Button>
            <Button
              type="submit"
              variant="main"
              disabled={isSubmitting}
            >
              {isSubmitting ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                  Menyimpan...
                </>
              ) : (
                <>
                  <LuSave className="w-4 h-4 mr-2" />
                  Simpan
                </>
              )}
            </Button>
          </div>
        </form>
      </Wrapper>
    </>
  );
}
