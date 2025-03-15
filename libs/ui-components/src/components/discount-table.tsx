import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "./ui/table";
import { Button } from "./ui/button";
import { HiMiniPencilSquare } from "react-icons/hi2";
import { IoMdTrash } from "react-icons/io";
import slugify from "../../../utils/slugify"
import Link from "next/link";
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
}

export const DiscountTable: React.FC<DataTableProps> = ({ data, columns }) => {
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
                {data.map((mitra, rowIndex) => (
                    <TableRow key={mitra.id} className={rowIndex % 2 === 0 ? "" : "bg-neutral-300/20 dark:bg-neutral-500/20"}>
                        {columns.map((header) => (
                            <TableCell key={header.key} className={`${header.key === "menu" && "!w-fit"}`}>
                                {header.key === "menu" ? (
                                    <div className="w-fit flex gap-2">
                                        <Link href={`/master-data/diskon/edit/${slugify(mitra.namaDiskon)}`}>
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
                                                    <DialogTitle>Kamu yakin menghapus akun {mitra.name}?</DialogTitle>
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
                                                    >
                                                        Hapus
                                                    </Button>
                                                </div>
                                            </DialogContent>
                                        </Dialog>
                                    </div>
                                ) : (
                                    mitra[header.key as keyof Column]
                                )}
                            </TableCell>
                        ))}
                    </TableRow>
                ))}
            </TableBody>
        </Table>
    );
};
