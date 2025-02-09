import { auth } from "@clerk/nextjs/server"
import { redirect } from "next/navigation";

const AdminLayout = async ({ children }: { children: React.ReactNode }) => {
    const { userId } = await auth();
    if (!userId) return redirect('/sign-in');

    return (
        <>{children}</>
    )
}

export default AdminLayout