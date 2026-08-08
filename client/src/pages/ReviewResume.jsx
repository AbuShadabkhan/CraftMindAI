import React, { useState } from "react";
import toast from "react-hot-toast";
import { FileText, Upload, Sparkles, Loader2, CheckCircle2 } from "lucide-react";
import { FaGem } from "react-icons/fa"; //  Modal icon import 
import Markdown from "react-markdown";
import { useAuth } from "@clerk/clerk-react";
import apiClient from "../lib/api";

export default function ResumeReview() {
  const [file, setFile] = useState(null);
  const [result, setResult] = useState("");
  const [content, setContent] = useState("");
  const [loading, setLoading] = useState(false);
  const [showProModal, setShowProModal] = useState(false); // 🚀 Naya state popup ke liye
  const { getToken } = useAuth();

  // Custom dark toast styling
  const darkToastStyle = {
    style: { background: '#18181b', color: '#fff', border: '1px solid #27272a' }
  };

  // File selection
  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
  };

  // Submit to backend
  const onSubmitHandler = async (e) => {
    e.preventDefault();
    if (!file) {
      toast.error("Please upload a resume first!", darkToastStyle);
      return;
    }

    try {
      setLoading(true);
      const formData = new FormData();
      formData.append("resume", file);

      const token = await getToken();

      //  Yahan direct axios ki jagah apiClient का use kiya hai
      const { data } = await apiClient.post("/ai/resume-review", formData, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (data.success) {
        setContent(data.content);
        toast.success("Resume analyzed successfully!", darkToastStyle);
      } else {
        toast.error(data.message || "Something went wrong", darkToastStyle);
      }

      setResult(data);
    } catch (error) {
      //  YAHAN FIX KIYA HAI: Limit error pakadne aur modal open karne ke liye
      const errorMessage = error.response?.data?.error || error.response?.data?.message || error.message || "Request failed";
      
      toast.error(errorMessage, darkToastStyle);

      if (error.response?.status === 403 || errorMessage.toLowerCase().includes("limit")) {
        setShowProModal(true);
      }
    } finally {
      setLoading(false);
    }
  };

  // Fake analysis (fallback demo)
  const handleReview = () => {
    if (!file) {
      setResult("⚠️ Please upload a resume first!");
      return;
    }
    const demoText = `### ✅ Resume Analyzed Successfully!\n\n**File:** ${file.name}\n\n✨ **AI Recommendations:**\n\n*   **Impactful Metrics:** Add measurable achievements (e.g., "Increased efficiency by **20%**").\n*   **Keyword Optimization:** Tailor keywords specifically for the targeted job role to pass ATS filters.\n*   **Concise Formatting:** Keep bullet points under two lines for better readability.\n*   **Skill Highlighting:** Move your top technical skills closer to the top of the document.`;
    
    setResult(demoText);
    setContent(demoText);
  };

  return (
    // Fixed layout for perfect dashboard scrolling
    <div className="w-full min-h-full flex flex-col lg:flex-row items-start justify-center gap-6 sm:gap-8 p-4 sm:p-6 bg-transparent relative">
      
      {/* Left Column (Upload Form) - Glassmorphism Dark */}
      <form
        onSubmit={onSubmitHandler}
        className="w-full lg:w-1/2 max-w-xl p-6 sm:p-8 bg-zinc-900/40 backdrop-blur-md rounded-2xl border border-zinc-800/80 shadow-[0_4px_20px_rgba(0,0,0,0.5)] flex flex-col"
      >
        <div className="flex items-center gap-3 mb-6 self-start">
          <div className="bg-blue-500/10 p-2.5 rounded-xl border border-blue-500/20 shadow-[0_0_15px_rgba(37,99,235,0.15)]">
            <FileText className="w-6 h-6 text-blue-400" />
          </div>
          <h1 className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-purple-500">
            AI Resume Review
          </h1>
        </div>

        <p className="text-sm font-medium text-zinc-400 tracking-wide mb-3">
          Upload your document
        </p>

        {/* Premium File Upload Box */}
        <label className="w-full cursor-pointer mb-6">
          <input
            type="file"
            accept=".pdf,.doc,.docx,.png,.jpg"
            onChange={handleFileChange}
            className="hidden"
          />
          <div className="w-full p-8 border-2 border-dashed border-zinc-700 rounded-2xl bg-zinc-900/30 text-center hover:border-blue-500 hover:bg-zinc-800/80 transition-all duration-300 flex flex-col items-center justify-center gap-3 shadow-inner group">
            <div className="p-4 bg-zinc-800/50 rounded-full group-hover:bg-blue-500/10 transition-colors">
              <Upload className="w-8 h-8 text-zinc-400 group-hover:text-blue-400 transition-colors" />
            </div>
            {file ? (
              <p className="text-sm font-medium text-blue-400 tracking-wide break-all px-4">
                📎 {file.name}
              </p>
            ) : (
              <div>
                <p className="text-sm font-medium text-zinc-300">Drag & Drop or Click to Upload</p>
                <p className="text-xs text-zinc-500 mt-1">Supports PDF, DOCX, JPG, PNG</p>
              </div>
            )}
          </div>
        </label>

        {/* Action Buttons */}
        <div className="flex flex-col gap-3 mt-auto">
          <button
            type="submit"
            disabled={loading}
            className="w-full flex justify-center items-center gap-2 
                       bg-gradient-to-r from-blue-600 to-purple-600 
                       text-white px-4 py-3.5 text-sm font-medium tracking-wide
                       rounded-xl cursor-pointer hover:shadow-[0_0_20px_rgba(37,99,235,0.4)] 
                       hover:opacity-90 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? (
              <span className="flex items-center gap-2">
                <Loader2 className="w-4 h-4 animate-spin text-white" />
                Analyzing Resume...
              </span>
            ) : (
              <>
                <Sparkles className="w-4 h-4" />
                Review Resume
              </>
            )}
          </button>

          <button
            type="button"
            onClick={handleReview}
            className="w-full flex justify-center items-center gap-2 
                       bg-zinc-800 hover:bg-zinc-700 text-zinc-300 border border-zinc-700
                       px-4 py-3 text-sm font-medium tracking-wide rounded-xl 
                       transition-all duration-300 hover:text-white"
          >
            <CheckCircle2 className="w-4 h-4" />
            Quick Demo Review
          </button>
        </div>
      </form>

      {/* Right Column (Results) - Glassmorphism Dark */}
      <div className="w-full lg:w-1/2 max-w-xl p-6 sm:p-8 bg-zinc-900/40 backdrop-blur-md rounded-2xl border flex flex-col border-zinc-800/80 shadow-[0_4px_20px_rgba(0,0,0,0.5)] min-h-[450px] max-h-[600px]">
        <div className="flex items-center justify-between mb-6 pb-4 border-b border-zinc-800/80">
          <div className="flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-purple-400" />
            <h1 className="text-lg font-semibold text-white tracking-wide">Analysis Results</h1>
          </div>
        </div>

        <div className="flex-1 overflow-y-auto custom-scrollbar pr-2">
          {loading ? (
             <div className="h-full flex flex-col items-center justify-center text-zinc-500 mt-10">
               <span className="w-12 h-12 rounded-full border-4 border-zinc-800 border-t-blue-500 animate-spin shadow-[0_0_15px_rgba(37,99,235,0.5)] mb-4"></span>
               <p className="text-sm text-zinc-400 animate-pulse">Scanning document for improvements...</p>
             </div>
          ) : content ? (
            <div 
              className="text-sm text-zinc-100 leading-relaxed space-y-4 [&_*]:text-zinc-100 [&_p]:text-zinc-100 [&_strong]:text-white [&_li]:text-zinc-100 [&_h1]:text-white [&_h2]:text-white [&_h3]:text-white"
              style={{ color: '#f4f4f5' }}
            >
              <Markdown>{content}</Markdown>
            </div>
          ) : (
            <div className="h-full flex flex-col items-center justify-center text-zinc-500 mt-10">
              <div className="bg-zinc-900/50 p-4 rounded-full border border-zinc-800 mb-4">
                <FileText className="w-10 h-10 text-zinc-600" />
              </div>
              <p className="text-center text-sm max-w-xs leading-relaxed">
                {result || (
                  <>
                    Upload your resume and click <strong className="text-zinc-400">"Review Resume"</strong> to get AI-powered suggestions.
                  </>
                )}
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
  );
}