"use client"
import Link from "next/link";
import { useEffect, useState } from "react";
import { apiClient } from "libs/utils/apiClient";
import { Header } from "@shared/components/Header";
import { Wrapper } from "@shared/components/Wrapper";
import { Input } from "libs/ui-components/src/components/ui/input";
import { Button } from "libs/ui-components/src/components/ui/button";
import { LuPlus } from "react-icons/lu";
import { Search } from "lucide-react";
import { IoClose } from "react-icons/io5";
import { SelectData } from "libs/ui-components/src/components/select-data";
import { PaginationNumber } from "libs/ui-components/src/components/pagination-number";
import { DiscountTable } from "libs/ui-components/src/components/discount-table";
import { Label } from "@ui-components/components/ui/label";

export const DataHeaderPromo = [
  { key: "id", label: "#" },
  { key: "code", label: "Kode Promo" },
  { key: "name", label: "Nama Promo" },
  { key: "amount", label: "Potongan Harga" },
  { key: "serviceCode", label: "Layanan" },
  { key: "minItem", label: "Minimal" },
  { key: "endDate", label: "Masa Berlaku" },
  { key: "category", label: "Kategori" },
  { key: "menu", label: "Aksi" },
];

export default function PromoPage() {
  const [dataPromo, setDataPromo] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalData, setTotalData] = useState(0);
  const [limit, setLimit] = useState(10);
  const [searchQuery, setSearchQuery] = useState("");
  const [searchInput, setSearchInput] = useState("");

  const totalPages = Math.max(1, Math.ceil(totalData / limit));

  const fetchPromo = async () => {
    setLoading(true);
    try {
      let url = `/promo/page?search=${searchQuery}&page=${currentPage}&limit=${limit}`;

      const result = await apiClient(url);
      setDataPromo(result.data[0] || []);
      setTotalData(result.data[1] || 0);
    } catch (error) {
      console.error("Error fetching data:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPromo();
  }, [searchQuery, currentPage, limit]);

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
    <Wrapper>
      <Header label="Daftar Promo" count={totalData} />
      <div className="flex-grow">
        <div className="flex items-center justify-between mb-4 gap-2">
          <div className="flex items-center gap-2">
            <div className="relative">
              <Input
                type="text"
                placeholder="Cari promo..."
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

            <Button variant="secondary" onClick={handleSearch}>Cari</Button>
          </div>
          <Link href="diskon/baru">
            <Button icon={<LuPlus size={14} />} iconPosition="left" variant="default">
              Tambah
            </Button>
          </Link>
        </div>

        {loading ? (
          <p className="text-center py-4">Memuat data...</p>
        ) : dataPromo.length === 0 && searchInput !== "" ? (
          <p className="text-center py-4">Promo dengan nama <span className="font-bold">{searchInput}</span> tidak ditemukan.</p>
        ) : dataPromo.length === 0 ? (
          <p className="text-center py-4">Gagal memuat data.</p>
        ) : (
          <DiscountTable
            data={dataPromo}
            columns={DataHeaderPromo}
            key={`${currentPage}-${limit}`}
            currentPage={currentPage}
            limit={limit}
            fetchData={fetchPromo} // Pass the fetchPromo function to the table
          />
        )}
      </div>

      <div className="flex items-center justify-between mt-4">
        {totalData > 10 ? (
          <SelectData label="Data Per Halaman" totalData={totalData} currentLimit={limit} onLimitChange={(val) => setLimit(Number(val))} />
        ) : (
          <Label className="text-xs">Semua data telah ditampilkan ({totalData})</Label>
        )}
        <PaginationNumber totalPages={totalPages} currentPage={currentPage} onPageChange={(page) => setCurrentPage(page)} />
      </div>
    </Wrapper>
  );
}
