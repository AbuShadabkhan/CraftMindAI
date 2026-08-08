import React from "react";
import ParticleSphereAnimation from "./particalsphear";

// Orbits ka size globe ke naye size ke hisaab se perfect ratio me set kiya hai
const orbits = [
  {
    size: "w-[350px] h-[350px] md:w-[650px] md:h-[650px]",
    duration: 20,
    icons: [
      { src: "https://images.shadcnspace.com/assets/svgs/supabase.svg", alt: "Supabase", angle: -60 },
      { src: "https://images.shadcnspace.com/assets/svgs/gemini.svg", alt: "gemini", angle: 0 },
      { src: "https://images.shadcnspace.com/assets/svgs/make.svg", alt: "Make", angle: 60 },
    ],
  },
  {
    size: "w-[510px] h-[510px] md:w-[850px] md:h-[850px]",
    duration: 26,
    icons: [
      { src: "https://images.shadcnspace.com/assets/svgs/figma.svg", alt: "Figma", angle: 0 },
      { src: "https://images.shadcnspace.com/assets/svgs/slack.svg", alt: "Slack", angle: -90 },
    ],
  },
  {
    size: "w-[660px] h-[660px] md:w-[1040px] md:h-[1040px]",
    duration: 32,
    icons: [
      { src: "https://images.shadcnspace.com/assets/svgs/clude.svg", alt: "Claude", angle: -60 },
      { src: "https://images.shadcnspace.com/assets/svgs/react.svg", alt: "react", angle: 0 },
      { src: "https://images.shadcnspace.com/assets/svgs/python.svg", alt: "python", angle: 60 },
    ],
  },
];

export default function OrbitingCirclesGlobeDemo() {
  return (
    <div className="text-center pt-16 w-full bg-transparent flex flex-col items-center">
      {/* Heading Section - Added mb-10 to give breathing room before orbits */}
      <h2 className="text-3xl md:text-4xl font-bold text-white mb-3">
        Powered by Modern Tech
      </h2>
      <p className="text-zinc-400 max-w-xl mx-auto px-4 mb-10">
        Built on top of industry-leading AI models and developer tools 
        to deliver fast, reliable results.
      </p>

      {/* Container - height adjusted to frame the orbits properly */}
      <div className="relative w-full h-[400px] md:h-[550px] overflow-hidden flex justify-center">
        <style>{`
          @keyframes orbit-cw {
            from { transform: rotate(var(--start-angle)) }
            to   { transform: rotate(calc(var(--start-angle) + 360deg)) }
          }
          @keyframes orbit-ccw {
            from { transform: rotate(var(--start-angle)) }
            to   { transform: rotate(calc(var(--start-angle) - 360deg)) }
          }
          @keyframes counter-cw {
            from { transform: rotate(var(--counter-offset, 0deg)) }
            to   { transform: rotate(calc(var(--counter-offset, 0deg) - 360deg)) }
          }
          @keyframes counter-ccw {
            from { transform: rotate(var(--counter-offset, 0deg)) }
            to   { transform: rotate(calc(var(--counter-offset, 0deg) + 360deg)) }
          }
        `}</style>

        {/* Globe size reduced (500px) and perfectly pushed 50% down to create the half-globe effect */}
        <div className="absolute bottom-0 left-1/2 -translate-x-1/2 translate-y-1/2 aspect-square pointer-events-none w-[280px] md:w-[500px] z-20 flex justify-center items-center bg-[#050505] rounded-full shadow-[0_0_40px_rgba(0,0,0,0.9)]">
          <ParticleSphereAnimation />
        </div>

        {/* Orbiting rings */}
        <div className="relative z-0 w-full h-full pointer-events-none">
          {orbits.map((orbit, index) => {
            const isCW = index % 2 === 0;
            const orbitAnim = isCW ? "orbit-cw" : "orbit-ccw";
            const counterAnim = isCW ? "counter-cw" : "counter-ccw";

            const allIcons = [
              ...orbit.icons,
              ...orbit.icons.map((ic) => ({
                ...ic,
                angle: ic.angle + 180,
                alt: `${ic.alt}-mirror`,
              })),
            ];

            return (
              <div
                key={index}
                // Centered on the same point as the globe
                className={`absolute bottom-0 left-1/2 -translate-x-1/2 translate-y-1/2 rounded-full border border-zinc-800/80 ${orbit.size}`}
              >
                {allIcons.map((iconData, iconIndex) => (
                  <div
                    key={iconIndex}
                    className="absolute top-0 left-1/2 h-1/2 -translate-x-1/2 origin-bottom flex flex-col justify-start items-center"
                    style={{
                      "--start-angle": `${iconData.angle}deg`,
                      animation: `${orbitAnim} ${orbit.duration}s linear infinite`,
                    }}
                  >
                    <div
                      className="p-3 sm:p-4 border border-zinc-800 rounded-full bg-[#0a0a0a] -mt-8 relative shadow-[0_0_15px_rgba(0,0,0,0.5)]"
                      style={{
                        "--counter-offset": `${-iconData.angle}deg`,
                        animation: `${counterAnim} ${orbit.duration}s linear infinite`,
                        pointerEvents: "auto" // Allow hover/clicks on icons if needed
                      }}
                    >
                      <img
                        src={iconData.src}
                        alt={iconData.alt}
                        width={32}
                        height={32}
                        className="w-6 h-6 md:w-8 md:h-8 object-contain"
                      />
                    </div>
                  </div>
                ))}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}