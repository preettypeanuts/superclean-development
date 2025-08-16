import { useEffect, useState } from "react";
import { api } from "libs/utils/apiClient";

// Tipe data untuk hasil mapping
type ParameterMapping = Record<string, string>;

// Tipe data untuk service berdasarkan response API
export interface Service {
  serviceCode: string;
  serviceName: string;
  vacuumPrice: number;
  cleanPrice: number;
  unit: string;
}

export function useCategoryStore() {
  const [unitLayananMapping, setUnitLayananMapping] = useState<ParameterMapping>({});
  const [catLayananMapping, setCatLayananMapping] = useState<ParameterMapping>({});
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [unitRes, catRes] = await Promise.all([
          api.get("/parameter/category?category=UNIT_LAYANAN"),
          api.get("/parameter/category?category=CAT_LAYANAN"),
        ]);

        // Mapping UNIT_LAYANAN
        const unitMap: ParameterMapping = {};
        unitRes.data.forEach((unit: any) => {
          unitMap[unit.paramKey] = unit.paramValue;
        });

        // Mapping CAT_LAYANAN
        const catMap: ParameterMapping = {};
        catRes.data.forEach((cat: any) => {
          catMap[cat.paramKey] = cat.paramValue;
        });

        setUnitLayananMapping(unitMap);
        setCatLayananMapping(catMap);
      } catch (error) {
        console.error("Gagal mengambil data UNIT_LAYANAN/CAT_LAYANAN", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  return { unitLayananMapping, catLayananMapping, loading };
}

// Hook khusus untuk service lookup berdasarkan kategori
export function useServiceLookup(category: string) {
  const [services, setServices] = useState<Service[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchServices = async () => {
      if (!category || category.trim() === "") {
        setServices([]);
        return;
      }

      setLoading(true);
      setError(null);

      try {
        const response = await api.get(`/service/lookup?category=${category}`);
        setServices(response.data || []);
      } catch (err: any) {
        console.error(`Gagal mengambil data service untuk kategori ${category}:`, err);
        setError(err.message || "Gagal mengambil data service");
        setServices([]);
      } finally {
        setLoading(false);
      }
    };

    fetchServices();
  }, [category]);

  return { services, loading, error };
}

export interface PromoResponse {
  amount: number;
  code: string;
  type: "Persentase" | "Nominal"
}

export function usePromoLookup(serviceCode: string, quantity: number) {
  const [promo, setPromo] = useState<PromoResponse | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchPromo = async () => {
      if (!serviceCode || serviceCode.trim() === "" || quantity <= 0) {
        setPromo(null);
        return;
      }

      setLoading(true);
      setError(null);

      try {
        const response = await api.get(`/promo/current?serviceCode=${serviceCode}&quantity=${quantity}`);
        const data: PromoResponse = {
          amount: response.data?.amount || 0,
          code: response.data?.code || "",
          type: response.data?.promoType || ""
        }

        setPromo(data);
      } catch (err: any) {
        console.error(`Gagal mengambil promo untuk service ${serviceCode}:`, err);
        setError(err.message || "Gagal mengambil promo");
        setPromo(null);
      } finally {
        setLoading(false);
      }
    };

    fetchPromo();
  }, [serviceCode, quantity])

  return { promo, loading, error };
}
