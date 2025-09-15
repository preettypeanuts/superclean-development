"use client"

import Link from "next/link";
import { useState, useEffect } from "react";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "../../../../ui-components/src/components/ui/tabs";
import { AiFillCalendar, AiFillClockCircle } from "react-icons/ai";
import { BsClipboard2CheckFill } from "react-icons/bs";
import { api } from "../../../../utils/apiClient";

// Interface untuk data task
interface BlowerTaskData {
  id: string;
  trxNumber: string;
  customerId: string;
  customerName: string;
  branchId: string;
  finalPrice: number;
  trxDate: string;
  status: number;
  createdBy: string;
  createdAt: string;
  address: string;
  statusLabel: string;
}

// Interface untuk response API
interface BlowerApiResponse {
  status: string;
  data: [BlowerTaskData[], number];
}

// Task Card Component
interface TaskCardProps {
  task: BlowerTaskData;
}

const TaskCard: React.FC<TaskCardProps> = ({ task }) => {
  // Fungsi untuk format tanggal
  const formatDate = (dateString: string) => {
    try {
      const date = new Date(dateString);
      return date.toLocaleDateString('id-ID', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric'
      });
    } catch {
      return dateString;
    }
  };

  // Fungsi untuk format waktu
  const formatTime = (dateTimeString: string) => {
    try {
      const date = new Date(dateTimeString);
      return date.toLocaleTimeString('id-ID', {
        hour: '2-digit',
        minute: '2-digit',
        timeZone: 'Asia/Jakarta'
      }) + ' WIB';
    } catch {
      return dateTimeString;
    }
  };

  // Fungsi untuk mendapatkan warna status
  const getStatusColor = (status: string) => {
    switch (status?.toLowerCase()) {
      case 'menunggu diantar':
      case 'pending delivery':
        return 'text-orange-600';
      case 'menunggu diambil':
      case 'pending pickup':
        return 'text-blue-600';
      case 'dalam pengantaran':
      case 'delivering':
        return 'text-yellow-600';
      case 'dalam pengambilan':
      case 'picking up':
        return 'text-purple-600';
      case 'selesai':
      case 'completed':
        return 'text-green-600';
      case 'dibatalkan':
      case 'cancelled':
        return 'text-red-600';
      default:
        return 'text-secondaryColorDark';
    }
  };

  return (
    <Link href={`/jadwal-pekerjaan/${task.trxNumber}`}>
      <div className="w-full bg-white p-3 rounded-lg border hover:shadow-md transition-shadow cursor-pointer">
        <div className="grid grid-cols-5 pb-3 border-b border-bottom-dash">
          <div className="col-span-4">
            <h1 className="text-[20px] font-semibold mb-1">
              {task.customerName}
            </h1>
            <div className="text-[14px] text-gray-600 space-y-1">
              <p className="text-orange-600 font-medium">
                Nomor Transaksi : {task.trxNumber}
              </p>
              <p className="truncate">
                Alamat: {task.address}
              </p>
            </div>
          </div>
          <div className="flex items-end justify-end">
            <div className="w-[45px] h-[45px] aspect-square bg-mainColor flex items-center justify-center rounded-md">
              <div
                className="w-10 h-10 bg-white"
                style={{
                  mask: "url(/assets/SC_LogoOnlyBig.png) no-repeat center / contain",
                  WebkitMask: "url(/assets/SC_LogoOnlyBig.png) no-repeat center / contain",
                }}
              ></div>
            </div>
          </div>
        </div>

        <div className="flex flex-col gap-2 text-[14px] pt-3">
          <div className="flex truncate items-center gap-1 text-gray-600">
            <AiFillCalendar />
            <p>{formatDate(task.trxDate)}</p>
          </div>
          <div className="flex truncate items-center gap-1 text-gray-600">
            <AiFillClockCircle />
            <p>{formatTime(task.trxDate)}</p>
          </div>
          <div className={`flex truncate items-center gap-1 ${getStatusColor(task.statusLabel)}`}>
            <BsClipboard2CheckFill />
            <p>{task.statusLabel}</p>
          </div>
        </div>
      </div>
    </Link>
  );
};

// Loading Card Component
const LoadingCard = () => (
  <div className="w-full bg-white p-3 rounded-lg border animate-pulse">
    <div className="grid grid-cols-5 pb-3 border-b border-gray-200">
      <div className="col-span-4 space-y-2">
        <div className="h-6 bg-gray-300 rounded w-3/4"></div>
        <div className="h-4 bg-gray-300 rounded w-1/2"></div>
        <div className="h-4 bg-gray-300 rounded w-full"></div>
      </div>
      <div className="flex items-end justify-end">
        <div className="w-[45px] h-[45px] bg-gray-300 rounded-md"></div>
      </div>
    </div>
    <div className="flex flex-col gap-2 pt-3">
      <div className="h-4 bg-gray-300 rounded w-1/3"></div>
      <div className="h-4 bg-gray-300 rounded w-1/4"></div>
      <div className="h-4 bg-gray-300 rounded w-1/2"></div>
    </div>
  </div>
);

// Error Card Component
const ErrorCard: React.FC<{ error: string; onRetry: () => void }> = ({ error, onRetry }) => (
  <div className="w-full bg-red-50 p-4 rounded-lg border border-red-200">
    <p className="text-red-700 text-center mb-3">{error}</p>
    <button
      onClick={onRetry}
      className="w-full px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600 transition-colors"
    >
      Coba Lagi
    </button>
  </div>
);

// Empty State Component
const EmptyState: React.FC<{ message: string }> = ({ message }) => (
  <div className="w-full bg-gray-50 p-4 rounded-lg border border-gray-200">
    <p className="text-gray-600 text-center">{message}</p>
  </div>
);

export const JadwalPekerjaanBlowerTabs = () => {
  const [pengantaranTasks, setPengantaranTasks] = useState<BlowerTaskData[]>([]);
  const [pengambilanTasks, setPengambilanTasks] = useState<BlowerTaskData[]>([]);
  const [riwayatTasks, setRiwayatTasks] = useState<BlowerTaskData[]>([]);
  
  const [loadingPengantaran, setLoadingPengantaran] = useState(true);
  const [loadingPengambilan, setLoadingPengambilan] = useState(false);
  const [loadingRiwayat, setLoadingRiwayat] = useState(false);
  
  const [errorPengantaran, setErrorPengantaran] = useState<string | null>(null);
  const [errorPengambilan, setErrorPengambilan] = useState<string | null>(null);
  const [errorRiwayat, setErrorRiwayat] = useState<string | null>(null);

  // Fetch pengantaran tasks (tab=1)
  const fetchPengantaranTasks = async () => {
    try {
      setLoadingPengantaran(true);
      setErrorPengantaran(null);

      const response: BlowerApiResponse = await api.get('/transaction/page/spk/blower?tab=1&page=1&limit=10');
      
      if (response && response.status === "success" && response.data) {
        // Handle the nested array structure [BlowerTaskData[], number]
        const taskData = response.data[0] || [];
        setPengantaranTasks(taskData);
      } else {
        setPengantaranTasks([]);
      }
    } catch (err) {
      console.error('Error fetching pengantaran tasks:', err);
      setErrorPengantaran(err instanceof Error ? err.message : 'Terjadi kesalahan saat memuat data pengantaran');
      setPengantaranTasks([]);
    } finally {
      setLoadingPengantaran(false);
    }
  };

  // Fetch pengambilan tasks (tab=2)
  const fetchPengambilanTasks = async () => {
    try {
      setLoadingPengambilan(true);
      setErrorPengambilan(null);

      const response: BlowerApiResponse = await api.get('/transaction/page/spk/blower?tab=2&page=1&limit=10');
      
      if (response && response.status === "success" && response.data) {
        const taskData = response.data[0] || [];
        setPengambilanTasks(taskData);
      } else {
        setPengambilanTasks([]);
      }
    } catch (err) {
      console.error('Error fetching pengambilan tasks:', err);
      setErrorPengambilan(err instanceof Error ? err.message : 'Terjadi kesalahan saat memuat data pengambilan');
      setPengambilanTasks([]);
    } finally {
      setLoadingPengambilan(false);
    }
  };

  // Fetch riwayat tasks (tab=3)
  const fetchRiwayatTasks = async () => {
    try {
      setLoadingRiwayat(true);
      setErrorRiwayat(null);

      const response: BlowerApiResponse = await api.get('/transaction/page/spk/blower?tab=3&page=1&limit=10');
      
      if (response && response.status === "success" && response.data) {
        const taskData = response.data[0] || [];
        setRiwayatTasks(taskData);
      } else {
        setRiwayatTasks([]);
      }
    } catch (err) {
      console.error('Error fetching riwayat tasks:', err);
      setErrorRiwayat(err instanceof Error ? err.message : 'Terjadi kesalahan saat memuat riwayat');
      setRiwayatTasks([]);
    } finally {
      setLoadingRiwayat(false);
    }
  };

  // Load pengantaran tasks on component mount
  useEffect(() => {
    fetchPengantaranTasks();
  }, []);

  // Handle tab change to load data
  const handleTabChange = (value: string) => {
    if (value === "pengambilan" && pengambilanTasks.length === 0 && !loadingPengambilan && !errorPengambilan) {
      fetchPengambilanTasks();
    } else if (value === "riwayat" && riwayatTasks.length === 0 && !loadingRiwayat && !errorRiwayat) {
      fetchRiwayatTasks();
    }
  };

  return (
    <div className="">
      <main className="flex items-center justify-center mx-5 -mt-12">
        <Tabs 
          defaultValue="pengantaran" 
          className="flex flex-col items-center justify-center w-full"
          onValueChange={handleTabChange}
        >
          <TabsList className="bg-[#F0FAF9] w-full z-50">
            <TabsTrigger className="w-full text-[16px]" value="pengantaran">
              Pengantaran
            </TabsTrigger>
            <TabsTrigger className="w-full text-[16px]" value="pengambilan">
              Pengambilan
            </TabsTrigger>
            <TabsTrigger className="w-full text-[16px]" value="riwayat">
              Riwayat
            </TabsTrigger>
          </TabsList>

          {/* Pengantaran Tab */}
          <TabsContent className="!mt-0 w-full" value="pengantaran">
            <div className="w-full flex flex-col gap-3">
              {loadingPengantaran ? (
                <>
                  <LoadingCard />
                  <LoadingCard />
                  <LoadingCard />
                </>
              ) : errorPengantaran ? (
                <ErrorCard error={errorPengantaran} onRetry={fetchPengantaranTasks} />
              ) : pengantaranTasks.length === 0 ? (
                <EmptyState message="Tidak ada tugas pengantaran" />
              ) : (
                pengantaranTasks.map((task) => (
                  <TaskCard key={task.id} task={task} />
                ))
              )}
            </div>
          </TabsContent>

          {/* Pengambilan Tab */}
          <TabsContent className="!mt-0 w-full" value="pengambilan">
            <div className="w-full flex flex-col gap-3">
              {loadingPengambilan ? (
                <>
                  <LoadingCard />
                  <LoadingCard />
                  <LoadingCard />
                </>
              ) : errorPengambilan ? (
                <ErrorCard error={errorPengambilan} onRetry={fetchPengambilanTasks} />
              ) : pengambilanTasks.length === 0 ? (
                <EmptyState message="Tidak ada tugas pengambilan" />
              ) : (
                pengambilanTasks.map((task) => (
                  <TaskCard key={task.id} task={task} />
                ))
              )}
            </div>
          </TabsContent>

          {/* Riwayat Tab */}
          <TabsContent className="!mt-0 w-full" value="riwayat">
            <div className="w-full flex flex-col gap-3">
              {loadingRiwayat ? (
                <>
                  <LoadingCard />
                  <LoadingCard />
                  <LoadingCard />
                </>
              ) : errorRiwayat ? (
                <ErrorCard error={errorRiwayat} onRetry={fetchRiwayatTasks} />
              ) : riwayatTasks.length === 0 ? (
                <EmptyState message="Tidak ada riwayat pekerjaan" />
              ) : (
                riwayatTasks.map((task) => (
                  <TaskCard key={task.id} task={task} />
                ))
              )}
            </div>
          </TabsContent>
        </Tabs>
      </main>
    </div>
  );
};