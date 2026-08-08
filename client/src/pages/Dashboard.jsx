import React, { useState, useEffect } from "react";
import { HiSparkles } from "react-icons/hi";
import { FaGem } from "react-icons/fa";
import CreationItem from "../components/CreationItem";
import { useAuth } from "@clerk/clerk-react";
import toast from "react-hot-toast";
import apiClient from "../lib/api";

const TotalCreations = () => <span>Total Creations</span>;
const ActivePlan = () => <span>Active Plan</span>;

const Dashboard = () => {
  const [creations, setCreations] = useState([]);
  const [planType, setPlanType] = useState("free");
  const [creditStats, setCreditStats] = useState([]); // 👈 Naya state Credits ke liye
  const [loading, setLoading] = useState(true);
  const { getToken } = useAuth();

  // Custom dark toast style
  const darkToastStyle = {
    style: { background: '#18181b', color: '#fff', border: '1px solid #27272a' }
  };

  const getDashboardData = async () => {
    try {
      const token = await getToken();
      
      // 1. Fetch User Creations
      const { data } = await apiClient.get("/user/get-user-creations", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (data.success) {
        setCreations(data.creations);
        setPlanType(data.planType?.toLowerCase() || "free");
      } else {
        toast.error(data.message || "Failed to fetch dashboard data", darkToastStyle);
      }

      // 2. Fetch User Credit Stats
      try {
    
        const creditRes = await apiClient.get("/ai/user-credits", {
          headers: { Authorization: `Bearer ${token}` },
        });
        
        console.log("Credits Data from Backend:", creditRes.data); 
        
        if (creditRes.data.success) {
          setCreditStats(creditRes.data.credits);
          if (creditRes.data.plan) {
            setPlanType(creditRes.data.plan.toLowerCase());
          }
        }
      } catch (creditError) {
        // Agar koi error aayega toh seedha F12 console me dikh jayega!
        console.error("Could not fetch credit stats. Error details:", creditError.response?.data || creditError.message);
      }

    } catch (error) {
      toast.error(error.response?.data?.message || error.message, darkToastStyle);
    }
    setLoading(false);
  };

  useEffect(() => {
    getDashboardData();
  }, []);

  return (
    // Main Container - Pitch Black (#050505)
    <div className="w-full p-6 sm:p-8 bg-transparent">
      
      {/* Stats Cards */}
      <div className="flex justify-start gap-5 flex-wrap">
        
        {/* Total Creations card */}
        <div className="flex justify-between items-center w-72 p-5 px-6 bg-zinc-900/40 backdrop-blur-md rounded-2xl border border-zinc-800/80 hover:bg-zinc-900/60 transition-all duration-300 shadow-[0_4px_20px_rgba(0,0,0,0.5)]">
          <div>
            <p className="text-sm font-medium text-zinc-400 tracking-wide">
              <TotalCreations />
            </p>
            <h2 className="text-3xl font-bold text-white mt-1.5">
              {(creations || []).length}
            </h2>
          </div>
          <div className="bg-blue-500/10 p-3 rounded-xl border border-blue-500/20 shadow-[0_0_15px_rgba(37,99,235,0.15)]">
            <HiSparkles className="w-6 h-6 text-blue-400" />
          </div>
        </div>

        {/* Active Plan card */}
        <div className="flex justify-between items-center w-72 p-5 px-6 bg-zinc-900/40 backdrop-blur-md rounded-2xl border border-zinc-800/80 hover:bg-zinc-900/60 transition-all duration-300 shadow-[0_4px_20px_rgba(0,0,0,0.5)]">
          <div>
            <p className="text-sm font-medium text-zinc-400 tracking-wide">
              <ActivePlan />
            </p>
            <h2 className="text-2xl font-bold mt-1.5">
              {/* 🛡️ REAL-TIME PLAN CHECKING LOGIC */}
              {planType === "premium" || planType === "pro" ? (
                <span className="bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-purple-500">
                  Premium
                </span>
              ) : (
                <span className="text-zinc-300">
                  Free
                </span>
              )}
            </h2>
          </div>
          <div className="bg-purple-500/10 p-3 rounded-xl border border-purple-500/20 shadow-[0_0_15px_rgba(168,85,247,0.15)]">
            <FaGem className="w-6 h-6 text-purple-400" />
          </div>
        </div>
      </div>

      {/* Loader (Neon Blue Spinner) */}
      {loading ? (
        <div className="flex-1 h-full flex items-center justify-center mt-20">
          <div className="w-12 h-12 rounded-full border-4 border-zinc-800 border-t-blue-500 animate-spin shadow-[0_0_15px_rgba(37,99,235,0.5)]"></div>
        </div>
      ) : (
        <>
          {/* 🚀 NAYA ADDITION: Credits Section */}
          {creditStats.length > 0 && (
            <div className="space-y-4 mt-10">
              <h3 className="text-lg font-semibold text-white tracking-wide border-b border-zinc-800/80 pb-3 mb-5">
                Today's API Credits
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                {creditStats.map((stat, index) => (
                  <div key={index} className="p-4 bg-zinc-900/40 backdrop-blur-md rounded-2xl border border-zinc-800/80 shadow-[0_4px_20px_rgba(0,0,0,0.5)] hover:border-zinc-700 transition-colors">
                    <h2 className="text-md font-semibold text-white">{stat.name}</h2>
                    <p className="text-zinc-400 text-xs mt-1">Credits left today</p>
                    
                    {/* Glowing Progress Bar */}
                    <div className="w-full bg-zinc-800 rounded-full h-1.5 mt-4 overflow-hidden">
                      <div 
                        className={`h-full rounded-full transition-all duration-500 ${
                          stat.remaining === 0 
                            ? 'bg-red-500 shadow-[0_0_10px_rgba(239,68,68,0.8)]' 
                            : 'bg-blue-500 shadow-[0_0_10px_rgba(37,99,235,0.8)]'
                        }`} 
                        style={{ width: `${(stat.remaining / stat.limit) * 100}%` }}
                      ></div>
                    </div>
                    
                    <div className="flex justify-between mt-3 text-xs">
                      <span className={`font-bold ${stat.remaining === 0 ? 'text-red-400' : 'text-white'}`}>
                        {stat.remaining} left
                      </span>
                      <span className="text-zinc-500">Limit: {stat.limit}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Recent Creations Section */}
          <div className="space-y-4 mt-10">
            <h3 className="text-lg font-semibold text-white tracking-wide border-b border-zinc-800/80 pb-3 mb-5">
              Recent Creations
            </h3>
            
            {(creations || []).length > 0 ? (
              <div className="flex flex-col gap-3">
                {(creations || []).map((item) => (
                  <CreationItem key={item.id} item={item} />
                ))}
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center py-12 px-4 bg-zinc-900/20 border border-zinc-800/50 rounded-2xl border-dashed">
                <p className="text-zinc-500 italic">No creations yet. Start crafting!</p>
              </div>
            )}
          </div>
        </>
      )}
    </div>
  );
};

export default Dashboard;