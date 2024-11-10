"use client";

import { useGetCommentsByThreadIdQuery } from "@/store/comments/commentApi";

const CommentList = ({threadId}: {threadId: number}) => {
    const { data, error, isLoading } = useGetCommentsByThreadIdQuery(threadId);
    if (isLoading) {
        return <div>Loading...</div>;
    }

    if (error) {
        return <div>Error: {error}</div>;
    }

    const { comments } = data;

    return (
        <div>

        </div>
    );
}

export default CommentList;