import { UserSession } from "@/types/user-session.type";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/authOptions";
import { permanentRedirect } from "next/navigation";

const Page = async ({searchParams,}: { searchParams: { [key: string]: string | undefined } }) => {
    const data: UserSession | null = await getServerSession(authOptions);
    if (!data?.user) {
        permanentRedirect('/login');
    }

    return (
        <>
            <h1 className='head-text text-left'>Home</h1>

            <section className='mt-9 flex flex-col gap-10'>
                <p className='no-result'>No threads found</p>
            </section>
        </>
    );
}

export default Page;