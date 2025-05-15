"use client";
import { useEffect, useMemo, useState } from "react";
import { PembayaranTable } from "libs/ui-components/src/components/pembayaran-table";
import { DatePicker } from "libs/ui-components/src/components/date-picker";
import { Wrapper } from "libs/shared/src/components/Wrapper";
import { Input } from "libs/ui-components/src/components/ui/input";
import { Button } from "libs/ui-components/src/components/ui/button";
import { Breadcrumbs } from "@shared/components/ui/Breadcrumbs";
import { Search } from "lucide-react";
import { SelectData } from "libs/ui-components/src/components/select-data";
import { PaginationNumber } from "libs/ui-components/src/components/pagination-number";
import { Label } from "@ui-components/components/ui/label";
import { IoClose } from "react-icons/io5";
import { apiClient } from "libs/utils/apiClient";
import { formatDateAPI } from "libs/utils/formatDate";
import { useParameterStore } from "libs/utils/useParameterStore";
import { TrxStatusLabel } from "@shared/data/system";
import { GroupFilter } from "@ui-components/components/group-filter";
import { SelectFilter } from "libs/ui-components/src/components/select-filter";
import { getCitiesLabel } from "libs/utils/useLocationData";

const DataHeaderPembayaran = [
  { key: "id", label: "#" },
  { key: "trxNumber", label: "No Transaksi" },
  { key: "customerName", label: "Nama Pelanggan" },
  { key: "noWhatsapp", label: "No. Whatsapp" },
  { key: "address", label: "Alamat" },
  { key: "city", label: "Kota" },
  { key: "branchId", label: "Cabang" },
  { key: "finalPrice", label: "Nominal" },
  { key: "trxDate", label: "Tanggal Transaksi" },
  { key: "status", label: "Status" },
  { key: "menu", label: "Aksi" }
];

interface Pembayaran {
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
  address: string;
  province: string;
  city: string;
  district: string;
  subDistrict: string;
}

const trxStatusOptions = [
  { value: "semua", label: "Semua" },
  ...Object.entries(TrxStatusLabel).map(([key, label]) => ({
    value: key,
    label
  }))
];

export const PaymentStatus = [
  { label: "Menunggu Bayar", value: 3 },
  { label: "Sudah Bayar", value: 4 },
  { label: "Selesai", value: 5 },
]

export default function PembayaranPage() {
  const [dataPembayaran, setDataPembayaran] = useState<Pembayaran[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalData, setTotalData] = useState(0);
  const [limit, setLimit] = useState(10);
  const [searchQuery, setSearchQuery] = useState("");
  const [searchInput, setSearchInput] = useState("");

  // filter aktif
  const [statusFilter, setStatusFilter] = useState<number>(0);
  const [branchFilter, setBranchFilter] = useState("");
  const [startDate, setStartDate] = useState<Date>();
  const [endDate, setEndDate] = useState<Date>();

  // filter sementara
  const [tempStatus, setTempStatus] = useState<number>(0);
  const [tempBranch, setTempBranch] = useState("");
  const [tempStartDate, setTempStartDate] = useState<Date>();
  const [tempEndDate, setTempEndDate] = useState<Date>();

  const { branchMapping, loading: loadingParams } = useParameterStore();
  const totalPages = Math.max(1, Math.ceil(totalData / limit));

  const fetchPembayaran = async () => {
    setLoading(true);
    try {
      let url = `/transaction/page/settlement?search=${searchQuery}&page=${currentPage}&limit=${limit}`;

      if (statusFilter !== 0) url += `&status=${statusFilter}`;
      if (branchFilter !== "") url += `&branchId=${branchFilter}`;
      if (startDate) url += `&startDate=${formatDateAPI(startDate)}`;
      if (endDate) url += `&endDate=${formatDateAPI(endDate)}`;

      const result = await apiClient(url);
      setDataPembayaran(result.data[0] || []);
      setTotalData(result.data[1] || 0);
    } catch (error) {
      console.error("Error fetching data:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPembayaran();
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


  // Kumpulkan semua city code dari dataCustomer
  const cityCodes = useMemo(() => {
    if (!dataPembayaran) return [];

    // Ubah ke array jika hanya satu object
    const customers = Array.isArray(dataPembayaran) ? dataPembayaran : [dataPembayaran];

    // Ambil hanya field `city` dari masing-masing customer
    return customers.map((customer) => customer.city);
  }, [dataPembayaran]);

  interface LocationData {
    paramKey: string;
    paramValue: string;
  }

  // State untuk menyimpan hasil label kota setelah difetch dari API
  const [cityLabels, setCityLabels] = useState<LocationData[]>([]);

  useEffect(() => {
    const fetchCities = async () => {
      const cities = await getCitiesLabel(cityCodes);
      setCityLabels(cities);
    };
    fetchCities();
  }, [cityCodes]);

  const processedData = useMemo(() => {
    return dataPembayaran.map((item) => {
      return {
        ...item,
        branchId: branchMapping[item.branchId] || "Tidak Diketahui",
        city: cityLabels.find((cty) => cty.paramKey === item.city)?.paramValue || "Tidak Diketahui",
      };
    });
  }, [dataPembayaran, branchMapping, cityLabels]);


  return (
    <>
      <Breadcrumbs label="Daftar Pembayaran" count={totalData} />
      <Wrapper>
        <div className="flex-grow space-y-4">
          <div className="flex items-center justify-between gap-2">
            <div className="flex items-center gap-2">
              <div className="relative">
                <Input
                  type="text"
                  placeholder="No Transaksi, Nama Pelanggan, No. Whatsapp"
                  value={searchInput}
                  onChange={(e) => setSearchInput(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && handleSearch()}
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
                  optionsNumber={PaymentStatus}
                  onChange={setTempStatus}
                />
                <div className="flex items-center space-x-4">
                  <Label className="w-1/2 font-semibold capitalize">Tanggal awal</Label>
                  <DatePicker label="DD/MM/YYYY" value={tempStartDate} onChange={setTempStartDate} />
                </div>
                <div className="flex items-center space-x-4">
                  <Label className="w-1/2 font-semibold capitalize">Tanggal akhir</Label>
                  <DatePicker label="DD/MM/YYYY" value={tempEndDate} onChange={setTempEndDate} />
                </div>
              </GroupFilter>

              <Button variant="main" onClick={handleSearch}>Cari</Button>
            </div>
          </div>

          {loading || loadingParams ? (
            <p className="text-center py-4">Memuat data...</p>
          ) : dataPembayaran.length === 0 ? (
            <p className="text-center py-4">Pembayaran tidak ditemukan.</p>
          ) : (
            <PembayaranTable
              data={processedData}
              columns={DataHeaderPembayaran}
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
            <Label className="text-xs">Semua data telah ditampilkan ({totalData})</Label>
          )}

          <PaginationNumber
            totalPages={totalPages}
            currentPage={currentPage}
            onPageChange={setCurrentPage}
          />
        </div>
      </Wrapper>
    </>
  );
}
