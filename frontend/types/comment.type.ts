import { User } from "./user.type";

export interface Comment {
    id: number;
    content: string;
    created_at: string;
    user: User;
}