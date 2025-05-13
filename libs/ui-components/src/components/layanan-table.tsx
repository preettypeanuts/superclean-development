import Link from "next/link";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "./ui/table";
import { Button } from "./ui/button";
import { HiMiniPencilSquare } from "react-icons/hi2";
import { IoMdTrash } from "react-icons/io";
import { api } from "libs/utils/apiClient";
import { useToast } from "libs/ui-components/src/hooks/use-toast";
import { formatRupiah } from "libs/utils/formatRupiah";
import { useState } from "react";
import { DeleteDialog } from "./delete-dialog";


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
    const [isDialogOpen, setIsDialogOpen] = useState(false);
    const [selectedLayanan, setSelectedLayanan] = useState<Service | null>(null);

    const handleDelete = async (id: string, name: string) => {
        try {
            const response = await api.delete(`/service/${id}`);
            if (response.status === "success") {
                toast({
                    title: "Sukses!",
                    description: `Layanan ${name} berhasil dihapus.`,
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
        } finally {
            setIsDialogOpen(false);
        }
    };

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
                                                <Button
                                                    size="icon"
                                                    variant="main"
                                                >
                                                    <HiMiniPencilSquare />
                                                </Button>
                                            </Link>
                                            <Button
                                                size="icon"
                                                variant="destructive"
                                                onClick={() => {
                                                    setSelectedLayanan(layanan);
                                                    setIsDialogOpen(true);
                                                }}
                                            >
                                                <IoMdTrash />
                                            </Button>
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

            {selectedLayanan && (
                <DeleteDialog
                    open={isDialogOpen}
                    onOpenChange={setIsDialogOpen}
                    onConfirm={() => handleDelete(selectedLayanan.id, selectedLayanan.name)}
                    isLoading={false} // Atur jika butuh loading
                    title={`Kamu yakin menghapus layanan ${selectedLayanan.code} - ${selectedLayanan.name}?`}
                    itemName={selectedLayanan.name}
                    cancelLabel="Batal"
                    confirmLabel="Hapus"
                />
            )}

        </Table>
    );
};
