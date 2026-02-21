import { 
  waitForEvenAppBridge, 
  CreateStartUpPageContainer, 
  TextContainerProperty
} from '@evenrealities/even_hub_sdk';
import { calculateLoveStats } from './logic';

// --- HTML Elemente laden ---
const namesInput = document.getElementById('names-input') as HTMLInputElement;
const dateInput = document.getElementById('date-input') as HTMLInputElement;
const saveBtn = document.getElementById('save-btn') as HTMLButtonElement;
const statusEl = document.getElementById('status') as HTMLDivElement;

// --- Helper: Status Animation ---
function showStatus(message: string, duration: number = 3000): void {
  if (!statusEl) return;
  statusEl.textContent = message;
  statusEl.classList.add('visible');
  setTimeout(() => {
    statusEl.classList.remove('visible');
  }, duration);
}

// --- App Start ---
async function initApp() {
  const bridge = await waitForEvenAppBridge();

  const savedNames = await bridge.getLocalStorage('together_names');
  const savedDate = await bridge.getLocalStorage('together_date');

  if (savedNames) namesInput.value = savedNames;
  if (savedDate) dateInput.value = savedDate;

  const displayNames = savedNames || "Tim & Lilli";
  const displayDate = savedDate || "2023-09-18";

  await startGlassesUI(bridge, displayNames, displayDate);

  saveBtn?.addEventListener('click', async () => {
    const names = namesInput.value.trim();
    const date = dateInput.value;

    if (!names || !date) {
      showStatus('Bitte beide Felder ausfüllen');
      return;
    }

    await bridge.setLocalStorage('together_names', names);
    await bridge.setLocalStorage('together_date', date);

    showStatus('Gespeichert & an G2 gesendet');
    await startGlassesUI(bridge, names, date);
  });
}

// --- Brillen Logik (Das 2-Box-Dashboard) ---
async function startGlassesUI(bridge: any, names: string, date: string) {
  const stats = calculateLoveStats(date);
  if (!stats.isValid) return;

  // --- Design Guidelines Even OS 2.0 ---
  // Canvas Gesamtbreite: 576px
  const margin = 20; // Äußerer Rand links/rechts (Card margin & spacing)
  const gap = 16; // Abstand zwischen den Boxen
  const boxRadius = 6; // Corner Radius: 6px
  const boxBorder = 15; // Even-Grün
  const boxBorderWidth = 2;

  // Berechnung der Box-Breiten
  const boxWidth = (576 - (margin * 2) - gap) / 2; // (576 - 40 - 16) / 2 = 260px pro Box
  const xLeft = margin; // 20
  const xRight = margin + boxWidth + gap; // 296
  
  const headerY = 16;
  const boxesY = 60;
  const boxesHeight = 180;

  // 1. Header Container
  const header = new TextContainerProperty({
    containerID: 1, 
    containerName: "header",
    xPosition: margin, 
    yPosition: headerY, 
    width: 536, 
    height: 30,
    content: `${names}  •  Seit: ${stats.formattedDate}`,
    borderColor: 0,
  });

  // 2. Linke Box (Genaue Zeit)
  const boxLeft = new TextContainerProperty({
    containerID: 2, 
    containerName: "boxLeft",
    xPosition: xLeft, 
    yPosition: boxesY, 
    width: boxWidth, 
    height: boxesHeight,
    content: stats.leftBoxString, // Hier ist das simulierte Padding drin
    borderColor: boxBorder, 
    borderWidth: boxBorderWidth, 
    borderRdaius: boxRadius, // Bewusster Typo aus dem SDK
    isEventCapture: 1 // Verhindert Simulator-Warnungen bei Klicks
  });

  // 3. Rechte Box (Meilensteine)
  const boxRight = new TextContainerProperty({
    containerID: 3, 
    containerName: "boxRight",
    xPosition: xRight, 
    yPosition: boxesY, 
    width: boxWidth, 
    height: boxesHeight,
    content: stats.rightBoxString, // Hier ist das simulierte Padding drin
    borderColor: boxBorder, 
    borderWidth: boxBorderWidth, 
    borderRdaius: boxRadius,
  });

  // Seite generieren und senden
  const page = new CreateStartUpPageContainer({
    containerTotalNum: 3,
    textObject: [header, boxLeft, boxRight]
  });

  try {
    await bridge.createStartUpPageContainer(page);
    console.log("Erfolgreich an G2 / Simulator gesendet!");
  } catch (error) {
    console.error("Fehler beim Senden:", error);
  }
}

// App starten
initApp().catch(console.error);
