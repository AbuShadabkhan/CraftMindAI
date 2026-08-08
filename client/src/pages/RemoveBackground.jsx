import React, { useState, useEffect } from "react"
import { Upload, Eraser, Loader2, Download, Image as ImageIcon } from "lucide-react"
import { FaGem } from "react-icons/fa" //  Modal icon import 
import toast from "react-hot-toast"
import { useAuth } from "@clerk/clerk-react" //  Clerk auth import 
import apiClient from "../lib/api"

const RemoveBackground = () => {
  const [image, setImage] = useState(null)
  const [previewImage, setPreviewImage] = useState(null)
  const [loading, setLoading] = useState(false)
  const [content, setContent] = useState('')
  const [showProModal, setShowProModal] = useState(false) // 🚀 Naya state popup ke liye

  // Auth token nikalne ke liye
  const { getToken } = useAuth()

  // Custom dark toast style (Dry Code)
  const darkToastStyle = {
    style: { background: '#18181b', color: '#fff', border: '1px solid #27272a' }
  }

  const handleFileChange = (e) => {
    const file = e.target.files[0]
    if (file) {
      setImage(file)
      setPreviewImage(URL.createObjectURL(file))
      setContent('')
    }
  }

  const handleRemoveBackground = async () => {
    if (!image) return toast.error("Please upload an image first!", darkToastStyle)
    
    setLoading(true)
    try {
      const formData = new FormData()
      formData.append("image", image)

      //  Yahan axios hata kar apiClient lagaya aur headers me Token pass kiya
      const { data } = await apiClient.post(
        "/ai/remove-image-background", 
        formData,
        {
          headers: { 
            Authorization: `Bearer ${await getToken()}` 
            // Note: FormData ke sath 'Content-Type': 'multipart/form-data' lagane ki zaroorat nahi hoti, Axios khud handle karta hai.
          },
        }
      )

      if (data.success) {
        setContent(data.content)
      } else {
        toast.error(data.message || "Something went wrong", darkToastStyle)
      }
    } catch (error) {
      //  YAHAN FIX KIYA HAI: Daily limit catch aur modal logic
      const errorMessage = error.response?.data?.error || error.message || "Request failed"
      
      toast.error(errorMessage, darkToastStyle)

      if (error.response?.status === 403 || errorMessage.toLowerCase().includes("limit")) {
        setShowProModal(true)
      }
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    if (image) {
      setPreviewImage(URL.createObjectURL(image))
    }
  }, [image])

  // Pro-level dark transparent pattern (Photoshop style)
  const transparentPattern = {
    backgroundImage: 'repeating-conic-gradient(#18181b 0% 25%, #27272a 0% 50%)',
    backgroundPosition: '0 0, 10px 10px',
    backgroundSize: '20px 20px'
  }

  return (
    // Fixed layout for perfect dashboard scrolling
    <div className="w-full min-h-full flex flex-col lg:flex-row items-start justify-center gap-6 sm:gap-8 p-4 sm:p-6 bg-transparent relative">
      
      {/* Left Column (Upload Area) - Glassmorphism Dark */}
      <div className="w-full lg:w-1/2 max-w-xl p-6 sm:p-8 bg-zinc-900/40 backdrop-blur-md rounded-2xl border border-zinc-800/80 shadow-[0_4px_20px_rgba(0,0,0,0.5)]">
        <div className="flex items-center gap-3 mb-6">
          <div className="bg-blue-500/10 p-2.5 rounded-xl border border-blue-500/20 shadow-[0_0_15px_rgba(37,99,235,0.15)]">
            <Eraser className="w-6 h-6 text-blue-400" />
          </div>
          <h1 className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-purple-500">
            AI Background Remover
          </h1>
        </div>

        <label className="block cursor-pointer mt-8">
          <input
            type="file"
            accept="image/*"
            onChange={handleFileChange}
            className="hidden"
          />
          <div className="w-full p-8 border-2 border-dashed border-zinc-700 rounded-2xl bg-zinc-900/30 text-center hover:border-blue-500 hover:bg-zinc-800/80 transition-all duration-300 flex flex-col items-center justify-center gap-3 shadow-inner group">
            <div className="p-4 bg-zinc-800/50 rounded-full group-hover:bg-blue-500/10 transition-colors">
              <Upload className="w-8 h-8 text-zinc-400 group-hover:text-blue-400 transition-colors" />
            </div>
            {image ? (
              <p className="text-sm font-medium text-blue-400 tracking-wide break-all px-4">
                📎 {image.name}
              </p>
            ) : (
              <div>
                <p className="text-sm font-medium text-zinc-300">Drag & Drop or Click to Upload</p>
                <p className="text-xs text-zinc-500 mt-1">Supports JPG, PNG, WEBP</p>
              </div>
            )}
          </div>
        </label>

        <button
          disabled={loading}
          onClick={handleRemoveBackground}
          className="w-full flex justify-center items-center gap-2 
                      bg-gradient-to-r from-blue-600 to-purple-600 
                      text-white px-4 py-3.5 mt-8 text-sm font-medium tracking-wide
                      rounded-xl cursor-pointer hover:shadow-[0_0_20px_rgba(37,99,235,0.4)] 
                      hover:opacity-90 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {loading ? (
            <span className="flex items-center gap-2">
              <Loader2 className="w-4 h-4 animate-spin text-white" />
              Processing...
            </span>
          ) : (
            <>
              <Eraser className="w-4 h-4" />
              Remove Background
            </>
          )}
        </button>
      </div>

      {/* Right Column (Result Output) - Glassmorphism Dark */}
      <div className="w-full lg:w-1/2 max-w-xl p-6 sm:p-8 bg-zinc-900/40 backdrop-blur-md rounded-2xl border flex flex-col border-zinc-800/80 shadow-[0_4px_20px_rgba(0,0,0,0.5)] min-h-[450px]">
        <div className="flex items-center justify-between mb-6 pb-4 border-b border-zinc-800/80">
          <div className="flex items-center gap-2">
            <ImageIcon className="w-5 h-5 text-purple-400" />
            <h2 className="text-lg font-semibold text-white tracking-wide">Result Preview</h2>
          </div>
        </div>

        <div className="flex-1 flex flex-col items-center justify-center w-full">
          {loading ? (
            <div className="flex flex-col items-center gap-4 text-zinc-500">
              <span className="w-12 h-12 rounded-full border-4 border-zinc-800 border-t-blue-500 animate-spin shadow-[0_0_15px_rgba(37,99,235,0.5)]"></span>
              <p className="text-sm text-zinc-400 animate-pulse">AI is cutting out the background...</p>
            </div>
          ) : content ? (
            <div className="flex flex-col items-center gap-5 w-full">
              {/* Image Container with transparent checkered pattern */}
              <div 
                className="relative w-full rounded-xl overflow-hidden border border-zinc-700/50 shadow-lg flex justify-center items-center p-4 min-h-[250px]"
                style={transparentPattern}
              >
                <img
                  src={content}
                  alt="Background Removed"
                  className="max-h-[350px] object-contain drop-shadow-2xl"
                />
              </div>
              
              <a
                href={content}
                download="craftmind-bg-removed.png"
                className="w-full flex items-center justify-center gap-2 text-sm px-6 py-3.5 bg-zinc-800 hover:bg-zinc-700 text-white border border-zinc-700 rounded-xl transition-all duration-300 hover:shadow-[0_0_15px_rgba(255,255,255,0.1)]"
              >
                <Download className="w-4 h-4" />
                Download Transparent PNG
              </a>
            </div>
          ) : previewImage ? (
            <div className="flex flex-col items-center gap-5 w-full">
              <div className="relative w-full rounded-xl overflow-hidden border border-zinc-700/50 shadow-lg bg-zinc-950 flex justify-center items-center p-4">
                <img
                  src={previewImage}
                  alt="Original"
                  className="max-h-[350px] object-contain opacity-70"
                />
              </div>
              <p className="text-sm text-zinc-500">Click "Remove Background" to process.</p>
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center text-zinc-500">
              <div className="bg-zinc-900/50 p-4 rounded-full border border-zinc-800 mb-4">
                <Upload className="w-10 h-10 text-zinc-600" />
              </div>
              <p className="text-center text-sm max-w-xs leading-relaxed">
                Upload an image to magically remove its background using AI.
              </p>
            </div>
          )}
        </div>
      </div>

      {/*  PRO PLAN UPGRADE MODAL */}
      {showProModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4">
          <div className="bg-zinc-900 border border-zinc-700 p-8 rounded-2xl w-full max-w-md shadow-[0_0_40px_rgba(168,85,247,0.2)] text-center relative animate-fade-in-up">
            
            <button 
              onClick={() => setShowProModal(false)}
              className="absolute top-4 right-4 text-zinc-400 hover:text-white transition"
            >
              ✕
            </button>

            <div className="mx-auto w-16 h-16 bg-gradient-to-tr from-purple-500 to-blue-500 rounded-full flex items-center justify-center mb-6 shadow-lg">
              <FaGem className="text-white text-2xl" />
            </div>

            <h2 className="text-2xl font-bold text-white mb-2">
              Daily Limit Reached!
            </h2>
            <p className="text-zinc-400 mb-6 text-sm">
              You have used all your free credits for today. Upgrade to our <span className="text-purple-400 font-semibold">Pro Plan</span> to get 50 credits per tool everyday and unlock premium features.
            </p>

            <button 
              onClick={() => {
                toast("Redirecting to Pricing...", { icon: '🚀', ...darkToastStyle });
                setShowProModal(false); 
                // window.location.href = '/pricing'; // Navigate karne ke liye yahan route add kar sakte ho
              }}
              className="w-full py-3 px-4 bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-500 hover:to-blue-500 text-white font-bold rounded-xl transition-all shadow-[0_0_20px_rgba(168,85,247,0.4)]"
            >
              Upgrade to Pro
            </button>
            
            <button 
              onClick={() => setShowProModal(false)}
              className="w-full mt-3 py-3 px-4 bg-zinc-800 hover:bg-zinc-700 text-zinc-300 font-medium rounded-xl transition-all"
            >
              Maybe Later
            </button>
          </div>
        </div>
      )}

    </div>
  )
}

export default RemoveBackground