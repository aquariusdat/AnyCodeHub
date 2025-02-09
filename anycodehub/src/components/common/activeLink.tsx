'use client';
import { ActiveLinkProp } from '@/types/index'
import Link from 'next/link'
import { usePathname } from 'next/navigation';
import React from 'react'

const ActiveLink = (props: ActiveLinkProp) => {
    const pathName = usePathname();
    const isActive = pathName == props.url;
    return (
        <>
            <Link className={`p-3 rounded-md flex items-center gap-3 transition-all ${isActive ? 'bg-primary bg-opacity-10 text-primary svg-animate' : 'hover:text-primary hover:bg-primary hover:bg-opacity-10'}`} href={props.url}>
                {props.children}
            </Link>
        </>
    )
}

export default ActiveLink