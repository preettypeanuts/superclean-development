"use client";
import { useEffect, useState } from "react";
import { Header } from "@shared/components/Header";
import { Wrapper } from "@shared/components/Wrapper";
import { Input } from "libs/ui-components/src/components/ui/input";
import { Button } from "libs/ui-components/src/components/ui/button";
import { DropdownMenuCheckboxes } from "libs/ui-components/src/components/dropdown-checkboxes";
import { LuPlus } from "react-icons/lu";
import { Search } from "lucide-react";
import { SelectData } from "libs/ui-components/src/components/select-data";
import { PaginationNumber } from "libs/ui-components/src/components/pagination-number";
import { TablePelanggan } from "libs/ui-components/src/components/table-pelanggan";
import Link from "next/link";
import { apiClient } from "libs/utils/apiClient";

export const DataHeaderPelanggan = [
  { key: "id", label: "#" },
  { key: "fullname", label: "Nama Lengkap" },
  { key: "noWhatsapp", label: "No. WhatsApp" },
  { key: "createdAt", label: "Tanggal Daftar" },
  { key: "createdBy", label: "Didaftarkan Oleh" },
  { key: "status", label: "Status" },
  { key: "menu", label: "Aksi" },
];

export default function PelangganPage() {
  const [dataPelanggan, setDataPelanggan] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await apiClient("/customer/page?page=1&limit=10");
        setDataPelanggan(response.data[0] || []);   
      } catch (error) {
        console.error("Error fetching data pelanggan:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  return (
    <Wrapper>
      <Header label="Daftar Pelanggan" count={dataPelanggan.length} />
      <div className="flex-grow">
        <div className="flex items-center justify-between mb-4 gap-2">
          <div className="flex items-center gap-2">
            <Input type="text" placeholder="Cari pelanggan..." className="w-[30lvw]" icon={<Search size={16} />} />
            <DropdownMenuCheckboxes />
            <Button variant="secondary">Cari</Button>
          </div>
          <Link href="pelanggan/baru">
            <Button icon={<LuPlus size={16} />} className="pl-2 pr-4" iconPosition="left" variant="default">
              Tambah Pelanggan
            </Button>
          </Link>
        </div>
        {loading ? (
          <p>Loading...</p>
        ) : (
          <TablePelanggan data={dataPelanggan} columns={DataHeaderPelanggan} />
        )}
      </div>
      <div className="flex items-center justify-between mt-4">
        <SelectData label="Data Per halaman" />
        <PaginationNumber />
      </div>
    </Wrapper>
  );
}
