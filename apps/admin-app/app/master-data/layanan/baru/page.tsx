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

export default function NewLayanan() {
  const { toast } = useToast();
  const router = useRouter();
  const { unitLayananMapping, catLayananMapping, loading: loadingParams } = useCategoryStore();

  const [formData, setFormData] = useState({
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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const payload = {
      code: formData.code,
      name: formData.name,
      category: formData.category,
      unit: formData.unit,
      vacuumPrice: Number(formData.vacuumPrice),
      cleanPrice: Number(formData.cleanPrice),
      status: Number(formData.status),
    };

    console.log("Payload yang dikirim:", JSON.stringify(payload, null, 2)); // Cek di console

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
      toast({
        title: "Gagal",
        description: "Terjadi kesalahan saat menambahkan layanan.",
        variant: "destructive",
      });
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
            />
          </div>
          <div className="flex items-center space-x-4">
            <Label htmlFor="category" className="w-1/4">
              Kategori
            </Label>
            <Select
              onValueChange={(value) => handleSelectChange("category", value)}
              value={formData.category}
              disabled={loadingParams}
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
              disabled={loadingParams}
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
              type="number"
              id="vacuumPrice"
              disabled={formData.category === "GENERAL" || formData.category === "BLOWER"}
              value={formData.vacuumPrice}
              onChange={handleChange}
            />
          </div>

          <div className="flex items-center space-x-4">
            <Label htmlFor="cleanPrice" className="w-1/4 font-semibold">
              Harga Cuci
            </Label>
            <Input
              type="number"
              id="cleanPrice"
              value={formData.cleanPrice}
              onChange={handleChange}
            />
          </div>

          <div className="flex items-center space-x-4">
            <Label className="w-[20%] font-semibold">Status</Label>
            <div className="flex items-center space-x-2">
              <Checkbox
                checked={formData.status === 1}
                onCheckedChange={(checked) => handleSelectChange("status", checked ? 1 : 0)}
              />
              <Label>{formData.status === 1 ? "Aktif" : "Tidak Aktif"}</Label>
            </div>
          </div>
          <div className="space-x-2 flex justify-end w-full">
            <Button type="button" variant="outline2" onClick={() => router.back()}>
              Kembali
            </Button>
            <Button
              type="submit"
              variant="main"
              className="disabled"
              disabled={
              !formData.code ||
              !formData.name ||
              !formData.category ||
              !formData.unit ||
              (!formData.vacuumPrice && formData.category !== "GENERAL") ||
              !formData.cleanPrice
              }
            >
              Simpan
            </Button>
          </div>
        </form>
      </Wrapper>
    </>
  );
}
