"use client"
import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
} from "../../../ui-components/src/components/ui/card";
import { Progress } from "../../../ui-components/src/components/ui/progress";

// Target pendapatan per karyawan (5 juta)
const TARGET_PENDAPATAN = 5000000;

// Data dummy pencapaian pendapatan karyawan
const rawData = [
    { name: "Minah", value: 6000000 },
    { name: "Jejen", value: 4000000 },
    { name: "Sutisna", value: 0 },
    { name: "Erik", value: 1200000 },
    { name: "Udin", value: 2000000 },
    { name: "John Doe", value: 2500000 },
    { name: "Jane Smith", value: 5300000 },
    { name: "Mike Johnson", value: 3000000 },
    { name: "Sarah Brown", value: 0 },
    { name: "Budi", value: 5000000 },
    { name: "Ani", value: 3500000 },
    { name: "Dewi", value: 4900000 },
    { name: "Tono", value: 1000000 },
    { name: "Siti", value: 3900000 },
    { name: "Rahmat", value: 0 },
    { name: "Yanto", value: 5200000 },
    { name: "Wati", value: 5000000 },
    { name: "Samsul", value: 0 },
    { name: "Rina", value: 4500000 },
];

// Function to process chart data
const processChartData = (data: { name: string, value: number }[]) => {
    return data.map((item) => {
        const percentage = (item.value / TARGET_PENDAPATAN) * 100;
        let fill;
        if (percentage >= 90) {
            fill = "bg-green-500"; // Hijau (90-100%)
        } else if (percentage >= 65) {
            fill = "bg-orange-500"; // Oranye (65-89%)
        } else {
            fill = "bg-yellow-500"; // Kuning (0-64%)
        }
        return {
            ...item,
            percentage: percentage.toFixed(1),
            fill,
        };
    }).sort((a, b) => b.value - a.value);
};

// Format angka ke Rupiah
const formatRupiah = (value: number) =>
    new Intl.NumberFormat("id-ID", { style: "currency", currency: "IDR" }).format(value);

export function ChartKaryawan() {
    const chartData = processChartData(rawData);

    return (
        <Card className="flex flex-col h-full relative">
            {/* Header tidak akan terganggu */}
            <div className="absolute top-0 gradient-blur-to-b h-[20%] bg-gradient-to-b from-white/50 via-white/30 dark:from-black/50 dark:via-black/30 to-transparent z-20 rounded-t-3xl"></div>

            <CardHeader className="z-30 absolute top-0 w-full">
                <CardTitle>Ringkasan Target Teknisi</CardTitle>
                <CardDescription>
                    Total Pendapatan: {formatRupiah(chartData.reduce((total, item) => total + item.value, 0))}
                </CardDescription>
            </CardHeader>

            {/* Content yang grow dan scroll saat overflow */}
            {/* <div className="absolute bottom-0 gradient-blur-to-t h-[15%] bg-gradient-to-t from-white/50 via-white/30 dark:from-black/50 dark:via-black/30 to-transparent z-30 rounded-b-3xl"></div> */}
            <CardContent className="flex-grow overflow-auto py-24 no-scrollbar space-y-2">
                {chartData.map((el, idx) => (
                    <div key={idx}>
                        <div className={`flex items-center justify-between ${el.fill} rounded-t-md bg-opacity-20 px-3 pt-1 pb-3 -mb-2`}>
                            <div className="flex items-center gap-2">
                                <span className={`rounded-full text-md font-semibold`}>{idx + 1}.</span>
                                <h3 className="text-lg font-semibold">{el.name}</h3>
                            </div>
                            <span className="text-sm font-medium">{formatRupiah(el.value)}</span>
                        </div>
                        <div className="relative">
                            <Progress value={parseFloat(el.percentage)} className="h-6 rounded-md" indicatorClassName={`${el.fill} rounded-r-md shadow-custom`} />
                            <div className={`absolute right-2 top-1/2 transform -translate-y-1/2 text-[10px] font-medium text-white px-[5px] py-[1px] rounded-full ${el.fill} shadow-custom bg-opacity-35 dark:bg-opacity-10`}>
                                {el.percentage}%
                            </div>
                        </div>
                        <div className="flex items-center justify-between">
                        </div>
                    </div>
                ))}
            </CardContent>
        </Card>
    );
}
