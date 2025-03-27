"use client";
import { useEffect, useState } from "react";
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
import { Checkbox } from "libs/ui-components/src/components/ui/checkbox";
import { LuSave } from "react-icons/lu";
import { TbCancel } from "react-icons/tb";
import { api } from "libs/utils/apiClient";
import { useParameterStore } from "libs/utils/useParameterStore";
import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogAction,
} from "libs/ui-components/src/components/ui/alert-dialog";

interface Karyawan {
  id: string;
  username: string;
  fullname: string;
  noWhatsapp: string;
  branchId: string;
  roleId: string;
  status: number;
}

export default function Edit() {
  const pathname = usePathname();
  const id = pathname.split("/").pop();
  const router = useRouter();

  const [karyawan, setKaryawan] = useState<Karyawan | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [showSuccessDialog, setShowSuccessDialog] = useState<boolean>(false); // Alert muncul setelah sukses
  const [updating, setUpdating] = useState<boolean>(false);

  const { roleMapping, branchMapping, loading: loadingParams } = useParameterStore();

  useEffect(() => {
    const fetchKaryawan = async () => {
      try {
        const result = await api.get(`/user/${id}`);
        setKaryawan(result.data);
      } catch (error: any) {
        console.error("Gagal mengambil data karyawan:", error.response?.data || error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchKaryawan();
  }, [id]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (karyawan) {
      setKaryawan({ ...karyawan, [e.target.id]: e.target.value });
    }
  };

  const handleStatusChange = (checked: boolean) => {
    if (karyawan) {
      setKaryawan({ ...karyawan, status: checked ? 1 : 0 });
    }
  };

  const handleCabangChange = (value: string) => {
    if (karyawan) {
      setKaryawan({ ...karyawan, branchId: value });
    }
  };

  const handleRoleChange = (value: string) => {
    if (karyawan) {
      setKaryawan({ ...karyawan, roleId: value });
    }
  };

  const handleSave = async () => {
    if (!karyawan) return;

    const payload = {
      fullname: karyawan.fullname,
      noWhatsapp: karyawan.noWhatsapp,
      branchId: karyawan.branchId,
      roleId: karyawan.roleId,
      status: karyawan.status,
    };

    setUpdating(true);
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_APIURL}/user/${karyawan.id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("access_token")}`,
        },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      setShowSuccessDialog(true); // Tampilkan alert sukses setelah berhasil simpan
    } catch (error: any) {
      console.error("Gagal menyimpan data:", error.message);
      alert("Gagal menyimpan perubahan.");
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
        <form className="space-y-4">
          <div className="flex items-center space-x-4">
            <Label htmlFor="username" className="w-1/4 font-semibold">Nama Pengguna</Label>
            <Input id="username" value={karyawan.username} disabled />
          </div>
          <div className="flex items-center space-x-4">
            <Label htmlFor="fullname" className="w-1/4 font-semibold">Nama</Label>
            <Input id="fullname" value={karyawan.fullname} onChange={handleChange} />
          </div>
          <div className="flex items-center space-x-4">
            <Label htmlFor="noWhatsapp" className="w-1/4 font-semibold">No. WhatsApp</Label>
            <Input type="text" id="noWhatsapp" value={karyawan.noWhatsapp} onChange={handleChange} />
          </div>

          <div className="flex items-center space-x-4">
            <Label htmlFor="branchId" className="w-1/4">Akses Pengguna</Label>
            <Select onValueChange={handleRoleChange} value={karyawan.roleId}>
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Pilih Akses Pengguna" />
              </SelectTrigger>
              <SelectContent>
                <SelectGroup>
                  <SelectLabel>Pilih Akses</SelectLabel>
                  {Object.entries(roleMapping).map(([key, value]) => (
                    <SelectItem key={key} value={key}>
                      {value}
                    </SelectItem>
                  ))}
                </SelectGroup>
              </SelectContent>
            </Select>
          </div>

          <div className="flex items-center space-x-4">
            <Label htmlFor="branchId" className="w-1/4">Cabang</Label>
            <Select onValueChange={handleCabangChange} value={karyawan.branchId}>
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Pilih Cabang" />
              </SelectTrigger>
              <SelectContent>
                <SelectGroup>
                  <SelectLabel>Pilih Cabang</SelectLabel>
                  {Object.entries(branchMapping).map(([key, value]) => (
                    <SelectItem key={key} value={key}>
                      {value}
                    </SelectItem>
                  ))}
                </SelectGroup>
              </SelectContent>
            </Select>
          </div>

          <div className="flex items-center space-x-4">
            <Label htmlFor="status" className="w-[20%] font-semibold">Status</Label>
            <div className="flex items-center space-x-2">
              <Checkbox id="status" checked={karyawan.status === 1} onCheckedChange={handleStatusChange} />
              <Label htmlFor="status">{karyawan.status === 1 ? "Aktif" : "Non-Aktif"}</Label>
            </div>
          </div>

          <div className="flex items-center space-x-4">
            <div className="w-1/4"></div>
            <div className="space-x-2 flex w-full">
              <Button type="button" variant="destructive" onClick={() => router.push("/master-data/karyawan")}>
                <TbCancel />
                Batal
              </Button>
              <Button type="button" className="bg-green-600" disabled={updating} onClick={handleSave}>
                <LuSave />
                {updating ? "Menyimpan..." : "Simpan"}
              </Button>
            </div>
          </div>
        </form>
      ) : (
        <p className="text-center py-4 text-red-500">Karyawan tidak ditemukan!</p>
      )}

      {/* Alert Dialog untuk Notifikasi Berhasil */}
      <AlertDialog open={showSuccessDialog} onOpenChange={setShowSuccessDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Perubahan Berhasil!</AlertDialogTitle>
            <AlertDialogDescription>Data karyawan telah diperbarui.</AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <Button variant="outline" onClick={() => setShowSuccessDialog(false)}>Tetap di Halaman</Button>
            <AlertDialogAction onClick={() => router.push("/master-data/karyawan")}>Kembali ke Halaman Utama</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </Wrapper>
  );
}
