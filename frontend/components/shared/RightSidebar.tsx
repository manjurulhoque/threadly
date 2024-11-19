import { fetchSimilarMinds } from "@/lib/actions/user.actions";
import UserCard from "@/components/cards/UserCard";
import { User } from "@/types/user.type";


async function RightSidebar() {

    let similarMinds: User[] = [];
    try {
        const {data} = await fetchSimilarMinds();
        similarMinds = data;
    } catch (error: any) {
        console.error(`Failed to fetch similar minds: ${error}`);
    }

    return (
        <section className='custom-scrollbar rightsidebar'>
            <div className='flex flex-1 flex-col justify-start'>
                <h3 className='text-heading4-medium dark:text-light-1'>Similar Minds</h3>
                <div className='mt-7 flex w-[350px] flex-col gap-10'>
                    {similarMinds?.length > 0 ? (
                        <>
                            {similarMinds.map((person) => (
                                <UserCard
                                    key={person.id}
                                    user={person}
                                />
                            ))}
                        </>
                    ) : (
                        <p className='!text-base-regular text-light-3'>No users yet</p>
                    )}
                </div>
            </div>
        </section>
    );
}

export default RightSidebar;