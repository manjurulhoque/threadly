"use client";

import Link from "next/link";
import Image from "next/image";
import { User } from "@/types/user.type";
import { useSession } from "next-auth/react";

interface Props {
    user: User;
}

function ProfileHeader({ user }: Props) {
    const {data: session, status} = useSession();
    let userImage = user.image ? `${process.env.BACKEND_BASE_URL}/${user.image}` : "";

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
                        <h2 className='text-left text-heading3-bold text-light-1'>
                            {user.name}
                        </h2>
                        <p className='text-base-medium text-gray-1'>@{user.username}</p>
                    </div>
                </div>
                {
                    session?.user?.id === user.id ? (
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
                    ) : null
                }
            </div>

            <p className='mt-6 max-w-lg text-base-regular text-light-2'>{user.bio}</p>

            <div className='mt-12 h-0.5 w-full bg-dark-3' />
        </div>
    );
}

export default ProfileHeader;