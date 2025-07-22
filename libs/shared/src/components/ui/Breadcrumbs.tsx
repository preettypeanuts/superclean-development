"use client"
import React, { useState } from 'react';
import {
    Breadcrumb,
    BreadcrumbItem,
    BreadcrumbLink,
    BreadcrumbList,
    BreadcrumbPage,
    BreadcrumbSeparator,
} from "../../../../ui-components/src/components/ui/breadcrumb"
import { usePathname, useRouter } from 'next/navigation'
import { Input } from '../../../../ui-components/src/components/ui/input';
import { Search } from 'lucide-react';
import { Button } from '../../../../ui-components/src/components/ui/button';
import { RiNotification4Fill } from 'react-icons/ri';
import Link from 'next/link';

type HeaderProps = {
    label: string,
    desc?: string
    count?: number
}

export function Breadcrumbs({ label, desc, count }: HeaderProps) {
    const pathname = usePathname()
    const router = useRouter();
    const [searchQuery, setSearchQuery] = useState("");

    const noNavigation = ["/login", "/forgot-password", "/reset-password"];

    if (noNavigation.includes(pathname)) return null;

    const searchNavbar = "/";
    const [start, transaction] = pathname.split('/SPK/').filter(Boolean);

    // Fungsi untuk handle search
    const handleSearch = (e: React.FormEvent) => {
        e.preventDefault();
        if (searchQuery.trim()) {
            // Redirect ke halaman inquiry transaksi dengan query parameter
            router.push(`/laporan/inquiry-transaksi?search=${encodeURIComponent(searchQuery.trim())}`);
        }
    };

    // Handle enter key down
    const handleKeyDown = (e: React.KeyboardEvent) => {
        if (e.key === 'Enter') {
            e.preventDefault();
            handleSearch(e as any);
        }
    };

    const pathSegments = start.split('/').filter(Boolean);

    const isHiddenSegment = (segment: string) => {
        const isLongId =
            segment.length >= 10 &&
            /[a-zA-Z]/.test(segment) && // ada huruf
            /[0-9]/.test(segment);     // ada angka

        const isTrxCode = segment.startsWith("TRX-");

        return isLongId || isTrxCode;
    };

    return (
        <div className='navbar w-auto h-[50px] !min-h-[50px] bg-white dark:bg-black shadow-mainShadow rounded-xl z-50 ml-2 mr-2 mt-2 mb-2'>
            <div className='flex items-center justify-between w-full'>
                {/* Label */}
                <section className="flex gap-2 items-center">
                    <div className="w-1 self-stretch rounded-full bg-mainColor"></div>
                    <div>
                        <div className="text-xl font-medium flex items-center gap-2">
                            {label}
                            <div className={`${!count && "hidden"} flex items-center justify-center text-sm px-1 py-[1px] w-5 h-5 bg-thirdColor text-white dark:text-black rounded-[5px] !aspect-square`}>
                                {count}
                            </div>
                        </div>
                        <p className="opacity-70">{desc}</p>
                    </div>
                </section>

                {/* Breadcrumb */}
                <Breadcrumb className={`${searchNavbar.includes(pathname) ? "hidden" : "block"} px-4 py-2 w-fit capitalize`}>
                    <BreadcrumbList>
                        <div >
                            <BreadcrumbItem>
                                <BreadcrumbLink href="/">Dashboard</BreadcrumbLink>
                            </BreadcrumbItem>
                        </div>

                        {pathSegments.map((segment, index) => {
                            if (isHiddenSegment(segment)) return null;

                            const href = '/' + pathSegments.slice(0, index + 1).join('/');
                            const formattedSegment = segment.replace(/-/g, ' ');

                            const isLast = index === pathSegments.length - 1 ||
                                pathSegments.slice(index + 1).every(isHiddenSegment);

                            return (
                                <React.Fragment key={href}>
                                    <BreadcrumbSeparator />
                                    <BreadcrumbItem>
                                        {isLast ? (
                                            <BreadcrumbPage className='text-mainColor font-semibold'>{
                                                transaction ? `${formattedSegment} SPK/${transaction}` : formattedSegment
                                            }</BreadcrumbPage>
                                        ) : (
                                            <BreadcrumbLink href={href}>{formattedSegment}</BreadcrumbLink>
                                        )}
                                    </BreadcrumbItem>
                                </React.Fragment>
                            );
                        })}
                    </BreadcrumbList>
                </Breadcrumb>

                {/* Search + Notification */}
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
                    <Link href="/pemberitahuan">
                        <Button variant={"outline"} size={"icon"} className="relative">
                            <RiNotification4Fill className="text-neutral-500 dark:text-neutral-300" />
                            <div className="absolute right-[8px] top-2 w-[7px] h-[7px] border border-white dark:border-black bg-red-600 dark:bg-red-500 rounded-full"></div>
                        </Button>
                    </Link>
                </div>
            </div>
        </div>
    );
}
