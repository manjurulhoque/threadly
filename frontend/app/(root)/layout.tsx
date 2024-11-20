import React from "react";
import type { Metadata } from "next";
import { Inter } from "next/font/google";

import "../globals.css";
import TopBar from "@/components/shared/Topbar";
import LeftSidebar from "@/components/shared/LeftSidebar";
import RightSidebar from "@/components/shared/RightSidebar";
import BottomBar from "@/components/shared/BottomBar";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/authOptions";
import { NextAuthProvider } from "@/components/NextAuthProvider";
import ReduxProvider from "@/components/ReduxProvider";
import { ToastContainer } from "react-toastify";
import 'react-toastify/dist/ReactToastify.css';
import { ThemeProvider } from "@/components/theme-provider";
import { WebSocketProvider } from "@/contexts/WebSocketContext";
import { ThreadProvider } from "@/contexts/ThreadContext";

const inter = Inter({subsets: ["latin"]});

export const metadata: Metadata = {
    title: {
        template: '%s - Threadly',
        default: '',
    },
    description: '',
}

export default async function RootLayout({children}: { children: React.ReactNode; }) {
    const session = await getServerSession(authOptions);

    return (
        <NextAuthProvider session={session}>
            <html lang='en' suppressHydrationWarning>
            <body className={`${inter.className} bg-light-2 dark:bg-dark-2`}>
            <ThemeProvider
                attribute="class"
                defaultTheme="dark"
                storageKey="threadly-theme"
                enableSystem
                disableTransitionOnChange
            >
                <ReduxProvider>
                    <WebSocketProvider>
                        <ThreadProvider>
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
                            <ToastContainer/>
                        </ThreadProvider>
                    </WebSocketProvider>
                </ReduxProvider>
            </ThemeProvider>
            </body>
            </html>
        </NextAuthProvider>
    );
}