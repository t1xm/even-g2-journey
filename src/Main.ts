// src/main.ts

import { waitForEvenAppBridge } from '@evenrealities/even_hub_sdk';
import { loadSettings, saveSettings, type Journey, type JourneySettings } from './storage';
import { startGlassesUI, rebuildGlassesUI } from './ui-hud';
import { WebUI } from './ui-app';
import { t } from './i18n';

async function initApp() {
    // 1. Initialize dependencies
    const bridge = await waitForEvenAppBridge();
    const ui = new WebUI(); // wendet intern direkt die Translations an

    let settings: JourneySettings = await loadSettings(bridge);
    let journeys: Journey[] = settings.journeys;
    let activeJourneyId: string | null = settings.activeJourneyId;

    const getActiveJourney = (): Journey | null => {
        if (!activeJourneyId) return null;
        return journeys.find(j => j.id === activeJourneyId) ?? null;
    };

    const ensureActiveJourney = () => {
        if (journeys.length === 0) {
            activeJourneyId = null;
            return;
        }
        if (!activeJourneyId || !journeys.some(j => j.id === activeJourneyId)) {
            activeJourneyId = journeys[0].id;
        }
    };

    const applyToWebUI = () => {
        ensureActiveJourney();
        const active = getActiveJourney();
        ui.initInputs(active?.title ?? '', active?.date ?? '');
        ui.updateDashboard(active?.title ?? '', active?.date ?? '');
        ui.renderJourneys(journeys, activeJourneyId);
    };

    const syncSettings = async (updateHud: boolean) => {
        settings = {
            journeys,
            activeJourneyId,
        };
        await saveSettings(bridge, settings);
        applyToWebUI();

        if (updateHud) {
            const active = getActiveJourney();
            await rebuildGlassesUI(bridge, active?.title ?? '', active?.date ?? '');
        }
    };

    // 2. Initial UI state
    applyToWebUI();

    // 3. Render initial state to G2 Glasses
    {
        const active = getActiveJourney();
        await startGlassesUI(bridge, active?.title ?? '', active?.date ?? '');
    }

    // 4. Handle user interactions (web app)
    ui.onSave(async (title, date) => {
        if (!title || !date) {
            ui.showStatus(t('fillBothFields'));
            return;
        }

        // Create journey if none exists yet
        if (!activeJourneyId) {
            const id = `j-${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 8)}`;
            const newJourney: Journey = { id, title, date };
            journeys = [newJourney];
            activeJourneyId = id;
        } else {
            journeys = journeys.map(j => j.id === activeJourneyId ? { ...j, title, date } : j);
        }

        await syncSettings(true);
        ui.showStatus(t('savedAndSent'));
    });

    ui.onJourneySelect(async (id) => {
        if (!journeys.some(j => j.id === id)) return;
        activeJourneyId = id;
        await syncSettings(true);
    });

    ui.onJourneyCreate(async () => {
        const id = `j-${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 8)}`;
        const newJourney: Journey = { id, title: '', date: '' };
        journeys = [...journeys, newJourney];
        activeJourneyId = id;
        await syncSettings(false);
    });

    ui.onJourneyDelete(async (id) => {
        if (!journeys.some(j => j.id === id)) return;
        journeys = journeys.filter(j => j.id !== id);
        if (activeJourneyId === id) {
            activeJourneyId = journeys[0]?.id ?? null;
        }
        await syncSettings(true);
    });

    // 5. Handle glasses input events to rotate zwischen Journeys
    bridge.onEvenHubEvent(async (event: any) => {
        if (!event || !event.textEvent) return;
        if (journeys.length <= 1) return;

        const type = event.textEvent.eventType as number | undefined;

        let delta = 0;
        // CLICK_EVENT is sometimes reported as undefined (SDK quirk)
        if (type === undefined || type === 0) {
            delta = 1;
        } else if (type === 1) { // SCROLL_TOP_EVENT
            delta = -1;
        } else if (type === 2) { // SCROLL_BOTTOM_EVENT
            delta = 1;
        } else if (type === 3) { // DOUBLE_CLICK_EVENT
            delta = 1;
        }

        if (delta === 0) return;

        ensureActiveJourney();
        if (!activeJourneyId) return;

        const currentIndex = journeys.findIndex(j => j.id === activeJourneyId);
        if (currentIndex === -1) return;

        const nextIndex = (currentIndex + delta + journeys.length) % journeys.length;
        activeJourneyId = journeys[nextIndex].id;

        await syncSettings(true);
    });
}

initApp().catch(console.error);
