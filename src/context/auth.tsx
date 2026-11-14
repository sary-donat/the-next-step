
import type { User } from "../types/types"
import { createContext, useCallback, useContext, useEffect, useState, type ReactNode } from "react"
import { useQueryClient } from "@tanstack/react-query";
import { apiClient, /*setUnauthorizedHandler,*/ TOKEN_KEY } from '../api/apiClient'
interface AuthContextType {
    user: User | null,
    isLaoding: boolean,
    login: (token: string, userData: User) => void,
    logout: () => void,
    refreshUser: () => Promise<void>
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);
export function AuthProvider({ children }: { children: ReactNode }) {
    const [user, setUser] = useState<User | null>(null);
    const [isLaoding, setIsLoading] = useState(true);
    const queryClient = useQueryClient();

    const login = useCallback((token:string,userData: User) => {
        localStorage.setItem(TOKEN_KEY,token)
        setUser(userData)
    },[])

    const logout = useCallback(() => {
        localStorage.removeItem(TOKEN_KEY);
        queryClient.clear()
        setUser(null);
    }, [queryClient])
//     useEffect(() => {
//     setUnauthorizedHandler(logout);
//     return () => setUnauthorizedHandler(null);
//   }, [logout]);
    const refreshUser = useCallback(async () => {
        const token = localStorage.getItem(TOKEN_KEY)
        if (!token) {
            setUser(null)
            return
        }
        try {
            const response = await apiClient.get<{ user: User }>('/api/auth/me')
            setUser(response.data.user)
        }
        catch
        {
            logout()
        }

    }, [logout])
    useEffect(()=>{
        refreshUser().finally(()=>setIsLoading(false))
    },[refreshUser])
    return(
  
        <AuthContext.Provider value={{ user, isLaoding, login, logout,refreshUser }}>
            {children}
        </AuthContext.Provider>
    )
}

export function useAuth() {
    const context = useContext(AuthContext)
    if (context == undefined) {
        throw new Error("useAuth must be used within an AuthProvider")
    }
    return context
}