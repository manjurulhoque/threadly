import PostThread from "@/components/forms/PostThread";

const Page = async () => {
    return (
        <>
            <h1 className='head-text'>Create Thread</h1>

            <PostThread userId={1} />
        </>
    );
};

export default Page;
