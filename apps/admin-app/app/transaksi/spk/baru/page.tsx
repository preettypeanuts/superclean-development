"use client";

import { useState } from "react";
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
import { Popover, PopoverContent, PopoverTrigger } from "@ui-components/components/ui/popover";

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
        harga: "-",
        promo: "-",
        createdBy: "-",
        createdAt: "-",
    },
];

export default function NewSPK() {
    const router = useRouter();
    const { toast } = useToast();
    const { provinces, cities, districts, subDistricts } = useLocationData();
    const [openDialog, setOpenDialog] = useState(false);


    const [formData, setFormData] = useState({
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

    const handleChange = (id: string, value: string | number | string[]) => {
        setFormData({ ...formData, [id]: value });
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
                                        <div className="flex items-center space-x-4">
                                            <Label className="w-[40%] font-semibold">No Whatsapp</Label>
                                            <div className="w-full flex items-center focus-within:ring-1 focus-within:ring-ring rounded-lg">
                                                <Input
                                                    placeholder="Masukkan No Whatsapp"
                                                    value={transaction.noWhatsapp}
                                                    className="rounded-r-none border-r-0 focus-visible:ring-0"
                                                />
                                                <Button
                                                    className="rounded-l-none"
                                                    variant={"main"}
                                                >
                                                    Cari
                                                </Button>
                                            </div>
                                        </div>

                                        <div className="flex items-center space-x-4">
                                            <Label className="w-[40%] font-semibold">Nama Pelanggan</Label>
                                            <Input
                                                id="customerName"
                                                value={formData.customerName}
                                                onChange={(e) => handleChange("customerName", e.target.value)}
                                                placeholder="Masukkan Nama Pelanggan"
                                            />
                                        </div>

                                        <div className="flex items-center space-x-4">
                                            <Label className="w-[40%] font-semibold">Alamat</Label>
                                            <Textarea
                                                id="address"
                                                value={formData.address}
                                                onChange={(e) => handleChange("address", e.target.value)}
                                                placeholder="Masukkan Alamat"
                                                rows={4}
                                                className="resize-none"
                                            />
                                        </div>
                                    </div>

                                    <div className="col-span-1 space-y-4">
                                        <div className="flex items-center space-x-4">
                                            <Label className="w-[40%] font-semibold">Provinsi</Label>
                                            <Select
                                                value={formData.province}
                                                onValueChange={(value) => handleChange("province", value)}
                                            >
                                                <SelectTrigger className="w-full">
                                                    <SelectValue placeholder="Pilih Provinsi" />
                                                </SelectTrigger>
                                                <SelectContent>
                                                    <SelectGroup>
                                                        {provinces.map((prov) => (
                                                            <SelectItem key={prov.id} value={prov.paramKey}>
                                                                {prov.paramValue}
                                                            </SelectItem>
                                                        ))}
                                                    </SelectGroup>
                                                </SelectContent>
                                            </Select>
                                        </div>

                                        <div className="flex items-center space-x-4">
                                            <Label className="w-[40%] font-semibold">Kab/Kota</Label>
                                            <Select
                                                value={formData.city}
                                                onValueChange={(value) => handleChange("city", value)}
                                                disabled={!formData.province}
                                            >
                                                <SelectTrigger className="w-full">
                                                    <SelectValue placeholder="Pilih Kota/Kabupaten" />
                                                </SelectTrigger>
                                                <SelectContent>
                                                    <SelectGroup>
                                                        {cities.map((city) => (
                                                            <SelectItem key={city.id} value={city.paramKey}>
                                                                {city.paramValue}
                                                            </SelectItem>
                                                        ))}
                                                    </SelectGroup>
                                                </SelectContent>
                                            </Select>
                                        </div>

                                        <div className="flex items-center space-x-4">
                                            <Label className="w-[40%] font-semibold">Kecamatan</Label>
                                            <Select
                                                value={formData.district}
                                                onValueChange={(value) => handleChange("district", value)}
                                                disabled={!formData.city}
                                            >
                                                <SelectTrigger className="w-full">
                                                    <SelectValue placeholder="Pilih Kecamatan" />
                                                </SelectTrigger>
                                                <SelectContent>
                                                    <SelectGroup>
                                                        {districts.map((district) => (
                                                            <SelectItem key={district.id} value={district.paramKey}>
                                                                {district.paramValue}
                                                            </SelectItem>
                                                        ))}
                                                    </SelectGroup>
                                                </SelectContent>
                                            </Select>
                                        </div>

                                        <div className="flex items-center space-x-4">
                                            <Label className="w-[40%] font-semibold">Kelurahan</Label>
                                            <Select
                                                value={formData.subDistrict}
                                                onValueChange={(value) => handleChange("subDistrict", value)}
                                                disabled={!formData.district}
                                            >
                                                <SelectTrigger className="w-full">
                                                    <SelectValue placeholder="Pilih Kelurahan" />
                                                </SelectTrigger>
                                                <SelectContent>
                                                    <SelectGroup>
                                                        {subDistricts.map((sub) => (
                                                            <SelectItem key={sub.id} value={sub.paramKey}>
                                                                {sub.paramValue}
                                                            </SelectItem>
                                                        ))}
                                                    </SelectGroup>
                                                </SelectContent>
                                            </Select>
                                        </div>
                                    </div>
                                </div>

                                <div className="w-full border-t my-7"></div>

                                <div className="grid grid-cols-2 gap-20">
                                    <div className="col-span-1 space-y-4">
                                        <div className="flex items-center space-x-4">
                                            <Label className="w-[40%] font-semibold">Petugas Cleaning</Label>
                                            <MultiSelect
                                                value={formData.cleaningStaff}
                                                onChange={(value) => handleChange("cleaningStaff", value)}
                                            />
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
                                            <MultiSelect
                                                value={formData.blowerStaff}
                                                onChange={(value) => handleChange("blowerStaff", value)}
                                            />
                                        </div>
                                    </div>
                                </div>
                            </form>


                            <div className="w-full border-t mt-7"></div>

                            <div className="mt-5 space-y-3">
                                <div className="flex justify-end">
                                    <Button
                                        icon={<LuPlus
                                            size={16}
                                        />}
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
                                onValueChange={(value) => handleSelectChange("category", value)}
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
                            <Input placeholder="Masukkan Jumlah" type="number" id="code" value={formDataTable.code} onChange={handleChange} />
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
