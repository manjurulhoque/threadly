"use client";

import ThreadCard from "../cards/ThreadCard";
import { useGetRepliedThreadsByUserQuery, useGetThreadsByUserQuery } from "@/store/threads/threadApi";

interface Props {
    userId: number;
}

const RepliedThreadsTab = ({ userId }: Props) => {
    const { data, isLoading } = useGetRepliedThreadsByUserQuery(userId);
    const threads = data?.threads || [];

    if (isLoading) {
        return <p>Loading...</p>;
    }

    return (
        <section className='mt-9 flex flex-col gap-10'>
            {
                threads?.map((thread) => (
                    <ThreadCard key={thread.id} thread={thread} />
                ))
            }
        </section>
    );
}

export default RepliedThreadsTab;