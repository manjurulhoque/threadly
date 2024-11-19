"use client";

import { SessionProvider } from "next-auth/react";
import React from "react";
import { Session } from "next-auth";

type Props = {
    children?: React.ReactNode;
    session: Session | null;
};

export const NextAuthProvider = ({children, session}: Props) => {
    return <SessionProvider session={session} refetchInterval={0} refetchOnWindowFocus={false}>{children}</SessionProvider>;
};
