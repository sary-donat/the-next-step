import { useMutation, useQueryClient } from "@tanstack/react-query"
import { useState } from "react";
import { userService } from "../../services/userServices";
import { getErrorMessage } from "../../api/apiClient";
import { useAuth } from "../../context/auth";
import { useJobRoles } from "../../hooks/useLookUp";
import { useStudents } from "../../hooks/useStudent";
import { AlertCircle, Filter, Loader2, Power, Users } from "lucide-react";

const AllStudents = () => {

    const [jobRoleId, setJobRoleId] = useState('');
    const jobRoles = useJobRoles().data ?? [];
    const { user } = useAuth()
    const isSuperAdmin = user?.role === 'SUPER_ADMIN'
   const { data, isLoading, isError, error } = useStudents({
  approvalStatus: 'APPROVED',
  jobRoleId: jobRoleId ? Number(jobRoleId) : undefined,
});
    const queryCient = useQueryClient()
    const toggleActive = useMutation({
        mutationFn: ({ id, isActive }: { id: number, isActive: boolean }) => userService.updateUser(id, { isActive }),
        onSuccess: () => queryCient.invalidateQueries({ queryKey: ['users'] })
    })

    return (
        <div className="space-y-4">

            {!isSuperAdmin && <div className="relative w-full sm:w-72">
            <Filter className="pointer-events-none absolute top-1/2 right-3.5 size-4 -translate-y-1/2 text-primary" />
            <select value={jobRoleId} onChange={(e) => setJobRoleId(e.target.value)} className="min-h-11 w-full cursor-pointer rounded-xl border border-border bg-card pr-10 pl-4 text-base shadow-sm transition focus:border-primary focus:ring-4 focus:ring-primary/15 focus:outline-none sm:text-sm">
                <option value="">כל התחומים</option>
                {jobRoles.map((role) => (
                    <option key={role.id} value={role.id}>
                        {role.name}
                    </option>
                ))}

            </select>
            </div>
            }
            {toggleActive.isError && (
                <div role="alert" className="flex items-center gap-3 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700 shadow-sm">
                    <AlertCircle className="size-5 shrink-0" />
                    <span className="font-medium">{getErrorMessage(toggleActive.error)}</span>
                </div>
            )}
            {isLoading ? (
                <div role="status" className="flex flex-col items-center justify-center gap-3 rounded-2xl border border-border bg-card p-10 text-center shadow-sm">
                    <Loader2 className="size-8 animate-spin text-primary" />
                    <p className="text-sm font-medium text-muted">טוען תלמידים...</p>
                </div>
            ) :
                isError ? (
                    <div role="alert" className="flex flex-col items-center justify-center gap-3 rounded-2xl border border-red-200 bg-red-50 p-10 text-center shadow-sm">
                        <span className="flex size-12 items-center justify-center rounded-full bg-red-100">
                            <AlertCircle className="size-6 text-red-600" />
                        </span>
                        <p className="font-semibold text-red-800">אירעה שגיאה בטעינת התלמידים</p>
                        <p className="text-sm text-red-700">{getErrorMessage(error)}</p>
                    </div>
                ) :
                    !data || data.items.length === 0 ? (
                        <div className="flex flex-col items-center justify-center gap-3 rounded-2xl border border-dashed border-border bg-card p-10 text-center">
                            <span className="flex size-12 items-center justify-center rounded-full bg-primary-light/60">
                                <Users className="size-6 text-primary" />
                            </span>
                            <p className="font-semibold">לא נמצאו תלמידים</p>
                            {jobRoleId && <p className="text-sm text-muted">נסו לבחור תחום אחר או להציג את כל התחומים</p>}
                        </div>
                    ) :
                        (
                            <div className="w-full overflow-x-auto rounded-2xl border border-border bg-card shadow-lg shadow-text/5">
                            <table className="w-full min-w-[640px] text-sm">
                                <thead className="bg-primary-light/60">
                                    <tr>
                                        <th className="px-4 py-3 text-start font-semibold whitespace-nowrap text-primary sm:px-6">שם</th>
                                        <th className="px-4 py-3 text-start font-semibold whitespace-nowrap text-primary sm:px-6">דוא"ל</th>
                                        {isSuperAdmin && <th className="px-4 py-3 text-start font-semibold whitespace-nowrap text-primary sm:px-6">מוסד</th>}
                                        <th className="px-4 py-3 text-start font-semibold whitespace-nowrap text-primary sm:px-6">תחומים מבוקשים</th>
                                        <th className="px-4 py-3 text-start font-semibold whitespace-nowrap text-primary sm:px-6">מצב</th>
                                        <th className="px-4 py-3 sm:px-6"></th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-border">
                                    {data.items.map((u) => (
                                        <tr key={u.id} className="transition hover:bg-primary-light/30">
                                            <td className="px-4 py-3 font-semibold sm:px-6">{u.fullName}</td>
                                            <td className="px-4 py-3 text-muted sm:px-6">{u.email}</td>
                                            {isSuperAdmin && <td className="px-4 py-3 sm:px-6">{u.institution?.name}</td>}
                                            <td className="px-4 py-3 text-muted sm:px-6">{u.desiredJobRoles.map((r) => r.name).join(', ') || '—'}</td>
                                            <td className="px-4 py-3 sm:px-6"><span className={`inline-flex items-center rounded-full px-2.5 py-1 text-xs font-medium whitespace-nowrap ${u.isActive ? 'bg-emerald-100 text-emerald-800' : 'bg-gray-100 text-gray-600'}`}>{u.isActive ? '✅ פעיל' : '⛔ מושבת'}</span></td>
                                            <td className="px-4 py-3 text-end sm:px-6">
                                                <button onClick={() => toggleActive.mutate({ id: u.id, isActive: !u.isActive })} disabled={toggleActive.isPending} className={`inline-flex min-h-11 cursor-pointer items-center justify-center gap-2 rounded-xl border px-4 text-sm font-semibold whitespace-nowrap transition disabled:cursor-not-allowed disabled:opacity-60 ${u.isActive ? 'border-red-200 bg-red-50 text-red-700 hover:bg-red-100' : 'border-emerald-200 bg-emerald-50 text-emerald-700 hover:bg-emerald-100'}`}><Power className="size-4" /> {u.isActive ? 'השבתה' : 'הפעלה'}</button>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                            </div>
                        )
            }
        </div>
    )
}
export default AllStudents
