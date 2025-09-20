"use client";

import { PageBanner } from "@shared/components/mitra/page-banner";
import { api } from "@shared/utils/apiClient";
import { Button } from "@ui-components/components/ui/button";
import { DialogDescription, DialogTitle } from "@ui-components/components/ui/dialog";
import { DateTimePicker } from "libs/ui-components/src/components/date-picker-time";
import { DialogWrapper } from "libs/ui-components/src/components/dialog-wrapper";
import { CheckIcon, ChevronDown, ChevronUp } from "lucide-react";
import { useParams } from "next/navigation";
import React, { useEffect, useState } from "react";
import { AiFillCalendar, AiFillClockCircle } from "react-icons/ai";
import { BsClipboard2CheckFill } from "react-icons/bs";

type Task = {
  date: string;
  time: string;
  status: "pending" | "in_progress" | "completed";
  isCurrent?: boolean;
  isCompleted?: boolean;
};

type JobCompletedModalProps = {
  isOpen: boolean;
  onClose: () => void;
};

const JobCompletedModal = ({ isOpen, onClose }: JobCompletedModalProps) => {
  return (
    <DialogWrapper
      className="w-10/12"
      open={isOpen}
      onOpenChange={onClose}
    >
      <div className="flex items-center justify-between">
        <img src="/assets/job-complete.png" className="w-full max-w-[50%] mx-auto" />
      </div>
      <DialogTitle className="text-center">Pekerjaan Selesai</DialogTitle>
      <DialogDescription className="text-center font-medium text-sm">
        Semua tugasmu telah berhasil diselesaikan.
        <br />
        Terima Kasih
      </DialogDescription>
      <div className="flex">
        <Button className="flex-1 mx-2" variant="main" onClick={onClose}>Kembali ke Dashboard</Button>
      </div>
    </DialogWrapper>
  );
};


const TimelineIcon = ({ taskIndex, currentTaskIndex }: {
  taskIndex: number;
  currentTaskIndex: number;
}) => {
  return (
    <>
      {taskIndex > currentTaskIndex ? (
        <>
          <div className="absolute w-3 h-3 rounded-full mt-1.5 -start-1.5 bg-gray-500 dark:border-gray-500 dark:bg-gray-500 flex items-center justify-center">
            <div className="absolute left-1/2 top-1/2 w-6 h-6 border-[1.5px] border-dashed rounded-full border-gray-400 -translate-x-1/2 -translate-y-1/2"></div>
          </div>
        </>
      ) : taskIndex === currentTaskIndex ? (
        <>
          <div className="absolute w-3 h-3 bg-orange-400 rounded-full mt-1.5 -start-1.5 dark:border-orange-400 dark:bg-orange-400 flex items-center justify-center">
            <div className="absolute left-1/2 top-1/2 w-6 h-6 border-[1.5px] border-dashed rounded-full border-orange-400 -translate-x-1/2 -translate-y-1/2"></div>
          </div>
        </>
      ) : (
        <>
          <div className="absolute w-3 h-3 bg-mainColor rounded-full mt-1.5 -start-1.5 dark:border-mainDark dark:bg-mainDark flex items-center justify-center">
            <CheckIcon size={8} className="text-white" />
            <div className="absolute left-1/2 top-1/2 w-6 h-6 border-[1.5px] border-dashed rounded-full border-mainColor -translate-x-1/2 -translate-y-1/2"></div>
          </div>
        </>
      )}
    </>
  );
};

const TimelineItemCompleted = () => {

  const transaction = React.useContext(TransactionContext);

  const TASK_INDEX = 3;
  const isOpenable = TASK_INDEX <= transaction.transactionDetail?.deliveryStatus!;
  const isCurrent = TASK_INDEX === transaction.transactionDetail?.deliveryStatus!;


  const [isOpen, setIsOpen] = useState(isOpenable);
  const [jobCompleted, setJobCompleted] = useState(false);

  const [isLoading, setIsLoading] = useState(false);
  const trxId = transaction.transactionDetail?.id; // replace with actual trxId from props or state

  const handleCompleteTask = async () => {
    try {
      setIsLoading(true);
      const response = await api.put(`/transaction/${trxId}/blower`, {
        status: 4, // completed
        actionDate: new Date().toISOString(),
      });

      setJobCompleted(true);
    } catch (error) {
      console.error('Error completing task:', error);
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <>
      <li className="mb-4 ms-6">
        <TimelineIcon
          taskIndex={TASK_INDEX}
          currentTaskIndex={transaction.transactionDetail?.deliveryStatus!}
        />
        <div className="flex items-center justify-between">
          <div className="flex-1">
            <h3 className="text-lg font-semibold text-gray-900">
              Selesai & Diterima Pelanggan
            </h3>
          </div>
          <div className="pt-0.5">
            {isOpen ? (
              <ChevronUp
                className={`w-4 h-4 text-gray-400 ${isOpenable ? 'cursor-pointer' : ''}`}
                onClick={() => isOpenable && setIsOpen(!isOpen)}
              />
            ) : (
              <ChevronDown
                className={`w-4 h-4 text-gray-400 ${isOpenable ? 'cursor-pointer' : ''}`}
                onClick={() => isOpenable && setIsOpen(!isOpen)}
              />
            )}
          </div>
        </div>

        {isOpen && (
          <>
            <div className="border-b border-gray-200 my-2"></div>
            <div>
              <p className="text-sm mb-4">
                Jika pelanggan sudah puas dan pekerjaan sudah selesai,
                mohon untuk klik tombol <span className="font-bold">"Selesai"</span>
              </p>
              <div className="flex">
                <Button
                  className="flex-1"
                  variant="main"
                  onClick={() => {
                    handleCompleteTask();
                  }}
                  disabled={isLoading || !isCurrent}
                >
                  Selesai
                </Button>
              </div>
            </div>
          </>
        )}
      </li>

      <JobCompletedModal
        isOpen={jobCompleted}
        onClose={() => { window.location.reload(); }}
      />
    </>
  );
};

const TimelineItemInProgress = () => {
  const transaction = React.useContext(TransactionContext);

  const TASK_INDEX = 2;
  const isOpenable = TASK_INDEX <= transaction.transactionDetail?.deliveryStatus!;
  const isCurrent = TASK_INDEX === transaction.transactionDetail?.deliveryStatus!;

  const [isOpen, setIsOpen] = useState(isOpenable);

  const [selectedDate, setSelectedDate] = useState<Date | undefined>(undefined);
  const [selectedTime, setSelectedTime] = useState<string | undefined>(undefined);

  useEffect(() => {
    if (transaction.transactionDetail?.deliveryDate && !isCurrent) {

      const deliveryDate = new Date(transaction.transactionDetail.deliveryDate);
      setSelectedDate(deliveryDate);
      const hours = deliveryDate.getHours().toString().padStart(2, '0');
      const minutes = deliveryDate.getMinutes().toString().padStart(2, '0');
      setSelectedTime(`${hours}:${minutes}`);


    } else {
      setSelectedDate(undefined);
      setSelectedTime(undefined);
    }
  }, [transaction.transactionDetail?.deliveryDate]);

  const [isLoading, setIsLoading] = useState(false);
  const trxId = transaction.transactionDetail?.id; // replace with actual trxId from props or state

  const handleCompleteTask = async () => {
    try {
      const actionDate = selectedDate;
      actionDate?.setHours(parseInt(selectedTime?.split(':')[0] || '0'));
      actionDate?.setMinutes(parseInt(selectedTime?.split(':')[1] || '0'));

      const response = await api.put(`/transaction/${trxId}/blower`, {
        status: 3, // completed
        actionDate: actionDate ? actionDate.toISOString() : new Date().toISOString(),
      });

      window.location.reload();
    }
    catch (error) {
      console.error('Error completing task:', error);
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <li className="mb-4 ms-6">
      <TimelineIcon
        taskIndex={TASK_INDEX}
        currentTaskIndex={transaction.transactionDetail?.deliveryStatus!}
      />
      <div className="flex items-center justify-between">
        <div className="flex-1">
          <h3 className="text-lg font-semibold text-gray-900">
            Jadwal Pengambilan
          </h3>
        </div>
        <div className="pt-0.5">
          {isOpen ? (
            <ChevronUp
              className={`w-4 h-4 text-gray-400 ${isOpenable ? 'cursor-pointer' : ''}`}
              onClick={() => isOpenable && setIsOpen(!isOpen)}
            />
          ) : (
            <ChevronDown
              className={`w-4 h-4 text-gray-400 ${isOpenable ? 'cursor-pointer' : ''}`}
              onClick={() => isOpenable && setIsOpen(!isOpen)}
            />
          )}
        </div>
      </div>

      {isOpen && (
        <>
          <div className="border-b border-gray-200 my-2"></div>
          <div className="mt-2 text-sm text-gray-600">
            <p className="my-4 font-sm text-muted-foreground">
              Tentukan jam pengambilan
            </p>
            <DateTimePicker
              startFrom={new Date()}
              onChange={({ date, time }) => {
                setSelectedDate(date);
                setSelectedTime(time);
              }}
              disabled={!isCurrent}
              value={!isCurrent ? { date: selectedDate, time: selectedTime } : undefined}
            />

            <div className="mt-4 flex justify-end">
              <button
                disabled={!selectedDate || !selectedTime || isLoading || !isCurrent}
                onClick={() => {
                  handleCompleteTask();
                }}
                className="px-4 py-2 bg-mainColor text-white rounded-md hover:bg-mainColor/80 transition-colors disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:bg-mainColor/100"
              >
                Sudah Diambil
              </button>
            </div>
          </div>
          <div className="border-b border-gray-200 my-2"></div>
        </>
      )}
    </li>
  );
};

const TimelineItemPending = () => {
  const transaction = React.useContext(TransactionContext);

  const TASK_INDEX = 1;
  const isOpenable = TASK_INDEX <= transaction.transactionDetail?.deliveryStatus!;
  const isCurrent = TASK_INDEX === transaction.transactionDetail?.deliveryStatus!;

  const [isOpen, setIsOpen] = useState(isOpenable);
  const trxId = transaction.transactionDetail?.id; // replace with actual trxId from props or state

  const [isLoading, setIsLoading] = useState(false);

  const handleCompleteTask = async () => {
    try {
      setIsLoading(true);
      const response = await api.put(`/transaction/${trxId}/blower`, {
        status: 2, // in progress
        actionDate: new Date().toISOString(),
      });

      window.location.reload();

    } catch (error) {
      console.error('Error completing task:', error);
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <li className="mb-4 flex items-start relative">
      <div className="relative">
        <TimelineIcon
          taskIndex={TASK_INDEX}
          currentTaskIndex={transaction.transactionDetail?.deliveryStatus!}
        />
      </div>
      <div className="flex-1 min-w-0 pt-0.5 !ms-6">
        <h3 className="text-lg font-semibold text-gray-900" onClick={() => isOpenable && setIsOpen(!isOpen)}>Terjadwal</h3>

        {isOpen && (
          <>
            <div className="border-b border-gray-200 my-2"></div>
            <div className="mt-2 text-sm text-gray-600">
              <p className="my-4 font-medium">Jadwal pengerjaan yang harus diselesaikan</p>
              <p className="font-bold text-base text-black">Alamat</p>
              <p className="mt-3 text-sm font-medium mb-4">
                {transaction.customerDetail?.address}, {transaction.customerDetail?.subDistrict}, {transaction.customerDetail?.district}, {transaction.customerDetail?.city}, {transaction.customerDetail?.province}
              </p>

              <div className="mt-4 flex justify-end">
                <button
                  onClick={() => {
                    handleCompleteTask();
                  }}
                  disabled={isLoading || !isCurrent}
                  className="px-4 py-2 bg-mainColor text-white rounded-md hover:bg-mainColor/80 transition-colors disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:bg-mainColor/100"
                >
                  Sudah diantar
                </button>
              </div>
            </div>
            <div className="border-b border-gray-200 my-2"></div>
          </>
        )}
      </div>

      <div className="pt-0.5">
        {isOpen ? (
          <ChevronUp
            className={`w-4 h-4 text-gray-400 ${isOpenable ? 'cursor-pointer' : ''}`}
            onClick={() => isOpenable && setIsOpen(!isOpen)}
          />
        ) : (
          <ChevronDown
            className={`w-4 h-4 text-gray-400 ${isOpenable ? 'cursor-pointer' : ''}`}
            onClick={() => isOpenable && setIsOpen(!isOpen)}
          />
        )}
      </div>
    </li>
  );
};

const TaskTimeline = ({ tasks }: { tasks: Task[] }) => {
  const [currentIndex, setCurrentIndex] = useState(
    tasks.findIndex(task => task.isCurrent)
  );

  useEffect(() => {
    const allCompleted = tasks.findIndex(task => task.isCompleted);
    if (allCompleted !== -1) {
      setCurrentIndex(tasks.length + 1);
    }
  }, [tasks]);

  const completeTask = () => {
    // todo: update status to backend

    // if (currentIndex < tasks.length - 1) {
    //   setCurrentIndex(currentIndex + 1);
    // }
  };

  return (
    <ol className="relative border-s border-gray-200 dark:border-gray-700">
      <TimelineItemPending />

      <TimelineItemInProgress />

      <TimelineItemCompleted />
    </ol>
  );
};

const DetailTab = ({
  tasks,
  transactionDetail,
  customerDetail
}:
  {
    tasks: Task[],
    transactionDetail: MitraSPKDetail,
    customerDetail: MitraCustomerDetail
  }) => {
  return (
    <>
      <p className="mb-6 font-bold text-lg">Status Pengerjaan</p>
      <TaskTimeline tasks={tasks} />
    </>
  );
};

export interface MitraSPKDetail {
  id: string;
  trxNumber: string;
  customerId: string;
  branchId: string;
  totalPrice: number;
  discountPrice: number;
  totalPromoPrice: number;
  finalPrice: number;
  trxDate: string;
  deliveryDate: string;
  deliveryStatus: number;
  additionalFee: number;
  notes: string;
  details: MitraSPKItemDetail[];
  assigns: string[];
  blowers: string[];
  reassigns: string[];
}

export interface MitraSPKItemDetail {
  id: string;
  trxNumber: string;
  serviceCategory: string;
  serviceCode: string;
  serviceName: string;
  serviceType: number;
  quantity: number;
  promoCode: string;
  servicePrice: number;
  totalPrice: number;
  promoPrice: number;
  isPl: number;
  isDelete: number;
  service: {
    id: string;
    code: string;
    name: string;
    category: string;
    unit: string;
    vacuumPrice: number;
    cleanPrice: number;
    status: number;
    createdAt: string;
    createdBy: string;
    updatedAt: string | null;
    updatedBy: string | null;
  }
}

export interface MitraCustomerDetail {
  id: string;
  fullname: string;
  address: string;
  province: string;
  city: string;
  district: string;
  subDistrict: string;
  customerType: "Pribadi";
  latitude: -6.2;
  longitude: 106.816666;
}

export interface LocationData {
  id: string;
  paramKey: string;
  paramValue: string;
}

const findStatusLabel = (status: number) => {
  switch (status) {
    case 1:
      return "Menunggu diantar";
    case 2:
      return "Menunggu diambil";
    case 3:
      return "Dalam Pengambilan";
    case 4:
      return "Selesai";
    default:
      return "Unknown";
  }
}


const TransactionContext = React.createContext<{
  transactionDetail: MitraSPKDetail | null;
  customerDetail: MitraCustomerDetail | null;
}>({
  transactionDetail: null,
  customerDetail: null,
});

export default function PekerjaanBerlangsung() {
  const params = useParams();
  const [trxNumber, setTrxNumber] = useState<string>("");

  const [transactionDetail, setTransactionDetail] = useState<MitraSPKDetail>(null as any);
  const [customerDetail, setCustomerDetail] = useState<MitraCustomerDetail>(null as any);

  // get params from url
  useEffect(() => {
    if (!params || !params.id) return;
    const { id } = params; // Access the dynamic route parameter 'id'

    const trxNumberRaw = id?.toString() as string;
    const trxNumber = decodeURIComponent(trxNumberRaw);
    setTrxNumber(trxNumber);
  }, [params]);

  // get transaction detail from api
  useEffect(() => {
    if (!trxNumber) return;

    const fetchTransactionDetail = async () => {
      try {
        const response = await api.get(`/transaction/detail?trxNumber=${trxNumber}`);
        // response.data.deliveryStatus = 1; // force in progress
        setTransactionDetail(response.data as MitraSPKDetail);
      } catch (error) {
        console.error("Error fetching transaction detail:", error);
      }
    };

    fetchTransactionDetail();

  }, [trxNumber]);

  // get customer detail from api
  useEffect(() => {
    if (!transactionDetail) return;

    const fetchCustomerDetail = async () => {
      try {
        const response = await api.get(`/customer/id/${transactionDetail.customerId}`);
        const customerDetailResponse = response.data as MitraCustomerDetail;

        const [provinceRes, cityRes, districtRes, subDistrictRes] = await Promise.all([
          api.get(`/parameter/provinces`),
          api.get(`/parameter/cities?province=${customerDetailResponse.province}`),
          api.get(`/parameter/districts?province=${customerDetailResponse.province}&city=${customerDetailResponse.city}`),
          api.get(`/parameter/sub-districts?province=${customerDetailResponse.province}&city=${customerDetailResponse.city}&district=${customerDetailResponse.district}`)
        ]);

        const findLabel = (items: LocationData[], code: string) => {
          const item = items.find(item => item.paramKey === code);
          return item ? item.paramValue : code;
        };

        customerDetailResponse.province = findLabel(provinceRes.data, customerDetailResponse.province);
        customerDetailResponse.city = findLabel(cityRes.data, customerDetailResponse.city);
        customerDetailResponse.district = findLabel(districtRes.data, customerDetailResponse.district);
        customerDetailResponse.subDistrict = findLabel(subDistrictRes.data, customerDetailResponse.subDistrict);

        setCustomerDetail(customerDetailResponse);

      } catch (error) {
        console.error("Error fetching customer detail:", error);
      }
    };

    fetchCustomerDetail();
  }, [transactionDetail]);

  if (!transactionDetail || !customerDetail) {
    return (
      <main className="pb-[20vh] relative">
        Memuat...
      </main>
    );
  }

  const tasks: Task[] = [
    { date: "20/03/2025", time: "10:00 WIB", status: "pending", isCurrent: transactionDetail.deliveryStatus === 1 },
    { date: "20/03/2025", time: "11:00 WIB", status: "in_progress", isCurrent: transactionDetail.deliveryStatus === 2 },
    { date: "20/03/2025", time: "12:00 WIB", status: "completed", isCurrent: transactionDetail.deliveryStatus === 3, isCompleted: transactionDetail.deliveryStatus === 4 },
  ];

  return (
    <TransactionContext.Provider value={{ transactionDetail, customerDetail }}>
      <main className="pb-[20vh] relative">
        <PageBanner title="Pekerjaan Berlangsung" />

        <div className="bg-white dark:bg-slate-800 mx-4 rounded-md -m-8 z-30 relative">
          {/* Preview Section */}
          <div>
            {/* Summary */}
            <div className="flex items-center justify-between p-4">
              <div className="mr-4">
                <p className="text-lg font-bold">Dewi Gita Putri</p>
                <p className="text-sm text-orange-400">Nomor Transaksi: {trxNumber}</p>
                <p className="text-sm line-clamp-1">
                  {customerDetail.address}, {customerDetail.subDistrict}, {customerDetail.district}, {customerDetail.city}, {customerDetail.province}
                </p>
              </div>

              <div className="flex items-center justify-center">
                <div className="w-16 h-16 bg-mainColor flex items-center justify-center rounded-md">
                  <div className="w-10 h-10">
                    <img src="/assets/mitra-icon.png" className="w-full h-full" alt="Mitra" />
                  </div>
                </div>
              </div>
            </div>

            {/* Map */}
            <div className="flex w-full px-4 max-h-48 justify-between">
              <iframe
                src={`https://maps.google.com/maps?q=${customerDetail.latitude},${customerDetail.longitude}&z=14&output=embed`}
                loading="lazy"
                className="w-full h-48 rounded-md"
                allowFullScreen
                referrerPolicy="no-referrer-when-downgrade"
              />
            </div>

            {/* Divider */}
            <div className="grid grid-cols-5 pb-3 mx-4 border-b border-dashed border-gray-500"></div>

            {/* Date and Status Info */}
            <div className="flex mt-4 text-sm justify-around">
              <div className="flex items-center gap-1">
                <AiFillCalendar />
                <p>{new Date(transactionDetail.trxDate).toLocaleDateString('en-GB')}</p>
              </div>
              <div className="flex items-center gap-1">
                <AiFillClockCircle />
                <p>{new Date(transactionDetail.trxDate).toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit' })} WIB</p>
              </div>
              <div className="flex items-center gap-1 text-[#0369A1]">
                <BsClipboard2CheckFill />
                <p>{findStatusLabel(transactionDetail.deliveryStatus)}</p>
              </div>
            </div>
          </div>

          {/* Tabs */}
          <div className="mt-6 mx-4 bg-mainColor/20 p-2 rounded-md">
            <div className="flex space-x-3">
              <button className={`py-[5px] px-3 font-medium rounded-md bg-white text-black dark:bg-mainColor dark:text-white`}>
                Detail
              </button>
            </div>
          </div>

          {/* Content */}
          <div className="mt-2 p-4">
            <DetailTab tasks={tasks} transactionDetail={transactionDetail} customerDetail={customerDetail} />
          </div>
        </div>
      </main>
    </TransactionContext.Provider>
  );
}
