"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useState } from "react";
import { Input } from "../../../../ui-components/src/components/ui/input";
import { Search } from "lucide-react";
import { Button } from "../../../../ui-components/src/components/ui/button";
import { RiNotification4Fill } from "react-icons/ri";
import { Breadcrumbs } from "./Breadcrumbs";

export const Navbar = () => {
    const pathname = usePathname();
    const router = useRouter();
    const [searchQuery, setSearchQuery] = useState("");

    const noNavigation = ["/login", "/forgot-password", "/reset-password"];
    const searchNavbar = "/";

    // Fungsi untuk handle search
    const handleSearch = (e: React.FormEvent) => {
        e.preventDefault();
        if (searchQuery.trim()) {
            // Redirect ke halaman inquiry transaksi dengan query parameter
            router.push(`/laporan/inquiry-transaksi/${encodeURIComponent(searchQuery.trim())}`);
        }
    };

    // Handle enter key down
    const handleKeyDown = (e: React.KeyboardEvent) => {
        if (e.key === 'Enter') {
            e.preventDefault();
            handleSearch(e as any);
        }
    };

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
        <div className={`${noNavigation.includes(pathname) && "hidden"} navbar w-auto h-[50px] !min-h-[50px] bg-white dark:bg-black shadow-mainShadow rounded-xl z-50 ml-2 mr-2 mt-2 mb-2`}>
            <div className="flex-1">
                <div className="w-1 self-stretch my-1 rounded-full bg-mainColor ml-[2px]"></div>
                <div className="breadcrumbs text-sm px-2 py-1">
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

            <div className={`${searchNavbar.includes(pathname) ? "flex" : "hidden"} flex-none items-center space-x-2 bg-white dark:bg-black px-0 shadow-mainShadow rounded-xl`}>
                <form onSubmit={handleSearch} className="flex items-center relative">
                    <Input
                        type="text"
                        placeholder="Ketik untuk pencarian"
                        className="w-[20lvw] pr-10"
                        icon={<Search size={16} />}
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        onKeyDown={handleKeyDown}
                    />
                    {searchQuery.trim() && (
                        <Button
                            type="submit"
                            size="sm"
                            className="absolute right-1 h-8 px-3"
                            onClick={handleSearch}
                        >
                            <Search size={14} />
                        </Button>
                    )}
                </form>
                <Link href="/pengaturan">
                    <Button
                        variant={"outline"}
                        size={"icon"}
                        className="relative"
                    >
                        <RiNotification4Fill className="text-neutral-500 dark:text-neutral-300" />
                        <div className="absolute right-[8px] top-2 w-[7px] h-[7px] border border-white dark:border-black bg-red-600 dark:bg-red-500 rounded-full"></div>
                    </Button>
                </Link>
            </div>
        </div>
    );
};