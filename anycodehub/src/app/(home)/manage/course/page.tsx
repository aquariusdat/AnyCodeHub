'use client';

import { useEffect } from 'react';
import { redirect } from 'next/navigation';

const ManageCoursePage = () => {
  useEffect(() => {
    redirect('/admin/course');
  }, []);

  return null;
};

export default ManageCoursePage;