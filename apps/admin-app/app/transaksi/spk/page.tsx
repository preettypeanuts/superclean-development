"use client";
import Link from "next/link";
import { useEffect, useState } from "react";
import { SPKTable } from "libs/ui-components/src/components/spk-table";
import { DatePicker } from "libs/ui-components/src/components/date-picker";
import { Wrapper } from "libs/shared/src/components/Wrapper";
import { Input } from "libs/ui-components/src/components/ui/input";
import { Button } from "libs/ui-components/src/components/ui/button";
import { LuPlus } from "react-icons/lu";
import { Search } from "lucide-react";
import { SelectData } from "libs/ui-components/src/components/select-data";
import { PaginationNumber } from "libs/ui-components/src/components/pagination-number";
import { Label } from "@ui-components/components/ui/label";
import { IoClose } from "react-icons/io5";
import { apiClient } from "libs/utils/apiClient";
import { formatDateAPI } from "libs/utils/formatDate";
import { useParameterStore } from "libs/utils/useParameterStore";
import { GroupFilter } from "@ui-components/components/group-filter";
import { SelectFilter } from "libs/ui-components/src/components/select-filter"
import { Breadcrumbs } from "@shared/components/ui/Breadcrumbs";

const DataHeaderSPK = [
  { key: "id", label: "#" },
  { key: "trxNumber", label: "No Transaksi" },
  { key: "customerName", label: "Nama Pelanggan" },
  { key: "noWhatsapp", label: "No. Whatsapp" },
  { key: "branchId", label: "Cabang" },
  { key: "finalPrice", label: "Nominal" },
  { key: "trxDate", label: "Tanggal Transaksi" },
  { key: "status", label: "Status" },
  { key: "menu", label: "Aksi" },
];

export const SPKStatus = [
  { label: "Baru", value: 0 },
  { label: "Proses", value: 1 },
  { label: "Batal", value: 2 },
]

export default function SPKPage() {
  interface SPKData {
    id: string;
    trxNumber: string;
    noWhatsapp: string;
    customerName: string;
    branchId: string;
    finalPrice: number;
    trxDate: string;
    status: number;
    createdBy: string;
    createdAt: string;
  }

  const [dataSPK, setDataSPK] = useState<SPKData[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalData, setTotalData] = useState(0);
  const [limit, setLimit] = useState(10);
  const [searchQuery, setSearchQuery] = useState("");
  const [searchInput, setSearchInput] = useState("");

  // filter aktif
  const [statusFilter, setStatusFilter] = useState<number>(0);
  const [branchFilter, setBranchFilter] = useState<string>("");
  const [startDate, setStartDate] = useState<Date>();
  const [endDate, setEndDate] = useState<Date>();

  // filter sementara
  const [tempStatus, setTempStatus] = useState<number>(0);
  const [tempBranch, setTempBranch] = useState<string>("");
  const [tempStartDate, setTempStartDate] = useState<Date>();
  const [tempEndDate, setTempEndDate] = useState<Date>();

  const { branchMapping, loading: loadingParams } = useParameterStore();

  const totalPages = Math.max(1, Math.ceil(totalData / limit));

  const fetchSPK = async () => {
    setLoading(true);
    try {
      let url = `/transaction/page/spk?search=${searchQuery}&page=${currentPage}&limit=${limit}`;
      if (statusFilter) url += `&status=${statusFilter}`;
      if (branchFilter) url += `&branchId=${branchFilter}`;
      if (startDate) url += `&startDate=${formatDateAPI(startDate)}`;
      if (endDate) url += `&endDate=${formatDateAPI(endDate)}`;

      const result = await apiClient(url);
      setDataSPK(result.data[0] || []);
      setTotalData(result.data[1] || 0);
    } catch (err) {
      console.error("Error fetching data:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSPK();
  }, [searchQuery, statusFilter, branchFilter, currentPage, limit, startDate, endDate]);

  const handleSearch = () => {
    setSearchQuery(searchInput);
    setCurrentPage(1);
  };

  const resetSearch = () => {
    setSearchInput("");
    setSearchQuery("");
    setCurrentPage(1);
  };

  const handleApplyFilters = () => {
    setStatusFilter(tempStatus);
    setBranchFilter(tempBranch);
    setStartDate(tempStartDate);
    setEndDate(tempEndDate);
    setCurrentPage(1);
  };

  const handleResetFilters = () => {
    setTempStatus(0);
    setTempBranch("");
    setTempStartDate(undefined);
    setTempEndDate(undefined);
  };

  const handleCancelFilters = () => {
    setTempStatus(statusFilter);
    setTempBranch(branchFilter);
    setTempStartDate(startDate);
    setTempEndDate(endDate);
  };

  const processedSPK = dataSPK.map((item) => ({
    ...item,
    branchId: branchMapping[item.branchId] || "Tidak Diketahui",
  }));

  return (
    <>
      <Breadcrumbs label="Daftar SPK" count={totalData} />
      <Wrapper>
        <div className="space-y-4">
          <div className="flex items-center justify-between gap-2">
            <div className="flex items-center gap-2">
              <div className="relative">
                <Input
                  type="text"
                  placeholder="Cari No Transaksi, Naman No. Whatsapp"
                  value={searchInput}
                  onChange={(e) => setSearchInput(e.target.value)}
                  onKeyDown={(i) => {
                    if (i.key === "Enter") handleSearch();
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
                onApply={handleApplyFilters}
                onReset={handleResetFilters}
                onCancel={handleCancelFilters}
              >
                <SelectFilter
                  label="Cabang"
                  id="branch"
                  placeholder="Pilih Cabang"
                  value={tempBranch}
                  optionsString={Object.entries(branchMapping).map(([value, label]) => ({
                    value,
                    label,
                  }))}
                  onChange={setTempBranch}
                />
                <SelectFilter
                  label="Status Transaksi"
                  id="status"
                  placeholder="Pilih Status Transaksi"
                  value={tempStatus}
                  optionsNumber={SPKStatus}
                  onChange={setTempStatus}
                />
                <div className="flex items-center space-x-4">
                  <Label className={`w-1/2 font-semibold capitalize`}>
                    Tanggal awal
                  </Label>

                  <DatePicker
                    label="DD/MM/YYYY"
                    value={tempStartDate}
                    onChange={(date) => setTempStartDate(date)}
                  />
                </div>
                <div className="flex items-center space-x-4">
                  <Label className={`w-1/2 font-semibold capitalize`}>
                    Tanggal akhir
                  </Label>
                  <DatePicker
                    label="DD/MM/YYYY"
                    value={tempEndDate}
                    onChange={(date) => setTempEndDate(date)}
                  />
                </div>
              </GroupFilter>


              <Button variant="main" onClick={handleSearch}>
                Cari
              </Button>
            </div>

            <Link href="spk/baru">
              <Button type="submit" icon={<LuPlus size={16} />}>
                Tambah
              </Button>
            </Link>
          </div>

          {loading || loadingParams ? (
            <p className="text-center py-4">Memuat data...</p>
          ) : dataSPK.length === 0 ? (
            <p className="text-center py-4">
              SPK dengan nama <span className="font-bold">{searchInput}</span> tidak ditemukan.
            </p>
          ) : (
            <SPKTable
              data={processedSPK}
              columns={DataHeaderSPK}
              key={`${currentPage}-${limit}`}
              currentPage={currentPage}
              limit={limit}
              fetchData={() => { }}
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
            currentPage={currentPage}
            onPageChange={(page) => setCurrentPage(page)}
          />
        </div>
      </Wrapper>
    </>
  );
}
