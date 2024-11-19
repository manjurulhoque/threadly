import { createApi } from '@reduxjs/toolkit/query/react';
import DynamicBaseQuery from "@/store/dynamic-base-query";
import { User } from "@/types/user.type";

const userApi = createApi({
    reducerPath: "usersApi",
    baseQuery: DynamicBaseQuery,
    endpoints: (builder) => ({
        getChatUsers: builder.query<{users: User[]}, void>({
            query: () => "chat/users",
        }),
    }),
});

export const { useGetChatUsersQuery } = userApi;

export default userApi;
