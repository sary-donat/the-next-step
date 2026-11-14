import { apiClient } from "../api/apiClient";
import type { ApplicationDetail, ApplicationFilters, ApplicationSummary, CreateApplicationPayload, CreateApplicationResponse, Page, UpdateApplicationPayload, UpdateApplicationResponse } from "../types/types";

export const applicationService = {
    async getApplications(filters: ApplicationFilters = {}): Promise<Page<ApplicationSummary>> {
        const response = await apiClient.get<Page<ApplicationSummary>>('/api/applications', { params: filters });
        return response.data;
    }, async getApplication(id: number): Promise<ApplicationDetail> {
        const response = await apiClient.get<{ application: ApplicationDetail }>(`/api/applications/${id}`);
        return response.data.application;
    },
    async createApplication(data: CreateApplicationPayload): Promise<CreateApplicationResponse> {
        const response = await apiClient.post<CreateApplicationResponse>('/api/applications', data);
        return response.data;
    },
    async updateApplication(id: number, data: UpdateApplicationPayload): Promise<UpdateApplicationResponse> {
        const response = await apiClient.patch<UpdateApplicationResponse>(`/api/applications/${id}`, data);
        return response.data;
    },
    async deleteApplication(id: number): Promise<void> {
    await apiClient.delete(`/api/applications/${id}`);
  },
};
