import { Link, useNavigate, useParams } from "react-router"
import { useApplicationById } from "../hooks/useApplications"
import * as yup from "yup"
import { useForm } from "react-hook-form"
import { yupResolver } from "@hookform/resolvers/yup"
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import { useAuth } from "../context/auth"
import { INTEREST_LEVEL_LABELS, type ApplicationDetail, type CreateApplicationPayload, type InterestLevel } from "../types/types"
import { userService } from "../services/userServices"
import { useEffect, type ReactNode } from "react"
import { useStatuses, useJobRoles } from "../hooks/useLookUp"
import { getErrorMessage } from "../api/apiClient"
import  { applicationService } from "../services/applicationService"
import { AlertCircle, Briefcase, CalendarClock, ClipboardList, FilePlus2, Heart, Pencil, Save } from "lucide-react"
const optionalText = (max: number) => yup.string().trim().max(max, `עד ${max} תווים`).default('');
const todayString = () => new Date().toLocaleDateString('en-CA');
const toDateTimeInput = (iso: string | null) => {
    if (!iso) return '';
    const date = new Date(iso);
    return new Date(date.getTime() - date.getTimezoneOffset() * 60000).toISOString().slice(0, 16);
};
type ApplicationFormData = yup.InferType<typeof makeSchema>
const makeSchema =
    yup.object({
        userId: yup.string().default(''),
        companyName: yup.string().trim().required('שדה חובה').max(120, 'עד 120 תווים'),
        jobTitle: yup.string().trim().required('שדה חובה').max(120, 'עד 120 תווים'),
        submittedOn: yup
            .string()
            .required('שדה חובה')
            .test('not-future', 'תאריך ההגשה אינו יכול להיות בעתיד', (value) => !value || value <= todayString()),
        statusId: yup.string().required('יש לבחור סטטוס'),
        jobRoleId: yup.string().default(''),
        interestLevel: yup.string().default(''),
        contactName: optionalText(100),
        jobAttractions: optionalText(2000),
        pointsToClarify: optionalText(2000),
        notes: optionalText(5000),
        interviewAt: yup.string().default(''),
        interviewLocation: optionalText(300),
        interviewPreparation: optionalText(5000),
        interviewQuestions: optionalText(5000),
    });
interface FieldProps {
    label: string;
    htmlFor: string;
    error?: string;
    children: ReactNode;
}

function Field({ label, htmlFor, error, children }: FieldProps) {
    return (
        <div className="md:has-[textarea]:col-span-2">
            <label htmlFor={htmlFor} className="mb-1.5 block text-sm font-medium">{label}</label>
            {children}
            {error && <p className="mt-1.5 text-sm text-red-600">{error}</p>}
        </div>
    );
}
const emptyValues = (): ApplicationFormData => ({
    userId: '',
    companyName: '',
    jobTitle: '',
    submittedOn: todayString(),
    statusId: '',
    jobRoleId: '',
    interestLevel: '',
    //   jobUrl: '',
    contactName: '',
    jobAttractions: '',
    pointsToClarify: '',
    notes: '',
    interviewAt: '',
    interviewLocation: '',
    interviewPreparation: '',
    interviewQuestions: '',
});
const toFormValues = (app: ApplicationDetail): ApplicationFormData => ({
    userId: String(app.user.id),
    companyName: app.companyName,
    jobTitle: app.jobTitle,
    submittedOn: app.submittedOn,
    statusId: String(app.status.id),
    jobRoleId: app.jobRole ? String(app.jobRole.id) : '',
    interestLevel: app.interestLevel ?? '',
    // jobUrl: app.jobUrl ?? '',
    contactName: app.contactName ?? '',
    jobAttractions: app.jobAttractions ?? '',
    pointsToClarify: app.pointsToClarify ?? '',
    notes: app.notes ?? '',
    interviewAt: toDateTimeInput(app.interviewAt),
    interviewLocation: app.interviewLocation ?? '',
    interviewPreparation: app.interviewPreparation ?? '',
    interviewQuestions: app.interviewQuestions ?? '',
});
const emptyToNull = (value: string) => (value.trim() ? value.trim() : null);

const toPayload = (v: ApplicationFormData): CreateApplicationPayload => ({
    companyName: v.companyName.trim(),
    jobTitle: v.jobTitle.trim(),
    submittedOn: v.submittedOn,
    statusId: Number(v.statusId),
    jobRoleId: v.jobRoleId ? Number(v.jobRoleId) : null,
    interestLevel: (v.interestLevel || null) as InterestLevel | null,
    contactName: emptyToNull(v.contactName),
    jobAttractions: emptyToNull(v.jobAttractions),
    pointsToClarify: emptyToNull(v.pointsToClarify),
    notes: emptyToNull(v.notes),
    interviewAt: v.interviewAt ? new Date(v.interviewAt).toISOString() : null,
    interviewLocation: emptyToNull(v.interviewLocation),
    interviewPreparation: emptyToNull(v.interviewPreparation),
    interviewQuestions: emptyToNull(v.interviewQuestions),
});

const ApplicationForm = () => {
    const { id } = useParams()
    const applicationId = Number(id)
    const isEdit = !!id
    const { data, isLoading, isError, error } = useApplicationById(applicationId)

    const navigate = useNavigate();
    const queryClient = useQueryClient();
    const { user } = useAuth();
    const isAdmin = user?.role !== 'STUDENT';
    const needsStudent = isAdmin && !isEdit

    const {
        register,
        handleSubmit,
        reset,
        setError,
        formState: { errors },

    } = useForm<ApplicationFormData>({ resolver: yupResolver(makeSchema), defaultValues: emptyValues() });
    const studentsQuery = useQuery({
        queryKey: ['users', 'students', 'for-application-form'],
        queryFn: () => userService.getUsers({ role: 'STUDENT', approvalStatus: 'APPROVED' }),
        enabled: needsStudent,
    });
    const students = studentsQuery.data?.items ?? [];

    const statuses = useStatuses().data ?? [];
    const jobRoles = useJobRoles().data ?? [];
       
    useEffect(() => {
        if (data) reset(toFormValues(data));
    }, [data, reset]);
    
    const save = useMutation({
        mutationFn: (values: ApplicationFormData) => {
            const payload = toPayload(values);
            return isEdit
                ? applicationService.updateApplication(applicationId, payload)
                : applicationService.createApplication({ ...payload, userId: needsStudent ? Number(values.userId) : undefined });
        },
        onSuccess: (result) => {
            queryClient.invalidateQueries({ queryKey: ['applications'] });
            queryClient.invalidateQueries({ queryKey: ['dashboard'] });
            navigate(`/applications/${result.application.id}`);
        },
    });

    const onSubmit = (values: ApplicationFormData) => {
        if (needsStudent && !values.userId) {
            setError('userId', { message: 'יש לבחור תלמיד' });
            return;
        }
        save.mutate(values);
    };

    if (isEdit && isLoading) return <p className="rounded-2xl border border-dashed border-border bg-card p-6 text-center text-muted">טוען...</p>;
    if (isEdit && isError) return <p className="rounded-2xl border border-red-200 bg-red-50 p-6 text-center text-red-700">{getErrorMessage(error)}</p>;
    return (
        <div className="mx-auto max-w-4xl space-y-6">
            <h1 className="flex items-center gap-3 text-2xl font-bold tracking-tight sm:text-3xl"><span className="grid size-10 place-items-center rounded-xl bg-linear-to-l from-gradient-from via-gradient-via to-gradient-to text-white shadow-md shadow-primary/30">{isEdit ? <Pencil className="size-5" /> : <FilePlus2 className="size-5" />}</span>{isEdit ? 'עריכת מועמדות' : 'מועמדות חדשה'}</h1>
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-5 sm:space-y-6">
    {save.isError && <p className="flex items-center gap-2 rounded-xl border border-red-200 bg-red-50 p-3 text-sm text-red-700"><AlertCircle className="size-4 shrink-0" />{getErrorMessage(save.error)}</p>}
                <fieldset className="grid grid-cols-1 gap-5 rounded-2xl border border-border bg-card p-5 shadow-lg shadow-text/5 sm:p-6 md:grid-cols-2">
                    <legend className="mb-1 flex items-center gap-2 px-1 text-lg font-semibold md:col-span-2 float-start w-full"><span className="grid size-9 place-items-center rounded-xl bg-indigo-100 text-indigo-600"><ClipboardList className="size-5" /></span>פרטים עיקריים</legend>

                    {needsStudent && (
                        <Field label="תלמיד *" htmlFor="userId" error={errors.userId?.message}>
                            <select className="min-h-11 w-full rounded-xl border border-border bg-card px-4 text-base transition placeholder:text-muted/70 focus:border-primary focus:ring-4 focus:ring-primary/15 focus:outline-none sm:text-sm cursor-pointer" id="userId" {...register('userId')}>
                                <option value="">בחרו תלמיד</option>
                                {students.map((s) => (
                                    <option key={s.id} value={s.id}>{s.fullName}</option>
                                ))}
                            </select>
                        </Field>
                    )}

                    <Field label="שם החברה *" htmlFor="companyName" error={errors.companyName?.message}>
                        <input className="min-h-11 w-full rounded-xl border border-border bg-card px-4 text-base transition placeholder:text-muted/70 focus:border-primary focus:ring-4 focus:ring-primary/15 focus:outline-none sm:text-sm" id="companyName" {...register('companyName')} />
                    </Field>

                    <Field label="שם המשרה *" htmlFor="jobTitle" error={errors.jobTitle?.message}>
                        <input className="min-h-11 w-full rounded-xl border border-border bg-card px-4 text-base transition placeholder:text-muted/70 focus:border-primary focus:ring-4 focus:ring-primary/15 focus:outline-none sm:text-sm" id="jobTitle" {...register('jobTitle')} placeholder="למשל: מפתחת React מתחילה" />
                    </Field>

                    <Field label="תחום התפקיד" htmlFor="jobRoleId" error={errors.jobRoleId?.message}>
                        <select className="min-h-11 w-full rounded-xl border border-border bg-card px-4 text-base transition placeholder:text-muted/70 focus:border-primary focus:ring-4 focus:ring-primary/15 focus:outline-none sm:text-sm cursor-pointer" id="jobRoleId" {...register('jobRoleId')}>
                            <option value="">ללא תחום</option>
                            {jobRoles.map((r) => (
                                <option key={r.id} value={r.id}>{r.name}</option>
                            ))}
                        </select>
                    </Field>

                    <Field label="תאריך הגשה *" htmlFor="submittedOn" error={errors.submittedOn?.message}>
                        <input className="min-h-11 w-full rounded-xl border border-border bg-card px-4 text-base transition placeholder:text-muted/70 focus:border-primary focus:ring-4 focus:ring-primary/15 focus:outline-none sm:text-sm" id="submittedOn" type="date" max={todayString()} {...register('submittedOn')} />
                    </Field>

                    <Field label="סטטוס *" htmlFor="statusId" error={errors.statusId?.message}>
                        <select className="min-h-11 w-full rounded-xl border border-border bg-card px-4 text-base transition placeholder:text-muted/70 focus:border-primary focus:ring-4 focus:ring-primary/15 focus:outline-none sm:text-sm cursor-pointer" id="statusId" {...register('statusId')}>
                            <option value="">בחרו סטטוס</option>
                            {statuses.map((s) => (
                                <option key={s.id} value={s.id}>{s.name}</option>
                            ))}
                        </select>
                    </Field>
                </fieldset>


                <fieldset className="grid grid-cols-1 gap-5 rounded-2xl border border-border bg-card p-5 shadow-lg shadow-text/5 sm:p-6 md:grid-cols-2">
                    <legend className="mb-1 flex items-center gap-2 px-1 text-lg font-semibold md:col-span-2 float-start w-full"><span className="grid size-9 place-items-center rounded-xl bg-amber-100 text-amber-600"><Briefcase className="size-5" /></span>פרטי המשרה</legend>

                    <Field label="איש קשר" htmlFor="contactName" error={errors.contactName?.message}>
                        <input className="min-h-11 w-full rounded-xl border border-border bg-card px-4 text-base transition placeholder:text-muted/70 focus:border-primary focus:ring-4 focus:ring-primary/15 focus:outline-none sm:text-sm" id="contactName" {...register('contactName')} />
                    </Field>
                </fieldset>


                <fieldset className="grid grid-cols-1 gap-5 rounded-2xl border border-border bg-card p-5 shadow-lg shadow-text/5 sm:p-6 md:grid-cols-2">
                    <legend className="mb-1 flex items-center gap-2 px-1 text-lg font-semibold md:col-span-2 float-start w-full"><span className="grid size-9 place-items-center rounded-xl bg-rose-100 text-rose-600"><Heart className="size-5" /></span>התאמה אישית</legend>

                    <Field label="רמת עניין" htmlFor="interestLevel" error={errors.interestLevel?.message}>
                        <select className="min-h-11 w-full rounded-xl border border-border bg-card px-4 text-base transition placeholder:text-muted/70 focus:border-primary focus:ring-4 focus:ring-primary/15 focus:outline-none sm:text-sm cursor-pointer" id="interestLevel" {...register('interestLevel')}>
                            <option value="">לא נבחר</option>
                            {(Object.keys(INTEREST_LEVEL_LABELS) as InterestLevel[]).map((level) => (
                                <option key={level} value={level}>{INTEREST_LEVEL_LABELS[level]}</option>
                            ))}
                        </select>
                    </Field>

                    <Field label="מה מושך במשרה" htmlFor="jobAttractions" error={errors.jobAttractions?.message}>
                        <textarea className="min-h-11 w-full rounded-xl border border-border bg-card px-4 text-base transition placeholder:text-muted/70 focus:border-primary focus:ring-4 focus:ring-primary/15 focus:outline-none sm:text-sm py-3" id="jobAttractions" rows={2} {...register('jobAttractions')} />
                    </Field>

                    <Field label="מה צריך לברר" htmlFor="pointsToClarify" error={errors.pointsToClarify?.message}>
                        <textarea className="min-h-11 w-full rounded-xl border border-border bg-card px-4 text-base transition placeholder:text-muted/70 focus:border-primary focus:ring-4 focus:ring-primary/15 focus:outline-none sm:text-sm py-3" id="pointsToClarify" rows={2} {...register('pointsToClarify')} />
                    </Field>

                    <Field label="הערות" htmlFor="notes" error={errors.notes?.message}>
                        <textarea className="min-h-11 w-full rounded-xl border border-border bg-card px-4 text-base transition placeholder:text-muted/70 focus:border-primary focus:ring-4 focus:ring-primary/15 focus:outline-none sm:text-sm py-3" id="notes" rows={3} {...register('notes')} />
                    </Field>
                </fieldset>


                <fieldset className="grid grid-cols-1 gap-5 rounded-2xl border border-border bg-card p-5 shadow-lg shadow-text/5 sm:p-6 md:grid-cols-2">
                    <legend className="mb-1 flex items-center gap-2 px-1 text-lg font-semibold md:col-span-2 float-start w-full"><span className="grid size-9 place-items-center rounded-xl bg-violet-100 text-violet-600"><CalendarClock className="size-5" /></span>הכנה לראיון</legend>

                    <Field label="מועד הראיון" htmlFor="interviewAt" error={errors.interviewAt?.message}>
                        <input className="min-h-11 w-full rounded-xl border border-border bg-card px-4 text-base transition placeholder:text-muted/70 focus:border-primary focus:ring-4 focus:ring-primary/15 focus:outline-none sm:text-sm" id="interviewAt" type="datetime-local" {...register('interviewAt')} />
                    </Field>

                    <Field label="מקום או קישור לראיון" htmlFor="interviewLocation" error={errors.interviewLocation?.message}>
                        <input className="min-h-11 w-full rounded-xl border border-border bg-card px-4 text-base transition placeholder:text-muted/70 focus:border-primary focus:ring-4 focus:ring-primary/15 focus:outline-none sm:text-sm" id="interviewLocation" {...register('interviewLocation')} />
                    </Field>

                    <Field label="נקודות להכנה" htmlFor="interviewPreparation" error={errors.interviewPreparation?.message}>
                        <textarea className="min-h-11 w-full rounded-xl border border-border bg-card px-4 text-base transition placeholder:text-muted/70 focus:border-primary focus:ring-4 focus:ring-primary/15 focus:outline-none sm:text-sm py-3" id="interviewPreparation" rows={3} {...register('interviewPreparation')} />
                    </Field>

                    <Field label="שאלות למראיין" htmlFor="interviewQuestions" error={errors.interviewQuestions?.message}>
                        <textarea className="min-h-11 w-full rounded-xl border border-border bg-card px-4 text-base transition placeholder:text-muted/70 focus:border-primary focus:ring-4 focus:ring-primary/15 focus:outline-none sm:text-sm py-3" id="interviewQuestions" rows={3} {...register('interviewQuestions')} />
                    </Field>
                </fieldset>

                <div className="flex flex-col-reverse gap-3 sm:flex-row sm:justify-start">
                <button type="submit" disabled={save.isPending} className="inline-flex min-h-11 cursor-pointer items-center justify-center gap-2 rounded-xl bg-linear-to-l from-gradient-from via-gradient-via to-gradient-to px-6 text-sm font-semibold text-white shadow-md shadow-primary/25 transition hover:shadow-lg hover:brightness-110 disabled:cursor-not-allowed disabled:opacity-60 sm:order-first">
                    <Save className="size-4" />
                    {save.isPending ? 'שומר...' : isEdit ? 'שמירת שינויים' : 'הוספת מועמדות'}
                </button>
                <Link to={isEdit ? `/applications/${applicationId}` : '/applications'} className="inline-flex min-h-11 items-center justify-center gap-2 rounded-xl border border-border bg-card px-6 text-sm font-semibold text-muted transition hover:border-primary hover:bg-primary-light hover:text-primary">ביטול</Link>
                </div>
            </form>
        </div>
    )
}
export default ApplicationForm