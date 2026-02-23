import { waitForEvenAppBridge } from '@evenrealities/even_hub_sdk';
import { loadSettings, saveSettings } from './storage';
import { startGlassesUI, rebuildGlassesUI } from './glasses-ui';
import { WebUI } from './web-ui';

async function initApp() {
    // 1. Initialize dependencies
    const bridge = await waitForEvenAppBridge();
    const ui = new WebUI();

    // 2. Load settings and populate UI
    const settings = await loadSettings(bridge);
    ui.initInputs(settings.names, settings.date);
    ui.updateDashboard(settings.names, settings.date);

    // 3. Render initial state to G2 Glasses
    await startGlassesUI(bridge, settings.names, settings.date);

    // 4. Handle user interactions
    ui.onSave(async (names, date) => {
        if (!names || !date) {
            ui.showStatus('Please fill in both fields');
            return;
        }

        // Save data
        await saveSettings(bridge, names, date);
        
        // Update both screens
        ui.updateDashboard(names, date);
        await rebuildGlassesUI(bridge, names, date);
        
        ui.showStatus('Saved & sent to G2');
    });
}

initApp().catch(console.error);
