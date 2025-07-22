"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Wrapper } from "@shared/components/Wrapper";
import { Breadcrumbs } from "@shared/components/ui/Breadcrumbs";
import { Input } from "libs/ui-components/src/components/ui/input";
import { Label } from "libs/ui-components/src/components/ui/label";
import { Button } from "libs/ui-components/src/components/ui/button";
import { Textarea } from "libs/ui-components/src/components/ui/textarea";
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem, SelectGroup, SelectLabel } from "libs/ui-components/src/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "libs/ui-components/src/components/ui/tabs";
import { useToast } from "libs/ui-components/src/hooks/use-toast";
import { api } from "libs/utils/apiClient";
import { useLocationData } from "@shared/utils/useLocationData";
import { PiWarningCircleFill } from "react-icons/pi";
import { LuPlus } from "react-icons/lu";
import MultiSelect from "libs/ui-components/src/components/multi-select";
import { formatDateInput } from "libs/utils/formatDate";
import { SPKTableDetail } from "libs/ui-components/src/components/spk-table-detail";
import { DialogWrapper } from "libs/ui-components/src/components/dialog-wrapper";
import { formatRupiah } from "libs/utils/formatRupiah";
import { useCategoryStore, useServiceLookup } from "libs/utils/useCategoryStore";
import { RupiahInput } from "@ui-components/components/rupiah-input";
import { RadioGroup, RadioGroupItem } from "@ui-components/components/ui/radio-group";
import { Header } from "@shared/components/Header";
import { Check, ChevronsUpDown, Cross, Plus, PlusCircle, Search, AlertTriangle } from "lucide-react";
import { DatePicker } from "@ui-components/components/date-picker";

// Interface untuk SPK Item (tanpa total)
export interface SPKItem {
    id: string;
    kode: string;
    layanan: string;
    kategori: string;
    kategoriCode: string;
    jumlah: number;
    satuan: string;
    harga: number;
    promo: number;
    tipe?: string;
    promoCode?: string;
    promoType?: string;
}

// Interface untuk promo response
export interface PromoResponse {
    amount: number;
    code: string;
    type: string;
}

// Header table tanpa kolom total
const DataHeaderSPKDetail = [
    { key: "no", label: "#" },
    { key: "kode", label: "Kode Service" },
    { key: "layanan", label: "Layanan" },
    { key: "kategori", label: "Kategori" },
    { key: "jumlah", label: "Jumlah" },
    { key: "satuan", label: "Satuan" },
    { key: "harga", label: "Harga Satuan" },
    { key: "totalHarga", label: "Total Harga" },
    { key: "promo", label: "Promo" },
    { key: "menu", label: "Aksi" }
];

// Searchable Combobox Component untuk WhatsApp
function WhatsAppCombobox({
    value,
    onValueChange,
    onCustomerSelect,
    searchResults,
    loading,
    placeholder = "Masukkan No Whatsapp"
}: {
    value: string;
    onValueChange: (value: string) => void;
    onCustomerSelect: (customer: any) => void;
    searchResults: any[];
    loading: boolean;
    placeholder?: string;
}) {
    const [open, setOpen] = useState(false);
    const [searchQuery, setSearchQuery] = useState(value);

    useEffect(() => {
        setSearchQuery(value);
    }, [value]);

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const newValue = e.target.value;
        setSearchQuery(newValue);
        onValueChange(newValue);
        setOpen(true);
    };

    const handleSelectCustomer = (customer: any) => {
        setSearchQuery(customer.noWhatsapp);
        onCustomerSelect(customer);
        setOpen(false);
    };

    const handleClearSelection = () => {
        setSearchQuery("");
        onValueChange("");
        setOpen(false);
    };

    return (
        <div className="relative w-full">
            <div
                className={`flex h-10 w-full items-center justify-between rounded-lg border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-within:ring-1 focus-within:ring-ring cursor-text ${open ? "ring-1 ring-ring" : ""
                    }`}
                onClick={() => setOpen(true)}
            >
                <div className="flex items-center gap-2 flex-1">
                    <Search className="h-4 w-4 text-muted-foreground shrink-0" />
                    <input
                        type="text"
                        placeholder={placeholder}
                        value={searchQuery}
                        onChange={handleInputChange}
                        onFocus={() => setOpen(true)}
                        className="bg-transparent border-none outline-none flex-1 placeholder:text-muted-foreground"
                        onClick={(e) => e.stopPropagation()}
                    />
                </div>
            </div>

            {open && (
                <div className="absolute top-full z-50 mt-1 w-full rounded-md border bg-popover text-popover-foreground shadow-lg">
                    <div className="max-h-[300px] overflow-y-auto no-scrollbar">
                        {loading && (
                            <div className="px-2 py-6 text-center text-sm text-muted-foreground">
                                Loading...
                            </div>
                        )}
                        {!loading && searchQuery.trim().length < 3 && (
                            <div className="px-2 py-4 text-center text-sm text-muted-foreground">
                                <div className="flex items-center gap-2 justify-center">
                                    <Search size={18} />
                                    Masukkan minimal 3 karakter
                                </div>
                            </div>
                        )}
                        {!loading && searchQuery.trim().length >= 3 && searchResults.length === 0 && (
                            <div className="px-2 py-6 text-center text-sm text-muted-foreground">
                                Tidak ditemukan
                            </div>
                        )}
                        {searchResults.map((customer) => (
                            <div
                                key={customer.id}
                                className="relative flex cursor-pointer select-none border-b flex-col rounded-sm px-2 py-2 text-sm outline-none hover:bg-baseLight dark:hover:bg-baseDark hover:text-accent-foreground"
                                onClick={() => handleSelectCustomer(customer)}
                            >
                                <div className="flex items-center gap-2">
                                    <Check
                                        className={`h-4 w-4 ${value === customer.noWhatsapp ? "opacity-100" : "opacity-0"
                                            }`}
                                    />
                                    <div className="flex-1">
                                        <p className="font-medium">{customer.fullname} - {customer.noWhatsapp}</p>
                                        <p className="text-xs text-muted-foreground">{customer.address}</p>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            )}

            {searchQuery ? (
                <button
                    onClick={handleClearSelection}
                    className="absolute right-3 top-1/2 rotate-45 -translate-y-1/2 h-4 w-4 rounded-full bg-muted-foreground/20 hover:bg-muted-foreground/40 flex items-center justify-center text-xs"
                    type="button"
                >
                    <Plus className="opacity-50" />
                </button>
            ) : (
                <button
                    className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 rounded-full flex items-center justify-center text-xs"
                    type="button"
                >
                    <ChevronsUpDown className="opacity-50" />
                </button>
            )}

            {open && (
                <div
                    className="fixed inset-0 z-40"
                    onClick={() => setOpen(false)}
                />
            )}
        </div>
    );
}

export default function NewSPK() {
    const router = useRouter();
    const { toast } = useToast();
    const [openDialog, setOpenDialog] = useState(false);
    const [searchResult, setSearchResult] = useState<any[]>([]);
    const [loading, setLoading] = useState(false);

    // State untuk SPK Items
    const [spkItems, setSPKItems] = useState<SPKItem[]>([]);

    // State untuk diskon manual
    const [manualDiscount, setManualDiscount] = useState<number>(0);

    // State untuk menyimpan data customer yang dipilih
    const [selectedCustomer, setSelectedCustomer] = useState<any>(null);

    // State untuk staff data
    const [cleaningStaffList, setCleaningStaffList] = useState<any[]>([]);
    const [blowerStaffList, setBlowerStaffList] = useState<any[]>([]);
    const [loadingCleaningStaff, setLoadingCleaningStaff] = useState(false);
    const [loadingBlowerStaff, setLoadingBlowerStaff] = useState(false);

    // State untuk loading promo
    const [loadingPromo, setLoadingPromo] = useState(false);

    // State untuk menyimpan display names dari location codes
    const [locationLabels, setLocationLabels] = useState({
        provinceName: "",
        cityName: "",
        districtName: "",
        subDistrictName: ""
    });

    type FormDataType = {
        noWhatsapp: string;
        customerName: string;
        address: string;
        province: string;
        city: string;
        district: string;
        subDistrict: string;
        cleaningStaff: string[];
        blowerStaff: string[];
        trxDate: string;
    };

    const [formData, setFormData] = useState<FormDataType>({
        noWhatsapp: "",
        customerName: "",
        address: "",
        province: "",
        city: "",
        district: "",
        subDistrict: "",
        cleaningStaff: [],
        blowerStaff: [],
        trxDate: formatDateInput(new Date().toISOString()),
    });

    // Hook untuk mengambil data lokasi berdasarkan customer yang dipilih
    const { provinces, cities, districts, subDistricts } = useLocationData(
        selectedCustomer?.province,
        selectedCustomer?.city,
        selectedCustomer?.district
    );

    // Effect untuk mengambil label lokasi berdasarkan customer yang dipilih
    useEffect(() => {
        if (selectedCustomer) {
            const getLocationLabel = (items: any[], code: string) => {
                const item = items.find(item => item.paramKey === code);
                return item ? item.paramValue : code;
            };

            setLocationLabels({
                provinceName: getLocationLabel(provinces, selectedCustomer.province),
                cityName: getLocationLabel(cities, selectedCustomer.city),
                districtName: getLocationLabel(districts, selectedCustomer.district),
                subDistrictName: getLocationLabel(subDistricts, selectedCustomer.subDistrict)
            });
        } else {
            setLocationLabels({
                provinceName: "",
                cityName: "",
                districtName: "",
                subDistrictName: ""
            });
        }
    }, [selectedCustomer, provinces, cities, districts, subDistricts]);

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
    };

    // Function untuk fetch promo berdasarkan serviceCode dan quantity
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

    // Function untuk manual check promo dengan toast feedback
    const handleCheckPromo = async () => {
        if (!formDataTable.serviceCode) {
            toast({
                title: "Peringatan",
                description: "Silakan pilih layanan terlebih dahulu",
                variant: "destructive",
            });
            return;
        }

        if (!formDataTable.jumlah || parseInt(formDataTable.jumlah) <= 0) {
            toast({
                title: "Peringatan",
                description: "Silakan masukkan jumlah yang valid",
                variant: "destructive",
            });
            return;
        }

        const promoData = await fetchPromo(formDataTable.serviceCode, formDataTable.jumlah);

        setFormDataTable(prev => ({
            ...prev,
            promo: promoData.amount,
            promoCode: promoData.code,
            promoType: promoData.type
        }));

        if (promoData.amount > 0) {
            toast({
                title: "Promo Ditemukan!",
                description: `Anda mendapat promo sebesar ${formatRupiah(promoData.amount)}`,
                variant: "default",
            });
        } else {
            toast({
                title: "Tidak Ada Promo",
                description: "Tidak ada promo yang tersedia untuk layanan dan jumlah ini",
                variant: "default",
            });
        }
    };

    // Effect untuk fetch staff data ketika customer berubah
    useEffect(() => {
        if (selectedCustomer?.city) {
            fetchStaffData("CLEANER", selectedCustomer.city, setCleaningStaffList, setLoadingCleaningStaff);
            fetchStaffData("BLOWER", selectedCustomer.city, setBlowerStaffList, setLoadingBlowerStaff);
        } else {
            setCleaningStaffList([]);
            setBlowerStaffList([]);
        }
    }, [selectedCustomer?.city]);

    const handleChange = (id: string, value: string | number | string[]) => {
        setFormData({ ...formData, [id]: value });
    };

    useEffect(() => {
        const delay = setTimeout(() => {
            const search = formData.noWhatsapp.trim();
            if (search.length >= 3) {
                setLoading(true);
                api.get(`/customer/page?search=${encodeURIComponent(search)}&page=1&limit=10`)
                    .then((res) => {
                        setSearchResult(res?.data[0] || []);
                    })
                    .catch(() => setSearchResult([]))
                    .finally(() => setLoading(false));
            } else {
                setSearchResult([]);
            }
        }, 500);
        return () => clearTimeout(delay);
    }, [formData.noWhatsapp]);

    const handleSelectCustomer = (customer: any) => {
        setSelectedCustomer(customer);
        setFormData(prev => ({
            ...prev,
            noWhatsapp: customer.noWhatsapp,
            customerName: customer.fullname,
            address: customer.address,
            province: customer.province,
            city: customer.city,
            district: customer.district,
            subDistrict: customer.subDistrict,
        }));
    };

    const handleCleaningStaffChange = (selectedStaffIds: string[]) => {
        setFormData(prev => ({
            ...prev,
            cleaningStaff: selectedStaffIds
        }));
    };

    const handleBlowerStaffChange = (selectedStaffIds: string[]) => {
        setFormData(prev => ({
            ...prev,
            blowerStaff: selectedStaffIds
        }));
    };

    const handleClearCustomer = () => {
        setSelectedCustomer(null);
        setFormData(prev => ({
            ...prev,
            noWhatsapp: "",
            customerName: "",
            address: "",
            province: "",
            city: "",
            district: "",
            subDistrict: "",
            cleaningStaff: [],
            blowerStaff: [],
        }));
        setCleaningStaffList([]);
        setBlowerStaffList([]);
    };

    const handleWhatsAppChange = (value: string) => {
        handleChange("noWhatsapp", value);
        if (!value.trim()) {
            handleClearCustomer();
        }
    };

    // Function untuk menghitung total dari semua SPK items (update)
    const calculateTotals = () => {
        const totalPrice = spkItems.reduce((sum, item) => sum + item.harga * item.jumlah, 0);
        const totalPromo = spkItems.reduce((sum, item) => sum + item.promo, 0);
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

    // Function untuk menghapus SPK item
    const handleDeleteSPKItem = (id: string) => {
        setSPKItems(prev => prev.filter(item => item.id !== id));
        toast({
            title: "Berhasil",
            description: "Item SPK berhasil dihapus",
            variant: "default",
        });
    };

    const handleSubmit = async (e: React.FormEvent) => {
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

        if (!selectedCustomer?.id) {
            toast({
                title: "Peringatan",
                description: "Harap pilih customer terlebih dahulu",
                variant: "destructive",
            });
            return;
        }

        if (formData.cleaningStaff.length === 0 && formData.blowerStaff.length === 0) {
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
        const submitData = {
            customerId: selectedCustomer.id,
            discountPrice: totals.totalReductions, // Total promo + diskon manual
            trxDate: new Date(formData.trxDate).toISOString(),
            assigns: formData.cleaningStaff,
            blowers: formData.blowerStaff,
            details: spkItems.map(item => ({
                serviceCategory: item.kategoriCode,
                serviceCode: item.kode,
                serviceType: item.tipe === "vakum" ? 0 : 1,
                servicePrice: item.harga,
                quantity: item.jumlah,
                promoCode: item.promoCode || "",
                promoType: item.promoType || "",
                promoAmount: item.promo
            }))
        };

        try {
            await api.post("/transaction", submitData);
            toast({
                title: "Berhasil",
                description: "SPK berhasil ditambahkan!",
                variant: "default",
            });
            router.push("/transaksi/spk");
        } catch (error: any) {
            console.error("Error response:", error.response?.data || error.message);
            toast({
                title: "Gagal",
                description: "Terjadi kesalahan saat menambahkan SPK.",
                variant: "destructive",
            });
        }
    };

    // Input Dialog Form
    const { catLayananMapping, loading: loadingParams } = useCategoryStore();

    // State untuk tracking mode edit
    const [editMode, setEditMode] = useState<string | null>(null);

    // State untuk form dialog
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

    // Hook untuk service lookup berdasarkan kategori yang dipilih
    const { services, loading: loadingServices } = useServiceLookup(formDataTable.category);

    // console.log('===========service=========================');
    // console.log(services);
    // console.log('====================================');

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

    // handleAddSPKItem function (update - tanpa total calculation)
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
                totalHarga: totalHargaSebelumPromo - formDataTable.promo
            };

            console.log(newItem);


            setSPKItems(prev => [...prev, newItem]);

            toast({
                title: "Berhasil",
                description: "Item SPK berhasil ditambahkan",
                variant: "default",
            });
        }

        resetFormDialog();
        setOpenDialog(false);
    };

    return (
        <>
            <Breadcrumbs label="Tambah SPK" />
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
                            <form onSubmit={handleSubmit}>
                                <div className="grid grid-cols-2 gap-20">
                                    <div className="col-span-1 space-y-4">
                                        {/* WhatsApp Combobox */}
                                        <div className="flex items-center space-x-4">
                                            <Label className="w-[40%] font-semibold">No Whatsapp</Label>
                                            <WhatsAppCombobox
                                                value={formData.noWhatsapp}
                                                onValueChange={handleWhatsAppChange}
                                                onCustomerSelect={handleSelectCustomer}
                                                searchResults={searchResult}
                                                loading={loading}
                                                placeholder="Masukkan No Whatsapp"
                                            />
                                        </div>

                                        {/* Nama Pelanggan - View Only */}
                                        <div className="flex items-center space-x-4">
                                            <Label className="w-[40%] font-semibold">Nama Pelanggan</Label>
                                            <Input
                                                id="customerName"
                                                value={formData.customerName}
                                                placeholder="Nama Pelanggan akan terisi otomatis"
                                                readOnly
                                                className="bg-muted/50 cursor-not-allowed"
                                            />
                                        </div>

                                        {/* Alamat - View Only */}
                                        <div className="flex items-center space-x-4">
                                            <Label className="w-[40%] font-semibold">Alamat</Label>
                                            <Textarea
                                                id="address"
                                                value={formData.address}
                                                placeholder="Alamat akan terisi otomatis"
                                                rows={4}
                                                className="resize-none bg-muted/50 cursor-not-allowed"
                                                readOnly
                                            />
                                        </div>
                                    </div>

                                    <div className="col-span-1 space-y-4">
                                        {/* Provinsi - View Only */}
                                        <div className="flex items-center space-x-4">
                                            <Label className="w-[40%] font-semibold">Provinsi</Label>
                                            <Input
                                                value={locationLabels.provinceName}
                                                placeholder="Provinsi akan terisi otomatis"
                                                readOnly
                                                className="bg-muted/50 cursor-not-allowed"
                                            />
                                        </div>

                                        {/* Kab/Kota - View Only */}
                                        <div className="flex items-center space-x-4">
                                            <Label className="w-[40%] font-semibold">Kab/Kota</Label>
                                            <Input
                                                value={locationLabels.cityName}
                                                placeholder="Kota/Kabupaten akan terisi otomatis"
                                                readOnly
                                                className="bg-muted/50 cursor-not-allowed"
                                            />
                                        </div>

                                        {/* Kecamatan - View Only */}
                                        <div className="flex items-center space-x-4">
                                            <Label className="w-[40%] font-semibold">Kecamatan</Label>
                                            <Input
                                                value={locationLabels.districtName}
                                                placeholder="Kecamatan akan terisi otomatis"
                                                readOnly
                                                className="bg-muted/50 cursor-not-allowed"
                                            />
                                        </div>

                                        {/* Kelurahan - View Only */}
                                        <div className="flex items-center space-x-4">
                                            <Label className="w-[40%] font-semibold">Kelurahan</Label>
                                            <Input
                                                value={locationLabels.subDistrictName}
                                                placeholder="Kelurahan akan terisi otomatis"
                                                readOnly
                                                className="bg-muted/50 cursor-not-allowed"
                                            />
                                        </div>
                                    </div>
                                </div>

                                <div className="w-full border-t my-7"></div>

                                <div className="grid grid-cols-2 gap-20">
                                    <div className="col-span-1 space-y-4">
                                        <div className="flex items-center space-x-4">
                                            <Label className="w-[40%] font-semibold">Petugas Cleaning</Label>
                                            <MultiSelect
                                                staffList={cleaningStaffList}
                                                selected={formData.cleaningStaff}
                                                onSelectionChange={handleCleaningStaffChange}
                                                placeholder="Pilih petugas cleaning"
                                                loading={loadingCleaningStaff}
                                            />
                                        </div>

                                        <div className="flex items-center space-x-4">
                                            <Label className="w-[40%] font-semibold">Tanggal Transaksi</Label>
                                            <DatePicker
                                                value={formData.trxDate ? new Date(formData.trxDate) : null}
                                                onChange={(date) => {
                                                    if (date) {
                                                        setFormData(prev => ({
                                                            ...prev,
                                                            trxDate: formatDateInput(date.toISOString())
                                                        }));
                                                    }
                                                }}
                                            />
                                        </div>
                                    </div>

                                    <div className="col-span-1 space-y-4">
                                        <div className="flex items-center space-x-4">
                                            <Label className="w-[40%] font-semibold">Petugas Blower</Label>
                                            <MultiSelect
                                                staffList={blowerStaffList}
                                                selected={formData.blowerStaff}
                                                onSelectionChange={handleBlowerStaffChange}
                                                placeholder="Pilih petugas blower"
                                                loading={loadingBlowerStaff}
                                            />
                                        </div>
                                    </div>
                                </div>
                            </form>

                            <div className="w-full border-t mt-7"></div>

                            <div className="mt-5 space-y-3">
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
                                <SPKTableDetail
                                    data={spkItems}
                                    columns={DataHeaderSPKDetail}
                                    currentPage={1}
                                    limit={10}
                                    fetchData={() => console.log("Fetching data...")}
                                    onDelete={handleDeleteSPKItem}
                                    onEdit={handleEditSPKItem}
                                />
                            </div>

                            {/* Summary Section - Moved to bottom */}
                            <div className="grid grid-cols-2 gap-20 mt-8 border-t pt-6">
                                <div className="col-span-1"></div>
                                <div className="col-span-1 space-y-4">
                                    <div className="flex items-center space-x-4">
                                        <Label className="w-[40%] font-semibold flex items-center gap-1">
                                            Total Harga
                                            {totals.isInvalidTotal && (
                                                <div className="relative group">
                                                    <AlertTriangle className="h-4 w-4 text-red-500" />
                                                    <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-2 py-1 bg-black text-white text-xs rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap z-10">
                                                        Total pengurangan tidak boleh lebih besar dari total harga
                                                    </div>
                                                </div>
                                            )}
                                        </Label>
                                        <Input
                                            className={`text-right ${totals.isInvalidTotal ? 'border-red-500 bg-red-50' : ''}`}
                                            disabled
                                            value={formatRupiah(totals.totalPrice)}
                                        />
                                    </div>

                                    <div className="flex items-center space-x-4">
                                        <Label className="w-[40%] font-semibold">Total Promo</Label>
                                        <Input className="text-right" disabled value={formatRupiah(totals.totalPromo)} />
                                    </div>

                                    <div className="flex items-center space-x-4">
                                        <Label className="w-[40%] font-semibold">Diskon Manual</Label>
                                        <RupiahInput
                                            placeholder="Rp. 0"
                                            value={manualDiscount}
                                            onValueChange={setManualDiscount}
                                            className="text-right"
                                        />
                                    </div>

                                    <div className="flex items-center justify-between mt-5 px-3 py-2 bg-neutral-20 dark:bg-darkColor rounded-lg">
                                        <Label className="w-[50%] font-bold text-2xl">Total Akhir</Label>
                                        <Label className="text-right font-bold text-2xl">{formatRupiah(totals.finalPrice)}</Label>
                                    </div>
                                </div>
                            </div>

                            <div className="flex justify-end mt-6 gap-2">
                                <Button onClick={() => router.back()} variant="outline2">
                                    Kembali
                                </Button>
                                <Button
                                    type="submit"
                                    variant="main"
                                    onClick={handleSubmit}
                                    disabled={totals.isInvalidTotal}
                                >
                                    Simpan
                                </Button>
                            </div>
                        </div>
                    </TabsContent>

                    <TabsContent value="riwayat">
                        <div className="text-muted-foreground">Tab Riwayat kosong (dummy)</div>
                    </TabsContent>

                    <TabsContent value="foto">
                        <div className="text-muted-foreground">Tab Foto kosong (dummy)</div>
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
                                disabled={!(formDataTable.category === "GENERAL" || formDataTable.category === "BLOWER")}
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
                                value={formDataTable.harga}
                                onValueChange={(value) => handleChangeTable("harga", value)}
                            />
                        </div>

                        <div className="flex items-center space-x-4">
                            <Label htmlFor="promo" className="w-1/4 font-semibold">Promo</Label>
                            <div className="flex items-center space-x-2 w-full">
                                <div className="relative flex-1">
                                    <Input
                                        value={formatRupiah(formDataTable.promo)}
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
                            <Input
                                value={formatRupiah(
                                    (Number(formDataTable.harga) || 0) * (Number(formDataTable.jumlah) || 0) - (Number(formDataTable.promo) || 0)
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
                        variant="main"
                        onClick={handleAddSPKItem}
                    >
                        {editMode ? "Perbarui" : "Tambah"}
                    </Button>
                </div>
            </DialogWrapper>
        </>
    );
}
