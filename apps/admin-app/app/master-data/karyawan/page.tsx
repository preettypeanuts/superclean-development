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
        phone: "081234567890",
        aksesPengguna: "Admin",
        cabang: "Kantor Pusat",
        status: "Aktif"
    },
    {
        id: 2,
        userName: "janesmith",
        name: "Jane Smith",
        phone: "081298765432",
        aksesPengguna: "Teknisi",
        cabang: "Bandung",
        status: "Aktif"
    },
    {
        id: 3,
        userName: "michael87",
        name: "Michael Johnson",
        phone: "081356789012",
        aksesPengguna: "Teknisi",
        cabang: "Jogja",
        status: "Nonaktif"
    },
    {
        id: 4,
        userName: "sarahw",
        name: "Sarah Williams",
        phone: "081267890345",
        aksesPengguna: "Teknisi",
        cabang: "Surabaya",
        status: "Aktif"
    },
    {
        id: 5,
        userName: "davidb",
        name: "David Brown",
        phone: "081278901234",
        aksesPengguna: "Teknisi",
        cabang: "Semarang",
        status: "Nonaktif"
    },
    {
        id: 6,
        userName: "emilyj",
        name: "Emily Johnson",
        phone: "081289012345",
        aksesPengguna: "Teknisi",
        cabang: "Jabodetabek",
        status: "Aktif"
    },
    {
        id: 7,
        userName: "robertm",
        name: "Robert Martinez",
        phone: "081290123456",
        aksesPengguna: "Admin",
        cabang: "Kantor Pusat",
        status: "Nonaktif"
    },
    {
        id: 8,
        userName: "lisaw",
        name: "Lisa White",
        phone: "081301234567",
        aksesPengguna: "Teknisi",
        cabang: "Jogja",
        status: "Aktif"
    },
    {
        id: 9,
        userName: "kevinh",
        name: "Kevin Harris",
        phone: "081312345678",
        aksesPengguna: "Teknisi",
        cabang: "Jabodetabek",
        status: "Aktif"
    },
    {
        id: 10,
        userName: "amandat",
        name: "Amanda Taylor",
        phone: "081323456789",
        aksesPengguna: "Teknisi",
        cabang: "Bandung",
        status: "Nonaktif"
    }
];

export const DataHeader = [
    { key: "id", label: "#" },
    { key: "userName", label: "Nama Pengguna" },
    { key: "name", label: "Nama" },
    { key: "phone", label: "No. WhatsApp" },
    { key: "aksesPengguna", label: "Akses Pengguna" },
    { key: "cabang", label: "Cabang" },
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
                        <Button className="bg-mainColor/50" variant={"secondary"}>Cari</Button>
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