import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import { BrowserRouter } from 'react-router-dom'
import { ClerkProvider } from '@clerk/clerk-react'
import { dark } from '@clerk/themes' //  Clerk dark theme imported

// Import your Publishable Key
const PUBLISHABLE_KEY = import.meta.env.VITE_CLERK_PUBLISHABLE_KEY

if (!PUBLISHABLE_KEY) {
  throw new Error('Missing Publishable Key')
}

createRoot(document.getElementById('root')).render(
  <ClerkProvider 
    publishableKey={PUBLISHABLE_KEY} 
    afterSignOutUrl='/'
    //  Pitch Black & Off-White Theme Matching the Website
    appearance={{
      baseTheme: dark,
      variables: {
        colorPrimary: '#3b82f6',         // Blue Accent
        colorBackground: '#050505',      // Pitch Black background
        colorText: '#f4f4f5',            // Off-White text
        colorTextSecondary: '#a1a1aa',   // Muted gray subtitles
        colorInputBackground: '#18181b', // Dark input fields
        colorInputText: '#ffffff',       // Input text color
      },
      elements: {
        //  YAHAN CLERK MODAL KO FIX KARNE KI GLOBAL CLASSES HAIN 👇
        modalBackdrop: "!items-start !pt-[120px] !z-[999999]",
        modalContent: "!mt-5 !mb-10 !max-h-[75vh] !overflow-y-auto !scale-95 !origin-top !border !border-zinc-800 custom-scrollbar",
      }
    }}
  >
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </ClerkProvider>
)