import PostThread from "@/components/forms/PostThread";
import { UserSession } from "@/types/user-session.type";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/authOptions";
import { permanentRedirect } from "next/navigation";

export const metadata = {
    title: "Create Thread",
}

const Page = async () => {
    const data: UserSession | null = await getServerSession(authOptions);
    if (!data?.user) {
        permanentRedirect('/login');
    }

    return (
        <>
            <h1 className='head-text'>Create Thread</h1>

            <PostThread userId={data.user.id}/>
        </>
    );
};

export default Page;
