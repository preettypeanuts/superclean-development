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
    { name: "Minah", value: 6000000, branch: "Kantor Pusat" },
    { name: "Jejen", value: 4000000, branch: "Bandung" },
    { name: "Sutisna", value: 0, branch: "Surabaya" },
    { name: "Erik", value: 1200000, branch: "Yogyakarta" },
    { name: "Udin", value: 2000000, branch: "Bandung" },
    { name: "John Doe", value: 2500000, branch: "Kantor Pusat" },
    { name: "Jane Smith", value: 5300000, branch: "Surabaya" },
    { name: "Mike Johnson", value: 3000000, branch: "Yogyakarta" },
    { name: "Sarah Brown", value: 0, branch: "Kantor Pusat" },
    { name: "Budi", value: 5000000, branch: "Bandung" },
    { name: "Ani", value: 3500000, branch: "Surabaya" },
    { name: "Dewi", value: 4900000, branch: "Yogyakarta" },
    { name: "Tono", value: 1000000, branch: "Kantor Pusat" },
    { name: "Siti", value: 3900000, branch: "Bandung" },
    { name: "Rahmat", value: 0, branch: "Surabaya" },
    { name: "Yanto", value: 5200000, branch: "Yogyakarta" },
    { name: "Wati", value: 5000000, branch: "Kantor Pusat" },
    { name: "Samsul", value: 0, branch: "Bandung" },
    { name: "Rina", value: 4500000, branch: "Surabaya" },
];

// Function to process chart data
const processChartData = (data: { name: string, value: number, branch: string }[]) => {
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
            branch: item.branch, // Ensure branch is included
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
            <CardContent className="flex-grow overflow-auto py-24 no-scrollbar space-y-4">
                {Object.entries(
                    chartData.reduce((acc, el) => {
                        if (!acc[el.branch]) acc[el.branch] = [];
                        acc[el.branch].push(el);
                        return acc;
                    }, {} as Record<string, typeof chartData>)
                ).map(([branch, employees]) => (
                    <div key={branch} className={`mb-5`}>
                        <h2 className="font-semibold mb-2">{branch}</h2>
                        <div className="space-y-2">
                            {employees.map((el, idx) => (
                                <div key={idx} className={` ${el.fill} rounded-md bg-opacity-20 px-3 pt-1 py-2`}>
                                    <div className={`flex items-center justify-between`}>
                                        <div className="flex items-center gap-2">
                                            <span className={`rounded-full text-md font-semibold`}>{idx + 1}.</span>
                                            <h3 className="text-lg font-semibold">{el.name}</h3>
                                        </div>
                                        <span className="text-sm font-medium">{formatRupiah(el.value)}</span>
                                    </div>
                                    <div className="flex items-center gap-2 dark:border rounded-md">
                                        <Progress value={parseFloat(el.percentage)} className="h-5 shadow-custom" indicatorClassName={`${el.fill} !rounded-l-md shadow-mainShadow`} />
                                        <div className={`text-[11px] font-bold text-neutral-500 dark:text-neutral-200 px-[5px] py-[4px] min-w-[45px] flex items-center justify-center h-full rounded-md`}>
                                            {el.percentage}%
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                ))}
            </CardContent>
        </Card>
    );
}
