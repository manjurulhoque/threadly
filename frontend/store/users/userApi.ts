import { createApi } from '@reduxjs/toolkit/query/react';
import DynamicBaseQuery from "@/store/dynamic-base-query";
import { User } from "@/types/user.type";
import { Message } from "@/types/message.type";
const userApi = createApi({
    reducerPath: "usersApi",
    baseQuery: DynamicBaseQuery,
    endpoints: (builder) => ({
        getChatUsers: builder.query<{users: User[]}, void>({
            query: () => "chat/users",
        }),
        getMessages: builder.query<{messages: Message[], total: number, page: number, limit: number}, {receiverId: number, page: number, limit: number}>({
            query: ({receiverId, page, limit}) => `chat/${receiverId}/messages?page=${page}&limit=${limit}`,
        }),
    }),
});

export const { useGetChatUsersQuery, useGetMessagesQuery } = userApi;

export default userApi;