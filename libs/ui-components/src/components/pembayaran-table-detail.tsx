import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "./ui/table";

interface TableHeader {
    key: string;
    label: string;
}

interface PembayaranItem {
    id: string;
    serviceCode: string;
    serviceCategory: string;
    serviceType: string;
    quantity: number;
    servicePrice: string; // Already formatted as string from parent
    promoCode: string;
    promoAmount: string; // Already formatted as string from parent
}

interface DataTableProps {
    data: PembayaranItem[];
    columns: TableHeader[];
    currentPage: number;
    limit: number;
    fetchData: () => void;
}

export const PembayaranTableDetail: React.FC<DataTableProps> = ({ 
    data, 
    columns
}) => {
    // Render value berdasarkan column key
    const renderCellValue = (item: PembayaranItem, columnKey: string, index: number) => {
        switch (columnKey) {
            case "id":
                return index + 1; // Nomor urut mulai dari 1
            case "serviceCode":
                return item.serviceCode;
            case "serviceCategory":
                return item.serviceCategory;
            case "serviceType":
                return item.serviceType;
            case "quantity":
                return item.quantity;
            case "servicePrice":
                return item.servicePrice; // Already formatted
            case "promoCode":
                return item.promoCode || "-";
            case "promoAmount":
                return item.promoAmount || "-"; // Already formatted
            default:
                return item[columnKey as keyof PembayaranItem];
        }
    };

    return (
        <Table>
            <TableHeader>
                <TableRow>
                    {columns.map((header) => (
                        <TableHead
                            key={header.key}
                            className={`${header.key === "id" ? "w-[80px]" : ""} capitalize truncate`}
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
                            Belum ada detail layanan untuk transaksi ini.
                        </TableCell>
                    </TableRow>
                ) : (
                    data.map((item, rowIndex) => (
                        <TableRow
                            key={item.id}
                            className={rowIndex % 2 === 0 ? "" : "bg-neutral-300/20 dark:bg-neutral-500/20"}
                        >
                            {columns.map((header) => (
                                <TableCell 
                                    key={header.key} 
                                    className={`${
                                        header.key === "servicePrice" || header.key === "promoAmount" 
                                            ? "text-right" 
                                            : ""
                                    }`}
                                >
                                    {renderCellValue(item, header.key, rowIndex)}
                                </TableCell>
                            ))}
                        </TableRow>
                    ))
                )}
            </TableBody>
        </Table>
    );    
    };