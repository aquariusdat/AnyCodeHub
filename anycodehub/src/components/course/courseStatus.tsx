import React from 'react'

const CourseStatus = ({ courseStatus }: { courseStatus: number }) => {

  return (
    <>
      {courseStatus == 1 ? <span className="inline-block px-3 py-1 rounded-full absolute top-3 right-3 z-10 text-white font-medium bg-green-500 text-xs">New</span> : ''}
    </>
  )
}

export default CourseStatus