"use client"

import { useState, useEffect } from "react";
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
import { api } from "../../../utils/apiClient";

// Interface untuk API response
interface MonthlyData {
  month: string;
  totalProcess: string;
  totalSettled: string;
}

interface MonthlySummaryResponse {
  status: string;
  data: [MonthlyData[], {}];
}

// Interface untuk chart data
interface ChartData {
  month: string;
  totalProfit: number;
  paidProfit: number;
  unpaidProfit: number;
}

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

// Function untuk convert month format
const formatMonth = (monthString: string) => {
  const monthNames = {
    "01": "Jan", "02": "Feb", "03": "Mar", "04": "Apr",
    "05": "May", "06": "Jun", "07": "Jul", "08": "Aug", 
    "09": "Sep", "10": "Oct", "11": "Nov", "12": "Dec"
  };
  const month = monthString.split("-")[1];
  return monthNames[month as keyof typeof monthNames] || monthString;
};

// Function untuk transform API data ke chart format
const transformApiData = (apiData: MonthlyData[]): ChartData[] => {
  return apiData.map(item => {
    const totalProcess = parseInt(item.totalProcess) || 0;
    const totalSettled = parseInt(item.totalSettled) || 0;
    const unpaidProfit = totalProcess - totalSettled;

    return {
      month: formatMonth(item.month),
      totalProfit: totalProcess,
      paidProfit: totalSettled,
      unpaidProfit: unpaidProfit
    };
  });
};

export function SalesChart() {
  const [salesData, setSalesData] = useState<ChartData[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [currentYear] = useState(new Date().getFullYear());

  // Fetch monthly summary data
  const fetchMonthlySummary = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const response = await api.get<MonthlySummaryResponse>(`/transaction/summary/monthly?year=${currentYear}`);
      
      if (response.status === "success" && response.data[0]) {
        const transformedData = transformApiData(response.data[0]);
        setSalesData(transformedData);
      } else {
        setError("Failed to fetch monthly data");
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong");
      console.error("Error fetching monthly summary:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMonthlySummary();
  }, [currentYear]);

  // Calculate max Y value for chart
  const maxYValue = salesData.length > 0 
    ? Math.max(...salesData.map((data) => data.totalProfit)) * 1.1 
    : 1000000;

  return (
    <Card className="flex flex-col h-full w-full overflow-hidden">
      <CardHeader className="flex-shrink-0 pb-2">
        <CardTitle className="flex items-center justify-between text-lg">
          Statistik Profit Bulanan
          {loading && (
            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-500"></div>
          )}
        </CardTitle>
        <CardDescription className="text-sm">
          Melacak profit lunas dan belum lunas dalam setahun
        </CardDescription>
      </CardHeader>
      
      <CardContent className="flex-1 flex flex-col min-h-0 p-4 w-full">
        {error ? (
          // Error state
          <div className="flex flex-col items-center justify-center flex-1 text-center">
            <p className="text-red-600 mb-4 text-sm">Error: {error}</p>
            <button 
              onClick={fetchMonthlySummary}
              className="px-3 py-1 bg-red-600 text-white rounded hover:bg-red-700 text-sm"
            >
              Retry
            </button>
          </div>
        ) : loading ? (
          // Loading state
          <div className="flex items-center justify-center flex-1">
            <div className="animate-pulse space-y-2 w-full">
              <div className="h-3 bg-gray-200 rounded w-1/4"></div>
              <div className="space-y-1">
                <div className="h-24 bg-gray-200 rounded"></div>
                <div className="h-6 bg-gray-200 rounded w-3/4"></div>
              </div>
            </div>
          </div>
        ) : (
          // Chart
          <div className="flex-1 w-full min-h-0">
            <ChartContainer config={salesConfig} className="h-full w-full">
              <BarChart accessibilityLayer data={salesData} className="h-full w-full">
                <CartesianGrid vertical={false} />
                <XAxis
                  dataKey="month"
                  tickLine={false}
                  tickMargin={10}
                  axisLine={false}
                  tickFormatter={(value) => value.slice(0, 3)}
                  fontSize={12}
                />
                <ChartTooltip content={<ChartTooltipContent hideLabel />} />
                <ChartLegend content={<ChartLegendContent />} />
                <Bar
                  dataKey="paidProfit"
                  stackId="a"
                  fill="#0569A2"
                  radius={[0, 0, 4, 4]}
                />
                <Bar
                  dataKey="unpaidProfit"
                  stackId="a"
                  fill="#DDA801"
                  radius={[4, 4, 0, 0]}
                />
              </BarChart>
            </ChartContainer>
          </div>
        )}
      </CardContent>
    </Card>
  )
}