import axios, { AxiosInstance, InternalAxiosRequestConfig } from "axios"

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api";
const TOKEN_KEY = process.env.NEXT_PUBLIC_TOKEN_KEY || "token";

// Log API URL in development
if (typeof window !== "undefined" && process.env.NODE_ENV === "development") {
    console.log("🔗 API Base URL:", API_URL);
}

const apiClient: AxiosInstance = axios.create({
    baseURL: API_URL,
    headers: {
        "Content-Type": "application/json",
    },
    withCredentials: true,
    timeout: 10000,
})

apiClient.interceptors.request.use((config: InternalAxiosRequestConfig) => {
    if (typeof window !== "undefined") {
        const token = localStorage.getItem(TOKEN_KEY);
        if (token && config.headers) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        
        // Log request in development
        if (process.env.NODE_ENV === "development") {
            console.log(`📤 ${config.method?.toUpperCase()} ${config.url}`, config.data || "");
        }
    }
    return config;
},
    (error) => Promise.reject(error)
);

apiClient.interceptors.response.use((response) => response,
    async (error) => {
        const originaRequest = error.config;

        if (error.response?.status === 401 && !originaRequest._retry) {
            originaRequest._retry = true;

            if (typeof window !== "undefined") {
                console.warn("Session expired. Redirecting to Login...")
                localStorage.removeItem(TOKEN_KEY);
                window.location.href = '/';
            }
        }

        const message = error.response?.data?.message || "Something went wrong";
        return Promise.reject({ ...error, message });
    });

export default apiClient