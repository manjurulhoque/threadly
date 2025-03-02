"use client";

import React, { createContext, useContext, useEffect } from "react";
import useWebSocket from "react-use-websocket";
import { useSession } from "next-auth/react";

interface WebSocketContextType {
    sendMessage: (message: any) => void;
    lastMessage: MessageEvent<any> | null;
    readyState: number;
}

const WebSocketContext = createContext<WebSocketContextType | null>(null);

export function WebSocketProvider({ children }: { children: React.ReactNode }) {
    const { data: session } = useSession();
    const socketUrl = `ws://${process.env.BACKEND_BASE_URL}/ws?token=${session?.access}`;

    const { sendMessage, lastMessage, readyState } = useWebSocket(socketUrl, {
        shouldReconnect: (closeEvent) => true,
    });

    return (
        <WebSocketContext.Provider value={{ sendMessage, lastMessage, readyState }}>
            {children}
        </WebSocketContext.Provider>
    );
}

export function useWebSocketContext() {
    const context = useContext(WebSocketContext);
    if (!context) {
        throw new Error(
            "useWebSocketContext must be used within a WebSocketProvider"
        );
    }
    return context;
}
