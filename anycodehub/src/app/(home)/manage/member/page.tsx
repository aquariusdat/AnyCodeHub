'use client';

import { useEffect } from 'react';
import { redirect } from 'next/navigation';

const ManageMemberPage = () => {
  useEffect(() => {
    redirect('/admin/member');
  }, []);

  return null;
};

export default ManageMemberPage;