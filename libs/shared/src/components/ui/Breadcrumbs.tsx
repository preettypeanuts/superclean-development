"use client"
import React from 'react';
import {
    Breadcrumb,
    BreadcrumbEllipsis,
    BreadcrumbItem,
    BreadcrumbLink,
    BreadcrumbList,
    BreadcrumbPage,
    BreadcrumbSeparator,
} from "../../../../ui-components/src/components/ui/breadcrumb"
import { usePathname } from 'next/navigation'
import { TbLayoutDashboardFilled } from 'react-icons/tb';


export function Breadcrumbs() {
    const pathname = usePathname()
    const pathSegments = pathname.split('/').filter(segment => segment)
    const path = usePathname();
    const noNavigation = ["/", "/login", "/forgot-password", "/reset-password"];
    // Hide the component on the home screen
    if (noNavigation.includes(pathname)) {
        return null;
    }

    return (
        <Breadcrumb className="mt-2 px-4 py-2 dark:bg-black rounded-3xl bg-white shadow-mainShadow w-fit mx-2 mb-2 capitalize">
            <BreadcrumbList>
                <BreadcrumbItem>
                    <BreadcrumbLink href="/">
                        <TbLayoutDashboardFilled />
                    </BreadcrumbLink>
                </BreadcrumbItem>
                {pathSegments.map((segment, index) => {
                    const href = '/' + pathSegments.slice(0, index + 1).join('/')
                    const firstPage = '/' + pathSegments.slice(0, 2).join('/')
                    const isLast = index === pathSegments.length - 1
                    const formattedSegment = segment.replace(/-/g, " ")
                    return (
                        <React.Fragment key={href}>
                            <BreadcrumbSeparator />
                            <BreadcrumbItem>
                                {isLast ? (
                                    <BreadcrumbPage>{formattedSegment}</BreadcrumbPage>
                                ) : (
                                    <BreadcrumbLink href={`${index === 0 ? firstPage : href}`}>{formattedSegment}</BreadcrumbLink>
                                )}
                            </BreadcrumbItem>
                        </React.Fragment>
                    )
                })}
            </BreadcrumbList>
        </Breadcrumb>
    )
}
