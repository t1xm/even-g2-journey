// src/sorage.ts

export interface Journey {
    id: string;
    title: string;
    date: string;
}

export interface JourneySettings {
    journeys: Journey[];
    activeJourneyId: string | null;
}

const STORAGE_KEYS = {
    LEGACY_NAMES: 'together_names',
    LEGACY_DATE: 'together_date',
    JOURNEYS: 'journey_data',
} as const;

function parseJourneySettings(raw: string | null): JourneySettings | null {
    if (!raw) return null;
    try {
        const parsed = JSON.parse(raw) as JourneySettings;
        if (!Array.isArray(parsed.journeys)) return null;
        return {
            journeys: parsed.journeys.map(j => ({
                id: j.id,
                title: j.title ?? '',
                date: j.date ?? '',
            })).filter(j => !!j.id),
            activeJourneyId: parsed.activeJourneyId ?? null,
        };
    } catch {
        return null;
    }
}

function createDefaultSettings(): JourneySettings {
    return {
        journeys: [],
        activeJourneyId: null,
    };
}

export async function loadSettings(bridge: any): Promise<JourneySettings> {
    // 1) Try new Journey format from bridge storage
    const storedJourneys = await bridge.getLocalStorage(STORAGE_KEYS.JOURNEYS);
    let settings = parseJourneySettings(storedJourneys);

    // 2) Fallback: localStorage (browser)
    if (!settings) {
        const localJourneys = window.localStorage.getItem(STORAGE_KEYS.JOURNEYS);
        settings = parseJourneySettings(localJourneys);
    }

    // 3) Legacy migration from Together single entry
    if (!settings) {
        let legacyNames: string | null = await bridge.getLocalStorage(STORAGE_KEYS.LEGACY_NAMES);
        let legacyDate: string | null = await bridge.getLocalStorage(STORAGE_KEYS.LEGACY_DATE);

        if (!legacyNames) legacyNames = window.localStorage.getItem(STORAGE_KEYS.LEGACY_NAMES);
        if (!legacyDate) legacyDate = window.localStorage.getItem(STORAGE_KEYS.LEGACY_DATE);

        const hasLegacy = !!(legacyNames || legacyDate);
        if (hasLegacy) {
            const id = `j-${Date.now().toString(36)}`;
            const title = legacyNames && legacyNames.trim().length > 0 ? legacyNames : 'Together';
            settings = {
                journeys: [{
                    id,
                    title,
                    date: legacyDate || '',
                }],
                activeJourneyId: id,
            };
        }
    }

    if (!settings) {
        settings = createDefaultSettings();
    }

    // Ensure activeJourneyId is valid
    if (settings.journeys.length > 0) {
        const exists = settings.journeys.some(j => j.id === settings!.activeJourneyId);
        if (!exists) {
            settings.activeJourneyId = settings.journeys[0].id;
        }
    } else {
        settings.activeJourneyId = null;
    }

    // Persist migrated data in new format
    await saveSettings(bridge, settings);

    return settings;
}

export async function saveSettings(bridge: any, settings: JourneySettings): Promise<void> {
    const payload: JourneySettings = {
        journeys: settings.journeys,
        activeJourneyId: settings.activeJourneyId,
    };

    const json = JSON.stringify(payload);

    await bridge.setLocalStorage(STORAGE_KEYS.JOURNEYS, json);
    window.localStorage.setItem(STORAGE_KEYS.JOURNEYS, json);
}
