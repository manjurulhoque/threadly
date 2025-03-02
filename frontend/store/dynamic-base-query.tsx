import { getSession } from "next-auth/react";
import { fetchBaseQuery } from "@reduxjs/toolkit/query/react";

const DynamicBaseQuery = async (args: any, api: any, extraOptions: any) => {
    try {
        // Fetch the session for the current user
        const session = await getSession();

        // Initialize the base query with headers prepared
        const baseQuery = fetchBaseQuery({
            baseUrl: `${process.env.BACKEND_BASE_URL}/api`,
            prepareHeaders: (headers) => {
                if (session?.access) {
                    headers.set('Authorization', `Bearer ${session.access}`);
                }
                return headers;
            },
        });

        // Execute the base query
        return baseQuery(args, api, extraOptions);
    } catch (error) {
        console.error("Failed to prepare dynamic base query:", error);
        return {
            error: {
                status: "CUSTOM_ERROR",
                message: "Failed to fetch user session or prepare headers.",
            },
        };
    }
};

export default DynamicBaseQuery;
