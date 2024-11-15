import { User } from "@/types/user.type";

export interface Thread {
    id: number;
    content: string;
    user_id: number;
    createdAt: string;
    updatedAt: string;
    deletedAt: string;
    user: User;
    is_liked: boolean;
}