import { useState } from "react";
import { getErrorMessage } from "../api/apiClient"
import { UseInstitutions } from "../hooks/InstitutionList"
import CreateAdminForm from "../components/users/CreateAdminForm";
import { Link } from "react-router";
import { Building2, MapPin, UserPlus, X } from "lucide-react";


const InstitutionLAndCreateAdmin = () => {
    const { data, isLoading, isError, error } = UseInstitutions()
    const [openId, setOpenId] = useState<number | null>(null);
    return (
        <div className="space-y-6">
            <Link to={'/createInstitution'} className="float-end inline-flex min-h-11 items-center justify-center gap-2 rounded-xl bg-linear-to-l from-gradient-from via-gradient-via to-gradient-to px-5 text-sm font-semibold text-white shadow-md shadow-primary/25 transition hover:shadow-lg hover:brightness-110">הוספת מוסד</Link>
            <h1 className="flex items-center gap-3 text-2xl font-bold tracking-tight sm:text-3xl"><span className="grid size-10 place-items-center rounded-xl bg-violet-100 text-violet-600"><Building2 className="size-5" /></span>ניהול מוסדות</h1>
            {isLoading ? (
                <p className="rounded-2xl border border-dashed border-border bg-card p-6 text-center text-muted">טוען...</p>
            ) : isError ? (
                <p className="rounded-2xl border border-red-200 bg-red-50 p-6 text-center text-red-700">{getErrorMessage(error)}</p>
            ) : !data || data.length === 0 ? (
                <p className="rounded-2xl border border-dashed border-border bg-card p-10 text-center text-muted">לא נמצאו מוסדות</p>
            ) : (
                <ul className="grid grid-cols-1 items-start gap-4 md:grid-cols-2">
                    {data.map((i) => (
                        <li key={i.id} className={`rounded-2xl border bg-card p-5 shadow-sm transition hover:shadow-lg hover:shadow-primary/10 ${openId === i.id ? 'border-primary/40 shadow-lg shadow-primary/10' : 'border-border'}`}>
                            <div className="flex flex-wrap items-center justify-between gap-3">
                                <div className="flex items-center gap-3">
                                    <span className="grid size-11 shrink-0 place-items-center rounded-xl bg-primary-light text-primary"><Building2 className="size-5" /></span>
                                    <div>
                                        <p className="text-base font-semibold">{i.name}</p>
                                        <p className="flex items-center gap-1 text-sm text-muted"><MapPin className="size-3.5" />{i.city}</p>
                                    </div>
                                </div>
                                {openId === i.id ? (
                                    <button type="button" onClick={() => setOpenId(null)} className="inline-flex min-h-11 cursor-pointer items-center justify-center gap-2 rounded-xl border border-border bg-card px-4 text-sm font-semibold transition hover:border-primary hover:bg-primary-light hover:text-primary">
                                        <X className="size-4" />
                                        סגירה
                                    </button>
                                ) : (
                                    <button type="button" onClick={() => setOpenId(i.id)} className="inline-flex min-h-11 cursor-pointer items-center justify-center gap-2 rounded-xl bg-linear-to-l from-gradient-from via-gradient-via to-gradient-to px-4 text-sm font-semibold text-white shadow-md shadow-primary/25 transition hover:shadow-lg hover:brightness-110">
                                        <UserPlus className="size-4" />
                                        הוספת מנהל
                                    </button>
                                )}
                            </div>
                            {openId === i.id && (
                                <div className="mt-4 border-t border-border pt-4">
                                    <CreateAdminForm institutionId={i.id} />
                                </div>
                            )}
                        </li>
                    ))}
                </ul>
            )}
        </div>
    )
}
export default InstitutionLAndCreateAdmin
