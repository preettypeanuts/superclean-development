"use client";

import { Label } from "libs/ui-components/src/components/ui/label";
import { Button } from "libs/ui-components/src/components/ui/button";
import { Textarea } from "libs/ui-components/src/components/ui/textarea";
import { StarRating } from "@ui-components/components/star-rating";
import { AttachmentImage } from "@ui-components/components/attachment-image";
import { useEffect, useState } from "react";
import { Customer, Transaction } from "apps/admin-app/app/transaksi/spk/edit/[...id]/page";
import { formatDate } from "@shared/utils/formatDate";
import { SPKItem } from "apps/admin-app/app/transaksi/spk/baru/page";
import { formatRupiah } from "@shared/utils/formatRupiah";
import html2canvas from "html2canvas";
import { useToast } from "@ui-components/hooks/use-toast";
import { api } from "@shared/utils/apiClient";

export type PhotoSectionProps = {
  transaction: Transaction;
  customer: Customer | null;
  locationLabels: {
    provinceName: string;
    cityName: string;
    districtName: string;
    subDistrictName: string;
  };
  cleaningStaffList?: { id: string; fullname: string }[];
  blowerStaffList?: { id: string; fullname: string }[];
  spkItems: SPKItem[];
  totals: {
    totalPrice: number;
    totalPromo: number;
    manualDiscount: number;
    finalPrice: number;
    isInvalidTotal: boolean;
  }
}

interface TransactionReview {
  "id": string,
  "trxNumber": string,
  "customerId": string,
  "branchId": string,
  "totalPrice": number,
  "discountPrice": number,
  "promoPrice": number | null,
  "finalPrice": number,
  "trxDate": string,
  "status": number,
  "paymentAt": string | null,
  "rating": number,
  "review": string | null,
  "transactionDocument": {
    "id": string,
    "trxNumber": string,
    "docType": string,
    "docUrl": string,
    "createdAt": string,
    "createdBy": string,
    "updatedAt": string,
    "updatedBy": string | null
  }
}

interface TransactionReviewImage {
  "id": string,
  "createdAt": string,
  "createdBy": string,
  "updatedAt": string,
  "updatedBy": string | null,
  "trxNumber": string,
  "docType": "PAYMENT" | "BEFORE" | "AFTER",
  "docUrl": string
}

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

export default function PhotoSection({
  transaction,
  customer,
  locationLabels,
  cleaningStaffList = [],
  blowerStaffList = [],
  spkItems = [],
  totals
}: PhotoSectionProps) {
  const { toast } = useToast();

  const [showInvoice, setShowInvoice] = useState(false);
  const [isDownloadInvoice, setIsDownloadInvoice] = useState(false);

  const [transactionReview, setTransactionReview] = useState<TransactionReview | null>(null);
  const [paymentImage, setPaymentImage] = useState<TransactionReviewImage | null>(null);
  const [beforeImages, setBeforeImages] = useState<TransactionReviewImage[]>([]);
  const [afterImages, setAfterImages] = useState<TransactionReviewImage[]>([]);

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

  useEffect(() => {
    const fetchTransactionReview = async () => {
      try {
        const result = await api.get(`/transaction/${transaction.id}/review`);
        const review = result.data as TransactionReview;

        setTransactionReview(review);
      }
      catch (error) {
        console.error("Error fetching transaction review:", error);
      }
    };

    const fetchTransactionReviewImages = async (type: "PAYMENT" | "BEFORE" | "AFTER") => {
      try {
        const result = await api.get(`/transaction/${transaction.id}/documents?docType=${type}`);
        const images = result.data as TransactionReviewImage[];

        if (type === "PAYMENT") {
          setPaymentImage(images[0] || null);
        } else if (type === "BEFORE") {
          setBeforeImages(images);
        } else if (type === "AFTER") {
          setAfterImages(images);
        }
      }
      catch (error) {
        console.error(`Error fetching transaction review images (${type}):`, error);
      }
    };
  })



  return <>
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
              src={"https://placehold.co/400x500"}
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
                    readonly
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
                    {formatDateTime("2023-10-10T10:10:10Z")}
                  </div>
                </div>
              </div>
            )}

            {/* Remarks */}
            <div className="flex flex-1 justify-center space-x-2">
              <Label className="w-[40%] font-semibold">Catatan</Label>
              <div className="flex-1 flex">
                <Textarea
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

    {/* center using flex */}
    {
      showInvoice && (
        <>
          <div className="absolute top-0 left-0 w-full h-full z-[200] overflow-hidden" >
            <div className="invoice-container flex items-center justify-center min-h-screen py-6 bg-gray-200/60 dark:bg-gray-800/60 " onClick={(e) => {
              if (e.target === e.currentTarget) {
                setShowInvoice(false);
              }
            }}>
              <div id="invoice" className="invoice w-4/6 min-w-xl max-h-screen overflow-auto">
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
                        <p className="flex-1 font-light">{locationLabels.provinceName}</p>
                      </div>

                      <div className="flex mb-5 items-center space-x-4">
                        <p className="flex-1 font-semibold">Kab/Kota</p>
                        <p className="font-semibold">:</p>
                        <p className="flex-1 font-light">{locationLabels.cityName}</p>
                      </div>

                      <div className="flex mb-5 items-center space-x-4">
                        <p className="flex-1 font-semibold">Kecamatan</p>
                        <p className="font-semibold">:</p>
                        <p className="flex-1 font-light">{locationLabels.districtName}</p>
                      </div>

                      <div className="flex mb-5 justify-start space-x-4">
                        <p className="flex-1 font-semibold">Kelurahan</p>
                        <p className="font-semibold">:</p>
                        <p className="flex-1 font-light">{locationLabels.subDistrictName}</p>
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
                        <p className="flex-1 font-semibold">Tanggal Pengerjaan</p>
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

                    {spkItems.map((item, index) => {
                      const {
                        kode, layanan, kategori, jumlah, satuan, harga, promo
                      } = item;

                      const totalPrice = harga * jumlah;

                      return (
                        <div key={item.id} className="flex w-full px-2 items-center">
                          <div className="flex w-6 p-2 mx-1 py-4 text-gray-500">{index + 1}</div>
                          <div className="flex-[3] p-2 mx-1 py-4 text-gray-500">{item.kode}</div>
                          <div className="flex-1 p-2 mx-1 py-4 text-gray-500">{item.layanan}</div>
                          <div className="flex-1 p-2 mx-1 py-4 text-gray-500">{item.kategori}</div>
                          <div className="flex-1 p-2 mx-1 py-4 text-gray-500">{item.jumlah}</div>
                          <div className="flex-1 p-2 mx-1 py-4 text-gray-500">{item.satuan}</div>
                          <div className="flex-1 p-2 mx-1 py-4 text-gray-500">Rp. {totalPrice.toLocaleString()}</div>
                          <div className="flex-1 p-2 mx-1 py-4 text-gray-500">Rp. {item.promo.toLocaleString()}</div>
                        </div>
                      )
                    })}
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
      )
    }
  </>
}
