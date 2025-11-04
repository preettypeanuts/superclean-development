'use client';

import { Sidebar } from "@shared/components/ui/Sidebar";
import '@superclean-workspace/shared/styles';
import { Toaster } from "libs/ui-components/src/components/ui/toaster";
import { useState } from "react";


export default function Content({ children }: { children: React.ReactNode }) {
  const [isExpanded, setIsExpanded] = useState(true);


  const noNavigation = ["/login", "/forgot-password", "/reset-password", "/invoice/[id]", "/rating", "payment/[id]"];
  const pathname = typeof window !== 'undefined' ? window.location.pathname : '';
  const isNoNavigation = noNavigation.includes(pathname);

  const maxWidthClass = isNoNavigation ? 'max-w-full' : isExpanded ? 'max-w-[calc(100%-250px)]' : 'max-w-[calc(100%-80px)]';
  console.log(maxWidthClass, isNoNavigation);


  return (
    <>
      <Sidebar isExpanded={isExpanded} setIsExpanded={setIsExpanded} />
      <section className={`flex flex-col max-h-[98lvh] h-[98lvh] flex-1 min-h-0 ${maxWidthClass}`}>
        <Toaster />
        <main className='flex-grow min-h-0'>
          {children}
        </main>
      </section>
    </>
  );
}