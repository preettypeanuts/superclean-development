"use client"
import Link from "next/link";
import { useEffect, useState } from "react";
import { apiClient } from "libs/utils/apiClient";
import { TableKaryawan } from "libs/ui-components/src/components/karyawan-table";
import { Wrapper } from "libs/shared/src/components/Wrapper";
import { Input } from "libs/ui-components/src/components/ui/input";
import { Button } from "libs/ui-components/src/components/ui/button";
import { FilterStatus } from "@superclean-workspace/ui-components/components/filter-status";
import { LuPlus } from "react-icons/lu";
import { Search } from "lucide-react";
import { SelectData } from "libs/ui-components/src/components/select-data";
import { PaginationNumber } from "libs/ui-components/src/components/pagination-number";
import { useParameterStore } from "libs/utils/useParameterStore";
import { Label } from "@ui-components/components/ui/label";
import { IoClose } from "react-icons/io5";
import { Breadcrumbs } from "@shared/components/ui/Breadcrumbs";
import { GroupFilter } from "libs/ui-components/src/components/group-filter"
import { SelectFilter } from "libs/ui-components/src/components/select-filter"

export const DataHeaderPelanggan = [
  { key: "id", label: "#" },
  { key: "username", label: "Nama Pengguna" },
  { key: "fullname", label: "Nama" },
  { key: "noWhatsapp", label: "No. WhatsApp" },
  { key: "cabang", label: "Cabang" },
  { key: "roleId", label: "Akses Pengguna" },
  { key: "birthDate", label: "Tanggal Lahir" },
  { key: "createdAt", label: "Tanggal Daftar" },
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
  birthDate: string;
}

const options = [
  { label: "Semua", value: 0 },
  { label: "Aktif", value: 1 },
  { label: "Nonaktif", value: 2 },
]

export default function KaryawanPage() {
  const [dataKaryawan, setDataKaryawan] = useState<Karyawan[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [totalData, setTotalData] = useState<number>(0);
  const [limit, setLimit] = useState<number>(10);
  const [searchQuery, setSearchQuery] = useState("");
  const [branchFilter, setBranchFilter] = useState<string>("");
  const [roleFilter, setRoleFilter] = useState<string>("");
  const [statusFilter, setStatusFilter] = useState<number>(0);

  // Filter sementara
  const [searchInput, setSearchInput] = useState("");
  const [tempBranchFilter, setTempBranchFilter] = useState<string>("");
  const [tempRoleFilter, setTempRoleFilter] = useState<string>("");
  const [tempStatusFilter, setTempStatusFilter] = useState<number>(0);


  const totalPages = Math.max(1, Math.ceil(totalData / limit));
  const { roleMapping, branchMapping, loading: loadingParams } = useParameterStore();

  const branchOptions = Object.entries(branchMapping).map(([key, val]) => ({
    label: val,
    value: key,
  }));

  const roleOptions = Object.entries(roleMapping).map(([key, val]) => ({
    label: val,
    value: key,
  }));

  const handleApplyFilter = () => {
    setBranchFilter(tempBranchFilter);
    setRoleFilter(tempRoleFilter);
    setStatusFilter(tempStatusFilter);
    setCurrentPage(1);
  };

  const handleResetFilter = () => {
    setTempBranchFilter("");
    setTempRoleFilter("");
    setTempStatusFilter(0);
  };

  const handleCancelFilter = () => {
    setTempBranchFilter(branchFilter);
    setTempRoleFilter(roleFilter);
    setTempStatusFilter(statusFilter);
  };


  const fetchKaryawan = async () => {
    setLoading(true);
    try {
      let url = `/user/page?search=${searchQuery}&page=${currentPage}&limit=${limit}`;

      if (statusFilter !== 0) {
        url += `&status=${statusFilter}`;
      }
      if (branchFilter) {
        url += `&branchId=${branchFilter}`;
      }
      if (roleFilter) {
        url += `&roleId=${roleFilter}`;
      }


      const result = await apiClient(url);

      setDataKaryawan(result.data[0] || []);
      setTotalData(result.data[1] || 0);
    } catch (error) {
      console.error("Error fetching data:", error);
    } finally {
      setLoading(false);
    }
  };

  // Fetch data hanya saat query/filters berubah
  useEffect(() => {
    fetchKaryawan();
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

  // Proses Data Karyawan (Mapping roleId dan branchId)
  const processedKaryawan = dataKaryawan.map((item) => ({
    ...item,
    roleId: roleMapping[item.roleId] || "Tidak Diketahui",
    cabang: branchMapping[item.branchId] || "Tidak Diketahui",
  }));

  return (
    <>
      <Breadcrumbs label="Daftar Karyawan" count={totalData} />
      <Wrapper>
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
              <GroupFilter
                className="space-y-2"
                onApply={handleApplyFilter}
                onReset={handleResetFilter}
                onCancel={handleCancelFilter}
              >
                <SelectFilter
                  label="Cabang"
                  id="cabang"
                  placeholder="Pilih Cabang"
                  value={tempBranchFilter}
                  optionsString={branchOptions}
                  onChange={setTempBranchFilter}
                />
                <SelectFilter
                  label="Akses Pengguna"
                  id="akses"
                  placeholder="Pilih Akses Pengguna"
                  value={tempRoleFilter}
                  optionsString={roleOptions}
                  onChange={setTempRoleFilter}
                />
                <SelectFilter
                  label="Status"
                  id="status"
                  placeholder="Pilih Status"
                  value={tempStatusFilter}
                  optionsNumber={options}
                  onChange={setTempStatusFilter}
                />
              </GroupFilter>
              <Button variant="main" onClick={handleSearch}>Cari</Button>
            </div>
            <Link href="karyawan/baru">
              <Button icon={<LuPlus size={14} />} iconPosition="left" variant="default" type="submit">
                Tambah
              </Button>
            </Link>
          </div>

          {loading || loadingParams ? (
            <p className="text-center py-4">Memuat data...</p>
          ) : processedKaryawan.length === 0 ? (
            <p className="text-center py-4">Karyawan dengan nama <span className="font-bold">{searchInput}</span>  tidak ditemukan.</p>
          ) : (
            <TableKaryawan
              data={processedKaryawan}
              columns={DataHeaderPelanggan}
              key={`${currentPage}-${limit}`}
              currentPage={currentPage}
              limit={limit}
              fetchData={fetchKaryawan}
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
