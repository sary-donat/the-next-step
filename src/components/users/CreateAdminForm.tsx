import * as yup from "yup"
import { useForm } from "react-hook-form"
import { yupResolver } from "@hookform/resolvers/yup"
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { userService } from "../../services/userServices";
import { getErrorMessage } from "../../api/apiClient";
const schema = yup.object({
    fullName: yup.string().trim().required('שדה חובה').min(2, 'לפחות 2 תווים').max(100, 'עד 100 תווים'),
    email: yup.string().trim().required('שדה חובה').email('כתובת דוא״ל לא תקינה'),
    password: yup.string().required('שדה חובה').min(8, 'לפחות 8 תווים').max(72, 'עד 72 תווים').matches(/[A-Za-zא-ת]/, 'לפחות אות אחת').matches(/\d/, 'לפחות ספרה אחת'),
})


type AdminFormData = yup.InferType<typeof schema>;


const CreateAdminForm = ({institutionId} :{institutionId:number}) => {
    const queryClient = useQueryClient()
   
    const {
        register,
        handleSubmit,
        reset,
        formState: { errors },
    } = useForm<AdminFormData>({
        resolver: yupResolver(schema),
        defaultValues: { fullName: '', email: '', password: '' },
    });
    const create = useMutation({
        mutationFn: (values: AdminFormData) =>
            userService.createUSer({ ...values, institutionId, role: 'INSTITUTION_ADMIN' }),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['users'] });
            queryClient.invalidateQueries({ queryKey: ['institutions'] });
            reset();
        },
    });
    const onSubmit = (values: AdminFormData) => {
        create.mutate(values)
    }
    return(
    <form onSubmit={handleSubmit(onSubmit)} noValidate className="space-y-3">
        <div>
            <label htmlFor={`fullName-${institutionId}`} className="mb-1.5 block text-sm font-medium">שם מלא</label>
            <input id={`fullName-${institutionId}`} placeholder="שם מלא" {...register('fullName')} className="min-h-11 w-full rounded-xl border border-border bg-card px-4 text-base transition placeholder:text-muted/70 focus:border-primary focus:ring-4 focus:ring-primary/15 focus:outline-none sm:text-sm" />
            {errors.fullName && <p className="mt-1 text-sm text-red-600">{errors.fullName.message}</p>}
        </div>

        <div>
            <label htmlFor={`email-${institutionId}`} className="mb-1.5 block text-sm font-medium">דוא״ל</label>
            <input id={`email-${institutionId}`} type="email" dir="ltr" placeholder="name@example.com" {...register('email')} className="min-h-11 w-full rounded-xl border border-border bg-card px-4 text-base transition placeholder:text-muted/70 focus:border-primary focus:ring-4 focus:ring-primary/15 focus:outline-none sm:text-sm" />
            {errors.email && <p className="mt-1 text-sm text-red-600">{errors.email.message}</p>}
        </div>

        <div>
            <label htmlFor={`password-${institutionId}`} className="mb-1.5 block text-sm font-medium">סיסמה</label>
            <input id={`password-${institutionId}`} type="password" dir="ltr" placeholder="••••••••" {...register('password')} className="min-h-11 w-full rounded-xl border border-border bg-card px-4 text-base transition placeholder:text-muted/70 focus:border-primary focus:ring-4 focus:ring-primary/15 focus:outline-none sm:text-sm" />
            {errors.password && <p className="mt-1 text-sm text-red-600">{errors.password.message}</p>}
        </div>

        <button type="submit" disabled={create.isPending} className="inline-flex min-h-11 w-full cursor-pointer items-center justify-center gap-2 rounded-xl bg-linear-to-l from-gradient-from via-gradient-via to-gradient-to px-6 text-sm font-semibold text-white shadow-md shadow-primary/25 transition hover:shadow-lg hover:brightness-110 disabled:cursor-not-allowed disabled:opacity-60">
            {create.isPending ? 'מוסיף...' : 'הוספת מנהל'}
        </button>

        {create.isError && <p className="rounded-xl border border-red-200 bg-red-50 p-3 text-center text-sm text-red-700">{getErrorMessage(create.error)}</p>}
        {create.isSuccess && <p className="rounded-xl border border-emerald-200 bg-emerald-50 p-3 text-center text-sm font-medium text-emerald-800">המנהל נוסף ✓</p>}
    </form>
    )
}
export default CreateAdminForm