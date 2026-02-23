export interface AppSettings {
    names: string;
    date: string;
}

const STORAGE_KEYS = {
    NAMES: 'together_names',
    DATE: 'together_date',
} as const;

export async function loadSettings(bridge: any): Promise<AppSettings> {
    let savedNames: string | null = await bridge.getLocalStorage(STORAGE_KEYS.NAMES);
    let savedDate: string | null = await bridge.getLocalStorage(STORAGE_KEYS.DATE);

    if (!savedNames) savedNames = window.localStorage.getItem(STORAGE_KEYS.NAMES);
    if (!savedDate) savedDate = window.localStorage.getItem(STORAGE_KEYS.DATE);

    return {
        names: savedNames || "Lilli & Tim",
        date: savedDate || "2023-09-18"
    };
}

export async function saveSettings(bridge: any, names: string, date: string): Promise<void> {
    await bridge.setLocalStorage(STORAGE_KEYS.NAMES, names);
    await bridge.setLocalStorage(STORAGE_KEYS.DATE, date);
    
    window.localStorage.setItem(STORAGE_KEYS.NAMES, names);
    window.localStorage.setItem(STORAGE_KEYS.DATE, date);
}
