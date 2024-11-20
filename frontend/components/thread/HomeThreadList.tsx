"use client";

import { useGetThreadsQuery } from "@/store/threads/threadApi";
import { useEffect, useState } from "react";
import ThreadCard from "@/components/cards/ThreadCard";
import { useThreads } from "@/contexts/ThreadContext";

const HomeThreadList = () => {
    const { data, isLoading } = useGetThreadsQuery();
    const [mounted, setMounted] = useState(false);
    const { threads: contextThreads } = useThreads();
    const threads = [...contextThreads, ...(data?.threads || [])];

    useEffect(() => {
        setMounted(true);
    }, []);

    if (!mounted) {
        return null;
    }

    return (
        <>
            {isLoading ? (
                <p>Loading...</p>
            ) : (
                threads.length === 0 ? (
                    <section className="mt-9 flex flex-col gap-10">
                        <p className='no-result'>No threads found</p>
                    </section>
                ) : (
                    <section className="mt-9 flex flex-col gap-10">
                        {threads.map((thread) => (
                            <ThreadCard thread={thread} key={thread.id}/>
                        ))}
                    </section>
                )
            )}
        </>
    );
}

export default HomeThreadList;