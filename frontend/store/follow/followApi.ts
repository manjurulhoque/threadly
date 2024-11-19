import { createApi } from '@reduxjs/toolkit/query/react';
import DynamicBaseQuery from "@/store/dynamic-base-query";
import { User } from '@/types/user.type';

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
        getUserFollowers: builder.query<{
            users: User[];
        }, number>({
            query: (userId) => `users/${userId}/followers`,
        }),
        getUserFollowing: builder.query<{
            users: User[];
        }, number>({
            query: (userId) => `users/${userId}/following`,
        }),
    }),
});

export const {
    useFollowUserMutation,
    useUnfollowUserMutation,
    useIsFollowingQuery,
    useGetUserFollowersQuery,
    useGetUserFollowingQuery,
} = followApi;

export default followApi;