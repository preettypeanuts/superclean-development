import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "./ui/table";
import { Button } from "./ui/button";
import { HiMiniPencilSquare } from "react-icons/hi2";
import { IoMdTrash } from "react-icons/io";
import Link from "next/link";
import { api } from "libs/utils/apiClient";
import { useToast } from "libs/ui-components/src/hooks/use-toast";
import {
    Dialog,
    DialogTrigger,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogDescription,
} from "./ui/dialog";
import { formatRupiah } from "libs/utils/formatRupiah";
import { useCategoryStore } from "libs/utils/useCategoryStore";


interface TableHeader {
    key: string;
    label: string;
}

interface Service {
    id: string;
    code: string;
    name: string;
    category: string;
    unit: string;
    vacuumPrice: number;
    cleanPrice: number;
    generalPrice: number;
    status: number;
}

interface DataTableProps {
    data: Service[];
    columns: TableHeader[];
    currentPage: number;
    limit: number;
    fetchData: () => void;
}

export const TableLayanan: React.FC<DataTableProps> = ({ data, columns, currentPage, limit, fetchData }) => {
    const { toast } = useToast();
    const { unitLayananMapping, catLayananMapping, loading: loadingParams } = useCategoryStore();

    return (
        <Table>
            <TableHeader>
                <TableRow>
                    {columns.map((header) => (
                        <TableHead key={header.key} className={`${header.key === "menu" && "w-[100px]"} truncate`}>
                            {header.label}
                        </TableHead>
                    ))}
                </TableRow>
            </TableHeader>
            <TableBody>
                {data.map((layanan, rowIndex) => {
                    return (
                        <TableRow key={layanan.id} className={rowIndex % 2 === 0 ? "" : "bg-neutral-300/20 dark:bg-neutral-500/20"}>
                            {columns.map((header) => (
                                <TableCell key={header.key} className={`${header.key === "menu" && "!w-fit"}`}>
                                    {header.key === "menu" ? (
                                        <div className="w-fit flex gap-2">
                                            <Link href={`/master-data/layanan/edit/${layanan.id}`}>
                                                <Button size="icon" variant="default" className="bg-warning/25 text-warning border-warning">
                                                    <HiMiniPencilSquare />
                                                </Button>
                                            </Link>
                                            <Dialog>
                                                <DialogTrigger asChild>
                                                    <Button size="icon" variant="default" className="bg-destructive/25 text-destructive border-destructive">
                                                        <IoMdTrash />
                                                    </Button>
                                                </DialogTrigger>
                                                <DialogContent>
                                                    <DialogHeader className="flex items-center justify-center">
                                                        <div className="text-5xl text-destructive bg-destructive-foreground/10 rounded-full p-2 w-fit mb-4">
                                                            <IoMdTrash />
                                                        </div>
                                                        <DialogTitle>Kamu yakin menghapus layanan {layanan.name}?</DialogTitle>
                                                        <DialogDescription className="text-center">
                                                            Data akan terhapus permanen dan tidak dapat dikembalikan.
                                                        </DialogDescription>
                                                    </DialogHeader>
                                                    <div className="flex gap-2">
                                                        <Button variant="secondary" className="w-full">
                                                            Batal
                                                        </Button>
                                                        <Button
                                                            variant="destructive"
                                                            className="w-full"
                                                            onClick={async () => {
                                                                try {
                                                                    const response = await api.delete(`/service/${layanan.id}`);
                                                                    if (response.status === "success") {
                                                                        toast({
                                                                            title: "Sukses!",
                                                                            description: `Layanan ${layanan.name} berhasil dihapus.`,
                                                                            variant: "default",
                                                                        });
                                                                        fetchData();
                                                                    } else {
                                                                        toast({
                                                                            title: "Gagal!",
                                                                            description: "Terjadi kesalahan saat menghapus layanan.",
                                                                            variant: "destructive",
                                                                        });
                                                                    }
                                                                } catch (error) {
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
                                        <p className={`badge dark:bg-opacity-70 rounded-md !font-medium border-0 ${layanan.status ? "bg-green-200 text-green-900 dark:bg-green-500 dark:text-green-100" : "bg-red-200 text-red-900 dark:bg-red-500 dark:text-red-100"}`}>
                                            <span className={`mr-2 ${layanan.status ? "bg-green-500" : "bg-red-500"} rounded-full w-[6px] h-[6px]`}></span>
                                            {layanan.status ? "Aktif" : "Tidak Aktif"}
                                        </p>
                                    ) : header.key === "vacuumPrice" || header.key === "cleanPrice" ? (
                                        layanan[header.key as keyof Service] === 0 ? (
                                            <p >
                                                {formatRupiah(layanan[header.key as keyof Service] as number)}
                                            </p>
                                        ) : (
                                            <p >
                                                {formatRupiah(layanan[header.key as keyof Service] as number)}
                                            </p>
                                        )
                                    ) : header.key === "name" ? (
                                        <div className="flex items-center">
                                            <span className={`mr-2 ${layanan.status ? "bg-green-500" : "bg-red-500"} rounded-full w-[6px] h-[6px]`}></span>
                                            <p>{layanan[header.key as keyof Service]}</p>
                                        </div>
                                    ) : header.key === "id" ? (
                                        <p>{(currentPage - 1) * limit + rowIndex + 1}</p>
                                    ) : (
                                        layanan[header.key as keyof Service]
                                    )}
                                </TableCell>
                            ))}
                        </TableRow>
                    );
                })}
            </TableBody>
        </Table>
    );
};
