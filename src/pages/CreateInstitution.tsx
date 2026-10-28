import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { institutionService } from '../services/institutionService';
import { getErrorMessage } from '../api/apiClient';
const schema = yup.object({
    name: yup.string().trim().required('שדה חובה').min(2, 'לפחות 2 תווים').max(100, 'עד 100 תווים'),
    city: yup.string().trim().max(80, 'עד 80 תווים').default(''),
    contactEmail: yup.string().trim().email('כתובת דוא״ל לא תקינה').default(''),
});

type InstitutionFormData = yup.InferType<typeof schema>;
const CreateInstitution = () => {
    const queryClient = useQueryClient();
    const { register, handleSubmit, reset, formState: { errors } } = useForm<InstitutionFormData>({
        resolver: yupResolver(schema),
        defaultValues: { name: '', city: '', contactEmail: '' },
    });
    const create = useMutation({
        mutationFn: (values: InstitutionFormData) => institutionService.createInstitution(values),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['institutions'] });
            reset();
        },
    });
    const onSubmit = (values: InstitutionFormData) => {
        create.mutate(values);
    };
    return (
        <form onSubmit={handleSubmit(onSubmit)} noValidate className="mx-auto max-w-lg space-y-4 rounded-2xl border border-border bg-card p-6 shadow-sm">
            <input placeholder="שם המוסד" {...register('name')} className="min-h-11 w-full rounded-xl border border-border bg-card px-4 text-base transition placeholder:text-muted/70 focus:border-primary focus:ring-4 focus:ring-primary/15 focus:outline-none sm:text-sm" />
            {errors.name && <p className="-mt-2 text-sm text-red-600">{errors.name.message}</p>}

            <input placeholder="עיר" {...register('city')} className="min-h-11 w-full rounded-xl border border-border bg-card px-4 text-base transition placeholder:text-muted/70 focus:border-primary focus:ring-4 focus:ring-primary/15 focus:outline-none sm:text-sm" />
            {errors.city && <p className="-mt-2 text-sm text-red-600">{errors.city.message}</p>}

            <input type="email" dir="ltr" placeholder="דוא״ל ליצירת קשר" {...register('contactEmail')} className="min-h-11 w-full rounded-xl border border-border bg-card px-4 text-base transition placeholder:text-right placeholder:text-muted/70 focus:border-primary focus:ring-4 focus:ring-primary/15 focus:outline-none sm:text-sm" />
            {errors.contactEmail && <p className="-mt-2 text-sm text-red-600">{errors.contactEmail.message}</p>}

            <button type="submit" disabled={create.isPending} className="inline-flex min-h-11 w-full cursor-pointer items-center justify-center gap-2 rounded-xl bg-linear-to-l from-gradient-from via-gradient-via to-gradient-to px-6 text-sm font-semibold text-white shadow-md shadow-primary/25 transition hover:shadow-lg hover:brightness-110 disabled:cursor-not-allowed disabled:opacity-60">
                {create.isPending ? 'מוסיף...' : 'הוספת מוסד'}
            </button>

            {create.isError && <p className="rounded-xl border border-red-200 bg-red-50 p-3 text-center text-sm text-red-700">{getErrorMessage(create.error)}</p>}
            {create.isSuccess && <p className="rounded-xl border border-emerald-200 bg-emerald-50 p-3 text-center text-sm font-medium text-emerald-800">המוסד נוסף ✓</p>}
        </form>
    );
}
export default CreateInstitution
