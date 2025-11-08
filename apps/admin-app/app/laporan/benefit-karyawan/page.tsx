'use client';
import { Breadcrumbs } from '@shared/components/ui/Breadcrumbs';
import { Wrapper } from '@shared/components/Wrapper';
import { apiClient } from '@shared/utils/apiClient';
import { formatDateAPI } from '@shared/utils/formatDate';
import { useParameterStore } from '@shared/utils/useParameterStore';
import { DatePicker } from '@ui-components/components/date-picker';
import { GroupFilter } from '@ui-components/components/group-filter';
import KaryawanSelect from '@ui-components/components/karyawan-select';
import { SelectFilter } from '@ui-components/components/select-filter';
import { Button } from '@ui-components/components/ui/button';
import { Label } from '@ui-components/components/ui/label';
import {
  RadioGroup,
  RadioGroupItem,
} from '@ui-components/components/ui/radio-group';
import { useState } from 'react';
import { FaFileExcel, FaFilePdf } from 'react-icons/fa6';
import { IoClose } from 'react-icons/io5';

export default function BenefitKaryawanPage() {
  const [reportType, setReportType] = useState<'absensi' | 'tip'>('absensi');

  const { branchMapping } = useParameterStore();

  // filter aktif
  const [statusFilter, setStatusFilter] = useState<number>(0);
  const [branchFilter, setBranchFilter] = useState<string>('');
  const [roleFilter, setRoleFilter] = useState<string>('');
  const [selectedKaryawan, setSelectedKaryawan] = useState<string>('');
  const [startDate, setStartDate] = useState<Date>();
  const [endDate, setEndDate] = useState<Date>();

  // filter sementara
  const [tempStatus, setTempStatus] = useState<number>(0);
  const [tempBranch, setTempBranch] = useState<string>('all');
  const [tempRole, setTempRole] = useState<string>('');
  const [tempSelectedKaryawan, setTempSelectedKaryawan] = useState<string>('');
  const [tempStartDate, setTempStartDate] = useState<Date>();
  const [tempEndDate, setTempEndDate] = useState<Date>();

  // PDF Detail state
  const [pdfData, setPdfData] = useState<string>('');
  const [isLoadingDetail, setIsLoadingDetail] = useState(false);
  const [showDetail, setShowDetail] = useState(false);
  const [selectedKaryawanUsername, setSelectedKaryawanUsername] =
    useState<string>('');
  const [laporanFileName, setLaporanFileName] = useState<string>('');
  const [errorMessage, setErrorMessage] = useState<string>('');

  interface Karyawan {
    id: string;
    username: string;
    fullname: string;
  }

  // Get username from karyawan list
  const getKaryawanUsername = async (karyawanId: string) => {
    if (!karyawanId) return null;

    try {
      const url = `/user/page?roleId=CLEANER&page=1&limit=999`;

      const result = await apiClient(url);

      if (result.status === 'success' && result.data) {
        const karyawanList = result.data[0] || [];
        const karyawan = karyawanList.find(
          (k: Karyawan) => k.id === karyawanId
        );

        if (karyawan) {
          return {
            username: karyawan.username,
            fullname: karyawan.fullname,
          };
        }
      }
      return null;
    } catch (error) {
      console.error('Error fetching karyawan username:', error);
      return null;
    }
  };

  // Fetch PDF detail
  const fetchPDF = async (
    urlPdf: string,
    fileType: string,
    isExport: boolean
  ) => {
    setIsLoadingDetail(true);
    setErrorMessage(''); // Reset error message

    try {
      const result = await apiClient(`${urlPdf}&type=${fileType}`);

      if (result?.status === 'success' && result?.data) {
        setPdfData(result.data);
        if (!isExport) setShowDetail(true);
      } else {
        setPdfData('');
        setShowDetail(false);

        // Handle specific error cases
        if (result.statusCode === 500 && result.message) {
          setErrorMessage(result.message);
        } else {
          setErrorMessage('Gagal mengambil data. Silakan coba lagi.');
        }
      }
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error: any) {
      setPdfData('');
      setShowDetail(false);

      // Handle error responses
      if (error?.response?.data?.statusCode === 500) {
        setErrorMessage(
          error.response.data.message ||
            'Tidak ada transaksi yang ditemukan dengan filter yang diberikan.'
        );
      } else if (
        error?.message?.includes('500') ||
        error?.message?.includes('Tidak ada transaksi')
      ) {
        setErrorMessage(
          'Tidak ada transaksi yang ditemukan dengan filter yang diberikan.'
        );
      } else {
        setErrorMessage(
          'Terjadi kesalahan saat mengambil data. Silakan coba lagi.'
        );
      }
    } finally {
      setIsLoadingDetail(false);
    }
  };

  const handleApplyFilters = async () => {
    setStatusFilter(tempStatus);
    setBranchFilter(tempBranch === 'all' ? '' : tempBranch);
    setRoleFilter(tempRole === 'all' ? '' : tempRole);
    setSelectedKaryawan(tempSelectedKaryawan);
    setStartDate(tempStartDate);
    setEndDate(tempEndDate);

    // Reset error message at the start
    setErrorMessage('');

    // Jika mode tip dan semua data lengkap, fetch PDF
    if (
      reportType === 'tip' &&
      tempSelectedKaryawan &&
      tempStartDate &&
      tempEndDate
    ) {
      setLaporanFileName(
        `benefit_tip_${tempSelectedKaryawan}_${formatDateAPI(
          tempStartDate
        )}_to_${formatDateAPI(tempEndDate)}`
      );
      const karyawanData = await getKaryawanUsername(tempSelectedKaryawan);

      if (karyawanData?.username) {
        setSelectedKaryawanUsername(karyawanData?.username);

        const url = `/report/benefit/tip?username=${
          karyawanData?.username
        }&startDate=${formatDateAPI(tempStartDate)}&endDate=${formatDateAPI(
          tempEndDate
        )}`;

        await fetchPDF(url, 'pdf', false);
      } else {
        setErrorMessage('Gagal mengambil data karyawan. Silakan coba lagi.');
      }
    } else if (reportType === 'absensi' && tempStartDate && tempEndDate) {
      setLaporanFileName(
        `benefit_absensi_${formatDateAPI(tempStartDate)}_to_${formatDateAPI(
          tempEndDate
        )}`
      );

      const url = `/report/benefit/absensi?branchId=${
        tempBranch === 'all' ? '' : tempBranch
      }&roleId=${tempRole}&startDate=${formatDateAPI(
        tempStartDate
      )}&endDate=${formatDateAPI(tempEndDate)}`;

      await fetchPDF(url, 'pdf', false);
    } else {
      // Reset jika kondisi tidak terpenuhi
      setPdfData('');
      setShowDetail(false);
    }
  };

  const handleResetFilters = () => {
    setTempStatus(0);
    setTempBranch('all');
    setTempRole('');
    setTempSelectedKaryawan('');
    setTempStartDate(undefined);
    setTempEndDate(undefined);

    // Reset PDF detail
    setSelectedKaryawan('');
    setPdfData('');
    setShowDetail(false);
    setSelectedKaryawanUsername('');
    setErrorMessage('');
  };

  const handleCancelFilters = () => {
    setTempStatus(statusFilter);
    setTempBranch(branchFilter || 'all');
    setTempRole(roleFilter || '');
    setTempSelectedKaryawan(selectedKaryawan);
    setTempStartDate(startDate);
    setTempEndDate(endDate);
  };

  // Reset karyawan selection when switching to ringkasan
  const handleReportTypeChange = (value: 'absensi' | 'tip') => {
    setReportType(value);
    handleResetFilters();
  };

  const handleExportPDF = async () => {
    if (tempStartDate && tempEndDate) {
      try {
        let url = '';
        switch (reportType) {
          case 'absensi':
            url = `/report/benefit/absensi?branchId=${tempBranch}&roleId=${tempRole}&type=pdf&startDate=${formatDateAPI(
              tempStartDate
            )}&endDate=${formatDateAPI(tempEndDate)}`;
            break;
          case 'tip':
            url = `/report/benefit/tip?username=${selectedKaryawanUsername}&type=pdf&startDate=${formatDateAPI(
              tempStartDate
            )}&endDate=${formatDateAPI(tempEndDate)}`;
            break;
          default:
            break;
        }

        const result = await apiClient(url);

        if (result.status === 'success' && result.data) {
          const base64Data = result.data;
          const binaryString = atob(base64Data);
          const bytes = new Uint8Array(binaryString.length);

          for (let i = 0; i < binaryString.length; i++) {
            bytes[i] = binaryString.charCodeAt(i);
          }

          const blob = new Blob([bytes], { type: 'application/pdf' });
          const filename = `${laporanFileName}.pdf`;

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
        console.error('Error exporting PDF:', error);
      }
    }
  };

  const handleExportExcel = async () => {
    if (tempStartDate && tempEndDate) {
      try {
        let url = '';
        switch (reportType) {
          case 'absensi':
            url = `/report/benefit/absensi?branchId=${tempBranch}&roleId=${tempRole}&type=excel&startDate=${formatDateAPI(
              tempStartDate
            )}&endDate=${formatDateAPI(tempEndDate)}`;
            break;
          case 'tip':
            url = `/report/benefit/tip?username=${selectedKaryawanUsername}&type=excel&startDate=${formatDateAPI(
              tempStartDate
            )}&endDate=${formatDateAPI(tempEndDate)}`;
            break;
          default:
            break;
        }

        const result = await apiClient(url);

        if (result.status === 'success' && result.data) {
          const base64Data = result.data;
          const binaryString = atob(base64Data);
          const bytes = new Uint8Array(binaryString.length);

          for (let i = 0; i < binaryString.length; i++) {
            bytes[i] = binaryString.charCodeAt(i);
          }

          const blob = new Blob([bytes], {
            type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
          });
          const filename = `${laporanFileName}.xlsx`;

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
        console.error('Error exporting Excel:', error);
      }
    }
  };

  return (
    <>
      <Breadcrumbs label="Benefit Karyawan" />
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
                      <RadioGroupItem value="absensi" id="absensi" />
                      <Label className="w-1/2 capitalize" htmlFor="ringkasan">
                        Absensi
                      </Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="tip" id="tip" />
                      <Label className="w-1/2 capitalize" htmlFor="detail">
                        Tip
                      </Label>
                    </div>
                  </RadioGroup>
                </div>
              </div>

              <GroupFilter
                onApply={handleApplyFilters}
                onReset={handleResetFilters}
                onCancel={handleCancelFilters}
                hideButtons
              >
                {/* KaryawanSelect hanya tampil jika reportType adalah "detail" */}
                {reportType === 'tip' ? (
                  <KaryawanSelect
                    label="Pilih Karyawan"
                    value={tempSelectedKaryawan}
                    onChange={setTempSelectedKaryawan}
                    statusFilter={tempStatus || 1}
                    branchFilter={tempBranch === 'all' ? '' : tempBranch}
                    roleFilter='CLEANER'
                    className="mb-4"
                    placeholder="Pilih Karyawan"
                  />
                ) : (
                  <>
                    <SelectFilter
                      label="Akses Pengguna"
                      id="role"
                      placeholder="Pilih Akses Pengguna"
                      value={tempRole || ''}
                      optionsString={[
                        { label: 'Administrator', value: 'ADMIN' },
                        { label: 'Staff Cleaning', value: 'CLEANER' },
                        { label: 'Staff Blower', value: 'BLOWER' },
                      ]}
                      onChange={(value) =>
                        setTempRole(value === 'all' ? '' : value)
                      }
                    />

                    <SelectFilter
                      label="Cabang"
                      id="branch"
                      placeholder="Pilih Cabang"
                      value={tempBranch || 'all'}
                      optionsString={[
                        { label: 'Semua Cabang', value: 'all' },
                        ...Object.entries(branchMapping || {})
                          .filter(([value]) => value && value.trim() !== '')
                          .map(([value, label]) => ({
                            value,
                            label,
                          })),
                      ]}
                      onChange={(value) =>
                        setTempBranch(value === 'all' ? '' : value)
                      }
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

              <Button variant="main" onClick={handleApplyFilters}>
                Tampilkan
              </Button>
            </div>

            <div className="space-x-2">
              <Button
                type="button"
                variant="main"
                onClick={handleExportPDF}
                disabled={
                  !showDetail || pdfData === '' || pdfData === undefined
                }
              >
                <FaFilePdf />
                Ekspor PDF
              </Button>
              <Button
                type="button"
                onClick={handleExportExcel}
                disabled={
                  !showDetail || pdfData === '' || pdfData === undefined
                }
              >
                <FaFileExcel size={16} />
                Ekspor Data Excel
              </Button>
            </div>
          </div>

          {showDetail && (
            <div className="border rounded-lg p-4 bg-gray-50">
              <div className="flex items-center justify-between mb-4">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => {
                    handleResetFilters();
                  }}
                >
                  <IoClose size={16} />
                  Tutup
                </Button>
              </div>

              {isLoadingDetail && (
                <div className="flex items-center justify-center h-40">
                  <div className="text-center">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-2"></div>
                    <p className="text-gray-600">Memuat laporan kinerja...</p>
                  </div>
                </div>
              )}

              {pdfData && (
                <div className="w-full h-[700px] border rounded bg-white">
                  <iframe
                    src={`data:application/pdf;base64,${pdfData}`}
                    width="100%"
                    height="100%"
                    style={{ border: 'none' }}
                    title={laporanFileName || 'Laporan Kinerja Karyawan'}
                  />
                </div>
              )}

              {errorMessage && (
                <div className="flex items-center justify-center h-40">
                  <div className="text-center max-w-md">
                    <div className="text-orange-600 bg-orange-50 px-4 py-3 rounded-lg">
                      <p className="font-medium text-orange-800 mb-1">
                        📊 Data Tidak Tersedia
                      </p>
                      <p className="text-sm text-orange-700">{errorMessage}</p>
                      <p className="text-xs text-orange-600 mt-2">
                        Silakan coba dengan rentang tanggal yang berbeda atau
                        pastikan memiliki transaksi pada periode tersebut.
                      </p>
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Default Content */}
          {!showDetail && (
            <div className="text-center text-muted-foreground text-sm py-7 my-3 border-y">
              Silakan lengkapi kriteria pencarian lalu klik tombol <b>Tampilkan</b>{' '}
              untuk melihat laporan
            </div>
          )}
        </div>
      </Wrapper>
    </>
  );
}
