import React from 'react';
import { assets } from "../assets/assets";
import gradientBackground from '../assets/pattern.png';

const Testimonial = () => {
  const testimonials = [
    {
      image: "https://images.unsplash.com/photo-1633332755192-727a05c4013d?q=80&w=200",
      name: "John Doe",
      title: "Marketing Director, TechCorp",
      content:
        "ContentAI has revolutionized our content workflow. The quality is outstanding, and it saves us hours weekly.",
      rating: 4,
    },
    {
      image: "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?q=80&w=200",
      name: "Jane Smith",
      title: "Content Creator, TechCorp",
      content:
        "ContentAI made our content creation effortless. High-quality results, faster than ever.",
      rating: 5,
    },
    {
      image: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?q=80&w=200",
      name: "David Lee",
      title: "Content Writer, TechCorp",
      content:
        "It has transformed our workflow. Producing high-quality content is now a breeze.",
      rating: 4,
    },
    {
      image: "https://randomuser.me/api/portraits/women/44.jpg",
      name: "Emily Johnson",
      title: "SEO Specialist, MediaCorp",
      content: "This tool boosted our SEO content game massively!",
      rating: 5,
    },
    {
      image: "https://randomuser.me/api/portraits/men/32.jpg",
      name: "Michael Brown",
      title: "Blogger",
      content: "Super easy to use and generates awesome blogs.",
      rating: 4,
    },
    {
      image: "https://randomuser.me/api/portraits/women/12.jpg",
      name: "Sophia Davis",
      title: "Freelancer",
      content: "Helped me manage multiple clients without stress.",
      rating: 5,
    },
    {
      image: "https://randomuser.me/api/portraits/men/18.jpg",
      name: "Chris Wilson",
      title: "Startup Founder",
      content: "Saved my team hours of work weekly. Worth it.",
      rating: 5,
    },
    {
      image: "https://randomuser.me/api/portraits/women/22.jpg",
      name: "Olivia Taylor",
      title: "Copywriter",
      content: "Great AI writing support, feels natural and human.",
      rating: 4,
    },
    {
      image: "https://randomuser.me/api/portraits/men/45.jpg",
      name: "Daniel Martinez",
      title: "Content Strategist",
      content: "I recommend this tool to all my clients. Brilliant!",
      rating: 5,
    },
  ];

  return (
    <div 
      className="bg-black/95 bg-blend-overlay w-full"
      style={{ backgroundImage: `url(${gradientBackground})` }}
    >
      {/* 🚀 FIX 1: 'bg-black' hataya taaki parent ka pattern dikhe. Padding mobile ke hisaab se adjust ki */}
      <div className="w-full bg-transparent py-16 lg:py-24 overflow-hidden hover:paused">
        
        {/* 🚀 FIX 2: Side padding (px-4) ab sirf text container par hai */}
        <div className="text-center px-4 sm:px-20 xl:px-32 max-w-5xl mx-auto">
          <h2 className="text-white text-3xl sm:text-4xl md:text-[42px] font-bold">
            Loved by Creators
          </h2>
          <p className="text-neutral-400 text-sm sm:text-base max-w-lg mx-auto mt-3">
            Don&apos;t just take our word for it. Here&apos;s what our users are saying.
          </p>
        </div>

        {/* Scrolling container */}
        <div className="relative mt-10 sm:mt-12 group">
          <div className="flex gap-4 sm:gap-6 animate-scroll group-hover:pause-animation">
            {/* Duplicate testimonials for infinite loop */}
            {[...testimonials, ...testimonials].map((t, index) => (
              <div
                key={index}
                // 🚀 FIX 3: Mobile par width w-[280px] kar di, aur laptop par w-[300px]
                className="p-5 sm:p-6 w-[280px] sm:w-[300px] flex-shrink-0 rounded-xl bg-zinc-900 lg:bg-zinc-900/40 lg:backdrop-blur-md shadow-lg border border-zinc-800 hover:border-zinc-600 transition-colors duration-300"
              >
                {/* Rating */}
                <div className="flex items-center gap-1">
                  {Array(5)
                    .fill(0)
                    .map((_, starIndex) => (
                      <img
                        key={starIndex}
                        src={
                          starIndex < t.rating
                            ? assets.star_icon
                            : assets.star_dull_icon
                        }
                        className="w-4 h-4 opacity-90"
                        alt="star"
                      />
                    ))}
                </div>

                {/* Content */}
                <p className="text-neutral-400 text-sm my-4 leading-relaxed">"{t.content}"</p>
                <hr className="mb-4 border-zinc-800" />

                {/* User */}
                <div className="flex items-center gap-3">
                  <img
                    src={t.image}
                    className="w-10 h-10 sm:w-12 sm:h-12 object-cover rounded-full border border-zinc-700"
                    alt={t.name}
                  />
                  <div className="text-sm text-white">
                    <h3 className="font-medium tracking-wide">{t.name}</h3>
                    <p className="text-xs text-neutral-500">{t.title}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Tailwind custom keyframes */}
        <style>
          {`
            @keyframes scroll {
              0% { transform: translateX(0); }
              100% { transform: translateX(-50%); }
            }
            .animate-scroll {
              display: flex;
              width: max-content;
              animation: scroll 40s linear infinite;
            }
            .pause-animation {
              animation-play-state: paused;
            }
          `}
        </style>
      </div>
    </div>
  );
};

export default Testimonial;