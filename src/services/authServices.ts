import { apiClient } from "../api/apiClient"

import type { CreateUser, LoginPayload, LoginResponse, NewUserPayload, User } from "../types/types"

export const authService = {
    async loginUser(credentials: LoginPayload): Promise<LoginResponse> {
        const response = await apiClient.post<LoginResponse>("/api/auth/login", credentials)
        return response.data
    },
    async registerUser(newUser: NewUserPayload): Promise<CreateUser> {
        const response = await apiClient.post<CreateUser>('/api/auth/register', newUser)
        return response.data
    },
    async updateMyJobRoles(jobRoleIds:number[]):Promise<User>{
        const response = await apiClient.put<{user:User}>('/api/auth/me/job-roles',{jobRoleIds})
        return response.data.user
    }
}