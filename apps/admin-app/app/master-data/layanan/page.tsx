"use client"
import { Header } from "@shared/components/Header";
import { Wrapper } from "@shared/components/Wrapper";
import { DataTable } from "libs/ui-components/src/components/data-table";
import { Input } from "libs/ui-components/src/components/ui/input";
import { Button } from "libs/ui-components/src/components/ui/button";
import { DropdownMenuCheckboxes } from "libs/ui-components/src/components/dropdown-checkboxes";
import { LuPlus } from "react-icons/lu";
import { Search } from "lucide-react";
import { PiExport } from "react-icons/pi";
import { Modal } from "@shared/components/Modal";
import { NewOrderForm } from "libs/shared/src/components/neworder-form";
import { DatePickerRange } from "libs/ui-components/src/components/date-picker-range"
import { ChartOrder } from "libs/shared/src/components/ChartOrder"
import { SelectData } from "libs/ui-components/src/components/select-data";
import { PaginationNumber } from "libs/ui-components/src/components/pagination-number";

const DataLayanan = [
  {
    "id": 1,
    "service_name": "Cleaning Sofa",
    "description": "Layanan pembersihan sofa dengan metode deep cleaning untuk hasil maksimal.",
    "price_start": 150000,
    "duration": "60-90 menit",
    "total_partners": 5,
    "rating": 4.8,
    "photo_url": "https://source.unsplash.com/400x300/?sofa,cleaning",
    "partners": 5
  },
  {
    "id": 2,
    "service_name": "Cuci Karpet",
    "description": "Layanan pencucian karpet dengan teknologi modern agar bersih dan bebas kuman.",
    "price_start": 100000,
    "duration": "90-120 menit",
    "total_partners": 4,
    "rating": 4.7,
    "photo_url": "https://source.unsplash.com/400x300/?carpet,cleaning",
    "partners": 6
  },
  {
    "id": 3,
    "service_name": "Poles Lantai",
    "description": "Layanan poles lantai untuk kilap maksimal dan tahan lama.",
    "price_start": 200000,
    "duration": "120-180 menit",
    "total_partners": 3,
    "rating": 4.9,
    "photo_url": "https://source.unsplash.com/400x300/?floor,cleaning",
    "partners": 7
  }
];


const DataHeaderServices = [
  { key: "select", label: "" },
  { key: "id", label: "ID Layanan" },
  { key: "service_name", label: "Nama Layanan" },
  { key: "description", label: "Deskripsi" },
  { key: "price_start", label: "Harga Mulai" },
  { key: "duration", label: "Durasi" },
  { key: "total_partners", label: "Jumlah Mitra" },
  { key: "rating", label: "Rating" },
  { key: "menu", label: "" }
];


const newOrderForm = [
  {
    label: "Nama Pelanggan",
    name: "name",
    type: "text",
    placeholder: "Masukkan nama pelanggan",
    required: true,
  },
  {
    label: "Email",
    name: "email",
    type: "email",
    placeholder: "Masukkan email pelanggan",
    required: true,
  },
  {
    label: "Phone",
    name: "phone",
    type: "text",
    placeholder: "Masukkan nomor telepon",
    required: true,
  },
  {
    label: "Status",
    name: "status",
    type: "select",
    placeholder: "Pilih status",
    required: true,
    options: [
      { label: "Aktif", value: "aktif" },
      { label: "Nonaktif", value: "nonaktif" },
    ],
  },
  {
    label: "Rating",
    name: "rating",
    type: "number",
    placeholder: "Masukkan rating",
    required: false,
  },
  {
    label: "Completed Orders",
    name: "completedOrder",
    type: "number",
    placeholder: "Jumlah pesanan selesai",
    required: false,
  },
  {
    label: "Joined Date",
    name: "joinDate",
    type: "text",
    placeholder: "Tanggal bergabung",
    required: true,
  },
  {
    label: "Location",
    name: "location",
    type: "text",
    placeholder: "Masukkan lokasi",
    required: true,
  },
];



export default function LayananPage() {
  return (
    <Wrapper>
      <Header
        label="Daftar Layanan"
        desc="Jelajahi berbagai layanan yang tersedia untuk memenuhi kebutuhan Anda."
      />
      <div className="flex flex-col grow items-start gap-2">
        <div className="flex w-full items-center space-x-2">
          <Input type="text" placeholder="Cari pesanan..." icon={<Search size={16} />} />
          <DropdownMenuCheckboxes />
          <Button variant="outline">
            <PiExport />
            Export Data
          </Button>
          <Button
            onClick={() => {
              const modal = document.getElementById('new-order') as HTMLDialogElement | null; if (modal) { modal.showModal(); }
            }}
            icon={<LuPlus size={16} />}
            className="pl-2 pr-4"
            iconPosition="left"
            variant="default"
            type="submit">
            Tambah Pesanan
          </Button>
        </div>
      <DataTable data={DataLayanan} columns={DataHeaderServices} />
      </div>
      <Modal id="new-order">
        <NewOrderForm data={newOrderForm} />
      </Modal>
      <div className="flex items-center justify-between mt-auto">
        <div className="flex items-center gap-2">
          <SelectData />
          <p className="text-sm opacity-70">
            items per page
          </p>
        </div>
        <PaginationNumber />
      </div>
    </Wrapper>
  );
}