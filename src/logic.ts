export interface LoveStats {
    formattedDate: string;
    leftBoxString: string;
    rightBoxString: string;
    years: number;
    months: number;
    days: number;
    totalMonths: number;
    totalWeeks: number;
    totalDays: number;
    totalHours: number;
    isValid: boolean;
}

export function calculateLoveStats(startDateStr: string): LoveStats {
    const start = new Date(startDateStr);
    const now = new Date();
    
    if (isNaN(start.getTime())) {
        return { 
            formattedDate: "", 
            leftBoxString: "\n  Please select\n  a date", 
            rightBoxString: "\n  -", 
            years: 0, months: 0, days: 0,
            totalMonths: 0, totalWeeks: 0, totalDays: 0, totalHours: 0,
            isValid: false 
        };
    }

    // Exakte Werte berechnen
    let years = now.getFullYear() - start.getFullYear();
    let months = now.getMonth() - start.getMonth();
    let days = now.getDate() - start.getDate();

    if (days < 0) {
        months -= 1;
        const prevMonth = new Date(now.getFullYear(), now.getMonth(), 0);
        days += prevMonth.getDate();
    }
    if (months < 0) {
        years -= 1;
        months += 12;
    }

    // Summen berechnen
    const diffMs = now.getTime() - start.getTime();
    const totalDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));
    const totalHours = Math.floor(diffMs / (1000 * 60 * 60));
    const totalWeeks = Math.floor(totalDays / 7);
    const totalMonths = (years * 12) + months;

    // Englisches Datumsformat
    const formattedDate = start.toLocaleDateString('en-US', { 
        day: 'numeric', month: 'short', year: 'numeric' 
    });

    const yStr = years === 1 ? 'Year' : 'Years';
    const mStr = months === 1 ? 'Month' : 'Months';
    const dStr = days === 1 ? 'Day' : 'Days';

    // String-Generierung für die Brille (mit Padding-Trick)
    const leftBoxString = `\n  Exact Time:\n\n  ${years} ${yStr}, ${months} ${mStr}\n  and ${days} ${dStr}`;
    const rightBoxString = `\n  Milestones:\n\n  ${totalMonths.toLocaleString('en-US')} Months\n  ${totalWeeks.toLocaleString('en-US')} Weeks\n  ${totalDays.toLocaleString('en-US')} Days`;

    return {
        formattedDate,
        leftBoxString,
        rightBoxString,
        years, months, days,
        totalMonths, totalWeeks, totalDays, totalHours,
        isValid: true
    };
}