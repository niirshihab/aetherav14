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
      className="w-80 h-12 px-7 py-3.5 bg-brod-rose-700 rounded-3xl flex justify-center items-center"
    >
      <span className="text-center text-white text-base font-normal font-inter leading-normal">
        {children}
      </span>
    </button>
  );
};