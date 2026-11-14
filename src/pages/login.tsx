import * as yup from "yup"
import { useForm } from "react-hook-form"
import { yupResolver } from "@hookform/resolvers/yup"
import { useLogin } from "../hooks/useLogin"
import { useAuth } from "../context/auth"
import { useNavigate } from "react-router"
import { AlertCircle, Lock, LogIn, Mail } from "lucide-react"
const schema = yup.object({
    email: yup.string().trim().required('שדה חובה'),
    password: yup.string().trim().required('שדה חובה')
}).required()
type LoginFormData = yup.InferType<typeof schema>
const Login = () => {
    const { login } = useAuth();
     const { mutate } = useLogin();
    const navigate = useNavigate();
    const {
        register,
        handleSubmit,
         setError,  
         clearErrors,  
        formState: { errors },
    } = useForm<LoginFormData>({
        resolver: yupResolver(schema),
    })
   
 const onSubmit = (data: LoginFormData) => {
clearErrors('root')
  mutate(data, {
     onSuccess: (response) => {login(response.token,response.user);
        navigate('/home')
     },
     onError: (error) => {
    setError('root.server', {
        message: error.response?.data.error.message ?? 'לא ניתן להתחבר לשרת. נסו שוב בעוד רגע',
      });
     },
  });
};
    return (
        <div className="flex justify-center py-4 sm:py-10">
            <form onSubmit={handleSubmit(onSubmit)} className="w-full max-w-md space-y-5 rounded-2xl border border-border bg-card p-6 shadow-lg shadow-text/5 sm:p-8">
                <div className="flex justify-center">
                    <span className="grid size-14 place-items-center rounded-2xl bg-linear-to-l from-gradient-from via-gradient-via to-gradient-to text-white shadow-lg shadow-primary/30">
                        <LogIn className="size-7" />
                    </span>
                </div>
                {errors.root?.server && <p className="flex items-center gap-2 rounded-xl border border-red-200 bg-red-50 p-3 text-sm text-red-700"><AlertCircle className="size-4 shrink-0" />{errors.root.server.message}</p>}
                <div>
                    <label htmlFor="email" className="mb-1.5 block text-sm font-medium">כתובת דוא״ל</label>
                    <div className="relative">
                        <Mail className="pointer-events-none absolute top-1/2 right-3.5 size-4 -translate-y-1/2 text-muted" />
                        <input type="email" id="email" {...register("email")} placeholder="@example.com" className="min-h-11 w-full rounded-xl border border-border bg-card pr-10 pl-4 text-base transition placeholder:text-muted/70 focus:border-primary focus:ring-4 focus:ring-primary/15 focus:outline-none sm:text-sm" />
                    </div>
                    {errors.email && <p className="mt-1.5 text-sm text-red-600">{errors.email?.message}</p>}
                </div>
                <div>
                    <label htmlFor="password" className="mb-1.5 block text-sm font-medium">סיסמא</label>
                    <div className="relative">
                        <Lock className="pointer-events-none absolute top-1/2 right-3.5 size-4 -translate-y-1/2 text-muted" />
                        <input type="password" id="password" {...register("password")} placeholder="סיסמא" className="min-h-11 w-full rounded-xl border border-border bg-card pr-10 pl-4 text-base transition placeholder:text-muted/70 focus:border-primary focus:ring-4 focus:ring-primary/15 focus:outline-none sm:text-sm" />
                    </div>
                    {errors.password && <p className="mt-1.5 text-sm text-red-600">{errors.password?.message}</p>}
                </div>
                <button type="submit" className="inline-flex min-h-11 w-full cursor-pointer items-center justify-center gap-2 rounded-xl bg-linear-to-l from-gradient-from via-gradient-via to-gradient-to px-5 text-sm font-semibold text-white shadow-md shadow-primary/25 transition hover:shadow-lg hover:brightness-110 disabled:cursor-not-allowed disabled:opacity-60">התחברות</button>
            </form>
        </div>
    )
}

export default Login