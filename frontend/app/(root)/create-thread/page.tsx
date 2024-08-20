import PostThread from "@/components/forms/PostThread";

export const metadata = {
    title: "Create Thread",
}

const Page = async () => {
    return (
        <>
            <h1 className='head-text'>Create Thread</h1>

            <PostThread userId={1} />
        </>
    );
};

export default Page;
