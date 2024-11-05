import { getSession } from "next-auth/react";
import { fetchBaseQuery } from "@reduxjs/toolkit/query/react";

const DynamicBaseQuery = async (args: any, api: any, extraOptions: any) => {
    const session = await getSession();
    return fetchBaseQuery({
        baseUrl: 'http://localhost:8080/api',
        prepareHeaders: (headers) => {
            if (session?.access) {
                headers.set('Authorization', `Bearer ${session.access}`);
            }
            return headers;
        },
    })(args, api, extraOptions);
};

export default DynamicBaseQuery;