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
import { Breadcrumbs } from "@shared/components/ui/Breadcrumbs";

const DataHeaderPromo = [
  { key: "id", label: "#" },
  { key: "code", label: "Kode Promo" },
  { key: "name", label: "Nama Promo" },
  { key: "promoType", label: "Tipe Promo" },
  { key: "amount", label: "Potongan (Rp / %)" },
  { key: "serviceCode", label: "Layanan" },
  { key: "minItem", label: "Minimal Item" },
  { key: "endDate", label: "Masa Berlaku" },
  { key: "menu", label: "Aksi" },
];

export default function PromoPage() {
  const [dataPromo, setDataPromo] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState<{
    page: number,
    reset: boolean
  }>({
    page: 1,
    reset: false
  });
  const [totalData, setTotalData] = useState(0);
  const [limit, setLimit] = useState(10);

  const [searchQuery, setSearchQuery] = useState("");
  const [tempSearchQuery, setTempSearchQuery] = useState("");

  const totalPages = Math.max(1, Math.ceil(totalData / limit));

  const fetchPromo = async (reset: boolean = false) => {
    let page = currentPage.page;
    let search = searchQuery;

    if (reset) {
      page = 1;
      search = tempSearchQuery

      setCurrentPage({
        page: page,
        reset: true
      })
      setSearchQuery(search)
    }

    setLoading(true);
    try {
      let url = `/promo/page?search=${search}&page=${page}&limit=${limit}`;

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
    if (currentPage.reset) return; // handle on manual search if reset is true
    fetchPromo();
  }, [
    // searchQuery,
    currentPage,
    limit
  ]);

  const handleSearch = () => {
    fetchPromo(true);
    // setSearchQuery(tempSearchQuery);
    // setCurrentPage(1);
  };

  const resetSearch = () => {
    setTempSearchQuery("");
    setSearchQuery("");
    // setCurrentPage(1);
  };

  return (
    <>
      <Breadcrumbs label="Daftar Promo" count={totalData} />
      <Wrapper>
        <div className="flex-grow">
          <div className="flex items-center justify-between mb-4 gap-2">
            <div className="flex items-center gap-2">
              <div className="relative">
                <Input
                  type="text"
                  placeholder="Cari Kode Promo, Nama Promo"
                  value={tempSearchQuery}
                  onChange={(e) => setTempSearchQuery(e.target.value)}
                  onKeyDown={(i) => {
                    if (i.key === "Enter") {
                      handleSearch();
                    }
                  }}
                  className="w-[30lvw]"
                  icon={<Search size={16} />}
                />
                {tempSearchQuery && (
                  <button
                    type="button"
                    onClick={resetSearch}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-neutral-500 hover:text-neutral-700"
                  >
                    <IoClose size={16} />
                  </button>
                )}
              </div>

              <Button variant="main" onClick={handleSearch}>Cari</Button>
            </div>
            <Link href="diskon/baru">
              <Button icon={<LuPlus size={14} />} iconPosition="left" variant="default">
                Tambah
              </Button>
            </Link>
          </div>

          {loading ? (
            <p className="text-center py-4">Memuat data...</p>
          ) : dataPromo.length === 0 && tempSearchQuery !== "" ? (
            <p className="text-center py-4">Promo tidak ditemukan.</p>
          ) : dataPromo.length === 0 ? (
            <p className="text-center py-4">Gagal memuat data.</p>
          ) : (
            <DiscountTable
              data={dataPromo}
              columns={DataHeaderPromo}
              key={`${currentPage}-${limit}`}
                    currentPage={currentPage.page}
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
          <PaginationNumber totalPages={totalPages} currentPage={currentPage.page} onPageChange={(page) => setCurrentPage({ page, reset: false })} />
        </div>
      </Wrapper>
    </>
  );
}
