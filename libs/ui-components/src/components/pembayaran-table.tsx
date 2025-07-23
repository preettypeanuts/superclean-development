import Link from "next/link";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow, } from "./ui/table";
import { Button } from "./ui/button";
import { useToast } from "libs/ui-components/src/hooks/use-toast";
import { PiNewspaperFill } from "react-icons/pi";
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
  address: string;
  province: string;
  city: string;
  district: string;
  subDistrict: string;
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
    [TrxStatus.PAYMENT]: "Menunggu Bayar",
    [TrxStatus.PAID]: "Sudah Bayar",
    [TrxStatus.SETTLED]: "Selesai",
    [TrxStatus.REASSIGN]: "Dikerjakan Ulang",
  };

  const statusColors: Record<string, string> = {
    "Menunggu Bayar": "bg-yellow-500 text-yellow-600 dark:bg-yellow-600 dark:text-yellow-100",
    "Sudah Bayar": "bg-blue-500 text-blue-600 dark:bg-blue-600 dark:text-blue-100",
    "Selesai": "bg-green-500 text-green-600 dark:bg-green-600 dark:text-green-100",
    "Dikerjakan Ulang": "bg-orange-400 text-orange-600 dark:bg-orange-600 dark:text-orange-100",
  };

  return (
    <Table>
      <TableHeader>
        <TableRow>
          {columns.map((header) => (
            <TableHead
              key={header.key}
              className={`${header.key === "menu" ? "w-[50px]" : ""} truncate`}
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
                      <Link href={`/transaksi/pembayaran/detail/${item.trxNumber}`}>
                        <Button
                          size="icon"
                          variant="main"
                        >
                          <PiNewspaperFill />
                        </Button>
                      </Link>
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
                    <div className={`badge bg-opacity-20 rounded-md !font-medium border-0 truncate ${statusColors[label]}`}>
                      <div className={`mr-2 rounded-full w-[6px] h-[6px] ${statusColors[label]}`} />
                      {label}
                    </div>
                  </TableCell>
                );
              }

              if (header.key === "trxNumber") {
                const label = statusLabels[item.status] ?? item.status;
                return (
                  <TableCell key="trxNumber-customerName">
                    <div className="flex items-center">
                      <div className={`mr-2 rounded-full w-[6px] h-[6px] ${statusColors[label]}`} />
                      <p>{item.trxNumber}</p>
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
