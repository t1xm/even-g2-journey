export interface LoveStats {
    formattedDate: string;
    leftBoxString: string;
    rightBoxString: string;
    isValid: boolean;
}

export function calculateLoveStats(startDateStr: string): LoveStats {
    const start = new Date(startDateStr);
    const now = new Date();
    
    if (isNaN(start.getTime())) {
        return { 
            formattedDate: "", 
            leftBoxString: "\n  Bitte Datum\n  wählen", 
            rightBoxString: "\n  -", 
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
    const totalWeeks = Math.floor(totalDays / 7);
    const totalMonths = (years * 12) + months;

    // Datumsformat (z.B. 18. Sep 2023)
    const formattedDate = start.toLocaleDateString('de-DE', { 
        day: 'numeric', month: 'short', year: 'numeric' 
    });

    // Pluralisierung
    const yStr = years === 1 ? 'Jahr' : 'Jahre';
    const mStr = months === 1 ? 'Monat' : 'Monate';
    const dStr = days === 1 ? 'Tag' : 'Tage';

    // Formatierung mit Padding-Trick (\n für Abstand oben, Doppel-Leerzeichen für Abstand links)
    const leftBoxString = `\n  Genaue Zeit:\n\n  ${years} ${yStr}, ${months} ${mStr}\n  und ${days} ${dStr}`;
    const rightBoxString = `\n  Meilensteine:\n\n  ${totalMonths.toLocaleString('de-DE')} Monate\n  ${totalWeeks.toLocaleString('de-DE')} Wochen\n  ${totalDays.toLocaleString('de-DE')} Tage`;

    return {
        formattedDate,
        leftBoxString,
        rightBoxString,
        isValid: true
    };
}