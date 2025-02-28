"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { ThemeSwitch } from "./ThemeSwitch";
import { Searchbar } from "./Searchbar";

export const Navbar = () => {
    const pathname = usePathname();

    const noNavigation = ["/login", "/forgot-password", "/reset-password"];

    // Fungsi untuk mengonversi path menjadi array breadcrumb
    const getBreadcrumbs = () => {
        if (pathname === "/") {
            return [{ label: "Dashboard", href: "/" }];
        }
        const pathArray = pathname.split("/").filter((x) => x);
        const firstCrumb = pathArray[0];
        const href = "/" + firstCrumb;
        return [{ label: firstCrumb.replace(/-/g, " "), href }];
    };

    return (
        <div className={`${noNavigation.includes(pathname) && "hidden"} navbar h-[50px] !min-h-[50px] z-50 px-3 mt-2`}>
            <div className="flex-1">
                <div className="breadcrumbs text-sm bg-white dark:bg-black shadow-mainShadow rounded-3xl px-4 py-1">
                    <ul>
                        {getBreadcrumbs().map((crumb, index) => (
                            <li key={index}>
                                <Link href={crumb.href} className={`${index === 0 && "text-mainColor text-lg font-medium"} font-semibold capitalize`}>
                                    {crumb.label}
                                </Link>
                            </li>
                        ))}
                    </ul>
                </div>
            </div>

            <div className="flex-none space-x-2 bg-white dark:bg-black px-0 shadow-mainShadow rounded-3xl">
                {/* <Searchbar /> */}
                <ThemeSwitch />
            </div>
        </div>
    );
};
