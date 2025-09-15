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
interface TaskData {
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
interface ApiResponse {
  status: boolean;
  message: string;
  data: {
    data: TaskData[];
    meta: {
      page: number;
      limit: number;
      total: number;
      totalPages: number;
    };
  };
}

// Task Card Component
interface TaskCardProps {
  task: TaskData;
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
      case 'menunggu diproses':
      case 'pending':
        return 'text-secondaryColorDark';
      case 'dalam proses':
      case 'processing':
        return 'text-yellow-600';
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
    <Link href={`/detail-spk/${encodeURIComponent(task.id)}`}>
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

export const DaftarSPKTabs = () => {
  const [ongoingTasks, setOngoingTasks] = useState<TaskData[]>([]);
  const [completedTasks, setCompletedTasks] = useState<TaskData[]>([]);
  const [loadingOngoing, setLoadingOngoing] = useState(true);
  const [loadingCompleted, setLoadingCompleted] = useState(false);
  const [errorOngoing, setErrorOngoing] = useState<string | null>(null);
  const [errorCompleted, setErrorCompleted] = useState<string | null>(null);

  // Fetch ongoing tasks
  const fetchOngoingTasks = async () => {
    try {
      setLoadingOngoing(true);
      setErrorOngoing(null);

      const response = await api.get('/transaction/page/spk/ongoing?page=1&limit=10');

      if (response && response.status) {
        // Handle nested array structure as shown in original code
        const taskData = response.data?.data || [];
        if (Array.isArray(taskData) && taskData.length > 0) {
          // If data is nested in arrays like taskData[0][0], flatten it
          const flattenedData = taskData.flat();
          setOngoingTasks(flattenedData);
        } else {
          setOngoingTasks([]);
        }
      } else {
        setOngoingTasks([]);
      }
    } catch (err) {
      console.error('Error fetching ongoing tasks:', err);
      setErrorOngoing(err instanceof Error ? err.message : 'Terjadi kesalahan saat memuat data');
      setOngoingTasks([]);
    } finally {
      setLoadingOngoing(false);
    }
  };

  // Fetch completed tasks (history)
  const fetchCompletedTasks = async () => {
    try {
      setLoadingCompleted(true);
      setErrorCompleted(null);

      // Fetch completed tasks from the correct endpoint
      const response = await api.get('/transaction/page/spk/complete?page=1&limit=10');

      if (response && response.status) {
        const taskData = response.data?.data || [];
        if (Array.isArray(taskData) && taskData.length > 0) {
          const flattenedData = taskData.flat();
          setCompletedTasks(flattenedData);
        } else {
          setCompletedTasks([]);
        }
      } else {
        setCompletedTasks([]);
      }
    } catch (err) {
      console.error('Error fetching completed tasks:', err);
      setErrorCompleted(err instanceof Error ? err.message : 'Terjadi kesalahan saat memuat riwayat');
      setCompletedTasks([]);
    } finally {
      setLoadingCompleted(false);
    }
  };

  // Load ongoing tasks on component mount
  useEffect(() => {
    fetchOngoingTasks();
  }, []);

  // Handle tab change to load completed tasks
  const handleTabChange = (value: string) => {
    if (value === "history" && completedTasks.length === 0 && !loadingCompleted && !errorCompleted) {
      fetchCompletedTasks();
    }
  };

  return (
    <div>
      <main className="flex items-center justify-center mx-5 !-mt-12">
        <Tabs
          defaultValue="ongoing"
          className="flex flex-col items-center justify-center w-full"
          onValueChange={handleTabChange}
        >
          <TabsList className="bg-[#F0FAF9] w-full z-50">
            <TabsTrigger className="w-full text-[16px]" value="ongoing">
              Pekerjaan Berlangsung
            </TabsTrigger>
            <TabsTrigger className="w-full text-[16px]" value="history">
              Riwayat Pekerjaan
            </TabsTrigger>
          </TabsList>

          {/* Ongoing Tasks Tab */}
          <TabsContent className="!mt-0 w-full" value="ongoing">
            <div className="w-full space-y-3">
              {loadingOngoing ? (
                // Show loading cards
                <>
                  <LoadingCard />
                  <LoadingCard />
                  <LoadingCard />
                </>
              ) : errorOngoing ? (
                // Show error state
                <ErrorCard error={errorOngoing} onRetry={fetchOngoingTasks} />
              ) : ongoingTasks.length === 0 ? (
                // Show empty state
                <EmptyState message="Tidak ada pekerjaan yang sedang berlangsung" />
              ) : (
                // Show actual tasks
                ongoingTasks.map((task) => (
                  <TaskCard key={task.id} task={task} />
                ))
              )}
            </div>
          </TabsContent>

          {/* Completed Tasks Tab */}
          <TabsContent className="!mt-0 w-full" value="history">
            <div className="w-full space-y-3">
              {loadingCompleted ? (
                // Show loading cards
                <>
                  <LoadingCard />
                  <LoadingCard />
                  <LoadingCard />
                </>
              ) : errorCompleted ? (
                // Show error state
                <ErrorCard error={errorCompleted} onRetry={fetchCompletedTasks} />
              ) : completedTasks.length === 0 ? (
                // Show empty state
                <EmptyState message="Tidak ada riwayat pekerjaan" />
              ) : (
                // Show actual completed tasks
                completedTasks.map((task) => (
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