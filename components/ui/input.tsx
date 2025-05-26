// 📄 components/ui/input.tsx
import React from 'react';

export function Input({
  value,
  onChange,
  placeholder,
  type = 'text',
  ...props
}: React.InputHTMLAttributes<HTMLInputElement>) {
  return (
    <input
      type={type}
      value={value}
      onChange={onChange}
      placeholder={placeholder}
      className="w-full border rounded px-3 py-2 text-sm"
      {...props}
    />
  );
}
