"use client"

import { useState, useEffect } from "react";
import { BsArrowRight } from "react-icons/bs";
import { AiFillCalendar } from "react-icons/ai";
import { AiFillClockCircle } from "react-icons/ai";
import { BsClipboard2CheckFill } from "react-icons/bs";
import Link from "next/link";
import { useUserProfile } from "../../../../utils/useUserProfile";
import { api } from "../../../../utils/apiClient";

// Interface untuk data ongoing task
interface OngoingTaskData {
    id: string;
    trxNumber: string;
    customerId: string;
    customerName: string;
    branchId: string;
    finalPrice: number
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
        data: OngoingTaskData[];
        meta: {
            page: number;
            limit: number;
            total: number;
            totalPages: number;
        };
    };
}

export const OngoingTask = () => {
    const { user } = useUserProfile();
    const [ongoingTask, setOngoingTask] = useState<OngoingTaskData | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    // Fetch data dari API
    useEffect(() => {
        const fetchOngoingTask = async () => {
            try {
                setLoading(true);
                setError(null);

                const response = await api.get('/transaction/page/spk/ongoing?page=1&limit=10');

                console.log('API Response:', response); // Debug log

                // Validasi struktur response
                if (response && response.status) {
                    // Cek apakah data ada dan merupakan array
                    const taskData = response.data || response.data || [];
                    console.log(taskData[0][0], "<<");


                    if (Array.isArray(taskData) && taskData.length > 0) {
                        setOngoingTask(taskData[0][0]);
                        // Ambil task pertama sebagai ongoing task
                    } else {
                        setOngoingTask(null);
                    }
                } else {
                    setOngoingTask(null);
                }
            } catch (err) {
                console.error('Error fetching ongoing task:', err);
                setError(err instanceof Error ? err.message : 'Terjadi kesalahan saat memuat data');
            } finally {
                setLoading(false);
            }
        };

        fetchOngoingTask();
    }, []);

    const getPathByRole = () => {
        if (user?.roleId === "Staff Blower") {
            return "/jadwal-pekerjaan";
        }
        return "/daftar-spk";
    };

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
                return 'bg-white text-secondaryColorDark';
            case 'dalam proses':
            case 'processing':
                return 'bg-yellow-100 text-yellow-800';
            case 'selesai':
            case 'completed':
                return 'bg-green-100 text-green-800';
            default:
                return 'bg-white text-secondaryColorDark';
        }
    };

    const handleRetry = () => {
        const fetchOngoingTask = async () => {
            try {
                setLoading(true);
                setError(null);

                const response: ApiResponse = await api.get('/transaction/page/spk/ongoing?page=1&limit=10');

                if (response.status && response.data.data.length > 0) {
                    setOngoingTask(response.data.data[0]);
                } else {
                    setOngoingTask(null);
                }
            } catch (err) {
                console.error('Error fetching ongoing task:', err);
                setError(err instanceof Error ? err.message : 'Terjadi kesalahan saat memuat data');
            } finally {
                setLoading(false);
            }
        };

        fetchOngoingTask();
    };

    return (
        <main className="mx-5 space-y-[12px]">
            <section className="w-full flex items-center justify-between">
                <p className="text-[20px] font-medium tracking-tight">
                    Pekerjaan Berlangsung
                </p>
                <Link href={getPathByRole()}>
                    <button className="text-[22px] w-[34px] h-[34px] flex items-center justify-center rounded-full bg-mainColor/20 text-mainDark">
                        <BsArrowRight />
                    </button>
                </Link>
            </section>

            {loading ? (
                <section className="w-full h-full p-4 rounded-lg bg-mainColor/10 animate-pulse">
                    <div className="space-y-3">
                        <div className="h-4 bg-gray-300 rounded w-1/2"></div>
                        <div className="h-6 bg-gray-300 rounded w-3/4"></div>
                        <div className="h-4 bg-gray-300 rounded w-full"></div>
                        <div className="h-4 bg-gray-300 rounded w-2/3"></div>
                    </div>
                </section>
            ) : error ? (
                <section className="w-full h-full p-4 rounded-lg bg-red-100 border border-red-300">
                    <p className="text-red-700 text-center">
                        {error}
                    </p>
                    <button
                        onClick={handleRetry}
                        className="mt-2 px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600 w-full"
                    >
                        Coba Lagi
                    </button>
                </section>
            ) : !ongoingTask ? (
                <section className="w-full h-full p-4 rounded-lg bg-gray-100 border border-gray-300">
                    <p className="text-gray-600 text-center">
                        Tidak ada pekerjaan yang sedang berlangsung
                    </p>
                </section>
            ) : (
                <Link href="">
                    <section className="w-full h-full p-2 space-y-2 rounded-lg bg-mainColor text-white">
                        <p className="text-[14px] text-[400]">
                            Pekerjaan Yang Berlangsung
                        </p>
                        <div className="grid grid-cols-5 border-b border-bottom-dash pb-3">
                            <div className="col-span-4">
                                <h1 className="text-[20px] font-semibold">
                                    {ongoingTask.customerName}
                                </h1>
                                <div className="text-[14px]">
                                    <p>
                                        Nomor Transaksi : {ongoingTask.trxNumber}
                                    </p>
                                    <p className="truncate truncate-last-1">
                                        Alamat: {ongoingTask.address}
                                    </p>
                                </div>
                            </div>
                            <div className="col-span-1 w-full h-full flex items-center justify-end">
                                <div className="flex items-end justify-end">
                                    <div className="w-[45px] h-[45px] aspect-square bg-white flex items-center justify-center rounded-md">
                                        <div
                                            className="w-10 h-10 bg-mainColor"
                                            style={{
                                                mask: "url(/assets/SC_LogoOnlyBig.png) no-repeat center / contain",
                                                WebkitMask: "url(/assets/SC_LogoOnlyBig.png) no-repeat center / contain",
                                            }}
                                        ></div>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="flex flex-col gap-2 text-[14px] pt-1.5">
                            <div className="flex items-center gap-2">
                                <div className="flex items-center gap-1">
                                    <AiFillCalendar />
                                    <p>
                                        {formatDate(ongoingTask.trxDate)}
                                    </p>
                                </div>
                                <div className="flex items-center gap-1">
                                    <AiFillClockCircle />
                                    <p>
                                        {formatTime(ongoingTask.trxDate)}
                                    </p>
                                </div>
                            </div>
                            <div className={`flex items-center gap-1 px-2 py-1 rounded-full w-fit ${getStatusColor(ongoingTask.statusLabel)}`}>
                                <BsClipboard2CheckFill />
                                <p>
                                    {ongoingTask.statusLabel}
                                </p>
                            </div>
                        </div>
                    </section>
                </Link>
            )}
        </main>
    )
}