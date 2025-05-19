"use client";
import { useState, useCallback } from "react";
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
import Link from "next/link";
import { LuPlus } from "react-icons/lu";
import { RiExportFill } from "react-icons/ri";
import { PiExportFill } from "react-icons/pi";

const dummyData = [
  {
    id: "1",
    trxNumber: "TRX-001",
    customerName: "Budi Santoso",
    noWhatsapp: "081234567890",
    address: "Jl. Mawar No. 10",
    city: "Jakarta",
    branchId: "Jakarta Pusat",
    finalPrice: 150000,
    trxDate: "2025-05-10",
    status: 4,
  },
  {
    id: "2",
    trxNumber: "TRX-002",
    customerName: "Siti Aminah",
    noWhatsapp: "082345678901",
    address: "Jl. Melati No. 5",
    city: "Bandung",
    branchId: "Bandung Timur",
    finalPrice: 200000,
    trxDate: "2025-05-11",
    status: 3,
  },
  {
    id: "3",
    trxNumber: "TRX-003",
    customerName: "Andi Wijaya",
    noWhatsapp: "083456789012",
    address: "Jl. Kenanga No. 8",
    city: "Surabaya",
    branchId: "Surabaya Barat",
    finalPrice: 175000,
    trxDate: "2025-05-12",
    status: 5,
  },
  {
    id: "4",
    trxNumber: "TRX-004",
    customerName: "Dewi Lestari",
    noWhatsapp: "084567890123",
    address: "Jl. Anggrek No. 12",
    city: "Medan",
    branchId: "Medan Selatan",
    finalPrice: 220000,
    trxDate: "2025-05-13",
    status: 4,
  },
  {
    id: "5",
    trxNumber: "TRX-005",
    customerName: "Rudi Hartono",
    noWhatsapp: "085678901234",
    address: "Jl. Dahlia No. 3",
    city: "Semarang",
    branchId: "Semarang Utara",
    finalPrice: 160000,
    trxDate: "2025-05-14",
    status: 3,
  },
  {
    id: "6",
    trxNumber: "TRX-006",
    customerName: "Maya Sari",
    noWhatsapp: "086789012345",
    address: "Jl. Flamboyan No. 7",
    city: "Yogyakarta",
    branchId: "Yogyakarta Timur",
    finalPrice: 185000,
    trxDate: "2025-05-15",
    status: 5,
  },
  {
    id: "7",
    trxNumber: "TRX-007",
    customerName: "Agus Salim",
    noWhatsapp: "087890123456",
    address: "Jl. Cempaka No. 9",
    city: "Makassar",
    branchId: "Makassar Barat",
    finalPrice: 210000,
    trxDate: "2025-05-16",
    status: 4,
  },
  {
    id: "8",
    trxNumber: "TRX-008",
    customerName: "Lina Marlina",
    noWhatsapp: "088901234567",
    address: "Jl. Teratai No. 2",
    city: "Palembang",
    branchId: "Palembang Selatan",
    finalPrice: 195000,
    trxDate: "2025-05-17",
    status: 3,
  },
  {
    id: "9",
    trxNumber: "TRX-009",
    customerName: "Fajar Pratama",
    noWhatsapp: "089012345678",
    address: "Jl. Kamboja No. 6",
    city: "Balikpapan",
    branchId: "Balikpapan Timur",
    finalPrice: 170000,
    trxDate: "2025-05-18",
    status: 5,
  },
  {
    id: "10",
    trxNumber: "TRX-010",
    customerName: "Sari Dewi",
    noWhatsapp: "081098765432",
    address: "Jl. Sawo No. 11",
    city: "Denpasar",
    branchId: "Denpasar Barat",
    finalPrice: 230000,
    trxDate: "2025-05-19",
    status: 4,
  },
];

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

export default function InquiryTransaksiPage() {
  const [searchInput, setSearchInput] = useState("");
  const [limit, setLimit] = useState(10);
  const [currentPage, setCurrentPage] = useState(1);
  const [status, setStatus] = useState(0);
  const [branch, setBranch] = useState("");
  const [startDate, setStartDate] = useState<Date | null>(null);
  const [endDate, setEndDate] = useState<Date | null>(null);

  // Handler menggunakan useCallback untuk mencegah warning eslint react-hooks/exhaustive-deps
  const handleApplyFilter = useCallback(() => {
    // implementasi filter jika ada
  }, []);

  const handleResetFilter = useCallback(() => {
    setStatus(0);
    setBranch("");
    setStartDate(null);
    setEndDate(null);
    setSearchInput("");
  }, []);

  const handleCancelFilter = useCallback(() => {
    // bisa set state atau close dialog filter jika ada
  }, []);

  return (
    <>
      <Breadcrumbs label="Inquiry Transaksi" />
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
                  className="w-[30lvw]"
                  icon={<Search size={16} />}
                />
                {searchInput && (
                  <button
                    type="button"
                    onClick={() => setSearchInput("")}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-neutral-500 hover:text-neutral-700"
                  >
                    <IoClose size={16} />
                  </button>
                )}
              </div>

              <GroupFilter
                onApply={handleApplyFilter}
                onReset={handleResetFilter}
                onCancel={handleCancelFilter}
              >
                <SelectFilter
                  label="Cabang"
                  id="branch"
                  placeholder="Pilih Cabang"
                  value=""
                  optionsString={[]}
                  onChange={(val) => setBranch(val)}
                />
                <SelectFilter
                  label="Status Transaksi"
                  id="status"
                  placeholder="Pilih Status"
                  value={status}
                  optionsNumber={[
                    { label: "Menunggu Bayar", value: 3 },
                    { label: "Sudah Bayar", value: 4 },
                    { label: "Selesai", value: 5 },
                  ]}
                  onChange={(val) => setStatus(val)}
                />
                <div className="flex items-center space-x-4">
                  <Label className="w-1/2 font-semibold capitalize">Tanggal awal</Label>
                  <DatePicker
                    label="DD/MM/YYYY"
                    value={startDate}
                    onChange={(date) => setStartDate(date ?? null)}
                  />
                </div>
                <div className="flex items-center space-x-4">
                  <Label className="w-1/2 font-semibold capitalize">Tanggal akhir</Label>
                  <DatePicker
                    label="DD/MM/YYYY"
                    value={endDate}
                    onChange={(date) => setEndDate(date ?? null)}
                  />
                </div>
              </GroupFilter>

              <Button variant="main">Cari</Button>
            </div>
            <Link href="spk/baru">
              <Button type="submit" icon={<PiExportFill size={16} />}>
                Ekspor Data
              </Button>
            </Link>
          </div>

          <InquiryTransaksiTable
            data={dummyData}
            columns={columns}
            currentPage={currentPage}
            limit={limit}
            fetchData={() => { }}
          />
        </div>

        <div className="flex items-center justify-between mt-4">


          {dummyData.length >= 10 ? (
            <SelectData
              label="Data Per Halaman"
              totalData={dummyData.length}
              currentLimit={limit}
              onLimitChange={(val) => setLimit(Number(val))}
            />
          ) : (
            <Label className="text-xs">Semua data telah ditampilkan ({dummyData.length})</Label>
          )}

          <PaginationNumber
            totalPages={1}
            currentPage={currentPage}
            onPageChange={setCurrentPage}
          />
        </div>
      </Wrapper>
    </>
  );
}
