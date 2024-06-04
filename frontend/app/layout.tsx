
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import Sidebar from '@/components/User/sidebar';
import Tobbar from "@/components/User/TopBar";
import StoreProvider from '@/lib/redux/StoreProvider'

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Ping-Pong",
  description: "Play ping pong game",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${inter.className} font-serif`}>
        {/* Application shared components */}
      
        <StoreProvider>
          {children}
        </StoreProvider>
      </body>
    </html>
  );
}
