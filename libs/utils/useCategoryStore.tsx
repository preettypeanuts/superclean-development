import { useEffect, useState } from "react";
import { apiClient } from "libs/utils/apiClient";

// Tipe data untuk hasil mapping
type ParameterMapping = Record<string, string>;

export function useCategoryStore() {
  const [unitLayananMapping, setUnitLayananMapping] = useState<ParameterMapping>({});
  const [catLayananMapping, setCatLayananMapping] = useState<ParameterMapping>({});
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [unitRes, catRes] = await Promise.all([
          apiClient("/parameter/category?category=UNIT_LAYANAN"),
          apiClient("/parameter/category?category=CAT_LAYANAN"),
        ]);

        // Mapping UNIT_LAYANAN
        const unitMap: ParameterMapping = {};
        unitRes.data.forEach((unit) => {
          unitMap[unit.paramKey] = unit.paramValue;
        });

        // Mapping CAT_LAYANAN
        const catMap: ParameterMapping = {};
        catRes.data.forEach((cat) => {
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
