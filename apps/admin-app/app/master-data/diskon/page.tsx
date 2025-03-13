"use client"
import { Header } from "@shared/components/Header";
import { Wrapper } from "@shared/components/Wrapper";
// import { DataTable } from "libs/ui-components/src/components/data-table";
import { Input } from "libs/ui-components/src/components/ui/input";
import { Button } from "libs/ui-components/src/components/ui/button";
import { DropdownMenuCheckboxes } from "libs/ui-components/src/components/dropdown-checkboxes";
import { LuPlus } from "react-icons/lu";
import { Search } from "lucide-react";
import { PiExport } from "react-icons/pi";
import { SelectData } from "libs/ui-components/src/components/select-data";
import { PaginationNumber } from "libs/ui-components/src/components/pagination-number";
import { Modal } from "@shared/components/Modal";
import { Label } from "libs/ui-components/src/components/ui/label";
import { DiscountTable } from "libs/ui-components/src/components/discount-table"
import Link from "next/link";

export const discountData = [
  {
    id: 1,
    kodeDiskon: "D-001",
    namaDiskon: "Diskon Ramadhan",
    potonganHarga: "Rp 25.000",
    layanan: "Kasur 200 x 200",
    minimal: 2,
    masaBerlaku: "31-03-2025",
    category: "Musiman",
  },
  {
    id: 2,
    kodeDiskon: "D-002",
    namaDiskon: "Diskon Corporate",
    potonganHarga: "Rp 50.000",
    layanan: "Sofa Bed",
    minimal: 2,
    masaBerlaku: "30-04-2025",
    category: "Korporat",
  },
  {
    id: 3,
    kodeDiskon: "D-003",
    namaDiskon: "Diskon Akhir Tahun",
    potonganHarga: "Rp 30.000",
    layanan: "Spring Bed",
    minimal: 1,
    masaBerlaku: "31-12-2025",
    category: "Musiman",
  },
  {
    id: 4,
    kodeDiskon: "D-004",
    namaDiskon: "Diskon Member",
    potonganHarga: "Rp 20.000",
    layanan: "Karpet",
    minimal: 3,
    masaBerlaku: "31-07-2025",
    category: "Loyalitas",
  },
  {
    id: 5,
    kodeDiskon: "D-005",
    namaDiskon: "Diskon Spesial Minggu",
    potonganHarga: "Rp 15.000",
    layanan: "Sofa",
    minimal: 1,
    masaBerlaku: "30-06-2025",
    category: "Musiman",
  },
  {
    id: 6,
    kodeDiskon: "D-006",
    namaDiskon: "Diskon Mitra",
    potonganHarga: "Rp 40.000",
    layanan: "Kasur Lipat",
    minimal: 2,
    masaBerlaku: "30-09-2025",
    category: "Korporat",
  },
  {
    id: 7,
    kodeDiskon: "D-007",
    namaDiskon: "Promo Cashback",
    potonganHarga: "Rp 35.000",
    layanan: "Karpet Wol",
    minimal: 3,
    masaBerlaku: "15-08-2025",
    category: "Loyalitas",
  },
  {
    id: 8,
    kodeDiskon: "D-008",
    namaDiskon: "Diskon Pelajar",
    potonganHarga: "Rp 10.000",
    layanan: "Bean Bag",
    minimal: 1,
    masaBerlaku: "31-05-2025",
    category: "Edukasi",
  },
  {
    id: 9,
    kodeDiskon: "D-009",
    namaDiskon: "Diskon Hari Ibu",
    potonganHarga: "Rp 50.000",
    layanan: "Kasur Busa",
    minimal: 2,
    masaBerlaku: "22-12-2025",
    category: "Musiman",
  },
  {
    id: 10,
    kodeDiskon: "D-010",
    namaDiskon: "Diskon VIP",
    potonganHarga: "Rp 75.000",
    layanan: "Sofa Kulit",
    minimal: 2,
    masaBerlaku: "31-10-2025",
    category: "Eksklusif",
  },
];

export const DataHeaderDiskon = [
  { key: "id", label: "#" },
  { key: "kodeDiskon", label: "Kode Diskon" },
  { key: "namaDiskon", label: "Nama Diskon" },
  { key: "potonganHarga", label: "Potongan Harga" },
  { key: "layanan", label: "Layanan" },
  { key: "minimal", label: "Minimal" },
  { key: "masaBerlaku", label: "Masa Berlaku" },
  { key: "category", label: "Kategori" },
  { key: "menu", label: "Aksi" },
];

export default function DiscountPage() {


  return (
    <Wrapper>
      <Header label={"Daftar Diskon"} count={discountData.length} />
      <div className="flex-grow">
        <div className="flex items-center justify-between mb-4 gap-2">
          <div className="flex items-center gap-2">
            <Input type="text" placeholder="Cari diskon..." className="w-[30lvw]" icon={<Search size={16} />} />
            <DropdownMenuCheckboxes />
            <Button variant={"secondary"}>Cari</Button>
          </div>

          <Link
            href="diskon/baru"
          >
            <Button
              icon={<LuPlus size={16} />}
              className="pl-2 pr-4"
              iconPosition="left"
              variant="default"
              type="submit"
            >
              Tambah Diskon
            </Button>
          </Link>
        </div>
        <DiscountTable data={discountData} columns={DataHeaderDiskon} />
      </div>
      <div className="flex items-center justify-between mt-4">
        <SelectData label="Data Per halaman" />
        <PaginationNumber />
      </div>
    </Wrapper>
  );
}
