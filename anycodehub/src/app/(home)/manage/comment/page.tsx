'use client';

import { useEffect } from 'react';
import { redirect } from 'next/navigation';
import Heading from "@/components/typoraphy/heading"

const ManageCommentPage = () => {
  useEffect(() => {
    redirect('/admin/comment');
  }, []);

  return null;
};

export default ManageCommentPage