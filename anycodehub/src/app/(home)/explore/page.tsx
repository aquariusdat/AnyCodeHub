import { CourseGrid } from '@/components/common'
import CourseItem from '@/components/course/courseItem'
import Heading from '@/components/typoraphy/heading'
import React from 'react'

const Explore = () => {
    return (
        <div className='explore'>
            <Heading>Khám phá</Heading>
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

export default Explore