import React from "react";
import type { Metadata } from "next";
import { Inter } from "next/font/google";

import "../globals.css";
import TopBar from "@/components/shared/Topbar";
import LeftSidebar from "@/components/shared/LeftSidebar";
import RightSidebar from "@/components/shared/RightSidebar";
import BottomBar from "@/components/shared/BottomBar";
import { Toaster } from "@/components/ui/toaster";

const inter = Inter({subsets: ["latin"]});

export const metadata: Metadata = {
    title: {
        template: '%s - Threadly',
        default: '',
    },
    description: '',
}

export default function RootLayout({children}: { children: React.ReactNode; }) {
    return (
        <html lang='en'>
        <body className={inter.className}>
        <TopBar/>

        <main className='flex flex-row'>
            <LeftSidebar/>
            <section className='main-container'>
                <div className='w-full max-w-4xl'>{children}</div>
            </section>
            {/* @ts-ignore */}
            <RightSidebar/>
        </main>

        <BottomBar/>
        <Toaster/>
        </body>
        </html>
    );
}