"use client"
import { BiSolidUpArrow } from "react-icons/bi";
import { Card } from "../../../ui-components/src/components/ui/card";

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
            label: "Total SPK",
            order: totalOrders,
            percentage: 100,
            status: true
        },
        {
            label: "Order Diselesaikan",
            order: countByStatus("Selesai"),
            percentage: (countByStatus("Selesai") / totalOrders) * 100,
            status: true
        },
        {
            label: "Orderan Berjalan",
            order: countByStatus("Sedang Proses"),
            percentage: (countByStatus("Sedang Proses") / totalOrders) * 100,
            status: true
        },
        {
            label: "Menunggu Pembayaran",
            order: countByStatus("Sedang Proses"),
            percentage: (countByStatus("Sedang Proses") / totalOrders) * 100,
            status: true
        },
        {
            label: "Orderan Dibatalkan",
            order: countByStatus("Batal"),
            percentage: (countByStatus("Batal") / totalOrders) * 100,
            status: false
        },
    ];

    return chartData;
}

export const ChartOrder = () => {
    const data = getChartData(DataOrders);

    return (
        <section className="flex gap-2">
            {data.map((el, idx) => (
                <Card 
                    key={idx} 
                    className={`p-5 w-fit space-y-3 rounded-3xl border border-white/50 dark:border-neutral-500/50 ${el.status ? 'bg-green-100' : 'bg-red-100'}`}
                >
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
