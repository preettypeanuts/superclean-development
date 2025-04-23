import Link from "next/link";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "./ui/table";
import { Button } from "./ui/button";
import { HiMiniPencilSquare } from "react-icons/hi2";
import { IoMdTrash } from "react-icons/io";
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
import { formatRupiah } from "libs/utils/formatRupiah";
import { formatDate } from "libs/utils/formatDate";
import { TrxStatus } from "../../../shared/src/data/system"

interface TableHeader {
    key: string;
    label: string;
}

interface SPK {
    id: string;
    trxNumber: string;
    noWhatsapp: string;
    customerName: string;
    branchId: string;
    finalPrice: number;
    trxDate: string;
    status: number;
    createdBy: string;
    createdAt: string;
}

interface DataTableProps {
    data: SPK[];
    columns: TableHeader[];
    currentPage: number;
    limit: number;
    fetchData: () => void; // Add fetchData property
}

export const SPKTable: React.FC<DataTableProps> = ({ data, columns, currentPage, limit, fetchData }) => {
    const { toast } = useToast(); // Inisialisasi toast
    const statusColors: Record<string, string> = {
        "Baru": "bg-neutral-400 text-neutral-400",
        "Proses": "bg-yellow-500 text-yellow-500",
        "Batal": "bg-red-500 text-red-500",
        "Menunggu Bayar": "bg-orange-500 text-orange-500",
        "Sudah Bayar": "bg-blue-500 text-blue-500",
        "Selesai": "bg-green-500 text-green-500",
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
                {data.map((spk, rowIndex) => (
                    <TableRow
                        key={spk.id}
                        className={rowIndex % 2 === 0 ? "" : "bg-neutral-300/20 dark:bg-neutral-500/20"}
                    >
                        {columns.map((header) => (
                            <TableCell key={header.key} className={header.key === "menu" ? "!w-fit" : ""}>
                                {header.key === "menu" ? (
                                    <div className="w-fit flex gap-2">
                                        <Link href={`/transaksi/spk/edit/${spk.id}`}>
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
                                                    <DialogTitle>Kamu yakin menghapus akun {spk.customerName}?</DialogTitle>
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
                                                            console.log(`Menghapus SPK dengan ID: ${spk.id}`);
                                                            try {
                                                                const response = await api.delete(`/user/${spk.id}`);

                                                                console.log("Response dari server:", response);

                                                                if (response.status === 'success') {
                                                                    toast({
                                                                        title: "Sukses!",
                                                                        description: `SPK ${spk.customerName} berhasil dihapus.`,
                                                                        variant: "default", // Bisa diganti ke "success" jika tersedia
                                                                    });
                                                                    fetchData();
                                                                } else {
                                                                    console.error("Gagal menghapus SPK:", response);
                                                                    toast({
                                                                        title: "Gagal!",
                                                                        description: "Terjadi kesalahan saat menghapus SPK.",
                                                                        variant: "destructive",
                                                                    });
                                                                }
                                                            } catch (error) {
                                                                console.error("Error saat menghapus SPK:", error);
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
                                    <p className={`badge bg-opacity-20 rounded-md !font-medium border-0 ${statusColors[
                                        (() => {
                                            switch (spk.status) {
                                                case TrxStatus.TODO:
                                                    return "Baru";
                                                case TrxStatus.ACCEPT:
                                                    return "Proses";
                                                case TrxStatus.CANCEL:
                                                    return "Batal";
                                                case TrxStatus.PAYMENT:
                                                    return "Menunggu Bayar";
                                                case TrxStatus.PAID:
                                                    return "Sudah Bayar";
                                                case TrxStatus.SETTLED:
                                                    return "Selesai";
                                                default:
                                                    return (spk.status);
                                            }
                                        })()
                                    ]}`}>
                                        {(() => {
                                            switch (spk.status) {
                                                case TrxStatus.TODO:
                                                    return "Baru";
                                                case TrxStatus.ACCEPT:
                                                    return "Proses";
                                                case TrxStatus.CANCEL:
                                                    return "Batal";
                                                case TrxStatus.PAYMENT:
                                                    return "Menunggu Bayar";
                                                case TrxStatus.PAID:
                                                    return "Sudah Bayar";
                                                case TrxStatus.SETTLED:
                                                    return "Selesai";
                                                default:
                                                    return (spk.status);
                                            }
                                        })()}
                                    </p>
                                ) : header.key === "id" ? (
                                    <p>{(currentPage - 1) * limit + rowIndex + 1}</p>
                                ) : header.key === "noWhatsapp" ? (
                                    <p> {spk.noWhatsapp}</p>
                                ) : header.key === "finalPrice" ? (
                                    <p> {formatRupiah(Number(spk.finalPrice))}</p>
                                ) : header.key === "trxDate" ? (
                                    <p> {formatDate(spk.trxDate)}</p>
                                ) : header.key === "customerName" ? (
                                    <div className="flex items-center">
                                        <div
                                            className={`mr-2 rounded-full w-[6px] h-[6px] ${statusColors[
                                                (() => {
                                                    switch (spk.status) {
                                                        case TrxStatus.TODO:
                                                            return "Baru";
                                                        case TrxStatus.ACCEPT:
                                                            return "Proses";
                                                        case TrxStatus.CANCEL:
                                                            return "Batal";
                                                        case TrxStatus.PAYMENT:
                                                            return "Menunggu Bayar";
                                                        case TrxStatus.PAID:
                                                            return "Sudah Bayar";
                                                        case TrxStatus.SETTLED:
                                                            return "Selesai";
                                                        default:
                                                            return spk.status;
                                                    }
                                                })()
                                            ]}`}
                                        ></div>
                                        <p>{spk.customerName}</p>
                                    </div>
                                ) : (
                                    spk[header.key as keyof SPK]
                                )}
                            </TableCell>
                        ))}
                    </TableRow>
                ))}
            </TableBody>
        </Table>
    );
};
