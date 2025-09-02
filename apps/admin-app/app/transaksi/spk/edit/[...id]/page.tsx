"use client";

import { useEffect, useMemo, useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import { Wrapper } from "@shared/components/Wrapper";
import { Header } from "@shared/components/Header";
import { Label } from "libs/ui-components/src/components/ui/label";
import { Button } from "libs/ui-components/src/components/ui/button";
import { Input } from "libs/ui-components/src/components/ui/input";
import { Textarea } from "libs/ui-components/src/components/ui/textarea";
import { api } from "libs/utils/apiClient";
import { TbArrowBack, TbArrowBigRightFilled, TbSignRight } from "react-icons/tb";
import { formatDate, formatDateInput } from "libs/utils/formatDate";
import { formatRupiah } from "libs/utils/formatRupiah";
import { SPKTableDetail } from "libs/ui-components/src/components/spk-table-detail";
import { Breadcrumbs } from "@shared/components/ui/Breadcrumbs";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@ui-components/components/ui/tabs";
import { PiWarningCircleFill } from "react-icons/pi";
import { useTransactionHistory } from "libs/utils/useTransactionHistory";
import { useTransactionDetail } from "libs/utils/useTransactionDetail";
import { LuPlus } from "react-icons/lu";
import MultiSelect from "@ui-components/components/multi-select";
import { PromoResponse, SPKItem } from "apps/admin-app/app/transaksi/spk/baru/page";
import { StarRating } from "@ui-components/components/star-rating";
import { AttachmentImage } from "@ui-components/components/attachment-image";
import { RupiahInput } from "@ui-components/components/rupiah-input";
import { Select, SelectContent, SelectGroup, SelectItem, SelectLabel, SelectTrigger, SelectValue } from "@ui-components/components/ui/select";
import { RadioGroup, RadioGroupItem } from "@ui-components/components/ui/radio-group";
import { DialogWrapper } from "libs/ui-components/src/components/dialog-wrapper";
import { useCategoryStore, useServiceLookup } from "@shared/utils/useCategoryStore";
import { useToast } from "@ui-components/hooks/use-toast";
import { Dialog, DialogClose, DialogContent, DialogDescription, DialogHeader, DialogTrigger } from "@ui-components/components/ui/dialog";
import { IoMdTrash } from "react-icons/io";
import { DialogTitle } from "@radix-ui/react-dialog";
import html2canvas from "html2canvas";

const downloadImage = (blob: string, fileName: string) => {
  try {
    const fakeLink: any = window.document.createElement("a");
    fakeLink.style = "display:none;";
    fakeLink.download = fileName;

    fakeLink.href = blob;

    document.body.appendChild(fakeLink);
    fakeLink.click();
    document.body.removeChild(fakeLink);

    fakeLink.remove();
  } catch (error) {
    throw error
  }
};

const exportAsImage = async (element: HTMLElement, filename: string) => {
  try {
    const elementHeight = element.scrollHeight;
    const offset = window.outerHeight - window.innerHeight;

    console.log(elementHeight, offset, elementHeight + offset);

    const canvas = await html2canvas(element, {
      allowTaint: true,
      useCORS: true,
      height: elementHeight + offset,
      windowHeight: elementHeight + offset,
    });
    const image = canvas.toDataURL("image/png", 1.0);
    downloadImage(image, filename);
  }
  catch (error) {
    throw error;
  }
}

function Invoice() {
  return <Dialog open={true} onOpenChange={() => { }} >
    <DialogContent className="max-w-3xl max-h-[80vh] overflow-y-auto">
      {/* header */}
      <div className="bg-mainColor/15 p-4 flex items-center justify-between">
        <h2 className="text-lg font-semibold">Invoice</h2>
      </div>

      {/* transaction summary */}
      <div className="">
        {/* left content */}
        {/* right content */}
      </div>
    </DialogContent>
  </Dialog>
}

const statusMapping = {
  3: "Menunggu Pembayaran",
  4: "Sudah DiBayar",
  5: "Selesai",
  6: "Dikerjakan Kembali"
};

// Updated Transaction interface
interface Transaction {
  id: string;
  trxNumber: string;
  customerId: string;
  branchId: string;
  totalPrice: number;
  discountPrice: number;
  promoPrice: number;
  finalPrice: number;
  trxDate: string;
  status: number;
  assigns: string[]; // Array of user IDs for cleaning staff
  blowers: string[]; // Array of user IDs for blower staff
  details: TransactionItem[];
}

// Customer interface
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

// Transaction Detail interface
interface TransactionItem {
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

// Staff interface
interface Staff {
  id: string;
  fullname: string;
  username: string;
}

// Location interface
export interface LocationData {
  id: string;
  paramKey: string;
  paramValue: string;
}



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

  const [cleaningStaffList, setCleaningStaffList] = useState<any[]>([]);
  const [blowerStaffList, setBlowerStaffList] = useState<any[]>([]);

  const [loading, setLoading] = useState(true);
  const [locationLabels, setLocationLabels] = useState({
    provinceName: "",
    cityName: "",
    districtName: "",
    subDistrictName: ""
  });

  const [spkItems, setSPKItems] = useState<SPKItem[]>([]);
  const [originalSPKItems, setOriginalSPKItems] = useState<SPKItem[]>([]);

  const [manualDiscount, setManualDiscount] = useState<number>(0);
  const [loadingPromo, setLoadingPromo] = useState(false);

  const [showInvoice, setShowInvoice] = useState(false);
  const [isDownloadInvoice, setIsDownloadInvoice] = useState(false);

  const handleDownloadInvoice = () => {
    try {
      const invoiceElement = document.getElementById("invoice");
      if (invoiceElement) {
        setIsDownloadInvoice(true);
        exportAsImage(invoiceElement, `Invoice-${transaction?.trxNumber}.png`)
          .then(() => {
            setIsDownloadInvoice(false);
          })
          .catch((error) => {
            console.error("Error exporting invoice:", error);
            setIsDownloadInvoice(false);
          });
      } else {
        toast({
          title: "Error",
          description: "Element invoice tidak ditemukan.",
          variant: "destructive",
        });
      }
    } catch (error) {
      console.error("Error downloading invoice:", error);
      toast({
        title: "Error",
        description: "Terjadi kesalahan saat mengunduh invoice.",
        variant: "destructive",
      });
    } finally {
      setIsDownloadInvoice(false);
    }
  }


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
    const totalPrice = spkItems.reduce((sum, item) => sum + item.harga * item.jumlah, 0);
    const totalPromo = spkItems.reduce((sum, item) => {
      const promoAmount = item.promoType === "Persentase" ? (item.promo * item.harga * item.jumlah) / 100 : item.promo;
      return sum + promoAmount;
    }, 0);
    const finalPrice = totalPrice - totalPromo - manualDiscount;

    // Validasi: total pengurangan tidak boleh lebih besar dari total harga
    const totalReductions = totalPromo + manualDiscount;
    const isInvalidTotal = totalReductions > totalPrice;

    return {
      totalPrice,
      totalPromo,
      manualDiscount,
      totalReductions,
      finalPrice,
      isInvalidTotal
    };
  };
  const totals = calculateTotals();

  // Fetch transaction data
  useEffect(() => {
    const fetchTransaction = async () => {
      try {
        const result = await api.get(`/transaction/detail?trxNumber=${id}`);
        const transactionData = result.data as Transaction
        setTransaction(transactionData);

        // Fetch customer data
        if (transactionData.customerId) {
          await fetchCustomerData(transactionData.customerId);
        }

        // Fetch staff data
        if (transactionData.assigns && transactionData.assigns.length > 0) {
          await fetchStaffData(transactionData.assigns, setCleaningStaffList);
        }

        if (transactionData.blowers && transactionData.blowers.length > 0) {
          await fetchStaffData(transactionData.blowers, setBlowerStaffList);
        }


        if (transactionData?.details.length) {
          setSPKItems(formatDetailsForTable(transactionData.details));
          setOriginalSPKItems(formatDetailsForTable(transactionData.details));
        }

      } catch (error) {
        console.error("Gagal mengambil data transaksi:", error);
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchTransaction();
    }
  }, [id]);

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

  // Fetch staff data
  const fetchStaffData = async (staffIds: string[], setStaffState: Function) => {
    try {
      const staffPromises = staffIds.map(id => api.get(`/user/username/${id}`));
      const staffResults = await Promise.all(staffPromises);
      const staffData = staffResults.map(result => result.data);
      setStaffState(staffData);
    } catch (error) {
      console.error("Gagal mengambil data staff:", error);
      setStaffState([]);
    }
  };

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
      { key: "totalHarga", label: "Total Harga" },
      { key: "promo", label: "Promo" },
    ];

    if (!IS_CANCELLED) {
      columns.push({ key: "menu", label: "Actions" });
    }

    return columns;
  }, [transaction]);

  // Format transaction details for table
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
      promo: detail.promoPrice,
      id: detail.id,
    }));
  };

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

  // handleEditSPKItem function
  const handleEditSPKItem = (item: SPKItem) => {
    setFormDataTable({
      category: item.kategoriCode,
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

  const handleAddSPKItem = () => {
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
      // Mode edit - update existing item
      const selectedService = services.find(service => service.serviceCode === formDataTable.serviceCode);

      setSPKItems(prev => prev.map(item =>
        item.id === editMode
          ? {
            ...item,
            kode: formDataTable.serviceCode,
            layanan: selectedService?.serviceName || formDataTable.serviceCode,
            kategori: catLayananMapping[formDataTable.category] || formDataTable.category,
            kategoriCode: formDataTable.category,
            jumlah: quantity,
            satuan: selectedService?.unit || "PCS",
            harga: formDataTable.harga,
            promo: formDataTable.promo,
            tipe: formDataTable.tipe,
            promoCode: formDataTable.promoCode,
            promoType: formDataTable.promoType
          }
          : item
      ));

      toast({
        title: "Berhasil",
        description: "Item SPK berhasil diperbarui",
        variant: "default",
      });
    } else {
      // Mode tambah - add new item
      const newId = Date.now().toString();
      const selectedService = services.find(service => service.serviceCode === formDataTable.serviceCode);

      const newItem = {
        id: newId,
        kode: formDataTable.serviceCode,
        layanan: selectedService?.serviceName || formDataTable.serviceCode,
        kategori: catLayananMapping[formDataTable.category] || formDataTable.category,
        kategoriCode: formDataTable.category,
        jumlah: quantity,
        satuan: selectedService?.unit || "PCS",
        harga: formDataTable.harga,
        promo: formDataTable.promo,
        tipe: formDataTable.tipe,
        promoCode: formDataTable.promoCode,
        promoType: formDataTable.promoType,
        totalHarga: totalHargaSebelumPromo
      };

      setSPKItems(prev => {
        return [...prev, newItem];
      });

      setTransaction(prev => {
        if (!prev) return null;

        return {
          ...prev,
          totalPrice: prev.totalPrice + totalHargaSebelumPromo - formDataTable.promo,
          promoPrice: prev.promoPrice + formDataTable.promo,
          finalPrice: prev.finalPrice + totalHargaSebelumPromo - formDataTable.promo
        };
      });

      toast({
        title: "Berhasil",
        description: "Item SPK berhasil ditambahkan",
        variant: "default",
      });
    }

    resetFormDialog();
    setOpenDialog(false);
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
    setTransaction(prev => {
      if (!prev) return null;

      // Update blowerStaff with selected staff IDs
      return {
        ...prev,
        blowerStaff: selectedStaffIds
      };
    });
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
        newData.promoCode = "";
        newData.promoType = "";
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

      if ((field === "serviceCode" || field === "jumlah") &&
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

  // Function untuk menghapus SPK item
  const handleDeleteSPKItem = (id: string) => {
    setSPKItems(prev => prev.filter(item => item.id !== id));
    toast({
      title: "Berhasil",
      description: "Item SPK berhasil dihapus",
      variant: "default",
    });
  };

  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault();

    // Validasi dasar
    if (spkItems.length === 0) {
      toast({
        title: "Peringatan",
        description: "Harap tambahkan minimal satu item SPK",
        variant: "destructive",
      });
      return;
    }

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
      discountPrice: totals.totalReductions, // Total promo + diskon manual
      trxDate: transaction?.trxDate ? new Date(transaction?.trxDate).toISOString() : "",
      assigns: transaction?.assigns,
      blowers: transaction?.blowers,
    };

    const deletedItems = originalSPKItems.filter(item => !spkItems.some(i => i.id === item.id));
    const changedItems = spkItems.filter(item => {
      const originalItem = originalSPKItems.find(i => i.id === item.id);
      return originalItem && (
        originalItem.kode !== item.kode ||
        originalItem.layanan !== item.layanan ||
        originalItem.kategori !== item.kategori ||
        originalItem.jumlah !== item.jumlah ||
        originalItem.satuan !== item.satuan ||
        originalItem.harga !== item.harga ||
        originalItem.promo !== item.promo ||
        originalItem.tipe !== item.tipe ||
        originalItem.promoCode !== item.promoCode ||
        originalItem.promoType !== item.promoType
      );
    });

    const newItems = spkItems.filter(item => !originalSPKItems.some(i => i.id === item.id));

    try {
      await api.put(`/transaction/${transaction?.id}/update`, updateData);

      if (deletedItems.length > 0) {
        deletedItems.forEach(async (item) => {
          await api.delete(`/transaction-detail/${transaction?.id}/${item.id}`);
        });
      }

      if (newItems.length > 0) {
        newItems.forEach(async (item) => {
          const payload = {
            serviceCategory: item.kategoriCode,
            serviceCode: item.kode,
            serviceType: item.tipe === "vakum" ? 1 : 2,
            servicePrice: item.harga,
            promoCode: item.promoCode,
            promoType: item.promoType || "Nominal",
            promoAmount: item.promo,
            quantity: item.jumlah,
          }

          console.log("Creating new item:", payload, spkItems);


          await api.post(`/transaction-detail/${transaction?.id}/`, payload);
        });
      }

      if (changedItems.length > 0) {
        changedItems.forEach(async (item) => {
          const payload = {
            serviceCategory: item.kategoriCode,
            serviceCode: item.layanan,
            serviceType: item.tipe === "vakum" ? 1 : 2,
            servicePrice: item.harga,
            promoCode: item.promoCode,
            promoType: item.promoType,
            promoAmount: item.promo,
            quantity: item.jumlah,
          }

          // delete first and then create new
          await api.delete(`/transaction-detail/${transaction?.id}/${item.id}`);
          await api.post(`/transaction-detail/${transaction?.id}/`, payload);
        });
      }

      toast({
        title: "Berhasil",
        description: "SPK berhasil diupdate!",
        variant: "default",
      });
      // router.push("/transaksi/spk");
    } catch (error: any) {
      console.error("Error response:", error.response?.data || error.message);
      toast({
        title: "Gagal",
        description: "Terjadi kesalahan saat menambahkan SPK.",
        variant: "destructive",
      });
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

  return (
    <>
      <Breadcrumbs label={`Ubah SPK`} />
      <Wrapper>
        <Tabs defaultValue="foto" className="-mt-2">
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
                      {/* <MultiSelect
                                                staffList={cleaningStaffList}
                                                selected={transaction?.assigns || []}
                                                onSelectionChange={handleCleaningStaffChange}
                                                placeholder="Pilih petugas cleaning"
                                                loading={loadingCleaningStaff}
                                            /> */}
                      <Textarea
                        disabled
                        className="resize-none"
                        value={cleaningStaffList.map(staff => staff.fullname).join(", ") || "-"}
                        rows={2}
                      />
                    </div>

                    <div className="flex items-center space-x-4">
                      <Label className="w-[40%] font-semibold">Tanggal Transaksi</Label>
                      <Input disabled value={formatDate(transaction?.trxDate as string)} />
                    </div>
                  </div>

                  {/* Kolom Kanan */}
                  <div className="col-span-1 space-y-4">
                    <div className="flex items-center space-x-4">
                      <Label className="w-[40%] font-semibold">Petugas Blower</Label>
                      {/* <MultiSelect
                                                staffList={blowerStaffList}
                                                selected={formData.blowerStaff}
                                                onSelectionChange={handleBlowerStaffChange}
                                                placeholder="Pilih petugas blower"
                                                loading={loadingBlowerStaff}
                                            /> */}
                      <Textarea
                        disabled
                        className="resize-none"
                        value={blowerStaffList.map(staff => staff.fullname).join(", ") || "-"}
                        rows={2}
                      />
                    </div>
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
                  onEdit={handleEditSPKItem}
                  onDelete={handleDeleteSPKItem}
                />
              </div>

              {/* SUMMARY SECTION */}
              <div className="grid grid-cols-2 gap-20 mt-5">
                {/* Kolom Kiri */}
                <div className="col-span-1 space-y-4"></div>

                {/* Kolom Kanan */}
                <div className="col-span-1 space-y-4">
                  <div className="flex items-center space-x-4">
                    <Label className="w-[40%] font-semibold">Total Harga</Label>
                    <Input className="text-right" disabled value={formatRupiah(totals.totalPrice)} />
                  </div>

                  <div className="flex items-center space-x-4">
                    <Label className="w-[40%] font-semibold">Promo</Label>
                    <Input className="text-right" disabled value={formatRupiah(totals.totalPromo)} />
                  </div>

                  {!IS_CANCELLED && (
                    <div className="flex items-center space-x-4">
                      <Label className="w-[40%] font-semibold">Diskon</Label>
                      <RupiahInput
                        placeholder="Rp. 0"
                        value={formatRupiah(manualDiscount)}
                        onValueChange={(e) => {
                          if (e > (transaction?.finalPrice as number)) {
                            toast({
                              title: "Peringatan",
                              description: "Diskon manual tidak boleh lebih besar dari total akhir",
                              variant: "destructive",
                            });

                            setManualDiscount((transaction?.finalPrice as number) || 0);
                          } else {
                            setManualDiscount(e);
                          }
                        }}
                        className="text-right"
                      />
                    </div>
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
                      disabled={totals.isInvalidTotal}
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
            <div className="space-y-8">
              <div className="flex justify-between items-center px-2">
                <h3 className="text-lg font-semibold !text-mainDark dark:!text-mainColor">Bukti Pembayaran</h3>
                <Button
                  onClick={() => { setShowInvoice(true) }}
                  variant="main"
                  size="default"
                  // disabled={historyLoading}
                >
                  Download Invoice
                </Button>
              </div>

              <div className="mb-8">
                {/* foto bukti transfer */}
                <div className="flex flex-1">
                  <div className="mr-8 flex flex-1">
                    <AttachmentImage
                      // src={"https://placehold.co/400x500"}
                      className="object-cover w-full h-full min-w-[400px] mr-4"
                      width={200}
                      height={200}
                      label="Foto Bukti Transfer"
                    />
                  </div>

                  <div className="flex-[3] flex flex-col ">
                    {/* ratings */}
                    <div className="flex items-center space-x-2 mb-4">
                      <Label className="w-[40%] font-semibold">Rating</Label>
                      <div className="flex items-center space-x-1">
                        {/* create placeholder stars */}
                        <div className="flex space-x-1">
                          <StarRating
                            totalStars={5}
                            initialSelected={2}
                            onChange={(index) => console.log(index)}
                          />
                        </div>
                      </div>
                    </div>

                    {/* payment date */}
                    {/* todo: dummy random */}
                    {true && (
                      <div className="flex items-center space-x-2 mb-4">
                        <Label className="w-[40%] font-semibold">Tanggal Pembayaran</Label>
                        <div className="flex items-center space-x-1">
                          {/* create placeholder stars */}
                          <div className="flex space-x-1">
                            22/03/2025
                          </div>
                        </div>
                      </div>
                    )}

                    {/* Remarks */}
                    <div className="flex flex-1 justify-center space-x-2">
                      <Label className="w-[40%] font-semibold">Catatan</Label>
                      <div className="flex-1 flex">
                        <Textarea
                          // value={transaction?.remarks}
                          onChange={(e) => setTransaction(prev => {
                            if (!prev) return null;
                            return { ...prev, remarks: e.target.value };
                          })}
                          className="flex flex-1"
                          placeholder="Tulis catatan untuk transaksi ini"
                        />
                      </div>
                    </div>
                  </div>
                </div>

                {/* rating and remarks */}
                <div className=""></div>
              </div>

              <div className="flex justify-between items-center px-2">
                <h3 className="text-lg font-semibold !text-mainDark dark:!text-mainColor">Bukti Pengerjaan</h3>
              </div>

              {/* list bukti pengerjaan per product */}
              <div className="flex flex-col gap-4">
                {[1, 2, 4].map((item, index) => (
                  <div className="flex" key={index}>
                    {/* before */}
                    <div className="flex-1 flex flex-col mr-4 overflow-x-auto">
                      <h3 className="px-1 font-semibold">{`${index + 1} - Product 1`}</h3>
                      <p className="mt-4 font-semibold text-gray-500">Foto Sebelum</p>

                      {/* 3 product photos */}
                      <div className="flex mt-2">
                        <AttachmentImage
                          src="https://placehold.co/400x500"
                          className="flex-1 aspect-square min-w-[200px] mr-6"
                          label="Foto Depan"
                          width={200}
                          height={200}
                        />

                        <AttachmentImage
                          // src="https://placehold.co/400x500"
                          className="flex-1 aspect-square min-w-[200px] mr-6 "
                          label="Foto Samping"
                        />

                        <AttachmentImage
                          // src="https://placehold.co/400x500"
                          className="flex-1 aspect-square min-w-[200px] mr-6"
                          width={200}
                          height={200}
                          label="Foto Detail"
                        />
                      </div>

                    </div>

                    {/* divider */}
                    <div className="w-0 border-l mx-4"></div>


                    {/* after */}
                    <div className="flex-1 flex flex-col mr-4 overflow-x-auto">
                      <h3 className="px-1 font-semibold">{`${index + 1} - Product 1`}</h3>
                      <p className="mt-4 font-semibold text-gray-500">Foto Sebelum</p>

                      {/* 3 product photos */}
                      <div className="flex mt-2">
                        <AttachmentImage
                          src="https://placehold.co/400x500"
                          className="flex-1 aspect-square min-w-[200px] mr-6"
                          label="Foto Depan"
                          width={200}
                          height={200}
                        />

                        <AttachmentImage
                          // src="https://placehold.co/400x500"
                          className="flex-1 aspect-square min-w-[200px] mr-6 "
                          label="Foto Samping"
                        />

                        <AttachmentImage
                          // src="https://placehold.co/400x500"
                          className="flex-1 aspect-square min-w-[200px] mr-6"
                          width={200}
                          height={200}
                          label="Foto Detail"
                        />
                      </div>

                    </div>
                  </div>
                ))}
              </div>

              {/*  */}
              <div className=""></div>
            </div>
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
            <Header label={editMode ? "Edit SPK Item" : "Tambah SPK Baru"} />
          </>
        }
      >
        <div className="mx-2">
          <div className="space-y-4">
            <div className="flex items-center space-x-4">
              <Label htmlFor="category" className="w-1/4">
                Kategori
              </Label>
              <Select
                onValueChange={(value) => handleChangeTable("category", value)}
                value={formDataTable.category}
                disabled={loadingParams}
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
                disabled={loadingServices || !formDataTable.category || formDataTable.category === ""}
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
                value={formatRupiah(formDataTable.harga)}
                onValueChange={(value) => handleChangeTable("harga", value)}
              />
            </div>

            <div className="flex items-center space-x-4">
              <Label htmlFor="promo" className="w-1/4 font-semibold">Promo</Label>
              <div className="flex items-center space-x-2 w-full">
                <div className="relative flex-1">
                  <Input
                    value={formatRupiah(formDataTable.promoType === 'Persentase' ? formDataTable.promo * formDataTable.harga * Number(formDataTable.jumlah) / 100 : formDataTable.promo)}
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
                {/* <Button
                                        type="button"
                                        variant="outline"
                                        size="sm"
                                        onClick={handleCheckPromo}
                                        disabled={loadingPromo || !formDataTable.serviceCode || !formDataTable.jumlah}
                                        className="px-3 py-1 h-10 whitespace-nowrap"
                                    >
                                        Cek Promo
                                    </Button> */}
              </div>
            </div>

            <div className="flex items-center space-x-4">
              <Label htmlFor="subtotal" className="w-1/4 font-bold text-lg">Subtotal</Label>
              <RupiahInput
                placeholder="Rp. 0"
                value={formatRupiah(
                  (Number(formDataTable.harga) || 0) * (Number(formDataTable.jumlah) || 1) - (Number(formDataTable.promoType === "Persentase" ? formDataTable.promo * formDataTable.harga * Number(formDataTable.jumlah) / 100 : formDataTable.promo) || 0)
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
            disabled={!formDataTable.category || !formDataTable.serviceCode || !formDataTable.jumlah || !formDataTable.harga}
            variant="main"
            onClick={handleAddSPKItem}
          >
            {editMode ? "Perbarui" : "Tambah"}
          </Button>
        </div>
      </DialogWrapper>


      {/* center using flex */}
      {showInvoice && (
        <>
          <div className="absolute top-0 left-0 w-full h-full z-[200]" >
            <div className="invoice-container flex items-center justify-center min-h-screen bg-gray-200/60 dark:bg-gray-800/60 " onClick={(e) => {
              if (e.target === e.currentTarget) {
                setShowInvoice(false);
              }
            }}>
              <div id="invoice" className="invoice w-5/6 min-w-xl h-screen overflow-auto">
                {/* header */}
                <div className="bg-mainColor p-4 flex items-center justify-between rounded-t-lg">
                  <h2 className="font-semibold text-mainDark">Invoice</h2>
                </div>

                <div className="bg-white text-black px-4">
                  {/* transaction summary */}
                  <div className="flex space-x-8">
                    {/* left content */}
                    <div className="flex-1 p-4">
                      <div className="flex mb-5 items-center space-x-4">
                        <p className="flex-1 font-semibold">No Transaksi</p>
                        <p className="font-semibold">:</p>
                        <p className="flex-1 font-light">{transaction?.trxNumber}</p>
                      </div>

                      <div className="flex mb-5 items-center space-x-4">
                        <p className="flex-1 font-semibold">No Whatsapp</p>
                        <p className="font-semibold">:</p>
                        <p className="flex-1 font-light">{customer?.noWhatsapp}</p>
                      </div>

                      <div className="flex mb-5 items-center space-x-4">
                        <p className="flex-1 font-semibold">Nama Pelanggan</p>
                        <p className="font-semibold">:</p>
                        <p className="flex-1 font-light">{customer?.fullname}</p>
                      </div>

                      <div className="flex mb-5 justify-start space-x-4">
                        <p className="flex-1 font-semibold">Alamat</p>
                        <p className="font-semibold">:</p>
                        <p className="flex-1 font-light">{customer?.address}</p>
                      </div>
                    </div>

                    {/* right content */}
                    <div className="flex-1 p-4">
                      <div className="flex mb-5 items-center space-x-4">
                        <p className="flex-1 font-semibold">Provinsi</p>
                        <p className="font-semibold">:</p>
                        <p className="flex-1 font-light">{customer?.province}</p>
                      </div>

                      <div className="flex mb-5 items-center space-x-4">
                        <p className="flex-1 font-semibold">Kab/Kota</p>
                        <p className="font-semibold">:</p>
                        <p className="flex-1 font-light">{customer?.city}</p>
                      </div>

                      <div className="flex mb-5 items-center space-x-4">
                        <p className="flex-1 font-semibold">Kecamatan</p>
                        <p className="font-semibold">:</p>
                        <p className="flex-1 font-light">{customer?.district}</p>
                      </div>

                      <div className="flex mb-5 justify-start space-x-4">
                        <p className="flex-1 font-semibold">Kelurahan</p>
                        <p className="font-semibold">:</p>
                        <p className="flex-1 font-light">{customer?.subDistrict}</p>
                      </div>
                    </div>
                  </div>

                  {/* divider */}
                  <div className="w-full border-t my-4"></div>

                  {/* cleaning / blower */}

                  <div className="flex space-x-8">
                    {/* left content */}
                    <div className="flex-1 p-4">
                      <div className="flex mb-5 items-center space-x-4 justify-start">
                        <p className="flex-1 font-semibold ">Petugas Cleaning</p>
                        <p className="font-semibold">:</p>
                        <div className="flex-1 flex ">
                          {/* cleaning list */}
                          {cleaningStaffList.length > 0 ? (
                            cleaningStaffList.map((staff) => (
                              <div key={staff.id} className="bg-mainColor/15 px-4 py-1 mx-1 rounded-full flex justify-center items-center text-center">
                                {staff.fullname}
                              </div>
                            ))
                          ) : (
                            <p className="text-gray-500">Tidak ada petugas cleaning</p>
                          )}
                        </div>
                      </div>

                      <div className="flex mb-5 items-center space-x-4">
                        <p className="flex-1 font-semibold">Tanggal Transaksi</p>
                        <p className="font-semibold">:</p>
                        <p className="flex-1 font-light">{transaction?.trxDate ? <>{formatDate(transaction.trxDate)}</> : <span className="text-gray-500">Tidak ada tanggal</span>}</p>
                      </div>
                    </div>

                    {/* right content */}
                    <div className="flex-1 p-4">
                      <div className="flex mb-5 items-center space-x-4 justify-start">
                        <p className="flex-1 font-semibold">Petugas Blower</p>
                        <p className="font-semibold">:</p>
                        <div className="flex-1 flex ">
                          {/* cleaning list */}
                          {blowerStaffList.length > 0 ? (
                            blowerStaffList.map((staff) => (
                              <div key={staff.id} className="bg-mainColor/15 flex justify-center items-center px-4 py-1 mx-1 rounded-full text-center">
                                {staff.fullname}
                              </div>
                            ))
                          ) : (
                            <p className="text-gray-500">Tidak ada petugas blower</p>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* divider */}
                  <div className="w-full border-t my-4"></div>

                  {/* transaction items */}
                  <div className="transaction-items-table w-full">
                    {/* header */}
                    <div className="flex w-full rounded-t-md px-2 bg-mainColor/40">
                      <div className="flex w-6 p-2 mx-1 py-4 text-baseDark/70 font-semibold">#</div>
                      <div className="flex-[3] p-2 mx-1 py-4 text-baseDark/70 font-semibold">Kode</div>
                      <div className="flex-1 p-2 mx-1 py-4 text-baseDark/70 font-semibold">Layanan</div>
                      <div className="flex-1 p-2 mx-1 py-4 text-baseDark/70 font-semibold">kategori</div>
                      <div className="flex-1 p-2 mx-1 py-4 text-baseDark/70 font-semibold">Jumlah</div>
                      <div className="flex-1 p-2 mx-1 py-4 text-baseDark/70 font-semibold">Satuan</div>
                      <div className="flex-1 p-2 mx-1 py-4 text-baseDark/70 font-semibold">Harga</div>
                      <div className="flex-1 p-2 mx-1 py-4 text-baseDark/70 font-semibold">Promo</div>
                    </div>


                    <div className="flex w-full px-2">
                      <div className="flex w-6 p-2 mx-1 py-4 text-gray-500">1</div>
                      <div className="flex-[3] p-2 mx-1 py-4 text-gray-500">TRX-001</div>
                      <div className="flex-1 p-2 mx-1 py-4 text-gray-500">Jam</div>
                      <div className="flex-1 p-2 mx-1 py-4 text-gray-500">Blower</div>
                      <div className="flex-1 p-2 mx-1 py-4 text-gray-500">2</div>
                      <div className="flex-1 p-2 mx-1 py-4 text-gray-500">Kg</div>
                      <div className="flex-1 p-2 mx-1 py-4 text-gray-500">Rp. 25.000</div>
                      <div className="flex-1 p-2 mx-1 py-4 text-gray-500">Rp. 5.000</div>
                    </div>

                    <div className="flex w-full px-2">
                      <div className="flex w-6 p-2 mx-1 py-4 text-gray-500">1</div>
                      <div className="flex-[3] p-2 mx-1 py-4 text-gray-500">TRX-001</div>
                      <div className="flex-1 p-2 mx-1 py-4 text-gray-500">Jam</div>
                      <div className="flex-1 p-2 mx-1 py-4 text-gray-500">Blower</div>
                      <div className="flex-1 p-2 mx-1 py-4 text-gray-500">2</div>
                      <div className="flex-1 p-2 mx-1 py-4 text-gray-500">Kg</div>
                      <div className="flex-1 p-2 mx-1 py-4 text-gray-500">Rp. 25.000</div>
                      <div className="flex-1 p-2 mx-1 py-4 text-gray-500">Rp. 5.000</div>
                    </div>

                    <div className="flex w-full px-2">
                      <div className="flex w-6 p-2 mx-1 py-4 text-gray-500">1</div>
                      <div className="flex-[3] p-2 mx-1 py-4 text-gray-500">TRX-001</div>
                      <div className="flex-1 p-2 mx-1 py-4 text-gray-500">Jam</div>
                      <div className="flex-1 p-2 mx-1 py-4 text-gray-500">Blower</div>
                      <div className="flex-1 p-2 mx-1 py-4 text-gray-500">2</div>
                      <div className="flex-1 p-2 mx-1 py-4 text-gray-500">Kg</div>
                      <div className="flex-1 p-2 mx-1 py-4 text-gray-500">Rp. 25.000</div>
                      <div className="flex-1 p-2 mx-1 py-4 text-gray-500">Rp. 5.000</div>
                    </div>

                    <div className="flex w-full px-2">
                      <div className="flex w-6 p-2 mx-1 py-4 text-gray-500">1</div>
                      <div className="flex-[3] p-2 mx-1 py-4 text-gray-500">TRX-001</div>
                      <div className="flex-1 p-2 mx-1 py-4 text-gray-500">Jam</div>
                      <div className="flex-1 p-2 mx-1 py-4 text-gray-500">Blower</div>
                      <div className="flex-1 p-2 mx-1 py-4 text-gray-500">2</div>
                      <div className="flex-1 p-2 mx-1 py-4 text-gray-500">Kg</div>
                      <div className="flex-1 p-2 mx-1 py-4 text-gray-500">Rp. 25.000</div>
                      <div className="flex-1 p-2 mx-1 py-4 text-gray-500">Rp. 5.000</div>
                    </div>

                    <div className="flex w-full px-2">
                      <div className="flex w-6 p-2 mx-1 py-4 text-gray-500">1</div>
                      <div className="flex-[3] p-2 mx-1 py-4 text-gray-500">TRX-001</div>
                      <div className="flex-1 p-2 mx-1 py-4 text-gray-500">Jam</div>
                      <div className="flex-1 p-2 mx-1 py-4 text-gray-500">Blower</div>
                      <div className="flex-1 p-2 mx-1 py-4 text-gray-500">2</div>
                      <div className="flex-1 p-2 mx-1 py-4 text-gray-500">Kg</div>
                      <div className="flex-1 p-2 mx-1 py-4 text-gray-500">Rp. 25.000</div>
                      <div className="flex-1 p-2 mx-1 py-4 text-gray-500">Rp. 5.000</div>
                    </div>

                    {spkItems.map((item, index) => (
                      <div key={item.id} className="flex w-full px-2 items-center">
                        <div className="flex w-6 p-2 mx-1 py-4 text-gray-500">{index + 1}</div>
                        <div className="flex-[3] p-2 mx-1 py-4 text-gray-500">{item.kode}</div>
                        <div className="flex-1 p-2 mx-1 py-4 text-gray-500">{item.layanan}</div>
                        <div className="flex-1 p-2 mx-1 py-4 text-gray-500">{item.kategori}</div>
                        <div className="flex-1 p-2 mx-1 py-4 text-gray-500">{item.jumlah}</div>
                        <div className="flex-1 p-2 mx-1 py-4 text-gray-500">{item.satuan}</div>
                        <div className="flex-1 p-2 mx-1 py-4 text-gray-500">Rp. {item.harga.toLocaleString()}</div>
                        <div className="flex-1 p-2 mx-1 py-4 text-gray-500">Rp. {item.promo.toLocaleString()}</div>
                      </div>
                    ))}
                  </div>

                  {/* divider */}
                  <div className="w-full border-t my-4"></div>

                  {/* footer */}
                  <div className="flex items-center p-4">
                    {/* left content - logo and payment */}
                    <div className="flex-1 flex items-center space-x-4">
                      <img src="/assets/image.png" alt="Logo" width={200} height={100} />
                      <div className="">
                        <p className="font-semibold">Nama Rekening & No Rekening</p>
                        <p className=" text-gray-600 mb-4">a/n Superclean - 1234567890</p>

                        <p className="font-semibold">No Whatsapp</p>
                        <p className=" text-gray-600">08123456789</p>
                      </div>

                    </div>

                    {/* right content - total price and promos */}
                    <div className="flex-1 flex flex-col">
                      <div className="flex my-3 px-1 items-center justify-between">
                        <p className="flex-1 font-semibold">Total Harga</p>
                        <p className="font-normal">{formatRupiah(totals.totalPrice)}</p>
                      </div>

                      <div className="flex my-3 px-1 items-center justify-between">
                        <p className="flex-1 font-semibold">Promo</p>
                        <p className="font-normal">{formatRupiah(totals.totalPromo)}</p>
                      </div>

                      <div className="flex my-3 px-1 items-center justify-between">
                        <p className="flex-1 font-semibold">Diskon</p>
                        <p className="font-normal">{formatRupiah(totals.manualDiscount)}</p>
                      </div>

                      <div className="flex my-4 items-center justify-between p-2 bg-gray-100 rounded-lg">
                        <p className="flex-1 text-lg font-bold">Total Akhir</p>
                        <p className="font-bold text-lg">{formatRupiah(totals.finalPrice)}</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* download button */}
            <div className="relative">
              <div className="fixed bottom-0 right-0">
                <Button
                  className="m-4"
                  loading={isDownloadInvoice}
                  onClick={() => {
                    handleDownloadInvoice()
                  }}
                >
                  Download Invoice
                </Button>
              </div>
            </div>
          </div>
        </>
      )}
    </>
  );
}
