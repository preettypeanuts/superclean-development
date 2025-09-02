"use client"
import { Wrapper } from "@shared/components/Wrapper";
import { Breadcrumbs } from "@shared/components/ui/Breadcrumbs";
import { api } from "@shared/utils/apiClient";
import { formatRupiah } from "@shared/utils/formatRupiah";
import { RupiahInput } from "@ui-components/components/rupiah-input";
import { Button } from "@ui-components/components/ui/button";
import { Checkbox } from "@ui-components/components/ui/checkbox";
import { Input } from "@ui-components/components/ui/input";
import { Label } from "@ui-components/components/ui/label";
import { useToast } from "@ui-components/hooks/use-toast";
import { useRouter } from "next/navigation";
import { ReactNode, useCallback, useEffect, useMemo, useRef, useState } from "react";

const Title = ({ children }: { children: ReactNode }) => (
  <p className="px-2 py-2 bg-mainColor/10 rounded-md font-semibold text-mainDark dark:text-mainColor mb-3">
    {children}
  </p>
)

const PARAMS = {
  BANK_ACCOUNT_NAME: "BANK_ACCOUNT_NAME",
  BANK_ACCOUNT_NUMBER: "BANK_ACCOUNT_NUMBER",
  BANK_NAME: "BANK_NAME",
  IS_EMAIL: "IS_EMAIL",
  IS_SMS: "IS_SMS",
  IS_WHATSAPP: "IS_WHATSAPP",
  TARGET_BRANCH: "TARGET_BRANCH",
  TARGET_HO: "TARGET_HO",
}

interface Parameter {
  paramKey: string;
  paramValue: string;
}

const getParamsAsObject = (params: Parameter[]) => {
  return params.reduce((acc, curr) => {
    acc[curr.paramKey] = curr.paramValue;
    return acc;
  }, {} as Record<string, string>);
}

export default function PengaturanPage() {
  const router = useRouter();
  const { toast } = useToast();
  const [parameters, setParameters] = useState<Parameter[]>([]);
  const oldData = useRef({} as Record<string, string>);
  const [updating, setUpdating] = useState(false);

  const fetchTransaction = async () => {
    try {
      const response = await api.get("/parameter/app-settings");
      return response.data as Parameter[];
    } catch (error) {
      console.error("Error fetching transaction:", error);
      toast({
        title: "Error",
        description: "Gagal mengambil data pengaturan.",
        variant: "destructive",
      });
      return [];
    }
  }

  useEffect(() => {
    const fetchData = async () => {
      const data = await fetchTransaction();

      // Store the initial state in oldData
      oldData.current = getParamsAsObject(data);

      // Set the fetched data to state
      setParameters(data);
    };
    fetchData();
  }, []);

  const getParameterValue = (key: string) => {
    const param = parameters.find(p => p.paramKey === key);
    return param ? param.paramValue : "";
  };

  const handleInputChange = useCallback((key: string, value: any, isCurrency = false) => {
    if (isCurrency) {
      // replace dots with empty string
      value = value.split(".").join("").replace("Rp", "").trim();
      // value = Number(value)
    }

    setParameters(prev => {
      // Check if the parameter already exists
      const index = prev.findIndex(p => p.paramKey === key);

      // If it exists, update its value and return the new state
      if (index !== -1) {
        const newParams = [...prev];
        newParams[index] = { ...newParams[index], paramValue: value };
        return newParams;
      }

      // else return the previous state
      return prev;
    });
  }, []);

  const handleUpdateParameters = async () => {
    try {
      setUpdating(true);
      const response = await api.post("/parameter/app-settings", parameters);
      toast({
        title: "Berhasil",
        description: "Pengaturan berhasil diperbarui.",
        variant: "default",
      });
    } catch (error) {
      console.error("Error updating parameters:", error);
      toast({
        title: "Error",
        description: "Gagal memperbarui pengaturan.",
        variant: "destructive",
      });
    } finally {
      setUpdating(false);
    }
  }

  const isDataChanged = useMemo(() => {
    return JSON.stringify(oldData.current) !== JSON.stringify(getParamsAsObject(parameters));
  }, [parameters]);

  return (
    <>
      {parameters.length > 0 && (
        <>
          <Breadcrumbs label="Pengaturan" />
          <Wrapper className="space-y-6">
            <main>
              <Title>
                Informasi Rekening
              </Title>
              <div className="space-y-4">
                <div className="flex items-center space-x-4">
                  <Label htmlFor="namaPerusahaan" className="w-1/4 font-semibold">Nama Perusahaan</Label>
                  <Input
                    placeholder="Masukkan Nama Perusahaan"
                    id="namaPerusahaan"
                    value={getParameterValue(PARAMS.BANK_ACCOUNT_NAME)}
                    onChange={e => handleInputChange(PARAMS.BANK_ACCOUNT_NAME, e.target.value)}
                  />
                </div>
                <div className="flex items-center space-x-4">
                  <Label htmlFor="rekeningPerusahaan" className="w-1/4 font-semibold">Rekening Perusahaan</Label>
                  <Input
                    placeholder="Masukkan Rekening Perusahaan"
                    id="rekeningPerusahaan"
                    value={getParameterValue(PARAMS.BANK_ACCOUNT_NUMBER)}
                    onChange={e => handleInputChange(PARAMS.BANK_ACCOUNT_NUMBER, e.target.value)}
                  />
                </div>
                <div className="flex items-center space-x-4">
                  <Label htmlFor="bankPenerbit" className="w-1/4 font-semibold">Bank Penerbit</Label>
                  <Input
                    placeholder="Masukkan Penerbit"
                    id="bankPenerbit"
                    value={getParameterValue(PARAMS.BANK_NAME)}
                    onChange={e => handleInputChange(PARAMS.BANK_NAME, e.target.value)}
                  />
                </div>
              </div>
            </main>

            <main>
              <Title>
                Target Karyawan
              </Title>
              <div className="space-y-4">
                <div className="flex items-center space-x-4">
                  <Label htmlFor="kantorPusat" className="w-1/4 font-semibold">Kantor Pusat</Label>
                  <RupiahInput
                    placeholder="Rp 0"
                    id="kantorPusat"
                    value={formatRupiah(getParameterValue(PARAMS.TARGET_HO))}
                    onChange={value => {
                      handleInputChange(PARAMS.TARGET_HO, value.target.value, true)
                    }}
                  />
                </div>
                <div className="flex items-center space-x-4">
                  <Label htmlFor="kantorCabang" className="w-1/4 font-semibold">Kantor Cabang</Label>
                  <RupiahInput
                    placeholder="Rp 0"
                    id="kantorCabang"
                    value={formatRupiah(getParameterValue(PARAMS.TARGET_BRANCH))}
                    onChange={value => handleInputChange(PARAMS.TARGET_BRANCH, value.target.value, true)}
                  />
                </div>
              </div>
            </main>

            <main>
              <Title>
                Pemberitahuan
              </Title>
              <div className="text-sm mb-2">
                Pilih saluran yang Anda inginkan untuk mengirim notifikasi dari aplikasi
              </div>
              <div className="space-y-4">
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="sms"
                    checked={getParameterValue(PARAMS.IS_SMS) === "0"}
                    onCheckedChange={checked => handleInputChange(PARAMS.IS_SMS, checked ? "0" : "1")}
                  />
                  <Label htmlFor="sms">
                    SMS
                  </Label>
                </div>
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="email"
                    checked={getParameterValue(PARAMS.IS_EMAIL) === "0"}
                    onCheckedChange={checked => handleInputChange(PARAMS.IS_EMAIL, checked ? "0" : "1")}
                  />
                  <Label htmlFor="email">
                    Email
                  </Label>
                </div>
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="whatsapp"
                    checked={getParameterValue(PARAMS.IS_WHATSAPP) === "0"}
                    onCheckedChange={checked => handleInputChange(PARAMS.IS_WHATSAPP, checked ? "0" : "1")}
                  />
                  <Label htmlFor="whatsapp">
                    Whatsapp
                  </Label>
                </div>
              </div>
            </main>
            <div className="flex justify-end w-full space-x-2">
              <Button type="button" variant="outline2" onClick={() => router.back()}>
                Kembali
              </Button>
              <Button type="submit" variant="main" disabled={!isDataChanged || updating} onClick={handleUpdateParameters}>
                {updating ? "Menyimpan..." : "Simpan"}
              </Button>
            </div>
          </Wrapper >
        </>
      )
      }
    </>
  );
}



