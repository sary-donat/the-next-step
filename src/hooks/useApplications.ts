import { useQuery } from "@tanstack/react-query";
import type { ApplicationFilters, ApplicationSummary, Page } from "../types/types";
import { applicationService } from "../services/applicationService";


export function useApplications(filters:ApplicationFilters={}){
     return useQuery<Page<ApplicationSummary>,Error>({
        queryKey:['applications', filters],
        queryFn: ()=>applicationService.getApplications(filters)
     })
}
export function useApplicationById(applicationId:number){
    return useQuery({
        queryKey:['applications',applicationId],
        queryFn:()=>applicationService.getApplication(applicationId),
        enabled:!!applicationId
    })
}