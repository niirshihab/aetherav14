// components/Widget.tsx
import React from 'react';

interface WidgetProps {
  title: string;
  children: React.ReactNode;
}

export const Widget: React.FC<WidgetProps> = ({ title, children }) => {
  return (
    <div className="w-full max-w-sm mx-auto sm:max-w-md md:max-w-lg lg:max-w-xl xl:max-w-2xl h-auto px-4 sm:px-6 py-4 bg-brod-stone-50/5 rounded-3xl shadow border border-white/70 backdrop-blur-3xl flex-col justify-center items-start gap-2 inline-flex">
      <div className="w-full justify-start items-center gap-4 inline-flex">
        <h2 className="text-brod-stone/60 text-xl font-normal font-abeezee leading-tight">{title}</h2>
      </div>
      <div className="self-stretch flex-col justify-center items-center gap-3.5 flex">
        {children}
      </div>
    </div>
  );
};