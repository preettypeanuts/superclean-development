"use client"
import { TableKaryawan } from "libs/ui-components/src/components/karyawan-table"
import { Header } from "@shared/components/Header"
import { Wrapper } from "libs/shared/src/components/Wrapper"
import { Input } from "libs/ui-components/src/components/ui/input";
import { Button } from "libs/ui-components/src/components/ui/button";
import { DropdownMenuCheckboxes } from "libs/ui-components/src/components/dropdown-checkboxes";
import { LuPlus } from "react-icons/lu";
import { Search } from "lucide-react";
import { SelectData } from "libs/ui-components/src/components/select-data";
import { PaginationNumber } from "libs/ui-components/src/components/pagination-number";
import Link from "next/link";

export const dataKaryawan = [
    {
        id: 1,
        userName: "johndoe",
        name: "John Doe",
        cabang: "Jabodetabek",
        phone: "081234567890",
        status: "Aktif"
    },
    {
        id: 2,
        userName: "janesmith",
        name: "Jane Smith",
        cabang: "Bandung",
        phone: "081298765432",
        status: "Aktif"
    },
    {
        id: 3,
        userName: "michael87",
        name: "Michael Johnson",
        cabang: "Jogja",
        phone: "081356789012",
        status: "Nonaktif"
    },
    {
        id: 4,
        userName: "sarahw",
        name: "Sarah Williams",
        cabang: "Surabaya",
        phone: "081267890345",
        status: "Aktif"
    },
    {
        id: 5,
        userName: "davidb",
        name: "David Brown",
        cabang: "Semarang",
        phone: "081278901234",
        status: "Nonaktif"
    },
    {
        id: 6,
        userName: "emilyj",
        name: "Emily Johnson",
        cabang: "Jabodetabek",
        phone: "081289012345",
        status: "Aktif"
    },
    {
        id: 7,
        userName: "robertm",
        name: "Robert Martinez",
        cabang: "Jabodetabek",
        phone: "081290123456",
        status: "Nonaktif"
    },
    {
        id: 8,
        userName: "lisaw",
        name: "Lisa White",
        cabang: "Jogja",
        phone: "081301234567",
        status: "Aktif"
    },
    {
        id: 9,
        userName: "kevinh",
        name: "Kevin Harris",
        cabang: "Jabodetabek",
        phone: "081312345678",
        status: "Aktif"
    },
    {
        id: 10,
        userName: "amandat",
        name: "Amanda Taylor",
        cabang: "Bandung",
        phone: "081323456789",
        status: "Nonaktif"
    }
];

export const DataHeader = [
    { key: "id", label: "#" },
    { key: "userName", label: "Nama Pengguna" },
    { key: "name", label: "Nama" },
    { key: "cabang", label: "Cabang" },
    { key: "phone", label: "No. WhatsApp" },
    { key: "status", label: "Status" },
    { key: "menu", label: "Aksi" },
];

export default function KaryawanPage() {


    return (
        <Wrapper>
            <Header label={"Daftar Karyawan"} count={dataKaryawan.length} />
            <div className="flex-grow">
                <div className="flex items-center justify-between mb-4 gap-2">
                    <div className="flex items-center gap-2">
                        <Input type="text" placeholder="Cari mitra..." className="w-[30lvw]" icon={<Search size={16} />} />
                        <DropdownMenuCheckboxes />
                    </div>

                    <Link
                        href="karyawan/baru"
                    >
                        <Button
                            icon={<LuPlus size={16} />}
                            className="pl-2 pr-4"
                            iconPosition="left"
                            variant="default"
                            type="submit"
                        >
                            Tambah Mitra
                        </Button>
                    </Link>

                </div>

                <TableKaryawan data={dataKaryawan} columns={DataHeader} />
            </div>

            <div className="flex items-center justify-between mt-4">
                <SelectData label="Data Per halaman" />
                <PaginationNumber />
            </div>
        </Wrapper>
    );
}