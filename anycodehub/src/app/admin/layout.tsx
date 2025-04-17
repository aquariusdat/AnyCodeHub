"use client";

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Laptop, LayoutDashboard, BookOpen, Users, ShoppingCart, MessageSquare } from 'lucide-react';

const AdminLayout = ({ children }: { children: React.ReactNode }) => {
  const pathname = usePathname() || '/admin/dashboard';

  const isActive = (path: string) => {
    return pathname?.startsWith(path) ? 'bg-primary/10 text-primary font-medium' : '';
  };

  const menuItems = [
    { path: '/admin/dashboard', label: 'Dashboard', icon: <LayoutDashboard className="w-5 h-5 mr-2" /> },
    { path: '/admin/course', label: 'Khóa học', icon: <BookOpen className="w-5 h-5 mr-2" /> },
    { path: '/admin/member', label: 'Thành viên', icon: <Users className="w-5 h-5 mr-2" /> },
    { path: '/admin/order', label: 'Đơn hàng', icon: <ShoppingCart className="w-5 h-5 mr-2" /> },
    { path: '/admin/comment', label: 'Bình luận', icon: <MessageSquare className="w-5 h-5 mr-2" /> },
  ];

  return (
    <div className="flex h-screen">
      {/* Sidebar */}
      <div className="w-64 bg-card border-r shadow-sm flex flex-col">
        <div className="p-4 border-b">
          <Link href="/" className="flex items-center space-x-2">
            <Laptop className="w-6 h-6" />
            <span className="font-bold text-xl">Admin Panel</span>
          </Link>
        </div>
        <nav className="flex-1 p-4 space-y-1">
          {menuItems.map((item) => (
            <Link
              key={item.path}
              href={item.path}
              className={`flex items-center px-4 py-2 rounded-md hover:bg-muted transition-colors ${isActive(item.path)}`}
            >
              {item.icon}
              {item.label}
            </Link>
          ))}
        </nav>
        <div className="p-4 border-t">
          <Link href="/" className="flex items-center px-4 py-2 rounded-md hover:bg-muted transition-colors">
            <span>Quay lại trang chủ</span>
          </Link>
        </div>
      </div>

      {/* Main content */}
      <div className="flex-1 overflow-auto">
        <div className="p-6">
          {children}
        </div>
      </div>
    </div>
  );
};

export default AdminLayout; 