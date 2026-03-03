// src/ui-hud.ts

import { 
  CreateStartUpPageContainer, 
  TextContainerProperty
} from '@evenrealities/even_hub_sdk';
import { calculateJourneyStats } from './calc';
import { t, getLocale } from './i18n';

function getGlassesPageConfig(title: string, date: string) {
    if (!title || !date) {
        const emptyContainer = new TextContainerProperty({
            containerID: 1,
            containerName: "emptyState",
            xPosition: 64,
            yPosition: 14,
            paddingLength: 14,
            width: 448,
            height: 260,
            content: `${t('welcomeTitle')}\n\n${t('welcomeDesc')}`,
            borderColor: 8,
            borderWidth: 1,
            borderRdaius: 6,
            isEventCapture: 1,
        });

        return {
            containerTotalNum: 1,
            textObject: [emptyContainer]
        };
    }

    const stats = calculateJourneyStats(date);
    if (!stats.isValid) return null;

    const locale = getLocale();
    const margin = 14;
    const marginHorizontal = 64;
    const fullWidth = 448;
    const halfWidth = 196;
    const borderColor = 8;
    const borderWidth = 1;
    const borderRadius = 6;

    const mStr = stats.totalMonths === 1 ? t('month') : t('months');
    const wStr = stats.totalWeeks === 1 ? t('week') : t('weeks');
    const dStr = stats.totalDays === 1 ? t('day') : t('days');
    const hStr = stats.totalHours === 1 ? t('hour') : t('hours');

    const header = new TextContainerProperty({
        containerID: 1, 
        containerName: "header",
        xPosition: marginHorizontal,
        yPosition: margin,
        paddingLength: margin,
        width: fullWidth,
        height: 60,
        content: `${t('appTitleSep')} ${title}`,
        borderColor: borderColor,
        borderWidth: borderWidth,
        borderRdaius: borderRadius,
        isEventCapture: 1,
    });

    const boxMain = new TextContainerProperty({
        containerID: 2,
        containerName: "boxMain",
        xPosition: marginHorizontal,
        yPosition: 90,
        paddingLength: margin,
        width: fullWidth,
        height: 88,
        content: `${stats.formattedDate}\n${stats.exactString}`,
        borderColor: borderColor,
        borderWidth: borderWidth,
        borderRdaius: borderRadius,
        isEventCapture: 0,
    });

    const boxLeft = new TextContainerProperty({
        containerID: 3,
        containerName: "boxLeft",
        xPosition: marginHorizontal + margin,
        yPosition: 192,
        paddingLength: 0,
        width: halfWidth,
        height: 88,
        content: `${stats.totalMonths.toLocaleString(locale)} ${mStr}\n\n${stats.totalDays.toLocaleString(locale)} ${dStr}`, 
        borderColor: 0,
        borderWidth: 0,
        borderRdaius: 0,
        isEventCapture: 0,
    });

    const boxRight = new TextContainerProperty({
        containerID: 4,
        containerName: "boxRight",
        xPosition: marginHorizontal + margin * 3 + halfWidth,
        yPosition: 192,
        paddingLength: 0,
        width: halfWidth,
        height: 88,
        content: `${stats.totalWeeks.toLocaleString(locale)} ${wStr}\n\n${stats.totalHours.toLocaleString(locale)} ${hStr}`, 
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

export async function startGlassesUI(bridge: any, title: string, date: string) {
    const config = getGlassesPageConfig(title, date);
    if (!config) return;

    const page = new CreateStartUpPageContainer(config);

    try {
        await bridge.createStartUpPageContainer(page);
        console.log("Successfully sent to G2!");
    } catch (error) {
        console.error("Error starting G2 UI:", error);
    }
}

export async function rebuildGlassesUI(bridge: any, title: string, date: string) {
    const config = getGlassesPageConfig(title, date);
    if (!config) return;

    try {
        await bridge.rebuildPageContainer(config);
        console.log("Successfully updated G2 UI!");
    } catch (error) {
        console.error("Error rebuilding G2 UI:", error);
    }
}
