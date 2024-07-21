// components/Button.tsx
import React from 'react';

interface ButtonProps {
  children: React.ReactNode;
  onClick?: () => void;
}

export const Button: React.FC<ButtonProps> = ({ children, onClick }) => {
  return (
    <button
      onClick={onClick}
      className="w-full sm:w-auto px-4 sm:px-7 py-2 sm:py-3.5 bg-brod-rose-700 rounded-3xl flex justify-center items-center"
    >
      <span className="text-center text-white text-sm sm:text-base font-normal font-inter leading-normal">
        {children}
      </span>
    </button>
  );
};