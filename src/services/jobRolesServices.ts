import { apiClient } from "../api/apiClient";
import type { CatalogFilters, JobRole } from "../types/types";

export const jobRoleService = {
    async getJobRoles(filters: CatalogFilters = {}): Promise<JobRole[]> {
        const response = await apiClient.get<{ items: JobRole[] }>('/api/job-roles', { params: filters });
        return response.data.items;
    },
    async createJobRole(data: { name: string; institutionId?: number }): Promise<JobRole> {
        const response = await apiClient.post<{ jobRole: JobRole }>('/api/job-roles', data);
        return response.data.jobRole;
    },
    async updateJobRole(id: number, data: { name?: string; isActive?: boolean }): Promise<JobRole> {
        const response = await apiClient.patch<{ jobRole: JobRole }>(`/api/job-roles/${id}`, data);
        return response.data.jobRole;
    },

}