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

interface TableHeader {
  key: string;
  label: string;
}

interface SPKItem {
  id: string;
  kode: string;
  layanan: string;
  kategori: string;
  kategoriCode: string;
  jumlah: number;
  satuan: string;
  harga: number;
  promo: number;
  tipe?: string;
  promoCode?: string;
  promoType?: string;
}

interface DataTableProps {
  data: SPKItem[];
  columns: TableHeader[];
  currentPage: number;
  limit: number;
  fetchData: () => void;
  onDelete?: (id: string) => void;
  onEdit?: (item: SPKItem) => void;
}

export const SPKTableDetail: React.FC<DataTableProps> = ({
  data,
  columns,
  fetchData,
  onDelete,
  onEdit
}) => {
  const { toast } = useToast();

  const handleDelete = (item: SPKItem) => {
    if (onDelete) {
      onDelete(item.id);
    } else {
      console.log(`Menghapus SPK dengan ID: ${item.id}`);
      toast({
        title: "Sukses!",
        description: `SPK ${item?.kode} berhasil dihapus.`,
        variant: "default",
      });
      fetchData();
    }
  };

  const handleEdit = (item: SPKItem) => {
    if (onEdit) {
      onEdit(item);
    } else {
      console.log(`Mengedit SPK dengan ID: ${item.id}`);
      toast({
        title: "Info",
        description: `Edit functionality untuk ${item.kode} belum diimplementasi.`,
        variant: "default",
      });
    }
  };

  // Render value berdasarkan column key
  const renderCellValue = (item: SPKItem, columnKey: string, index: number) => {
    switch (columnKey) {
      case "no":
        return index + 1; // Nomor urut mulai dari 1
      case "jumlah":
        return `${item.jumlah} ${item.satuan}`;
      case "harga":
      case "servicePrice":
      case "totalPrice":
      case "totalHarga":
        return formatRupiah(item[columnKey as keyof SPKItem] as number);
      case "promo":
        return item.promoType === "Persentase"
          ? formatRupiah((item.promo as number) * (item.harga / 100) * item.jumlah)
          : formatRupiah(item.promo as number);
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
                  <DialogTitle>Kamu yakin menghapus item {item.kode}?</DialogTitle>
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
        return item[columnKey as keyof SPKItem];
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
