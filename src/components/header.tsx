import { Link, useNavigate } from "react-router"
import { useAuth } from "../context/auth"
import { useQuery } from "@tanstack/react-query"
import { notificationService } from "../services/notificationsServices"
import { useState } from "react"
import { flushSync } from "react-dom"
import { Bell, Briefcase, Building2, ChevronLeft, FileText, Home, LogOut, Menu, Sparkles, Tags, Users, X } from "lucide-react"

const Header = () => {
    const { user, logout } = useAuth()
    const navigate = useNavigate()
    const [menuOpen, setMenuOpen] = useState(false)
    const isStudent = user?.role === 'STUDENT';
    const isAdmin = user?.role === 'INSTITUTION_ADMIN'
    const isSuperAdmin = user?.role === 'SUPER_ADMIN'
    const { data: unreadcount = 0 } = useQuery({
        queryKey: ['notifications', 'unread-count'],
        queryFn: () => notificationService.getUnreadCount(),
        enabled: isStudent,
        refetchInterval: 20 * 1000,
    });
    function handleLogout() {
        flushSync(() => logout())
        navigate('/', { replace: true })
    }
    return (
        <header className="sticky top-0 z-40 bg-linear-to-l from-gradient-from via-gradient-via to-gradient-to shadow-lg shadow-primary/20">
            <div className="mx-auto flex h-16 w-full max-w-7xl items-center justify-between gap-4 px-4 sm:px-6 lg:px-8">
                <Link to={user ? '/home' : '/'} title="לדף הבית" className="group flex min-h-11 items-center gap-2 text-lg font-bold text-white sm:text-xl">
                    <span className="grid size-9 place-items-center rounded-xl bg-white/20 ring-1 ring-white/30">
                        <Sparkles className="size-5" />
                    </span>
                    הצעד הבא
                    <span className="grid size-6 place-items-center rounded-full bg-white/20 transition group-hover:-translate-x-1 group-hover:bg-white/35">
                        <ChevronLeft className="size-4" />
                    </span>
                </Link>
                {user ? (<>
                    <nav className="hidden items-center gap-1 lg:flex">
                        <Link to={'/home'} className="flex min-h-11 items-center gap-2 rounded-xl px-3 text-sm font-medium text-white/85 transition hover:bg-white/15 hover:text-white"><Home className="size-4" />בית</Link>
                        <Link to={'/application'} className="flex min-h-11 items-center gap-2 rounded-xl px-3 text-sm font-medium text-white/85 transition hover:bg-white/15 hover:text-white"><FileText className="size-4" />מועמדיות</Link>
                        {isStudent && <>
                            <Link to={'/my-job-roles'} className="flex min-h-11 items-center gap-2 rounded-xl px-3 text-sm font-medium text-white/85 transition hover:bg-white/15 hover:text-white"><Briefcase className="size-4" />התחומים שלי</Link>
                            <Link to={'/notifications'} title="התראות" className="group relative ms-1 grid size-11 place-items-center rounded-xl bg-white/15 text-white ring-1 ring-white/25 transition hover:bg-white/25">
                                <Bell className="size-5 transition group-hover:rotate-12" />
                                <span className="sr-only">התראות</span>
                                <span className="absolute -top-1 -left-1 grid h-5 min-w-5 place-items-center rounded-full bg-red-500 px-1 text-[11px] font-bold leading-none text-white shadow-md ring-2 ring-white">{unreadcount}</span>
                            </Link>
                        </>}
                        {
                            (isAdmin || isSuperAdmin) &&
                            (<>
                                <Link to={'/admin/users'} className="flex min-h-11 items-center gap-2 rounded-xl px-3 text-sm font-medium text-white/85 transition hover:bg-white/15 hover:text-white"><Users className="size-4" />משתמשים</Link>
                                {/* <Link></Link>
                            <Link></Link> */}
                            </>
                            )
                        }
                        {
                            isAdmin &&
                            <Link to={'/admin/job-roles'} className="flex min-h-11 items-center gap-2 rounded-xl px-3 text-sm font-medium text-white/85 transition hover:bg-white/15 hover:text-white"><Tags className="size-4" />תחומים</Link>
                        }
                        {
                            isSuperAdmin &&
                            <Link to={'/institutions'} className="flex min-h-11 items-center gap-2 rounded-xl px-3 text-sm font-medium text-white/85 transition hover:bg-white/15 hover:text-white"><Building2 className="size-4" />מוסדות</Link>
                        }
                    </nav>
                    <div className="flex items-center gap-2">
                        <button type="button" onClick={handleLogout} className="hidden min-h-11 cursor-pointer items-center gap-2 rounded-xl bg-white/15 px-4 text-sm font-semibold text-white ring-1 ring-white/25 transition hover:bg-white/25 lg:inline-flex">
                            <LogOut className="size-4" />התנתקות
                        </button>
                        <button
                            type="button"
                            onClick={() => setMenuOpen(!menuOpen)}
                            aria-label="תפריט"
                            aria-expanded={menuOpen}
                            className="grid size-11 cursor-pointer place-items-center rounded-xl bg-white/15 text-white ring-1 ring-white/25 transition hover:bg-white/25 lg:hidden"
                        >
                            {menuOpen ? <X className="size-5" /> : <Menu className="size-5" />}
                        </button>
                    </div>
                </>) : (<Link to={'/'}></Link>)}
            </div>

            {user && menuOpen && (
                <div className="border-t border-white/20 bg-card shadow-xl lg:hidden">
                    <nav className="mx-auto flex max-w-7xl flex-col gap-1 p-3 sm:px-6">
                        <Link to={'/home'} onClick={() => setMenuOpen(false)} className="flex min-h-12 items-center gap-3 rounded-xl px-4 text-base font-medium text-text transition hover:bg-primary-light hover:text-primary"><Home className="size-5 text-primary" />בית</Link>
                        <Link to={'/application'} onClick={() => setMenuOpen(false)} className="flex min-h-12 items-center gap-3 rounded-xl px-4 text-base font-medium text-text transition hover:bg-primary-light hover:text-primary"><FileText className="size-5 text-primary" />מועמדיות</Link>
                        {isStudent && <>
                            <Link to={'/my-job-roles'} onClick={() => setMenuOpen(false)} className="flex min-h-12 items-center gap-3 rounded-xl px-4 text-base font-medium text-text transition hover:bg-primary-light hover:text-primary"><Briefcase className="size-5 text-primary" />התחומים שלי</Link>
                            <Link to={'/notifications'} onClick={() => setMenuOpen(false)} className="flex min-h-12 items-center gap-3 rounded-xl px-4 text-base font-medium text-text transition hover:bg-primary-light hover:text-primary"><Bell className="size-5 text-primary" />התראות<span className="ms-auto grid h-6 min-w-6 place-items-center rounded-full bg-red-500 px-2 text-xs font-bold text-white shadow-sm">{unreadcount}</span></Link>
                        </>}
                        {(isAdmin || isSuperAdmin) &&
                            <Link to={'/admin/users'} onClick={() => setMenuOpen(false)} className="flex min-h-12 items-center gap-3 rounded-xl px-4 text-base font-medium text-text transition hover:bg-primary-light hover:text-primary"><Users className="size-5 text-primary" />משתמשים</Link>}
                        {isAdmin &&
                            <Link to={'/admin/job-roles'} onClick={() => setMenuOpen(false)} className="flex min-h-12 items-center gap-3 rounded-xl px-4 text-base font-medium text-text transition hover:bg-primary-light hover:text-primary"><Tags className="size-5 text-primary" />תחומים</Link>}
                        {isSuperAdmin &&
                            <Link to={'/institutions'} onClick={() => setMenuOpen(false)} className="flex min-h-12 items-center gap-3 rounded-xl px-4 text-base font-medium text-text transition hover:bg-primary-light hover:text-primary"><Building2 className="size-5 text-primary" />מוסדות</Link>}
                        <div className="my-1 border-t border-border" />
                        <button type="button" onClick={() => { setMenuOpen(false); handleLogout() }} className="flex min-h-12 cursor-pointer items-center gap-3 rounded-xl px-4 text-base font-medium text-red-600 transition hover:bg-red-50">
                            <LogOut className="size-5" />התנתקות
                        </button>
                    </nav>
                </div>
            )}
        </header>
    )
}
export default Header
