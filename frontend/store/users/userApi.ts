import { createApi } from "@reduxjs/toolkit/query/react";
import DynamicBaseQuery from "@/store/dynamic-base-query";
import { User } from "@/types/user.type";
import { Message } from "@/types/message.type";

const userApi = createApi({
    reducerPath: "usersApi",
    baseQuery: DynamicBaseQuery,
    endpoints: (builder) => ({
        getChatUsers: builder.query<{ users: User[] }, void>({
            query: () => "chat/users",
        }),
        getMessages: builder.query<
            { messages: Message[]; total: number; page: number; limit: number },
            { receiverId: number; page: number; limit: number }
        >({
            query: ({ receiverId, page, limit }) =>
                `chat/${receiverId}/messages?page=${page}&limit=${limit}`,
        }),
        getUnreadMessagesCount: builder.query<
            { unread_messages_count: number },
            void
        >({
            query: () => "chat/unread-messages-count",
        }),
        getSimilarMinds: builder.query<{ users: User[] }, void>({
            query: () => "similar-minds",
        }),
    }),
});

export const {
    useGetChatUsersQuery,
    useGetMessagesQuery,
    useGetUnreadMessagesCountQuery,
    useGetSimilarMindsQuery,
} = userApi;

export default userApi;
