"use client"

import { BiSolidPencil } from "react-icons/bi";
import { IoIosListBox } from "react-icons/io";
import { RiFolderHistoryFill } from "react-icons/ri";
import { AiFillStar } from "react-icons/ai";
import Link from "next/link";
import { useUserProfile } from "../../../../utils/useUserProfile";
import { IoPersonCircleSharp } from "react-icons/io5";

export const HomeBanner = () => {
    const { user, loading, error } = useUserProfile();

    return (
        <main className="min-h-[300px]">
            <section className="w-full h-[23vh] bg-gradient-to-r from-mainColor from-10% to-mainDark to-110% rounded-b-2xl flex items-center relative">
                <div className="mx-5 w-full">
                    <div className="flex items-center gap-3 w-full">
                        {/* Avatar with loading state */}
                        <div className="relative">
                            {loading ? (
                                <div className="w-[56px] h-[56px] rounded-full bg-white/20 animate-pulse ring-[3px] ring-white" />
                            ) : (
                                <p className="text-7xl text-white">
                                    <IoPersonCircleSharp />
                                </p>
                            )}
                        </div>

                        <div className="w-full">
                            <p className="text-base text-white">
                                Selamat datang,
                            </p>
                            <div className="w-full flex items-center justify-between">
                                {/* Name with loading/error states */}
                                {loading ? (
                                    <div className="h-8 bg-white/20 rounded animate-pulse w-32" />
                                ) : error ? (
                                    <h1 className="text-[26px] text-white font-bold">
                                        User
                                    </h1>
                                ) : (
                                    <h1 className="text-[26px] text-white font-bold">
                                        {user?.fullname || "User"}
                                    </h1>
                                )}
                                <BiSolidPencil className="text-[23px] text-white" />
                            </div>
                        </div>
                    </div>
                </div>

                {/* Action buttons section */}
                <section className="absolute -bottom-[80px] left-1/2 -translate-x-1/2 w-full">
                    <div className="flex justify-around">
                        <Link href="/daftar-spk">
                            <button className="space-y-[8px]">
                                <div className="rounded-full w-[60px] h-[60px] flex items-center justify-center bg-thirdColor text-white ring-[3px] ring-white">
                                    <IoIosListBox size={35} />
                                </div>
                                <p className="font-semibold text-[14px]">
                                    Daftar
                                    <br />
                                    SPK
                                </p>
                            </button>
                        </Link>

                        <Link href="/daftar-spk">
                            <button className="space-y-3">
                                <div className="rounded-full w-[60px] h-[60px] flex items-center justify-center bg-thirdColor text-white ring-[3px] ring-white">
                                    <RiFolderHistoryFill size={35} />
                                </div>
                                <p className="font-semibold text-[14px]">
                                    Riwayat
                                    <br />
                                    SPK
                                </p>
                            </button>
                        </Link>

                        <Link href="/rating">
                            <button className="space-y-3 flex flex-col">
                                <div className="rounded-full w-[60px] h-[60px] flex items-center justify-center bg-thirdColor text-white ring-[3px] ring-white">
                                    <AiFillStar size={35} />
                                </div>
                                <p className="font-semibold text-[14px]">
                                    Rating
                                </p>
                            </button>
                        </Link>
                    </div>
                </section>
            </section>
        </main>
    )
}