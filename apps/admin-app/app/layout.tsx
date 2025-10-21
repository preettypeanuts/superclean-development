"use client";

import ProtectedLayout from "@shared/components/ProtectedLayout";
import { Sidebar } from "@shared/components/ui/Sidebar";
import '@superclean-workspace/shared/styles';
import { Toaster } from "libs/ui-components/src/components/ui/toaster";
import { ThemeProvider } from 'next-themes';
import { Figtree, Plus_Jakarta_Sans } from "next/font/google";
import { useState } from "react";

const fightree = Figtree({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700", "800", "900"]
});

const jakartaSans = Plus_Jakarta_Sans({
  subsets: ["latin"],
  weight: ["200", "300", "400", "500", "600", "700", "800"]
});

// export const metadata = {
//   title: 'Superclean',
//   description: 'Superclean Backoffice',
// };

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [isExpanded, setIsExpanded] = useState(true);

  return (
    <html lang="en" suppressHydrationWarning className='scroll-smooth'>
      <head>
        <meta charSet="UTF-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <link rel="icon" href={"assets/SC_LogoOnlyBig.png"} type="image/png" sizes="100x100" />
        <title>Superclean</title>
      </head>
      <body
        className={`${jakartaSans.className} antialiased md:flex `}
      >
        <ThemeProvider enableSystem={false} defaultTheme='light' attribute="class">
          <ProtectedLayout>
            <Sidebar
              isExpanded={isExpanded}
              setIsExpanded={setIsExpanded}
            />
            <section className={`flex-1 ${isExpanded ? 'max-w-[calc(100vw-256px)]' : 'max-w-[calc(100vw-79px)]'}`}>
              <Toaster />
              <main className='flex-grow min-h-0'>
                {children}
              </main>
            </section>
          </ProtectedLayout>
        </ThemeProvider>
      </body>
    </html>
  );
}
