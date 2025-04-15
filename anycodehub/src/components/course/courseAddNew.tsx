"use client";

import * as React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { useRouter } from 'next/navigation';
import { toast } from 'react-hot-toast';

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

import { apiService } from '@/services/api.service';
import { useAuthStore } from '@/stores/auth.store';

// Định nghĩa enum (nếu chưa có)
export enum CourseStatus {
    Draft = 'draft',
    Published = 'published',
    Pending = 'pending',
    Archived = 'archived'
}

export enum CourseLevel {
    Beginner = 0,
    Intermediate = 1,
    Advanced = 2
}

// Định nghĩa schema validation với Zod
const courseFormSchema = z.object({
  name: z.string().min(5, { message: "Tên khóa học phải có ít nhất 5 ký tự." }).max(100),
  description: z.string().min(10, { message: "Mô tả phải có ít nhất 10 ký tự." }).max(1000),
  price: z.coerce.number().min(0, { message: "Giá không thể âm." }),
  salePrice: z.coerce.number().min(0, { message: "Giá khuyến mãi không thể âm." }).optional(),
  imageUrl: z.string().url({ message: "URL hình ảnh không hợp lệ." }).optional().or(z.literal('')),
  videoUrl: z.string().url({ message: "URL video không hợp lệ." }).optional().or(z.literal('')),
  slug: z.string().min(3, { message: "Slug phải có ít nhất 3 ký tự." }).regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, { message: "Slug không hợp lệ (chỉ chữ thường, số, dấu gạch ngang)." }),
  status: z.nativeEnum(CourseStatus).default(CourseStatus.Draft),
  level: z.coerce.number().pipe(z.nativeEnum(CourseLevel)).default(CourseLevel.Beginner),
  totalDuration: z.coerce.number().min(0, { message: "Thời lượng không thể âm." }).optional(),
}).refine(data => !data.salePrice || data.salePrice <= data.price, {
    message: "Giá khuyến mãi không được lớn hơn giá gốc.",
    path: ["salePrice"], // Chỉ định lỗi này thuộc về trường salePrice
});

type CourseFormValues = z.infer<typeof courseFormSchema>;

const CourseAddNew = () => {
  const router = useRouter();
  const { user } = useAuthStore.getState(); // Lấy user trực tiếp từ state
  const [isLoading, setIsLoading] = React.useState(false);

  const form = useForm<CourseFormValues>({
    resolver: zodResolver(courseFormSchema),
    defaultValues: {
      name: '',
      description: '',
      price: 0,
      salePrice: 0,
      imageUrl: '',
      videoUrl: '',
      slug: '',
      status: CourseStatus.Draft,
      level: CourseLevel.Beginner,
      totalDuration: 0,
    },
    mode: 'onChange', // Validate khi có thay đổi
  });

  const onSubmit = async (data: CourseFormValues) => {
    if (!user) {
        toast.error("Bạn cần đăng nhập để tạo khóa học.");
        return;
    }
    setIsLoading(true);
    try {
        const courseData = {
            ...data,
            authorId: user.id,
            createdBy: user.id,
            // Các trường mặc định khác nếu API yêu cầu và không có trong form
            totalViews: 0,
            rating: 0,
        };

      const response = await apiService.post('/Course/Create', courseData, {}, true);

      if (response.isSuccess) {
        toast.success('Tạo khóa học thành công!');
        // Define the expected type for the response value
        type CourseCreateResponseValue = {
          id: string;
          slug: string;
          // Add other expected properties from the response if necessary
        };
        const responseValue = response.value as CourseCreateResponseValue | undefined;
        router.push(`/manage/course/${responseValue?.slug || ''}`); 
      } else {
        toast.error(response.error?.message || 'Tạo khóa học thất bại.');
      }
    } catch (error) {
      console.error("Submit error:", error);
      toast.error('Đã xảy ra lỗi. Vui lòng thử lại.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        {/* Phần Thông Tin Cơ Bản */}
        <div className="p-6 border rounded-lg shadow-sm bg-card">
          <h3 className="text-lg font-medium mb-4">Thông Tin Cơ Bản</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem className="md:col-span-2">
                  <FormLabel>Tên Khóa Học</FormLabel>
                  <FormControl>
                    <Input placeholder="Nhập tên khóa học..." {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="slug"
              render={({ field }) => (
                <FormItem className="md:col-span-2">
                  <FormLabel>Slug (URL thân thiện)</FormLabel>
                  <FormControl>
                    <Input placeholder="vi-du-khoa-hoc" {...field} />
                  </FormControl>
                  <FormDescription>
                    Chỉ chứa chữ thường, số và dấu gạch ngang.
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem className="md:col-span-2">
                  <FormLabel>Mô Tả Khóa Học</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Nhập mô tả chi tiết về khóa học..."
                      className="resize-y min-h-[100px]"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
        </div>

        {/* Phần Giá Cả */}
        <div className="p-6 border rounded-lg shadow-sm bg-card">
           <h3 className="text-lg font-medium mb-4">Giá Cả</h3>
           <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <FormField
                  control={form.control}
                  name="price"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Giá Gốc (VNĐ)</FormLabel>
                      <FormControl>
                        <Input type="number" placeholder="0" {...field} min="0" />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="salePrice"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Giá Khuyến Mãi (VNĐ)</FormLabel>
                      <FormControl>
                        <Input type="number" placeholder="0" {...field} min="0" />
                      </FormControl>
                      <FormDescription>Để trống nếu không có khuyến mãi.</FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
            </div>
        </div>

        {/* Phần Nội Dung */}
        <div className="p-6 border rounded-lg shadow-sm bg-card">
          <h3 className="text-lg font-medium mb-4">Nội Dung & Truyền Thông</h3>
           <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <FormField
                control={form.control}
                name="imageUrl"
                render={({ field }) => (
                  <FormItem className="md:col-span-2">
                    <FormLabel>URL Hình Ảnh Đại Diện</FormLabel>
                    <FormControl>
                      <Input type="url" placeholder="https://example.com/image.jpg" {...field} />
                    </FormControl>
                     <FormDescription>URL công khai của hình ảnh.</FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="videoUrl"
                render={({ field }) => (
                  <FormItem className="md:col-span-2">
                    <FormLabel>URL Video Giới Thiệu (Tùy chọn)</FormLabel>
                    <FormControl>
                      <Input type="url" placeholder="https://youtube.com/watch?v=..." {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="totalDuration"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Tổng Thời Lượng (Phút)</FormLabel>
                    <FormControl>
                      <Input type="number" placeholder="0" {...field} min="0" />
                    </FormControl>
                    <FormDescription>Tổng thời lượng dự kiến của khóa học.</FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
           </div>
        </div>

        {/* Phần Chi Tiết Khác */}
         <div className="p-6 border rounded-lg shadow-sm bg-card">
            <h3 className="text-lg font-medium mb-4">Chi Tiết Khác</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <FormField
                  control={form.control}
                  name="level"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Trình Độ</FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={String(field.value)}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Chọn trình độ" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value={String(CourseLevel.Beginner)}>Cơ bản</SelectItem>
                          <SelectItem value={String(CourseLevel.Intermediate)}>Trung bình</SelectItem>
                          <SelectItem value={String(CourseLevel.Advanced)}>Nâng cao</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                 <FormField
                  control={form.control}
                  name="status"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Trạng Thái</FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Chọn trạng thái" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value={CourseStatus.Draft}>Bản nháp</SelectItem>
                          <SelectItem value={CourseStatus.Pending}>Chờ duyệt</SelectItem>
                          <SelectItem value={CourseStatus.Published}>Công khai</SelectItem>
                          {/* <SelectItem value={CourseStatus.Archived}>Lưu trữ</SelectItem> */}
                        </SelectContent>
                      </Select>
                       <FormDescription>Trạng thái hiển thị của khóa học.</FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
            </div>
        </div>

        <Button type="submit" disabled={isLoading}>
          {isLoading ? 'Đang tạo...' : 'Tạo Khóa Học'}
        </Button>
      </form>
    </Form>
  );
};

export default CourseAddNew;