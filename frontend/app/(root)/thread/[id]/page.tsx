import React from "react";
import { UserSession } from "@/types/user-session.type";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/authOptions";
import { permanentRedirect } from "next/navigation";
import { fetchUser } from "@/lib/actions/user.actions";
import ThreadCard from "@/components/cards/ThreadCard";
import { fetchThread } from "@/lib/actions/thread.actions";
import CommentForm from "@/components/forms/CommentForm";

export const metadata = {
    title: "Thread",
    description: "Thread",
}

interface Props {
    params: {
        id: string;
    };
}

const Page: React.FC<Props> = async ({params: {id}}) => {
    const data: UserSession | null = await getServerSession(authOptions);
    const user = data?.user;
    if (!user) {
        permanentRedirect('/login');
    }

    const userInfo = await fetchUser(user.id);
    if (!userInfo?.data) {
        permanentRedirect('/');
    }
    const {thread} = await fetchThread(Number(id));

    return (
        <section className='relative'>
            <div>
                <ThreadCard thread={thread}/>
            </div>

            <div className='mt-7'>
                <CommentForm
                    threadId={Number(id)}
                    currentUserImg={userInfo.data.image}
                />
            </div>

            <div className='mt-10'>
            </div>
        </section>
    );
};

export default Page;
