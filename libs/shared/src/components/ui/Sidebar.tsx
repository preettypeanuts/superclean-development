"use client";
import Link from "next/link";
import { useEffect, useState } from "react";
import { navigationItems } from "../../data/system";
import { IoIosArrowDown } from "react-icons/io";
import { TbLayoutSidebarLeftExpandFilled, TbLayoutSidebarRightExpandFilled } from "react-icons/tb";
import { ThemeSwitch } from "./ThemeSwitch";
import { usePathname, useRouter } from "next/navigation";
import { IoReloadOutline } from "react-icons/io5";
import { useUserProfile } from "../../../../utils/useUserProfile";
import {
    DropdownMenu,
    DropdownMenuTrigger,
    DropdownMenuContent,
    DropdownMenuLabel,
    DropdownMenuItem,
    DropdownMenuSeparator,
} from "../../../../ui-components/src/components/ui/dropdown-menu";
import { RiLogoutCircleFill, RiUserFill } from "react-icons/ri";

import Image from "next/image";

export const Sidebar = () => {
    const path = usePathname();
    const router = useRouter();

    const [isExpanded, setIsExpanded] = useState(true);
    const [openSubmenus, setOpenSubmenus] = useState<{ [key: string]: boolean }>({});
    const { user, loading: loadingUser } = useUserProfile();

    useEffect(() => {
    }, [user, path]);

    const getRoleAbbreviation = (roleValue: string) => {
        const roleMap: Record<string, string> = {
            "Administrasi": "ADM",
            "Staff Blower": "SB",
            "Staff Cleaning": "SC",
            "Super Admin": "SA",
            "Supervisor": "SPV",
        };

        return roleMap[roleValue] || "0";
    };

    const processedRole = user?.roleId ? getRoleAbbreviation(user.roleId) : "UN";

    const noNavigation = ["/login", "/forgot-password", "/reset-password", "/invoice", "/rating"];

    const toggleSidebar = () => {
        setIsExpanded((prev) => {
            const newState = !prev;
            localStorage.setItem("isExpanded", JSON.stringify(newState));
            return newState;
        });
    };

    const toggleSubmenu = (label: string) => {
        setOpenSubmenus((prev) => {
            const updatedState = { ...prev, [label]: !prev[label] };
            localStorage.setItem("openSubmenus", JSON.stringify(updatedState));
            return updatedState;
        });
    };

    useEffect(() => {
        const storedExpanded = localStorage.getItem("isExpanded");
        if (storedExpanded !== null) {
            setIsExpanded(JSON.parse(storedExpanded));
        }
        const storedSubmenus = localStorage.getItem("openSubmenus");
        if (storedSubmenus) {
            setOpenSubmenus(JSON.parse(storedSubmenus));
        }
    }, []);

    useEffect(() => {
        const storedSubmenus = localStorage.getItem("openSubmenus");
        if (storedSubmenus) {
            setOpenSubmenus(JSON.parse(storedSubmenus));
        }
    }, [path]);

    return (
        <nav className={`${isExpanded ? "w-64" : "w-[79px]"} ${noNavigation.includes(path) && "hidden"} sticky top-0 h-screen flex transition-all duration-300 z-[100]`}>
            <div className={`w-full grow bg-mainColor/30 dark:bg-mainColor/20 rounded-lg my-2 ml-2 flex flex-col relative shadow-mainShadow border border-white/50 dark:border-neutral-500/50 ${!isExpanded && "items-center"}`}>
                {/* Header */}
                <div className={`${!isExpanded ? "border rounded-2xl border-neutral-500/10 bg-mainColor/20 mx-[7px] mt-2 w-fit p-3" : "py-2 pl-0 pr-[15px] w-full"} z-[666] absolute flex justify-between items-center gap-2 mb-3 cursor-pointer group`}>
                    <div className={`flex items-center w-full h-full`}>
                        <div className={`${isExpanded ? "opacity-100" : "opacity-0 hidden"}`}>
                            <Image
                                width={100}
                                height={100}
                                src={"/assets/SC_Primary.png"}
                                alt="LogoSC"
                                className="w-[250px] h-10 object-cover saturate-0 brightness-0 dark:invert"
                            />
                        </div>
                        <div className={`${!isExpanded ? "opacity-100 w-5 h-5 flex items-center justify-center" : "opacity-0 hidden"} max-w-32`}>
                            <Image
                                width={100}
                                height={100}
                                src={"/assets/SC_LogoOnlyBig.png"}
                                alt="LogoSC"
                                className="w-6 h-6 object-cover saturate-0 brightness-0 dark:invert"
                            />
                        </div>
                    </div>
                    <div
                        onClick={toggleSidebar}
                        className={`${isExpanded ? "btn btn-circle btn-sm btn-ghost border-none" : "hidden"} transition-all text-darkColor dark:text-lightColor`} >
                        <TbLayoutSidebarRightExpandFilled className="text-xl" />
                    </div>
                </div>
                <div className={`absolute w-full ${!isExpanded && "hidden"} h-[10%] top-0 z-[555] rounded-t-lg bg-gradient-to-b from-mainColor/30 dark:from-mainColor/10 via-mainColor/15 dark:via-mainColor/10 to-transparent gradient-blur-to-b`} />

                {/* Expand Button on Minimize */}
                <div className={`${!isExpanded ? "pt-14" : "pt-14 pb-28 overflow-y-scroll"} max-h-[100vh] mx-2 my-2 no-scrollbar overflow-visible`}>
                    {!isExpanded && (
                        <button
                            onClick={toggleSidebar}
                            className={`mb-3 py-2 px-3 rounded-lg hover:bg-mainColor/50 flex items-center gap-2 w-fit  duration-300 ${!isExpanded ? "justify-center w-9 h-9 p-5 mx-auto scale-100" : "scale-0"}`}
                        >
                            <span>
                                <TbLayoutSidebarLeftExpandFilled />
                            </span>
                        </button>
                    )}

                    {/* Navigation Sections */}
                    {Object.entries(navigationItems).map(([key, section]) => (
                        <div key={key}>
                            <p className={`${!isExpanded && "w-full h-[1px] bg-neutral-500/30 rounded-full mb-3"} text-neutral-400 text-[10px] uppercase tracking-wide font-semibold px-3 pb-1`}>
                                <span className={`${!isExpanded && "hidden"}`}>
                                    {section.label}
                                </span>
                            </p>

                            <ul className={`${isExpanded ? "" : "items-center justify-center"} flex flex-col gap-2 mb-3`}>
                                {section.contents.map((item, idx) => (
                                    <li key={idx} className={`${!isExpanded && "dropdown dropdown-hover dropdown-right"}`}>
                                        <div tabIndex={idx} className="flex flex-col">
                                            {!item.subs?.length ? (
                                                <Link
                                                    href={item.path}
                                                    className={`capitalize font-semibold py-2 px-3 rounded-lg hover:bg-mainColor/50 duration-150 flex items-center gap-2 w-full 
                                                                ${path === item.path ? "bg-mainColor/50 dark:bg-mainColor/30" : ""} 
                                                                ${!isExpanded ? "justify-center w-9 h-9 p-5 mx-auto" : "justify-start"}`}
                                                >
                                                    {item.icon}
                                                    <span className={`${isExpanded ? "block" : "hidden"} capitalize`}>
                                                        {item.label}
                                                    </span>
                                                </Link>

                                            ) : (
                                                <button
                                                    onClick={(e) => {
                                                        e.preventDefault();
                                                        toggleSubmenu(item.label);
                                                    }}
                                                    className={`${path.startsWith(item.path) && "bg-mainColor/50 dark:bg-mainColor/30"} font-semibold capitalize group py-2 px-3 rounded-lg hover:bg-mainColor/50 duration-150 flex items-center gap-2 w-full 
                                                              ${!isExpanded ? "justify-center w-9 h-9 p-5 mx-auto" : "justify-between"}`}
                                                >
                                                    <div className={` flex items-center gap-2 relative`}>
                                                        {item.subs.length > 0 && !isExpanded && (
                                                            <div className={`${path.startsWith(item.path) && "!h-[14px]"} absolute left-[-8px] w-[3px] h-[3px] group-hover:h-[14px] duration-200 ease-in-out transition-all dark:bg-white bg-black rounded-full`}></div>
                                                        )}
                                                        {item.icon}
                                                        <span className={`${isExpanded ? "block" : "hidden"} capitalize`}>{item.label}</span>
                                                    </div>

                                                    {item.subs.length > 1 && (
                                                        <IoIosArrowDown
                                                            className={`text-darkColor dark:text-lightColor transition-transform duration-200 
                                                                        ${openSubmenus[item.label] ? "rotate-180" : ""} ${!isExpanded ? "hidden" : "block"}`}
                                                        />
                                                    )}
                                                </button>
                                            )}

                                            {item.subs && openSubmenus[item.label] && (
                                                <ul className={`ml-[19px] mt-1 space-y-1 border-l border-neutral-500/50 ${!isExpanded ? "hidden" : "block"}`}>
                                                    {item.subs.map((sub, subIdx) => (
                                                        <li key={subIdx}>
                                                            <Link
                                                                href={sub.path}
                                                                className="capitalize group ml-2 flex items-center text-sm text-neutral-600 dark:text-neutral-300 duration-150"
                                                            >
                                                                <p className={`${path.startsWith(sub.path) && "bg-mainColor/50 dark:bg-mainColor/30 font-semibold text-neutral-800 dark:text-neutral-100"} group-hover:bg-mainColor/20 px-2 py-2 w-full rounded-lg duration-150`}>
                                                                    {sub.name}
                                                                </p>
                                                            </Link>
                                                        </li>
                                                    ))}
                                                </ul>
                                            )}

                                            {item.subs.length > 0 && !isExpanded && (
                                                <ul tabIndex={idx} className="ml-1 dropdown-content menu bg-baseLight dark:bg-baseDark rounded-lg !z-[999] w-56 p-2 shadow">
                                                    <p className="block px-3 py-2 -m-1 bg-mainColor/20 border border-white/50 dark:border-neutral-500/50 rounded-md capitalize mb-2 font-bold text-sm">{item.label}</p>
                                                    {item.subs.map((sub, subIdx) => (
                                                        <li key={subIdx}>
                                                            <Link
                                                                href={sub.path}
                                                                className={`${path.startsWith(sub.path) && "bg-mainColor/50 dark:bg-mainColor/30"} capitalize group text-neutral-600 dark:text-neutral-300`}
                                                            >
                                                                {sub.name}
                                                            </Link>
                                                        </li>
                                                    ))}
                                                </ul>
                                            )}
                                        </div>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    ))}
                </div>

                {/* Absolute components */}
                <div className={`absolute w-full ${!isExpanded && "hidden"} rounded-b-lg h-[22%] bottom-0 bg-gradient-to-t from-mainColor/30 dark:from-mainColor/10 to-transparent gradient-blur-to-t z-[555]`} />

                <div className={`${isExpanded ? "bottom-2 left-2 w-full pr-4" : "bottom-0 p-3"} z-[666] absolute space-y-2`}>
                    {/* Profil Dropdown */}
                    <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                            <div className={`${path.startsWith("/profil") && "bg-mainColor/50 dark:bg-mainColor/30"} ${isExpanded ? "px-3 py-3 flex items-center gap-2 rounded-2xl hover:bg-mainColor/20 duration-150" : "flex justify-center pb-1"} cursor-pointer truncate-parent`}>
                                {loadingUser ? (
                                    <div className="animate-spin flex items-center justify-center aspect-square text-xs font-medium w-11 h-11 rounded-full bg-neutral-500/20 dark:bg-neutral-500/30">
                                        <IoReloadOutline />
                                    </div>
                                ) : (
                                    <div className="flex items-center justify-center aspect-square text-xs font-medium w-11 h-11 rounded-full bg-neutral-500/20 dark:bg-neutral-500/30">
                                        {processedRole}
                                    </div>
                                )}
                                <div className={`${!isExpanded && "hidden"} flex flex-col text-sm`}>
                                    <p className="font-medium truncate-1 untruncate">
                                        {loadingUser ? "Loading..." : user?.fullname || "Tidak Diketahui"}
                                    </p>
                                    <p className="text-xs text-neutral-700 dark:text-neutral-400">
                                        {loadingUser ? "Loading..." : user?.branchId || "Tidak Diketahui"}
                                    </p>
                                </div>
                            </div>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent
                            align="end"
                            side="right"
                            className="w-[210px] ml-2 !bg-baseLight dark:!bg-baseDark !z-[100]">
                            <DropdownMenuLabel>Akun Saya</DropdownMenuLabel>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem onClick={() => router.push("/profil")}>
                                <RiUserFill />
                                Profil
                            </DropdownMenuItem>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem
                                className="text-red-700 dark:text-red-400"
                                onClick={() => {
                                    localStorage.clear();
                                    router.push("/login");
                                }}
                            >
                                <RiLogoutCircleFill />
                                Keluar
                            </DropdownMenuItem>
                        </DropdownMenuContent>
                    </DropdownMenu>

                    <ThemeSwitch isExpanded={isExpanded} />
                </div>
            </div>
        </nav>
    );
};
