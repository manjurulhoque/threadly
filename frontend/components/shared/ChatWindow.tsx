"use client";

import { useEffect, useRef, useState } from "react";
import { useGetChatUsersQuery, useGetMessagesQuery } from "@/store/users/userApi";
import { User } from "@/types/user.type";
import useWebSocket from "react-use-websocket";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { ChatBubble, ChatBubbleAvatar, ChatBubbleMessage } from "@/components/ui/chat/chat-bubble";
import { ChatInput } from "@/components/ui/chat/chat-input";
import { ChatMessageList } from "@/components/ui/chat/chat-message-list";
import { Button } from "@/components/ui/button";
import { X } from "lucide-react";
import { useSession } from "next-auth/react";
import { Message } from "@/types/message.type";
import { useWebSocketContext } from "@/contexts/WebSocketContext";

interface ChatWindowProps {
    isOpen: boolean;
    onClose: () => void;
    receiverUser: User;
}


export default function ChatWindow({ isOpen, onClose, receiverUser }: ChatWindowProps) {
    const [messages, setMessages] = useState<Message[]>([]);
    const messagesRef = useRef<HTMLDivElement>(null);
    const { data: session } = useSession(); // Get current logged in user
    const { data, isLoading: messagesLoading } = useGetMessagesQuery({receiverId: receiverUser?.id, page: 1, limit: 20});
    const previousMessages = data?.messages ?? [];
    
    const { sendMessage, lastMessage } = useWebSocketContext();

    useEffect(() => {
        if (lastMessage) {
            const message = JSON.parse(lastMessage.data);
            if (message.type === "message") {
                setMessages(prev => [...prev, {
                    id: Date.now(),
                    content: message.content,
                    created_at: new Date().toISOString(),
                    sender_id: message.sender_id,
                    receiver_id: message.receiver_id
                }]);
            }
        }
    }, [lastMessage]);

    useEffect(() => {
        if (messagesRef.current) {
            messagesRef.current.scrollTop = messagesRef.current.scrollHeight;
        }
        if (previousMessages.length > 0) {
            setMessages(previousMessages);
        }
    }, [previousMessages]);

    // Add effect to scroll to bottom when window opens
    useEffect(() => {
        if (isOpen && messagesRef.current) {
            messagesRef.current.scrollTop = messagesRef.current.scrollHeight;
        }
    }, [isOpen]);

    if (!isOpen || !receiverUser) return null;

    const onSubmit = async (event: React.KeyboardEvent<HTMLTextAreaElement>) => {
        if (event.key !== 'Enter' || event.shiftKey) return;
        event.preventDefault();
        
        if (!session?.user?.id) return;
        const content = event.currentTarget.value.trim();
        if (!content) return;

        const message = {
            sender_id: session.user.id,
            receiver_id: receiverUser.id,
            content,
        };

        sendMessage(message);

        // Clear the input
        event.currentTarget.value = '';

        // Scroll to bottom after sending message
        if (messagesRef.current) {
            messagesRef.current.scrollTop = messagesRef.current.scrollHeight;
        }
    };

    return (
        <div className="fixed bottom-0 right-4 w-96 h-[600px] bg-zinc-100 dark:bg-zinc-900 text-zinc-900 dark:text-zinc-100 border-2 border-primary/20 rounded-t-lg shadow-[0_-4px_12px_rgba(0,0,0,0.15)] flex flex-col z-50">
            <div className="flex justify-between items-center p-4 border-b border-zinc-200 dark:border-zinc-800">
                <h2 className="text-lg font-semibold">
                    Chat with {receiverUser.name}
                </h2>
                <Button variant="ghost" size="icon" onClick={onClose}>
                    <X className="h-4 w-4" />
                </Button>
            </div>

            <ChatMessageList ref={messagesRef} className="flex-1 overflow-y-auto p-4">
                {messages.map((message, index) => (
                    <ChatBubble
                        key={index}
                        variant={message.sender_id === parseInt(session?.user?.id!) ? "sent" : "received"}
                    >
                        <ChatBubbleAvatar
                            src=""
                            fallback={message.sender_id === parseInt(session?.user?.id!) ? "👤" : "👥"}
                        />
                        <ChatBubbleMessage>{message.content}</ChatBubbleMessage>
                    </ChatBubble>
                ))}
            </ChatMessageList>

            <div className="p-4 border-t border-zinc-200 dark:border-zinc-800">
                <ChatInput
                    placeholder="Type a message..."
                    onKeyDown={onSubmit}
                />
            </div>
        </div>
    );
}
