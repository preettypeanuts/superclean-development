import Image from "next/image"
import { BiSolidPencil } from "react-icons/bi";
import { IoIosListBox } from "react-icons/io";
import { RiFolderHistoryFill } from "react-icons/ri";
import { AiFillStar } from "react-icons/ai";

export const HomeBanner = () => {
    return (
        <main className="relative">
            <section className="w-full h-[25vh] bg-gradient-to-r from-mainColor from-10% to-mainDark to-110% rounded-b-2xl flex items-center">
                <div className="mx-5 w-full">
                    <div className="flex items-center gap-3 w-full">
                        <Image
                            width={56}
                            height={56}
                            className="rounded-full object-cover aspect-square ring-[3px] ring-white"
                            src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=1064&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
                            alt=""
                        />
                        <div className="w-full">
                            <p className="text-base text-white">
                                Selamat datang,
                            </p>
                            <div className="w-full flex items-center justify-between">
                                <h1 className="text-[26px] text-white font-bold ">
                                    Mirna Putri
                                </h1>
                                <BiSolidPencil className="text-[23px] text-white" />
                            </div>
                        </div>
                    </div>
                </div>
            </section>
            <section className="absolute -bottom-[80px] left-1/2 -translate-x-1/2 w-full">
                <div className="flex justify-around">
                    <button
                        className="space-y-[8px]"
                    >
                        <div
                            className="rounded-full w-[60px] h-[60px] flex items-center justify-center bg-thirdColor text-white ring-[3px] ring-white"
                        >

                            <IoIosListBox size={35} />
                        </div>
                        <p className="font-semibold text-[14px]">
                            Daftar
                            <br />
                            SPK
                        </p>
                    </button>

                    <button
                        className="space-y-3"
                    >
                        <div
                            className="rounded-full w-[60px] h-[60px] flex items-center justify-center bg-thirdColor text-white ring-[3px] ring-white"
                        >

                            <RiFolderHistoryFill size={35} />
                        </div>
                        <p className="font-semibold text-[14px]">
                            Riwayat
                            <br />
                            SPK
                        </p>
                    </button>
                    <button
                        className="space-y-3 flex flex-col"
                    >
                        <div
                            className="rounded-full w-[60px] h-[60px] flex items-center justify-center bg-thirdColor text-white ring-[3px] ring-white"
                        >

                            <AiFillStar size={35} />
                        </div>
                        <p className="font-semibold text-[14px]">
                            Rating
                        </p>
                    </button>
                </div>
            </section>
        </main>
    )
}