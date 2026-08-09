import React, { useState, useRef, useEffect } from "react"
import { Scissors, Upload, Loader2, Eraser, RotateCcw, Download } from "lucide-react"
import { FaGem } from "react-icons/fa" //  Modal icon import 
import toast from "react-hot-toast"
import { useAuth } from "@clerk/clerk-react"
import apiClient from "../lib/api"

const RemoveObject = () => {
  const [image, setImage] = useState(null)
  const [previewImage, setPreviewImage] = useState(null)
  const [processedImage, setProcessedImage] = useState(null)
  const [loading, setLoading] = useState(false)
  const [brushSize, setBrushSize] = useState(30)
  const [isDrawing, setIsDrawing] = useState(false)
  const [hasDrawn, setHasDrawn] = useState(false)
  const [showProModal, setShowProModal] = useState(false) // 🚀 Naya state popup ke liye

  const canvasRef = useRef(null)
  const imgRef = useRef(null)
  const { getToken } = useAuth()

  // Custom dark toast style (Dry code)
  const darkToastStyle = {
    style: { background: '#18181b', color: '#fff', border: '1px solid #27272a' }
  }

  useEffect(() => {
    return () => {
      if (previewImage) URL.revokeObjectURL(previewImage)
    }
  }, [previewImage])

  const handleFileChange = (e) => {
    const file = e.target.files[0]
    if (!file) return

    if (!file.type.startsWith("image/")) {
      toast.error("Please upload a valid image file", darkToastStyle)
      e.target.value = ""
      return
    }
    if (file.size > 10 * 1024 * 1024) {
      toast.error("Maximum 10MB image allowed", darkToastStyle)
      e.target.value = ""
      return
    }

    if (previewImage) URL.revokeObjectURL(previewImage)

    setImage(file)
    setPreviewImage(URL.createObjectURL(file))
    setProcessedImage(null)
    setHasDrawn(false)
    e.target.value = ""
  }

  const handleImageLoad = () => {
    const canvas = canvasRef.current
    const img = imgRef.current
    if (canvas && img) {
      canvas.width = img.clientWidth
      canvas.height = img.clientHeight
      const ctx = canvas.getContext("2d")
      ctx.clearRect(0, 0, canvas.width, canvas.height)
    }
  }

  useEffect(() => {
    if (previewImage) {
      handleImageLoad()
    }
  }, [previewImage])

  const getPos = (e) => {
    const canvas = canvasRef.current
    if (!canvas) return { x: 0, y: 0 }
    const rect = canvas.getBoundingClientRect()
    const clientX = e.touches ? e.touches[0].clientX : e.clientX
    const clientY = e.touches ? e.touches[0].clientY : e.clientY
    return { x: clientX - rect.left, y: clientY - rect.top }
  }

  const startDrawing = (e) => {
    e.preventDefault()
    setIsDrawing(true)
    const canvas = canvasRef.current
    const ctx = canvas.getContext("2d")
    const { x, y } = getPos(e)
    ctx.beginPath()
    ctx.moveTo(x, y)
  }

  const stopDrawing = () => {
    setIsDrawing(false)
    const canvas = canvasRef.current
    if (canvas) canvas.getContext("2d").closePath()
  }

  const draw = (e) => {
    e.preventDefault()
    if (!isDrawing) return
    const canvas = canvasRef.current
    const ctx = canvas.getContext("2d")
    const { x, y } = getPos(e)

    ctx.lineWidth = brushSize
    ctx.lineCap = "round"
    ctx.lineJoin = "round"
    // Keep this red for backend mask detection logic
    ctx.strokeStyle = "rgb(255, 0, 0)"
    ctx.lineTo(x, y)
    ctx.stroke()
    setHasDrawn(true)
  }

  const clearCanvas = () => {
    const canvas = canvasRef.current
    const ctx = canvas.getContext("2d")
    ctx.clearRect(0, 0, canvas.width, canvas.height)
    setHasDrawn(false)
  }

  const generateMaskBlob = () => {
    return new Promise((resolve) => {
      const canvas = canvasRef.current
      const img = imgRef.current
      
      const maskCanvas = document.createElement("canvas")
      maskCanvas.width = img.naturalWidth
      maskCanvas.height = img.naturalHeight
      const ctx = maskCanvas.getContext("2d")

      ctx.fillStyle = "black"
      ctx.fillRect(0, 0, maskCanvas.width, maskCanvas.height)

      ctx.drawImage(
        canvas,
        0, 0, canvas.width, canvas.height,
        0, 0, maskCanvas.width, maskCanvas.height
      )

      const imgData = ctx.getImageData(0, 0, maskCanvas.width, maskCanvas.height)
      for (let i = 0; i < imgData.data.length; i += 4) {
        const red = imgData.data[i]
        const green = imgData.data[i + 1]
        const blue = imgData.data[i + 2]
        const alpha = imgData.data[i + 3]

        if (alpha > 0 && red > 50 && green < 50 && blue < 50) {
          imgData.data[i] = 255
          imgData.data[i + 1] = 255
          imgData.data[i + 2] = 255
          imgData.data[i + 3] = 255
        } else {
          imgData.data[i] = 0
          imgData.data[i + 1] = 0
          imgData.data[i + 2] = 0
          imgData.data[i + 3] = 255
        }
      }
      ctx.putImageData(imgData, 0, 0)
      maskCanvas.toBlob((blob) => resolve(blob), "image/png")
    })
  }

  const handleRemoveObject = async () => {
    if (loading) return
    if (!image) return toast.error("Please upload an image first!", darkToastStyle)
    if (!hasDrawn) return toast.error("Please mark the object to remove by drawing over it!", darkToastStyle)

    setLoading(true)
    try {
      const maskBlob = await generateMaskBlob()
      
      const normalizedImageBlob = await new Promise((resolve) => {
        const imgCanvas = document.createElement("canvas")
        const img = imgRef.current
        imgCanvas.width = img.naturalWidth
        imgCanvas.height = img.naturalHeight
        const ctx = imgCanvas.getContext("2d")
        ctx.drawImage(img, 0, 0, imgCanvas.width, imgCanvas.height)
        imgCanvas.toBlob(resolve, "image/png")
      })

      const formData = new FormData()
      formData.append("image", normalizedImageBlob, "image.png")
      formData.append("mask", maskBlob, "mask.png")

      const { data } = await apiClient.post("/ai/remove-image-object", formData, {
        headers: { Authorization: `Bearer ${await getToken()}` },
      })

      if (data.success) {
        setProcessedImage(data.content)
      } else {
        toast.error(data.message || "Something went wrong", darkToastStyle)
      }
    } catch (error) {
      //  YAHAN FIX KIYA HAI: Limit popup dikhane ke liye
      const errorMessage = error.response?.data?.error || error.response?.data?.message || error.message || "Request failed"
      
      toast.error(errorMessage, darkToastStyle)

      if (error.response?.status === 403 || errorMessage.toLowerCase().includes("limit")) {
        setShowProModal(true)
      }
    } finally {
      setLoading(false)
    }
  }

  return (
    // Responsive flex layout instead of grid for consistent dashboard scrolling
    <div className="w-full min-h-full flex flex-col lg:flex-row items-start justify-center gap-6 sm:gap-8 p-4 sm:p-6 bg-transparent relative">
      
      {/* Left Column (Upload & Tools) */}
      <div className="w-full lg:w-1/2 max-w-xl p-6 sm:p-8 bg-zinc-900 lg:bg-zinc-900/40 lg:backdrop-blur-md rounded-2xl border border-zinc-800/80 shadow-md lg:shadow-[0_4px_20px_rgba(0,0,0,0.5)]">
        <div className="flex items-center gap-3 mb-6">
          <div className="bg-blue-500/10 p-2.5 rounded-xl border border-blue-500/20 shadow-[0_0_15px_rgba(37,99,235,0.15)]">
            <Scissors className="w-6 h-6 text-blue-400" />
          </div>
          <h1 className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-purple-500">
            AI Object Remover
          </h1>
        </div>

        <label className="block cursor-pointer mt-6">
          <input type="file" accept="image/*" onChange={handleFileChange} className="hidden" />
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

        {previewImage && (
          <div className="mt-6">
            <p className="text-sm font-medium text-zinc-400 tracking-wide mb-3">
              Draw over the object to remove:
            </p>
            <div className="relative inline-block w-full rounded-xl overflow-hidden border border-zinc-700/50 shadow-lg bg-zinc-950">
              <img
                ref={imgRef}
                src={previewImage}
                alt="Uploaded"
                onLoad={handleImageLoad}
                className="w-full select-none opacity-90"
                draggable={false}
              />
              <canvas
                ref={canvasRef}
                style={{ width: "100%", height: "100%" }}
                className="absolute top-0 left-0 cursor-crosshair touch-none"
                onMouseDown={startDrawing}
                onMouseMove={draw}
                onMouseUp={stopDrawing}
                onMouseLeave={stopDrawing}
                onTouchStart={startDrawing}
                onTouchMove={draw}
                onTouchEnd={stopDrawing}
              />
            </div>

            {/* Premium Brush Tools */}
            <div className="flex items-center gap-4 mt-4 bg-zinc-900/50 p-4 rounded-xl border border-zinc-800/80">
              <label className="text-sm font-medium text-zinc-400 whitespace-nowrap">Brush Size</label>
              <input
                type="range"
                min="10"
                max="80"
                value={brushSize}
                onChange={(e) => setBrushSize(Number(e.target.value))}
                className="flex-1 accent-blue-500 bg-zinc-800 rounded-lg outline-none"
              />
              <button
                onClick={clearCanvas}
                type="button"
                className="flex items-center gap-1.5 text-xs font-medium px-3.5 py-2 rounded-lg bg-zinc-800/80 border border-zinc-700 text-zinc-300 hover:bg-zinc-700 hover:text-white transition-all duration-300"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                Clear
              </button>
            </div>
          </div>
        )}

        <button
          disabled={loading}
          onClick={handleRemoveObject}
          className="w-full flex justify-center items-center gap-2 
                      bg-gradient-to-r from-blue-600 to-purple-600 
                      text-white px-4 py-3.5 mt-8 text-sm font-medium tracking-wide
                      rounded-xl cursor-pointer hover:shadow-[0_0_20px_rgba(37,99,235,0.4)] 
                      hover:opacity-90 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {loading ? (
            <span className="flex items-center gap-2">
              <Loader2 className="w-4 h-4 animate-spin text-white" />
              Processing Image...
            </span>
          ) : (
            <>
              <Eraser className="w-4 h-4" />
              Remove Object
            </>
          )}
        </button>
      </div>

      {/* Right Column (Result Output) */}
      <div className="w-full lg:w-1/2 max-w-xl p-6 sm:p-8 bg-zinc-900 lg:bg-zinc-900/40 lg:backdrop-blur-md rounded-2xl border flex flex-col border-zinc-800/80 shadow-md lg:shadow-[0_4px_20px_rgba(0,0,0,0.5)] min-h-[450px]">
        <div className="flex items-center justify-between mb-6 pb-4 border-b border-zinc-800/80">
          <div className="flex items-center gap-2">
            <Scissors className="w-5 h-5 text-purple-400" />
            <h2 className="text-lg font-semibold text-white tracking-wide">Output Preview</h2>
          </div>
        </div>

        <div className="flex-1 flex flex-col items-center justify-center w-full">
          {loading ? (
            <div className="flex flex-col items-center gap-4 text-zinc-500">
              <span className="w-12 h-12 rounded-full border-4 border-zinc-800 border-t-blue-500 animate-spin shadow-[0_0_15px_rgba(37,99,235,0.5)]"></span>
              <p className="text-sm text-zinc-400 animate-pulse">AI is removing the object...</p>
            </div>
          ) : processedImage ? (
            <div className="flex flex-col items-center gap-5 w-full">
              <div className="relative w-full rounded-xl overflow-hidden border border-zinc-700/50 shadow-lg bg-zinc-950 flex justify-center items-center p-2">
                <img 
                  src={processedImage} 
                  alt="Processed" 
                  className="max-h-[400px] object-contain drop-shadow-2xl" 
                />
              </div>
              <a
                href={processedImage}
                download={`object_removed_${Date.now()}.png`}
                className="w-full flex items-center justify-center gap-2 text-sm px-6 py-3.5 bg-zinc-800 hover:bg-zinc-700 text-white border border-zinc-700 rounded-xl transition-all duration-300 hover:shadow-[0_0_15px_rgba(255,255,255,0.1)]"
              >
                <Download className="w-4 h-4" />
                Download Final Image
              </a>
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center text-zinc-500">
              <div className="bg-zinc-900/50 p-4 rounded-full border border-zinc-800 mb-4">
                <Upload className="w-10 h-10 text-zinc-600" />
              </div>
              <p className="text-center text-sm max-w-xs leading-relaxed">
                Upload an image, draw over the unwanted object, and click <strong className="text-zinc-400">"Remove Object"</strong>
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

export default RemoveObject