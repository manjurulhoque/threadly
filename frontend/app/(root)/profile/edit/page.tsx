import AccountProfile from "@/components/forms/AccountProfile";
import { UserSession } from "@/types/user-session.type";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/authOptions";
import { permanentRedirect, redirect } from "next/navigation";
import { fetchUser } from "@/lib/actions/user.actions";

export const metadata = {
    title: 'Edit Profile',
}

const Page = async () => {
    const data: UserSession | null = await getServerSession(authOptions);
    const user = data?.user;
    if (!user) {
        permanentRedirect('/');
    }

    const userInfo = await fetchUser(user.id);
    if (!userInfo?.data) {
        permanentRedirect('/');
    }
    // if (!userInfo?.onboarded) redirect("/onboarding");

    return (
        <>
            <h1 className='head-text'>Edit Profile</h1>
            <p className='mt-3 text-base-regular text-light-2'>Make any changes</p>

            <section className='mt-12'>
                <AccountProfile user={userInfo.data} btnTitle='Continue' />
            </section>
        </>
    );
};

export default Page;