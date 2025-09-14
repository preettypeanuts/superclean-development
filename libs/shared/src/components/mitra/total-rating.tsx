"use client";

import { BsArrowRight } from "react-icons/bs";
import { AiFillStar, AiOutlineStar } from "react-icons/ai";
import Link from "next/link";
import { useState, useEffect } from "react";
import { api } from "../../../../utils/apiClient";

// Interface untuk data rating dari API
interface ReviewData {
    username: string;
    customer: {
        fullname: string;
    };
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

interface ApiResponse {
    status: string;
    data: [ReviewData[], number];
}

interface RatingStats {
    averageRating: number;
    totalReviews: number;
    ratingCounts: { [key: number]: number };
}

export const TotalRating = () => {
    const [ratingStats, setRatingStats] = useState<RatingStats>({
        averageRating: 0,
        totalReviews: 0,
        ratingCounts: {}
    });
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        fetchRatingData();
    }, []);

    const fetchRatingData = async () => {
        try {
            setLoading(true);
            setError(null);

            const response: ApiResponse = await api.get('/transaction/review-mitra?page=1&limit=100');

            if (response && response.status === "success") {
                const reviews = response.data[0];
                calculateRatingStats(reviews);
            }
        } catch (err) {
            console.error('Error fetching rating data:', err);
            setError('Failed to load rating data');
        } finally {
            setLoading(false);
        }
    };

    const calculateRatingStats = (reviews: ReviewData[]) => {
        // Filter hanya review yang sudah ada rating (> 0)
        const reviewsWithRating = reviews.filter(review => review.transaction.rating > 0);

        if (reviewsWithRating.length === 0) {
            setRatingStats({
                averageRating: 0,
                totalReviews: 0,
                ratingCounts: {}
            });
            return;
        }

        // Hitung total rating
        const totalRating = reviewsWithRating.reduce((sum, review) => sum + review.transaction.rating, 0);
        const averageRating = totalRating / reviewsWithRating.length;

        // Hitung distribusi rating
        const ratingCounts: { [key: number]: number } = {};
        reviewsWithRating.forEach(review => {
            const rating = review.transaction.rating;
            ratingCounts[rating] = (ratingCounts[rating] || 0) + 1;
        });

        setRatingStats({
            averageRating: Math.round(averageRating * 10) / 10, // Round to 1 decimal
            totalReviews: reviewsWithRating.length,
            ratingCounts
        });
    };

    const renderStars = (rating: number) => {
        const filledStars = Math.floor(rating);
        const stars: React.ReactNode[] = [];

        for (let i = 1; i <= 5; i++) {
            if (i <= filledStars) {
                stars.push(
                    <AiFillStar key={i} className="text-yellow-400 text-[25px]" />
                );
            } else {
                stars.push(
                    <AiOutlineStar key={i} className="text-[25px] text-muted-foreground" />
                );
            }
        }

        return stars;
    };

    const getMotivationalMessage = (rating: number, totalReviews: number) => {
        if (totalReviews === 0) {
            return "Belum ada review, ayo berikan pelayanan terbaik!";
        }

        if (rating === 5) {
            return "Luar biasa! Rating kamu sempurna!";
        } else if (rating >= 4.8) {
            return "Ayo semangattt, dikit lagi nilai kamu sempurna!";
        } else if (rating >= 4.5) {
            return "Ayo semangattt, dikit lagi nilai kamu sempurna!";
        } else if (rating >= 4.0) {
            return "Bagus! Terus tingkatkan pelayanan kamu!";
        } else if (rating >= 3.5) {
            return "Semangat! Masih bisa lebih baik lagi!";
        } else {
            return "Ayo perbaiki pelayanan untuk rating yang lebih baik!";
        }
    };

    const getMessageColor = (rating: number, totalReviews: number) => {
        if (totalReviews === 0) return "bg-gray-500";

        if (rating >= 4.5) return "bg-[#74CA94]";
        if (rating >= 4.0) return "bg-blue-500";
        if (rating >= 3.5) return "bg-yellow-500";
        return "bg-red-500";
    };

    if (loading) {
        return (
            <main className="mx-5 space-y-3">
                <section className="w-full flex items-center justify-between">
                    <p className="text-[20px] font-medium tracking-tight">
                        Total Rating
                    </p>
                    <Link href="/rating">
                        <button className="text-[22px] w-[34px] h-[34px] flex items-center justify-center rounded-full bg-mainColor/20 text-mainDark">
                            <BsArrowRight />
                        </button>
                    </Link>
                </section>
                <section className="animate-pulse">
                    <div className="flex items-center gap-3 border border-b-0 p-2 rounded-t-lg">
                        <div className="w-[64px] h-[64px] bg-gray-300 rounded-lg"></div>
                        <div className="space-y-2 flex-1">
                            <div className="h-4 bg-gray-300 rounded w-16"></div>
                            <div className="flex items-center justify-between">
                                <div className="h-6 bg-gray-300 rounded w-12"></div>
                                <div className="flex gap-1">
                                    {[...Array(5)].map((_, i) => (
                                        <div key={i} className="w-6 h-6 bg-gray-300 rounded"></div>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="px-4 py-1 bg-gray-300 rounded-b-lg border border-t-0">
                        <div className="h-4 bg-gray-400 rounded w-3/4"></div>
                    </div>
                </section>
            </main>
        );
    }

    if (error) {
        return (
            <main className="mx-5 space-y-3">
                <section className="w-full flex items-center justify-between">
                    <p className="text-[20px] font-medium tracking-tight">
                        Total Rating
                    </p>
                    <Link href="/rating">
                        <button className="text-[22px] w-[34px] h-[34px] flex items-center justify-center rounded-full bg-mainColor/20 text-mainDark">
                            <BsArrowRight />
                        </button>
                    </Link>
                </section>
                <section className="">
                    <div className="flex items-center gap-3 border border-b-0 p-2 rounded-t-lg">
                        <div className="flex items-center justify-center w-[64px] h-[64px] rounded-lg bg-red-100">
                            <div className="w-[53px] h-[53px] flex items-center justify-center rounded-md bg-red-200">
                                <AiOutlineStar className="text-red-400 text-4xl" />
                            </div>
                        </div>
                        <div className="space-y-1 flex-1">
                            <p className="text-[16px]">Rating</p>
                            <div className="flex items-center justify-between">
                                <h1 className="text-[18px] font-bold text-red-500">
                                    Error
                                </h1>
                                <button
                                    onClick={fetchRatingData}
                                    className="text-sm text-blue-500 underline"
                                >
                                    Retry
                                </button>
                            </div>
                        </div>
                    </div>
                    <div className="px-4 py-1 bg-red-500 text-white rounded-b-lg border border-t-0">
                        <p>Gagal memuat data rating</p>
                    </div>
                </section>
            </main>
        );
    }

    return (
        <main className="mx-5 space-y-3">
            <section className="w-full flex items-center justify-between">
                <p className="text-[20px] font-medium tracking-tight">
                    Total Rating
                </p>
                <Link href="/rating">
                    <button className="text-[22px] w-[34px] h-[34px] flex items-center justify-center rounded-full bg-mainColor/20 text-mainDark">
                        <BsArrowRight />
                    </button>
                </Link>
            </section>
            <section className="">
                <div className="flex items-center gap-3 border border-b-0 p-2 rounded-t-lg">
                    <div className="flex items-center justify-center w-[64px] h-[64px] rounded-lg bg-[#F2C66733]">
                        <div className="w-[53px] h-[53px] flex items-center justify-center rounded-md bg-[#F2C66733]">
                            <AiFillStar className="text-yellow-400 text-4xl" />
                        </div>
                    </div>
                    <div className="space-y-1 flex-1">
                        <p className="text-[16px]">
                            Rating
                        </p>
                        <div className="flex items-center justify-between">
                            <h1 className="text-[18px] font-bold">
                                {ratingStats.totalReviews > 0
                                    ? `${ratingStats.averageRating}/5`
                                    : "0/5"
                                }
                            </h1>
                            <div className="flex items-center gap-2">
                                {renderStars(ratingStats.averageRating)}
                            </div>
                        </div>
                    </div>
                </div>
                <div className={`px-4 py-1 text-white rounded-b-lg border border-t-0 ${getMessageColor(ratingStats.averageRating, ratingStats.totalReviews)}`}>
                    <p>
                        {getMotivationalMessage(ratingStats.averageRating, ratingStats.totalReviews)}
                    </p>
                </div>
            </section>
        </main>
    );
};