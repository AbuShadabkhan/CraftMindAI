import React from 'react';
import { PricingTable } from '@clerk/clerk-react';
import gradientBackground from '../assets/pattern.png';

const Plan = () => {
  return (
    <div 
      className="bg-black/95 bg-blend-overlay w-full min-h-screen"
      style={{ backgroundImage: `url(${gradientBackground})` }}
    >
      {/* 🚀 YAHAN SE 'z-20' HATA DIYA GAYA HAI TAAGI MODAL FREE HO JAYE 🚀 */}
      <div className='max-w-4xl mx-auto py-24'>
        <div className='text-center'>
          <h2 className='text-white text-3xl sm:text-4xl md:text-[42px] font-bold leading-tight'>
            Choose Your Plan
          </h2>
          <p className='text-neutral-400 max-w-lg mx-auto mt-4 text-base sm:text-lg'>
            Start for free and scale up as you grow. Find the perfect plan for your content creation needs.
          </p>
        </div>
        
        <div className='mt-14 max-sm:mx-8'>
          <PricingTable 
            appearance={{
              variables: {
                colorBackground: '#18181b', 
                colorText: 'white',
                colorTextSecondary: '#a3a3a3',
                colorPrimary: '#ffffff',
                colorInputBackground: '#27272a',
                colorInputText: 'white',
              },
              elements: {
                pricingTable: "grid md:grid-cols-2 gap-6 items-start overflow-visible",
                pricingTableCard: 
                  "!bg-zinc-900/40 !backdrop-blur-md !border !border-zinc-800 !rounded-2xl !shadow-2xl !p-6 " +
                  "!transition-all !duration-300 !ease-out " +
                  "hover:!-translate-y-2 hover:!scale-[1.02] " +
                  "hover:!border-white hover:!shadow-[0_0_50px_5px_rgba(255,255,255,0.35)]",
                headerTitle: "text-white",
                headerSubtitle: "text-neutral-400",
                dividerLine: "bg-zinc-800",
                formButtonPrimary: 
                  "w-full py-3 rounded-lg bg-white text-black font-medium " +
                  "hover:bg-gray-200 transition-all duration-200",
              }
            }}
          />
        </div>
      </div>
    </div>
  );
}

export default Plan;