import { createApi } from "@reduxjs/toolkit/query/react";
import DynamicBaseQuery from "@/store/dynamic-base-query";
import { Notification } from "@/types/notification.type";

const notificationApi = createApi({
    reducerPath: "notificationApi",
    baseQuery: DynamicBaseQuery,
    tagTypes: ["Notification"],
    endpoints: (builder) => ({
        getNotifications: builder.query<
            { notifications: Notification[] },
            void
        >({
            query: () => "notifications",
        }),
        markAllNotificationsAsRead: builder.mutation<void, void>({
            query: () => "notifications/mark-all-as-read",
        }),
    }),
});

export const {
    useGetNotificationsQuery,
    useMarkAllNotificationsAsReadMutation,
} = notificationApi;

export default notificationApi;
