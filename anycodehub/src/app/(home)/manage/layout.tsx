import { redirect } from "next/navigation";
import { cookies } from "next/headers";

const AdminLayout = async ({ children }: { children: React.ReactNode }) => {
    // Check authentication from cookies
    const cookieStore = await cookies();
    const accessToken = cookieStore.get('X-ACCESS-TOKEN');
    
    // Redirect to auth page if not authenticated
    if (!accessToken) {
        redirect('/auth');
    }
    
    // Get user data from cookie if needed
    const userDataCookie = cookieStore.get('user_data');
    
    return (
        <>{children}</>
    );
};

export default AdminLayout;