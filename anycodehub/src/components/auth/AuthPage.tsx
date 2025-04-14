"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
// import { isValidPhoneNumber } from 'libphonenumber-js';

type AuthMode = "signin" | "signup";

interface FormData {
    firstName: string;
    lastName: string;
    birthOfDate: string;
    email: string;
    phoneNumber: string;
    password: string;
    passwordConfirmed: string;
}

// Validation schema
const signUpSchema = yup.object().shape({
    firstName: yup.string().required("First name is required"),
    lastName: yup.string().required("Last name is required"),
    birthOfDate: yup.string().required("Birth date is required"),
    email: yup
        .string()
        .email("Invalid email format")
        .min(10, "Email must be at least 10 characters")
        .max(50, "Email must not exceed 50 characters")
        .required("Email is required"),
    phoneNumber: yup
        .string()
        .test("isValidPhoneNumber", "Invalid phone number", (value) => {
            // if (!value) return false;
            // return isValidPhoneNumber(value);
            return true;
        })
        .required("Phone number is required"),
    password: yup
        .string()
        .min(8, "Your password length must be at least 8.")
        .max(30, "Your password length must not exceed 30.")
        .matches(/[A-Z]+/, "Your password must contain at least one uppercase letter.")
        .matches(/[a-z]+/, "Your password must contain at least one lowercase letter.")
        .matches(/[0-9]+/, "Your password must contain at least one number.")
        .matches(/(?=.*\W)/, "Your password must contain at least one special character.")
        .required("Password is required"),
    passwordConfirmed: yup
        .string()
        .oneOf([yup.ref("password")], "Passwords must match")
        .required("Confirm password is required"),
});

const AuthPage = () => {
    const searchParams = useSearchParams();
    const [authMode, setAuthMode] = useState<AuthMode>("signin");
    const [isAnimating, setIsAnimating] = useState(false);

    const {
        register,
        handleSubmit,
        formState: { errors },
        reset
    } = useForm<FormData>({
        resolver: yupResolver(signUpSchema)
    });

    const onSubmit = (data: FormData) => {
        console.log(data);
        // reset();
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
        <div className="flex items-center justify-center min-h-[100dvh] w-full p-4 md:p-8 bg-gray-50 dark:bg-gray-900">
            <div className="w-full max-w-5xl flex flex-col md:flex-row rounded-3xl overflow-hidden shadow-2xl bg-white dark:bg-gray-800">
                {/* Form Section */}
                <div className="w-full md:w-1/2 p-8 md:p-10 flex flex-col justify-center">
                    <div className="w-full max-w-md mx-auto">
                        <div
                            className={`text-center mb-8 transition-all duration-500 ease-in-out transform ${isAnimating ? 'opacity-0 -translate-y-8' : 'opacity-100 translate-y-0'
                                }`}
                        >
                            <div className="inline-block p-3 rounded-full bg-purple-100 dark:bg-purple-900 mb-4">
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-purple-600 dark:text-purple-300" viewBox="0 0 20 20" fill="currentColor">
                                    <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" />
                                </svg>
                            </div>
                            <h2 className="text-2xl md:text-3xl font-bold text-gray-800 dark:text-white mb-2">
                                {authMode === "signin" ? "Hello!" : "Hello, friend!"}
                            </h2>
                            <p className="text-gray-500 dark:text-gray-400 text-sm">
                                {authMode === "signin" ? "Sign in to your account" : "Register for an account"}
                            </p>
                        </div>

                        {/* Form Container with Animation */}
                        <div className={`transition-all duration-500 ease-in-out transform ${isAnimating ? 'opacity-0 scale-95' : 'opacity-100 scale-100'
                            }`}>
                            {/* Sign In Form */}
                            {authMode === "signin" && (
                                <form className="space-y-4" onSubmit={handleSubmit(onSubmit)}>
                                    <div className="relative">
                                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                            <svg className="h-5 w-5 text-purple-500" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                                                <path d="M2.003 5.884L10 9.882l7.997-3.998A2 2 0 0016 4H4a2 2 0 00-1.997 1.884z" />
                                                <path d="M18 8.118l-8 4-8-4V14a2 2 0 002 2h12a2 2 0 002-2V8.118z" />
                                            </svg>
                                        </div>
                                        <input
                                            type="email"
                                            placeholder="Email"
                                            className="w-full pl-10 pr-4 py-3 bg-gray-100 dark:bg-gray-700 border border-transparent rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent dark:text-white"
                                            {...register("email")}
                                        />
                                    </div>
                                    <div className="relative">
                                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                            <svg className="h-5 w-5 text-purple-500" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                                                <path fillRule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clipRule="evenodd" />
                                            </svg>
                                        </div>
                                        <input
                                            type="password"
                                            placeholder="Password"
                                            className="w-full pl-10 pr-4 py-3 bg-gray-100 dark:bg-gray-700 border border-transparent rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent dark:text-white"
                                            {...register("password")}
                                        />
                                    </div>
                                    <div className="text-right">
                                        <Link href="/forgot-password" className="text-sm text-purple-600 dark:text-purple-400 hover:text-purple-800 dark:hover:text-purple-300">
                                            Forgot password?
                                        </Link>
                                    </div>
                                    <button
                                        type="submit"
                                        className="w-full py-3 px-4 bg-purple-600 hover:bg-purple-700 text-white font-medium rounded-lg transition-all duration-300 transform hover:scale-105"
                                    >
                                        SIGN IN
                                    </button>
                                </form>
                            )}

                            {/* Sign Up Form */}
                            {authMode === "signup" && (
                                <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                                    <div className="grid grid-cols-2 gap-4">
                                        <div>
                                            <input
                                                type="text"
                                                placeholder="First Name"
                                                className={`w-full px-4 py-3 bg-gray-100 dark:bg-gray-700 border rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent dark:text-white ${errors.firstName ? "border-red-500" : "border-transparent"
                                                    }`}
                                                {...register("firstName")}
                                            />
                                            {errors.firstName && (
                                                <p className="mt-1 text-sm text-red-500">{errors.firstName.message}</p>
                                            )}
                                        </div>
                                        <div>
                                            <input
                                                type="text"
                                                placeholder="Last Name"
                                                className={`w-full px-4 py-3 bg-gray-100 dark:bg-gray-700 border rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent dark:text-white ${errors.lastName ? "border-red-500" : "border-transparent"
                                                    }`}
                                                {...register("lastName")}
                                            />
                                            {errors.lastName && (
                                                <p className="mt-1 text-sm text-red-500">{errors.lastName.message}</p>
                                            )}
                                        </div>
                                    </div>

                                    <div>
                                        <input
                                            type="date"
                                            className={`w-full px-4 py-3 bg-gray-100 dark:bg-gray-700 border rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent dark:text-white ${errors.birthOfDate ? "border-red-500" : "border-transparent"
                                                }`}
                                            {...register("birthOfDate")}
                                        />
                                        {errors.birthOfDate && (
                                            <p className="mt-1 text-sm text-red-500">{errors.birthOfDate.message}</p>
                                        )}
                                    </div>

                                    <div>
                                        <input
                                            type="email"
                                            placeholder="Email"
                                            className={`w-full px-4 py-3 bg-gray-100 dark:bg-gray-700 border rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent dark:text-white ${errors.email ? "border-red-500" : "border-transparent"
                                                }`}
                                            {...register("email")}
                                        />
                                        {errors.email && (
                                            <p className="mt-1 text-sm text-red-500">{errors.email.message}</p>
                                        )}
                                    </div>

                                    <div>
                                        <input
                                            type="tel"
                                            placeholder="Phone Number"
                                            className={`w-full px-4 py-3 bg-gray-100 dark:bg-gray-700 border rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent dark:text-white ${errors.phoneNumber ? "border-red-500" : "border-transparent"
                                                }`}
                                            {...register("phoneNumber")}
                                        />
                                        {errors.phoneNumber && (
                                            <p className="mt-1 text-sm text-red-500">{errors.phoneNumber.message}</p>
                                        )}
                                    </div>

                                    <div>
                                        <input
                                            type="password"
                                            placeholder="Password"
                                            className={`w-full px-4 py-3 bg-gray-100 dark:bg-gray-700 border rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent dark:text-white ${errors.password ? "border-red-500" : "border-transparent"
                                                }`}
                                            {...register("password")}
                                        />
                                        {errors.password && (
                                            <p className="mt-1 text-sm text-red-500">{errors.password.message}</p>
                                        )}
                                    </div>

                                    <div>
                                        <input
                                            type="password"
                                            placeholder="Confirm Password"
                                            className={`w-full px-4 py-3 bg-gray-100 dark:bg-gray-700 border rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent dark:text-white ${errors.passwordConfirmed ? "border-red-500" : "border-transparent"
                                                }`}
                                            {...register("passwordConfirmed")}
                                        />
                                        {errors.passwordConfirmed && (
                                            <p className="mt-1 text-sm text-red-500">{errors.passwordConfirmed.message}</p>
                                        )}
                                    </div>

                                    <button
                                        type="submit"
                                        className="w-full py-3 px-4 bg-purple-600 hover:bg-purple-700 text-white font-medium rounded-lg transition-all duration-300 transform hover:scale-105"
                                    >
                                        CREATE ACCOUNT
                                    </button>
                                </form>
                            )}

                            {/* Social Login */}
                            <div className="mt-6">
                                <div className="relative">
                                    <div className="absolute inset-0 flex items-center">
                                        <div className="w-full border-t border-gray-300 dark:border-gray-600"></div>
                                    </div>
                                    <div className="relative flex justify-center text-sm">
                                        <span className="px-2 bg-white dark:bg-gray-800 text-gray-500 dark:text-gray-400">
                                            Or continue with
                                        </span>
                                    </div>
                                </div>

                                <div className="mt-6 grid grid-cols-3 gap-3">
                                    <button className="w-full inline-flex justify-center py-2 px-4 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm bg-white dark:bg-gray-700 text-sm font-medium text-gray-500 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-600 transition-colors duration-300">
                                        <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                                            <path d="M12.48 10.92v3.28h7.84c-.24 1.84-.853 3.187-1.787 4.133-1.147 1.147-2.933 2.4-6.053 2.4-4.827 0-8.6-3.893-8.6-8.72s3.773-8.72 8.6-8.72c2.6 0 4.507 1.027 5.907 2.347l2.307-2.307C18.747 1.44 16.133 0 12.48 0 5.867 0 .307 5.387.307 12s5.56 12 12.173 12c3.573 0 6.267-1.173 8.373-3.36 2.16-2.16 2.84-5.213 2.84-7.667 0-.76-.053-1.467-.173-2.053H12.48z" />
                                        </svg>
                                    </button>
                                    <button className="w-full inline-flex justify-center py-2 px-4 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm bg-white dark:bg-gray-700 text-sm font-medium text-gray-500 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-600 transition-colors duration-300">
                                        <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                                            <path fillRule="evenodd" d="M22 12c0-5.523-4.477-10-10-10S2 6.477 2 12c0 4.991 3.657 9.128 8.438 9.878v-6.987h-2.54V12h2.54V9.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V12h2.773l-.443 2.89h-2.33v6.988C18.343 21.128 22 16.991 22 12z" clipRule="evenodd" />
                                        </svg>
                                    </button>
                                    <button className="w-full inline-flex justify-center py-2 px-4 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm bg-white dark:bg-gray-700 text-sm font-medium text-gray-500 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-600 transition-colors duration-300">
                                        <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                                            <path fillRule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" clipRule="evenodd" />
                                        </svg>
                                    </button>
                                </div>
                            </div>

                            {/* Toggle between Sign In/Up */}
                            <div className="mt-8 text-center">
                                <p className="text-sm text-gray-600 dark:text-gray-400">
                                    {authMode === "signin" ? "Don't have an account? " : "Already have an account? "}
                                    <button
                                        className="font-medium text-purple-600 dark:text-purple-400 hover:text-purple-800 dark:hover:text-purple-300"
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

                {/* Purple Section */}
                <div className="w-full md:w-1/2 bg-gradient-to-br from-purple-600 to-purple-800 p-8 md:p-12 flex flex-col justify-center items-center text-white overflow-hidden relative">
                    {/* Content with animation */}
                    <div className={`relative z-10 text-center max-w-md flex flex-col items-center transition-all duration-500 ease-in-out transform ${isAnimating ? 'opacity-0 translate-y-8' : 'opacity-100 translate-y-0'
                        }`}>
                        <h2 className="text-2xl md:text-3xl font-bold mb-4">
                            {authMode === "signin" ? "Welcome Back!" : "Glad to see you!"}
                        </h2>
                        <p className="mb-8 opacity-90">
                            {authMode === "signin"
                                ? "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nulla id tincidunt turpis."
                                : "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nulla id tincidunt turpis."}
                        </p>
                    </div>

                    {/* Animated decoration elements */}
                    <div className="absolute top-0 right-0 w-32 h-32 rounded-full bg-purple-500 opacity-20 animate-float"></div>
                    <div className="absolute bottom-0 left-0 w-40 h-40 rounded-full bg-purple-500 opacity-20 animate-float-delay"></div>
                    <div className="absolute top-1/4 left-1/4 w-16 h-16 rounded-full bg-purple-500 opacity-20 animate-float-slow"></div>

                    {/* Add a simple decoration */}
                    <div className="absolute inset-0 flex items-center justify-center opacity-60">
                        <svg className="w-3/4 h-auto text-white" viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg">
                            <path fill="currentColor" d="M37.5,-48.1C52.6,-38.9,71.2,-33.5,79.4,-21.3C87.6,-9.1,85.3,10,76.8,25.1C68.4,40.3,53.8,51.5,38.3,58.8C22.8,66.1,6.4,69.3,-9.7,68.3C-25.8,67.3,-41.6,62,-51.1,51.3C-60.6,40.6,-63.9,24.5,-65.7,8.8C-67.6,-6.9,-68,-22.3,-60.6,-33.6C-53.2,-45,-38,-52.3,-23.9,-61.8C-9.8,-71.3,3.2,-82.8,13.9,-78C24.5,-73.1,42.8,-52,37.5,-48.1Z" transform="translate(100 100)" />
                        </svg>
                    </div>
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
            animation: float 6s ease-in-out infinite;
        }
        .animate-float-delay {
            animation: float-delay 8s ease-in-out infinite;
        }
        .animate-float-slow {
            animation: float-slow 10s ease-in-out infinite;
        }
    `;
    document.head.appendChild(style);
}

export default AuthPage; 