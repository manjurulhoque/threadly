'use client';

import { createContext, useContext, useState, useCallback } from 'react';

interface CommentsContextType {
    refreshComments: () => void;
    refreshTrigger: number;
}

const CommentsContext = createContext<CommentsContextType | null>(null);

export function CommentsProvider({ children }: { children: React.ReactNode }) {
    const [refreshTrigger, setRefreshTrigger] = useState(0);

    const refreshComments = useCallback(() => {
        setRefreshTrigger(prev => prev + 1);
    }, []);

    return (
        <CommentsContext.Provider value={{ refreshComments, refreshTrigger }}>
            {children}
        </CommentsContext.Provider>
    );
}

export function useComments() {
    const context = useContext(CommentsContext);
    if (!context) {
        throw new Error('useComments must be used within a CommentsProvider');
    }
    return context;
}