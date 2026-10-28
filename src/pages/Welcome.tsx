import { Link, Navigate } from "react-router";
import { useAuth } from "../context/auth"
import { BellRing, CalendarCheck, CheckCircle2, FileText, LayoutDashboard, ListChecks, LogIn, Sparkles, Target, UserPlus, Users } from "lucide-react";

const steps = [
    { icon: UserPlus, tone: 'bg-indigo-100 text-indigo-600', title: 'נרשמים', text: 'יוצרים חשבון, בוחרים מוסד ותחומי עבודה מבוקשים.' },
    { icon: FileText, tone: 'bg-cyan-100 text-cyan-600', title: 'מתעדים מועמדויות', text: 'כל משרה שהגשתם אליה נשמרת במקום אחד, עם סטטוס ופרטים.' },
    { icon: ListChecks, tone: 'bg-amber-100 text-amber-600', title: 'מגדירים צעד הבא', text: 'לכל מועמדות יש פעולה הבאה עם תאריך יעד, כדי ששום דבר לא יתפספס.' },
    { icon: CalendarCheck, tone: 'bg-violet-100 text-violet-600', title: 'מתקדמים לראיון', text: 'מתכוננים לראיונות ועוקבים אחרי ההתקדמות עד להצעה.' },
];

const features = [
    { icon: LayoutDashboard, tone: 'text-indigo-500', title: 'לוח בקרה יומי', text: 'מה באיחור, מה להיום ומה בקרוב — במבט אחד.' },
    { icon: Target, tone: 'text-rose-500', title: 'מעקב סטטוסים', text: 'משליחת המועמדות, דרך בדיקה וראיון, ועד הצעה.' },
    { icon: BellRing, tone: 'text-amber-500', title: 'תזכורות', text: 'התראות על פעולות פתוחות וראיונות שמתקרבים.' },
    { icon: Users, tone: 'text-emerald-500', title: 'ליווי של המוסד', text: 'מנהלי המוסד רואים את התמונה המלאה ויכולים לעזור בזמן.' },
];

const Welcome=()=>{
    const {user,isLaoding}=useAuth();
    if(isLaoding) return <p className="rounded-2xl border border-dashed border-border bg-card p-6 text-center text-muted">טוען...</p>
    if(user) return <Navigate to={"/home"}></Navigate>
return (
   <div className="space-y-12 sm:space-y-16 lg:space-y-20">
      <section className="relative overflow-hidden rounded-3xl bg-linear-to-l from-gradient-from via-gradient-via to-gradient-to px-6 py-12 text-center text-white shadow-xl shadow-primary/25 sm:px-10 sm:py-16 lg:py-24">
        <div className="pointer-events-none absolute -top-24 -left-24 size-72 rounded-full bg-white/10 blur-3xl" />
        <div className="pointer-events-none absolute -right-20 -bottom-28 size-80 rounded-full bg-accent/30 blur-3xl" />
        <div className="relative mx-auto max-w-3xl">
          <span className="mb-5 inline-flex items-center gap-2 rounded-full bg-white/15 px-4 py-1.5 text-sm font-medium ring-1 ring-white/25">
            <Sparkles className="size-4" />
            מערכת לניהול חיפוש עבודה
          </span>
          <h1 className="text-4xl font-extrabold tracking-tight sm:text-5xl lg:text-6xl">הצעד הבא</h1>
          <p className="mt-4 text-lg text-white/90 sm:text-xl">מה עשית היום כדי להתקדם?</p>
          <p className="mx-auto mt-4 max-w-2xl text-base leading-relaxed text-white/80 sm:text-lg">
            הצעד הבא עוזרת לתלמידים ולבוגרים לנהל את כל המועמדויות שלהם במקום אחד, לקבוע לכל משרה את הפעולה הבאה ולהגיע מוכנים לכל ראיון.
          </p>
          <div className="mt-8 flex flex-col justify-center gap-3 sm:flex-row">
            <Link to="/login" className="inline-flex min-h-12 items-center justify-center gap-2 rounded-xl bg-white px-8 text-base font-semibold text-primary shadow-md transition hover:-translate-y-0.5 hover:bg-primary-light"><LogIn className="size-5" />כניסה</Link>
            <Link to="/register" className="inline-flex min-h-12 items-center justify-center gap-2 rounded-xl bg-white/15 px-8 text-base font-semibold text-white ring-1 ring-white/40 transition hover:-translate-y-0.5 hover:bg-white/25"><UserPlus className="size-5" />הרשמה</Link>
          </div>
        </div>
      </section>

      <section>
        <div className="mx-auto mb-8 max-w-2xl text-center">
          <h2 className="text-2xl font-bold sm:text-3xl">איך זה עובד?</h2>
          <p className="mt-2 text-muted">ארבעה שלבים פשוטים מהגשה ועד הצעת עבודה</p>
        </div>
        <ol className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4 lg:gap-6">
          {steps.map((s, i) => (
            <li key={s.title} className="relative rounded-2xl border border-border bg-card p-6 shadow-lg shadow-text/5 transition duration-200 hover:-translate-y-1 hover:shadow-xl hover:shadow-primary/10">
              <span className="absolute top-5 left-5 text-4xl font-extrabold text-primary-light">{i + 1}</span>
              <span className={`mb-4 grid size-12 place-items-center rounded-2xl ${s.tone}`}>
                <s.icon className="size-6" />
              </span>
              <h3 className="text-lg font-semibold">{s.title}</h3>
              <p className="mt-1.5 text-sm leading-relaxed text-muted">{s.text}</p>
            </li>
          ))}
        </ol>
      </section>

      <section className="rounded-3xl border border-border bg-card p-6 shadow-lg shadow-text/5 sm:p-10">
        <div className="grid grid-cols-1 items-center gap-8 lg:grid-cols-5">
          <div className="lg:col-span-2">
            <h2 className="text-2xl font-bold sm:text-3xl">למה <span className="bg-linear-to-l from-gradient-from via-gradient-via to-gradient-to bg-clip-text text-transparent">הצעד הבא</span>?</h2>
            <p className="mt-3 leading-relaxed text-muted">
              חיפוש עבודה הוא תהליך עם הרבה חלקים נעים. המערכת מסדרת אותם בשבילכם, כך שתוכלו להתמקד במה שחשוב באמת.
            </p>
            <ul className="mt-5 space-y-2 text-sm">
              {['כל המועמדויות במקום אחד', 'אף פעולה לא נשכחת', 'מוכנים לכל ראיון'].map((t) => (
                <li key={t} className="flex items-center gap-2"><CheckCircle2 className="size-5 text-accent" />{t}</li>
              ))}
            </ul>
          </div>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:col-span-3">
            {features.map((f) => (
              <div key={f.title} className="rounded-2xl border border-border p-5 transition duration-200 hover:-translate-y-1 hover:border-primary/30 hover:shadow-lg hover:shadow-primary/10">
                <f.icon className={`mb-3 size-6 ${f.tone}`} />
                <h3 className="font-semibold">{f.title}</h3>
                <p className="mt-1 text-sm text-muted">{f.text}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
)

}
export default Welcome
