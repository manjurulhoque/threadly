"use server";

import { UserSession } from "@/types/user-session.type";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/authOptions";

export async function fetchUser(userId: number) {
    try {
        const data: UserSession | null = await getServerSession(authOptions);
        const response = await fetch(`${process.env.BACKEND_BASE_URL}/api/users/${userId}`, {
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${data?.access}`
            }
        });
        return await response.json();
    } catch (error: any) {
        throw new Error(`Failed to fetch user: ${error}`);
    }
}

export async function fetchSimilarMinds() {
    try {
        const data: UserSession | null = await getServerSession(authOptions);
        const response = await fetch(`${process.env.BACKEND_BASE_URL}/api/similar-minds`, {
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${data?.access}`
            },
            method: 'GET'
        });
        return await response.json();
    } catch (error: any) {
        throw new Error(`Failed to fetch similar minds: ${error}`);
    }
}