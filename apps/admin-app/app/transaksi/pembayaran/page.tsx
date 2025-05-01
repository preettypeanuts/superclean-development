"use client";
import Link from "next/link";
import { useEffect, useState } from "react";
import { PembayaranTable } from "libs/ui-components/src/components/pembayaran-table";
import { DatePicker } from "libs/ui-components/src/components/date-picker";
import { Header } from "@shared/components/Header";
import { Wrapper } from "libs/shared/src/components/Wrapper";
import { Input } from "libs/ui-components/src/components/ui/input";
import { Button } from "libs/ui-components/src/components/ui/button";
import { FilterStatus } from "@superclean-workspace/ui-components/components/filter-status";
import { FilterBranch } from "@superclean-workspace/ui-components/components/filter-branch";
import { LuPlus } from "react-icons/lu";
import { Search } from "lucide-react";
import { SelectData } from "libs/ui-components/src/components/select-data";
import { PaginationNumber } from "libs/ui-components/src/components/pagination-number";
import { Label } from "@ui-components/components/ui/label";
import { IoClose } from "react-icons/io5";
import { apiClient } from "libs/utils/apiClient";
import { formatDateAPI } from "libs/utils/formatDate";
import { useParameterStore } from "libs/utils/useParameterStore";
import { TrxStatusLabel } from "@shared/data/system";

const DataHeaderPembayaran = [
  { key: "id", label: "#" },
  { key: "trxNumber", label: "No Transaksi" },
  { key: "customerName", label: "Nama Pelanggan" },
  { key: "noWhatsapp", label: "No. Whatsapp" },
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
}

const trxStatusOptions = [
  { value: "", label: "Semua" },
  ...Object.entries(TrxStatusLabel).map(([key, label]) => ({
    value: key,
    label
  }))
];

export default function PembayaranPage() {
  const [dataPembayaran, setDataPembayaran] = useState<Pembayaran[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [totalData, setTotalData] = useState<number>(0);
  const [limit, setLimit] = useState<number>(10);
  const [searchQuery, setSearchQuery] = useState("");
  const [searchInput, setSearchInput] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("");
  const [branchFilter, setBranchFilter] = useState<string>("");
  const [startDate, setStartDate] = useState<Date | undefined>();
  const [endDate, setEndDate] = useState<Date | undefined>();

  const { branchMapping, loading: loadingParams } = useParameterStore();
  const totalPages = Math.max(1, Math.ceil(totalData / limit));

  const fetchPembayaran = async () => {
    setLoading(true);
    try {
      let url = `/transaction/page/settlement?search=${searchQuery}&page=${currentPage}&limit=${limit}`;

      if (statusFilter !== "") {
        url += `&status=${statusFilter}`;
      }

      if (branchFilter !== "") {
        url += `&branchId=${branchFilter}`;
      }

      if (startDate) {
        url += `&startDate=${formatDateAPI(startDate)}`;
      }

      if (endDate) {
        url += `&endDate=${formatDateAPI(endDate)}`;
      }

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

  const processedData = dataPembayaran.map((item) => ({
    ...item,
    branchId: branchMapping[item.branchId] || "Tidak Diketahui",
  }));

  return (
    <Wrapper>
      <Header label="Daftar Pembayaran" count={totalData} />
      <div className="flex-grow space-y-4">
        <div className="flex items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            <div className="relative">
              <Input
                type="text"
                placeholder="No Transaksi, Nama Pelanggan, No. Whatsapp"
                value={searchInput}
                onChange={(e) => setSearchInput(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter") handleSearch();
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

            <FilterBranch
              branchFilter={branchFilter}
              setBranchFilter={setBranchFilter}
            />
            <FilterStatus
              placeholder="Status Transaksi"
              value={statusFilter}
              onChange={setStatusFilter}
              options={trxStatusOptions}
            />
            <Button variant="secondary" onClick={handleSearch}>
              Cari
            </Button>
          </div>
          <Link href="pembayaran/baru">
            <Button
              icon={<LuPlus size={16} />}
              className="pl-2 pr-4"
              iconPosition="left"
              variant="default"
              type="submit"
            >
              Tambah
            </Button>
          </Link>
        </div>

        <div className="space-x-2 flex">
          <DatePicker
            label="Tanggal awal"
            value={startDate}
            onChange={(date) => {
              setStartDate(date);
              setCurrentPage(1);
            }}
          />
          <DatePicker
            label="Tanggal akhir"
            value={endDate}
            onChange={(date) => {
              setEndDate(date);
              setCurrentPage(1);
            }}
          />
        </div>

        {loading || loadingParams ? (
          <p className="text-center py-4">Memuat data...</p>
        ) : dataPembayaran.length === 0 ? (
          <p className="text-center py-4">
            Pembayaran tidak ditemukan.
          </p>
        ) : (
          <PembayaranTable
            data={processedData}
            columns={DataHeaderPembayaran}
            key={`${currentPage}-${limit}`}
            currentPage={currentPage}
            limit={limit}
            fetchData={() => {}}
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
  );
}
