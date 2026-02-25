# Together - Even Realities G2 App

**Together** is a minimalist relationship tracker for Even Realities G2. Displays time spent with your partner in different formats on the glasses HUD. A glanceable way to celebrate milestones. 💚

<img width="578" height="360" alt="t1xm-even-together-hud" src="https://github.com/user-attachments/assets/7eb2ee18-a4f8-43ea-aade-c9512b6a37ef" />
<img width="420" height="832" alt="t1xm-even-together-app" src="https://github.com/user-attachments/assets/ed805407-3996-4756-b8c9-d30aee87c242" />

## ✨ Features

- **Glanceable HUD Dashboard:** Shows your names, anniversary date, and detailed time-spent statistics (years, months, weeks, days, hours).
- **Companion Web UI:** A mobile-friendly settings page rendered inside the Even App to easily configure your names and anniversary.
- **Local Storage:** Safely persists your data on your phone using both the Even Hub Bridge and window.localStorage.
- **Multi-language Support:** Natively supports English, German, and French, automatically adapting to your system's locale.
- **Optimized for G2 Limits:** Strictly adheres to the SDK's 4-container limit, using a creative layout to simulate a multi-column dashboard.

## 🚀 Quick Start & Development

This project uses standard web technologies (HTML, CSS, TypeScript) and is bundled with Vite.

### Prerequisites
- Node.js (v20+)
- Even Hub CLI (`@evenrealities/evenhub-cli`) installed globally.
- The Even App installed on your iOS/Android device.

### Setup
1. Clone this repository.
2. Install dependencies:
   ```bash
   npm install
   ```
3. Start the development server:
   ```bash
   npm run dev
   ```
4. In a separate terminal, generate the QR code to open the app on your glasses:
   ```bash
   npx evenhub qr --http --port 5173
   ```
4. OR start the Simulator locally on your PC
   ```bash
   evenhub-simulator http://localhost:5173
   ```
5. Scan the QR code with the Even App on your phone.

## 🏗️ Architecture & SDK Usage

This app is built with TypeScript using the official `@evenrealities/even_hub_sdk`. It follows the hosted WebView architecture where the logic runs in the Even App on the smartphone and communicates via BLE (Bluetooth Low Energy) with the G2 glasses.

### Display Logic
To bypass the lack of native layout engines (like Flexbox or Grid) on the G2 hardware, **Together** utilizes absolute coordinate positioning. The display is a 576x288px green-only Micro-LED.

The UI leverages the absolute maximum of **4 containers** per page, which is the current hardware/SDK limit:

1.  **Header Container (ID 1):** Displays the app title and names. It is set to `isEventCapture: 1` to handle system events and ensure the page remains active.
2.  **Main Box (ID 2):** Centered container showing the formatted anniversary date and the primary "Years, Months, Days" string.
3.  **Left Stats Box (ID 3):** Bottom-left alignment for total months and total days.
4.  **Right Stats Box (ID 4):** Bottom-right alignment for total weeks and total hours.

### Technical Implementation
- **Lifecycle:** Uses `createStartUpPageContainer` for the initial render and `rebuildPageContainer` for flicker-free (sequential) updates when settings are changed.
- **Data Persistence:** Uses the `bridge.getLocalStorage` and `bridge.setLocalStorage` APIs to ensure the anniversary date persists across app restarts.
- **i18n:** A custom translation layer maps system locales to app strings before sending content to the glasses, ensuring the 1000-character limit for `TextContainerProperty` is never exceeded.
