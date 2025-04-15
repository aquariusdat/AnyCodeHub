"use client";

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import AuthPage from "@/components/auth/AuthPage";
import { authStore } from '@/services/auth.store';

export default function AuthenticationPage() {
    const router = useRouter();
    
    useEffect(() => {
        // If already authenticated, redirect to home
        if (authStore.isAuthenticated()) {
            router.push('/');
        }
    }, [router]);
    
    return <AuthPage />;
} 