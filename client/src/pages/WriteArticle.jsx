import React, { useState } from 'react'
import { Sparkles, Edit, Copy, Check } from 'lucide-react'
import { FaGem } from 'react-icons/fa' //  Modal Icon import 
import { useAuth } from '@clerk/clerk-react'
import { toast } from 'react-hot-toast'
import Markdown from 'react-markdown'
import apiClient from '../lib/api'

const WriteArticle = () => {
  const articleLength = [
    { length: 800, text: 'Short (500-800 words)' },
    { length: 1200, text: 'Medium (800-1200 words)' },
    { length: 1600, text: 'Long (1200-1600 words)' },
  ]

  const [selectedLength, setSelectedLength] = useState(articleLength[0])
  const [input, setInput] = useState('')
  const [loading, setLoading] = useState(false)
  const [content, setContent] = useState('')
  const [copied, setCopied] = useState(false)
  const [showProModal, setShowProModal] = useState(false) // 🚀 Naya state popup ke liye

  const { getToken } = useAuth()

  // Custom dark toast styling (Dry code)
  const darkToastStyle = {
    style: { background: '#18181b', color: '#fff', border: '1px solid #27272a' }
  }

  const onSubmitHandler = async (e) => {
    e.preventDefault()
    if (!input.trim()) {
      toast.error('Please enter a valid topic.', darkToastStyle)
      return
    }

    try {
      setLoading(true)
      const prompt = `Write an article about ${input} in ${selectedLength.text}`

      const { data } = await apiClient.post(
        '/ai/generate-article',
        { prompt, length: selectedLength.length },
        {
          headers: {
            Authorization: `Bearer ${await getToken()}`,
          },
        }
      )

      if (data.success) {
        setContent(data.content)
      } else {
        toast.error(data.message || 'Something went wrong', darkToastStyle)
      }
    } catch (error) {
      //  YAHAN FIX KIYA HAI: Daily limit pakadne aur modal open karne ke liye
      console.error(error)
      const errorMessage = error.response?.data?.error || error.message || 'Failed to generate article.'
      
      toast.error(errorMessage, darkToastStyle)

      if (error.response?.status === 403 || errorMessage.toLowerCase().includes('limit')) {
        setShowProModal(true)
      }
    } finally {
      setLoading(false)
    }
  }

  const handleCopy = () => {
    navigator.clipboard.writeText(content)
    setCopied(true)
    toast.success('Copied to clipboard', darkToastStyle)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <div className="w-full min-h-full flex flex-col lg:flex-row items-start justify-center gap-6 sm:gap-8 p-4 sm:p-6 bg-transparent relative">
      
      {/* Left Column (Input Form) */}
      <form
        onSubmit={onSubmitHandler}
        className="w-full lg:w-1/2 max-w-xl p-6 sm:p-8 bg-zinc-900/40 backdrop-blur-md rounded-2xl border border-zinc-800/80 shadow-[0_4px_20px_rgba(0,0,0,0.5)]"
      >
        <div className="flex items-center gap-3 mb-6">
          <div className="bg-blue-500/10 p-2.5 rounded-xl border border-blue-500/20 shadow-[0_0_15px_rgba(37,99,235,0.15)]">
            <Sparkles className="w-6 h-6 text-blue-400" />
          </div>
          <h1 className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-purple-500">
            Article Configuration
          </h1>
        </div>

        <label className="block mt-4 text-sm font-medium text-zinc-400 tracking-wide mb-2">
          Article Topic
        </label>
        <input
          onChange={(e) => setInput(e.target.value)}
          type="text"
          value={input}
          className="w-full p-3.5 text-sm rounded-xl bg-zinc-900/50 border border-zinc-700 text-white focus:border-blue-500 focus:ring-1 focus:ring-blue-500 placeholder-zinc-600 outline-none transition-all duration-300 shadow-inner"
          placeholder="E.g., The future of artificial intelligence is..."
          required
        />

        <label className="block mt-8 text-sm font-medium text-zinc-400 tracking-wide mb-3">
          Article Length
        </label>
        <div className="flex gap-2.5 flex-wrap">
          {articleLength.map((item, index) => (
            <span
              key={index}
              onClick={() => setSelectedLength(item)}
              className={`text-sm px-4 py-2 rounded-full cursor-pointer transition-all duration-300 border 
                ${selectedLength.text === item.text
                  ? 'bg-blue-500/20 border-blue-500/50 text-blue-400 shadow-[0_0_10px_rgba(37,99,235,0.2)] font-medium'
                  : 'bg-zinc-900/30 border-zinc-700 text-zinc-400 hover:bg-zinc-800 hover:border-zinc-500 hover:text-zinc-200'
                }`}
            >
              {item.text}
            </span>
          ))}
        </div>

        <button
          disabled={loading}
          type="submit"
          className="w-full flex justify-center items-center gap-2 
                      bg-gradient-to-r from-blue-600 to-purple-600 
                      text-white px-4 py-3.5 mt-10 text-sm font-medium tracking-wide
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
              <Edit className="w-4 h-4" />
              <span>Generate Article</span>
            </>
          )}
        </button>
      </form>

      {/* Right Column (Generated Output) */}
      <div className="w-full lg:w-1/2 max-w-xl p-6 sm:p-8 bg-zinc-900/40 backdrop-blur-md rounded-2xl border flex flex-col border-zinc-800/80 shadow-[0_4px_20px_rgba(0,0,0,0.5)] min-h-[450px] max-h-[600px]">
        <div className="flex items-center justify-between mb-6 pb-4 border-b border-zinc-800/80">
          <div className="flex items-center gap-2">
            <Edit className="w-5 h-5 text-purple-400" />
            <h1 className="text-lg font-semibold text-white tracking-wide">Generated Article</h1>
          </div>
          {content && (
            <button
              onClick={handleCopy}
              className="flex items-center gap-1.5 text-xs font-medium px-3.5 py-2 rounded-lg bg-zinc-800/50 border border-zinc-700 text-zinc-300 hover:bg-zinc-700 hover:text-white transition-all duration-300"
            >
              {copied ? <Check className="w-4 h-4 text-green-400" /> : <Copy className="w-4 h-4" />}
              {copied ? 'Copied!' : 'Copy Text'}
            </button>
          )}
        </div>

        {/* Content Area */}
        <div className="flex-1 overflow-y-auto custom-scrollbar pr-2">
          {loading ? (
            <div className="h-full flex justify-center items-center">
              <span className="w-10 h-10 border-4 border-zinc-800 border-t-blue-500 rounded-full animate-spin shadow-[0_0_15px_rgba(37,99,235,0.5)]" />
            </div>
          ) : !content ? (
            <div className="h-full flex flex-col items-center justify-center text-zinc-500 mt-10">
              <div className="bg-zinc-900/50 p-4 rounded-full border border-zinc-800 mb-4">
                <Edit className="w-10 h-10 text-zinc-600" />
              </div>
              <p className="text-center text-sm max-w-xs leading-relaxed">
                Enter a topic and click <strong className="text-zinc-400">"Generate Article"</strong> to get started.
              </p>
            </div>
          ) : (
            <div 
              className="text-sm text-zinc-100 leading-relaxed space-y-4 [&_*]:text-zinc-100 [&_p]:text-zinc-100 [&_strong]:text-white [&_li]:text-zinc-100 [&_h1]:text-white [&_h2]:text-white [&_h3]:text-white"
              style={{ color: '#f4f4f5' }}
            >
              <Markdown>{content}</Markdown>
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
                // window.location.href = '/pricing'; 
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

export default WriteArticle