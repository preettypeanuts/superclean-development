import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "./ui/table";
import { Button } from "./ui/button";
import { HiMiniPencilSquare } from "react-icons/hi2";
import { IoMdTrash } from "react-icons/io";
import { formatDate } from "../../../utils/formatDate"
import Link from "next/link";
import { api } from "libs/utils/apiClient";
import { useToast } from "libs/ui-components/src/hooks/use-toast"
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "./ui/dialog";
import { useState } from "react";
import { DeleteDialog } from "libs/ui-components/src/components/delete-dialog";

interface TableHeader {
    key: string;
    label: string;
}

interface Pelanggan {
    id: string;
    createdAt: string;
    createdBy: string;
    noWhatsapp: string;
    customerType: string;
    fullname: string;
    address: string;
    province: string;
    city: string;
    district: string;
    subDistrict: string;
    status: number;
}

interface DataTableProps {
    data: Pelanggan[];
    columns: TableHeader[];
    currentPage: number;
    limit: number;
    fetchData: () => void;

}

export const TablePelanggan: React.FC<DataTableProps> = ({ data, columns, currentPage, limit, fetchData }) => {
    const { toast } = useToast();
    const [isDialogOpen, setIsDialogOpen] = useState(false);
    const [selectedCustomer, setSelectedCustomer] = useState<Pelanggan | null>(null);

    const handleDelete = async (customerId: string, fullname: string) => {
        try {
            const response = await api.delete(`/customer/${customerId}`);
            if (response.status === "success") {
                toast({
                    title: "Sukses!",
                    description: `${fullname} berhasil dihapus.`,
                    variant: "default",
                });
                fetchData();
            } else {
                toast({
                    title: "Gagal!",
                    description: "Terjadi kesalahan saat menghapus pelanggan.",
                    variant: "destructive",
                });
            }
        } catch (error) {
            toast({
                title: "Error!",
                description: "Terjadi kesalahan. Coba lagi nanti.",
                variant: "destructive",
            });
        } finally {
            setIsDialogOpen(false);
        }
    };
    return (
        <Table>
            <TableHeader>
                <TableRow>
                    {columns.map((header) => (
                        <TableHead key={header.key} className={`${header.key === "menu" && "w-[100px]"}`}>
                            {header.label}
                        </TableHead>
                    ))}
                </TableRow>
            </TableHeader>
            <TableBody>
                {data.map((customer, rowIndex) => (
                    <TableRow key={customer.id} className={rowIndex % 2 === 0 ? "" : "bg-neutral-300/20 dark:bg-neutral-500/20"}>
                        {columns.map((header) => (
                            <TableCell key={header.key} className={`${header.key === "menu" && "!w-fit"} truncate-paren`}>
                                {header.key === "menu" ? (
                                    <div className="w-fit flex gap-2">
                                        <Link href={`/master-data/pelanggan/edit/${customer.id}`}>
                                            <Button
                                                size={"icon"}
                                                variant={"main"}
                                            >
                                                <HiMiniPencilSquare />
                                            </Button>
                                        </Link>
                                        <Button
                                            size="icon"
                                            variant="destructive"
                                            onClick={() => {
                                                setSelectedCustomer(customer);
                                                setIsDialogOpen(true);
                                            }}
                                        >
                                            <IoMdTrash />
                                        </Button>
                                    </div>
                                ) : header.
                                key === "createdAt" ? (
                                    <p>{formatDate(String(customer[header.key as keyof Pelanggan]))}</p>
                                ) : header.key === "address" ? (
                                    <p className="truncate-2 untruncate">
                                        {customer[header.key as keyof Pelanggan]}
                                    </p>
                                ) : header.key === "id" ? (
                                    <p>{(currentPage - 1) * limit + rowIndex + 1}</p>
                                ) : header.key === "status" ? (
                                    <p className={`badge truncate dark:bg-opacity-70 rounded-md !font-medium border-0 ${customer[header.key as keyof Pelanggan] === 1 ? "bg-green-200 text-green-900 dark:bg-green-500 dark:text-green-100" : "bg-red-200 text-red-900 dark:bg-red-500 dark:text-red-100"}`}>
                                        <span className={`mr-2 ${customer["status"] === 1 ?  "bg-green-500 dark:bg-green-200" : "bg-red-500 dark:bg-red-200"} rounded-full w-[6px] h-[6px]`}></span>
                                        {customer[header.key as keyof Pelanggan] === 1 ? "Aktif" : "Tidak Aktif"}
                                    </p>
                                ) : header.key === "fullname" ? (
                                    <div className="flex items-center">
                                        <span className={`mr-2 ${customer["status"] === 1 ? "bg-green-500" : "bg-red-500"} rounded-full w-[6px] h-[6px]`}></span>
                                        <p>{customer[header.key as keyof Pelanggan]}</p>
                                    </div>
                                ) : (
                                    customer[header.key as keyof Pelanggan]
                                )}
                            </TableCell>
                        ))}
                    </TableRow>
                ))}
            </TableBody>
            {/* Delete Confirmation Dialog */}
            {selectedCustomer && (
                <DeleteDialog
                    open={isDialogOpen}
                    onOpenChange={setIsDialogOpen}
                    onConfirm={() => handleDelete(selectedCustomer.id, selectedCustomer.fullname)}
                    isLoading={false}
                    title={`Kamu yakin menghapus karyawan ${selectedCustomer.fullname}?`}
                    itemName={selectedCustomer.fullname}
                    cancelLabel="Batal"
                    confirmLabel="Hapus"
                />
            )}
        </Table>
    );
};
