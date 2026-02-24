// src/ui-app.ts

import { calculateLoveStats } from './calc';
import { t, translations, getLocale } from './i18n';

export class WebUI {
    private namesInput = document.getElementById('names-input') as HTMLInputElement;
    private dateInput = document.getElementById('date-input') as HTMLInputElement;
    private saveBtn = document.getElementById('save-btn') as HTMLButtonElement;
    private statusEl = document.getElementById('status') as HTMLDivElement;

    private uiNames = document.getElementById('ui-names') as HTMLHeadingElement;
    private uiDate = document.getElementById('ui-date') as HTMLParagraphElement;
    private uiExact = document.getElementById('ui-exact') as HTMLParagraphElement;
    private uiMonths = document.getElementById('ui-months') as HTMLParagraphElement;
    private uiWeeks = document.getElementById('ui-weeks') as HTMLParagraphElement;
    private uiDays = document.getElementById('ui-days') as HTMLParagraphElement;
    private uiHours = document.getElementById('ui-hours') as HTMLParagraphElement;

    constructor() {
        this.applyTranslations();
    }

    private applyTranslations() {
        document.querySelectorAll('[data-i18n]').forEach(el => {
            const key = el.getAttribute('data-i18n') as keyof typeof translations['en'];
            if (key) el.textContent = t(key);
        });

        document.querySelectorAll('[data-i18n-placeholder]').forEach(el => {
            const key = el.getAttribute('data-i18n-placeholder') as keyof typeof translations['en'];
            if (key) (el as HTMLInputElement).placeholder = t(key);
        });
    }

    public initInputs(names: string, date: string) {
        this.namesInput.value = names;
        this.dateInput.value = date;
    }

    public updateDashboard(names: string, dateStr: string) {
        if (this.uiNames) this.uiNames.textContent = names || t('setNames');
        
        const stats = calculateLoveStats(dateStr);

        if (!stats.isValid || !dateStr) {
            this.setEmptyDashboard();
            return;
        }

        const locale = getLocale();

        const mStr = stats.totalMonths === 1 ? t('month') : t('months');
        const wStr = stats.totalWeeks === 1 ? t('week') : t('weeks');
        const dStr = stats.totalDays === 1 ? t('day') : t('days');
        const hStr = stats.totalHours === 1 ? t('hour') : t('hours');

        if (this.uiDate) this.uiDate.textContent = stats.formattedDate;
        if (this.uiExact) this.uiExact.textContent = stats.exactString;
        if (this.uiMonths) this.uiMonths.textContent = `${stats.totalMonths.toLocaleString(locale)} ${mStr}`;
        if (this.uiWeeks) this.uiWeeks.textContent = `${stats.totalWeeks.toLocaleString(locale)} ${wStr}`;
        if (this.uiDays) this.uiDays.textContent = `${stats.totalDays.toLocaleString(locale)} ${dStr}`;
        if (this.uiHours) this.uiHours.textContent = `${stats.totalHours.toLocaleString(locale)} ${hStr}`;
    }

    private setEmptyDashboard() {
        const emptyMarker = t('emptyStateMarker');
        if (this.uiDate) this.uiDate.textContent = t('pleaseSelectDate');
        if (this.uiExact) this.uiExact.textContent = emptyMarker;
        if (this.uiMonths) this.uiMonths.textContent = `${emptyMarker} ${t('months')}`;
        if (this.uiWeeks) this.uiWeeks.textContent = `${emptyMarker} ${t('weeks')}`;
        if (this.uiDays) this.uiDays.textContent = `${emptyMarker} ${t('days')}`;
        if (this.uiHours) this.uiHours.textContent = `${emptyMarker} ${t('hours')}`;
    }

    public showStatus(message: string, duration: number = 3000): void {
        if (!this.statusEl) return;
        this.statusEl.textContent = message;
        this.statusEl.classList.add('visible');
        setTimeout(() => this.statusEl.classList.remove('visible'), duration);
    }

    public onSave(callback: (names: string, date: string) => void) {
        this.saveBtn?.addEventListener('click', () => {
            const names = this.namesInput.value.trim();
            const date = this.dateInput.value;
            callback(names, date);
        });
    }
}
