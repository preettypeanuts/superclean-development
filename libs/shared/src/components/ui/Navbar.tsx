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
        return pathArray.map((crumb, index) => {
            const href = "/" + pathArray.slice(0, index + 1).join("/");
            return { label: crumb.replace(/-/g, " "), href };
        });
    };

    return (
        <div className={`${noNavigation.includes(pathname) && "hidden"} navbar h-[50px] !min-h-[50px] rounded-b-3xl ring-2 dark:ring-black ring-white bg-lightColor dark:bg-darkColor sticky top-0 z-50 px-5`}>
            <div className="flex-1">
                <div className="breadcrumbs text-sm">
                    <ul>
                        {getBreadcrumbs().map((crumb, index) => (
                            <li key={index}>
                                <Link href={crumb.href} className={`${index === 0 && "text-mainColor text-lg font-medium"} capitalize`}>
                                    {crumb.label}
                                </Link>
                            </li>
                        ))}
                    </ul>
                </div>
            </div>

            <div className="flex-none space-x-3">
                <Searchbar />
                <ThemeSwitch />
            </div>
        </div>
    );
};