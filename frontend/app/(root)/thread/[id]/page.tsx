import React from "react";
import { UserSession } from "@/types/user-session.type";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/authOptions";
import { permanentRedirect } from "next/navigation";
import { fetchUser } from "@/lib/actions/user.actions";

export const metadata = {
    title: "Thread",
    description: "Thread",
}

interface Props {
    params: {
        id: string;
    };
}

const Page: React.FC<Props> = async ({params: {id}}) => {
    const data: UserSession | null = await getServerSession(authOptions);
    const user = data?.user;
    if (!user) {
        permanentRedirect('/login');
    }

    const userInfo = await fetchUser(user.id);
    if (!userInfo?.data) {
        permanentRedirect('/');
    }

    return (
        <div>
            <h1>Thread</h1>
        </div>
    );
};

export default Page;
