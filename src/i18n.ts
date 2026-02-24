// src/i18n.ts

export const translations = {
  en: {
    // General & Headers
    appTitle: "Together",
    appTitleSep: "Together │",
    anniversary: "Anniversary",
    anniversarySep: "Anniversary │",
    inDetail: "In detail",
    settings: "Settings",
    aboutTitle: "About Together",
    
    // Labels & Placeholders
    namesLabel: "Names",
    namesPlaceholder: "e.g. Lilli & Tim",
    anniversaryLabel: "Anniversary",
    saveBtn: "Save & Send to G2",
    
    // Status Messages
    setNames: "Set your names",
    pleaseSelectDate: "Please select a date",
    fillBothFields: "Please fill in both fields",
    savedAndSent: "Saved & Sent to G2",
    
    // Time Units
    year: "Year",
    years: "Years",
    month: "Month",
    months: "Months",
    day: "Day",
    days: "Days",
    week: "Week",
    weeks: "Weeks",
    hour: "Hour",
    hours: "Hours",
    and: "and",
    
    // Glasses (HUD) Specific
    welcomeTitle: "Welcome to Together!",
    welcomeDesc: "Please open the Even app on your phone to enter your names and anniversary date.",
    
    // Long Texts
    aboutText: "A minimalist relationship tracker for Even Realities G2. Displays time spent with your partner in different formats on the glasses HUD. A glanceable way to celebrate milestones.",
    emptyStateMarker: "-"
  }
};

let currentLang: keyof typeof translations = 'en';

export function t(key: keyof typeof translations['en']): string {
  return translations[currentLang][key] || key;
}

export function setLanguage(lang: keyof typeof translations) {
  if (translations[lang]) {
    currentLang = lang;
  }
}
