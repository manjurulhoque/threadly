"use client";

import { ChatBubble, ChatBubbleAvatar, ChatBubbleMessage, } from "@/components/ui/chat/chat-bubble";
import { ChatInput } from "@/components/ui/chat/chat-input";
import { ChatMessageList } from "@/components/ui/chat/chat-message-list";
import { Button } from "@/components/ui/button";
import { Mic, Paperclip, Send } from "lucide-react";
import React, { useEffect, useRef, useState } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import useWebSocket from "react-use-websocket";

interface User {
    id: number;
    name: string;
    avatar: string;
}

const users = [
    { id: 1, name: "Alice", avatar: "/images/avatar1.png" },
    { id: 2, name: "Bob", avatar: "/images/avatar2.png" },
    { id: 3, name: "Charlie", avatar: "/images/avatar3.png" },
];

interface Message {
    role: 'user' | 'assistant';
    content: string;
}

export default function ChatMessage() {
    const [ activeUser, setActiveUser ] = useState<User | null>(null);
    const socketUrl = "ws://localhost:8080/ws";
    const { sendMessage, sendJsonMessage, lastMessage, readyState } = useWebSocket(socketUrl, {
        onMessage: (event) => {
            console.log(event.data);
            // setMessages((messages) => [ ...messages, data]);
        },
        shouldReconnect: (closeEvent) => true,
    });
    const [messages, setMessages] = useState<Message[]>([]);

    const messagesRef = useRef<HTMLDivElement>(null);
    const formRef = useRef<HTMLFormElement>(null);

    useEffect(() => {
        if (messagesRef.current) {
            messagesRef.current.scrollTop = messagesRef.current.scrollHeight;
        }
    }, [ messages ]);

    const onSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        const content = (e.target as HTMLFormElement).value;

        const message = {
            sender_id: 1, // Replace with actual sender ID
            receiver_id: 2, // Replace with actual receiver ID
            content,
        };

        // Send JSON message
        sendJsonMessage(message);

        // Clear the form input
        // (e.target as HTMLFormElement).reset();
    };


    const onKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
        if (e.key === "Enter") {
            e.preventDefault();
            onSubmit(e as unknown as React.FormEvent<HTMLFormElement>).then(() => {
                console.log("Message sent");
            });
        }
    };


    return (
        <main className="flex h-[800px] w-full border dark:border-gray-700">
            {/* Left Sidebar */}
            <div className="w-1/4 bg-background border-r p-4 shadow-lg dark:border-gray-700">
                <h2 className="text-xl font-bold mb-4 text-foreground">Users</h2>
                <ul className="space-y-4">
                    {users.map((user) => (
                        <li
                            key={user.id}
                            className={`flex items-center space-x-3 cursor-pointer p-2 rounded-md ${
                                activeUser?.id === user.id ? "bg-muted" : "hover:bg-muted"
                            }`}
                            onClick={() => setActiveUser(user)}
                        >
                            <Avatar>
                                <AvatarImage src={user.avatar} alt={user.name}/>
                                <AvatarFallback>{user.name[0]}</AvatarFallback>
                            </Avatar>
                            <span className={`font-medium text-foreground`}>{user.name}</span>
                        </li>
                    ))}
                </ul>
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
                                    variant={message.role == "user" ? "sent" : "received"}
                                >
                                    <ChatBubbleAvatar
                                        src=""
                                        fallback={message.role == "user" ? "👨🏽" : "🤖"}
                                    />
                                    <ChatBubbleMessage>
                                        {message.content
                                            .split("```")
                                            .map((part: string, index: number) => {
                                                if (index % 2 === 0) {
                                                    return (
                                                        <>
                                                            {part}
                                                        </>
                                                    );
                                                } else {
                                                    return (
                                                        <pre className="whitespace-pre-wrap pt-2" key={index}></pre>
                                                    );
                                                }
                                            })}
                                    </ChatBubbleMessage>
                                </ChatBubble>
                            ))}
                        </ChatMessageList>

                        {/* Chat Input */}
                        <div className="p-4 border-t dark:border-gray-700">
                            <form
                                ref={formRef}
                                onSubmit={onSubmit}
                                className="relative rounded-lg border bg-background focus-within:ring-1 focus-within:ring-ring dark:border-gray-700"
                            >
                                <div className="flex">
                                    <ChatInput
                                        onKeyDown={onKeyDown}
                                        placeholder={`Message ${activeUser.name}`}
                                        className="min-h-12 resize-none rounded-lg bg-background border-0 p-3 shadow-none focus-visible:ring-0 flex-1"
                                        name="content"
                                    />
                                    <Button 
                                        type="submit"
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
                            </form>
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
