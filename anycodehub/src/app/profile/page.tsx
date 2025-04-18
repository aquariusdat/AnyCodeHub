"use client";

import { useEffect, useState } from 'react';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import * as z from 'zod';
import { toast } from 'react-hot-toast';
import { useRouter } from 'next/navigation';
import { 
  User, 
  KeyIcon, 
  Save, 
  X, 
  Upload, 
  Edit2, 
  Calendar, 
  Mail, 
  Phone
} from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { apiService } from '@/services/api.service';
import { useAuthStore } from '@/stores/auth.store';

const profileSchema = z.object({
  firstName: z.string().min(1, "Tên không được để trống"),
  lastName: z.string().min(1, "Họ không được để trống"),
  email: z.string().email("Email không hợp lệ"),
  phoneNumber: z.string().min(1, "Số điện thoại không được để trống"),
  birthOfDate: z.string().min(1, "Ngày sinh không được để trống"),
});

type ProfileFormValues = z.infer<typeof profileSchema>;

export default function ProfilePage() {
  const router = useRouter();
  const getUser = useAuthStore((state) => state.getUser);
  const isGoogleAccount = useAuthStore((state) => state.isGoogleAccount);
  const user = getUser();
  const [isLoading, setIsLoading] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [avatarFile, setAvatarFile] = useState<File | null>(null);
  const [avatarPreview, setAvatarPreview] = useState<string>("");
  
  const form = useForm<ProfileFormValues>({
    resolver: zodResolver(profileSchema),
    defaultValues: {
      firstName: user?.firstName || "",
      lastName: user?.lastName || "",
      email: user?.email || "",
      phoneNumber: user?.phoneNumber || "",
      birthOfDate: user?.birthOfDate || "",
    },
  });

  // Reset form when user data changes
  useEffect(() => {
    if (user) {
      form.reset({
        firstName: user.firstName || "",
        lastName: user.lastName || "",
        email: user.email || "",
        phoneNumber: user.phoneNumber || "",
        birthOfDate: user.birthOfDate || "",
      });
    }
  }, [user, form]);

  // Handle avatar change
  const handleAvatarChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setAvatarFile(file);
      const previewUrl = URL.createObjectURL(file);
      setAvatarPreview(previewUrl);
    }
  };

  // Upload avatar
  const uploadAvatar = async () => {
    if (!avatarFile || !user) return;
    
    setIsLoading(true);
    
    try {
      // Create form data for file upload
      const formData = new FormData();
      formData.append('file', avatarFile);
      formData.append('userId', user.id);
      
      const response = await apiService.post(
        '/User/UploadAvatar',
        formData,
        { 'Content-Type': 'multipart/form-data' },
        true
      );
      
      if (response.isSuccess) {
        toast.success('Cập nhật ảnh đại diện thành công!');
        // Optionally update user store with new avatar URL if returned
      } else {
        toast.error(response.error?.message || 'Không thể cập nhật ảnh đại diện');
      }
    } catch (error) {
      toast.error('Đã xảy ra lỗi khi tải lên ảnh đại diện');
    } finally {
      setIsLoading(false);
    }
  };

  // Handle profile update
  const onSubmit = async (data: ProfileFormValues) => {
    if (!user) {
      toast.error("Bạn cần đăng nhập để cập nhật hồ sơ.");
      return;
    }

    setIsLoading(true);
    
    try {
      const response = await apiService.post('/User/UpdateProfile', {
        userId: user.id,
        firstName: data.firstName,
        lastName: data.lastName,
        phoneNumber: data.phoneNumber,
        birthOfDate: data.birthOfDate,
        // Email is typically not updated directly
      }, {}, true);

      if (response.isSuccess) {
        toast.success('Cập nhật thông tin thành công!');
        setIsEditing(false);
        
        // Handle user state update
        // For now we'll just assume we'd need to refresh the user data
        // This depends on how your auth store handles updates
      } else {
        toast.error(response.error?.message || 'Cập nhật thất bại.');
      }
    } catch (error) {
      console.error("Submit error:", error);
      toast.error('Đã xảy ra lỗi. Vui lòng thử lại.');
    } finally {
      setIsLoading(false);
    }
  };

  // Handle cancel changes
  const handleCancel = () => {
    setIsEditing(false);
    form.reset({
      firstName: user?.firstName || "",
      lastName: user?.lastName || "",
      email: user?.email || "",
      phoneNumber: user?.phoneNumber || "",
      birthOfDate: user?.birthOfDate || "",
    });
    
    // Reset avatar preview if user cancels
    if (avatarPreview && !avatarFile) {
      setAvatarPreview("");
    }
  };

  if (!user) {
    return (
      <div className="container max-w-5xl mx-auto py-10 px-4">
        <Card className="border-none shadow-lg p-8 text-center">
          <CardTitle className="text-2xl mb-4">Bạn chưa đăng nhập</CardTitle>
          <CardDescription className="mb-6">Vui lòng đăng nhập để xem trang hồ sơ của bạn.</CardDescription>
          <Button onClick={() => router.push('/auth?mode=signin')}>
            Đăng nhập
          </Button>
        </Card>
      </div>
    );
  }

  return (
    <div className="container max-w-5xl mx-auto py-10 px-4">
      {/* Header with Gradient */}
      <div className="bg-gradient-to-r from-purple-700 to-indigo-700 rounded-xl p-6 mb-8 shadow-lg">
        <h1 className="text-2xl md:text-3xl font-bold text-white flex items-center gap-3">
          <User className="h-6 w-6" />
          Hồ Sơ Cá Nhân
        </h1>
        <p className="text-purple-100 mt-2">
          Quản lý thông tin cá nhân và thiết lập tài khoản của bạn
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {/* Left Column - Avatar and Quick Actions */}
        <div className="md:col-span-1">
          <Card className="border-none shadow-lg overflow-hidden">
            <CardHeader className="bg-purple-50 pb-0">
              <CardTitle className="text-xl text-purple-700">Ảnh Đại Diện</CardTitle>
            </CardHeader>
            <CardContent className="p-6 flex flex-col items-center justify-center">
              <div className="relative mb-4 group">
                <div className="w-40 h-40 rounded-full overflow-hidden border-4 border-purple-100">
                  {avatarPreview ? (
                    <Image
                      src={avatarPreview}
                      alt="Avatar Preview"
                      width={160}
                      height={160}
                      className="object-cover w-full h-full"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center bg-purple-100 text-purple-500 text-4xl font-bold">
                      {user.firstName?.[0]}{user.lastName?.[0]}
                    </div>
                  )}
                  <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-full">
                    <label htmlFor="avatar-upload" className="cursor-pointer">
                      <Upload className="h-8 w-8 text-white" />
                    </label>
                    <input 
                      id="avatar-upload" 
                      type="file" 
                      accept="image/*" 
                      className="hidden" 
                      onChange={handleAvatarChange}
                    />
                  </div>
                </div>
                {avatarFile && (
                  <div className="mt-4 flex gap-2 justify-center">
                    <Button
                      onClick={uploadAvatar}
                      className="bg-purple-600 hover:bg-purple-700"
                      disabled={isLoading}
                      size="sm"
                    >
                      {isLoading ? 'Đang tải...' : 'Lưu ảnh mới'}
                    </Button>
                    <Button
                      onClick={() => {
                        setAvatarFile(null);
                        setAvatarPreview("");
                      }}
                      variant="outline"
                      size="sm"
                    >
                      Hủy
                    </Button>
                  </div>
                )}
              </div>
              
              <div className="text-center mb-4">
                <h3 className="font-semibold text-lg">{user.firstName} {user.lastName}</h3>
                <p className="text-gray-500 text-sm">{user.email}</p>
              </div>
              
              <div className="w-full mt-2 space-y-2">
                <Link href="/account/change-password">
                  <Button
                    variant="outline"
                    className="w-full flex items-center gap-2 border-purple-200 hover:bg-purple-50"
                  >
                    <KeyIcon className="h-4 w-4" />
                    Đổi Mật Khẩu
                  </Button>
                </Link>
              </div>
            </CardContent>
          </Card>

          <Card className="border-none shadow-lg overflow-hidden mt-6">
            <CardHeader className="bg-purple-50">
              <CardTitle className="text-xl text-purple-700">Tài Khoản</CardTitle>
            </CardHeader>
            <CardContent className="p-6">
              <div className="space-y-4">
                <div>
                  <p className="text-sm text-gray-500">Loại tài khoản</p>
                  <p className="font-medium">{isGoogleAccount ? 'Google' : 'Thông thường'}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Ngày tạo</p>
                  <p className="font-medium">{user.createdAt ? new Date(user.createdAt).toLocaleDateString('vi-VN') : 'N/A'}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Right Column - Profile Info and Edit Form */}
        <div className="md:col-span-2">
          <Card className="border-none shadow-lg">
            <CardHeader className="bg-purple-50 flex flex-row items-center justify-between">
              <div>
                <CardTitle className="text-xl text-purple-700">Thông Tin Cá Nhân</CardTitle>
                <CardDescription>Quản lý thông tin hồ sơ của bạn</CardDescription>
              </div>
              {!isEditing ? (
                <Button 
                  onClick={() => setIsEditing(true)}
                  variant="outline"
                  className="border-purple-200 hover:bg-purple-50"
                >
                  <Edit2 className="h-4 w-4 mr-2" />
                  Chỉnh sửa
                </Button>
              ) : null}
            </CardHeader>
            <CardContent className="p-6">
              <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <FormField
                      control={form.control}
                      name="firstName"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-gray-700 font-medium">Tên</FormLabel>
                          <FormControl>
                            <Input
                              placeholder="Tên"
                              className="border-purple-100 focus:border-purple-300"
                              disabled={!isEditing}
                              {...field}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    <FormField
                      control={form.control}
                      name="lastName"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-gray-700 font-medium">Họ</FormLabel>
                          <FormControl>
                            <Input
                              placeholder="Họ"
                              className="border-purple-100 focus:border-purple-300"
                              disabled={!isEditing}
                              {...field}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

                  <FormField
                    control={form.control}
                    name="email"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-gray-700 font-medium">Email</FormLabel>
                        <div className="relative">
                          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                            <Mail className="h-4 w-4 text-gray-400" />
                          </div>
                          <FormControl>
                            <Input
                              placeholder="Email"
                              className="pl-10 border-purple-100 focus:border-purple-300"
                              disabled={true} // Email typically can't be changed
                              {...field}
                            />
                          </FormControl>
                        </div>
                        <FormDescription className="text-gray-500 text-xs">
                          Email không thể thay đổi
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="phoneNumber"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-gray-700 font-medium">Số điện thoại</FormLabel>
                        <div className="relative">
                          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                            <Phone className="h-4 w-4 text-gray-400" />
                          </div>
                          <FormControl>
                            <Input
                              placeholder="Số điện thoại"
                              className="pl-10 border-purple-100 focus:border-purple-300"
                              disabled={!isEditing}
                              {...field}
                            />
                          </FormControl>
                        </div>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="birthOfDate"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-gray-700 font-medium">Ngày sinh</FormLabel>
                        <div className="relative">
                          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                            <Calendar className="h-4 w-4 text-gray-400" />
                          </div>
                          <FormControl>
                            <Input
                              type="date"
                              className="pl-10 border-purple-100 focus:border-purple-300"
                              disabled={!isEditing}
                              {...field}
                            />
                          </FormControl>
                        </div>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  {isEditing && (
                    <div className="flex justify-end space-x-3 pt-4">
                      <Button
                        type="button"
                        variant="outline"
                        onClick={handleCancel}
                        className="border-gray-200 hover:bg-gray-50"
                      >
                        <X className="h-4 w-4 mr-2" />
                        Hủy
                      </Button>
                      <Button 
                        type="submit" 
                        className="bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700"
                        disabled={isLoading}
                      >
                        <Save className="h-4 w-4 mr-2" />
                        {isLoading ? 'Đang xử lý...' : 'Lưu thay đổi'}
                      </Button>
                    </div>
                  )}
                </form>
              </Form>
            </CardContent>
          </Card>
          
          {/* Activity Section - Could be expanded in the future */}
          <Card className="border-none shadow-lg mt-6">
            <CardHeader className="bg-purple-50">
              <CardTitle className="text-xl text-purple-700">Hoạt Động Gần Đây</CardTitle>
              <CardDescription>Lịch sử học tập và hoạt động của bạn</CardDescription>
            </CardHeader>
            <CardContent className="p-6">
              <div className="text-center py-8 text-gray-500">
                <p>Chưa có hoạt động nào gần đây</p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
} 