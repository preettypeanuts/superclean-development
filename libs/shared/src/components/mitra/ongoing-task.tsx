import { BsArrowRight } from "react-icons/bs";
import { AiFillCalendar } from "react-icons/ai";
import { AiFillClockCircle } from "react-icons/ai";
import { BsClipboard2CheckFill } from "react-icons/bs";
import Link from "next/link";

export const OngoingTask = () => {
    return (
        <main className="mx-5 space-y-[12px]">
            <section className="w-full flex items-center justify-between">
                <p className="text-[20px] font-medium tracking-tight">
                    Pekerjaan Berlangsung
                </p>
                <Link href="/daftar-spk">
                    <button className="text-[22px] w-[34px] h-[34px] flex items-center justify-center rounded-full bg-mainColor/20 text-mainDark">
                        <BsArrowRight />
                    </button>
                </Link>
            </section>
            <section className="w-full h-full p-2 space-y-2 rounded-lg bg-mainColor text-white">
                <p className="text-[14px] text-[400]">
                    Pekerjaan Yang Berlangsung
                </p>
                <div className="grid grid-cols-5 border-b border-bottom-dash pb-3">
                    <div className="col-span-4">
                        <h1 className="text-[20px] font-semibold">
                            Dewi Gita Putri
                        </h1>
                        <div className="text-[14px]">
                            <p>
                                Nomor Transaksi : TRX-001
                            </p>
                            <p className="truncate truncate-last-1">
                                Alamat: Lorem ipsum dolor sit amet consectetur adipisicing elit. Eum fugiat, provident vel, sunt necessitatibus explicabo quibusdam voluptate, facilis quis harum reiciendis laborum minima cum iure nostrum exercitationem veritatis error. Facilis!
                            </p>
                        </div>
                    </div>
                    <div className="col-span-1 w-full h-full flex items-center justify-end">
                        <div className="flex items-end justify-end">
                            <div className="w-[45px] h-[45px] aspect-square bg-white flex items-center justify-center rounded-md">
                                <div
                                    className="w-10 h-10 bg-mainColor"
                                    style={{
                                        mask: "url(/assets/SC_LogoOnlyBig.png) no-repeat center / contain",
                                        WebkitMask: "url(/assets/SC_LogoOnlyBig.png) no-repeat center / contain",
                                    }}
                                ></div>
                            </div>
                        </div>
                    </div>

                </div>
                <div className="flex items-center justify-between text-[14px] pt-1.5">
                    <div className="flex items-center gap-1">
                        <AiFillCalendar />
                        <p>
                            20/03/2025
                        </p>
                    </div>
                    <div className="flex items-center gap-1">
                        <AiFillClockCircle />
                        <p>
                            10:00 WIB
                        </p>
                    </div>
                    <div className="flex items-center gap-1 px-2 py-1 bg-white rounded-full text-secondaryColorDark">
                        <BsClipboard2CheckFill />
                        <p>
                            Menunggu Diproses
                        </p>
                    </div>
                </div>
            </section>
        </main>
    )
}