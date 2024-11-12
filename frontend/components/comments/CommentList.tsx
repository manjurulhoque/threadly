"use client";

import { useGetCommentsByThreadIdQuery } from "@/store/comments/commentApi";
import CommentItem from "@/components/comments/CommentItem";

const CommentList = ({threadId}: { threadId: number }) => {
    const {data, error, isLoading} = useGetCommentsByThreadIdQuery(threadId);
    if (isLoading) {
        return <div>Loading...</div>;
    }

    if (error) {
        return <div>Error: {error}</div>;
    }

    const {comments} = data;

    return (
        <>
            {comments.map((comment) => (
                <CommentItem key={comment.id} comment={comment}/>
            ))}
        </>
    );
}

export default CommentList;