"use client"
import { useEffect, useRef, useState } from "react";
import { api } from "./apiClient";

interface CustomerInfo {
  address: string;
  city: string;
}

type CustomerDataMap = Record<string, CustomerInfo>;

export const useCustomerInfoByWhatsapp = (whatsappNumbers: string[] = []) => {
  const cacheRef = useRef<Map<string, CustomerInfo>>(new Map());
  const [customerDataMap, setCustomerDataMap] = useState<CustomerDataMap>({});
  const [loading, setLoading] = useState<boolean>(false);

  useEffect(() => {
    const fetchMissing = async () => {
      const numbersToFetch = whatsappNumbers.filter(
        (num) => !cacheRef.current.has(num)
      );

      if (numbersToFetch.length === 0) {
        const result: CustomerDataMap = Object.fromEntries(
          whatsappNumbers.map((num) => [num, cacheRef.current.get(num)!])
        );
        setCustomerDataMap(result);
        return;
      }

      setLoading(true);

      const promises = numbersToFetch.map((num) =>
        api
          .get(`/customer/whatsapp/${num}`)
          .then((data) => {
            const info: CustomerInfo = {
              address: data.address || "-",
              city: data.city || "-"
            };
            cacheRef.current.set(num, info);
          })
          .catch(() => {
            const fallback: CustomerInfo = { address: "-", city: "-" };
            cacheRef.current.set(num, fallback);
          })
      );

      await Promise.allSettled(promises);

      const result: CustomerDataMap = Object.fromEntries(
        whatsappNumbers.map((num) => [num, cacheRef.current.get(num)!])
      );
      setCustomerDataMap(result);
      setLoading(false);
    };

    if (whatsappNumbers.length > 0) {
      fetchMissing();
    }
  }, [whatsappNumbers]);

  return { customerDataMap, loading };
};
