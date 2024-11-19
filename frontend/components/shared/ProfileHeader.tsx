"use client";

import Link from "next/link";
import Image from "next/image";
import { User } from "@/types/user.type";
import { useSession } from "next-auth/react";
import { Button } from "@/components/ui/button";
import { LoaderCircle, MessageCircle, Trash, UserPlusIcon } from "lucide-react";
import { useFollowUserMutation, useIsFollowingQuery, useUnfollowUserMutation } from "@/store/follow/followApi";
import { toast } from "react-toastify";
import { useEffect, useState } from "react";
import ChatWindow from "./ChatWindow";

interface Props {
    user: User;
}

function ProfileHeader({ user }: Props) {
    const { data: session, status } = useSession();
    let userImage = user.image ? `${process.env.BACKEND_BASE_URL}/${user.image}` : "";
    const [ followUser, { isLoading, isError, error } ] = useFollowUserMutation();
    const [ unfollowUser ] = useUnfollowUserMutation();
    let { data: result, isLoading: isLoadingIsFollow, isSuccess } = useIsFollowingQuery(user.id);
    // State to track whether the user is followed
    const [isFollowing, setIsFollowing] = useState<boolean>(false);
    const [isChatOpen, setIsChatOpen] = useState(false);

    // Update `isFollowing` state when `result` changes
    useEffect(() => {
        if (result?.data !== undefined) {
            setIsFollowing(result.data);
        }
    }, [result]);

    const onClickFollowUser = () => {
        followUser(user.id).unwrap().then(() => {
            toast.success("User followed successfully");
            setIsFollowing(true);
        }).catch((error) => {
            console.error('Failed to follow user:', error);
            toast.error("Failed to follow user");
        });
    };

    const onClickUnfollowUser = () => {
        unfollowUser(user.id).unwrap().then(() => {
            toast.success("User unfollowed successfully");
            setIsFollowing(false);
        }).catch((error) => {
            console.error('Failed to unfollow user:', error);
            toast.error("Failed to unfollow user");
        });
    };

    return (
        <div className='flex w-full flex-col justify-start'>
            <div className='flex items-center justify-between'>
                <div className='flex items-center gap-3'>
                    <div className='relative h-20 w-20 object-cover'>
                        {
                            userImage === "" ? (
                                <div
                                    className="relative w-10 h-10 overflow-hidden bg-gray-100 rounded-full dark:bg-gray-600">
                                    <svg className="absolute w-12 h-12 text-gray-400 -left-1" fill="currentColor"
                                         viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                                        <path fillRule="evenodd"
                                              d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z"
                                              clipRule="evenodd"></path>
                                    </svg>
                                </div>
                            ) : <Image
                                src={userImage}
                                alt='user_image'
                                fill
                                className='cursor-pointer rounded-full'
                            />
                        }
                    </div>

                    <div className='flex-1'>
                        <h2 className='text-left text-heading3-bold dark:text-light-1'>
                            {user.name}
                        </h2>
                        <p className='text-base-medium dark:text-gray-1'>@{user.username}</p>
                        <div className="flex gap-4 mt-2">
                            <Link href={`/profile/${user.id}/followers`} className="text-sm text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200">
                                <span className="font-semibold">{user.followers_count || 0}</span> followers
                            </Link>
                            <Link href={`/profile/${user.id}/following`} className="text-sm text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200">
                                <span className="font-semibold">{user.following_count || 0}</span> following
                            </Link>
                        </div>
                    </div>
                </div>
                <div className='flex gap-3'>
                    {
                        Number(session?.user?.id) === user.id ? (
                            <Link href='/profile/edit'>
                                <div className='flex cursor-pointer gap-3 rounded-lg bg-dark-3 px-4 py-2'>
                                    <Image
                                        src='/assets/edit.svg'
                                        alt='logout'
                                        width={16}
                                        height={16}
                                        style={{ width: "auto" }}
                                    />
                                    <p className='text-light-2 max-sm:hidden'>Edit</p>
                                </div>
                            </Link>
                        ) : (
                            <>
                                <Button 
                                    className="flex cursor-pointer gap-3 rounded-lg dark:bg-dark-3 dark:hover:bg-dark-3 px-4 py-2 dark:text-light-2"
                                    onClick={() => setIsChatOpen(true)}
                                >
                                    <MessageCircle className="w-5 h-5"/>
                                    <p className='max-sm:hidden'>Chat</p>
                                </Button>
                                {isLoadingIsFollow ? (
                                    <LoaderCircle className="w-6 h-6 animate-spin text-gray-500 dark:text-gray-300"/>
                                ) : (
                                    !isFollowing ? (
                                        <Button
                                            className="flex cursor-pointer gap-3 rounded-lg dark:bg-dark-3 dark:hover:bg-dark-3 px-4 py-2 dark:text-light-2"
                                            onClick={onClickFollowUser}
                                        >
                                            <UserPlusIcon className="w-5 h-5"/>
                                            Follow
                                        </Button>
                                    ) : (
                                        <Button
                                            className="flex cursor-pointer gap-3 rounded-lg dark:bg-dark-3 dark:hover:bg-dark-3 px-4 py-2 dark:text-light-2"
                                            onClick={onClickUnfollowUser}
                                        >
                                            <Trash className="w-5 h-5"/>
                                            Unfollow
                                        </Button>
                                    )
                                )}
                            </>
                        )
                    }
                </div>
            </div>

            <p className='mt-6 max-w-lg text-base-regular dark:text-light-2'>{user.bio}</p>

            <div className='mt-12 h-0.5 w-full bg-dark-3'/>

            <ChatWindow 
                isOpen={isChatOpen}
                onClose={() => setIsChatOpen(false)}
                receiverUser={user}
            />
        </div>
    );
}

export default ProfileHeader;