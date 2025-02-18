"use client"
import { DataTable } from "libs/ui-components/src/components/data-table"
import { Header } from "@shared/components/Header"
import { Wrapper } from "libs/shared/src/components/Wrapper"
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

export default function UserPage() {
    const DataMitra = [
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

    const DataHeader = [
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

    return (
        <Wrapper>
            <Header
                label="Daftar Mitra"
                desc="Manage your team members and their account permissions here."
            />
            <div className="flex items-center justify-between">
                <h1 className="font-semibold text-xl">
                    All Mitra {" "}
                    <span className="text-sm px-1 py-[1px] bg-mainColor/50 rounded-[5px]">
                        {DataMitra.length}
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
                        <Button
                            onClick={() => {
                                const modal = document.getElementById('new-mitra') as HTMLDialogElement | null; if (modal) { modal.showModal(); }
                            }}
                            icon={<LuPlus size={16} />}
                            className="pl-2 pr-4"
                            iconPosition="left"
                            variant="default"
                            type="submit">
                            Tambah Mitra
                        </Button>
                    </div>
                </div>
            </div>
            <DataTable data={DataMitra} columns={DataHeader} />
            <div className="flex items-center justify-between mt-auto">
                <div className="flex items-center gap-2">
                    <SelectData />
                    <p className="text-sm opacity-70">
                        items per page
                    </p>
                </div>
                <PaginationNumber />
            </div>
            <Modal id="new-mitra">
                <form className="space-y-4">
                    <div>
                        <Label>Email</Label>
                        <Input name="email" />
                    </div>
                    <div>
                        <Label>Phone</Label>
                        <Input name="phone" />
                    </div>
                    <div>
                        <Label>Status</Label>
                        <Input name="status" />
                    </div>
                    <div>
                        <Label>Rating</Label>
                        <Input name="rating" />
                    </div>
                    <div>
                        <Label>Completed Orders</Label>
                        <Input name="completed_orders" />
                    </div>
                    <div>
                        <Label>Joined Date</Label>
                        <Input name="joined_date" />
                    </div>
                    <div>
                        <Label>Location</Label>
                        <Input name="location" />
                    </div>
                    <div className="flex gap-2">
                        <Button variant={"destructive"} className="w-full">
                            Cancel
                        </Button>
                        <Button className="w-full">
                            Simpan
                        </Button>
                    </div>
                </form>
            </Modal>
        </Wrapper>
    );
}