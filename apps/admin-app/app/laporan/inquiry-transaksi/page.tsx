"use client";
import { useState, useCallback, useEffect } from "react";
import { InquiryTransaksiTable } from "@ui-components/components/inquiry-transaksi-table";
import { DatePicker } from "@ui-components/components/date-picker";
import { Wrapper } from "@shared/components/Wrapper";
import { Input } from "@ui-components/components/ui/input";
import { Button } from "@ui-components/components/ui/button";
import { Breadcrumbs } from "@shared/components/ui/Breadcrumbs";
import { Search } from "lucide-react";
import { SelectData } from "@ui-components/components/select-data";
import { PaginationNumber } from "@ui-components/components/pagination-number";
import { Label } from "@ui-components/components/ui/label";
import { IoClose } from "react-icons/io5";
import { GroupFilter } from "@ui-components/components/group-filter";
import { SelectFilter } from "@ui-components/components/select-filter";
import { PiExportFill } from "react-icons/pi";
import { apiClient } from "libs/utils/apiClient";
import { formatDateAPI } from "libs/utils/formatDate";
import { useParameterStore } from "libs/utils/useParameterStore";

const columns = [
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
  { key: "menu", label: "Aksi" },
];

const TransactionStatus = [
  { label: "Draft", value: 0 },
  { label: "Pending", value: 1 },
  { label: "Menunggu Bayar", value: 3 },
  { label: "Sudah Bayar", value: 4 },
  { label: "Selesai", value: 5 },
];

export default function InquiryTransaksiPage() {
  interface TransactionData {
    id: string;
    trxNumber: string;
    customerName: string;
    noWhatsapp: string;
    address: string;
    city: string;
    branchId: string;
    finalPrice: string;
    trxDate: string;
    status: number;
    customerId?: string;
    createdBy?: string;
    createdAt?: string;
  }

  const [dataTransaksi, setDataTransaksi] = useState<TransactionData[]>([]);
  const [loading, setLoading] = useState(true);
  const [isExporting, setIsExporting] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalData, setTotalData] = useState(0);
  const [limit, setLimit] = useState(10);
  const [searchQuery, setSearchQuery] = useState("");
  const [searchInput, setSearchInput] = useState("");

  // Filter aktif
  const [statusFilter, setStatusFilter] = useState<number>(0);
  const [branchFilter, setBranchFilter] = useState<string>("");
  const [startDate, setStartDate] = useState<Date>();
  const [endDate, setEndDate] = useState<Date>();

  // Filter sementara
  const [tempStatus, setTempStatus] = useState<number>(0);
  const [tempBranch, setTempBranch] = useState<string>("");
  const [tempStartDate, setTempStartDate] = useState<Date>();
  const [tempEndDate, setTempEndDate] = useState<Date>();

  const { branchMapping, loading: loadingParams } = useParameterStore();

  const totalPages = Math.max(1, Math.ceil(totalData / limit));

  const fetchInquiryTransaksi = async () => {
    setLoading(true);
    try {
      let url = `/transaction/page?search=${searchQuery}&page=${currentPage}&limit=${limit}`;
      if (statusFilter) url += `&status=${statusFilter}`;
      if (branchFilter) url += `&branchId=${branchFilter}`;
      if (startDate) url += `&startDate=${formatDateAPI(startDate)}`;
      if (endDate) url += `&endDate=${formatDateAPI(endDate)}`;

      const result = await apiClient(url);
      setDataTransaksi(result.data[0] || []);
      setTotalData(result.data[1] || 0);
    } catch (err) {
      console.error("Error fetching transaction data:", err);
      setDataTransaksi([]);
      setTotalData(0);
    } finally {
      setLoading(false);
    }
  };

  const handleExportData = async () => {
    setIsExporting(true);
    try {
      let url = `/transaction/page?search=${searchQuery}&page=1&limit=999999`;
      if (statusFilter) url += `&status=${statusFilter}`;
      if (branchFilter) url += `&branchId=${branchFilter}`;
      if (startDate) url += `&startDate=${formatDateAPI(startDate)}`;
      if (endDate) url += `&endDate=${formatDateAPI(endDate)}`;

      const result = await apiClient(url);
      const exportData = result.data[0] || [];

      // Status labels untuk export
      const statusLabels: Record<number, string> = {
        0: "Draft",
        1: "Pending",
        3: "Menunggu Bayar",
        4: "Sudah Bayar",
        5: "Selesai",
      };

      // Convert to CSV format
      const csvHeader = [
        'No',
        'No Transaksi',
        'Nama Pelanggan',
        'No. WhatsApp',
        'Alamat',
        'Kota',
        'Cabang',
        'Nominal',
        'Tanggal Transaksi',
        'Status',
        'Dibuat Oleh',
        'Tanggal Dibuat'
      ].join(',');

      const csvRows = exportData.map((item: TransactionData, index: number) => [
        index + 1,
        item.trxNumber,
        `"${item.customerName}"`,
        item.noWhatsapp,
        `"${item.address}"`,
        item.city,
        branchMapping[item.branchId] || item.branchId,
        item.finalPrice,
        new Date(item.trxDate).toLocaleDateString('id-ID'),
        statusLabels[item.status] || `Status ${item.status}`,
        item.createdBy || '',
        item.createdAt ? new Date(item.createdAt).toLocaleDateString('id-ID') : ''
      ].join(','));

      const csvContent = [csvHeader, ...csvRows].join('\n');
      const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });

      // Create download link
      const url2 = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url2;

      // Generate filename dengan timestamp
      const timestamp = new Date().toISOString().split('T')[0];
      link.setAttribute('download', `inquiry_transaksi_${timestamp}.csv`);

      document.body.appendChild(link);
      link.click();
      link.remove();
      window.URL.revokeObjectURL(url2);

    } catch (error) {
      console.error("Error exporting data:", error);
    } finally {
      setIsExporting(false);
    }
  };

  useEffect(() => {
    fetchInquiryTransaksi();
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

  const processedTransaksi = dataTransaksi.map((item) => ({
    ...item,
    branchId: branchMapping[item.branchId] || "Tidak Diketahui",
  }));

  return (
    <>
      <Breadcrumbs label="Inquiry Transaksi" count={totalData} />
      <Wrapper>
        <div className="space-y-4">
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
                  placeholder="Pilih Status"
                  value={tempStatus}
                  optionsNumber={TransactionStatus}
                  onChange={setTempStatus}
                />
                <div className="flex items-center space-x-4">
                  <Label className="w-1/2 font-semibold capitalize">Tanggal awal</Label>
                  <DatePicker
                    label="DD/MM/YYYY"
                    value={tempStartDate}
                    onChange={(date) => setTempStartDate(date)}
                  />
                </div>
                <div className="flex items-center space-x-4">
                  <Label className="w-1/2 font-semibold capitalize">Tanggal akhir</Label>
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

            <Button
              type="button"
              icon={<PiExportFill size={16} />}
              onClick={handleExportData}
              disabled={isExporting || dataTransaksi.length === 0}
            >
              {isExporting ? "Mengekspor..." : "Ekspor Data"}
            </Button>
          </div>

          {loading || loadingParams ? (
            <p className="text-center py-4">Memuat data...</p>
          ) : dataTransaksi.length === 0 ? (
            <p className="text-center py-4">
              Transaksi dengan kata kunci <span className="font-bold">{searchInput}</span> tidak ditemukan.
            </p>
          ) : (
            <InquiryTransaksiTable
              data={processedTransaksi}
              columns={columns}
              key={`${currentPage}-${limit}`}
              currentPage={currentPage}
              limit={limit}
              fetchData={fetchInquiryTransaksi}
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