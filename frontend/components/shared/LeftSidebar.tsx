"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { sidebarLinks } from "@/constants";
import { signOut, useSession } from "next-auth/react";

const LeftSidebar = () => {
    const router = useRouter();
    const pathname = usePathname();
    const {data: session, status} = useSession();

    const userId = session?.user.id;

    return (
        <section className='custom-scrollbar leftsidebar'>
            <div className='flex w-full flex-1 flex-col gap-6 px-6'>
                {sidebarLinks.map((link) => {
                    const isActive =
                        (pathname.includes(link.route) && link.route.length > 1) ||
                        pathname === link.route;

                    if (link.route === "/profile") link.route = `${link.route}/${userId}`;

                    const finalRoute = link.route === "/profile" ? `/profile/${userId}` : link.route;

                    const isActiveRoute =
                        (pathname.includes(finalRoute) && finalRoute.length > 1) ||
                        pathname === finalRoute;

                    return (
                        <Link
                            href={finalRoute}
                            key={link.label}
                            className={`leftsidebar_link hover:bg-light-3 dark:hover:bg-dark-3 ${
                                isActiveRoute ? "bg-primary-500" : ""
                            }`}
                        >
                            <div className="invert-0 dark:invert brightness-0 dark:brightness-200">
                                <Image
                                    src={link.imgURL}
                                    alt={link.label}
                                    width={24}
                                    height={24}
                                    className="dark:invert-[0.95] dark:brightness-200"
                                />
                            </div>

                            <p className='text-dark-2 dark:text-light-1 max-lg:hidden'>
                                {link.label}
                            </p>
                        </Link>
                    );
                })}
            </div>

            <div className='mt-10 px-6'>
                <div
                    className='flex cursor-pointer gap-4 p-4 hover:bg-light-3 dark:hover:bg-dark-3 rounded-lg'
                    onClick={() => signOut()}
                >
                    <div className="invert-0 dark:invert brightness-0 dark:brightness-200">
                        <Image
                            src='/assets/logout.svg'
                            alt='logout'
                            width={24}
                            height={24}
                            style={{ filter: "invert(1)" }}
                        />
                    </div>

                    <p className='text-dark-2 dark:text-light-2 max-lg:hidden'>
                        Logout
                    </p>
                </div>
            </div>
        </section>
    );
};

export default LeftSidebar;