import { Link, useNavigate, useParams } from "react-router"
import { useApplicationById } from "../hooks/useApplications"
import { Building2, Loader2, Pencil, Trash2 } from "lucide-react"
import StatusBadge from "../components/ui/StatusBadge"
import ActionsList from "../components/ActionList"
import { getErrorMessage } from "../api/apiClient"
import ActionForm from "../components/ActionForm"
import { useMutation, useQueryClient } from "@tanstack/react-query"
import { applicationService } from "../services/applicationService"

const ApplicationDetails = () => {
    const { id } = useParams()
    const applicationId = Number(id)
    const { data, isLoading, isError, error } = useApplicationById(applicationId)
    const queryClient = useQueryClient()
    const navigate = useNavigate()
    const remove = useMutation({
        mutationFn: () => applicationService.deleteApplication(applicationId),
        onSuccess: () => {
            queryClient.removeQueries({ queryKey: ['applications', applicationId] });
            queryClient.invalidateQueries({ queryKey: ['applications'] });
            queryClient.invalidateQueries({ queryKey: ['dashboard'] });
            navigate('/application', { replace: true });
        },
    });

    if (isLoading) return <p>טוען...</p>;
    if (isError) return <p>{getErrorMessage(error)}</p>
    if (!data) return <p>המועמדות לא נמצאה</p>;

    return (
        <div className="mx-auto max-w-4xl space-y-5 sm:space-y-6">
            <div className="relative flex flex-col gap-5 overflow-hidden rounded-3xl bg-linear-to-l from-gradient-from via-gradient-via to-gradient-to p-6 text-white shadow-xl shadow-primary/25 sm:flex-row sm:items-center sm:p-8">
                <div className="pointer-events-none absolute -top-16 -left-12 size-56 rounded-full bg-white/10 blur-3xl" />
                <div className="pointer-events-none absolute -bottom-20 left-1/3 size-64 rounded-full bg-accent/30 blur-3xl" />
                <span className="relative grid size-16 shrink-0 rotate-3 place-items-center rounded-2xl bg-white/20 ring-1 ring-white/30 backdrop-blur transition duration-300 hover:rotate-0">
                    <Building2 className="size-8" />
                </span>
                <div className="relative min-w-0 flex-1 space-y-3">
                    <h1 className="text-2xl font-extrabold tracking-tight break-words sm:text-3xl">{data?.companyName} · {data?.jobTitle}</h1>
                    <h2 className="inline-flex rounded-full bg-white/90 p-0.5 text-base font-medium shadow-sm"><StatusBadge name={data?.status.name} /></h2>
                </div>
                <div className="relative flex shrink-0 gap-2">
                    <Link to={`/applications/${applicationId}/edit`} className="inline-flex min-h-11 flex-1 items-center justify-center gap-2 rounded-xl bg-white px-5 text-sm font-semibold text-primary shadow-lg shadow-black/10 transition hover:-translate-y-0.5 hover:shadow-xl sm:flex-none"><Pencil className="size-4 text-amber-500" />עריכה</Link>
                    <button
                        type="button"
                        disabled={remove.isPending}
                        onClick={() => {
                            if (confirm('למחוק את המועמדות? לא ניתן לשחזר')) remove.mutate();
                        }}
                        className="group inline-flex min-h-11 flex-1 cursor-pointer items-center justify-center gap-2 rounded-xl bg-white/15 px-5 text-sm font-semibold text-white ring-1 ring-white/40 backdrop-blur transition hover:-translate-y-0.5 hover:bg-red-500 hover:shadow-xl hover:shadow-red-900/30 hover:ring-red-400 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white disabled:pointer-events-none disabled:opacity-60 sm:flex-none"
                    >
                        {remove.isPending
                            ? <Loader2 className="size-4 animate-spin" />
                            : <Trash2 className="size-4 transition group-hover:rotate-12" />}
                        {remove.isPending ? 'מוחק...' : 'מחיקה'}
                    </button>
                </div>
            </div>

            <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
                <div className="relative space-y-2 overflow-hidden rounded-2xl border border-border bg-card p-5 ps-7 shadow-lg shadow-text/5 transition duration-200 hover:-translate-y-0.5 hover:shadow-xl hover:shadow-sky-500/10 before:absolute before:inset-y-0 before:start-0 before:w-1.5 before:bg-linear-to-b before:from-sky-400 before:to-cyan-500 [&>p:empty]:hidden [&>p:not(:first-child)]:rounded-xl [&>p:not(:first-child)]:bg-bg [&>p:not(:first-child)]:px-3 [&>p:not(:first-child)]:py-2 [&>p:not(:first-child)]:text-sm [&>p:not(:first-child)]:break-words">
                    <p className="mb-3 inline-flex rounded-full bg-sky-100 px-3 py-1 text-sm font-bold text-sky-800">פרטי המשרה</p>

                    <p>תחום: {data.jobRole?.name}</p>
                    <p>צור קשר: {data.contactName}</p>
                </div>

                <div className="relative space-y-2 overflow-hidden rounded-2xl border border-border bg-card p-5 ps-7 shadow-lg shadow-text/5 transition duration-200 hover:-translate-y-0.5 hover:shadow-xl hover:shadow-rose-500/10 before:absolute before:inset-y-0 before:start-0 before:w-1.5 before:bg-linear-to-b before:from-rose-400 before:to-pink-500 [&>p:empty]:hidden [&>p:not(:first-child)]:rounded-xl [&>p:not(:first-child)]:bg-bg [&>p:not(:first-child)]:px-3 [&>p:not(:first-child)]:py-2 [&>p:not(:first-child)]:text-sm [&>p:not(:first-child)]:break-words">
                    <p className="mb-3 inline-flex rounded-full bg-rose-100 px-3 py-1 text-sm font-bold text-rose-800">התאמה אישית</p>
                    <p>רמת ענין: {data.interestLevel}</p>
                    <p>{data.jobAttractions}</p>
                    <p>{data.pointsToClarify}</p>
                    <p>{data.notes}</p>
                </div>
                <div className="relative space-y-2 overflow-hidden rounded-2xl border border-border bg-card p-5 ps-7 shadow-lg shadow-text/5 transition duration-200 hover:-translate-y-0.5 hover:shadow-xl hover:shadow-violet-500/10 md:col-span-2 before:absolute before:inset-y-0 before:start-0 before:w-1.5 before:bg-linear-to-b before:from-violet-400 before:to-gradient-from [&>p:empty]:hidden [&>p:not(:first-child)]:rounded-xl [&>p:not(:first-child)]:bg-bg [&>p:not(:first-child)]:px-3 [&>p:not(:first-child)]:py-2 [&>p:not(:first-child)]:text-sm [&>p:not(:first-child)]:break-words">
                    <p className="mb-3 inline-flex rounded-full bg-violet-100 px-3 py-1 text-sm font-bold text-violet-800">הכנה לראיון</p>
                    <p>{data.interviewAt}</p>
                    <p>{data.interviewLocation}</p>
                    <p>{data.interviewPreparation}</p>
                    <p>{data.interviewQuestions}</p>
                </div>
            </div>

            <div className="space-y-4 rounded-2xl border border-border bg-card p-5 shadow-lg shadow-text/5 sm:p-6">
                <h2 className="flex items-center gap-2.5 text-lg font-bold before:size-2.5 before:animate-pulse before:rounded-full before:bg-emerald-500 before:ring-4 before:ring-emerald-100">פעולות</h2>
                <ActionsList actions={data.actions} emptyMessage="עדיין אין פעולות למועמדות הזו" />
                <h3>הוספת פעולה</h3>
                <ActionForm applicationId={data.id} />


            </div>

        </div>
    )
}
export default ApplicationDetails
