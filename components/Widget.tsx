// components/Widget.tsx
import React from 'react';

interface WidgetProps {
  title: string;
  children: React.ReactNode;
}

export const Widget: React.FC<WidgetProps> = ({ title, children }) => {
  return (
    <div className="w-full bg-brod-stone-50/5 rounded-3xl shadow border border-white/70 backdrop-blur-3xl flex-col justify-center items-start gap-2 p-4 sm:p-6">
      <h2 className="text-brod-stone/60 text-xl font-normal font-abeezee leading-tight mb-4">{title}</h2>
      <div className="w-full">
        {children}
      </div>
    </div>
  );
};