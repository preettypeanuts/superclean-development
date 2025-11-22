import { useToast } from "libs/ui-components/src/hooks/use-toast";
import { api } from "libs/utils/apiClient";
import { formatRupiah } from "libs/utils/formatRupiah";
import Link from "next/link";
import { useState } from "react";
import { HiMiniPencilSquare } from "react-icons/hi2";
import { IoMdTrash } from "react-icons/io";
import { PiWarningCircleLight } from "react-icons/pi";
import { daysRemaining, formatDate } from "../../../utils/formatDate";
import { DeleteDialog } from "./delete-dialog";
import { Button } from "./ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "./ui/table";

interface TableHeader {
    key: string;
    label: string;
}

interface Column {
    id: number;
    kodeDiskon: string;
    code: string;
    name: string;
    namaDiskon: string;
    promoType: string;
    potonganHarga: string;
    layanan: string;
    serviceName: string;
    serviceCode: string;
    minimal: number;
    masaBerlaku: string;
    category: string;
}

interface DataTableProps {
    data: Column[];
    columns: TableHeader[];
    currentPage: number;
    limit: number;
    fetchData: () => void;
}

export const DiscountTable: React.FC<DataTableProps> = ({ data, columns, currentPage, limit, fetchData }) => {
    const { toast } = useToast();
    const [selectedDiscount, setSelectedDiscount] = useState<Column | null>(null);
    const [isDialogOpen, setIsDialogOpen] = useState(false);

    const handleDelete = async (id: number, name: string) => {
        try {
            const response = await api.delete(`/promo/${id}`);
            if (response.status === "success") {
                toast({
                    title: "Sukses!",
                    description: `Diskon ${name} berhasil dihapus.`,
                    variant: "success",
                });
                fetchData();
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
    };

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
                {data.map((discount, rowIndex) => (
                    <TableRow key={discount.id} className={rowIndex % 2 === 0 ? "" : "bg-neutral-300/20 dark:bg-neutral-500/20"}>
                        {columns.map((header) => (
                            <TableCell key={header.key} className={`${header.key === "menu" && "!w-fit"}`}>
                                {header.key === "menu" ? (
                                    <div className="w-fit flex gap-2">
                                        <Link href={`/master-data/promo/edit/${discount.id}`} >
                                            <Button
                                                size={"icon"}
                                                variant={"main"}
                                            >
                                                <HiMiniPencilSquare />
                                            </Button>
                                        </Link>
                                        <Button
                                            size="icon"
                                            variant="destructive"
                                            onClick={() => {
                                                setSelectedDiscount(discount);
                                                setIsDialogOpen(true);
                                            }}
                                        >
                                            <IoMdTrash />
                                        </Button>
                                    </div>
                                ) : header.key === "endDate" ? (
                                    <div className="relative group cursor-pointer flex items-center gap-1">
                                        <p className={`${new Date(String(discount[header.key as keyof Column])) < new Date()
                                            ? " text-red-500  dark:text-red-100"
                                            : " text-green-500 dark:text-green-100"
                                            }`}>
                                            <PiWarningCircleLight />
                                        </p>
                                        <p
                                            className={`badge dark:bg-opacity-70 rounded-md !font-medium border-0 ${new Date(String(discount[header.key as keyof Column])) < new Date()
                                                ? "bg-red-100 text-red-500 dark:bg-red-500 dark:text-red-100"
                                                : "bg-green-100 text-green-500 dark:bg-green-500 dark:text-green-100"
                                                }`}
                                        >
                                            {formatDate(String(discount[header.key as keyof Column]))}
                                        </p>
                                        <span className="absolute truncate left-[102px] top-1/2 transform -translate-y-1/2 hidden group-hover:inline-block bg-lightColor dark:bg-darkColor text-black shadow-custom dark:text-white text-xs rounded-lg px-2 py-1">
                                            {daysRemaining(String(discount[header.key as keyof Column]))}
                                        </span>
                                    </div>
                                ) : header.key === "serviceCode" ? (
                                    <p className="uppercase">
                                        {discount.serviceCode} -
                                        {" "}
                                        {discount.serviceName}
                                    </p>
                                ) : header.key === "category" ? (
                                    <p className="uppercase">
                                        {discount[header.key as keyof Column]}
                                    </p>
                                ) : header.key === "amount" ? (
                                    <p>
                                        {discount.promoType !== "Persentase"
                                            ? formatRupiah(Number(discount[header.key as keyof Column]))
                                            : `${discount[header.key as keyof Column]}%`}
                                    </p>
                                ) : header.key === "minItem" ? (
                                    <p>
                                        {(Number(discount[header.key as keyof Column]))}
                                    </p>
                                ) : header.key === "code" ? (
                                    <p className="uppercase">
                                        {((discount[header.key as keyof Column]))}
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
            {selectedDiscount && (
                <DeleteDialog
                    open={isDialogOpen}
                    onOpenChange={setIsDialogOpen}
                    onConfirm={() =>
                        handleDelete(selectedDiscount.id, selectedDiscount.name)
                    }
                    isLoading={false}
                    title={`Kamu yakin menghapus diskon ${selectedDiscount.code}  - ${selectedDiscount.name}?`}
                    itemName={selectedDiscount.namaDiskon}
                    cancelLabel="Batal"
                    confirmLabel="Hapus"
                />
            )}
        </Table>
    );
};