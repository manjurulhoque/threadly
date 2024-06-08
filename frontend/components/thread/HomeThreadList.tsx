"use client";

import { useGetThreadsQuery } from "@/store/threads/threadApi";
import { useEffect, useState } from "react";
import ThreadCard from "@/components/cards/ThreadCard";

const HomeThreadList = () => {
    const {data, isLoading} = useGetThreadsQuery();
    const [mounted, setMounted] = useState(false);
    const threads = data?.threads || [];

    console.log(threads);

    // Ensure the component is only rendered after it's mounted on the client
    useEffect(() => {
        setMounted(true);
    }, []);

    if (!mounted) {
        return null; // Avoid rendering anything during SSR
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
                            <ThreadCard thread={thread} />
                        ))}
                    </section>
                )
            )}
        </>
    );
}

export default HomeThreadList;