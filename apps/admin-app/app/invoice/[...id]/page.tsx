"use client"

import { CopyIcon } from "@radix-ui/react-icons";
import { HeaderMobile } from "@shared/components/Header";
import { WrapperMobile } from "@shared/components/Wrapper";
import { api } from "@shared/utils/apiClient";
import { apiFormdata } from "@shared/utils/apiFormdataClient";
import { formatRupiah } from "@shared/utils/formatRupiah";
import { Button } from "@ui-components/components/ui/button";
import { Input } from "@ui-components/components/ui/input";
import { Label } from "@ui-components/components/ui/label";
import { Textarea } from "@ui-components/components/ui/textarea";
import { Parameter } from "apps/admin-app/app/pengaturan/page";
import { Transaction } from "apps/admin-app/app/transaksi/spk/edit/[...id]/page";
import { ChevronUp } from "lucide-react";
import Image from "next/image";
import { usePathname, useSearchParams } from "next/navigation";
import { Dispatch, SetStateAction, useEffect, useMemo, useState } from "react";
import { BsClockHistory } from "react-icons/bs";
import { FaRegCheckCircle } from "react-icons/fa";
import { FaCloudArrowUp } from "react-icons/fa6";
import { IoMdStar } from "react-icons/io";

const AUTH_REQUEST_ID = process.env.NEXT_PUBLIC_AUTH_HEADER;

interface Review {
  rating: number;
  tip: number;
  review: string;
  paymentProof?: File | null;
}

function InvoicePreview({
  transaction,
  reviewData,
  setReviewData,
}: {
  transaction: Transaction,
  reviewData: Review,
  setReviewData: Dispatch<SetStateAction<Review>>,
}) {
  const [isOpen, setIsOpen] = useState(false);

  const handleStarChange = (newStarRating: number) => {
    setReviewData(prev => ({
      ...prev,
      rating: newStarRating,
    }))
  }

  const handleTipChange = (e: React.MouseEvent<HTMLButtonElement>, newTip: number) => {
    e.preventDefault();

    if (reviewData.tip === newTip) {
      newTip = 0; // Deselect if the same tip is clicked
    }

    setReviewData(prev => ({
      ...prev,
      tip: newTip,
    }))
  }

  const handleManualTipChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.replace(/\D/g, '');
    const numericValue = parseInt(value, 10) || 0;
    setReviewData(prev => ({
      ...prev,
      tip: numericValue,
    }))
  }

  const handleReviewChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const value = e.target.value;
    setReviewData(prev => ({
      ...prev,
      review: value,
    }))
  }

  return (
    <>
      <HeaderMobile withBackButton={false} label="Pembayaran" />
      <WrapperMobile className="space-y-5 pb-24">
        <div className="flex items-center gap-2 text-mainColor">
          <BsClockHistory />
          <Label className="font-bold">
            Menunggu Pembayaran
          </Label>
        </div>

        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <Label>
              Nomor transaksi
            </Label>
            <Label className="font-semibold">
              {transaction?.trxNumber}
            </Label>
          </div>
          <div className="flex items-center justify-between">
            <Label>
              Nominal
            </Label>
            <Label className="font-semibold">
              {transaction.finalPrice?.toLocaleString('id-ID', {
                style: 'currency', currency: 'IDR', minimumFractionDigits: 0, maximumFractionDigits: 0
              })}
            </Label>
          </div>
          <div className="flex items-center justify-between">
            <Label>
              Tanggal transaksi
            </Label>
            <Label className="font-semibold">
              {new Date(transaction?.trxDate).toLocaleDateString('en-GB')}
            </Label>
          </div>
        </div>

        {/* list item */}
        <div>
          <div className="flex justify-between items-center mb-2">
            <p className="text-sm font-semibold text-secondaryColorDark">
              List Item Pengerjaan
            </p>

            <div>
              {
                isOpen ? (
                  <ChevronUp className="w-4 h-4 text-secondaryColorDark" onClick={() => setIsOpen(!isOpen)} />
                ) : (
                  <ChevronUp className="w-4 h-4 text-secondaryColorDark rotate-180" onClick={() => setIsOpen(!isOpen)} />
                )
              }
            </div>
          </div>

          {isOpen && (
            <div className="space-y-2">
              {transaction.details.map((detail, index) => (
                <div key={index} className="flex items-center justify-between">
                  <div className="flex flex-col">
                    <p className="text-sm font-semibold">
                      {detail.service.name}
                    </p>
                    <p className="text-xs text-secondaryColorDark">
                      {detail.quantity} {detail.service.unit}
                    </p>
                  </div>
                  <p className="text-sm font-semibold">
                    {detail.totalPrice.toLocaleString('id-ID', {
                      style: 'currency', currency: 'IDR', minimumFractionDigits: 0, maximumFractionDigits: 0
                    })}
                  </p>
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="space-y-3 bg-baseLight/50 p-4 rounded-md">
          <p className="text-sm font-semibold">
            Bagaimana pengalaman anda menggunakan layanan kami?
          </p>
          <div className="flex items-center justify-center gap-3">
            {[1, 2, 3, 4, 5].map((star) => (
              <IoMdStar
                key={star}
                size={35}
                onClick={() => handleStarChange(star)}
                className={reviewData.rating >= star ? "text-yellow-500 cursor-pointer" : "text-neutral-300 cursor-pointer"}
              />
            ))}
          </div>
        </div>

        <div className="space-y-3">
          <p className="text-sm font-semibold">
            Anda dapat memberi apresiasi kepada pekerja pembersih kami dengan memberikan tip.
          </p>
          <div className="grid grid-cols-2 gap-4">
            <button onClick={(e) => handleTipChange(e, 20000)} className={reviewData.tip === 20000 ? "bg-mainColor text-white rounded-md py-2" : "border border-neutral-300 rounded-md py-2"}>
              Rp 20.000
            </button>
            <button onClick={(e) => handleTipChange(e, 30000)} className={reviewData.tip === 30000 ? "bg-mainColor text-white rounded-md py-2" : "border border-neutral-300 rounded-md py-2"}>
              Rp 30.000
            </button>
            <button onClick={(e) => handleTipChange(e, 50000)} className={reviewData.tip === 50000 ? "bg-mainColor text-white rounded-md py-2" : "border border-neutral-300 rounded-md py-2"}>
              Rp 50.000
            </button>
            <button onClick={(e) => handleTipChange(e, 100000)} className={reviewData.tip === 100000 ? "bg-mainColor text-white rounded-md py-2" : "border border-neutral-300 rounded-md py-2"}>
              Rp 100.000
            </button>
          </div>
        </div>

        <div className="space-y-1">
          <p className="text-sm font-semibold">
            Tip Nominal Lain
          </p>
          <Input
            placeholder="Rp. Nominal Lain"
            value={formatRupiah(reviewData.tip || 0)}
            onChange={handleManualTipChange}
          />
        </div>

        <div className="space-y-1">
          <p className="text-sm font-semibold">
            Masukkan Terkait Layanan
          </p>
          <Textarea
            rows={4}
            value={reviewData.review}
            placeholder="Tulis sesuatu..."
            onChange={handleReviewChange}
          />
        </div>

        <div className="fixed bottom-0 right-0 left-0">
          <div className="p-4 bg-white/50 backdrop-blur-md">
            <Button
              variant={"main"}
              className="w-full"
              disabled={reviewData.rating === 0}
              onClick={() => {
                const pathname = window.location.pathname;
                const newUrl = `${pathname}?step=payment`;
                window.history.pushState(null, '', newUrl);
              }}
            >
              Lanjut Pembayaran
            </Button>
          </div>
        </div>
      </WrapperMobile>
    </>
  );
}

function PaymentPreview({
  transaction,
  reviewData,
  setReviewData,
  handleComplete,
  parameters
}: {
  transaction: Transaction,
  reviewData: Review,
  setReviewData: Dispatch<SetStateAction<Review>>,
  handleComplete: () => Promise<any>,
  parameters: Parameter[]
}) {
  const pathname = usePathname();
  const [loading, setLoading] = useState<boolean>(false);
  const [paymentProof, setPaymentProof] = useState<File | null>(null);
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    paymentProof && setReviewData(prev => ({ ...prev, paymentProof: paymentProof }))
  }, [paymentProof, setReviewData]);


  const handleCompletePayment = async () => {
    if (!handleComplete) return;
    if (!paymentProof) {
      alert("Silahkan unggah bukti pembayaran terlebih dahulu");
      return;
    }
    if (loading) return;

    try {
      setLoading(true);

      await handleComplete();

      const pathname = window.location.pathname;
      const newUrl = `${pathname}?step=complete`;
      window.history.pushState(null, '', newUrl);
    }
    catch (error) {

    }
    finally {
      setLoading(false)
    }
  }

  const bankAccountParam = parameters.find(param => param.paramKey === "BANK_ACCOUNT_NUMBER");
  const bankAccount = bankAccountParam ? bankAccountParam.paramValue : "0000000000";

  const bankAccountNameParam = parameters.find(param => param.paramKey === "BANK_ACCOUNT_NAME");
  const bankAccountName = bankAccountNameParam ? bankAccountNameParam.paramValue : "Nama Bank";

  const bankNameParam = parameters.find(param => param.paramKey === "BANK_NAME");
  const bankName = bankNameParam ? bankNameParam.paramValue : "Bank";

  return (
    <>
      <HeaderMobile label="Pembayaran" onBackClick={() => {
         const newUrl = pathname;
         window.history.replaceState(null, '', newUrl);
      }}/>
      <WrapperMobile className="space-y-5 pb-24">
        <div className="flex items-center gap-2 text-mainColor">
          <BsClockHistory />
          <Label className="font-bold">
            Menunggu Pembayaran
          </Label>
        </div>

        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <Label>
              Nomor transaksi
            </Label>
            <Label className="font-semibold">
              {transaction?.trxNumber}
            </Label>
          </div>
          <div className="flex items-center justify-between">
            <Label>
              Nominal
            </Label>
            <Label className="font-semibold">
              {transaction.finalPrice?.toLocaleString('id-ID', {
                style: 'currency', currency: 'IDR', minimumFractionDigits: 0, maximumFractionDigits: 0
              })}
            </Label>
          </div>
          <div className="flex items-center justify-between">
            <Label>
              Tip
            </Label>
            <Label className="font-semibold">
              {reviewData.tip?.toLocaleString('id-ID', {
                style: 'currency', currency: 'IDR', minimumFractionDigits: 0, maximumFractionDigits: 0
              })}
            </Label>
          </div>
          <div className="flex items-center justify-between">
            <Label>
              Tanggal transaksi
            </Label>
            <Label className="font-semibold">
              {new Date(transaction?.trxDate).toLocaleDateString('en-GB')}
            </Label>
          </div>
        </div>

        {/* list item */}
        <div>
          <div className="flex justify-between items-center mb-2">
            <p className="text-sm font-semibold text-secondaryColorDark">
              List Item Pengerjaan
            </p>

            <div>
              {
                isOpen ? (
                  <ChevronUp className="w-4 h-4 text-secondaryColorDark" onClick={() => setIsOpen(!isOpen)} />
                ) : (
                  <ChevronUp className="w-4 h-4 text-secondaryColorDark rotate-180" onClick={() => setIsOpen(!isOpen)} />
                )
              }
            </div>
          </div>

          {isOpen && (
            <div className="space-y-2">
              {transaction.details.map((detail, index) => (
                <div key={index} className="flex items-center justify-between">
                  <div className="flex flex-col">
                    <p className="text-sm font-semibold">
                      {detail.service.name}
                    </p>
                    <p className="text-xs text-secondaryColorDark">
                      {detail.quantity} {detail.service.unit}
                    </p>
                  </div>
                  <p className="text-sm font-semibold">
                    {detail.totalPrice.toLocaleString('id-ID', {
                      style: 'currency', currency: 'IDR', minimumFractionDigits: 0, maximumFractionDigits: 0
                    })}
                  </p>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* dotted divider with gap of 2px */}
        <div className="grid grid-cols-5 pb-3 border-b border-bottom-dash border-gray-500"></div>


        <div className="flex flex-col justify-between border-dotted pt-2">
          <div className="flex items-center gap-2">
            <Label className="font-bold uppercase text-mainDark">
              Total Pembayaran
            </Label>
          </div>
          <Label className="font-bold text-right text-2xl text-mainDark">
            {(transaction.finalPrice + (reviewData.tip || 0))?.toLocaleString('id-ID', {
              style: 'currency', currency: 'IDR', minimumFractionDigits: 0, maximumFractionDigits: 0
            })}
          </Label>
        </div>

        <div className="flex flex-col justify-center gap-3 w-full">
          <div className="p-2 w-full md:max-w-md m-auto">
            <Image
              width={500}
              height={500}
              className="w-full h-full  aspect-square"
              src="/assets/qris_updated.jpeg"
              alt="Qris barcode"
            />
          </div>

          <div className="flex flex-1 flex-col">
            <p className="font-light mb-1">Nomor Rekening</p>

            <div className="flex" onClick={() => {
              navigator.clipboard.writeText(bankAccount);
              alert("Nomor rekening berhasil disalin");
            }}>
              <div className="flex flex-1 flex-col">
                <p className="font-bold flex-1">{bankAccount}</p>
                <p className="text-xs text-secondaryColorDark">({bankName}) {bankAccountName}</p>
              </div>
              <p className="text-right">
                <CopyIcon className="ml-2 cursor-pointer font-bold" />
              </p>
            </div>
          </div>

          <Label className="text-xs text-secondaryColorDark">
            Setelah melakukan pembayaran mohon untuk unggah bukti pembayaran
          </Label>
        </div>

        <div className="flex items-center gap-2 text-mainColor">
          <FaRegCheckCircle />
          <Label className="font-semibold">
            Konfirmasi Pembayaran
          </Label>
        </div>

        <div className="flex items-center justify-between">
          <div className="flex flex-col">
            <Label className="my-2">
              Unggah Bukti Pembayaran
            </Label>

            <Label className="text-xs text-secondaryColorDark mb-2">
              {paymentProof ? paymentProof.name : "Belum ada file yang diunggah"}
            </Label>
          </div>
          <Button className="relative">
            <input type="file" accept="image/*" className="absolute inset-0 w-full h-full opacity-0 cursor-pointer aspect-square"
              onChange={() => {
                const fileInput = document.querySelector('input[type="file"]') as HTMLInputElement;

                const ALLOWED_FILE_SIZE = 5 * 1024 * 1024; // 5MB

                if (fileInput && fileInput.files && fileInput.files[0]) {
                  if (fileInput.files[0].size > ALLOWED_FILE_SIZE) {
                    alert("Ukuran file terlalu besar. Maksimal ukuran file adalah 5MB.");
                    return;
                  }

                  setPaymentProof(fileInput.files[0]);
                }
              }} />
            <FaCloudArrowUp />
            Unggah Foto
          </Button>
        </div>

        <div className="fixed bottom-0 right-0 left-0">
          <div className="p-4 bg-white/50 backdrop-blur-md">

            <Button
              variant={"main"}
              className="w-full"
              disabled={!paymentProof || loading}
              onClick={() => handleCompletePayment()}
              loading={loading}
            >

              Konfirmasi
            </Button>
          </div>
        </div>
      </WrapperMobile>
    </>
  );
}

function PaymentStatus() {
  return (
    <>
      <HeaderMobile withBackButton={false} label="Pembayaran" />
      <WrapperMobile className="space-y-5 flex items-center justify-center">
        <div className="w-full h-[80vh] bg-green-50 rounded-lg px-2 py-20 flex flex-col gap-2 items-center justify-center">
          <div className="p-3 bg-green-200 rounded-full">
            <div className="p-3 bg-green-300/70 rounded-full">
              <FaRegCheckCircle className="text-green-700" size={30} />
            </div>
          </div>
          <h1 className="text-green-700 font-bold text-xl">
            Selesai
          </h1>
          <p className="text-neutral-500 text-xs text-center">
            Terima kasih sudah menggunakan layanan kami dan telah memberikan rating
          </p>
        </div>
      </WrapperMobile>
    </>
  )
}

export default function InvoicePage() {
  const pathname = usePathname();
  const id = useMemo(() => {
    return pathname.split("/invoice/").pop();
  }, []);

  const [transaction, setTransaction] = useState<Transaction>(null as any);
  const [parameters, setParameters] = useState<Parameter[]>([]);
  const [loading, setLoading] = useState(false);

  const [reviewData, setReviewData] = useState<Review>({
    rating: 0,
    tip: 0,
    paymentProof: null,
    review: ""
  });


  const handleComplete = async () => {
    const tipAmount = reviewData.tip || 0;

    const reviewPayload = {
      rating: reviewData.rating,
      tipAmount,
      notes: reviewData.review || "",
    }

    // todo: send review
    await api.put(`/transaction/${transaction.id}/review`, reviewPayload);

    // todo: send payment proof
    if (reviewData.paymentProof) {
      const formData = new FormData();
      formData.append("file", reviewData.paymentProof);
      formData.append("docType", "PAYMENT");

      await apiFormdata.post(`/transaction/${transaction.id}/documents`, formData);
    }

    // todo: update transaction status to completed
    await api.put(`/transaction/${transaction.id}/status`, {
      status: 4, // payment complete
    }, {
      headers: {
        "X-Auth-Request-Id": AUTH_REQUEST_ID || "",
      }
    });

  }

  const searchParams = useSearchParams();
  const step: "" | "payment" | "complete" = searchParams.get('step') as any || '';

  // Fetch transaction data
  useEffect(() => {
    const fetchTransaction = async () => {
      try {
        const result = await api.get(`/transaction/detail?trxNumber=${id}`);
        const transactionData = result.data as Transaction
        setTransaction(transactionData);
        setReviewData({
          rating: transactionData.rating ?? 0,
          review: transactionData.review ?? '',
          tip: 0
        })
      } catch (error) {
        console.error("Gagal mengambil data transaksi:", error);
      } finally {
        setLoading(false);
      }
    };

    const fetchBankAccount = async () => {
      try {
        const result = await api.get(`/parameter/app-settings`);
        const parameters = result.data as Array<Parameter>;

        if (parameters && parameters.length > 0) {
          setParameters(parameters);
        }
      } catch (error) {
        console.error("Gagal mengambil data rekening bank:", error);
      }
    }

    if (id) {
      fetchTransaction();
      fetchBankAccount();
    }
  }, [id]);

  if (loading || !transaction) {
    return <>
      <div className="flex items-center justify-center h-screen">
        <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-mainColor"></div>
      </div>;
    </>
  }

  if (step === 'payment') {
    return (
      <PaymentPreview
        transaction={{ ...transaction }}
        reviewData={reviewData}
        setReviewData={setReviewData}
        handleComplete={handleComplete}
        parameters={parameters}
      />
    )
  }

  if (step === 'complete') {
    return (
      <PaymentStatus />
    )
  }

  return (
    <InvoicePreview
      transaction={{ ...transaction }}
      reviewData={reviewData}
      setReviewData={setReviewData}
    />
  )
}
