import React from 'react';
import { useNavigate } from 'react-router-dom';
import { assets } from '../assets/assets';
import { Button } from './ui/button';
import { DitheringShader } from "./ui/dithering-shader";
import { SplineScene } from "./ui/splite";
import { Card } from "./ui/card";
import { Spotlight } from "./ui/spotlight";
import gradientBackground from '../assets/pattern.png';

const Hero = () => {
  const navigate = useNavigate();
  
  return (
    <div
      style={{ backgroundImage: `url(${gradientBackground})` }}
      className="relative flex w-full flex-col items-center justify-center bg-black/95 bg-blend-overlay min-h-screen px-4 sm:px-10 md:px-20 py-20"
    >
      
      <Card className="w-full max-w-[100%] 2xl:max-w-[1500px] h-auto lg:h-[600px] bg-[#050505] border-zinc-800/50 shadow-2xl relative overflow-hidden flex flex-col lg:flex-row mt-10 rounded-2xl">
        
        {/* Mouse Tracking Spotlight */}
        <Spotlight size={500} className="z-0" />

        {/* Left Side: Text and Buttons */}
        <div className="flex-1 p-8 md:p-12 relative z-10 flex flex-col justify-center text-center lg:text-left">
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold bg-clip-text text-transparent bg-gradient-to-b from-neutral-50 to-neutral-400 leading-tight">
            Create or ask <br /> anything with <br />
            <span className='text-primary-400'>CraftMindAI</span>
          </h1>
          
          <p className='mt-6 text-neutral-400 max-w-lg mx-auto lg:mx-0 text-base md:text-lg'>
            Transform your content creation with our suite of premium AI tools. Write articles, generate images, and enhance your workflow effortlessly.
          </p>

          <div className='flex flex-wrap justify-center lg:justify-start gap-4 mt-8'>
            <button 
              onClick={() => navigate('/ai')} 
              className='px-8 py-3 text-base font-semibold bg-white text-black hover:bg-neutral-200 rounded-full transition-all shadow-[0_0_20px_rgba(255,255,255,0.1)]'
            >
              Start creating now
            </button>
            <a 
              href="https://youtu.be/J4QAr3-_Krs?si=-fVjlYR53eEG1b8x"
              target="_blank" 
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center px-6 py-3 border border-zinc-700 hover:bg-zinc-800 text-white rounded-full transition-all font-medium"
            >
              Watch Demo
            </a>
          </div>

          <div className='flex items-center justify-center lg:justify-start gap-3 mt-10 text-neutral-500 text-sm'>
            <img src={assets.user_group} alt="Users" className='h-6 opacity-60 grayscale' /> 
            <span>Trusted by many creators</span>
          </div>
        </div>

        {/* Right Side: 3D Spline Scene */}
        <div className="flex-1 relative min-h-[400px] lg:min-h-full z-10 pointer-events-auto">
           <SplineScene 
              scene="https://prod.spline.design/kZDDjO5HuC9GJUM2/scene.splinecode"
              className="w-full h-full"
            />
        </div>

      </Card>

      {/* Dithering Sphere Replacement */}
      <div className='mt-16 relative flex h-[300px] w-full flex-col items-center justify-center overflow-hidden opacity-70 hover:opacity-100 transition-opacity'>
        <DitheringShader 
          shape="sphere"
          type="random"
          colorBack="#000000"
          colorFront="#e9eeeb"
          pxSize={4}
          speed={1.5}
          width={300}
          height={300}
        />
        {/*  CraftMindAI jo sphere ke upar dikhega */}
        <span className="pointer-events-none z-10 text-center text-3xl absolute text-white font-semibold tracking-tighter whitespace-pre-wrap">
          CraftMindAI
        </span>
      </div>
    </div>
  );
};

export default Hero;