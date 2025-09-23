"use client"

import { HeaderMobile } from "@shared/components/Header";
import { WrapperMobile } from "@shared/components/Wrapper";
import { Button } from "@ui-components/components/ui/button";
import { Label } from "@ui-components/components/ui/label";
import { BsClockHistory } from "react-icons/bs";
import { IoMdStar } from "react-icons/io";
import { Input } from "@ui-components/components/ui/input";
import { Textarea } from "@ui-components/components/ui/textarea";
import Link from "next/link";

export default function InvoicePage() {
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
                </div>

                <div className="space-y-3 bg-baseLight/50 p-4 rounded-md">
                    <p className="text-sm font-semibold">
                        Bagaimana pengalaman anda menggunakan layanan kami?
                    </p>
                    <div className="flex items-center justify-center gap-3">
                        <IoMdStar size={35} className="text-neutral-300" />
                        <IoMdStar size={35} className="text-neutral-300" />
                        <IoMdStar size={35} className="text-neutral-300" />
                        <IoMdStar size={35} className="text-neutral-300" />
                        <IoMdStar size={35} className="text-neutral-300" />
                    </div>
                </div>

                <div className="space-y-3">
                    <p className="text-sm font-semibold">
                        Anda dapat memberi apresiasi kepada pekerja pembersih kami dengan memberikan tip.
                    </p>
                    <div className="grid grid-cols-2 gap-4">
                        <button className="w-full p-2 rounded-md border">
                            Rp 10.000
                        </button>
                        <button className="w-full p-2 rounded-md border">
                            Rp 20.000
                        </button>
                        <button className="w-full p-2 rounded-md border">
                            Rp 50.000
                        </button>
                        <button className="w-full p-2 rounded-md border">
                            Rp 100.000
                        </button>
                    </div>
                </div>

                <div className="space-y-1">
                    <p className="text-sm font-semibold">
                        Masukkan Nominal Lain
                    </p>
                    <Input
                        placeholder="Rp. Masukkan Jumlah"
                    />
                </div>

                <div className="space-y-1">
                    <p className="text-sm font-semibold">
                        Masukkan Terkait Layanan
                    </p>
                    <Textarea
                        rows={4}
                        placeholder="Rp. Masukkan Jumlah"
                    />
                </div>

                {/* <div className="flex flex-col items-center justify-center gap-3 w-full">
                    <div className="shadow-secondaryShadow rounded-lg p-2 w-full md:max-w-md">
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
                </div> */}

                {/* <div className="flex items-center gap-2">
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
                </div> */}

                <div className="fixed bottom-0 right-0 left-0">
                    <div className="p-4 bg-white/50 backdrop-blur-md">
                        <Link
                            href="/invoice/001/payment"
                        >
                            <Button
                                variant={"main"}
                                className="w-full"
                            >
                                Lanjut Pembayaran
                            </Button>
                        </Link>
                    </div>
                </div>
            </WrapperMobile>
        </>
    );
}
