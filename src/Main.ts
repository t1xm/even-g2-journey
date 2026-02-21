import { 
  waitForEvenAppBridge, 
  CreateStartUpPageContainer, 
  TextContainerProperty, 
  TextContainerUpgrade,
  OsEventTypeList 
} from '@evenrealities/even_hub_sdk';
import { calculateLoveTime } from './logic';

async function initApp() {
    const bridge = await waitForEvenAppBridge();

    const namesInput = document.getElementById('names-input') as HTMLInputElement;
    const dateInput = document.getElementById('date-input') as HTMLInputElement;
    const saveBtn = document.getElementById('save-btn');
    const statusDiv = document.getElementById('status');

    const initialNames = await bridge.getLocalStorage("together_names") || "Tim & Sarah";
    const initialDate = await bridge.getLocalStorage("together_date") || "2022-05-12";
    
    if (namesInput) namesInput.value = initialNames;
    if (dateInput) dateInput.value = initialDate;

    saveBtn?.addEventListener('click', async () => {
        await bridge.setLocalStorage("together_names", namesInput.value);
        await bridge.setLocalStorage("together_date", dateInput.value);
        if (statusDiv) statusDiv.innerText = "Gespeichert! Bitte App auf Brille neu starten.";
        
        startGlassesUI(bridge, namesInput.value, dateInput.value);
    });

    startGlassesUI(bridge, initialNames, initialDate);
}

async function startGlassesUI(bridge: any, names: string, date: string) {
    let currentUnit: 'days' | 'months' | 'minutes' = 'days';

    // Container 1: Header (Namen)
    const header = new TextContainerProperty({
        containerID: 1,
        containerName: "header",
        xPosition: 0, yPosition: 30, width: 576, height: 40,
        content: names,
        borderColor: 0,
    });

    const counter = new TextContainerProperty({
        containerID: 2,
        containerName: "counter",
        xPosition: 40, yPosition: 90, width: 496, height: 100,
        content: calculateLoveTime(date, currentUnit),
        borderColor: 15,
        borderWidth: 2,
        borderRdaius: 10,
        isEventCapture: 1 
    });

    const footer = new TextContainerProperty({
        containerID: 3,
        containerName: "footer",
        xPosition: 0, yPosition: 220, width: 576, height: 40,
        content: `Seit ${date}`,
        borderColor: 0,
    });

    const page = new CreateStartUpPageContainer({
        containerTotalNum: 3,
        textObject: [header, counter, footer]
    });

    await bridge.createStartUpPageContainer(page);

    bridge.onEvenHubEvent((event: any) => {
        if (event.textEvent && (event.textEvent.eventType === OsEventTypeList.CLICK_EVENT || event.textEvent.eventType === undefined)) {
            
            if (currentUnit === 'days') currentUnit = 'months';
            else if (currentUnit === 'months') currentUnit = 'minutes';
            else currentUnit = 'days';

            const upgrade = new TextContainerUpgrade({
                containerID: 2,
                containerName: "counter",
                content: calculateLoveTime(date, currentUnit)
            });
            bridge.textContainerUpgrade(upgrade);
        }
    });
}

initApp().catch(console.error);
