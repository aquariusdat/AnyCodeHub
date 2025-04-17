import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { BookOpen, Users, ShoppingCart, TrendingUp } from 'lucide-react';
import Heading from '@/components/typoraphy/heading';

const AdminDashboardPage = () => {
  return (
    <div className="space-y-6">
      <Heading>Dashboard</Heading>
      
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Tổng khóa học</CardTitle>
            <BookOpen className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">12</div>
            <p className="text-xs text-muted-foreground">+2 trong tháng này</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Tổng học viên</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">245</div>
            <p className="text-xs text-muted-foreground">+12% so với tháng trước</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Tổng đơn hàng</CardTitle>
            <ShoppingCart className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">187</div>
            <p className="text-xs text-muted-foreground">+7 trong tuần này</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Doanh thu</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">32,450,000đ</div>
            <p className="text-xs text-muted-foreground">+15% so với tháng trước</p>
          </CardContent>
        </Card>
      </div>
      
      <div className="grid gap-4 md:grid-cols-2">
        <Card className="col-span-1">
          <CardHeader>
            <CardTitle>Khóa học phổ biến</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium">React.js - Advanced Course</p>
                  <p className="text-sm text-muted-foreground">32 học viên trong tháng này</p>
                </div>
                <div className="text-primary font-medium">1,250,000đ</div>
              </div>
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium">Next.js Masterclass</p>
                  <p className="text-sm text-muted-foreground">28 học viên trong tháng này</p>
                </div>
                <div className="text-primary font-medium">1,450,000đ</div>
              </div>
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium">Node.js Backend Development</p>
                  <p className="text-sm text-muted-foreground">25 học viên trong tháng này</p>
                </div>
                <div className="text-primary font-medium">1,350,000đ</div>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card className="col-span-1">
          <CardHeader>
            <CardTitle>Đơn hàng gần đây</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium">Nguyen Van A</p>
                  <p className="text-sm text-muted-foreground">Next.js Masterclass</p>
                </div>
                <div className="text-primary font-medium">1,450,000đ</div>
              </div>
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium">Tran Thi B</p>
                  <p className="text-sm text-muted-foreground">React.js - Advanced Course</p>
                </div>
                <div className="text-primary font-medium">1,250,000đ</div>
              </div>
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium">Le Van C</p>
                  <p className="text-sm text-muted-foreground">Node.js Backend Development</p>
                </div>
                <div className="text-primary font-medium">1,350,000đ</div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default AdminDashboardPage; 