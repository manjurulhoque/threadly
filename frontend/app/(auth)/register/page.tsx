import Register from "@/components/auth/Register";
import { permanentRedirect } from "next/navigation";
import { authOptions } from "@/lib/authOptions";
import { getServerSession } from "next-auth";
import { UserSession } from "@/types/user-session.type";

export const metadata = {
    title: "Register",
    description: "Register for an account",
}

const Page = async () => {
    const data: UserSession | null = await getServerSession(authOptions);
    if (data?.user) {
        permanentRedirect('/');
    }

    return <Register/>
}

export default Page;
