"use client"
import { Inter } from "next/font/google";
import "../../app/globals.css";
import Sidebar from "./sidebar";
import TopBar from "./TopBar";


const inter = Inter({ subsets: ["latin"] });

export default function MainLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {

  return (
      <main className={inter.className} style={{display: "flex", flexDirection: "column", overflow: "hidden"}}>{children}
        <Sidebar />
      <div className="order-[-1]">
        <TopBar/>
      </div>
      </main>
  );
}
