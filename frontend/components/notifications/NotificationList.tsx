"use client";

import { useGetNotificationsQuery } from "@/store/notifications/notificationApi";
import { Bell, UserCircle } from "lucide-react";
import { formatDistanceToNow } from "date-fns";

const NotificationList = () => {
    const { data, isLoading, isError } = useGetNotificationsQuery();

    if (isLoading) {
        return (
            <div className="flex justify-center items-center min-h-[200px]">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary" />
            </div>
        );
    }

    if (isError) {
        return (
            <div className="text-center py-8 text-gray-500">
                Failed to load notifications
            </div>
        );
    }

    const notifications = data?.notifications;

    if (!notifications?.length) {
        return (
            <div className="flex flex-col items-center justify-center py-12 text-gray-500">
                <Bell className="h-12 w-12 mb-4" />
                <p>No notifications yet</p>
            </div>
        );
    }

    return (
        <div>
            <div className="flex justify-end mb-4">
                <button 
                    className="text-sm text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300"
                    onClick={() => {
                        // TODO: Implement mark all as read functionality
                        console.log("Mark all as read clicked");
                    }}
                >
                    Mark all as read
                </button>
            </div>

            <div className="space-y-2">
                {notifications.map((notification) => (
                    <div
                        key={notification.id}
                        className={`p-4 rounded-lg border transition-all duration-200 cursor-pointer
                            ${
                                notification.is_read
                                    ? "bg-white border-gray-100 dark:bg-gray-800 dark:border-gray-700"
                                    : "bg-blue-50 border-blue-100 dark:bg-blue-900/30 dark:border-blue-800"
                            }
                            bg-gray-50 border-gray-200 shadow-md
                            dark:bg-gray-800 dark:border-gray-700
                            dark:hover:bg-gray-700/50 dark:hover:border-gray-600`}
                    >
                        <div className="flex items-start gap-4">
                            <div className="flex-shrink-0">
                                {notification.actor?.image ? (
                                    <img
                                        src={notification.actor.image || ""}
                                        alt={notification.actor.name || ""}
                                        className="h-10 w-10 rounded-full"
                                    />
                                ) : (
                                    <UserCircle className="h-10 w-10 text-gray-400" />
                                )}
                            </div>
                            <div className="flex-1 min-w-0">
                                <p className="text-sm font-medium text-gray-900 dark:text-gray-100 dark:hover:text-gray-200">
                                    {notification.actor?.name}
                                </p>
                                <p className="text-sm font-medium text-gray-900 dark:text-gray-100 dark:hover:text-gray-200">
                                    {notification.title}
                                </p>
                                <p className="text-sm text-gray-500 dark:text-gray-400 line-clamp-2">
                                    {notification.content}
                                </p>
                                <p className="text-xs text-gray-400 dark:text-gray-500 mt-1">
                                    {formatDistanceToNow(
                                        new Date(notification.created_at),
                                        {
                                            addSuffix: true,
                                        }
                                    )}
                                </p>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default NotificationList;
