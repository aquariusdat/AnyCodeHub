import React from "react";

type MenuItemProp = {
    url: string;
    title: string;
    className?: string;
    icon?: React.ReactNode;
}

type ActiveLinkProp = {
    url: string;
    children: React.ReactNode;
}

type CourseInfoProps = {
    tooltipName: string;
    tooltipContent: string;
    courseInfoIcon?: React.ReactNode;
}

export type { MenuItemProp, ActiveLinkProp, CourseInfoProps };