"use client";
import { useEffect, useState } from "react";
import { apiClient } from "libs/utils/apiClient";

// Interface untuk detail transaksi
export interface TransactionDetail {
    id: string;
    trxNumber: string;
    serviceCategory: string;
    serviceCode: string;
    serviceType: number;
    quantity: number;
    promoCode: string;
    servicePrice: number;
    totalPrice: number;
    promoPrice: number;
    isPl: number;
}

// Interface untuk data transaksi
export interface TransactionData {
    id: string;
    trxNumber: string;
    customerId: string;
    branchId: string;
    totalPrice: number;
    discountPrice: number;
    promoPrice: number;
    finalPrice: number;
    trxDate: string;
    status: number;
    details: TransactionDetail[];
    assigns: string[];
    blowers: string[];
    reassigns: string[];
}

// Interface untuk data customer
export interface CustomerData {
    id: string;
    noWhatsapp: string;
    fullname: string;
    address: string;
    province: string;
    city: string;
    district: string;
    subDistrict: string;
    status: number;
    customerType: string | null;
}

// Interface untuk data gabungan
export interface TransactionWithCustomer {
    transaction: TransactionData;
    customer: CustomerData;
}

// Interface untuk return value hook
type UseTransactionDetailResult = {
    data: TransactionWithCustomer | null;
    loading: boolean;
    error: string | null;
    refetch: () => void;
};

export const useTransactionDetail = (trxNumber?: string): UseTransactionDetailResult => {
    const [data, setData] = useState<TransactionWithCustomer | null>(null);
    const [loading, setLoading] = useState<boolean>(false);
    const [error, setError] = useState<string | null>(null);

    const fetchTransactionDetail = async () => {
        if (!trxNumber?.trim()) {
            setError("Nomor transaksi tidak valid");
            return;
        }

        setLoading(true);
        setError(null);
        setData(null);

        try {
            console.log('🔍 Fetching transaction:', trxNumber);
            
            // Step 1: Ambil data transaksi
            const transactionResponse = await apiClient(`/transaction/detail?trxNumber=${trxNumber}`);
            const transactionData: TransactionData = transactionResponse.data;

            console.log('✅ Transaction data:', transactionData);

            if (!transactionData?.customerId) {
                throw new Error("Data transaksi tidak lengkap - customerId tidak ditemukan");
            }

            console.log('🔍 Fetching customer:', transactionData.customerId);
            
            // Step 2: Ambil data customer
            const customerResponse = await apiClient(`/customer/id/${transactionData.customerId}`);
            const customerData: CustomerData = customerResponse.data;

            console.log('✅ Customer data:', customerData);

            // Step 3: Gabungkan data
            const combinedData: TransactionWithCustomer = {
                transaction: transactionData,
                customer: customerData,
            };

            console.log('🎉 Combined data:', combinedData);
            setData(combinedData);
            
        } catch (err: any) {
            console.error('💥 Error:', err);
            setError(err.message || "Gagal mengambil data transaksi");
            setData(null);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (trxNumber?.trim()) {
            fetchTransactionDetail();
        } else {
            setData(null);
            setError(null);
            setLoading(false);
        }
    }, [trxNumber]);

    return {
        data,
        loading,
        error,
        refetch: fetchTransactionDetail,
    };
};