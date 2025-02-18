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
import { SelectData } from "libs/ui-components/src/components/select-data";
import { PaginationNumber } from "libs/ui-components/src/components/pagination-number";
import { Modal } from "@shared/components/Modal";
import { Label } from "libs/ui-components/src/components/ui/label";

export default function PelangganPage() {
  const DataCustomer = [
    {
      "id": 1,
      "name": "Ahmad Fauzi",
      "phone": "0812-1111-2222",
      "email": "ahmad.fauzi@example.com",
      "status": "Aktif",
      "total_orders": 25,
      "joined_date": "2022-12-10",
      "location": "Jakarta",
      "photo_url": "https://randomuser.me/api/portraits/men/9.jpg"
    },
    {
      "id": 2,
      "name": "Dewi Lestari",
      "phone": "0813-3333-4444",
      "email": "dewi.lestari@example.com",
      "status": "Aktif",
      "total_orders": 40,
      "joined_date": "2021-05-15",
      "location": "Bandung",
      "photo_url": "https://randomuser.me/api/portraits/women/10.jpg"
    },
    {
      "id": 3,
      "name": "Rizal Hakim",
      "phone": "0812-5555-6666",
      "email": "rizal.hakim@example.com",
      "status": "Nonaktif",
      "total_orders": 10,
      "joined_date": "2023-08-20",
      "location": "Surabaya",
      "photo_url": "https://randomuser.me/api/portraits/men/11.jpg"
    },
    {
      "id": 4,
      "name": "Sari Indah",
      "phone": "0812-7777-8888",
      "email": "sari.indah@example.com",
      "status": "Aktif",
      "total_orders": 30,
      "joined_date": "2020-11-02",
      "location": "Yogyakarta",
      "photo_url": "https://randomuser.me/api/portraits/women/12.jpg"
    },
    {
      "id": 5,
      "name": "Bambang Saputro",
      "phone": "0813-9999-0000",
      "email": "bambang.saputro@example.com",
      "status": "Aktif",
      "total_orders": 50,
      "joined_date": "2019-06-25",
      "location": "Semarang",
      "photo_url": "https://randomuser.me/api/portraits/men/13.jpg"
    },
    {
      "id": 6,
      "name": "Lina Kartini",
      "phone": "0812-2222-3333",
      "email": "lina.kartini@example.com",
      "status": "Aktif",
      "total_orders": 35,
      "joined_date": "2021-10-30",
      "location": "Bali",
      "photo_url": "https://randomuser.me/api/portraits/women/14.jpg"
    },
    {
      "id": 7,
      "name": "Taufik Hidayat",
      "phone": "0813-4444-5555",
      "email": "taufik.hidayat@example.com",
      "status": "Aktif",
      "total_orders": 45,
      "joined_date": "2018-09-12",
      "location": "Medan",
      "photo_url": "https://randomuser.me/api/portraits/men/15.jpg"
    },
    {
      "id": 8,
      "name": "Anisa Rahmah",
      "phone": "0812-6666-7777",
      "email": "anisa.rahmah@example.com",
      "status": "Nonaktif",
      "total_orders": 20,
      "joined_date": "2023-03-07",
      "location": "Makassar",
      "photo_url": "https://randomuser.me/api/portraits/women/16.jpg"
    }
  ];

  const DataHeaderCustomer = [
    { key: "select", label: "" },
    { key: "id", label: "ID" },
    { key: "name", label: "Nama" },
    { key: "phone", label: "No. HP" },
    { key: "email", label: "Email" },
    { key: "status", label: "Status" },
    { key: "total_orders", label: "Total Order" },
    { key: "joined_date", label: "Tanggal Bergabung" },
    { key: "location", label: "Lokasi" },
  ];

  return (
    <Wrapper>
      <Header
        label="Daftar Pelanggan"
        desc="Berisi informasi lengkap tentang pelanggan, termasuk kontak, status, dan riwayat transaksi."
      />
      <div className="flex-grow space-y-2">
        <div className="flex items-center justify-between">
          <h1 className="font-semibold text-xl">
            All Customers {" "}
            <span className="text-sm px-1 py-[1px] bg-mainColor/50 rounded-[5px]">
              {DataCustomer.length}
            </span>
          </h1>
          <div className="flex items-center gap-2">
            <div className="flex w-full items-center space-x-2">
              <Input type="text" placeholder="Cari mitra..." icon={<Search size={16} />} />
              <DropdownMenuCheckboxes />
              <Button variant="outline">
                <PiExport />
                Export Data
              </Button>
            </div>
          </div>
        </div>
        <DataTable data={DataCustomer} columns={DataHeaderCustomer} />
      </div>
      {/* Footer with SelectData and PaginationNumber always at the bottom */}
      <div className="mt-auto">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <SelectData />
            <p className="text-sm opacity-70">
              items per page
            </p>
          </div>
          <PaginationNumber />
        </div>
      </div>
    </Wrapper>
  );
}
