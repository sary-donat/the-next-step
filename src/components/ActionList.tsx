import { Link } from 'react-router';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { Building2, CalendarClock, CheckCircle2, Pencil, User } from 'lucide-react';
import { useAuth } from '../context/auth';
import { actionService } from '../services/actionServices';
import type { ActionStatus, DashboardAction } from '../types/types';
import { useState } from 'react';
import ActionForm from './ActionForm';


interface ActionItem {
  id: number;
  title: string;
  dueOn: string;
  status?: ActionStatus;
  application?: DashboardAction['application']; 
}

interface ActionsListProps {
  actions: ActionItem[];
  emptyMessage: string;
}

const ActionsList = ({ actions, emptyMessage }: ActionsListProps) => {
  const queryClient = useQueryClient();
  const { user } = useAuth();
  const isAdmin = user?.role !== 'STUDENT';

  const markDone = useMutation({
    mutationFn: (actionId: number) => actionService.updateAction(actionId, { status: 'DONE' }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['dashboard'] });
      queryClient.invalidateQueries({ queryKey: ['applications'] });
    },
  });
  const [editingId, setEditingId] = useState<number | null>(null);
  if (actions.length === 0) {
    return (
      <p className="flex flex-col items-center gap-2 rounded-2xl bg-bg px-4 py-8 text-center text-sm text-muted">
        <CheckCircle2 className="size-8 text-emerald-400" />
        {emptyMessage}
      </p>
    );
  }


  return (
    <ul className="space-y-3">
      {actions.map((act) => {
        const isDone = act.status === 'DONE';
        return (
          <li
            key={act.id}
            className="group relative flex overflow-hidden rounded-2xl border border-border bg-card shadow-sm transition duration-300 hover:-translate-y-1 hover:-rotate-[0.4deg] hover:border-primary/30 hover:shadow-xl hover:shadow-primary/15"
          >
            <div className={`flex w-20 shrink-0 flex-col items-center justify-center gap-1 bg-linear-to-b from-gradient-from via-gradient-via to-gradient-to px-2 py-4 text-center text-white transition duration-300 group-hover:w-24 sm:w-24 sm:group-hover:w-28 ${isDone ? 'opacity-50 grayscale' : ''}`}>
              <CalendarClock className="size-6 drop-shadow transition duration-300 group-hover:scale-110 group-hover:rotate-12" />
              <span className="text-[11px] leading-tight font-bold tracking-wide break-all [text-shadow:0_1px_2px_rgb(0_0_0/0.25)]">
                {' · עד '}
                {act.dueOn}
              </span>
            </div>

            <span className="relative w-0 shrink-0 border-s-2 border-dashed border-border before:absolute before:-top-2.5 before:-start-2.5 before:size-5 before:rounded-full before:border before:border-border before:bg-bg after:absolute after:-bottom-2.5 after:-start-2.5 after:size-5 after:rounded-full after:border after:border-border after:bg-bg" />

            <div className="flex min-w-0 flex-1 flex-col gap-3 p-4 bg-[radial-gradient(circle_at_top_left,var(--color-primary-light),transparent_60%)]">
              <div className="flex flex-wrap items-start gap-2 [&>form]:basis-full">
              <strong className={`min-w-0 flex-1 text-base leading-snug font-semibold break-words ${isDone ? 'text-muted line-through decoration-2 decoration-emerald-500' : ''}`}>
                {act.title}
              </strong>
            {
                editingId===act.id?<ActionForm action={act} onDo={()=>setEditingId(null)}></ActionForm>:
                <>
                <button onClick={()=>{setEditingId(act.id)}} className="inline-flex shrink-0 cursor-pointer items-center gap-1 rounded-lg border border-amber-200 bg-amber-50 px-2.5 py-1 text-xs font-semibold text-amber-700 transition hover:-translate-y-0.5 hover:border-amber-400 hover:bg-amber-100 hover:shadow-sm"><Pencil className="size-3.5" />עריכה</button>
                </>

            }
              </div>

              <div className="flex flex-wrap items-center gap-2 text-xs">

                {act.application && (
                  <Link
                    to={`/applications/${act.application.id}`}
                    className="inline-flex max-w-full items-center gap-1.5 rounded-full bg-primary-light px-3 py-1.5 font-medium break-words text-primary ring-1 ring-primary/10 transition hover:bg-primary hover:text-white"
                  >
                    <Building2 className="size-3.5 shrink-0" />
                    <span className="min-w-0">{act.application.companyName} · {act.application.jobTitle}</span>
                  </Link>
                )}

                {isAdmin && act.application && (
                  <span className="inline-flex items-center gap-1 rounded-full bg-sky-50 px-3 py-1.5 font-medium text-sky-700 ring-1 ring-sky-100">
                    <User className="size-3.5" /> · {act.application.user.fullName}
                  </span>
                )}
              </div>

              {!isDone && (
                <button
                  type="button"
                  disabled={markDone.isPending}
                  onClick={() => markDone.mutate(act.id)}
                  className="inline-flex min-h-10 w-full cursor-pointer items-center justify-center gap-2 self-end rounded-full border-2 border-emerald-200 bg-card px-5 text-sm font-bold text-emerald-700 transition duration-200 hover:scale-105 hover:border-emerald-500 hover:bg-emerald-500 hover:text-white hover:shadow-lg hover:shadow-emerald-500/30 active:scale-95 disabled:cursor-not-allowed disabled:opacity-60 sm:w-fit"
                >
                  ✓ בוצע
                </button>
              )}
            </div>
          </li>
        );
      })}
    </ul>
  );
};

export default ActionsList;