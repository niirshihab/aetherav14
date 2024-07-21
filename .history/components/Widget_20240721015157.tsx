// components/Widget.tsx
import React from 'react';

interface WidgetProps {
  title: string;
  children: React.ReactNode;
}

export const Widget: React.FC<WidgetProps> = ({ title, children }) => {
  return (
    <div className="w-96 h-72 px-6 pt-2.5 pb-1.5 bg-brod-stone-50/5 rounded-3xl shadow border border-white/70 backdrop-blur-3xl flex-col justify-center items-start gap-2 inline-flex">
      <div className="w-80 justify-start items-center gap-48 inline-flex">
        <h2 className="text-brod-stone/60 text-xl font-normal font-abeezee leading-tight">{title}</h2>
      </div>
      <div className="self-stretch h-48 flex-col justify-center items-center gap-3.5 flex">
        {children}
      </div>
    </div>
  );
};