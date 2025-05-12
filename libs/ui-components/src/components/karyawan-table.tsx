import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "./ui/table";
import { Button } from "./ui/button";
import { HiMiniPencilSquare } from "react-icons/hi2";
import { IoMdTrash } from "react-icons/io";
import Link from "next/link";
import { api } from "libs/utils/apiClient";
import { useToast } from "libs/ui-components/src/hooks/use-toast"
import {
    Dialog,
    DialogClose,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "./ui/dialog";
import { formatDate } from "libs/utils/formatDate";

interface TableHeader {
    key: string;
    label: string;
}

interface Karyawan {
    id: string;
    createdAt: string;
    createdBy: string;
    username: string;
    fullname: string;
    noWhatsapp: string;
    branchId: number;
    roleId: string;
    status: number;
    birthDate: string;
}

interface DataTableProps {
    data: Karyawan[];
    columns: TableHeader[];
    currentPage: number;
    limit: number;
    fetchData: () => void; // Add fetchData property
}

export const TableKaryawan: React.FC<DataTableProps> = ({ data, columns, currentPage, limit, fetchData }) => {
    const { toast } = useToast(); // Inisialisasi toast
    const roleColors: Record<string, string> = {
        "Super Admin": "bg-white border-blue-600 text-blue-600 dark:bg-black dark:border-blue-300 dark:text-blue-300",
        "Administrasi": "bg-white border-yellow-600 text-yellow-600 dark:bg-black dark:border-yellow-300 dark:text-yellow-300",
        "Staff Blower": "bg-white border-green-600 text-green-600 dark:bg-black dark:border-green-300 dark:text-green-300",
        "Staff Cleaning": "bg-white border-purple-600 text-purple-600 dark:bg-black dark:border-purple-300 dark:text-purple-300",
        "Supervisor": "bg-white border-red-600 text-red-600 dark:bg-black dark:border-red-300 dark:text-red-300",
    };


    return (
        <Table>
            <TableHeader>
                <TableRow>
                    {columns.map((header) => (
                        <TableHead
                            key={header.key}
                            className={`${header.key === "menu" && "w-[100px]"}`}
                        >
                            {header.label}
                        </TableHead>
                    ))}
                </TableRow>
            </TableHeader>
            <TableBody>
                {data.map((mitra, rowIndex) => (
                    <TableRow
                        key={mitra.branchId}
                        className={rowIndex % 2 === 0 ? "" : "bg-neutral-300/20 dark:bg-neutral-500/20"}
                    >
                        {columns.map((header) => (
                            <TableCell key={header.key} className={header.key === "menu" ? "!w-fit" : ""}>
                                {header.key === "menu" ? (
                                    <div className="w-fit flex gap-2">
                                        <Link href={`/master-data/karyawan/edit/${mitra.id}`}>
                                            <Button
                                                size="icon"
                                                variant="main"
                                            >
                                                <HiMiniPencilSquare />
                                            </Button>
                                        </Link>
                                        <Dialog>
                                            <DialogTrigger asChild>
                                                <Button
                                                    size="icon"
                                                    variant="destructive"
                                                >
                                                    <IoMdTrash />
                                                </Button>
                                            </DialogTrigger>
                                            <DialogContent>
                                                <DialogHeader className="flex items-center justify-between">
                                                    <div className="text-5xl text-destructive bg-destructive-foreground/10 rounded-lg p-2 w-fit my-5">
                                                        <IoMdTrash />
                                                    </div>
                                                    <DialogTitle>Kamu yakin menghapus akun {mitra.fullname}?</DialogTitle>
                                                </DialogHeader>
                                                <div className="flex gap-2">
                                                    <DialogClose asChild>
                                                        <Button variant="outline2" className="w-full">
                                                            Batal
                                                        </Button>
                                                    </DialogClose>
                                                    <Button
                                                        variant="destructive"
                                                        className="w-full"
                                                        onClick={async () => {
                                                            console.log(`Menghapus karyawan dengan ID: ${mitra.id}`);
                                                            try {
                                                                const response = await api.delete(`/user/${mitra.id}`);

                                                                console.log("Response dari server:", response);

                                                                if (response.status === 'success') {
                                                                    toast({
                                                                        title: "Sukses!",
                                                                        description: `Karyawan ${mitra.fullname} berhasil dihapus.`,
                                                                        variant: "default", // Bisa diganti ke "success" jika tersedia
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
                                ) : header.key === "status" ? (
                                    <p className={`badge truncate dark:bg-opacity-70 rounded-md !font-medium border-0 ${mitra.status === 1 ? "bg-green-200 text-green-900 dark:bg-green-500 dark:text-green-100" : "bg-red-200 text-red-900 dark:bg-red-500 dark:text-red-100"}`}>
                                        <span className={`mr-2 ${mitra.status === 1 ? "bg-green-500 dark:bg-green-200" : "bg-red-500 dark:bg-red-200"} rounded-full w-[6px] h-[6px]`}></span>
                                        {mitra.status === 1 ? "Aktif" : "Tidak Aktif"}
                                    </p>
                                ) : header.key === "roleId" ? (
                                    <p className={`badge truncate rounded-md !font-medium border ${roleColors[mitra.roleId] || "border-neutral-500 text-neutral-500 dark:border-neutral-300 dark:text-neutral-300 bg-white dark:bg-black"}`}>
                                        {mitra.roleId}
                                    </p>
                                ) : header.key === "id" ? (
                                    <p>{(currentPage - 1) * limit + rowIndex + 1}</p>
                                ) : header.key === "createdAt" ? (
                                    <p>{formatDate(mitra.createdAt)}</p>
                                ) : header.key === "birthDate" ? (
                                    <p>{formatDate(mitra.birthDate)}</p>
                                ) : header.key === "noWhatsapp" ? (
                                    <p> {mitra.noWhatsapp}</p>
                                ) : header.key === "username" ? (
                                    <div className="flex items-center">
                                        <span className={`mr-2 ${mitra.status ? "bg-green-500" : "bg-red-500"} rounded-full w-[6px] h-[6px]`}></span>
                                        <p>{mitra.username}</p>
                                    </div>
                                ) : (
                                    mitra[header.key as keyof Karyawan]
                                )}
                            </TableCell>
                        ))}
                    </TableRow>
                ))}
            </TableBody>
        </Table>
    );
};
