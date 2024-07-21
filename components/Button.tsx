import React from 'react';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  children: React.ReactNode;
  className?: string;
}

export const Button: React.FC<ButtonProps> = ({ 
  children, 
  className = '', 
  type = 'button', 
  ...props 
}) => {
  return (
    <button
      type={type}
      className={`px-4 sm:px-6 py-2 sm:py-3 bg-brod-rose-700 text-white rounded-3xl flex justify-center items-center text-sm sm:text-base font-normal font-inter leading-normal ${className}`}
      {...props}
    >
      {children}
    </button>
  );
};