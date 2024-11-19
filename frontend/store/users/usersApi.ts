import { createApi } from '@reduxjs/toolkit/query/react';
import DynamicBaseQuery from "@/store/dynamic-base-query";
import { User } from "@/types/user.type";

const usersApi = createApi({
    reducerPath: "usersApi",
    baseQuery: DynamicBaseQuery,
    endpoints: (builder) => ({
        getChatUsers: builder.query<User[], void>({
            query: () => "chat/users",
        }),
    }),
});

export const { useGetChatUsersQuery } = usersApi;

export default usersApi;
