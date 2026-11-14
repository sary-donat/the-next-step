import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useJobRoles } from "../hooks/useLookUp";
import { useState } from "react";
import { jobRoleService } from "../services/jobRolesServices";
import type { JobRole } from "../types/types";
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { useForm } from "react-hook-form";
import { getErrorMessage } from "../api/apiClient";
import { Check, Pencil, Plus, Power, Tags, X } from "lucide-react";
const jobRoleSchema = yup.object({
    name: yup.string().trim().required('שדה חובה').min(2, 'לפחות 2 תווים').max(80, 'עד 80 תווים'),
});
type JobRoleForm = yup.InferType<typeof jobRoleSchema>;
const ManageJobRoles = () => {

    const queryClient = useQueryClient();
    const refresh = () => queryClient.invalidateQueries({ queryKey: ['job-roles'] });
    const { data: jobRoles = [], isLoading, isError, error } = useJobRoles({ includeInactive: true });
    const {
        register,
        handleSubmit,
        reset,
        setError,
    } = useForm<JobRoleForm>({ resolver: yupResolver(jobRoleSchema) });

    const create = useMutation({
        mutationFn: (data: JobRoleForm) => jobRoleService.createJobRole({ name: data.name }),
        onSuccess: () => {
            reset();
            refresh();
        },
        onError: (err) => setError('name', { message: getErrorMessage(err) }),
    });
    const [editingId, setEditingId] = useState<number | null>(null);
    const [editName, setEditName] = useState('');

    const update = useMutation({
        mutationFn: ({ id, data }: { id: number; data: { name?: string; isActive?: boolean } }) =>
            jobRoleService.updateJobRole(id, data),
        onSuccess: () => {
            setEditingId(null);
            refresh();
        },
    });

    const startEdit = (role: JobRole) => {
        setEditingId(role.id);
        setEditName(role.name);
    };

    return (
        <div className="space-y-6">
            <h1 className="flex items-center gap-3 text-2xl font-bold tracking-tight sm:text-3xl"><span className="grid size-10 place-items-center rounded-xl bg-violet-100 text-violet-600"><Tags className="size-5" /></span>ניהול תחומי תפקיד</h1>
            <form onSubmit={handleSubmit((data) => create.mutate(data))} className="flex flex-col gap-3 rounded-2xl border border-border bg-card p-5 shadow-lg shadow-text/5 sm:flex-row sm:flex-wrap sm:items-end sm:p-6">
                <div className="flex-1 sm:min-w-64">
                <label htmlFor="name" className="mb-1.5 block text-sm font-medium">תחום חדש</label>
                <input type="text" id="name" {...register('name')} placeholder="למשל גרפיקה" className="min-h-11 w-full rounded-xl border border-border bg-card px-4 text-base transition placeholder:text-muted/70 focus:border-primary focus:ring-4 focus:ring-primary/15 focus:outline-none sm:text-sm" />
                </div>
                <button type="submit" className="inline-flex min-h-11 cursor-pointer items-center justify-center gap-2 rounded-xl bg-linear-to-l from-gradient-from via-gradient-via to-gradient-to px-6 text-sm font-semibold text-white shadow-md shadow-primary/25 transition hover:shadow-lg hover:brightness-110 disabled:cursor-not-allowed disabled:opacity-60"><Plus className="size-4" /> {create.isPending ? 'מוסיף...' : '+ הוספה'}</button>
                {error?.name && <p className="w-full text-sm text-red-600">{getErrorMessage(error.name)}</p>}

            </form>
            {isLoading ? (
                <p className="rounded-2xl border border-dashed border-border bg-card p-6 text-center text-muted">טוען...</p>
            ) : isError ? (
                <p className="rounded-2xl border border-red-200 bg-red-50 p-6 text-center text-red-700">{getErrorMessage(error)}</p>
            ) : jobRoles.length === 0 ? (
                <p className="rounded-2xl border border-dashed border-border bg-card p-10 text-center text-muted">עדיין אין תחומים במוסד. הוסיפו את הראשון למעלה.</p>
            ) : (
                <table className="block w-full md:table md:overflow-hidden md:rounded-2xl md:border md:border-border md:bg-card md:shadow-lg md:shadow-text/5">
                    <thead className="hidden bg-primary-light/60 md:table-header-group">
                        <tr>
                            <th className="px-6 py-3 text-start text-sm font-semibold text-primary">שם התחום</th>
                            <th className="px-6 py-3 text-start text-sm font-semibold text-primary">מצב</th>
                            <th className="px-6 py-3"></th>
                        </tr>
                    </thead>
                    <tbody className="grid grid-cols-1 gap-3 sm:grid-cols-2 md:table-row-group">
                        {
                            jobRoles.map((j) => (
                                <tr key={j.id} className="flex flex-col gap-3 rounded-2xl border border-border bg-card p-4 shadow-sm transition hover:shadow-lg hover:shadow-primary/10 md:table-row md:rounded-none md:border-0 md:border-t md:p-0 md:shadow-none md:hover:bg-primary-light/30 md:hover:shadow-none">
                                    <td className="text-base font-semibold md:px-6 md:py-4">
                                        {editingId === j.id ? (
                                            <input value={editName} onChange={(e) => setEditName(e.target.value)} maxLength={80} className="min-h-11 w-full rounded-xl border border-border bg-card px-4 text-base transition placeholder:text-muted/70 focus:border-primary focus:ring-4 focus:ring-primary/15 focus:outline-none sm:text-sm" />
                                        ) : (j.name)}
                                    </td>
                                    <td className="text-sm md:px-6 md:py-4"><span className={`inline-flex items-center rounded-full px-2.5 py-1 text-xs font-medium ${j.isActive ? 'bg-emerald-100 text-emerald-800' : 'bg-gray-100 text-gray-600'}`}>{j.isActive ? '✅ פעיל' : '⛔ לא פעיל'}</span></td>
                                    <td className="md:px-6 md:py-4">
                                        <div className="flex flex-wrap gap-2 md:justify-end">
                                        {editingId === j.id ? (
                                            <>
                                                <button
                                                    type="button"
                                                    disabled={update.isPending || editName.trim().length < 2}
                                                    onClick={() => update.mutate({ id: j.id, data: { name: editName.trim() } })}
                                                    className="inline-flex min-h-11 flex-1 cursor-pointer items-center justify-center gap-2 rounded-xl bg-linear-to-l from-gradient-from via-gradient-via to-gradient-to px-4 text-sm font-semibold text-white shadow-md shadow-primary/25 transition hover:brightness-110 disabled:cursor-not-allowed disabled:opacity-60 md:flex-none"
                                                >
                                                    <Check className="size-4" />
                                                    שמירה
                                                </button>
                                                <button type="button" onClick={() => setEditingId(null)} className="inline-flex min-h-11 cursor-pointer items-center justify-center gap-2 rounded-xl border border-border bg-card px-4 text-sm font-semibold transition hover:border-primary hover:bg-primary-light hover:text-primary disabled:cursor-not-allowed disabled:opacity-60 flex-1 md:flex-none">
                                                    <X className="size-4" />
                                                    ביטול
                                                </button>
                                            </>
                                        ) : (
                                            <>
                                                <button type="button" onClick={() => startEdit(j)} className="inline-flex min-h-11 cursor-pointer items-center justify-center gap-2 rounded-xl border border-border bg-card px-4 text-sm font-semibold transition hover:border-primary hover:bg-primary-light hover:text-primary disabled:cursor-not-allowed disabled:opacity-60 flex-1 md:flex-none">
                                                    <Pencil className="size-4 text-amber-500" />
                                                    עריכה
                                                </button>
                                                <button
                                                    type="button"
                                                    disabled={update.isPending}
                                                    onClick={() => update.mutate({ id: j.id, data: { isActive: !j.isActive } })}
                                                    className={`inline-flex min-h-11 flex-1 cursor-pointer items-center justify-center gap-2 rounded-xl border px-4 text-sm font-semibold transition disabled:cursor-not-allowed disabled:opacity-60 md:flex-none ${j.isActive ? 'border-red-200 bg-red-50 text-red-700 hover:bg-red-100' : 'border-emerald-200 bg-emerald-50 text-emerald-700 hover:bg-emerald-100'}`}
                                                >
                                                    <Power className="size-4" />
                                                    {j.isActive ? 'השבתה' : 'הפעלה'}
                                                </button>
                                            </>
                                        )}
                                        </div>
                                    </td>
                                </tr>
                            ))
                        }
                    </tbody>
                </table>
            )}
        </div>
    )
}
export default ManageJobRoles