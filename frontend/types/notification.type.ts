import { User } from "next-auth";
import { Thread } from "./thread.type";
import { Comment } from "./comment.type";

export type Notification = {
    id: number;
    type: string;
    title: string;
    content: string;
    is_read: boolean;
    created_at: string;
    url: string;
    actor: User;
    thread: Thread;
    comment: Comment;
    user: User;
};
