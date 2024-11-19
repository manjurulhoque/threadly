"use client";

import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { BellRing, MessageCircleMore } from "lucide-react";
import { ModeToggle } from "@/components/shared/ModeToggle";
import { useGetUnreadMessagesCountQuery } from "@/store/users/userApi";

function TopBar() {
    const router = useRouter();
    const { data } = useGetUnreadMessagesCountQuery();

    return (
        <nav className="topbar border-b border-gray-700">
            <Link href='/' className='flex items-center gap-4'>
                <Image src='/logo.svg' alt='logo' width={28} height={28}/>
                <p className='text-heading3-bold dark:text-light-1 max-xs:hidden'>Threadly</p>
            </Link>

            {/* Search Input */}
            <div className="flex-1 mx-4 flex justify-center">
                <input
                    type="text"
                    placeholder="Search Threadly..."
                    className="w-full max-w-3xl px-4 py-2 border border-gray-600 rounded-md bg-light-2 dark:bg-dark-2 text-dark-3 dark:text-light-1 placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
            </div>

            <div className='flex items-center gap-4'>
                <div className="relative cursor-pointer" onClick={() => router.push('/chat')}>
                    <MessageCircleMore className="h-6 w-6 text-gray-600 dark:text-gray-300" />
                    {data?.unread_messages_count && (
                    <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                        {data?.unread_messages_count || null}
                        </span>
                    )}
                </div>

                <div className="relative cursor-pointer">
                    <BellRing className="h-6 w-6 text-gray-600 dark:text-gray-300" />
                </div>

                <ModeToggle/>

                <div className='block md:hidden'>
                    <div className='flex cursor-pointer invert-0 dark:invert brightness-0 dark:brightness-200'>
                        <Image
                            src='/assets/logout.svg'
                            alt='logout'
                            width={24}
                            height={24}
                            style={{ filter: "invert(1)" }}
                        />
                    </div>
                </div>
            </div>
        </nav>
    );
}

export default TopBar;