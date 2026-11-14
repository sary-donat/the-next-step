import { useQuery } from '@tanstack/react-query';
import { userService } from '../services/userServices';
import type { ApprovalStatus } from '../types/types';

interface StudentFilters {
  approvalStatus: ApprovalStatus;
  jobRoleId?: number;
}

export function useStudents(filters: StudentFilters) {
  return useQuery({
    queryKey: ['users', 'students', filters],
    queryFn: () => userService.getUsers({ role: 'STUDENT', ...filters }),
  });
}