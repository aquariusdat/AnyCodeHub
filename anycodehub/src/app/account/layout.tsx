"use client";

import React, { useEffect, useState } from "react";
import { useRouter, usePathname } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { 
  User, 
  Settings,
  KeyIcon,
  BookOpen,
  Bell,
  CreditCard,
  ChevronRight,
  Home,
  Moon,
  Sun,
  LogOut
} from "lucide-react";
import { useTheme } from "next-themes";
import { Button } from "@/components/ui/button";
import { useAuthStore } from "@/stores/auth.store";
import { useToast } from "@/components/ui/use-toast";

export default function AccountLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const pathname = usePathname();
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);
  const getUser = useAuthStore((state) => state.getUser);
  const clearAuth = useAuthStore((state) => state.clearAuth);
  const user = getUser();
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);
  const { toast } = useToast();

  // After mounting, we have access to the theme
  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    // Redirect to login if not authenticated
    if (!isAuthenticated()) {
      router.push("/auth?mode=signin");
    }
  }, [isAuthenticated, router]);

  const handleLogout = async () => {
    await clearAuth();
    toast({
      title: "Đăng xuất thành công",
      description: "Hẹn gặp lại bạn!",
      variant: "default",
    });
    router.push("/");
  };

  if (!user) {
    return null; // Prevent flash of unauthenticated content
  }

  const navigation = [
    {
      name: "Hồ sơ cá nhân",
      href: "/account/profile",
      icon: User,
      current: pathname === "/account/profile",
    },
    {
      name: "Khóa học của tôi",
      href: "/account/courses",
      icon: BookOpen,
      current: pathname === "/account/courses",
    },
    {
      name: "Thông báo",
      href: "/account/notifications",
      icon: Bell,
      current: pathname === "/account/notifications",
    },
    {
      name: "Đổi mật khẩu",
      href: "/account/change-password",
      icon: KeyIcon,
      current: pathname === "/account/change-password",
    },
    {
      name: "Thanh toán",
      href: "/account/payments",
      icon: CreditCard,
      current: pathname === "/account/payments",
    },
    {
      name: "Cài đặt",
      href: "/account/settings",
      icon: Settings,
      current: pathname === "/account/settings",
    },
  ];

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors duration-200">
      {/* Header with Logo */}
      <header className="bg-white dark:bg-gray-800/90 border-b border-gray-200 dark:border-gray-700/80 sticky top-0 z-30 shadow-sm backdrop-blur-sm dark:backdrop-blur-sm">
        <div className="container mx-auto px-4 flex items-center justify-between h-16">
          <div className="flex items-center gap-2">
            <Link href="/" className="flex items-center">
              <div className="relative h-8 w-8 md:h-10 md:w-10 mr-2 overflow-hidden rounded-md">
                <Image 
                  src="/images/logo.svg" 
                  alt="AnyCodeHub Logo" 
                  width={40} 
                  height={40}
                  className="object-contain"
                />
              </div>
              <span className="text-lg md:text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-purple-600 to-indigo-600 dark:from-purple-400 dark:to-indigo-400">
                AnyCodeHub
              </span>
            </Link>
          </div>
          
          <div className="flex items-center gap-3">
            <Button 
              onClick={() => router.push('/')}
              variant="ghost" 
              size="sm"
              className="hidden md:flex items-center gap-2 text-gray-600 hover:text-gray-900 dark:text-gray-200 dark:hover:text-white"
            >
              <Home className="h-4 w-4" />
              <span>Trang chủ</span>
            </Button>
            
            {mounted && (
              <Button
                variant="outline"
                size="icon"
                onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
                className="border-gray-200 dark:border-gray-700/80 text-gray-600 hover:text-gray-900 dark:text-gray-200 dark:hover:text-white"
                aria-label="Toggle theme"
              >
                <Sun className="h-[1.2rem] w-[1.2rem] rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
                <Moon className="absolute h-[1.2rem] w-[1.2rem] rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
                <span className="sr-only">Toggle theme</span>
              </Button>
            )}
            
            <div className="h-6 w-px bg-gray-200 dark:bg-gray-700/80"></div>
            
            <div className="flex items-center gap-2">
              <div className="hidden md:block">
                <p className="text-sm font-medium text-right text-gray-900 dark:text-gray-100">{user.firstName} {user.lastName}</p>
                <p className="text-xs text-gray-500 dark:text-gray-400 text-right">{user.email}</p>
              </div>
              <div className="h-8 w-8 rounded-full bg-purple-100 dark:bg-purple-800/50 text-purple-600 dark:text-purple-200 flex items-center justify-center font-bold text-sm">
                {user.firstName?.[0]}{user.lastName?.[0]}
              </div>
              <Button
                variant="ghost"
                size="icon"
                onClick={handleLogout}
                className="text-gray-600 hover:text-red-600 dark:text-gray-300 dark:hover:text-red-400"
              >
                <LogOut className="h-5 w-5" />
              </Button>
            </div>
          </div>
        </div>
      </header>
      
      <div className="bg-gradient-to-r from-purple-700 to-indigo-700 dark:from-purple-800 dark:to-indigo-900 text-white">
        <div className="container mx-auto py-6 md:py-8 px-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="text-center sm:text-left">
              <h1 className="text-2xl md:text-3xl font-bold">Tài khoản</h1>
              <p className="mt-1 text-purple-100 text-sm md:text-base max-w-md">
                Quản lý thông tin cá nhân và thiết lập của bạn
              </p>
            </div>
            
            <Link href="/">
              <Button 
                variant="outline" 
                className="w-full sm:w-auto bg-white/10 hover:bg-white/20 text-white border-white/20 backdrop-blur-sm md:hidden"
              >
                <Home className="h-4 w-4 mr-2" />
                Về trang chủ
              </Button>
            </Link>
          </div>
          
          {/* Breadcrumb for mobile */}
          <div className="flex items-center mt-4 text-sm md:hidden">
            <Link href="/" className="text-purple-100 hover:text-white">
              Trang chủ
            </Link>
            <ChevronRight className="h-4 w-4 mx-1 text-purple-200" />
            <span className="text-white">Tài khoản</span>
            {pathname !== "/account" && pathname !== "/account/" && (
              <>
                <ChevronRight className="h-4 w-4 mx-1 text-purple-200" />
                <span className="text-white">
                  {navigation.find((item) => item.href === pathname)?.name || ""}
                </span>
              </>
            )}
          </div>
        </div>
      </div>
      
      <div className="container mx-auto py-6 px-4">
        <div className="flex flex-col md:flex-row gap-8">
          {/* Sidebar Navigation - Hidden on mobile, shown as fixed sidebar on desktop */}
          <div className="hidden md:block md:w-64 shrink-0">
            <div className="bg-white dark:bg-gray-800/90 rounded-lg shadow-md dark:shadow-lg dark:shadow-purple-900/5 overflow-hidden border border-gray-200 dark:border-gray-700/50">
              <div className="p-4 border-b border-gray-200 dark:border-gray-700/50">
                <div className="flex items-center">
                  <div className="flex-shrink-0 h-10 w-10 rounded-full bg-purple-100 dark:bg-purple-800/40 text-purple-600 dark:text-purple-200 flex items-center justify-center font-bold text-lg">
                    {user.firstName?.[0]}{user.lastName?.[0]}
                  </div>
                  <div className="ml-3">
                    <p className="text-sm font-medium text-gray-900 dark:text-gray-100">{user.firstName} {user.lastName}</p>
                    <p className="text-xs text-gray-500 dark:text-gray-400 truncate">{user.email}</p>
                  </div>
                </div>
              </div>
              <nav className="p-2">
                <ul className="space-y-1">
                  {navigation.map((item) => (
                    <li key={item.name}>
                      <Link
                        href={item.href}
                        className={`flex items-center px-3 py-2 text-sm font-medium rounded-md group transition-colors ${
                          item.current
                            ? "bg-purple-50 text-purple-700 dark:bg-purple-900/30 dark:text-purple-200"
                            : "text-gray-700 hover:bg-purple-50 hover:text-purple-700 dark:text-gray-200 dark:hover:bg-gray-700/50 dark:hover:text-white"
                        }`}
                      >
                        <item.icon className={`mr-3 flex-shrink-0 h-5 w-5 ${
                          item.current 
                            ? "text-purple-600 dark:text-purple-300" 
                            : "text-gray-500 group-hover:text-purple-600 dark:text-gray-400 dark:group-hover:text-purple-300"
                        }`} 
                        aria-hidden="true" 
                        />
                        {item.name}
                      </Link>
                    </li>
                  ))}
                </ul>
              </nav>
            </div>
          </div>
          
          {/* Mobile Navigation - Horizontal scrollable tabs */}
          <div className="md:hidden overflow-x-auto pb-2 mb-4 whitespace-nowrap flex gap-2">
            {navigation.map((item) => (
              <Link
                key={item.name}
                href={item.href}
                className={`inline-flex items-center px-3 py-2 text-sm font-medium rounded-full ${
                  item.current
                    ? "bg-purple-100 text-purple-700 dark:bg-purple-900/40 dark:text-purple-200"
                    : "bg-white text-gray-700 hover:bg-purple-50 hover:text-purple-700 dark:bg-gray-800/90 dark:text-gray-200 dark:hover:text-white"
                } border border-gray-200 dark:border-gray-700/50 shadow-sm dark:shadow-gray-900/10`}
              >
                <item.icon className="mr-1.5 h-4 w-4" aria-hidden="true" />
                {item.name}
              </Link>
            ))}
          </div>
          
          {/* Main Content */}
          <div className="flex-1">
            {children}
          </div>
        </div>
      </div>
    </div>
  );
} 