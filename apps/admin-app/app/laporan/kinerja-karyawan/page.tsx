"use client";
import KaryawanSelect from "@ui-components/components/karyawan-select";
import { useState } from "react";
import { DatePicker } from "@ui-components/components/date-picker";
import { Wrapper } from "@shared/components/Wrapper";
import { Button } from "@ui-components/components/ui/button";
import { Breadcrumbs } from "@shared/components/ui/Breadcrumbs";
import { Label } from "@ui-components/components/ui/label";
import { IoClose } from "react-icons/io5";
import { GroupFilter } from "@ui-components/components/group-filter";
import { SelectFilter } from "@ui-components/components/select-filter";
import { FaFileExcel, FaFilePdf } from "react-icons/fa6";
import { RadioGroup, RadioGroupItem } from "@ui-components/components/ui/radio-group";
import { useParameterStore } from "@shared/utils/useParameterStore";
import { apiClient } from "@shared/utils/apiClient";
import { formatDateAPI } from "@shared/utils/formatDate";

export default function KinerjaKaryawanPage() {
  const [reportType, setReportType] = useState<"ringkasan" | "detail">("ringkasan");

  const { roleMapping, branchMapping } = useParameterStore();

  // filter aktif
  const [statusFilter, setStatusFilter] = useState<number>(0);
  const [branchFilter, setBranchFilter] = useState<string>("");
  const [roleFilter, setRoleFilter] = useState<string>("");
  const [selectedKaryawan, setSelectedKaryawan] = useState<string>("");
  const [startDate, setStartDate] = useState<Date>();
  const [endDate, setEndDate] = useState<Date>();

  // filter sementara
  const [tempStatus, setTempStatus] = useState<number>(0);
  const [tempBranch, setTempBranch] = useState<string>("all");
  const [tempRole, setTempRole] = useState<string>("all");
  const [tempSelectedKaryawan, setTempSelectedKaryawan] = useState<string>("");
  const [tempStartDate, setTempStartDate] = useState<Date>();
  const [tempEndDate, setTempEndDate] = useState<Date>();

  // PDF Detail state
  const [pdfData, setPdfData] = useState<string>("");
  const [isLoadingDetail, setIsLoadingDetail] = useState(false);
  const [showDetail, setShowDetail] = useState(false);
  const [selectedKaryawanUsername, setSelectedKaryawanUsername] = useState<string>("");
  const [selectedKaryawanName, setSelectedKaryawanName] = useState<string>("");
  const [errorMessage, setErrorMessage] = useState<string>("");

  interface Karyawan {
    id: string;
    username: string;
    fullname: string;
  }

  // Get username from karyawan list
  const getKaryawanUsername = async (karyawanId: string) => {
    if (!karyawanId) return null;
    
    try {
      const url = `/user/page?page=1&limit=999`;
      
      const result = await apiClient(url);
      
      if (result.status === "success" && result.data) {
        const karyawanList = result.data[0] || [];
        const karyawan = karyawanList.find((k: Karyawan) => k.id === karyawanId);
        
        if (karyawan) {
          return {
            username: karyawan.username,
            fullname: karyawan.fullname
          };
        }
      }
      return null;
    } catch (error) {
      console.error("Error fetching karyawan username:", error);
      return null;
    }
  };

  // Fetch PDF detail
  const fetchPDFDetail = async (username: string, startDate: Date, endDate: Date) => {
    setIsLoadingDetail(true);
    setErrorMessage(""); // Reset error message
    
    try {
      const url = `/report/kinerja/detail?username=${username}&type=pdf&startDate=${formatDateAPI(startDate)}&endDate=${formatDateAPI(endDate)}`;
      console.log("Fetching PDF:", url);
      
      const result = await apiClient(url);
      
      if (result.status === "success" && result.data) {
        setPdfData(result.data);
        setShowDetail(true);
        console.log("PDF berhasil dimuat");
      } else {
        console.error("Gagal mengambil data PDF", result);
        setPdfData("");
        setShowDetail(false);
        
        // Handle specific error cases
        if (result.statusCode === 500 && result.message) {
          setErrorMessage(result.message);
        } else {
          setErrorMessage("Gagal mengambil data PDF. Silakan coba lagi.");
        }
      }
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error: any) {
      console.error("Error fetching PDF:", error);
      setPdfData("");
      setShowDetail(false);
      
      // Handle error responses
      if (error?.response?.data?.statusCode === 500) {
        setErrorMessage(error.response.data.message || "Tidak ada transaksi yang ditemukan dengan filter yang diberikan.");
      } else if (error?.message?.includes("500") || error?.message?.includes("Tidak ada transaksi")) {
        setErrorMessage("Tidak ada transaksi yang ditemukan dengan filter yang diberikan.");
      } else {
        setErrorMessage("Terjadi kesalahan saat mengambil data. Silakan coba lagi.");
      }
    } finally {
      setIsLoadingDetail(false);
    }
  };

  const handleApplyFilters = async () => {
    setStatusFilter(tempStatus);
    setBranchFilter(tempBranch === "all" ? "" : tempBranch);
    setRoleFilter(tempRole === "all" ? "" : tempRole);
    setSelectedKaryawan(tempSelectedKaryawan);
    setStartDate(tempStartDate);
    setEndDate(tempEndDate);

    // Reset error message at the start
    setErrorMessage("");

    // Jika mode detail dan semua data lengkap, fetch PDF
    if (reportType === "detail" && tempSelectedKaryawan && tempStartDate && tempEndDate) {
      console.log("Mencari username untuk karyawan ID:", tempSelectedKaryawan);
      
      const karyawanData = await getKaryawanUsername(tempSelectedKaryawan);
      
      if (karyawanData && karyawanData.username) {
        console.log("Username ditemukan:", karyawanData.username);
        setSelectedKaryawanUsername(karyawanData.username);
        setSelectedKaryawanName(karyawanData.fullname);
        await fetchPDFDetail(karyawanData.username, tempStartDate, tempEndDate);
      } else {
        console.error("Username tidak ditemukan untuk karyawan ID:", tempSelectedKaryawan);
        setErrorMessage("Gagal mengambil data karyawan. Silakan coba lagi.");
      }
    } else {
      // Reset jika kondisi tidak terpenuhi
      setPdfData("");
      setShowDetail(false);
      setSelectedKaryawanUsername("");
      setSelectedKaryawanName("");
    }
  };

  const handleResetFilters = () => {
    setTempStatus(0);
    setTempBranch("all");
    setTempRole("all");
    setTempSelectedKaryawan("");
    setTempStartDate(undefined);
    setTempEndDate(undefined);
    
    // Reset PDF detail
    setSelectedKaryawan("");
    setPdfData("");
    setShowDetail(false);
    setSelectedKaryawanUsername("");
    setSelectedKaryawanName("");
    setErrorMessage("");
  };

  const handleCancelFilters = () => {
    setTempStatus(statusFilter);
    setTempBranch(branchFilter || "all");
    setTempRole(roleFilter || "all");
    setTempSelectedKaryawan(selectedKaryawan);
    setTempStartDate(startDate);
    setTempEndDate(endDate);
  };

  // Reset karyawan selection when switching to ringkasan
  const handleReportTypeChange = (value: "ringkasan" | "detail") => {
    setReportType(value);
    if (value === "ringkasan") {
      setSelectedKaryawan("");
      setTempSelectedKaryawan("");
      setPdfData("");
      setShowDetail(false);
      setSelectedKaryawanUsername("");
      setSelectedKaryawanName("");
      setErrorMessage("");
    }
  };

  const handleExportPDF = async () => {
    if (selectedKaryawanUsername && startDate && endDate) {
      try {
        const url = `/report/kinerja/detail?username=${selectedKaryawanUsername}&type=pdf&startDate=${formatDateAPI(startDate)}&endDate=${formatDateAPI(endDate)}`;
        const result = await apiClient(url);
        
        if (result.status === "success" && result.data) {
          const base64Data = result.data;
          const binaryString = atob(base64Data);
          const bytes = new Uint8Array(binaryString.length);
          
          for (let i = 0; i < binaryString.length; i++) {
            bytes[i] = binaryString.charCodeAt(i);
          }
          
          const blob = new Blob([bytes], { type: 'application/pdf' });
          const timestamp = new Date().toISOString().split('T')[0];
          const filename = `kinerja_${selectedKaryawanUsername}_${timestamp}.pdf`;
          
          const downloadUrl = window.URL.createObjectURL(blob);
          const link = document.createElement('a');
          link.href = downloadUrl;
          link.download = filename;
          document.body.appendChild(link);
          link.click();
          
          document.body.removeChild(link);
          window.URL.revokeObjectURL(downloadUrl);
        }
      } catch (error) {
        console.error("Error exporting PDF:", error);
      }
    }
  };

  const handleExportExcel = async () => {
    if (selectedKaryawanUsername && startDate && endDate) {
      try {
        const url = `/report/kinerja/detail?username=${selectedKaryawanUsername}&type=excel&startDate=${formatDateAPI(startDate)}&endDate=${formatDateAPI(endDate)}`;
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
          const filename = `kinerja_${selectedKaryawanUsername}_${timestamp}.xlsx`;
          
          const downloadUrl = window.URL.createObjectURL(blob);
          const link = document.createElement('a');
          link.href = downloadUrl;
          link.download = filename;
          document.body.appendChild(link);
          link.click();
          
          document.body.removeChild(link);
          window.URL.revokeObjectURL(downloadUrl);
        }
      } catch (error) {
        console.error("Error exporting Excel:", error);
      }
    }
  };

  return (
    <>
      <Breadcrumbs label="Kinerja Karyawan" />
      <Wrapper>
        <div className="flex-grow space-y-4">
          <div className="flex items-center justify-between gap-2">
            <div className="flex items-center gap-2">
              <div className="relative">
                <div className="flex items-center space-x-4 min-w-[200px]">
                  <RadioGroup
                    value={reportType}
                    onValueChange={handleReportTypeChange}
                    className="flex items-center gap-5"
                  >
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="ringkasan" id="ringkasan" />
                      <Label className="w-1/2 capitalize" htmlFor="ringkasan">Ringkasan</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="detail" id="detail" />
                      <Label className="w-1/2 capitalize" htmlFor="detail">Detail</Label>
                    </div>
                  </RadioGroup>
                </div>
              </div>

              <GroupFilter
                onApply={handleApplyFilters}
                onReset={handleResetFilters}
                onCancel={handleCancelFilters}
              >
                {/* KaryawanSelect hanya tampil jika reportType adalah "detail" */}
                {reportType === "detail" ? (
                  <KaryawanSelect
                    label="Pilih Karyawan"
                    value={tempSelectedKaryawan}
                    onChange={setTempSelectedKaryawan}
                    statusFilter={tempStatus || 1}
                    branchFilter={tempBranch === "all" ? "" : tempBranch}
                    roleFilter={tempRole === "all" ? "" : tempRole}
                    className="mb-4"
                    placeholder="Pilih karyawan untuk laporan detail"
                  />
                ) : (
                  <>
                    <SelectFilter
                      label="Akses Pengguna"
                      id="role"
                      placeholder="Pilih Role"
                      value={tempRole || "all"}
                      optionsString={[
                        { label: "Semua Role", value: "all" },
                        ...Object.entries(roleMapping || {})
                          .filter(([value]) => value && value.trim() !== "")
                          .map(([value, label]) => ({
                            value,
                            label,
                          }))
                      ]}
                      onChange={(value) => setTempRole(value === "all" ? "" : value)}
                    />

                    <SelectFilter
                      label="Cabang"
                      id="branch"
                      placeholder="Pilih Cabang"
                      value={tempBranch || "all"}
                      optionsString={[
                        { label: "Semua Cabang", value: "all" },
                        ...Object.entries(branchMapping || {})
                          .filter(([value]) => value && value.trim() !== "")
                          .map(([value, label]) => ({
                            value,
                            label,
                          }))
                      ]}
                      onChange={(value) => setTempBranch(value === "all" ? "" : value)}
                    />
                  </>
                )}

                <div className="flex items-center space-x-4">
                  <Label className="w-1/2 font-semibold capitalize">
                    Tanggal awal
                  </Label>
                  <DatePicker
                    label="DD/MM/YYYY"
                    value={tempStartDate}
                    onChange={(date) => setTempStartDate(date)}
                  />
                </div>

                <div className="flex items-center space-x-4">
                  <Label className="w-1/2 font-semibold capitalize">
                    Tanggal akhir
                  </Label>
                  <DatePicker
                    label="DD/MM/YYYY"
                    value={tempEndDate}
                    onChange={(date) => setTempEndDate(date)}
                  />
                </div>
              </GroupFilter>

              <Button variant="main" onClick={handleApplyFilters}>Cari</Button>
            </div>
            
            <div className="space-x-2">
              <Button 
                type="button" 
                variant="main"
                onClick={handleExportPDF}
                disabled={reportType === "detail" && (!selectedKaryawanUsername || !startDate || !endDate)}
              >
                <FaFilePdf />
                Ekspor PDF
              </Button>
              <Button 
                type="button"
                onClick={handleExportExcel}
                disabled={reportType === "detail" && (!selectedKaryawanUsername || !startDate || !endDate)}
              >
                <FaFileExcel size={16} />
                Ekspor Data Excel
              </Button>
            </div>
          </div>

          {/* PDF Display Section - hanya untuk mode detail */}
          {reportType === "detail" && selectedKaryawan && selectedKaryawanName && (
            <div className="border rounded-lg p-4 bg-gray-50">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold">
                  Detail Kinerja: {selectedKaryawanName}
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
                    setSelectedKaryawan("");
                    setTempSelectedKaryawan("");
                    setShowDetail(false);
                    setPdfData("");
                    setSelectedKaryawanUsername("");
                    setSelectedKaryawanName("");
                    setErrorMessage("");
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
                <div className="w-full h-[700px] border rounded bg-white">
                  <iframe
                    src={`data:application/pdf;base64,${pdfData}`}
                    width="100%"
                    height="100%"
                    style={{ border: 'none' }}
                    title={`Detail Kinerja ${selectedKaryawanName}`}
                  />
                </div>
              ) : errorMessage ? (
                <div className="flex items-center justify-center h-40">
                  <div className="text-center max-w-md">
                    <div className="text-orange-600 bg-orange-50 px-4 py-3 rounded-lg">
                      <p className="font-medium text-orange-800 mb-1">📊 Data Tidak Tersedia</p>
                      <p className="text-sm text-orange-700">{errorMessage}</p>
                      <p className="text-xs text-orange-600 mt-2">
                        Silakan coba dengan rentang tanggal yang berbeda atau pastikan karyawan memiliki transaksi pada periode tersebut.
                      </p>
                    </div>
                  </div>
                </div>
              ) : selectedKaryawan && !startDate ? (
                <div className="flex items-center justify-center h-40">
                  <p className="text-amber-600 bg-amber-50 px-4 py-2 rounded">
                    ⚠️ Silakan pilih tanggal awal untuk melihat detail kinerja
                  </p>
                </div>
              ) : selectedKaryawan && !endDate ? (
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

          {/* Default Content */}
          {!showDetail && (
            <div className="text-center text-muted-foreground text-sm py-7 my-3 border-y">
              {reportType === "ringkasan"
                ? "API Ringkasan belum ready - silakan gunakan mode Detail"
                : selectedKaryawan
                  ? `Silakan klik tombol "Cari" untuk melihat detail kinerja`
                  : "Pilih karyawan dan tanggal, lalu klik 'Cari' untuk melihat laporan detail"
              }
            </div>
          )}
        </div>
      </Wrapper>
    </>
  );
}