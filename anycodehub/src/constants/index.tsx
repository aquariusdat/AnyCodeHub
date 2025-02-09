import { CursorRaysIcon, ExploreIcon, GlobeIcon, PhoneIcon, ShoppingBagIcon, UserIcon, CommentIcon } from "@/components/icons/index";

export const menuItems: {
    url: string;
    title: string;
    className?: string;
    icon?: React.ReactNode;
}[] = [
        {
            url: "/explore",
            title: "Khám phá",
            icon: <GlobeIcon className="size-5" />
        },
        {
            url: "/study",
            title: "Khu vực học tập",
            icon: <ExploreIcon className="size-5" />
        },
        {
            url: "/manage/course",
            title: "Quản lý khoá học",
            icon: <ExploreIcon className="size-5" />
        },
        {
            url: "/manage/member",
            title: "Quản lý thành viên",
            icon: <UserIcon className="size-5" />
        },
        {
            url: "/manage/order",
            title: "Quản lý đơn hàng",
            icon: <ShoppingBagIcon className="size-5" />
        },
        {
            url: "/manage/comment",
            title: "Quản lý bình luận",
            icon: <CommentIcon className="size-5" />
        },
        {
            url: "/blog",
            title: "Blog",
            icon: <CursorRaysIcon className="size-5" />
        },
        {
            url: "/contact",
            title: "Contact me",
            icon: <PhoneIcon className="size-5" />
        }
    ];