"use client";
import Link from "next/link";
import { useEffect, useState } from "react";
import { apiClient } from "libs/utils/apiClient";
import { TableLayanan } from "libs/ui-components/src/components/layanan-table";
import { Wrapper } from "libs/shared/src/components/Wrapper";
import { Input } from "libs/ui-components/src/components/ui/input";
import { Button } from "libs/ui-components/src/components/ui/button";
import { FilterStatus } from "@superclean-workspace/ui-components/components/filter-status";
import { FilterCategoryLayanan } from "@superclean-workspace/ui-components/components/filter-category-layanan";
import { LuPlus } from "react-icons/lu";
import { Search } from "lucide-react";
import { SelectData } from "libs/ui-components/src/components/select-data";
import { PaginationNumber } from "libs/ui-components/src/components/pagination-number";
import { Label } from "@ui-components/components/ui/label";
import { IoClose } from "react-icons/io5";
import { Breadcrumbs } from "@shared/components/ui/Breadcrumbs";

export const DataHeaderLayanan = [
  { key: "id", label: "#" },
  { key: "code", label: "Kode Layanan" },
  { key: "name", label: "Nama Layanan" },
  { key: "category", label: "Kategori" },
  { key: "vacuumPrice", label: "Harga Vakum" },
  { key: "cleanPrice", label: "Harga Cuci" },
  { key: "status", label: "Status" },
  { key: "menu", label: "Aksi" },
];

interface Service {
  id: string;
  code: string;
  name: string;
  category: string;
  unit: string;
  vacuumPrice: number;
  cleanPrice: number;
  generalPrice: number;
  status: number;
}

export default function LayananPage() {
  const [dataLayanan, setDataLayanan] = useState<Service[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [totalData, setTotalData] = useState<number>(0);
  const [limit, setLimit] = useState<number>(10);
  const [searchQuery, setSearchQuery] = useState("");
  const [searchInput, setSearchInput] = useState(""); // Input Sementara
  const [statusFilter, setStatusFilter] = useState<string>("");
  const [catFilter, setCatFilter] = useState<string>("");

  const totalPages = Math.max(1, Math.ceil(totalData / limit));

  const fetchLayanan = async () => {
    setLoading(true);
    try {
      let url = `/service/page?search=${searchQuery}&page=${currentPage}&limit=${limit}`;

      if (statusFilter !== "") {
        url += `&status=${statusFilter}`;
      }

      if (catFilter !== "") {
        url += `&category=${catFilter}`;
      }

      const result = await apiClient(url);

      setDataLayanan(result.data[0] || []);
      setTotalData(result.data[1] || 0);
    } catch (error) {
      console.error("Error fetching data:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLayanan();
  }, [searchQuery, statusFilter, catFilter, currentPage, limit]);

  const handleSearch = () => {
    setSearchQuery(searchInput);
    setCurrentPage(1);
  };

  const resetSearch = () => {
    setSearchInput("");
    setSearchQuery("");
    setCurrentPage(1);
  };

  return (
    <>
      <Breadcrumbs label="Daftar Layanan" count={totalData} />
      <Wrapper>
        <div className="flex-grow">
          <div className="flex items-center justify-between mb-4 gap-2">
            <div className="flex items-center gap-2">
              <div className="relative">
                <Input
                  type="text"
                  placeholder="Cari Kode Layanan, Nama Layanan"
                  value={searchInput}
                  onChange={(e) => setSearchInput(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") {
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

              <FilterCategoryLayanan
                catFilter={catFilter}
                setcatFilter={setCatFilter}
              />
              <FilterStatus
                placeholder="Status"
                value={statusFilter}
                onChange={setStatusFilter}
              />
              <Button
                variant="main"
                onClick={handleSearch}
              >
                Cari
              </Button>
            </div>
            <Link href="layanan/baru">
              <Button
                icon={<LuPlus size={16} />}
                iconPosition="left"
                variant="default"
              >
                Tambah
              </Button>
            </Link>
          </div>

          {loading ? (
            <p className="text-center py-4">Memuat data...</p>
          ) : dataLayanan.length === 0 ? (
            searchQuery ? (
              <p className="text-center py-4">
                Layanan dengan nama <span className="font-bold">{searchQuery}</span> tidak ditemukan.
              </p>
            ) : (
              <p className="text-center py-4">Tidak ada data layanan yang tersedia.</p>
            )
          ) : (
            <TableLayanan
              data={dataLayanan}
              columns={DataHeaderLayanan}
              key={`${currentPage}-${limit}`}
              currentPage={currentPage}
              limit={limit}
              fetchData={fetchLayanan}
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
            <Label className="text-xs">Semua data telah ditampilkan ({totalData})</Label>
          )}

          <PaginationNumber
            totalPages={totalPages}
            currentPage={currentPage}
            onPageChange={(page) => setCurrentPage(page)}
          />
        </div>
      </Wrapper>
    </>
  );
}
