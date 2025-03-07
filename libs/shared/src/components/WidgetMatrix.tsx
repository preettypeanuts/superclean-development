import { FaArrowUp, FaArrowDown, FaMinus } from "react-icons/fa";
import { Card } from "../../../ui-components/src/components/ui/card";

const getTrend = (current: number, lastWeek: number) => {
  const difference = current - lastWeek;
  const percentageChange = lastWeek !== 0 ? ((difference / lastWeek) * 100).toFixed(1) : "0.0"; // Hindari pembagian nol

  if (difference > 0) return { trend: "naik", color: "text-green-500", icon: <FaArrowUp />, percentage: `+${percentageChange}%` };
  if (difference < 0) return { trend: "turun", color: "text-red-500", icon: <FaArrowDown />, percentage: `${percentageChange}%` };
  return { trend: "stable", color: "", icon: <FaMinus />, percentage: "0.0%" };
};

interface OrderStat {
  title: string;
  value: number;
  lastWeek: number | null;
  icon: JSX.Element;
  color: string;
}

interface WidgetMatrixProps {
  data: OrderStat[];
}

export const WidgetMatrix: React.FC<WidgetMatrixProps> = ({ data }) => {
  return (
    <div className="grid grid-flow-col gap-2">
      {data.map((stat, index) => {
        const trend = stat.lastWeek !== null ? getTrend(stat.value, stat.lastWeek) : { trend: "stable", color: "", icon: <FaMinus />, percentage: "0.0%" };
        return (
          <Card key={index} className="flex flex-col justify-between gap-8 px-3 py-3">
            <div className={`flex items-center gap-2  ${stat.color} bg-opacity-20 rounded-full pr-2`}>
              <div className={`p-2 text-lg rounded-full ${stat.color} w-fit h-fit text-white`}>
                {stat.icon}
              </div>
              <h3 className="text-sm font-medium">{stat.title}</h3>
            </div>
            <p className={`text-3xl font-semibold flex items-center gap-1 pb-1 pl-[2px]`}>
              {stat.value}
            </p>
            {/* {stat.lastWeek !== null && (
                  <div className={`${trend.color} text-sm font-medium flex items-center gap-1 truncate`}>
                    {trend.icon} {trend.percentage} {trend.trend}
                    <span> dari minggu lalu </span>
                  </div>
                )} */}
          </Card>
        );
      })}
    </div>
  );
}