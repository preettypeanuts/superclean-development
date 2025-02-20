"use client";
import { useState } from "react";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "./ui/table";
import { Checkbox } from "./ui/checkbox";
import { Button } from "./ui/button";
import { LuLink2, LuTrash2 } from "react-icons/lu";
import { BsThreeDotsVertical } from "react-icons/bs";
import { Modal } from "@shared/components/Modal";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { AiOutlineUsergroupDelete } from "react-icons/ai";

// Define a generic TableHeader type
interface TableHeader {
    key: string;
    label: string;
}

// Define a generic DataTableProps to allow flexibility with different data types
interface DataTableProps<T> {
    data: T[];
    columns: TableHeader[];
}

export const DataTable = <T extends object>({ data, columns }: DataTableProps<T>) => {
    const [selected, setSelected] = useState<number[]>([]);
    const [selectedData, setSelectedData] = useState<T | null>(null);
    const [editableData, setEditableData] = useState<T | null>(null);
    const allSelected = selected.length === data.length;

    const toggleSelectAll = () => {
        setSelected(allSelected ? [] : data.map((item) => (item as any).id)); // Casting ke any untuk mendapatkan id
    };

    const toggleSelect = (id: number) => {
        setSelected((prev) =>
            prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
        );
    };

    const openModal = (item: T) => {
        setSelectedData(item);
        setEditableData({ ...item });
        const modal = document.getElementById("master-data") as HTMLDialogElement | null;
        modal?.showModal();
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (!editableData) return;
        setEditableData({ ...editableData, [e.target.name]: e.target.value });
    };

    return (
        <>
            {selected.length > 0 && (
                <div className="flex justify-end">
                    <div className="flex items-center gap-2 w-fit border border-neutral-500 rounded-xl pl-2 overflow-hidden">
                        <p className="text-sm cursor-pointer px-2" onClick={() => setSelected([])}>
                            {selected.length} items selected
                        </p>
                        <Button
                            onClick={() => {
                                const modal = document.getElementById('delete-user') as HTMLDialogElement | null;
                                if (modal) {
                                    modal.showModal();
                                }
                            }}
                            className="border-l border-l-neutral-500 rounded-none text-red-400 dark:text-red-500" icon={<LuTrash2 />}>
                            Delete
                        </Button>
                    </div>
                </div>
            )}
            <Modal id="delete-user" className="!max-w-[25lvw]">
                <div className="flex flex-col justify-center items-center gap-5">
                    <div className="text-5xl">
                        <AiOutlineUsergroupDelete />
                    </div>
                    <h1 className="font-bold text-xl">
                        Are you sure to delete this user?
                    </h1>
                    <p>
                        {selected.length} user selected.
                    </p>
                    <div className="flex items-center gap-2 w-full">
                        <Button variant={"outline"} className="w-full">
                            Cancel
                        </Button>
                        <Button variant={"destructive"} className="w-full">
                            Hapus User
                        </Button>
                    </div>
                </div>
            </Modal>
            <Table>
                <TableHeader>
                    <TableRow>
                        {columns.map((header) => (
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
                    {data.map((item, index) => (
                        <TableRow key={index}>
                            {columns.map((header) => (
                                <TableCell className={`${selected.includes((item as any).id) && "bg-mainColor text-black"}`} key={header.key}>
                                    {header.key === "select" ? (
                                        <Checkbox
                                            checked={selected.includes((item as any).id)}
                                            onCheckedChange={() => toggleSelect((item as any).id)}
                                        />
                                    ) : header.key === "menu" ? (
                                        <Button
                                            size={"icon"}
                                            variant={"ghost"}
                                            className="rotate-90"
                                            onClick={() => openModal(item)} // Buka modal dengan data item
                                        >
                                            <BsThreeDotsVertical />
                                        </Button>
                                    ) : header.key === "name" ? (
                                        <div className="flex items-center gap-2">
                                            {(item as any).photo_url && (
                                                <img
                                                    src={(item as any).photo_url}
                                                    alt={(item as any).name}
                                                    className="w-8 h-8 rounded-full"
                                                />
                                            )}
                                            <p>{(item as any).name}</p>
                                        </div>
                                    ) : header.key === "payment_status" ? (
                                        <p className={`${(item as any).payment_status === "Lunas" ? "text-green-400 bg-green-400/20" : "text-red-400 bg-red-400/20"}
                                                       font-medium px-2 py-[1px] rounded-full w-fit`}>
                                            {(item as any).payment_status}
                                        </p>
                                    ) : header.key === "status" ? (
                                        <p className={`${(item as any).status === "Selesai" ? "text-green-400 bg-green-400/20" : "text-orange-400 bg-orange-400/20"} 
                                                       ${(item as any).status === "Batal" && "!text-red-400 !bg-red-400/20"}
                                                        font-medium px-2 py-[1px] rounded-full w-fit`}>
                                            {(item as any).status}
                                        </p>
                                    )
                                        : (
                                            (item as any)[header.key]
                                        )}
                                </TableCell>
                            ))}
                        </TableRow>
                    ))}
                </TableBody>
            </Table>

            {/* MODAL */}
            <Modal id="master-data">
                {editableData ? (
                    <div>
                        <div className="flex items-center gap-3 mb-5 border-b border-neutral-500/50 pb-5 bg-white/50 dark:bg-black/20 -m-6 py-4 px-6">
                            <div className="flex items-center justify-between w-full">
                                <div className="flex items-center gap-3">
                                    {(editableData as any).photo_url && (
                                        <img
                                            src={(editableData as any).photo_url}
                                            alt={(editableData as any).name}
                                            className="w-14 h-14 rounded-full"
                                        />
                                    )}
                                    <div>
                                        <h2 className="text-md font-semibold">{(editableData as any).name}</h2>
                                        <p className="text-sm">{(editableData as any).role}</p>
                                    </div>
                                </div>
                                <div>
                                    <Button variant="outline" size="sm">
                                        <LuLink2 size={10} /> Copy Link
                                    </Button>
                                </div>
                            </div>
                        </div>
                        <form className="space-y-4">
                            <div>
                                <Label>Email</Label>
                                <Input name="email" value={(editableData as any).email} onChange={handleChange} />
                            </div>
                            <div>
                                <Label>Phone</Label>
                                <Input name="phone" value={(editableData as any).phone} onChange={handleChange} />
                            </div>
                            <div>
                                <Label>Status</Label>
                                <Input name="status" value={(editableData as any).status} onChange={handleChange} />
                            </div>
                            <div>
                                <Label>Rating</Label>
                                <Input name="rating" value={(editableData as any).rating.toString()} onChange={handleChange} />
                            </div>
                            <div>
                                <Label>Completed Orders</Label>
                                <Input name="completed_orders" value={(editableData as any).completed_orders.toString()} onChange={handleChange} />
                            </div>
                            <div>
                                <Label>Joined Date</Label>
                                <Input name="joined_date" value={(editableData as any).joined_date} onChange={handleChange} />
                            </div>
                            <div>
                                <Label>Location</Label>
                                <Input name="location" value={(editableData as any).location} onChange={handleChange} />
                            </div>
                            <div className="flex gap-2">
                                <Button
                                    onClick={() => {
                                        const modal = document.getElementById('delete-user') as HTMLDialogElement | null;
                                        if (modal) { modal.showModal(); }
                                    }}
                                    variant={"destructive"}
                                    className="w-full">
                                    Hapus User
                                </Button>
                                <Button className="w-full">
                                    Simpan Perubahan
                                </Button>
                            </div>
                        </form>
                    </div>
                ) : (
                    <p>Loading data...</p>
                )}
            </Modal>
        </>
    );
};
