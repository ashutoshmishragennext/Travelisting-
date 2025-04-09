"use client";

import RegisterForm from "@/components/forms/RegisterForm";
import React from "react";

function RegisterPage() {
  return (
    <div className="w-full min-h-screen bg-gradient-to-r from-gold-100 to-indigo-50 flex flex-col items-center justify-center px-4">
      <button className="absolute top-6 right-6 bg-primary text-white px-4 py-2 rounded-lg hover:bg-opacity-90 transition">
        <a href="/auth/login">Login Instead</a>
      </button>

      <h1 className="text-4xl font-bold text-primary mb-6">Register</h1>

      <div className="w-full max-w-md bg-white rounded-2xl shadow-xl p-6"> 
        <RegisterForm text="Create your account" role="USER" />
      </div>
    </div>
  );
}

export default RegisterPage;
