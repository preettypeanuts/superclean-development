"use client";
import Link from "next/link";
import { useEffect, useState } from "react";
import { Header } from "@shared/components/Header";
import { Wrapper } from "@shared/components/Wrapper";
import { Input } from "libs/ui-components/src/components/ui/input";
import { Button } from "libs/ui-components/src/components/ui/button";
import { FilterStatus } from "@superclean-workspace/ui-components/components/filter-status";
import { LuPlus } from "react-icons/lu";
import { Search } from "lucide-react";
import { SelectData } from "libs/ui-components/src/components/select-data";
import { PaginationNumber } from "libs/ui-components/src/components/pagination-number";
import { TablePelanggan } from "libs/ui-components/src/components/table-pelanggan";
import { apiClient } from "libs/utils/apiClient";
import { IoClose } from "react-icons/io5";

export const DataHeaderPelanggan = [
  { key: "id", label: "#" },
  { key: "fullname", label: "Nama Lengkap" },
  { key: "noWhatsapp", label: "No. WhatsApp" },
  { key: "createdAt", label: "Tanggal Daftar" },
  { key: "createdBy", label: "Didaftarkan Oleh" },
  { key: "status", label: "Status" },
  { key: "menu", label: "Aksi" },
];
interface Pelanggan {
  id: string;
  createdAt: string;
  createdBy: string;
  noWhatsapp: string;
  fullname: string;
  address: string;
  province: string;
  city: string;
  district: string;
  subDistrict: string;
  status: number;
}

export default function PelangganPage() {
  const [dataPelanggan, setDataPelanggan] = useState<Pelanggan[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [totalData, setTotalData] = useState<number>(0);
  const [limit, setLimit] = useState<number>(10); // Default 10 data per halaman
  const [searchQuery, setSearchQuery] = useState("");
  const [searchInput, setSearchInput] = useState(""); // Input Sementara
  const [statusFilter, setStatusFilter] = useState<string>("");

  const totalPages = Math.max(1, Math.ceil(totalData / limit));

  const fetchPelanggan = async () => {
    setLoading(true);
    try {
    let url = `/customer/page?search=${searchQuery}&page=${currentPage}&limit=${limit}`;

    if (statusFilter !== "") {
      url += `&status=${statusFilter}`;
    }
    
    const result = await apiClient(url);

    setDataPelanggan(result.data[0] || []);
    setTotalData(result.data[1] || 0);
  } catch (error) {
    console.error("Error fetching data pelanggan:", error);
  } finally {
    setLoading(false);
  }
};


// Fetch data hanya saat query/filters berubah
useEffect(() => {
  fetchPelanggan();
}, [searchQuery, statusFilter, currentPage, limit]);

const handleSearch = () => {
  setSearchQuery(searchInput); // Set query baru untuk API
  setCurrentPage(1); // Reset ke halaman pertama
};

const resetSearch = () => {
  setSearchInput("");  // Hapus input di UI
  setSearchQuery("");  // Hapus query di API
  setCurrentPage(1);   // Reset ke halaman pertama
};

return (
  <Wrapper>
    <Header label="Daftar Pelanggan" count={totalData} />
    <div className="flex-grow">
      <div className="flex items-center justify-between mb-4 gap-2">
        <div className="flex items-center gap-2">
          <div className="relative">
            <Input
              type="text"
              placeholder="Cari nama karyawan..."
              value={searchInput}
              onChange={(e) => setSearchInput(e.target.value)}
              onKeyDown={(i) => {
                if (i.key === "Enter") {
                  handleSearch();
                }
              }}
              className="w-[30lvw]"
              icon={<Search size={16} />}
            />
            {searchInput && (
              <button
                type="button"
                onClick={resetSearch}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-neutral-500 hover:text-neutral-700"
              >
                <IoClose size={16} />
              </button>
            )}
          </div>
          <FilterStatus
            statusFilter={statusFilter}
            setStatusFilter={setStatusFilter}
          />
          <Button variant="secondary" onClick={handleSearch}>Cari</Button>
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
        <TablePelanggan
          key={`${currentPage}-${limit}`}
          data={dataPelanggan}
          columns={DataHeaderPelanggan}
          currentPage={currentPage} // Kirim currentPage
          limit={limit} // Kirim limit
        />
      )}
    </div>
    <div className="flex items-center justify-between mt-4">
      {totalData > 10 ? (
        <SelectData
          label="Data Per Halaman"
          totalData={totalData}
          currentLimit={limit}
          onLimitChange={(limit: string) => setLimit(Number(limit))}
        />
      ) : (
        <p>Semua data telah ditampilkan ({totalData})</p>

      )}

      <PaginationNumber
        totalPages={totalPages}
        currentPage={currentPage}
        onPageChange={(page) => setCurrentPage(page)}
      />
    </div>
  </Wrapper>
);
}
