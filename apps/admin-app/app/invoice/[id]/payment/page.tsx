"use client"

import Image from "next/image";
import { HeaderMobile } from "@shared/components/Header";
import { WrapperMobile } from "@shared/components/Wrapper";
import { Button } from "@ui-components/components/ui/button";
import { Label } from "@ui-components/components/ui/label";
import { BsClockHistory } from "react-icons/bs";
import { FaInfoCircle, FaRegCheckCircle } from "react-icons/fa";
import { FaCloudArrowUp } from "react-icons/fa6";
import { IoMdStar } from "react-icons/io";
import { Input } from "@ui-components/components/ui/input";
import { Textarea } from "@ui-components/components/ui/textarea";
import Link from "next/link";

export default function PaymentPage() {
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
                            TRX-001
                        </Label>
                    </div>
                    <div className="flex items-center justify-between">
                        <Label>
                            Tanggal transaksi
                        </Label>
                        <Label className="font-semibold">
                            25/05/2025
                        </Label>
                    </div>
                </div>
                <div className="space-y-2 p-2 bg-baseLight/50 rounded-md">
                    <div className="flex items-center justify-between">
                        <Label>
                            Nominal
                        </Label>
                        <Label className="font-semibold">
                            RP 200.000
                        </Label>
                    </div>
                    <div className="flex items-center justify-between">
                        <Label>
                            Tip
                        </Label>
                        <Label className="font-semibold">
                            RP 10.000
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
                            RP 210.000
                        </Label>
                    </div>
                </div>

                <div className="flex flex-col items-center justify-center gap-3 w-full">
                    <div className="p-2 w-full md:max-w-md">
                        <Image
                            width={500}
                            height={500}
                            className="w-full h-full  aspect-square  "
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
                    <Label>
                        Unggah Bukti Pembayaran
                    </Label>
                    <Button>
                        <FaCloudArrowUp />
                        Unggah Foto
                    </Button>
                </div>

                <div className="fixed bottom-0 right-0 left-0">
                    <div className="p-4 bg-white/50 backdrop-blur-md">
                        <Link
                            href="/invoice/001/payment/status"
                        >
                            <Button
                                variant={"main"}
                                className="w-full"
                            >
                                Konfirmasi
                            </Button>
                        </Link>
                    </div>
                </div>
            </WrapperMobile>
        </>
    );
}
