"use client";

import RegisterForm from "@/components/forms/RegisterForm";
import React from "react";

function RegisterPage() {
  return (
    <div className=" w-full min-h-screen bg-blue-50 flex flex-col items-center justify-center bg-cover bg-center relative"
         
         >
         
      <h1 className="text-5xl mb-8 font-bold">Register</h1>
      <div className="w-full max-w-md px-4">
        <RegisterForm text="Create your account" role="USER" />
      </div>
      <button className="absolute top-[60px] right-[20px] bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors">
        <a href="/auth/login">Login Instead</a>
      </button>
    </div>
  );
}

export default RegisterPage;