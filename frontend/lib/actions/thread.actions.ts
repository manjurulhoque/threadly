"use server";

import { UserSession } from "@/types/user-session.type";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/authOptions";

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