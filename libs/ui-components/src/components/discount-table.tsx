import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "./ui/table";
import { Button } from "./ui/button";
import { HiMiniPencilSquare } from "react-icons/hi2";
import { IoMdTrash } from "react-icons/io";
import slugify from "../../../utils/slugify";
import Link from "next/link";
import { api } from "libs/utils/apiClient";
import { useToast } from "libs/ui-components/src/hooks/use-toast";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "./ui/dialog";
import { formatRupiah } from "libs/utils/formatRupiah";
import { formatDate, daysRemaining } from "../../../utils/formatDate"

interface TableHeader {
    key: string;
    label: string;
}

interface Column {
    id: number;
    kodeDiskon: string;
    namaDiskon: string;
    potonganHarga: string;
    layanan: string;
    minimal: number;
    masaBerlaku: string;
    category: string;
}

interface DataTableProps {
    data: Column[];
    columns: TableHeader[];
    currentPage: number;
    limit: number;
}

export const DiscountTable: React.FC<DataTableProps> = ({ data, columns, currentPage, limit }) => {
    const { toast } = useToast();

    return (
        <Table>
            <TableHeader>
                <TableRow>
                    {columns.map((header) => (
                        <TableHead key={header.key} className={`${header.key === "menu" && "w-[100px]"} bg-neutral-300/30 dark:bg-neutral-500/30`}>
                            {header.label}
                        </TableHead>
                    ))}
                </TableRow>
            </TableHeader>
            <TableBody>
                {data.map((discount, rowIndex) => (
                    <TableRow key={discount.id} className={rowIndex % 2 === 0 ? "" : "bg-neutral-300/20 dark:bg-neutral-500/20"}>
                        {columns.map((header) => (
                            <TableCell key={header.key} className={`${header.key === "menu" && "!w-fit"}`}>
                                {header.key === "menu" ? (
                                    <div className="w-fit flex gap-2">
                                        <Link href={`/master-data/diskon/edit/${discount.id}`} >
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
                                                    className="bg-destructive/25 text-destructive border-destructive"
                                                >
                                                    <IoMdTrash />
                                                </Button>
                                            </DialogTrigger>
                                            <DialogContent>
                                                <DialogHeader className="flex items-center justify-center">
                                                    <div className="text-5xl text-destructive bg-destructive-foreground/10 rounded-full p-2 w-fit mb-4" >
                                                        <IoMdTrash />
                                                    </div>
                                                    <DialogTitle>Kamu yakin menghapus diskon {discount.namaDiskon}?</DialogTitle>
                                                    <DialogDescription className="text-center">
                                                        Data akan terhapus permanen dan tidak dapat dikembalikan.
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
                                                            try {
                                                                const response = await api.delete(`/discount/${discount.id}`);
                                                                if (response.status === 'success') {
                                                                    toast({
                                                                        title: "Sukses!",
                                                                        description: `Diskon ${discount.namaDiskon} berhasil dihapus.`,
                                                                        variant: "default",
                                                                    });
                                                                    window.location.reload();
                                                                } else {
                                                                    toast({
                                                                        title: "Gagal!",
                                                                        description: "Terjadi kesalahan saat menghapus diskon.",
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
                                ) : header.key === "endDate" ? (
                                    <div className="relative group">
                                        <p
                                            className={`badge dark:bg-opacity-70 rounded-md !font-medium border-0 ${new Date(String(discount[header.key as keyof Column])) < new Date()
                                                ? "bg-red-500 text-red-100"
                                                : "bg-green-500 text-green-100"
                                                }`}
                                        >
                                            {formatDate(String(discount[header.key as keyof Column]))}
                                            <br />

                                        </p>
                                        <span className="absolute truncate left-[102px] top-1/2 transform -translate-y-1/2 hidden group-hover:inline-block bg-lightColor dark:bg-darkColor text-black shadow-custom dark:text-white text-xs rounded-lg px-2 py-1">
                                            {daysRemaining(String(discount[header.key as keyof Column]))}
                                        </span>
                                    </div>
                                ) : header.key === "category" ? (
                                    <p className="uppercase">
                                        {discount[header.key as keyof Column]}
                                    </p>
                                ) : header.key === "amount" ? (
                                    <p>
                                        {formatRupiah(Number(discount[header.key as keyof Column]))}
                                    </p>
                                ) : header.key === "minItem" ? (
                                    <p>
                                        {formatRupiah(Number(discount[header.key as keyof Column]))}
                                    </p>
                                ) : header.key === "id" ? (
                                    <p>{(currentPage - 1) * limit + rowIndex + 1}</p>
                                ) : (
                                    discount[header.key as keyof Column]
                                )}
                            </TableCell>
                        ))}
                    </TableRow>
                ))}
            </TableBody>
        </Table>
    );
};