import { apiClient } from "../api/apiClient";
import type { CatalogFilters, Status } from "../types/types";

export const statusService = {
    async getStatuses(filters: CatalogFilters = {}): Promise<Status[]> {
        const response = await apiClient.get<{ items: Status[] }>('/api/statuses', { params: filters });
        return response.data.items;
    },
}

