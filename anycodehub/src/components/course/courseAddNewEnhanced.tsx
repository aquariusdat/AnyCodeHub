"use client";

import * as React from 'react';
import { useForm, useFieldArray } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { useRouter } from 'next/navigation';
import { toast } from 'react-hot-toast';
import { Plus, Trash2, X } from 'lucide-react';

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
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

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
  benefits: z.array(z.object({
    value: z.string().min(1, { message: "Lợi ích không được để trống." })
  })).optional(),
  technologies: z.array(z.object({
    name: z.string().min(1, { message: "Tên công nghệ không được để trống." }),
    description: z.string().optional()
  })).optional(),
  categories: z.array(z.object({
    name: z.string().min(1, { message: "Tên danh mục không được để trống." })
  })).optional(),
  requirements: z.array(z.object({
    value: z.string().min(1, { message: "Yêu cầu không được để trống." })
  })).optional(),
  qa: z.array(z.object({
    question: z.string().min(1, { message: "Câu hỏi không được để trống." }),
    answer: z.string().min(1, { message: "Câu trả lời không được để trống." })
  })).optional(),
  sections: z.array(z.object({
    title: z.string().min(1, { message: "Tiêu đề phần không được để trống." }),
    lessons: z.array(z.object({
      title: z.string().min(1, { message: "Tiêu đề bài học không được để trống." }),
      videoUrl: z.string().url({ message: "URL video không hợp lệ." }).optional().or(z.literal('')),
      content: z.string().optional(),
      durationTime: z.coerce.number().min(0).optional()
    })).optional()
  })).optional(),
}).refine(data => !data.salePrice || data.salePrice <= data.price, {
    message: "Giá khuyến mãi không được lớn hơn giá gốc.",
    path: ["salePrice"], // Chỉ định lỗi này thuộc về trường salePrice
});

type CourseFormValues = z.infer<typeof courseFormSchema>;

const CourseAddNewEnhanced = () => {
  const router = useRouter();
  const { user } = useAuthStore.getState(); // Lấy user trực tiếp từ state
  const [isLoading, setIsLoading] = React.useState(false);
  const [openSections, setOpenSections] = React.useState(['basic-info']);

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
      benefits: [{ value: '' }],
      technologies: [{ name: '', description: '' }],
      categories: [{ name: '' }],
      requirements: [{ value: '' }],
      qa: [{ question: '', answer: '' }],
      sections: [{ title: '', lessons: [{ title: '', videoUrl: '', content: '', durationTime: 0 }] }],
    },
    mode: 'onChange', // Validate khi có thay đổi
  });

  // Field arrays cho các danh sách
  const benefitsArray = useFieldArray({
    control: form.control,
    name: "benefits",
  });

  const technologiesArray = useFieldArray({
    control: form.control,
    name: "technologies",
  });

  const categoriesArray = useFieldArray({
    control: form.control,
    name: "categories",
  });

  const requirementsArray = useFieldArray({
    control: form.control,
    name: "requirements",
  });

  const qaArray = useFieldArray({
    control: form.control,
    name: "qa",
  });

  const sectionsArray = useFieldArray({
    control: form.control,
    name: "sections",
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
        router.push(`/admin/course/${responseValue?.slug || ''}`); 
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
    <div className="space-y-6">
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
          <Accordion
            type="multiple"
            value={openSections}
            onValueChange={setOpenSections}
            className="w-full"
          >
            {/* Phần Thông Tin Cơ Bản */}
            <AccordionItem value="basic-info">
              <AccordionTrigger className="font-medium text-lg">Thông Tin Cơ Bản</AccordionTrigger>
              <AccordionContent>
                <div className="grid grid-cols-1 gap-6 p-4">
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
              </AccordionContent>
            </AccordionItem>

            {/* Phần Giá Cả */}
            <AccordionItem value="pricing">
              <AccordionTrigger className="font-medium text-lg">Giá Cả</AccordionTrigger>
              <AccordionContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 p-4">
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
              </AccordionContent>
            </AccordionItem>

            {/* Phần Nội dung và Media */}
            <AccordionItem value="media">
              <AccordionTrigger className="font-medium text-lg">Nội Dung & Truyền Thông</AccordionTrigger>
              <AccordionContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 p-4">
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
                        <FormLabel>URL Video Giới Thiệu</FormLabel>
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
              </AccordionContent>
            </AccordionItem>

            {/* Phần Thông tin khác */}
            <AccordionItem value="details">
              <AccordionTrigger className="font-medium text-lg">Chi Tiết Khác</AccordionTrigger>
              <AccordionContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 p-4">
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
                          </SelectContent>
                        </Select>
                        <FormDescription>Trạng thái hiển thị của khóa học.</FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              </AccordionContent>
            </AccordionItem>

            {/* Phần Lợi ích khóa học */}
            <AccordionItem value="benefits">
              <AccordionTrigger className="font-medium text-lg">Lợi Ích Khóa Học</AccordionTrigger>
              <AccordionContent>
                <div className="space-y-4 p-4">
                  <div className="flex justify-between items-center">
                    <p className="text-sm text-muted-foreground">Thêm các lợi ích mà học viên sẽ nhận được sau khi hoàn thành khóa học.</p>
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={() => benefitsArray.append({ value: '' })}
                    >
                      <Plus className="h-4 w-4 mr-2" /> Thêm lợi ích
                    </Button>
                  </div>
                  
                  {benefitsArray.fields.map((field, index) => (
                    <div key={field.id} className="flex items-center gap-2">
                      <FormField
                        control={form.control}
                        name={`benefits.${index}.value`}
                        render={({ field }) => (
                          <FormItem className="flex-1">
                            <FormControl>
                              <Input placeholder="Nhập lợi ích khóa học..." {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        onClick={() => benefitsArray.remove(index)}
                        disabled={benefitsArray.fields.length <= 1}
                      >
                        <Trash2 className="h-4 w-4 text-destructive" />
                      </Button>
                    </div>
                  ))}
                </div>
              </AccordionContent>
            </AccordionItem>

            {/* Phần Công nghệ */}
            <AccordionItem value="technologies">
              <AccordionTrigger className="font-medium text-lg">Công Nghệ</AccordionTrigger>
              <AccordionContent>
                <div className="space-y-4 p-4">
                  <div className="flex justify-between items-center">
                    <p className="text-sm text-muted-foreground">Thêm các công nghệ được dạy trong khóa học.</p>
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={() => technologiesArray.append({ name: '', description: '' })}
                    >
                      <Plus className="h-4 w-4 mr-2" /> Thêm công nghệ
                    </Button>
                  </div>
                  
                  {technologiesArray.fields.map((field, index) => (
                    <Card key={field.id} className="p-4">
                      <CardContent className="p-0 space-y-4">
                        <div className="flex items-center justify-between">
                          <h4 className="font-medium">Công nghệ #{index + 1}</h4>
                          <Button
                            type="button"
                            variant="ghost"
                            size="sm"
                            onClick={() => technologiesArray.remove(index)}
                            disabled={technologiesArray.fields.length <= 1}
                          >
                            <X className="h-4 w-4 text-destructive" />
                          </Button>
                        </div>
                        
                        <FormField
                          control={form.control}
                          name={`technologies.${index}.name`}
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Tên công nghệ</FormLabel>
                              <FormControl>
                                <Input placeholder="Ví dụ: React, Node.js, TypeScript..." {...field} />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        
                        <FormField
                          control={form.control}
                          name={`technologies.${index}.description`}
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Mô tả (Tùy chọn)</FormLabel>
                              <FormControl>
                                <Textarea 
                                  placeholder="Mô tả ngắn về công nghệ này..." 
                                  className="resize-y"
                                  {...field} 
                                />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </AccordionContent>
            </AccordionItem>

            {/* Phần Danh mục */}
            <AccordionItem value="categories">
              <AccordionTrigger className="font-medium text-lg">Danh Mục</AccordionTrigger>
              <AccordionContent>
                <div className="space-y-4 p-4">
                  <div className="flex justify-between items-center">
                    <p className="text-sm text-muted-foreground">Thêm các danh mục cho khóa học.</p>
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={() => categoriesArray.append({ name: '' })}
                    >
                      <Plus className="h-4 w-4 mr-2" /> Thêm danh mục
                    </Button>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {categoriesArray.fields.map((field, index) => (
                      <div key={field.id} className="flex items-center gap-2">
                        <FormField
                          control={form.control}
                          name={`categories.${index}.name`}
                          render={({ field }) => (
                            <FormItem className="flex-1">
                              <FormControl>
                                <Input placeholder="Tên danh mục..." {...field} />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        <Button
                          type="button"
                          variant="ghost"
                          size="sm"
                          onClick={() => categoriesArray.remove(index)}
                          disabled={categoriesArray.fields.length <= 1}
                        >
                          <Trash2 className="h-4 w-4 text-destructive" />
                        </Button>
                      </div>
                    ))}
                  </div>
                  
                  <div className="pt-2">
                    <h4 className="text-sm font-medium mb-2">Danh mục đã chọn:</h4>
                    <div className="flex flex-wrap gap-2">
                      {form.watch('categories')?.map((category, index) => 
                        category.name ? (
                          <Badge key={index} variant="secondary">{category.name}</Badge>
                        ) : null
                      )}
                    </div>
                  </div>
                </div>
              </AccordionContent>
            </AccordionItem>

            {/* Phần Yêu cầu */}
            <AccordionItem value="requirements">
              <AccordionTrigger className="font-medium text-lg">Yêu Cầu Khóa Học</AccordionTrigger>
              <AccordionContent>
                <div className="space-y-4 p-4">
                  <div className="flex justify-between items-center">
                    <p className="text-sm text-muted-foreground">Thêm các yêu cầu cần thiết trước khi học khóa học này.</p>
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={() => requirementsArray.append({ value: '' })}
                    >
                      <Plus className="h-4 w-4 mr-2" /> Thêm yêu cầu
                    </Button>
                  </div>
                  
                  {requirementsArray.fields.map((field, index) => (
                    <div key={field.id} className="flex items-center gap-2">
                      <FormField
                        control={form.control}
                        name={`requirements.${index}.value`}
                        render={({ field }) => (
                          <FormItem className="flex-1">
                            <FormControl>
                              <Input placeholder="Ví dụ: Kiến thức cơ bản về HTML, CSS..." {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        onClick={() => requirementsArray.remove(index)}
                        disabled={requirementsArray.fields.length <= 1}
                      >
                        <Trash2 className="h-4 w-4 text-destructive" />
                      </Button>
                    </div>
                  ))}
                </div>
              </AccordionContent>
            </AccordionItem>

            {/* Phần Câu hỏi thường gặp */}
            <AccordionItem value="qa">
              <AccordionTrigger className="font-medium text-lg">Câu Hỏi Thường Gặp</AccordionTrigger>
              <AccordionContent>
                <div className="space-y-4 p-4">
                  <div className="flex justify-between items-center">
                    <p className="text-sm text-muted-foreground">Thêm các câu hỏi và trả lời thường gặp về khóa học.</p>
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={() => qaArray.append({ question: '', answer: '' })}
                    >
                      <Plus className="h-4 w-4 mr-2" /> Thêm câu hỏi và trả lời
                    </Button>
                  </div>
                  
                  {qaArray.fields.map((field, index) => (
                    <Card key={field.id} className="p-4">
                      <CardContent className="p-0 space-y-4">
                        <div className="flex items-center justify-between">
                          <h4 className="font-medium">Q&A #{index + 1}</h4>
                          <Button
                            type="button"
                            variant="ghost"
                            size="sm"
                            onClick={() => qaArray.remove(index)}
                            disabled={qaArray.fields.length <= 1}
                          >
                            <X className="h-4 w-4 text-destructive" />
                          </Button>
                        </div>
                        
                        <FormField
                          control={form.control}
                          name={`qa.${index}.question`}
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Câu hỏi</FormLabel>
                              <FormControl>
                                <Input placeholder="Nhập câu hỏi..." {...field} />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        
                        <FormField
                          control={form.control}
                          name={`qa.${index}.answer`}
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Câu trả lời</FormLabel>
                              <FormControl>
                                <Textarea 
                                  placeholder="Nhập câu trả lời chi tiết..." 
                                  className="resize-y min-h-[100px]"
                                  {...field} 
                                />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </AccordionContent>
            </AccordionItem>

            {/* Phần Chương và Bài học */}
            <AccordionItem value="sections">
              <AccordionTrigger className="font-medium text-lg">Chương & Bài Học</AccordionTrigger>
              <AccordionContent>
                <div className="space-y-6 p-4">
                  <div className="flex justify-between items-center">
                    <p className="text-sm text-muted-foreground">Tạo cấu trúc khóa học với các chương và bài học.</p>
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={() => sectionsArray.append({ title: '', lessons: [{ title: '', videoUrl: '', content: '', durationTime: 0 }] })}
                    >
                      <Plus className="h-4 w-4 mr-2" /> Thêm chương
                    </Button>
                  </div>
                  
                  {sectionsArray.fields.map((sectionField, sectionIndex) => {
                    // Tạo field array cho mỗi phần lessons
                    const lessonsArray = useFieldArray({
                      control: form.control,
                      name: `sections.${sectionIndex}.lessons`
                    });
                    
                    return (
                      <Card key={sectionField.id} className="p-4">
                        <CardContent className="p-0 space-y-6">
                          <div className="flex items-center justify-between">
                            <h4 className="font-medium text-lg">Chương {sectionIndex + 1}</h4>
                            <Button
                              type="button"
                              variant="ghost"
                              size="sm"
                              onClick={() => sectionsArray.remove(sectionIndex)}
                              disabled={sectionsArray.fields.length <= 1}
                            >
                              <X className="h-4 w-4 text-destructive" />
                            </Button>
                          </div>
                          
                          <FormField
                            control={form.control}
                            name={`sections.${sectionIndex}.title`}
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>Tên chương</FormLabel>
                                <FormControl>
                                  <Input placeholder="Ví dụ: Giới thiệu về React Hooks..." {...field} />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                          
                          <div className="space-y-4">
                            <div className="flex justify-between items-center">
                              <h5 className="font-medium">Bài học</h5>
                              <Button
                                type="button"
                                variant="outline"
                                size="sm"
                                onClick={() => lessonsArray.append({ title: '', videoUrl: '', content: '', durationTime: 0 })}
                              >
                                <Plus className="h-4 w-4 mr-2" /> Thêm bài học
                              </Button>
                            </div>
                            
                            {lessonsArray.fields.map((lessonField, lessonIndex) => (
                              <Card key={lessonField.id} className="p-4 border-dashed">
                                <CardContent className="p-0 space-y-4">
                                  <div className="flex items-center justify-between">
                                    <h6 className="font-medium">Bài {lessonIndex + 1}</h6>
                                    <Button
                                      type="button"
                                      variant="ghost"
                                      size="sm"
                                      onClick={() => lessonsArray.remove(lessonIndex)}
                                      disabled={lessonsArray.fields.length <= 1}
                                    >
                                      <X className="h-4 w-4 text-destructive" />
                                    </Button>
                                  </div>
                                  
                                  <FormField
                                    control={form.control}
                                    name={`sections.${sectionIndex}.lessons.${lessonIndex}.title`}
                                    render={({ field }) => (
                                      <FormItem>
                                        <FormLabel>Tên bài học</FormLabel>
                                        <FormControl>
                                          <Input placeholder="Nhập tên bài học..." {...field} />
                                        </FormControl>
                                        <FormMessage />
                                      </FormItem>
                                    )}
                                  />
                                  
                                  <FormField
                                    control={form.control}
                                    name={`sections.${sectionIndex}.lessons.${lessonIndex}.videoUrl`}
                                    render={({ field }) => (
                                      <FormItem>
                                        <FormLabel>URL Video (nếu có)</FormLabel>
                                        <FormControl>
                                          <Input type="url" placeholder="https://example.com/video.mp4" {...field} />
                                        </FormControl>
                                        <FormMessage />
                                      </FormItem>
                                    )}
                                  />
                                  
                                  <FormField
                                    control={form.control}
                                    name={`sections.${sectionIndex}.lessons.${lessonIndex}.content`}
                                    render={({ field }) => (
                                      <FormItem>
                                        <FormLabel>Nội dung bài học</FormLabel>
                                        <FormControl>
                                          <Textarea
                                            placeholder="Nhập nội dung bài học..."
                                            className="resize-y min-h-[100px]"
                                            {...field}
                                          />
                                        </FormControl>
                                        <FormMessage />
                                      </FormItem>
                                    )}
                                  />
                                  
                                  <FormField
                                    control={form.control}
                                    name={`sections.${sectionIndex}.lessons.${lessonIndex}.durationTime`}
                                    render={({ field }) => (
                                      <FormItem>
                                        <FormLabel>Thời lượng (phút)</FormLabel>
                                        <FormControl>
                                          <Input type="number" min="0" {...field} />
                                        </FormControl>
                                        <FormMessage />
                                      </FormItem>
                                    )}
                                  />
                                </CardContent>
                              </Card>
                            ))}
                          </div>
                        </CardContent>
                      </Card>
                    );
                  })}
                </div>
              </AccordionContent>
            </AccordionItem>
          </Accordion>

          <div className="pt-6 flex justify-end">
            <Button type="submit" disabled={isLoading} className="w-full sm:w-auto">
              {isLoading ? 'Đang tạo...' : 'Tạo Khóa Học'}
            </Button>
          </div>
        </form>
      </Form>
    </div>
  );
};

export default CourseAddNewEnhanced; 