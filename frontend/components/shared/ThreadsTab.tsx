import { redirect } from "next/navigation";

import ThreadCard from "../cards/ThreadCard";

interface Props {
    userId: number;
}

async function ThreadsTab({ userId }: Props) {
    return (
        <section className='mt-9 flex flex-col gap-10'>
            {/*<ThreadCard/>*/}
        </section>
    );
}

export default ThreadsTab;