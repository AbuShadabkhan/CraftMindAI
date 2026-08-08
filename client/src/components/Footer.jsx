import React from 'react'
import { assets } from '../assets/assets'
import { Button } from './ui/button'
import gradientBackground from '../assets/pattern.png'
import Card from './share';
import logo from '../assets/craftmind-logo.png'

const Footer = () => {
  return (
    <div
      style={{ backgroundImage: `url(${gradientBackground})` }}
      className="bg-black/95 bg-blend-overlay w-full relative z-10 mt-20"
    >
      {/* Dark premium footer background */}
      <footer className="px-6 md:px-16 lg:px-24 xl:px-32 pt-16 w-full text-zinc-400 border-t border-zinc-800 bg-transparent">
        
        {/* Top Section */}
        <div className="flex flex-col md:flex-row justify-between w-full gap-12 border-b border-zinc-800/80 pb-12">
          
          {/* Logo & Description */}
          <div className="md:max-w-sm">
            <img 
             src={logo} 
             alt="CraftMindAI Logo" 
             className="h-12 sm:h-14 w-auto object-contain opacity-90 hover:opacity-100 transition-opacity duration-300" 
           />
            <p className="mt-4 text-sm leading-relaxed text-zinc-400">
              Experience the power of AI with <strong className="text-blue-500 font-semibold tracking-wide">CraftMindAI</strong>.<br />
              Your intelligent digital companion.
            </p>
          </div>

          {/* Links, Card & Newsletter */}
          <div className="flex-1 flex flex-col lg:flex-row justify-between gap-10 lg:gap-6">
            
            {/* Company Links */}
            <div>
              <h2 className="font-semibold text-white mb-6 text-lg tracking-wide">Company</h2>
              <ul className="text-sm space-y-3">
                {["Home", "About us", "Contact us", "Privacy policy"].map((item, i) => (
                  <li key={i}>
                    <a 
                      href="#" 
                      className="text-zinc-400 hover:text-white hover:pl-1 transition-all duration-300 flex items-center gap-2"
                    >
                      <span className="w-1.5 h-1.5 rounded-full bg-blue-500/50"></span> {item}
                    </a>
                  </li>
                ))}
              </ul>
            </div>

            {/* Gradient UI Box  */}
            <div className="flex items-center justify-center lg:px-4 transform hover:scale-105 transition-transform duration-500">
              <Card/>
            </div>

            {/* Newsletter */}
            <div className="max-w-md">
              <h2 className="font-semibold text-white mb-4 text-lg tracking-wide">Subscribe to our newsletter</h2>
              <p className="text-sm mb-6 text-zinc-400 leading-relaxed">
                Get the latest news, articles, and resources, sent weekly to your inbox.
              </p>
              <div className="flex flex-col sm:flex-row items-center gap-3">
                <input 
                  className="bg-zinc-900/60 border border-zinc-700 text-white placeholder-zinc-500 focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none w-full sm:max-w-xs h-11 rounded-lg px-4 text-sm transition-all duration-200" 
                  type="email" 
                  placeholder="Enter your email" 
                />
                <Button className="bg-white hover:bg-zinc-200 text-black font-semibold w-full sm:w-auto h-11 px-6 rounded-lg transition-colors duration-200 shadow-[0_0_15px_rgba(255,255,255,0.05)]">
                  Subscribe
                </Button>
              </div>
            </div>
          </div>
        </div>

        {/* Footer Bottom */}
        <p className="pt-8 text-center text-xs md:text-sm text-zinc-500 pb-8">
          © 2026 <span className="text-blue-500 font-semibold hover:text-blue-400 transition-colors cursor-pointer">CraftMindAI</span>. All rights reserved.
        </p>
      </footer>
    </div>
  )
}

export default Footer