"use client";
import { useState, useEffect } from "react";
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
import { apiClient } from "@shared/utils/apiClient";
import { formatDateAPI } from "@shared/utils/formatDate";
import { useParameterStore } from "@shared/utils/useParameterStore";
import * as XLSX from 'xlsx';

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

// Sample employee data - replace with actual API call
const EmployeeOptions = [
  { label: "Eko Darma", value: "eko.darma" },
  { label: "Budi Santoso", value: "budi.santoso" },
  { label: "Siti Nurhaliza", value: "siti.nurhaliza" },
  { label: "Ahmad Wijaya", value: "ahmad.wijaya" },
  { label: "Maya Sari", value: "maya.sari" },
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

  // Detail state
  const [selectedEmployee, setSelectedEmployee] = useState<string>("");
  const [tempSelectedEmployee, setTempSelectedEmployee] = useState<string>("");
  const [pdfData, setPdfData] = useState<string>("");
  const [isLoadingDetail, setIsLoadingDetail] = useState(false);
  const [showDetail, setShowDetail] = useState(false);

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

  const fetchEmployeeDetail = async (username: string, startDateParam?: Date, endDateParam?: Date) => {
    const effectiveStartDate = startDateParam || startDate;
    const effectiveEndDate = endDateParam || endDate;
    
    if (!username || !effectiveStartDate || !effectiveEndDate) {
      console.log("Missing parameters:", { username, effectiveStartDate, effectiveEndDate });
      return;
    }
    
    setIsLoadingDetail(true);
    try {
      const url = `https://murafly.my.id/report/kinerja/detail?username=${username}&type=pdf&startDate=${formatDateAPI(effectiveStartDate)}&endDate=${formatDateAPI(effectiveEndDate)}`;
      console.log("Fetching employee detail:", url);
      
      const result = await apiClient(url);
      
      if (result.status === "success" && result.data) {
        setPdfData(result.data);
        setShowDetail(true);
        console.log("PDF data received successfully");
      } else {
        console.error("No PDF data received", result);
        setPdfData("");
        setShowDetail(false);
      }
    } catch (error) {
      console.error("Error fetching employee detail:", error);
      setPdfData("");
      setShowDetail(false);
    } finally {
      setIsLoadingDetail(false);
    }
  };

  const handleExportData = async () => {
    setIsExporting(true);
    try {
      let url = `/report/inquiry?search=${searchQuery}`;
      if (statusFilter) url += `&status=${statusFilter}`;
      if (branchFilter) url += `&branchId=${branchFilter}`;
      if (startDate) url += `&startDate=${formatDateAPI(startDate)}`;
      if (endDate) url += `&endDate=${formatDateAPI(endDate)}`;

      const result = await apiClient(url);
      
      if (result.status === "success" && result.data) {
        const base64Data = result.data;
        const binaryString = atob(base64Data);
        const bytes = new Uint8Array(binaryString.length);
        
        for (let i = 0; i < binaryString.length; i++) {
          bytes[i] = binaryString.charCodeAt(i);
        }
        
        const blob = new Blob([bytes], { 
          type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' 
        });
        
        const timestamp = new Date().toISOString().split('T')[0];
        const filename = `inquiry_transaksi_${timestamp}.xlsx`;
        
        const downloadUrl = window.URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = downloadUrl;
        link.download = filename;
        document.body.appendChild(link);
        link.click();
        
        document.body.removeChild(link);
        window.URL.revokeObjectURL(downloadUrl);
        
      } else {
        console.error("No data received from server");
      }

    } catch (error) {
      console.error("Error exporting data:", error);
    } finally {
      setIsExporting(false);
    }
  };

  useEffect(() => {
    fetchInquiryTransaksi();
  }, [searchQuery, statusFilter, branchFilter, currentPage, limit, startDate, endDate]);

  useEffect(() => {
    // Hanya fetch jika data berubah dari useEffect, bukan dari handleApplyFilters
    if (selectedEmployee && startDate && endDate) {
      // Delay sedikit untuk memastikan state sudah ter-update
      const timeoutId = setTimeout(() => {
        fetchEmployeeDetail(selectedEmployee);
      }, 100);
      
      return () => clearTimeout(timeoutId);
    } else {
      // Reset detail jika salah satu parameter hilang
      setPdfData("");
      setShowDetail(false);
    }
  }, [selectedEmployee, startDate, endDate]);

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
    setSelectedEmployee(tempSelectedEmployee);
    setCurrentPage(1);
    
    // Langsung fetch detail jika karyawan dan tanggal sudah dipilih
    if (tempSelectedEmployee && tempStartDate && tempEndDate) {
      console.log("Fetching detail for:", tempSelectedEmployee);
      fetchEmployeeDetail(tempSelectedEmployee, tempStartDate, tempEndDate);
    } else if (tempSelectedEmployee && (!tempStartDate || !tempEndDate)) {
      // Jika karyawan dipilih tapi tanggal belum, reset detail
      setPdfData("");
      setShowDetail(false);
    } else if (!tempSelectedEmployee) {
      // Jika tidak ada karyawan yang dipilih, sembunyikan detail
      setPdfData("");
      setShowDetail(false);
    }
  };

  const handleResetFilters = () => {
    setTempStatus(0);
    setTempBranch("");
    setTempStartDate(undefined);
    setTempEndDate(undefined);
    setTempSelectedEmployee("");
    
    // Reset juga state aktif untuk detail
    setSelectedEmployee("");
    setPdfData("");
    setShowDetail(false);
  };

  const handleCancelFilters = () => {
    setTempStatus(statusFilter);
    setTempBranch(branchFilter);
    setTempStartDate(startDate);
    setTempEndDate(endDate);
    setTempSelectedEmployee(selectedEmployee);
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
                <SelectFilter
                  label="Detail Karyawan"
                  id="employee"
                  placeholder="Pilih Karyawan"
                  value={tempSelectedEmployee}
                  optionsString={EmployeeOptions}
                  onChange={setTempSelectedEmployee}
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

          {/* Employee Detail Section */}
          {selectedEmployee && (
            <div className="border rounded-lg p-4 bg-gray-50">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold">
                  Detail Kinerja: {EmployeeOptions.find(emp => emp.value === selectedEmployee)?.label}
                  {startDate && endDate && (
                    <span className="text-sm font-normal text-gray-600 ml-2">
                      ({formatDateAPI(startDate)} - {formatDateAPI(endDate)})
                    </span>
                  )}
                </h3>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => {
                    setSelectedEmployee("");
                    setTempSelectedEmployee("");
                    setShowDetail(false);
                    setPdfData("");
                  }}
                >
                  <IoClose size={16} />
                  Tutup
                </Button>
              </div>
              
              {isLoadingDetail ? (
                <div className="flex items-center justify-center h-40">
                  <div className="text-center">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-2"></div>
                    <p className="text-gray-600">Memuat detail kinerja...</p>
                  </div>
                </div>
              ) : showDetail && pdfData ? (
                <div className="w-full h-[600px] border rounded bg-white">
                  <iframe
                    src={`data:application/pdf;base64,${pdfData}`}
                    width="100%"
                    height="100%"
                    style={{ border: 'none' }}
                    title={`Detail Kinerja ${EmployeeOptions.find(emp => emp.value === selectedEmployee)?.label}`}
                  />
                </div>
              ) : selectedEmployee && !startDate ? (
                <div className="flex items-center justify-center h-40">
                  <p className="text-amber-600 bg-amber-50 px-4 py-2 rounded">
                    ⚠️ Silakan pilih tanggal awal untuk melihat detail kinerja
                  </p>
                </div>
              ) : selectedEmployee && !endDate ? (
                <div className="flex items-center justify-center h-40">
                  <p className="text-amber-600 bg-amber-50 px-4 py-2 rounded">
                    ⚠️ Silakan pilih tanggal akhir untuk melihat detail kinerja
                  </p>
                </div>
              ) : (
                <div className="flex items-center justify-center h-40">
                  <p className="text-red-600 bg-red-50 px-4 py-2 rounded">
                    ❌ Gagal memuat detail kinerja. Silakan coba lagi.
                  </p>
                </div>
              )}
            </div>
          )}

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