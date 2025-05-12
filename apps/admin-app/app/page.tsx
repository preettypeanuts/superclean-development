import { WidgetMatrix } from "@shared/components/WidgetMatrix";
import { ChartKaryawan } from "@shared/components/ChartKaryawan";
import { SalesChart } from "@shared/components/SalesChart";
import { TiCancel } from "react-icons/ti";
import { FaClipboardCheck, FaClipboardList } from "react-icons/fa";
import { FaPersonRunning, FaMoneyBillTransfer } from "react-icons/fa6";
import { BirthdayReminder } from "@shared/components/BirthdayReminder"
import { Breadcrumbs } from "@shared/components/ui/Breadcrumbs";

const totalSPK = [
  {
    title: "Total SPK",
    value: 120,
    lastWeek: 110, // Data minggu lalu
    icon: <FaClipboardList />,
    color: "bg-blue-500",
  },
];

const doneOrder = [
  {
    title: "Order Diselesaikan",
    value: 95,
    lastWeek: 100,
    icon: <FaClipboardCheck />,
    color: "bg-green-500",
  },
]

const cancelOrder = [
  {
    title: "Orderan Dibatalkan",
    value: 3,
    lastWeek: 3,
    icon: <TiCancel />,
    color: "bg-red-500",
  },
]

const onGoingOrder = [
  {
    title: "Orderan Berjalan",
    value: 15,
    lastWeek: null,
    icon: <FaPersonRunning />,
    color: "bg-yellow-500",
  },
]

const waitPayment = [
  {
    title: "Menunggu Pembayaran",
    value: 7,
    lastWeek: null,
    icon: <FaMoneyBillTransfer />,
    color: "bg-orange-500",
  },
]

export default function Dashboard() {
  return (
    <section className="flex flex-col gap-2 max-h-[98.5lvh] h-[98.5lvh] min-h-0 overflow-hidden pt-[0px] px-2">
      <div className="h-fit -mx-2 -mb-2">
        <Breadcrumbs label="Dashboard" />
      </div>
      <div className="h-fit">
        <BirthdayReminder />
      </div>
      {/* Bagian Atas: Widget (Tinggi Sesuai Konten) */}
      <div className="grid grid-cols-5 gap-2 h-fit">
        <WidgetMatrix data={totalSPK} />
        <WidgetMatrix data={doneOrder} />
        <WidgetMatrix data={cancelOrder} />
        <WidgetMatrix data={onGoingOrder} />
        <WidgetMatrix data={waitPayment} />
      </div>

      {/* Bagian Bawah: Chart (Grow Mengisi Sisa Space) */}
      <div className="grid grid-cols-9 gap-2 flex-grow min-h-0">
        <div className="flex flex-col col-span-6 space-y-2 flex-grow min-h-0">
          <SalesChart />
        </div>
        <div className="flex flex-col col-span-3 space-y-2 flex-grow min-h-0">
          <ChartKaryawan />
        </div>
      </div>
    </section>
  );
}