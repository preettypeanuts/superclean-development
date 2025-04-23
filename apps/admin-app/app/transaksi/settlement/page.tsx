"use client"
import Link from "next/link";
import { useEffect, useState } from "react";
import { SPKTable } from "libs/ui-components/src/components/spk-table";
import { Header } from "@shared/components/Header";
import { Wrapper } from "libs/shared/src/components/Wrapper";
import { Input } from "libs/ui-components/src/components/ui/input";
import { Button } from "libs/ui-components/src/components/ui/button";
import { FilterStatus } from "@superclean-workspace/ui-components/components/filter-status";
import { LuPlus } from "react-icons/lu";
import { Search } from "lucide-react";
import { SelectData } from "libs/ui-components/src/components/select-data";
import { PaginationNumber } from "libs/ui-components/src/components/pagination-number";
import { Label } from "@ui-components/components/ui/label";
import { IoClose } from "react-icons/io5";

const DataHeaderSPK = [
  { key: "id", label: "#" },
  { key: "noTrx", label: "No Transaksi" },
  { key: "fullname", label: "Nama Pelanggan" },
  { key: "noWhatsapp", label: "No. Whatsapp" },
  { key: "branch", label: "Cabang" },
  { key: "nominal", label: "Nominal" },
  { key: "dateTrx", label: "Tanggal Transaksi" },
  { key: "status", label: "Status" },
  { key: "menu", label: "Aksi" }
];

const dataSPK = [
  {
    id: "1",
    noTrx: "TRX-001",
    fullname: "Ratna Sari",
    noWhatsapp: "081294436553",
    branch: "Kantor Pusat",
    nominal: 200000,
    dateTrx: new Date().toISOString(),
    status: "Baru"
  },
  {
    id: "2",
    noTrx: "TRX-002",
    fullname: "Agus Pramono",
    noWhatsapp: "082345678912",
    branch: "Cabang Bekasi",
    nominal: 150000,
    dateTrx: new Date().toISOString(),
    status: "Diproses"
  },
  {
    id: "3",
    noTrx: "TRX-003",
    fullname: "Siti Aisyah",
    noWhatsapp: "081345671234",
    branch: "Cabang Bandung",
    nominal: 180000,
    dateTrx: new Date().toISOString(),
    status: "Selesai"
  },
  {
    id: "4",
    noTrx: "TRX-004",
    fullname: "Budi Santoso",
    noWhatsapp: "081234567899",
    branch: "Kantor Pusat",
    nominal: 250000,
    dateTrx: new Date().toISOString(),
    status: "Baru"
  },
  {
    id: "5",
    noTrx: "TRX-005",
    fullname: "Dewi Lestari",
    noWhatsapp: "082134567891",
    branch: "Cabang Depok",
    nominal: 175000,
    dateTrx: new Date().toISOString(),
    status: "Dibatalkan"
  },
  {
    id: "6",
    noTrx: "TRX-006",
    fullname: "Andi Wijaya",
    noWhatsapp: "083212345678",
    branch: "Cabang Bekasi",
    nominal: 210000,
    dateTrx: new Date().toISOString(),
    status: "Diproses"
  },
  {
    id: "7",
    noTrx: "TRX-007",
    fullname: "Lina Marlina",
    noWhatsapp: "085612345678",
    branch: "Kantor Pusat",
    nominal: 230000,
    dateTrx: new Date().toISOString(),
    status: "Selesai"
  },
  {
    id: "8",
    noTrx: "TRX-008",
    fullname: "Toni Haryanto",
    noWhatsapp: "082212345678",
    branch: "Cabang Tangerang",
    nominal: 120000,
    dateTrx: new Date().toISOString(),
    status: "Baru"
  },
  {
    id: "9",
    noTrx: "TRX-009",
    fullname: "Indah Pratiwi",
    noWhatsapp: "081312345678",
    branch: "Cabang Depok",
    nominal: 190000,
    dateTrx: new Date().toISOString(),
    status: "Diproses"
  },
  {
    id: "10",
    noTrx: "TRX-010",
    fullname: "Eka Saputra",
    noWhatsapp: "087812345678",
    branch: "Cabang Bandung",
    nominal: 160000,
    dateTrx: new Date().toISOString(),
    status: "Selesai"
  },
  {
    id: "11",
    noTrx: "TRX-011",
    fullname: "Fajar Nugroho",
    noWhatsapp: "083812345678",
    branch: "Cabang Bekasi",
    nominal: 240000,
    dateTrx: new Date().toISOString(),
    status: "Baru"
  },
  {
    id: "12",
    noTrx: "TRX-012",
    fullname: "Nina Zulaikha",
    noWhatsapp: "081512345678",
    branch: "Cabang Tangerang",
    nominal: 110000,
    dateTrx: new Date().toISOString(),
    status: "Dibatalkan"
  },
  {
    id: "13",
    noTrx: "TRX-013",
    fullname: "Reza Pahlevi",
    noWhatsapp: "081922345678",
    branch: "Cabang Depok",
    nominal: 170000,
    dateTrx: new Date().toISOString(),
    status: "Selesai"
  },
  {
    id: "14",
    noTrx: "TRX-014",
    fullname: "Yuni Astuti",
    noWhatsapp: "081332145678",
    branch: "Kantor Pusat",
    nominal: 220000,
    dateTrx: new Date().toISOString(),
    status: "Baru"
  },
  {
    id: "15",
    noTrx: "TRX-015",
    fullname: "Hendra Gunawan",
    noWhatsapp: "082312345698",
    branch: "Cabang Bandung",
    nominal: 145000,
    dateTrx: new Date().toISOString(),
    status: "Diproses"
  },
  {
    id: "16",
    noTrx: "TRX-016",
    fullname: "Maya Sari",
    noWhatsapp: "081276543210",
    branch: "Cabang Bekasi",
    nominal: 195000,
    dateTrx: new Date().toISOString(),
    status: "Selesai"
  },
  {
    id: "17",
    noTrx: "TRX-017",
    fullname: "Dimas Aditya",
    noWhatsapp: "081364789123",
    branch: "Cabang Tangerang",
    nominal: 155000,
    dateTrx: new Date().toISOString(),
    status: "Baru"
  },
  {
    id: "18",
    noTrx: "TRX-018",
    fullname: "Nurhalimah",
    noWhatsapp: "082134698721",
    branch: "Cabang Depok",
    nominal: 185000,
    dateTrx: new Date().toISOString(),
    status: "Diproses"
  },
  {
    id: "19",
    noTrx: "TRX-019",
    fullname: "Kevin Wijaya",
    noWhatsapp: "081934567821",
    branch: "Kantor Pusat",
    nominal: 175000,
    dateTrx: new Date().toISOString(),
    status: "Selesai"
  },
  {
    id: "20",
    noTrx: "TRX-020",
    fullname: "Dewi Anggraini",
    noWhatsapp: "083156789432",
    branch: "Cabang Bandung",
    nominal: 160000,
    dateTrx: new Date().toISOString(),
    status: "Baru"
  }
];


export default function SettlementPage() {
  const [searchInput, setSearchInput] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [currentPage, setCurrentPage] = useState(1);
  const [limit, setLimit] = useState(10);

  const handleSearch = () => {
    // Placeholder for filtering logic
  };

  const resetSearch = () => {
    setSearchInput("");
  };

  const processedKaryawan = dataSPK.filter((item) =>
    item.fullname.toLowerCase().includes(searchInput.toLowerCase())
  );

  const totalData = dataSPK.length;
  const totalPages = Math.ceil(totalData / limit);

  return (
    <Wrapper>
      <Header label="Daftar Pembayaran" count={totalData} />
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
            <FilterStatus
              value={statusFilter}
              onChange={setStatusFilter}
            />
            <Button variant="secondary" onClick={handleSearch}>
              Cari
            </Button>
          </div>
          <Link href="karyawan/baru">
            <Button
              icon={<LuPlus size={16} />}
              className="pl-2 pr-4"
              iconPosition="left"
              variant="default"
              type="submit"
            >
              Tambah Pembayaran
            </Button>
          </Link>
        </div>

        {processedKaryawan.length === 0 ? (
          <p className="text-center py-4">
            Karyawan dengan nama <span className="font-bold">{searchInput}</span> tidak ditemukan.
          </p>
        ) : (
          <SPKTable
            data={processedKaryawan}
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
  );
}
