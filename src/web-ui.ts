import { calculateLoveStats } from './logic';

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

    public initInputs(names: string, date: string) {
        this.namesInput.value = names;
        this.dateInput.value = date;
    }

    public updateDashboard(names: string, dateStr: string) {
        if (this.uiNames) this.uiNames.textContent = names || "Lilli & Tim";
        
        const stats = calculateLoveStats(dateStr);

        if (!stats.isValid) {
            this.setEmptyDashboard();
            return;
        }

        if (this.uiDate) this.uiDate.textContent = stats.formattedDate;
        if (this.uiExact) this.uiExact.textContent = stats.exactString;
        if (this.uiMonths) this.uiMonths.textContent = `${stats.totalMonths.toLocaleString('en-US')} Months`;
        if (this.uiWeeks) this.uiWeeks.textContent = `${stats.totalWeeks.toLocaleString('en-US')} Weeks`;
        if (this.uiDays) this.uiDays.textContent = `${stats.totalDays.toLocaleString('en-US')} Days`;
        if (this.uiHours) this.uiHours.textContent = `${stats.totalHours.toLocaleString('en-US')} Hours`;
    }

    private setEmptyDashboard() {
        if (this.uiDate) this.uiDate.textContent = "Please select a date";
        if (this.uiExact) this.uiExact.textContent = "-";
        if (this.uiMonths) this.uiMonths.textContent = "-";
        if (this.uiWeeks) this.uiWeeks.textContent = "-";
        if (this.uiDays) this.uiDays.textContent = "-";
        if (this.uiHours) this.uiHours.textContent = "-";
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
