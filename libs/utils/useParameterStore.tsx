import { useEffect, useState } from "react";
import { apiClient } from "libs/utils/apiClient";

// Definisi tipe data untuk parameter
interface Parameter {
  id: string;
  paramCategory: string;
  paramKey: string;
  paramValue: string;
}

// Tipe data untuk hasil mapping
type ParameterMapping = Record<string, string>;

export function useParameterStore() {
  const [roleMapping, setRoleMapping] = useState<ParameterMapping>({});
  const [branchMapping, setBranchMapping] = useState<ParameterMapping>({});
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [roleRes, branchRes] = await Promise.all([
          apiClient("/parameter/category?category=ROLE"),
          apiClient("/parameter/category?category=BRANCH"),
        ]);

        // Mapping Role
        const roleMap: ParameterMapping = {};
        roleRes.data.forEach((role: Parameter) => {
          roleMap[role.paramKey] = role.paramValue;
        });

        // Mapping Branch
        const branchMap: ParameterMapping = {};
        branchRes.data.forEach((branch: Parameter) => {
          branchMap[branch.paramKey] = branch.paramValue;
        });

        setRoleMapping(roleMap);
        setBranchMapping(branchMap);
      } catch (error) {
        console.error("Gagal mengambil data role/branch", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  return { roleMapping, branchMapping, loading };
}
