"use client"
import { Header } from "@shared/components/Header";
import { Wrapper } from "@shared/components/Wrapper";
import { Input } from "libs/ui-components/src/components/ui/input";
import { Button } from "libs/ui-components/src/components/ui/button";
import { DropdownMenuCheckboxes } from "libs/ui-components/src/components/dropdown-checkboxes";
import { LuPlus } from "react-icons/lu";
import { Search } from "lucide-react";
import { SelectData } from "libs/ui-components/src/components/select-data";
import { PaginationNumber } from "libs/ui-components/src/components/pagination-number";
import { TablePelanggan } from "libs/ui-components/src/components/table-pelanggan"
import Link from "next/link";

export const dataPelanggan = [
  {
    id: 1,
    name: "Ahmad Fauzan",
    phone: "081234567891",
    alamat: "Jl. Merdeka No. 10",
    provinsi: "Jawa Barat",
    kota: "Bandung",
    kecamatan: "Cicendo",
    kodePos: "40171",
    tanggalDaftar: "2024-01-15",
    didaftarkanOleh: "Admin",
    status: true
  },
  {
    id: 2,
    name: "Siti Rahmawati",
    phone: "081234567892",
    alamat: "Jl. Diponegoro No. 5",
    provinsi: "Jawa Tengah",
    kota: "Semarang",
    kecamatan: "Candisari",
    kodePos: "50257",
    tanggalDaftar: "2024-01-20",
    didaftarkanOleh: "Admin",
    status: true
  },
  {
    id: 3,
    name: "Budi Santoso",
    phone: "081234567893",
    alamat: "Jl. Sudirman No. 12",
    provinsi: "DKI Jakarta",
    kota: "Jakarta Pusat",
    kecamatan: "Menteng",
    kodePos: "10310",
    tanggalDaftar: "2024-02-05",
    didaftarkanOleh: "Sales",
    status: true
  },
  {
    id: 4,
    name: "Dewi Kartika",
    phone: "081234567894",
    alamat: "Jl. Ahmad Yani No. 7",
    provinsi: "Jawa Timur",
    kota: "Surabaya",
    kecamatan: "Gubeng",
    kodePos: "60281",
    tanggalDaftar: "2024-02-10",
    didaftarkanOleh: "Marketing",
    status: false
  },
  {
    id: 5,
    name: "Eko Prasetyo",
    phone: "081234567895",
    alamat: "Jl. Gajah Mada No. 15",
    provinsi: "Bali",
    kota: "Denpasar",
    kecamatan: "Denpasar Barat",
    kodePos: "80119",
    tanggalDaftar: "2024-02-15",
    didaftarkanOleh: "Admin",
    status: true
  },
  {
    id: 6,
    name: "Fajar Nugroho",
    phone: "081234567896",
    alamat: "Jl. Dipati Ukur No. 8",
    provinsi: "Jawa Barat",
    kota: "Bandung",
    kecamatan: "Coblong",
    kodePos: "40132",
    tanggalDaftar: "2024-02-18",
    didaftarkanOleh: "Sales",
    status: false
  },
  {
    id: 7,
    name: "Gita Permata",
    phone: "081234567897",
    alamat: "Jl. Asia Afrika No. 20",
    provinsi: "Sumatera Utara",
    kota: "Medan",
    kecamatan: "Medan Baru",
    kodePos: "20112",
    tanggalDaftar: "2024-02-20",
    didaftarkanOleh: "Marketing",
    status: true
  },
  {
    id: 8,
    name: "Hendra Wijaya",
    phone: "081234567898",
    alamat: "Jl. Pemuda No. 25",
    provinsi: "Jawa Tengah",
    kota: "Yogyakarta",
    kecamatan: "Danurejan",
    kodePos: "55212",
    tanggalDaftar: "2024-02-25",
    didaftarkanOleh: "Admin",
    status: true
  },
  {
    id: 9,
    name: "Indah Sari",
    phone: "081234567899",
    alamat: "Jl. Kartini No. 30",
    provinsi: "Jawa Timur",
    kota: "Malang",
    kecamatan: "Klojen",
    kodePos: "65119",
    tanggalDaftar: "2024-03-01",
    didaftarkanOleh: "Sales",
    status: false
  },
  {
    id: 10,
    name: "Joko Setiawan",
    phone: "081234567800",
    alamat: "Jl. Braga No. 40",
    provinsi: "Jawa Barat",
    kota: "Bandung",
    kecamatan: "Sumur Bandung",
    kodePos: "40111",
    tanggalDaftar: "2024-03-05",
    didaftarkanOleh: "Marketing",
    status: true
  }
];

export const DataHeaderPelanggan = [
  { key: "id", label: "#" },
  { key: "name", label: "Nama Lengkap" },
  { key: "phone", label: "No. WhatsApp" },
  { key: "tanggalDaftar", label: "Tanggal Daftar" },
  { key: "didaftarkanOleh", label: "Didaftarkan Oleh" },
  { key: "status", label: "Status" },
  { key: "menu", label: "Aksi" },
];
export default function PelangganPage() {


  return (
    <Wrapper>
      <Header label={"Daftar Pelanggan"} count={dataPelanggan.length} />
      <div className="flex-grow">
        <div className="flex items-center justify-between mb-4 gap-2">
          <div className="flex items-center gap-2">
            <Input type="text" placeholder="Cari pelanggan..." className="w-[30lvw]" icon={<Search size={16} />} />
            <DropdownMenuCheckboxes />
            <Button variant={"secondary"}>Cari</Button>
          </div>

          <Link
            href="pelanggan/baru"
          >
            <Button
              icon={<LuPlus size={16} />}
              className="pl-2 pr-4"
              iconPosition="left"
              variant="default"
              type="submit"
            >
              Tambah Pelanggan
            </Button>
          </Link>
        </div>
        <TablePelanggan data={dataPelanggan} columns={DataHeaderPelanggan} />
      </div>
      <div className="flex items-center justify-between mt-4">
        <SelectData label="Data Per halaman" />
        <PaginationNumber />
      </div>
    </Wrapper>
  );
}
