"use client";

import { api } from "@shared/utils/apiClient";
import { apiFormdata } from '@shared/utils/apiFormdataClient';
import { formatDate } from "@shared/utils/formatDate";
import { formatRupiah } from "@shared/utils/formatRupiah";
import { AttachmentImage } from "@ui-components/components/attachment-image";
import { StarRating } from "@ui-components/components/star-rating";
import { useToast } from "@ui-components/hooks/use-toast";
import { Parameter } from "apps/admin-app/app/pengaturan/page";
import { SPKItem } from "apps/admin-app/app/transaksi/spk/baru/page";
import { Customer, Transaction } from "apps/admin-app/app/transaksi/spk/edit/[...id]/page";
import domtoimage from "dom-to-image";
import { Button } from "libs/ui-components/src/components/ui/button";
import { Label } from "libs/ui-components/src/components/ui/label";
import { Textarea } from "libs/ui-components/src/components/ui/textarea";
import { useEffect, useState } from "react";

export type PhotoSectionProps = {
  transaction: Transaction;
  customer: Customer | null;
  locationLabels: {
    provinceName: string;
    cityName: string;
    districtName: string;
    subDistrictName: string;
  };
  cleaningStaffList?: {
    lookupKey: string;
    lookupValue: string;
  }[];
  blowerStaffList?: {
    lookupKey: string;
    lookupValue: string;
  }[];
  spkItems: SPKItem[];
  totals: {
    totalPrice: number;
    totalPromo: number;
    manualDiscount: number;
    finalPrice: number;
    isInvalidTotal: boolean;
  },
  readonly?: boolean
}

interface TransactionReview {
  id: string,
  trxNumber: string,
  customerId: string,
  branchId: string,
  totalPrice: number,
  discountPrice: number,
  promoPrice: number | null,
  finalPrice: number,
  trxDate: string,
  status: number,
  paymentAt: string | null,
  rating: number,
  review: string | null,
  transactionDocument: {
    id: string,
    trxNumber: string,
    docType: string,
    docUrl: string,
    createdAt: string,
    createdBy: string,
    updatedAt: string,
    updatedBy: string | null
  }
}

interface TransactionReviewImage {
  id: string,
  createdAt: string,
  createdBy: string,
  updatedAt: string,
  updatedBy: string | null,
  trxNumber: string,
  docType: "PAYMENT" | "BEFORE" | "AFTER",
  docUrl: string
  tempFile?: File;
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
    // Get the actual rendered dimensions
    const rect = element.getBoundingClientRect();
    const actualWidth = Math.max(element.scrollWidth, element.offsetWidth, rect.width);
    const actualHeight = Math.max(element.scrollHeight, element.offsetHeight, rect.height);

    console.log('Capturing dimensions:', {
      scrollWidth: element.scrollWidth,
      scrollHeight: element.scrollHeight,
      offsetWidth: element.offsetWidth,
      offsetHeight: element.offsetHeight,
      clientWidth: element.clientWidth,
      clientHeight: element.clientHeight,
      rectWidth: rect.width,
      rectHeight: rect.height,
      actualWidth,
      actualHeight
    });

    // Use dom-to-image with higher pixel ratio for better quality
    const scale = 2;
    const dataUrl = await domtoimage.toPng(element, {
      quality: 1.0,
      bgcolor: '#ffffff',
      width: actualWidth * scale,
      height: actualHeight * scale,
      style: {
        transform: `scale(${scale})`,
        transformOrigin: 'top left',
        width: actualWidth + 'px',
        height: actualHeight + 'px'
      }
    });

    downloadImage(dataUrl, filename);
  }
  catch (error) {
    console.error('Error in exportAsImage:', error);
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
  totals,
  readonly = false
}: PhotoSectionProps) {
  console.log(cleaningStaffList, blowerStaffList);


  const { toast } = useToast();

  const [showInvoice, setShowInvoice] = useState(false);
  const [isDownloadInvoice, setIsDownloadInvoice] = useState(false);

  const [loading, setLoading] = useState(true);
  const [submitLoading, setSubmitLoading] = useState(false)

  const [transactionReview, setTransactionReview] = useState<TransactionReview | null>(null);
  const [paymentImage, setPaymentImage] = useState<TransactionReviewImage | null>(null);
  const [beforeImages, setBeforeImages] = useState<TransactionReviewImage[]>([]);
  const [afterImages, setAfterImages] = useState<TransactionReviewImage[]>([]);

  const [originalPaymentImage, setOriginalPaymentImage] = useState<TransactionReviewImage | null>(null);
  const [originalBeforeImages, setOriginalBeforeImages] = useState<TransactionReviewImage[]>([]);
  const [originalAfterImages, setOriginalAfterImages] = useState<TransactionReviewImage[]>([]);

  const [parameters, setParameters] = useState<Parameter[]>([]);

  // reload indicator
  const [reload, setReload] = useState(false)

  // Prevent body scroll when modal is open
  useEffect(() => {
    if (showInvoice) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }

    // Cleanup on unmount
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [showInvoice]);

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

  const handleDownloadInvoice = async () => {
    try {
      const invoiceElement = document.getElementById("invoice");

      if (invoiceElement) {
        setIsDownloadInvoice(true);

        // Clone the invoice element to render without constraints
        const clonedInvoice = invoiceElement.cloneNode(true) as HTMLElement;

        // Create a temporary container to render the clone without constraints
        const tempContainer = document.createElement('div');
        tempContainer.style.position = 'fixed';
        tempContainer.style.top = '-10000px';
        tempContainer.style.left = '-10000px';
        tempContainer.style.width = 'auto';
        tempContainer.style.height = 'auto';
        tempContainer.style.overflow = 'visible';
        document.body.appendChild(tempContainer);

        // Add cloned invoice to temp container
        tempContainer.appendChild(clonedInvoice);

        // Wait for layout to settle and images to load
        await new Promise(resolve => setTimeout(resolve, 300));

        // Log dimensions for debugging
        console.log('Cloned invoice dimensions:', {
          scrollWidth: clonedInvoice.scrollWidth,
          scrollHeight: clonedInvoice.scrollHeight,
          offsetWidth: clonedInvoice.offsetWidth,
          offsetHeight: clonedInvoice.offsetHeight,
        });

        try {
          await exportAsImage(clonedInvoice, `Invoice-${transaction?.trxNumber}.png`);

          toast({
            title: "Success",
            description: "Invoice berhasil diunduh.",
            variant: "default",
          });
        } catch (exportError) {
          console.error("Error exporting invoice:", exportError);
          toast({
            title: "Error",
            description: "Terjadi kesalahan saat mengekspor invoice.",
            variant: "destructive",
          });
        } finally {
          // Remove temp container
          document.body.removeChild(tempContainer);
          setIsDownloadInvoice(false);
        }
      } else {
        toast({
          title: "Error",
          description: "Element invoice tidak ditemukan.",
          variant: "destructive",
        });
        setIsDownloadInvoice(false);
      }
    } catch (error) {
      console.error("Error downloading invoice:", error);
      toast({
        title: "Error",
        description: "Terjadi kesalahan saat mengunduh invoice.",
        variant: "destructive",
      });
      setIsDownloadInvoice(false);
    }
  };;;

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
      setLoading(true)

      try {
        const result = await api.get(`/transaction/${transaction.id}/documents?docType=${type}`);
        const images = result.data as TransactionReviewImage[];

        if (type === "PAYMENT") {
          setPaymentImage(images[0] || null);
          setOriginalPaymentImage(images[0] || null);
        } else if (type === "BEFORE") {
          setBeforeImages(images);
          setOriginalBeforeImages(images);
        } else if (type === "AFTER") {
          setAfterImages(images);
          setOriginalAfterImages(images);
        }
      }
      catch (error) {
        console.error(`Error fetching transaction review images (${type}):`, error);
      }
    };

    const fetchParameters = async () => {
      setLoading(true);

      try {
        const response = await api.get(`/parameter/app-settings`);
        const settings = response.data as Parameter[];

        setParameters(settings);
      }
      catch (error) {
        console.error("Error fetching parameters:", error);
      }
    };

    if (!transaction || !transaction.id) return;

    const promises = [
      fetchTransactionReview(),
      fetchTransactionReviewImages("PAYMENT"),
      fetchTransactionReviewImages("BEFORE"),
      fetchTransactionReviewImages("AFTER"),
      fetchParameters(),
    ]

    Promise.all(promises)
      .then((e) => {
        setLoading(false)
      })
      .catch(error => {
        console.error("Error fetching transaction review data:", error);
      }).finally(() => {
        setLoading(false);
      })
  }, [reload]);


  const handleUpdate = async (e: React.FormEvent) => {
    // compare original and current images
    e.preventDefault();

    // compare payment image
    const imagesToUpload: TransactionReviewImage[] = [];
    const imagesToDelete: string[] = [];
    if (originalPaymentImage?.docUrl !== paymentImage?.docUrl) {
      if (paymentImage) {
        imagesToUpload.push(paymentImage);
      }
      if (originalPaymentImage) {
        imagesToDelete.push(originalPaymentImage.id);
      }
    }

    // compare before images by unique ID
    // Find images to delete (in original but not in current)
    originalBeforeImages.forEach((origImg) => {
      if (origImg.id && !beforeImages.some((img) => img.id === origImg.id)) {
        imagesToDelete.push(origImg.id);
      }
    });

    // Find images to upload (in current but not in original)
    beforeImages.forEach((img) => {
      if (!img.id || !originalBeforeImages.some((origImg) => origImg.id === img.id)) {
        imagesToUpload.push(img);
      }
    });
    //   if (!originalBeforeImages.find((oImg) => oImg.id === img.id)) {
    //     imagesToUpload.push(img);
    //   }

    //   if (originalBeforeImages.find((oImg) => oImg.id === img.id)) {
    //     imagesToDelete.push(img.id);
    //   }
    // });

    // compare after images by unique ID
    // Find images to delete (in original but not in current)
    originalAfterImages.forEach((origImg) => {
      if (origImg.id && !afterImages.some((img) => img.id === origImg.id)) {
        imagesToDelete.push(origImg.id);
      }
    });

    // Find images to upload (in current but not in original)
    afterImages.forEach((img) => {
      if (!img.id || !originalAfterImages.some((origImg) => origImg.id === img.id)) {
        imagesToUpload.push(img);
      }
    });

    const promises: Promise<any>[] = [];

    console.log(imagesToDelete, imagesToUpload);


    for (const file of imagesToUpload) {
      const formData = new FormData();
      formData.append("file", file.tempFile as File);
      formData.append("docType", file.docType);

      const newUploadPromise = apiFormdata.post(`/transaction/${transaction.id}/documents`, formData);
      promises.push(newUploadPromise);
    }

    for (const id of imagesToDelete) {
      const deletePromise = await api.delete(`/transaction/documents/${id}`);
      promises.push(deletePromise);
    }

    try {
      setSubmitLoading(true)
      await Promise.all(promises);
      toast({
        title: "Success",
        description: "Berhasil mengupdate dokumen.",
        variant: "default",
      });
    }
    catch (error) {
      toast({
        title: "Error",
        description: "Terjadi kesalahan saat mengupdate dokumen.",
        variant: "destructive",
      });
    }
    finally {
      setReload(!reload)
      setSubmitLoading(false)
    }
  }

  const imageRowCount = Math.ceil(Math.max(beforeImages.length + 1, afterImages.length + 1) / 3)


  if (loading) {
    return (
      <p className="text-center py-8">Memuat data...</p>
    );
  }

  const bankAccountParam = parameters.find(param => param.paramKey === "BANK_ACCOUNT_NUMBER");
  const bankAccount = bankAccountParam ? bankAccountParam.paramValue : "0000000000";

  const bankAccountNameParam = parameters.find(param => param.paramKey === "BANK_ACCOUNT_NAME");
  const bankAccountName = bankAccountNameParam ? bankAccountNameParam.paramValue : "Nama Bank";

  const bankNameParam = parameters.find(param => param.paramKey === "BANK_NAME");
  const bankName = bankNameParam ? bankNameParam.paramValue : "Bank";


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
              readonly={readonly}
              src={paymentImage?.docUrl}
              className="object-cover w-full h-full min-w-[400px] mr-4"
              width={200}
              height={200}
              label="Foto Bukti Transfer"
              onChange={(file: File) => {
                setPaymentImage({
                  id: "",
                  createdAt: "",
                  createdBy: "",
                  docType: "PAYMENT",
                  trxNumber: transaction.trxNumber,
                  docUrl: URL.createObjectURL(file),
                  updatedAt: "",
                  updatedBy: null,
                  tempFile: file
                })
              }}
              onDelete={() => setPaymentImage(null)}
            />
          </div>

          <div className="flex-[3] flex flex-col ">
            {/* ratings */}
            <div className="flex items-center space-x-2 mb-4">
              <Label className="w-[40%] font-semibold">Rating</Label>
              <div className="flex items-center space-x-1">
                {/* create placeholder stars */}
                {
                  Number(transactionReview?.rating) > 0 ? (
                    <div className="flex space-x-1">
                      <StarRating
                        readonly
                        totalStars={5}
                        initialSelected={transactionReview?.rating || 0}
                        onChange={(index) => console.log(index)}
                      />
                    </div>
                  ) : (
                    <span className="text-gray-500">Belum ada rating</span>
                  )
                }
              </div>
            </div>

            {/* payment date */}
            {true && (
              <div className="flex items-center space-x-2 mb-4">
                <Label className="w-[40%] font-semibold">Tanggal Pembayaran</Label>
                <div className="flex items-center space-x-1">
                  {
                    transactionReview?.paymentAt ? (
                      <span>{formatDateTime(transactionReview.paymentAt)}</span>
                    ) : (
                      <span className="text-gray-500">Belum ada pembayaran</span>
                    )
                  }
                </div>
              </div>
            )}

            {/* Remarks */}
            <div className="flex flex-1 justify-center space-x-2">
              <Label className="w-[40%] font-semibold">Catatan</Label>
              <div className="flex-1 flex">
                {
                  transactionReview?.review ? (
                    <Textarea
                      className="flex flex-1"
                      value={transactionReview?.review || "Belum ada catatan"}
                      disabled
                    />)
                    : (<span className="text-gray-500">Belum ada catatan</span>)
                }
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
      <div className="flex flex-col gap-2">
        <div className="flex">
          <div className="flex-1 flex flex-col overflow-x-auto">
            <h4 className="font-semibold mb-2 !text-mainDark dark:!text-mainColor">Sebelum</h4>
          </div>
          <div className="flex-1 flex flex-col mr-4 overflow-x-auto ml-4">
            <h4 className="font-semibold mb-2 !text-mainDark dark:!text-mainColor">Sesudah</h4>
          </div>
        </div>

        {
          [0].map(() => {
            let beforePlaceholderUsed = false;
            let afterPlaceholderUsed = false;

            {
              return Array.from({ length: imageRowCount }).map((_, rowIndex) => {
                const startIndex = rowIndex * 3;
                const endIndex = startIndex + 3;

                const beforeRowImages = beforeImages.slice(startIndex, endIndex);
                const afterRowImages = afterImages.slice(startIndex, endIndex);

                return (
                  <div className="flex" key={rowIndex}>
                    <div className="flex-1 flex flex-col overflow-x-auto">
                      <div className="flex mt-2">
                        {[0, 1, 2].map((image, index) => {
                          const img = beforeRowImages[index];

                          if (!img && !readonly) {
                            if (!beforePlaceholderUsed) {
                              beforePlaceholderUsed = true;
                              return (<AttachmentImage
                                readonly={readonly}
                                key={`before-${startIndex + index}`}
                                className="flex-1 aspect-square mr-6"
                                label={`Upload Foto Sebelum`}
                                width={200}
                                height={200}
                                onChange={(file: File) => {
                                  const newImage: TransactionReviewImage = {
                                    id: "",
                                    createdAt: "",
                                    createdBy: "",
                                    docType: "BEFORE",
                                    trxNumber: transaction.trxNumber,
                                    docUrl: URL.createObjectURL(file),
                                    updatedAt: "",
                                    updatedBy: null,
                                    tempFile: file
                                  };

                                  const newImages = [...beforeImages];
                                  newImages[startIndex + index] = newImage;
                                  setBeforeImages(newImages);
                                }}
                                onDelete={() => {
                                  const newImages = beforeImages.filter((_, i) => i !== startIndex + index);
                                  setBeforeImages(newImages);
                                }}
                              />)
                            }
                            return (
                              <div className="flex-1 aspect-square mr-6"></div>
                            );
                          }

                          return (
                            <AttachmentImage
                              readonly={readonly}
                              key={`before-${startIndex + index}`}
                              src={`${beforeRowImages[index]?.docUrl}`}
                              className="flex-1 aspect-square mr-6"
                              label={`Foto Sebelum`}
                              width={200}
                              height={200}
                              onDelete={() => {
                                const newImages = beforeImages.filter((_, i) => i !== startIndex + index);
                                setBeforeImages(newImages);
                              }}
                            />
                          )
                        })}
                      </div>
                    </div>

                    <div className="w-0 border-l mx-4"></div>

                    <div className="flex-1 flex flex-col mr-4 overflow-x-auto">
                      <div className="flex mt-2">
                        {[0, 1, 2].map((image, index) => {
                          const img = afterRowImages[index];
                          if (!img && !readonly) {
                            if (!afterPlaceholderUsed) {
                              afterPlaceholderUsed = true;
                              return (<AttachmentImage
                                readonly={readonly}
                                key={`after-${startIndex + index}`}
                                className="flex-1 aspect-square mr-6"
                                label={`Upload Foto Sesudah`}
                                width={200}
                                height={200}
                                onChange={(file: File) => {
                                  const newImage: TransactionReviewImage = {
                                    id: "",
                                    createdAt: "",
                                    createdBy: "",
                                    docType: "AFTER",
                                    trxNumber: transaction.trxNumber,
                                    docUrl: URL.createObjectURL(file),
                                    updatedAt: "",
                                    updatedBy: null,
                                    tempFile: file
                                  };

                                  const newImages = [...afterImages];
                                  newImages[startIndex + index] = newImage;
                                  setAfterImages(newImages);
                                }}
                                onDelete={() => {
                                  const newImages = afterImages.filter((_, i) => i !== startIndex + index);
                                  setAfterImages(newImages);
                                }}
                              />)
                            }
                            return (
                              <div className="flex-1 aspect-square mr-6"></div>
                            );
                          }

                          return (
                            <AttachmentImage
                              readonly={readonly}
                              key={`before-${startIndex + index}`}
                              src={afterRowImages[index]?.docUrl}
                              className="flex-1 aspect-square mr-6"
                              label={`Foto Sesudah`}
                              width={200}
                              height={200}
                              onDelete={() => {
                                const newImages = afterImages.filter((_, i) => i !== startIndex + index);
                                setAfterImages(newImages);
                              }}
                            />
                          )
                        })}
                      </div>
                    </div>
                  </div>
                );
              })
            }
          })
        }

      </div>

      {/*  */}
      {
        !readonly && (
          <>
            <div className="flex justify-end mt-6 gap-2">
              <Button
                loading={submitLoading}
                type="submit"
                variant="main"
                onClick={handleUpdate}
                disabled={submitLoading}
              >
                Update Data
              </Button>
            </div>
          </>
        )
      }
    </div>

    {/* center using flex */}
    {
      showInvoice && (
        <>
          {/* Overlay with backdrop */}
          <div
            className="fixed inset-0 z-[200] flex items-center justify-center bg-gray-900/50 dark:bg-gray-950/70 overflow-hidden"
          >
            {/* Loading Overlay - Fixed position above everything */}
            {isDownloadInvoice && (
              <div className="fixed inset-0 z-[250] bg-black/50 backdrop-blur-sm flex items-center justify-center">
                <div className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-xl flex flex-col items-center gap-3">
                  <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-mainColor"></div>
                  <p className="text-lg font-semibold text-gray-900 dark:text-gray-100">Mengunduh Invoice...</p>
                  <p className="text-sm text-gray-500 dark:text-gray-400">Mohon tunggu sebentar</p>
                </div>
              </div>
            )}

            {/* Modal Container - prevents background scroll */}
            <div className="relative w-full h-full flex flex-col items-center justify-center p-4 overflow-hidden"
              onClick={(e) => {
                // Close when clicking on the overlay background
                if (e.target === e.currentTarget) {
                  setShowInvoice(false);
                }
              }}
            >
              {/* Scrollable Invoice Container */}
              <div
                className="relative w-full max-w-[1200px] max-h-[calc(100vh-120px)] bg-gray-200 dark:bg-gray-800 rounded-lg overflow-y-auto overflow-x-hidden shadow-2xl"
              >
                <div id="invoice-container" className="invoice-container bg-white dark:bg-gray-900">
                  <div id="invoice" className="invoice bg-white dark:bg-gray-900">
                    {/* header */}
                    <div className="bg-mainColor p-4 flex items-center justify-between sticky top-0 z-10">
                      <h2 className="font-semibold text-mainDark">Invoice</h2>
                      <button
                        onClick={() => setShowInvoice(false)}
                        className="text-mainDark hover:text-mainDark/70 font-bold text-xl px-2"
                      >
                        ✕
                      </button>
                    </div>

                    <div className="bg-white dark:bg-gray-900 text-black dark:text-white px-4">
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
                            <div className="flex-1">
                              {/* cleaning list */}
                              {cleaningStaffList.length > 0 ? (
                                cleaningStaffList.map((staff) => (
                                  <div key={staff.lookupKey} className="inline-block m-1 text-sm bg-baseLight/50  text-teal-800 border-mainColor border mx-1 rounded-full px-2 py-0.5 flex-shrink-0">
                                    {staff.lookupValue}
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
                            <div className="flex-1">
                              {/* cleaning list */}
                              {blowerStaffList.length > 0 ? (
                                blowerStaffList.map((staff) => (
                                  <div key={staff.lookupKey} className="inline-block m-1 text-sm bg-baseLight/50  text-teal-800 border-mainColor border mx-1 rounded-full px-2 py-0.5 flex-shrink-0">
                                    {staff.lookupValue}
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
                        <div className="flex-1 flex items-center space-x-4 mr-6">
                          <img src="/assets/image.png" alt="Logo" width={200} height={100} />
                          <div className="">
                            <p className="font-semibold">Nama Rekening & No Rekening</p>
                            <p className=" text-gray-600 mb-4">a/n ({bankName}) {bankAccountName} - {bankAccount}</p>
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
                  {/* Download button - positioned outside invoice but inside modal */}
                  <div className="text-right px-6 pb-4">
                    <Button
                      className="shadow-lg"
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


            </div>
          </div>
        </>
      )
    }
  </>
}

