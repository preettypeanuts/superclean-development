"use client"
import { BiSolidUpArrow } from "react-icons/bi";
import { Card } from "../../../ui-components/src/components/ui/card";

interface ChartProps {
    label: string,
    order: number,
    percentage: number,
    status: boolean
}

interface ChartOrderProps {
    data: ChartProps[]
}

const DataOrders = [
    { id: 1, status: "Selesai" },
    { id: 2, status: "Sedang Proses" },
    { id: 3, status: "Selesai" },
    { id: 4, status: "Batal" },
    { id: 5, status: "Selesai" },
    { id: 6, status: "Sedang Proses" },
    { id: 7, status: "Selesai" },
    { id: 8, status: "Batal" }
];

// Fungsi untuk menghitung jumlah order berdasarkan status
const getChartData = (orders: typeof DataOrders) => {
    const totalOrders = orders.length;
    const countByStatus = (status: string) => orders.filter(o => o.status === status).length;

    const chartData = [
        {
            label: "Total Order",
            order: totalOrders,
            percentage: 100,
            status: true
        },
        {
            label: "Canceled Order",
            order: countByStatus("Batal"),
            percentage: (countByStatus("Batal") / totalOrders) * 100,
            status: false
        },
        {
            label: "Ongoing Order",
            order: countByStatus("Sedang Proses"),
            percentage: (countByStatus("Sedang Proses") / totalOrders) * 100,
            status: true
        },
        {
            label: "Fulfilled Order",
            order: countByStatus("Selesai"),
            percentage: (countByStatus("Selesai") / totalOrders) * 100,
            status: true
        }
    ];

    return chartData;
}

export const ChartOrder = () => {
    const data = getChartData(DataOrders);

    return (
        <section className="flex gap-5">
            {data.map((el, idx) => (
                <Card key={idx} className="bg-white/70 dark:bg-black/30 p-5 w-fit space-y-3 rounded-2xl">
                    <span className="text-sm text-mainColor font-semibold">
                        {el.label}
                    </span>
                    <h1 className="text-4xl">
                        {el.order}
                    </h1>
                    <div className="flex items-center gap-2">
                        <span className={`${el.status ? "text-green-400" : "text-red-400 rotate-180"}`}>
                            <BiSolidUpArrow />
                        </span>
                        {el.percentage.toFixed(2)}% dari minggu lalu
                    </div>
                </Card>
            ))}
        </section>
    );
};
