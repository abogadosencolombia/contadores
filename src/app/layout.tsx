import { Outfit } from 'next/font/google';
import './globals.css';
import Script from 'next/script';

import { SidebarProvider } from '@/context/SidebarContext';
import { ThemeProvider } from '@/context/ThemeContext';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const outfit = Outfit({
  subsets: ["latin"],
});

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const wompiPublicKey = process.env.NEXT_PUBLIC_WOMPI_PUBLIC_KEY;
  return (
    <html lang="en">
      <body className={`${outfit.className} dark:bg-gray-900`}>
        <ThemeProvider>
          <SidebarProvider>{children}</SidebarProvider>
        </ThemeProvider>
        <ToastContainer position="top-right" autoClose={5000} hideProgressBar={false} style={{ zIndex: 99999 }} />
        {wompiPublicKey && (
          <Script
            src="https://cdn.wompi.co/libs/js/v1.js"
            data-public-key={wompiPublicKey}
            strategy="afterInteractive"
          />
        )}
      </body>
    </html>
  );
}
