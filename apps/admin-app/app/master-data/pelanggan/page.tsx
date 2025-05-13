"use client";
import Link from "next/link";
import { useEffect, useState } from "react";
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
import { Label } from "@ui-components/components/ui/label";
import { Breadcrumbs } from "@shared/components/ui/Breadcrumbs";
import { useLocationData, getCitiesLabel } from "libs/utils/useLocationData";

export const DataHeaderPelanggan = [
  { key: "id", label: "#" },
  { key: "fullname", label: "Nama Lengkap" },
  { key: "noWhatsapp", label: "No. WhatsApp" },
  { key: "customerType", label: "Tipe Pelanggan" },
  { key: "address", label: "Alamat" },
  { key: "city", label: "Kota" },
  { key: "createdBy", label: "Didaftarkan Oleh" },
  { key: "status", label: "Status" },
  { key: "menu", label: "Aksi" },
];

interface Pelanggan {
  id: string;
  createdAt: string;
  createdBy: string;
  noWhatsapp: string;
  customerType: string;
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
  const [limit, setLimit] = useState<number>(10);
  const [searchQuery, setSearchQuery] = useState("");
  const [searchInput, setSearchInput] = useState("");
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

  useEffect(() => {
    fetchPelanggan();
  }, [searchQuery, statusFilter, currentPage, limit]);

  const handleSearch = () => {
    setSearchQuery(searchInput);
    setCurrentPage(1);
  };

  const resetSearch = () => {
    setSearchInput("");
    setSearchQuery("");
    setCurrentPage(1);
  };

  const selectedProvince = [...new Set(dataPelanggan.map((item) => item.province).filter(Boolean))];

  const { provinces } = useLocationData();
  const [cities, setCities] = useState<any[]>([]);

  useEffect(() => {
    if (selectedProvince.length === 0) return;

    const fetchCities = async () => {
      const result = await getCitiesLabel(selectedProvince);
      setCities(result);
    };

    fetchCities();
  }, [selectedProvince]);

  const processedPelanggan = dataPelanggan.map((item) => ({
    ...item,
    province:
      provinces.find((prov: { paramKey: string; paramValue: string }) => prov.paramKey === item.province)?.paramValue || "Tidak Diketahui",
    city:
      cities.find((cty) => cty.paramKey === item.city)?.paramValue || "Tidak Diketahui",
  }));

  return (
    <>
      <Breadcrumbs label="Daftar Pelanggan" count={totalData} />
      <Wrapper>
        <div className="flex-grow">
          <div className="flex items-center justify-between mb-4 gap-2">
            <div className="flex items-center gap-2">
              <div className="relative">
                <Input
                  type="text"
                  placeholder="Cari nama pelanggan..."
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
                placeholder="Status"
                value={statusFilter}
                onChange={setStatusFilter}
              />
              <Button variant="main" onClick={handleSearch}>
                Cari
              </Button>
            </div>
            <Link href="pelanggan/baru">
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
          ) : dataPelanggan.length === 0 ? (
            <p className="text-center py-4">
              Pelanggan dengan nama <span className="font-bold">{searchInput}</span> tidak ditemukan.
            </p>
          ) : (
            <TablePelanggan
              key={`${currentPage}-${limit}`}
              data={processedPelanggan}
              columns={DataHeaderPelanggan}
              currentPage={currentPage}
              limit={limit}
              fetchData={fetchPelanggan}
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
