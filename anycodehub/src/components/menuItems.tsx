'use client';

import { MenuItemProp } from "@/types/index";
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import Tooltip from "./common/toolTip";

const MenuItem = (props: MenuItemProp) => {
    const { url, title, className, icon, collapsed = false } = props;
    const pathname = usePathname();
    const isActive = pathname === url;
    
    // Common link classes
    const linkClasses = `p-3 rounded-md flex items-center transition-all ${
        isActive 
            ? 'bg-primary bg-opacity-10 text-primary' 
            : 'hover:text-primary hover:bg-primary hover:bg-opacity-10'
    }`;
    
    // If sidebar is collapsed, render link with tooltip
    if (collapsed) {
        return (
            <li className={`${className || ''} relative`}>
                <Tooltip content={title} placement="right">
                    <Link 
                        className={`${linkClasses} justify-center`} 
                        href={url}
                    >
                        <span className="flex-shrink-0">
                            {icon || <span className="w-5 h-5 block"></span>}
                        </span>
                    </Link>
                </Tooltip>
            </li>
        );
    }

    // Default expanded view
    return (
        <li className={className || ''}>
            <Link 
                className={`${linkClasses} gap-3`} 
                href={url}
            >
                <span className="flex-shrink-0">
                    {icon || <span className="w-5 h-5 block"></span>}
                </span>
                <span className="truncate">{title}</span>
            </Link>
        </li>
    );
};

export default MenuItem; 