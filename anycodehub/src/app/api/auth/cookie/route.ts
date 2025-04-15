import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";

// Cấu hình cookie
const COOKIE_EXPIRES_SECONDS = 60 * 60 * 24 * 7; // 7 days
const SECURE = process.env.NODE_ENV === 'production';

// Set cookie từ server
export async function POST(request: NextRequest) {
  try {
    const { key, value, maxAge = COOKIE_EXPIRES_SECONDS } = await request.json();
    
    // Validate input
    if (!key || value === undefined || value === null) {
      return NextResponse.json(
        { success: false, message: "Invalid data" },
        { status: 400 }
      );
    }
    
    // Set cookie sử dụng Next.js cookies API
    const cookieStore = await cookies();
    cookieStore.set({
      name: key,
      value: typeof value === 'string' ? value : JSON.stringify(value),
      path: '/',
      maxAge,
      secure: SECURE,
      httpOnly: true, // Không truy cập được từ JavaScript
      sameSite: 'strict'
    });
    
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Cookie set error:", error);
    return NextResponse.json(
      { success: false, message: "Failed to set cookie" },
      { status: 500 }
    );
  }
}

// Xóa cookie từ server
export async function DELETE(request: NextRequest) {
  try {
    const { key } = await request.json();
    
    // Validate input
    if (!key) {
      return NextResponse.json(
        { success: false, message: "Invalid data" },
        { status: 400 }
      );
    }
    
    // Delete cookie
    const cookieStore = await cookies();
    cookieStore.delete(key);
    
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Cookie delete error:", error);
    return NextResponse.json(
      { success: false, message: "Failed to delete cookie" },
      { status: 500 }
    );
  }
} 