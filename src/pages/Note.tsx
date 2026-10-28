import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import { notificationService } from "../services/notificationsServices"
import { useAuth } from "../context/auth"
import { Link } from "react-router"
import { getErrorMessage } from "../api/apiClient"
import { ArrowLeft, Bell, BellOff, BellRing, Briefcase, Building2, CheckCheck, Clock, Lightbulb } from "lucide-react"

// מדגיש בתוך ההודעה את התפקיד, החברה, המבצע/ת וטקסט במירכאות (שם הפעולה)
function highlightMessage(text: string, terms: Record<string, string>) {
    const escape = (s: string) => s.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
    const known = Object.keys(terms).filter(Boolean).sort((a, b) => b.length - a.length).map(escape)
    const pattern = new RegExp(`(${[...known, '"[^"]+"', '“[^”]+”', '״[^״]+״'].join('|')})`, 'g')
    return text.split(pattern).map((part, i) => {
        if (terms[part]) return <strong key={i} className={terms[part]}>{part}</strong>
        if (/^["“״]/.test(part)) return <strong key={i} className="mx-0.5 rounded-sm bg-linear-to-t from-gradient-via/25 from-45% to-transparent to-45% px-1 font-extrabold text-gradient-via">{part}</strong>
        return part
    })
}

const Note = () => {
    const { user } = useAuth()
    const queryClient=useQueryClient()
    const { data, isLoading, isError, error } = useQuery({
        queryKey: ['notifications', user?.id],
        queryFn: () => notificationService.getNotifications(),
        enabled: user?.role === 'STUDENT'
    })
    const read = useMutation({
        mutationFn: (id: number) => notificationService.markAsRead(id),
          onSuccess: () => queryClient.invalidateQueries({ queryKey: ['notifications'] }),
    })
    const note = data?.items ?? []
    if (isLoading) return (
        <div className="mx-auto flex w-full max-w-3xl flex-col gap-4 px-4 py-10 sm:px-6">
            <div className="h-28 animate-pulse rounded-3xl bg-card ring-1 ring-border" />
            <div className="h-28 animate-pulse rounded-3xl bg-card ring-1 ring-border [animation-delay:150ms]" />
            <p className="text-center text-sm font-medium text-muted">טוען...</p>
        </div>
    )
    if (isError) return <p className="mx-auto mt-16 w-fit rounded-2xl bg-red-50 px-6 py-4 text-center font-medium text-red-600 ring-1 ring-red-200">{getErrorMessage(error)}</p>
    if (note.length === 0) return (
        <div className="mx-auto mt-16 flex w-fit flex-col items-center gap-3 rounded-3xl bg-card px-10 py-10 text-center shadow-sm ring-1 ring-border">
            <span className="grid size-16 place-items-center rounded-full bg-primary-light text-primary"><BellOff className="size-8" /></span>
            <p className="text-lg font-semibold text-muted">לא נמצאו התראות</p>
        </div>
    )
    return (
        <div className="mx-auto flex w-full max-w-3xl flex-col gap-5 px-4 py-10 sm:px-6">
            <div className="mb-2 flex items-center gap-3">
                <span className="grid size-12 place-items-center rounded-2xl bg-linear-to-br from-gradient-from via-gradient-via to-gradient-to text-white shadow-lg shadow-primary/30">
                    <Bell className="size-6" />
                </span>
                <h1 className="bg-linear-to-l from-gradient-from via-gradient-via to-gradient-to bg-clip-text text-3xl font-extrabold text-transparent">ההתראות שלי</h1>
            </div>
            {
                note.map((n) => (
                    <div className={`group relative flex gap-4 overflow-hidden rounded-3xl border p-5 transition duration-300 sm:p-6 ${n.isRead
                        ? 'border-border bg-bg opacity-60 grayscale-[60%] hover:opacity-90 hover:grayscale-0'
                        : 'border-red-200 bg-card shadow-xl shadow-red-500/10 ring-2 ring-red-500/20 hover:-translate-y-1 hover:shadow-2xl hover:shadow-red-500/20'}`}>
                        {!n.isRead && <span className="absolute inset-y-0 right-0 w-1.5 bg-linear-to-b from-red-500 via-rose-500 to-orange-400"></span>}
                        {!n.isRead && <span className="pointer-events-none absolute -top-16 -left-16 size-40 rounded-full bg-red-500/10 blur-2xl"></span>}

                        <span className={`relative grid size-12 shrink-0 place-items-center rounded-2xl ${n.isRead
                            ? 'bg-border/70 text-muted'
                            : 'bg-linear-to-br from-red-500 to-rose-600 text-white shadow-lg shadow-red-500/40'}`}>
                            {n.isRead ? <CheckCheck className="size-6" /> : <BellRing className="size-6 animate-pulse" />}
                            {!n.isRead && <span className="absolute -top-1 -left-1 flex size-3.5"><span className="absolute inline-flex size-full animate-ping rounded-full bg-red-400 opacity-75"></span><span className="relative inline-flex size-3.5 rounded-full bg-red-500 ring-2 ring-white"></span></span>}
                        </span>

                        <div className="relative flex min-w-0 flex-1 flex-col gap-3">
                            <div className="flex flex-wrap items-center gap-2">
                                <h1 className={`text-lg ${n.isRead ? 'font-semibold text-muted' : 'font-extrabold text-text'}`}>{n.title}</h1>
                                {!n.isRead && <span className="rounded-full bg-red-500 px-2.5 py-0.5 text-[11px] font-bold tracking-wide text-white shadow-sm shadow-red-500/40">חדש</span>}
                            </div>
                            <p className={`leading-relaxed ${n.isRead ? 'text-muted' : 'text-text/80'}`}>{highlightMessage(n.message, {
                                [n.application.jobTitle]: 'mx-0.5 rounded-sm bg-linear-to-t from-primary/20 from-45% to-transparent to-45% px-1 font-extrabold text-primary',
                                [n.application.companyName]: 'mx-0.5 rounded-sm bg-linear-to-t from-gradient-via/20 from-45% to-transparent to-45% px-1 font-extrabold text-gradient-via',
                                [n.actor.fullName]: 'mx-0.5 rounded-sm bg-linear-to-t from-gradient-to/25 from-45% to-transparent to-45% px-1 font-extrabold text-cyan-700',
                            })}</p>

                            <Link to={`/applications/${n.application.id}`} className="group/link flex w-fit flex-wrap items-center gap-x-3 gap-y-1 rounded-2xl border border-primary/15 bg-primary-light px-4 py-2.5 text-sm transition hover:border-primary/40 hover:bg-primary/10">
                                <span className="flex items-center gap-1.5 font-extrabold text-primary"><Briefcase className="size-4" />{n.application.jobTitle}</span>
                                <span className="text-primary/40">·</span>
                                <span className="flex items-center gap-1.5 font-bold text-gradient-via"><Building2 className="size-4" />{n.application.companyName} </span>
                                <ArrowLeft className="size-4 text-primary transition group-hover/link:-translate-x-1" />
                            </Link>

                            <p className={`flex items-start gap-2 rounded-2xl border px-4 py-3 text-sm font-medium ${n.isRead
                                ? 'border-border bg-card text-muted'
                                : 'border-amber-200 bg-linear-to-l from-amber-50 to-orange-50 text-amber-900'}`}><Lightbulb className="mt-0.5 size-4 shrink-0 text-amber-500" />צעד הבא מומלץ: {n.suggestedAction}</p>

                            <div className="mt-1 flex flex-wrap items-center justify-between gap-3 border-t border-dashed border-border pt-4">
                                <div className="flex flex-wrap items-center gap-x-5 gap-y-2 text-xs text-muted">
                                    <p className="flex items-center gap-2">
                                        <span className="grid size-7 place-items-center rounded-full bg-linear-to-br from-gradient-from to-gradient-via text-xs font-bold text-white">{n.actor.fullName.charAt(0)}</span>
                                        בוצע ע"י: <span className="text-sm font-bold text-text">{n.actor.fullName}</span>
                                    </p>
                                    <p className="flex items-center gap-1.5"><Clock className="size-3.5" />נוצר ב: {n.createdAt}</p>
                                </div>
                                {!n.isRead && (
                                    <button type="button" onClick={() => read.mutate(n.id)} disabled={read.isPending && read.variables===n.id} className="inline-flex min-h-10 cursor-pointer items-center gap-2 rounded-xl bg-linear-to-l from-gradient-from to-gradient-via px-5 text-sm font-bold text-white shadow-md shadow-primary/30 transition hover:scale-105 hover:shadow-lg active:scale-95 disabled:cursor-not-allowed disabled:opacity-50 disabled:hover:scale-100"><CheckCheck className="size-4" />קראתי</button>
                                )}
                            </div>
                        </div>
                    </div>
                ))
            }
        </div>
    )

}
export default Note
