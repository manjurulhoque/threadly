import { createApi } from '@reduxjs/toolkit/query/react';
import DynamicBaseQuery from "@/store/dynamic-base-query";

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
    }),
});

export const {
    useFollowUserMutation,
    useUnfollowUserMutation,
} = followApi;

export default followApi;