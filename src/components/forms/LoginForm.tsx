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
    <div 
      className="min-h-screen w-full bg-blue-50 flex flex-col items-center justify-center bg-cover bg-center px-4 sm:px-6 lg:px-8"
     
    >
      <span className="text-3xl sm:text-4xl lg:text-5xl font-bold mb-6 sm:mb-8">Login</span>
      
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="w-full max-w-md flex flex-col">
          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem className="mb-4">
                <label className="block mb-2 text-sm font-medium">Email</label>
                <FormControl>
                  <input
                    {...field}
                    type="email"
                    placeholder="Enter your email..."
                    className="w-full p-3 bg-white border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
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
              <FormItem className="mb-4">
                <label className="block mb-2 text-sm font-medium">Password</label>
                <div className="relative">
                  <FormControl>
                    <input
                      {...field}
                      type={showPassword ? "text" : "password"}
                      placeholder="Enter your password..."
                      className="w-full p-3 bg-white border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
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
            className="mt-5 p-3 bg-blue-600 text-white border rounded-lg cursor-pointer hover:bg-blue-700 transition-colors disabled:bg-blue-400 disabled:cursor-not-allowed"
          >
            {isPending ? "Loading..." : "Login"}
          </button>
        </form>
      </Form>

      <button className="absolute top-[60px] right-[20px] bg-lightcoral bg-blue-500 text-white border rounded-lg cursor-pointer p-3 hover:bg-opacity-90 transition-colors">
        <Link href="/auth/register" className="  no-underline">
          Register
        </Link>
      </button>
      <div className="flex justify-end pt-4">
      <Link
        href="/auth/forgot-password"
        className="text-blue-500 hover:underline focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
      >
        Forget-password
      </Link>
    </div>

    
    </div>
  );
}

export default LoginForm;
