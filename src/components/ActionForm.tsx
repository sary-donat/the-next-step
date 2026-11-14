import * as yup from "yup"
import { useForm } from "react-hook-form"
import { yupResolver } from "@hookform/resolvers/yup"
import { useMutation, useQueryClient } from "@tanstack/react-query"
import { actionService } from "../services/actionServices"
import { getErrorMessage } from "../api/apiClient"
const schema = yup.object({
    title: yup.string().trim().required('שדה חובה'),
    dueOn: yup.string().required('שדה חובה'),
})
type ActionFormData = yup.InferType<typeof schema>
interface ActionFormProps {
    applicationId?: number,
    action?: { id: number; title: string; dueOn: string },
    onDo?: () => void
}
const ActionForm = ({ applicationId, action, onDo }: ActionFormProps) => {

    const isEdit = !!action
    const queryClient = useQueryClient()

    const {
        register,
        handleSubmit,
        reset,
        formState: { errors }
    } = useForm<ActionFormData>({ resolver: yupResolver(schema) ,defaultValues: action ? { title: action.title, dueOn: action.dueOn } : { title: '', dueOn: '' },})
    const save = useMutation({
        mutationFn: (values: ActionFormData) => action ?
            actionService.updateAction(action.id, values) :
            actionService.createAction(applicationId!, values),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['applications'] });
            queryClient.invalidateQueries({ queryKey: ['dashboard'] });
            reset();
            onDo?.();
        },
    });

    return (


        <form onSubmit={handleSubmit((values) => save.mutate(values))} noValidate className="space-y-3 rounded-2xl border-2 border-dashed border-primary/30 bg-primary-light/50 p-4">
            <div className="grid grid-cols-1 gap-3">
                <div className="space-y-1">
                    <input placeholder="מה צריך לעשות" className="min-h-11 w-full rounded-xl border border-border bg-card px-3 text-sm transition outline-none placeholder:text-muted focus:border-primary focus:ring-4 focus:ring-primary/15" {...register('title')} />
                    {errors.title && <p className="text-xs font-medium text-red-600">{errors.title.message}</p>}
                </div>
                <div className="space-y-1">
                    <input type="date" className="min-h-11 w-full rounded-xl border border-border bg-card px-3 text-sm transition outline-none focus:border-primary focus:ring-4 focus:ring-primary/15" {...register('dueOn')} />
                    {errors.dueOn && <p className="text-xs font-medium text-red-600">{errors.dueOn.message}</p>}
                </div>
            </div>

            <div className="flex flex-wrap gap-2">
                <button type="submit" disabled={save.isPending} className="inline-flex min-h-11 cursor-pointer items-center justify-center rounded-xl bg-linear-to-l from-gradient-from via-gradient-via to-gradient-to px-6 text-sm font-semibold text-white shadow-md shadow-primary/25 transition hover:-translate-y-0.5 hover:shadow-lg hover:shadow-primary/35 disabled:cursor-not-allowed disabled:opacity-60">
                    {save.isPending ? 'שומר...' : isEdit ? 'שמירה' : 'הוספה'}
                </button>
                {isEdit && <button type="button" onClick={onDo} className="inline-flex min-h-11 cursor-pointer items-center justify-center rounded-xl border border-border bg-card px-6 text-sm font-semibold text-muted transition hover:border-red-200 hover:bg-red-50 hover:text-red-600">ביטול</button>}
            </div>

            {save.isError && <p className="rounded-xl bg-red-50 px-3 py-2 text-sm text-red-700">{getErrorMessage(save.error)}</p>}
        </form>
    )
}
export default  ActionForm
