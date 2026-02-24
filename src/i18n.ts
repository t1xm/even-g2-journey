// src/i18n.ts

export const translations = {
  en: {
    appTitle: "Together",
    appTitleSep: "Together │",
    anniversary: "Anniversary",
    anniversaryIndent: "                      ",
    anniversarySep: "Anniversary │",
    inDetail: "In detail",
    settings: "Settings",
    aboutTitle: "About Together",
    namesLabel: "Names",
    namesPlaceholder: "e.g. Lilli & Tim",
    anniversaryLabel: "Anniversary",
    saveBtn: "Save & Send to G2",
    setNames: "Set your names",
    pleaseSelectDate: "Please select a date",
    fillBothFields: "Please fill in both fields",
    savedAndSent: "Saved & Sent to G2",
    year: "Year", years: "Years",
    month: "Month", months: "Months",
    day: "Day", days: "Days",
    week: "Week", weeks: "Weeks",
    hour: "Hour", hours: "Hours",
    and: "and",
    welcomeTitle: "Welcome to Together!",
    welcomeDesc: "Please open the Even app on your phone to enter your names and anniversary date.",
    aboutText: "A minimalist relationship tracker for Even Realities G2. Displays time spent with your partner in different formats on the glasses HUD. A glanceable way to celebrate milestones.",
    emptyStateMarker: "-"
  },
  de: {
    appTitle: "Together",
    appTitleSep: "Together │",
    anniversary: "Jahrestag",
    anniversaryIndent: "                  ",
    anniversarySep: "Jahrestag │",
    inDetail: "Im Detail",
    settings: "Einstellungen",
    aboutTitle: "Über Together",
    namesLabel: "Namen",
    namesPlaceholder: "z.B. Lilli & Tim",
    anniversaryLabel: "Jahrestag",
    saveBtn: "Speichern & an G2 senden",
    setNames: "Namen festlegen",
    pleaseSelectDate: "Bitte Datum wählen",
    fillBothFields: "Bitte beide Felder ausfüllen",
    savedAndSent: "Gespeichert & an G2 gesendet",
    year: "Jahr", years: "Jahre",
    month: "Monat", months: "Monate",
    day: "Tag", days: "Tage",
    week: "Woche", weeks: "Wochen",
    hour: "Stunde", hours: "Stunden",
    and: "und",
    welcomeTitle: "Willkommen bei Together!",
    welcomeDesc: "Bitte öffne die Even App auf deinem Smartphone und gib eure Namen und den Jahrestag ein.",
    aboutText: "Ein minimalistischer Beziehungs-Tracker für Even Realities G2. Zeigt die mit deinem Partner verbrachte Zeit in verschiedenen Formaten auf dem HUD der Brille an. Eine schöne Art, gemeinsame Meilensteine zu feiern.",
    emptyStateMarker: "-"
  },
  fr: {
    appTitle: "Together",
    appTitleSep: "Together │",
    anniversary: "Anniversaire",
    anniversaryIndent: "                       ",
    anniversarySep: "Anniversaire │",
    inDetail: "En détail",
    settings: "Paramètres",
    aboutTitle: "À propos de Together",
    namesLabel: "Noms",
    namesPlaceholder: "ex. Lilli & Tim",
    anniversaryLabel: "Anniversaire",
    saveBtn: "Enregistrer et envoyer aux G2",
    setNames: "Définissez vos noms",
    pleaseSelectDate: "Veuillez choisir une date",
    fillBothFields: "Veuillez remplir les deux champs",
    savedAndSent: "Enregistré et envoyé aux G2",
    year: "Année", years: "Années",
    month: "Mois", months: "Mois",
    day: "Jour", days: "Jours",
    week: "Semaine", weeks: "Semaines",
    hour: "Heure", hours: "Heures",
    and: "et",
    welcomeTitle: "Bienvenue sur Together !",
    welcomeDesc: "Veuillez ouvrir l'application Even sur votre téléphone pour entrer vos noms et votre date d'anniversaire.",
    aboutText: "Un suivi de relation minimaliste pour Even Realities G2. Affiche le temps passé avec votre partenaire sous différents formats sur le HUD des lunettes.",
    emptyStateMarker: "-"
  }
};

export type LanguageCode = keyof typeof translations;

function detectSystemLanguage(): LanguageCode {
  const browserLang = navigator.language.split('-')[0];
  if (browserLang in translations) {
    return browserLang as LanguageCode;
  }
  return 'en'; 
}

// Debug: let currentLang: LanguageCode = 'en';
let currentLang: LanguageCode = detectSystemLanguage();

export function t(key: keyof typeof translations['en']): string {
  return translations[currentLang][key] || key;
}

export function getLocale(): string {
  if (currentLang === 'de') return 'de-DE';
  if (currentLang === 'fr') return 'fr-FR';
  return 'en-US';
}
