import AccountProfile from "@/components/forms/AccountProfile";
import { UserSession } from "@/types/user-session.type";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/authOptions";
import { permanentRedirect } from "next/navigation";
import { fetchUser } from "@/lib/actions/user.actions";

export const metadata = {
    title: "Onboarding",
    description: "Complete your profile now, to use threadly.",
}

async function Page() {
    const data: UserSession | null = await getServerSession(authOptions);
    const user = data?.user;
    if (!user) {
        permanentRedirect('/');
    }

    const userInfo = await fetchUser(user.id);
    if (!userInfo?.data) {
        permanentRedirect('/');
    }

    return (
        <main className='mx-auto flex max-w-3xl flex-col justify-start px-10 py-20'>
            <h1 className='head-text'>Onboarding</h1>
            <p className='mt-3 text-base-regular dark:text-light-2'>
                Complete your profile now, to use threadly.
            </p>

            <section className='mt-9 dark:bg-dark-2 p-10'>
                <AccountProfile user={userInfo.data} btnTitle='Continue' />
            </section>
        </main>
    );
}

export default Page;