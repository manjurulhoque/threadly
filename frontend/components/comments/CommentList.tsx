"use client";

import { useGetCommentsByThreadIdQuery } from "@/store/comments/commentApi";
import CommentItem from "@/components/comments/CommentItem";
import { FetchBaseQueryError } from "@reduxjs/toolkit/query";
import { SerializedError } from "@reduxjs/toolkit";
import { Comment } from "@/types/comment.type";
import { useComments } from "@/contexts/CommentsContext";
import { useEffect } from "react";

const CommentList = ({ threadId }: { threadId: number }) => {
  const { refreshTrigger } = useComments();

  const { data, error, isLoading, refetch } =
    useGetCommentsByThreadIdQuery(threadId);

  useEffect(() => {
    refetch();
  }, [refreshTrigger]);

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return (
      <div>
        Error: {(error as FetchBaseQueryError | SerializedError).message}
      </div>
    );
  }

  if (!data) {
    return null;
  }

  const { comments } = data;

  return (
    <>
      {comments.map((comment: Comment) => (
        <CommentItem key={comment.id} comment={comment} />
      ))}
    </>
  );
};

export default CommentList;
