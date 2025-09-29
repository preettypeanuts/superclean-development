"use client";

import { DialogTitle } from "@radix-ui/react-dialog";
import { Header } from "@shared/components/Header";
import { Breadcrumbs } from "@shared/components/ui/Breadcrumbs";
import { Wrapper } from "@shared/components/Wrapper";
import { useCategoryStore, useServiceLookup } from "@shared/utils/useCategoryStore";
import { DatePicker } from "@ui-components/components/date-picker";
import MultiSelect from "@ui-components/components/multi-select";
import { RupiahInput } from "@ui-components/components/rupiah-input";
import { Dialog, DialogClose, DialogContent, DialogDescription, DialogHeader, DialogTrigger } from "@ui-components/components/ui/dialog";
import { RadioGroup, RadioGroupItem } from "@ui-components/components/ui/radio-group";
import { Select, SelectContent, SelectGroup, SelectItem, SelectLabel, SelectTrigger, SelectValue } from "@ui-components/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@ui-components/components/ui/tabs";
import { useToast } from "@ui-components/hooks/use-toast";
import { PromoResponse, SPKItem } from "apps/admin-app/app/transaksi/spk/baru/page";
import PhotoSection from "apps/admin-app/app/transaksi/spk/photoSection";
import { DialogWrapper } from "libs/ui-components/src/components/dialog-wrapper";
import { SPKTableDetail } from "libs/ui-components/src/components/spk-table-detail";
import { Button } from "libs/ui-components/src/components/ui/button";
import { Input } from "libs/ui-components/src/components/ui/input";
import { Label } from "libs/ui-components/src/components/ui/label";
import { Textarea } from "libs/ui-components/src/components/ui/textarea";
import { api } from "libs/utils/apiClient";
import { formatDateInput } from "libs/utils/formatDate";
import { formatRupiah } from "libs/utils/formatRupiah";
import { useTransactionHistory } from "libs/utils/useTransactionHistory";
import { AlertTriangle } from "lucide-react";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useMemo, useState } from "react";
import { BsInfoCircleFill } from "react-icons/bs";
import { IoMdTrash } from "react-icons/io";
import { LuPlus } from "react-icons/lu";
import { PiWarningCircleFill } from "react-icons/pi";
import { TbArrowBack, TbArrowBigRightFilled } from "react-icons/tb";


// Updated Transaction interface
export interface Transaction {
  id: string;
  trxNumber: string;
  customerId: string;
  branchId: string;
  totalPrice: number;
  discountPrice: number;
  promoPrice: number;
  finalPrice: number;
  trxDate: string;
  deliveryDate?: string;
  pickupDate?: string;
  additionalFee: number;
  notes: string | null;
  status: number;
  assigns: string[]; // Array of user IDs for cleaning staff
  blowers: string[]; // Array of user IDs for blower staff
  details: TransactionItem[];
  reassigns: string[];
}

// Customer interface
export interface Customer {
  id: string;
  fullname: string;
  noWhatsapp: string;
  address: string;
  province: string;
  city: string;
  district: string;
  subDistrict: string;
}

// Transaction Detail interface
export interface TransactionItem {
  id: string;
  trxNumber: string;
  serviceCategory: string;
  serviceCode: string;
  serviceType: number;
  quantity: number;
  promoCode: string;
  servicePrice: number;
  totalPrice: number;
  promoPrice: number;
  isPl: number;
  service: TransactionItemService;
  promoAmount: number;
}

interface TransactionItemService {
  id: string;
  code: string;
  name: string;
  category: string;
  unit: string;
  vacuumPrice: number;
  cleanPrice: number;
  status: number;
  createdAt: string;
  createdBy: string;
  updatedAt: string;
  updatedBy: string;
}

// Location interface
export interface LocationData {
  id: string;
  paramKey: string;
  paramValue: string;
}

// Format transaction details for table
const formatDetailsForTable = (details: TransactionItem[], isOriginal: boolean = false) => {
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
    isOriginal: isOriginal,
  }));
};


export default function TransactionDetail() {
  const pathname = usePathname();
  const { toast } = useToast();
  const router = useRouter();
  const id = useMemo(() => {
    return pathname.split("/transaksi/spk/edit/").pop();
  }, [])

  // States
  const [transaction, setTransaction] = useState<Transaction | null>(null);
  const [customer, setCustomer] = useState<Customer | null>(null);

  const [originalTransactionDate, setOriginalTransactionDate] = useState<string>("");


  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const [locationLabels, setLocationLabels] = useState({
    provinceName: "",
    cityName: "",
    districtName: "",
    subDistrictName: ""
  });

  const [spkItems, setSPKItems] = useState<SPKItem[]>([]);
  const [originalSPKItems, setOriginalSPKItems] = useState<SPKItem[]>([]);

  const [manualDiscount, setManualDiscount] = useState<number>(0);
  const [additionalFee, setAdditionalFee] = useState<number>(0);
  const [loadingPromo, setLoadingPromo] = useState(false);

  const [cleaningStaffList, setCleaningStaffList] = useState<any[]>([]);
  const [blowerStaffList, setBlowerStaffList] = useState<any[]>([]);
  const [loadingCleaningStaff, setLoadingCleaningStaff] = useState(false);
  const [loadingBlowerStaff, setLoadingBlowerStaff] = useState(false);

  // State untuk form dialog
  const [openDialog, setOpenDialog] = useState(false);

  // State untuk tracking mode edit
  const [editMode, setEditMode] = useState<string | null>(null);

  const [formDataTable, setFormDataTable] = useState({
    category: "",
    serviceCode: "",
    jumlah: "",
    tipe: "vakum",
    harga: 0,
    promo: 0,
    promoCode: "",
    promoType: "",
  });

  // Use transaction history hook
  const { history, loading: historyLoading, error: historyError, refetch: refetchHistory } = useTransactionHistory(id);
  const { services, loading: loadingServices } = useServiceLookup(formDataTable.category);
  const { catLayananMapping, loading: loadingParams } = useCategoryStore();

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

  useEffect(() => {
    if (id) {
      fetchTransaction();
    }
  }, [id]);

  // Fetch transaction data
  const fetchTransaction = async () => {
    try {
      const result = await api.get(`/transaction/detail?trxNumber=${id}`);
      const transactionData = result.data as Transaction
      let { trxDate, pickupDate, deliveryDate } = transactionData;
      if (!pickupDate) {
        pickupDate = trxDate
      }
      if (!deliveryDate) {
        deliveryDate = trxDate
      }

      setTransaction({
        ...transactionData,
        pickupDate,
        deliveryDate
      });

      setOriginalTransactionDate(transactionData.trxDate);

      const totalDiscount = transactionData.discountPrice || 0;
      const totalPromo = transactionData.promoPrice || 0;

      setManualDiscount(totalDiscount - totalPromo);
      setAdditionalFee(transactionData.additionalFee || 0);

      // Fetch customer data
      if (transactionData.customerId) {
        await fetchCustomerData(transactionData.customerId);
      }

      if (transactionData?.details.length) {
        setSPKItems(formatDetailsForTable(transactionData.details, true));
        setOriginalSPKItems(formatDetailsForTable(transactionData.details, true));
      }

    } catch (error) {
      console.error("Gagal mengambil data transaksi:", error);
    } finally {
      setLoading(false);
    }
  };

  // Fetch customer data
  const fetchCustomerData = async (customerId: string) => {
    try {
      const result = await api.get(`/customer/id/${customerId}`);
      const customerData = result.data;
      setCustomer(customerData);

      // Fetch location labels
      await fetchLocationLabels(customerData);
    } catch (error) {
      console.error("Gagal mengambil data customer:", error);
    }
  };

  // Function untuk fetch staff data
  const fetchStaffData = async (roleId: string, city: string, setStaffList: Function, setLoading: Function) => {
    if (!roleId || !city) {
      setStaffList([]);
      return;
    }

    setLoading(true);
    try {
      const response = await api.get(`/user/lookup?roleId=${roleId}&city=${city}`);
      setStaffList(response?.data || []);
    } catch (error) {
      setStaffList([]);
      toast({
        title: "Error",
        description: `Gagal mengambil data petugas ${roleId.toLowerCase()}`,
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  // Effect untuk fetch staff data ketika customer berubah
  useEffect(() => {
    if (customer?.city) {
      fetchStaffData("CLEANER", customer.city, setCleaningStaffList, setLoadingCleaningStaff);
      fetchStaffData("BLOWER", customer.city, setBlowerStaffList, setLoadingBlowerStaff);
    } else {
      setCleaningStaffList([]);
      setBlowerStaffList([]);
    }
  }, [customer?.city]);

  // Fetch location labels
  const fetchLocationLabels = async (customerData: Customer) => {
    try {
      const [provinceRes, cityRes, districtRes, subDistrictRes] = await Promise.all([
        api.get(`/parameter/provinces`),
        api.get(`/parameter/cities?province=${customerData.province}`),
        api.get(`/parameter/districts?province=${customerData.province}&city=${customerData.province}`),
        api.get(`/parameter/sub-districts?province=${customerData.province}&city=${customerData.province}&district=${customerData.province}`)
      ]);

      const findLabel = (items: LocationData[], code: string) => {
        const item = items.find(item => item.paramKey === code);
        return item ? item.paramValue : code;
      };

      setLocationLabels({
        provinceName: findLabel(provinceRes.data || [], customerData.province),
        cityName: findLabel(cityRes.data || [], customerData.city),
        districtName: findLabel(districtRes.data || [], customerData.district),
        subDistrictName: findLabel(subDistrictRes.data || [], customerData.subDistrict)
      });
    } catch (error) {
      console.error("Gagal mengambil data lokasi:", error);
    }
  };

  // Get status label
  const getStatusLabel = (status: number) => {
    switch (status) {
      case 0: return "Baru";
      case 1: return "Proses";
      case 2: return "Batal";
      default: return "Unknown";
    }
  };

  const IS_NEW = transaction?.status === 0;
  const IS_PROCESSED = transaction?.status === 1;
  const IS_CANCELLED = transaction?.status === 2;

  const DataHeaderSPKDetail = useMemo(() => {
    const columns = [
      { key: "no", label: "#" },
      { key: "kode", label: "Kode Service" },
      { key: "layanan", label: "Layanan" },
      { key: "kategori", label: "Kategori" },
      { key: "jumlah", label: "Jumlah" },
      { key: "satuan", label: "Satuan" },
      { key: "harga", label: "Harga Satuan" },
      // { key: "totalHarga", label: "Total Harga" },
      { key: "promo", label: "Promo Satuan" },
    ];

    if (!IS_CANCELLED) {
      columns.push({ key: "menu", label: "Actions" });
    }

    return columns;
  }, [transaction]);

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

  // handleOpenEditSPKItem function
  const handleOpenEditSPKItem = (item: SPKItem) => {
    const selectedCategory = Object.entries(catLayananMapping).find(([key, value]) => value === item.kategoriCode);

    setFormDataTable({
      category: selectedCategory ? selectedCategory[0] : item.kategoriCode,
      serviceCode: item.kode,
      jumlah: item.jumlah.toString(),
      tipe: item.tipe || "vakum",
      harga: item.harga,
      promo: item.promo,
      promoCode: item.promoCode || "",
      promoType: item.promoType || "",
    });

    setEditMode(item.id);
    setOpenDialog(true);
  };

  // resetFormDialog function
  const resetFormDialog = () => {
    setFormDataTable({
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

  const handleCleaningStaffChange = (selectedStaffIds: string[]) => {
    setTransaction(prev => {
      if (!prev) return null;

      // Update assigns with selected staff IDs
      return {
        ...prev,
        assigns: selectedStaffIds
      };
    });
  };

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

  const handleBlowerStaffChange = (selectedStaffIds: string[]) => {
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

  // Updated handleChangeTable function untuk handle promo fetching
  const handleChangeTable = async (field: string, value: any) => {
    setFormDataTable(prev => {
      const newData = { ...prev, [field]: value };

      // Jika kategori berubah, reset serviceCode
      if (field === "category") {
        newData.serviceCode = "";
        newData.harga = 0;
        newData.promo = 0;
        newData.jumlah = "";
        newData.promoCode = "";
        newData.promoType = "";

        // lock type if category is general or blower
        // set type to cuci
        if (value === "GENERAL" || value === "BLOWER") {
          newData.tipe = "cuci";
        }
      }

      // Jika serviceCode berubah, auto-fill harga dari service yang dipilih
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

      // Jika tipe berubah dan ada service yang dipilih, update harga
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

    // Auto fetch promo jika serviceCode dan jumlah sudah ada
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

  // function untuk menambah / mengedit SPK item
  const handleSubmitSPKItem = async () => {
    console.log("Submitting SPK Item:", formDataTable, "Edit Mode:", editMode);


    // Validasi form
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

    // Validasi: promo tidak boleh lebih besar dari total harga item
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

        // Mode edit - update existing item
        const payload = {
          serviceCategory: catLayananMapping[formDataTable.category] || formDataTable.category,
          serviceCode: formDataTable.serviceCode,
          serviceType: formDataTable.tipe === "vakum" ? 1 : 2,
          servicePrice: formDataTable.harga,
          promoCode: formDataTable.promoCode,
          promoType: formDataTable.promoType,
          promoAmount: formDataTable.promo,
          quantity: Number(formDataTable.jumlah),
        }

        // delete first and then create new
        await api.delete(`/transaction-detail/${transaction?.id}/${editMode}`);
        await api.post(`/transaction-detail/${transaction?.id}/`, payload);

        toast({
          title: "Berhasil",
          description: "Item SPK berhasil diperbarui",
          variant: "default",
        });

        // reload
        setTimeout(() => {
          window.location.reload();
        }, 1000);
      }
      catch (error) {
        toast({
          title: "Gagal",
          description: "Terjadi kesalahan saat memperbarui item SPK.",
          variant: "destructive",
        })
      }
      finally {
        // setSubmitting(false);
      }
    } else {
      try {
        // Mode tambah - add new item
        setSubmitting(true);

        const payload = {
          serviceCategory: catLayananMapping[formDataTable.category] || formDataTable.category,
          serviceCode: formDataTable.serviceCode,
          serviceType: formDataTable.tipe === "vakum" ? 1 : 2,
          servicePrice: formDataTable.harga,
          promoCode: formDataTable.promoCode,
          promoType: formDataTable.promoType || "Nominal",
          promoAmount: formDataTable.promo,
          quantity: Number(formDataTable.jumlah),
        }

        await api.post(`/transaction-detail/${transaction?.id}/`, payload);

        toast({
          title: "Berhasil",
          description: "Item SPK berhasil ditambahkan",
          variant: "default",
        });

        // reload
        setTimeout(() => {
          window.location.reload();
        }, 1000);
      }
      catch (error) {
        toast({
          title: "Gagal",
          description: "Terjadi kesalahan saat menambahkan item SPK.",
          variant: "destructive",
        })
      }
      finally {
        // setSubmitting(false);
      }
    }

    // resetFormDialog();
    // setOpenDialog(false);
  };


  // Function untuk menghapus SPK item
  const handleDeleteSPKItem = async (itemId: string) => {
    try {
      await api.delete(`/transaction-detail/${transaction?.id}/${itemId}`);
      setSPKItems(prev => prev.filter(item => item.id !== id));
      toast({
        title: "Berhasil",
        description: "Item SPK berhasil dihapus",
        variant: "default",
      });

      // reload
      setTimeout(() => {
        window.location.reload();
      }, 1000);
    }
    catch (error) {
      toast({
        title: "Gagal",
        description: "Terjadi kesalahan saat menghapus item SPK.",
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
      discountPrice: manualDiscount,
      additionalFee: additionalFee,
      trxDate: transaction?.trxDate ? new Date(transaction.trxDate).toISOString() : new Date().toISOString(),
      // Ubah bagian ini - set null jika tidak ada blower
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

  const handleProses = async () => {
    try {
      await api.put(`/transaction/${transaction?.id}/status`, {
        status: 1,
      })

      router.back();

      toast({
        title: "Berhasil",
        description: "SPK berhasil diproses!",
        variant: "default",
      });

    } catch (error: any) {
      console.error("Error response:", error.response?.data || error.message);
      toast({
        title: "Gagal",
        description: "Terjadi kesalahan saat memproses SPK.",
        variant: "destructive",
      });

    }
  }

  const handleCancel = async () => {
    try {
      await api.put(`/transaction/${transaction?.id}/status`, {
        status: 2,
      });

      router.back();

      toast({
        title: "Berhasil",
        description: "SPK berhasil dibatalkan!",
        variant: "default",
      });
    } catch (error: any) {
      console.error("Error response:", error.response?.data || error.message);
      toast({
        title: "Gagal",
        description: "Terjadi kesalahan saat membatalkan SPK.",
        variant: "destructive",
      });
    }
  }

  const formatTime = (dateString: string) => {
    const date = new Date(dateString);
    // make only format with hh:mm:ss
    return date.toString().split(' ')[4];
  }

  if (loading) {
    return (
      <Wrapper>
        <Header label="Loading Detail SPK..." />
        <p className="text-center py-8">Memuat data...</p>
      </Wrapper>
    );
  }

  if (!transaction) {
    return (
      <Wrapper>
        <Header label="Detail SPK" />
        <p className="text-center text-red-500 py-8">Data tidak ditemukan!</p>
        <div className="flex justify-center mt-4">
          <Button onClick={() => router.back()} variant="outline">
            <TbArrowBack />
            Kembali
          </Button>
        </div>
      </Wrapper>
    );
  }

  const isEditingOriginal = (editMode && originalSPKItems.some(item => item.id === editMode)) as boolean;


  return (
    <>
      <Breadcrumbs label={`Ubah SPK`} />
      <Wrapper>
        <Tabs defaultValue="detail" className="-mt-2">
          <TabsList>
            <TabsTrigger value="detail">Detail</TabsTrigger>
            <TabsTrigger value="riwayat">Riwayat</TabsTrigger>
            <TabsTrigger value="foto">Foto</TabsTrigger>
          </TabsList>
          <div className="w-full border-t my-3 -mx-10"></div>

          <TabsContent value="detail">
            <div className="flex flex-col gap-4">
              {/* GROUP 1 - DATA CLIENT */}
              <form
                onSubmit={handleUpdate}
              >
                <div className="grid grid-cols-2 gap-20">
                  {/* Kolom Kiri */}
                  <div className="col-span-1 space-y-4">
                    <div className="flex items-center space-x-4">
                      <Label className="w-[40%] font-semibold">No Transaksi</Label>
                      <Input disabled value={transaction?.trxNumber} />
                    </div>

                    <div className="flex items-center space-x-4">
                      <Label className="w-[40%] font-semibold">No Whatsapp</Label>
                      <Input disabled value={customer?.noWhatsapp || "-"} />
                    </div>

                    <div className="flex items-center space-x-4">
                      <Label className="w-[40%] font-semibold">Nama Pelanggan</Label>
                      <Input disabled value={customer?.fullname || "-"} />
                    </div>

                    <div className="flex items-center space-x-4">
                      <Label className="w-[40%] font-semibold">Alamat</Label>
                      <Textarea
                        disabled
                        className="resize-none"
                        value={customer?.address || "-"}
                        rows={4}
                      />
                    </div>
                  </div>

                  {/* Kolom Kanan */}
                  <div className="col-span-1 space-y-4">
                    <div className="flex items-center space-x-4">
                      <Label className="w-[40%] font-semibold">Status</Label>
                      <Input disabled value={getStatusLabel(transaction?.status as number)} />
                    </div>

                    <div className="flex items-center space-x-4">
                      <Label className="w-[40%] font-semibold">Provinsi</Label>
                      <Input disabled value={locationLabels.provinceName || "-"} />
                    </div>

                    <div className="flex items-center space-x-4">
                      <Label className="w-[40%] font-semibold">Kab/Kota</Label>
                      <Input disabled value={locationLabels.cityName || "-"} />
                    </div>

                    <div className="flex items-center space-x-4">
                      <Label className="w-[40%] font-semibold">Kecamatan</Label>
                      <Input disabled value={locationLabels.districtName || "-"} />
                    </div>

                    <div className="flex items-center space-x-4">
                      <Label className="w-[40%] font-semibold">Kelurahan</Label>
                      <Input disabled value={locationLabels.subDistrictName || "-"} />
                    </div>
                  </div>
                </div>

                {/* Divider */}
                <div className="w-full border-t my-7"></div>

                {/* GROUP 2 - DATA PETUGAS */}
                <div className="grid grid-cols-2 gap-20">
                  {/* Kolom Kiri */}
                  <div className="col-span-1 space-y-4">
                    <div className="flex items-center space-x-4">
                      <Label className="w-[40%] font-semibold">Petugas Cleaning</Label>
                      <MultiSelect
                        staffList={cleaningStaffList}
                        selected={transaction?.assigns || []}
                        onSelectionChange={handleCleaningStaffChange}
                        placeholder="Pilih petugas cleaning"
                        loading={loadingCleaningStaff}
                      />
                    </div>

                    <div className="flex items-center space-x-4">
                      <Label className="w-[40%] font-semibold">Tanggal Pengerjaan</Label>
                      <DatePicker
                        withTime
                        defaultTime={transaction?.trxDate ? `${formatTime(transaction.trxDate)}` : "08:00"}
                        onChangeTime={(time) => {
                          if (time && transaction?.trxDate) {
                            const date = new Date(transaction.trxDate);
                            const [hours, minutes] = time.split(':').map(Number);
                            date.setHours(hours, minutes);

                            setTransaction((prev) => ({
                              ...prev,
                              trxDate: date.toISOString()
                            } as Transaction));
                          }
                        }}
                        startFrom={new Date(originalTransactionDate)}
                        value={transaction.trxDate ? new Date(transaction.trxDate) : null}
                        onChange={(date) => {
                          if (date) {
                            setTransaction((prev) => ({
                              ...prev,
                              trxDate: date.toISOString()
                            } as Transaction));
                          }
                        }}
                      />
                    </div>
                  </div>

                  {/* Kolom Kanan */}
                  <div className="col-span-1 space-y-4">
                    <div className="flex items-center space-x-4">
                      {/* <Label className="w-[40%] font-semibold">Petugas Blower</Label>
                      <Textarea
                        disabled
                        className="resize-none"
                        value={blowerStaffList.map(staff => staff.fullname).join(", ") || "-"}
                        rows={2}
                      /> */}
                      <Label className="w-[40%] font-semibold">Petugas Blower</Label>
                      <MultiSelect
                        staffList={blowerStaffList}
                        selected={transaction?.blowers || []}
                        onSelectionChange={handleBlowerStaffChange}
                        placeholder="Pilih petugas blower"
                        loading={loadingBlowerStaff}
                      />
                    </div>

                    {
                      transaction.blowers.length > 0 && (
                        <>
                          <div className="flex items-center space-x-4">
                            <Label className="w-[40%] font-semibold">Tanggal Pengantaran</Label>
                            <DatePicker
                              startFrom={new Date(transaction?.trxDate)}
                              withTime
                              defaultTime={transaction?.deliveryDate ? `${formatTime(transaction.deliveryDate)}` : formatTime(transaction?.trxDate || new Date().toISOString())}
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
                            <Label className="w-[40%] font-semibold">Tanggal Pengambilan</Label>
                            <DatePicker
                              withTime
                              defaultTime={transaction?.pickupDate ? `${formatTime(transaction.pickupDate)}` : formatTime(transaction?.trxDate || new Date().toISOString())}
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
                  </div>
                </div>
              </form>

              {/* Divider */}
              <div className="w-full border-t mt-7"></div>

              {/* GROUP 3 - TABLE DETAIL */}
              <div className="mt-5 space-y-3">
                <div className="flex justify-between items-center">
                  <h3 className="text-lg font-semibold">Detail Layanan</h3>
                </div>

                {!IS_CANCELLED && (
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
                  onEdit={handleOpenEditSPKItem}
                  onDelete={handleDeleteSPKItem}
                />
              </div>

              {/* SUMMARY SECTION */}
              <div className="grid grid-cols-2 gap-20 mt-5">
                {/* Kolom Kiri */}
                <div className="col-span-1">
                  <div className="flex items-start space-x-4">
                    <Label className="w-[40%] font-semibold flex items-center mt-2">
                      Catatan
                    </Label>
                    <Textarea
                      id="notes"
                      value={transaction.notes || ""}
                      placeholder="Masukkan catatan anda disini"
                      rows={5}
                      className="resize-none"
                      onChange={(e) => setTransaction(prev => ({
                        ...prev,
                        notes: e.target.value
                      } as Transaction))}
                    />
                  </div>
                </div>

                {/* Kolom Kanan */}
                <div className="col-span-1 space-y-4">
                  <div className="flex items-center space-x-4">
                    <Label className="w-[40%] font-semibold flex items-center gap-1">
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
                      className="text-right"
                      value={formatRupiah(totals.totalPrice)}
                    />
                  </div>

                  <div className="flex items-center space-x-4">
                    <Label className="w-[40%] font-semibold">Total Promo</Label>
                    <Input className="text-right" disabled value={formatRupiah(totals.totalPromo)} />
                  </div>

                  {!IS_CANCELLED && (
                    <>
                      <div className="flex items-center space-x-4">
                        <Label className="w-[40%] font-semibold flex items-center gap-1">
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

                        <RupiahInput
                          placeholder="Rp. 0"
                          value={formatRupiah(manualDiscount)}
                          onValueChange={setManualDiscount}
                          className={`text-right ${totals.isInvalidTotal ? 'border-red-500 bg-red-50 dark:bg-red-500/40' : ''}`}
                        />
                      </div>
                      <div className="flex items-center space-x-4">
                        <Label className="w-[40%] font-semibold">Biaya Tambahan</Label>
                        <RupiahInput
                          placeholder="Rp. 0"
                          value={formatRupiah(additionalFee)}
                          onValueChange={(e) => { setAdditionalFee(e); }}
                          className="text-right"
                        />
                      </div>
                    </>
                  )}

                  <div className="flex items-center justify-between mt-5 px-3 py-2 bg-neutral-200 dark:bg-darkColor rounded-lg">
                    <Label className="w-[50%] font-bold text-2xl">Total Akhir</Label>
                    <Label className="text-right font-bold text-2xl">{formatRupiah(totals.finalPrice)}</Label>
                  </div>
                </div>
              </div>

              <div className="flex justify-between">
                {/* Tombol Kembali */}
                <div className="flex justify-start mt-6 gap-2">
                  <Button onClick={() => router.back()} variant="outline2">
                    <TbArrowBack className="mr-2" />
                    Kembali
                  </Button>

                  {!IS_CANCELLED && (
                    <Dialog>
                      <DialogTrigger asChild>
                        <Button
                          variant="destructive"
                        >
                          Batalkan
                        </Button>
                      </DialogTrigger>
                      <DialogContent>
                        <DialogHeader className="flex items-center justify-center">
                          <div className="text-5xl text-destructive bg-destructive-foreground/10 rounded-full p-2 w-fit mb-4">
                            <IoMdTrash />
                          </div>
                          <DialogTitle>Kamu yakin membatalkan SPK?</DialogTitle>
                          <DialogDescription className="text-center">
                            Data akan terhapus permanen dan tidak dapat dikembalikan.
                          </DialogDescription>
                        </DialogHeader>
                        <div className="flex gap-2">
                          <DialogClose asChild>
                            <Button variant="secondary" className="w-full">
                              Batal
                            </Button>
                          </DialogClose>
                          <DialogClose asChild>
                            <Button
                              variant="destructive"
                              className="w-full"
                              onClick={handleCancel}
                            >
                              Hapus
                            </Button>
                          </DialogClose>
                        </div>
                      </DialogContent>
                    </Dialog>
                  )}
                </div>

                <div className="flex justify-end mt-6 gap-2">
                  {!IS_CANCELLED && (
                    <Button
                      type="submit"
                      variant="main"
                      onClick={handleUpdate}
                      disabled={totals.isInvalidTotal || updating}
                      loading={updating}
                    >
                      Update Data
                    </Button>
                  )}

                  {IS_NEW && (
                    <Button
                      type="submit"
                      variant="main"
                      onClick={handleProses}
                      disabled={totals.isInvalidTotal}
                    >
                      Proses
                      <TbArrowBigRightFilled className="mr-2" />
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
                  {history.map((item, index) => (
                    <div
                      key={item.id}
                      className="border rounded-lg p-4 bg-white hover:bg-gray-50 transition-colors"
                    >
                      <div className="flex justify-between items-start mb-2">
                        <div className="flex items-center">
                          <div className="w-8 h-8 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center text-sm font-semibold mr-3">
                            {index + 1}
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
              cleaningStaffList={cleaningStaffList.filter(staff => transaction.assigns.includes(staff.lookupKey))}
              blowerStaffList={blowerStaffList.filter(staff => transaction.blowers.includes(staff.lookupKey))}
              spkItems={spkItems}
              totals={totals}
            />
          </TabsContent>
        </Tabs>
      </Wrapper >

      {/* Input Table Dialog */}
      < DialogWrapper
        open={openDialog}
        onOpenChange={(open) => {
          setOpenDialog(open);
          if (!open) {
            resetFormDialog();
          }
        }
        }
        headItem={
          <>
            <Header label={editMode ? "Edit SPK Item" : "Tambah SPK Baru"} />
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
      </DialogWrapper >
    </>
  );
}
