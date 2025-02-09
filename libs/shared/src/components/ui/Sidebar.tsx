"use client";

import Image from "next/image";
import { useState } from "react";
import { navigationItems } from "@shared/data/system";
import { IoIosArrowDown } from "react-icons/io";
import { SiCcleaner } from "react-icons/si";
import { ThemeSwitch } from "../auth/ThemeSwitch";
import { LuSquareArrowLeft } from "react-icons/lu";

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
        <nav className={`h-screen ${isExpanded ? "w-60" : "w-16"} flex transition-all duration-300`}>
            <div className="rounded-3xl w-full grow bg-white dark:bg-black py-2 pl-2 flex flex-col">
                {/* Header */}
                <div
                    onClick={toggleSidebar}
                    className={`${!isExpanded && "mx-auto border rounded-2xl border-neutral-500/10 bg-mainColor/20"} flex justify-between items-center gap-2 mb-3 p-3 cursor-pointer group`}>
                    <div

                        className={`${isExpanded ? "group-hover:scale-90 origin-left group-hover:-translate-x-1" : "group-hover:scale-110 origin-right group-hover:translate-x-1"} flex items-center gap-2  duration-300`}
                    >
                        <SiCcleaner className="text-xl" />
                        <h1 className={`${isExpanded ? "opacity-100" : "opacity-0 hidden"} text-lg font-semibold truncate max-w-32`}>
                            Superclean
                        </h1>
                    </div>
                    <div className={`${isExpanded ? "bg-baseLight dark:bg-baseDark btn border-neutral-500/10 btn-circle btn-xs border-none " : "hidden"} transition-all text-darkColor dark:text-lightColor`} >
                        <LuSquareArrowLeft />
                    </div>
                </div>

                {/* Navigation Sections */}
                {Object.entries(navigationItems).map(([key, section]) => (
                    <div key={key}>
                        {/* Section Title */}
                        <p className={`${!isExpanded && "w-full h-[1px] bg-neutral-500/30 rounded-full mb-3"} text-neutral-500/90 text-[10px] uppercase tracking-wide font-semibold px-3`}>
                            <span className={`${!isExpanded && "hidden"}`}>
                                {section.label}
                            </span>
                        </p>

                        {/* Section Links */}
                        <ul className="space-y-2 mb-3">
                            {section.contents.map((item, idx) => (
                                <li key={idx}>
                                    <div className="flex flex-col">
                                        {/* Main Menu Item */}
                                        <button
                                            onClick={(e) => {
                                                if (item.subs?.length) {
                                                    e.preventDefault();
                                                    toggleSubmenu(item.label);
                                                }
                                            }}
                                            className={`py-2 px-3 rounded-xl hover:bg-mainColor/50 duration-150 flex items-center gap-2 w-full ${!isExpanded ? "justify-center w-9 h-9 p-5 mx-auto " : "justify-between"}`}
                                        >
                                            <div className="flex items-center gap-2">
                                                {item.icon}
                                                <span className={`${isExpanded ? "block" : "hidden"}`}>{item.label}</span>
                                            </div>
                                            {/* Arrow Icon */}
                                            {item.subs.length > 1 && (
                                                <IoIosArrowDown
                                                    className={`text-neutral-400 transition-transform duration-200 ${openSubmenus[item.label] ? "rotate-180" : ""
                                                        } ${!isExpanded ? "hidden" : "block"}`}
                                                />
                                            )}
                                        </button>

                                        {/* Submenu (if exists) */}
                                        {item.subs && openSubmenus[item.label] && (
                                            <ul className={`ml-[19px] mt-1 space-y-1 border-l border-neutral-500/50 ${!isExpanded ? "hidden" : "block"}`}>
                                                {item.subs.map((sub, subIdx) => (
                                                    <li key={subIdx}
                                                    >
                                                        <a
                                                            href={sub.path}
                                                            className="group pl-3 flex items-center text-sm text-neutral-600 dark:text-neutral-300 duration-150"
                                                        >
                                                            <p className="group-hover:bg-mainColor/20 px-3 py-2 w-full rounded-xl duration-150">
                                                                {sub.name}
                                                            </p>
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

                {/* Theme Switch */}
                <div className="mt-auto w-full space-y-2">
                    <ThemeSwitch isExpanded={isExpanded} />
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
