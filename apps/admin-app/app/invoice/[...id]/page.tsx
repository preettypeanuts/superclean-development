"use client"

import { HeaderMobile } from "@shared/components/Header";
import { WrapperMobile } from "@shared/components/Wrapper";
import { api } from "@shared/utils/apiClient";
import { apiFormdata } from "@shared/utils/apiFormdataClient";
import { formatRupiah } from "@shared/utils/formatRupiah";
import { Button } from "@ui-components/components/ui/button";
import { Input } from "@ui-components/components/ui/input";
import { Label } from "@ui-components/components/ui/label";
import { Textarea } from "@ui-components/components/ui/textarea";
import { Transaction } from "apps/admin-app/app/transaksi/spk/edit/[...id]/page";
import Image from "next/image";
import { usePathname, useSearchParams } from "next/navigation";
import { Dispatch, SetStateAction, useEffect, useMemo, useState } from "react";
import { BsClockHistory } from "react-icons/bs";
import { FaInfoCircle, FaRegCheckCircle } from "react-icons/fa";
import { FaCloudArrowUp } from "react-icons/fa6";
import { IoMdStar } from "react-icons/io";

const AUTH_REQUEST_ID = process.env.NEXT_PUBLIC_AUTH_HEADER;

interface Review {
  rating: number;
  tip: number;
  review: string;
  manualTip?: number;
  paymentProof?: File | null;
}

function InvoicePreview({
  transaction,
  reviewData,
  setReviewData
}: {
  transaction: Transaction,
  reviewData: Review,
  setReviewData: Dispatch<SetStateAction<Review>>
}) {
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
      manualTip: numericValue,
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
              Tanggal transaksi
            </Label>
            <Label className="font-semibold">
              {new Date(transaction?.trxDate).toLocaleDateString('en-GB')}
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
          {/* <div className="flex items-center justify-between">
            <Label>
              Tip
            </Label>
            <Label className="font-semibold">
              RP 10.000
            </Label>
          </div> */}
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
            <button onClick={(e) => handleTipChange(e, 10000)} className={reviewData.tip === 10000 ? "bg-mainColor text-white rounded-md py-2" : "border border-neutral-300 rounded-md py-2"}>
              Rp 10.000
            </button>
            <button onClick={(e) => handleTipChange(e, 20000)} className={reviewData.tip === 20000 ? "bg-mainColor text-white rounded-md py-2" : "border border-neutral-300 rounded-md py-2"}>
              Rp 20.000
            </button>
            <button onClick={(e) => handleTipChange(e, 50000)} className={reviewData.tip === 50000 ? "bg-mainColor text-white rounded-md py-2" : "border border-neutral-300 rounded-md py-2"}>
              Rp 50.000
            </button>
            <button onClick={(e) => handleTipChange(e, 100000)} className={reviewData.tip === 100000 ? "bg-mainColor text-white rounded-md py-2" : "border border-neutral-300 rounded-md py-2"}>
              Rp 100.000
            </button>
          </div>
        </div>

        {
          reviewData.tip === 0 && (
            <div className="space-y-1">
              <p className="text-sm font-semibold">
                Masukkan Nominal Lain
              </p>
              <Input
                placeholder="Rp. Masukkan Jumlah"
                value={formatRupiah(reviewData.manualTip || 0)}
                onChange={handleManualTipChange}
              />
            </div>
          )
        }

        <div className="space-y-1">
          <p className="text-sm font-semibold">
            Masukkan Terkait Layanan
          </p>
          <Textarea
            rows={4}
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
}: {
  transaction: Transaction,
  reviewData: Review,
  setReviewData: Dispatch<SetStateAction<Review>>
  handleComplete: () => Promise<any>
}) {
  const [loading, setLoading] = useState<boolean>(false);
  const [paymentProof, setPaymentProof] = useState<File | null>(null);

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

  return (
    <>
      <HeaderMobile label="Pembayaran" />
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
              Tanggal transaksi
            </Label>
            <Label className="font-semibold">
              {new Date(transaction?.trxDate).toLocaleDateString('en-GB')}
            </Label>
          </div>
        </div>
        <div className="space-y-2 p-2 bg-baseLight/50 rounded-md">
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
          <div className="flex items-center justify-between border-t pt-2">
            <div className="flex items-center gap-2">
              <FaInfoCircle />
              <Label className="font-bold uppercase">
                Total Pembayaran
              </Label>
            </div>
            <Label className="font-bold">
              {(transaction.finalPrice + (reviewData.tip || 0))?.toLocaleString('id-ID', {
                style: 'currency', currency: 'IDR', minimumFractionDigits: 0, maximumFractionDigits: 0
              })}
            </Label>
          </div>
        </div>

        <div className="flex flex-col items-center justify-center gap-3 w-full">
          <div className="p-2 w-full md:max-w-md">
            <Image
              width={500}
              height={500}
              className="w-full h-full  aspect-square"
              src="/assets/qris.png"
              alt="Qris barcode"
            />
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
                if (fileInput && fileInput.files && fileInput.files[0]) {
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

function PaymentStatus({ }) {
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
  const [loading, setLoading] = useState(false);

  const [reviewData, setReviewData] = useState<Review>({
    rating: 0,
    tip: 0,
    manualTip: 0,
    paymentProof: null,
    review: ""
  });


  const handleComplete = async () => {
    const tip = reviewData.tip ? reviewData.tip : reviewData.manualTip

    const reviewPayload = {
      rating: reviewData.rating,
      tipAmount: tip || 0,
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

  if (step !== 'complete' && transaction?.status === 4) {
    // redirect to complete if transaction already paid
    const newUrl = `${pathname}?step=complete`;
    window.history.replaceState(null, '', newUrl);
  }
  else if (step !== '' && reviewData.rating === 0 && transaction?.status !== 4) {
    // reset query param
    const newUrl = pathname;
    window.history.replaceState(null, '', newUrl);
  }

  // Fetch transaction data
  useEffect(() => {
    const fetchTransaction = async () => {
      try {
        const result = await api.get(`/transaction/detail?trxNumber=${id}`);
        const transactionData = result.data as Transaction
        setTransaction(transactionData);

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

  if (loading || !transaction) {
    return <div>Loading...</div>;
  }

  if (step === 'payment') {
    return (
      <PaymentPreview
        transaction={{ ...transaction }}
        reviewData={reviewData}
        setReviewData={setReviewData}
        handleComplete={handleComplete}
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
