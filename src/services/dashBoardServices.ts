import { apiClient } from '../api/apiClient';
import type { Dashboard } from '../types/types';

export const dashboardService = {

    async getDashboard(userId?: number): Promise<Dashboard> {
        const response = await apiClient.get<Dashboard>('/api/dashboard', {
            params: userId ? { userId } : undefined,
        });
        return response.data;
    },
};