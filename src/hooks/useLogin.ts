import { AxiosError } from "axios";
import { useMutation } from "@tanstack/react-query"

import type { ApiErrorBody, LoginPayload, LoginResponse} from "../types/types";
import { authService } from "../services/authServices";
;

export function useLogin(){
   return useMutation<LoginResponse,AxiosError<ApiErrorBody>,LoginPayload>({mutationFn:authService.loginUser})
}