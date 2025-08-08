import { BsArrowRight } from "react-icons/bs";
import { AiFillCalendar } from "react-icons/ai";
import { AiFillClockCircle } from "react-icons/ai";
import { BsClipboard2CheckFill } from "react-icons/bs";

export const TotalRating = () => {
    return (
        <main className="mx-5 space-y-3">
            <section className="w-full flex items-center justify-between">
                <p className="text-[20px] font-medium tracking-tight">
                    Total Rating
                </p>
                <button className="text-[22px] w-[34px] h-[34px] flex items-center justify-center rounded-full bg-mainColor/20 text-mainDark">
                    <BsArrowRight />
                </button>
            </section>
            <section className="grid grid-cols-2 gap-3">
                <div className="w-full h-full p-3 border rounded-lg space-y-2">
                    <div className="border-b border-bottom-dash !border-neutral-400 border-opacity-30 pb-3">
                        <div className="w-[22px] h-[22px] aspect-square bg-mainColor flex items-center justify-center rounded-sm">
                            <div
                                className="w-4 h-4 bg-white"
                                style={{
                                    mask: "url(/assets/SC_LogoOnlyBig.png) no-repeat center / contain",
                                    WebkitMask: "url(/assets/SC_LogoOnlyBig.png) no-repeat center / contain",
                                }}
                            ></div>
                        </div>
                        <p className="text-muted-foreground text-[14px]">
                            Riwayat Pengerjaan
                        </p>
                        <h1 className="text-[20px] font-semibold tracking-tight">
                            Kategori: Cuci & Vacum
                        </h1>
                    </div>
                    <div>
                        <div className="flex flex-col gap-1 text-[14px] pt-1.5">
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
                            <div className="w-full flex items-center gap-1 text-success">
                                <BsClipboard2CheckFill />
                                <p>
                                    Selesai
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
                <div className="w-full h-full p-3 border rounded-lg space-y-2">
                    <div className="border-b border-bottom-dash !border-neutral-400 border-opacity-30 pb-3">
                        <div className="w-[22px] h-[22px] aspect-square bg-mainColor flex items-center justify-center rounded-sm">
                            <div
                                className="w-4 h-4 bg-white"
                                style={{
                                    mask: "url(/assets/SC_LogoOnlyBig.png) no-repeat center / contain",
                                    WebkitMask: "url(/assets/SC_LogoOnlyBig.png) no-repeat center / contain",
                                }}
                            ></div>
                        </div>
                        <p className="text-muted-foreground text-[14px]">
                            Riwayat Pengerjaan
                        </p>
                        <h1 className="text-[20px] font-semibold tracking-tight">
                            Kategori: Cuci & Vacum
                        </h1>
                    </div>
                    <div>
                        <div className="flex flex-col gap-1 text-[14px] pt-1.5">
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
                            <div className="w-full flex items-center gap-1 text-red-600">
                                <BsClipboard2CheckFill />
                                <p>
                                    Batal
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </section>
        </main>
    )
}