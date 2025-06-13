"use client";

import { useEffect, useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import { Wrapper } from "@shared/components/Wrapper";
import { Header } from "@shared/components/Header";
import { Label } from "libs/ui-components/src/components/ui/label";
import { Button } from "libs/ui-components/src/components/ui/button";
import { Input } from "libs/ui-components/src/components/ui/input";
import { Textarea } from "libs/ui-components/src/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue, SelectGroup } from "libs/ui-components/src/components/ui/select";
import { useLocationData } from "libs/utils/useLocationData";
import { api } from "libs/utils/apiClient";
import { TbArrowBack } from "react-icons/tb";
import { formatDate } from "libs/utils/formatDate";
import { formatRupiah } from "libs/utils/formatRupiah";
import { SPKTableDetail } from "libs/ui-components/src/components/spk-table-detail";
import { LuPlus, LuSave } from "react-icons/lu";
import { Breadcrumbs } from "@shared/components/ui/Breadcrumbs";

interface TransactionDetail {
    serviceCategory: string;
    serviceCode: string;
    serviceType: number;
    servicePrice: number;
    quantity: number;
    promoCode?: string;
    promoType?: string;
    promoAmount?: number;
}

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
    details: TransactionDetail[];
}

interface Customer {
    id: string;
    customerName: string;
    noWhatsapp: string;
    address: string;
    province: string;
    city: string;
    district: string;
    subDistrict: string;
}

const DataHeaderSPKDetail = [
    { key: "id", label: "#" },
    { key: "serviceCode", label: "Kode" },
    { key: "serviceCategory", label: "Layanan" },
    { key: "serviceType", label: "Kategori" },
    { key: "quantity", label: "Jumlah" },
    { key: "satuan", label: "Satuan" },
    { key: "servicePrice", label: "Harga" },
    { key: "promoAmount", label: "Promo" },
    { key: "menu", label: "Aksi" }
];

// Status mapping
const statusLabels: Record<number, string> = {
    0: "Draft",
    1: "Pending",
    3: "Menunggu Bayar",
    4: "Sudah Bayar",
    5: "Selesai",
};

export default function PembayaranDetail() {
    const pathname = usePathname();
    const router = useRouter();
    const trxNumber = pathname.split("/").pop();
    
    const [transaction, setTransaction] = useState<Transaction | null>(null);
    const [customer, setCustomer] = useState<Customer | null>(null);
    const [loading, setLoading] = useState(true);
    const [updating, setUpdating] = useState(false);

    const { provinces, cities, districts, subDistricts, loading: locationLoading } = useLocationData(
        customer?.province,
        customer?.city,
        customer?.district
    );

    // State untuk handle selected ID
    const [selectedProvince, setSelectedProvince] = useState<string>("");
    const [selectedCity, setSelectedCity] = useState<string>("");
    const [selectedDistrict, setSelectedDistrict] = useState<string>("");

    useEffect(() => {
        const fetchTransactionDetail = async () => {
            setLoading(true);
            try {
                // Fetch transaction detail
                const transactionResult = await api.get(`/transaction/${trxNumber}`);
                
                if (transactionResult.data.status === "success") {
                    const transactionData = transactionResult.data.data;
                    setTransaction(transactionData);

                    // Fetch customer detail menggunakan customerId
                    if (transactionData.customerId) {
                        try {
                            const customerResult = await api.get(`/customer/${transactionData.customerId}`);
                            if (customerResult.data.status === "success") {
                                const customerData = customerResult.data.data;
                                setCustomer(customerData);
                                
                                // Set default selected untuk location
                                setSelectedProvince(customerData.province || "");
                                setSelectedCity(customerData.city || "");
                                setSelectedDistrict(customerData.district || "");
                            }
                        } catch (customerError) {
                            console.error("Gagal mengambil data customer:", customerError);
                        }
                    }
                }
            } catch (error) {
                console.error("Gagal mengambil data transaksi:", error);
            } finally {
                setLoading(false);
            }
        };

        if (trxNumber) {
            fetchTransactionDetail();
        }
    }, [trxNumber]);

    // Handle cascading select
    const handleProvinceChange = (value: string) => {
        setSelectedProvince(value);
        setSelectedCity("");
        setSelectedDistrict("");
        setCustomer((prev) => prev ? { ...prev, province: value, city: "", district: "", subDistrict: "" } : null);
    };

    const handleCityChange = (value: string) => {
        setSelectedCity(value);
        setSelectedDistrict("");
        setCustomer((prev) => prev ? { ...prev, city: value, district: "", subDistrict: "" } : null);
    };

    const handleDistrictChange = (value: string) => {
        setSelectedDistrict(value);
        setCustomer((prev) => prev ? { ...prev, district: value, subDistrict: "" } : null);
    };

    const handleSubDistrictChange = (value: string) => {
        setCustomer((prev) => prev ? { ...prev, subDistrict: value } : null);
    };

    // Handle input changes
    const handleCustomerChange = (field: keyof Customer, value: string) => {
        setCustomer((prev) => prev ? { ...prev, [field]: value } : null);
    };

    const handleTransactionChange = (field: keyof Transaction, value: any) => {
        setTransaction((prev) => prev ? { ...prev, [field]: value } : null);
    };

    // Save function
    const handleSave = async () => {
        if (!transaction || !customer) return;

        setUpdating(true);
        try {
            // Update customer
            await api.put(`/customer/${customer.id}`, customer);
            
            // Update transaction
            await api.put(`/transaction/${transaction.id}`, {
                ...transaction,
                customerId: customer.id
            });

            // Refresh data
            // window.location.reload(); // atau bisa fetch ulang data
            
        } catch (error) {
            console.error("Gagal menyimpan data:", error);
        } finally {
            setUpdating(false);
        }
    };

    // Process details untuk table
    const processedDetails = transaction?.details?.map((item, index) => ({
        id: (index + 1).toString(),
        serviceCode: item.serviceCode,
        serviceCategory: item.serviceCategory,
        serviceType: item.serviceType === 1 ? "Satuan" : "Paket", // Assumsi mapping
        quantity: item.quantity,
        satuan: "Pcs", // Default satuan, bisa disesuaikan
        servicePrice: item.servicePrice,
        promoAmount: item.promoAmount || 0,
    })) || [];

    if (loading) {
        return (
            <Wrapper>
                <Header label="Loading Detail Pembayaran..." />
                <p className="text-center py-8">Memuat data...</p>
            </Wrapper>
        );
    }

    if (!transaction || !customer) {
        return (
            <Wrapper>
                <Header label="Detail Pembayaran" />
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
            <Breadcrumbs label={`Detail Pembayaran - ${transaction.trxNumber}`} />
            <Wrapper className="relative">
                <div className="flex flex-col gap-4">
                    <div className="grid grid-cols-2 gap-20">
                        {/* Kolom Kiri */}
                        <div className="col-span-1 space-y-4">
                            <div className="flex items-center space-x-4">
                                <Label className="w-[20%] font-semibold">No Transaksi</Label>
                                <Input disabled value={transaction.trxNumber} />
                            </div>

                            <div className="flex items-center space-x-4">
                                <Label className="w-[20%] font-semibold">Nama Pelanggan</Label>
                                <Input 
                                    value={customer.customerName}
                                    onChange={(e) => handleCustomerChange('customerName', e.target.value)}
                                />
                            </div>

                            <div className="flex items-center space-x-4">
                                <Label className="w-[20%] font-semibold">No Whatsapp</Label>
                                <Input 
                                    value={customer.noWhatsapp}
                                    onChange={(e) => handleCustomerChange('noWhatsapp', e.target.value)}
                                />
                            </div>

                            <div className="flex items-center space-x-4">
                                <Label className="w-[20%] font-semibold">Alamat</Label>
                                <Textarea
                                    className="resize-none"
                                    value={customer.address}
                                    onChange={(e) => handleCustomerChange('address', e.target.value)}
                                    rows={4}
                                />
                            </div>
                        </div>

                        {/* Kolom Kanan */}
                        <div className="col-span-1 space-y-4">
                            {/* Provinsi */}
                            <div className="flex items-center space-x-4">
                                <Label className="w-[20%] font-semibold">Provinsi</Label>
                                <Select
                                    value={selectedProvince}
                                    onValueChange={handleProvinceChange}
                                >
                                    <SelectTrigger className="w-full">
                                        <SelectValue placeholder="Pilih Provinsi" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectGroup>
                                            {provinces.map((prov) => (
                                                <SelectItem key={prov.id} value={prov.paramKey}>{prov.paramValue}</SelectItem>
                                            ))}
                                        </SelectGroup>
                                    </SelectContent>
                                </Select>
                            </div>

                            {/* Kota/Kabupaten */}
                            <div className="flex items-center space-x-4">
                                <Label className="w-[20%] font-semibold">Kab/Kota</Label>
                                <Select
                                    disabled={!selectedProvince}
                                    value={selectedCity}
                                    onValueChange={handleCityChange}
                                >
                                    <SelectTrigger className="w-full">
                                        <SelectValue placeholder="Pilih Kota/Kabupaten" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectGroup>
                                            {cities.map((city) => (
                                                <SelectItem key={city.id} value={city.paramKey}>{city.paramValue}</SelectItem>
                                            ))}
                                        </SelectGroup>
                                    </SelectContent>
                                </Select>
                            </div>

                            {/* Kecamatan */}
                            <div className="flex items-center space-x-4">
                                <Label className="w-[20%] font-semibold">Kecamatan</Label>
                                <Select
                                    disabled={!selectedCity}
                                    value={selectedDistrict}
                                    onValueChange={handleDistrictChange}
                                >
                                    <SelectTrigger className="w-full">
                                        <SelectValue placeholder="Pilih Kecamatan" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectGroup>
                                            {districts.map((district) => (
                                                <SelectItem key={district.id} value={district.paramKey}>{district.paramValue}</SelectItem>
                                            ))}
                                        </SelectGroup>
                                    </SelectContent>
                                </Select>
                            </div>

                            {/* Kelurahan */}
                            <div className="flex items-center space-x-4">
                                <Label className="w-[20%] font-semibold">Kelurahan</Label>
                                <Select
                                    disabled={!selectedDistrict}
                                    value={customer.subDistrict}
                                    onValueChange={handleSubDistrictChange}
                                >
                                    <SelectTrigger className="w-full">
                                        <SelectValue placeholder="Pilih Kelurahan" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectGroup>
                                            {subDistricts.map((sub) => (
                                                <SelectItem key={sub.id} value={sub.paramKey}>{sub.paramValue}</SelectItem>
                                            ))}
                                        </SelectGroup>
                                    </SelectContent>
                                </Select>
                            </div>
                        </div>
                    </div>

                    {/* Divider */}
                    <div className="w-full border-t my-7"></div>

                    <div className="grid grid-cols-2 gap-20">
                        {/* Kolom Kiri */}
                        <div className="col-span-1 space-y-4">
                            <div className="flex items-center space-x-4">
                                <Label className="w-[20%] font-semibold">Petugas Cleaning</Label>
                                <Input placeholder="Belum ditentukan" />
                            </div>

                            <div className="flex items-center space-x-4">
                                <Label className="w-[20%] font-semibold">Tanggal Transaksi</Label>
                                <Input disabled value={formatDate(transaction.trxDate)} />
                            </div>
                        </div>

                        {/* Kolom Kanan */}
                        <div className="col-span-1 space-y-4">
                            <div className="flex items-center space-x-4">
                                <Label className="w-[20%] font-semibold">Petugas Blower</Label>
                                <Input placeholder="Belum ditentukan" />
                            </div>

                            <div className="flex items-center space-x-4">
                                <Label className="w-[20%] font-semibold">Status</Label>
                                <Select
                                    value={String(transaction.status)}
                                    onValueChange={(value) => handleTransactionChange('status', parseInt(value))}
                                >
                                    <SelectTrigger className="w-full">
                                        <SelectValue placeholder="Pilih Status" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectGroup>
                                            <SelectItem value="0">Draft</SelectItem>
                                            <SelectItem value="1">Pending</SelectItem>
                                            <SelectItem value="3">Menunggu Bayar</SelectItem>
                                            <SelectItem value="4">Sudah Bayar</SelectItem>
                                            <SelectItem value="5">Selesai</SelectItem>
                                        </SelectGroup>
                                    </SelectContent>
                                </Select>
                            </div>
                        </div>
                    </div>

                    <div className="mt-5 space-y-3">
                        <div className="flex justify-end">
                            <Button
                                icon={<LuPlus size={16} />}
                                className="pl-2 pr-4"
                                iconPosition="left"
                                variant="default"
                                type="button"
                            >
                                Tambah Layanan
                            </Button>
                        </div>
                        
                        <SPKTableDetail
                            data={processedDetails}
                            columns={DataHeaderSPKDetail}
                            currentPage={1}
                            limit={10}
                            fetchData={() => {
                                console.log("Fetching detail data...");
                            }}
                        />
                    </div>

                    <div className="grid grid-cols-2 gap-20 mt-5">
                        {/* Kolom Kiri */}
                        <div className="col-span-1 space-y-4">
                            {/* Kosong untuk layout */}
                        </div>

                        {/* Kolom Kanan */}
                        <div className="col-span-1 space-y-4">
                            <div className="flex items-center space-x-4">
                                <Label className="w-[20%] font-semibold">Total Harga</Label>
                                <Input disabled value={formatRupiah(transaction.totalPrice)} />
                            </div>

                            <div className="flex items-center space-x-4">
                                <Label className="w-[20%] font-semibold">Promo</Label>
                                <Input disabled value={formatRupiah(transaction.promoPrice)} />
                            </div>

                            <div className="flex items-center space-x-4">
                                <Label className="w-[20%] font-semibold">Diskon</Label>
                                <Input 
                                    value={transaction.discountPrice}
                                    onChange={(e) => {
                                        const discount = parseInt(e.target.value) || 0;
                                        handleTransactionChange('discountPrice', discount);
                                        // Recalculate final price
                                        const newFinalPrice = transaction.totalPrice - transaction.promoPrice - discount;
                                        handleTransactionChange('finalPrice', newFinalPrice);
                                    }}
                                />
                            </div>

                            <div className="flex items-center justify-between pt-5">
                                <Label className="w-[50%] font-bold text-2xl">Total Akhir</Label>
                                <Label className="text-right font-bold text-2xl">
                                    {formatRupiah(transaction.finalPrice)}
                                </Label>
                            </div>
                        </div>
                    </div>

                    {/* Tombol Aksi */}
                    <div className="flex justify-end mt-6 gap-3">
                        <Button onClick={() => router.back()} variant="secondary">
                            <TbArrowBack />
                            Kembali
                        </Button>
                        <Button
                            type="button"
                            variant="submit"
                            onClick={handleSave}
                            disabled={updating}
                        >
                            <LuSave />
                            {updating ? "Menyimpan..." : "Simpan"}
                        </Button>
                    </div>
                </div>
            </Wrapper>
        </>
    );
}