"use client";

import { ChatBubble, ChatBubbleAvatar, ChatBubbleMessage, } from "@/components/ui/chat/chat-bubble";
import { ChatInput } from "@/components/ui/chat/chat-input";
import { ChatMessageList } from "@/components/ui/chat/chat-message-list";
import { Button } from "@/components/ui/button";
import { Mic, Paperclip, Send } from "lucide-react";
import React, { useEffect, useRef, useState } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useWebSocketContext } from '@/contexts/WebSocketContext';
import { useGetChatUsersQuery, useGetMessagesQuery } from "@/store/users/userApi";
import { User } from "@/types/user.type";
import { Message } from "@/types/message.type";
import { useSession } from "next-auth/react";


export default function ChatMessage() {
    const { data: session } = useSession();
    const currentUser = session?.user;
    const [ activeUser, setActiveUser ] = useState<User | null>(null);
    const { sendMessage, lastMessage } = useWebSocketContext();
    const { data: chatUsersData, isLoading: chatUsersLoading, error: chatUsersError } = useGetChatUsersQuery();
    const users = chatUsersData?.users ?? [];
    const [messages, setMessages] = useState<Message[]>([]);

    const { 
        data: messagesData, 
        isLoading: messagesLoading 
    } = useGetMessagesQuery(
        { receiverId: activeUser?.id ?? 0, page: 1, limit: 20 },
        { skip: !activeUser }
    );

    const messagesRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (messagesRef.current) {
            messagesRef.current.scrollTop = messagesRef.current.scrollHeight;
        }
    }, [ messages ]);

    useEffect(() => {
        if (activeUser && messagesData?.messages) {
            setMessages(messagesData.messages);
        }
    }, [activeUser, messagesData]);

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

    const onSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        const formData = new FormData(e.currentTarget);
        const content = formData.get('content') as string;

        if (!content.trim() || !currentUser?.id) return;

        const message = {
            sender_id: parseInt(currentUser.id),
            receiver_id: activeUser?.id,
            content: content.trim(),
        };

        sendMessage(JSON.stringify(message));
        e.currentTarget.reset();
    };

    const onKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
        if (e.key === "Enter" && !e.shiftKey) {
            e.preventDefault();
            const content = e.currentTarget.value;

            if (!content.trim() || !currentUser?.id) return;

            const message = {
                sender_id: parseInt(currentUser.id),
                receiver_id: activeUser?.id,
                content: content.trim(),
            };

            sendMessage(JSON.stringify(message));
            e.currentTarget.value = '';
        }
    };

    const onChatUserClick = (user: User) => {
        setActiveUser(user);
    };

    const getUserImage = (user: User) => {
        return user.image ? `${process.env.BACKEND_BASE_URL}/${user.image}` : `https://api.dicebear.com/7.x/initials/svg?seed=${user.name}`;
    };

    return (
        <main className="flex h-[800px] w-full border dark:border-gray-700">
            {/* Left Sidebar */}
            <div className="w-1/4 bg-background border-r p-4 shadow-lg dark:border-gray-700">
                <h2 className="text-xl font-bold mb-4 text-foreground">Users</h2>
                {chatUsersLoading ? (
                    <div className="flex items-center justify-center h-40">
                        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
                    </div>
                ) : chatUsersError ? (
                    <div className="text-destructive text-center">Error loading users</div>
                ) : users.length === 0 ? (
                    <div className="text-muted-foreground text-center py-8">
                        No users found. Check back later!
                    </div>
                ) : (
                    <ul className="space-y-4">
                        {users.map((user) => (
                            <li
                                key={user.id}
                                className={`flex items-center space-x-3 cursor-pointer p-2 rounded-md ${
                                    activeUser?.id === user.id ? "bg-muted" : "hover:bg-muted"
                                }`}
                                onClick={() => onChatUserClick(user)}
                            >
                                <Avatar>
                                    <AvatarImage src={getUserImage(user)} alt={user.name}/>
                                    <AvatarFallback>{user.name[0]}</AvatarFallback>
                                </Avatar>
                                <span className={`font-medium text-foreground`}>{user.name}</span>
                            </li>
                        ))}
                    </ul>
                )}
            </div>

            {/* Chat Area */}
            <div className="flex-1 flex flex-col border border-gray-200 dark:border-gray-700 shadow-xl">
                {activeUser ? (
                    <>
                        {/* Chat Header */}
                        <div className="p-4 bg-primary-500 border-b dark:border-gray-700">
                            <h2 className="text-lg font-semibold text-foreground">Chat with {activeUser.name}</h2>
                        </div>

                        {/* Messages */}
                        <ChatMessageList ref={messagesRef} className="flex-1 overflow-y-auto p-4">
                            {messages.length === 0 && (
                                <div className="flex items-center justify-center h-full text-muted-foreground">
                                    Start chatting with {activeUser.name}!
                                </div>
                            )}
                            {messages.map((message, index) => (
                                <ChatBubble
                                    key={index}
                                    variant={message.sender_id === parseInt(currentUser?.id!) ? "sent" : "received"}
                                >
                                    <ChatBubbleAvatar
                                        src=""
                                        fallback={message.sender_id === parseInt(currentUser?.id!) ? "👨🏽" : "👥"}
                                    />
                                    <ChatBubbleMessage key={index}>
                                        {message.content}
                                    </ChatBubbleMessage>
                                </ChatBubble>
                            ))}
                        </ChatMessageList>

                        {/* Chat Input */}
                        <div className="p-4 border-t dark:border-gray-700">
                            <div className="relative rounded-lg border bg-background focus-within:ring-1 focus-within:ring-ring dark:border-gray-700">
                                <div className="flex">
                                    <ChatInput
                                        onKeyDown={onKeyDown}
                                        placeholder={`Message ${activeUser.name}`}
                                        className="min-h-12 resize-none rounded-lg bg-background border-0 p-3 shadow-none focus-visible:ring-0 flex-1"
                                        name="content"
                                    />
                                    <Button 
                                        onClick={() => {
                                            const textarea = document.querySelector('textarea[name="content"]') as HTMLTextAreaElement;
                                            if (textarea) {
                                                const event = new KeyboardEvent('keydown', { key: 'Enter' });
                                                textarea.dispatchEvent(event);
                                            }
                                        }}
                                        variant="ghost" 
                                        size="icon"
                                        className="mr-2"
                                    >
                                        <Send className="size-4"/>
                                        <span className="sr-only">Send message</span>
                                    </Button>
                                </div>
                                <div className="flex items-center p-3 pt-0">
                                    <Button variant="ghost" size="icon">
                                        <Paperclip className="size-4"/>
                                        <span className="sr-only">Attach file</span>
                                    </Button>

                                    <Button variant="ghost" size="icon">
                                        <Mic className="size-4"/>
                                        <span className="sr-only">Use Microphone</span>
                                    </Button>
                                </div>
                            </div>
                        </div>
                    </>
                ) : (
                    <div className="flex flex-col items-center justify-center flex-1">
                        <p className="text-muted-foreground">Select a user to start chatting.</p>
                    </div>
                )}
            </div>
        </main>
    );
}
