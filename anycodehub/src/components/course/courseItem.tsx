import Image from "next/image"
import Link from "next/link"
import CourseStatus from "./courseStatus"
import { EyeIcon, PersonIcon } from "../icons"
import './courseItem.scss'
import CourseInfo from "./courseInfo"

const CourseItem = () => {
    return (
        <div className="course-item dark:bg-grayDarker bg-white border border-gray-200 p-5 rounded-lg">
            <Link className="block h-[180px] relative overflow-hidden rounded-lg" href={`/courses/1`}>
                <Image src={`https://images.unsplash.com/photo-1738830656378-c8f96e01ec50?q=80&w=2701&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D`} alt=""
                    width={300}
                    height={200}
                    sizes="(min-width: 640px) 300px, 100vw"
                    className="w-full h-full object-cover rounded-lg hover:scale-110 transition ease-in-out duration-500" />
                <CourseStatus courseStatus={'NEW'} />
            </Link>
            <div className="pt-4">
                <h3 className="font-bold text-md">
                    <Link href={`/courses/1`}>Khoá học C# cơ bản dành cho người mới (2025)</Link>
                </h3>
                <div className="course-item__info flex items-center justify-between mt-2">
                    <div className="info-left flex justify-center items-center gap-5">
                        <CourseInfo tooltipName="Lượt xem" tooltipContent="1,250" courseInfoIcon={<EyeIcon className="size-3" />} />
                        <CourseInfo tooltipName="Số học viên đã tham gia" tooltipContent="12" courseInfoIcon={<PersonIcon className="size-3" />} />

                        {/* <div className="flex items-center gap-2">
                            <span className="text-sm px-3 py-1 rounded-full bg-primary text-primary bg-opacity-10">30h25p</span>
                        </div> */}
                    </div>


                    <div className="info-right lex items-center gap-2">
                        <span className="text-md font-bold text-primary">799.000 VNĐ</span>
                    </div>
                </div>

                <Link href={`/courses/1`} className="see-more flex justify-center items-center w-full mt-5 rounded-lg bg-primary text-white h-12 hover:text-primary-dark transition-all">Xem chi tiết</Link>
            </div>
        </div>
    )
}

export default CourseItem