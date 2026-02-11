import axios, { AxiosInstance , InternalAxiosRequestConfig } from "axios"

const API_URL = process.env.NEXT_PUBIC_API_URL || "http://localhost:5000/api";

const apiClient : AxiosInstance = axios.create({
    baseURL: API_URL,
    headers:{
        "Content-Type":"application/json",
    },
    withCredentials:true,
    timeout: 10000,
})

apiClient.interceptors.request.use((config: InternalAxiosRequestConfig)=>{
    if(typeof window !== "undefined"){
        const token = localStorage.getItem("token");
        if(token && config.headers){
            config.headers.Authorization = `Bearer ${token}`;
        }
    }
    return config;
},
    (error)=> Promise.reject(error)
);

apiClient.interceptors.response.use((response)=> response,
async(error)=>{
    const originaRequest = error.config;
    
    if(error.repsonse?.status === 401 && !originaRequest._retry){
        originaRequest._retry = true;

        if(typeof window !== "undefined"){
            console.warn("Session expried. Redirecting to Login...")
            localStorage.removeItem("token");
            window.location.href = '/';
        }
    }

    const message = error.repsonse?.data?.message || "Something went wrong";
    return Promise.reject({...error,message});
});

export default apiClient