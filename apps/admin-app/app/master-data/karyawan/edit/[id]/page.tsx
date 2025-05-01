"use client";
import { useEffect, useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import { Header } from "@shared/components/Header";
import { Wrapper } from "@shared/components/Wrapper";
import { Input } from "libs/ui-components/src/components/ui/input";
import { Label } from "libs/ui-components/src/components/ui/label";
import { Button } from "libs/ui-components/src/components/ui/button";
import { Checkbox } from "libs/ui-components/src/components/ui/checkbox";
import { LuSave } from "react-icons/lu";
import { TbArrowBack } from "react-icons/tb";
import { api } from "libs/utils/apiClient";
import { useParameterStore } from "libs/utils/useParameterStore";
import { useToast } from "libs/ui-components/src/hooks/use-toast";
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
  AlertDialog,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogAction,
} from "libs/ui-components/src/components/ui/alert-dialog";
import { formatDate, formatDateInput } from "libs/utils/formatDate";

interface Karyawan {
  id: string;
  username: string;
  fullname: string;
  noWhatsapp: string;
  branchId: string;
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
      joinDate: karyawan.joinDate,
      status: karyawan.status,
    };

    setShowConfirmDialog(false);
    setUpdating(true);
    try {
      console.log('====================================');
      console.log(payload);
      console.log('====================================');
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
    <Wrapper>
      <Header label="Ubah Profil Karyawan" />
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
            <Input name="noWhatsapp" disabled placeholder="********" onChange={handleChange} />
          </div>

          <div className="flex items-center space-x-4">
            <Label className="w-1/4 font-semibold">Tanggal Daftar</Label>
            <Input type="text" name="noWhatsapp" value={formatDateInput(karyawan.joinDate)} onChange={handleChange} />
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

          <div className="flex items-center space-x-4">
            <div className="w-1/4"></div>
            <div className="space-x-2 flex w-full">
              <Button type="button" variant="secondary" onClick={() => router.push("/master-data/karyawan")}>
                <TbArrowBack />
                Kembali
              </Button>
              <Button type="submit" variant="submit" disabled={updating}>
                <LuSave />
                {updating ? "Menyimpan..." : "Simpan"}
              </Button>
            </div>
          </div>
        </form>
      ) : (
        <p className="text-center py-4 text-red-500">Karyawan tidak ditemukan!</p>
      )}

      {/* Dialog Konfirmasi Simpan */}
      <AlertDialog open={showConfirmDialog} onOpenChange={setShowConfirmDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Konfirmasi Simpan</AlertDialogTitle>
            <AlertDialogDescription>Apakah Anda yakin ingin menyimpan data ini?</AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <Button variant="outline" onClick={() => setShowConfirmDialog(false)}>Batal</Button>
            <AlertDialogAction onClick={handleSubmit}>Simpan</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </Wrapper>
  );
}
