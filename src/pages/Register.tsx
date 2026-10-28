import * as yup from "yup"
import { useForm } from "react-hook-form"
import { yupResolver } from "@hookform/resolvers/yup"
import { UseInstitutions } from "../hooks/InstitutionList"
import useInstitutionJobRoles from "../hooks/useInstitutionJobRoles"
import { useEffect } from "react"
import useRegister from "../hooks/useRegister"
import { useNavigate } from "react-router"
import { Briefcase, UserPlus } from "lucide-react"
const schema = yup.
    object({
        fullName: yup.string().trim().min(2, 'השם צריך להכיל לפחות 2 תווים').max(100, 'השם יכול להכיל עד 100 תווים').required('שדה חובה'),
        email: yup.string().trim().email('כתובת דוא״ל לא תקינה').required('שדה חובה'),
        password: yup.string().trim().matches(/^(?=.*[א-תףךץםa-zA-Z])(?=.*\d).+$/, 'הסיסמא חיבת להכיל לפחות אות אחת וספרה אחת').min(8, 'הסיסמא חיבת להכיל לפחות 8 תווים').max(72, 'הסיסמא יכולה להכיל עד 72 תווים').required('שדה חובה'),
        confirmPassword: yup.string().oneOf([yup.ref('password')], 'הסיסמא אינה זהה').required('שדה חובה'),
        institutionId: yup.number().typeError('יש לבחור מוסד').integer().positive().required('שדה חובה'),
        jobRoleIds: yup.array().transform((value) => Array.isArray(value) ? value : value ? [value] : []).of(yup.number().required()).max(20, 'ניתן לבחור עד 20 תחומים').default([])
    }).required()
type RegisterFormData = yup.InferType<typeof schema>;
const Register = () => {
    const navigate = useNavigate();
    const { mutate } = useRegister();
    const {
        register,
        handleSubmit,
        watch,
        setValue,
        clearErrors,
        setError,
        formState: { errors },
    } = useForm({
        resolver: yupResolver(schema),
    })

    const { data: institutions, isLoading, isError } = UseInstitutions();
    const selectedInstitutionId = Number(watch('institutionId'))
    const { data: institutionJobRoles } = useInstitutionJobRoles(selectedInstitutionId);
    useEffect(() => {
        setValue('jobRoleIds', [])
    }, [selectedInstitutionId, setValue])



    const onSubmit = (data: RegisterFormData) => {
        const { confirmPassword, ...payload } = data;
        clearErrors('root');
        mutate({ ...payload, jobRoleIds: payload.jobRoleIds ?? [] }, {
            onSuccess: (response) => {
                navigate('/login', { state: { message: response.message } })
            },
            onError: (error) => {
                const serverError = error.response?.data.error;
                if (serverError?.code === 'EMAIL_TAKEN') {
                    setError('email', { message: serverError.message });
                } else {
                    setError('root.server', { message: serverError?.message ?? 'לא ניתן להתחבר לשרת' });
                }
            },
        });
    };
    return (
        <div className="flex justify-center py-2 sm:py-6">
            <form onSubmit={handleSubmit(onSubmit)} className="w-full max-w-3xl rounded-2xl border border-border bg-card p-6 shadow-lg shadow-text/5 sm:p-8">
                <div className="mb-6 flex justify-center">
                    <span className="grid size-14 place-items-center rounded-2xl bg-linear-to-l from-gradient-from via-gradient-via to-gradient-to text-white shadow-lg shadow-primary/30">
                        <UserPlus className="size-7" />
                    </span>
                </div>
                <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
                <div className="md:col-span-2">
                <label htmlFor="fullName" className="mb-1.5 block text-sm font-medium">שם מלא</label>
                <input type="text" id="fullName" {...register("fullName")} placeholder="ישראל ישראלי" className="min-h-11 w-full rounded-xl border border-border bg-card px-4 text-base transition placeholder:text-muted/70 focus:border-primary focus:ring-4 focus:ring-primary/15 focus:outline-none sm:text-sm" />
                {errors.fullName && <p className="mt-1.5 text-sm text-red-600">{errors.fullName?.message}</p>}
                </div>
                <div className="md:col-span-2">
                <label htmlFor="email" className="mb-1.5 block text-sm font-medium">כתובת דוא״ל</label>
                <input type="email" id="email" {...register("email")} placeholder="@example.com" className="min-h-11 w-full rounded-xl border border-border bg-card px-4 text-base transition placeholder:text-muted/70 focus:border-primary focus:ring-4 focus:ring-primary/15 focus:outline-none sm:text-sm" />
                {errors.email && <p className="mt-1.5 text-sm text-red-600">{errors.email?.message}</p>}
                </div>
                <div>
                <label htmlFor="password" className="mb-1.5 block text-sm font-medium">סיסמא</label>
                <input type="password" id="password" {...register("password")} placeholder="סיסמא" className="min-h-11 w-full rounded-xl border border-border bg-card px-4 text-base transition placeholder:text-muted/70 focus:border-primary focus:ring-4 focus:ring-primary/15 focus:outline-none sm:text-sm" />
                {errors.password && <p className="mt-1.5 text-sm text-red-600">{errors.password?.message}</p>}
                </div>
                <div>
                <label htmlFor="confirmPassword" className="mb-1.5 block text-sm font-medium">אישור סיסמא</label>
                <input type="password" id="confirmPassword" {...register("confirmPassword")} placeholder="הכנס שוב את הסיסמא" className="min-h-11 w-full rounded-xl border border-border bg-card px-4 text-base transition placeholder:text-muted/70 focus:border-primary focus:ring-4 focus:ring-primary/15 focus:outline-none sm:text-sm" />
                {errors.confirmPassword && <p className="mt-1.5 text-sm text-red-600">{errors.confirmPassword?.message}</p>}
                </div>
                <div className="md:col-span-2">
                <label htmlFor="institutionId" className="mb-1.5 block text-sm font-medium">מוסד</label>
                {
                    isLoading ? (
                        <p className="text-sm text-muted">טוען...</p>
                    ) : isError ? (
                        <p className="text-sm text-red-600">לא ניתן לטעון את רשימת המוסדות</p>
                    ) : (
                        <select id="institutionId" defaultValue="" {...register("institutionId")} className="min-h-11 w-full cursor-pointer rounded-xl border border-border bg-card px-4 text-base transition focus:border-primary focus:ring-4 focus:ring-primary/15 focus:outline-none sm:text-sm">
                            <option value="" disabled>בחר מוסד</option>
                            {institutions?.map((i) => (<option value={i.id} key={i.id}>
                                {i.name}
                                {i.city ? ` -${i.city}` : ''}
                            </option>))}
                        </select>
                    )}
                {errors.institutionId && <p className="mt-1.5 text-sm text-red-600">{errors.institutionId?.message}</p>}
                </div>
                <fieldset className="rounded-2xl border border-border bg-bg/60 p-4 md:col-span-2 sm:p-5">
                    <legend id=" jobRoleIds" className="flex items-center gap-2 px-2 text-sm font-semibold"><Briefcase className="size-4 text-primary" />תחומי חיפוש העבודה</legend>
                    <div className="flex flex-wrap gap-2">
                    {!selectedInstitutionId ? (<p className="text-sm text-muted">יש לבחור מוסד</p>) :
                        isLoading ? (
                            <p className="text-sm text-muted">טוען תחומים...</p>
                        ) :
                            isError ? (
                                <p className="text-sm text-red-600">לא ניתן לטעון את התחומים</p>
                            ) : institutionJobRoles?.length === 0 ? (
                                <p className="text-sm text-muted">אין תחומים מוגדרים למוסד זה</p>) :
                                (institutionJobRoles?.map((role) => (
                                    <label key={role.id} className="flex min-h-11 cursor-pointer items-center gap-2 rounded-xl border border-border bg-card px-4 text-sm transition hover:border-primary/50 has-checked:border-primary has-checked:bg-primary-light has-checked:text-primary">
                                        <input type="checkbox" value={role.id} {...register("jobRoleIds")} className="size-4 accent-primary" />
                                        {role.name}
                                    </label>
                                )))
                    }
                    </div>
                    {errors.jobRoleIds && <p className="mt-1.5 text-sm text-red-600">{errors.jobRoleIds?.message}</p>}
                </fieldset>
                </div>
                <button type="submit" className="mt-6 inline-flex min-h-11 w-full cursor-pointer items-center justify-center gap-2 rounded-xl bg-linear-to-l from-gradient-from via-gradient-via to-gradient-to px-5 text-sm font-semibold text-white shadow-md shadow-primary/25 transition hover:shadow-lg hover:brightness-110 disabled:cursor-not-allowed disabled:opacity-60">הרשמה</button>
            </form>
        </div>

    )
}
export default Register