"use client";

import { Header } from "@shared/components/Header";
import { Breadcrumbs } from "@shared/components/ui/Breadcrumbs";
import { Wrapper } from "@shared/components/Wrapper";
import { formatDateInput } from "@shared/utils/formatDate";
import { useCategoryStore, useServiceLookup } from "@shared/utils/useCategoryStore";
import { useTransactionHistory } from "@shared/utils/useTransactionHistory";
import { DatePicker } from "@ui-components/components/date-picker";
import MultiSelect from "@ui-components/components/multi-select";
import { RupiahInput } from "@ui-components/components/rupiah-input";
import { SPKTableDetail } from "@ui-components/components/spk-table-detail";
import { RadioGroup, RadioGroupItem } from "@ui-components/components/ui/radio-group";
import { Select, SelectContent, SelectGroup, SelectItem, SelectLabel, SelectTrigger, SelectValue } from "@ui-components/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@ui-components/components/ui/tabs";
import { useToast } from "@ui-components/hooks/use-toast";
import { PromoResponse, SPKItem } from "apps/admin-app/app/transaksi/spk/baru/page";
import { LocationData, LookupUser, Transaction, TransactionItem } from "apps/admin-app/app/transaksi/spk/edit/[...id]/page";
import PhotoSection from "apps/admin-app/app/transaksi/spk/photoSection";
import { DialogWrapper } from "libs/ui-components/src/components/dialog-wrapper";
import { Button } from "libs/ui-components/src/components/ui/button";
import { Input } from "libs/ui-components/src/components/ui/input";
import { Label } from "libs/ui-components/src/components/ui/label";
import { Textarea } from "libs/ui-components/src/components/ui/textarea";
import { api } from "libs/utils/apiClient";
import { formatRupiah } from "libs/utils/formatRupiah";
import { useLocationData } from "libs/utils/useLocationData";
import { useUserProfile } from "libs/utils/useUserProfile";
import { AlertTriangle } from "lucide-react";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useMemo, useState } from "react";
import { BsInfoCircleFill } from "react-icons/bs";
import { LuPlus } from "react-icons/lu";
import { PiWarningCircleFill } from "react-icons/pi";
import { RiCheckLine, RiFileCopyLine, RiPagesLine } from "react-icons/ri";
import { TbArrowBack } from "react-icons/tb";

interface Customer {
  id: string;
  fullname: string;
  noWhatsapp: string;
  address: string;
  province: string;
  city: string;
  district: string;
  subDistrict: string;
}

// Mapping untuk status
const statusMapping = {
  3: "Menunggu Pembayaran",
  4: "Sudah Dibayar",
  5: "Selesai",
  6: "Dikerjakan Kembali"
};

const formatDetailsForTable = (details: TransactionItem[]) => {
  return details.map((detail, index) => ({
    no: index + 1,
    kode: detail.serviceCode,
    layanan: detail.service.name,
    kategori: detail.serviceCategory,
    kategoriCode: detail.serviceCategory,
    jumlah: detail.quantity,
    satuan: detail.service.unit || "PCS",
    harga: detail.servicePrice,
    totalHarga: detail.totalPrice,
    promo: detail.promoPrice / Number(detail.quantity || 1),
    id: detail.id,
    tipe: detail.serviceType === 1 ? 'Cuci' : 'Vakum'
  }));
};

export default function PembayaranDetail() {
  const pathname = usePathname();
  const { toast } = useToast();
  const router = useRouter();
  const trxNumber = pathname.split("/transaksi/pembayaran/detail/").pop();

  const [transaction, setTransaction] = useState<Transaction | null>(null);
  const [customer, setCustomer] = useState<Customer | null>(null);
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Get user profile for role checking
  const { user } = useUserProfile();
  const isSuperAdmin = user?.roleIdCode === "SA" || user?.roleIdCode === "SPV";

  // States for editing items
  const [spkItems, setSPKItems] = useState<SPKItem[]>([]);
  const [originalSPKItems, setOriginalSPKItems] = useState<SPKItem[]>([]);
  const [openDialog, setOpenDialog] = useState(false);
  const [editMode, setEditMode] = useState<string | null>(null);
  const [loadingPromo, setLoadingPromo] = useState(false);

  // States for manual discount and additional fee
  const [manualDiscount, setManualDiscount] = useState<number>(0);
  const [manualDiscountPercent, setManualDiscountPercent] = useState<number>(0);
  const [disabledDiscount, setDisabledDiscount] = useState<boolean>(false);
  const [disabledDiscountPercent, setDisabledDiscountPercent] = useState<boolean>(false);

  const [additionalFee, setAdditionalFee] = useState<number>(0);
  const [additionalFeePercent, setAdditionalFeePercent] = useState<number>(0);
  const [disabledAdditionalFee, setDisabledAdditionalFee] = useState<boolean>(false);
  const [disabledAdditionalFeePercent, setDisabledAdditionalFeePercent] = useState<boolean>(false);

  const [copied, setCopied] = useState(false);

  const [formDataTable, setFormDataTable] = useState({
    id: "",
    category: "",
    serviceCode: "",
    jumlah: "",
    tipe: "vakum",
    harga: 0,
    promo: 0,
    promoCode: "",
    promoType: "",
  });



  const id = useMemo(() => {
    return pathname.split("/transaksi/pembayaran/detail/").pop();
  }, [])
  const { history, loading: historyLoading, error: historyError, refetch: refetchHistory } = useTransactionHistory(id);
  const reverseHistory = history ? [...history].reverse() : [];

  // Hooks for editing
  const { services, loading: loadingServices } = useServiceLookup(formDataTable.category);
  const { catLayananMapping, loading: loadingParams } = useCategoryStore();

  // Check if editing an original item (from API)
  const isEditingOriginal = (editMode && originalSPKItems.some(item => item.id === editMode)) as boolean;

  // State untuk menyimpan display names dari location codes
  const [locationLabels, setLocationLabels] = useState({
    provinceName: "",
    cityName: "",
    districtName: "",
    subDistrictName: ""
  });

  // Hook untuk mengambil data lokasi berdasarkan customer yang dipilih
  const { provinces, cities, districts, subDistricts } = useLocationData(
    customer?.province,
    customer?.city,
    customer?.district
  );

  const [isUsingBlower, setIsUsingBlower] = useState(false);
  const [blowerStaffList, setBlowerStaffList] = useState<LookupUser[]>([]);

  // State untuk rework staff
  const [reworkStaffList, setReworkStaffList] = useState<any[]>([]);
  const [selectedReworkStaff, setSelectedReworkStaff] = useState<string[]>([]);

  const IS_WAITING_PAYMENT = transaction?.status === 3;
  const IS_PAID = transaction?.status === 4;
  const IS_COMPLETED = transaction?.status === 5;

  const handleReworkStaffChange = (selected: string[]) => {
    setSelectedReworkStaff(selected);
  }

  const fetchLocationLabels = async () => {
    if (customer) {
      const [provinceRes, cityRes, districtRes, subDistrictRes] = await Promise.all([
        api.get(`/parameter/provinces`),
        api.get(`/parameter/cities?province=${customer.province}`),
        api.get(`/parameter/districts?province=${customer.province}&city=${customer.city}`),
        api.get(`/parameter/sub-districts?province=${customer.province}&city=${customer.city}&district=${customer.district}`)
      ]);

      const getLocationLabel = (items: LocationData[], code: string) => {
        const item = items.find(item => item.paramKey === code);
        return item ? item.paramValue : "Tidak Diketahui";
      };

      setLocationLabels({
        provinceName: getLocationLabel(provinceRes.data, customer.province),
        cityName: getLocationLabel(cityRes.data, customer.city),
        districtName: getLocationLabel(districtRes.data, customer.district),
        subDistrictName: getLocationLabel(subDistrictRes.data, customer.subDistrict)
      });
    } else {
      setLocationLabels({
        provinceName: "",
        cityName: "",
        districtName: "",
        subDistrictName: ""
      });
    }
  }

  const handleBlowerStaffChange = (selectedStaffIds: string[]) => {
    // if (selectedStaffIds.length > 1) {
    //   selectedStaffIds = selectedStaffIds.slice(0, 1);
    // }

    if (selectedStaffIds.length === 0) {
      setTransaction(prev => {
        if (!prev) return null;
        return {
          ...prev,
          blowers: [],
          deliveryDate: undefined,
          pickupDate: undefined,
        };
      });
    } else {
      const defaultDate = transaction?.trxDate || new Date().toISOString();
      setTransaction(prev => {
        if (!prev) return null;
        return {
          ...prev,
          blowers: selectedStaffIds,
          deliveryDate: prev.deliveryDate || defaultDate,
          pickupDate: prev.pickupDate || defaultDate,
        };
      });
    }
  };

  // Fetch promo function
  const fetchPromo = async (serviceCode: string, quantity: string): Promise<PromoResponse> => {
    if (!serviceCode || !quantity || parseInt(quantity) <= 0) {
      return { amount: 0, code: "", type: "" };
    }

    setLoadingPromo(true);
    try {
      const response = await api.get(`/promo/current?serviceCode=${serviceCode}&quantity=${quantity}`);

      return {
        amount: response.data?.amount || 0,
        code: response.data?.code || "",
        type: response.data?.promoType || ""
      };
    } catch (error) {
      console.error("Error fetching promo:", error);
      return { amount: 0, code: "", type: "" };
    } finally {
      setLoadingPromo(false);
    }
  };

  // Handle table form change
  const handleChangeTable = async (field: string, value: any) => {
    setFormDataTable(prev => {
      const newData = { ...prev, [field]: value };

      if (field === "category") {
        newData.serviceCode = "";
        newData.harga = 0;
        newData.promo = 0;
        newData.jumlah = "";
        newData.promoCode = "";
        newData.promoType = "";

        if (value === "GENERAL" || value === "BLOWER") {
          newData.tipe = "cuci";
        }
      }

      if (field === "serviceCode" && value) {
        const selectedService = services.find(service => service.serviceCode === value);
        if (selectedService) {
          const price = newData.tipe === "vakum"
            ? selectedService.vacuumPrice
            : selectedService.cleanPrice;
          newData.harga = price;
        }

        newData.promo = 0;
        newData.promoCode = "";
        newData.promoType = "";
      }

      if (field === "tipe" && newData.serviceCode) {
        const selectedService = services.find(service => service.serviceCode === newData.serviceCode);
        if (selectedService) {
          const price = value === "vakum"
            ? selectedService.vacuumPrice
            : selectedService.cleanPrice;
          newData.harga = price;
        }

        newData.promo = 0;
        newData.promoCode = "";
        newData.promoType = "";
      }

      return newData;
    });

    setTimeout(async () => {
      const currentData = { ...formDataTable, [field]: value };

      if ((field === "serviceCode" || field === "jumlah" || field === "tipe") &&
        currentData.serviceCode &&
        currentData.jumlah &&
        parseInt(currentData.jumlah) > 0) {

        const promoData = await fetchPromo(currentData.serviceCode, currentData.jumlah);

        setFormDataTable(prev => ({
          ...prev,
          promo: promoData.amount,
          promoCode: promoData.code,
          promoType: promoData.type
        }));
      }
    }, 100);
  };

  // Handle open edit item
  const handleOpenEditSPKItem = (item: SPKItem) => {
    const selectedCategory = Object.entries(catLayananMapping).find(([key, value]) => value === item.kategoriCode);

    setFormDataTable({
      id: item.id,
      category: selectedCategory ? selectedCategory[0] : item.kategoriCode,
      serviceCode: item.kode,
      jumlah: item.jumlah.toString(),
      tipe: item.tipe === 'Cuci' ? 'cuci' : 'vakum',
      harga: item.harga,
      promo: item.promo,
      promoCode: item.promoCode || '',
      promoType: item.promoType || '',
    });

    setEditMode(item.id);
    setOpenDialog(true);
  };

  // Reset form dialog
  const resetFormDialog = () => {
    setFormDataTable({
      id: "",
      category: "",
      serviceCode: "",
      jumlah: "",
      tipe: "vakum",
      harga: 0,
      promo: 0,
      promoCode: "",
      promoType: "",
    });
    setEditMode(null);
  };

  // Handle submit SPK item (add/edit)
  const handleSubmitSPKItem = async () => {
    if (!formDataTable.category || !formDataTable.serviceCode || !formDataTable.jumlah) {
      toast({
        title: "Peringatan",
        description: "Harap lengkapi semua field yang wajib diisi",
        variant: "destructive",
      });
      return;
    }

    const quantity = parseInt(formDataTable.jumlah);
    const totalHargaSebelumPromo = formDataTable.harga * quantity;

    if (formDataTable.promo > totalHargaSebelumPromo) {
      toast({
        title: "Peringatan",
        description: "Promo tidak boleh lebih besar dari total harga item",
        variant: "destructive",
      });
      return;
    }

    if (editMode) {
      try {
        setSubmitting(true);

        const payload = {
          serviceType: formDataTable.tipe === "vakum" ? 0 : 1,
          servicePrice: formDataTable.harga,
          promoCode: formDataTable.promoCode,
          promoType: formDataTable.promoType,
          promoAmount: formDataTable.promo,
          quantity: Number(formDataTable.jumlah),
        }

        await api.put(`/transaction-detail/${transaction?.id}/${formDataTable.id}`, payload);

        toast({
          title: "Berhasil",
          description: "Item berhasil diperbarui",
          variant: "default",
        });

        setTimeout(() => {
          window.location.reload();
        }, 1000);
      }
      catch (error) {
        toast({
          title: "Gagal",
          description: "Terjadi kesalahan saat memperbarui item.",
          variant: "destructive",
        })
      }
      finally {
        // setSubmitting(false);
      }
    } else {
      try {
        setSubmitting(true);

        const payload = {
          serviceCategory: catLayananMapping[formDataTable.category] || formDataTable.category,
          serviceCode: formDataTable.serviceCode,
          serviceType: formDataTable.tipe === "vakum" ? 0 : 1,
          servicePrice: formDataTable.harga,
          promoCode: formDataTable.promoCode,
          promoType: formDataTable.promoType || "Nominal",
          promoAmount: formDataTable.promo,
          quantity: Number(formDataTable.jumlah),
        }

        await api.post(`/transaction-detail/${transaction?.id}/`, payload);

        toast({
          title: "Berhasil",
          description: "Item berhasil ditambahkan",
          variant: "default",
        });

        setTimeout(() => {
          window.location.reload();
        }, 1000);
      }
      catch (error) {
        toast({
          title: "Gagal",
          description: "Terjadi kesalahan saat menambahkan item.",
          variant: "destructive",
        })
      }
      finally {
        // setSubmitting(false);
      }
    }
  };

  // Handle delete SPK item
  const handleDeleteSPKItem = async (itemId: string) => {
    try {
      await api.delete(`/transaction-detail/${transaction?.id}/${itemId}`);
      setSPKItems(prev => prev.filter(item => item.id !== itemId));
      toast({
        title: "Berhasil",
        description: "Item berhasil dihapus",
        variant: "default",
      });

      setTimeout(() => {
        window.location.reload();
      }, 1000);
    }
    catch (error) {
      toast({
        title: "Gagal",
        description: "Terjadi kesalahan saat menghapus item.",
        variant: "destructive",
      });
    }
  };

  // Function untuk update detail SPK
  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault();

    if (transaction?.assigns.length === 0 && transaction?.blowers.length === 0) {
      toast({
        title: "Peringatan",
        description: "Harap pilih minimal satu petugas",
        variant: "destructive",
      });
      return;
    }

    if (totals.isInvalidTotal) {
      toast({
        title: "Peringatan",
        description: "Total pengurangan (promo + diskon) tidak boleh lebih besar dari total harga",
        variant: "destructive",
      });
      return;
    }

    // Prepare data sesuai expected request body
    const updateData = {
      discountPrice: Number(manualDiscount),
      additionalFee: Number(additionalFee),
      percentDiscountPrice: Number(manualDiscountPercent),
      percentAdditionalFee: Number(additionalFeePercent),

      trxDate: transaction?.trxDate,
      deliveryDate: transaction?.deliveryDate && transaction.blowers.length > 0
        ? new Date(transaction.deliveryDate).toISOString()
        : null,
      pickupDate: transaction?.pickupDate && transaction.blowers.length > 0
        ? new Date(transaction.pickupDate).toISOString()
        : null,
      assigns: transaction?.assigns || [],
      blowers: transaction?.blowers || [],
      notes: transaction?.notes || "",
    };

    try {
      setUpdating(true);

      await api.put(`/transaction/${transaction?.id}/update`, updateData);
      if (IS_WAITING_PAYMENT && selectedReworkStaff.length > 0) {
        await api.put(`/transaction/${transaction?.id}/reassigned`, {
          reassigns: selectedReworkStaff,
        });
      }

      toast({
        title: "Berhasil",
        description: "SPK berhasil diupdate!",
        variant: "default",
      });

      // reload
      setTimeout(() => {
        window.location.reload();
      }, 1000);

    } catch (error: any) {
      console.error("Error response:", error.response?.data || error.message);
      toast({
        title: "Gagal",
        description: "Terjadi kesalahan saat menambahkan SPK.",
        variant: "destructive",
      });
    }
    finally {
      setUpdating(false);
    }
  };

  // Effect untuk mengambil label lokasi berdasarkan customer yang dipilih
  useEffect(() => {
    fetchLocationLabels();
  }, [customer, provinces, cities, districts, subDistricts]);

  const fetchCustomerData = async (customerId: string) => {
    try {
      const customerResult = await api.get(`/customer/id/${customerId}`);
      if (customerResult.status === "success") {
        setCustomer(customerResult.data);
      }
    } catch (customerError) {
      console.warn("Customer data not found or error:", customerError);
      // Continue without customer data
    }
  }

  const fetchStaffListData = async (roleId: string, city: string, setStaffList: Function) => {
    if (!roleId || !city) {
      setStaffList([]);
      return;
    }

    setLoading(true);
    try {
      const response = await api.get(`/user/lookup?roleId=${roleId}&city=${city}`);
      setStaffList(response?.data || []);
    } catch (error) {
      console.error(`Error fetching ${roleId} staff:`, error);
      setStaffList([]);
      toast({
        title: "Error",
        description: `Gagal mengambil data petugas ${roleId.toLowerCase()}`,
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    const fetchTransactionData = async () => {
      try {
        setLoading(true);
        setError(null);

        // Fetch transaction data
        const transactionResult = await api.get(`/transaction/detail?trxNumber=${trxNumber}`);
        const transactionData = transactionResult.data as Transaction;

        if (transactionResult.status === "success") {
          setTransaction({
            ...transactionData,
          });

          // Set blower usage state
          setIsUsingBlower(transactionData.blowers && transactionData.blowers.length > 0);

          // Initialize SPK items for editing
          if (transactionData?.details.length) {
            setSPKItems(formatDetailsForTable(transactionData.details));
            setOriginalSPKItems(formatDetailsForTable(transactionData.details));
          }

          // Initialize pricing states
          setManualDiscount(transactionData.discountPrice || 0);
          setManualDiscountPercent(transactionData.percentDiscountPrice || 0);
          setAdditionalFee(transactionData.additionalFee || 0);
          setAdditionalFeePercent(transactionData.percentAdditionalFee || 0);

          if (transactionData.percentDiscountPrice > 0) {
            setDisabledDiscount(true);
            setDisabledDiscountPercent(false);
          } else {
            setDisabledDiscount(false);
          }

          if (transactionData.discountPrice > 0 && transactionData.percentDiscountPrice === 0) {
            setDisabledDiscountPercent(true);
          }

          if (transactionData.percentAdditionalFee > 0) {
            setDisabledAdditionalFee(true);
            setDisabledAdditionalFeePercent(false);
          } else {
            setDisabledAdditionalFee(false);
          }

          if (transactionData.additionalFee > 0 && transactionData.percentAdditionalFee === 0) {
            setDisabledAdditionalFeePercent(true);
          }

          // Fetch customer data using customerId
          if (transactionData.customerId) {
            await fetchCustomerData(transactionData.customerId);
          }

        } else {
          setError("Data transaksi tidak ditemukan");
        }
      } catch (error) {
        console.error("Gagal mengambil data transaksi:", error);
        setError("Gagal mengambil data transaksi");
      } finally {
        setLoading(false);
      }
    };

    if (trxNumber) {
      fetchTransactionData();
    }
  }, [trxNumber]);

  useEffect(() => {
    if (customer?.city) {
      fetchStaffListData("CLEANER", customer.city, setReworkStaffList);
      fetchStaffListData("BLOWER", customer.city, setBlowerStaffList);
    }
  }, [customer?.city])

  const DataHeaderSPKDetail = useMemo(() => {
    const columns = [
      { key: "no", label: "#" },
      { key: "kode", label: "Kode Service" },
      { key: "layanan", label: "Layanan" },
      { key: "kategori", label: "Kategori" },
      { key: "tipe", label: "Tipe Layanan" },
      { key: "jumlah", label: "Jumlah" },
      { key: "harga", label: "Harga Satuan" },
      { key: "totalHarga", label: "Total" },
      // { key: "promo", label: "Promo Satuan" },
    ];

    // Add actions column for superadmin and when not completed
    if (isSuperAdmin && !IS_COMPLETED) {
      columns.push({ key: "menu", label: "Actions" });
    }

    return columns;
  }, [transaction, isSuperAdmin]);

  const calculateTotals = () => {
    let totalPrice = spkItems.reduce((sum, item) => sum + item.harga * item.jumlah, 0);
    const isTotalPriceValid = totalPrice >= 250_000;

    if (!isTotalPriceValid) {
      totalPrice = 250_000;
    }

    const totalPromo = spkItems.reduce((sum, item) => {
      const promoAmount = item.promoType === "Persentase" ? (item.promo * item.harga * item.jumlah) / 100 : item.promo * item.jumlah;
      return sum + promoAmount;
    }, 0);

    const finalPrice = totalPrice - totalPromo - manualDiscount + additionalFee;

    // Validasi: total pengurangan tidak boleh lebih besar dari total harga
    const totalReductions = totalPromo + manualDiscount;
    const isInvalidTotal = finalPrice < 0;

    return {
      totalPrice,
      totalPromo,
      manualDiscount,
      totalReductions,
      finalPrice,
      isInvalidTotal,
      isTotalPriceValid
    };
  };

  const totals = calculateTotals();

  // action handlers
  const handleComplete = async () => {
    try {
      await api.put(`/transaction/${transaction?.id}/status`, {
        status: 5, // Selesai
      });

      router.back();

      toast({
        title: "Sukses",
        description: "Transaksi berhasil diselesaikan.",
        variant: "success"
      });
    } catch {
      toast({
        title: "Error",
        description: "Gagal menyelesaikan transaksi.",
        variant: "destructive"
      });
    }
  }

  if (loading) {
    return (
      <Wrapper>
        <Header label="Loading Detail Pembayaran..." />
        <p className="text-center py-8">Memuat data...</p>
      </Wrapper>
    );
  }

  if (error || !transaction) {
    return (
      <Wrapper>
        <Header label="Detail Pembayaran" />
        <p className="text-center text-red-500 py-8">{error || "Data tidak ditemukan!"}</p>
        <div className="flex justify-center mt-4">
          <Button onClick={() => router.back()} variant="outline">
            <TbArrowBack />
            Kembali
          </Button>
        </div>
      </Wrapper>
    );
  }

  // Format date with time
  const formatDateTime = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleString('id-ID', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit'
    });
  };

  function formatTime(dateString: string) {
    const date = new Date(dateString);
    // make only format with hh:mm:ss
    return date.toString().split(' ')[4];
  }

  const parseRupiah = (value: string) => {
    return parseInt(value.replace(/[^\d]/g, ""), 10) || 0;
  };

  const handleDiscountPercentChange = (e) => {
    const value = e.target.value ?? "0";
    const numericValue = parseRupiah(value);

    setManualDiscountPercent(numericValue);
    setManualDiscount(totals.totalPrice * value / 100);

    if (numericValue > 0) {
      setDisabledDiscount(true);
    } else {
      setDisabledDiscount(false);
    }
  }

  const handleDiscountChange = (e) => {
    const value = e.target.value ?? 0;
    const numericValue = parseRupiah(value);

    setManualDiscount(numericValue);

    if (numericValue > 0) {
      setManualDiscountPercent(0);
      setDisabledDiscountPercent(true);
    } else {
      setDisabledDiscountPercent(false);
    }
  }

  const handleAddFeePercentChange = (e) => {
    const value = e.target.value ?? "0";
    const numericValue = parseRupiah(value);

    setAdditionalFeePercent(numericValue);
    setAdditionalFee(totals.totalPrice * value / 100);

    if (numericValue > 0) {
      setDisabledAdditionalFee(true);
    } else {
      setDisabledAdditionalFee(false);
    }
  }

  const handleAddFeeChange = (e) => {
    const value = e.target.value ?? 0;
    const numericValue = parseRupiah(value);

    setAdditionalFee(numericValue);

    if (numericValue > 0) {
      setAdditionalFeePercent(0);
      setDisabledAdditionalFeePercent(true);
    } else {
      setDisabledAdditionalFeePercent(false);
    }
  }

  return (
    <>
      <Breadcrumbs label={`Detail Pembayaran`} />
      <Wrapper className="relative">
        <Tabs defaultValue="detail" className="-mt-2">
          <TabsList>
            <TabsTrigger value="detail">Detail</TabsTrigger>
            <TabsTrigger value="riwayat">Riwayat</TabsTrigger>
            <TabsTrigger value="foto">Foto</TabsTrigger>
          </TabsList>

          <TabsContent value="detail">
            <div className="flex flex-col gap-4">
              <div className="grid grid-cols-2 gap-20">
                {/* Kolom Kiri */}
                <div className="col-span-1 space-y-4">
                  <div className="flex items-center space-x-4">
                    <Label className="w-[40%] shrink-0 font-semibold">No Transaksi</Label>
                    {transaction.status === 3 ? (
                      <div className="flex items-center space-x-2 w-full">
                        <Input
                          disabled
                          value={transaction.trxNumber}
                          className="bg-muted/50 cursor-not-allowed"
                        />
                        <div className="relative group">
                          <Button
                            type="button"
                            onClick={() => {
                              const currentOrigin = globalThis.location.origin;
                              const url = `${currentOrigin}/invoice/${transaction.trxNumber}?backoffice=true`;

                              const width = 393;
                              const height = 852;
                              const left = (window.screen.width - width) / 2;
                              const top = (window.screen.height - height) / 2;

                              window.open(
                                url,
                                '_blank',
                                `width=${width},height=${height},left=${left},top=${top},noopener,noreferrer`
                              );
                            }}
                          >
                            <RiPagesLine />
                          </Button>
                          <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 px-3 py-1.5 bg-gray-900 text-white text-sm rounded whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none">
                            Halaman Pembayaran
                            <div className="absolute top-full left-1/2 -translate-x-1/2 -mt-1 border-4 border-transparent border-t-gray-900"></div>
                          </div>
                        </div>
                        <div className="relative group">
                          <Button
                            type="button"
                            style={{backgroundColor: '#2667e3'}}
                            onClick={async () => {
                              const currentOrigin = globalThis.location.origin;
                              const url = `${currentOrigin}/invoice/${transaction.trxNumber}`;

                              await navigator.clipboard.writeText(url);
                              setCopied(true);
                              setTimeout(() => setCopied(false), 2000);
                            }}
                          >
                            {copied ? (
                              <>
                                <RiCheckLine className="w-5 h-5" />
                              </>
                            ) : (
                              <>
                                <RiFileCopyLine className="w-5 h-5" />
                              </>
                            )}
                          </Button>
                          <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 px-3 py-1.5 bg-gray-900 text-white text-sm rounded whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none">
                            Salin Link
                            <div className="absolute top-full left-1/2 -translate-x-1/2 -mt-1 border-4 border-transparent border-t-gray-900"></div>
                          </div>
                        </div>
                      </div>
                    ) : (
                      <Input
                        disabled
                        value={transaction.trxNumber}
                        className="bg-muted/50 cursor-not-allowed"
                      />
                    )}
                  </div>

                  <div className="flex items-center space-x-4">
                    <Label className="w-[40%] shrink-0 font-semibold">No WhatsApp</Label>
                    <Input
                      value={customer?.noWhatsapp || ""}
                      readOnly
                      className="bg-muted/50 cursor-not-allowed"
                      placeholder="No WhatsApp tidak tersedia"
                    />
                  </div>

                  <div className="flex items-center space-x-4">
                    <Label className="w-[40%] shrink-0 font-semibold">Nama Customer</Label>
                    <Input
                      value={customer?.fullname || ""}
                      readOnly
                      className="bg-muted/50 cursor-not-allowed"
                      placeholder="Nama customer tidak tersedia"
                    />
                  </div>

                  <div className="flex items-center space-x-4">
                    <Label className="w-[40%] shrink-0 font-semibold">Alamat</Label>
                    <Textarea
                      className="resize-none bg-muted/50 cursor-not-allowed"
                      value={customer?.address || ""}
                      readOnly
                      rows={4}
                      placeholder="Alamat tidak tersedia"
                    />
                  </div>
                </div>

                {/* Kolom Kanan */}
                <div className="col-span-1 space-y-4">
                  <div className="flex items-center space-x-4">
                    <Label className="w-[40%] shrink-0 font-semibold">Status</Label>
                    <Input
                      value={statusMapping[transaction.status as keyof typeof statusMapping] || "Unknown"}
                      readOnly
                      className="bg-muted/50 cursor-not-allowed"
                    />
                  </div>

                  {/* Provinsi - View Only */}
                  <div className="flex items-center space-x-4">
                    <Label className="w-[40%] shrink-0 font-semibold">Provinsi</Label>
                    <Input
                      value={locationLabels.provinceName}
                      placeholder="Provinsi tidak tersedia"
                      readOnly
                      className="bg-muted/50 cursor-not-allowed"
                    />
                  </div>

                  {/* Kab/Kota - View Only */}
                  <div className="flex items-center space-x-4">
                    <Label className="w-[40%] shrink-0 font-semibold">Kab/Kota</Label>
                    <Input
                      value={locationLabels.cityName}
                      placeholder="Kota/Kabupaten tidak tersedia"
                      readOnly
                      className="bg-muted/50 cursor-not-allowed"
                    />
                  </div>

                  {/* Kecamatan - View Only */}
                  <div className="flex items-center space-x-4">
                    <Label className="w-[40%] shrink-0 font-semibold">Kecamatan</Label>
                    <Input
                      value={locationLabels.districtName}
                      placeholder="Kecamatan tidak tersedia"
                      readOnly
                      className="bg-muted/50 cursor-not-allowed"
                    />
                  </div>

                  {/* Kelurahan - View Only */}
                  <div className="flex items-center space-x-4">
                    <Label className="w-[40%] shrink-0 font-semibold">Kelurahan</Label>
                    <Input
                      value={locationLabels.subDistrictName}
                      placeholder="Kelurahan tidak tersedia"
                      readOnly
                      className="bg-muted/50 cursor-not-allowed"
                    />
                  </div>
                </div>
              </div>

              {/* Divider */}
              <div className="w-full border-t my-7"></div>

              <div className="grid grid-cols-2 gap-20">
                {/* Kolom Kiri */}
                <div className="col-span-1 space-y-4">
                  <div className="flex items-start space-x-4">
                    <Label className="w-[40%] shrink-0 font-semibold mt-2">Petugas Cleaning</Label>
                    {/* cleaning list */}
                    <div className="flex-1 flex flex-wrap gap-2 min-h-[40px] items-center">
                      {reworkStaffList.filter(staff => transaction.assigns.includes(staff.lookupKey)).length > 0 ? (
                        reworkStaffList.filter(staff => transaction.assigns.includes(staff.lookupKey)).map((staff) => (
                          <div key={staff.lookupKey} className="inline-block bg-baseLight/50 text-sm dark:bg-baseDark/50 text-teal-800 dark:text-teal-400 border border-mainColor dark:border-teal-400 rounded-full px-3 py-1 flex-shrink-0">
                            {staff.lookupValue}
                          </div>
                        ))
                      ) : (
                        <p className="text-gray-500">Tidak ada petugas cleaning</p>
                      )}
                    </div>
                  </div>

                  <div className="flex items-center space-x-4">
                    <Label className="w-[40%] shrink-0 font-semibold">Tanggal Pengerjaan</Label>
                    <DatePicker
                      withTime
                      disabled
                      value={new Date(transaction.trxDate)}
                      defaultTime={transaction?.trxDate ? `${formatTime(transaction.trxDate)}` : "08:00"}
                    />
                  </div>
                </div>

                {/* Kolom Kanan */}
                <div className="col-span-1 space-y-4">
                  <div className="flex items-center space-x-4">
                    <Label className="w-[40%] shrink-0 font-semibold">Petugas Blower</Label>
                    {isUsingBlower ? (
                      <>
                        {!IS_COMPLETED ? (
                          <MultiSelect
                            staffList={blowerStaffList.sort((a, b) => a.lookupValue.localeCompare(b.lookupValue))}
                            selected={transaction?.blowers || []}
                            onSelectionChange={handleBlowerStaffChange}
                            placeholder="Pilih petugas blower"
                          />
                        ) : (
                          <>
                              {transaction.blowers.length > 0 ? (
                              transaction.blowers.map((blowerId) => {
                                const blower = blowerStaffList.find(staff => staff.lookupKey === blowerId);
                                return (
                                  <div key={blowerId} className="inline-block bg-baseLight/50 text-sm dark:bg-baseDark/50 text-teal-800 dark:text-teal-400 border border-mainColor dark:border-teal-400 rounded-full px-3 py-1 flex-shrink-0">
                                    {blower ? blower.lookupValue : blowerId}
                                  </div>
                                );
                              })
                            ) : (
                              <p className="text-gray-500">Tidak ada petugas blower</p>
                            )}
                          </>
                        )}
                      </>
                    ) : (                      
                        <p className="text-gray-500">Tidak ada petugas blower</p>                      
                    )}
                  </div>

                  {
                    transaction.blowers.length > 0 && (
                      <>
                        <div className="flex items-center space-x-4">
                          <Label className="w-[40%] shrink-0 font-semibold">Tanggal Pengantaran</Label>
                          <DatePicker
                            startFrom={new Date(transaction?.trxDate)}
                            withTime
                            defaultTime={new Date(transaction?.deliveryDate ? transaction.deliveryDate : transaction?.trxDate).toTimeString().slice(0, 5)}
                            onChangeTime={(time) => {
                              if (time && transaction?.deliveryDate) {
                                const date = new Date(transaction.deliveryDate);
                                const [hours, minutes] = time.split(':').map(Number);
                                date.setHours(hours, minutes);

                                setTransaction(prev => ({
                                  ...prev,
                                  deliveryDate: date.toISOString()
                                } as Transaction));
                              }
                            }}
                            value={transaction.deliveryDate ? new Date(transaction.deliveryDate) : new Date(transaction.trxDate)}
                            onChange={(date) => {
                              if (date) {
                                setTransaction(prev => ({
                                  ...prev,
                                  deliveryDate: formatDateInput(date.toISOString())
                                } as Transaction));
                              }
                            }}
                          />
                        </div>

                        <div className="flex items-center space-x-4">
                          <Label className="w-[40%] shrink-0 font-semibold">Tanggal Pengambilan</Label>
                          <DatePicker
                            withTime
                            defaultTime={new Date(transaction?.pickupDate ? transaction.pickupDate : transaction?.trxDate).toTimeString().slice(0, 5)}
                            startFrom={new Date(transaction?.trxDate)}
                            value={transaction.pickupDate ? new Date(transaction.pickupDate) : new Date(transaction.trxDate)}
                            onChange={(date) => {
                              if (date) {
                                setTransaction(prev => ({
                                  ...prev,
                                  pickupDate: formatDateInput(date.toISOString())
                                } as Transaction));
                              }
                            }}
                            onChangeTime={(time) => {
                              if (time) {
                                const date = new Date(transaction.pickupDate || transaction.trxDate);
                                const [hours, minutes] = time.split(':').map(Number);
                                date.setHours(hours, minutes);

                                setTransaction(prev => ({
                                  ...prev,
                                  pickupDate: date.toISOString()
                                } as Transaction));
                              }
                            }}
                          />

                        </div>
                      </>
                    )
                  }

                  <div className="flex items-start space-x-4">
                    <Label className="w-[40%] shrink-0 font-semibold mt-2">Dikerjakan Ulang</Label>
                    <div className="flex-1">
                      {IS_WAITING_PAYMENT && (
                        <MultiSelect
                          staffList={reworkStaffList}
                          selected={selectedReworkStaff}
                          onSelectionChange={handleReworkStaffChange}
                          placeholder="Pilih pekerja ulang"
                          loading={false}
                        />
                      )}

                      {!IS_WAITING_PAYMENT && (
                        <>
                          {reworkStaffList.filter(staff => transaction.reassigns.includes(staff.lookupKey)).length > 0 ? (
                            reworkStaffList.filter(staff => transaction.reassigns.includes(staff.lookupKey)).map((staff) => (
                              <div key={staff.lookupKey} className="inline-block bg-baseLight/50 text-sm dark:bg-baseDark/50 text-teal-800 dark:text-teal-400 border border-mainColor dark:border-teal-400 rounded-full px-3 py-1 flex-shrink-0">
                                {staff.lookupValue}
                              </div>
                            ))
                          ) : (
                            <p className="text-gray-500">Tidak ada petugas pekerja ulang</p>
                          )}
                        </>
                      )}
                    </div>
                  </div>
                </div>
              </div>

              {/* Detail Transaksi Table */}
              <div className="mt-5 space-y-3">
                <div className="flex justify-between items-center">
                  <h3 className="text-lg font-semibold">Detail Layanan</h3>
                </div>

                {isSuperAdmin && !IS_COMPLETED && (
                  <div className="flex justify-end">
                    <Button
                      icon={<LuPlus size={16} />}
                      className="pl-2 pr-4"
                      iconPosition="left"
                      variant="default"
                      onClick={() => {
                        resetFormDialog();
                        setOpenDialog(true);
                      }}
                    >
                      Tambah
                    </Button>
                  </div>
                )}
                <SPKTableDetail
                  data={spkItems}
                  columns={DataHeaderSPKDetail}
                  currentPage={1}
                  limit={10}
                  fetchData={() => {
                    console.log("Fetching data...");
                  }}
                  onEdit={isSuperAdmin ? handleOpenEditSPKItem : undefined}
                  onDelete={isSuperAdmin ? handleDeleteSPKItem : undefined}
                  ableDelete={isSuperAdmin && !IS_COMPLETED && spkItems.length > 1}
                />
              </div>

              {/* Summary Pricing */}
              <div className="grid grid-cols-2 gap-20 mt-8 border-t pt-6">
                {/* Kolom Kiri - Kosong */}
                <div className="col-span-1">
                  <div className="flex items-start space-x-4">
                    <Label className="w-[40%] shrink-0 font-semibold flex items-center mt-2">
                      Catatan
                    </Label>
                    <Textarea
                      disabled
                      id="notes"
                      placeholder="Tidak ada catatan"
                      value={transaction.notes || ""}
                      rows={5}
                      className="resize-none"
                    />
                  </div>
                </div>

                {/* Kolom Kanan - Summary */}
                <div className="col-span-1 space-y-4">
                  <div className="flex items-center space-x-4">
                    <Label className="w-[40%] shrink-0 font-semibold">Total Harga SPK</Label>
                    <Input
                      disabled
                      value={formatRupiah(transaction.originPrice)}
                      className="text-right bg-muted/50 cursor-not-allowed"
                    />
                  </div>
                  <div className="flex items-center space-x-4">
                    <Label className="w-[40%] shrink-0 font-semibold flex items-center gap-1">
                      <span>Total Harga</span>
                      {!totals.isTotalPriceValid && (
                        <div className="relative group mx-1">
                          <BsInfoCircleFill className="h-4 w-4" />
                          <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-2 py-1 bg-black text-white text-xs rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap z-10">
                            Transaksi dibawah minimum Rp 250.000 akan dikenakan sebesar pembayaran minimum yaitu Rp 250.000
                          </div>
                        </div>
                      )}
                    </Label>
                    <Input
                      disabled
                      value={formatRupiah(totals.totalPrice)}
                      className="text-right bg-muted/50 cursor-not-allowed"
                    />
                  </div>

                  <div className="flex items-center space-x-4">
                    <Label className="w-[40%] shrink-0 font-semibold">Total Promo</Label>
                    <Input
                      disabled
                      value={formatRupiah(totals.totalPromo)}
                      className="text-right bg-muted/50 cursor-not-allowed"
                    />
                  </div>

                  {isSuperAdmin && !IS_COMPLETED ? (
                    <>
                      <div className="flex items-center space-x-4">
                        <Label className="w-[40%] shrink-0 font-semibold flex items-center gap-1">
                          <span>Diskon Manual</span>
                          {totals.isInvalidTotal && (
                            <div className="relative group mx-1">
                              <AlertTriangle className="h-4 w-4 text-red-500" />
                              <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-2 py-1 bg-black text-white text-xs rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap z-10">
                                Total pengurangan tidak boleh lebih besar dari total harga
                              </div>
                            </div>
                          )}
                        </Label>
                        <div className="flex items-center relative">
                          <span className="absolute inset-y-0 left-3 flex items-center font-semibold">Rp</span>
                          <Input
                            className={`text-right placeholder:text-start pr-7 no-spinner ${totals.isInvalidTotal ? 'border-red-500' : ''}`}
                            type="number"
                            id="discountAmount"
                            value={manualDiscount}
                            disabled={disabledDiscount}
                            onChange={handleDiscountChange}
                          />
                        </div>
                        <div className="flex items-center relative">
                          <Input
                            className={`text-right placeholder:text-start pr-7 no-spinner ${totals.isInvalidTotal ? 'border-red-500' : ''}`}
                            type="number"
                            id="discountPercent"
                            value={manualDiscountPercent}
                            disabled={disabledDiscountPercent}
                            onChange={handleDiscountPercentChange}
                          />
                          <span className="absolute inset-y-0 right-3 flex items-center font-semibold">%</span>
                        </div>
                      </div>

                      <div className="flex items-center space-x-4">
                        <Label className="w-[40%] shrink-0 font-semibold">Biaya Tambahan</Label>
                        <div className="flex items-center relative">
                          <span className="absolute inset-y-0 left-3 flex items-center font-semibold">Rp</span>
                          <Input
                            className={`text-right placeholder:text-start pr-7 no-spinner ${totals.isInvalidTotal ? 'border-red-500' : ''}`}
                            type="number"
                            id="additionalFee"
                            value={additionalFee}
                            disabled={disabledAdditionalFee}
                            onChange={handleAddFeeChange}
                          />
                        </div>
                        <div className="flex items-center relative">
                          <Input
                            className={`text-right placeholder:text-start pr-7 no-spinner ${totals.isInvalidTotal ? 'border-red-500' : ''}`}
                            type="number"
                            id="additionalFeePercent"
                            value={additionalFeePercent}
                            disabled={disabledAdditionalFeePercent}
                            onChange={handleAddFeePercentChange}
                          />
                          <span className="absolute inset-y-0 right-3 flex items-center font-semibold">%</span>
                        </div>
                      </div>
                    </>
                  ) : (
                    <>
                        <div className="flex items-center space-x-4">
                          <Label className="w-[40%] shrink-0 font-semibold">Diskon Manual</Label>
                          <div className="flex items-center relative">
                            <span className="absolute inset-y-0 left-3 flex items-center font-semibold">Rp</span>
                            <Input
                              className="text-right bg-muted/50 cursor-not-allowed"
                              id="discountAmount"
                              value={formatRupiah(manualDiscount, false)}
                              disabled
                            />
                          </div>
                          <div className="flex items-center relative">
                            <Input
                              className="text-right placeholder:text-start pr-7 no-spinner"
                              id="discountPercent"
                              value={manualDiscountPercent}
                              disabled
                            />
                            <span className="absolute inset-y-0 right-3 flex items-center font-semibold">%</span>
                          </div>
                        </div>

                        <div className="flex items-center space-x-4">
                          <Label className="w-[40%] shrink-0 font-semibold">Biaya Tambahan</Label>                         

                          <div className="flex items-center relative">
                            <span className="absolute inset-y-0 left-3 flex items-center font-semibold">Rp</span>
                            <Input
                              className="text-right bg-muted/50 cursor-not-allowed"
                              id="additionalFee"
                              value={formatRupiah(additionalFee, false)}
                              disabled
                            />
                          </div>
                          <div className="flex items-center relative">
                            <Input
                              className="text-right placeholder:text-start pr-7 no-spinner"
                              id="additionalFeePercent"
                              value={additionalFeePercent}
                              disabled
                            />
                            <span className="absolute inset-y-0 right-3 flex items-center font-semibold">%</span>
                          </div>
                        </div>
                    </>
                  )}

                  <div className="flex items-center justify-between mt-5 px-3 py-2 bg-neutral-200 rounded-lg dark:bg-neutral-800">
                    <Label className="w-[50%] font-bold text-2xl">Total Akhir</Label>
                    <Label className="text-right font-bold text-2xl">
                      {formatRupiah(totals.finalPrice)}
                    </Label>
                  </div>
                </div>
              </div>


              {/* Action Buttons */}
              <div className="flex justify-between">
                <div className="flex justify-start mt-6 gap-2">
                  <Button onClick={() => router.back()} variant="outline2">
                    <TbArrowBack />
                    Kembali
                  </Button>
                </div>

                <div className="flex justify-end mt-6 gap-2">
                  {
                    !IS_COMPLETED && (
                      <Button
                        type="submit"
                        variant="main"
                        onClick={handleUpdate}
                        disabled={totals.isInvalidTotal || updating}
                        loading={updating}
                      >
                        Simpan
                      </Button>
                    )
                  }

                  {isSuperAdmin && IS_PAID && (
                    <Button onClick={handleComplete} variant="main">
                      Konfirmasi
                    </Button>
                  )}
                </div>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="riwayat">
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <h3 className="text-lg font-semibold">Riwayat Transaksi</h3>
                <Button
                  onClick={() => refetchHistory()}
                  variant="outline"
                  size="sm"
                  disabled={historyLoading}
                >
                  {historyLoading ? "Loading..." : "Refresh"}
                </Button>
              </div>

              {historyLoading && (
                <div className="text-center py-8 text-muted-foreground">
                  <div className="flex items-center justify-center">
                    <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-600 mr-2"></div>
                    Memuat riwayat...
                  </div>
                </div>
              )}

              {historyError && (
                <div className="text-center py-8">
                  <div className="flex items-center justify-center text-red-500 mb-2">
                    <PiWarningCircleFill className="mr-2" />
                    Error memuat riwayat
                  </div>
                  <p className="text-sm text-muted-foreground">{historyError}</p>
                  <Button
                    onClick={() => refetchHistory()}
                    variant="outline"
                    size="sm"
                    className="mt-2"
                  >
                    Coba Lagi
                  </Button>
                </div>
              )}

              {!historyLoading && !historyError && history.length === 0 && (
                <div className="text-center py-8 text-muted-foreground">
                  <PiWarningCircleFill className="mx-auto mb-2 text-2xl" />
                  <p>Belum ada riwayat untuk transaksi ini</p>
                </div>
              )}

              {!historyLoading && !historyError && history.length > 0 && (
                <div className="space-y-4">
                  {reverseHistory.map((item, index) => (
                    <div
                      key={item.id}
                      className="border rounded-lg p-4 bg-white hover:bg-gray-50 transition-colors"
                    >
                      <div className="flex justify-between items-start mb-2">
                        <div className="flex items-center">
                          <div className="w-8 h-8 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center text-sm font-semibold mr-3">
                            {reverseHistory.length - index}
                          </div>
                          <div>
                            <p className="font-medium text-gray-900">
                              {item.trxNumber}
                            </p>
                            <p className="text-sm text-gray-500">
                              {formatDateTime(item.logDate)}
                            </p>
                          </div>
                        </div>
                      </div>
                      <div
                        className="text-sm text-gray-700 ml-11"
                        dangerouslySetInnerHTML={{ __html: item.notes }}
                      />
                    </div>
                  ))}
                </div>
              )}
            </div>
          </TabsContent>

          <TabsContent value="foto">
            <PhotoSection
              transaction={transaction}
              customer={customer}
              locationLabels={locationLabels}
              cleaningStaffList={reworkStaffList.filter(staff => transaction.assigns.includes(staff.lookupKey))}
              blowerStaffList={blowerStaffList.filter(staff => transaction.blowers.includes(staff.lookupKey))}
              spkItems={spkItems}
              totals={{
                totalPrice: totals.totalPrice,
                totalPromo: totals.totalPromo,
                manualDiscount: manualDiscount,
                finalPrice: totals.finalPrice,
                isInvalidTotal: totals.isInvalidTotal
              }}
            />
          </TabsContent>
        </Tabs>
      </Wrapper>

      {/* Input Table Dialog */}
      <DialogWrapper
        open={openDialog}
        onOpenChange={(open) => {
          setOpenDialog(open);
          if (!open) {
            resetFormDialog();
          }
        }}
        headItem={
          <>
            <Header label={editMode ? "Edit Item Pembayaran" : "Tambah Item Baru"} />
          </>
        }
      >
        <form onSubmit={(e) => {
          e.preventDefault();
          if (submitting) return;
          if (formDataTable.category && formDataTable.serviceCode) {
            handleSubmitSPKItem();
          }
        }}>
          <div className="mx-2">
            <div className="space-y-4">
              <div className="flex items-center space-x-4">
                <Label htmlFor="category" className="w-1/4">
                  Kategori
                </Label>
                <Select
                  onValueChange={(value) => handleChangeTable("category", value)}
                  value={formDataTable.category}
                  disabled={loadingParams || isEditingOriginal}
                >
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Pilih Kategori" />
                  </SelectTrigger>
                  <SelectContent className="z-[999]">
                    <SelectGroup>
                      <SelectLabel>Kategori</SelectLabel>
                      {loadingParams ? (
                        <SelectItem value="loading" disabled>
                          Loading...
                        </SelectItem>
                      ) : (
                        Object.keys(catLayananMapping).map((key) => (
                          <SelectItem key={key} value={key}>
                            {catLayananMapping[key]}
                          </SelectItem>
                        ))
                      )}
                    </SelectGroup>
                  </SelectContent>
                </Select>
              </div>

              <div className="flex items-center space-x-4">
                <Label htmlFor="unit" className="w-1/4">
                  Layanan
                </Label>
                <Select
                  onValueChange={(value) => handleChangeTable("serviceCode", value)}
                  value={formDataTable.serviceCode}
                  disabled={loadingServices || !formDataTable.category || formDataTable.category === "" || isEditingOriginal}
                >
                  <SelectTrigger className="w-full">
                    <SelectValue
                      placeholder={
                        !formDataTable.category
                          ? "Pilih kategori terlebih dahulu"
                          : loadingServices
                            ? "Loading..."
                            : "Pilih Layanan"
                      }
                    />
                  </SelectTrigger>
                  <SelectContent className="z-[999]">
                    <SelectGroup>
                      <SelectLabel>Layanan</SelectLabel>
                      {loadingServices ? (
                        <SelectItem value="loading" disabled>
                          Loading...
                        </SelectItem>
                      ) : services.length === 0 ? (
                        <SelectItem value="no-data" disabled>
                          Tidak ada layanan untuk kategori ini
                        </SelectItem>
                      ) : (
                        services.map((service) => (
                          <SelectItem key={service.serviceCode} value={service.serviceCode}>
                            {service.serviceName}
                          </SelectItem>
                        ))
                      )}
                    </SelectGroup>
                  </SelectContent>
                </Select>
              </div>

              <div className="flex items-center space-x-4">
                <Label htmlFor="jumlah" className="w-1/4 font-semibold">Jumlah</Label>
                <Input
                  placeholder="Masukkan Jumlah"
                  type="number"
                  min={1}
                  value={formDataTable.jumlah}
                  onChange={(e) => handleChangeTable("jumlah", e.target.value)}
                />
              </div>

              <div className="flex items-center space-x-4">
                <Label htmlFor="tipe" className="w-[20%] font-semibold">Tipe</Label>
                <RadioGroup
                  value={formDataTable.tipe}
                  onValueChange={(value) => handleChangeTable("tipe", value)}
                  className="flex items-center gap-5"
                  disabled={!(formDataTable.category !== "GENERAL" && formDataTable.category !== "BLOWER")}
                >
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="vakum" id="vakum" />
                    <Label htmlFor="vakum">Vakum</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="cuci" id="cuci" />
                    <Label htmlFor="cuci">Cuci</Label>
                  </div>
                </RadioGroup>
              </div>

              <div className="flex items-center space-x-4">
                <Label htmlFor="harga" className="w-1/4 font-semibold">Harga</Label>
                <RupiahInput
                  disabled
                  placeholder="Rp. 0"
                  value={formatRupiah(formDataTable.harga * Number(formDataTable.jumlah || 1))}
                  onValueChange={(value) => handleChangeTable("harga", value)}
                />
              </div>

              <div className="flex items-center space-x-4">
                <Label htmlFor="promo" className="w-1/4 font-semibold">Promo</Label>
                <div className="flex items-center space-x-2 w-full">
                  <div className="relative flex-1">
                    <Input
                      value={formatRupiah(formDataTable.promoType === 'Persentase' ? formDataTable.promo * formDataTable.harga * Number(formDataTable.jumlah) / 100 : formDataTable.promo * Number(formDataTable.jumlah))}
                      className="bg-muted/50 cursor-not-allowed text-right"
                      readOnly
                      placeholder="Rp. 0"
                    />
                    {loadingPromo && (
                      <div className="absolute inset-0 bg-background/50 flex items-center justify-center rounded-md">
                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-primary"></div>
                      </div>
                    )}
                  </div>
                </div>
              </div>

              <div className="flex items-center space-x-4">
                <Label htmlFor="subtotal" className="w-1/4 font-bold text-lg">Subtotal</Label>
                <RupiahInput
                  placeholder="Rp. 0"
                  value={formatRupiah(
                    (Number(formDataTable.harga) || 0) * (Number(formDataTable.jumlah) || 1) - (Number(formDataTable.promoType === "Persentase" ? Number(formDataTable.jumlah) * formDataTable.promo * formDataTable.harga / 100 : formDataTable.promo * Number(formDataTable.jumlah)) || 0)
                  )}
                  className="!border-0 !text-lg font-bold text-right"
                  readOnly
                />
              </div>
            </div>
          </div>
          <div className="flex justify-end gap-2 mt-4">
            <Button
              variant="outline2"
              onClick={() => {
                setOpenDialog(false);
                resetFormDialog();
              }}
            >
              Kembali
            </Button>
            <Button
              disabled={!formDataTable.category || !formDataTable.serviceCode || !formDataTable.jumlah || !formDataTable.harga || submitting}
              variant="main"
              onClick={handleSubmitSPKItem}
              loading={submitting}
            >
              {editMode ? "Perbarui" : "Tambah"}
            </Button>
          </div>
        </form>
      </DialogWrapper>
    </>
  );
}
