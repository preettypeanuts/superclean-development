"use client"

import React from 'react';
import { Star } from 'lucide-react';
import { AiOutlineStar, AiFillStar } from 'react-icons/ai';

interface RatingItem {
    id: string;
    name: string;
    transactionNumber: string;
    rating: number;
    tipAmount: number;
    notes?: string;
}

interface RatingHistoryProps {
    items?: RatingItem[];
}

export const RatingHistory: React.FC<RatingHistoryProps> = ({ items = [] }) => {
    const defaultItems: RatingItem[] = [
        {
            id: '1',
            name: 'Dewi Gita Putri',
            transactionNumber: 'TRX-001',
            rating: 4,
            tipAmount: 20000,
        },
        {
            id: '2',
            name: 'Siska',
            transactionNumber: 'TRX-002',
            rating: 4,
            tipAmount: 15000,
            notes: 'Pengerjaannya sangat memuaskan dan bersih'
        },
        {
            id: '3',
            name: 'Joko Putra',
            transactionNumber: 'TRX-003',
            rating: 4,
            tipAmount: 20000,
        },
        {
            id: '4',
            name: 'Mira Lesmana',
            transactionNumber: 'TRX-003',
            rating: 4,
            tipAmount: 20000,
        },
        {
            id: '5',
            name: 'Bianca Amara',
            transactionNumber: 'TRX-003',
            rating: 4,
            tipAmount: 20000,
            notes: 'Pengerjaannya sangat memuaskan dan bersih'
        }
    ];

    const dataItems = items.length > 0 ? items : defaultItems;

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

    return (
        <div className="mt-6 mx-5">
            <div className="space-y-[14px]">
                {dataItems.map((item) => (
                    <div
                        key={item.id}
                        className={`p-3${dataItems[dataItems.length - 1].id !== item.id ? ' border-b' : ''}`}
                    >
                        <div className="flex items-start justify-between">
                            <div className="flex items-start space-x-3">
                                <div className="mt-2 w-[28px] h-[28px] bg-yellow-400 aspect-square rounded-full flex items-center justify-center flex-shrink-0">
                                    <Star className="w-[16px] h-[16px] text-white fill-white" />
                                </div>

                                <div className="flex-1 min-w-0 space-y-1">
                                    <h3 className="text-lg font-semibold text-gray-900">
                                        {item.name}
                                    </h3>

                                    <p className="text-xs text-orange-500">
                                        Nomor Transaksi: {item.transactionNumber}
                                    </p>

                                    <div className="flex items-center space-x-1">
                                        <span className="text-xs text-neutral-800 mr-2">Poins:</span>
                                        {renderStars(item.rating)}
                                    </div>

                                    {item.notes && (
                                        <p className="text-xs text-muted-foreground">
                                            Notes: {item.notes}
                                        </p>
                                    )}
                                </div>
                            </div>

                            <div className="text-right flex-shrink-0">
                                <p className="text-sm text-gray-500 mb-1 text-left">Uang Tip</p>
                                <p className="text-xs font-bold text-green-600">
                                    + {formatCurrency(item.tipAmount)}
                                </p>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};
