"use client";

import Image from "next/image";
import Link from "next/link";
import { LoaderCircle } from "lucide-react";
import { useParams } from "next/navigation";
import { useGetUserFollowingQuery } from "@/store/follow/followApi";

const UserFollowing = () => {
    const { id } = useParams();
    const { data: response, isLoading, error } = useGetUserFollowingQuery(Number(id));
    const users = response?.users || [];

    if (isLoading) {
        return (
            <div className="flex justify-center items-center min-h-[200px]">
                <LoaderCircle className="w-8 h-8 animate-spin text-gray-500 dark:text-gray-300" />
            </div>
        );
    }

    if (error) {
        return (
            <div className="text-center py-10">
                <p className="text-red-500">Error loading following users</p>
            </div>
        );
    }

    if (users.length === 0) {
        return (
            <div className="text-center py-10">
                <p className="text-gray-600 dark:text-gray-400">Not following anyone yet</p>
            </div>
        );
    }

    return (
        <div>
            <h2 className="text-2xl font-bold text-gray-900 dark:text-light-1 mb-6">Following</h2>
            <div className="space-y-4">
                {users.map((user) => (
                    <div 
                        key={user.id}
                        className="flex items-center justify-between p-4 rounded-lg bg-gray-50 dark:bg-dark-2 hover:bg-gray-100 dark:hover:bg-dark-3 transition-colors"
                    >
                        <Link href={`/profile/${user.id}`} className="flex items-center space-x-3 flex-1">
                            <div className="relative h-12 w-12">
                                {user.image ? (
                                    <Image
                                        src={`${process.env.BACKEND_BASE_URL}/${user.image}`}
                                        alt={user.name}
                                        fill
                                        className="rounded-full object-cover"
                                    />
                                ) : (
                                    <div className="w-12 h-12 rounded-full bg-gray-200 dark:bg-dark-4 flex items-center justify-center">
                                        <span className="text-gray-500 dark:text-gray-400 text-xl">
                                            {user.name.charAt(0).toUpperCase()}
                                        </span>
                                    </div>
                                )}
                            </div>
                            <div className="flex-1">
                                <h3 className="font-semibold text-gray-900 dark:text-light-1">
                                    {user.name}
                                </h3>
                                <p className="text-sm text-gray-500 dark:text-gray-400">
                                    @{user.username}
                                </p>
                            </div>
                        </Link>
                        <div className="text-sm text-gray-500 dark:text-gray-400">
                            {user.followers_count || 0} followers
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default UserFollowing;
