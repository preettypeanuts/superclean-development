"use client";
import { Breadcrumbs } from "@shared/components/ui/Breadcrumbs";
import { useCategoryStore2 } from "@shared/utils/useCategoryStore";
import { useUserProfile } from "@shared/utils/useUserProfile";
import { GroupFilter } from "@ui-components/components/group-filter";
import { SelectFilter } from "@ui-components/components/select-filter";
import { Label } from "@ui-components/components/ui/label";
import { Wrapper } from "libs/shared/src/components/Wrapper";
import { TableLayanan } from "libs/ui-components/src/components/layanan-table";
import { PaginationNumber } from "libs/ui-components/src/components/pagination-number";
import { SelectData } from "libs/ui-components/src/components/select-data";
import { Button } from "libs/ui-components/src/components/ui/button";
import { Input } from "libs/ui-components/src/components/ui/input";
import { apiClient } from "libs/utils/apiClient";
import { Search } from "lucide-react";
import Link from "next/link";
import { useEffect, useState } from "react";
import { IoClose } from "react-icons/io5";
import { LuPlus } from "react-icons/lu";

const DataHeaderLayanan = [
  { key: "id", label: "#" },
  { key: "code", label: "Kode Layanan" },
  { key: "name", label: "Nama Layanan" },
  { key: "category", label: "Kategori" },
  { key: "unit", label: "Satuan" },
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

const options = [
  { label: "Semua", value: "all" },
  { label: "Aktif", value: "1" },
  { label: "Tidak-Aktif", value: "0" },
]

export default function LayananPage() {
  const [dataLayanan, setDataLayanan] = useState<Service[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [currentPage, setCurrentPage] = useState<{
    page: number,
    reset: boolean
  }>({
    page: 1,
    reset: false
  });
  const [totalData, setTotalData] = useState<number>(0);
  const [limit, setLimit] = useState<number>(10);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [catFilter, setCatFilter] = useState<string>("all");

  const totalPages = Math.max(1, Math.ceil(totalData / limit));

  const [tempSearchQuery, setTempSearchQuery] = useState("");
  const [tempStatusFilter, setTempStatusFilter] = useState<string>("all");
  const [tempCatFilter, setTempCatFilter] = useState<string>("all");
  const [disabledAction, setDisabledAction] = useState<boolean>(true);
  const [actionMenu, setActionMenu] = useState<{key: string, label: string}[]>(DataHeaderLayanan);
  const { user } = useUserProfile();
  const { categories } = useCategoryStore2();

  const fetchLayanan = async (reset: boolean = false) => {
    let page = currentPage.page;
    let search = searchQuery;
    let status = statusFilter;
    let cat = catFilter;

    if (reset) {
      page = 1;
      search = tempSearchQuery
      status = tempStatusFilter
      cat = tempCatFilter

      setCurrentPage({
        page: page,
        reset: true
      })
      setSearchQuery(search)
      setStatusFilter(status)
      setCatFilter(cat)
    }

    setLoading(true);
    try {
      let url = `/service/page?search=${search}&page=${page}&limit=${limit}`;

      if (status !== "all") {
        url += `&status=${status}`;
      }

      if (cat !== "all") {
        url += `&category=${cat}`;
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
    if (currentPage.reset) return;
    fetchLayanan();
  }, [currentPage, limit]);

  const handleSearch = () => {
    fetchLayanan(true)
  };

  const resetSearch = () => {
    setTempSearchQuery("");
    setSearchQuery("");
  };

  useEffect(() => {
      if (user?.roleIdCode === 'SA' || user?.roleIdCode === 'SPV') {
        setDisabledAction(false);
        setActionMenu(DataHeaderLayanan);
      } else {
        setDisabledAction(true);
        const filteredData = DataHeaderLayanan.filter(item => item.key !== "menu");
        setActionMenu(filteredData);
      }
  }, [user]);

  const handleResetFilter = () => {
    setTempSearchQuery("");
    setStatusFilter("all");
    setTempCatFilter("all");
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
                  value={tempSearchQuery}
                  onChange={(e) => setTempSearchQuery(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') {
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
              <GroupFilter
                className="space-y-2"
                onReset={handleResetFilter}
                hideButtons
              >
                <SelectFilter
                  label="Kategori Layanan"
                  id="category"
                  placeholder="Pilih Kategori Layanan"
                  value={tempCatFilter}
                  optionsString={[
                    { label: 'Semua Kategori', value: 'all' },
                    ...categories.map((item) => ({
                      label: item.paramValue,
                      value: item.paramKey,
                    })),
                  ]}
                  onChange={setTempCatFilter}
                />
                <SelectFilter
                  label="Status"
                  id="status"
                  placeholder="Pilih Status"
                  value={tempStatusFilter}
                  optionsString={options}
                  onChange={setTempStatusFilter}
                />
              </GroupFilter>
              <Button variant="main" onClick={handleSearch}>
                Cari
              </Button>
            </div>
            <Link href="layanan/baru" hidden={disabledAction}>
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
            <p className="text-center py-4">
              Tidak ada data layanan yang tersedia.
            </p>
          ) : (
            <TableLayanan
              data={dataLayanan}
              columns={actionMenu}
              key={`${currentPage}-${limit}`}
              currentPage={currentPage.page}
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
            <Label className="text-xs">
              Semua data telah ditampilkan ({totalData})
            </Label>
          )}

          <PaginationNumber
            totalPages={totalPages}
            currentPage={currentPage.page}
            onPageChange={(page) => setCurrentPage({ page, reset: false })}
          />
        </div>
      </Wrapper>
    </>
  );
}
