import { useDashboard } from "../hooks/useDashBoard";
import { Link } from "react-router";
import { useAuth } from "../context/auth";
import { AlertTriangle, CalendarClock, CalendarDays, CalendarRange, CheckCircle2, ChevronLeft, Compass, MapPin, Rocket, Sparkles, Target, User, Video } from "lucide-react";
import StatusBadge from "../components/ui/StatusBadge";
import ActionsList from "../components/ActionList";

const Home = () => {
    const { data, isLoading, isError } = useDashboard();
    const { user } = useAuth()

    const isAdmin=user?.role==='INSTITUTION_ADMIN'||user?.role==='SUPER_ADMIN'
    if (isLoading) return <p className="rounded-2xl border border-dashed border-border bg-card p-6 text-center text-muted">טוען...</p>;
    if (isError || !data) return <p className="rounded-2xl border border-red-200 bg-red-50 p-6 text-center text-red-700">לא ניתן לטעון את מסך הבית</p>
    return (
        <div className="space-y-6 sm:space-y-8">

            <section className="relative overflow-hidden rounded-3xl bg-linear-to-l from-gradient-from via-gradient-via to-gradient-to p-6 text-white shadow-xl shadow-primary/25 sm:p-8 lg:p-10">
                <div className="pointer-events-none absolute -top-20 -left-16 size-64 rounded-full bg-white/10 blur-3xl" />
                <div className="pointer-events-none absolute -bottom-24 left-1/3 size-72 rounded-full bg-accent/30 blur-3xl" />
                <div className="relative flex items-center gap-4 sm:gap-5">
                    <span className="grid size-14 shrink-0 place-items-center rounded-2xl bg-white/20 ring-1 ring-white/30 backdrop-blur sm:size-16">
                        <Sparkles className="size-7 sm:size-8" />
                    </span>
                    <h1 className="min-w-0 flex-1 text-2xl font-extrabold tracking-tight break-words sm:text-3xl lg:text-4xl">שלום, {user?.fullName}</h1>
                    <div className="hidden items-center gap-3 md:flex">
                        <span className="grid size-12 rotate-6 place-items-center rounded-2xl bg-white/15 ring-1 ring-white/25"><Target className="size-6" /></span>
                        <span className="grid size-12 -rotate-6 place-items-center rounded-2xl bg-white/15 ring-1 ring-white/25"><Rocket className="size-6" /></span>
                    </div>
                </div>
            </section>

            <div className="grid grid-cols-1 gap-5 sm:gap-6 lg:grid-cols-2 xl:grid-cols-3">
            <section className="overflow-hidden rounded-2xl border border-border bg-card shadow-lg shadow-text/5 transition duration-200 hover:shadow-xl hover:shadow-primary/10">
            <div className="flex items-center gap-3 border-b border-red-100 bg-linear-to-l from-red-50 to-card px-5 py-4">
                <span className="grid size-10 shrink-0 place-items-center rounded-xl bg-red-100 text-red-600"><AlertTriangle className="size-5" /></span>
                <h2 className="text-lg font-bold text-red-900">🔴 פעולות באיחור ({data.overdue.length})</h2>
            </div>
            <div className="p-4 sm:p-5">
          <ActionsList actions={data.overdue} emptyMessage="אין פעולות באיחור" />
            </div>
            </section>

            <section className="overflow-hidden rounded-2xl border border-border bg-card shadow-lg shadow-text/5 transition duration-200 hover:shadow-xl hover:shadow-primary/10">
            <div className="flex items-center gap-3 border-b border-amber-100 bg-linear-to-l from-amber-50 to-card px-5 py-4">
                <span className="grid size-10 shrink-0 place-items-center rounded-xl bg-amber-100 text-amber-600"><CalendarDays className="size-5" /></span>
                <h2 className="text-lg font-bold text-amber-900">🟠 פעולות להיום ({data.dueToday.length})</h2>
            </div>
            <div className="p-4 sm:p-5">
            <ActionsList actions={data.dueToday} emptyMessage="אין פעולות להיום" />
            </div>
            </section>

            <section className="overflow-hidden rounded-2xl border border-border bg-card shadow-lg shadow-text/5 transition duration-200 hover:shadow-xl hover:shadow-primary/10 lg:col-span-2 xl:col-span-1">
            <div className="flex items-center gap-3 border-b border-emerald-100 bg-linear-to-l from-emerald-50 to-card px-5 py-4">
                <span className="grid size-10 shrink-0 place-items-center rounded-xl bg-emerald-100 text-emerald-600"><CalendarRange className="size-5" /></span>
                <h2 className="text-lg font-bold text-emerald-900">🟢 פעולות בקרוב ({data.upcoming.length})</h2>
            </div>
            <div className="p-4 sm:p-5">
          <ActionsList actions={data.upcoming} emptyMessage="אין פעולות בשבוע הקרוב" />
            </div>
            </section>

            <section className="overflow-hidden rounded-2xl border border-border bg-card shadow-lg shadow-text/5 transition duration-200 hover:shadow-xl hover:shadow-primary/10 lg:col-span-2">
            <div className="flex items-center gap-3 border-b border-violet-100 bg-linear-to-l from-violet-50 to-card px-5 py-4">
                <span className="grid size-10 shrink-0 place-items-center rounded-xl bg-violet-100 text-violet-600"><Video className="size-5" /></span>
                <h2 className="text-lg font-bold text-violet-900">📅 ראיונות קרובים ({data.upcomingInterviews.length})</h2>
            </div>
            <div className="p-4 sm:p-5">
            {data.upcomingInterviews.length === 0 ? (
                <p className="flex flex-col items-center gap-2 rounded-2xl bg-bg px-4 py-8 text-center text-sm text-muted"><CalendarDays className="size-8 text-violet-300" />אין ראיונות בשבוע הקרוב</p>
            ) : (
                <ul className="grid grid-cols-1 gap-3 md:grid-cols-2">
                    {data.upcomingInterviews.map((app) => (
                        <li key={app.id} className="flex gap-4 rounded-2xl border border-border bg-card p-4 transition duration-200 hover:-translate-y-0.5 hover:border-violet-200 hover:shadow-lg hover:shadow-violet-500/10">
                            <span className="grid size-12 shrink-0 place-items-center rounded-2xl bg-linear-to-b from-violet-500 to-gradient-from text-white shadow-md shadow-violet-500/30"><CalendarClock className="size-6" /></span>
                            <div className="flex min-w-0 flex-1 flex-col gap-1.5 text-sm">
                            <span className="hidden">{' — '}</span>
                            <Link to={`/applications/${app.id}`} className="group inline-flex items-center gap-1.5 text-base font-semibold break-words text-text decoration-primary/40 decoration-2 underline-offset-4 transition hover:text-primary hover:underline">
                                {app.companyName} · {app.jobTitle}
                            <ChevronLeft className="size-4 shrink-0 text-primary/60 transition group-hover:-translate-x-1 group-hover:text-primary" />
                            </Link>
                            {isAdmin && <span className="flex items-center gap-1.5 text-muted"><User className="size-3.5 shrink-0 text-sky-500" /> · {app.user.fullName}</span>}
                            <span className="flex flex-wrap items-center gap-1.5 font-medium text-violet-700">
                            <span className="hidden">{' — '}</span>
                            {new Date(app.interviewAt).toLocaleString()}
                            </span>
                            <span className="flex items-center gap-1.5 break-words text-muted"><MapPin className="size-3.5 shrink-0 text-rose-500" />
                            {app.interviewLocation}
                            </span>
                            </div>
                        </li>
                    ))}
                </ul>)}
            </div>
            </section>
            <section className="overflow-hidden rounded-2xl border border-border bg-card shadow-lg shadow-text/5 transition duration-200 hover:shadow-xl hover:shadow-primary/10 lg:col-span-2 xl:col-span-1">
            <div className="flex items-center gap-3 border-b border-cyan-100 bg-linear-to-l from-cyan-50 to-card px-5 py-4">
                <span className="grid size-10 shrink-0 place-items-center rounded-xl bg-cyan-100 text-cyan-600"><Compass className="size-5" /></span>
                <h2 className="text-lg font-bold text-cyan-900">⚠ כדאי לבדוק: אין פעולות לביצוע({data.needsNextStep.length})</h2>
            </div>
            <div className="p-4 sm:p-5">
            {data.needsNextStep.length === 0 ? (
                <p className="flex flex-col items-center gap-2 rounded-2xl bg-bg px-4 py-8 text-center text-sm text-muted"><CheckCircle2 className="size-8 text-emerald-400" />לכל המועמדויות הפתוחות יש צעד הבא 👍</p>
            ) : (<ul className="divide-y divide-border">
                {data.needsNextStep.map((app) => (
                    <li key={app.id} className="flex flex-wrap items-center gap-x-3 gap-y-2 py-3 first:pt-0 last:pb-0">

                        <Link to={`/applications/${app.id}`} className="group inline-flex min-w-0 flex-1 items-center gap-1.5 font-semibold break-words text-text decoration-primary/40 decoration-2 underline-offset-4 transition hover:text-primary hover:underline">
                            {app.companyName} · {app.jobTitle}
                        <ChevronLeft className="size-4 shrink-0 text-primary/60 transition group-hover:-translate-x-1 group-hover:text-primary" />
                        </Link>
                        {isAdmin && <span className="flex items-center gap-1 text-sm text-muted"><User className="size-3.5 text-sky-500" /> · {app.user.fullName}</span>}
                        <span className="hidden">{' — '}</span>
                        <StatusBadge name={app.status.name} />
                    </li>
                ))}
            </ul>)}
            </div>
            </section>
            </div>
        </div>
    )
}
export default Home
