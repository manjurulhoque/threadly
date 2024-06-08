import { User } from "@/types/user.type";

export interface Thread {
    id: number;
    content: string;
    userId: number;
    createdAt: string;
    updatedAt: string;
    deletedAt: string;
    user: User;
}