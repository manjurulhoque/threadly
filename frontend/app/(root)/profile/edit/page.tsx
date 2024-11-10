import AccountProfile from "@/components/forms/AccountProfile";
import { UserSession } from "@/types/user-session.type";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/authOptions";
import { permanentRedirect } from "next/navigation";
import { fetchUser } from "@/lib/actions/user.actions";

export const metadata = {
    title: 'Edit Profile',
};

const Page = async () => {
    const data: UserSession | null = await getServerSession(authOptions);
    const user = data?.user;

    // Redirect to home if no user session is found
    if (!user) {
        console.warn("No user session found, redirecting to home.");
        permanentRedirect('/');
        return null;
    }

    let userInfo = null;

    try {
        const response = await fetchUser(user.id);
        if (!response?.data) {
            console.warn("User information not found. Redirecting to home.");
            permanentRedirect('/');
            return null;
        }
        userInfo = response.data;
    } catch (error: any) {
        console.error("Failed to fetch user information:", error.message || error);
        return (
            <section className='mx-auto max-w-3xl text-center py-20'>
                <h1 className='head-text'>Error</h1>
                <p className='mt-3 text-base-regular dark:text-light-2'>
                    Unable to load the profile. Please try again later.
                </p>
            </section>
        );
    }

    return (
        <>
            <h1 className='head-text'>Edit Profile</h1>
            <p className='mt-3 text-base-regular dark:text-light-2'>Make any changes</p>

            <section className='mt-12'>
                <AccountProfile user={userInfo} btnTitle='Continue' />
            </section>
        </>
    );
};

export default Page;
