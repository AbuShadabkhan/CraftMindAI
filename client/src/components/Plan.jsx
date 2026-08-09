import React from 'react';
import { PricingTable } from '@clerk/clerk-react';
import gradientBackground from '../assets/pattern.png';

const Plan = () => {
  return (
    <div 
      className="bg-black/95 bg-blend-overlay w-full min-h-screen"
      style={{ backgroundImage: `url(${gradientBackground})` }}
    >
      {/* 🚀 FIX 1: Yahan px-4 sm:px-6 lg:px-8 add kiya hai taaki dono side proper space rahe */}
      <div className='max-w-4xl mx-auto py-24 px-4 sm:px-6 lg:px-8'>
        <div className='text-center'>
          <h2 className='text-white text-3xl sm:text-4xl md:text-[42px] font-bold leading-tight'>
            Choose Your Plan
          </h2>
          <p className='text-neutral-400 max-w-lg mx-auto mt-4 text-base sm:text-lg'>
            Start for free and scale up as you grow. Find the perfect plan for your content creation needs.
          </p>
        </div>
        
        {/* 🚀 FIX 2: max-sm:mx-8 hata kar w-full kar diya taaki margin screen se bahar na jaye */}
        <div className='mt-14 w-full'>
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
                // 🚀 FIX 3: Mobile par proper ek-ke-upar-ek stack hone ke liye flex-col add kiya
                pricingTable: "flex flex-col md:grid md:grid-cols-2 gap-6 md:gap-8 items-start overflow-visible",
                
                // 🚀 BONUS: Scroll lag fix for mobile - Mobile par solid bg, Desktop par Blur
                pricingTableCard: 
                  "!bg-zinc-900 lg:!bg-zinc-900/40 lg:!backdrop-blur-md !border !border-zinc-800 !rounded-2xl !shadow-2xl !p-6 sm:!p-8 " +
                  "!transition-all !duration-300 !ease-out " +
                  "hover:!-translate-y-2 hover:!scale-[1.02] " +
                  "hover:!border-white hover:!shadow-[0_0_50px_5px_rgba(255,255,255,0.35)]",
                headerTitle: "text-white text-xl sm:text-2xl",
                headerSubtitle: "text-neutral-400 text-sm sm:text-base",
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