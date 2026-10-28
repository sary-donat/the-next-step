import { useState } from "react";
import { useAuth } from "../context/auth";
import { useApplications } from "../hooks/useApplications"
import { type ApplicationFilters, type InterestLevel } from "../types/types";
import { useJobRoles, useStatuses, useStudentOptions } from "../hooks/useLookUp";
import { Link } from "react-router";
import { Briefcase, Building2, FilePlus2, ChevronLeft, FileText, Search, User } from "lucide-react";
import StatusBadge from "../components/ui/StatusBadge";
const PAGE_SIZE = 20;
const Applications = () => {
    const { user } = useAuth()
    const isAdmin = user?.role === 'INSTITUTION_ADMIN' || user?.role === 'SUPER_ADMIN'
    const [search, setSearch] = useState('')
    const [statusId, setStatusId] = useState('')
    const [interestLevel] = useState('')
    const [jobRoleId, setJobRoleId] = useState('');
    const [isOpen] = useState('');
    const [userId, setUserId] = useState('')
    const [sortBy, setSortBy] = useState<NonNullable<ApplicationFilters['sortBy']>>('submittedOn')
    const [order] = useState<'asc' | 'desc'>('desc');
    const [page] = useState(1);
    const filters = {
        search: search.trim() || undefined,
        statusId: statusId ? Number(statusId) : undefined,
        interestLevel: (interestLevel || undefined) as InterestLevel | undefined,
        jobRoleId: jobRoleId ? Number(jobRoleId) : undefined,
        isOpen: isOpen ? isOpen === 'true' : undefined,
        userId: userId ? Number(userId) : undefined,
        sortBy,
        order,
        page,
        pageSize: PAGE_SIZE
    }
    const { data, isLoading, isError } = useApplications(filters);
    const status = useStatuses().data ?? []
    const jobroles = useJobRoles().data ?? []
    const students = useStudentOptions()
    const withReset =
        (setter: (value: string) => void) =>
            (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
                setter(e.target.value);
                
            };
    return (

        <div className="flex flex-wrap items-center gap-4 sm:gap-6">
            <div className="order-3 grid w-full grid-cols-1 gap-3 rounded-2xl border border-border bg-card p-4 shadow-lg shadow-text/5 sm:grid-cols-2 sm:p-5 lg:grid-cols-3 xl:grid-cols-6">
                <div className="relative sm:col-span-2 lg:col-span-3 xl:col-span-2">
                <Search className="pointer-events-none absolute top-1/2 right-3.5 size-4 -translate-y-1/2 text-primary" />
                <input type="search" placeholder="חיפוש לפי חברה או תפקיד" value={search} onChange={withReset(setSearch)} className="min-h-11 w-full rounded-xl border border-border bg-card pr-10 pl-4 text-base transition placeholder:text-muted/70 focus:border-primary focus:ring-4 focus:ring-primary/15 focus:outline-none sm:text-sm" />
                </div>
                <select value={statusId} onChange={withReset(setStatusId)} className="min-h-11 w-full cursor-pointer rounded-xl border border-border bg-card px-3 text-base transition focus:border-primary focus:ring-4 focus:ring-primary/15 focus:outline-none sm:text-sm">
                    <option value="">כל הסטטוסים</option>
                    {
                        status.map((s) => <option key={s.id} value={s.id}>{s.name}</option>)
                    }
                </select>
               
                
                {isAdmin && <select value={userId} onChange={withReset(setUserId)} className="min-h-11 w-full cursor-pointer rounded-xl border border-border bg-card px-3 text-base transition focus:border-primary focus:ring-4 focus:ring-primary/15 focus:outline-none sm:text-sm">
                    <option value="">כל התלמידים</option>
                    {
                        students.data?.map((s) => (
                            <option key={s.id} value={s.id}>{s.fullName}</option>
                        ))
                    }
                </select>}
                <select value={sortBy} onChange={(e) => setSortBy(e.target.value as typeof sortBy)} className="min-h-11 w-full cursor-pointer rounded-xl border border-border bg-card px-3 text-base transition focus:border-primary focus:ring-4 focus:ring-primary/15 focus:outline-none sm:text-sm">
                    <option value="submittedOn">מיון: תאריך הגשה</option>
                    <option value="companyName">מיון: שם חברה</option>
                    <option value="updatedAt">מיון: עדכון אחרון</option>
                    <option value="interestLevel">מיון: רמת עניין</option>
                </select>

                <select value={jobRoleId} onChange={withReset(setJobRoleId)} className="min-h-11 w-full cursor-pointer rounded-xl border border-border bg-card px-3 text-base transition focus:border-primary focus:ring-4 focus:ring-primary/15 focus:outline-none sm:text-sm">
                    <option value="">כל תחומי העניין</option>
                    {
                        jobroles.map((j)=>(
                            <option key={j.id} value={j.id}>{j.name}</option>
                        ))
                    }
                </select>
            </div>
            <h1 className="order-1 flex flex-1 items-center gap-3 text-2xl font-bold tracking-tight sm:text-3xl"><span className="grid size-10 place-items-center rounded-xl bg-cyan-100 text-cyan-600"><FileText className="size-5" /></span>מועמדיות</h1>
            {isLoading ? (<p className="order-4 w-full rounded-2xl border border-dashed border-border bg-card p-6 text-center text-muted">טוען...</p>)
                : isError ? (<p className="order-4 w-full rounded-2xl border border-red-200 bg-red-50 p-6 text-center text-red-700">לא ניתן לטעון את המועמדיות</p>) :
                    !data || data.items.length === 0 ? (<p className="order-4 w-full rounded-2xl border border-dashed border-border bg-card p-10 text-center text-muted">לא נמצאו מועמדיות</p>) :
                        <>
                            <p className="order-4 w-full text-sm text-muted">נמצאו <span className="font-semibold text-primary">{data.total}</span> מועמדויות</p>

                            <ul className="order-5 grid w-full grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                                {data.items.map((app) => (
                                    <li key={app.id} className="flex flex-col gap-2 rounded-2xl border border-border bg-card p-5 shadow-lg shadow-text/5 transition duration-200 hover:-translate-y-1 hover:shadow-xl hover:shadow-primary/10">
                                        <span className="flex items-start gap-3">
                                        <span className="grid size-10 shrink-0 place-items-center rounded-xl bg-primary-light text-primary"><Building2 className="size-5" /></span>
                                        <Link to={`/applications/${app.id}`} className="group inline-flex min-w-0 items-center gap-1.5 rounded-md pt-2 text-base font-semibold break-words text-text decoration-primary/40 decoration-2 underline-offset-4 transition-colors hover:text-primary hover:underline focus-visible:text-primary focus-visible:underline focus-visible:ring-2 focus-visible:ring-primary/30 focus-visible:outline-none">{app.companyName}<ChevronLeft className="size-4 shrink-0 text-primary/60 transition group-hover:-translate-x-1 group-hover:text-primary" /></Link>
                                        </span>
                                        <span className="hidden">·</span><span className="flex items-center gap-1.5 text-sm text-muted"><Briefcase className="size-4 shrink-0 text-amber-500" />{app.jobTitle}</span><span className="hidden">·</span><span className="mt-1"><StatusBadge name={app.status.name} /></span>
                                        {isAdmin && <><span className="hidden">·</span><span className="flex items-center gap-1.5 border-t border-border pt-2 text-sm text-muted"><User className="size-4 shrink-0 text-sky-500" />{app.user.fullName}</span><span className="hidden">·</span></>}
                                    </li>))}
                            </ul>
                        </>}
            <Link to="/applications/new" className="order-2 inline-flex min-h-11 items-center justify-center gap-2 rounded-xl bg-linear-to-l from-gradient-from via-gradient-via to-gradient-to px-5 text-sm font-semibold text-white shadow-md shadow-primary/25 transition hover:shadow-lg hover:brightness-110"><FilePlus2 className="size-4" />+ מועמדות חדשה</Link>
        </div>
    )
}
export default Applications