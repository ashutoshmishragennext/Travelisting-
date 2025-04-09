"use client";

import { loginUser } from "@/actions/auth/";
import { FormError } from "@/components/form-error";
import { FormSuccess } from "@/components/form-success";
import { IoEye, IoEyeOff } from "react-icons/io5";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/ui/form";
import { LoginSchema } from "@/schemas";
import { zodResolver } from "@hookform/resolvers/zod";
import Link from "next/link";
import { useState, useTransition } from "react";
import { useForm } from "react-hook-form";
import * as z from "zod";

function LoginForm({ api }: any) {
  const [showPassword, setShowPassword] = useState(false);
  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const [error, setError] = useState<string | undefined>(undefined);
  const [success, setSuccess] = useState<string | undefined>(undefined);
  const [isPending, startTransition] = useTransition();

  const form = useForm<z.infer<typeof LoginSchema>>({
    resolver: zodResolver(LoginSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  async function onSubmit(data: z.infer<typeof LoginSchema>) {
    setError(undefined);
    setSuccess(undefined);

    startTransition(() => {
      loginUser(data)
        .then((data) => {
          if (data?.error) {
            form.reset();
            setError(data.error);
          }

          if (data?.success) {
            form.reset();
            setSuccess(data?.success);
          }
        })
        .catch(() => {
          setError("Something went wrong!");
        });
    });
  }

  return (
    <div className="min-h-screen w-full bg-gradient-to-r from-gold-100 to-indigo-50 flex flex-col items-center justify-center px-4 sm:px-6 lg:px-8 ">
      <div className="relative w-full max-w-md bg-white rounded-2xl shadow-lg p-8 sm:p-10">
        <span className="text-3xl font-bold text-primary mb-6 block text-center">Login</span>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-5">
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <label className="block text-sm font-medium text-gray-700">Email</label>
                  <FormControl>
                    <input
                      {...field}
                      type="email"
                      placeholder="Enter your email..."
                      className="w-full p-3 bg-gray-50 border rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
                      disabled={isPending}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="password"
              render={({ field }) => (
                <FormItem>
                  <label className="block text-sm font-medium text-gray-700">Password</label>
                  <div className="relative">
                    <FormControl>
                      <input
                        {...field}
                        type={showPassword ? "text" : "password"}
                        placeholder="Enter your password..."
                        className="w-full p-3 bg-gray-50 border rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
                        disabled={isPending}
                      />
                    </FormControl>
                    <button
                      type="button"
                      onClick={togglePasswordVisibility}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500"
                    >
                      {showPassword ? <IoEyeOff size={20} /> : <IoEye size={20} />}
                    </button>
                  </div>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormError message={error} />
            <FormSuccess message={success} />

            <button
              type="submit"
              disabled={isPending}
              className="w-full py-3 bg-primary text-white font-medium rounded-md hover:bg-primary/90 transition-colors disabled:opacity-60"
            >
              {isPending ? "Loading..." : "Login"}
            </button>
          </form>
        </Form>

        <div className="mt-6 text-sm flex justify-between items-center">
          <Link
            href="/auth/forgot-password"
            className="text-primary hover:underline"
          >
            Forgot Password?
          </Link>

          <Link
            href="/auth/register"
            className="text-secondary underline hover:text-primary"
          >
            Register
          </Link>
        </div>
      </div>
    </div>
  );
}

export default LoginForm;
