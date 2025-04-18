"use client";

import React, { useState } from "react";
import { Book, Clock, Calendar, Users, Star, Filter, Search, Trash, Edit, Eye, CheckCircle, Play, Download, MoreHorizontal } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useAuthStore } from "@/stores/auth.store";
import { useToast } from "@/components/ui/use-toast";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Progress } from "@/components/ui/progress";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import Link from "next/link";

interface Course {
  id: string;
  title: string;
  image: string;
  instructor: string;
  progress: number;
  status: "in-progress" | "completed" | "not-started";
  category: string;
  lastAccessed?: string;
  totalLessons: number;
  completedLessons: number;
  rating?: number;
  certificate?: boolean;
}

export default function CoursesPage() {
  const getUser = useAuthStore((state) => state.getUser);
  const user = getUser();
  const { toast } = useToast();
  
  const [activeTab, setActiveTab] = useState<string>("enrolled");
  const [searchQuery, setSearchQuery] = useState("");
  const [filterStatus, setFilterStatus] = useState<string>("all");
  const [filterCategory, setFilterCategory] = useState<string>("all");
  const [courseToDelete, setCourseToDelete] = useState<number | null>(null);

  if (!user) {
    return null;
  }
  
  // Mock data - in a real app this would come from an API
  const courses: Course[] = [
    {
      id: "course-1",
      title: "Advanced React Development",
      image: "/course-images/react.jpg",
      instructor: "Sarah Johnson",
      progress: 75,
      status: "in-progress",
      category: "Web Development",
      lastAccessed: "2023-06-15",
      totalLessons: 24,
      completedLessons: 18,
      rating: 4.5,
    },
    {
      id: "course-2",
      title: "JavaScript Fundamentals",
      image: "/course-images/javascript.jpg",
      instructor: "Michael Chen",
      progress: 100,
      status: "completed",
      category: "Web Development",
      lastAccessed: "2023-05-20",
      totalLessons: 18,
      completedLessons: 18,
      rating: 5,
      certificate: true,
    },
    {
      id: "course-3",
      title: "Introduction to TypeScript",
      image: "/course-images/typescript.jpg",
      instructor: "Emma Wilson",
      progress: 30,
      status: "in-progress",
      category: "Programming",
      lastAccessed: "2023-06-20",
      totalLessons: 15,
      completedLessons: 5,
    },
    {
      id: "course-4",
      title: "Node.js Backend Development",
      image: "/course-images/nodejs.jpg",
      instructor: "David Miller",
      progress: 0,
      status: "not-started",
      category: "Backend",
      totalLessons: 22,
      completedLessons: 0,
    },
    {
      id: "course-5",
      title: "UI/UX Design Principles",
      image: "/course-images/uiux.jpg", 
      instructor: "Jessica Park",
      progress: 100,
      status: "completed",
      category: "Design",
      lastAccessed: "2023-04-10",
      totalLessons: 12,
      completedLessons: 12,
      rating: 4.8,
      certificate: true,
    },
  ];
  
  // Filter courses based on search and filters
  const filteredCourses = courses
    .filter((course) => 
      course.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      course.instructor.toLowerCase().includes(searchQuery.toLowerCase()) ||
      course.category.toLowerCase().includes(searchQuery.toLowerCase())
    )
    .filter((course) => {
      if (filterStatus === "all") return true;
      if (filterStatus === "in-progress") return course.status === "in-progress";
      if (filterStatus === "completed") return course.status === "completed";
      if (filterStatus === "not-started") return course.status === "not-started";
      return true;
    });
  
  const handleDeleteCourse = (courseId: string) => {
    // In a real app, you would call an API to delete the course
    toast({
      title: "Khóa học đã được xóa",
      description: "Khóa học đã được xóa thành công.",
      duration: 3000
    });
    
    setCourseToDelete(null);
  };
  
  const getStatusBadge = (status: string) => {
    switch (status) {
      case "published":
        return <Badge className="bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300">Đã xuất bản</Badge>;
      case "draft":
        return <Badge className="bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-300">Bản nháp</Badge>;
      case "in-progress":
        return <Badge className="bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300">Đang học</Badge>;
      case "completed":
        return <Badge className="bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300">Hoàn thành</Badge>;
      default:
        return null;
    }
  };
  
  return (
    <div className="space-y-6">
      <Card className="overflow-hidden border-gray-200 dark:border-gray-700/50 shadow-md dark:shadow-lg dark:shadow-purple-900/5">
        <div className="h-2 bg-gradient-to-r from-purple-600 to-indigo-600 dark:from-purple-500 dark:to-indigo-500"></div>
        <CardHeader>
          <CardTitle className="text-2xl font-bold">Khóa học của tôi</CardTitle>
          <CardDescription>Quản lý tất cả các khóa học bạn đã tham gia và tạo</CardDescription>
        </CardHeader>
        
        <CardContent>
          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            <TabsList className="mb-6 bg-gray-100 dark:bg-gray-800/70 w-full sm:w-auto">
              <TabsTrigger 
                value="enrolled"
                className="data-[state=active]:bg-white dark:data-[state=active]:bg-gray-700/50"
              >
                Khóa học đã tham gia ({courses.length})
              </TabsTrigger>
              <TabsTrigger 
                value="created"
                className="data-[state=active]:bg-white dark:data-[state=active]:bg-gray-700/50"
              >
                Khóa học đã tạo ({courses.length})
              </TabsTrigger>
            </TabsList>
            
            <div className="flex flex-col sm:flex-row gap-4 mb-6">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-500 dark:text-gray-400" />
                <Input 
                  placeholder="Tìm kiếm khóa học..." 
                  className="pl-9 border-gray-300 dark:border-gray-700"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
              
              <div className="flex gap-2">
                <Select value={filterStatus} onValueChange={setFilterStatus}>
                  <SelectTrigger className="w-[140px] border-gray-300 dark:border-gray-700">
                    <SelectValue placeholder="Trạng thái" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Tất cả</SelectItem>
                    {activeTab === "enrolled" ? (
                      <>
                        <SelectItem value="in-progress">Đang học</SelectItem>
                        <SelectItem value="completed">Hoàn thành</SelectItem>
                      </>
                    ) : (
                      <>
                        <SelectItem value="published">Đã xuất bản</SelectItem>
                        <SelectItem value="draft">Bản nháp</SelectItem>
                      </>
                    )}
                  </SelectContent>
                </Select>
                
                {activeTab === "enrolled" && (
                  <Select value={filterCategory} onValueChange={setFilterCategory}>
                    <SelectTrigger className="w-[180px] border-gray-300 dark:border-gray-700">
                      <SelectValue placeholder="Danh mục" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">Tất cả danh mục</SelectItem>
                      <SelectItem value="Web Development">Web Development</SelectItem>
                      <SelectItem value="Backend Development">Backend Development</SelectItem>
                      <SelectItem value="Programming">Programming</SelectItem>
                      <SelectItem value="Web Design">Web Design</SelectItem>
                    </SelectContent>
                  </Select>
                )}
              </div>
            </div>
            
            <TabsContent value="enrolled" className="mt-0">
              {filteredCourses.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {filteredCourses.map(course => (
                    <CourseCard key={course.id} course={course} />
                  ))}
                </div>
              ) : (
                <div className="text-center py-8">
                  <Book className="h-12 w-12 mx-auto text-gray-400 dark:text-gray-600 mb-4" />
                  <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100 mb-1">
                    Không tìm thấy khóa học
                  </h3>
                  <p className="text-gray-500 dark:text-gray-400 max-w-md mx-auto">
                    {searchQuery || filterStatus !== "all" || filterCategory !== "all" 
                      ? "Không tìm thấy khóa học nào phù hợp với các bộ lọc của bạn. Thử điều chỉnh các bộ lọc để xem nhiều khóa học hơn."
                      : "Bạn chưa đăng ký khóa học nào. Hãy khám phá các khóa học của chúng tôi và bắt đầu học ngay hôm nay."}
                  </p>
                  <Button className="mt-4 bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 dark:from-purple-500 dark:to-indigo-500">
                    Khám phá khóa học
                  </Button>
                </div>
              )}
            </TabsContent>
            
            <TabsContent value="created" className="mt-0">
              {filteredCourses.length > 0 ? (
                <div className="overflow-hidden rounded-lg border border-gray-200 dark:border-gray-700/50">
                  <div className="overflow-x-auto">
                    <table className="w-full min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                      <thead className="bg-gray-50 dark:bg-gray-800/50">
                        <tr>
                          <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                            Khóa học
                          </th>
                          <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                            Trạng thái
                          </th>
                          <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                            Học viên
                          </th>
                          <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                            Đánh giá
                          </th>
                          <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                            Doanh thu
                          </th>
                          <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                            Cập nhật gần nhất
                          </th>
                          <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                            Hành động
                          </th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                        {filteredCourses.map(course => (
                          <tr key={course.id} className="bg-white dark:bg-gray-800/20 hover:bg-gray-50 dark:hover:bg-gray-800/50">
                            <td className="px-6 py-4 whitespace-nowrap">
                              <div className="flex items-center">
                                <div className="h-10 w-10 flex-shrink-0">
                                  <img 
                                    className="h-10 w-10 rounded-sm object-cover" 
                                    src={course.image} 
                                    alt={course.title} 
                                  />
                                </div>
                                <div className="ml-4">
                                  <div className="text-sm font-medium text-gray-900 dark:text-gray-100">
                                    {course.title}
                                  </div>
                                  <div className="text-sm text-gray-500 dark:text-gray-400">
                                    {course.totalLessons} bài học
                                  </div>
                                </div>
                              </div>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              {getStatusBadge(course.status.toString())}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <div className="flex items-center text-sm text-gray-700 dark:text-gray-300">
                                <Users className="h-4 w-4 mr-1" />
                                {course.completedLessons}/{course.totalLessons}
                              </div>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <div className="flex items-center text-sm text-gray-700 dark:text-gray-300">
                                {course.rating && (
                                  <>
                                    <Star className="h-4 w-4 text-yellow-500 mr-1" />
                                    {course.rating.toFixed(1)}
                                  </>
                                )}
                              </div>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700 dark:text-gray-300">
                              {course.certificate ? "Certificate Available" : "N/A"}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700 dark:text-gray-300">
                              {new Date(course.lastAccessed || "").toLocaleDateString('vi-VN')}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                              <DropdownMenu>
                                <DropdownMenuTrigger asChild>
                                  <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                                    <MoreHorizontal className="h-4 w-4" />
                                  </Button>
                                </DropdownMenuTrigger>
                                <DropdownMenuContent align="end" className="bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700">
                                  <DropdownMenuItem className="flex items-center cursor-pointer text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700/50">
                                    <Edit className="h-4 w-4 mr-2" />
                                    Chỉnh sửa
                                  </DropdownMenuItem>
                                  <DropdownMenuItem className="flex items-center cursor-pointer text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700/50">
                                    <Eye className="h-4 w-4 mr-2" />
                                    Xem trước
                                  </DropdownMenuItem>
                                  <AlertDialog>
                                    <AlertDialogTrigger asChild>
                                      <DropdownMenuItem className="flex items-center cursor-pointer text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/10">
                                        <Trash className="h-4 w-4 mr-2" />
                                        Xóa khóa học
                                      </DropdownMenuItem>
                                    </AlertDialogTrigger>
                                    <AlertDialogContent className="bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700">
                                      <AlertDialogHeader>
                                        <AlertDialogTitle className="text-gray-900 dark:text-gray-100">Bạn có chắc chắn không?</AlertDialogTitle>
                                        <AlertDialogDescription className="text-gray-500 dark:text-gray-400">
                                          Khóa học này sẽ bị xóa vĩnh viễn. Hành động này không thể hoàn tác.
                                        </AlertDialogDescription>
                                      </AlertDialogHeader>
                                      <AlertDialogFooter>
                                        <AlertDialogCancel className="border-gray-300 dark:border-gray-700 text-gray-700 dark:text-gray-300">
                                          Hủy
                                        </AlertDialogCancel>
                                        <AlertDialogAction 
                                          className="bg-red-600 text-white hover:bg-red-700 dark:bg-red-600 dark:hover:bg-red-700"
                                          onClick={() => handleDeleteCourse(course.id)}
                                        >
                                          Xóa khóa học
                                        </AlertDialogAction>
                                      </AlertDialogFooter>
                                    </AlertDialogContent>
                                  </AlertDialog>
                                </DropdownMenuContent>
                              </DropdownMenu>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              ) : (
                <div className="text-center py-8">
                  <Book className="h-12 w-12 mx-auto text-gray-400 dark:text-gray-600 mb-4" />
                  <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100 mb-1">
                    Bạn chưa tạo khóa học nào
                  </h3>
                  <p className="text-gray-500 dark:text-gray-400 max-w-md mx-auto">
                    Hãy bắt đầu tạo khóa học của riêng bạn và chia sẻ kiến thức với cộng đồng.
                  </p>
                  <Button className="mt-4 bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 dark:from-purple-500 dark:to-indigo-500">
                    Tạo khóa học mới
                  </Button>
                </div>
              )}
              
              <Dialog>
                <DialogTrigger asChild>
                  <Button className="mt-6 bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 dark:from-purple-500 dark:to-indigo-500">
                    Tạo khóa học mới
                  </Button>
                </DialogTrigger>
                <DialogContent className="bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700">
                  <DialogHeader>
                    <DialogTitle className="text-gray-900 dark:text-gray-100">Tạo khóa học mới</DialogTitle>
                    <DialogDescription className="text-gray-500 dark:text-gray-400">
                      Điền thông tin cơ bản để bắt đầu tạo khóa học của bạn.
                    </DialogDescription>
                  </DialogHeader>
                  <div className="space-y-4 py-4">
                    <div className="space-y-2">
                      <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                        Tên khóa học
                      </label>
                      <Input placeholder="Nhập tên khóa học" className="border-gray-300 dark:border-gray-700" />
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                        Danh mục
                      </label>
                      <Select>
                        <SelectTrigger className="border-gray-300 dark:border-gray-700">
                          <SelectValue placeholder="Chọn danh mục" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="web-development">Web Development</SelectItem>
                          <SelectItem value="backend-development">Backend Development</SelectItem>
                          <SelectItem value="mobile-development">Mobile Development</SelectItem>
                          <SelectItem value="data-science">Data Science</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                  <DialogFooter>
                    <Button variant="outline" className="border-gray-300 dark:border-gray-700">
                      Hủy
                    </Button>
                    <Button className="bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 dark:from-purple-500 dark:to-indigo-500">
                      Tạo khóa học
                    </Button>
                  </DialogFooter>
                </DialogContent>
              </Dialog>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
}

function CourseCard({ course }: { course: Course }) {
  return (
    <Card className="overflow-hidden">
      <div className="flex flex-col md:flex-row">
        <div className="relative md:w-1/4 h-[200px] md:h-auto">
          <img 
            src={course.image || "/placeholder-course.jpg"} 
            alt={course.title}
            className="w-full h-full object-cover"
          />
          <Badge 
            className={`absolute top-2 right-2 ${course.status === "in-progress" ? "bg-blue-500" : course.status === "completed" ? "bg-green-500" : "bg-gray-400"}`}
          >
            {course.status === "in-progress" ? "In Progress" : 
             course.status === "completed" ? "Completed" : "Not Started"}
          </Badge>
        </div>
        <div className="flex-1 p-6">
          <div className="flex flex-col md:flex-row justify-between">
            <div className="space-y-2">
              <h3 className="text-xl font-semibold">{course.title}</h3>
              <p className="text-muted-foreground">Instructor: {course.instructor}</p>
              <div className="flex items-center gap-2">
                <Badge variant="outline">{course.category}</Badge>
                {course.rating && (
                  <div className="flex items-center gap-1">
                    <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                    <span className="text-sm">{course.rating.toFixed(1)}</span>
                  </div>
                )}
              </div>
            </div>
            <div className="mt-4 md:mt-0 text-right">
              <div className="flex items-center gap-1 text-sm text-muted-foreground mb-1">
                <Clock className="h-4 w-4" />
                <span>Last accessed: {course.lastAccessed ? formatDate(course.lastAccessed) : "Never"}</span>
              </div>
              <div className="flex items-center gap-1 text-sm text-muted-foreground">
                <CheckCircle className="h-4 w-4" />
                <span>{course.completedLessons}/{course.totalLessons} lessons completed</span>
              </div>
            </div>
          </div>

          <div className="mt-4 space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-sm">Progress: {course.progress}%</span>
              {course.certificate && (
                <Badge variant="outline" className="text-green-500 border-green-500">
                  Certificate Available
                </Badge>
              )}
            </div>
            <Progress value={course.progress} className="h-2" />
          </div>

          <div className="mt-6 flex flex-wrap gap-2">
            {course.status !== "not-started" && (
              <Button asChild>
                <Link href={`/course/${course.id}`}>
                  <Play className="mr-2 h-4 w-4" />
                  {course.status === "in-progress" ? "Continue Learning" : "Review Course"}
                </Link>
              </Button>
            )}
            {course.status === "not-started" && (
              <Button asChild>
                <Link href={`/course/${course.id}`}>
                  <Play className="mr-2 h-4 w-4" />
                  Start Course
                </Link>
              </Button>
            )}
            {course.certificate && (
              <Button variant="outline">
                <Download className="mr-2 h-4 w-4" />
                Download Certificate
              </Button>
            )}
          </div>
        </div>
      </div>
    </Card>
  );
}

function formatDate(dateString?: string) {
  if (!dateString) return "Never";
  const date = new Date(dateString);
  return date.toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
} 