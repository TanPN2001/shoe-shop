import axios from "axios"

const api = axios.create({ baseURL: process.env.NEXT_PUBLIC_API_URL })
const server = axios.create({ baseURL: process.env.API_URL, fetchOptions: { cache: "no-cache" } })

const userService = axios.create({ baseURL: process.env.NEXT_PUBLIC_API_URL })

// Add a request interceptor
userService.interceptors.request.use(
  (config) => {
    // Attach token from localStorage if available
    if (typeof window !== "undefined") {
      const token = localStorage.getItem("ezman-token");
      console.log("Token", token)
      if (token) {
        config.headers = config.headers || {};
        config.headers["Authorization"] = `Bearer ${token}`;
      }
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Add a response interceptor (optional, for error handling)
userService.interceptors.response.use(
  (response) => response,
  (error) => {
    // You can handle global errors here if needed
    return Promise.reject(error);
  }
)
export { server, userService }
export default api