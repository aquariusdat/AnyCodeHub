'use client';
import { MenuItemProp } from "@/types/index";
import ActiveLink from "./common/activeLink";

const MenuItem = (props: MenuItemProp) => {
    const { url, title, className, icon } = props;

    return (
        <>
            <li className={className}>
                <ActiveLink url={url}>
                    {icon ? icon : <></>}
                    {title}
                </ActiveLink>
            </li>
        </>
    )
}

export default MenuItem;