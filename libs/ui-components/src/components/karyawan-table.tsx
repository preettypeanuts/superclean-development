import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "./ui/table";
import { Button } from "./ui/button";
import { LuTrash2, LuPencilLine } from "react-icons/lu";
import slugify from "libs/utils/slugify"
import Link from "next/link";

interface TableHeader {
    key: string;
    label: string;
}

interface Karyawan {
    id: number;
    userName: string;
    name: string;
    phone: string;
    status: string;
}

interface DataTableProps {
    data: Karyawan[];
    columns: TableHeader[];
}

export const TableKaryawan: React.FC<DataTableProps> = ({ data, columns }) => {
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
                {data.map((mitra) => (
                    <TableRow key={mitra.id}>
                        {columns.map((header) => (
                            <TableCell key={header.key} className={`${header.key === "menu" && "!w-fit"}`}>
                                {header.key === "menu" ? (
                                    <div className="w-fit flex gap-2">
                                        <Link href={`/master-data/karyawan/edit/${slugify(mitra.name)}`}>
                                            <Button
                                                size={"icon"}
                                                variant={"outline"}
                                                className="text-warning border-warning"
                                            >
                                                <LuPencilLine />
                                            </Button>
                                        </Link>
                                        <Button
                                            size={"icon"}
                                            variant={"outline"}
                                            className="text-destructive border-destructive"
                                        >
                                            <LuTrash2 />
                                        </Button>
                                    </div>
                                ) : header.key === "status" ? (
                                    <p className={`badge dark:bg-opacity-70 rounded-md !font-medium border-0 ${mitra[header.key as keyof Karyawan] === "Aktif" ? "bg-green-500 text-green-100" : "bg-red-500 text-red-100"}`}>
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
