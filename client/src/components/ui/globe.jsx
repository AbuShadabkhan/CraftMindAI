import createGlobe from "cobe";
import { useEffect, useRef, useState } from "react";

export function Globe({ className = "" }) {
  const canvasRef = useRef(null);
  
  //  Ek state banate hain jo check karegi ki screen Laptop hai ya Mobile
  const [isDesktop, setIsDesktop] = useState(window.innerWidth > 768);

  // 1. Screen size check karne ka logic
  useEffect(() => {
    const handleResize = () => {
      // 1024px Tailwind ka 'lg' breakpoint hota hai
      setIsDesktop(window.innerWidth >= 1024);
    };
    
    // Page load hote hi screen check karo
    handleResize();
    
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // 2. 3D Globe ka logic (Ye sirf tab chalega jab 'isDesktop' true hoga)
  useEffect(() => {
    // Agar phone/tablet hai, toh yahi se wapas laut jao (No WebGL load!)
    if (!isDesktop || !canvasRef.current) return;

    let phi = 0;
    
    const globe = createGlobe(canvasRef.current, {
      devicePixelRatio: 2,
      width: 1000,
      height: 1000,
      phi: 0,
      theta: 0.2, // Halka sa tilted taaki 3D depth aaye
      dark: 1, // Pitch black mode
      diffuse: 1.2,
      mapSamples: 16000,
      mapBrightness: 6,
      baseColor: [0.1, 0.1, 0.1], // Dark gray wireframe
      
      markerColor: [0.0, 1.0, 0.4], 
      glowColor: [0.0, 1.0, 0.4], 
      
      markers: [
        // AI Hubs / Server locations globally glowing in green
        { location: [37.7595, -122.4367], size: 0.08 },
        { location: [52.5200, 13.4050], size: 0.06 },
        { location: [28.4744, 77.5040], size: 0.1 }, 
        { location: [35.6762, 139.6503], size: 0.07 },
      ],
      onRender: (state) => {
        // Auto-rotation speed
        state.phi = phi;
        phi += 0.004; 
      },
    });

    return () => {
      globe.destroy();
    };
  }, [isDesktop]); // Jab screen size change hoga, ye effect update hoga

  return (
    <div className={`relative mx-auto w-full max-w-[500px] aspect-square flex items-center justify-center ${className}`}>
      {/* Glow behind the globe */}
      <div className="absolute inset-0 bg-[#00FF66]/10 blur-[100px] rounded-full" />
      
      {isDesktop ? (
        /* 💻 LAPTOP KE LIYE: Asli 3D Canvas chalega */
        <canvas
          ref={canvasRef}
          className="w-full h-full opacity-90 hover:opacity-100 transition-opacity duration-500"
          style={{ contain: "layout paint size" }}
        />
      ) : (
        /* 📱 PHONE/TABLET KE LIYE: Static Image dikhegi (GPU load bacha liya!) */
        <img 
          src="/globe-static.png" 
          alt="CraftMindAI Globe" 
          // mix-blend-screen se image ka black background website ke background me merge ho jayega
          className="w-full h-full object-contain opacity-90 mix-blend-screen"
        />
      )}
    </div>
  );
}