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

interface Karyawan {
    id: number;
    kodeLayanan: string;
    namaLayanan: string;
    kategori: string;
    hargaVacuum: number;
    hargaCuci: number;
    status: string;
}

interface DataTableProps {
    data: Karyawan[];
    columns: TableHeader[];
}

export const TableLayanan: React.FC<DataTableProps> = ({ data, columns }) => {
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
                    <TableRow key={rowIndex} className={rowIndex % 2 === 0 ? "" : "bg-neutral-300/20 dark:bg-neutral-500/20"}>
                        {columns.map((header) => (
                            <TableCell key={header.key} className={`${header.key === "menu" && "!w-fit"}`}>
                                {header.key === "menu" ? (
                                    <div className="w-fit flex gap-2">
                                        <Link href={`/master-data/karyawan/edit/${slugify(mitra.namaLayanan)}`}>
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
                                ) : header.key === "status" ? (
                                    <p className={`badge dark:bg-opacity-70 rounded-md !font-medium border-0 ${mitra[header.key as keyof Karyawan] === "Aktif" ? "bg-green-500 text-green-100" : "bg-red-500 text-red-100"}`}>
                                        {mitra[header.key as keyof Karyawan]}
                                    </p>
                                ) : header.key === "aksesPengguna" ? (
                                    <p className={`badge dark:bg-opacity-70 rounded-md !font-medium border-0 ${mitra[header.key as keyof Karyawan] === "Admin" ? "bg-blue-500/20 text-blue-500" : "bg-mainColor/20 text-mainColor"}`}>
                                        {mitra[header.key as keyof Karyawan]}
                                    </p>
                                ) : header.key === "userName" ? (
                                    <div className="flex items-center">
                                        <span className={`mr-2 ${mitra["status"] === "Aktif" ? "bg-green-500" : "bg-red-500"} rounded-full w-[6px] h-[6px]`}></span>
                                        <p>{mitra[header.key as keyof Karyawan]}</p>
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
