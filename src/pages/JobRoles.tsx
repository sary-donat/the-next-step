import { useEffect, useState } from "react";
import { useAuth } from "../context/auth";
import { useJobRoles } from "../hooks/useLookUp"
import { useMutation } from "@tanstack/react-query";
import { authService } from "../services/authServices";
import { Briefcase, CheckCircle2, Save } from "lucide-react";

const MyJobRoles = () => {
    const { user, refreshUser } = useAuth()
    const { data: jobRoles = [], isLoading } = useJobRoles();
    const [selectedJobRol, setSelecteJobRole] = useState<number[]>([])
    const [saved, setSaved] = useState(false)
    const toggle = (id: number) => {
        setSelecteJobRole(selectedJobRol.includes(id) ? selectedJobRol.filter((x) => x !== id) : [...selectedJobRol, id])
    }
    const save = useMutation({
        mutationFn: () => authService.updateMyJobRoles(selectedJobRol),
        onSuccess: (async () => {
            await refreshUser()
            setSaved(true)
        })
    })
    useEffect(() => {
        if (!saved) return
        const timer = setTimeout(() => setSaved(false), 3000)
        return () => clearTimeout(timer)
    }, [saved])
    useEffect(() => {
        setSelecteJobRole(user?.desiredJobRoles.map((r) => r.id) ?? [])
    }, [user])
    if (isLoading) return <p className="rounded-2xl border border-dashed border-border bg-card p-6 text-center text-muted">טוען...</p>;
    return (
        <div className="space-y-6">
           <div className="flex items-start gap-3">
           <span className="grid size-10 shrink-0 place-items-center rounded-xl bg-amber-100 text-amber-600"><Briefcase className="size-5" /></span>
           <div>
           <h1 className="text-2xl font-bold tracking-tight sm:text-3xl">התחומים שלי</h1>
            <p className="mt-1 max-w-2xl text-muted">סמנו באילו תחומים אתם מחפשים עבודה. מנהל המוסד יוכל להציע לכם משרות בתחומים אלה.</p>
           </div>
           </div>
            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {jobRoles.length === 0 ? (
                <p className="col-span-full rounded-2xl border border-dashed border-border bg-card p-10 text-center text-muted">אין תחומים מוגדרים במוסד שלך</p>
            ) : (
                jobRoles.map((role) => (
                    <label key={role.id} className="flex min-h-14 cursor-pointer items-center gap-3 rounded-2xl border border-border bg-card p-4 font-medium shadow-sm transition duration-200 hover:-translate-y-0.5 hover:border-primary/40 hover:shadow-lg hover:shadow-primary/10 has-checked:border-primary has-checked:bg-primary-light has-checked:text-primary">
                        <input type="checkbox" checked={selectedJobRol.includes(role.id)} onChange={() => toggle(role.id)} className="size-5 shrink-0 cursor-pointer accent-primary" />
                        {role.name}
                    </label>
                ))
            )}
            </div>
            <button type="button" onClick={() => save.mutate()} disabled={save.isPending} className="inline-flex min-h-11 w-full cursor-pointer items-center justify-center gap-2 rounded-xl bg-linear-to-l from-gradient-from via-gradient-via to-gradient-to px-8 text-sm font-semibold text-white shadow-md shadow-primary/25 transition hover:shadow-lg hover:brightness-110 disabled:cursor-not-allowed disabled:opacity-60 sm:w-auto"><Save className="size-4" />{save.isPending ? 'שומר...' : 'שמירה'}</button>
            {saved && (
                <div role="status" className="fixed bottom-6 left-1/2 z-50 flex -translate-x-1/2 items-center gap-2 rounded-xl bg-emerald-600 px-5 py-3 text-sm font-semibold text-white shadow-lg">
                    <CheckCircle2 className="size-5" />נשמר בהצלחה
                </div>
            )}
        </div>
    )
}
export default MyJobRoles