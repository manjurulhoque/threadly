"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";

import { sidebarLinks } from "@/constants";

function BottomBar() {
    const pathname = usePathname();

    return (
        <section className='bottombar'>
            <div className='bottombar_container'>
                {sidebarLinks.map((link) => {
                    const isActive =
                        (pathname.includes(link.route) && link.route.length > 1) ||
                        pathname === link.route;

                    return (
                        <Link
                            href={link.route}
                            key={link.label}
                            className={`bottombar_link ${isActive && "bg-primary-500"}`}
                        >
                            <div className="invert-0 dark:invert brightness-0 dark:brightness-200">
                                <Image
                                    src={link.imgURL}
                                    alt={link.label}
                                    width={16}
                                    height={16}
                                    className='object-contain'
                                    style={{ filter: "invert(1)" }}
                                />
                            </div>

                            <p className='text-subtle-medium text-light-1 max-sm:hidden'>
                                {link.label.split(/\s+/)[0]}
                            </p>
                        </Link>
                    );
                })}
            </div>
        </section>
    );
}

export default BottomBar;