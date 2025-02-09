import { CourseGrid } from '@/components/common'
import CourseItem from '@/components/course/courseItem'
import Heading from '@/components/typoraphy/heading'
import React from 'react'

const Study = () => {
    return (
        <div className='study'>
            <Heading>Khu vực học tập</Heading>
            <CourseGrid>
                <CourseItem></CourseItem>
                <CourseItem></CourseItem>
                <CourseItem></CourseItem>
                <CourseItem></CourseItem>
                <CourseItem></CourseItem>
                <CourseItem></CourseItem>
                <CourseItem></CourseItem>
            </CourseGrid>
        </div>
    )
}

export default Study