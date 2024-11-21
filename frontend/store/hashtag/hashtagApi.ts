import { createApi } from "@reduxjs/toolkit/query/react";
import DynamicBaseQuery from "@/store/dynamic-base-query";
import { Hashtag } from "@/types/hashtag.type";

const hashtagApi = createApi({
    reducerPath: "hashtagApi",
    baseQuery: DynamicBaseQuery,
    endpoints: (builder) => ({
        getTrendingHashtags: builder.query<{ hashtags: Hashtag[] }, void>({
            query: () => "hashtags/trending",
        }),
    }),
});

export const { useGetTrendingHashtagsQuery } = hashtagApi;

export default hashtagApi;
