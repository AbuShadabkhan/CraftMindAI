import React, { useState, useRef, useMemo } from "react";
import { Sparkles, Code, Play, Download, LayoutTemplate } from "lucide-react";
import { FaGem } from "react-icons/fa"; //  Modal icon import 
import { toast } from "react-hot-toast";
import { useAuth } from "@clerk/clerk-react"; 
import apiClient from "../lib/api";

const GenerateWebsite = () => {
  const [prompt, setPrompt] = useState("");
  const [loading, setLoading] = useState(false);
  const [code, setCode] = useState("");
  const [showCode, setShowCode] = useState(false);
  const [panelWidth, setPanelWidth] = useState(50); // % width for preview
  const [showProModal, setShowProModal] = useState(false); // 🚀 Naya state popup ke liye
  const isDragging = useRef(false);

  // Auth token nikalne ke liye
  const { getToken } = useAuth(); 

  // Custom dark toast style
  const darkToastStyle = {
    style: { background: '#18181b', color: '#fff', border: '1px solid #27272a' }
  };

  // --- Extract JSX, CSS, Links, Scripts from AI response ---
  const extractFromReactCode = (code) => {
    try {
      const match = code.match(/return\s*\(([\s\S]*?)\);?/);
      if (!match) return { jsx: "", css: "", links: "", scripts: "" };

      let jsx = match[1].trim();

      if (jsx.startsWith("(") && jsx.endsWith(")")) {
        jsx = jsx.slice(1, -1).trim();
      }

      jsx = jsx.replace(/className=/g, "class=");

      let css = "";
      const styleMatch = jsx.match(/<style[^>]*>[\s\S]*?<\/style>/);
      if (styleMatch) {
        css = styleMatch[0];
        jsx = jsx.replace(styleMatch[0], "");
      }

      let links = "";
      const linkMatches = jsx.match(/<link[^>]*rel=["']stylesheet["'][^>]*>/gi);
      if (linkMatches) {
        links = linkMatches.join("\n");
        linkMatches.forEach((link) => (jsx = jsx.replace(link, "")));
      }

      let scripts = "";
      const scriptMatches = jsx.match(/<script[\s\S]*?<\/script>/gi);
      if (scriptMatches) {
        scripts = scriptMatches.join("\n");
        scriptMatches.forEach((s) => (jsx = jsx.replace(s, "")));
      }

      return { jsx, css, links, scripts };
    } catch (error) {
      console.error("Failed to extract JSX/CSS/JS:", error);
      return { jsx: "", css: "", links: "", scripts: "" };
    }
  };

  // --- Iframe Live Preview ---
  const iframeSrcDoc = useMemo(() => {
    if (!code) return "";

    const { jsx, css, links, scripts } = extractFromReactCode(code);

    return `
      <html>
        <head>
          <meta charset="UTF-8" />
          <title>Live Preview</title>
          <script src="https://cdn.tailwindcss.com"></script>
          ${links}
          ${css}
        </head>
        <body class="p-6 bg-white text-black">
          ${jsx}
          ${scripts}
        </body>
      </html>
    `;
  }, [code]);

  // --- Drag Bar Handlers ---
  const startDrag = () => (isDragging.current = true);
  const stopDrag = () => (isDragging.current = false);
  const onDrag = (e) => {
    if (!isDragging.current) return;
    const newWidth = (e.clientX / window.innerWidth) * 100;
    if (newWidth > 20 && newWidth < 80) {
      setPanelWidth(newWidth);
    }
  };

  // --- Submit Handler ---
  const onSubmitHandler = async (e) => {
    e.preventDefault();
    if (!prompt.trim()) {
      toast.error("Please enter a valid prompt.", darkToastStyle);
      return;
    }

    try {
      setLoading(true);
      
      const { data } = await apiClient.post(
        "/ai/generate-website", 
        { prompt },
        {
          headers: { Authorization: `Bearer ${await getToken()}` },
        }
      );
      
      if (data.success) {
        setCode(data.code);
        toast.success("Website generated successfully!", darkToastStyle);
      } else {
        toast.error(data.error || "Failed to generate website code", darkToastStyle);
      }
    } catch (error) {
      // Detailed error logging for debugging
      console.error("Website Generation Error:", error);
      const errorMessage = error.response?.data?.error || error.message || "Failed to generate website code.";
      
      toast.error(errorMessage, darkToastStyle);

      if (error.response?.status === 403 || errorMessage.toLowerCase().includes("limit")) {
        setShowProModal(true);
      }
    } finally {
      setLoading(false);
    }
  };

  // --- Download HTML ---
  const downloadHTML = () => {
    if (!iframeSrcDoc) return;

    const blob = new Blob([iframeSrcDoc], { type: "text/html" });
    const url = URL.createObjectURL(blob);

    const a = document.createElement("a");
    a.href = url;
    a.download = "craftmind-website.html";
    a.click();

    URL.revokeObjectURL(url);
    toast.success("HTML downloaded!", darkToastStyle);
  };

  return (
    // Fixed container to fit seamlessly within the dashboard layout
    <div className="w-full min-h-full flex flex-col items-center p-4 sm:p-6 gap-6 sm:gap-8 bg-transparent pb-10 relative">
      
      {/* Form Section - Glassmorphism Dark */}
      <form
        onSubmit={onSubmitHandler}
        className="w-full max-w-4xl p-6 sm:p-8 bg-zinc-900/40 backdrop-blur-md rounded-2xl border border-zinc-800/80 shadow-[0_4px_20px_rgba(0,0,0,0.5)] flex flex-col"
      >
        <div className="flex items-center gap-3 mb-6">
          <div className="bg-blue-500/10 p-2.5 rounded-xl border border-blue-500/20 shadow-[0_0_15px_rgba(37,99,235,0.15)]">
            <LayoutTemplate className="w-6 h-6 text-blue-400" />
          </div>
          <h1 className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-purple-500">
            AI Website Generator
          </h1>
        </div>

        <label className="block text-sm font-medium text-zinc-400 tracking-wide mb-3">
          Describe your dream website
        </label>
        <textarea
          value={prompt}
          onChange={(e) => setPrompt(e.target.value)}
          rows={4}
          placeholder="E.g., A futuristic cyberpunk landing page with a neon hero section, feature cards, and a sleek contact form..."
          className="w-full p-4 text-sm rounded-xl bg-zinc-900/50 border border-zinc-700 text-white focus:border-blue-500 focus:ring-1 focus:ring-blue-500 placeholder-zinc-600 outline-none transition-all duration-300 shadow-inner custom-scrollbar resize-none"
          required
        />

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
              <span className="w-5 h-5 border-2 border-zinc-300 border-t-white rounded-full animate-spin"></span>
              Architecting Website...
            </span>
          ) : (
            <>
              <Sparkles className="w-4 h-4" />
              <span>Generate Code</span>
            </>
          )}
        </button>
      </form>

      {/* Preview + Code Panel - IDE Style */}
      {code && (
        <div
          className="w-full max-w-7xl flex flex-col bg-zinc-900/60 backdrop-blur-md rounded-2xl border border-zinc-800/80 shadow-[0_4px_30px_rgba(0,0,0,0.6)] overflow-hidden"
          style={{ height: '75vh', minHeight: '600px' }}
          onMouseMove={onDrag}
          onMouseUp={stopDrag}
          onMouseLeave={stopDrag}
        >
          {/* Top Navbar for Editor */}
          <div className="flex justify-between items-center bg-zinc-950/80 px-4 sm:px-6 py-3 border-b border-zinc-800/80">
            <h2 className="font-semibold text-zinc-200 flex items-center gap-2 text-sm tracking-wide">
              <Play className="w-4 h-4 text-blue-400" /> Live Preview
            </h2>
            <div className="flex items-center gap-3">
              <button
                type="button"
                onClick={() => setShowCode(!showCode)}
                className="flex items-center gap-2 text-xs font-medium px-3.5 py-2 rounded-lg bg-blue-500/10 border border-blue-500/20 text-blue-400 hover:bg-blue-500/20 hover:text-blue-300 transition-all duration-300"
              >
                <Code className="w-3.5 h-3.5" />
                {showCode ? "Hide Code" : "View Code"}
              </button>
              <button
                type="button"
                onClick={downloadHTML}
                className="flex items-center gap-2 text-xs font-medium px-3.5 py-2 rounded-lg bg-zinc-800 hover:bg-zinc-700 text-zinc-300 border border-zinc-700 hover:text-white transition-all duration-300"
              >
                <Download className="w-3.5 h-3.5" />
                Export HTML
              </button>
            </div>
          </div>

          {/* Editor Panels Split */}
          <div className="flex-1 flex overflow-hidden relative">
            
            {/* Preview Panel (Iframe) */}
            <div
              className="h-full bg-white relative transition-all duration-100 ease-linear"
              style={{ width: showCode ? `${panelWidth}%` : "100%" }}
            >
              <iframe
                title="Live Preview"
                className="w-full h-full border-none absolute inset-0"
                sandbox="allow-same-origin allow-scripts"
                srcDoc={iframeSrcDoc}
              />
            </div>

            {/* Drag Bar Resizer */}
            {showCode && (
              <div
                className="w-1.5 h-full bg-zinc-800 cursor-col-resize hover:bg-blue-500 transition-colors z-10 active:bg-blue-400"
                onMouseDown={startDrag}
              />
            )}

            {/* Code Panel */}
            {showCode && (
              <div
                className="h-full bg-[#0d0d0d] border-l border-zinc-800/80 overflow-y-auto custom-scrollbar flex flex-col"
                style={{ width: `${100 - panelWidth}%` }}
              >
                <div className="bg-zinc-900 px-4 py-2 border-b border-zinc-800 flex items-center gap-2">
                  <span className="w-3 h-3 rounded-full bg-red-500/80"></span>
                  <span className="w-3 h-3 rounded-full bg-yellow-500/80"></span>
                  <span className="w-3 h-3 rounded-full bg-green-500/80"></span>
                  <span className="text-xs text-zinc-500 font-mono ml-2">App.jsx</span>
                </div>
                <pre className="p-5 whitespace-pre-wrap text-[13px] leading-relaxed font-mono text-zinc-300">
                  {code}
                </pre>
              </div>
            )}
            
          </div>
        </div>
      )}

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
  );
};

export default GenerateWebsite;