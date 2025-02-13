"use client";

import Image from "next/image";
import { useState } from "react";
import { navigationItems } from "../../data/system";
import { IoIosArrowDown } from "react-icons/io";
import { SiCcleaner } from "react-icons/si";
import { ThemeSwitch } from "./ThemeSwitch";
import { TbLayoutSidebarLeftExpandFilled, TbLayoutSidebarRightExpandFilled } from "react-icons/tb";

export const Sidebar = () => {
    const [isExpanded, setIsExpanded] = useState(true);
    const [openSubmenus, setOpenSubmenus] = useState<{ [key: string]: boolean }>({});

    const toggleSidebar = () => setIsExpanded((prev) => !prev);

    const toggleSubmenu = (label: string) => {
        setOpenSubmenus((prev) => ({
            ...prev,
            [label]: !prev[label],
        }));
    };

    return (
        <nav className={`${isExpanded ? "w-60" : "w-16"} sticky top-0 h-screen flex transition-all duration-300`}>
            <div className="w-full grow bg-lightColor dark:bg-darkColor rounded-r-3xl flex flex-col relative">

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
                <div className={`absolute w-full ${!isExpanded && "hidden"} h-[10%] top-0 gradient-blur-to-b z-[555] rounded-tr-[50px]`}/>

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
                            <p className={`${!isExpanded && "w-full h-[1px] bg-neutral-500/30 rounded-full mb-3"} text-neutral-400 text-[10px] uppercase tracking-wide font-semibold px-3`}>
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
                                                <a
                                                    href={item.path}
                                                    className={`capitalize py-2 px-3 rounded-xl hover:bg-mainColor/50 duration-150 flex items-center gap-2 w-full 
                                                                ${!isExpanded ? "justify-center w-9 h-9 p-5 mx-auto" : "justify-start"}`}
                                                >
                                                    {item.icon}
                                                    <span className={`${isExpanded ? "block" : "hidden"} capitalize`}>{item.label}</span>
                                                </a>
                                            ) : (
                                                /* Jika ada submenu → Gunakan <button> */
                                                <button
                                                    onClick={(e) => {
                                                        e.preventDefault();
                                                        toggleSubmenu(item.label);
                                                    }}
                                                    className={`capitalize group py-2 px-3 rounded-xl hover:bg-mainColor/50 duration-150 flex items-center gap-2 w-full 
                                                              ${!isExpanded ? "justify-center w-9 h-9 p-5 mx-auto" : "justify-between"}`}
                                                >
                                                    <div className="flex items-center gap-2 relative">
                                                        {item.subs.length > 0 && !isExpanded && (
                                                            <div className="absolute left-[-8px] w-[3px] h-[3px] group-hover:h-[14px] duration-200 ease-in-out transition-all dark:bg-white bg-black rounded-full"></div>
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
                                                                <p className="group-hover:bg-mainColor/20 px-2 py-2 w-full rounded-xl duration-150">
                                                                    {sub.name}
                                                                </p>
                                                            </a>
                                                        </li>
                                                    ))}
                                                </ul>
                                            )}

                                            {/* Submenu on hover (minimize) */}
                                            {item.subs.length > 0 && !isExpanded && (
                                                <ul tabIndex={idx} className="ml-1 dropdown-content menu bg-baseLight dark:bg-baseDark rounded-box z-[999] w-56 p-2 shadow">
                                                    <p className="block px-6 py-3 bg-mainColor/50 -m-2 rounded-t-box capitalize mb-2 font-bold text-sm">{item.label}</p>
                                                    {item.subs.map((sub, subIdx) => (
                                                        <li key={subIdx}
                                                        >
                                                            <a
                                                                href={sub.path}
                                                                className="capitalize group text-neutral-600 dark:text-neutral-300"
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
                <div className={`absolute w-full ${!isExpanded && "hidden"} h-[20%] bottom-0 gradient-blur-to-t rounded-br-[50px] z-[555]`}/>
                <div className={`${isExpanded ? "bottom-2 left-2 w-full pr-4" : "bottom-0 left-0 w-fit p-3"}  z-[666] absolute space-y-2`}>
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
                </div>

            </div>
        </nav>
    );
};
