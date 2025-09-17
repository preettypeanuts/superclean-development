"use client"

import { AiFillInfoCircle, AiFillStar, AiOutlineStar } from "react-icons/ai";
import { useState, useEffect } from "react";
import { api } from "../../../../utils/apiClient";

// Interface sesuai dengan API response
interface ReviewData {
    username: string;
    transaction: {
        id: string;
        trxNumber: string;
        trxDate: string;
        rating: number;
        review: string | null;
    };
    insentive: {
        amount: number;
        attendanceDate: string | null;
    };
}

// Interface untuk response API
interface ApiResponse {
    status: string;
    data: [ReviewData[], number];
}

interface TipWidgetProps {
    blower?: boolean;
}

export const TipWidget = ({ blower = false }: TipWidgetProps) => {
    const [totalTip, setTotalTip] = useState(0);
    const [averageRating, setAverageRating] = useState(0);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const fetchTipData = async () => {
        try {
            setLoading(true);
            setError(null);
            
            const response: ApiResponse = await api.get('/transaction/review-mitra?page=1&limit=100');
            
            if (response && response.status === "success") {
                const reviews = response.data[0];
                
                // Calculate total tip amount (only for non-blower mode)
                if (!blower) {
                    const totalTipAmount = reviews.reduce((sum, item) => sum + item.insentive.amount, 0);
                    setTotalTip(totalTipAmount);
                }
                
                // Calculate average rating (only for reviews with rating > 0)
                const validRatings = reviews.filter(item => item.transaction.rating > 0);
                if (validRatings.length > 0) {
                    const avgRating = validRatings.reduce((sum, item) => sum + item.transaction.rating, 0) / validRatings.length;
                    setAverageRating(Math.round(avgRating * 10) / 10); // Round to 1 decimal place
                } else {
                    setAverageRating(0);
                }
            }
        } catch (err) {
            console.error('Error fetching tip data:', err);
            setError(err instanceof Error ? err.message : 'Terjadi kesalahan saat memuat data');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchTipData();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const formatCurrency = (amount: number) => {
        return new Intl.NumberFormat('id-ID', {
            style: 'currency',
            currency: 'IDR',
            minimumFractionDigits: 0,
            maximumFractionDigits: 0,
        }).format(amount).replace('IDR', 'Rp');
    };

    const renderStars = (rating: number) => {
        const stars: JSX.Element[] = [];
        const fullStars = Math.floor(rating);
        
        for (let i = 0; i < 5; i++) {
            if (i < fullStars) {
                stars.push(
                    <AiFillStar key={i} className="text-yellow-400 text-[25px]" />
                );
            } else {
                stars.push(
                    <AiOutlineStar key={i} className="text-[25px] text-muted" />
                );
            }
        }
        return stars;
    };

    const getCurrentMonthYear = () => {
        const now = new Date();
        const monthNames = [
            'Januari', 'Februari', 'Maret', 'April', 'Mei', 'Juni',
            'Juli', 'Agustus', 'September', 'Oktober', 'November', 'Desember'
        ];
        return `${monthNames[now.getMonth()]} ${now.getFullYear()}`;
    };

    if (loading) {
        return (
            <main className="mx-5">
                <section className="w-full h-full bg-gradient-to-b from-mainColor to-mainDark rounded-lg p-2 space-y-2 animate-pulse">
                    <div className="w-full flex items-center justify-between">
                        <div className="h-3 bg-white/20 rounded w-40"></div>
                        <div className="w-4 h-4 bg-white/20 rounded-full"></div>
                    </div>
                    {!blower && (
                        <>
                            <div className="h-8 bg-white/20 rounded w-32"></div>
                            <div className="w-full h-[1px] bg-white/40"></div>
                        </>
                    )}
                    <div className="space-y-2">
                        <div className="h-3 bg-white/20 rounded w-20"></div>
                        <div className="flex items-center justify-between">
                            <div className="flex items-center gap-2">
                                {[...Array(5)].map((_, i) => (
                                    <div key={i} className="w-6 h-6 bg-white/20 rounded"></div>
                                ))}
                            </div>
                            <div className="h-4 bg-white/20 rounded w-8"></div>
                        </div>
                    </div>
                </section>
            </main>
        );
    }

    if (error) {
        return (
            <main className="mx-5">
                <section className="w-full h-full bg-gradient-to-b from-red-400 to-red-600 rounded-lg p-2 space-y-2">
                    <div className="text-center text-white">
                        <p className="text-sm mb-2">Gagal memuat data</p>
                        <button 
                            onClick={fetchTipData}
                            className="text-xs bg-white/20 px-3 py-1 rounded"
                        >
                            Coba Lagi
                        </button>
                    </div>
                </section>
            </main>
        );
    }

    return (
        <main className="mx-5">
            <section className="w-full h-full bg-gradient-to-b from-mainColor to-mainDark rounded-lg p-2 space-y-2">
                <div className="w-full flex items-center justify-between">
                    <p className="font-[400] text-[12px] text-white">
                        {blower ? `Total Rating - ${getCurrentMonthYear()}` : `Total Uang Tip - ${getCurrentMonthYear()}`}
                    </p>
                    <AiFillInfoCircle className="text-white" />
                </div>
                
                {!blower && (
                    <>
                        <h1 className="font-semibold text-2xl text-white">
                            {formatCurrency(totalTip)}
                        </h1>
                        <div className="w-full h-[1px] bg-white/40"></div>
                    </>
                )}
                
                <div className="space-y-2">
                    <p className="font-[400] text-[12px] text-white">
                        Total Poin
                    </p>
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                            {renderStars(averageRating)}
                        </div>
                        <p className="font-bold text-[16px] text-white">
                            {averageRating > 0 ? `${averageRating}/5` : '0/5'}
                        </p>
                    </div>
                </div>
            </section>
        </main>
    );
};