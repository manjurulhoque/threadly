import Image from "next/image";
import Link from "next/link";
import { ModeToggle } from "@/components/shared/ModeToggle";

function TopBar() {
    return (
        <nav className='topbar'>
            <Link href='/' className='flex items-center gap-4'>
                <Image src='/logo.svg' alt='logo' width={28} height={28}/>
                <p className='text-heading3-bold dark:text-light-1 max-xs:hidden'>Threadly</p>
            </Link>

            {/* Search Input */}
            <div className="flex-1 mx-4 flex justify-center">
                <input
                    type="text"
                    placeholder="Search Threadly..."
                    className="w-full max-w-3xl px-4 py-2 border border-gray-600 rounded-md bg-light-2 dark:bg-dark-2 text-dark-3 dark:text-light-1 placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
            </div>

            <div className='flex items-center gap-2'>
                <ModeToggle />

                <div className='block md:hidden'>
                    <div className='flex cursor-pointer invert-0 dark:invert brightness-0 dark:brightness-200'>
                        <Image
                            src='/assets/logout.svg'
                            alt='logout'
                            width={24}
                            height={24}
                            style={{ filter: "invert(1)" }}
                        />
                    </div>
                </div>
            </div>
        </nav>
    );
}

export default TopBar;