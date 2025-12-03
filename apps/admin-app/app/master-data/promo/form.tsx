"use client";


import { useCategoryStore } from "@shared/utils/useCategoryStore";
import { useToast } from "@ui-components/hooks/use-toast";
import { Dispatch, SetStateAction, useEffect, useState } from "react";

import { api } from "libs/utils/apiClient";
import { Breadcrumbs } from "@shared/components/ui/Breadcrumbs";
import { Wrapper } from "@shared/components/Wrapper";
import { Input } from "libs/ui-components/src/components/ui/input";
import { Label } from "libs/ui-components/src/components/ui/label";
import { Button } from "libs/ui-components/src/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue, SelectGroup, SelectLabel } from "libs/ui-components/src/components/ui/select";
import { RadioGroup, RadioGroupItem } from "@ui-components/components/ui/radio-group";
import { formatRupiah, unformatRupiah } from "libs/utils/formatRupiah";
import { AppRouterInstance } from "next/dist/shared/lib/app-router-context.shared-runtime";

export interface Diskon {
  code: string;
  name: string;
  category: string;
  promoType: string;
  serviceCode: string;
  amount: number;
  minItem: number;
  endDate: string;
  startDate: string;
}

export type DiskonErrors = {
  code: string;
  name: string;
  amount: string;
  promoType: string;
  category: string;
  serviceCode: string;
  minItem: string;
  endDate: string;
  startDate: string;
};

type DiscountFormProps = {
  isEditMode: boolean;
  router: AppRouterInstance;
  id?: string;
  formData: Diskon;
  setFormData: Dispatch<SetStateAction<Diskon>>;
  errors: DiskonErrors;
  setErrors: Dispatch<SetStateAction<DiskonErrors>>;
  onSubmit: () => void;
};

export default function DiscountForm({
  isEditMode,
  router,
  id,
  formData,
  setFormData,
  errors,
  setErrors,
  onSubmit
}: DiscountFormProps) {
  const { toast } = useToast();

  const {
    catLayananMapping,
    loading: loadingParams,
  } = useCategoryStore();

  const [serviceCodeMapping, setServiceCodeMapping] = useState({});
  const [serviceCodeLoading, setServiceCodeLoading] = useState(false);

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
      setFormData({ ...formData, minItem: value ? parseInt(value) : 1 });

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

  // Fetch service codes mapping when selected category changes
  const fetchServiceCodes = async (category: string) => {
    try {
      setServiceCodeLoading(true);

      const response = await api.get(`/service/lookup?category=${category}`);
      const newServiceCodes = {};
      response.data?.forEach(item => {
        newServiceCodes[item.serviceCode] = item.serviceName;
      });

      setServiceCodeMapping(newServiceCodes);
      let serviceSelected = false;
      for (const key in newServiceCodes) {
        if (newServiceCodes.hasOwnProperty(formData.serviceCode)) {
          serviceSelected = true;
          break;
        }
      }

      if (!serviceSelected) {
        setFormData({ ...formData, serviceCode: "" });
      }

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
    } else {
      setServiceCodeMapping({});
    }
  }, [formData.category]);


  return (
    <>
      <Breadcrumbs label={isEditMode ? "Edit Promo" : "Tambah Promo Baru"} />
      <Wrapper>
        <form className="space-y-4" onSubmit={(e) => { onSubmit() }}>
          <div className="flex items-center space-x-4">
            <Label htmlFor="code" className="w-1/4 font-semibold ">Kode Promo</Label>
            <div className="w-full">
              <Input
                placeholder="Masukkan Kode Promo"
                className={`uppercase ${errors.code ? 'border-red-500' : ''}`}
                id="code"
                disabled={isEditMode}
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
                    setFormData({ ...formData, amount: unformatRupiah(value) });
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
                    placeholder=""
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
            <Label htmlFor="endDate" className="w-1/4 font-semibold">Tanggal Awal</Label>
            <div className="w-full">
              <Input
                type="date"
                className={`flex w-full ${errors.startDate ? 'border-red-500' : ''}`}
                id="startDate"
                value={formData.startDate}
                onChange={(e) => {
                  handleChange(e);
                }}
              />
              {errors.startDate && <p className="text-red-500 text-sm mt-1">{errors.startDate}</p>}
            </div>
          </div>
          <div className="flex items-center space-x-4">
            <Label htmlFor="endDate" className="w-1/4 font-semibold">Tanggal Akhir</Label>
            <div className="w-full">
              <Input
                type="date"
                className={`flex w-full ${errors.endDate ? 'border-red-500' : ''}`}
                id="endDate"
                value={formData.endDate}
                onChange={(e) => {
                  handleChange(e);
                }}
              />
              {errors.endDate && <p className="text-red-500 text-sm mt-1">{errors.endDate}</p>}
            </div>
          </div>
          <div className="space-x-2 flex justify-end">
            <Button type="button" variant="outline2" onClick={() => router.back()}>
              Kembali
            </Button>
            <Button type="button" onClick={() => onSubmit()} variant="main">
              Simpan
            </Button>
          </div>
        </form>
      </Wrapper>
    </>
  );

}
