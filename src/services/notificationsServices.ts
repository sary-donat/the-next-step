import { apiClient } from "../api/apiClient";
import type { Notification, NotificationFilters, NotificationPage } from "../types/types";

export const notificationService = {
    async getNotifications(filters: NotificationFilters = {}): Promise<NotificationPage> {
        const response = await apiClient.get<NotificationPage>('/api/notifications', { params: filters });
        return response.data;
    },
    async getUnreadCount(): Promise<number> {
        const response = await apiClient.get<{ count: number }>('/api/notifications/unread-count');
        return response.data.count;
    },
    async markAsRead(notificationId: number): Promise<Notification> {
        const response = await apiClient.patch<{ notification: Notification }>(
            `/api/notifications/${notificationId}/read`,
        );
        return response.data.notification;
    }, async markAllAsRead(): Promise<number> {
        const response = await apiClient.patch<{ updated: number }>('/api/notifications/read-all');
        return response.data.updated;
    }
}