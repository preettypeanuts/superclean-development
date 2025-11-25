"use client"

import React, { useState, useEffect } from 'react';
import { Star } from 'lucide-react';
import { AiOutlineStar, AiFillStar } from 'react-icons/ai';
import { api } from "../../../../utils/apiClient";

// Interface sesuai dengan API response yang baru
interface ReviewData {
    fullname: string;    
    id: string;
    trxNumber: string;
    trxDate: string;
    rating: number;
    review: string | null;
    amount: number;
}

// Interface untuk response API
interface ApiResponse {
    status: string;
    data: [ReviewData[], number];
}

interface RatingHistoryProps {
    blower?: boolean;
}

export const RatingHistory: React.FC<RatingHistoryProps> = ({ blower = false }) => {
    const [reviews, setReviews] = useState<ReviewData[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    // Fetch reviews dari API
    useEffect(() => {
        fetchReviews();
    }, []);

    const fetchReviews = async () => {
        try {
            setLoading(true);
            setError(null);
            
            const response: ApiResponse = await api.get('/transaction/review-mitra?page=1&limit=100');
            
            if (response && response.status === "success") {
                setReviews(response.data[0]);
            } else {
                setReviews([]);
            }
        } catch (err) {
            console.error('Error fetching reviews:', err);
            setError(err instanceof Error ? err.message : 'Terjadi kesalahan saat memuat data');
            setReviews([]);
        } finally {
            setLoading(false);
        }
    };

    const renderStars = (rating: number) => {
        return Array.from({ length: 5 }, (_, index) => {
            if (index < rating) {
                return (
                    <AiFillStar
                        key={index}
                        className="w-4 h-4 fill-yellow-400 text-yellow-400"
                    />
                );
            } else {
                return (
                    <AiOutlineStar
                        key={index}
                        className="w-4 h-4 text-gray-300"
                    />
                );
            }
        });
    };

    const formatCurrency = (amount: number) => {
        return new Intl.NumberFormat('id-ID', {
            style: 'currency',
            currency: 'IDR',
            minimumFractionDigits: 0,
            maximumFractionDigits: 0,
        }).format(amount).replace('IDR', 'Rp');
    };

    // Loading state
    if (loading) {
        return (
            <div className="mt-6 mx-5">
                <div className="space-y-[14px]">
                    {[...Array(5)].map((_, index) => (
                        <div key={index} className="p-3 animate-pulse">
                            <div className="flex items-start justify-between">
                                <div className="flex items-start space-x-3">
                                    <div className="mt-2 w-[28px] h-[28px] bg-gray-300 rounded-full"></div>
                                    <div className="flex-1 space-y-2">
                                        <div className="h-5 bg-gray-300 rounded w-32"></div>
                                        <div className="h-3 bg-gray-300 rounded w-24"></div>
                                        <div className="flex space-x-1">
                                            {[...Array(5)].map((_, i) => (
                                                <div key={i} className="w-4 h-4 bg-gray-300 rounded"></div>
                                            ))}
                                        </div>
                                        <div className="h-3 bg-gray-300 rounded w-48"></div>
                                    </div>
                                </div>
                                {!blower && (
                                    <div className="space-y-2">
                                        <div className="h-4 bg-gray-300 rounded w-16"></div>
                                        <div className="h-3 bg-gray-300 rounded w-20"></div>
                                    </div>
                                )}
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        );
    }

    // Error state
    if (error) {
        return (
            <div className="mt-6 mx-5">
                <div className="p-6 text-center">
                    <p className="text-red-600 mb-4">{error}</p>
                    <button 
                        onClick={fetchReviews}
                        className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
                    >
                        Coba Lagi
                    </button>
                </div>
            </div>
        );
    }

    // Empty state
    if (reviews.length === 0) {
        return (
            <div className="mt-6 mx-5">
                <div className="p-8 text-center text-gray-500">
                    <Star className="w-16 h-16 mx-auto mb-4 text-gray-300" />
                    <p>Belum ada review yang diterima</p>
                </div>
            </div>
        );
    }

    return (
        <div className="mt-6 mx-5">
            <div className="space-y-[14px]">
                {reviews.map((item, index) => (
                    <div
                        key={item.id}
                        className={`p-3${index !== reviews.length - 1 ? ' border-b' : ''}`}
                    >
                        <div className="flex items-start justify-between">
                            <div className={`flex items-start space-x-3 ${blower ? 'w-full' : ''}`}>
                                <div className={`mt-2 w-[28px] h-[28px] aspect-square rounded-full flex items-center justify-center flex-shrink-0 ${
                                    item.rating > 0 ? 'bg-yellow-400' : 'bg-gray-300'
                                }`}>
                                    <Star className={`w-[16px] h-[16px] ${
                                        item.rating > 0 ? 'text-white fill-white' : 'text-gray-500 fill-gray-500'
                                    }`} />
                                </div>

                                <div className="flex-1 min-w-0 space-y-1">
                                    <h3 className="text-lg font-semibold text-gray-900">
                                        {item.fullname}
                                    </h3>

                                    <p className="text-xs text-orange-500">
                                        Nomor Transaksi: {item.trxNumber}
                                    </p>

                                    {item.rating > 0 ? (
                                        <div className="flex items-center space-x-1">
                                            <span className="text-xs text-neutral-800 mr-2">Poins:</span>
                                            {renderStars(item.rating)}
                                        </div>
                                    ) : (
                                        <div className="flex items-center space-x-1">
                                            <span className="text-xs text-gray-500">Belum ada rating</span>
                                        </div>
                                    )}

                                    {item.review ? (
                                        <p className="text-xs text-muted-foreground">
                                            Notes: {item.review}
                                        </p>
                                    ) : item.rating === 0 && (
                                        <p className="text-xs text-gray-400 italic">
                                            Menunggu review dari pelanggan
                                        </p>
                                    )}
                                </div>
                            </div>

                            {!blower && (
                                <div className="text-right flex-shrink-0">
                                    <p className="text-sm text-gray-500 mb-1 text-left">Uang Tip</p>
                                    <p className="text-xs font-bold text-green-600">
                                        + {formatCurrency(item.amount)}
                                    </p>
                                </div>
                            )}
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};