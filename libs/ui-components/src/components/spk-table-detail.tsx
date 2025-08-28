import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "./ui/table";
import { Button } from "./ui/button";
import { IoMdTrash } from "react-icons/io";
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
import { HiMiniPencilSquare } from "react-icons/hi2";
import { Category, Service } from "@shared/utils/useCategoryStore";

interface TableHeader {
  key: string;
  label: string;
}

export interface PromoResponse {
  amount: number;
  code: string;
  type: "Persentase" | "Nominal";
}

export type PromoSPKItem = PromoResponse


export type SPKItemForm = {
  id?: string;

  category: Category | null;
  service: Service | null;

  // kategori: string;
  // kategoriCode: string;

  // kode: string;
  // layanan: string;
  // satuan: string;
  // harga: number;

  type: "vakum" | "cuci";
  jumlah: number;

  promo: PromoSPKItem | null;

  // promo: number;
  // promoCode?: string;
  // promoType?: string;

}

// interface SPKItem {
//   id: string;
//   kode: string;
//   layanan: string;
//   kategori: string;
//   kategoriCode: string;
//   jumlah: number;
//   satuan: string;
//   harga: number;
//   promo: number;
//   tipe?: string;
//   promoCode?: string;
//   promoType?: string;
// }

interface DataTableProps {
  data: SPKItemForm[];
  columns: TableHeader[];
  currentPage: number;
  limit: number;
  fetchData: () => void;
  onDelete?: (id: string) => void;
  onEdit?: (item: SPKItemForm) => void;
}

export const SPKTableDetail: React.FC<DataTableProps> = ({
  data,
  columns,
  fetchData,
  onDelete,
  onEdit
}) => {
  const { toast } = useToast();

  const handleDelete = (item: SPKItemForm) => {
    if (onDelete && item.id) {
      onDelete(item.id);
    } else {
      console.log(`Menghapus SPK dengan ID: ${item.id}`);
      toast({
        title: "Sukses!",
        description: `SPK berhasil dihapus.`,
        variant: "default",
      });
      fetchData();
    }
  };

  const handleEdit = (item: SPKItemForm) => {
    if (onEdit) {
      onEdit(item);
    } else {
      console.log(`Mengedit SPK dengan ID: ${item.id}`);
      toast({
        title: "Info",
        description: `Edit functionality untuk ${item.id} belum diimplementasi.`,
        variant: "default",
      });
    }
  };

  // Render value berdasarkan column key
  const renderCellValue = (item: SPKItemForm, columnKey: string, index: number) => {
    switch (columnKey) {
      case "no":
        return index + 1; // Nomor urut mulai dari 1
      case "jumlah":
        return `${item.jumlah} ${item.service?.unit}`;
      case "harga":
      case "servicePrice":
      case "totalPrice":
      case "totalHarga":
        return formatRupiah(item[columnKey as keyof SPKItemForm] as number);
      case "promo":
        if (!item.service) return formatRupiah(0);
        if (!item.promo) return formatRupiah(0);

        const {
          service,
          type,
          promo
        } = item;

        const {
          amount,
          code,
          type: promoType
        } = item.promo;

        const {
          cleanPrice,
          vacuumPrice,
        } = service;

        let price = 0;
        if (type === "cuci") {
          price = cleanPrice;
        } else if (type === "vakum") {
          price = vacuumPrice;
        }

        if (promoType === "Persentase") {
          return formatRupiah((amount / 100) * price * item.jumlah);
        } else {
          return formatRupiah(amount);
        }
      case "menu":
        return (
          <div className="w-fit flex gap-2">
            <Button
              size="icon"
              variant="main"
              onClick={() => handleEdit(item)}
            >
              <HiMiniPencilSquare />
            </Button>
            <Dialog>
              <DialogTrigger asChild>
                <Button
                  size="icon"
                  variant="destructive"
                >
                  <IoMdTrash />
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader className="flex items-center justify-center">
                  <div className="text-5xl text-destructive bg-destructive-foreground/10 rounded-full p-2 w-fit mb-4">
                    <IoMdTrash />
                  </div>
                  <DialogTitle>Kamu yakin menghapus item {item.service?.serviceName}?</DialogTitle>
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
                  <DialogClose asChild>
                    <Button
                      variant="destructive"
                      className="w-full"
                      onClick={() => handleDelete(item)}
                    >
                      Hapus
                    </Button>
                  </DialogClose>
                </div>
              </DialogContent>
            </Dialog>
          </div>
        );
      default:
        return <></>
      // return item[columnKey as keyof SPKItemForm];
    }
  };

  return (
    <Table>
      <TableHeader>
        <TableRow>
          {columns.map((header) => (
            <TableHead
              key={header.key}
              className={`${header.key === "menu" ? "w-[100px]" : ""} ${header.key === "no" ? "w-[80px]" : ""} capitalize truncate`}
            >
              {header.label}
            </TableHead>
          ))}
        </TableRow>
      </TableHeader>
      <TableBody>
        {data.length === 0 ? (
          <TableRow>
            <TableCell
              colSpan={columns.length}
              className="text-center py-8 text-muted-foreground"
            >
              Belum ada data SPK. Klik tombol "Tambah" untuk menambahkan item.
            </TableCell>
          </TableRow>
        ) : (
          data.map((item, rowIndex) => (
            <TableRow
              key={item.id}
              className={rowIndex % 2 === 0 ? "" : "bg-neutral-300/20 dark:bg-neutral-500/20"}
            >
              {columns.map((header) => {
                return (
                  <TableCell
                    key={header.key}
                    className={`${header.key === "menu" ? "!w-fit" : ""}`}
                  >
                    {renderCellValue(item, header.key, rowIndex)}
                  </TableCell>
                )
              })}
            </TableRow>
          ))
        )}
      </TableBody>
    </Table>
  );
};
