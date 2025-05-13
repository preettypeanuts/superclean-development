"use client";
import { useEffect, useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import { Wrapper } from "@shared/components/Wrapper";
import { Input } from "libs/ui-components/src/components/ui/input";
import { Label } from "libs/ui-components/src/components/ui/label";
import { Button } from "libs/ui-components/src/components/ui/button";
import { Checkbox } from "libs/ui-components/src/components/ui/checkbox";
import { api } from "libs/utils/apiClient";
import { useCategoryStore } from "libs/utils/useCategoryStore";
import { useToast } from "libs/ui-components/src/hooks/use-toast";
import { Breadcrumbs } from "@shared/components/ui/Breadcrumbs";
import { formatRupiah, unformatRupiah } from "libs/utils/formatRupiah";
import { ConfirmSaveDialog } from "@ui-components/components/save-dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
  SelectGroup,
  SelectLabel,
} from "libs/ui-components/src/components/ui/select";

interface Layanan {
  id: string;
  code: string;
  name: string;
  category: string;
  unit: string;
  isGeneral: boolean;
  vacuumPrice: number;
  cleanPrice: number;
  generalPrice: number;
  status: number;
}

export default function EditLayanan() {
  const { toast } = useToast();
  const pathname = usePathname();
  const id = pathname.split("/").pop();
  const router = useRouter();

  const [showConfirmDialog, setShowConfirmDialog] = useState<boolean>(false);
  const [layanan, setLayanan] = useState<Layanan | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [updating, setUpdating] = useState<boolean>(false);

  const { unitLayananMapping, catLayananMapping, loading: loadingParams } = useCategoryStore();

  useEffect(() => {
    const fetchLayanan = async () => {
      try {
        const result = await api.get(`/service/id/${id}`);
        setLayanan(result.data);
      } catch (error) {
        console.error("Gagal mengambil data layanan:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchLayanan();
  }, [id]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setLayanan((prev) => (prev ? { ...prev, [e.target.name]: e.target.value } : null));
  };

  const handleSelectChange = (name: keyof Layanan, value: string) => {
    setLayanan((prev) => {
      if (!prev) return null;

      if (name === "category") {
        const isGeneral = value === "GENERAL" || value === "BLOWER";
        return { ...prev, category: value, isGeneral };
      }

      return { ...prev, [name]: value };
    });
  };

  const handleStatusChange = (checked: boolean) => {
    setLayanan((prev) => (prev ? { ...prev, status: checked ? 1 : 0 } : null));
  };

  const handleSubmit = async () => {
    if (!layanan) return;

    const payload = {
      name: layanan.name,
      category: layanan.category,
      unit: layanan.unit,
      vacuumPrice: unformatRupiah(layanan.vacuumPrice),
      cleanPrice: unformatRupiah(layanan.cleanPrice),
      status: layanan.status,
    };

    setShowConfirmDialog(false);
    setUpdating(true);
    try {
      await api.put(`/service/${layanan.id}`, payload);

      toast({
        title: "Berhasil",
        description: "Data layanan berhasil diperbarui!",
        variant: "success",
      });

      router.push("/master-data/layanan");
    } catch (error) {
      console.error("Gagal menyimpan data:", error);
      toast({
        title: "Gagal",
        description: "Terjadi kesalahan saat mengubah data layanan.",
        variant: "destructive",
      });
    } finally {
      setUpdating(false);
    }
  };

  return (
    <>
      <Breadcrumbs label="Ubah Layanan" />
      <Wrapper>
        {loading || loadingParams ? (
          <p className="text-center py-4">Memuat data...</p>
        ) : layanan ? (
          <form
            className="space-y-4"
            onSubmit={(e) => {
              e.preventDefault();
              setShowConfirmDialog(true);
            }}
          >
            <div className="flex items-center space-x-4">
              <Label className="w-1/4 font-semibold">Kode Layanan</Label>
              <Input name="code" value={layanan.code} disabled />
            </div>
            <div className="flex items-center space-x-4">
              <Label className="w-1/4 font-semibold">Nama Layanan</Label>
              <Input name="name" value={layanan.name} onChange={handleChange} />
            </div>

            <div className="flex items-center space-x-4">
              <Label className="w-1/4">Kategori</Label>
              <Select value={layanan.category} onValueChange={(value) => handleSelectChange("category", value)}>
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Pilih Kategori" />
                </SelectTrigger>
                <SelectContent>
                  <SelectGroup>
                    <SelectLabel>Pilih Kategori</SelectLabel>
                    {Object.entries(catLayananMapping).map(([key, value]) => (
                      <SelectItem key={key} value={key}>{value}</SelectItem>
                    ))}
                  </SelectGroup>
                </SelectContent>
              </Select>
            </div>

            <div className="flex items-center space-x-4">
              <Label className="w-1/4">Satuan</Label>
              <Select value={layanan.unit} onValueChange={(value) => handleSelectChange("unit", value)}>
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Pilih Satuan" />
                </SelectTrigger>
                <SelectContent>
                  <SelectGroup>
                    <SelectLabel>Pilih Satuan</SelectLabel>
                    {Object.entries(unitLayananMapping).map(([key, value]) => (
                      <SelectItem key={key} value={key}>{value}</SelectItem>
                    ))}
                  </SelectGroup>
                </SelectContent>
              </Select>
            </div>

            <div className="flex items-center space-x-4">
              <Label className="w-1/4 font-semibold">Harga Vacuum</Label>
              <Input
                className="text-right"
                type="text"
                name="vacuumPrice"
                value={formatRupiah(layanan.vacuumPrice)}
                onChange={handleChange}
                disabled={layanan.category === "GENERAL" || layanan.category === "BLOWER"}
              />
            </div>

            <div className="flex items-center space-x-4">
              <Label className="w-1/4 font-semibold">Harga Cuci</Label>
              <Input
                className="text-right"
                type="text"
                name="cleanPrice"
                value={formatRupiah(layanan.cleanPrice)}
                onChange={handleChange}
              />
            </div>

            <div className="flex items-center space-x-4">
              <Label className="w-[20%] font-semibold">Status</Label>
              <div className="flex items-center space-x-2">
                <Checkbox checked={layanan.status === 1} onCheckedChange={handleStatusChange} />
                <Label>{layanan.status === 1 ? "Aktif" : "Tidak Aktif"}</Label>
              </div>
            </div>

            <div className="flex justify-end space-x-2">
              <Button type="button" variant="outline2" onClick={() => router.back()}>
                Kembali
              </Button>
              <Button type="submit" variant="main" disabled={updating}>
                {updating ? "Menyimpan..." : "Simpan"}
              </Button>
            </div>
          </form>
        ) : (
          <p className="text-center py-4 text-red-500">Layanan tidak ditemukan!</p>
        )}

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
