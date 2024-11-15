import { User } from "@/types/user.type";

export interface Thread {
    id: number;
    content: string;
    user_id: number;
    created_at: string;
    updated_at: string;
    deleted_at: string;
    user: User;
    is_liked: boolean;
    like_count: number;
}