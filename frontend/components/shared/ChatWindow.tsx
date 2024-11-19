"use client";

import { useEffect, useRef, useState } from "react";
import { useGetChatUsersQuery } from "@/store/users/userApi";
import { User } from "@/types/user.type";
import useWebSocket from "react-use-websocket";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { ChatBubble, ChatBubbleAvatar, ChatBubbleMessage } from "@/components/ui/chat/chat-bubble";
import { ChatInput } from "@/components/ui/chat/chat-input";
import { ChatMessageList } from "@/components/ui/chat/chat-message-list";
import { Button } from "@/components/ui/button";
import { X } from "lucide-react";
import { useSession } from "next-auth/react";

interface ChatWindowProps {
    isOpen: boolean;
    onClose: () => void;
    receiverUser?: User; // Add receiver user prop
}

interface Message {
    role: 'user' | 'assistant';
    content: string;
}

export default function ChatWindow({ isOpen, onClose, receiverUser }: ChatWindowProps) {
    const [messages, setMessages] = useState<Message[]>([]);
    const [activeUser, setActiveUser] = useState<User | null>(null);
    const messagesRef = useRef<HTMLDivElement>(null);
    const { data: session } = useSession(); // Get current logged in user
    
    const socketUrl = "ws://localhost:8080/ws";
    const { sendJsonMessage } = useWebSocket(socketUrl, {
        onMessage: (event) => {
            console.log(event.data);
        },
        shouldReconnect: (closeEvent) => true,
    });

    const { data, isLoading: chatUsersLoading } = useGetChatUsersQuery();
    const users = data?.users ?? [];

    useEffect(() => {
        if (receiverUser) {
            setActiveUser(receiverUser);
        }
    }, [receiverUser]);

    useEffect(() => {
        if (messagesRef.current) {
            messagesRef.current.scrollTop = messagesRef.current.scrollHeight;
        }
    }, [messages]);

    if (!isOpen) return null;

    const onSubmit = async (event: React.KeyboardEvent<HTMLTextAreaElement>) => {
        if (event.key !== 'Enter' || event.shiftKey) return;
        event.preventDefault();
        
        if (!activeUser || !session?.user?.id) return;
        const content = event.currentTarget.value.trim();
        if (!content) return;

        const message = {
            sender_id: session.user.id,
            receiver_id: activeUser.id,
            content,
        };

        sendJsonMessage(message);
        
        setMessages(prev => [...prev, {
            role: 'user',
            content
        }]);

        // Clear the input
        event.currentTarget.value = '';
    };

    return (
        <div className="fixed bottom-0 right-4 w-96 h-[600px] bg-background border-2 border-primary/20 rounded-t-lg shadow-[0_-4px_12px_rgba(0,0,0,0.15)] flex flex-col z-50">
            <div className="flex justify-between items-center p-4 border-b">
                <h2 className="text-lg font-semibold">
                    {activeUser ? `Chat with ${activeUser.name}` : 'Select a user'}
                </h2>
                <Button variant="ghost" size="icon" onClick={onClose}>
                    <X className="h-4 w-4" />
                </Button>
            </div>

            {!activeUser ? (
                <div className="flex-1 p-4 overflow-y-auto">
                    {chatUsersLoading ? (
                        <div className="flex items-center justify-center h-full">
                            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
                        </div>
                    ) : (
                        <ul className="space-y-2">
                            {users.map((user) => (
                                <li
                                    key={user.id}
                                    className="flex items-center space-x-3 cursor-pointer p-2 rounded-md hover:bg-muted"
                                    onClick={() => setActiveUser(user)}
                                >
                                    <Avatar>
                                        <AvatarImage src={user.image} alt={user.name} />
                                        <AvatarFallback>{user.name[0]}</AvatarFallback>
                                    </Avatar>
                                    <span className="font-medium">{user.name}</span>
                                </li>
                            ))}
                        </ul>
                    )}
                </div>
            ) : (
                <>
                    <ChatMessageList ref={messagesRef} className="flex-1 overflow-y-auto p-4">
                        {messages.map((message, index) => (
                            <ChatBubble
                                key={index}
                                variant={message.role === "user" ? "sent" : "received"}
                            >
                                <ChatBubbleAvatar
                                    src=""
                                    fallback={message.role === "user" ? "👤" : "👥"}
                                />
                                <ChatBubbleMessage>{message.content}</ChatBubbleMessage>
                            </ChatBubble>
                        ))}
                    </ChatMessageList>

                    <div className="p-4 border-t">
                        <ChatInput
                            placeholder="Type a message..."
                            onKeyDown={onSubmit}
                        />
                    </div>
                </>
            )}
        </div>
    );
}
