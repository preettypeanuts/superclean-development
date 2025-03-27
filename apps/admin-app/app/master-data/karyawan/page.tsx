"use client"
import Link from "next/link";
import { useEffect, useState } from "react";
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
  status: number;
}

export default function KaryawanPage() {
  const [dataKaryawan, setDataKaryawan] = useState<Karyawan[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [totalData, setTotalData] = useState<number>(0);
  const [limit, setLimit] = useState<number>(10); // Default 10 data per halaman
  const totalPages = Math.max(1, Math.ceil(totalData / limit));

  const { roleMapping, branchMapping, loading: loadingParams } = useParameterStore();

  useEffect(() => {
    const fetchKaryawan = async () => {
      try {
        const result = await apiClient(`/user/page?page=${currentPage}&limit=${limit}`);
        
        setDataKaryawan(result.data[0] || []);
        setTotalData(result.data[1] || 0); // Pastikan API mengembalikan total data yang benar
        console.log('====================================');
        console.log(result);
        console.log('====================================');
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };
    

    fetchKaryawan();
  }, [currentPage, limit]);

  // Proses Data Karyawan (Mapping roleId dan branchId)
  const processedKaryawan = dataKaryawan.map((item) => ({
    ...item,
    roleId: roleMapping[item.roleId] || "Tidak Diketahui",
    cabang: branchMapping[item.branchId] || "Tidak Diketahui",
  }));

  console.log('====================================');
  console.log(totalPages);
  console.log('====================================');
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
        <SelectData
          label="Data Per halaman"
          value={limit}
          onChange={(value) => {
            setLimit(value);
            setCurrentPage(1); // Reset ke halaman pertama setiap kali limit berubah
          }}
        />

        <PaginationNumber
          totalPages={totalPages}
          currentPage={currentPage}
          onPageChange={(page) => setCurrentPage(page)}
        />
      </div>
    </Wrapper>
  );
}
