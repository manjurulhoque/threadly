import { createApi } from '@reduxjs/toolkit/query/react';
import DynamicBaseQuery from "@/store/dynamic-base-query";

const commentApi = createApi({
    reducerPath: "commentApi",
    baseQuery: DynamicBaseQuery,
    tagTypes: ["Comment"],
    endpoints: (builder) => ({
        getCommentsByThreadId: builder.query<Comment[], number>({
            query: (threadId) => `threads/${threadId}/comments`,
        }),
    })
});

export const {
    useGetCommentsByThreadIdQuery,
} = commentApi;

export default commentApi;