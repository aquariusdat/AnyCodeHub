"use client";

import React, { useState } from "react";
import { User, Mail, Phone, MapPin, Calendar, Pencil, Save, X, Camera, Check, Link as LinkIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Separator } from "@/components/ui/separator";
import { useAuthStore } from "@/stores/auth.store";
import { useToast } from "@/components/ui/use-toast";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import Link from "next/link";

const profileFormSchema = z.object({
  firstName: z.string().min(2, {
    message: "First name must be at least 2 characters.",
  }),
  lastName: z.string().min(2, {
    message: "Last name must be at least 2 characters.",
  }),
  email: z.string().email({
    message: "Please enter a valid email address.",
  }),
  phoneNumber: z.string().optional(),
  birthOfDate: z.string().optional(),
  bio: z.string().max(500, {
    message: "Bio must not be longer than 500 characters.",
  }).optional(),
  urls: z.object({
    website: z.string().url({ message: "Please enter a valid URL." }).optional().or(z.literal("")),
    linkedin: z.string().url({ message: "Please enter a valid URL." }).optional().or(z.literal("")),
    github: z.string().url({ message: "Please enter a valid URL." }).optional().or(z.literal("")),
  }),
  profession: z.string().min(1, {
    message: "Please select your profession.",
  }),
});

const securityFormSchema = z.object({
  twoFactorAuth: z.boolean().optional(),
  sessionTimeout: z.string(),
});

type ProfileFormValues = z.infer<typeof profileFormSchema>;
type SecurityFormValues = z.infer<typeof securityFormSchema>;

// Mock user data based on the actual User interface
const mockUserData = {
  firstName: "Nguyễn",
  lastName: "Văn A", 
  email: "nguyenvana@example.com",
  phoneNumber: "+84 123 456 789",
  birthOfDate: "1990-01-15",
  address: "123 Đường Nguyễn Huệ, Quận 1, TP.HCM",
  bio: "Tôi là một lập trình viên với hơn 5 năm kinh nghiệm trong phát triển web. Chuyên về React, Next.js và Node.js.",
  occupation: "Software Developer",
  company: "Tech Solutions Inc.",
  website: "https://example.com",
  joinedDate: "2023-05-10",
  socialLinks: {
    facebook: "https://facebook.com/nguyenvana",
    twitter: "https://twitter.com/nguyenvana",
    linkedin: "https://linkedin.com/in/nguyenvana",
    github: "https://github.com/nguyenvana"
  },
  preferences: {
    emailNotifications: true,
    marketingEmails: false,
    courseUpdates: true,
    twoFactorAuth: false,
    darkMode: true
  },
  achievementBadges: [
    { id: 1, name: "Early Adopter", description: "Joined during platform launch", icon: "🏆" },
    { id: 2, name: "Course Creator", description: "Published first course", icon: "📚" },
    { id: 3, name: "Fast Learner", description: "Completed 5 courses", icon: "🚀" }
  ]
};

// Add this type extension to handle possible missing User properties
type ExtendedUser = {
  preferences?: {
    twoFactorAuth?: boolean;
    emailNotifications?: boolean;
    marketingEmails?: boolean;
    courseUpdates?: boolean;
    darkMode?: boolean;
  };
  socialLinks?: {
    facebook?: string;
    twitter?: string;
    linkedin?: string;
    github?: string;
  };
  bio?: string;
  website?: string;
  occupation?: string;
  company?: string;
};

// Define a utility function to safely access user data with fallbacks
function getUserDisplayName(user: any) {
  if (user && user.firstName && user.lastName) {
    return `${user.firstName} ${user.lastName}`;
  }
  return "User";
}

function getUserInitials(user: any) {
  if (user && user.firstName && user.lastName) {
    return `${user.firstName.charAt(0)}${user.lastName.charAt(0)}`;
  }
  return "U";
}

// Add a safe date formatting function
function formatDate(dateString: string | undefined | null): string {
  if (!dateString) return "Unknown date";
  try {
    return new Date(dateString).toLocaleDateString('vi-VN');
  } catch (error) {
    return "Invalid date";
  }
}

// Add the hasAvatar helper
function hasAvatar(user: any): boolean {
  // In real implementation, check if user has avatar URL
  // This is a mock check - replace with actual logic
  return false; // For testing - assume no avatar
}

// Update the AvatarUploadOverlay component
function AvatarUploadOverlay({ onClick, isUpdate = true }: { onClick: () => void, isUpdate?: boolean }) {
  return (
    <div 
      className="absolute inset-0 flex flex-col items-center justify-center rounded-full bg-black/50 opacity-0 group-hover:opacity-100 transition-all duration-200 cursor-pointer"
      onClick={onClick}
    >
      <Camera className="h-6 w-6 text-white mb-1" />
      <p className="text-white text-xs font-medium">
        {isUpdate ? "Cập nhật" : "Thêm"} ảnh
      </p>
    </div>
  );
}

export default function ProfilePage() {
  const getUser = useAuthStore((state) => state.getUser);
  const user = getUser();
  const { toast } = useToast();
  
  // Cast user to include the extended properties
  const extendedUser = user as unknown as ExtendedUser;
  
  const [isEditing, setIsEditing] = useState(false);
  const [profileData, setProfileData] = useState(
    user ? {
      ...mockUserData,
      firstName: user.firstName,
      lastName: user.lastName,
      email: user.email,
      phoneNumber: user.phoneNumber || "",
      birthOfDate: user.birthOfDate || "",
    } : mockUserData
  );
  const [activeTab, setActiveTab] = useState<string>("personal");
  const [isLoading, setIsLoading] = useState(false);
  const [isAvatarUploading, setIsAvatarUploading] = useState(false);

  if (!user) {
    return null;
  }

  // Profile form
  const profileForm = useForm<ProfileFormValues>({
    resolver: zodResolver(profileFormSchema),
    defaultValues: {
      firstName: user.firstName,
      lastName: user.lastName,
      email: user.email,
      phoneNumber: user.phoneNumber || "",
      birthOfDate: user.birthOfDate || "",
      bio: profileData.bio,
      urls: {
        website: profileData.website,
        linkedin: profileData.socialLinks.linkedin,
        github: profileData.socialLinks.github,
      },
      profession: profileData.occupation,
    },
  });

  // Security form
  const securityForm = useForm<SecurityFormValues>({
    resolver: zodResolver(securityFormSchema),
    defaultValues: {
      twoFactorAuth: profileData.preferences.twoFactorAuth,
      sessionTimeout: "30min",
    },
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setProfileData(prev => ({
      ...prev,
      [name]: value
    }));
    profileForm.reset({
      [name]: value
    });
  };

  const handleSwitchChange = (name: string, checked: boolean) => {
    setProfileData(prev => ({
      ...prev,
      preferences: {
        ...prev.preferences,
        [name]: checked
      }
    }));
  };

  const handleSaveProfile = async () => {
    setIsLoading(true);
    
    try {
      // Mock API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      toast({
        title: "Success",
        description: "Hồ sơ đã được cập nhật thành công"
      });
      console.log("Profile data:", profileData);
      
      // Turn off editing mode after successful save
      setIsEditing(false);
    } catch (error) {
      toast({
        title: "Error",
        description: "Không thể cập nhật hồ sơ. Vui lòng thử lại.",
        variant: "destructive"
      });
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  function handleAvatarUpload() {
    setIsAvatarUploading(true);
    // Simulate upload delay
    setTimeout(() => {
      setIsAvatarUploading(false);
      toast({
        title: "Avatar updated",
        description: "Your profile picture has been updated successfully.",
      });
    }, 1500);
  }

  function onProfileSubmit(data: ProfileFormValues) {
    console.log("Profile form submitted:", data);
    // Handle form submission here
    handleSaveProfile();
  }

  return (
    <div className="space-y-6">
      <Card className="overflow-hidden border-gray-200 dark:border-gray-700/50 shadow-md dark:shadow-lg dark:shadow-purple-900/5">
        <div className="h-2 bg-gradient-to-r from-purple-600 to-indigo-600 dark:from-purple-500 dark:to-indigo-500"></div>
        <CardHeader className="relative pb-0">
          <div className="absolute right-6 top-6">
            <Button 
              variant="outline" 
              size="sm" 
              onClick={() => setIsEditing(!isEditing)}
              className="h-9 border-gray-200 dark:border-gray-700"
            >
              {isEditing ? (
                <>
                  <X className="h-4 w-4 mr-1" />
                  Hủy chỉnh sửa
                </>
              ) : (
                <>
                  <Pencil className="h-4 w-4 mr-1" />
                  Chỉnh sửa hồ sơ
                </>
              )}
            </Button>
          </div>
          
          <div className="flex flex-col items-center">
            <div className="relative group w-[120px] h-[120px]">
              <div className="relative w-full h-full">
                <Avatar className="w-full h-full border-4 border-white dark:border-gray-800 shadow-lg ring-2 ring-purple-500/20">
                  {hasAvatar(user) ? (
                    <AvatarImage 
                      src="https://github.com/shadcn.png" 
                      alt={getUserDisplayName(user)} 
                      className="object-cover"
                    />
                  ) : null}
                  <AvatarFallback className="bg-gradient-to-br from-purple-500 to-indigo-600 text-white text-2xl font-semibold">
                    {getUserInitials(user)}
                  </AvatarFallback>
                </Avatar>
                
                {isEditing && !isAvatarUploading && (
                  <>
                    <AvatarUploadOverlay 
                      onClick={() => document.getElementById('avatar-upload')?.click()} 
                      isUpdate={hasAvatar(user)}
                    />
                    <input 
                      id="avatar-upload"
                      type="file" 
                      className="hidden"
                      accept="image/*"
                      onChange={() => handleAvatarUpload()}
                    />
                  </>
                )}
                
                {isEditing && isAvatarUploading && (
                  <div className="absolute inset-0 flex items-center justify-center rounded-full bg-black/50">
                    <div className="h-8 w-8 animate-spin rounded-full border-3 border-white border-t-transparent" />
                  </div>
                )}
                
                {!isEditing && (
                  <div className="absolute bottom-1 right-1 w-5 h-5 bg-green-500 rounded-full border-2 border-white"></div>
                )}
              </div>
              
              {!isEditing && (
                <div className="absolute -bottom-7 left-1/2 -translate-x-1/2 text-xs text-center font-medium text-purple-600 dark:text-purple-400 w-full">
                  <span className="px-2 py-0.5 bg-purple-100 dark:bg-purple-900/30 rounded-full">Online</span>
                </div>
              )}
            </div>
            
            <div className="mt-9 text-center">
              <CardTitle className="text-2xl font-bold">
                {getUserDisplayName(user)}
              </CardTitle>
              <CardDescription className="text-gray-500 dark:text-gray-400 mt-1">
                {profileData.occupation} tại {profileData.company}
              </CardDescription>
              
              <div className="flex flex-wrap justify-center gap-2 mt-3">
                {profileData.achievementBadges.map(badge => (
                  <Badge 
                    key={badge.id} 
                    className="bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-300"
                  >
                    {badge.icon} {badge.name}
                  </Badge>
                ))}
              </div>
            </div>
          </div>
        </CardHeader>
        
        <CardContent className="mt-6">
          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            <TabsList className="mb-4 bg-gray-100 dark:bg-gray-800/70">
              <TabsTrigger 
                value="personal"
                className="data-[state=active]:bg-white dark:data-[state=active]:bg-gray-700/50"
              >
                Thông tin cá nhân
              </TabsTrigger>
              <TabsTrigger 
                value="security"
                className="data-[state=active]:bg-white dark:data-[state=active]:bg-gray-700/50"
              >
                Bảo mật & Quyền riêng tư
              </TabsTrigger>
              <TabsTrigger 
                value="social"
                className="data-[state=active]:bg-white dark:data-[state=active]:bg-gray-700/50"
              >
                Mạng xã hội
              </TabsTrigger>
            </TabsList>
            
            <TabsContent value="personal" className="mt-0 space-y-4">
              <Form {...profileForm}>
                <form onSubmit={profileForm.handleSubmit(onProfileSubmit)} className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <Label className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-1 block">
                        Họ
                      </Label>
                      {isEditing ? (
                        <FormField
                          control={profileForm.control}
                          name="lastName"
                          render={({ field }) => (
                            <FormItem>
                              <FormControl>
                                <Input 
                                  {...field}
                                  className="border-gray-300 dark:border-gray-700"
                                />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      ) : (
                        <div className="flex items-center gap-2 py-2">
                          <User className="h-4 w-4 text-gray-500 dark:text-gray-400" />
                          <span className="text-gray-900 dark:text-gray-100">{user.lastName}</span>
                        </div>
                      )}
                    </div>
                    
                    <div>
                      <Label className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-1 block">
                        Tên
                      </Label>
                      {isEditing ? (
                        <FormField
                          control={profileForm.control}
                          name="firstName"
                          render={({ field }) => (
                            <FormItem>
                              <FormControl>
                                <Input 
                                  {...field}
                                  className="border-gray-300 dark:border-gray-700"
                                />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      ) : (
                        <div className="flex items-center gap-2 py-2">
                          <User className="h-4 w-4 text-gray-500 dark:text-gray-400" />
                          <span className="text-gray-900 dark:text-gray-100">{user.firstName}</span>
                        </div>
                      )}
                    </div>
                    
                    <div>
                      <Label className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-1 block">
                        Email
                      </Label>
                      {isEditing ? (
                        <FormField
                          control={profileForm.control}
                          name="email"
                          render={({ field }) => (
                            <FormItem>
                              <FormControl>
                                <Input 
                                  {...field}
                                  className="border-gray-300 dark:border-gray-700"
                                />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      ) : (
                        <div className="flex items-center gap-2 py-2">
                          <Mail className="h-4 w-4 text-gray-500 dark:text-gray-400" />
                          <span className="text-gray-900 dark:text-gray-100">{user.email}</span>
                        </div>
                      )}
                    </div>
                    
                    <div>
                      <Label className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-1 block">
                        Số điện thoại
                      </Label>
                      {isEditing ? (
                        <FormField
                          control={profileForm.control}
                          name="phoneNumber"
                          render={({ field }) => (
                            <FormItem>
                              <FormControl>
                                <Input 
                                  {...field}
                                  className="border-gray-300 dark:border-gray-700"
                                />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      ) : (
                        <div className="flex items-center gap-2 py-2">
                          <Phone className="h-4 w-4 text-gray-500 dark:text-gray-400" />
                          <span className="text-gray-900 dark:text-gray-100">{user.phoneNumber || "Chưa cập nhật"}</span>
                        </div>
                      )}
                    </div>

                    <div>
                      <Label className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-1 block">
                        Ngày sinh
                      </Label>
                      {isEditing ? (
                        <FormField
                          control={profileForm.control}
                          name="birthOfDate"
                          render={({ field }) => (
                            <FormItem>
                              <FormControl>
                                <Input 
                                  {...field}
                                  type="date"
                                  className="border-gray-300 dark:border-gray-700"
                                />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      ) : (
                        <div className="flex items-center gap-2 py-2">
                          <Calendar className="h-4 w-4 text-gray-500 dark:text-gray-400" />
                          <span className="text-gray-900 dark:text-gray-100">
                            {formatDate(user.birthOfDate)}
                          </span>
                        </div>
                      )}
                    </div>
                    
                    <div>
                      <Label className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-1 block">
                        Nghề nghiệp
                      </Label>
                      {isEditing ? (
                        <FormField
                          control={profileForm.control}
                          name="profession"
                          render={({ field }) => (
                            <FormItem>
                              <FormControl>
                                <Input 
                                  {...field}
                                  className="border-gray-300 dark:border-gray-700"
                                />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      ) : (
                        <div className="flex items-center gap-2 py-2">
                          <User className="h-4 w-4 text-gray-500 dark:text-gray-400" />
                          <span className="text-gray-900 dark:text-gray-100">{profileData.occupation}</span>
                        </div>
                      )}
                    </div>
                    
                    <div>
                      <Label className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-1 block">
                        Công ty
                      </Label>
                      {isEditing ? (
                        <Input 
                          name="company" 
                          value={profileData.company} 
                          onChange={handleInputChange} 
                          className="border-gray-300 dark:border-gray-700"
                        />
                      ) : (
                        <div className="flex items-center gap-2 py-2">
                          <User className="h-4 w-4 text-gray-500 dark:text-gray-400" />
                          <span className="text-gray-900 dark:text-gray-100">{profileData.company}</span>
                        </div>
                      )}
                    </div>
                    
                    <div>
                      <Label className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-1 block">
                        Website
                      </Label>
                      {isEditing ? (
                        <FormField
                          control={profileForm.control}
                          name="urls.website"
                          render={({ field }) => (
                            <FormItem>
                              <FormControl>
                                <Input 
                                  {...field}
                                  className="border-gray-300 dark:border-gray-700"
                                />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      ) : (
                        <div className="flex items-center gap-2 py-2">
                          <LinkIcon className="h-4 w-4 text-gray-500 dark:text-gray-400" />
                          <a 
                            href={profileData.website} 
                            target="_blank" 
                            rel="noopener noreferrer"
                            className="text-purple-600 dark:text-purple-400 hover:underline"
                          >
                            {profileData.website}
                          </a>
                        </div>
                      )}
                    </div>
                  </div>
                  
                  <Separator className="my-4" />
                  
                  <div>
                    <Label className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-1 block">
                      Giới thiệu bản thân
                    </Label>
                    {isEditing ? (
                      <FormField
                        control={profileForm.control}
                        name="bio"
                        render={({ field }) => (
                          <FormItem>
                            <FormControl>
                              <Textarea 
                                {...field}
                                className="border-gray-300 dark:border-gray-700 min-h-[120px]"
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    ) : (
                      <div className="py-2">
                        <p className="text-gray-700 dark:text-gray-300 whitespace-pre-wrap">
                          {profileData.bio}
                        </p>
                      </div>
                    )}
                  </div>
                  
                  <div className="mt-4 pt-4 border-t border-gray-200 dark:border-gray-700">
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                      Thành viên từ {formatDate(user.createdAt || profileData.joinedDate)}
                    </p>
                  </div>
                </form>
              </Form>
            </TabsContent>
            
            <TabsContent value="security" className="mt-0 space-y-6">
              <Card className="border-gray-200 dark:border-gray-700/50">
                <CardHeader className="pb-2">
                  <CardTitle className="text-lg">Cài đặt thông báo</CardTitle>
                  <CardDescription>
                    Quản lý các thông báo và email bạn nhận được từ chúng tôi
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <Label className="text-base">Thông báo qua email</Label>
                        <p className="text-sm text-gray-500 dark:text-gray-400">
                          Nhận thông báo về hoạt động tài khoản qua email
                        </p>
                      </div>
                      <Switch 
                        checked={profileData.preferences.emailNotifications}
                        onCheckedChange={(checked) => handleSwitchChange('emailNotifications', checked)}
                      />
                    </div>
                    
                    <Separator />
                    
                    <div className="flex items-center justify-between">
                      <div>
                        <Label className="text-base">Email tiếp thị</Label>
                        <p className="text-sm text-gray-500 dark:text-gray-400">
                          Nhận thông tin về các chương trình khuyến mãi và tin tức
                        </p>
                      </div>
                      <Switch 
                        checked={profileData.preferences.marketingEmails}
                        onCheckedChange={(checked) => handleSwitchChange('marketingEmails', checked)}
                      />
                    </div>
                    
                    <Separator />
                    
                    <div className="flex items-center justify-between">
                      <div>
                        <Label className="text-base">Cập nhật khóa học</Label>
                        <p className="text-sm text-gray-500 dark:text-gray-400">
                          Nhận thông báo khi khóa học của bạn có cập nhật mới
                        </p>
                      </div>
                      <Switch 
                        checked={profileData.preferences.courseUpdates}
                        onCheckedChange={(checked) => handleSwitchChange('courseUpdates', checked)}
                      />
                    </div>
                  </div>
                </CardContent>
              </Card>
              
              <Card className="border-gray-200 dark:border-gray-700/50">
                <CardHeader className="pb-2">
                  <CardTitle className="text-lg">Bảo mật tài khoản</CardTitle>
                  <CardDescription>
                    Quản lý các tùy chọn bảo mật cho tài khoản của bạn
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <Label className="text-base">Xác thực hai yếu tố</Label>
                        <p className="text-sm text-gray-500 dark:text-gray-400">
                          Tăng cường bảo mật với xác thực hai yếu tố
                        </p>
                      </div>
                      <Switch 
                        checked={profileData.preferences.twoFactorAuth}
                        onCheckedChange={(checked) => handleSwitchChange('twoFactorAuth', checked)}
                      />
                    </div>
                    
                    <Separator />
                    
                    <div>
                      <Link href="/account/change-password">
                        <Button 
                          variant="outline" 
                          className="text-red-600 dark:text-red-400 border-red-200 dark:border-red-900/30 hover:bg-red-50 dark:hover:bg-red-900/10 mt-2"
                        >
                          Đổi mật khẩu
                        </Button>
                      </Link>
                    </div>
                    
                    <Separator />
                    
                    <div>
                      <h3 className="text-base font-medium text-gray-900 dark:text-gray-100 mb-1">
                        Xóa tài khoản
                      </h3>
                      <p className="text-sm text-gray-500 dark:text-gray-400 mb-3">
                        Khi bạn xóa tài khoản, tất cả dữ liệu của bạn sẽ bị xóa vĩnh viễn. Hành động này không thể hoàn tác.
                      </p>
                      <Button 
                        variant="outline" 
                        className="text-red-600 dark:text-red-400 border-red-200 dark:border-red-900/30 hover:bg-red-50 dark:hover:bg-red-900/10"
                      >
                        Xóa tài khoản
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
            
            <TabsContent value="social" className="mt-0 space-y-6">
              <Card className="border-gray-200 dark:border-gray-700/50">
                <CardHeader className="pb-2">
                  <CardTitle className="text-lg">Liên kết mạng xã hội</CardTitle>
                  <CardDescription>
                    Kết nối tài khoản của bạn với các mạng xã hội
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {Object.entries(profileData.socialLinks || {}).map(([platform, url]) => (
                      <div key={platform} className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <div className={`p-2 rounded-full 
                            ${platform === 'facebook' ? 'bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400' : ''}
                            ${platform === 'twitter' ? 'bg-sky-100 dark:bg-sky-900/30 text-sky-600 dark:text-sky-400' : ''}
                            ${platform === 'linkedin' ? 'bg-indigo-100 dark:bg-indigo-900/30 text-indigo-600 dark:text-indigo-400' : ''}
                            ${platform === 'github' ? 'bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400' : ''}
                          `}>
                            <User className="h-5 w-5" />
                          </div>
                          <div>
                            <h3 className="font-medium text-gray-900 dark:text-gray-100 capitalize">
                              {platform}
                            </h3>
                            {isEditing ? (
                              <Input 
                                value={url || ""} 
                                onChange={(e) => {
                                  setProfileData(prev => ({
                                    ...prev,
                                    socialLinks: {
                                      ...(prev.socialLinks || {}),
                                      [platform]: e.target.value
                                    }
                                  }));
                                }}
                                className="mt-1 border-gray-300 dark:border-gray-700"
                              />
                            ) : (
                              <a 
                                href={url || "#"} 
                                target="_blank" 
                                rel="noopener noreferrer" 
                                className="text-sm text-purple-600 dark:text-purple-400 hover:underline"
                              >
                                {url || "Not set"}
                              </a>
                            )}
                          </div>
                        </div>
                        
                        {!isEditing && (
                          <Button variant="outline" size="sm" className="h-8 border-gray-200 dark:border-gray-700">
                            Cập nhật
                          </Button>
                        )}
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </CardContent>

        {isEditing && (
          <CardFooter className="flex justify-end gap-2 border-t border-gray-200 dark:border-gray-700 pt-4">
            <Button
              variant="outline"
              className="border-gray-300 dark:border-gray-700"
              onClick={() => {
                setIsEditing(false);
                // Reset form to original values
                profileForm.reset({
                  firstName: user.firstName,
                  lastName: user.lastName,
                  email: user.email,
                  phoneNumber: user.phoneNumber || "",
                  birthOfDate: user.birthOfDate || "",
                  bio: profileData.bio,
                  urls: {
                    website: profileData.website,
                    linkedin: profileData.socialLinks.linkedin,
                    github: profileData.socialLinks.github,
                  },
                  profession: profileData.occupation,
                });
              }}
            >
              <X className="h-4 w-4 mr-1" />
              Hủy
            </Button>
            <Button 
              onClick={handleSaveProfile}
              disabled={isLoading}
              className="bg-gradient-to-r from-purple-600 to-indigo-600 dark:from-purple-500 dark:to-indigo-500"
            >
              {isLoading ? (
                <>
                  <div className="h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent mr-1" />
                  Đang lưu...
                </>
              ) : (
                <>
                  <Save className="h-4 w-4 mr-1" />
                  Lưu thay đổi
                </>
              )}
            </Button>
          </CardFooter>
        )}
      </Card>

      <Card className="space-y-6">
        <CardHeader>
          <CardTitle>Account Status</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center gap-2">
            <Badge className="bg-green-500">
              <Check className="h-3 w-3 mr-1" />
              Active
            </Badge>
            <span className="text-sm text-muted-foreground">Since Jan 2023</span>
          </div>
          <div className="text-sm">
            <div className="flex justify-between py-1">
              <span className="text-muted-foreground">Membership</span>
              <span className="font-medium">Pro Plan</span>
            </div>
            <div className="flex justify-between py-1">
              <span className="text-muted-foreground">Renewal</span>
              <span className="font-medium">March 15, 2024</span>
            </div>
          </div>
        </CardContent>
        <CardFooter>
          <Button variant="outline" className="w-full" size="sm">
            View Plan Details
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
} 