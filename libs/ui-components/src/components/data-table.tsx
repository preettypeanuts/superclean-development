"use client";
import { useState } from "react";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "./ui/table";

import { Input } from "./ui/input";
import { Button } from "./ui/button";
import { DropdownMenuCheckboxes } from "../components/dropdown-checkboxes";
import { DropdownTable } from "../components/dropdown-table";
import { LuPlus, LuTrash2 } from "react-icons/lu";
import { Search } from "lucide-react";
import { Checkbox } from "./ui/checkbox";
import { PiExport } from "react-icons/pi";
import { SelectData } from "./select-data";
import { PaginationNumber } from "./pagination-number";

interface Mitra {
    id: number;
    name: string;
    role: string;
    phone: string;
    email: string;
    status: string;
    rating: number;
    completed_orders: number;
    joined_date: string;
    location: string;
    photo_url?: string;
}

const DataMitra: Mitra[] = [
    {
        "id": 1,
        "name": "Budi Santoso",
        "role": "Teknisi Cleaning",
        "phone": "0812-3456-7890",
        "email": "budi.santoso@example.com",
        "status": "Aktif",
        "rating": 4.8,
        "completed_orders": 120,
        "joined_date": "2023-04-12",
        "location": "Jakarta",
        "photo_url": "https://randomuser.me/api/portraits/men/1.jpg"
    },
    {
        "id": 2,
        "name": "Siti Aisyah",
        "role": "Supervisor Cleaning",
        "phone": "0813-9876-5432",
        "email": "siti.aisyah@example.com",
        "status": "Aktif",
        "rating": 4.9,
        "completed_orders": 200,
        "joined_date": "2022-10-05",
        "location": "Bandung",
        "photo_url": "https://randomuser.me/api/portraits/women/2.jpg"
    },
    {
        "id": 3,
        "name": "Rizky Maulana",
        "role": "Teknisi Cleaning",
        "phone": "0812-8765-4321",
        "email": "rizky.maulana@example.com",
        "status": "Nonaktif",
        "rating": 4.5,
        "completed_orders": 95,
        "joined_date": "2023-01-20",
        "location": "Surabaya",
        "photo_url": "https://randomuser.me/api/portraits/men/3.jpg"
    },
    {
        "id": 4,
        "name": "Andi Saputra",
        "role": "Teknisi Cleaning",
        "phone": "0812-3344-5566",
        "email": "andi.saputra@example.com",
        "status": "Aktif",
        "rating": 4.7,
        "completed_orders": 110,
        "joined_date": "2023-06-15",
        "location": "Yogyakarta",
        "photo_url": "https://randomuser.me/api/portraits/men/4.jpg"
    },
    {
        "id": 5,
        "name": "Nurul Hidayah",
        "role": "Supervisor Cleaning",
        "phone": "0813-2233-4455",
        "email": "nurul.hidayah@example.com",
        "status": "Aktif",
        "rating": 4.8,
        "completed_orders": 130,
        "joined_date": "2021-11-10",
        "location": "Semarang",
        "photo_url": "https://randomuser.me/api/portraits/women/5.jpg"
    },
    {
        "id": 6,
        "name": "Joko Prasetyo",
        "role": "Teknisi Cleaning",
        "phone": "0812-7788-9900",
        "email": "joko.prasetyo@example.com",
        "status": "Aktif",
        "rating": 4.6,
        "completed_orders": 85,
        "joined_date": "2022-08-20",
        "location": "Bali",
        "photo_url": "https://randomuser.me/api/portraits/men/6.jpg"
    },
    {
        "id": 7,
        "name": "Desi Rahmawati",
        "role": "Teknisi Cleaning",
        "phone": "0813-5566-7788",
        "email": "desi.rahmawati@example.com",
        "status": "Aktif",
        "rating": 4.9,
        "completed_orders": 150,
        "joined_date": "2021-07-05",
        "location": "Medan",
        "photo_url": "https://randomuser.me/api/portraits/women/7.jpg"
    },
    {
        "id": 8,
        "name": "Eko Setiawan",
        "role": "Supervisor Cleaning",
        "phone": "0812-3344-5566",
        "email": "eko.setiawan@example.com",
        "status": "Aktif",
        "rating": 4.7,
        "completed_orders": 140,
        "joined_date": "2020-05-18",
        "location": "Makassar",
        "photo_url": "https://randomuser.me/api/portraits/men/8.jpg"
    }
];

interface TableHeader {
    key: string;
    label: string;
}

const DataHeader: TableHeader[] = [
    { key: "select", label: "" },
    { key: "id", label: "ID" },
    { key: "name", label: "Nama" },
    { key: "role", label: "Posisi" },
    { key: "phone", label: "No. HP" },
    { key: "email", label: "Email" },
    { key: "status", label: "Status" },
    { key: "rating", label: "Rating" },
    { key: "completed_orders", label: "Order Selesai" },
    { key: "joined_date", label: "Tanggal Bergabung" },
    { key: "location", label: "Lokasi" },
    { key: "menu", label: "" },
];

export const DataTable = () => {
    const [selected, setSelected] = useState<number[]>([]);
    const allSelected = selected.length === DataMitra.length;

    const toggleSelectAll = () => {
        setSelected(allSelected ? [] : DataMitra.map((mitra) => mitra.id));
    };

    const toggleSelect = (id: number) => {
        setSelected((prev) =>
            prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
        );
    };

    return (
        <>
            <div className="flex items-center justify-between">
                <h1 className="font-semibold text-xl">
                    All Mitra {" "}
                    <span className="text-sm px-1 py-[1px] bg-mainColor/50 rounded-[5px]">
                        {DataMitra.length}
                    </span>
                </h1>
                <div className="flex items-center gap-2">
                    <div>
                        <div className="flex w-full items-center space-x-2">
                            <Input type="text" placeholder="Cari mitra..." icon={<Search size={16} />} />
                            <DropdownMenuCheckboxes />
                            <Button variant={"outline"}>
                                <PiExport />
                                Export Data
                            </Button>
                            <Button icon={<LuPlus size={16} />} className="pl-2 pr-4" iconPosition="left" variant="default" type="submit">Tambah Mitra</Button>
                        </div>
                    </div>
                    {selected.length > 0 && (
                        <div className="flex items-center gap-2 border border-neutral-500 rounded-xl pl-2 overflow-hidden">
                            <p className="text-sm cursor-pointer px-2" onClick={() => { setSelected([]) }}>
                                {selected.length} items selected
                            </p>
                            <Button className="border-l border-l-neutral-500 rounded-none text-red-400 dark:text-red-500" icon={<LuTrash2 />}>Delete</Button>
                        </div>
                    )}
                </div>
            </div>
            <div>

            </div>
            <Table>
                <TableHeader>
                    <TableRow>
                        {DataHeader.map((header) => (
                            <TableHead key={header.key} className={`${allSelected && "bg-mainColor/50 text-black dark:text-white"}`}>
                                {header.key === "select" ? (
                                    <Checkbox
                                        checked={allSelected}
                                        onCheckedChange={toggleSelectAll}
                                    />
                                ) : (
                                    header.label
                                )}
                            </TableHead>
                        ))}
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {DataMitra.map((mitra) => (
                        <TableRow key={mitra.id}>
                            {DataHeader.map((header) => (
                                <TableCell className={`${selected.includes(mitra.id) && "bg-mainColor text-black"}`} key={header.key}>
                                    {header.key === "select" ? (
                                        <Checkbox
                                            checked={selected.includes(mitra.id)}
                                            onCheckedChange={() => toggleSelect(mitra.id)}
                                        />
                                    ) : header.key === "menu" ? (
                                        <DropdownTable />
                                    ) : header.key === "name" ? (
                                        <div className="flex items-center gap-2">
                                            {mitra.photo_url && (
                                                <img
                                                    src={mitra.photo_url}
                                                    alt={mitra.name}
                                                    className="w-8 h-8 rounded-full"
                                                />
                                            )}
                                            <p>{mitra.name}</p>
                                        </div>
                                    ) : (
                                        mitra[header.key as keyof Mitra]
                                    )}
                                </TableCell>
                            ))}
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                    <SelectData />
                    <p className="text-sm opacity-70">
                        items per page
                    </p>
                </div>
                <PaginationNumber />
            </div>
        </>
    );
};
