"use client"
import { BirthdayReminder } from "@shared/components/BirthdayReminder";
import { ChartKaryawan } from "@shared/components/ChartKaryawan";
import { SalesChart } from "@shared/components/SalesChart";
import { Breadcrumbs } from "@shared/components/ui/Breadcrumbs";
import { WidgetMatrix } from "@shared/components/WidgetMatrix";
import { useEffect, useState } from "react";
import { FaClipboardCheck, FaClipboardList } from "react-icons/fa";
import { FaMoneyBillTransfer, FaPersonRunning } from "react-icons/fa6";
import { TiCancel } from "react-icons/ti";
// eslint-disable-next-line @nx/enforce-module-boundaries
import { api } from "libs/utils/apiClient";

// Interface untuk API response
interface TransactionData {
  all: number;
  ongoing: number;
  cancel: number;
  payment: number;
  done: number;
}

export default function Dashboard() {
  const [transactionData, setTransactionData] = useState<TransactionData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Fetch data dari API
  const fetchTransactionData = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await api.get(`/transaction/summary/all`);
      
      if (response.status === "success") {
        setTransactionData(response.data);
      } else {
        setError("Failed to fetch data");
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTransactionData();
  }, []);

  // Transform API data ke format widget
  const getWidgetData = () => {
    if (!transactionData) return { totalSPK: [], doneOrder: [], cancelOrder: [], onGoingOrder: [], waitPayment: [] };

    const totalSPK = [
      {
        redirect: "/laporan/inquiry-transaksi",
        title: "Total SPK",
        value: transactionData.all,
        lastWeek: null,
        icon: <FaClipboardList />,
        color: "bg-blue-500",
      },
    ];

    const doneOrder = [
      {
        redirect: "/transaksi/pembayaran?status=4",
        title: "Order Diselesaikan",
        value: transactionData.done,
        lastWeek: null,
        icon: <FaClipboardCheck />,
        color: "bg-green-500",
      },
    ];

    const cancelOrder = [
      {
        redirect: "/transaksi/spk?status=2",
        title: "Order Dibatalkan",
        value: transactionData.cancel,
        lastWeek: null,
        icon: <TiCancel />,
        color: "bg-red-500",
      },
    ];

    const onGoingOrder = [
      {
        redirect: "/transaksi/spk?status=1",
        title: "Order Berjalan",
        value: transactionData.ongoing,
        lastWeek: null,
        icon: <FaPersonRunning />,
        color: "bg-yellow-500",
      },
    ];

    const waitPayment = [
      {
        redirect: "/transaksi/pembayaran?status=3",
        title: "Menunggu Pembayaran",
        value: transactionData.payment,
        lastWeek: null,
        icon: <FaMoneyBillTransfer />,
        color: "bg-orange-500",
      },
    ];

    return { totalSPK, doneOrder, cancelOrder, onGoingOrder, waitPayment };
  };

  const widgets = getWidgetData();

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
        {loading ? (
          // Loading state - tampilkan skeleton
          Array.from({ length: 5 }).map((_, index) => (
            <div key={index} className="animate-pulse">
              <div className="h-24 bg-gray-200 rounded-lg"></div>
            </div>
          ))
        ) : error ? (
          // Error state
          <div className="col-span-5 p-4 bg-red-50 border border-red-200 rounded-lg">
            <p className="text-red-600 mb-2">Error: {error}</p>
            <button 
              onClick={fetchTransactionData}
              className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700"
            >
              Retry
            </button>
          </div>
        ) : (
          // Data berhasil dimuat
          <>
            <WidgetMatrix data={widgets.totalSPK} />
            <WidgetMatrix data={widgets.doneOrder} />
            <WidgetMatrix data={widgets.cancelOrder} />
            <WidgetMatrix data={widgets.onGoingOrder} />
            <WidgetMatrix data={widgets.waitPayment} />
          </>
        )}
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