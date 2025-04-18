"use client";

import React, { useState } from "react";
import { BellRing, Check, Clock, Settings, Trash, Mail, Globe, BookOpen, BadgeDollarSign, Users, ExternalLink, Bell, BellOff, Info, MessageSquare, GraduationCap, Star, Calendar, Gift, ChevronDown, Eye, Filter } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useAuthStore } from "@/stores/auth.store";
import { useToast } from "@/components/ui/use-toast";
import { cn } from "@/lib/utils";
import { Separator } from "@/components/ui/separator";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";


interface Notification {
  id: string;
  title: string;
  message: string;
  type: "system" | "course" | "message" | "reminder" | "announcement" | "payment";
  createdAt: string;
  read: boolean;
  icon?: React.ReactNode;
  action?: string;
  actionUrl?: string;
  sender?: {
    name: string;
    avatar?: string;
  };
  course?: {
    title: string;
    image?: string;
  };
}

export default function NotificationsPage() {
  const getUser = useAuthStore((state) => state.getUser);
  const user = getUser();
  const { toast } = useToast();
  
  const [notifications, setNotifications] = useState<Notification[]>([
    {
      id: "1",
      title: "New Course Update",
      message: "The 'Advanced TypeScript Patterns' course has been updated with new content.",
      type: "course",
      createdAt: "2024-02-18T09:30:00Z",
      read: false,
      icon: <GraduationCap className="h-5 w-5" />,
      action: "View Course",
      actionUrl: "/courses/typescript-patterns",
      course: {
        title: "Advanced TypeScript Patterns",
        image: "/course-images/typescript.jpg",
      }
    },
    {
      id: "2",
      title: "Weekly Progress Summary",
      message: "You completed 3 lessons this week. Keep up the good work!",
      type: "system",
      createdAt: "2024-02-17T15:45:00Z",
      read: true,
      icon: <Star className="h-5 w-5" />
    },
    {
      id: "3",
      title: "Upcoming Live Session",
      message: "Don't forget your scheduled live session for 'React Developer Course' tomorrow at 10:00 AM.",
      type: "reminder",
      createdAt: "2024-02-16T18:20:00Z",
      read: false,
      icon: <Calendar className="h-5 w-5" />,
      action: "Add to Calendar",
      actionUrl: "/calendar/add"
    },
    {
      id: "4",
      title: "New Message from Instructor",
      message: "Jane Smith has responded to your question about React hooks.",
      type: "message",
      createdAt: "2024-02-15T11:10:00Z",
      read: true,
      icon: <MessageSquare className="h-5 w-5" />,
      action: "View Message",
      actionUrl: "/messages/jane-smith",
      sender: {
        name: "Jane Smith",
        avatar: "/avatars/jane.jpg",
      }
    },
    {
      id: "5",
      title: "Special Discount Offer",
      message: "Limited time offer: 50% off on all premium courses until February 25th.",
      type: "announcement",
      createdAt: "2024-02-14T13:15:00Z",
      read: false,
      icon: <Gift className="h-5 w-5" />,
      action: "Browse Courses",
      actionUrl: "/courses/browse"
    },
    {
      id: "6",
      title: "Certificate Awarded",
      message: "Congratulations! You've been awarded a certificate for completing the 'Node.js Backend Development' course.",
      type: "system",
      createdAt: "2024-02-13T09:45:00Z",
      read: true,
      icon: <GraduationCap className="h-5 w-5" />,
      action: "View Certificate",
      actionUrl: "/certificates/nodejs",
      course: {
        title: "Node.js Backend Development",
        image: "/course-images/nodejs.jpg",
      }
    },
    {
      id: "7",
      title: "Account Security Alert",
      message: "Your password was changed recently. If this wasn't you, please contact support immediately.",
      type: "system",
      createdAt: "2024-02-12T22:30:00Z",
      read: true,
      icon: <Users className="h-5 w-5" />
    },
    {
      id: "8",
      title: "Payment successful",
      message: "Your payment of $49.99 for 'UI/UX Design Principles' was successful. Your receipt has been emailed to you.",
      type: "payment",
      createdAt: "2024-02-10T11:10:00Z",
      read: true,
      actionUrl: "/account/payments"
    },
    {
      id: "9",
      title: "New course recommendation",
      message: "Based on your interests, we think you might enjoy 'GraphQL API Development'",
      type: "system",
      createdAt: "2024-02-09T13:25:00Z",
      read: true,
      actionUrl: "/course/graphql-api"
    },
  ]);

  const [notificationSettings, setNotificationSettings] = useState({
    email: {
      courseUpdates: true,
      messages: true,
      promotions: false,
      accountAlerts: true,
    },
    push: {
      courseUpdates: true,
      messages: true,
      promotions: true,
      accountAlerts: true,
    },
    frequency: "immediate" as "immediate" | "daily" | "weekly",
  });

  const [activeTab, setActiveTab] = useState<string>("all");
  const [showSettings, setShowSettings] = useState(false);
  
  if (!user) {
    return null;
  }
  
  // Filter notifications based on selected tab
  const filteredNotifications = notifications.filter(notification => {
    if (activeTab === "all") return true;
    if (activeTab === "unread") return !notification.read;
    return notification.type === activeTab;
  });
  
  // Handle notification read/unread toggle
  const handleToggleRead = (id: string) => {
    setNotifications(prevNotifications => 
      prevNotifications.map(notification => 
        notification.id === id 
          ? { ...notification, read: !notification.read } 
          : notification
      )
    );
  };
  
  // Handle notification delete
  const handleDelete = (id: string) => {
    setNotifications(prevNotifications => 
      prevNotifications.filter(notification => notification.id !== id)
    );
    
    toast({
      title: "Đã xóa thông báo",
      description: "Thông báo đã được xóa thành công.",
      duration: 3000
    });
  };
  
  // Handle mark all as read
  const handleMarkAllAsRead = () => {
    setNotifications(prevNotifications => 
      prevNotifications.map(notification => ({ ...notification, read: true }))
    );
    
    toast({
      title: "Đã đánh dấu tất cả là đã đọc",
      description: "Tất cả thông báo đã được đánh dấu là đã đọc.",
      duration: 3000
    });
  };
  
  // Handle clear all notifications
  const handleClearAll = () => {
    setNotifications([]);
    
    toast({
      title: "Đã xóa tất cả thông báo",
      description: "Tất cả thông báo đã được xóa thành công.",
      duration: 3000
    });
  };
  
  // Toggle notification settings
  const handleToggleSetting = (settingId: string) => {
    setNotificationSettings(prevSettings => 
      prevSettings.map(setting => 
        setting.id === settingId 
          ? { ...setting, enabled: !setting.enabled } 
          : setting
      )
    );
  };
  
  // Toggle notification channel
  const handleToggleChannel = (settingId: string, channelId: string) => {
    setNotificationSettings(prevSettings => 
      prevSettings.map(setting => 
        setting.id === settingId 
          ? { 
              ...setting, 
              channels: setting.channels.map(channel => 
                channel.id === channelId 
                  ? { ...channel, enabled: !channel.enabled } 
                  : channel
              ) 
            } 
          : setting
      )
    );
  };
  
  // Format timestamp into relative time
  const formatRelativeTime = (timestamp: string) => {
    const date = new Date(timestamp);
    const now = new Date();
    const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000);
    
    if (diffInSeconds < 60) {
      return 'Vừa xong';
    } else if (diffInSeconds < 3600) {
      const minutes = Math.floor(diffInSeconds / 60);
      return `${minutes} phút trước`;
    } else if (diffInSeconds < 86400) {
      const hours = Math.floor(diffInSeconds / 3600);
      return `${hours} giờ trước`;
    } else {
      const days = Math.floor(diffInSeconds / 86400);
      return `${days} ngày trước`;
    }
  };
  
  const getNotificationIcon = (type: Notification["type"]) => {
    switch (type) {
      case "info": return <Info className="h-5 w-5 text-blue-500" />;
      case "success": return <Check className="h-5 w-5 text-green-500" />;
      case "warning": return <Clock className="h-5 w-5 text-yellow-500" />;
      case "course": return <GraduationCap className="h-5 w-5 text-purple-500" />;
      case "message": return <MessageSquare className="h-5 w-5 text-indigo-500" />;
    }
  };
  
  const unreadCount = notifications.filter(n => !n.read).length;

  return (
    <div className="space-y-6">
      <Card className="overflow-hidden border-gray-200 dark:border-gray-700/50 shadow-md dark:shadow-lg dark:shadow-purple-900/5">
        <div className="h-2 bg-gradient-to-r from-purple-600 to-indigo-600 dark:from-purple-500 dark:to-indigo-500"></div>
        <CardHeader>
          <CardTitle className="text-2xl font-bold">Thông báo</CardTitle>
          <CardDescription>Quản lý thông báo và tùy chọn nhận thông báo</CardDescription>
        </CardHeader>
        
        <CardContent>
          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            <div className="flex justify-between items-center mb-6">
              <TabsList className="bg-gray-100 dark:bg-gray-800/70">
                <TabsTrigger value="all" className="data-[state=active]:bg-white dark:data-[state=active]:bg-gray-700/50">
                  Tất cả
                </TabsTrigger>
                <TabsTrigger value="unread" className="data-[state=active]:bg-white dark:data-[state=active]:bg-gray-700/50">
                  Chưa đọc {unreadCount > 0 && (
                    <Badge className="ml-1 bg-purple-500 text-white">{unreadCount}</Badge>
                  )}
                </TabsTrigger>
                <TabsTrigger value="settings" className="data-[state=active]:bg-white dark:data-[state=active]:bg-gray-700/50">
                  Cài đặt
                </TabsTrigger>
              </TabsList>
              
              <div className="flex gap-2">
                <Button 
                  variant="outline" 
                  size="sm"
                  onClick={handleMarkAllAsRead}
                  className="text-sm border-gray-300 dark:border-gray-700"
                  disabled={!notifications.some(n => !n.read)}
                >
                  <Check className="h-4 w-4 mr-1" />
                  Đánh dấu tất cả đã đọc
                </Button>
                
                <AlertDialog>
                  <AlertDialogTrigger asChild>
                    <Button 
                      variant="outline" 
                      size="sm"
                      className="text-sm border-gray-300 dark:border-gray-700"
                      disabled={notifications.length === 0}
                    >
                      <Trash className="h-4 w-4 mr-1" />
                      Xóa tất cả
                    </Button>
                  </AlertDialogTrigger>
                  <AlertDialogContent className="bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700">
                    <AlertDialogHeader>
                      <AlertDialogTitle className="text-gray-900 dark:text-gray-100">
                        Xóa tất cả thông báo?
                      </AlertDialogTitle>
                      <AlertDialogDescription className="text-gray-500 dark:text-gray-400">
                        Hành động này sẽ xóa tất cả thông báo của bạn và không thể khôi phục.
                      </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                      <AlertDialogCancel className="border-gray-300 dark:border-gray-700 text-gray-700 dark:text-gray-300">
                        Hủy
                      </AlertDialogCancel>
                      <AlertDialogAction 
                        className="bg-red-600 text-white hover:bg-red-700"
                        onClick={handleClearAll}
                      >
                        Xóa tất cả
                      </AlertDialogAction>
                    </AlertDialogFooter>
                  </AlertDialogContent>
                </AlertDialog>
              </div>
            </div>
            
            <TabsContent value={activeTab} className="mt-0">
              {filteredNotifications.length > 0 ? (
                <div className="space-y-4">
                  {filteredNotifications.map(notification => (
                    <Card 
                      key={notification.id} 
                      className={cn(
                        "overflow-hidden border transition-colors",
                        !notification.read 
                          ? "border-l-4 border-l-purple-500 bg-purple-50/50 dark:bg-purple-900/5 dark:border-l-purple-400" 
                          : "border-gray-200 dark:border-gray-700/50"
                      )}
                    >
                      <CardContent className="p-4">
                        <div className="flex gap-4">
                          <div className="flex-shrink-0">
                            <div className="w-10 h-10 rounded-full bg-purple-100 dark:bg-purple-900/20 flex items-center justify-center text-purple-600 dark:text-purple-400">
                              {notification.icon || getNotificationIcon(notification.type)}
                            </div>
                          </div>
                          
                          <div className="flex-grow min-w-0">
                            <div className="flex items-start justify-between gap-2">
                              <h4 className="text-base font-medium text-gray-900 dark:text-gray-100">
                                {notification.title}
                              </h4>
                              <div className="flex items-center gap-1 flex-shrink-0">
                                <Button 
                                  variant="ghost" 
                                  size="icon" 
                                  className="h-8 w-8 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300"
                                  onClick={() => handleToggleRead(notification.id)}
                                >
                                  {notification.read ? (
                                    <Mail className="h-4 w-4" />
                                  ) : (
                                    <Check className="h-4 w-4" />
                                  )}
                                </Button>
                                
                                <Button 
                                  variant="ghost" 
                                  size="icon" 
                                  className="h-8 w-8 text-gray-500 hover:text-red-600 dark:text-gray-400 dark:hover:text-red-400"
                                  onClick={() => handleDelete(notification.id)}
                                >
                                  <Trash className="h-4 w-4" />
                                </Button>
                              </div>
                            </div>
                            
                            <p className="text-sm text-gray-600 dark:text-gray-300 mt-1 line-clamp-2">
                              {notification.message}
                            </p>
                            
                            <div className="flex items-center justify-between mt-2">
                              <div className="flex items-center text-xs text-gray-500 dark:text-gray-400">
                                <Clock className="h-3 w-3 mr-1" />
                                {formatRelativeTime(notification.createdAt)}
                              </div>
                              
                              <a 
                                href={notification.actionUrl} 
                                className="text-xs font-medium text-purple-600 hover:text-purple-700 dark:text-purple-400 dark:hover:text-purple-300 flex items-center"
                              >
                                Chi tiết
                                <ExternalLink className="h-3 w-3 ml-1" />
                              </a>
                            </div>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              ) : (
                <div className="text-center py-12">
                  <BellRing className="h-12 w-12 mx-auto text-gray-300 dark:text-gray-600 mb-4" />
                  <h3 className="text-lg font-medium text-gray-900 dark:text-gray-200">Không có thông báo</h3>
                  <p className="text-gray-500 dark:text-gray-400 max-w-md mx-auto mt-2">
                    {activeTab === "all" 
                      ? "Bạn chưa có thông báo nào. Thông báo mới sẽ xuất hiện ở đây."
                      : activeTab === "unread" 
                        ? "Bạn đã đọc tất cả các thông báo."
                        : `Bạn không có thông báo nào thuộc danh mục ${activeTab === "system" ? "hệ thống" : "khóa học"}.`
                    }
                  </p>
                </div>
              )}
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
      
      <Card className="overflow-hidden border-gray-200 dark:border-gray-700/50 shadow-md dark:shadow-lg dark:shadow-purple-900/5">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <div>
            <CardTitle className="text-xl font-semibold">Cài đặt thông báo</CardTitle>
            <CardDescription>Tùy chỉnh loại thông báo bạn muốn nhận</CardDescription>
          </div>
          <Settings className="h-5 w-5 text-gray-500 dark:text-gray-400" />
        </CardHeader>
        
        <CardContent>
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <h4 className="text-base font-medium text-gray-900 dark:text-gray-100">
                  Delivery Methods
                </h4>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  Customize how and when you receive notifications
                </p>
              </div>
              
              <Switch 
                checked={notificationSettings.email.courseUpdates} 
                onCheckedChange={(checked) => handleToggleSetting("email.courseUpdates")}
                className="data-[state=checked]:bg-purple-600 dark:data-[state=checked]:bg-purple-500"
              />
            </div>
            
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <h4 className="text-base font-medium text-gray-900 dark:text-gray-100">
                  Push Notifications
                </h4>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  Enable push notifications for real-time updates
                </p>
              </div>
              
              <Switch 
                checked={notificationSettings.push.courseUpdates} 
                onCheckedChange={(checked) => handleToggleSetting("push.courseUpdates")}
                className="data-[state=checked]:bg-purple-600 dark:data-[state=checked]:bg-purple-500"
              />
            </div>
          </div>
          
          <Separator className="my-4 bg-gray-200 dark:bg-gray-700/70" />
          
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <h4 className="text-base font-medium text-gray-900 dark:text-gray-100">
                  Notification Types
                </h4>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  Choose the types of notifications you want to receive
                </p>
              </div>
            </div>
            
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="flex items-center space-x-2">
                <Checkbox 
                  id="course-updates" 
                  checked={notificationSettings.email.courseUpdates}
                  onCheckedChange={(checked) => handleToggleSetting("email.courseUpdates")}
                />
                <Label htmlFor="course-updates" className="font-normal">
                  Course updates and announcements
                </Label>
              </div>
              <div className="flex items-center space-x-2">
                <Checkbox 
                  id="messages" 
                  checked={notificationSettings.email.messages}
                  onCheckedChange={(checked) => handleToggleSetting("email.messages")}
                />
                <Label htmlFor="messages" className="font-normal">
                  Direct messages and comments
                </Label>
              </div>
              <div className="flex items-center space-x-2">
                <Checkbox 
                  id="reminders" 
                  checked={notificationSettings.email.reminders}
                  onCheckedChange={(checked) => handleToggleSetting("email.reminders")}
                />
                <Label htmlFor="reminders" className="font-normal">
                  Reminders and scheduled events
                </Label>
              </div>
              <div className="flex items-center space-x-2">
                <Checkbox 
                  id="marketing" 
                  checked={notificationSettings.email.promotions}
                  onCheckedChange={(checked) => handleToggleSetting("email.promotions")}
                />
                <Label htmlFor="marketing" className="font-normal">
                  Promotions and marketing
                </Label>
              </div>
            </div>
          </div>
        </CardContent>
        
        <CardFooter className="border-t border-gray-200 dark:border-gray-700/50 bg-gray-50 dark:bg-gray-800/20 px-6 py-4">
          <Button 
            className="bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 dark:from-purple-500 dark:to-indigo-500"
            onClick={() => {
              toast({
                title: "Đã lưu cài đặt",
                description: "Cài đặt thông báo của bạn đã được lưu thành công.",
                duration: 3000
              });
            }}
          >
            Lưu cài đặt
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
} 