// Removed unused import
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "./ui/table";
import { Button } from "./ui/button";
// Removed unused import
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
// Removed unused import
// Removed unused import
// Removed unused import

interface TableHeader {
    key: string;
    label: string;
}

interface SPK {
    id: string;
    kode: string;
    layanan: string;
    kategori: string;
    jumlah: number;
    satuan: string;
    harga: number;
    promo: number;
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

export const SPKTableDetail: React.FC<DataTableProps> = ({ data, columns, fetchData }) => {
    const { toast } = useToast(); // Inisialisasi toast
    // Removed unused variable


    return (
        <Table>
            <TableHeader>
                <TableRow>
                    {columns.map((header) => (
                        <TableHead
                            key={header.key}
                            className={`${header.key === "menu" ? "w-[100px]" : ""} capitalize bg-neutral-300/30 dark:bg-neutral-500/30`}
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
                            <TableCell key={header.key} className={`${header.key === "menu" ? "!w-fit" : ""}`}>
                                {header.key === "menu" ? (
                                    <div className="w-fit flex gap-2">
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
                                                    <DialogTitle>Kamu yakin menghapus akun {spk.kode}?</DialogTitle>
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
                                                                        description: `SPK ${spk.kode} berhasil dihapus.`,
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
                                ) : header.key === "jumlah" ? (
                                    spk[header.key as keyof SPK]
                                ) : header.key === "harga" || header.key === "promo" ? (
                                    formatRupiah(spk[header.key as keyof SPK] as number)
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
