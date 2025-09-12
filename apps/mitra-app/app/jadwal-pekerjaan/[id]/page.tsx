"use client";

import { PageBanner } from "@shared/components/mitra/page-banner";
import { CheckIcon, ChevronDown, ChevronUp } from "lucide-react";
import { useState } from "react";
import { AiFillCalendar, AiFillClockCircle } from "react-icons/ai";
import { BsClipboard2CheckFill } from "react-icons/bs";
import { DialogWrapper } from "libs/ui-components/src/components/dialog-wrapper";
import { DialogDescription, DialogTitle } from "@ui-components/components/ui/dialog";
import { Button } from "@ui-components/components/ui/button";
import { DateTimePicker } from "libs/ui-components/src/components/date-picker-time";

type Task = {
    date: string;
    time: string;
    status: "pending" | "in_progress" | "completed";
    isCurrent?: boolean;
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

// const TimelineIcon = ({ taskIndex, currentTaskIndex, isLast }: {
//     taskIndex: number;
//     currentTaskIndex: number;
//     isLast?: boolean;
// }) => {
//     return (
//         <div className="relative">
//             {/* Garis vertikal - hanya tampil jika bukan item terakhir */}
//             {!isLast && (
//                 <div
//                     className="absolute left-[5px] top-5 w-0.5 border-l h-16"
//                 ></div>
//             )}

//             {/* Icon container */}
//             <div className="relative z-10 mt-5">
//                 {taskIndex > currentTaskIndex ? (
//                     // Future task - gray circle with border
//                     <div className="w-3 h-3 rounded-full border-2 border-neutral-400 bg-neutral-400 relative">
//                         <div className="absolute left-1/2 top-1/2 w-6 h-6 border-[1.5px] border-dashed rounded-full border-gray-400 -translate-x-1/2 -translate-y-1/2"></div>
//                     </div>
//                 ) : taskIndex === currentTaskIndex ? (
//                     // Current task - orange circle
//                     <div className="w-3 h-3 rounded-full bg-orange-400 border-2 border-orange-400 relative">
//                         <div className="absolute left-1/2 top-1/2 w-6 h-6 border-[1.5px] border-dashed rounded-full border-orange-400 -translate-x-1/2 -translate-y-1/2"></div>
//                     </div>
//                 ) : (
//                     // Completed task - teal circle with check
//                     <div className="w-3 h-3 rounded-full bg-mainColor flex items-center justify-center relative">
//                         <CheckIcon size={8} className="text-white" />
//                         <div className="absolute left-1/2 top-1/2 w-6 h-6 border-[1.5px] border-dashed rounded-full border-mainColor -translate-x-1/2 -translate-y-1/2"></div>
//                     </div>
//                 )}
//             </div>
//         </div>
//     );
// };

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

const TimelineItemCompleted = ({
    task,
    currentTaskIndex = 0,
    completeTask = () => { }
}: {
    task: Task;
    currentTaskIndex: number;
    completeTask: () => void;
}) => {
    const [isOpen, setIsOpen] = useState(false);
    const TASK_INDEX = 2;
    const isOpenable = TASK_INDEX === currentTaskIndex;
    const [jobCompleted, setJobCompleted] = useState(false);

    return (
        <>
            <li className="mb-4 ms-6">
                <TimelineIcon
                    taskIndex={TASK_INDEX}
                    currentTaskIndex={currentTaskIndex}
                />
                <div className="flex items-center justify-between">
                    <div className="flex-1">
                        <time className="mb-1 text-sm font-normal leading-none text-gray-400">
                            ({task.date} - {task.time})
                        </time>
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
                                        setJobCompleted(true);
                                        completeTask();
                                        setIsOpen(false);
                                    }}
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
                onClose={() => setJobCompleted(false)}
            />
        </>
    );
};

const TimelineItemInProgress = ({
    task,
    currentTaskIndex = 0,
    completeTask = () => { }
}: {
    task: Task;
    currentTaskIndex: number;
    completeTask: () => void;
}) => {
    const [isOpen, setIsOpen] = useState(false);
    const TASK_INDEX = 1;
    const isOpenable = TASK_INDEX === currentTaskIndex;

    return (
        <li className="mb-4 ms-6">
            <TimelineIcon
                taskIndex={TASK_INDEX}
                currentTaskIndex={currentTaskIndex}
            />
            <div className="flex items-center justify-between">
                <div className="flex-1">
                    <time className="mb-1 text-sm font-normal leading-none text-gray-400">
                        ({task.date} - {task.time})
                    </time>
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
                        <DateTimePicker />

                        <div className="mt-4 flex justify-end">
                            <button
                                onClick={() => {
                                    setIsOpen(false);
                                    completeTask();
                                }}
                                className="px-4 py-2 bg-mainColor text-white rounded-md hover:bg-mainColor/80 transition-colors"
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

const TimelineItemPending = ({
    task,
    currentTaskIndex = 0,
    completeTask = () => { }
}: {
    task: Task;
    currentTaskIndex: number;
    completeTask: () => void;
}) => {
    const [isOpen, setIsOpen] = useState(false);
    const TASK_INDEX = 0;
    const isOpenable = TASK_INDEX === currentTaskIndex;

    return (
        <li className="mb-4 flex items-start space-x-4 relative">
            <div className="relative">
                <TimelineIcon
                    taskIndex={TASK_INDEX}
                    currentTaskIndex={currentTaskIndex}
                />
            </div>
            <div className="flex-1 min-w-0 pt-0.5 !ms-6">
                <time className="mb-1 text-sm font-normal leading-none text-gray-400">
                    ({task.date} - {task.time})
                </time>
                <h3 className="text-lg font-semibold text-gray-900">Terjadwal</h3>

                {isOpen && (
                    <>
                        <div className="border-b border-gray-200 my-2"></div>
                        <div className="mt-2 text-sm text-gray-600">
                            <p className="my-4 font-medium">Jadwal pengerjaan yang harus diselesaikan</p>
                            <p className="font-bold text-base text-black">Alamat</p>
                            <p className="mt-3 text-sm font-medium mb-4">
                                Jl. Cimanuk No.1A, Citarum, Kec. Bandung Wetan, Kota Bandung, Jawa Barat 40115
                            </p>

                            <div className="mt-4 flex justify-end">
                                <button
                                    onClick={() => {
                                        setIsOpen(false);
                                        completeTask();
                                    }}
                                    className="px-4 py-2 bg-mainColor text-white rounded-md hover:bg-mainColor/80 transition-colors"
                                >
                                    Mulai Pengerjaan
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

    const completeTask = () => {
        if (currentIndex < tasks.length - 1) {
            setCurrentIndex(currentIndex + 1);
        }
    };

    return (
        <ol className="relative border-s border-gray-200 dark:border-gray-700">
            <TimelineItemPending
                task={tasks[0]}
                currentTaskIndex={currentIndex}
                completeTask={completeTask}
            />

            <TimelineItemInProgress
                task={tasks[1]}
                currentTaskIndex={currentIndex}
                completeTask={completeTask}
            />

            <TimelineItemCompleted
                task={tasks[2]}
                currentTaskIndex={currentIndex}
                completeTask={completeTask}
            />
        </ol>
    );
};

const DetailTab = ({ tasks }: { tasks: Task[] }) => {
    return (
        <>
            <p className="mb-6 font-bold text-lg">Status Pengerjaan</p>
            <TaskTimeline tasks={tasks} />
        </>
    );
};

export default function PekerjaanBerlangsung() {
    const tasks: Task[] = [
        { date: "20/03/2025", time: "10:00 WIB", status: "pending", isCurrent: true },
        { date: "20/03/2025", time: "11:00 WIB", status: "in_progress", isCurrent: false },
        { date: "20/03/2025", time: "12:00 WIB", status: "completed", isCurrent: false },
    ];

    type TabType = "detail";
    const [currentTab, setCurrentTab] = useState<TabType>("detail");
    const tabs: { id: TabType; label: string }[] = [
        { id: "detail", label: "Detail" },
    ];

    return (
        <main className="pb-[20vh] relative">
            <PageBanner title="Pekerjaan Berlangsung" />

            <div className="bg-white dark:bg-slate-800 mx-4 rounded-md -m-8 z-30 relative">
                {/* Preview Section */}
                <div>
                    {/* Summary */}
                    <div className="flex items-center justify-between p-4">
                        <div className="mr-4">
                            <p className="text-lg font-bold">Dewi Gita Putri</p>
                            <p className="text-sm text-orange-400">Nomor Transaksi: TRX-005</p>
                            <p className="text-sm line-clamp-1">
                                Alamat: Jl. Raya No. 123 TEETETETET TEETETETET TEETETETET TEETETETET
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
                        <img src="/assets/sample-map.png" className="rounded-lg w-full object-cover" alt="Map" />
                    </div>

                    {/* Divider */}
                    <div className="grid grid-cols-5 pb-3 mx-4 border-b border-dashed border-gray-500"></div>

                    {/* Date and Status Info */}
                    <div className="flex mt-4 text-sm justify-around">
                        <div className="flex items-center gap-1">
                            <AiFillCalendar />
                            <p>20/03/2025</p>
                        </div>
                        <div className="flex items-center gap-1">
                            <AiFillClockCircle />
                            <p>10:00 WIB</p>
                        </div>
                        <div className="flex items-center gap-1 text-[#0369A1]">
                            <BsClipboard2CheckFill />
                            <p>Menunggu Proses</p>
                        </div>
                    </div>
                </div>

                {/* Tabs */}
                <div className="mt-6 mx-4 bg-mainColor/20 p-2 rounded-md">
                    <div className="flex space-x-3">
                        {tabs.map((tab, index) => (
                            <button
                                key={index}
                                className={`py-[5px] px-3 font-medium rounded-md ${tab.id === currentTab
                                    ? "bg-white text-black dark:bg-mainColor dark:text-white"
                                    : "bg-slate-400/10 dark:bg-gray-700"
                                    }`}
                                onClick={() => setCurrentTab(tab.id)}
                            >
                                {tab.label}
                            </button>
                        ))}
                    </div>
                </div>

                {/* Content */}
                <div className="mt-2 p-4">
                    {currentTab === "detail" && <DetailTab tasks={tasks} />}
                </div>
            </div>
        </main>
    );
}