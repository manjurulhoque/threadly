import { createApi } from '@reduxjs/toolkit/query/react';
import DynamicBaseQuery from "@/store/dynamic-base-query";

type IsFollowingResponse = { data: boolean };

const followApi = createApi({
    reducerPath: "followApi",
    baseQuery: DynamicBaseQuery,
    tagTypes: [ "Follow" ],
    endpoints: (builder) => ({
        followUser: builder.mutation<void, number>({
            query: (userId) => ({
                url: `users/${userId}/follow`,
                method: "POST",
            }),
        }),
        unfollowUser: builder.mutation<void, number>({
            query: (userId) => ({
                url: `users/${userId}/unfollow`,
                method: "DELETE",
            }),
        }),
        isFollowing: builder.query<IsFollowingResponse, number>({
            query: (userId) => `users/${userId}/is-following`,
            providesTags: [ "Follow" ],
        }),
    }),
});

export const {
    useFollowUserMutation,
    useUnfollowUserMutation,
    useIsFollowingQuery
} = followApi;

export default followApi;