"use client";
import { useEffect, useState, useCallback } from "react";
import { api, apiClient } from "./apiClient";
import { useParameterStore } from "./useParameterStore";

export interface RawUserData {
  username: string;
  fullname: string;
  roleId: string;
  branchId: string;
}

export interface ProcessedUserData {
  username: string;
  fullname: string;
  roleId: string;   // mapped label
  branchId: string; // mapped label
}

export const useUserProfile = () => {
  const [user, setUser] = useState<ProcessedUserData | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const { roleMapping, branchMapping, loading: loadingParams } = useParameterStore();

  const fetchUserProfile = useCallback(async () => {
    try {
      setLoading(true);
      const response = await api.get("/profile");

      if (response.status === "success") {
        const rawUser: RawUserData = response.data;

        const processed: ProcessedUserData = {
          ...rawUser,
          roleId: roleMapping[rawUser.roleId] || "Tidak Diketahui",
          branchId: branchMapping[rawUser.branchId] || "Tidak Diketahui",
        };

        setUser(processed);
        setError(null);
      } else {
        throw new Error(response.message || "Gagal memuat data profil");
      }
    } catch (err: any) {
      setError(err.message || "Terjadi kesalahan saat memuat data profil");
      setUser(null);
    } finally {
      setLoading(false);
    }
  }, [roleMapping, branchMapping]);

  useEffect(() => {
    fetchUserProfile();
  }, [fetchUserProfile]);

  return {
    user,
    loading: loading || loadingParams,
    error,
    refetch: fetchUserProfile,
  };
};
