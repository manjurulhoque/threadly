const Home = async ({searchParams,}: { searchParams: { [key: string]: string | undefined } }) => {
    return (
        <>
            <h1 className='head-text text-left'>Home</h1>

            <section className='mt-9 flex flex-col gap-10'>
                <p className='no-result'>No threads found</p>
            </section>
        </>
    );
}

export default Home;