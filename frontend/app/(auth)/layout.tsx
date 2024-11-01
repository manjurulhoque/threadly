import React from "react";
import type { Metadata } from "next";
import { Inter } from "next/font/google";

import "../globals.css";

const inter = Inter({subsets: ["latin"]});

export const metadata: Metadata = {
    title: {
        template: '%s - Threadly',
        default: 'Auth',
    },
    description: '',
}

export default function RootLayout({children,}: { children: React.ReactNode; }) {
    return (
        <html lang='en'>
        <body className={`${inter.className} bg-dark-1`}>
        {children}
        </body>
        </html>
    );
}