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
    const { toast } = useToast(); // Inisialisasi toast
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
                                                variant={"default"}
                                                className="bg-warning/25 text-warning border-warning"
                                            >
                                                <HiMiniPencilSquare />
                                            </Button>
                                        </Link>
                                        <Dialog>
                                            <DialogTrigger asChild>
                                                <Button
                                                    size={"icon"}
                                                    variant={"default"}
                                                >
                                                    <IoMdTrash />
                                                </Button>
                                            </DialogTrigger>
                                            <DialogContent>
                                                <DialogHeader className="flex items-center justify-center">
                                                    <div className="text-5xl text-destructive bg-destructive-foreground/10 rounded-lg p-2 w-fit my-5">
                                                        <IoMdTrash />
                                                    </div>
                                                    <DialogTitle>Kamu yakin menghapus akun {customer.fullname}?</DialogTitle>
                                                    <DialogDescription className="text-center">
                                                        Data akan terhapus permanent dan tidak dapat dikembalikan.
                                                    </DialogDescription>
                                                </DialogHeader>
                                                <div className="flex gap-2">
                                                    <Button
                                                        variant="secondary"
                                                        className="w-full"
                                                    >
                                                        Batal
                                                    </Button>
                                                    <Button
                                                        variant="destructive"
                                                        className="w-full"
                                                        onClick={async () => {
                                                            console.log(`Menghapus karyawan dengan ID: ${customer.id}`);
                                                            try {
                                                                const response = await api.delete(`/customer/${customer.id}`);

                                                                console.log("Response dari server:", response);

                                                                if (response.status === 'success') {
                                                                    toast({
                                                                        title: "Sukses!",
                                                                        description: `Karyawan ${customer.fullname} berhasil dihapus.`,
                                                                        variant: "default",
                                                                    });
                                                                    fetchData();
                                                                } else {
                                                                    console.error("Gagal menghapus karyawan:", response);
                                                                    toast({
                                                                        title: "Gagal!",
                                                                        description: "Terjadi kesalahan saat menghapus karyawan.",
                                                                        variant: "destructive",
                                                                    });
                                                                }
                                                            } catch (error) {
                                                                console.error("Error saat menghapus karyawan:", error);
                                                                toast({
                                                                    title: "Error!",
                                                                    description: "Terjadi kesalahan. Coba lagi nanti.",
                                                                    variant: "destructive",
                                                                });
                                                            }
                                                        }}

                                                    >
                                                        Hapus
                                                    </Button>
                                                </div>
                                            </DialogContent>
                                        </Dialog>
                                    </div>
                                ) : header.key === "createdAt" ? (
                                    <p>{formatDate(String(customer[header.key as keyof Pelanggan]))}</p>
                                ) : header.key === "address" ? (
                                    <p className="truncate-2 untruncate">
                                        {customer[header.key as keyof Pelanggan]}
                                    </p>
                                ) : header.key === "id" ? (
                                    <p>{(currentPage - 1) * limit + rowIndex + 1}</p>
                                ) : header.key === "status" ? (
                                    <p className={`badge truncate dark:bg-opacity-70 rounded-md !font-medium border-0 ${customer[header.key as keyof Pelanggan] === 1 ? "bg-green-200 text-green-900 dark:bg-green-500 dark:text-green-100" : "bg-red-200 text-red-900 dark:bg-red-500 dark:text-red-100"}`}>
                                        <span className={`mr-2 ${customer["status"] === 1 ? "bg-green-500" : "bg-red-500"} rounded-full w-[6px] h-[6px]`}></span>
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
        </Table>
    );
};
