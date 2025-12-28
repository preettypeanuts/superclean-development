import { useEffect, useState } from "react";
import { apiClient } from "libs/utils/apiClient";

// Tipe data umum untuk hasil API
export interface LocationData {
  id: string;
  paramCategory: string;
  paramKey: string;
  paramValue: string;
}

// Custom hook untuk mengambil data lokasi
export function useLocationData(province?: string, city?: string, district?: string) {
  const [provinces, setProvinces] = useState<LocationData[]>([]);
  const [cities, setCities] = useState<LocationData[]>([]);
  const [districts, setDistricts] = useState<LocationData[]>([]);
  const [subDistricts, setSubDistricts] = useState<LocationData[]>([]);
  const [allCities, setAllCities] = useState<LocationData[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchProvinces = async () => {
      try {
        const response = await apiClient("/parameter/provinces");
        setProvinces(response.data);
      } catch (err) {
        console.error("Error fetching provinces:", err);
        setError("Gagal memuat data provinsi.");
      } finally {
        setLoading(false);
      }
    };

    const fetchCities = async () => {
      try {
        const response = await apiClient("/parameter/category?category=KOTA");
        setAllCities(response.data);
      } catch (err) {
        console.error("Error fetching provinces:", err);
        setError("Gagal memuat data provinsi.");
      } finally {
        setLoading(false);
      }
    };

    fetchProvinces();
    fetchCities();
  }, []);

  useEffect(() => {
    if (!province) return;
    setLoading(true);
    const fetchCities = async () => {
      try {
        const response = await apiClient(`/parameter/cities?province=${province}`);
        setCities(response.data);
      } catch (err) {
        console.error("Error fetching cities:", err);
        setError("Gagal memuat data kota.");
      } finally {
        setLoading(false);
      }
    };

    fetchCities();
  }, [province]);

  useEffect(() => {
    if (!province || !city) return;
    setLoading(true);
    const fetchDistricts = async () => {
      try {
        const response = await apiClient(`/parameter/districts?province=${province}&city=${city}`);
        setDistricts(response.data);
      } catch (err) {
        console.error("Error fetching districts:", err);
        setError("Gagal memuat data kecamatan.");
      } finally {
        setLoading(false);
      }
    };

    fetchDistricts();
  }, [province, city]);

  useEffect(() => {
    if (!province || !city || !district) return;
    setLoading(true);
    const fetchSubDistricts = async () => {
      try {
        const response = await apiClient(`/parameter/sub-districts?province=${province}&city=${city}&district=${district}`);
        setSubDistricts(response.data);
      } catch (err) {
        console.error("Error fetching sub-districts:", err);
        setError("Gagal memuat data kelurahan.");
      } finally {
        setLoading(false);
      }
    };

    fetchSubDistricts();
  }, [province, city, district]);

  return { provinces, cities, districts, subDistricts, loading, error, allCities };
}

export async function getCitiesLabel(provincCode: string): Promise<LocationData[]> {
  const allCities: LocationData[] = [];

  try {
    const res = await apiClient(`/parameter/cities?province=${provincCode}`);
    allCities.push(...res.data);
  } catch (error) {
    console.error(`Gagal fetch kota dari provinsi ${provincCode}:`, error);
  }

  return allCities;
}
