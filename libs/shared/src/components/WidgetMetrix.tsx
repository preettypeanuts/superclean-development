import { FaClipboardList, FaClipboardCheck, FaArrowUp, FaArrowDown, FaMinus } from "react-icons/fa";
import { FaPersonRunning, FaMoneyBillTransfer } from "react-icons/fa6";
import { FaGripLines } from "react-icons/fa";
import { TiCancel } from "react-icons/ti";
import { Card } from "../../../ui-components/src/components/ui/card";

const orderStats = [
  {
    title: "Total SPK",
    value: 120,
    lastWeek: 110, // Data minggu lalu
    icon: <FaClipboardList />,
    color: "bg-blue-500",
  },
  {
    title: "Order Diselesaikan",
    value: 95,
    lastWeek: 100,
    icon: <FaClipboardCheck />,
    color: "bg-green-500",
  },
  {
    title: "Orderan Berjalan",
    value: 15,
    lastWeek: 12,
    icon: <FaPersonRunning />,
    color: "bg-yellow-500",
  },
  {
    title: "Menunggu Pembayaran",
    value: 7,
    lastWeek: 10,
    icon: <FaMoneyBillTransfer />,
    color: "bg-orange-500",
  },
  {
    title: "Orderan Dibatalkan",
    value: 3,
    lastWeek: 3,
    icon: <TiCancel />,
    color: "bg-red-500",
  },
];

const getTrend = (current: number, lastWeek: number) => {
  const difference = current - lastWeek;
  const percentageChange = lastWeek !== 0 ? ((difference / lastWeek) * 100).toFixed(1) : "0.0"; // Hindari pembagian nol

  if (difference > 0) return { trend: "naik", color: "text-green-500", icon: <FaArrowUp />, percentage: `+${percentageChange}%` };
  if (difference < 0) return { trend: "turun", color: "text-red-500", icon: <FaArrowDown />, percentage: `${percentageChange}%` };
  return { trend: "stable", color: "", icon: <FaMinus />, percentage: "0.0%" };
};
export default orderStats;

export const WidgetMetrix = () => {
  return (
    <section>
      <div className="grid-flow-col grid gap-2">
        {orderStats.map((stat, index) => {
          const trend = getTrend(stat.value, stat.lastWeek);
          return (
            <Card key={index} className="flex flex-col gap-5 py-5 px-6">
              <div className="flex items-center gap-3">
                <div className={`p-3 rounded-xl ${stat.color} dark:first:bg-opacity-50 text-white`}>
                  {stat.icon}
                </div>
                <div>
                  <p className="text-xl font-semibold flex items-center gap-1">
                    {stat.value}
                    <span className={`text-sm ${trend.color}`}>
                      {trend.icon}
                    </span>

                  </p>
                  <h3 className="text-md">{stat.title}</h3>
                </div>
              </div>
              <div className="text-sm font-medium">
                <span className={`${trend.color}`}>
                  {trend.percentage} {trend.trend}
                </span>
                <span> dari minggu lalu </span>
              </div>
            </Card>
          );
        })}
      </div>
    </section>
  );
}