"use client"
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { apiClient } from "libs/utils/apiClient";
import { TableKaryawan } from "libs/ui-components/src/components/karyawan-table";
import { Header } from "@shared/components/Header";
import { Wrapper } from "libs/shared/src/components/Wrapper";
import { Input } from "libs/ui-components/src/components/ui/input";
import { Button } from "libs/ui-components/src/components/ui/button";
import { DropdownMenuCheckboxes } from "libs/ui-components/src/components/dropdown-checkboxes";
import { LuPlus } from "react-icons/lu";
import { Search } from "lucide-react";
import { SelectData } from "libs/ui-components/src/components/select-data";
import { PaginationNumber } from "libs/ui-components/src/components/pagination-number";
import Link from "next/link";
import { useParameterStore } from "libs/utils/useParameterStore";

export const DataHeader = [
  { key: "id", label: "#" },
  { key: "username", label: "Nama Pengguna" },
  { key: "fullname", label: "Nama" },
  { key: "noWhatsapp", label: "No. WhatsApp" },
  { key: "roleId", label: "Akses Pengguna" },
  { key: "cabang", label: "Cabang" },
  { key: "status", label: "Status" },
  { key: "menu", label: "Aksi" },
];

interface Karyawan {
  id: string;
  createdAt: string;
  createdBy: string;
  username: string;
  fullname: string;
  noWhatsapp: string;
  branchId: number;
  roleId: string;
  status: boolean;
}

export default function KaryawanPage() {
  const [dataKaryawan, setDataKaryawan] = useState<Karyawan[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const router = useRouter();
  const { roleMapping, branchMapping, loading: loadingParams } = useParameterStore();

  useEffect(() => {
    const fetchKaryawan = async () => {
      try {
        const result = await apiClient("/user/page?page=1&limit=10");
        setDataKaryawan(result.data[0] || []);
      } catch (error) {
        console.error(error);

      } finally {
        setLoading(false);
      }
    };

    fetchKaryawan();
  }, [router]);

  // Proses Data Karyawan (Mapping roleId dan branchId)
  const processedKaryawan = dataKaryawan.map((item) => ({
    ...item,
    roleId: roleMapping[item.roleId] || "Tidak Diketahui",
    cabang: branchMapping[item.branchId] || "Tidak Diketahui",
  }));

  return (
    <Wrapper>
      <Header label={"Daftar Karyawan"} count={dataKaryawan.length} />
      <div className="flex-grow">
        <div className="flex items-center justify-between mb-4 gap-2">
          <div className="flex items-center gap-2">
            <Input type="text" placeholder="Cari mitra..." className="w-[30lvw]" icon={<Search size={16} />} />
            <DropdownMenuCheckboxes />
            <Button variant={"secondary"}>Cari</Button>
          </div>
          <Link href="karyawan/baru">
            <Button icon={<LuPlus size={16} />} className="pl-2 pr-4" iconPosition="left" variant="default" type="submit">
              Tambah Mitra
            </Button>
          </Link>
        </div>

        {loading || loadingParams ? (
          <p className="text-center py-4">Memuat data...</p>
        ) : (
          <TableKaryawan data={processedKaryawan} columns={DataHeader} />
        )}
      </div>

      <div className="flex items-center justify-between mt-4">
        <SelectData label="Data Per halaman" />
        <PaginationNumber />
      </div>
    </Wrapper>
  );
}
