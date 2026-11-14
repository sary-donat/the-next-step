import { useQuery } from "@tanstack/react-query"
import type { JobRoleOption } from "../types/types"
import { institutionService } from "../services/institutionService";


export default function useInstitutionJobRoles(institutionId: number | undefined) {
    const isValid = typeof institutionId === 'number' &&
        Number.isInteger(institutionId) && institutionId > 0;
    return useQuery<JobRoleOption[], Error>({
        queryKey: ['institutions', institutionId, 'job-roles'],
        queryFn: () => institutionService.getInstitutionJobRoles(institutionId as number),
        enabled: isValid,
        staleTime: 5 * 60 * 1000
    });
}