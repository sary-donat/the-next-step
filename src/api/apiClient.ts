import axios, { AxiosError } from "axios";
import type { ApiErrorBody } from "../types/types";

// apiClient.ts
export const TOKEN_KEY = 'token';
export const apiClient=axios.create({
baseURL:import.meta.env.VITE_API_URL,
headers:{
    "Content-Type": "application/json" 
}
})

apiClient.interceptors.request.use(
    (config)=>{
        const token=localStorage.getItem(TOKEN_KEY)
        if(token&&config.headers){
            config.headers.Authorization=`Bearer ${token}`
        }
        return config  
    },
    (error)=>{
        return Promise.reject(error)}
    
)
let onUnauthorized: (() => void) | null = null;

export function setUnauthorizedHandler(handler: (() => void) | null) {
  onUnauthorized = handler;
}
apiClient.interceptors.response.use(
    (response)=>response,
    (error:AxiosError<ApiErrorBody>)=>
    {
       const isLoginRequest = error.config?.url?.includes("/api/auth/login")
       if(error.response?.status===401&&!isLoginRequest)
       {
        onUnauthorized?.()
       }
       return Promise.reject(error)
    }
)
 export function getErrorMessage(error:unknown):string{
    if(axios.isAxiosError<ApiErrorBody>(error))
    {
        if(!error.response)
        {
            return 'לא ניתן להתחבר לשרת. נסו שוב בעוד רגע';
        }
        return error.response.data?.error?.message ??'ארעה שגיאה'
    }
    return 'ארעה שגיאה'
}
