import React, { useState } from 'react'
import { Outlet, useNavigate } from 'react-router-dom'
import { HiMenu, HiX } from 'react-icons/hi'
import Sidebar from '../components/Sidebar'
import { SignIn, useUser } from '@clerk/clerk-react'
import logo from '../assets/craftmind-logo.png' 

const Layout = () => {
  const navigate = useNavigate()
  const [sidebar, setSidebar] = useState(false)
  const { user } = useUser();

  return user ? (
    <div className='flex flex-col items-start justify-start h-screen bg-[#050505] overflow-hidden relative'>
      
      {/*  Glassmorphism Navbar (Fixed at the top) */}
      <nav className='fixed top-0 left-0 w-full px-6 sm:px-8 h-16 flex items-center justify-between border-b border-zinc-800/50 bg-[#050505]/60 backdrop-blur-md z-50'>
        <img
          src={logo}
          alt="CraftMindAI Logo"
          onClick={() => { navigate('/') }}
          className="h-16 sm:h-20 w-auto cursor-pointer object-contain hover:scale-105 transition-transform duration-300"
        />
        
        {/* Mobile Menu Icons */}
        {sidebar ? (
          <HiX
            onClick={() => { setSidebar(false) }}
            className='w-7 h-7 text-zinc-400 hover:text-white sm:hidden cursor-pointer transition-colors'
          />
        ) : (
          <HiMenu
            onClick={() => { setSidebar(true) }}
            className='w-7 h-7 text-zinc-400 hover:text-white sm:hidden cursor-pointer transition-colors'
          />
        )}
      </nav>

      {/* Main Content Area */}
      <div className='w-full flex h-screen overflow-hidden'>
        
        {/*  Main scrollable content  */}
        <div className='flex-1 h-full overflow-y-auto bg-[#050505] custom-scrollbar'>
          {/* pt-20 ensures content starts below navbar initially, but scrolls under the glass */}
          <div className='pt-20 pb-10 min-h-screen'>
            <Outlet />
          </div>
        </div>
        
        {/* Sidebar Wrapper (Right Side) */}
        <div className='pt-16 h-full z-40 bg-[#050505] hidden sm:block border-l border-zinc-800/50'>
          <Sidebar sidebar={sidebar} setSidebar={setSidebar} />
        </div>
        
      </div>
      
    </div>
  ) : (
    <div className='flex items-center justify-center h-screen bg-[#050505]'>
      <SignIn />
    </div>
  )
}

export default Layout