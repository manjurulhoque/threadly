import { createApi } from '@reduxjs/toolkit/query/react';
import DynamicBaseQuery from "@/store/dynamic-base-query";

export const likeApi = createApi({
    reducerPath: 'likeApi',
    baseQuery: DynamicBaseQuery,
    tagTypes: [ 'Like' ],
    endpoints: (builder) => ({
        likeThread: builder.mutation<void, void>({
            query: (threadId: number) => ({
                url: `threads/${threadId}/like`,
                method: 'POST',
            }),
            invalidatesTags: [ 'Like' ],
        }),
    }),
});

export const { useLikeThreadMutation } = likeApi;

export default likeApi;

