"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import httpStatus from "@/lib/http-status";
import { useForm } from "react-hook-form";
import { toast } from "react-toastify";
import { signIn, SignInResponse } from "next-auth/react";

const Login = () => {
    const [isClient, setIsClient] = useState(false);
    const [message, setMessage] = useState("");
    const {
        register,
        handleSubmit,
        watch,
        formState: {errors},
    } = useForm();

    useEffect(() => {
        setIsClient(true);
    }, []);

    if (!isClient) return null;

    const onSubmit = async (data) => {
        const result: SignInResponse | undefined = await signIn("credentials", {
            email: data.email,
            password: data.password,
            redirect: false,
        });

        if (result?.status === httpStatus.UNAUTHORIZED) {
            // If there is an error, update the state to display the error message
            setMessage("Invalid credentials");
        } else {
            toast.success("Logged in successfully");
            setTimeout(() => {
                window.location.reload();
            }, 500);
        }
    }

    return (
        <>
            <div className="flex min-h-full flex-1 flex-col justify-center px-6 py-12 lg:px-8">
                <div className="sm:mx-auto sm:w-full sm:max-w-sm">
                    <img
                        alt="Your Company"
                        src="/logo.svg"
                        className="mx-auto h-10 w-auto"
                    />
                    <h2 className="mt-10 text-center text-2xl/9 font-bold tracking-tight text-white">
                        Sign in to your account
                    </h2>
                </div>

                <div className="mt-10 sm:mx-auto sm:w-full sm:max-w-sm">
                    <form onSubmit={handleSubmit(onSubmit)} method="POST" className="space-y-6">
                        <div>
                            <label htmlFor="email" className="block text-sm/6 font-medium text-white">
                                Email
                            </label>
                            <div className="mt-2">
                                <input
                                    {...register("email", {required: true})}
                                    id="email"
                                    name="email"
                                    type="email"
                                    required
                                    autoComplete="email"
                                    className="block w-full rounded-md border-0 bg-white/5 py-1.5 text-white shadow-sm ring-1 ring-inset ring-white/10 focus:ring-2 focus:ring-inset focus:ring-indigo-500 sm:text-sm/6"
                                />
                            </div>
                        </div>

                        <div>
                            <div className="flex items-center justify-between">
                                <label htmlFor="password" className="block text-sm/6 font-medium text-white">
                                    Password
                                </label>
                                <div className="text-sm">
                                    <a href="#" className="font-semibold text-indigo-400 hover:text-indigo-300">
                                        Forgot password?
                                    </a>
                                </div>
                            </div>
                            <div className="mt-2">
                                <input
                                    {...register("password", {required: true})}
                                    id="password"
                                    name="password"
                                    type="password"
                                    required
                                    autoComplete="current-password"
                                    className="block w-full rounded-md border-0 bg-white/5 py-1.5 text-white shadow-sm ring-1 ring-inset ring-white/10 focus:ring-2 focus:ring-inset focus:ring-indigo-500 sm:text-sm/6"
                                />
                            </div>
                        </div>

                        {
                            message && <p className='text-red-500 text-xs italic mb-3'>{message}</p>
                        }

                        <div>
                            <button
                                type="submit"
                                className="flex w-full justify-center rounded-md bg-indigo-500 px-3 py-1.5 text-sm/6 font-semibold text-white shadow-sm hover:bg-indigo-400 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-500"
                            >
                                Login
                            </button>
                        </div>
                    </form>

                    <p className="mt-10 text-center text-sm/6 text-gray-400">
                        Not a member?{' '}
                        <Link href="/register" className="font-semibold text-indigo-400 hover:text-indigo-300">
                            Register here
                        </Link>
                    </p>
                </div>
            </div>
        </>
    )
};

export default Login;