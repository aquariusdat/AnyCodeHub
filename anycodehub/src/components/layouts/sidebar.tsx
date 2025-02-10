import { menuItems } from "@/constants/index"
import MenuItem from "../menuItems";
import logo from "../../../public/images/logo.svg";
import Image from "next/image";
import Link from "next/link";
import { UserButton } from "@clerk/nextjs";
import { DarkModeToggle } from "../common";

const Sidebar = () => {
    return (
        <aside className="sidebar p-5 border-r-gray-200 border-2 border-solid dark:bg-grayDarker bg-white flex flex-col">
            <Link className="sidebar-logo font-bold text-3xl flex items-center gap-3 mb-4" style={{ height: "50px" }} href="/">
                <div className="image rounded-full bg-primary size-12 p-1.5" >
                    <Image
                        style={{
                            maxWidth: "100%",
                            height: "auto",
                            objectFit: "cover",
                        }}
                        priority
                        src={logo}
                        alt="AnyCodeBlog"
                    />
                </div>

                <span className="text-xl">anyCodeHub</span>
            </Link>

            <ul className="sidebar-list flex flex-col gap-2">
                {
                    menuItems.map((item, index) => <MenuItem key={index} icon={item.icon} url={item.url} title={item.title} className={item.className} />)
                }
            </ul>

            <div className="flex justify-center mt-10">
                <DarkModeToggle></DarkModeToggle>
                <UserButton />
            </div>
        </aside>
    );
}

export default Sidebar;