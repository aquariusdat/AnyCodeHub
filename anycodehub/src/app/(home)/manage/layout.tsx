import { getUserInfo } from "@/lib/actions/user.actions";
import { auth } from "@clerk/nextjs/server"
import { redirect } from "next/navigation";
import { GetUserInfoParams } from "@/types/params"
import { EUserRole } from "@/types/enums";
import NotFound from "@/app/not-found";

const AdminLayout = async ({ children }: { children: React.ReactNode }) => {
    const { userId } = await auth();
    if (!userId) return redirect('/sign-in');
    const user = await getUserInfo({ userId } as GetUserInfoParams);
    if (!user || user.role != EUserRole.ADMIN) return <NotFound />;

    return (
        <>{children}</>
    )
}

export default AdminLayout