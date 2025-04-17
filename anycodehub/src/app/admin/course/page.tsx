import React from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Plus } from 'lucide-react';
import Heading from '@/components/typoraphy/heading';

const AdminCoursePage = () => {
  // Giả lập dữ liệu khóa học (trong thực tế, đây sẽ được lấy từ API)
  const courses = [
    { id: '1', name: 'React.js - Advanced Course', status: 'published', students: 32, price: 1250000 },
    { id: '2', name: 'Next.js Masterclass', status: 'published', students: 28, price: 1450000 },
    { id: '3', name: 'Node.js Backend Development', status: 'published', students: 25, price: 1350000 },
    { id: '4', name: 'TypeScript Essentials', status: 'draft', students: 0, price: 990000 },
  ];

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <Heading>Quản lý khóa học</Heading>
        <Link href="/admin/course/create">
          <Button className="flex items-center gap-2">
            <Plus className="h-4 w-4" />
            <span>Tạo khóa học mới</span>
          </Button>
        </Link>
      </div>
      
      <div className="rounded-md border">
        <div className="relative w-full overflow-auto">
          <table className="w-full caption-bottom text-sm">
            <thead className="[&_tr]:border-b">
              <tr className="border-b transition-colors hover:bg-muted/50 data-[state=selected]:bg-muted">
                <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground">Tên khóa học</th>
                <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground">Trạng thái</th>
                <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground">Học viên</th>
                <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground">Giá</th>
                <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground">Thao tác</th>
              </tr>
            </thead>
            <tbody className="[&_tr:last-child]:border-0">
              {courses.map((course) => (
                <tr key={course.id} className="border-b transition-colors hover:bg-muted/50 data-[state=selected]:bg-muted">
                  <td className="p-4 align-middle">{course.name}</td>
                  <td className="p-4 align-middle">
                    <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold ${
                      course.status === 'published' 
                        ? 'bg-green-50 text-green-700' 
                        : 'bg-yellow-50 text-yellow-700'
                    }`}>
                      {course.status === 'published' ? 'Đã xuất bản' : 'Bản nháp'}
                    </span>
                  </td>
                  <td className="p-4 align-middle">{course.students}</td>
                  <td className="p-4 align-middle">{new Intl.NumberFormat('vi-VN').format(course.price)}đ</td>
                  <td className="p-4 align-middle">
                    <div className="flex space-x-2">
                      <Link href={`/admin/course/${course.id}`}>
                        <Button variant="outline" size="sm">Chi tiết</Button>
                      </Link>
                      <Link href={`/admin/course/${course.id}/edit`}>
                        <Button variant="outline" size="sm">Sửa</Button>
                      </Link>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default AdminCoursePage; 