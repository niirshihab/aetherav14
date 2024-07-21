// components/Button.tsx
import React from 'react';

interface ButtonProps {
  children: React.ReactNode;
  onClick?: () => void;
  fullWidth?: boolean;
}

export const Button: React.FC<ButtonProps> = ({ children, onClick, fullWidth = false }) => {
  return (
    <button
      onClick={onClick}
      className={`${fullWidth ? 'w-full' : 'w-auto'} px-4 sm:px-6 py-2 sm:py-3 bg-brod-rose-700 rounded-3xl flex justify-center items-center text-white text-sm sm:text-base font-normal font-inter leading-normal`}
    >
      {children}
    </button>
  );
};