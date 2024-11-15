import { createApi } from '@reduxjs/toolkit/query/react';
import DynamicBaseQuery from "@/store/dynamic-base-query";
import { Thread } from "@/types/thread.type";

const threadApi = createApi({
    reducerPath: "threadApi",
    baseQuery: DynamicBaseQuery,
    tagTypes: [ "Thread" ],
    endpoints: (builder) => ({
        getThreads: builder.query<Thread[], void>({
            query: () => "threads",
        }),
        getThread: builder.query<Thread, number>({
            query: (id) => `threads/${id}`,
        }),
        addThread: builder.mutation<void, void>({
            query: (thread) => ({
                url: "threads",
                method: "POST",
                body: thread,
            }),
        }),
        totalThreadsByUser: builder.query<number, number>({
            query: (userId) => `users/${userId}/total-threads`,
        }),
        getThreadsByUser: builder.query<Thread[], number>({
            query: (userId) => `users/${userId}/threads`,
        }),
    }),
});

export const {
    useGetThreadsQuery,
    useGetThreadQuery,
    useAddThreadMutation,
    useTotalThreadsByUserQuery,
    useGetThreadsByUserQuery,
} = threadApi;

export default threadApi;