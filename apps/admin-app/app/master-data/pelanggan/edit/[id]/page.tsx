"use client";
import { usePathname, useRouter } from 'next/navigation';
import { useEffect, useMemo, useState } from 'react';
import { api } from "libs/utils/apiClient";
import { useToast } from "libs/ui-components/src/hooks/use-toast"
import PelangganForm, { MasterPelanggan } from 'apps/admin-app/app/master-data/pelanggan/form';


interface Pelanggan {
  id: string;
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

export default function EditPelanggan2() {
  const { toast } = useToast();
  const pathname = usePathname();
  const pelangganId = pathname.split('/').pop();

  const router = useRouter();

  const [pelanggan, setPelanggan] = useState<Pelanggan>({
    id: pelangganId || '',
    fullname: "",
    noWhatsapp: "",
    customerType: "",
    address: "",
    province: "",
    city: "",
    district: "",
    subDistrict: "",
    status: 1,
  });

  const [load, setLoad] = useState<boolean>(false);
  const [updating, setUpdating] = useState<boolean>(false);

  useEffect(() => {
    const fetchPelanggan = async () => {
      setLoad(true);
      try {
        const result = await api.get(`/customer/id/${pelangganId}`);
        setPelanggan(result.data);
      } catch (error) {
        console.error("Gagal mengambil data pelanggan:", error);
      } finally {
        setLoad(false);
      }
    };

    fetchPelanggan();
  }, [pelangganId]);

  const handleSubmit = async (formData: MasterPelanggan) => {
    if (!formData) return;

    // Pastikan id pelanggan ada
    const pelangganId = formData.id;
    if (!pelangganId) {
      alert("ID pelanggan tidak ditemukan!");
      return;
    }
    setUpdating(true);

    const updatedData = {
      fullname: formData.fullname,
      customerType: formData.customerType,
      address: formData.address,
      province: formData.province,
      city: formData.city,
      district: formData.district,
      subDistrict: formData.subDistrict,
      status: formData.status, // Pastikan status sesuai aturan API
    };

    setUpdating(true);
    try {
      const response = await api.put(`/customer/${pelangganId}`, updatedData);
      toast({
        title: "Berhasil",
        description: "Profil pelanggan berhasil diperbarui!",
        variant: "success",
      });
      router.push('/master-data/pelanggan');
    } catch (error) {
      console.error("Gagal memperbarui data:", error);
      toast({
        title: "Gagal",
        description: "Terjadi kesalahan saat mengubah profil pelanggan.",
        variant: "destructive",
      });
    } finally {
      setUpdating(false);
    }
  };

  return (
    <>
      <PelangganForm
        onSubmit={handleSubmit}
        pelanggan={pelanggan}
        toast={toast}
        isEdit={true}
        loadingData={load}
        loadingSubmit={updating}
      />
    </>
  )

}
