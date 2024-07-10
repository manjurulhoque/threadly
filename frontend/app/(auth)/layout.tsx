import React from "react";
import type { Metadata } from "next";
import { Inter } from "next/font/google";

import "../globals.css";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/authOptions";
import { NextAuthProvider } from "@/components/NextAuthProvider";
import { ThemeProvider } from "@/components/theme-provider";

const inter = Inter({subsets: ["latin"]});

export const metadata: Metadata = {
    title: {
        template: '%s - Threadly',
        default: 'Auth',
    },
    description: '',
}

export default async function RootLayout({children,}: { children: React.ReactNode; }) {
    const session = await getServerSession(authOptions);

    return (
        <NextAuthProvider session={session}>
            <html lang='en'>
            <body className={`${inter.className} dark:bg-dark-1`}>
            <ThemeProvider
                attribute="class"
                defaultTheme="dark"
                storageKey="threadly-theme"
                enableSystem
                disableTransitionOnChange
            >
                {children}
            </ThemeProvider>
            </body>
            </html>
        </NextAuthProvider>
    );
}