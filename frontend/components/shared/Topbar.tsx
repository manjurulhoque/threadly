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