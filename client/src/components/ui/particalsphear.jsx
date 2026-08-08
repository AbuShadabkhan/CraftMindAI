import React, { useEffect, useRef } from "react";

export default function ParticleSphereAnimation() {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");
    let animationFrameId;

    const width = (canvas.width = 1000);
    const height = (canvas.height = 1000);

    const particles = [];
    const particleCount = 7000; // Density balanced for this new dark-center effect
    const radius = 400; 

    for (let i = 0; i < particleCount; i++) {
      const theta = Math.random() * 2 * Math.PI;
      const phi = Math.acos(Math.random() * 2 - 1);

      const x = radius * Math.sin(phi) * Math.cos(theta);
      const y = radius * Math.sin(phi) * Math.sin(theta);
      const z = radius * Math.cos(phi);

      const isBlue = Math.random() > 0.85; 
      const color = isBlue ? "#3b82f6" : "#ffffff";
      
      const size = Math.random() * 1.2 + 0.8;

      particles.push({ x, y, z, color, size });
    }

    let rotationY = 0;
    const rotationX = -0.25; 

    const render = () => {
      ctx.clearRect(0, 0, width, height);
      rotationY += 0.0015; 

      const centerX = width / 2;
      const centerY = height / 2;
      const fov = 1000;

      particles.forEach((p) => {
        let rotX = p.x * Math.cos(rotationY) - p.z * Math.sin(rotationY);
        let rotZ = p.z * Math.cos(rotationY) + p.x * Math.sin(rotationY);
        let rotY = p.y;

        const finalY = rotY * Math.cos(rotationX) - rotZ * Math.sin(rotationX);
        const finalZ = rotZ * Math.cos(rotationX) + rotY * Math.sin(rotationX);
        const finalX = rotX;

        const scale = fov / (fov + finalZ);
        const x2d = centerX + finalX * scale;
        const y2d = centerY + finalY * scale;

        if (finalZ > -radius) {
          ctx.beginPath();
          ctx.arc(x2d, y2d, p.size * scale, 0, 2 * Math.PI);
          ctx.fillStyle = p.color;
          
          // ==========================================
          // TUMHARA OBSERVE KIYA HUA "FRESNEL MAGIC" YAHAN HAI 
          // ==========================================
          
          // 1. Particle center se kitni door hai?
          const distFromCenter = Math.sqrt(finalX * finalX + finalY * finalY);
          
          // 2. Us distance ko 0 se 1 ke ratio me badlo (Center = 0, Edge = 1)
          const rimFactor = distFromCenter / radius;
          
          // 3. Math.pow() lagaya taaki center jaldi dark ho jaye aur sirf kinare glow karein
          const edgeGlow = Math.pow(rimFactor, 3); 
          
          // 4. Halki si depth (taaki front ke dots ekdum 100% gayab na hon, 10% visible rahein)
          const depthAlpha = (finalZ + radius) / (radius * 2);

          // Center par opacity sirf 5% se 10% rahegi, kinaron par 95% se 100% glow karegi
          ctx.globalAlpha = Math.max(0.02, (edgeGlow * 0.9) + (depthAlpha * 0.1)); 
          
          // ==========================================

          ctx.fill();
        }
      });

      animationFrameId = requestAnimationFrame(render);
    };

    render();

    return () => cancelAnimationFrame(animationFrameId);
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="w-full h-full scale-110"
      style={{ objectFit: "contain" }} 
    />
  );
}