import { HeaderMobile } from "@shared/components/Header";
import { WrapperMobile } from "@shared/components/Wrapper";
import { Button } from "@ui-components/components/ui/button";
import { Textarea } from "@ui-components/components/ui/textarea";
import Link from "next/link";
import { FaRegCheckCircle } from "react-icons/fa";
import {  IoMdStar } from "react-icons/io";
export default function RatingPage() {
    return (
        <>
            <HeaderMobile label="Rating" />
            <WrapperMobile className="space-y-5">
                <div className=" w-full h-full bg-green-50 rounded-lg px-2 py-20 flex flex-col gap-2 items-center justify-center">
                    <FaRegCheckCircle className="text-green-600" size={24} />
                    <h1 className="text-green-600 font-semibold">
                        Pembayaran Berhasil
                    </h1>
                    <p className="text-neutral-500 text-xs">
                        Terimakasih sudah menggunakan layanan kami
                    </p>
                </div>

                <div className="space-y-3">
                    <p className="text-sm ">
                        Bagaimana pengalaman anda menggunakan layanan kami?
                    </p>
                    <div className="flex items-center justify-center gap-3">
                    <IoMdStar size={35} className="text-neutral-400" />
                    <IoMdStar size={35} className="text-neutral-400" />
                    <IoMdStar size={35} className="text-neutral-400" />
                    <IoMdStar size={35} className="text-neutral-400" />
                    <IoMdStar size={35} className="text-neutral-400" />
                    </div>
                </div>

                <div className="space-y-3">
                    <p className="font-semibold text-xs">
                        Masukkan terkait layanan
                    </p>
                    <Textarea
                        placeholder="Masukkan komentar"
                        className="resize-none"
                        rows={10}
                    />
                </div>


                <div className="py-0 w-full mt-auto flex items-center gap-2">
                    <Link
                        href={"/rating"}
                        className="w-1/2"

                    >
                        <Button
                            variant={"outline2"}
                            className="w-full"
                        >
                            Batal
                        </Button>
                    </Link>
                    <Link
                        href={"/rating"}
                        className="w-1/2"

                    >
                        <Button
                            variant={"main"}
                            className="w-full"
                        >
                            Kirim
                        </Button>
                    </Link>
                </div>
            </WrapperMobile>
        </>
    );
}
