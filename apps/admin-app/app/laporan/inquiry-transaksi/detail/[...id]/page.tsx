"use client";

import { Header } from "@shared/components/Header";
import { Breadcrumbs } from "@shared/components/ui/Breadcrumbs";
import { Wrapper } from "@shared/components/Wrapper";
import { useTransactionHistory } from "@shared/utils/useTransactionHistory";
import { DatePicker } from "@ui-components/components/date-picker";
import { SPKTableDetail } from "@ui-components/components/spk-table-detail";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@ui-components/components/ui/tabs";
import { LocationData, Transaction, TransactionItem } from "apps/admin-app/app/transaksi/spk/edit/[...id]/page";
import PhotoSection from "apps/admin-app/app/transaksi/spk/photoSection";
import { Button } from "libs/ui-components/src/components/ui/button";
import { Input } from "libs/ui-components/src/components/ui/input";
import { Label } from "libs/ui-components/src/components/ui/label";
import { Textarea } from "libs/ui-components/src/components/ui/textarea";
import { api } from "libs/utils/apiClient";
import { formatRupiah } from "libs/utils/formatRupiah";
import { useLocationData } from "libs/utils/useLocationData";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useMemo, useState } from "react";
import { PiWarningCircleFill } from "react-icons/pi";
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
  4: "Sudah DiBayar",
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
  }));
};

function formatTime(dateString: string) {
  const date = new Date(dateString);
  // make only format with hh:mm:ss
  return date.toString().split(' ')[4];
}


export default function InquiryTransaksiDetail() {
  const pathname = usePathname();
  const router = useRouter();
  const trxNumber = pathname.split("/laporan/inquiry-transaksi/detail/").pop();

  const [transaction, setTransaction] = useState<Transaction | null>(null);
  const [customer, setCustomer] = useState<Customer | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const id = useMemo(() => {
    return pathname.split("/laporan/inquiry-transaksi/detail/").pop();
  }, [])
  const { history, loading: historyLoading, error: historyError, refetch: refetchHistory } = useTransactionHistory(id);
  const reversedHistory = history ? [...history].reverse() : [];

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

  const [selectedCleaningStaffList, setSelectedCleaningStaffList] = useState<any[]>([]);
  const [selectedBlowerStaffList, setSelectedBlowerStaffList] = useState<any[]>([]);
  const [reworkStaffList, setReworkStaffList] = useState<any[]>([]);


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

  useEffect(() => {
    const fetchTransactionData = async () => {
      try {
        setLoading(true);
        setError(null);

        // Fetch transaction data
        const transactionResult = await api.get(`/transaction/detail?trxNumber=${trxNumber}`);
        const transactionData = transactionResult.data as Transaction;

        if (transactionResult.status === "success") {
          setTransaction(transactionData);

          // Fetch customer data using customerId
          if (transactionData.customerId) {
            await fetchCustomerData(transactionData.customerId);
          }

          // Fetch staff data
          if (transactionData.assigns && transactionData.assigns.length > 0) {
            await fetchStaffData(transactionData.assigns, setSelectedCleaningStaffList);
          }

          if (transactionData.blowers && transactionData.blowers.length > 0) {
            await fetchStaffData(transactionData.blowers, setSelectedBlowerStaffList);
          }

          if (transactionData.reassigns && transactionData.reassigns.length > 0) {
            await fetchStaffData(transactionData.reassigns, setReworkStaffList);
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
  // const transformedDetails = transaction?.details?.map((detail, index) => ({
  //   id: (index + 1).toString(),
  //   serviceCode: detail.serviceCode,
  //   serviceCategory: detail.serviceCategory,
  //   serviceType: serviceTypeMapping[detail.serviceType as keyof typeof serviceTypeMapping] || "Unknown",
  //   quantity: detail.quantity,
  //   servicePrice: formatRupiah(detail.servicePrice),
  //   promoCode: detail.promoCode || "-",
  //   promoAmount: detail.promoPrice ? formatRupiah(detail.promoPrice) : "-",
  // })) || [];

  const DataHeaderSPKDetail = useMemo(() => {
    const columns = [
      { key: "no", label: "#" },
      { key: "kode", label: "Kode Service" },
      { key: "layanan", label: "Layanan" },
      { key: "kategori", label: "Kategori" },
      { key: "jumlah", label: "Jumlah" },
      // { key: "satuan", label: "Satuan" },
      { key: "harga", label: "Harga Satuan" },
      // { key: "totalHarga", label: "Total Harga" },
      // { key: "promo", label: "Promo Satuan" },
    ];

    return columns;
  }, [transaction]);

  const spkItems = formatDetailsForTable(transaction?.details || []);


  const calculateTotals = () => {
    const totalPrice = transaction?.details.reduce((sum, item) => sum + item.servicePrice * item.quantity, 0) || 0;
    const totalPromo = transaction?.details.reduce((sum, item) => sum + item.promoPrice, 0) || 0;

    const manualDiscount = transaction?.discountPrice || 0;
    const additionalFee = transaction?.additionalFee || 0;

    const finalPrice = totalPrice - totalPromo - manualDiscount + additionalFee;

    // Validasi: total pengurangan tidak boleh lebih besar dari total harga
    const totalReductions = totalPromo;
    const isInvalidTotal = totalReductions > totalPrice;

    return {
      totalPrice,
      totalPromo,
      totalReductions,
      finalPrice,
      isInvalidTotal
    };
  };

  const totals = calculateTotals();

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
                      value={customer?.fullname || ""}
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
                  <div className="flex items-center space-x-4">
                    <Label className="w-[40%] font-semibold">Status</Label>
                    <Input
                      value={statusMapping[transaction.status as keyof typeof statusMapping] || "Unknown"}
                      readOnly
                      className="bg-muted/50 cursor-not-allowed"
                    />
                  </div>

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
                    <Label className="w-[40%] font-semibold">Petugas Cleaning</Label>
                    <Textarea
                      disabled
                      className="resize-none"
                      value={selectedCleaningStaffList.map(staff => staff.fullname).join(", ") || "-"}
                      rows={2}
                    />
                  </div>

                  <div className="flex items-center space-x-4">
                    <Label className="w-[40%] font-semibold">Tanggal Pengerjaan</Label>
                    <DatePicker
                      withTime
                      disabled
                      value={transaction.trxDate ? new Date(transaction.trxDate) : undefined}
                      defaultTime={transaction?.trxDate ? `${formatTime(transaction.trxDate)}` : "08:00"}
                    />
                    {/* <Input
                      disabled
                      value={formatDate(transaction.trxDate)}
                      className="bg-muted/50 cursor-not-allowed"
                    /> */}
                  </div>
                </div>

                {/* Kolom Kanan */}
                <div className="col-span-1 space-y-4">
                  <div className="flex items-center space-x-4">
                    <Label className="w-[40%] font-semibold">Petugas Blower</Label>
                    <Textarea
                      disabled
                      className="resize-none"
                      value={selectedBlowerStaffList.map(staff => staff.fullname).join(", ") || "-"}
                      rows={2}
                    />
                  </div>

                  {
                    transaction.blowers.length > 0 && (
                      <>
                        <div className="flex items-center space-x-4">
                          <Label className="w-[40%] font-semibold">Tanggal Pengantaran</Label>
                          <DatePicker
                            withTime
                            disabled
                            value={transaction.deliveryDate ? new Date(transaction.deliveryDate) : undefined}
                            defaultTime={transaction?.deliveryDate ? `${formatTime(transaction.deliveryDate)}` : "08:00"}
                          />
                          {/* <Textarea
                            disabled
                            className="resize-none"
                            value={transaction.deliveryDate ? formatDate(transaction.deliveryDate) : "-"}
                            rows={1}
                          /> */}
                        </div>

                        <div className="flex items-center space-x-4">
                          <Label className="w-[40%] font-semibold">Tanggal Pengambilan</Label>
                          <DatePicker
                            withTime
                            disabled
                            value={transaction.pickupDate ? new Date(transaction.pickupDate) : undefined}
                            defaultTime={transaction?.pickupDate ? `${formatTime(transaction.pickupDate)}` : "08:00"}
                          />
                          {/* <Textarea
                            disabled
                            className="resize-none"
                            value={transaction.pickupDate ? formatDate(transaction.pickupDate) : "-"}
                            rows={1}
                          /> */}
                        </div>
                      </>
                    )
                  }

                  <div className="flex items-center space-x-4">
                    <Label className="w-[40%] font-semibold">Dikerjakan Ulang</Label>
                    <Textarea
                      disabled
                      className="resize-none"
                      value={reworkStaffList.map(staff => staff.fullname).join(", ") || "-"}
                      rows={2}
                    />
                  </div>
                </div>
              </div>

              {/* Detail Transaksi Table */}
              <div className="mt-5 space-y-3">
                {/* <PembayaranTableDetail
                  data={transformedDetails}
                  columns={HeaderPembayaran}
                  currentPage={1}
                  limit={10}
                  fetchData={() => {
                    console.log("Fetching data...");
                  }}
                /> */}

                <SPKTableDetail
                  data={spkItems}
                  columns={DataHeaderSPKDetail}
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
                <div className="col-span-1">
                  <div className="flex items-start space-x-4">
                    <Label className="w-[40%] font-semibold flex items-center mt-2">
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
                    <Label className="w-[40%] font-semibold">Total Harga</Label>
                    <Input
                      disabled
                      value={formatRupiah(totals.totalPrice)}
                      className="text-right bg-muted/50 cursor-not-allowed"
                    />
                  </div>

                  <div className="flex items-center space-x-4">
                    <Label className="w-[40%] font-semibold">Total Promo</Label>
                    <Input
                      disabled
                      value={formatRupiah(totals.totalPromo)}
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

                  <div className="flex items-center space-x-4">
                    <Label className="w-[40%] font-semibold">Biaya Tambahan</Label>
                    <Input
                      disabled
                      value={formatRupiah(transaction.additionalFee || 0)}
                      className="text-right bg-muted/50 cursor-not-allowed"
                    />
                  </div>

                  <div className="flex items-center justify-between mt-5 px-3 py-2 bg-neutral-200 rounded-lg dark:bg-neutral-800">
                    <Label className="w-[50%] font-bold text-2xl">Total Akhir</Label>
                    <Label className="text-right font-bold text-2xl">
                      {formatRupiah(totals.finalPrice)}
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
                  {reversedHistory.map((item, index) => (
                    <div
                      key={item.id}
                      className="border rounded-lg p-4 bg-white hover:bg-gray-50 transition-colors"
                    >
                      <div className="flex justify-between items-start mb-2">
                        <div className="flex items-center">
                          <div className="w-8 h-8 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center text-sm font-semibold mr-3">
                            {reversedHistory.length - index}
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
              cleaningStaffList={selectedCleaningStaffList}
              blowerStaffList={selectedBlowerStaffList}
              spkItems={spkItems}
              totals={{
                totalPrice: totals.totalPrice,
                totalPromo: totals.totalPromo,
                finalPrice: totals.finalPrice,
                isInvalidTotal: totals.isInvalidTotal,
                manualDiscount: transaction.discountPrice
              }}
            />
          </TabsContent>
        </Tabs>

      </Wrapper>
    </>
  );
}
