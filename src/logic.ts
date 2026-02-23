export interface LoveStats {
    formattedDate: string;
    exactString: string;
    milestonesString: string;
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
            formattedDate: "Please select a date", 
            exactString: "-", 
            milestonesString: "-", 
            years: 0, months: 0, days: 0,
            totalMonths: 0, totalWeeks: 0, totalDays: 0, totalHours: 0,
            isValid: false 
        };
    }

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

    const diffMs = now.getTime() - start.getTime();
    const totalDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));
    const totalHours = Math.floor(diffMs / (1000 * 60 * 60));
    const totalWeeks = Math.floor(totalDays / 7);
    const totalMonths = (years * 12) + months;

    const formattedDate = start.toLocaleDateString('en-US', { 
        day: 'numeric', month: 'short', year: 'numeric' 
    });

    const yStr = years === 1 ? 'Year' : 'Years';
    const mStr = months === 1 ? 'Month' : 'Months';
    const dStr = days === 1 ? 'Day' : 'Days';
    const exactString = `${years} ${yStr}, ${months} ${mStr} and ${days} ${dStr}`;
    
    const milestonesString = `${totalMonths.toLocaleString('en-US')} Mo  •  ${totalWeeks.toLocaleString('en-US')} Wk  •  ${totalDays.toLocaleString('en-US')} Dy`;

    return {
        formattedDate,
        exactString,
        milestonesString,
        years, months, days,
        totalMonths, totalWeeks, totalDays, totalHours,
        isValid: true
    };
}
