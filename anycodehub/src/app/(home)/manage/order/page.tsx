'use client';

import { useEffect } from 'react';
import { redirect } from 'next/navigation';
import Heading from "@/components/typoraphy/heading"

const ManageOrderPage = () => {
  useEffect(() => {
    redirect('/admin/order');
  }, []);

  return null;
};

export default ManageOrderPage