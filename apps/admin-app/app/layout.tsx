import '@superclean-workspace/shared/styles';
import { ThemeProvider } from 'next-themes';
import { Figtree } from "next/font/google";
import { Sidebar } from "@shared/components/ui/Sidebar"
import { Breadcrumbs } from "@shared/components/ui/Breadcrumbs"
import { Navbar } from "@shared/components/ui/Navbar"
import { Toaster } from "libs/ui-components/src/components/ui/toaster"
import ProtectedLayout from "@shared/components/ProtectedLayout"
import SCLogoOnly from "libs/assets/SC_LogoOnlyBig.png"

const fightree = Figtree({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700", "800", "900"]
});

export const metadata = {
  title: 'Superclean',
  description: 'Superclean Backoffice',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning className='scroll-smooth'>
      <head>
        <meta charSet="UTF-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <link rel="icon" href={SCLogoOnly.src} type="image/png" sizes="100x100" />
        <title>Superclean</title>
      </head>
      <body
        className={`${fightree.className} antialiased md:flex`}
      >
        <ThemeProvider enableSystem={false} defaultTheme='light' attribute="class">
          <ProtectedLayout>
            <Sidebar />
            <section className='flex flex-col max-h-[98lvh] h-[98lvh] w-full min-h-0'>
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
