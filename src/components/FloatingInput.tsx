import React, { useState } from "react";
import { cn } from "@/lib/utils";

interface FloatingLabelInputProps {
  id: string;
  label: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  required?: boolean;
  type?: string;
  placeholder?: string;
  className?: string;
  [key: string]: any;
}

export const FloatingLabelInput = ({
  id,
  label,
  value,
  onChange,
  required = false,
  type = "text",
  placeholder = "",
  className = "",
  ...props
}: FloatingLabelInputProps) => {
  const [isFocused, setIsFocused] = useState(false);
  
  return (
    <div className="relative">
      <input
        id={id}
        type={type}
        value={value}
        onChange={onChange}
        placeholder={isFocused ? placeholder : ""}
        onFocus={() => setIsFocused(true)}
        onBlur={() => setIsFocused(false)}
        className={cn(
          "h-12 w-full px-3 pt-5 pb-2 border rounded-md peer focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all",
          className
        )}
        required={required}
        {...props}
      />
      <label
        htmlFor={id}
        className={cn(
          "absolute text-gray-500 duration-300 transform -translate-y-4 scale-75 top-2 z-10 origin-[0] left-3 peer-focus:text-blue-600",
          (isFocused || value) ? 
            "text-xs translate-y-0" : 
            "text-base translate-y-3"
        )}
      >
        {label}
        {required && <span className="text-red-500 ml-1">*</span>}
      </label>
    </div>
  );
};

// For textarea with floating label
interface FloatingLabelTextareaProps {
  id: string;
  label: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLTextAreaElement>) => void;
  required?: boolean;
  placeholder?: string;
  className?: string;
  [key: string]: any;
}

export const FloatingLabelTextarea = ({
  id,
  label,
  value,
  onChange,
  required = false,
  placeholder = "",
  className = "",
  ...props
}: FloatingLabelTextareaProps) => {
  const [isFocused, setIsFocused] = useState(false);
  
  return (
    <div className="relative">
      <textarea
        id={id}
        value={value}
        onChange={onChange}
        placeholder={isFocused ? placeholder : ""}
        onFocus={() => setIsFocused(true)}
        onBlur={() => setIsFocused(false)}
        className={cn(
          "w-full px-3 pt-7  min-h-24 border rounded-md peer focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all",
          className
        )}
        required={required}
        {...props}
      />
      <label
        htmlFor={id}
        className={cn(
          "absolute text-gray-500 duration-300 transform -translate-y-4 scale-75 top-4 z-10 origin-[0] left-3 peer-focus:text-blue-600",
          (isFocused || value) ? 
            "text-xs translate-y-0" : 
            "text-base translate-y-2"
        )}
      >
        {label}
        {required && <span className="text-red-500 ml-1">*</span>}
      </label>
    </div>
  );
};

// For select with floating label
interface FloatingLabelSelectProps {
  id: string;
  label: string;
  value: string;
  onValueChange: (value: string) => void;
  required?: boolean;
  children: React.ReactNode;
  className?: string;
  [key: string]: any;
}

export const FloatingLabelSelect = ({
  id,
  label,
  value,
  onValueChange,
  required = false,
  children,
  className = "",
  ...props
}: FloatingLabelSelectProps) => {
  return (
    <div className="relative">
      <select
        id={id}
        value={value}
        onChange={(e) => onValueChange(e.target.value)}
        className={cn(
          "h-12 w-full px-3 pt-5 pb-2 border rounded-md peer focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent appearance-none transition-all",
          className
        )}
        required={required}
        {...props}
      >
        <option value="" disabled hidden></option>
        {children}
      </select>
      <label
        htmlFor={id}
        className={cn(
          "absolute text-gray-500 duration-300 transform -translate-y-4 scale-75 top-2 z-10 origin-[0] left-3 peer-focus:text-blue-600",
          value ? 
            "text-xs translate-y-0" : 
            "text-base translate-y-3"
        )}
      >
        {label}
        {required && <span className="text-red-500 ml-1">*</span>}
      </label>
      <div className="absolute inset-y-0 right-0 flex items-center px-2 pointer-events-none">
        <svg className="w-5 h-5 text-gray-400" fill="currentColor" viewBox="0 0 20 20">
          <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
        </svg>
      </div>
    </div>
  );
};