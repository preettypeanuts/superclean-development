"use client";
import { useEffect, useState, useCallback } from "react";
import { api } from "./apiClient";

export interface TransactionHistoryItem {
  id: string;
  trxNumber: string;
  notes: string;
  logDate: string;
}

export interface TransactionHistoryResponse {
  status: string;
  data: TransactionHistoryItem[];
}

let _refetchTransactionHistory: (trxNumber?: string) => void = () => {};

export const useTransactionHistory = (trxNumber?: string) => {
  const [history, setHistory] = useState<TransactionHistoryItem[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const fetchTransactionHistory = useCallback(async (txNumber?: string) => {
    // Jika tidak ada trxNumber, tidak perlu fetch
    if (!txNumber) {
      setHistory([]);
      setLoading(false);
      return;
    }

    setLoading(true);
    console.log("[useTransactionHistory] Fetching history for:", txNumber);

    try {
      const response = await api.get(`/transaction/history?trxNumber=${encodeURIComponent(txNumber)}`);

      if (response.status === "success") {
        setHistory(response.data || []);
        setError(null);
      } else {
        throw new Error(response.message || "Gagal memuat riwayat transaksi");
      }
    } catch (err: any) {
      setError(err.message || "Terjadi kesalahan saat memuat riwayat transaksi");
      setHistory([]);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchTransactionHistory(trxNumber);
  }, [fetchTransactionHistory, trxNumber]);

  // Set refetch function untuk bisa dipanggil dari luar
  useEffect(() => {
    _refetchTransactionHistory = (txNumber?: string) => {
      fetchTransactionHistory(txNumber || trxNumber);
    };
  }, [fetchTransactionHistory, trxNumber]);

  return {
    history,
    loading,
    error,
    refetch: (txNumber?: string) => fetchTransactionHistory(txNumber || trxNumber),
  };
};

export const refetchTransactionHistory = (trxNumber?: string) => {
  _refetchTransactionHistory(trxNumber);
};