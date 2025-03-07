"use client"

import { Bar, BarChart, XAxis, YAxis } from "recharts"

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "../../../ui-components/src/components/ui/card"
import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "../../../ui-components/src/components/ui/chart"

const salesData = [
  { month: "Jan", revenue: 12000, profit: 4000 },
  { month: "Feb", revenue: 15000, profit: 5000 },
  { month: "Mar", revenue: 17000, profit: 6000 },
  { month: "Apr", revenue: 14000, profit: 4500 },
  { month: "May", revenue: 20000, profit: 7000 },
  { month: "Jun", revenue: 22000, profit: 7500 },
]
// Ambil nilai tertinggi dari revenue agar YAxis menyesuaikan otomatis
const maxYValue = Math.max(...salesData.map((data) => data.revenue)) * 1.1 // +10% agar ada margin atas

const salesConfig = {
  revenue: {
    label: "2025",
    color: "hsl(var(--chart-1))",
  },
  profit: {
    label: "2024",
    color: "hsl(var(--chart-2))",
  },
} satisfies ChartConfig

// Fungsi untuk format angka ke Rupiah
const formatToRupiah = (value: number) => {
  return `Rp ${value.toLocaleString("id-ID")}`
}

export function SalesChart() {
  return (
    <Card className="flex flex-col justify-between !flex-grow">
      <CardHeader>
        <CardTitle>Statis Sales Tahunan</CardTitle>
        <CardDescription>Melacak pendapatan dan keuntungan dalam setahun</CardDescription>
      </CardHeader>
      <CardContent>
        <ChartContainer config={salesConfig}>
          <BarChart data={salesData}>
            <XAxis
              dataKey="month"
              tickLine={false}
              tickMargin={10}
              axisLine={false}
            />
            <YAxis 
              tickFormatter={formatToRupiah} 
              width={100} 
              domain={[0, maxYValue]}
            />
            <Bar
              dataKey="revenue"
              fill="var(--color-revenue)"
              radius={[4, 4, 0, 0]}
            />
            <Bar
              dataKey="profit"
              fill="var(--color-profit)"
              radius={[4, 4, 0, 0]}
            />
            <ChartTooltip
            label={"hidden"}
              content={
                <ChartTooltipContent 
                  
                />
              }
              cursor={false}
            />
          </BarChart>
        </ChartContainer>
      </CardContent>
    </Card>
  )
}
