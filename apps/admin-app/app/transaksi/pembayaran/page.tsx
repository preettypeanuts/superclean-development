"use client";
import Link from "next/link";
import { useEffect, useState } from "react";
import { PembayaranTable } from "libs/ui-components/src/components/pembayaran-table";
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

const DataHeaderSettlement = [
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

const SettlementStatus = [
  { label: "Draft", value: 0 },
  { label: "Pending", value: 1 },
  { label: "Batal", value: 2 },
  { label: "Menunggu Bayar", value: 3 },
  { label: "Sudah Bayar", value: 4 },
  { label: "Selesai", value: 5 },
];

export default function SettlementPage() {
  interface SettlementData {
    id: string;
    trxNumber: string;
    noWhatsapp: string;
    customerId: string;
    customerName: string;
    branchId: string;
    finalPrice: number;
    trxDate: string;
    status: number;
    createdBy: string;
    createdAt: string;
    city: string;
    address: string;
    province: string;
    district: string;
    subDistrict: string;
  }

  const [dataSettlement, setDataSettlement] = useState<SettlementData[]>([]);
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

  const fetchSettlement = async (reset: boolean = false) => {
    let page = currentPage.page;
    let search = searchQuery;
    let status = statusFilter;
    let branch = branchFilter;
    let start = startDate;
    let end = endDate;

    if (reset) {
      page = 1;
      search = tempSearchQuery;
      status = tempStatus;
      branch = tempBranch;
      start = tempStartDate;
      end = tempEndDate;

      setCurrentPage({
        page: page,
        reset: true
      })
      setSearchQuery(tempSearchQuery)
      setStatusFilter(tempStatus)
      setBranchFilter(tempBranch)
      setStartDate(tempStartDate)
      setEndDate(tempEndDate)
    }

    setLoading(true);
    try {
      let url = `/transaction/page/settlement?search=${search}&page=${page}&limit=${limit}`;
      if (status) url += `&status=${status}`;
      if (branch) url += `&branchId=${branch}`;
      if (start) url += `&startDate=${formatDateAPI(start)}`;
      if (end) url += `&endDate=${formatDateAPI(end)}`;

      const result = await apiClient(url);
      setDataSettlement(result.data[0] || []);
      setTotalData(result.data[1] || 0);
    } catch (err) {
      console.error("Error fetching settlement data:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (currentPage.reset) return;
    fetchSettlement();
  }, [
    // searchQuery,
    // statusFilter,
    // branchFilter,
    currentPage,
    limit,
    // startDate,
    // endDate
  ]);

  const handleSearch = () => {
    fetchSettlement(true)
    // setSearchQuery(searchInput);
    // setCurrentPage(1);
  };

  const resetSearch = () => {
    setTempSearchQuery("");
    setSearchQuery("");
    // setCurrentPage(1);
  };

  const handleApplyFilters = () => {
    // setStatusFilter(tempStatus);
    // setBranchFilter(tempBranch);
    // setStartDate(tempStartDate);
    // setEndDate(tempEndDate);
    // setCurrentPage(1);
  };

  const handleResetFilters = () => {
    setTempStatus(0);
    setTempBranch("");
    setTempStartDate(undefined);
    setTempEndDate(undefined);
  };

  const handleCancelFilters = () => {
    // setTempStatus(statusFilter);
    // setTempBranch(branchFilter);
    // setTempStartDate(startDate);
    // setTempEndDate(endDate);
  };

  const processedSettlement = dataSettlement.map((item) => ({
    ...item,
    branchId: branchMapping[item.branchId] || "Tidak Diketahui",
  }));

  return (
    <>
      <Breadcrumbs label="Daftar Pembayaran" count={totalData} />
      <Wrapper>
        <div className="space-y-4">
          <div className="flex items-center justify-between gap-2">
            <div className="flex items-center gap-2">
              <div className="relative">
                <Input
                  type="text"
                  placeholder="Cari No Transaksi, Nama, No. Whatsapp"
                  value={tempSearchQuery}
                  onChange={(e) => setTempSearchQuery(e.target.value)}
                  onKeyDown={(i) => {
                    // if (i.key === "Enter") handleSearch();
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
                onApply={handleApplyFilters}
                onReset={handleResetFilters}
                onCancel={handleCancelFilters}
                hideButtons
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
                  optionsNumber={SettlementStatus}
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

            {/* <Link href="pembayaran/baru">
              <Button type="submit" icon={<LuPlus size={16} />}>
                Tambah
              </Button>
            </Link> */}
          </div>

          {loading || loadingParams ? (
            <p className="text-center py-4">Memuat data...</p>
          ) : dataSettlement.length === 0 ? (
            <p className="text-center py-4">
                Data pembayaran tidak ditemukan.
            </p>
          ) : (
            <PembayaranTable
              data={processedSettlement}
              columns={DataHeaderSettlement}
              key={`${currentPage}-${limit}`}
                  currentPage={currentPage.page}
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
            currentPage={currentPage.page}
            onPageChange={(page) => setCurrentPage({ page, reset: false })}
          />
        </div>
      </Wrapper>
    </>
  );
}
