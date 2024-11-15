"use client";

import Image from "next/image";
import { useRouter } from "next/navigation";

import { Button } from "../ui/button";
import { User } from "@/types/user.type";

interface Props {
    user: User;
}

function UserCard({ user }: Props) {
    const router = useRouter();

    const userImage = user.image ? `${process.env.BACKEND_BASE_URL}/${user.image}` : "";

    return (
        <article className='user-card'>
            <div className='user-card_avatar'>
                <div className='relative h-12 w-12'>
                    {
                        userImage === "" ? (
                                <div
                                    className="relative w-10 h-10 overflow-hidden bg-gray-100 rounded-full dark:bg-gray-600">
                                    <svg className="absolute w-12 h-12 text-gray-400 -left-1" fill="currentColor"
                                         viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                                        <path fillRule="evenodd"
                                              d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z"
                                              clipRule="evenodd">
                                        </path>
                                    </svg>
                                </div>
                            ) :
                            <Image
                                src={userImage}
                                alt='user_logo'
                                fill
                                className='rounded-full object-cover'
                            />
                    }
                </div>

                <div className='flex-1 text-ellipsis'>
                    <h4 className='text-base-semibold dark:text-light-1'>{user.name}</h4>
                    <p className='text-small-medium dark:text-gray-1'>@{user.username}</p>
                </div>
            </div>

            <Button
                className='user-card_btn'
                onClick={() => {
                    router.push(`/profile/${user.id}`);
                }}
            >
                Profile
            </Button>
        </article>
    );
}

export default UserCard;