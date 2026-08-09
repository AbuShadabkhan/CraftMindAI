import React from 'react';
import { AiToolsData } from '../assets/assets';
import { useNavigate } from 'react-router-dom';
import { useUser } from '@clerk/clerk-react';
import gradientBackground from '../assets/pattern.png';
import OrbitingCirclesGlobeDemo from "../components/ui/orbiting-circles-02";
import { PenLine, Type, Image, Eraser, Wand2, FileCheck, Globe } from 'lucide-react';

// Tool title ke hisaab se icon map karo
const iconMap = {
  "AI Article Writer": { icon: PenLine, color: "text-blue-400" },
  "Blog Title Generator": { icon: Type, color: "text-purple-400" },
  "AI Image Generation": { icon: Image, color: "text-pink-400" },
  "Background Removal": { icon: Eraser, color: "text-green-400" },
  "Object Removal": { icon: Wand2, color: "text-orange-400" },
  "Resume Reviewer": { icon: FileCheck, color: "text-cyan-400" },
  "Website Generator": { icon: Globe, color: "text-indigo-400" },
};

const AiTools = () => {
  const navigate = useNavigate();
  const { user } = useUser();

  return (
    <div 
      className="bg-black/95 bg-blend-overlay w-full"
      style={{ backgroundImage: `url(${gradientBackground})` }}
    >
      {/* Container Padding Set */}
      <div className="px-4 sm:px-6 md:px-10 xl:px-24 2xl:px-28 py-24 mx-auto max-w-7xl">
        <div className="text-center mb-12 sm:mb-16 mx-auto">
          <h2 className="text-white text-3xl sm:text-4xl md:text-5xl font-bold leading-tight mx-auto">
            Powerful AI Tools at Your Fingertips
          </h2>
          <p className="text-neutral-400 mt-4 max-w-2xl mx-auto text-base sm:text-lg">
            Everything you need to create, enhance, and optimize your content with cutting-edge AI technology.
          </p>
        </div>

        {/* 🚀 FIX: Grid aur Card Width ko perfect responsive banaya */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8 justify-items-center w-full">
          {AiToolsData.map((tool, index) => {
            const { icon: Icon, color } = iconMap[tool.title] || { icon: Wand2, color: "text-zinc-400" };

            return (
              <div
               key={index}
               onClick={() => user && navigate(tool.path)}
               // 🚀 FIX: 'w-[360px]' hatakar 'w-full' kiya aur 'max-w-sm' lagaya. Blur mobile se hataya (scroll performance).
               className="w-full max-w-sm min-h-[300px] bg-zinc-900 lg:bg-zinc-900/40 border border-zinc-800 lg:backdrop-blur-md shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:scale-105 hover:border-zinc-500 cursor-pointer p-6 flex flex-col items-start rounded-xl group"
              >
                
                <div className="w-16 h-16 rounded-xl bg-zinc-800/50 flex items-center justify-center mb-4 
                                transition-all duration-500 
                                group-hover:scale-110 group-hover:rotate-6 group-hover:bg-zinc-700/60">
                  <Icon className={`w-8 h-8 ${color}`} />
                </div>

                <h3 className="text-lg sm:text-xl font-semibold text-white mb-2">{tool.title}</h3>

                {tool.badge && (
                  <p className="badge-text mb-3 px-3 py-1 rounded-full bg-zinc-800/80 border border-zinc-700 text-zinc-300 text-xs tracking-wide">
                    {tool.badge}
                  </p>
                )}

                <p className="text-neutral-400 text-sm line-clamp-3 mb-5 leading-relaxed">{tool.description}</p>

                {tool.team && (
                  <div className="flex -space-x-3 mb-4 mt-auto">
                    {tool.team.map((member, idx) => (
                      <img
                        key={idx}
                        src={member.avatar}
                        alt={member.name}
                        width={40}
                        height={40}
                        className="rounded-full bg-zinc-800 border border-zinc-600 shadow-md transition-transform transform hover:scale-110 relative z-10 hover:z-20"
                      />
                    ))}
                  </div>
                )}

                <button className="mt-auto w-full text-center py-2.5 rounded-lg bg-zinc-800 text-white font-medium border border-zinc-700 hover:bg-[#e9eeeb] hover:text-black hover:border-[#e9eeeb] transition-all duration-300 shadow-md">
                  {tool.actionText || 'Use Tool'}
                </button>
              </div>
            );
          })}
        </div>
      </div>
      
      {/* 🚀 FIX: Overflow hide karne ke liye w-full aur padding lagayi */}
      <div className="flex min-h-[300px] sm:min-h-[400px] w-full max-w-full overflow-hidden items-end justify-center bg-transparent mt-10 mb-20 px-4">
        <OrbitingCirclesGlobeDemo />
      </div>
    </div>
  );
};

export default AiTools;