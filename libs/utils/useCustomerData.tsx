"use client";
import { useEffect, useState, useCallback } from "react";
import { api, apiClient } from "./apiClient";

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

type UseCustomerDataResult = {
    dataCustomer: Record<string, CustomerData>; // keyed by noWhatsapp
    loading: boolean;
    error: string | null;
    refetch: () => void;
};

export const useCustomerData = (
    noWhatsapp: string | string[]
): UseCustomerDataResult => {
    const [dataCustomer, setData] = useState<Record<string, CustomerData>>({});
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);

    const normalizedNumbers = Array.isArray(noWhatsapp)
        ? noWhatsapp
        : [noWhatsapp];

    const fetchCustomerData = useCallback(async () => {
        if (normalizedNumbers.length === 0) return;

        setLoading(true);
        setError(null);

        try {
            const resultMap: Record<string, CustomerData> = {};

            await Promise.all(
                normalizedNumbers.map(async (number) => {
                    const res = await api.get(
                        `/customer/whatsapp/${number}`
                    );

                    setData(res.data);
                })
            );

        } catch (err: any) {
            setError(err.message || "Terjadi kesalahan saat mengambil data pelanggan");
            setData({});
        } finally {
            setLoading(false);
        }
    }, [normalizedNumbers]);

    useEffect(() => {
        fetchCustomerData();
    }, [fetchCustomerData]);

    return {
        dataCustomer,
        loading,
        error,
        refetch: fetchCustomerData,
    };
};
