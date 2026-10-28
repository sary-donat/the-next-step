import { useMutation, useQueryClient } from "@tanstack/react-query"
import { getErrorMessage } from "../../api/apiClient"
import { useStudents } from "../../hooks/useStudent"
import { userService } from "../../services/userServices"
import { Briefcase, Mail, UserRound } from "lucide-react"


const PendingStudents = () => {
    const queryCient = useQueryClient()
    const { data, isLoading, isError, error } = useStudents({ approvalStatus: 'PENDING' })
    const approve = useMutation({
        mutationFn: (id: number) => userService.approveUser(id),
        onSuccess: () => queryCient.invalidateQueries({ queryKey: ['users'] })
    })
    const reject=useMutation({
        mutationFn: (id: number) => userService.rejectUser(id),
        onSuccess: () => queryCient.invalidateQueries({ queryKey: ['users'] })
    })
    return (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {isLoading ? (<p className="col-span-full rounded-2xl border border-dashed border-border bg-card p-6 text-center text-muted">טוען...</p>) :
                isError ? (<p className="col-span-full rounded-2xl border border-red-200 bg-red-50 p-6 text-center text-red-700">{getErrorMessage(error)}</p>) :
                    !data || data.items.length === 0 ? (<p className="col-span-full rounded-2xl border border-dashed border-border bg-card p-10 text-center text-muted"> לא נמצאו תלמידים המחכים לאישור</p>) :
                        (
                            data.items.map((s) => (<div key={s.id} className="flex flex-col gap-3 rounded-2xl border border-border border-t-4 border-t-amber-400 bg-card p-5 shadow-lg shadow-text/5 transition duration-200 hover:-translate-y-1 hover:shadow-xl hover:shadow-primary/10">
                                <div className="flex items-center gap-3">
                                <span className="grid size-10 shrink-0 place-items-center rounded-full bg-primary-light text-primary"><UserRound className="size-5" /></span>
                                <h3 className="min-w-0 text-base font-semibold break-words">{s.fullName}</h3>
                                </div>
                                <p className="flex items-center gap-2 text-sm break-all text-muted"><Mail className="size-4 shrink-0 text-sky-500" />{s.email}</p>
                                <p className="flex items-start gap-2 text-sm text-muted"><Briefcase className="mt-0.5 size-4 shrink-0 text-amber-500" /><span>תחומים: {s.desiredJobRoles.map((role) => role.name).join(', ') || '—'}</span></p>
                                <div className="mt-auto grid grid-cols-2 gap-2 pt-2">
                                    <button type="button" onClick={() => approve.mutate(s.id)} className="inline-flex min-h-11 cursor-pointer items-center justify-center gap-2 rounded-xl border border-emerald-200 bg-emerald-50 px-3 text-sm font-semibold text-emerald-700 transition hover:bg-emerald-100">✓ אישור</button>
                                    <button type="button" onClick={() => reject.mutate(s.id)} className="inline-flex min-h-11 cursor-pointer items-center justify-center gap-2 rounded-xl border border-red-200 bg-red-50 px-3 text-sm font-semibold text-red-700 transition hover:bg-red-100">✗ דחייה</button>

                                </div>
                            </div>))
                        )
            }
        </div>
    )
}
export default PendingStudents
