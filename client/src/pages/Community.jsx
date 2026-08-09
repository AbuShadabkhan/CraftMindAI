import React, { useEffect, useState } from "react";
import { useAuth, useUser } from "@clerk/clerk-react";
import { Heart, Globe2 } from "lucide-react";
import toast from "react-hot-toast";
import apiClient from "../lib/api";

const Community = () => {
  const [creations, setCreations] = useState([]);
  const [loading, setLoading] = useState(true);
  const { user } = useUser();
  const { getToken } = useAuth();

  // Custom dark toast style
  const darkToastStyle = {
    style: { background: '#18181b', color: '#fff', border: '1px solid #27272a' }
  };

  // Fetch all published creations
  const fetchCreations = async () => {
    try {
      const token = await getToken();
      
      // 🚀 Yahan direct axios ki jagah apiClient ka use kiya hai
      const { data } = await apiClient.get("/user/get-published-creations", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (data.success) {
        setCreations(data.creations);
      } else {
        toast.error(data.message || "Failed to fetch creations", darkToastStyle);
      }
    } catch (error) {
      toast.error(error.response?.data?.message || "Error fetching creations", darkToastStyle);
    } finally {
      setLoading(false);
    }
  };

  // Toggle like on an image
  const imageLikeToggle = async (id) => {
    try {
      const token = await getToken();
      
      // 🚀 API route fix kiya hai
      const { data } = await apiClient.post(
        "/user/toggle-like-creations",
        { id },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (data.success) {
        toast.success(data.message || "Action successful", darkToastStyle);
        await fetchCreations();
      } else {
        toast.error(data.message || "Failed to toggle like", darkToastStyle);
      }
    } catch (error) {
      toast.error(error.response?.data?.message || error.message, darkToastStyle);
    }
  };

  useEffect(() => {
    if (user) {
      fetchCreations();
    }
  }, [user]);

  return !loading ? (
    // Fixed layout for seamless dashboard scrolling
    <div className="w-full min-h-full flex flex-col p-6 sm:p-8 bg-transparent">
      
      {/* Header section */}
      <div className="flex items-center gap-3 mb-6 pb-4 border-b border-zinc-800/80">
        <div className="bg-blue-500/10 p-2.5 rounded-xl border border-blue-500/20 shadow-[0_0_15px_rgba(37,99,235,0.15)]">
          <Globe2 className="w-6 h-6 text-blue-400" />
        </div>
        <div>
          <h1 className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-purple-500">
            Community Showcase
          </h1>
          <p className="text-xs text-zinc-400 mt-0.5">Explore amazing AI art created by creators worldwide</p>
        </div>
      </div>

      {/* Grid for cards */}
      <div className="w-full grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 pb-12">
        {(creations || []).length === 0 ? (
          <div className="col-span-full flex flex-col items-center justify-center py-20 bg-zinc-900/20 border border-zinc-800/50 rounded-2xl border-dashed">
            <p className="text-zinc-500 italic">No public creations found yet.</p>
          </div>
        ) : (
          (creations || []).map((creation, index) => (
            <div
              key={index}
              className="relative group rounded-2xl overflow-hidden border border-zinc-800/80 bg-zinc-950 shadow-md lg:shadow-[0_4px_20px_rgba(0,0,0,0.5)] hover:border-zinc-700 transition-all duration-300"
            >
              {/* Image with fixed aspect ratio */}
              <div className="aspect-[3/4] w-full bg-zinc-900 overflow-hidden">
                <img
                  src={creation.content}
                  alt={creation.prompt || "Community creation"}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
              </div>

              {/* Overlay on hover */}
              <div className="absolute inset-0 flex flex-col justify-end p-4 bg-gradient-to-t from-black/90 via-black/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                <p className="text-xs text-zinc-300 mb-3 line-clamp-2 leading-relaxed">
                  {creation.prompt}
                </p>

                <div className="flex items-center justify-between text-white border-t border-zinc-800/80 pt-3">
                  <span className="text-xs text-zinc-400 font-medium">
                    Likes: {(creation.likes || []).length}
                  </span>
                  <button
                    onClick={() => imageLikeToggle(creation.id)}
                    className="flex items-center gap-1.5 p-2 rounded-xl bg-zinc-900/80 border border-zinc-700 hover:bg-zinc-800 transition-all duration-300"
                    type="button"
                  >
                    <Heart
                      className={`w-4 h-4 transition-transform duration-300 hover:scale-125 ${
                        (creation.likes || []).includes(user?.id)
                          ? "text-red-500 fill-red-500 drop-shadow-[0_0_8px_rgba(239,68,68,0.6)]"
                          : "text-zinc-400"
                      }`}
                    />
                  </button>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  ) : (
    <div className="w-full h-full flex items-center justify-center min-h-[400px]">
      <div className="w-12 h-12 rounded-full border-4 border-zinc-800 border-t-blue-500 animate-spin shadow-[0_0_15px_rgba(37,99,235,0.5)]"></div>
    </div>
  );
};

export default Community;