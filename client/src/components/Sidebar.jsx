import React from 'react'
import { NavLink } from 'react-router-dom'
import { Protect, SignOutButton, useClerk, useUser } from '@clerk/clerk-react'

import {
  HiHome,
  HiPencil,
  HiHashtag,
  HiPhotograph,
  HiScissors,
  HiDocumentText,
  HiUserGroup
} from 'react-icons/hi';
import { CiEraser, CiLogout } from 'react-icons/ci';
import profileImg from '../assets/profile_img_1.png';

const navItems = [
  { to: '/ai', label: 'Dashboard', Icon: HiHome },
  { to: '/ai/write-article', label: 'Write Article', Icon: HiPencil },
  { to: '/ai/blog-titles', label: 'Blog Titles', Icon: HiHashtag },
  { to: '/ai/generate-images', label: 'Generate Images', Icon: HiPhotograph },
  { to: '/ai/remove-background', label: 'Remove Background', Icon: CiEraser },
  { to: '/ai/remove-object', label: 'Remove Object', Icon: HiScissors },
  { to: '/ai/review-resume', label: 'Review Resume', Icon: HiDocumentText },
  { to: '/ai/generate-website', label: 'Website Generator', Icon: HiUserGroup },
  { to: '/ai/community', label: 'Community', Icon: HiUserGroup },
]

const Sidebar = ({ sidebar, setSidebar }) => {
  const { user } = useUser();
  const { openUserProfile } = useClerk(); 
  const userName = user?.fullName || 'User Profile';

  const isVisible = true;

  return (
    // Outer wrapper - Pitch Black
    <div className='h-screen bg-[#050505]'>
      <div
        className={`w-64 bg-[#050505] border-r border-zinc-800/80 flex flex-col justify-between items-center max-sm:absolute top-14 bottom-0 ${isVisible ? 'translate-x-0' : '-translate-x-full'
          } transition-transform duration-300 ease-in-out z-40`}
      >
        <div className='my-7 w-full px-4 overflow-y-auto custom-scrollbar'>
          
          {/* User Profile Section */}
          <div className="text-center mb-8">
            <div className="relative inline-block">
              <img
                src={user?.imageUrl || profileImg}
                alt="User avatar"
                className="w-16 h-16 rounded-full mx-auto object-cover border border-zinc-700 shadow-[0_0_15px_rgba(255,255,255,0.05)]"
              />
              <div className="absolute bottom-0 right-0 w-3.5 h-3.5 bg-blue-500 border-2 border-[#050505] rounded-full"></div>
            </div>
            <h1 className="mt-3 text-center text-white font-medium text-sm tracking-wide">
              {userName}
            </h1>
          </div>

          {/* Navigation Items */}
          <nav className="space-y-1.5">
            <div className="text-xs font-semibold text-zinc-500 uppercase tracking-wider mb-3 px-2">
              Navigation Items ({navItems.length})
            </div>
            {navItems.map(({ to, label, Icon }) => (
              <NavLink
                key={to}
                to={to}
                end={to === '/ai'}
                onClick={() => setSidebar(false)}
                className={({ isActive }) =>
                  `px-3 py-2.5 flex items-center gap-3 rounded-lg transition-all duration-300 group ${isActive
                    ? 'bg-blue-600 text-white shadow-[0_0_12px_rgba(37,99,235,0.4)] font-medium'
                    : 'text-zinc-400 hover:bg-zinc-800/60 hover:text-white'
                  }`
                }
              >
                {({ isActive }) => (
                  <>
                    {Icon ? (
                      <Icon
                        className={`w-5 h-5 transition-colors duration-300 ${isActive ? 'text-white' : 'text-zinc-500 group-hover:text-blue-400'}`}
                      />
                    ) : (
                      <div className="w-5 h-5 bg-zinc-800 rounded flex items-center justify-center text-xs text-zinc-400 border border-zinc-700">
                        {label.charAt(0)}
                      </div>
                    )}
                    <span className="text-sm">{label}</span>
                  </>
                )}
              </NavLink>
            ))}
          </nav>
        </div>

        {/* Sign Out Section - Premium Footer */}
        <div className='w-full border-t border-zinc-800/80 p-4 px-6 flex items-center justify-between bg-zinc-900/20'>
          <div
            onClick={openUserProfile} 
            className='flex gap-3 items-center cursor-pointer group'
          >
            <img
              src={user?.imageUrl || profileImg}
              alt="User avatar"
              className="w-9 h-9 rounded-full object-cover border border-zinc-700"
            />
            <div>
              <h1 className='text-sm font-medium text-white group-hover:text-blue-400 transition-colors'>{userName}</h1>
              <p className='text-xs text-zinc-400'>
                <Protect plan='premium' fallback="Free Plan">
                  <span className="text-blue-500 font-medium flex items-center gap-1">
                    <div className="w-1.5 h-1.5 rounded-full bg-blue-500 animate-pulse"></div>
                    Premium
                  </span>
                </Protect>
              </p>
            </div>
          </div>

          <SignOutButton>
            <div className="p-2 rounded-lg hover:bg-zinc-800/80 transition-colors">
              <CiLogout className="w-5 h-5 cursor-pointer text-zinc-400 hover:text-red-400 transition-colors" />
            </div>
          </SignOutButton>
        </div>
      </div>
    </div>
  )
}

export default Sidebar