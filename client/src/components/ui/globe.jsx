import createGlobe from "cobe";
import { useEffect, useRef, useState } from "react";

export function Globe({ className = "" }) {
  const canvasRef = useRef(null);
  const [isMobileDevice, setIsMobileDevice] = useState(false);

  // 1. 🚀 Yahan hum screen ka size nahi, seedha OS (Operating System) check kar rahe hain
  useEffect(() => {
    const checkMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
    setIsMobileDevice(checkMobile);
  }, []);

  // 2. 3D Globe Logic
  useEffect(() => {
    // Agar Android, iPad ya iPhone hai, toh WebGL canvas Load hi nahi hoga!
    if (isMobileDevice || !canvasRef.current) return;

    let phi = 0;
    
    const globe = createGlobe(canvasRef.current, {
      devicePixelRatio: 2,
      width: 1000,
      height: 1000,
      phi: 0,
      theta: 0.2, // Halka sa tilted
      dark: 1, // Pitch black mode
      diffuse: 1.2,
      mapSamples: 16000,
      mapBrightness: 6,
      baseColor: [0.1, 0.1, 0.1], 
      
      markerColor: [0.0, 1.0, 0.4], 
      glowColor: [0.0, 1.0, 0.4], 
      
      markers: [
        { location: [37.7595, -122.4367], size: 0.08 },
        { location: [52.5200, 13.4050], size: 0.06 },
        { location: [28.4744, 77.5040], size: 0.1 }, 
        { location: [35.6762, 139.6503], size: 0.07 },
      ],
      onRender: (state) => {
        state.phi = phi;
        phi += 0.004; 
      },
    });

    return () => {
      globe.destroy();
    };
  }, [isMobileDevice]); // Ye effect tabhi run hoga jab OS confirm ho jayega

  return (
    <div className={`relative mx-auto w-full max-w-[500px] aspect-square flex items-center justify-center ${className}`}>
      {/* Glow behind the globe */}
      <div className="absolute inset-0 bg-[#00FF66]/10 blur-[100px] rounded-full" />
      
      {!isMobileDevice ? (
        /* 💻 SIRF LAPTOP KE LIYE: Asli 3D Canvas */
        <canvas
          ref={canvasRef}
          className="w-full h-full opacity-90 hover:opacity-100 transition-opacity duration-500"
          style={{ contain: "layout paint size" }}
        />
      ) : (
        /* 📱 KISI BHI PHONE/TABLET KE LIYE: Static Image */
        <img 
          src="/globe-static.png" 
          alt="CraftMindAI Globe" 
          className="w-full h-full object-contain opacity-90 mix-blend-screen"
        />
      )}
    </div>
  );
}