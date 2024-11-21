"use client";

import UserCard from "@/components/cards/UserCard";
import { useGetTrendingHashtagsQuery } from "@/store/hashtag/hashtagApi";
import HashtagCard from "../cards/HashtagCard";
import { useGetSimilarMindsQuery } from "@/store/users/userApi";

const RightSidebar = () => {
    const {data: trendingHashtags, isLoading: loadingHashtags} = useGetTrendingHashtagsQuery();
    const hashtags = trendingHashtags?.hashtags || [];

    const {data: similarMindsData, isLoading: loadingSimilarMinds} = useGetSimilarMindsQuery();
    const similarMinds = similarMindsData?.users || [];

    return (
        <section className='custom-scrollbar rightsidebar'>
            <div className='flex flex-1 flex-col justify-start'>
                <h3 className='text-heading4-medium dark:text-light-1'>Similar Minds</h3>
                <div className='mt-7 flex w-[350px] flex-col gap-10'>
                    {loadingSimilarMinds ? (
                        <p className='!text-base-regular text-light-3'>Loading...</p>
                    ) : similarMinds?.length > 0 ? (
                        <>
                            {similarMinds.map((person) => (
                                <UserCard
                                    key={person.id}
                                    user={person}
                                />
                            ))}
                        </>
                    ) : (
                        <p className='!text-base-regular text-light-3'>No users yet</p>
                    )}
                </div>
            </div>
            <div className='flex flex-1 flex-col justify-start'>
                <h3 className='text-heading4-medium dark:text-light-1'>Trending Hashtags</h3>
                <div className='mt-7 flex w-[350px] flex-col gap-10'>
                    {loadingHashtags ? (
                        <p className='!text-base-regular text-light-3'>Loading...</p>
                    ) : hashtags?.length > 0 ? (
                        <>
                            {hashtags.map((hashtag) => (
                                <HashtagCard
                                    key={hashtag.id}
                                    hashtag={hashtag}
                                />
                            ))}
                        </>
                    ) : (
                        <p className='!text-base-regular text-light-3'>No hashtags yet</p>
                    )}
                </div>
            </div>
        </section>
    );
}

export default RightSidebar;