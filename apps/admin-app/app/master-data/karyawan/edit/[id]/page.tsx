"use client";
import { useEffect, useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import { Header } from "@shared/components/Header";
import { Wrapper } from "@shared/components/Wrapper";
import { Input } from "libs/ui-components/src/components/ui/input";
import { Label } from "libs/ui-components/src/components/ui/label";
import { Button } from "libs/ui-components/src/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue, SelectGroup, SelectLabel } from "libs/ui-components/src/components/ui/select";
import { Checkbox } from "libs/ui-components/src/components/ui/checkbox";
import { LuSave } from "react-icons/lu";
import { TbCancel } from "react-icons/tb";
import { api } from "libs/utils/apiClient";
import { useParameterStore } from "libs/utils/useParameterStore"; 

interface Karyawan {
  id: string;
  username: string;
  fullname: string;
  noWhatsapp: string;
  branchId: string;
  roleId: string;
  status: boolean;
}

export default function DetailKaryawan() {
  const pathname = usePathname();
  const id = pathname.split("/").pop();
  const router = useRouter();

  const [karyawan, setKaryawan] = useState<Karyawan | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [updating, setUpdating] = useState<boolean>(false);

  const { roleMapping, branchMapping, loading: loadingParams } = useParameterStore(); 

  useEffect(() => {
    const fetchKaryawan = async () => {
      try {
        const result = await api.get(`/user/${id}`);
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
    if (karyawan) {
      setKaryawan({ ...karyawan, [e.target.id]: e.target.value });
    }
  };
const handleStatusChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (karyawan) {
        setKaryawan({ ...karyawan, status: e.target.checked });
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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!karyawan) return;
  
    const payload = {
      fullname: karyawan.fullname,
      noWhatsapp: karyawan.noWhatsapp,
      branchId: karyawan.branchId,
      roleId: karyawan.roleId,
      status: true,   //Kena bad requset kalo number, sementara boolean
    };
  
    console.log("Payload yang dikirim ke API:", payload);
  
    setUpdating(true);
    try {
    const response = await fetch(`${process.env.NEXT_PUBLIC_APIURL}/user/${karyawan.id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${localStorage.getItem('access_token')}`,
      },
      body: JSON.stringify(payload),
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    console.log("Response dari server:", data);
  
      alert("Data berhasil diperbarui!");
    } catch (error: any) {
      console.error("Gagal mengupdate data:", error.response?.data || error.message);
      alert(`Gagal menyimpan perubahan: ${error.response?.data?.message || "Terjadi kesalahan"}`);
    } finally {
      setUpdating(false);
    }
  };
  

  return (
    <Wrapper>
      <Header label={`Ubah Profil Karyawan`} />
      {loading || loadingParams ? (
        <p className="text-center py-4">Memuat data...</p>
      ) : karyawan ? (
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="flex items-center space-x-4">
            <Label htmlFor="username" className="w-1/4 font-semibold">Username</Label>
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
            <Label htmlFor="roleId" className="w-1/4">Akses Pengguna</Label>
            <Select onValueChange={handleRoleChange} value={karyawan.roleId}>
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Pilih Akses" />
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
            <Label htmlFor="status" className="w-[20%] font-semibold">Status</Label>
            <div className="flex items-center space-x-2">
              <Checkbox id="status" checked={karyawan.status} onCheckedChange={handleStatusChange} />
              <Label htmlFor="status" className="font-semibold">{karyawan.status ? "Aktif" : "Non-Aktif"}</Label>
            </div>
          </div>
          <div className="flex items-center space-x-4">
            <div className="w-1/4"></div>
            <div className="space-x-2 flex w-full">
              <Button type="button" variant="destructive" className="text-foreground w-[10lvw]" onClick={() => router.push("/master-data/karyawan")}>
                <TbCancel />
                Batal
              </Button>
              <Button type="submit" variant="default" className="bg-success text-foreground hover:bg-green-600 w-[10lvw]" disabled={updating}>
                {updating ? "Menyimpan..." : (
                  <>
                    <LuSave />
                    Simpan
                  </>
                )}
              </Button>
            </div>
          </div>
        </form>
      ) : (
        <p className="text-center py-4 text-red-500">Karyawan tidak ditemukan!</p>
      )}
    </Wrapper>
  );
}
