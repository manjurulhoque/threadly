import type { Metadata } from "next";
import Login from "@/components/auth/Login";
import { permanentRedirect } from "next/navigation";
import { authOptions } from "@/lib/authOptions";
import { getServerSession } from "next-auth";
import { UserSession } from "@/types/user-session.type";

export const metadata: Metadata = {
    title: "Login",
    description: "Login to your account",
}

const Page = async () => {
    const data: UserSession | null = await getServerSession(authOptions);
    if (data?.user) {
        permanentRedirect('/');
    }

    return (
        <Login/>
    );
}

export default Page;
