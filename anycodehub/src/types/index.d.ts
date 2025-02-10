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

type CreateUserParams = {
    clerkId: string;
    userName:string;
    emailAddress:string;
    name?:string;
    avatar?:string;
};

export type { MenuItemProp, ActiveLinkProp, CourseInfoProps, CreateUserParams};