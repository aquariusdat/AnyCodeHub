import { CourseGrid } from '@/components/common'
import CourseItem from '@/components/course/courseItem'
import Heading from '@/components/typoraphy/heading'
import createUser from '@/lib/actions/user.actions'
import React from 'react'

const Explore = async () => {
    const user  = await createUser({
        clerkId: 'clertId_1',
        emailAddress: 'tondat.dev@gmail.com',
        userName: 'tondat.dev',
    });

    console.log(user);

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