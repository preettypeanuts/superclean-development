"use client"
import { Header } from "@shared/components/Header";
import { Wrapper } from "@shared/components/Wrapper";
// import { DataTable } from "libs/ui-components/src/components/data-table";
import { Input } from "libs/ui-components/src/components/ui/input";
import { Button } from "libs/ui-components/src/components/ui/button";
import { DropdownMenuCheckboxes } from "libs/ui-components/src/components/dropdown-checkboxes";
import { LuPlus } from "react-icons/lu";
import { Search } from "lucide-react";
import { SelectData } from "libs/ui-components/src/components/select-data";
import { PaginationNumber } from "libs/ui-components/src/components/pagination-number";
import { TableLayanan } from "libs/ui-components/src/components/layanan-table"
import Link from "next/link";

export const dataLayanan = [
  {
    id: 1,
    kodeLayanan: "L001",
    namaLayanan: "Vacuum Interior",
    kategori: "Interior",
    hargaVacuum: 50000,
    hargaCuci: 20000,
    status: "Aktif"
  },
  {
    id: 2,
    kodeLayanan: "L002",
    namaLayanan: "Cuci Eksterior",
    kategori: "Eksterior",
    hargaVacuum: 25000,
    hargaCuci: 30000,
    status: "Aktif"
  },
  {
    id: 3,
    kodeLayanan: "L003",
    namaLayanan: "Cuci Komplit",
    kategori: "Komplit",
    hargaVacuum: 50000,
    hargaCuci: 30000,
    status: "Aktif"
  },
  {
    id: 4,
    kodeLayanan: "L004",
    namaLayanan: "Poles Body",
    kategori: "Eksterior",
    hargaVacuum: 30000,
    hargaCuci: 100000,
    status: "Nonaktif"
  },
  {
    id: 5,
    kodeLayanan: "L005",
    namaLayanan: "Salon Interior",
    kategori: "Interior",
    hargaVacuum: 150000,
    hargaCuci: 50000,
    status: "Aktif"
  },
  {
    id: 6,
    kodeLayanan: "L006",
    namaLayanan: "Coating Body",
    kategori: "Eksterior",
    hargaVacuum: 0,
    hargaCuci: 200000,
    status: "Aktif"
  },
  {
    id: 7,
    kodeLayanan: "L007",
    namaLayanan: "Cuci Mesin",
    kategori: "Mesin",
    hargaVacuum: 0,
    hargaCuci: 75000,
    status: "Aktif"
  },
  {
    id: 8,
    kodeLayanan: "L008",
    namaLayanan: "Nano Ceramic",
    kategori: "Eksterior",
    hargaVacuum: 150000,
    hargaCuci: 250000,
    status: "Nonaktif"
  },
  {
    id: 9,
    kodeLayanan: "L009",
    namaLayanan: "Fogging Interior",
    kategori: "Interior",
    hargaVacuum: 50000,
    hargaCuci: 120000,
    status: "Aktif"
  },
  {
    id: 10,
    kodeLayanan: "L010",
    namaLayanan: "Detailing Komplit",
    kategori: "Komplit",
    hargaVacuum: 200000,
    hargaCuci: 150000,
    status: "Aktif"
  }
];

export const DataHeaderLayanan = [
  { key: "id", label: "#" },
  { key: "kodeLayanan", label: "Kode Layanan" },
  { key: "namaLayanan", label: "Nama Layanan" },
  { key: "kategori", label: "Kategori" },
  { key: "hargaVacuum", label: "Harga Vacuum" },
  { key: "hargaCuci", label: "Harga Cuci" },
  { key: "status", label: "Status" },
  { key: "menu", label: "Aksi" },
];

export default function LayananPage() {
  return (
    <Wrapper>
      <Header label={"Daftar Layanan"} count={dataLayanan.length} />
      <div className="flex-grow"></div>
      <div className="flex items-center justify-between mb-4 gap-2">
        <div className="flex items-center gap-2">
          <Input type="text" placeholder="Cari layanan..." className="w-[30lvw]" icon={<Search size={16} />} />
          <DropdownMenuCheckboxes />
          <Button className="bg-mainColor/50" variant={"secondary"}>Cari</Button>
        </div>
        <Link href="layanan/baru">
          <Button
            icon={<LuPlus size={16} />}
            className="pl-2 pr-4"
            iconPosition="left"
            variant="default"
            type="submit"
          >
            Tambah Layanan
          </Button>
        </Link>
      </div>
      <TableLayanan data={dataLayanan} columns={DataHeaderLayanan} />
      <div className="flex items-center justify-between mt-4">
        <SelectData label="Data Per halaman" />
        <PaginationNumber />
      </div>
    </Wrapper>
  );
}
