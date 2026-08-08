import React from 'react'
import { useNavigate } from 'react-router-dom'
import { assets } from '../assets/assets'
import { HiArrowRight } from 'react-icons/hi'
import { useClerk, UserButton, useUser } from '@clerk/clerk-react'
import { Button } from './ui/button'
import logo from '../assets/craftmind-logo.png'

const Navbar = () => {
  const navigate = useNavigate()
  const { user } = useUser()
  const { openSignIn } = useClerk()

  return (
    
    <div className='fixed z-50 w-full backdrop-blur-md flex justify-between items-center py-3 px-4 sm:px-8 xl:px-10'>
      
      <img 
       src={logo} 
       alt="CraftMindAI Logo" 
       className="h-16 sm:h-20 w-auto cursor-pointer object-contain hover:scale-105 transition-transform duration-300" 
       onClick={() => navigate('/')} 
      />
      
      {
        user ? (
          <UserButton />
        ) : (
          <Button onClick={openSignIn} className='btn-primary max-sm:w-full'>
            Get started <HiArrowRight className='w-4 h-4' />
          </Button>
        )
      }
    </div>
  )
}

export default Navbar