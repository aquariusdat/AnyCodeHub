import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";

export async function POST(request: NextRequest) {
  try {
    // Gọi API logout endpoint (nếu cần)
    // const logoutResponse = await fetch('YOUR_BACKEND_LOGOUT_ENDPOINT', {
    //   method: 'POST',
    //   headers: {
    //     'Content-Type': 'application/json',
    //   },
    //   credentials: 'include', // Để gửi cookies
    // });
    
    // Xóa các HttpOnly cookies đã được đặt bởi API
    const cookieStore = await cookies();
    
    // Xóa access token cookie
    cookieStore.delete('X-ACCESS-TOKEN');
    
    // Xóa refresh token cookie nếu có
    cookieStore.delete('X-REFRESH-TOKEN');
    
    // Xóa các cookies khác nếu cần
    // cookieStore.delete('OTHER_COOKIE_NAME');
    
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Logout error:", error);
    return NextResponse.json(
      { success: false, message: "Logout failed" },
      { status: 500 }
    );
  }
} 