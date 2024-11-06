import AccountProfile from "@/components/forms/AccountProfile";
import { UserSession } from "@/types/user-session.type";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/authOptions";
import { permanentRedirect } from "next/navigation";

export const metadata = {
    title: 'Edit Profile',
}

const Page = async () => {
    const data: UserSession | null = await getServerSession(authOptions);
    const user = data?.user;
    if (!user) {
        permanentRedirect('/');
    }

    return (
        <>
            <h1 className='head-text'>Edit Profile</h1>
            <p className='mt-3 text-base-regular text-light-2'>Make any changes</p>

            <section className='mt-12'>
                <AccountProfile user={user} btnTitle='Continue' />
            </section>
        </>
    );
};

export default Page;