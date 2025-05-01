import Link from "next/link";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "./ui/table";
import { Button } from "./ui/button";
import { HiMiniPencilSquare } from "react-icons/hi2";
import { IoMdTrash } from "react-icons/io";
import { api } from "libs/utils/apiClient";
import { useToast } from "libs/ui-components/src/hooks/use-toast";
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
import { TrxStatus } from "../../../shared/src/data/system";

interface TableHeader {
  key: string;
  label: string;
}

interface Pembayaran {
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
  data: Pembayaran[];
  columns: TableHeader[];
  currentPage: number;
  limit: number;
  fetchData: () => void;
}

export const PembayaranTable: React.FC<DataTableProps> = ({
  data,
  columns,
  currentPage,
  limit,
  fetchData,
}) => {
  const { toast } = useToast();

  const statusLabels: Record<number, string> = {
    [TrxStatus.TODO]: "Baru",
    [TrxStatus.ACCEPT]: "Proses",
    [TrxStatus.CANCEL]: "Batal",
    [TrxStatus.PAYMENT]: "Menunggu Bayar",
    [TrxStatus.PAID]: "Sudah Bayar",
    [TrxStatus.SETTLED]: "Selesai",
  };

  const statusColors: Record<string, string> = {
    "Baru": "bg-neutral-500 text-neutral-600 dark:bg-neutral-600 dark:text-neutral-100",
    "Proses": "bg-yellow-500 text-yellow-600 dark:bg-yellow-600 dark:text-yellow-100",
    "Batal": "bg-red-500 text-red-600 dark:bg-red-600 dark:text-red-100",
    "Menunggu Bayar": "bg-orange-500 text-orange-600 dark:bg-orange-600 dark:text-orange-100",
    "Sudah Bayar": "bg-blue-500 text-blue-600 dark:bg-blue-600 dark:text-blue-100",
    "Selesai": "bg-green-500 text-green-600 dark:bg-green-600 dark:text-green-100",
  };

  return (
    <Table>
      <TableHeader>
        <TableRow>
          {columns.map((header) => (
            <TableHead
              key={header.key}
              className={`${
                header.key === "menu" ? "w-[100px]" : ""
              } bg-neutral-300/30 dark:bg-neutral-500/30`}
            >
              {header.label}
            </TableHead>
          ))}
        </TableRow>
      </TableHeader>
      <TableBody>
        {data.map((item, rowIndex) => (
          <TableRow
            key={item.id}
            className={rowIndex % 2 === 0 ? "" : "bg-neutral-300/20 dark:bg-neutral-500/20"}
          >
            {columns.map((header) => {
              const value = item[header.key as keyof Pembayaran];

              if (header.key === "menu") {
                return (
                  <TableCell key="menu">
                    <div className="flex gap-2">
                      <Link href={`/transaksi/pembayaran/edit/${item.id}`}>
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
                            <DialogTitle>
                              Kamu yakin menghapus data {item.customerName}?
                            </DialogTitle>
                            <DialogDescription className="text-center">
                              Data akan terhapus permanen dan tidak dapat dikembalikan.
                            </DialogDescription>
                          </DialogHeader>
                          <div className="flex gap-2">
                            <DialogClose asChild>
                              <Button variant="secondary" className="w-full">Batal</Button>
                            </DialogClose>
                            <Button
                              variant="destructive"
                              className="w-full"
                              onClick={async () => {
                                try {
                                  const response = await api.delete(`/user/${item.id}`);
                                  if (response.status === "success") {
                                    toast({
                                      title: "Sukses!",
                                      description: `Pembayaran ${item.customerName} berhasil dihapus.`,
                                    });
                                    fetchData();
                                  } else {
                                    toast({
                                      title: "Gagal!",
                                      description: "Gagal menghapus pembayaran.",
                                      variant: "destructive",
                                    });
                                  }
                                } catch (error) {
                                  toast({
                                    title: "Error!",
                                    description: "Terjadi kesalahan saat menghapus data.",
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
                  </TableCell>
                );
              }

              if (header.key === "id") {
                return <TableCell key="id">{(currentPage - 1) * limit + rowIndex + 1}</TableCell>;
              }

              if (header.key === "finalPrice") {
                return <TableCell key="finalPrice">{formatRupiah(Number(value))}</TableCell>;
              }

              if (header.key === "trxDate") {
                return <TableCell key="trxDate">{formatDate(String(value))}</TableCell>;
              }

              if (header.key === "status") {
                const label = statusLabels[item.status] ?? item.status;
                return (
                  <TableCell key="status">
                    <span className={`badge bg-opacity-20 rounded-md !font-medium border-0 ${statusColors[label]}`}>
                      {label}
                    </span>
                  </TableCell>
                );
              }

              if (header.key === "customerName") {
                const label = statusLabels[item.status] ?? item.status;
                return (
                  <TableCell key="customerName">
                    <div className="flex items-center">
                      <div className={`mr-2 rounded-full w-[6px] h-[6px] ${statusColors[label]}`} />
                      <p>{item.customerName}</p>
                    </div>
                  </TableCell>
                );
              }

              return <TableCell key={header.key}>{String(value)}</TableCell>;
            })}
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
};
