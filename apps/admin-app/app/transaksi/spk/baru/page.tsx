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
import { useLocationData } from "libs/utils/useLocationData";
import { PiWarningCircleFill } from "react-icons/pi";
import { LuPlus } from "react-icons/lu";
import MultiSelect from "libs/ui-components/src/components/multi-select";
import { formatDateInput } from "libs/utils/formatDate";
import { SPKTableDetail } from "libs/ui-components/src/components/spk-table-detail";
import { DialogWrapper } from "libs/ui-components/src/components/dialog-wrapper";
import { formatRupiah } from "libs/utils/formatRupiah";
import { useCategoryStore } from "libs/utils/useCategoryStore";
import { RupiahInput } from "@ui-components/components/rupiah-input";
import { RadioGroup, RadioGroupItem } from "@ui-components/components/ui/radio-group";
import { Header } from "@shared/components/Header";
import { Check, ChevronsUpDown, Cross, Plus, PlusCircle, Search } from "lucide-react";

// Dummy data sementara agar tidak error saat preview
const transaction = {
    trxNumber: "SPK-00123",
    noWhatsapp: "",
    address: "Jl. Contoh Alamat No. 1",
    trxDate: new Date().toISOString(),
    status: 0,
    subDistrict: "",
    totalPrice: 0,
    promoPrice: 0,
    discountPrice: 0,
    finalPrice: 0,
};

const DataHeaderSPKDetail = [
    { key: "id", label: "#" },
    { key: "kode", label: "kode" },
    { key: "layanan", label: "layanan" },
    { key: "kategori", label: "kategori" },
    { key: "jumlah", label: "jumlah" },
    { key: "satuan", label: "satuan" },
    { key: "harga", label: "harga" },
    { key: "promo", label: "promo" },
    { key: "id", label: "Aksi" }
];

const DataDummySPK = [
    {
        id: "-",
        kode: "-",
        layanan: "-",
        kategori: "-",
        jumlah: "-",
        satuan: "-",
        harga: 0,
        promo: 0,
        createdBy: "-",
        createdAt: "-",
    },
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

    // Sync searchQuery dengan value prop
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
            {/* Input Field */}
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

            {/* Dropdown Results */}
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

            {/* Clear Button */}
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

            {/* Click outside to close */}
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
    
    // State untuk menyimpan data customer yang dipilih
    const [selectedCustomer, setSelectedCustomer] = useState<any>(null);
    
    // State untuk menyimpan display names dari location codes
    const [locationLabels, setLocationLabels] = useState({
        provinceName: "",
        cityName: "",
        districtName: "",
        subDistrictName: ""
    });

    const [formData, setFormData] = useState({
        noWhatsapp: "",
        customerName: "",
        address: "",
        province: "",
        category: "",
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
            // Helper function untuk mendapatkan label berdasarkan code
            const getLocationLabel = (items: any[], code: string) => {
                const item = items.find(item => item.paramKey === code);
                return item ? item.paramValue : code;
            };

            // Update location labels
            setLocationLabels({
                provinceName: getLocationLabel(provinces, selectedCustomer.province),
                cityName: getLocationLabel(cities, selectedCustomer.city),
                districtName: getLocationLabel(districts, selectedCustomer.district),
                subDistrictName: getLocationLabel(subDistricts, selectedCustomer.subDistrict)
            });
        } else {
            // Clear location labels jika tidak ada customer yang dipilih
            setLocationLabels({
                provinceName: "",
                cityName: "",
                districtName: "",
                subDistrictName: ""
            });
        }
    }, [selectedCustomer, provinces, cities, districts, subDistricts]);

    console.log('====================================');
    console.log('Selected Customer:', selectedCustomer);
    console.log('Location Labels:', locationLabels);
    console.log('====================================');

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
        // Simpan data customer yang dipilih ke state
        setSelectedCustomer(customer);
        
        // Update formData dengan data customer
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

    // Handler untuk clear/reset customer selection
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
        }));
    };

    // Handler untuk WhatsApp combobox value change
    const handleWhatsAppChange = (value: string) => {
        handleChange("noWhatsapp", value);
        
        // Jika value kosong, clear customer selection
        if (!value.trim()) {
            handleClearCustomer();
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        console.log("Payload yang dikirim:", JSON.stringify(formData, null, 2)); // Cek di console

        try {
            await api.post("/spk", formData);
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

    // Input Dialog 
    const { catLayananMapping, unitLayananMapping, loading: loadingParams } = useCategoryStore();

    const [formDataTable, setFormDataTable] = useState({
        code: "",
        name: "",
        amount: "",
        category: "",
        serviceCode: "",
        minItem: "",
        endDate: "",
        servicesType: "",
    });

    const handleChangeTable = (e: React.ChangeEvent<HTMLInputElement>) => {
        setFormData({ ...formData, [e.target.id]: e.target.value });
    };

    const handleSelectChangeTable = (key: keyof typeof formData, value: string) => {
        setFormData({ ...formData, [key]: value });
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
                                            <MultiSelect />
                                        </div>

                                        <div className="flex items-center space-x-4">
                                            <Label className="w-[40%] font-semibold">Tanggal Transaksi</Label>
                                            <Input
                                                type="date"
                                                id="trxDate"
                                                value={formData.trxDate}
                                                onChange={(e) => handleChange("trxDate", e.target.value)}
                                            />
                                        </div>
                                    </div>

                                    <div className="col-span-1 space-y-4">
                                        <div className="flex items-center space-x-4">
                                            <Label className="w-[40%] font-semibold">Petugas Blower</Label>
                                            <MultiSelect />
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
                                        onClick={() => setOpenDialog(true)}
                                    >
                                        Tambah
                                    </Button>
                                </div>
                                <SPKTableDetail
                                    data={DataDummySPK}
                                    columns={DataHeaderSPKDetail}
                                    currentPage={1}
                                    limit={10}
                                    fetchData={() => console.log("Fetching data...")}
                                />
                            </div>

                            <div className="grid grid-cols-2 gap-20 mt-5">
                                <div className="col-span-1"></div>
                                <div className="col-span-1 space-y-4">
                                    <div className="flex items-center space-x-4">
                                        <Label className="w-[40%] font-semibold flex items-center gap-1">
                                            Total harga <PiWarningCircleFill />
                                        </Label>
                                        <Input className="text-right" disabled value={formatRupiah(transaction.totalPrice)} />
                                    </div>

                                    <div className="flex items-center space-x-4">
                                        <Label className="w-[40%] font-semibold">Promo</Label>
                                        <Input className="text-right" disabled value={formatRupiah(transaction.promoPrice)} />
                                    </div>

                                    <div className="flex items-center space-x-4">
                                        <Label className="w-[40%] font-semibold">Diskon</Label>
                                        <Input className="text-right" disabled value={formatRupiah(transaction.discountPrice)} />
                                    </div>

                                    <div className="flex items-center justify-between mt-5 px-3 py-2 bg-neutral-200 rounded-lg">
                                        <Label className="w-[50%] font-bold text-2xl">Total Akhir</Label>
                                        <Label className="text-right font-bold text-2xl">{formatRupiah(transaction.finalPrice)}</Label>
                                    </div>
                                </div>
                            </div>

                            <div className="flex justify-end mt-6 gap-2">
                                <Button onClick={() => router.back()} variant="outline2">
                                    Kembali
                                </Button>
                                <Button type="submit" variant="main">
                                    Simpan
                                </Button>
                                <Button className="hidden" onClick={() => router.back()} variant="destructive">
                                    Batalkan
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
                onOpenChange={setOpenDialog}
                headItem={
                    <>
                        <Header label="Tambah SPK Baru" />
                    </>
                }
            >
                <div className="mx-2">
                    <form className="space-y-4" onSubmit={handleSubmit}>
                        <div className="flex items-center space-x-4">
                            <Label htmlFor="category" className="w-1/4">
                                Kategori
                            </Label>
                            <Select
                                onValueChange={(value) => handleSelectChangeTable("category", value)}
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
                                // onValueChange={(value) => handleSelectChange("serviceCode", value)}
                                disabled={loadingParams}
                            >
                                <SelectTrigger className="w-full">
                                    <SelectValue placeholder="Pilih Layanan" />
                                </SelectTrigger>
                                <SelectContent className="z-[999]">
                                    <SelectGroup>
                                        <SelectLabel>Satuan</SelectLabel>
                                        {loadingParams ? (
                                            <SelectItem value="loading" disabled>
                                                Loading...
                                            </SelectItem>
                                        ) : (
                                            Object.keys(unitLayananMapping).map((key) => (
                                                <SelectItem key={key} value={key}>
                                                    {unitLayananMapping[key]}
                                                </SelectItem>
                                            ))
                                        )}
                                    </SelectGroup>
                                </SelectContent>
                            </Select>
                        </div>

                        <div className="flex items-center space-x-4">
                            <Label htmlFor="code" className="w-1/4 font-semibold">Jumlah</Label>
                            <Input placeholder="Masukkan Jumlah" type="number" id="code" value={formDataTable.code} onChange={handleChangeTable} />
                        </div>

                        {/* Tampilkan RadioGroup dan disable jika kategori bukan GENERAL atau BLOWER */}
                        <div className="flex items-center space-x-4">
                            <Label htmlFor="tipe" className="w-[20%] font-semibold">Tipe</Label>
                            <RadioGroup
                                defaultValue="option-one"
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
                            <Label htmlFor="amount" className="w-1/4 font-semibold">Harga</Label>
                            <RupiahInput
                                placeholder="Rp. 0"
                                onValueChange={(value) => console.log("Nilai angka:", value)}
                            />
                        </div>

                        <div className="flex items-center space-x-4">
                            <Label htmlFor="promo" className="w-1/4 font-semibold">Promo</Label>
                            <RupiahInput
                                placeholder="Rp. 0"
                                onValueChange={(value) => console.log("Nilai angka:", value)}
                            />
                        </div>

                        <div className="flex items-center space-x-4">
                            <Label htmlFor="code" className="w-1/4 font-bold text-lg">Total</Label>
                            <RupiahInput
                                placeholder="Rp. 0"
                                className="!border-0 !text-lg"
                                onValueChange={(value) => console.log("Nilai angka:", value)}
                            />
                        </div>
                    </form>
                </div>
                <div className="flex justify-end gap-2 mt-4">
                    <Button
                        variant="outline2"
                        onClick={() => setOpenDialog(false)}
                    >
                        Kembali
                    </Button>
                    <Button
                        variant="main"
                        onClick={() => {
                            setOpenDialog(false);
                        }}
                    >
                        Tambah
                    </Button>
                </div>
            </DialogWrapper>
        </>
    );
}