import { useQuery } from "@tanstack/react-query";
import type { CatalogFilters, Status } from "../types/types";
import { statusService } from "../services/statusServices";
import { useAuth } from "../context/auth";
import { jobRoleService } from "../services/jobRolesServices";
import { userService } from "../services/userServices";
const FIVE_MINUTES = 5 * 60 * 1000;
export function useStatuses(filters: CatalogFilters = {}) {
    return useQuery<Status[], Error>({
        queryKey: ['statuses', filters],
        queryFn: () => statusService.getStatuses(filters)
    });
}
export function useJobRoles(filters: CatalogFilters = {}) {
    const { user } = useAuth();
    const isSuperAdmin = user?.role === 'SUPER_ADMIN';

    return useQuery({
        queryKey: ['job-roles', filters],
        queryFn: () => jobRoleService.getJobRoles(filters),
        enabled: !!user && (!isSuperAdmin || !!filters.institutionId),
        staleTime: FIVE_MINUTES,
    });
}
export function useStudentOptions() {
    const { user } = useAuth();
    return useQuery({
        queryKey: ['users', 'students-for-select'],
        queryFn: () => userService.getUsers({ role: 'STUDENT', approvalStatus: 'APPROVED', pageSize: 100 }),
        enabled: user?.role === 'INSTITUTION_ADMIN' || user?.role === 'SUPER_ADMIN',
        select: (page) => page.items,
        staleTime: FIVE_MINUTES,
    });
}