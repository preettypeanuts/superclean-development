"use client";
import { usePathname, useRouter } from "next/navigation";
import { Header } from "@shared/components/Header";
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
import { useEffect, useState } from "react";
import { api } from "libs/utils/apiClient";
import { useToast } from "libs/ui-components/src/hooks/use-toast";
import { formatDateInput } from "libs/utils/formatDate";
import { useCategoryStore, useServiceLookup } from "libs/utils/useCategoryStore";
import { Breadcrumbs } from "@shared/components/ui/Breadcrumbs";
import {
  RadioGroup,
  RadioGroupItem,
} from "@ui-components/components/ui/radio-group";
import {
  formatRupiah,
  unformatRupiah,
} from "libs/utils/formatRupiah";
import { ConfirmSaveDialog } from "@ui-components/components/save-dialog";

interface Diskon {
  code: string;
  name: string;
  category: string;
  promoType: string;
  serviceCode: string;
  amount: number;
  minItem: number;
  endDate: string;
}

export default function EditDiskon() {
  const { toast } = useToast();
  const pathname = usePathname();
  const id = pathname.split("/").pop();
  const router = useRouter();

  const [diskon, setDiskon] = useState<Diskon | null>(null);
  const [updating, setUpdating] = useState(false);
  const [showConfirmDialog, setShowConfirmDialog] = useState(false);
  const {
    catLayananMapping,
    loading: loadingParams,
  } = useCategoryStore();

  const { services, loading: loadingServices } = useServiceLookup(diskon?.category || "");

  useEffect(() => {
    const fetchDiskon = async () => {
      try {
        const result = await api.get(`/promo/id/${id}`);
        setDiskon(result.data);
      } catch (error) {
        console.error("Gagal mengambil data diskon:", error);
      }
    };
    fetchDiskon();
  }, [id]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;

    if (!diskon) return;

    if (name === "amount") {
      const numericValue = unformatRupiah(value);
      setDiskon({ ...diskon, amount: numericValue });
    } else if (name === "minItem") {
      setDiskon({ ...diskon, minItem: parseInt(value) });
    } else {
      setDiskon({ ...diskon, [name]: value });
    }
  };

  const handleSelectChange = (name: keyof Diskon, value: string) => {
    setDiskon((prev) => (prev ? { ...prev, [name]: value } : null));
  };

  const handleSubmit = async () => {
    if (!diskon) return;

    setUpdating(true);
    const updatedData = {
      name: diskon.name,
      category: diskon.category,
      promoType: diskon.promoType,
      serviceCode: diskon.serviceCode,
      amount: diskon.amount,
      minItem: diskon.minItem,
      endDate: diskon.endDate,
    };

    try {
      const response = await api.put(`/promo/${id}`, updatedData);
      toast({
        title: "Berhasil",
        description: "Diskon berhasil diperbarui!",
        variant: "success",
      });
      router.push("/master-data/diskon");
    } catch (error) {
      console.error("Gagal memperbarui diskon:", error);
      toast({
        title: "Gagal",
        description: "Terjadi kesalahan saat mengubah data diskon.",
        variant: "destructive",
      });
    } finally {
      setUpdating(false);
    }
  };

  return (
    <>
      <Breadcrumbs label={`Edit Promo`} />
      <Wrapper>
        {diskon ? (
          <form className="space-y-4">
            {/* Kode Promo */}
            <div className="flex items-center space-x-4">
              <Label className="w-1/4 font-semibold">Kode Promo</Label>
              <Input name="code" className="uppercase" disabled value={diskon.code} />
            </div>

            {/* Nama Promo */}
            <div className="flex items-center space-x-4">
              <Label className="w-1/4 font-semibold">Nama Promo</Label>
              <Input
                name="name"
                value={diskon.name}
                onChange={handleChange}
              />
            </div>

            {/* Tipe Promo */}
            <div className="flex items-center space-x-4">
              <Label htmlFor="promoType" className="w-[20%] font-semibold">
                Tipe Potongan
              </Label>
              <RadioGroup
                value={diskon.promoType}
                onValueChange={(value) =>
                  setDiskon((prev) =>
                    prev ? { ...prev, promoType: value } : null
                  )
                }
                className="flex items-center gap-5"
              >
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="Nominal" id="Nominal" />
                  <Label className="capitalize" htmlFor="Nominal">
                    Nominal
                  </Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="Persentase" id="Persentase" />
                  <Label className="capitalize" htmlFor="Persentase">
                    Persentase
                  </Label>
                </div>
              </RadioGroup>
            </div>

            {/* Potongan Harga Berdasarkan Tipe */}
            {diskon.promoType !== "Persentase" ? (
              <div className="flex items-center space-x-4">
                <Label htmlFor="amount" className="w-1/4 font-semibold">Potongan Rp</Label>
                <Input
                  className="text-right"
                  placeholder="Masukkan Potongan Harga"
                  type="text"
                  id="amount"
                  name="amount"
                  value={formatRupiah(diskon.amount)}
                  onChange={(e) => {
                    const value = e.target.value.replace(/[^0-9]/g, "");
                    setDiskon({ ...diskon, amount: unformatRupiah(value) });
                  }}
                />
              </div>
            ) : (
              <div className="flex items-center space-x-4">
                <Label htmlFor="amount" className="w-1/4 font-semibold">Potongan %</Label>
                <div className="relative w-full">
                  <Input
                    className="text-right placeholder:text-start pr-7 no-spinner"
                    placeholder="Masukkan Potongan Persentase"
                    type="number"
                    id="amount"
                    name="amount"
                    value={diskon.amount}
                    onChange={(e) => {
                      const value = e.target.value;
                      setDiskon({ ...diskon, amount: parseInt(value || "0") });
                    }}
                  />
                  <span className="absolute inset-y-0 right-3 flex items-center font-semibold">%</span>
                </div>
              </div>
            )}

            {/* Kategori */}
            <div className="flex items-center space-x-4">
              <Label htmlFor="category" className="w-1/4 font-semibold">
                Kategori
              </Label>
              <Select
                onValueChange={(value) => handleSelectChange("category", value)}
                value={diskon.category}
                disabled={loadingParams}
              >
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Pilih Kategori" />
                </SelectTrigger>
                <SelectContent>
                  <SelectGroup>
                    <SelectLabel>Kategori</SelectLabel>
                    {Object.keys(catLayananMapping).map((key) => (
                      <SelectItem key={key} value={key}>
                        {catLayananMapping[key]}
                      </SelectItem>
                    ))}
                  </SelectGroup>
                </SelectContent>
              </Select>
            </div>

            {/* Layanan */}
            <div className="flex items-center space-x-4">
              <Label htmlFor="serviceCode" className="w-1/4 font-semibold">
                Layanan
              </Label>
              <Select
                onValueChange={(value) =>
                  handleSelectChange("serviceCode", value)
                }
                value={diskon.serviceCode}
                disabled={loadingParams || loadingServices}
              >
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Pilih Layanan" />
                </SelectTrigger>
                <SelectContent>
                  <SelectGroup>
                    <SelectLabel>Layanan</SelectLabel>
                    {services.map((service) => (
                      <SelectItem key={service.serviceCode} value={service.serviceCode}>
                        {service.serviceName}
                      </SelectItem>
                    ))}
                  </SelectGroup>
                </SelectContent>
              </Select>
            </div>

            {/* Minimal Item */}
            <div className="flex items-center space-x-4">
              <Label className="w-1/4 font-semibold">Minimal Item</Label>
              <Input
                type="number"
                name="minItem"
                value={diskon.minItem}
                onChange={handleChange}
              />
            </div>

            {/* Masa Berlaku */}
            <div className="flex items-center space-x-4">
              <Label className="w-1/4 font-semibold">Masa Berlaku</Label>
              <Input
                type="date"
                name="endDate"
                value={formatDateInput(diskon.endDate)}
                onChange={handleChange}
              />
            </div>

            {/* Tombol Aksi */}
            <div className="space-x-2 flex justify-end">
              <Button
                type="button"
                variant="outline2"
                onClick={() => router.push("/master-data/diskon")}
              >
                Kembali
              </Button>
              <Button
                type="button"
                variant="main"
                onClick={() => setShowConfirmDialog(true)}
                disabled={updating}
              >
                {updating ? "Menyimpan..." : "Simpan"}
              </Button>
            </div>
          </form>
        ) : (
          <p className="text-center py-4 text-red-500">Diskon tidak ditemukan!</p>
        )}

        {/* Dialog Konfirmasi */}
        <ConfirmSaveDialog
          open={showConfirmDialog}
          onOpenChange={setShowConfirmDialog}
          onConfirm={handleSubmit}
          isLoading={updating}
        />

      </Wrapper>
    </>
  );
}
