// src/calc.ts

import { t, getLocale } from './i18n';

export interface JourneyStats {
    formattedDate: string;
    exactString: string;
    years: number;
    months: number;
    days: number;
    totalMonths: number;
    totalWeeks: number;
    totalDays: number;
    totalHours: number;
    isValid: boolean;
}

export function calculateJourneyStats(startDateStr: string): JourneyStats {
    const start = new Date(startDateStr);
    const now = new Date();
    
    if (isNaN(start.getTime())) {
        return { 
            formattedDate: t('pleaseSelectDate'), 
            exactString: t('emptyStateMarker'), 
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

    const formattedDate = start.toLocaleDateString(getLocale(), { 
        day: 'numeric', month: 'long', year: 'numeric' 
    });

    const yStr = years === 1 ? t('year') : t('years');
    const mStr = months === 1 ? t('month') : t('months');
    const dStr = days === 1 ? t('day') : t('days');
    const exactString = `${years} ${yStr}, ${months} ${mStr} ${t('and')} ${days} ${dStr}`;
    
    return {
        formattedDate,
        exactString,
        years, months, days,
        totalMonths, totalWeeks, totalDays, totalHours,
        isValid: true
    };
}
