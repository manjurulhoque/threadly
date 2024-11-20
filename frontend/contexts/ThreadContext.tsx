"use client";

import { createContext, useContext, useState } from 'react';
import { Thread } from '@/types/thread.type';

interface ThreadContextType {
    threads: Thread[];
    addThread: (thread: Thread) => void;
}

const ThreadContext = createContext<ThreadContextType | null>(null);

export function ThreadProvider({ children }: { children: React.ReactNode }) {
    const [threads, setThreads] = useState<Thread[]>([]);

    const addThread = (thread: Thread) => {
        setThreads(prevThreads => [thread, ...prevThreads]);
    };

    return (
        <ThreadContext.Provider value={{ threads, addThread }}>
            {children}
        </ThreadContext.Provider>
    );
}

export function useThreads() {
    const context = useContext(ThreadContext);
    if (!context) {
        throw new Error('useThreads must be used within a ThreadProvider');
    }
    return context;
}