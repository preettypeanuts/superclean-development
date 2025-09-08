"use client";
import { Wrapper } from "@shared/components/Wrapper";
import { Header } from "@shared/components/Header";
import { Input } from "libs/ui-components/src/components/ui/input";
import { Label } from "libs/ui-components/src/components/ui/label";
import { Button } from "libs/ui-components/src/components/ui/button";
import { LuSave } from "react-icons/lu";
import { TbArrowBack } from "react-icons/tb";
import { Textarea } from "@ui-components/components/ui/textarea";
import { useEffect, useMemo, useState } from "react";
import { useLocationData } from "libs/utils/useLocationData";
import { useRouter } from "next/navigation";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
  SelectGroup,
} from "libs/ui-components/src/components/ui/select";
import { Checkbox } from "@ui-components/components/ui/checkbox";
import { Breadcrumbs } from "@shared/components/ui/Breadcrumbs";
import { RadioGroup, RadioGroupItem } from "@ui-components/components/ui/radio-group";
import { ConfirmSaveDialog } from "@ui-components/components/save-dialog";

export interface MasterPelangganResponse {
  id: string,
  noWhatsapp: string,
  fullname: string,
  address: string,
  province: string,
  city: string,
  district: string,
  subDistrict: string,
  status: number,
  customerType: string,
  latitude: number,
  longitude: number
}

export interface MasterPelanggan {
  id: string | null;
  fullname: string;
  noWhatsapp: string;
  customerType: string;
  address: string;
  province: string;
  city: string;
  district: string;
  subDistrict: string;
  status: number;
}

type PelangganFormProps = {
  pelanggan: MasterPelanggan;
  toast: any;
  loadingData?: boolean;
  isEdit?: boolean;
  onSubmit: (data: MasterPelanggan) => Promise<void>;
  loadingSubmit?: boolean;
};

const PelangganForm = ({ pelanggan, onSubmit, toast, loadingData, isEdit, loadingSubmit }: PelangganFormProps) => {
  const router = useRouter();

  const [showConfirmDialog, setShowConfirmDialog] = useState<boolean>(false); // Dialog Konfirmasi
  const [formData, setFormData] = useState<MasterPelanggan>(pelanggan);
  useEffect(() => {
    setFormData(pelanggan);
  }, [pelanggan]);

  const header = useMemo(() => {
    return <Breadcrumbs label={isEdit ? "Ubah Profil Pelanggan" : "Tambah Pelanggan Baru"} />
  }, [isEdit])


  // Mengambil data lokasi berdasarkan provinsi, kota, kecamatan yang dipilih
  const { provinces, cities, districts, subDistricts, loading } = useLocationData(
    formData.province,
    formData.city,
    formData.district
  );

  // Fungsi untuk menangani perubahan input teks
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { id, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [id]: value
    }));
  };

  // Fungsi untuk menangani perubahan Select dan reset data terkait
  const handleSelectChange = (field: string, value: string | boolean) => {
    setFormData((prev) => {
      let updatedData = { ...prev, [field]: value };

      // Reset data jika provinsi berubah
      if (field === "province") {
        updatedData.city = "";
        updatedData.district = "";
        updatedData.subDistrict = "";
      }
      // Reset data jika kota berubah
      if (field === "city") {
        updatedData.district = "";
        updatedData.subDistrict = "";
      }
      // Reset data jika kecamatan berubah
      if (field === "district") {
        updatedData.subDistrict = "";
      }

      return updatedData;
    });
  };

  // Fungsi untuk validasi form
  const validateForm = (): string | null => {
    if (!formData.fullname.trim()) {
      return "Nama lengkap harus diisi";
    }
    if (!formData.noWhatsapp.trim()) {
      return "Nomor WhatsApp harus diisi";
    }
    if (!/^\d+$/.test(formData.noWhatsapp.trim())) {
      return "Nomor WhatsApp harus berupa angka";
    }
    if (!formData.customerType) {
      return "Tipe pelanggan harus dipilih";
    }
    if (!formData.address.trim()) {
      return "Alamat harus diisi";
    }
    if (!formData.province) {
      return "Provinsi harus dipilih";
    }
    if (!formData.city) {
      return "Kota harus dipilih";
    }
    if (!formData.district) {
      return "Kecamatan harus dipilih";
    }
    if (!formData.subDistrict) {
      return "Kelurahan harus dipilih";
    }
    return null;
  };

  const handleCheckboxChange = (id: string, value: string | number) => {
    setFormData({ ...formData, [id]: value });
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

    await onSubmit(formData);
  }

  if (isEdit && loadingData) {
    return (
      <>
        {header}
        <Wrapper>
          <p className="text-center py-4">Memuat data pelanggan...</p>
        </Wrapper>
      </>
    );
  }


  if (isEdit && pelanggan?.id === '') {
    return (
      <>
        {header}
        <Wrapper>
          <p className="text-center py-4 text-red-500">Pelanggan tidak ditemukan!</p>
        </Wrapper>
      </>
    );
  }

  return (
    <>
      {header}
      <Wrapper>
        {/* Nama Lengkap */}
        <div className="flex items-center space-x-4">
          <Label htmlFor="fullname" className="w-1/4 font-semibold">
            Nama Lengkap
          </Label>
          <Input
            id="fullname"
            placeholder="Masukkan Nama Lengkap"
            value={formData.fullname}
            onChange={handleChange}
            disabled={loadingSubmit}
          />
        </div>

        {/* No Whatsapp */}
        <div className="flex items-center space-x-4">
          <Label htmlFor="noWhatsapp" className="w-1/4 font-semibold">
            No Whatsapp
          </Label>
          <Input
            id="noWhatsapp"
            placeholder="Masukkan nomor Whatsapp"
            type="text"
            value={formData.noWhatsapp}
            onChange={handleChange}
            disabled={loadingSubmit || isEdit}
          />
        </div>

        {/* Tipe Pelanggan */}
        <div className="flex items-center space-x-4">
          <Label htmlFor="customerType" className="w-[20%] font-semibold">
            Tipe
          </Label>
          <RadioGroup
            value={formData.customerType}
            onValueChange={(value) => handleSelectChange("customerType", value)}
            className="flex items-center gap-5"
            disabled={loadingSubmit}
          >
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="Pribadi" id="Pribadi" />
              <Label className="capitalize" htmlFor="Pribadi">pribadi</Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="Perusahaan" id="Perusahaan" />
              <Label className="capitalize" htmlFor="Perusahaan">Perusahaan</Label>
            </div>
          </RadioGroup>
        </div>

        {/* Alamat */}
        <div className="flex items-center space-x-4">
          <Label htmlFor="address" className="w-1/4 font-semibold">
            Alamat
          </Label>
          <Textarea
            id="address"
            className="resize-none"
            placeholder="Masukkan alamat"
            value={formData.address}
            onChange={handleChange}
            disabled={loadingSubmit}
          />
        </div>

        {/* Provinsi */}
        <div className="flex items-center space-x-4">
          <Label className="w-1/4 font-semibold">
            Provinsi
          </Label>
          <Select
            onValueChange={(value) => handleSelectChange("province", value)}
            value={formData.province}
            disabled={loading || loadingSubmit}
          >
            <SelectTrigger className="w-full">
              <SelectValue placeholder="Pilih Provinsi" />
            </SelectTrigger>
            <SelectContent>
              <SelectGroup>
                {provinces.map((prov) => (
                  <SelectItem key={prov.id} value={prov.paramKey}>
                    {prov.paramValue}
                  </SelectItem>
                ))}
              </SelectGroup>
            </SelectContent>
          </Select>
        </div>

        {/* Kota */}
        <div className="flex items-center space-x-4">
          <Label className="w-1/4 font-semibold">
            Kota
          </Label>
          <Select
            onValueChange={(value) => handleSelectChange("city", value)}
            value={formData.city}
            disabled={!formData.province || loading || loadingSubmit}
          >
            <SelectTrigger className="w-full">
              <SelectValue placeholder="Pilih Kota" />
            </SelectTrigger>
            <SelectContent>
              <SelectGroup>
                {cities.map((city) => (
                  <SelectItem key={city.id} value={city.paramKey}>
                    {city.paramValue}
                  </SelectItem>
                ))}
              </SelectGroup>
            </SelectContent>
          </Select>
        </div>

        {/* Kecamatan */}
        <div className="flex items-center space-x-4">
          <Label className="w-1/4 font-semibold">
            Kecamatan
          </Label>
          <Select
            onValueChange={(value) => handleSelectChange("district", value)}
            value={formData.district}
            disabled={!formData.city || loading || loadingSubmit}
          >
            <SelectTrigger className="w-full">
              <SelectValue placeholder="Pilih Kecamatan" />
            </SelectTrigger>
            <SelectContent>
              <SelectGroup>
                {districts.map((dist) => (
                  <SelectItem key={dist.id} value={dist.paramKey}>
                    {dist.paramValue}
                  </SelectItem>
                ))}
              </SelectGroup>
            </SelectContent>
          </Select>
        </div>

        {/* Kelurahan */}
        <div className="flex items-center space-x-4">
          <Label className="w-1/4 font-semibold">
            Kelurahan
          </Label>
          <Select
            onValueChange={(value) => handleSelectChange("subDistrict", value)}
            value={formData.subDistrict}
            disabled={!formData.district || loading || loadingSubmit}
          >
            <SelectTrigger className="w-full">
              <SelectValue placeholder="Pilih Kelurahan" />
            </SelectTrigger>
            <SelectContent>
              <SelectGroup>
                {subDistricts.map((subDist) => (
                  <SelectItem key={subDist.id} value={subDist.paramKey}>
                    {subDist.paramValue}
                  </SelectItem>
                ))}
              </SelectGroup>
            </SelectContent>
          </Select>
        </div>

        {/* <div className="flex items-center space-x-4">
          <Label className="w-[20%] font-semibold">Status</Label>
          <div className="flex items-center space-x-2">
            <Checkbox
              checked={formData.status === 1}
              onCheckedChange={(checked) => handleCheckboxChange("status", checked ? 1 : 0)}
              disabled={loadingSubmit}
            />
            <Label>{formData.status === 1 ? "Aktif" : "Tidak Aktif"}</Label>
          </div>
        </div> */}

        <div className="flex justify-end space-x-2">
          <Button
            type="button"
            variant="outline2"
            onClick={() => router.back()}
            disabled={loadingSubmit}
          >
            <TbArrowBack className="w-4 h-4 mr-2" />
            Kembali
          </Button>
          <Button
            onClick={() => setShowConfirmDialog(true)}
            variant="main"
            disabled={loadingSubmit}
          >
            {loadingSubmit ? (
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
      </Wrapper>

      {/* Dialog Konfirmasi Simpan */}
      <ConfirmSaveDialog
        open={showConfirmDialog}
        onOpenChange={setShowConfirmDialog}
        onConfirm={() => {
          setShowConfirmDialog(false);
          handleSubmit(new Event('submit') as unknown as React.FormEvent<HTMLFormElement>);
        }}
        isLoading={loadingSubmit}
      />
    </>
  );
}


export default PelangganForm;
