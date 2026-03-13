// src/i18n.ts

export const translations = {
  en: {
    appTitle: "Journey",
    appTitleSep: "Journey │",

    journeyListTitle: "Your journeys",
    deleteJourney: "Delete",
    holdToDelete: "Hold to delete",
    newJourney: "Add journey",

    sinceTitle: "Since",
    pleaseSelectDate: "Select date",

    inDetail: "In detail",
    emptyStateMarker: "-",
    year: "Year", years: "Years",
    month: "Month", months: "Months",
    day: "Day", days: "Days",
    week: "Week", weeks: "Weeks",
    hour: "Hour", hours: "Hours",
    and: "and",

    settings: "Settings",
    setTitle: "Set a title",
    titleLabel: "Title",
    titlePlaceholder: "e.g. Lilli & Tim",
    sinceLabel: "Since",

    saveBtn: "Save & send to G2",
    fillBothFields: "Please fill in both fields",
    savedAndSent: "Saved & sent to G2",

    aboutTitle: "About Journey",
    aboutText: "A minimalist journey tracker for Even Realities G2. Track new habits, health milestones, personal projects and more - and see your progress at a glance on the glasses HUD.",
    
    welcomeTitle: "Welcome to Journey!",
    welcomeDesc: "Please open the Even app on your smartphone and create your first entry with a title and start date.",
  },
  de: {
    appTitle: "Journey",
    appTitleSep: "Journey │",

    journeyListTitle: "Deine Journeys",
    deleteJourney: "Löschen",
    holdToDelete: "Zum Löschen gedrückt halten",
    newJourney: "Journey hinzufügen",

    sinceTitle: "Seit",
    pleaseSelectDate: "Datum wählen",

    inDetail: "Im Detail",
    emptyStateMarker: "-",
    year: "Jahr", years: "Jahre",
    month: "Monat", months: "Monate",
    day: "Tag", days: "Tage",
    week: "Woche", weeks: "Wochen",
    hour: "Stunde", hours: "Stunden",
    and: "und",

    settings: "Einstellungen",
    setTitle: "Titel festlegen",
    titleLabel: "Titel",
    titlePlaceholder: "z.B. Lilli & Tim",
    sinceLabel: "Seit",

    saveBtn: "Speichern & an G2 senden",
    fillBothFields: "Bitte beide Felder ausfüllen",
    savedAndSent: "Gespeichert & an G2 gesendet",

    aboutTitle: "Über Journey",
    aboutText: "Ein minimalistischer Journey-Tracker für Even Realities G2. Tracke neue Gewohnheiten, Gesundheits-Meilensteine, Projekte und mehr - und sieh deinen Fortschritt auf einen Blick im HUD der Brille.",
    
    welcomeTitle: "Willkommen bei Journey!",
    welcomeDesc: "Bitte öffne die Even App auf deinem Smartphone und lege deinen ersten Eintrag mit Titel und Startdatum an.",
  },
  fr: {
    appTitle: "Journey",
    appTitleSep: "Journey │",

    journeyListTitle: "Vos parcours",
    deleteJourney: "Supprimer",
    holdToDelete: "Maintenez pour supprimer",
    newJourney: "Ajouter parcours",

    sinceTitle: "Depuis",
    pleaseSelectDate: "Sélectionnez une date",

    inDetail: "En détail",
    emptyStateMarker: "-",
    year: "Année", years: "Années",
    month: "Mois", months: "Mois",
    day: "Jour", days: "Jours",
    week: "Semaine", weeks: "Semaines",
    hour: "Heure", hours: "Heures",
    and: "et",

    settings: "Paramètres",
    setTitle: "Définissez un titre",
    titleLabel: "Titre",
    titlePlaceholder: "ex. Lilli & Tim",
    sinceLabel: "Depuis",

    saveBtn: "Enregistrer et envoyer aux G2",
    fillBothFields: "Veuillez remplir les deux champs",
    savedAndSent: "Enregistré et envoyé aux G2",

    aboutTitle: "À propos de Journey",
    aboutText: "Un suivi minimaliste de vos parcours pour Even Realities G2. Suivez vos nouvelles habitudes, jalons de santé, projets personnels et plus encore - et visualisez vos progrès d'un coup d'œil sur le HUD des lunettes.",
    
    welcomeTitle: "Bienvenue sur Journey !",
    welcomeDesc: "Veuillez ouvrir l'application Even sur votre smartphone et créer votre première entrée avec un titre et une date de début.",
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

// let currentLang: LanguageCode = 'de';
let currentLang: LanguageCode = detectSystemLanguage();

export function t(key: keyof typeof translations['en']): string {
  return translations[currentLang][key] || key;
}

export function getLocale(): string {
  if (currentLang === 'de') return 'de-DE';
  if (currentLang === 'fr') return 'fr-FR';
  return 'en-US';
}
