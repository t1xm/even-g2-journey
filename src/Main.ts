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

// Neue HTML Elemente für das Handy-Dashboard
const uiNames = document.getElementById('ui-names') as HTMLHeadingElement;
const uiDate = document.getElementById('ui-date') as HTMLParagraphElement;
const uiExact = document.getElementById('ui-exact') as HTMLParagraphElement;
const uiMonths = document.getElementById('ui-months') as HTMLParagraphElement;
const uiWeeks = document.getElementById('ui-weeks') as HTMLParagraphElement;
const uiDays = document.getElementById('ui-days') as HTMLParagraphElement;
const uiHours = document.getElementById('ui-hours') as HTMLParagraphElement;

function showStatus(message: string, duration: number = 3000): void {
  if (!statusEl) return;
  statusEl.textContent = message;
  statusEl.classList.add('visible');
  setTimeout(() => {
    statusEl.classList.remove('visible');
  }, duration);
}

// --- Funktion: Aktualisiert das Dashboard auf dem Handy ---
function updateWebUI(names: string, dateStr: string) {
  if (uiNames) uiNames.textContent = names || "Tim & Lilli";
  const stats = calculateLoveStats(dateStr);

  if (!stats.isValid) {
    if (uiDate) uiDate.textContent = "Please select a date";
    if (uiExact) uiExact.textContent = "-";
    if (uiMonths) uiMonths.textContent = "-";
    if (uiWeeks) uiWeeks.textContent = "-";
    if (uiDays) uiDays.textContent = "-";
    if (uiHours) uiHours.textContent = "-";
    return;
  }

  // Handy-Elemente mit berechneten Werten füllen
  if (uiDate) uiDate.textContent = stats.formattedDate;
  if (uiExact) uiExact.textContent = `${stats.years} Years, ${stats.months} Months and ${stats.days} Days`;
  if (uiMonths) uiMonths.textContent = `${stats.totalMonths.toLocaleString('en-US')} Months`;
  if (uiWeeks) uiWeeks.textContent = `${stats.totalWeeks.toLocaleString('en-US')} Weeks`;
  if (uiDays) uiDays.textContent = `${stats.totalDays.toLocaleString('en-US')} Days`;
  if (uiHours) uiHours.textContent = `${stats.totalHours.toLocaleString('en-US')} Hours`;
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

  // Initiale UI Updates
  updateWebUI(displayNames, displayDate);
  await startGlassesUI(bridge, displayNames, displayDate);

  // Speicher-Event
  saveBtn?.addEventListener('click', async () => {
    const names = namesInput.value.trim();
    const date = dateInput.value;

    if (!names || !date) {
      showStatus('Please fill in both fields');
      return;
    }

    await bridge.setLocalStorage('together_names', names);
    await bridge.setLocalStorage('together_date', date);

    showStatus('Saved & sent to G2');
    
    // Beide Plattformen (Handy + Brille) aktualisieren
    updateWebUI(names, date);
    await startGlassesUI(bridge, names, date);
  });
}

// --- Brillen Logik ---
async function startGlassesUI(bridge: any, names: string, date: string) {
  const stats = calculateLoveStats(date);
  if (!stats.isValid) return;

  const margin = 20; 
  const gap = 16; 
  const boxRadius = 6; 
  const boxBorder = 15; 
  const boxBorderWidth = 2;

  const boxWidth = (576 - (margin * 2) - gap) / 2; 
  const xLeft = margin; 
  const xRight = margin + boxWidth + gap; 
  
  const headerY = 16;
  const boxesY = 60;
  const boxesHeight = 180;

  const header = new TextContainerProperty({
    containerID: 1, 
    containerName: "header",
    xPosition: margin, 
    yPosition: headerY, 
    width: 536, 
    height: 30,
    content: `${names}  •  Since: ${stats.formattedDate}`,
    borderColor: 0,
  });

  const boxLeft = new TextContainerProperty({
    containerID: 2, 
    containerName: "boxLeft",
    xPosition: xLeft, 
    yPosition: boxesY, 
    width: boxWidth, 
    height: boxesHeight,
    content: stats.leftBoxString, 
    borderColor: boxBorder, 
    borderWidth: boxBorderWidth, 
    borderRdaius: boxRadius, 
    isEventCapture: 1 
  });

  const boxRight = new TextContainerProperty({
    containerID: 3, 
    containerName: "boxRight",
    xPosition: xRight, 
    yPosition: boxesY, 
    width: boxWidth, 
    height: boxesHeight,
    content: stats.rightBoxString, 
    borderColor: boxBorder, 
    borderWidth: boxBorderWidth, 
    borderRdaius: boxRadius,
  });

  const page = new CreateStartUpPageContainer({
    containerTotalNum: 3,
    textObject: [header, boxLeft, boxRight]
  });

  try {
    await bridge.createStartUpPageContainer(page);
  } catch (error) {
    console.error("Fehler beim Senden:", error);
  }
}

initApp().catch(console.error);