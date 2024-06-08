import { UserSession } from "@/types/user-session.type";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/authOptions";
import { permanentRedirect } from "next/navigation";
import type { Metadata } from "next";
import HomeThreadList from "@/components/thread/HomeThreadList";

export const metadata: Metadata = {
    title: 'Home - Threadly',
    description: '',
}

const Page = async ({searchParams,}: { searchParams: { [key: string]: string | undefined } }) => {
    const data: UserSession | null = await getServerSession(authOptions);
    if (!data?.user) {
        permanentRedirect('/login');
    }

    return (
        <>
            <h1 className="head-text text-left">Home</h1>

            <HomeThreadList/>
        </>
    )
}

export default Page;