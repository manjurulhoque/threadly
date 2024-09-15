"use server";

import { UserSession } from "@/types/user-session.type";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/authOptions";
import { revalidatePath } from "next/cache";

export async function fetchThread(threadId: number) {
    try {
        const data: UserSession | null = await getServerSession(authOptions);
        let accessToken = data?.access;
        const response = await fetch(`${process.env.BACKEND_BASE_URL}/api/threads/${threadId}`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${accessToken}`
            }
        });
        return await response.json();
    } catch (error: any) {
        throw new Error(`Failed to fetch thread: ${error}`);
    }
}

export async function addCommentToThread(
    threadId: number,
    content: string,
    path?: string
) {
    try {
        const data: UserSession | null = await getServerSession(authOptions);
        let user = data?.user;
        const response = await fetch(`${process.env.BACKEND_BASE_URL}/api/threads/${threadId}/comments`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${data?.access}`
            },
            body: JSON.stringify({content})
        });
        // revalidatePath(path);
        return await response.json();
    } catch (err) {
        console.error("Error while adding comment:", err);
        throw new Error("Unable to add comment");
    }
}
