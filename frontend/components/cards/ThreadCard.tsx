import Image from "next/image";
import Link from "next/link";
import { Thread } from "@/types/thread.type";

interface Props {
    thread: Thread;
}

function ThreadCard({thread}: Props) {
    let isComment = false;
    let {id, content, parentId, createdAt, user} = thread;

    let userImage = user.image ? `${process.env.BACKEND_BASE_URL}/${user.image}` : "";

    return (
        <article
            className={`flex w-full flex-col rounded-xl ${
                isComment ? "px-0 xs:px-7" : "bg-dark-2 p-7"
            }`}
        >
            <div className='flex items-start justify-between'>
                <div className='flex w-full flex-1 flex-row gap-4'>
                    <div className='flex flex-col items-center'>
                        <Link href={`/profile/${user.id}`} className='relative h-11 w-11'>
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
                                    sizes={"10"}
                                    className='cursor-pointer rounded-full'
                                />
                            }
                        </Link>

                        <div className='thread-card_bar'/>
                    </div>

                    <div className='flex w-full flex-col'>
                        <Link href={`/profile/${user.id}`} className='w-fit'>
                            <h4 className='cursor-pointer text-base-semibold text-light-1'>
                                {user.name}
                            </h4>
                        </Link>

                        <p className='mt-2 text-small-regular text-light-2'>{content}</p>

                        <div className={`${isComment && "mb-10"} mt-5 flex flex-col gap-3`}>
                            <div className='flex gap-3.5'>
                                <Image
                                    src='/assets/heart-gray.svg'
                                    alt='heart'
                                    width={24}
                                    height={24}
                                    className='cursor-pointer object-contain'
                                />
                                <Link href={`/thread/${id}`}>
                                    <Image
                                        src='/assets/reply.svg'
                                        alt='heart'
                                        width={24}
                                        height={24}
                                        className='cursor-pointer object-contain'
                                    />
                                </Link>
                                <Image
                                    src='/assets/repost.svg'
                                    alt='heart'
                                    width={24}
                                    height={24}
                                    className='cursor-pointer object-contain'
                                />
                                <Image
                                    src='/assets/share.svg'
                                    alt='heart'
                                    width={24}
                                    height={24}
                                    className='cursor-pointer object-contain'
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