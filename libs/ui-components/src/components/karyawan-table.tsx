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
        "Super Admin": "bg-blue-500/20 text-blue-500",
        "Administrasi": "bg-yellow-500/20 text-yellow-500",
        "Staff Blower": "bg-green-500/20 text-green-500",
        "Staff Cleaning": "bg-purple-500/20 text-purple-500",
        "Supervisor": "bg-red-500/20 text-red-500",
    };


    return (
        <Table>
            <TableHeader>
                <TableRow>
                    {columns.map((header) => (
                        <TableHead
                            key={header.key}
                            className={`${header.key === "menu" ? "w-[100px]" : ""} bg-neutral-300/30 dark:bg-neutral-500/30`}
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
                                                variant="default"
                                                className="bg-warning/25 text-warning border-warning"
                                            >
                                                <HiMiniPencilSquare />
                                            </Button>
                                        </Link>
                                        <Dialog>
                                            <DialogTrigger asChild>
                                                <Button
                                                    size="icon"
                                                    variant="default"
                                                    className="bg-destructive/25 text-destructive border-destructive"
                                                >
                                                    <IoMdTrash />
                                                </Button>
                                            </DialogTrigger>
                                            <DialogContent>
                                                <DialogHeader className="flex items-center justify-center">
                                                    <div className="text-5xl text-destructive bg-destructive-foreground/10 rounded-full p-2 w-fit mb-4">
                                                        <IoMdTrash />
                                                    </div>
                                                    <DialogTitle>Kamu yakin menghapus akun {mitra.fullname}?</DialogTitle>
                                                    <DialogDescription className="text-center">
                                                        Data akan terhapus permanen dan tidak dapat dikembalikan.
                                                    </DialogDescription>
                                                </DialogHeader>
                                                <div className="flex gap-2">
                                                    <DialogClose asChild>
                                                        <Button variant="secondary" className="w-full">
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
                                    <p className={`badge dark:bg-opacity-70 rounded-md !font-medium border-0 ${mitra.status === 1 ? "bg-green-200 text-green-900 dark:bg-green-500 dark:text-green-100" : "bg-red-200 text-red-900 dark:bg-red-500 dark:text-red-100"}`}>
                                        {mitra.status === 1 ? "Aktif" : "Tidak Aktif"}
                                    </p>
                                ) : header.key === "roleId" ? (
                                    <p className={`badge rounded-md !font-medium border-0 ${roleColors[mitra.roleId] || "bg-gray-500 text-gray-100"}`}>
                                        {mitra.roleId}
                                    </p>
                                ) : header.key === "id" ? (
                                    <p>{(currentPage - 1) * limit + rowIndex + 1}</p>
                                ) : header.key === "noWhatsapp" ? (
                                    <p> {mitra.noWhatsapp}</p>
                                ) : header.key === "username" ? (
                                    <div className="flex items-center">
                                        <span
                                            className={`mr-2 ${mitra.status ? "bg-green-500" : "bg-red-500"
                                                } rounded-full w-[6px] h-[6px]`}
                                        ></span>
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
