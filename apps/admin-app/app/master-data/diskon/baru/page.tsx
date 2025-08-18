"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Wrapper } from "@shared/components/Wrapper";
import { Input } from "libs/ui-components/src/components/ui/input";
import { Label } from "libs/ui-components/src/components/ui/label";
import { Button } from "libs/ui-components/src/components/ui/button";
import { useToast } from "libs/ui-components/src/hooks/use-toast";
import { api } from "libs/utils/apiClient";
import { Breadcrumbs } from "@shared/components/ui/Breadcrumbs";
import { RadioGroup, RadioGroupItem } from "@ui-components/components/ui/radio-group";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue, SelectGroup, SelectLabel } from "libs/ui-components/src/components/ui/select";
import { useCategoryStore } from "libs/utils/useCategoryStore";
import { formatRupiah, unformatRupiah } from "libs/utils/formatRupiah";

export default function NewDiscount() {
  const { toast } = useToast();
  const router = useRouter();
  const { catLayananMapping, loading: loadingParams } = useCategoryStore();

  const [serviceCodeMapping, setServiceCodeMapping] = useState({});
  const [serviceCodeLoading, setServiceCodeLoading] = useState(false);

  const [formData, setFormData] = useState({
    code: "",
    name: "",
    amount: "",
    promoType: "Nominal", // Default to Nominal
    category: "",
    serviceCode: "",
    minItem: "1", // Set default value to "1"
    endDate: "",
  });

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

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { id, value } = e.target;
    setFormData({ ...formData, [id]: value });

    // Clear error when user starts typing
    if (errors[id as keyof typeof errors]) {
      setErrors({ ...errors, [id]: "" });
    }
  };

  // Handle minItem change with validation
  const handleMinItemChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;

    // Allow empty string while typing, but prevent negative values
    if (value === "" || (parseInt(value) >= 1 && !isNaN(parseInt(value)))) {
      setFormData({ ...formData, minItem: value });

      // Clear error when valid input
      if (errors.minItem) {
        setErrors({ ...errors, minItem: "" });
      }
    } else {
      // Set error for invalid input
      setErrors({ ...errors, minItem: "Minimal item harus bernilai 1 atau lebih" });
    }
  };

  const handleSelectChange = (field: string, value: string) => {
    setFormData({ ...formData, [field]: value });

    // Clear error when user selects a value
    if (errors[field as keyof typeof errors]) {
      setErrors({ ...errors, [field]: "" });
    }
  };

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

    if (!formData.amount.trim()) {
      newErrors.amount = "Jumlah potongan wajib diisi";
      isValid = false;
    } else if (formData.promoType === "Persentase" && (parseFloat(formData.amount) <= 0 || parseFloat(formData.amount) > 100)) {
      newErrors.amount = "Persentase harus antara 1-100";
      isValid = false;
    } else if (formData.promoType !== "Persentase" && parseFloat(formData.amount) <= 0) {
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

    const minItemValue = parseInt(formData.minItem);
    if (!formData.minItem.trim() || minItemValue < 1) {
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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

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
    const minItemValue = parseInt(formData.minItem) || 1;

    console.log("Data sebelum dikirim:", formData);

    // Konversi data sebelum dikirim ke API
    const formattedData = {
      ...formData,
      amount: Number(formData.amount) || 0, // Pastikan amount berupa number
      minItem: minItemValue, // Pastikan minItem minimal 1
      endDate: formData.endDate ? `${formData.endDate}T12:00:00.000Z` : null, // Format tanggal ke ISO 8601
    };

    console.log("Data yang dikirim:", formattedData);

    try {
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
  };

  // Fetch service codes mapping when selected category changes
  const fetchServiceCodes = async (category: string) => {
    try {
      setServiceCodeLoading(true);

      const response = await api.get(`/service/lookup?category=${category}`);
      const newServiceCodes = {};
      response.data?.forEach(item => {
        newServiceCodes[item.serviceCode] = item.serviceName;
      });

      console.log(newServiceCodes);
      setServiceCodeMapping(newServiceCodes);
    } catch (error) {
      console.error("Error fetching service codes:", error);
      toast({
        title: "Gagal",
        description: "Gagal memuat layanan. Silakan coba lagi.",
        variant: "destructive",
      });
    } finally {
      setServiceCodeLoading(false);
    }
  };

  useEffect(() => {
    // Fetch service codes when category is selected
    if (formData.category) {
      fetchServiceCodes(formData.category);
      setFormData(prev => ({ ...prev, serviceCode: "" })); // Reset serviceCode when category changes
    } else {
      setServiceCodeMapping({});
    }
  }, [formData.category]);

  return (
    <>
      <Breadcrumbs label="Tambah Promo Baru" />
      <Wrapper>
        <form className="space-y-4" onSubmit={handleSubmit}>
          <div className="flex items-center space-x-4">
            <Label htmlFor="code" className="w-1/4 font-semibold ">Kode Promo</Label>
            <div className="w-full">
              <Input
                placeholder="Masukkan Kode Promo"
                className={`uppercase ${errors.code ? 'border-red-500' : ''}`}
                id="code"
                value={formData.code}
                onChange={handleChange}
              />
              {errors.code && <p className="text-red-500 text-sm mt-1">{errors.code}</p>}
            </div>
          </div>
          <div className="flex items-center space-x-4">
            <Label htmlFor="name" className="w-1/4 font-semibold">Nama Promo</Label>
            <div className="w-full">
              <Input
                placeholder="Masukkan Nama Promo"
                id="name"
                className={errors.name ? 'border-red-500' : ''}
                value={formData.name}
                onChange={handleChange}
              />
              {errors.name && <p className="text-red-500 text-sm mt-1">{errors.name}</p>}
            </div>
          </div>

          {/* Tipe Promo */}
          <div className="flex items-center space-x-4">
            <Label htmlFor="promoType" className="w-1/4 font-semibold">Tipe Potongan</Label>
            <div className="w-full">
              <RadioGroup
                value={formData.promoType || "Nominal"}
                onValueChange={(value) => {
                  setFormData({ ...formData, promoType: value });
                  if (errors.promoType) {
                    setErrors({ ...errors, promoType: "" });
                  }
                }}
                className="flex items-center gap-5"
              >
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="Nominal" id="Nominal" />
                  <Label className="capitalize" htmlFor="Nominal">Nominal</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="Persentase" id="Persentase" />
                  <Label className="capitalize" htmlFor="Persentase">Persentase</Label>
                </div>
              </RadioGroup>
              {errors.promoType && <p className="text-red-500 text-sm mt-1">{errors.promoType}</p>}
            </div>
          </div>
          {formData.promoType !== "Persentase" ? (
            <div className="flex items-center space-x-4">
              <Label htmlFor="amount" className="w-1/4 font-semibold">Potongan Rp</Label>
              <div className="w-full">
                <Input
                  className={`text-right ${errors.amount ? 'border-red-500' : ''}`}
                  placeholder="Masukkan Potongan Harga"
                  type="text"
                  id="amount"
                  value={formatRupiah(formData.amount)}
                  onChange={(e) => {
                    const value = e.target.value.replace(/[^0-9]/g, "");
                    setFormData({ ...formData, amount: unformatRupiah(value).toString() });
                    if (errors.amount) {
                      setErrors({ ...errors, amount: "" });
                    }
                  }}
                />
                {errors.amount && <p className="text-red-500 text-sm mt-1">{errors.amount}</p>}
              </div>
            </div>
          ) : (
            <div className="flex items-center space-x-4">
              <Label htmlFor="amount" className="w-1/4 font-semibold">Potongan %</Label>
              <div className="relative w-full">
                  <div className="flex items-center relative">
                    <Input
                      className={`text-right placeholder:text-start pr-7 no-spinner ${errors.amount ? 'border-red-500' : ''}`}
                      placeholder="Masukkan Potongan Persentase"
                      type="number"
                      id="amount"
                      min="1"
                      max="100"
                      value={formData.amount}
                      onChange={handleChange}
                    />
                    <span className="absolute inset-y-0 right-3 flex items-center font-semibold">%</span>
                  </div>
                {errors.amount && <p className="text-red-500 text-sm mt-1">{errors.amount}</p>}
              </div>
            </div>
          )}

          <div className="flex items-center space-x-4">
            <Label htmlFor="category" className="w-1/4">
              Kategori
            </Label>
            <div className="w-full">
              <Select
                onValueChange={(value) => handleSelectChange("category", value)}
                value={formData.category}
                disabled={loadingParams}
              >
                <SelectTrigger className={`w-full ${errors.category ? 'border-red-500' : ''}`}>
                  <SelectValue placeholder="Pilih Kategori" />
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
              {errors.category && <p className="text-red-500 text-sm mt-1">{errors.category}</p>}
            </div>
          </div>

          <div className="flex items-center space-x-4">
            <Label htmlFor="unit" className="w-1/4">
              Layanan
            </Label>
            <div className="w-full">
              <Select
                value={formData.serviceCode}
                onValueChange={(value) => handleSelectChange("serviceCode", value)}
                disabled={!formData.category || serviceCodeLoading || Object.keys(serviceCodeMapping).length === 0}
              >
                <SelectTrigger className={`w-full ${errors.serviceCode ? 'border-red-500' : ''}`}>
                  <SelectValue placeholder={Object.keys(serviceCodeMapping).length > 0 ? "Pilih Layanan" : "Tidak ada Layanan"} />
                </SelectTrigger>
                <SelectContent>
                  <SelectGroup>
                    {loadingParams ? (
                      <SelectItem value="loading" disabled>
                        Loading...
                      </SelectItem>
                    ) : (
                        Object.keys(serviceCodeMapping).map((key) => (
                          <SelectItem key={key} value={key}>
                            {serviceCodeMapping[key]}
                          </SelectItem>
                        ))
                    )}
                  </SelectGroup>
                </SelectContent>
              </Select>
              {errors.serviceCode && <p className="text-red-500 text-sm mt-1">{errors.serviceCode}</p>}
            </div>
          </div>

          <div className="flex items-center space-x-4">
            <Label htmlFor="minItem" className="w-1/4 font-semibold">Minimal Item</Label>
            <div className="w-full">
              <Input
                placeholder="Masukkan Minimal Item"
                type="number"
                id="minItem"
                min="1"
                className={errors.minItem ? 'border-red-500' : ''}
                value={formData.minItem}
                onChange={handleMinItemChange}
              />
              {errors.minItem && <p className="text-red-500 text-sm mt-1">{errors.minItem}</p>}
            </div>
          </div>
          <div className="flex items-center space-x-4">
            <Label htmlFor="endDate" className="w-1/4 font-semibold">Masa Berlaku</Label>
            <div className="w-full">
              <Input
                type="date"
                className={`flex w-full ${errors.endDate ? 'border-red-500' : ''}`}
                id="endDate"
                value={formData.endDate}
                onChange={handleChange}
              />
              {errors.endDate && <p className="text-red-500 text-sm mt-1">{errors.endDate}</p>}
            </div>
          </div>
          <div className="space-x-2 flex justify-end">
            <Button type="button" variant="outline2" onClick={() => router.back()}>
              Kembali
            </Button>
            <Button type="submit" variant="main">
              Simpan
            </Button>
          </div>
        </form>
      </Wrapper>
    </>
  );
}
