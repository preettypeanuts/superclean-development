"use client"
import React from 'react';
import {
    Breadcrumb,
    BreadcrumbItem,
    BreadcrumbLink,
    BreadcrumbList,
    BreadcrumbPage,
    BreadcrumbSeparator,
} from "../../../../ui-components/src/components/ui/breadcrumb"
import { usePathname } from 'next/navigation'
import { Input } from '../../../../ui-components/src/components/ui/input';
import { Search } from 'lucide-react';
import { Button } from '../../../../ui-components/src/components/ui/button';
import { RiNotification4Fill } from 'react-icons/ri';

type HeaderProps = {
    label: string,
    desc?: string
    count?: number
}

export function Breadcrumbs({ label, desc, count }: HeaderProps) {
    const pathname = usePathname()
    const pathSegments = pathname.split('/').filter(segment => segment)
    const path = usePathname();
    const noNavigation = ["/login", "/forgot-password", "/reset-password"];
    // Hide the component on the home screen
    if (noNavigation.includes(pathname)) {
        return null;
    }

    const searchNavbar = "/"

    return (
        <div className='navbar w-auto h-[50px] !min-h-[50px]  bg-white dark:bg-black shadow-mainShadow rounded-xl z-50 ml-2 mr-2 mt-2 mb-2'>
            <div className='flex items-center justify-between w-full'>
                <section className="flex gap-2 items-center">
                    <div className="w-1 self-stretch rounded-full bg-mainColor"></div>
                    <div>
                        <div className="text-xl font-medium flex items-center gap-2">
                            {label}
                            <div className={`${!count && "hidden"} flex items-center justify-center text-sm px-1 py-[1px] w-5 h-5 bg-thirdColor text-white dark:text-black rounded-[5px] !aspect-square`}>
                                {count}
                            </div>
                        </div>
                        <p className="opacity-70">
                            {desc}
                        </p>
                    </div>
                </section>
                <Breadcrumb className={`${searchNavbar.includes(pathname) ? "hidden" : "block"} px-4 py-2 w-fit capitalize`}>
                    <BreadcrumbList>
                        <BreadcrumbItem>
                            <BreadcrumbLink href="/">
                                Dashboard
                            </BreadcrumbLink>
                        </BreadcrumbItem>
                        {pathSegments
                            .filter(segment =>
                                !/^[a-zA-Z0-9]{10,}$/.test(segment) && // filter ID
                                segment !== "TRX-134544" // filter TRX-134544
                            )
                            .map((segment, index, filteredSegments) => {
                                const isLast = index === filteredSegments.length - 1;
                                const originalIndex = pathSegments.findIndex(s => s === segment); // temukan index asli dari segment ini
                                const href = '/' + pathSegments.slice(0, originalIndex + 1).join('/');
                                const firstPage = '/' + pathSegments.slice(0, 2).join('/');
                                const formattedSegment = segment.replace(/-/g, " ");

                                return (
                                    <React.Fragment key={href}>
                                        <BreadcrumbSeparator />
                                        <BreadcrumbItem>
                                            {isLast ? (
                                                <BreadcrumbPage className='text-mainColor font-semibold'>{formattedSegment}</BreadcrumbPage>
                                            ) : (
                                                <BreadcrumbLink href={`${index === 0 ? firstPage : href}`}>{formattedSegment}</BreadcrumbLink>
                                            )}
                                        </BreadcrumbItem>
                                    </React.Fragment>
                                );
                            })}

                    </BreadcrumbList>
                </Breadcrumb>

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
        </div>

    )
}
