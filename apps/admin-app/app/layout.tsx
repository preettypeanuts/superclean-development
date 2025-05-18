import { Figtree, Plus_Jakarta_Sans } from "next/font/google";
import { ThemeProvider } from 'next-themes';
import { Sidebar } from "@shared/components/ui/Sidebar"
import { Toaster } from "libs/ui-components/src/components/ui/toaster"
import ProtectedLayout from "@shared/components/ProtectedLayout"
import '@superclean-workspace/shared/styles';

const fightree = Figtree({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700", "800", "900"]
});
const jakartaSans = Plus_Jakarta_Sans({
  subsets: ["latin"],
  weight: ["200", "300", "400", "500", "600", "700", "800"]
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
        <link rel="icon" href={"assets/SC_LogoOnlyBig.png"} type="image/png" sizes="100x100" />
        <title>Superclean</title>
      </head>
      <body
        className={`${jakartaSans.className} antialiased md:flex `}
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
