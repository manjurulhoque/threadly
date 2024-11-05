"use client";

import { SessionProvider } from "next-auth/react";
import React from "react";
import { Session } from "next-auth";

type Props = {
    children?: React.ReactNode;
    session: Session | any;
};

export const NextAuthProvider = ({children, session}: Props) => {
    return <SessionProvider session={session}>{children}</SessionProvider>;
};
