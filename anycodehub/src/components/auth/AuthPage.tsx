"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useSearchParams, useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { toast, Toaster } from "react-hot-toast";
import { authService } from "../../services/auth.service";
import { RegisterRequest, LoginRequest } from '../../types/auth';
import { Loading } from '../common/Loading';
import { authStore } from '../../services/auth.store';

type AuthMode = "signin" | "signup";

interface SignUpFormData extends RegisterRequest {}

interface SignInFormData extends LoginRequest { }

// Validation schema
const signUpSchema = yup.object().shape({
    firstName: yup.string().required('First name is required'),
    lastName: yup.string().required('Last name is required'),
    email: yup.string().email('Invalid email format').required('Email is required'),
    phoneNumber: yup
        .string()
        .required('Phone number is required')
        .test('isValidPhoneNumber', 'Invalid phone number format', (value) => {
            // if (!value) return false;
            // try {
            //     const phoneNumber = parsePhoneNumber(value);
            //     return phoneNumber?.isValid() || false;
            // } catch {
            //     return false;
            // }
            return true;
        }),
    password: yup
        .string()
        .min(8, "Password must be at least 8 characters")
        .max(30, "Password must not exceed 30 characters")
        .matches(/[A-Z]+/, "Password must contain at least one uppercase letter")
        .matches(/[a-z]+/, "Password must contain at least one lowercase letter")
        .matches(/[0-9]+/, "Password must contain at least one number")
        .matches(/(?=.*\W)/, "Password must contain at least one special character")
        .required("Password is required"),
    passwordConfirmed: yup
        .string()
        .required('Password confirmation is required')
        .oneOf([yup.ref('password')], 'Passwords do not match'),
    birthOfDate: yup.string().required('Date of birth is required'),
});

const signInSchema = yup.object().shape({
    email: yup.string().email('Invalid email format').required('Email is required'),
    password: yup.string().required('Password is required'),
});

export const AuthPage = () => {
    const searchParams = useSearchParams();
    const router = useRouter();
    const [authMode, setAuthMode] = useState<AuthMode>("signin");
    const [isLoading, setIsLoading] = useState(false);
    const [isAnimating, setIsAnimating] = useState(false);

    const signUpForm = useForm<SignUpFormData>({
        resolver: yupResolver(signUpSchema),
    });

    const signInForm = useForm<SignInFormData>({
        resolver: yupResolver(signInSchema),
    });
    
    // Check if user is already logged in and redirect to home page
    useEffect(() => {
        if (authStore.isAuthenticated()) {
            router.push('/');
        }
    }, [router]);
    
    const onSignUp = async (data: SignUpFormData) => {
        try {
            setIsLoading(true);
            setIsAnimating(true);

            const response = await authService.register(data);
            console.log(response);
            if (response.isSuccess) {
                toast.success('Registration successful! Please sign in.');
                signUpForm.reset();
                setAuthMode('signin');
            } else {
                toast.error(response.error?.message || 'Registration failed');
            }
        } catch {
            toast.error('An error occurred. Please try again.');
        } finally {
            setIsLoading(false);
            setIsAnimating(false);
        }
    };

    const onSignIn = async (data: SignInFormData) => {
        try {
            setIsLoading(true);
            setIsAnimating(true);

            const response = await authService.login(data);
            if (response.isSuccess) {
                authStore.setAuth(response);

                toast.success('Login successful!');

                router.push('/');
            } else {
                toast.error(response.error?.message || 'Login failed.');
            }
        } catch (error) {
            toast.error('An error occurred. Please try again.');
        } finally {
            setIsLoading(false);
            setIsAnimating(false);
        }
    };

    // Set initial auth mode from URL param if present
    useEffect(() => {
        const mode = searchParams.get("mode");
        if (mode === "signup") {
            setAuthMode("signup");
        } else if (mode === "signin") {
            setAuthMode("signin");
        }
    }, [searchParams]);

    const toggleAuthMode = () => {
        setIsAnimating(true);
        setTimeout(() => {
            setAuthMode(authMode === "signin" ? "signup" : "signin");
            setTimeout(() => {
                setIsAnimating(false);
            }, 50);
        }, 400);
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 dark:from-grayDarkest dark:to-gray-900 flex items-center justify-center p-0 sm:p-2 md:p-4 relative">
            <Toaster
                position="bottom-right"
                toastOptions={{
                    duration: 5000,
                    style: {
                        background: '#333',
                        color: '#fff',
                        borderRadius: '8px',
                    },
                    success: {
                        style: {
                            background: 'rgba(34, 197, 94, 0.9)',
                        },
                    },
                    error: {
                        style: {
                            background: 'rgba(239, 68, 68, 0.9)',
                        },
                    },
                }}
            />
            {isLoading && <Loading fullScreen />}
            <div className="w-full min-h-screen sm:min-h-0 max-w-5xl flex flex-col md:flex-row rounded-none sm:rounded-2xl md:rounded-3xl overflow-hidden shadow-md sm:shadow-2xl bg-white dark:bg-grayDarker backdrop-blur-sm border-0 sm:border sm:border-gray-100 sm:dark:border-gray-800">
                {/* Form Section */}
                <div className="w-full md:w-1/2 p-4 sm:p-5 md:p-8 flex flex-col justify-center">
                    <div className="w-full max-w-md mx-auto">
                        {/* Back to Home Button - Consistent design for all screen sizes */}
                        <div className="flex justify-start mb-4">
                            <Link href="/" className="inline-flex items-center gap-2 px-3 py-1.5 rounded-lg bg-gray-100 dark:bg-grayDarker text-primary dark:text-primary hover:bg-gray-200 dark:hover:bg-grayDarker/80 transition-all duration-300">
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                                    <path fillRule="evenodd" d="M9.707 16.707a1 1 0 01-1.414 0l-6-6a1 1 0 010-1.414l6-6a1 1 0 011.414 1.414L5.414 9H17a1 1 0 110 2H5.414l4.293 4.293a1 1 0 010 1.414z" clipRule="evenodd" />
                                </svg>
                                <span className="text-xs sm:text-sm font-medium">Back to AnyCodeHub</span>
                            </Link>
                        </div>

                        <div
                            className={`text-center mb-3 sm:mb-4 md:mb-6 transition-all duration-500 ease-in-out transform ${isAnimating ? "opacity-0 -translate-y-8" : "opacity-100 translate-y-0"
                                }`}
                        >
                            <div className="inline-block p-2 sm:p-3 rounded-full bg-primary/10 dark:bg-primary/20 mb-3 sm:mb-4 backdrop-blur-sm">
                                <svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    className="h-6 w-6 sm:h-8 sm:w-8 text-primary dark:text-primary"
                                    viewBox="0 0 20 20"
                                    fill="currentColor"
                                >
                                    <path d="M10.394 2.08a1 1 0 00-.788 0l-7 3a1 1 0 000 1.84L5.25 8.051a.999.999 0 01.356-.257l4-1.714a1 1 0 11.788 1.838L7.667 9.088l1.94.831a1 1 0 00.787 0l7-3a1 1 0 000-1.838l-7-3zM3.31 9.397L5 10.12v4.102a8.969 8.969 0 00-1.05-.174 1 1 0 01-.89-.89 11.115 11.115 0 01.25-3.762zM9.3 16.573A9.026 9.026 0 007 14.935v-3.957l1.818.78a3 3 0 002.364 0l5.508-2.361a11.026 11.026 0 01.25 3.762 1 1 0 01-.89.89 8.968 8.968 0 00-5.35 2.524 1 1 0 01-1.4 0zM6 18a1 1 0 001-1v-2.065a8.935 8.935 0 00-2-.712V17a1 1 0 001 1z" />
                                </svg>
                            </div>
                            <h2 className="text-xl sm:text-2xl md:text-3xl font-bold text-gray-800 dark:text-white mb-1 sm:mb-2">
                                {authMode === "signin" ? "Welcome to AnyCodeHub" : "Join AnyCodeHub Learning"}
                            </h2>
                            <p className="text-xs sm:text-sm text-gray-500 dark:text-gray-400">
                                {authMode === "signin" ? "Sign in to access your coding courses and continue learning" : "Create an account to start your coding journey with us"}
                            </p>
                        </div>

                        {/* Form Container with Animation */}
                        <div
                            className={`transition-all duration-500 ease-in-out transform ${isAnimating ? "opacity-0 scale-95" : "opacity-100 scale-100"
                                }`}
                        >
                            {/* Sign In Form */}
                            {authMode === "signin" && (
                                <form className="space-y-3 sm:space-y-4" onSubmit={signInForm.handleSubmit(onSignIn)}>
                                    <div className="relative">
                                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                            <svg
                                                className="h-4 w-4 sm:h-5 sm:w-5 text-primary"
                                                xmlns="http://www.w3.org/2000/svg"
                                                viewBox="0 0 20 20"
                                                fill="currentColor"
                                            >
                                                <path d="M2.003 5.884L10 9.882l7.997-3.998A2 2 0 0016 4H4a2 2 0 00-1.997 1.884z" />
                                                <path d="M18 8.118l-8 4-8-4V14a2 2 0 002 2h12a2 2 0 002-2V8.118z" />
                                            </svg>
                                        </div>
                                        <input
                                            type="email"
                                            placeholder="Email"
                                            className="w-full pl-9 sm:pl-10 pr-4 py-2.5 sm:py-3 bg-gray-50 dark:bg-grayDarkest border border-gray-200 dark:border-gray-700 rounded-lg sm:rounded-xl focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent dark:text-white transition-all duration-200 text-sm"
                                            {...signInForm.register("email")}
                                        />
                                    </div>
                                    <div className="relative">
                                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                            <svg
                                                className="h-4 w-4 sm:h-5 sm:w-5 text-primary"
                                                xmlns="http://www.w3.org/2000/svg"
                                                viewBox="0 0 20 20"
                                                fill="currentColor"
                                            >
                                                <path
                                                    fillRule="evenodd"
                                                    d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z"
                                                    clipRule="evenodd"
                                                />
                                            </svg>
                                        </div>
                                        <input
                                            type="password"
                                            placeholder="Password"
                                            className="w-full pl-9 sm:pl-10 pr-4 py-2.5 sm:py-3 bg-gray-50 dark:bg-grayDarkest border border-gray-200 dark:border-gray-700 rounded-lg sm:rounded-xl focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent dark:text-white transition-all duration-200 text-sm"
                                            {...signInForm.register("password")}
                                        />
                                    </div>
                                    <div className="text-right">
                                        <Link
                                            href="/forgot-password"
                                            className="text-xs sm:text-sm text-primary dark:text-primary hover:text-primary/80 dark:hover:text-primary/80 font-medium"
                                        >
                                            Forgot password?
                                        </Link>
                                    </div>
                                    <div>
                                        <button
                                            type="submit"
                                            disabled={isLoading}
                                            className={`group relative w-full flex justify-center py-2 sm:py-2.5 px-4 border border-transparent text-sm font-medium rounded-lg sm:rounded-xl text-white transition-all duration-300 ${isLoading
                                                ? "bg-gray-400 cursor-not-allowed"
                                                : "bg-primary hover:bg-primary/90 shadow-md hover:shadow-lg focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary"
                                                }`}
                                        >
                                            {isLoading ? "Processing..." : "Sign in to Learn"}
                                        </button>
                                    </div>
                                </form>
                            )}

                            {/* Sign Up Form */}
                            {authMode === "signup" && (
                                <form onSubmit={signUpForm.handleSubmit(onSignUp)} className="space-y-2 sm:space-y-3">
                                    <div className="grid grid-cols-2 gap-2 sm:gap-4">
                                        <div>
                                            <input
                                                type="text"
                                                placeholder="First Name"
                                                className={`w-full px-3 sm:px-4 py-2 sm:py-2.5 bg-gray-50 dark:bg-grayDarkest border rounded-lg sm:rounded-xl focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent dark:text-white transition-all duration-200 text-sm ${signUpForm.formState.errors.firstName
                                                    ? "border-red-400 focus:ring-red-400"
                                                    : "border-gray-200 dark:border-gray-700"
                                                    }`}
                                                {...signUpForm.register("firstName")}
                                            />
                                            {signUpForm.formState.errors.firstName && (
                                                <p className="mt-1 text-xs text-red-500">
                                                    {signUpForm.formState.errors.firstName.message}
                                                </p>
                                            )}
                                        </div>
                                        <div>
                                            <input
                                                type="text"
                                                placeholder="Last Name"
                                                className={`w-full px-3 sm:px-4 py-2 sm:py-2.5 bg-gray-50 dark:bg-grayDarkest border rounded-lg sm:rounded-xl focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent dark:text-white transition-all duration-200 text-sm ${signUpForm.formState.errors.lastName
                                                    ? "border-red-400 focus:ring-red-400"
                                                    : "border-gray-200 dark:border-gray-700"
                                                    }`}
                                                {...signUpForm.register("lastName")}
                                            />
                                            {signUpForm.formState.errors.lastName && (
                                                <p className="mt-1 text-xs text-red-500">
                                                    {signUpForm.formState.errors.lastName.message}
                                                </p>
                                            )}
                                        </div>
                                    </div>

                                    <div>
                                        <input
                                            type="date"
                                            className={`w-full px-3 sm:px-4 py-2 sm:py-2.5 bg-gray-50 dark:bg-grayDarkest border rounded-lg sm:rounded-xl focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent dark:text-white transition-all duration-200 text-sm ${signUpForm.formState.errors.birthOfDate
                                                ? "border-red-400 focus:ring-red-400"
                                                : "border-gray-200 dark:border-gray-700"
                                                }`}
                                            {...signUpForm.register("birthOfDate")}
                                        />
                                        {signUpForm.formState.errors.birthOfDate && (
                                            <p className="mt-1 text-xs text-red-500">
                                                {signUpForm.formState.errors.birthOfDate.message}
                                            </p>
                                        )}
                                    </div>

                                    <div>
                                        <input
                                            type="email"
                                            placeholder="Email"
                                            className={`w-full px-3 sm:px-4 py-2 sm:py-2.5 bg-gray-50 dark:bg-grayDarkest border rounded-lg sm:rounded-xl focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent dark:text-white transition-all duration-200 text-sm ${signUpForm.formState.errors.email
                                                ? "border-red-400 focus:ring-red-400"
                                                : "border-gray-200 dark:border-gray-700"
                                                }`}
                                            {...signUpForm.register("email")}
                                        />
                                        {signUpForm.formState.errors.email && (
                                            <p className="mt-1 text-xs text-red-500">
                                                {signUpForm.formState.errors.email.message}
                                            </p>
                                        )}
                                    </div>

                                    <div>
                                        <input
                                            type="tel"
                                            placeholder="Phone Number"
                                            className={`w-full px-3 sm:px-4 py-2 sm:py-2.5 bg-gray-50 dark:bg-grayDarkest border rounded-lg sm:rounded-xl focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent dark:text-white transition-all duration-200 text-sm ${signUpForm.formState.errors.phoneNumber
                                                ? "border-red-400 focus:ring-red-400"
                                                : "border-gray-200 dark:border-gray-700"
                                                }`}
                                            {...signUpForm.register("phoneNumber")}
                                        />
                                        {signUpForm.formState.errors.phoneNumber && (
                                            <p className="mt-1 text-xs text-red-500">
                                                {signUpForm.formState.errors.phoneNumber.message}
                                            </p>
                                        )}
                                    </div>

                                    <div>
                                        <input
                                            type="password"
                                            placeholder="Password"
                                            className={`w-full px-3 sm:px-4 py-2 sm:py-2.5 bg-gray-50 dark:bg-grayDarkest border rounded-lg sm:rounded-xl focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent dark:text-white transition-all duration-200 text-sm ${signUpForm.formState.errors.password
                                                ? "border-red-400 focus:ring-red-400"
                                                : "border-gray-200 dark:border-gray-700"
                                                }`}
                                            {...signUpForm.register("password")}
                                        />
                                        {signUpForm.formState.errors.password && (
                                            <p className="mt-1 text-xs text-red-500">
                                                {signUpForm.formState.errors.password.message}
                                            </p>
                                        )}
                                    </div>

                                    <div>
                                        <input
                                            type="password"
                                            placeholder="Confirm Password"
                                            className={`w-full px-3 sm:px-4 py-2 sm:py-2.5 bg-gray-50 dark:bg-grayDarkest border rounded-lg sm:rounded-xl focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent dark:text-white transition-all duration-200 text-sm ${signUpForm.formState.errors.passwordConfirmed
                                                ? "border-red-400 focus:ring-red-400"
                                                : "border-gray-200 dark:border-gray-700"
                                                }`}
                                            {...signUpForm.register("passwordConfirmed")}
                                        />
                                        {signUpForm.formState.errors.passwordConfirmed && (
                                            <p className="mt-1 text-xs text-red-500">
                                                {signUpForm.formState.errors.passwordConfirmed.message}
                                            </p>
                                        )}
                                    </div>

                                    <div>
                                        <button
                                            type="submit"
                                            disabled={isLoading}
                                            className={`group relative w-full flex justify-center py-2 sm:py-2.5 px-4 border border-transparent text-sm font-medium rounded-lg sm:rounded-xl text-white transition-all duration-300 ${isLoading
                                                ? "bg-gray-400 cursor-not-allowed"
                                                : "bg-primary hover:bg-primary/90 shadow-md hover:shadow-lg focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary"
                                                }`}
                                        >
                                            {isLoading ? "Processing..." : "Start Learning Now"}
                                        </button>
                                    </div>
                                </form>
                            )}

                            {/* Social Login */}
                            <div className="mt-4 sm:mt-5">
                                <div className="relative">
                                    <div className="absolute inset-0 flex items-center">
                                        <div className="w-full border-t border-gray-200 dark:border-gray-700"></div>
                                    </div>
                                    <div className="relative flex justify-center text-sm">
                                        <span className="px-3 bg-white dark:bg-grayDarker text-gray-500 dark:text-gray-400 text-xs sm:text-sm">
                                            Or continue with
                                        </span>
                                    </div>
                                </div>

                                <div className="mt-4 grid grid-cols-3 gap-2 sm:gap-3">
                                    <button className="w-full inline-flex justify-center py-2 px-2 sm:px-4 border border-gray-200 dark:border-gray-700 rounded-lg sm:rounded-xl shadow-sm bg-white dark:bg-grayDarkest text-sm font-medium text-gray-500 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-grayDarker transition-colors duration-300">
                                        <svg
                                            className="h-5 w-5"
                                            fill="currentColor"
                                            viewBox="0 0 24 24"
                                            aria-hidden="true"
                                        >
                                            <path d="M12.48 10.92v3.28h7.84c-.24 1.84-.853 3.187-1.787 4.133-1.147 1.147-2.933 2.4-6.053 2.4-4.827 0-8.6-3.893-8.6-8.72s3.773-8.72 8.6-8.72c2.6 0 4.507 1.027 5.907 2.347l2.307-2.307C18.747 1.44 16.133 0 12.48 0 5.867 0 .307 5.387.307 12s5.56 12 12.173 12c3.573 0 6.267-1.173 8.373-3.36 2.16-2.16 2.84-5.213 2.84-7.667 0-.76-.053-1.467-.173-2.053H12.48z" />
                                        </svg>
                                    </button>
                                    <button className="w-full inline-flex justify-center py-2 px-2 sm:px-4 border border-gray-200 dark:border-gray-700 rounded-lg sm:rounded-xl shadow-sm bg-white dark:bg-grayDarkest text-sm font-medium text-gray-500 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-grayDarker transition-colors duration-300">
                                        <svg
                                            className="h-5 w-5"
                                            fill="currentColor"
                                            viewBox="0 0 24 24"
                                            aria-hidden="true"
                                        >
                                            <path
                                                fillRule="evenodd"
                                                d="M22 12c0-5.523-4.477-10-10-10S2 6.477 2 12c0 4.991 3.657 9.128 8.438 9.878v-6.987h-2.54V12h2.54V9.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V12h2.773l-.443 2.89h-2.33v6.988C18.343 21.128 22 16.991 22 12z"
                                                clipRule="evenodd"
                                            />
                                        </svg>
                                    </button>
                                    <button className="w-full inline-flex justify-center py-2 px-2 sm:px-4 border border-gray-200 dark:border-gray-700 rounded-lg sm:rounded-xl shadow-sm bg-white dark:bg-grayDarkest text-sm font-medium text-gray-500 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-grayDarker transition-colors duration-300">
                                        <svg
                                            className="h-5 w-5"
                                            fill="currentColor"
                                            viewBox="0 0 24 24"
                                            aria-hidden="true"
                                        >
                                            <path
                                                fillRule="evenodd"
                                                d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z"
                                                clipRule="evenodd"
                                            />
                                        </svg>
                                    </button>
                                </div>
                            </div>

                            {/* Toggle between Sign In/Up */}
                            <div className="mt-4 sm:mt-5 text-center">
                                <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-400">
                                    {authMode === "signin" ? "Don't have an account? " : "Already have an account? "}
                                    <button
                                        className="font-medium text-primary dark:text-primary hover:text-primary/80 dark:hover:text-primary/80 transition-colors"
                                        onClick={toggleAuthMode}
                                        disabled={isAnimating}
                                    >
                                        {authMode === "signin" ? "Sign up" : "Sign in"}
                                    </button>
                                </p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Right Section - E-learning coding theme */}
                <div className="w-full md:w-1/2 bg-primary dark:bg-primary/90 p-6 sm:p-6 md:p-8 lg:p-12 flex flex-col justify-center items-center text-white overflow-hidden relative min-h-[200px] sm:min-h-[250px] md:min-h-full">
                    {/* Mobile-only mini version */}
                    <div className="flex md:hidden flex-col items-center justify-center w-full">
                        <div className="w-12 h-12 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center mb-3">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" />
                            </svg>
                        </div>
                        <h3 className="text-lg font-bold mb-1">
                            {authMode === "signin" ? "Welcome Back Coder!" : "Start Coding Today"}
                        </h3>
                    </div>

                    {/* Desktop version - hidden on mobile */}
                    <div
                        className={`relative z-10 text-center max-w-md hidden md:flex flex-col items-center transition-all duration-500 ease-in-out transform ${isAnimating ? "opacity-0 translate-y-8" : "opacity-100 translate-y-0"
                            }`}
                    >
                        <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center mb-4 sm:mb-6">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 sm:h-10 sm:w-10 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" />
                            </svg>
                        </div>
                        
                        <h2 className="text-xl sm:text-2xl md:text-3xl font-bold mb-2 sm:mb-4">
                            {authMode === "signin" ? "Welcome Back to AnyCodeHub!" : "Start Your Coding Journey"}
                        </h2>
                        <p className="mb-4 sm:mb-6 opacity-90 text-white/90 text-xs sm:text-sm">
                            {authMode === "signin"
                                ? "Access your personalized learning path, coding exercises, and continue building your programming skills."
                                : "Join thousands of students learning to code. Interactive lessons, live coding sessions, and hands-on projects await you."}
                        </p>
                        
                        <div className="flex flex-wrap justify-center gap-2 sm:gap-3">
                            <div className="bg-white/10 backdrop-blur-sm px-3 py-1.5 sm:px-4 sm:py-2 rounded-full flex items-center space-x-2 text-xs sm:text-sm">
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 sm:h-5 sm:w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
                                </svg>
                                <span>Video Tutorials</span>
                            </div>
                            <div className="bg-white/10 backdrop-blur-sm px-3 py-1.5 sm:px-4 sm:py-2 rounded-full flex items-center space-x-2 text-xs sm:text-sm">
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 sm:h-5 sm:w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                                </svg>
                                <span>Coding Challenges</span>
                            </div>
                            <div className="bg-white/10 backdrop-blur-sm px-3 py-1.5 sm:px-4 sm:py-2 rounded-full flex items-center space-x-2 text-xs sm:text-sm">
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 sm:h-5 sm:w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                                </svg>
                                <span>Community Support</span>
                            </div>
                        </div>

                        {/* Course levels */}
                        <div className="mt-6 w-full">
                            <div className="flex justify-between items-center mb-2">
                                <span className="text-xs font-medium">Beginner</span>
                                <span className="text-xs font-medium">Advanced</span>
                            </div>
                            <div className="h-2 w-full bg-white/10 rounded-full overflow-hidden">
                                <div className="h-full bg-gradient-to-r from-green-400 via-yellow-400 to-red-400 w-full"></div>
                            </div>
                            <div className="text-center mt-2 text-xs opacity-80">Courses for all skill levels</div>
                        </div>
                    </div>

                    {/* Code snippets in background */}
                    <div className="absolute bottom-4 right-4 text-xs font-mono text-white/20 transform rotate-5">
                        <pre className="hidden sm:block">
{`function learnToCode() {
  const skills = [];
  const practice = true;
  
  while (practice) {
    skills.push("new knowledge");
    if (skills.length > 100) {
      return "You're a pro!";
    }
  }
}`}
                        </pre>
                    </div>

                    {/* Animated decoration elements */}
                    <div className="absolute top-0 right-0 w-64 h-64 rounded-full bg-white opacity-10 blur-3xl animate-float"></div>
                    <div className="absolute bottom-0 left-0 w-80 h-80 rounded-full bg-white opacity-10 blur-3xl animate-float-delay"></div>
                    <div className="absolute top-1/4 left-1/4 w-40 h-40 rounded-full bg-white opacity-10 blur-2xl animate-float-slow"></div>
                </div>
            </div>
        </div>
    );
};

// Add animations to global CSS
if (typeof document !== 'undefined') {
    const style = document.createElement('style');
    style.textContent = `
        @keyframes float {
            0% { transform: translateY(0px); }
            50% { transform: translateY(-20px); }
            100% { transform: translateY(0px); }
        }
        @keyframes float-delay {
            0% { transform: translateY(0px); }
            50% { transform: translateY(-15px); }
            100% { transform: translateY(0px); }
        }
        @keyframes float-slow {
            0% { transform: translateY(0px); }
            50% { transform: translateY(-10px); }
            100% { transform: translateY(0px); }
        }
        .animate-float {
            animation: float 15s ease-in-out infinite;
        }
        .animate-float-delay {
            animation: float-delay 18s ease-in-out infinite;
        }
        .animate-float-slow {
            animation: float-slow 20s ease-in-out infinite;
        }
    `;
    document.head.appendChild(style);
}

export default AuthPage; 