import Link from "next/link";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow, } from "./ui/table";
import { Button } from "./ui/button";
import { PiNewspaperFill } from "react-icons/pi";
import { formatRupiah } from "../../../utils/formatRupiah";
import { formatDate } from "../../../utils/formatDate";


interface TableHeader {
  key: string;
  label: string;
}

interface InquiryTransaksi {
  id: string;
  trxNumber: string;
  customerName: string;
  noWhatsapp: string;
  address: string;
  city: string;
  branchId: string;
  finalPrice: string; // API mengembalikan string, bukan number
  trxDate: string;
  status: number;
  customerId?: string;
  createdBy?: string;
  createdAt?: string;
}

interface DataTableProps {
  data: InquiryTransaksi[];
  columns: TableHeader[];
  currentPage: number;
  limit: number;
  fetchData: () => void;
}

export const InquiryTransaksiTable: React.FC<DataTableProps> = ({
  data,
  columns,
  currentPage,
  limit,
  fetchData,
}) => {

  const statusLabels: Record<number, string> = {
    0: "Baru",
    1: "Pending",
    3: "Menunggu Bayar",
    4: "Sudah Bayar",
    5: "Selesai",
  };

  const statusClasses: Record<string, string> = {
    "Baru": "bg-secondaryColor/20 text-secondaryColorDark dark:bg-secondaryColorDark/20 dark:text-secondaryColor",
    "Pending": "bg-yellow-100 text-yellow-800 dark:bg-yellow-600/20 dark:text-yellow-100",
    "Menunggu Bayar": "bg-orange-100 text-orange-800 dark:bg-orange-600/20 dark:text-orange-100",
    "Sudah Bayar": "bg-blue-100 text-blue-800 dark:bg-blue-600/20 dark:text-blue-100",
    "Selesai": "bg-green-100 text-green-800 dark:bg-green-600/20 dark:text-green-100",
  };

  const indicatorClasses: Record<string, string> = {
    "Baru": "bg-secondaryColorDark dark:bg-secondaryColor",
    "Pending": "bg-yellow-500 dark:bg-yellow-400",
    "Menunggu Bayar": "bg-orange-500 dark:bg-orange-400",
    "Sudah Bayar": "bg-blue-500 dark:bg-blue-400",
    "Selesai": "bg-green-500 dark:bg-green-400",
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
              const value = item[header.key as keyof InquiryTransaksi];

              if (header.key === "menu") {
                return (
                  <TableCell key="menu">
                    <div className="flex gap-2">
                      <Link href={`/transaksi/inquiry-transaksi/detail/${item.trxNumber}`}>
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
                // Konversi string ke number untuk formatting
                const price = typeof value === 'string' ? parseInt(value) : Number(value);
                return <TableCell key="finalPrice">{formatRupiah(price)}</TableCell>;
              }

              if (header.key === "trxDate") {
                return <TableCell key="trxDate">{formatDate(String(value))}</TableCell>;
              }

              if (header.key === "status") {
                const label = statusLabels[item.status] ?? `Status ${item.status}`;
                const badgeClass = statusClasses[label] ?? "bg-gray-200 text-gray-700";
                const dotClass = indicatorClasses[label] ?? "bg-gray-500";

                return (
                  <TableCell key="status">
                    <div className={`flex items-center gap-2 px-2 py-1 rounded-md text-sm font-medium w-fit truncate ${badgeClass}`}>
                      <div className={`w-[6px] h-[6px] rounded-full aspect-square ${dotClass}`} />
                      {label}
                    </div>
                  </TableCell>
                );
              }

              if (header.key === "trxNumber") {
                const label = statusLabels[item.status] ?? `Status ${item.status}`;
                const dotClass = indicatorClasses[label] ?? "bg-gray-500";

                return (
                  <TableCell key={`trxNumber-${item.id}`}>
                    <div className="flex items-center gap-2">
                      <div className={`w-[6px] h-[6px] rounded-full aspect-square ${dotClass}`} />
                      <p>{item.trxNumber}</p>
                    </div>
                  </TableCell>
                );
              }

              // Handle fields that might be undefined
              return (
                <TableCell key={header.key}>
                  {value !== undefined && value !== null ? String(value) : "-"}
                </TableCell>
              );
            })}
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
};