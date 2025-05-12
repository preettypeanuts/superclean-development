"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Input } from "../../../../ui-components/src/components/ui/input";
import { Search } from "lucide-react";
import { Button } from "../../../../ui-components/src/components/ui/button";
import { RiNotification4Fill } from "react-icons/ri";
import { Breadcrumbs } from "./Breadcrumbs";

export const Navbar = () => {
    const pathname = usePathname();

    const noNavigation = ["/login", "/forgot-password", "/reset-password"];

    const searchNavbar = "/"

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
        <div className={`${noNavigation.includes(pathname) && "hidden"} navbar w-auto h-[50px] !min-h-[50px]  bg-white dark:bg-black shadow-mainShadow rounded-xl z-50 ml-2 mr-2 mt-2 mb-2`}>
            <div className="flex-1">
                <div className="w-1 self-stretch my-1 rounded-full bg-mainColor ml-[2px]"></div>
                <div className="breadcrumbs text-sm  px-2 py-1">
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

            <div className={`${searchNavbar.includes(pathname) ? "flex" : "hidden"} flex-none space-x-2 bg-white dark:bg-black px-0 shadow-mainShadow rounded-xl`}>
                <Input
                    type="text"
                    placeholder="Ketik untuk pencarian"
                    className="w-[20lvw]"
                    icon={<Search size={16} />}
                />
                <Button
                    variant={"outline"}
                    size={"icon"}
                    className="relative"
                >
                    <RiNotification4Fill className="text-neutral-500 dark:text-neutral-300" />
                    <div className="absolute right-[8px] top-2 w-[7px] h-[7px] border border-white dark:border-black bg-red-600 dark:bg-red-500 rounded-full"></div>
                </Button>
            </div>
        </div>
    );
};
