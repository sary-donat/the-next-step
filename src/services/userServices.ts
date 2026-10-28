import { apiClient } from "../api/apiClient";
import type { CreateUserPayload, Page, UpdateUserPayload, User, UserFilters } from "../types/types";

export const userService= {
    async getUsers(filters: UserFilters = {}): Promise<Page<User>> {
        const response = await apiClient.get<Page<User>>('/api/users', { params: filters });
        return response.data;
    },
    async createUSer(data: CreateUserPayload): Promise<User> {
        const response = await apiClient.post<{ user: User }>('/api/users', data);
        return response.data.user;
    },
    async updateUser(id: number, data: UpdateUserPayload): Promise<User> {
        const response = await apiClient.patch<{ user: User }>(`/api/users/${id}`, data);
        return response.data.user;
    },
    async approveUser(id: number): Promise<User> {
        const response = await apiClient.patch<{ user: User }>(`/api/users/${id}/approve`);
        return response.data.user;
    },
    async rejectUser(id: number): Promise<User> {
        const response = await apiClient.patch<{ user: User }>(`/api/users/${id}/reject`);
        return response.data.user;
    },

}