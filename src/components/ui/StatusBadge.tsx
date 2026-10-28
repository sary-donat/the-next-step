// Display-only: picks badge colors from the status name.
const tones: { match: string[]; className: string }[] = [
    { match: ['נשלח', 'הוגש'], className: 'bg-gray-100 text-gray-700' },
    { match: ['בבדיקה', 'בדיקה', 'בתהליך'], className: 'bg-amber-100 text-amber-800' },
    { match: ['ראיון'], className: 'bg-violet-100 text-violet-800' },
    { match: ['הצעה', 'התקבל'], className: 'bg-emerald-100 text-emerald-800' },
    { match: ['נדחה', 'דחייה', 'נדחתה'], className: 'bg-red-100 text-red-700' },
];

const StatusBadge = ({ name }: { name?: string }) => {
    if (!name) return null;
    const tone = tones.find((t) => t.match.some((m) => name?.includes(m)))?.className ?? 'bg-primary-light text-primary';
    return <span className={`inline-flex items-center rounded-full px-2.5 py-1 text-xs font-medium whitespace-nowrap ${tone}`}>{name}</span>;
};
export default StatusBadge;
