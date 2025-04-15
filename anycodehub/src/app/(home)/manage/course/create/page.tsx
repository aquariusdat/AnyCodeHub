import CourseAddNew from "@/components/course/courseAddNew";
import Heading from "@/components/typoraphy/heading";

const CreateCoursePage = () => {
    return (
        <div className="container mx-auto py-10">
            <Heading>Tạo khóa học mới</Heading>
            <CourseAddNew />
        </div>
    )
}

export default CreateCoursePage;