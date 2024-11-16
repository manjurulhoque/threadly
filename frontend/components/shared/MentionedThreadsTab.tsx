"use client";

import ThreadCard from "../cards/ThreadCard";
import { useGetMentionedThreadsByUserQuery } from "@/store/threads/threadApi";

interface Props {
    userId: number;
}

const MentionedThreadsTab = ({ userId }: Props) => {
    const { data, isLoading } = useGetMentionedThreadsByUserQuery(userId);
    const threads = data?.threads || [];

    if (isLoading) {
        return <p className="text-base-regular text-gray-800 dark:text-light-2">Loading...</p>;
    }

    return (
        <section className="mt-9 flex flex-col gap-10">
            {threads.length === 0 && (
                <p className="text-base-regular text-gray-800 dark:text-light-2">
                    No mentioned threads found.
                </p>
            )}
            {threads?.map((thread) => (
                <ThreadCard key={thread.id} thread={thread} />
            ))}
        </section>
    );
};

export default MentionedThreadsTab;