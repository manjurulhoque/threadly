import React from "react";
import { UserSession } from "@/types/user-session.type";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/authOptions";
import { permanentRedirect } from "next/navigation";
import { fetchUser } from "@/lib/actions/user.actions";
import ThreadCard from "@/components/cards/ThreadCard";
import { fetchThread } from "@/lib/actions/thread.actions";
import CommentForm from "@/components/forms/CommentForm";
import CommentList from "@/components/comments/CommentList";
import { CommentsProvider } from "@/context/CommentsContext";

export const metadata = {
    title: "Single Thread",
    description: "Thread",
};

interface Props {
    params: {
        id: number;
    };
}

const Page: React.FC<Props> = async ({ params: { id } }) => {
    const data: UserSession | null = await getServerSession(authOptions);
    const user = data?.user;

    if (!user) {
        console.warn("No user session found, redirecting to login.");
        permanentRedirect('/login');
        return null;
    }

    let userInfo = null;
    let thread = null;

    try {
        const { data: fetchedUser } = await fetchUser(user.id);
        if (!fetchedUser) {
            console.warn("User information not found. Redirecting to home.");
            permanentRedirect('/');
            return null;
        }
        userInfo = fetchedUser;
    } catch (error: any) {
        console.error("Failed to fetch user information:", error.message || error);
        return (
            <section className='mx-auto max-w-3xl text-center py-20'>
                <h1 className='head-text'>Error</h1>
                <p className='mt-3 text-base-regular dark:text-light-2'>
                    Unable to load user information. Please try again later.
                </p>
            </section>
        );
    }

    try {
        const { thread: fetchedThread } = await fetchThread(Number(id));
        if (!fetchedThread) {
            console.warn("Thread not found.");
            return (
                <section className='mx-auto max-w-3xl text-center py-20'>
                    <h1 className='head-text'>Thread Not Found</h1>
                    <p className='mt-3 text-base-regular dark:text-light-2'>
                        The thread you are looking for does not exist.
                    </p>
                </section>
            );
        }
        thread = fetchedThread;
    } catch (error: any) {
        console.error("Failed to fetch thread:", error.message || error);
        return (
            <section className='mx-auto max-w-3xl text-center py-20'>
                <h1 className='head-text'>Error</h1>
                <p className='mt-3 text-base-regular dark:text-light-2'>
                    Unable to load the thread. Please try again later.
                </p>
            </section>
        );
    }

    return (
        <CommentsProvider>
            <section className='relative'>
                <div>
                    <ThreadCard thread={thread} />
                </div>

                <div className='mt-7'>
                    <CommentForm
                        threadId={Number(id)}
                        currentUserImg={userInfo.image}
                    />
                </div>

                <div className='mt-10'>
                    <CommentList threadId={id} />
                </div>
            </section>
        </CommentsProvider>
    );
};

export default Page;
