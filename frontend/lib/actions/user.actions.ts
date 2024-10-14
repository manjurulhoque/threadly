"use server";

export async function fetchUser(userId: number) {
    try {
        const response = await fetch(`${process.env.BACKEND_BASE_URL}/api/users/${userId}`);
        return await response.json();
    } catch (error: any) {
        throw new Error(`Failed to fetch user: ${error}`);
    }
}