"use client";

import { registerUser } from "@/actions/auth/registerVendor";
import { IoEye, IoEyeOff } from "react-icons/io5";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/ui/form";
import { toast } from "@/components/ui/use-toast";
import { useState, useTransition } from "react";
import { useForm } from "react-hook-form";
import { FormError } from "@/components/form-error";
import { FormSuccess } from "@/components/form-success";
import { Role } from "@/schemas";
import { useRouter } from 'next/navigation';

// TypeScript Interface
interface FormSchemaType {
  name: string;
  email: string;
  mobile: string;
  password: string;
  vendorId: string;
  createdBy:string;
  role: Role;
}

interface RegisterFormProps {
  text: string;
  role: Role;
  vendorId: any;
}

interface ServerResponse {
  id?:any;
  error?: string;
  success?: string;
}

const RegisterFormVendor: React.FC<RegisterFormProps> = ({text, role, vendorId }) => {
  const [showPassword, setShowPassword] = useState<boolean>(false);
  const [error, setError] = useState<string | undefined>(undefined);
  const [success, setSuccess] = useState<string | undefined>(undefined);
  const [isPending, startTransition] = useTransition();
  const router = useRouter();
  const form = useForm<FormSchemaType>({
    defaultValues: {
      name: "",
      email: "",
      mobile: "",
      password: "",
      createdBy: vendorId,
      role: "USER" as Role,
    },
  });

  // console.log("form",form);
  
  const onSubmit = async (data: FormSchemaType): Promise<void> => {
    if (role && vendorId) {
      data.role = role;
      data.createdBy =vendorId;
    }

    setError(undefined);
    setSuccess(undefined);

    startTransition(() => {
        registerUser(data)
        .then((response: ServerResponse) => {
          if (response?.error) {
            setError(response.error);
          }
          if (response?.success) {
            console.log("responsive",response);
            
            form.reset();
            setSuccess(response.success);
            
            toast({
              title: "🎉 Registration success",
              description: response.success,
            });
            router.push(`/vendorcreation/${response.id }`);
          }
        })
        .catch(() => {
          setError("Something went wrong!");
        });
    });
  };

  const togglePasswordVisibility = (): void => {
    setShowPassword((prev) => !prev);
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="flex flex-col gap-4">
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <label className="block mb-2 font-semibold">Full Name</label>
              <FormControl>
                <input
                  {...form.register("name", { required: "Name is required" })}
                  type="text"
                  placeholder="Enter your full name..."
                  className="w-full p-3 border rounded bg-white focus:outline-none focus:ring-2 focus:ring-lightcoral"
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
              <label className="block mb-2 font-semibold">Email</label>
              <FormControl>
                <input
                  {...form.register("email", { required: "Email is required" })}
                  type="email"
                  placeholder="Enter your email..."
                  className="w-full p-3 border rounded bg-white focus:outline-none focus:ring-2 focus:ring-lightcoral"
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
              <label className="block mb-2 font-semibold">Mobile</label>
              <FormControl>
                <input
                  {...form.register("mobile", { required: "Mobile is required" })}
                  type="tel"
                  placeholder="Enter your phone number..."
                  className="w-full p-3 border rounded bg-white focus:outline-none focus:ring-2 focus:ring-lightcoral"
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
              <label className="block mb-2 font-semibold">Password</label>
              <div className="relative">
                <FormControl>
                  <input
                    {...form.register("password", { required: "Password is required" })}
                    type={showPassword ? "text" : "password"}
                    placeholder="Enter your password..."
                    className="w-full p-3 border rounded bg-white focus:outline-none focus:ring-2 focus:ring-lightcoral"
                  />
                </FormControl>
                <button
                  type="button"
                  onClick={togglePasswordVisibility}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500"
                >
                  {showPassword ? <IoEyeOff /> : <IoEye />}
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
          className="mt-4 w-full bg-primary text-white py-3 rounded hover:bg-opacity-90 transition-colors disabled:bg-opacity-50 disabled:cursor-not-allowed"
        >
          {isPending ? "Registering..." : "Register"}
        </button>
      </form>
    </Form>
  );
};

export default RegisterFormVendor;
