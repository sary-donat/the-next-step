import {useQuery} from "@tanstack/react-query"
import type { PublicInstitution } from "../types/types";
import { institutionService } from "../services/institutionService";


export function UseInstitutions()
{
    return useQuery<PublicInstitution[],Error>({
        queryKey:["institutions"],
        queryFn: () => institutionService.getPublicInstitutions(),
        staleTime:50000
    });
   
}
export default UseInstitutions