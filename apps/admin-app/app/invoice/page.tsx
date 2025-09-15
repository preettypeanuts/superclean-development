"use client"

import Image from "next/image";
import { HeaderMobile } from "@shared/components/Header";
import { WrapperMobile } from "@shared/components/Wrapper";
import { Button } from "@ui-components/components/ui/button";
import { Label } from "@ui-components/components/ui/label";
import { BsClockHistory } from "react-icons/bs";
import { FaRegCheckCircle } from "react-icons/fa";
import { FaCloudArrowUp } from "react-icons/fa6";
import { IoMdStar } from "react-icons/io";
import { Input } from "@ui-components/components/ui/input";
import { Textarea } from "libs/ui-components/src/components/ui/textarea";

export default function InvoicePage() {
    return (
        <>
            <HeaderMobile label="Pembayaran" />
            <WrapperMobile className="space-y-5">
                <div className="flex items-center gap-2 text-mainColor">
                    <BsClockHistory />
                    <Label className="font-semibold">
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
                            Nominal
                        </Label>
                        <Label className="font-semibold">
                            RP 200.000
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

                <div className="space-y-3 py-5 bg-baseLight px-3 rounded-lg">
                    <p className="font-medium">
                        Bagaimana pengalaman anda menggunakan layanan kami?
                    </p>
                    <div className="flex items-center justify-center gap-3">
                        <IoMdStar size={35} className="text-muted-foreground/50" />
                        <IoMdStar size={35} className="text-muted-foreground/50" />
                        <IoMdStar size={35} className="text-muted-foreground/50" />
                        <IoMdStar size={35} className="text-muted-foreground/50" />
                        <IoMdStar size={35} className="text-muted-foreground/50" />
                    </div>
                </div>


                <div className="space-y-3">
                    <p className="font-medium">
                        Anda dapat memberi apresiasi kepada pekerja pembersih kami dengan memberikan tip.
                    </p>

                    <div className="grid grid-cols-2 gap-4">
                        <div className="px-4 py-2 border rounded-md">
                            Rp. 10.000
                        </div>
                        <div className="px-4 py-2 border rounded-md">
                            Rp. 20.000
                        </div>
                        <div className="px-4 py-2 border rounded-md">
                            Rp. 50.000
                        </div>
                        <div className="px-4 py-2 border rounded-md">
                            Rp. 100.000
                        </div>
                    </div>
                    <div className="space-y-2">
                        <p className="font-medium">
                            Masukkan Nominal Lain
                        </p>
                        <Input
                            placeholder="Rp Masukkan Jumlah"
                        />
                    </div>

                </div>

                 <div className="space-y-2">
                        <p className="font-medium">
                            Masukkan Terkait Layanan
                        </p>
                        <Textarea
                            placeholder="Rp Masukkan Jumlah"
                            rows={5}
                        />
                    </div>


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

                <div className="py-5 border-t w-full mt-auto">
                    <Button
                        variant={"main"}
                        className="w-full"
                    >
                        Lanjut Pembayaran
                    </Button>
                </div>
            </WrapperMobile>
        </>
    );
}
