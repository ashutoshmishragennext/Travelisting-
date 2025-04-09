"use client";

import { registerUser } from "@/actions/auth";
import { IoEye, IoEyeOff } from "react-icons/io5";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/ui/form";
import { toast } from "@/components/ui/use-toast";
import { zodResolver } from "@hookform/resolvers/zod";
import { useState, useTransition } from "react";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { FormError } from "@/components/form-error";
import { FormSuccess } from "@/components/form-success";
import { RegisterUserSchema, Role } from "@/schemas";

const FormSchema = RegisterUserSchema;
type FormSchemaType = z.infer<typeof FormSchema>;

interface RegisterFormProps {
  text: string;
  role: Role;
}

interface ServerResponse {
  error?: string;
  success?: string;
}

const RegisterForm: React.FC<RegisterFormProps> = ({ text, role }) => {
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState<string | undefined>(undefined);
  const [success, setSuccess] = useState<string | undefined>(undefined);
  const [isPending, startTransition] = useTransition();

  const form = useForm<FormSchemaType>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      name: "",
      email: "",
      mobile: "",
      password: "",
      role: "USER" as Role,
    },
  });

  const onSubmit = async (data: FormSchemaType) => {
    if (role) data.role = role;

    setError(undefined);
    setSuccess(undefined);

    startTransition(() => {
      registerUser(data)
        .then((response: ServerResponse) => {
          if (response?.error) {
            setError(response.error);
          }
          if (response?.success) {
            form.reset();
            setSuccess(response.success);
            toast({
              title: "🎉 Registration success",
              description: response.success,
            });
          }
        })
        .catch(() => {
          setError("Something went wrong!");
        });
    });
  };

  const togglePasswordVisibility = () => setShowPassword(prev => !prev);

  return (
    <div className="max-w-md mx-auto p-4 bg-white ">
      <h2 className="text-2xl font-semibold text-center mb-6 text-primary">
        {text}
      </h2>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-5">
          <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
              <FormItem>
                <label className="block mb-1 font-medium text-gray-700">
                  Full Name
                </label>
                <FormControl>
                  <input
                    {...field}
                    type="text"
                    placeholder="Enter your full name"
                    className="w-full p-3 border rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-primary"
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem>
                <label className="block mb-1 font-medium text-gray-700">
                  Email
                </label>
                <FormControl>
                  <input
                    {...field}
                    type="email"
                    placeholder="Enter your email"
                    className="w-full p-3 border rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-primary"
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="mobile"
            render={({ field }) => (
              <FormItem>
                <label className="block mb-1 font-medium text-gray-700">
                  Mobile
                </label>
                <FormControl>
                  <input
                    {...field}
                    type="tel"
                    placeholder="Enter your phone number"
                    className="w-full p-3 border rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-primary"
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
                <label className="block mb-1 font-medium text-gray-700">
                  Password
                </label>
                <div className="relative">
                  <FormControl>
                    <input
                      {...field}
                      type={showPassword ? "text" : "password"}
                      placeholder="Enter your password"
                      className="w-full p-3 border rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-primary"
                    />
                  </FormControl>
                  <button
                    type="button"
                    onClick={togglePasswordVisibility}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500"
                    aria-label={showPassword ? "Hide password" : "Show password"}
                  >
                    {showPassword ? <IoEyeOff /> : <IoEye />}
                  </button>
                </div>
                <FormMessage />
              </FormItem>
            )}
          />

          {error && <FormError message={error} />}
          {success && <FormSuccess message={success} />}

          <button
            type="submit"
            disabled={isPending}
            className="w-full py-3 rounded-lg bg-primary text-white font-medium hover:bg-primary/90 transition-colors disabled:opacity-50"
          >
            {isPending ? "Registering..." : "Register"}
          </button>
        </form>
      </Form>
    </div>
  );
};

export default RegisterForm;
