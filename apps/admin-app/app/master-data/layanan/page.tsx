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
import { TableLayanan } from "libs/ui-components/src/components/layanan-table"
import Link from "next/link";

export const dataLayanan = [
  {
    id: 1,
    kodeLayanan: "L001",
    namaLayanan: "General Cleaming",
    kategori: "General",
    hargaGeneral: 50000,
    hargaVacuum: 0,
    hargaCuci: 0,
    satuan: "pcs",
    status: true
  },
  {
    id: 2,
    kodeLayanan: "L002",
    namaLayanan: "Karpet",
    kategori: "Karpet",
    hargaGeneral: 0,
    hargaVacuum: 60000,
    hargaCuci: 100000,
    satuan: "pcs",
    status: true
  },
  {
    id: 3,
    kodeLayanan: "L003",
    namaLayanan: "Kasur 200 x 200",
    kategori: "Bed",
    hargaGeneral: 0,
    hargaVacuum: 75000,
    hargaCuci: 125000,
    satuan: "unit",
    status: false
  },
  {
    id: 4,
    kodeLayanan: "L004",
    namaLayanan: "Kasur 180 x 200",
    kategori: "Bed",
    hargaGeneral: 0,
    hargaVacuum: 70000,
    hargaCuci: 120000,
    satuan: "unit",
    status: true
  },
  {
    id: 5,
    kodeLayanan: "L005",
    namaLayanan: "Kasur 160 x 200",
    kategori: "Bed",
    hargaGeneral: 0,
    hargaVacuum: 65000,
    hargaCuci: 110000,
    satuan: "unit",
    status: true
  },
  {
    id: 6,
    kodeLayanan: "L006",
    namaLayanan: "Sofa 3 Seater",
    kategori: "Furniture",
    hargaGeneral: 0,
    hargaVacuum: 85000,
    hargaCuci: 150000,
    satuan: "unit",
    status: true
  },
  {
    id: 7,
    kodeLayanan: "L007",
    namaLayanan: "Sofa 2 Seater",
    kategori: "Furniture",
    hargaGeneral: 0,
    hargaVacuum: 70000,
    hargaCuci: 120000,
    satuan: "unit",
    status: true
  },
  {
    id: 8,
    kodeLayanan: "L008",
    namaLayanan: "Kursi Kantor",
    kategori: "Furniture",
    hargaGeneral: 0,
    hargaVacuum: 50000,
    hargaCuci: 90000,
    satuan: "pcs",
    status: true
  },
  {
    id: 9,
    kodeLayanan: "L009",
    namaLayanan: "Spring Bed Single",
    kategori: "Bed",
    hargaGeneral: 0,
    hargaVacuum: 60000,
    hargaCuci: 100000,
    satuan: "unit",
    status: false
  },
  {
    id: 10,
    kodeLayanan: "L010",
    namaLayanan: "Spring Bed Queen",
    kategori: "Bed",
    hargaGeneral: 0,
    hargaVacuum: 70000,
    hargaCuci: 120000,
    satuan: "unit",
    status: true
  }
];


export const DataHeaderLayanan = [
  { key: "id", label: "#" },
  { key: "kodeLayanan", label: "Kode Layanan" },
  { key: "namaLayanan", label: "Nama Layanan" },
  { key: "kategori", label: "Kategori" },
  { key: "hargaVacuum", label: "Harga Vacuum" },
  { key: "hargaCuci", label: "Harga Cuci" },
  { key: "hargaGeneral", label: "Harga General" },
  { key: "satuan", label: "Satuan" },
  { key: "status", label: "Status" },
  { key: "menu", label: "Aksi" },
];

export default function LayananPage() {
  return (
    <Wrapper>
      <Header label={"Daftar Layanan"} count={dataLayanan.length} />
      <div className="flex-grow">
        <div className="flex items-center justify-between mb-4 gap-2">
          <div className="flex items-center gap-2">
            <Input type="text" placeholder="Cari layanan..." className="w-[30lvw]" icon={<Search size={16} />} />
            <DropdownMenuCheckboxes />
            <Button variant={"secondary"}>Cari</Button>
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
      </div>
      <div className="flex items-center justify-between mt-4">
        <SelectData label="Data Per halaman" />
        <PaginationNumber />
      </div>
    </Wrapper>
  );
}
