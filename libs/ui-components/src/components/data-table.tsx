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

interface TableHeader {
    key: string;
    label: string;
}

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

interface DataTableProps {
    data: Mitra[];
    columns: TableHeader[];
}

export const DataTable: React.FC<DataTableProps> = ({ data, columns }) => {
    const [selected, setSelected] = useState<number[]>([]);
    const [selectedMitra, setSelectedMitra] = useState<Mitra | null>(null);
    const [editableData, setEditableData] = useState<Mitra | null>(null);
    const allSelected = selected.length === data.length;

    const toggleSelectAll = () => {
        setSelected(allSelected ? [] : data.map((mitra) => mitra.id));
    };

    const toggleSelect = (id: number) => {
        setSelected((prev) =>
            prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
        );
    };

    const openModal = (mitra: Mitra) => {
        setSelectedMitra(mitra);
        setEditableData({ ...mitra });
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
                        <Button className="border-l border-l-neutral-500 rounded-none text-red-400 dark:text-red-500" icon={<LuTrash2 />}>Delete</Button>
                    </div>
                </div>
            )}
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
                    {data.map((mitra) => (
                        <TableRow key={mitra.id}>
                            {columns.map((header) => (
                                <TableCell className={`${selected.includes(mitra.id) && "bg-mainColor text-black"}`} key={header.key}>
                                    {header.key === "select" ? (
                                        <Checkbox
                                            checked={selected.includes(mitra.id)}
                                            onCheckedChange={() => toggleSelect(mitra.id)}
                                        />
                                    ) : header.key === "menu" ? (
                                        <Button
                                            size={"icon"}
                                            variant={"ghost"}
                                            className="rotate-90"
                                            onClick={() => openModal(mitra)} // Buka modal dengan data mitra
                                        >
                                            <BsThreeDotsVertical />
                                        </Button>
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

            {/* MODAL */}
            <Modal id="master-data">
                {editableData ? (
                    <div>
                        <div className="flex items-center gap-3 mb-5 border-b border-neutral-500/50 pb-5 bg-white/50 dark:bg-black/20 -m-6 py-4 px-6">
                            <div className="flex items-center justify-between w-full">
                                <div className="flex items-center gap-3">
                                    {editableData.photo_url && (
                                        <img
                                            src={editableData.photo_url}
                                            alt={editableData.name}
                                            className="w-14 h-14 rounded-full"
                                        />
                                    )}
                                    <div>
                                        <h2 className="text-md font-semibold">{editableData.name}</h2>
                                        <p className="text-sm">{editableData.role}</p>
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
                                <Input name="email" value={editableData.email} onChange={handleChange} />
                            </div>
                            <div>
                                <Label>Phone</Label>
                                <Input name="phone" value={editableData.phone} onChange={handleChange} />
                            </div>
                            <div>
                                <Label>Status</Label>
                                <Input name="status" value={editableData.status} onChange={handleChange} />
                            </div>
                            <div>
                                <Label>Rating</Label>
                                <Input name="rating" value={editableData.rating.toString()} onChange={handleChange} />
                            </div>
                            <div>
                                <Label>Completed Orders</Label>
                                <Input name="completed_orders" value={editableData.completed_orders.toString()} onChange={handleChange} />
                            </div>
                            <div>
                                <Label>Joined Date</Label>
                                <Input name="joined_date" value={editableData.joined_date} onChange={handleChange} />
                            </div>
                            <div>
                                <Label>Location</Label>
                                <Input name="location" value={editableData.location} onChange={handleChange} />
                            </div>
                            <Button className="w-full">
                                Simpan Perubahan
                            </Button>
                        </form>
                    </div>
                ) : (
                    <p>Loading data...</p>
                )}
            </Modal>
        </>
    );
};
