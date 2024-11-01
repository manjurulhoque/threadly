import AccountProfile from "@/components/forms/AccountProfile";

export const metadata = {
    title: "Onboarding",
    description: "Complete your profile now, to use threadly.",
}

async function Page() {
    const userData = {
        id: 1,
        objectId: 1,
        name: "",
        bio: "",
        image: "",
    };

    return (
        <main className='mx-auto flex max-w-3xl flex-col justify-start px-10 py-20'>
            <h1 className='head-text'>Onboarding</h1>
            <p className='mt-3 text-base-regular text-light-2'>
                Complete your profile now, to use threadly.
            </p>

            <section className='mt-9 bg-dark-2 p-10'>
                <AccountProfile user={userData} btnTitle='Continue' />
            </section>
        </main>
    );
}

export default Page;