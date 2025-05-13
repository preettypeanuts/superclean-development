"use client";
import { useEffect, useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import { Wrapper } from "@shared/components/Wrapper";
import { Input } from "libs/ui-components/src/components/ui/input";
import { Label } from "libs/ui-components/src/components/ui/label";
import { Button } from "libs/ui-components/src/components/ui/button";
import { Checkbox } from "libs/ui-components/src/components/ui/checkbox";
import { api } from "libs/utils/apiClient";
import { useParameterStore } from "libs/utils/useParameterStore";
import { useToast } from "libs/ui-components/src/hooks/use-toast";
import { formatDateInput } from "libs/utils/formatDate";
import { Breadcrumbs } from "@shared/components/ui/Breadcrumbs";
import { IoMdSave } from "react-icons/io";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
  SelectGroup,
  SelectLabel,
} from "libs/ui-components/src/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "libs/ui-components/src/components/ui/dialog";

interface Karyawan {
  id: string;
  username: string;
  fullname: string;
  noWhatsapp: string;
  branchId: string;
  birthDate: string;
  joinDate: string;
  roleId: string;
  status: number;
}

export default function EditKaryawan() {
  const { toast } = useToast();
  const pathname = usePathname();
  const id = pathname.split("/").pop();
  const router = useRouter();

  const [showConfirmDialog, setShowConfirmDialog] = useState<boolean>(false);
  const [karyawan, setKaryawan] = useState<Karyawan | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [updating, setUpdating] = useState<boolean>(false);

  const { roleMapping, branchMapping, loading: loadingParams } = useParameterStore();

  useEffect(() => {
    const fetchKaryawan = async () => {
      try {
        const result = await api.get(`/user/id/${id}`);
        setKaryawan(result.data);
      } catch (error) {
        console.error("Gagal mengambil data karyawan:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchKaryawan();
  }, [id]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setKaryawan(prev => prev ? { ...prev, [e.target.name]: e.target.value } : null);
  };

  const handleSelectChange = (name: keyof Karyawan, value: string) => {
    setKaryawan(prev => prev ? { ...prev, [name]: value } : null);
  };

  const handleStatusChange = (checked: boolean) => {
    setKaryawan(prev => prev ? { ...prev, status: checked ? 1 : 0 } : null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault(); // Mencegah reload halaman

    if (!karyawan) return;

    const payload = {
      fullname: karyawan.fullname,
      noWhatsapp: karyawan.noWhatsapp,
      branchId: karyawan.branchId,
      roleId: karyawan.roleId,
      birthDate: karyawan.birthDate,
      joinDate: karyawan.joinDate,
      status: karyawan.status,
    };

    setShowConfirmDialog(false);
    setUpdating(true);
    try {
      await api.put(`/user/${karyawan.id}`, payload);

      toast({
        title: "Berhasil",
        description: "Profil karyawan berhasil diperbarui!",
        variant: "success",
      });

      router.push("/master-data/karyawan");
    } catch (error) {
      console.error("Gagal menyimpan data:", error);
      toast({
        title: "Gagal",
        description: "Terjadi kesalahan saat mengubah profil karyawan.",
        variant: "destructive",
      });
    } finally {
      setUpdating(false);
    }
  };

  return (
    <>
      <Breadcrumbs label="Ubah Profil Karyawan" />
      <Wrapper>
        {loading || loadingParams ? (
          <p className="text-center py-4">Memuat data...</p>
        ) : karyawan ? (
          <form className="space-y-4" onSubmit={(e) => { e.preventDefault(); setShowConfirmDialog(true); }}>
            <div className="flex items-center space-x-4">
              <Label className="w-1/4 font-semibold">Nama Pengguna</Label>
              <Input name="username" value={karyawan.username} disabled />
            </div>
            <div className="flex items-center space-x-4">
              <Label className="w-1/4 font-semibold">Nama Lengkap</Label>
              <Input name="fullname" value={karyawan.fullname} onChange={handleChange} />
            </div>
            <div className="flex items-center space-x-4">
              <Label className="w-1/4 font-semibold">No. WhatsApp</Label>
              <Input name="noWhatsapp" value={karyawan.noWhatsapp} onChange={handleChange} />
            </div>

            <div className="flex items-center space-x-4">
              <Label className="w-1/4 font-semibold">Kata Sandi</Label>
              <Input name="noWhatsapp" disabled placeholder="•••••••••" onChange={handleChange} />
            </div>

            <div className="flex items-center space-x-4">
              <Label className="w-1/4 font-semibold">Tanggal Lahir</Label>
              <Input type="date" name="birthDate" value={formatDateInput(karyawan.birthDate)} onChange={handleChange} />
            </div>
            <div className="flex items-center space-x-4">
              <Label className="w-1/4 font-semibold">Tanggal Daftar</Label>
              <Input type="date" name="joinDate" value={formatDateInput(karyawan.joinDate)} onChange={handleChange} />
            </div>

            <div className="flex items-center space-x-4">
              <Label className="w-1/4">Cabang</Label>
              <Select value={karyawan.branchId} onValueChange={(value) => handleSelectChange("branchId", value)}>
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Pilih Cabang" />
                </SelectTrigger>
                <SelectContent>
                  <SelectGroup>
                    <SelectLabel>Pilih Cabang</SelectLabel>
                    {Object.entries(branchMapping).map(([key, value]) => (
                      <SelectItem key={key} value={key}>{value}</SelectItem>
                    ))}
                  </SelectGroup>
                </SelectContent>
              </Select>
            </div>

            <div className="flex items-center space-x-4">
              <Label className="w-1/4">Akses Pengguna</Label>
              <Select value={karyawan.roleId} onValueChange={(value) => handleSelectChange("roleId", value)}>
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Pilih Akses Pengguna" />
                </SelectTrigger>
                <SelectContent>
                  <SelectGroup>
                    <SelectLabel>Pilih Akses</SelectLabel>
                    {Object.entries(roleMapping).map(([key, value]) => (
                      <SelectItem key={key} value={key}>{value}</SelectItem>
                    ))}
                  </SelectGroup>
                </SelectContent>
              </Select>
            </div>

            <div className="flex items-center space-x-4">
              <Label className="w-[20%] font-semibold">Status</Label>
              <div className="flex items-center space-x-2">
                <Checkbox checked={karyawan.status === 1} onCheckedChange={handleStatusChange} />
                <Label>{karyawan.status === 1 ? "Aktif" : "Tidak Aktif"}</Label>
              </div>
            </div>

            <div className="flex justify-end space-x-2">
              <Button type="button" variant="outline2" onClick={() => router.push("/master-data/karyawan")}>
                Kembali
              </Button>
              <Button type="submit" variant="main" disabled={updating}>
                {updating ? "Menyimpan..." : "Simpan"}
              </Button>
            </div>
          </form>
        ) : (
          <p className="text-center py-4 text-red-500">Karyawan tidak ditemukan!</p>
        )}

        {/* Dialog Konfirmasi Simpan */}
        <Dialog open={showConfirmDialog} onOpenChange={setShowConfirmDialog}>
          <DialogContent className="max-w-md">
            <DialogHeader className="flex items-center justify-center">
              <div className="text-5xl p-3 bg-secondaryColor text-secondaryColorDark rounded-lg my-5">
                <IoMdSave />
              </div>
              <DialogTitle className="text-center">
                Apakah Anda yakin ingin menyimpan data?
              </DialogTitle>
            </DialogHeader>
            <DialogFooter className="flex flex-row gap-2">
              <Button
                variant="outline2"
                className="w-1/2"
                onClick={() => setShowConfirmDialog(false)}
              >
                Batal
              </Button>
              <Button
                variant="main"
                className="w-1/2"
                onClick={handleSubmit}
              >
                Simpan
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </Wrapper>
    </>
  );
}
