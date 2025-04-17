import CourseAddNewEnhanced from "@/components/course/courseAddNewEnhanced";
import Heading from "@/components/typoraphy/heading";
import { ChevronLeft } from "lucide-react";
import Link from "next/link";

const CreateCoursePage = () => {
    return (
        <div className="space-y-6">
            <div className="flex flex-col gap-6">
                <div className="flex justify-between items-center">
                    <div className="flex items-center gap-2">
                        <Link 
                            href="/admin/course" 
                            className="flex items-center text-primary hover:text-primary/80 transition-colors"
                        >
                            <ChevronLeft className="h-5 w-5" />
                            <span>Quay lại</span>
                        </Link>
                    </div>
                </div>
                <div className="bg-gradient-to-r from-purple-700 to-indigo-700 rounded-xl p-6 shadow-lg">
                    <h1 className="text-3xl font-bold text-white">Tạo Khóa Học Mới</h1>
                    <p className="text-purple-100 mt-2">
                        Thiết kế khóa học chất lượng cao với đầy đủ thông tin chi tiết
                    </p>
                </div>
            </div>
            
            <div className="relative">
                <div className="absolute top-0 right-0 w-1/3 h-full bg-gradient-to-l from-purple-50 to-transparent opacity-50 pointer-events-none"></div>
                <CourseAddNewEnhanced />
            </div>
        </div>
    )
}

export default CreateCoursePage; 