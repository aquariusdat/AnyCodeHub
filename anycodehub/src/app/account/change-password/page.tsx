"use client";

import { useState } from 'react';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import * as z from 'zod';
import { toast } from 'react-hot-toast';
import { useRouter } from 'next/navigation';
import { EyeIcon, EyeOffIcon, KeyIcon, ChevronLeft, ShieldCheckIcon } from 'lucide-react';
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
import { apiService } from '@/services/api.service';
import { useAuthStore } from '@/stores/auth.store';

const passwordSchema = z.object({
  currentPassword: z.string().optional(),
  newPassword: z.string().min(8, {
    message: "Mật khẩu phải có ít nhất 8 ký tự.",
  }),
  confirmPassword: z.string().min(8, {
    message: "Mật khẩu phải có ít nhất 8 ký tự.",
  }),
}).refine((data) => data.newPassword === data.confirmPassword, {
  message: "Mật khẩu xác nhận không khớp.",
  path: ["confirmPassword"],
});

type PasswordFormValues = z.infer<typeof passwordSchema>;

export default function ChangePasswordPage() {
  const router = useRouter();
  const { user, isGoogleAccount } = useAuthStore();
  const [isLoading, setIsLoading] = useState(false);
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const form = useForm<PasswordFormValues>({
    resolver: zodResolver(passwordSchema),
    defaultValues: {
      currentPassword: '',
      newPassword: '',
      confirmPassword: '',
    },
  });

  async function onSubmit(data: PasswordFormValues) {
    if (!user) {
      toast.error("Bạn cần đăng nhập để thay đổi mật khẩu.");
      return;
    }

    setIsLoading(true);
    
    try {
      const response = await apiService.post('/User/ChangePassword', {
        userId: user.id,
        currentPassword: isGoogleAccount ? undefined : data.currentPassword,
        newPassword: data.newPassword,
      }, {}, true);

      if (response.isSuccess) {
        toast.success('Đổi mật khẩu thành công!');
        router.push('/account');
      } else {
        toast.error(response.error?.message || 'Đổi mật khẩu thất bại.');
      }
    } catch (error) {
      console.error("Submit error:", error);
      toast.error('Đã xảy ra lỗi. Vui lòng thử lại.');
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <div className="container max-w-3xl mx-auto py-10 px-4">
      <div className="mb-6">
        <Link 
          href="/account" 
          className="inline-flex items-center gap-2 text-primary hover:text-primary/80 transition-colors"
        >
          <ChevronLeft className="h-4 w-4" />
          <span>Quay lại tài khoản</span>
        </Link>
      </div>
      
      <div className="bg-gradient-to-r from-purple-700 to-indigo-700 rounded-xl p-6 mb-8 shadow-lg">
        <h1 className="text-2xl md:text-3xl font-bold text-white flex items-center gap-3">
          <KeyIcon className="h-6 w-6" />
          {isGoogleAccount ? "Tạo Mật Khẩu Mới" : "Đổi Mật Khẩu"}
        </h1>
        <p className="text-purple-100 mt-2">
          {isGoogleAccount
            ? "Tạo mật khẩu để đăng nhập trực tiếp vào tài khoản của bạn"
            : "Cập nhật mật khẩu để tăng cường bảo mật cho tài khoản"}
        </p>
      </div>

      <div className="relative">
        <div className="absolute top-0 right-0 w-1/3 h-full bg-gradient-to-l from-purple-50 to-transparent opacity-50 pointer-events-none rounded-r-lg"></div>
        
        <Card className="border-none shadow-lg overflow-hidden">
          <CardContent className="p-6 md:p-8">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="md:col-span-2">
                <Form {...form}>
                  <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                    {!isGoogleAccount && (
                      <FormField
                        control={form.control}
                        name="currentPassword"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className="text-gray-700 font-medium">Mật khẩu hiện tại</FormLabel>
                            <div className="relative">
                              <FormControl>
                                <Input
                                  type={showCurrentPassword ? "text" : "password"}
                                  placeholder="Nhập mật khẩu hiện tại của bạn"
                                  className="pr-10 border-purple-100 focus:border-purple-300"
                                  {...field}
                                />
                              </FormControl>
                              <button
                                type="button"
                                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-purple-600 transition-colors"
                                onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                              >
                                {showCurrentPassword ? (
                                  <EyeOffIcon className="h-5 w-5" />
                                ) : (
                                  <EyeIcon className="h-5 w-5" />
                                )}
                              </button>
                            </div>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    )}

                    <FormField
                      control={form.control}
                      name="newPassword"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-gray-700 font-medium">Mật khẩu mới</FormLabel>
                          <div className="relative">
                            <FormControl>
                              <Input
                                type={showNewPassword ? "text" : "password"}
                                placeholder="Nhập mật khẩu mới"
                                className="pr-10 border-purple-100 focus:border-purple-300"
                                {...field}
                              />
                            </FormControl>
                            <button
                              type="button"
                              className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-purple-600 transition-colors"
                              onClick={() => setShowNewPassword(!showNewPassword)}
                            >
                              {showNewPassword ? (
                                <EyeOffIcon className="h-5 w-5" />
                              ) : (
                                <EyeIcon className="h-5 w-5" />
                              )}
                            </button>
                          </div>
                          {/* <FormDescription className="text-gray-500">
                            Mật khẩu phải có ít nhất 8 ký tự.
                          </FormDescription> */}
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="confirmPassword"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-gray-700 font-medium">Xác nhận mật khẩu mới</FormLabel>
                          <div className="relative">
                            <FormControl>
                              <Input
                                type={showConfirmPassword ? "text" : "password"}
                                placeholder="Xác nhận mật khẩu mới của bạn"
                                className="pr-10 border-purple-100 focus:border-purple-300"
                                {...field}
                              />
                            </FormControl>
                            <button
                              type="button"
                              className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-purple-600 transition-colors"
                              onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                            >
                              {showConfirmPassword ? (
                                <EyeOffIcon className="h-5 w-5" />
                              ) : (
                                <EyeIcon className="h-5 w-5" />
                              )}
                            </button>
                          </div>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <div className="pt-4">
                      <Button 
                        type="submit" 
                        className="w-full bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white py-2 h-auto rounded-lg shadow-md hover:shadow-lg transition-all"
                        disabled={isLoading}
                      >
                        {isLoading ? 'Đang xử lý...' : 'Đổi Mật Khẩu'}
                      </Button>
                    </div>
                  </form>
                </Form>
              </div>
              
              <div className="hidden md:flex flex-col justify-center">
                <div className="bg-purple-50 p-6 rounded-lg">
                  <div className="flex justify-center mb-4">
                    <div className="p-3 bg-purple-100 rounded-full">
                      <ShieldCheckIcon className="h-8 w-8 text-purple-600" />
                    </div>
                  </div>
                  <h3 className="text-lg font-semibold text-center text-purple-800 mb-3">
                    Mật khẩu mạnh nên:
                  </h3>
                  <ul className="space-y-2 text-sm text-gray-700">
                    <li className="flex items-start gap-2">
                      <div className="min-w-4 h-4 rounded-full bg-purple-200 flex items-center justify-center mt-0.5">
                        <span className="text-xs font-bold text-purple-700">✓</span>
                      </div>
                      <span>Có ít nhất 8 ký tự</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <div className="min-w-4 h-4 rounded-full bg-purple-200 flex items-center justify-center mt-0.5">
                        <span className="text-xs font-bold text-purple-700">✓</span>
                      </div>
                      <span>Kết hợp chữ hoa và chữ thường</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <div className="min-w-4 h-4 rounded-full bg-purple-200 flex items-center justify-center mt-0.5">
                        <span className="text-xs font-bold text-purple-700">✓</span>
                      </div>
                      <span>Bao gồm số và ký tự đặc biệt</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <div className="min-w-4 h-4 rounded-full bg-purple-200 flex items-center justify-center mt-0.5">
                        <span className="text-xs font-bold text-purple-700">✓</span>
                      </div>
                      <span>Không sử dụng thông tin cá nhân</span>
                    </li>
                  </ul>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
} 