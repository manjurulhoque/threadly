import Image from "next/image";
import { permanentRedirect, redirect } from "next/navigation";

import { profileTabs } from "@/constants";

import ThreadsTab from "@/components/shared/ThreadsTab";
import ProfileHeader from "@/components/shared/ProfileHeader";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

import { UserSession } from "@/types/user-session.type";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/authOptions";
import { fetchUser } from "@/lib/actions/user.actions";

export const metadata = {
    title: 'Profile',
}

async function Page({ params }: { params: { id: number } }) {
    const data: UserSession | null = await getServerSession(authOptions);
    const user = data?.user;
    if (!user) {
        permanentRedirect('/login');
    }
    const userInfo = await fetchUser(params.id);
    // if (!userInfo?.onboarded) redirect("/onboarding");

    return (
        <section>
            <ProfileHeader user={userInfo.data}/>

            <div className='mt-9'>
                <Tabs defaultValue='threads' className='w-full'>
                    <TabsList className='tab'>
                        {profileTabs.map((tab) => (
                            <TabsTrigger key={tab.label} value={tab.value} className='tab'>
                                <Image
                                    src={tab.icon}
                                    alt={tab.label}
                                    width={24}
                                    height={24}
                                    className='object-contain'
                                />
                                <p className='max-sm:hidden'>{tab.label}</p>

                                {tab.label === "Threads" && (
                                    <p className='ml-1 rounded-sm bg-light-4 px-2 py-1 !text-tiny-medium text-light-2'>
                                        5
                                    </p>
                                )}
                            </TabsTrigger>
                        ))}
                    </TabsList>
                    {profileTabs.map((tab) => (
                        <TabsContent
                            key={`content-${tab.label}`}
                            value={tab.value}
                            className='w-full text-light-1'
                        >
                            {/* @ts-ignore */}
                            <ThreadsTab
                                userId={params.id}
                            />
                        </TabsContent>
                    ))}
                </Tabs>
            </div>
        </section>
    );
}
export default Page;