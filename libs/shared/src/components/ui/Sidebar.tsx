"use client";

import Image from "next/image";
import { useEffect, useState } from "react";
import { navigationItems } from "../../data/system";
import { IoIosArrowDown } from "react-icons/io";
import { SiCcleaner } from "react-icons/si";
import { TbLayoutSidebarLeftExpandFilled, TbLayoutSidebarRightExpandFilled } from "react-icons/tb";
import { usePathname } from "next/navigation";
import Link from "next/link";
import { ThemeSwitch } from "./ThemeSwitch";

export const Sidebar = () => {
    const [isExpanded, setIsExpanded] = useState(true);
    const [openSubmenus, setOpenSubmenus] = useState<{ [key: string]: boolean }>({});

    const path = usePathname();
    const noNavigation = ["/login", "/forgot-password", "/reset-password"];

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
        <nav
            className={`${isExpanded ? "w-64" : "w-[79px]"} ${noNavigation.includes(path) && "hidden"} sticky top-0 h-screen flex transition-all duration-300 z-[100]`}>
            <div className={`w-full grow bg-mainColor/30 dark:bg-mainColor/20 rounded-3xl my-2 ml-2 flex flex-col relative shadow-mainShadow border border-white/50 dark:border-neutral-500/50 ${!isExpanded && "items-center"}`}>
                {/* Header*/}
                <div
                    className={`${!isExpanded ? "border rounded-2xl border-neutral-500/10 bg-mainColor/20 mx-[7px] mt-2 w-fit p-3" : "py-3 pl-5 pr-[15px] w-full"} z-[666] absolute flex justify-between items-center gap-2 mb-3 cursor-pointer group`}>
                    <div className={`flex items-center gap-2  duration-300`}>
                        <SiCcleaner className="text-xl" />
                        <h1 className={`${isExpanded ? "opacity-100" : "opacity-0 hidden"} text-lg font-semibold truncate max-w-32`}>
                            Superclean
                        </h1>
                    </div>
                    <div
                        onClick={toggleSidebar}
                        className={`${isExpanded ? "btn btn-circle btn-sm btn-ghost border-none" : "hidden"} transition-all text-darkColor dark:text-lightColor`} >
                        <TbLayoutSidebarRightExpandFilled className="text-xl" />
                    </div>
                </div>
                <div className={`absolute w-full ${!isExpanded && "hidden"} h-[10%] top-0 z-[555] rounded-t-3xl bg-gradient-to-b from-mainColor/30 dark:from-mainColor/10 via-mainColor/30 dark:via-mainColor/10 to-transparent gradient-blur-to-b`} />

                {/* Expand Button on Minimize */}
                <div className={`${!isExpanded ? "pt-14" : "pt-14 pb-28 overflow-y-scroll"} max-h-[100vh] mx-2 my-2 no-scrollbar overflow-visible`}>
                    {!isExpanded && (
                        <button
                            onClick={toggleSidebar}
                            className={`mb-3 py-2 px-3 rounded-xl hover:bg-mainColor/50 flex items-center gap-2 w-fit  duration-300 ${!isExpanded ? "justify-center w-9 h-9 p-5 mx-auto scale-100" : "scale-0"}`}
                        >
                            <span>
                                <TbLayoutSidebarLeftExpandFilled />
                            </span>
                        </button>
                    )}


                    {/* Navigation Sections */}
                    {Object.entries(navigationItems).map(([key, section]) => (
                        <div key={key}>
                            {/* Section Title */}
                            <p className={`${!isExpanded && "w-full h-[1px] bg-neutral-500/30 rounded-full mb-3"} text-neutral-400 text-[10px] uppercase tracking-wide font-semibold px-3 pb-1`}>
                                <span className={`${!isExpanded && "hidden"}`}>
                                    {section.label}
                                </span>
                            </p>

                            {/* Section Links */}
                            <ul className={`${isExpanded ? "" : "items-center justify-center"} flex flex-col gap-2 mb-3`}>
                                {section.contents.map((item, idx) => (
                                    <li key={idx} className={`${!isExpanded && "dropdown dropdown-hover dropdown-right"}`}>
                                        <div tabIndex={idx} className="flex flex-col">
                                            {/* Main Menu Item */}
                                            {!item.subs?.length ? (
                                                <Link
                                                    href={item.path}
                                                    className={`capitalize py-2 px-3 rounded-xl hover:bg-mainColor/50 duration-150 flex items-center gap-2 w-full 
                                                                ${path === item.path ? "bg-mainColor/50 dark:bg-mainColor/30" : ""} 
                                                                ${!isExpanded ? "justify-center w-9 h-9 p-5 mx-auto" : "justify-start"}`}
                                                >
                                                    {item.icon}
                                                    <span className={`${isExpanded ? "block" : "hidden"} capitalize`}>
                                                        {item.label}
                                                    </span>
                                                </Link>

                                            ) : (
                                                /* Jika ada submenu → Gunakan <button> */
                                                <button
                                                    onClick={(e) => {
                                                        e.preventDefault();
                                                        toggleSubmenu(item.label);
                                                    }}
                                                    className={`${path.startsWith(item.path) && "bg-mainColor/50 dark:bg-mainColor/30"} capitalize group py-2 px-3 rounded-xl hover:bg-mainColor/50 duration-150 flex items-center gap-2 w-full 
                                                              ${!isExpanded ? "justify-center w-9 h-9 p-5 mx-auto" : "justify-between"}`}
                                                >
                                                    <div className={` flex items-center gap-2 relative`}>
                                                        {item.subs.length > 0 && !isExpanded && (
                                                            <div className={`${path.startsWith(item.path) && "!h-[14px] !left-[-23px] group-hover:translate-x-[15px]"} absolute left-[-8px] w-[3px] h-[3px] group-hover:h-[14px] duration-200 ease-in-out transition-all dark:bg-white bg-black rounded-full`}></div>
                                                        )}
                                                        {item.icon}
                                                        <span className={`${isExpanded ? "block" : "hidden"} capitalize`}>{item.label}</span>
                                                    </div>

                                                    {/* Arrow Icon */}
                                                    {item.subs.length > 1 && (
                                                        <IoIosArrowDown
                                                            className={`text-neutral-400 transition-transform duration-200 
                                                                        ${openSubmenus[item.label] ? "rotate-180" : ""} ${!isExpanded ? "hidden" : "block"}`}
                                                        />
                                                    )}
                                                </button>
                                            )}

                                            {/* Submenu (if exists) */}
                                            {item.subs && openSubmenus[item.label] && (
                                                <ul className={`ml-[19px] mt-1 space-y-1 border-l border-neutral-500/50 ${!isExpanded ? "hidden" : "block"}`}>
                                                    {item.subs.map((sub, subIdx) => (
                                                        <li key={subIdx}
                                                        >
                                                            <a
                                                                href={sub.path}
                                                                className="capitalize group ml-2 flex items-center text-sm text-neutral-600 dark:text-neutral-300 duration-150"
                                                            >
                                                                <p className={`${path.startsWith(sub.path) && "bg-mainColor/50 dark:bg-mainColor/30"} group-hover:bg-mainColor/20 px-2 py-2 w-full rounded-xl duration-150`}>
                                                                    {sub.name}
                                                                </p>
                                                            </a>
                                                        </li>
                                                    ))}
                                                </ul>
                                            )}

                                            {/* Submenu on hover (minimize) */}
                                            {item.subs.length > 0 && !isExpanded && (
                                                <ul tabIndex={idx} className="ml-1 dropdown-content menu bg-baseLight dark:bg-baseDark rounded-box !z-[999] w-56 p-2 shadow">
                                                    <p className="block px-3 py-2 -m-1 bg-mainColor/20 border border-white/50 dark:border-neutral-500/50 rounded-xl capitalize mb-2 font-bold text-sm">{item.label}</p>
                                                    {item.subs.map((sub, subIdx) => (
                                                        <li key={subIdx}
                                                        >
                                                            <a
                                                                href={sub.path}
                                                                className={`${path.startsWith(sub.path) && "bg-mainColor/50 dark:bg-mainColor/30"} capitalize group text-neutral-600 dark:text-neutral-300`}
                                                            >
                                                                {sub.name}
                                                            </a>
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
                <div className={`absolute w-full ${!isExpanded && "hidden"} rounded-b-3xl h-[25%] bottom-0 bg-gradient-to-t from-mainColor/30 dark:from-mainColor/10 to-transparent z-[555] gradient-blur-to-t`} />

                <div className={`${isExpanded ? "bottom-2 left-2 w-full pr-4" : "bottom-0 p-3"} z-[666] absolute space-y-2`}>
                    <div className={`${isExpanded ? "px-3 py-3 flex items-center gap-2 rounded-2xl hover:bg-mainColor/20 duration-150" : "flex justify-center pb-1"}  cursor-pointer`}>
                        <Image
                            width={50}
                            height={50}
                            className="w-9 h-9 min-w-9 min-h-9 rounded-full object-cover"
                            src="https://images.unsplash.com/photo-1481214110143-ed630356e1bb?q=80&w=3087&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
                            alt="Profile Photos"
                        />
                        <div className={`${!isExpanded && "hidden"} flex flex-col text-sm`}>
                            <p className="font-medium">
                                Admin
                            </p>
                            <p className="text-xs text-neutral-500">
                                admin@gmail.com
                            </p>
                        </div>
                    </div>
                    <ThemeSwitch isExpanded={isExpanded} />
                </div>

            </div>
        </nav>
    );
};
