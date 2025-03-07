"use client"

import { Bar, BarChart, XAxis, YAxis, CartesianGrid } from "recharts"

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
  ChartLegend, ChartLegendContent,
} from "../../../ui-components/src/components/ui/chart"

const salesData = [
  { month: "Jan", totalProfit: 100_000_000, paidProfit: 70_000_000, unpaidProfit: 30_000_000 },
  { month: "Feb", totalProfit: 120_000_000, paidProfit: 80_000_000, unpaidProfit: 40_000_000 },
  { month: "Mar", totalProfit: 150_000_000, paidProfit: 90_000_000, unpaidProfit: 60_000_000 },
  { month: "Apr", totalProfit: 140_000_000, paidProfit: 85_000_000, unpaidProfit: 55_000_000 },
  { month: "May", totalProfit: 160_000_000, paidProfit: 100_000_000, unpaidProfit: 60_000_000 },
  { month: "Jun", totalProfit: 180_000_000, paidProfit: 110_000_000, unpaidProfit: 70_000_000 },
  { month: "Jul", totalProfit: 190_000_000, paidProfit: 120_000_000, unpaidProfit: 70_000_000 },
  { month: "Aug", totalProfit: 200_000_000, paidProfit: 130_000_000, unpaidProfit: 70_000_000 },
  { month: "Sep", totalProfit: 210_000_000, paidProfit: 140_000_000, unpaidProfit: 70_000_000 },
  { month: "Oct", totalProfit: 220_000_000, paidProfit: 150_000_000, unpaidProfit: 70_000_000 },
  { month: "Nov", totalProfit: 230_000_000, paidProfit: 160_000_000, unpaidProfit: 70_000_000 },
  { month: "Dec", totalProfit: 250_000_000, paidProfit: 180_000_000, unpaidProfit: 70_000_000 },
]

const maxYValue = Math.max(...salesData.map((data) => data.totalProfit)) * 1.1

const salesConfig = {
  paidProfit: {
    label: "Profit Lunas",
    color: "blue",
  },
  unpaidProfit: {
    label: "Profit Belum Lunas",
    color: "yellow",
  },
} satisfies ChartConfig

const formatToRupiah = (value: number) => {
  return `Rp ${value.toLocaleString("id-ID")}`
}

export function SalesChart() {
  return (
    <Card className="flex flex-col justify-between !flex-grow">
      <CardHeader>
        <CardTitle>Statistik Profit Bulanan</CardTitle>
        <CardDescription>Melacak profit lunas dan belum lunas dalam setahun</CardDescription>
      </CardHeader>
      <CardContent>
        <ChartContainer config={salesConfig}>
          <BarChart accessibilityLayer data={salesData}>
            <CartesianGrid vertical={false} />
            <XAxis
              dataKey="month"
              tickLine={false}
              tickMargin={10}
              axisLine={false}
              tickFormatter={(value) => value.slice(0, 3)}
            />
            {/* <YAxis 
              tickFormatter={formatToRupiah} 
              width={100} 
              domain={[0, maxYValue]}
            /> */}
            <ChartTooltip content={<ChartTooltipContent hideLabel />} />
            <ChartLegend content={<ChartLegendContent />} />
            <Bar
              dataKey="paidProfit"
              stackId="a"
              fill="#71BBB2"
              radius={[0, 0, 4, 4]}
            />
            <Bar
              dataKey="unpaidProfit"
              stackId="a"
              fill="#d39553"
              radius={[4, 4, 0, 0]}
            />
          </BarChart>
        </ChartContainer>
      </CardContent>
    </Card>
  )
}