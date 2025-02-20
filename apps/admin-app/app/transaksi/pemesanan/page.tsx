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

const DataOrders = [
  {
    "id": 1,
    "customer_name": "Ahmad Fauzi",
    "service": "Cleaning Rumah",
    "order_date": "2025-02-10",
    "status": "Selesai",
    "technician": "Budi Santoso",
    "total_price": 350000,
    "location": "Jakarta",
    "payment_status": "Lunas",
    "rating": 5,
    "photo_url": "https://randomuser.me/api/portraits/men/9.jpg"
  },
  {
    "id": 2,
    "customer_name": "Dewi Lestari",
    "service": "Cuci Karpet",
    "order_date": "2025-02-12",
    "status": "Sedang Proses",
    "technician": "Siti Aisyah",
    "total_price": 500000,
    "location": "Bandung",
    "payment_status": "Belum Lunas",
    "rating": "-",
    "photo_url": "https://randomuser.me/api/portraits/women/10.jpg"
  },
  {
    "id": 3,
    "customer_name": "Rizal Hakim",
    "service": "Pembersihan AC",
    "order_date": "2025-02-14",
    "status": "Selesai",
    "technician": "Andi Saputra",
    "total_price": 400000,
    "location": "Surabaya",
    "payment_status": "Lunas",
    "rating": 4,
    "photo_url": "https://randomuser.me/api/portraits/men/11.jpg"
  },
  {
    "id": 4,
    "customer_name": "Sari Indah",
    "service": "Cuci Sofa",
    "order_date": "2025-02-08",
    "status": "Batal",
    "technician": "Nurul Hidayah",
    "total_price": 600000,
    "location": "Yogyakarta",
    "payment_status": "Belum Lunas",
    "rating": "-",
    "photo_url": "https://randomuser.me/api/portraits/women/12.jpg"
  },
  {
    "id": 5,
    "customer_name": "Bambang Saputro",
    "service": "Cleaning Kantor",
    "order_date": "2025-02-05",
    "status": "Selesai",
    "technician": "Joko Prasetyo",
    "total_price": 700000,
    "location": "Semarang",
    "payment_status": "Lunas",
    "rating": 4.5,
    "photo_url": "https://randomuser.me/api/portraits/men/13.jpg"
  },
  {
    "id": 6,
    "customer_name": "Lina Kartini",
    "service": "Pembersihan Gudang",
    "order_date": "2025-02-06",
    "status": "Sedang Proses",
    "technician": "Desi Rahmawati",
    "total_price": 800000,
    "location": "Bali",
    "payment_status": "Belum Lunas",
    "rating": "-",
    "photo_url": "https://randomuser.me/api/portraits/women/14.jpg"
  },
  {
    "id": 7,
    "customer_name": "Taufik Hidayat",
    "service": "Cuci Mobil",
    "order_date": "2025-02-09",
    "status": "Selesai",
    "technician": "Eko Setiawan",
    "total_price": 250000,
    "location": "Medan",
    "payment_status": "Lunas",
    "rating": 5,
    "photo_url": "https://randomuser.me/api/portraits/men/15.jpg"
  },
  {
    "id": 8,
    "customer_name": "Anisa Rahmah",
    "service": "Cleaning Rumah",
    "order_date": "2025-02-07",
    "status": "Batal",
    "technician": "Budi Santoso",
    "total_price": 400000,
    "location": "Makassar",
    "payment_status": "Belum Lunas",
    "rating": "-",
    "photo_url": "https://randomuser.me/api/portraits/women/16.jpg"
  }
];

const DataHeaderOrders = [
  { key: "select", label: "" },
  { key: "id", label: "ID Pesanan" },
  { key: "customer_name", label: "Nama Pelanggan" },
  { key: "service", label: "Layanan" },
  { key: "order_date", label: "Tanggal Pesanan" },
  { key: "status", label: "Status" },
  { key: "technician", label: "Teknisi" },
  { key: "total_price", label: "Total Harga" },
  { key: "location", label: "Lokasi" },
  { key: "payment_status", label: "Status Pembayaran" },
  { key: "rating", label: "Rating" },
  { key: "menu", label: "" },
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

export default function PemesananPage() {
  return (
    <Wrapper>
      <Header
        label="List Transaksi Pemesanan"
        desc="Melihat riwayat dan status transaksi pemesanan layanan."
      />
      <DatePickerRange />
      <div className="flex items-center gap-2">
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
      </div>
      <DataTable data={DataOrders} columns={DataHeaderOrders} />
      <Modal id="new-order">
        <NewOrderForm data={newOrderForm} />
      </Modal>
    </Wrapper>
  );
}