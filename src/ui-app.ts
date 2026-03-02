// src/ui-app.ts

import { calculateJourneyStats } from './calc';
import { t, translations, getLocale } from './i18n';
import type { Journey } from './storage';

export class WebUI {
    private titleInput = document.getElementById('names-input') as HTMLInputElement;
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

    private journeyList = document.getElementById('journey-list') as HTMLDivElement;
    private addJourneyBtn = document.getElementById('add-journey-btn') as HTMLButtonElement;

    private onSelectJourney?: (id: string) => void;
    private onCreateJourney?: () => void;
    private onDeleteJourney?: (id: string) => void;

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

    public initInputs(title: string, date: string) {
        this.titleInput.value = title;
        this.dateInput.value = date;
    }

    public updateDashboard(title: string, dateStr: string) {
        if (this.uiNames) this.uiNames.textContent = title || t('setTitle');
        
        const stats = calculateJourneyStats(dateStr);

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

    public renderJourneys(journeys: Journey[], activeJourneyId: string | null) {
        if (!this.journeyList) return;

        this.journeyList.innerHTML = '';

        if (journeys.length === 0) {
            const emptyEl = document.createElement('p');
            emptyEl.className = 'text-body';
            emptyEl.textContent = t('emptyStateMarker');
            this.journeyList.appendChild(emptyEl);
            return;
        }

        journeys.forEach(journey => {
            const isActive = journey.id === activeJourneyId;
            const title = journey.title && journey.title.trim().length > 0
                ? journey.title
                : t('untitledJourney');

            const row = document.createElement('div');
            row.style.display = 'flex';
            row.style.alignItems = 'center';
            row.style.justifyContent = 'space-between';
            row.style.marginBottom = '12px';

            const left = document.createElement('button');
            left.type = 'button';
            left.style.display = 'flex';
            left.style.alignItems = 'center';
            left.style.gap = '12px';
            left.style.border = 'none';
            left.style.background = 'transparent';
            left.style.padding = '0';
            left.style.cursor = 'pointer';

            const boxIcon = document.createElement('img');
            boxIcon.src = isActive ? 'assets/ic-box-selected.svg' : 'assets/ic-box.svg';
            boxIcon.alt = isActive ? 'Selected' : 'Not selected';
            boxIcon.style.width = '20px';
            boxIcon.style.height = '20px';

            const textWrapper = document.createElement('div');
            textWrapper.style.display = 'flex';
            textWrapper.style.flexDirection = 'column';
            textWrapper.style.alignItems = 'flex-start';

            const titleEl = document.createElement('p');
            titleEl.className = 'text-body';
            titleEl.style.margin = '0';
            titleEl.textContent = title;

            textWrapper.appendChild(titleEl);

            left.appendChild(boxIcon);
            left.appendChild(textWrapper);

            left.addEventListener('click', () => {
                this.onSelectJourney?.(journey.id);
            });

            const deleteBtn = document.createElement('button');
            deleteBtn.type = 'button';
            deleteBtn.style.border = 'none';
            deleteBtn.style.background = 'transparent';
            deleteBtn.style.padding = '0';
            deleteBtn.style.cursor = 'pointer';

            const trashIcon = document.createElement('img');
            trashIcon.src = 'assets/ic-trash.svg';
            trashIcon.alt = t('deleteJourney');
            trashIcon.style.width = '20px';
            trashIcon.style.height = '20px';

            deleteBtn.appendChild(trashIcon);
            deleteBtn.addEventListener('click', (ev) => {
                ev.stopPropagation();
                this.onDeleteJourney?.(journey.id);
            });

            row.appendChild(left);
            row.appendChild(deleteBtn);

            this.journeyList.appendChild(row);
        });
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
            const names = this.titleInput.value.trim();
            const date = this.dateInput.value;
            callback(names, date);
        });
    }

    public onJourneySelect(callback: (id: string) => void) {
        this.onSelectJourney = callback;
    }

    public onJourneyCreate(callback: () => void) {
        this.onCreateJourney = callback;
        this.addJourneyBtn?.addEventListener('click', () => {
            this.onCreateJourney?.();
        });
    }

    public onJourneyDelete(callback: (id: string) => void) {
        this.onDeleteJourney = callback;
    }
}
