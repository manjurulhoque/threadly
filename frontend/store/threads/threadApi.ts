import { createApi } from "@reduxjs/toolkit/query";
import DynamicBaseQuery from "@/store/dynamic-base-query";
import { Thread } from "@/types/thread.type";

const threadApi = createApi({
    reducerPath: "threadApi",
    baseQuery: DynamicBaseQuery,
    tagTypes: ["Thread"],
    endpoints: (builder) => ({
        getThreads: builder.query<Thread[], void>({
            query: () => "threads",
        }),
        getThread: builder.query<Thread, number>({
            query: (id) => `threads/${id}`,
        }),
        addThread: builder.mutation<Thread, Omit<Thread, "id">>({
            query: (thread) => ({
                url: "threads",
                method: "POST",
                body: thread,
            }),
        }),
        updateThread: builder.mutation<Thread, Thread>({
            query: (thread) => ({
                url: `threads/${thread.id}`,
                method: "PUT",
                body: thread,
            }),
        }),
        deleteThread: builder.mutation<void, number>({
            query: (id) => ({
                url: `threads/${id}`,
                method: "DELETE",
            }),
        }),
    }),
});

export const {
    useGetThreadsQuery,
    useGetThreadQuery,
    useAddThreadMutation,
    useUpdateThreadMutation,
    useDeleteThreadMutation,
} = threadApi;

export default threadApi;