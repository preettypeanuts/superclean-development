"use client";

import { useEffect, useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import { Wrapper } from "@shared/components/Wrapper";
import { Header } from "@shared/components/Header";
import { Label } from "libs/ui-components/src/components/ui/label";
import { Button } from "libs/ui-components/src/components/ui/button";
import { Input } from "libs/ui-components/src/components/ui/input";
import { Textarea } from "libs/ui-components/src/components/ui/textarea";
import { api } from "libs/utils/apiClient";
import { TbArrowBack } from "react-icons/tb";
import { formatDate, formatDateInput } from "libs/utils/formatDate";
import { formatRupiah } from "libs/utils/formatRupiah";
import { SPKTableDetail } from "libs/ui-components/src/components/spk-table-detail";
import { Breadcrumbs } from "@shared/components/ui/Breadcrumbs";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@ui-components/components/ui/tabs";
import { PiWarningCircleFill } from "react-icons/pi";
import { useTransactionHistory } from "libs/utils/useTransactionHistory";
import { useTransactionDetail } from "libs/utils/useTransactionDetail";

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
  details: TransactionDetail[];
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
interface TransactionDetail {
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
}

// Staff interface
interface Staff {
  id: string;
  fullname: string;
  username: string;
}

// Location interface
interface LocationData {
  id: string;
  paramKey: string;
  paramValue: string;
}

const DataHeaderSPKDetail = [
  { key: "no", label: "#" },
  { key: "serviceCode", label: "Kode Service" },
  { key: "serviceName", label: "Layanan" },
  { key: "serviceCategory", label: "Kategori" },
  { key: "quantity", label: "Jumlah" },
  { key: "unit", label: "Satuan" },
  { key: "servicePrice", label: "Harga Satuan" },
  { key: "totalPrice", label: "Total Harga" },
  { key: "promoPrice", label: "Promo" }
];

export default function TransactionDetail() {
  const pathname = usePathname();
  const router = useRouter();
  const id = pathname.split("/transaksi/spk/edit/").pop();

  // States
  const [transaction, setTransaction] = useState<Transaction | null>(null);
  const [customer, setCustomer] = useState<Customer | null>(null);
  const [cleaningStaff, setCleaningStaff] = useState<Staff[]>([]);
  const [blowerStaff, setBlowerStaff] = useState<Staff[]>([]);
  const [loading, setLoading] = useState(true);
  const [locationLabels, setLocationLabels] = useState({
    provinceName: "",
    cityName: "",
    districtName: "",
    subDistrictName: ""
  });
  // Tetap sama seperti sebelumnya
  const { data, error, refetch } = useTransactionDetail("SPK/004/2506/25112320");


  // Use transaction history hook
  const { history, loading: historyLoading, error: historyError, refetch: refetchHistory } = useTransactionHistory(id);

  // console.log('=========hiss===========================');
  // console.log(data);
  // console.log('====================================');

  // Fetch transaction data
  useEffect(() => {
    const fetchTransaction = async () => {
      try {
        const result = await api.get(`/transaction/detail?trxNumber=${id}`);
        const transactionData = result.data;
        setTransaction(transactionData);

        // Fetch customer data
        if (transactionData.customerId) {
          await fetchCustomerData(transactionData.customerId);
        }

        // Fetch staff data
        if (transactionData.assigns && transactionData.assigns.length > 0) {
          await fetchStaffData(transactionData.assigns, setCleaningStaff);
        }

        if (transactionData.blowers && transactionData.blowers.length > 0) {
          await fetchStaffData(transactionData.blowers, setBlowerStaff);
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
      const result = await api.get(`/customer/detail?id=${customerId}`);
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
      const staffPromises = staffIds.map(id => api.get(`/user/detail?id=${id}`));
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
        api.get(`/params/province`),
        api.get(`/params/city?province=${customerData.province}`),
        api.get(`/params/district?city=${customerData.city}`),
        api.get(`/params/subdistrict?district=${customerData.district}`)
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
      case 2: return "Selesai";
      case 3: return "Batal";
      default: return "Unknown";
    }
  };

  // Format transaction details for table
  const formatDetailsForTable = (details: TransactionDetail[]) => {
    return details.map((detail, index) => ({
      no: index + 1,
      kode: detail.serviceCode,
      layanan: detail.serviceCode,
      kategori: detail.serviceCategory,
      kategoriCode: detail.serviceCategory,
      jumlah: detail.quantity,
      satuan: "PCS",
      harga: detail.servicePrice,
      totalHarga: detail.totalPrice,
      promo: detail.promoPrice,
      id: detail.id
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
              <div className="grid grid-cols-2 gap-20">
                {/* Kolom Kiri */}
                <div className="col-span-1 space-y-4">
                  <div className="flex items-center space-x-4">
                    <Label className="w-[40%] font-semibold">No Transaksi</Label>
                    <Input disabled value={transaction.trxNumber} />
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
                    <Input disabled value={getStatusLabel(transaction.status)} />
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
                    <Textarea
                      disabled
                      className="resize-none"
                      value={cleaningStaff.map(staff => staff.fullname).join(", ") || "-"}
                      rows={2}
                    />
                  </div>

                  <div className="flex items-center space-x-4">
                    <Label className="w-[40%] font-semibold">Tanggal Transaksi</Label>
                    <Input disabled value={formatDate(transaction.trxDate)} />
                  </div>
                </div>

                {/* Kolom Kanan */}
                <div className="col-span-1 space-y-4">
                  <div className="flex items-center space-x-4">
                    <Label className="w-[40%] font-semibold">Petugas Blower</Label>
                    <Textarea
                      disabled
                      className="resize-none"
                      value={blowerStaff.map(staff => staff.fullname).join(", ") || "-"}
                      rows={2}
                    />
                  </div>
                </div>
              </div>

              {/* Divider */}
              <div className="w-full border-t mt-7"></div>

              {/* GROUP 3 - TABLE DETAIL */}
              <div className="mt-5 space-y-3">
                <div className="flex justify-between items-center">
                  <h3 className="text-lg font-semibold">Detail Layanan</h3>
                </div>
                <SPKTableDetail
                  data={formatDetailsForTable(transaction.details || [])}
                  columns={DataHeaderSPKDetail}
                  currentPage={1}
                  limit={10}
                  fetchData={() => {
                    console.log("Fetching data...");
                  }}
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
                    <Input className="text-right" disabled value={formatRupiah(transaction.totalPrice)} />
                  </div>

                  <div className="flex items-center space-x-4">
                    <Label className="w-[40%] font-semibold">Total Promo</Label>
                    <Input className="text-right" disabled value={formatRupiah(transaction.promoPrice)} />
                  </div>

                  <div className="flex items-center space-x-4">
                    <Label className="w-[40%] font-semibold">Diskon</Label>
                    <Input className="text-right" disabled value={formatRupiah(transaction.discountPrice)} />
                  </div>

                  <div className="flex items-center justify-between mt-5 px-3 py-2 bg-neutral-200 dark:bg-darkColor rounded-lg">
                    <Label className="w-[50%] font-bold text-2xl">Total Akhir</Label>
                    <Label className="text-right font-bold text-2xl">{formatRupiah(transaction.finalPrice)}</Label>
                  </div>
                </div>
              </div>

              {/* Tombol Kembali */}
              <div className="flex justify-start mt-6 gap-2">
                <Button onClick={() => router.back()} variant="outline2">
                  <TbArrowBack className="mr-2" />
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
            <div className="text-center py-8 text-muted-foreground">
              Coming Soon - Foto Transaksi
            </div>
          </TabsContent>
        </Tabs>
      </Wrapper>
    </>
  );
}
