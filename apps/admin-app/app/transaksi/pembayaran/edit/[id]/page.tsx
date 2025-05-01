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

interface Transaction {
    id: string;
    trxNumber: string;
    noWhatsapp: string;
    branchId: string;
    address: string;
    province: string;
    city: string;
    district: string;
    subDistrict: string;
    totalPrice: number;
    discountPrice: number;
    promoPrice: number;
    finalPrice: number;
    trxDate: string;
    status: number;
}

const DataHeaderSPKDetail = [
    { key: "id", label: "#" },
    { key: "kode", label: "kode" },
    { key: "layanan", label: "layanan" },
    { key: "kategori", label: "kategori" },
    { key: "jumlah", label: "jumlah" },
    { key: "satuan", label: "satuan" },
    { key: "harga", label: "harga" },
    { key: "promo", label: "promo" },
    { key: "menu", label: "Aksi" }
];

const DataDummySPK = [
    {
        id: "1",
        kode: "SPK001",
        layanan: "Cuci Kering",
        kategori: "Pakaian",
        jumlah: 5,
        satuan: "Kg",
        harga: 25000,
        promo: 0,
        createdBy: "Admin",
        createdAt: "2023-01-01T10:00:00Z",
    },
    {
        id: "2",
        kode: "SPK002",
        layanan: "Setrika",
        kategori: "Pakaian",
        jumlah: 3,
        satuan: "Kg",
        harga: 15000,
        promo: 2000,
        createdBy: "Admin",
        createdAt: "2023-01-02T11:00:00Z",
    },
];


export default function PembayaranDetail() {
    const pathname = usePathname();
    const router = useRouter();
    const id = pathname.split("/").pop();
    const [transaction, setTransaction] = useState<Transaction | null>(null);
    const [loading, setLoading] = useState(true);

    const { provinces, cities, districts, subDistricts, loading: locationLoading } = useLocationData(
        transaction?.province,
        transaction?.city,
        transaction?.district
    );

    // Tambah state untuk handle selected ID
    const [selectedProvince, setSelectedProvince] = useState<string>("");
    const [selectedCity, setSelectedCity] = useState<string>("");
    const [selectedDistrict, setSelectedDistrict] = useState<string>("");

    useEffect(() => {
        const fetchTransaction = async () => {
            try {
                const result = await api.get(`/transaction/id/${id}`);
                setTransaction(result.data);

                // Sekaligus set default selected
                setSelectedProvince(result.data.province);
                setSelectedCity(result.data.city);
                setSelectedDistrict(result.data.district);
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

    // Handle cascading select
    const handleProvinceChange = (value: string) => {
        setSelectedProvince(value);
        setSelectedCity("");
        setSelectedDistrict("");
        setTransaction((prev) => prev ? { ...prev, province: value, city: "", district: "", subDistrict: "" } : null);
    };

    const handleCityChange = (value: string) => {
        setSelectedCity(value);
        setSelectedDistrict("");
        setTransaction((prev) => prev ? { ...prev, city: value, district: "", subDistrict: "" } : null);
    };

    const handleDistrictChange = (value: string) => {
        setSelectedDistrict(value);
        setTransaction((prev) => prev ? { ...prev, district: value, subDistrict: "" } : null);
    };

    const handleSubDistrictChange = (value: string) => {
        setTransaction((prev) => prev ? { ...prev, subDistrict: value } : null);
    };

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
        <Wrapper className="relative">
            <div className="absolute inset-0 w-full h-[150%] bg-black/30 flex items-center justify-center backdrop-blur-[2px] z-10"> Unfinished </div> 
            <Header label={`Detail SPK - ${transaction.trxNumber}`} />
            <div className="flex flex-col gap-4">
                <div className="grid grid-cols-2 gap-20">
                    {/* Kolom Kiri */}
                    <div className="col-span-1 space-y-4">
                        <div className="flex items-center space-x-4">
                            <Label className="w-[20%] font-semibold">No Transaksi</Label>
                            <Input disabled value={transaction.trxNumber} />
                        </div>

                        <div className="flex items-center space-x-4">
                            <Label className="w-[20%] font-semibold">No Whatsapp</Label>
                            <Input value={transaction.noWhatsapp} />
                        </div>

                        <div className="flex items-center space-x-4">
                            <Label className="w-[20%] font-semibold">Alamat</Label>
                            <Textarea
                                className="resize-none"
                                value={transaction.address}
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
                                value={transaction.subDistrict}
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
                            <Input disabled value={transaction.trxNumber} />
                        </div>

                        <div className="flex items-center space-x-4">
                            <Label className="w-[20%] font-semibold">Tanggal Transaksi</Label>
                            <Input value={formatDate(transaction.trxDate)} />
                        </div>

                    </div>

                    {/* Kolom Kanan */}
                    <div className="col-span-1 space-y-4">
                        <div className="flex items-center space-x-4">
                            <Label className="w-[20%] font-semibold">Petugas Blower</Label>
                            <Input disabled value={transaction.trxNumber} />
                        </div>

                        <div className="flex items-center space-x-4">
                            <Label className="w-[20%] font-semibold">Status</Label>
                            <Select
                                value={String(transaction.status)}
                                onValueChange={(value) =>
                                    setTransaction((prev) =>
                                        prev ? { ...prev, status: parseInt(value) } : null
                                    )
                                }
                                disabled
                            >
                                <SelectTrigger className="w-full">
                                    <SelectValue placeholder="Pilih Status" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectGroup>
                                        <SelectItem value="0">Baru</SelectItem>
                                        <SelectItem value="1">Proses</SelectItem>
                                        <SelectItem value="2">Batal</SelectItem>
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
                            type="submit"
                        >
                            Tambah
                        </Button>
                    </div>
                    <SPKTableDetail
                        data={DataDummySPK}
                        columns={DataHeaderSPKDetail}
                        currentPage={1}
                        limit={10}
                        fetchData={() => {
                            console.log("Fetching data...");
                        }}
                    />
                </div>

                <div className="grid grid-cols-2 gap-20 mt-5">
                    {/* Kolom Kiri */}
                    <div className="col-span-1 space-y-4">

                    </div>

                    {/* Kolom Kanan */}
                    <div className="col-span-1 space-y-4">
                        <div className="flex items-center space-x-4">
                            <Label className="w-[20%] font-semibold">Total harga</Label>
                            <Input disabled value={transaction.totalPrice} />
                        </div>

                        <div className="flex items-center space-x-4">
                            <Label className="w-[20%] font-semibold">Promo</Label>
                            <Input disabled value={transaction.promoPrice} />
                        </div>

                        <div className="flex items-center space-x-4">
                            <Label className="w-[20%] font-semibold">Diskon</Label>
                            <Input value={transaction.discountPrice} />
                        </div>

                        <div className="flex items-center justify-between pt-5">
                            <Label className="w-[50%] font-bold text-2xl">Total Akhir</Label>
                            <Label className="text-right font-bold text-2xl">{formatRupiah(transaction.finalPrice)}</Label>
                        </div>
                    </div>
                </div>

                {/* Tombol Kembali */}
                <div className="flex justify-end mt-6 gap-3">
                    <Button onClick={() => router.back()} variant="secondary">
                        <TbArrowBack />
                        Kembali
                    </Button>
                    <Button
                        type="button"
                        variant="submit"
                    //   onClick={() => setShowConfirmDialog(true)}
                    //    disabled={updating}
                    >
                        <LuSave />
                        Simpan
                        {/* {updating ? "Menyimpan..." : "Simpan"} */}
                    </Button>
                </div>
            </div>
        </Wrapper>
    );
}
