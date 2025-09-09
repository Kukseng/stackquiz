'use client';

import React from 'react';

type FormFieldProps = {
  id: string;
  label: string;
  type: string;
  value: string;
  placeholder?: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  error?: string;
  icon?: React.ReactNode;           // React Icon
  toggle?: () => void;              // for password visibility
  toggleIcon?: React.ReactNode;     // eye icon
};

const FormField: React.FC<FormFieldProps> = ({
  id,
  label,
  type,
  value,
  placeholder,
  onChange,
  error,
  icon,
  toggle,
  toggleIcon,
}) => {
  return (
    <div className="relative">
      <label htmlFor={id} className="block text-gray-700 font-medium mb-1">
        {label}
      </label>

      <div className="flex items-center border rounded-xl px-3 py-2 focus-within:ring-2 focus-within:ring-yellow-400">
        {icon && <div className="mr-2">{icon}</div>}
        <input
          id={id}
          name={id}
          type={type}
          value={value}
          placeholder={placeholder}
          onChange={onChange}
          className="w-full outline-none bg-transparent text-gray-800 placeholder-gray-400"
        />
        {toggle && toggleIcon && (
          <div onClick={toggle} className="ml-2">
            {toggleIcon}
          </div>
        )}
      </div>

      {error && <p className="text-red-500 text-sm mt-1">{error}</p>}
    </div>
  );
};

export default FormField;
