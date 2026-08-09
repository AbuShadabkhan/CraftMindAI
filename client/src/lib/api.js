import axios from 'axios';
import { toast } from 'react-hot-toast'; // (Agar use karte ho)

// Ek central axios instance banaya
const apiClient = axios.create({
  baseURL: `${import.meta.env.VITE_BASE_URL}/api`, //  ab env variable use ho raha hai
});

// 🛡️ GLOBAL ERROR CATCHER (Interceptor)
apiClient.interceptors.response.use(
  (response) => {
    // Agar sab theek hai toh response aage bhej do
    return response;
  },
  (error) => {
    // Agar backend ne 403 LIMIT_REACHED bheja, toh yahan pakdo!
    if (error.response?.status === 403 && error.response?.data?.error === "LIMIT_REACHED") {
      
      toast.error("You have used all 5 free credits for today!");
      
      // Seedha Plan page par redirect (bina useNavigate ke)
      window.location.href = '/plan'; 
    }

    // Baaki koi aur error ho toh wapas bhej do
    return Promise.reject(error);
  }
);

export default apiClient;