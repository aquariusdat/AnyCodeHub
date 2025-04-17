'use client';

import { useEffect } from 'react';
import { redirect } from 'next/navigation';
import CourseAddNew from "@/components/course/courseAddNew";
import Heading from "@/components/typoraphy/heading";

const CreateCoursePage = () => {
    useEffect(() => {
        redirect('/admin/course/create');
    }, []);

    return null;
}

export default CreateCoursePage;