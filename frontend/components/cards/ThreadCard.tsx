"use client";

import Image from "next/image";
import Link from "next/link";
import { Thread } from "@/types/thread.type";
import { useLikeThreadMutation, useUnlikeThreadMutation } from "@/store/likes/likeApi";
import { toast } from "react-toastify";
import { useState } from "react";

interface Props {
    thread: Thread;
}

function ThreadCard({ thread }: Props) {
    let { id, content, user, is_liked } = thread;
    const [likeThread, { isLoading: isLiking }] = useLikeThreadMutation();
    const [unlikeThread, { isLoading: isUnliking }] = useUnlikeThreadMutation();
    const [ isLiked, setIsLiked ] = useState(is_liked); // Initialize directly from `is_liked`

    let userImage = user.image ? `${process.env.BACKEND_BASE_URL}/${user.image}` : "";

    const handleLikeToggle = () => {
        if (!isLiked) {
            likeThread(id)
                .unwrap()
                .then(() => {
                    toast.success("Thread liked successfully");
                    setIsLiked(true);
                })
                .catch((error) => {
                    console.error(error);
                    toast.error("Failed to like thread");
                });
        } else {
            unlikeThread(id)
                .unwrap()
                .then(() => {
                    toast.success("Thread unliked successfully");
                    setIsLiked(false);
                })
                .catch((error) => {
                    console.error(error);
                    toast.error("Failed to unlike thread");
                });
        }
    };

    return (
        <article className={`flex w-full flex-col rounded-xl bg-light-2 dark:bg-dark-2 p-7 shadow-md dark:shadow-none`}>
            <div className='flex items-start justify-between'>
                <div className='flex w-full flex-1 flex-row gap-4'>
                    <div className='flex flex-col items-center'>
                        <Link href={`/profile/${user.id}`} className='relative h-11 w-11'>
                            {userImage === "" ? (
                                <div
                                    className="relative w-10 h-10 overflow-hidden rounded-full bg-gray-100 dark:bg-gray-600">
                                    <svg
                                        className="absolute w-12 h-12 -left-1 text-gray-400 dark:text-gray-300"
                                        fill="currentColor"
                                        viewBox="0 0 20 20"
                                        xmlns="http://www.w3.org/2000/svg"
                                    >
                                        <path
                                            fillRule="evenodd"
                                            d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z"
                                            clipRule="evenodd"
                                        />
                                    </svg>
                                </div>
                            ) : (
                                <Image
                                    src={userImage}
                                    alt='user_image'
                                    fill
                                    sizes={"10"}
                                    className='cursor-pointer rounded-full'
                                />
                            )}
                        </Link>

                        <div className='thread-card_bar'/>
                    </div>

                    <div className='flex w-full flex-col'>
                        <Link href={`/profile/${user.id}`} className='w-fit'>
                            <h4 className='cursor-pointer text-base-semibold text-dark-1 dark:text-light-1'>
                                {user.name}
                            </h4>
                        </Link>

                        <p className='mt-2 text-small-regular text-dark-2 dark:text-light-2'>
                            {content}
                        </p>

                        <div className={`mt-5 flex flex-col gap-3`}>
                            <div className='flex gap-3.5'>
                                {thread.like_count > 0 && (
                                    <p className='text-sm text-dark-2 dark:text-light-2'>
                                        {thread.like_count} {thread.like_count > 1 ? "likes" : "like"}
                                    </p>
                                )}
                                {
                                    isLiked ? (
                                        <Image
                                            src='/assets/heart-filled.svg'
                                            alt='heart'
                                            width={24}
                                            height={24}
                                            className='cursor-pointer object-contain dark:brightness-300'
                                            onClick={handleLikeToggle}
                                        />
                                    ) : (
                                        <Image
                                            src='/assets/heart-gray.svg'
                                            alt='heart'
                                            width={24}
                                            height={24}
                                            className='cursor-pointer object-contain dark:invert-[0.95] dark:brightness-200'
                                            onClick={handleLikeToggle}
                                        />
                                    )
                                }
                                <Link href={`/thread/${id}`}>
                                    <Image
                                        src='/assets/reply.svg'
                                        alt='reply'
                                        width={24}
                                        height={24}
                                        className='cursor-pointer object-contain dark:invert-[0.95] dark:brightness-200'
                                    />
                                </Link>
                                <Image
                                    src='/assets/repost.svg'
                                    alt='repost'
                                    width={24}
                                    height={24}
                                    className='cursor-pointer object-contain dark:invert-[0.95] dark:brightness-200'
                                />
                                <Image
                                    src='/assets/share.svg'
                                    alt='share'
                                    width={24}
                                    height={24}
                                    className='cursor-pointer object-contain dark:invert-[0.95] dark:brightness-200'
                                />
                            </div>
                        </div>
                    </div>
                </div>

                {/* TODO: Delete thread here*/}
            </div>
        </article>
    );
}

export default ThreadCard;