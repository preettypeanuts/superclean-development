import Link from "next/link";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow, } from "./ui/table";
import { Button } from "./ui/button";
import { PiNewspaperFill } from "react-icons/pi";
import { formatRupiah } from "libs/utils/formatRupiah";
import { formatDate } from "libs/utils/formatDate";

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
    0: "Draft",
    1: "Pending", 
    3: "Menunggu Bayar",
    4: "Sudah Bayar",
    5: "Selesai",
  };

  const statusColors: Record<string, string> = {
    "Draft": "bg-gray-500 text-gray-600 dark:bg-gray-600 dark:text-gray-100",
    "Pending": "bg-yellow-500 text-yellow-600 dark:bg-yellow-600 dark:text-yellow-100",
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
                const colorClass = statusColors[label] ?? "bg-gray-500 text-gray-600";
                
                return (
                  <TableCell key="status">
                    <div className={`badge bg-opacity-20 rounded-md !font-medium border-0 truncate ${colorClass}`}>
                      <div className={`mr-2 rounded-full w-[6px] h-[6px] dark:brightness-50 ${colorClass}`} />
                      {label}
                    </div>
                  </TableCell>
                );
              }

              if (header.key === "trxNumber") {
                const label = statusLabels[item.status] ?? `Status ${item.status}`;
                const colorClass = statusColors[label] ?? "bg-gray-500 text-gray-600";
                
                return (
                  <TableCell key={`trxNumber-${item.id}`}>
                    <div className="flex items-center">
                      <div className={`mr-2 rounded-full w-[6px] h-[6px] ${colorClass}`} />
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