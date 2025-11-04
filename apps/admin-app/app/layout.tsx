import ProtectedLayout from "@shared/components/ProtectedLayout";
import '@superclean-workspace/shared/styles';
import { ThemeProvider } from 'next-themes';
import { Plus_Jakarta_Sans } from "next/font/google";
import Content from "./content";

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
            <Content>
              {children}
            </Content>
          </ProtectedLayout>
        </ThemeProvider>
      </body>
    </html>
  );
}