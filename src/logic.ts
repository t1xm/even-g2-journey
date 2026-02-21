export function calculateLoveTime(startDateStr: string, unit: 'days' | 'months' | 'minutes'): string {
    const start = new Date(startDateStr).getTime();
    const now = new Date().getTime();
    const diff = now - start;

    if (isNaN(start)) return "Datum wählen";

    switch (unit) {
        case 'days':
            const days = Math.floor(diff / (1000 * 60 * 60 * 24));
            return `${days.toLocaleString()} Tage`;
        case 'months':
            const months = Math.floor(diff / (1000 * 60 * 60 * 24 * 30.4375));
            return `${months.toLocaleString()} Monate`;
        case 'minutes':
            const minutes = Math.floor(diff / (1000 * 60));
            return `${minutes.toLocaleString()} Minuten`;
        default:
            return "";
    }
}
