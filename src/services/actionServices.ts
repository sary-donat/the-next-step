import { apiClient } from "../api/apiClient";
import type { Action, CreateActionPayload, UpdateActionPayload } from "../types/types";

export const actionService = {
    async createAction(applicationId: number, data: CreateActionPayload): Promise<Action> {
        const response = await apiClient.post<{ action: Action }>(`/api/applications/${applicationId}/actions`, data);
        return response.data.action;
    },
    async updateAction(ationId: number, data: UpdateActionPayload): Promise<Action> {
        const response = await apiClient.patch<{ action: Action }>(`/api/actions/${ationId}`, data)
        return response.data.action
    },
}