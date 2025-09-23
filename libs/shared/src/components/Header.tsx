"use client";
import { useRouter } from "next/navigation";
import { IoIosArrowBack } from "react-icons/io";
import { IoArrowBack } from "react-icons/io5";

type HeaderProps = {
    label: string;
    desc?: string;
    count?: number;
}

type HeaderMobileProps = HeaderProps & {
    withBackButton?: boolean;
    onBackClick?: () => void;
}

export const Header = ({ label, desc, count }: HeaderProps) => {
    return (
        <section className="flex gap-3 items-center w-[105%] border-b pb-3 -m-3 p-3">
            <div className="w-1 self-stretch rounded-full bg-mainColor"></div>
            <div>
                <h1 className="text-xl font-medium flex items-center gap-2">
                    {label}
                    <span className={`${!count && "hidden"} text-sm px-1 py-[1px] bg-mainColor/60 rounded-[5px]`}>
                        {count}
                    </span>
                </h1>
                <p className="opacity-70">
                    {desc}
                </p>
            </div>
        </section>
    )
}

export const HeaderMobile = ({ label, desc, count, withBackButton = true, onBackClick }: HeaderMobileProps) => {
    const router = useRouter();

    const handleBackClick = () => {
        if (onBackClick) {
            onBackClick();
        } else {
            router.back();
        }
    };

    return (
        <section className="navbar h-16 px-4">
            <div className="navbar-start">
                {withBackButton && (
                    <button
                        onClick={handleBackClick}
                        className="btn btn-ghost btn-circle btn-sm hover:bg-mainColor/20"
                        aria-label="Kembali"
                    >
                        <IoIosArrowBack className="text-lg" />
                    </button>
                )}
            </div>
            
            <div className="navbar-center">
                <h1 className="text-xl font-semibold flex items-center gap-2">
                    {label}
                    {count && (
                        <span className="text-sm px-2 py-1 bg-mainColor/60 rounded-[5px]">
                            {count}
                        </span>
                    )}
                </h1>
            </div>
            
            <div className="navbar-end">
                {/* Space for additional buttons if needed */}
            </div>
            
            {desc && (
                <div className="absolute top-full left-4 right-4 mt-1">
                    <p className="text-sm opacity-70 text-center">
                        {desc}
                    </p>
                </div>
            )}
        </section>
    )
}
