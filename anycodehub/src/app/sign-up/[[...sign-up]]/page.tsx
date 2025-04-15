"use client";

import { useEffect } from 'react';
import { redirect, useRouter } from 'next/navigation';
import { authStore } from '@/services/auth.store';

export default function Page() {
    const router = useRouter();
    
    useEffect(() => {
        // If already authenticated, redirect to home
        if (authStore.isAuthenticated()) {
            router.push('/');
        } else {
            // Otherwise redirect to auth page with signup mode
            router.push('/auth?mode=signup');
        }
    }, [router]);
    
    // Show loading or nothing while redirecting
    return null;
}