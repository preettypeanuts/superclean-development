"use client"
import { useEffect, useMemo, useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "../../../ui-components/src/components/ui/card";
import { Progress } from "../../../ui-components/src/components/ui/progress";
import { apiClient } from "../../../utils/apiClient";

// Target pendapatan per karyawan (5 juta)
const TARGET_PENDAPATAN = 5000000;

const TARGET_KANTOR_PUSAT = 10000000
const TARGET_KANTOR_CABANG = 5000000

interface AppsettingsData {
  paramKey: string
  paramValue: string
}

interface MonthTargetData {
  fullname: string;
  branch: string;
  target: number;
}

// Data dummy pencapaian pendapatan karyawan
const rawData: MonthTargetData[] = [

];

// Function to process chart data
const processChartData = (data: MonthTargetData[], targetPusat: number, targetCabang: number) => {
  return data.map((item) => {
    const target = item.branch === "Kantor Pusat" ? targetPusat : targetCabang

    const percentage = (item.target / target) * 100;
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
  }).sort((a, b) => b.target - a.target);
};


const getInitials = (name: string) => {
  return name
    .split(" ")
    .map((word) => word[0]?.toUpperCase())
    .join("")
    .slice(0, 2);
};

// Format angka ke Rupiah
const formatRupiah = (value: number) =>
  new Intl.NumberFormat("id-ID", { style: "currency", currency: "IDR" }).format(value);

const TARGET_BRANCH_PARAMKEY = "TARGET_BRANCH";
const TARGET_KANTOR_PUSAT_PARAMKEY = "TARGET_HO"

export function ChartKaryawan() {

  const [targetPusat, setTargetPusat] = useState<number>(TARGET_KANTOR_PUSAT);
  const [targetCabang, setTargetCabang] = useState<number>(TARGET_KANTOR_CABANG);

  const [dataHO, setDataHO] = useState<MonthTargetData[]>(rawData);
  const [dataCabang, setDataCabang] = useState<MonthTargetData[]>(rawData);

  const dataRaw = [...dataHO, ...dataCabang]

  const chartData = processChartData(dataRaw, targetPusat, targetCabang);

  const fetchAppsettings = async () => {
    try {
      let url = `/parameter/app-settings`;
      const result = await apiClient(url);
      const data = result?.data || [] as AppsettingsData[]

      data.forEach((parameter: AppsettingsData) => {
        if (parameter.paramKey == TARGET_BRANCH_PARAMKEY) {
          const newTargetBranchValue = Number(parameter.paramValue)
          setTargetCabang(newTargetBranchValue)
        }

        if (parameter.paramKey == TARGET_KANTOR_PUSAT_PARAMKEY) {
          const newTargetPusatValue = Number(parameter.paramValue)
          setTargetPusat(newTargetPusatValue)
        }
      });
    }
    catch (err) {
      console.error("Error fetching app settings data:", err);
    } finally {
      // setLoading(false);
    }
  }

  const fetchMonthlyTargetData = async (isHO = false) => {
    try {
      let url = `/transaction/monthly/target?isHeadOffice=${isHO}`;
      const result = await apiClient(url);
      const data = (result?.data || []) as MonthTargetData[]

      const dataRaw = data.map((row) => {
        return {
          ...row,
          branch: row.branch != "Kantor Pusat" ? "Kantor Cabang" : row.branch
        }
      })

      if (isHO) {
        setDataHO(dataRaw)
      } else {
        setDataCabang(dataRaw)
      }
    }
    catch (err) {
      console.error("Error fetching app settings data:", err);
    } finally {
      // setLoading(false);
    }
  }

  // Mapping target per branch
  // const branchTargetMap: Record<string, number> = {
  //   "Kantor Pusat": TARGET_KANTOR_PUSAT,
  //   "Kantor Cabang": TARGET_KANTOR_CABANG,
  // };

  const branchTargetMap: Record<string, number> = useMemo(() => {
    return {
      "Kantor Pusat": targetPusat,
      "Kantor Cabang": targetCabang,
    }
  }, [targetPusat, targetCabang])

  useEffect(() => {
    fetchAppsettings();
    fetchMonthlyTargetData(true)
    fetchMonthlyTargetData(false)
  }, [])

  return (
    <Card className="flex flex-col h-full relative">
      <div className="absolute top-0 gradient-blur-to-b h-[25%] bg-gradient-to-b from-white/50 via-white/30 dark:from-black/50 dark:via-black/30 to-transparent z-20 rounded-t-3xl"></div>

      <CardHeader className="z-30 absolute top-0 w-full">
        <CardTitle className="text-[18px] font-bold">Ringkasan Target Teknisi</CardTitle>
        <CardDescription className="text-[16px]">
          Total Pendapatan: {formatRupiah(chartData.reduce((total, item) => total + item.target, 0))}
        </CardDescription>
      </CardHeader>

      <CardContent className="flex-grow overflow-auto py-24 no-scrollbar space-y-4">
        {Object.entries(
          chartData.reduce((acc, el) => {
            if (!acc[el.branch]) acc[el.branch] = [];
            acc[el.branch].push(el);
            return acc;
          }, {} as Record<string, typeof chartData>)
        ).map(([branch, employees]) => {
          const targetBranch = branchTargetMap[branch] ?? 0;
          return (
            <div key={branch} className="mb-5 mt-1">
              <h2 className="font-semibold mb-2">
                {branch} <span className="text-sm font-normal text-muted-foreground">– {formatRupiah(targetBranch)}</span>
              </h2>
              <div className="space-y-2">
                {employees.map((el, idx) => (
                  <div className="">
                    <div key={idx} className={`${el.fill} flex items-center gap-4 rounded-t-md bg-opacity-50 px-3 py-3`}>
                      <div className="w-190 h-9 aspect-square flex items-center justify-center rounded-full bg-white text-gray-800 font-semibold border border-darkColor dark:border-lightColor">
                        {getInitials(el.fullname)}
                      </div>
                      <div className="flex flex-col w-full">
                        <h3 className="text-lg font-semibold">{el.fullname}</h3>
                        <div className="flex items-center justify-between w-full">
                          <p className="text-sm font-medium">
                            {branch}
                          </p>
                          <span className="text-sm font-bold">{formatRupiah(el.target)}</span>
                        </div>
                      </div>
                    </div>
                    <div className={`${el.fill} rounded-b-md px-3 py-1.5 bg-opacity-15 flex items-center gap-1 dark:border`}>
                      <Progress value={parseFloat(el.percentage)} className="h-5" indicatorClassName={`${el.fill} !rounded-l-md`} />
                      <div className="text-[13px] font-medium text-neutral-800 dark:text-neutral-200 px-[5px] py-[4px] min-w-[35px] flex items-center justify-center h-full rounded-md">
                        {el.percentage}%
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          );
        })}
      </CardContent>
    </Card>
  );
}
