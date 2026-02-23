// src/ui-hud.ts

import { 
  CreateStartUpPageContainer, 
  TextContainerProperty
} from '@evenrealities/even_hub_sdk';
import { calculateLoveStats } from './calc';

function getGlassesPageConfig(names: string, date: string) {
    const stats = calculateLoveStats(date);
    if (!stats.isValid) return null;

    const margin = 14;
    const fullWidth = 544;
    const halfWidth = 230;
    const borderColor = 8;
    const borderWidth = 1;
    const borderRadius = 6;

    const header = new TextContainerProperty({
        containerID: 1, 
        containerName: "header",
        xPosition: margin,
        yPosition: margin,
        paddingLength: margin,
        width: fullWidth,
        height: 60,
        content: `Together │ ${names}`,
        borderColor: borderColor,
        borderWidth: borderWidth,
        borderRdaius: borderRadius,
        isEventCapture: 1,
    });

    const safeExact = `${stats.years} Years, ${stats.months} Months and ${stats.days} Days ago`;

    const boxMain = new TextContainerProperty({
        containerID: 2,
        containerName: "boxMain",
        xPosition: margin,
        yPosition: 90,
        paddingLength: margin,
        width: fullWidth,
        height: 88,
        content: `Anniversary │ ${stats.formattedDate}\n                      │ ${safeExact}`,
        borderColor: borderColor,
        borderWidth: borderWidth,
        borderRdaius: borderRadius,
        isEventCapture: 0,
    });

    const boxLeft = new TextContainerProperty({
        containerID: 3,
        containerName: "boxLeft",
        xPosition: margin + margin,
        yPosition: 192,
        paddingLength: 0,
        width: halfWidth,
        height: 88,
        content: `${stats.totalMonths.toLocaleString('en-US')} Months\n\n${stats.totalDays.toLocaleString('en-US')} Days`, 
        borderColor: 0,
        borderWidth: 0,
        borderRdaius: 0,
        isEventCapture: 0,
    });

    const boxRight = new TextContainerProperty({
        containerID: 4,
        containerName: "boxRight",
        xPosition: margin * 3 + halfWidth,
        yPosition: 192,
        paddingLength: 0,
        width: halfWidth,
        height: 88,
        content: `${stats.totalWeeks.toLocaleString('en-US')} Weeks\n\n${stats.totalHours.toLocaleString('en-US')} Hours`, 
        borderColor: 0,
        borderWidth: 0,
        borderRdaius: 0,
        isEventCapture: 0,
    });

    return {
        containerTotalNum: 4, 
        textObject: [header, boxMain, boxLeft, boxRight]
    };
}

export async function startGlassesUI(bridge: any, names: string, date: string) {
    const config = getGlassesPageConfig(names, date);
    if (!config) return;

    const page = new CreateStartUpPageContainer(config);

    try {
        await bridge.createStartUpPageContainer(page);
        console.log("Successfully sent to G2!");
    } catch (error) {
        console.error("Error starting Glasses UI:", error);
    }
}

export async function rebuildGlassesUI(bridge: any, names: string, date: string) {
    const config = getGlassesPageConfig(names, date);
    if (!config) return;

    try {
        await bridge.rebuildPageContainer(config);
        console.log("UI updated on the glasses!");
    } catch (error) {
        console.error("Error rebuilding Glasses UI:", error);
    }
}
