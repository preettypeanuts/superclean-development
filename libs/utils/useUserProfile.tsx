"use client";
import { useEffect, useState, useCallback } from "react";
import { api, apiClient } from "./apiClient";
import { useParameterStore } from "./useParameterStore";
import { usePathname } from "next/navigation";

export interface RawUserData {
  username: string;
  fullname: string;
  roleId: string;
  branchId: string;
}

export interface ProcessedUserData {
  username: string;
  fullname: string;
  roleIdCode: string;
  roleId: string;   // mapped label
  branchId: string; // mapped label
}

let _refetchUser: () => void = () => {};

export const useUserProfile = () => {
  const [user, setUser] = useState<ProcessedUserData | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const pathname = usePathname();

  const { roleMapping, branchMapping, loading: loadingParams } = useParameterStore();

  // JANGAN taruh pathname di useCallback
const fetchUserProfile = useCallback(async () => {
    setLoading(true);

    try {
      const response = await api.get("/profile");
  
      if (response.status === "success") {
        const rawUser: RawUserData = response.data;
  
        const processed: ProcessedUserData = {
          ...rawUser,
          roleIdCode: rawUser.roleId,
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
  
  // TARUH pathname di useEffect, bukan di useCallback
  useEffect(() => {
    fetchUserProfile();
  }, [fetchUserProfile, pathname]);
  

  return {
    user,
    loading: loading || loadingParams,
    error,
    refetch: fetchUserProfile,
  };
};

export const refetchUserProfile = () => {
    _refetchUser();
  };