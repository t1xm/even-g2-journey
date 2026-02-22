import { 
  waitForEvenAppBridge, 
  CreateStartUpPageContainer, 
  TextContainerProperty
} from '@evenrealities/even_hub_sdk';
import { calculateLoveStats } from './logic';

const namesInput = document.getElementById('names-input') as HTMLInputElement;
const dateInput = document.getElementById('date-input') as HTMLInputElement;
const saveBtn = document.getElementById('save-btn') as HTMLButtonElement;
const statusEl = document.getElementById('status') as HTMLDivElement;

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
  setTimeout(() => statusEl.classList.remove('visible'), duration);
}

function updateWebUI(names: string, dateStr: string) {
  if (uiNames) uiNames.textContent = names || "Lilli & Tim";
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

  if (uiDate) uiDate.textContent = stats.formattedDate;
  if (uiExact) uiExact.textContent = stats.exactString;
  if (uiMonths) uiMonths.textContent = `${stats.totalMonths.toLocaleString('en-US')} Months`;
  if (uiWeeks) uiWeeks.textContent = `${stats.totalWeeks.toLocaleString('en-US')} Weeks`;
  if (uiDays) uiDays.textContent = `${stats.totalDays.toLocaleString('en-US')} Days`;
  if (uiHours) uiHours.textContent = `${stats.totalHours.toLocaleString('en-US')} Hours`;
}

async function initApp() {
  const bridge = await waitForEvenAppBridge();

  let savedNames: string | null = await bridge.getLocalStorage('together_names');
  let savedDate: string | null = await bridge.getLocalStorage('together_date');

  if (!savedNames) savedNames = window.localStorage.getItem('together_names');
  if (!savedDate) savedDate = window.localStorage.getItem('together_date');

  namesInput.value = savedNames || "";
  dateInput.value = savedDate || "";

  const displayNames = savedNames || "Lilli & Tim";
  const displayDate = savedDate || "2023-09-18";

  updateWebUI(displayNames, displayDate);
  await startGlassesUI(bridge, displayNames, displayDate);

  saveBtn?.addEventListener('click', async () => {
    const names = namesInput.value.trim();
    const date = dateInput.value;

    if (!names || !date) {
      showStatus('Please fill in both fields');
      return;
    }

    await bridge.setLocalStorage('together_names', names);
    await bridge.setLocalStorage('together_date', date);
    window.localStorage.setItem('together_names', names);
    window.localStorage.setItem('together_date', date);

    showStatus('Saved & sent to G2');
    updateWebUI(names, date);
    await rebuildGlassesUI(bridge, names, date);
  });
}

// ---------------------------------------------------------
// --- Glasses UI: Finale Symmetrie (The "Golden Ratio") ---
// ---------------------------------------------------------
function getGlassesPageConfig(names: string, date: string) {
  const stats = calculateLoveStats(date);
  if (!stats.isValid) return null;

  const margin = 16; 
  const fullWidth = 544; 
  const gap = 12; 
  const halfWidth = 266; 

  const boxBorder = 8; 
  const boxBorderWidth = 2; 
  const boxRadius = 8; 
  const pad = 14; 

  // 1. HEADER (Höhe 60px - Von dir als perfekt bestätigt)
  const header = new TextContainerProperty({
    containerID: 1, containerName: "header",
    xPosition: margin, yPosition: 15, width: fullWidth, height: 60,
    paddingLength: pad,
    content: `TOGETHER   ♥   ${names}`,
    borderColor: boxBorder, borderWidth: boxBorderWidth, borderRdaius: boxRadius, 
    // Hier bleibt der Fokus, um Scrollbars in den Inhaltsboxen zu verhindern.
    isEventCapture: 1 
  });

  const safeExact = `${stats.years} Years, ${stats.months} Months, ${stats.days} Days`;

  // 2. MAIN INFO (Höhe auf 86px korrigiert für perfekte Zentrierung)
  const boxMain = new TextContainerProperty({
    containerID: 2, containerName: "boxMain",
    xPosition: margin, yPosition: 87, width: fullWidth, height: 86,
    paddingLength: pad,
    content: `Start: ${stats.formattedDate}\nTime:  ${safeExact}`, 
    borderColor: boxBorder, borderWidth: boxBorderWidth, borderRdaius: boxRadius,
    isEventCapture: 0
  });

  // 3. DETAILS LINKS (Höhe auf 86px korrigiert)
  const boxLeft = new TextContainerProperty({
    containerID: 3, containerName: "boxLeft",
    xPosition: margin, yPosition: 185, width: halfWidth, height: 86,
    paddingLength: pad,
    content: `Months: ${stats.totalMonths.toLocaleString('en-US')}\nDays:   ${stats.totalDays.toLocaleString('en-US')}`, 
    borderColor: boxBorder, borderWidth: boxBorderWidth, borderRdaius: boxRadius,
    isEventCapture: 0
  });

  // 4. DETAILS RECHTS (Höhe auf 86px korrigiert)
  const boxRight = new TextContainerProperty({
    containerID: 4, containerName: "boxRight",
    xPosition: margin + halfWidth + gap, yPosition: 185, width: halfWidth, height: 86,
    paddingLength: pad,
    content: `Weeks: ${stats.totalWeeks.toLocaleString('en-US')}\nHours: ${stats.totalHours.toLocaleString('en-US')}`, 
    borderColor: boxBorder, borderWidth: boxBorderWidth, borderRdaius: boxRadius,
    isEventCapture: 0
  });

  return {
    containerTotalNum: 4, 
    textObject: [header, boxMain, boxLeft, boxRight]
  };
}

async function startGlassesUI(bridge: any, names: string, date: string) {
  const config = getGlassesPageConfig(names, date);
  if (!config) return;

  const page = new CreateStartUpPageContainer(config);

  try {
    await bridge.createStartUpPageContainer(page);
    console.log("Erfolgreich an G2 gesendet!");
  } catch (error) {
    console.error("Fehler beim Starten:", error);
  }
}

async function rebuildGlassesUI(bridge: any, names: string, date: string) {
  const config = getGlassesPageConfig(names, date);
  if (!config) return;

  try {
    await bridge.rebuildPageContainer(config);
    console.log("UI auf der Brille aktualisiert!");
  } catch (error) {
    console.error("Fehler beim Rebuild:", error);
  }
}

initApp().catch(console.error);