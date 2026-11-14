import { apiClient } from "../api/apiClient"
import type { Institution, InstitutionInput, JobRoleOption, PublicInstitution } from "../types/types"

export const institutionService = {
    async getInstitutionJobRoles(institutionId: number): Promise<JobRoleOption[]> {
        const response = await apiClient.get<{ items: JobRoleOption[] }>(`/api/institutions/${institutionId}/job-roles`)
        return response.data.items
    },

    async getPublicInstitutions(search?: string): Promise<PublicInstitution[]> {
        const response = await apiClient.get<{ items: PublicInstitution[] }>('/api/institutions/public', { params: search ? { search } : undefined })
        return response.data.items
    },
    async createInstitution(data: InstitutionInput): Promise<Institution> {
        const response = await apiClient.post<{ institution: Institution }>('/api/institutions', data);
        return response.data.institution;
    },

}