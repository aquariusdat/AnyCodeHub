"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { EyeIcon, EyeOffIcon, KeyIcon, ShieldCheckIcon, LockIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/components/ui/use-toast";
import { useAuthStore } from "@/stores/auth.store";

// Password validation schema
const passwordSchema = z.object({
  currentPassword: z.string().min(1, "Current password is required"),
  newPassword: z.string().min(8, "Password must be at least 8 characters"),
  confirmPassword: z.string().min(8, "Confirm password is required"),
}).refine(data => data.newPassword === data.confirmPassword, {
  message: "Passwords don't match",
  path: ["confirmPassword"],
});

type PasswordFormValues = z.infer<typeof passwordSchema>;

export default function ChangePassword() {
  const router = useRouter();
  const { toast } = useToast();
  const getUser = useAuthStore((state) => state.getUser);
  const user = getUser();
  const isGoogleAccount = user && 'googleId' in user ? Boolean(user.googleId) : false;
  const [isLoading, setIsLoading] = useState(false);
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<PasswordFormValues>({
    resolver: zodResolver(passwordSchema),
    defaultValues: {
      currentPassword: "",
      newPassword: "",
      confirmPassword: "",
    },
  });

  const onSubmit = async (data: PasswordFormValues) => {
    try {
      setIsLoading(true);
      // Simulate API call with a delay
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // Add your password change logic here
      
      toast({
        title: "Password changed successfully",
        description: "Your password has been updated.",
        variant: "default",
      });
      
      reset();
      router.push("/account/profile");
    } catch (error) {
      toast({
        title: "Failed to change password",
        description: "Please try again later.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-5 gap-6">
      <div className="md:col-span-3">
        <Card className="overflow-hidden border-gray-200 dark:border-gray-700/50 shadow-md dark:shadow-lg dark:shadow-purple-900/5">
          <div className="h-2 bg-gradient-to-r from-purple-600 to-indigo-600 dark:from-purple-500 dark:to-indigo-500"></div>
          <CardHeader className="space-y-1">
            <CardTitle className="text-2xl font-bold flex items-center gap-2">
              <KeyIcon className="h-5 w-5 text-purple-600 dark:text-purple-400" />
              Change Password
            </CardTitle>
            <CardDescription className="text-gray-500 dark:text-gray-300">
              {isGoogleAccount 
                ? "Set a password for your account for additional login options." 
                : "Update your password to keep your account secure."}
            </CardDescription>
          </CardHeader>
          
          <CardContent>
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
              {!isGoogleAccount && (
                <div className="space-y-2">
                  <Label htmlFor="currentPassword" className="text-gray-700 dark:text-gray-200">
                    Current Password
                  </Label>
                  <div className="relative">
                    <Input
                      id="currentPassword"
                      type={showCurrentPassword ? "text" : "password"}
                      placeholder="Enter your current password"
                      {...register("currentPassword")}
                      className={`pr-10 border-gray-300 dark:border-gray-700/70 bg-white dark:bg-gray-800/90 ${
                        errors.currentPassword ? "border-red-500 focus:ring-red-500" : "focus:ring-purple-500 dark:focus:ring-purple-400"
                      }`}
                      disabled={isLoading}
                    />
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      className="absolute right-0 top-0 h-full px-3 text-gray-400 hover:text-gray-600 dark:text-gray-400 dark:hover:text-gray-200"
                      onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                    >
                      {showCurrentPassword ? (
                        <EyeOffIcon className="h-4 w-4" />
                      ) : (
                        <EyeIcon className="h-4 w-4" />
                      )}
                    </Button>
                  </div>
                  {errors.currentPassword && (
                    <p className="text-sm text-red-500 dark:text-red-400 mt-1">{errors.currentPassword.message}</p>
                  )}
                </div>
              )}

              <div className="space-y-2">
                <Label htmlFor="newPassword" className="text-gray-700 dark:text-gray-200">
                  New Password
                </Label>
                <div className="relative">
                  <Input
                    id="newPassword"
                    type={showNewPassword ? "text" : "password"}
                    placeholder="Enter your new password"
                    {...register("newPassword")}
                    className={`pr-10 border-gray-300 dark:border-gray-700/70 bg-white dark:bg-gray-800/90 ${
                      errors.newPassword ? "border-red-500 focus:ring-red-500" : "focus:ring-purple-500 dark:focus:ring-purple-400"
                    }`}
                    disabled={isLoading}
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    className="absolute right-0 top-0 h-full px-3 text-gray-400 hover:text-gray-600 dark:text-gray-400 dark:hover:text-gray-200"
                    onClick={() => setShowNewPassword(!showNewPassword)}
                  >
                    {showNewPassword ? (
                      <EyeOffIcon className="h-4 w-4" />
                    ) : (
                      <EyeIcon className="h-4 w-4" />
                    )}
                  </Button>
                </div>
                {errors.newPassword && (
                  <p className="text-sm text-red-500 dark:text-red-400 mt-1">{errors.newPassword.message}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="confirmPassword" className="text-gray-700 dark:text-gray-200">
                  Confirm New Password
                </Label>
                <div className="relative">
                  <Input
                    id="confirmPassword"
                    type={showConfirmPassword ? "text" : "password"}
                    placeholder="Confirm your new password"
                    {...register("confirmPassword")}
                    className={`pr-10 border-gray-300 dark:border-gray-700/70 bg-white dark:bg-gray-800/90 ${
                      errors.confirmPassword ? "border-red-500 focus:ring-red-500" : "focus:ring-purple-500 dark:focus:ring-purple-400"
                    }`}
                    disabled={isLoading}
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    className="absolute right-0 top-0 h-full px-3 text-gray-400 hover:text-gray-600 dark:text-gray-400 dark:hover:text-gray-200"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  >
                    {showConfirmPassword ? (
                      <EyeOffIcon className="h-4 w-4" />
                    ) : (
                      <EyeIcon className="h-4 w-4" />
                    )}
                  </Button>
                </div>
                {errors.confirmPassword && (
                  <p className="text-sm text-red-500 dark:text-red-400 mt-1">{errors.confirmPassword.message}</p>
                )}
              </div>
            </form>
          </CardContent>
          
          <CardFooter className="flex flex-col sm:flex-row gap-3 pt-2">
            <Button
              onClick={handleSubmit(onSubmit)}
              disabled={isLoading}
              className="w-full sm:w-auto bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 dark:from-purple-500 dark:to-indigo-500 dark:hover:from-purple-600 dark:hover:to-indigo-600 text-white"
            >
              {isLoading ? (
                <>
                  <div className="h-4 w-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
                  Processing...
                </>
              ) : (
                "Change Password"
              )}
            </Button>
            <Button
              type="button"
              variant="outline"
              onClick={() => reset()}
              disabled={isLoading}
              className="w-full sm:w-auto border-gray-300 dark:border-gray-700/70 text-gray-700 dark:text-gray-200"
            >
              Reset Form
            </Button>
          </CardFooter>
        </Card>
      </div>

      <div className="md:col-span-2">
        <Card className="border-gray-200 dark:border-gray-700/50 shadow-md dark:shadow-lg dark:shadow-purple-900/5">
          <CardHeader>
            <CardTitle className="text-lg font-semibold flex items-center gap-2">
              <ShieldCheckIcon className="h-5 w-5 text-purple-600 dark:text-purple-400" />
              Password Best Practices
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-start gap-3">
              <div className="h-6 w-6 rounded-full bg-purple-100 dark:bg-purple-900/30 flex items-center justify-center text-purple-600 dark:text-purple-300 mt-0.5">
                <LockIcon className="h-3.5 w-3.5" />
              </div>
              <div>
                <h3 className="text-sm font-medium text-gray-900 dark:text-gray-100">Strong Password</h3>
                <p className="text-sm text-gray-500 dark:text-gray-300">Use at least 8 characters with a mix of letters, numbers, and symbols.</p>
              </div>
            </div>
            
            <div className="flex items-start gap-3">
              <div className="h-6 w-6 rounded-full bg-purple-100 dark:bg-purple-900/30 flex items-center justify-center text-purple-600 dark:text-purple-300 mt-0.5">
                <LockIcon className="h-3.5 w-3.5" />
              </div>
              <div>
                <h3 className="text-sm font-medium text-gray-900 dark:text-gray-100">Unique Password</h3>
                <p className="text-sm text-gray-500 dark:text-gray-300">Avoid using the same password for multiple accounts.</p>
              </div>
            </div>
            
            <div className="flex items-start gap-3">
              <div className="h-6 w-6 rounded-full bg-purple-100 dark:bg-purple-900/30 flex items-center justify-center text-purple-600 dark:text-purple-300 mt-0.5">
                <LockIcon className="h-3.5 w-3.5" />
              </div>
              <div>
                <h3 className="text-sm font-medium text-gray-900 dark:text-gray-100">Regular Updates</h3>
                <p className="text-sm text-gray-500 dark:text-gray-300">Change your password periodically to enhance security.</p>
              </div>
            </div>
            
            <div className="mt-4 pt-4 border-t border-gray-200 dark:border-gray-700/50">
              <div className="text-sm text-gray-600 dark:text-gray-300">
                <p className="mb-2">Strong password example:</p>
                <code className="px-2 py-1 bg-gray-100 dark:bg-gray-800/60 rounded text-purple-600 dark:text-purple-300 font-mono">P@ssw0rd!2023</code>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
} 