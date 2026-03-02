// src/i18n.ts

export const translations = {
  en: {
    appTitle: "Journey",
    appTitleSep: "Journey │",
    sinceTitle: "Since",
    sinceIndent: "          ",
    sinceSep: "Since │",
    inDetail: "In detail",
    settings: "Settings",
    aboutTitle: "About Journey",
    titleLabel: "Title",
    titlePlaceholder: "e.g. Alcohol free",
    sinceLabel: "Since",
    saveBtn: "Save & Send to G2",
    setTitle: "Set a title",
    pleaseSelectDate: "Please select a start date",
    fillBothFields: "Please fill in both fields",
    savedAndSent: "Saved & Sent to G2",
    year: "Year", years: "Years",
    month: "Month", months: "Months",
    day: "Day", days: "Days",
    week: "Week", weeks: "Weeks",
    hour: "Hour", hours: "Hours",
    and: "and",
    welcomeTitle: "Welcome to Journey!",
    welcomeDesc: "Please open the Even app on your phone to create your first journey with a title and start date.",
    aboutText: "A minimalist journey tracker for Even Realities G2. Track new habits, health milestones, personal projects and more – and see your progress at a glance on the glasses HUD.",
    emptyStateMarker: "-",
    journeyListTitle: "Your journeys",
    newJourney: "New journey",
    deleteJourney: "Delete",
    untitledJourney: "Untitled journey"
  },
  de: {
    appTitle: "Journey",
    appTitleSep: "Journey │",
    sinceTitle: "Seit",
    sinceIndent: "       ",
    sinceSep: "Seit │",
    inDetail: "Im Detail",
    settings: "Einstellungen",
    aboutTitle: "Über Journey",
    titleLabel: "Titel",
    titlePlaceholder: "z.B. Alkoholfrei",
    sinceLabel: "Seit",
    saveBtn: "Speichern & an G2 senden",
    setTitle: "Titel festlegen",
    pleaseSelectDate: "Bitte Startdatum wählen",
    fillBothFields: "Bitte beide Felder ausfüllen",
    savedAndSent: "Gespeichert & an G2 gesendet",
    year: "Jahr", years: "Jahre",
    month: "Monat", months: "Monate",
    day: "Tag", days: "Tage",
    week: "Woche", weeks: "Wochen",
    hour: "Stunde", hours: "Stunden",
    and: "und",
    welcomeTitle: "Willkommen bei Journey!",
    welcomeDesc: "Bitte öffne die Even App auf deinem Smartphone und lege deinen ersten Eintrag mit Titel und Startdatum an.",
    aboutText: "Ein minimalistischer Journey‑Tracker für Even Realities G2. Tracke neue Gewohnheiten, Gesundheits‑Meilensteine, Projekte und mehr – und sieh deinen Fortschritt auf einen Blick im HUD der Brille.",
    emptyStateMarker: "-",
    journeyListTitle: "Deine Journeys",
    newJourney: "Neuer Eintrag",
    deleteJourney: "Löschen",
    untitledJourney: "Ohne Titel"
  },
  fr: {
    appTitle: "Journey",
    appTitleSep: "Journey │",
    sinceTitle: "Depuis",
    sinceIndent: "             ",
    sinceSep: "Depuis │",
    inDetail: "En détail",
    settings: "Paramètres",
    aboutTitle: "À propos de Journey",
    titleLabel: "Titre",
    titlePlaceholder: "ex. Sans alcool",
    sinceLabel: "Depuis",
    saveBtn: "Enregistrer et envoyer aux G2",
    setTitle: "Définissez un titre",
    pleaseSelectDate: "Veuillez choisir une date de début",
    fillBothFields: "Veuillez remplir les deux champs",
    savedAndSent: "Enregistré et envoyé aux G2",
    year: "Année", years: "Années",
    month: "Mois", months: "Mois",
    day: "Jour", days: "Jours",
    week: "Semaine", weeks: "Semaines",
    hour: "Heure", hours: "Heures",
    and: "et",
    welcomeTitle: "Bienvenue sur Journey !",
    welcomeDesc: "Veuillez ouvrir l'application Even sur votre téléphone pour créer votre premier parcours avec un titre et une date de début.",
    aboutText: "Un suivi minimaliste de vos \"journeys\" pour Even Realities G2. Suivez vos nouvelles habitudes, jalons de santé, projets personnels et visualisez vos progrès sur le HUD des lunettes.",
    emptyStateMarker: "-",
    journeyListTitle: "Vos parcours",
    newJourney: "Nouveau parcours",
    deleteJourney: "Supprimer",
    untitledJourney: "Sans titre"
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

// Debug: let currentLang: LanguageCode = 'fr';
let currentLang: LanguageCode = detectSystemLanguage();

export function t(key: keyof typeof translations['en']): string {
  return translations[currentLang][key] || key;
}

export function getLocale(): string {
  if (currentLang === 'de') return 'de-DE';
  if (currentLang === 'fr') return 'fr-FR';
  return 'en-US';
}
