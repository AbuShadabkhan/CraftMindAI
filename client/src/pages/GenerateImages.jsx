import React from "react"
import { Image as ImageIcon, Sparkles, Download } from "lucide-react"
import { FaGem } from "react-icons/fa" // 🔥 Added for the Pro Popup Icon
import { useAuth } from "@clerk/clerk-react"
import toast from "react-hot-toast"
import apiClient from "../lib/api"

const GenerateImages = () => {
  const styles = [
    { name: "Realistic" },
    { name: "Ghibli Style" },
    { name: "Pixel Art" },
    { name: "Cartoon" },
    { name: "Fantasy style" },
    { name: "3D style" },
  ]

  const [selectedStyle, setSelectedStyle] = React.useState(styles[0])
  const [input, setInput] = React.useState("")
  const [generatedImage, setGeneratedImage] = React.useState(null)
  const [publish, setPublish] = React.useState(false)
  const [loading, setLoading] = React.useState(false)
  const [showProModal, setShowProModal] = React.useState(false) // 🚀 Naya state popup ke liye

  const { getToken } = useAuth()

  // Custom toast style for dark theme
  const darkToastStyle = {
    style: { background: '#18181b', color: '#fff', border: '1px solid #27272a' }
  }

  const onSubmitHandler = async (e) => {
    e.preventDefault()
    if (!input.trim()) {
      toast.error("Please describe your image", darkToastStyle)
      return
    }

    try {
      setLoading(true)
      const prompt = `Generate an image of ${input} in the style of ${selectedStyle.name}.`

      const { data } = await apiClient.post(
        "/ai/generate-image",
        { prompt, publish },
        {
          headers: { Authorization: `Bearer ${await getToken()}` },
        }
      )

      if (data.success) {
        setGeneratedImage(data.content)
      } else {
        toast.error(data.message || "Something went wrong", darkToastStyle)
      }
    } catch (error) {
      // 🚀 YAHAN FIX KIYA HAI: Ab koi bhi error ignore nahi hoga!
      const errorMessage = error.response?.data?.error || error.message || "Request failed";
      
      // Screen par hamesha error message dikhayenge
      toast.error(errorMessage, darkToastStyle);

      // Agar error 403 hai ya message me 'limit' word hai, toh popup khol do
      if (error.response?.status === 403 || errorMessage.toLowerCase().includes("limit")) {
        setShowProModal(true);
      }
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="w-full min-h-full flex flex-col lg:flex-row items-start justify-center gap-6 sm:gap-8 p-4 sm:p-6 bg-transparent relative">
      
      {/* Left Column (Input Form) - Glassmorphism Dark */}
      <form
        onSubmit={onSubmitHandler}
        className="w-full lg:w-1/2 max-w-xl p-6 sm:p-8 bg-zinc-900/40 backdrop-blur-md rounded-2xl border border-zinc-800/80 shadow-[0_4px_20px_rgba(0,0,0,0.5)]"
      >
        <div className="flex items-center gap-3 mb-6">
          <div className="bg-blue-500/10 p-2.5 rounded-xl border border-blue-500/20 shadow-[0_0_15px_rgba(37,99,235,0.15)]">
            <Sparkles className="w-6 h-6 text-blue-400" />
          </div>
          <h1 className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-purple-500">
            AI Image Generator
          </h1>
        </div>

        <label className="block mt-4 text-sm font-medium text-zinc-400 tracking-wide mb-2">
          Describe Your Image
        </label>
        <textarea
          onChange={(e) => setInput(e.target.value)}
          value={input}
          rows={3}
          className="w-full p-3.5 text-sm rounded-xl bg-zinc-900/50 border border-zinc-700 text-white focus:border-blue-500 focus:ring-1 focus:ring-blue-500 placeholder-zinc-600 outline-none transition-all duration-300 shadow-inner custom-scrollbar resize-none"
          placeholder="E.g., A futuristic cyberpunk city with neon lights..."
          required
        />

        <label className="block mt-8 text-sm font-medium text-zinc-400 tracking-wide mb-3">
          Art Style
        </label>
        <div className="flex gap-2.5 flex-wrap">
          {styles.map((style, index) => (
            <span
              key={index}
              onClick={() => setSelectedStyle(style)}
              className={`text-sm px-4 py-2 rounded-full cursor-pointer transition-all duration-300 border 
                ${
                  selectedStyle.name === style.name
                    ? "bg-blue-500/20 border-blue-500/50 text-blue-400 shadow-[0_0_10px_rgba(37,99,235,0.2)] font-medium"
                    : "bg-zinc-900/30 border-zinc-700 text-zinc-400 hover:bg-zinc-800 hover:border-zinc-500 hover:text-zinc-200"
                }`}
            >
              {style.name}
            </span>
          ))}
        </div>

        {/* Premium Dark Mode Toggle Switch */}
        <div className="mt-8 mb-4 p-4 rounded-xl bg-zinc-900/50 border border-zinc-800/80 flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-zinc-300">Make this image Public</p>
            <p className="text-xs text-zinc-500 mt-0.5">Allow others to see your creation</p>
          </div>
          <label className="relative cursor-pointer flex items-center">
            <input
              type="checkbox"
              onChange={(e) => setPublish(e.target.checked)}
              checked={publish}
              className="sr-only peer"
            />
            <div className="w-11 h-6 bg-zinc-700 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-500 shadow-inner"></div>
          </label>
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full flex justify-center items-center gap-2 
                      bg-gradient-to-r from-blue-600 to-purple-600 
                      text-white px-4 py-3.5 mt-6 text-sm font-medium tracking-wide
                      rounded-xl cursor-pointer hover:shadow-[0_0_20px_rgba(37,99,235,0.4)] 
                      hover:opacity-90 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {loading ? (
            <span className="flex items-center gap-2">
              <span className="w-4 h-4 rounded-full border-2 border-zinc-300 border-t-white animate-spin"></span>
              Generating...
            </span>
          ) : (
            <>
              <ImageIcon className="w-4 h-4" />
              Generate Image
            </>
          )}
        </button>
      </form>

      {/* Right Column (Generated Output) */}
      <div className="w-full lg:w-1/2 max-w-xl p-6 sm:p-8 bg-zinc-900/40 backdrop-blur-md rounded-2xl border flex flex-col border-zinc-800/80 shadow-[0_4px_20px_rgba(0,0,0,0.5)]">
        <div className="flex items-center justify-between mb-4 pb-3 border-b border-zinc-800/80">
          <div className="flex items-center gap-2">
            <ImageIcon className="w-5 h-5 text-purple-400" />
            <h1 className="text-lg font-semibold text-white tracking-wide">Generated Output</h1>
          </div>
        </div>

        {/* Content Area */}
        <div className="flex-1 flex flex-col justify-center items-center py-2">
          {!generatedImage ? (
            <div className="flex flex-col items-center justify-center text-zinc-500 py-16">
              {loading ? (
                <div className="flex flex-col items-center gap-4">
                  <span className="w-12 h-12 rounded-full border-4 border-zinc-800 border-t-blue-500 animate-spin shadow-[0_0_15px_rgba(37,99,235,0.5)]"></span>
                  <p className="text-sm text-zinc-400 animate-pulse">Crafting your vision...</p>
                </div>
              ) : (
                <>
                  <div className="bg-zinc-900/50 p-4 rounded-full border border-zinc-800 mb-4">
                    <ImageIcon className="w-10 h-10 text-zinc-600" />
                  </div>
                  <p className="text-center text-sm max-w-xs leading-relaxed">
                    Describe an image and click <strong className="text-zinc-400">"Generate Image"</strong> to get started.
                  </p>
                </>
              )}
            </div>
          ) : (
            <div className="flex flex-col items-center gap-4 w-full">
              <div className="relative w-full rounded-xl overflow-hidden border border-zinc-700/50 shadow-lg bg-zinc-950 flex justify-center">
                <img
                  src={generatedImage}
                  alt="AI Generated"
                  className="w-full max-h-[320px] object-contain"
                />
              </div>
              
              <a
                href={generatedImage}
                download="craftmind-ai-image.png"
                className="w-full flex items-center justify-center gap-2 text-sm px-6 py-3 bg-zinc-800 hover:bg-zinc-700 text-white border border-zinc-700 rounded-xl transition-all duration-300"
              >
                <Download className="w-4 h-4" />
                Download High-Res Image
              </a>
              <p className="text-zinc-500 text-xs font-medium tracking-wide">
                Status: {publish ? <span className="text-blue-400">Public Creation</span> : <span className="text-zinc-400">Private Creation</span>}
              </p>
            </div>
          )}
        </div>
      </div>
      
      {/* 🚀 PRO PLAN UPGRADE MODAL */}
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
                // window.location.href = '/pricing'; // Ise un-comment kar sakte ho page redirect karne ke liye
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

export default GenerateImages