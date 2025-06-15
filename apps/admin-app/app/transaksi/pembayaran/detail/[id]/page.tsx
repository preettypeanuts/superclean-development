"use client";

import { useEffect, useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import { Wrapper } from "@shared/components/Wrapper";
import { Header } from "@shared/components/Header";
import { Label } from "libs/ui-components/src/components/ui/label";
import { Button } from "libs/ui-components/src/components/ui/button";
import { Input } from "libs/ui-components/src/components/ui/input";
import { Textarea } from "libs/ui-components/src/components/ui/textarea";
import { useLocationData } from "libs/utils/useLocationData";
import { api } from "libs/utils/apiClient";
import { TbArrowBack } from "react-icons/tb";
import { formatDate } from "libs/utils/formatDate";
import { formatRupiah } from "libs/utils/formatRupiah";
import { PembayaranTableDetail } from "libs/ui-components/src/components/pembayaran-table-detail";
import { Breadcrumbs } from "@shared/components/ui/Breadcrumbs";

interface TransactionDetail {
    serviceCategory: string;
    serviceCode: string;
    serviceType: number;
    servicePrice: number;
    quantity: number;
    promoCode: string;
    promoType: string;
    promoAmount: number;
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
    name: string;
    noWhatsapp: string;
    address: string;
    province: string;
    city: string;
    district: string;
    subDistrict: string;
}

const HeaderPembayaran = [
    { key: "id", label: "#" },
    { key: "serviceCode", label: "Kode Layanan" },
    { key: "serviceCategory", label: "Kategori" },
    { key: "serviceType", label: "Jenis Layanan" },
    { key: "quantity", label: "Jumlah" },
    { key: "servicePrice", label: "Harga" },
    { key: "promoCode", label: "Kode Promo" },
    { key: "promoAmount", label: "Diskon Promo" }
];

// Mapping untuk status
const statusMapping = {
    0: "Baru",
    1: "Dikonfirmasi", 
    2: "Dalam Proses",
    3: "Selesai",
    4: "Dibatalkan",
    5: "Menunggu Pembayaran"
};

// Mapping untuk service type
const serviceTypeMapping = {
    1: "Regular",
    2: "Express", 
    3: "Premium"
};

export default function PembayaranDetail() {
    const pathname = usePathname();
    const router = useRouter();
    const trxNumber = pathname.split("/").pop();
    
    const [transaction, setTransaction] = useState<Transaction | null>(null);
    const [customer, setCustomer] = useState<Customer | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

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

    // Effect untuk mengambil label lokasi berdasarkan customer yang dipilih
    useEffect(() => {
        if (customer) {
            const getLocationLabel = (items: any[], code: string) => {
                const item = items.find(item => item.paramKey === code);
                return item ? item.paramValue : code;
            };

            setLocationLabels({
                provinceName: getLocationLabel(provinces, customer.province),
                cityName: getLocationLabel(cities, customer.city),
                districtName: getLocationLabel(districts, customer.district),
                subDistrictName: getLocationLabel(subDistricts, customer.subDistrict)
            });
        } else {
            setLocationLabels({
                provinceName: "",
                cityName: "",
                districtName: "",
                subDistrictName: ""
            });
        }
    }, [customer, provinces, cities, districts, subDistricts]);

    useEffect(() => {
        const fetchTransactionData = async () => {
            try {
                setLoading(true);
                setError(null);
                
                // Fetch transaction data
                const transactionResult = await api.get(`/transaction/${trxNumber}`);
                
                if (transactionResult.status === "success") {
                    setTransaction(transactionResult.data);
                    
                    // Fetch customer data using customerId
                    if (transactionResult.data.customerId) {
                        try {
                            const customerResult = await api.get(`/customer/${transactionResult.data.customerId}`);
                            if (customerResult.status === "success") {
                                setCustomer(customerResult.data);
                            }
                        } catch (customerError) {
                            console.warn("Customer data not found or error:", customerError);
                            // Continue without customer data
                        }
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

    // Transform transaction details for table
    const transformedDetails = transaction?.details?.map((detail, index) => ({
        id: (index + 1).toString(),
        serviceCode: detail.serviceCode,
        serviceCategory: detail.serviceCategory,
        serviceType: serviceTypeMapping[detail.serviceType as keyof typeof serviceTypeMapping] || "Unknown",
        quantity: detail.quantity,
        servicePrice: formatRupiah(detail.servicePrice),
        promoCode: detail.promoCode || "-",
        promoAmount: detail.promoAmount ? formatRupiah(detail.promoAmount) : "-",
    })) || [];

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

    return (
        <>
            <Breadcrumbs label={`Detail Pembayaran - ${transaction.trxNumber}`} />
            <Wrapper className="relative">
                <div className="flex flex-col gap-4">
                    <div className="grid grid-cols-2 gap-20">
                        {/* Kolom Kiri */}
                        <div className="col-span-1 space-y-4">
                            <div className="flex items-center space-x-4">
                                <Label className="w-[40%] font-semibold">No Transaksi</Label>
                                <Input 
                                    disabled 
                                    value={transaction.trxNumber}
                                    className="bg-muted/50 cursor-not-allowed"
                                />
                            </div>

                            <div className="flex items-center space-x-4">
                                <Label className="w-[40%] font-semibold">No WhatsApp</Label>
                                <Input 
                                    value={customer?.noWhatsapp || ""} 
                                    readOnly
                                    className="bg-muted/50 cursor-not-allowed"
                                    placeholder="No WhatsApp tidak tersedia"
                                />
                            </div>

                            <div className="flex items-center space-x-4">
                                <Label className="w-[40%] font-semibold">Nama Customer</Label>
                                <Input 
                                    value={customer?.name || ""} 
                                    readOnly
                                    className="bg-muted/50 cursor-not-allowed"
                                    placeholder="Nama customer tidak tersedia"
                                />
                            </div>

                            <div className="flex items-center space-x-4">
                                <Label className="w-[40%] font-semibold">Alamat</Label>
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
                            {/* Provinsi - View Only */}
                            <div className="flex items-center space-x-4">
                                <Label className="w-[40%] font-semibold">Provinsi</Label>
                                <Input
                                    value={locationLabels.provinceName}
                                    placeholder="Provinsi tidak tersedia"
                                    readOnly
                                    className="bg-muted/50 cursor-not-allowed"
                                />
                            </div>

                            {/* Kab/Kota - View Only */}
                            <div className="flex items-center space-x-4">
                                <Label className="w-[40%] font-semibold">Kab/Kota</Label>
                                <Input
                                    value={locationLabels.cityName}
                                    placeholder="Kota/Kabupaten tidak tersedia"
                                    readOnly
                                    className="bg-muted/50 cursor-not-allowed"
                                />
                            </div>

                            {/* Kecamatan - View Only */}
                            <div className="flex items-center space-x-4">
                                <Label className="w-[40%] font-semibold">Kecamatan</Label>
                                <Input
                                    value={locationLabels.districtName}
                                    placeholder="Kecamatan tidak tersedia"
                                    readOnly
                                    className="bg-muted/50 cursor-not-allowed"
                                />
                            </div>

                            {/* Kelurahan - View Only */}
                            <div className="flex items-center space-x-4">
                                <Label className="w-[40%] font-semibold">Kelurahan</Label>
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
                            <div className="flex items-center space-x-4">
                                <Label className="w-[40%] font-semibold">Branch ID</Label>
                                <Input 
                                    disabled 
                                    value={transaction.branchId}
                                    className="bg-muted/50 cursor-not-allowed"
                                />
                            </div>

                            <div className="flex items-center space-x-4">
                                <Label className="w-[40%] font-semibold">Tanggal Transaksi</Label>
                                <Input 
                                    disabled 
                                    value={formatDate(transaction.trxDate)}
                                    className="bg-muted/50 cursor-not-allowed"
                                />
                            </div>
                        </div>

                        {/* Kolom Kanan */}
                        <div className="col-span-1 space-y-4">
                            <div className="flex items-center space-x-4">
                                <Label className="w-[40%] font-semibold">Customer ID</Label>
                                <Input 
                                    disabled 
                                    value={transaction.customerId}
                                    className="bg-muted/50 cursor-not-allowed"
                                />
                            </div>

                            <div className="flex items-center space-x-4">
                                <Label className="w-[40%] font-semibold">Status</Label>
                                <Input
                                    value={statusMapping[transaction.status as keyof typeof statusMapping] || "Unknown"}
                                    readOnly
                                    className="bg-muted/50 cursor-not-allowed"
                                />
                            </div>
                        </div>
                    </div>

                    {/* Detail Transaksi Table */}
                    <div className="mt-5 space-y-3">
                        <div className="flex justify-between items-center">
                            <h3 className="text-lg font-semibold">Detail Layanan</h3>
                        </div>
                        <PembayaranTableDetail
                            data={transformedDetails}
                            columns={HeaderPembayaran}
                            currentPage={1}
                            limit={10}
                            fetchData={() => {
                                console.log("Fetching data...");
                            }}
                        />
                    </div>

                    {/* Summary Pricing */}
                    <div className="grid grid-cols-2 gap-20 mt-8 border-t pt-6">
                        {/* Kolom Kiri - Kosong */}
                        <div className="col-span-1"></div>

                        {/* Kolom Kanan - Summary */}
                        <div className="col-span-1 space-y-4">
                            <div className="flex items-center space-x-4">
                                <Label className="w-[40%] font-semibold">Total Harga</Label>
                                <Input 
                                    disabled 
                                    value={formatRupiah(transaction.totalPrice)}
                                    className="text-right bg-muted/50 cursor-not-allowed"
                                />
                            </div>

                            <div className="flex items-center space-x-4">
                                <Label className="w-[40%] font-semibold">Total Promo</Label>
                                <Input 
                                    disabled 
                                    value={formatRupiah(transaction.promoPrice)}
                                    className="text-right bg-muted/50 cursor-not-allowed"
                                />
                            </div>

                            <div className="flex items-center space-x-4">
                                <Label className="w-[40%] font-semibold">Diskon Manual</Label>
                                <Input 
                                    disabled
                                    value={formatRupiah(transaction.discountPrice)}
                                    className="text-right bg-muted/50 cursor-not-allowed"
                                />
                            </div>

                            <div className="flex items-center justify-between mt-5 px-3 py-2 bg-neutral-200 rounded-lg">
                                <Label className="w-[50%] font-bold text-2xl">Total Akhir</Label>
                                <Label className="text-right font-bold text-2xl">
                                    {formatRupiah(transaction.finalPrice)}
                                </Label>
                            </div>
                        </div>
                    </div>

                    {/* Action Buttons */}
                    <div className="flex justify-end mt-6 gap-2">
                        <Button onClick={() => router.back()} variant="outline2">
                            <TbArrowBack />
                            Kembali
                        </Button>
                    </div>
                </div>
            </Wrapper>
        </>
    );
}