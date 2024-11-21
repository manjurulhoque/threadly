"use client";

import { Hashtag } from "@/types/hashtag.type";

const HashtagCard = ({hashtag}: {hashtag: Hashtag}) => {
    return (
        <div className="border rounded-lg p-4 shadow-md hover:shadow-lg transition-shadow duration-300">
            <h4 className="text-lg font-semibold">#{hashtag.name}</h4>
            <p className="text-gray-500">{hashtag.thread_count || 0} threads</p>
        </div>
    )
}

export default HashtagCard;
