const CourseGrid = ({ children }: { children: React.ReactNode }) => {
    return (
        <div className="course-grid grid grid-cols-4 gap-4 mt-8">
            {children}
        </div>
    )
}

export default CourseGrid