
import React from 'react';
import Image from 'next/image';

interface FormFieldProps {
  id: string;
  label: string;
  type: string;
  placeholder?: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  error?: string;
  icon: string;
  toggle?: () => void;
  toggleIcon?: React.ReactNode;
}

const FormField = ({ id, label, type, placeholder, value, onChange, error, icon, toggle, toggleIcon }: FormFieldProps) => (
  <div>
    <label htmlFor={id} className="block text-gray-700 font-medium mb-1 text-[14px]">
      {label}
    </label>
    <div className="relative">
      <input
        id={id}
        name={id}
        type={type}
        value={value}
        placeholder={placeholder}
        onChange={onChange}
        className="w-full pl-12 pr-12 py-2 rounded-xl border border-amber-400 focus:outline-none focus:ring-2 focus:ring-indigo-500"
      />
      <div className="absolute inset-y-0 left-0 flex items-center pl-4 pointer-events-none">
        <Image src={icon} alt={`${label} Icon`} width={17} height={17} />
      </div>
      {toggle && <div onClick={toggle} className="absolute right-4 top-1/2 -translate-y-1/2 cursor-pointer">{toggleIcon}</div>}
    </div>
    {error && <p className="mt-1 text-sm text-red-600">{error}</p>}
  </div>
);

export default FormField;
