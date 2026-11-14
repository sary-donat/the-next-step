import { AxiosError } from "axios";
import { useMutation } from "@tanstack/react-query"
import type { ApiErrorBody, CreateUser, NewUserPayload } from "../types/types";
import { authService } from "../services/authServices";



export default function useRegister()
{
    return useMutation<CreateUser,AxiosError<ApiErrorBody>,NewUserPayload>({mutationFn:authService.registerUser})
}
