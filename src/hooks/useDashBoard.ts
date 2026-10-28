import { useQuery } from '@tanstack/react-query';;
import type { Dashboard } from '../types/types';
import { dashboardService } from '../services/dashBoardServices';

export function useDashboard(userId?: number) {
  return useQuery<Dashboard, Error>({
    queryKey: ['dashboard', userId ?? 'me'],
    queryFn: () => dashboardService.getDashboard(userId),
  });
}