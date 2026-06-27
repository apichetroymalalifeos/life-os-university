# Life OS University Free Mobile Deployment

Life OS remains free. It is a static local web app with no backend, login, subscription, paid hosting, or paid API requirement.

## Option 1: Desktop Local Use

1. Open `index.html` directly on Windows.
2. Progress is saved in this browser on this device with `localStorage`.
3. PWA install and service worker offline cache require HTTPS or localhost, so direct file opening is best for desktop local use only.

## Option 2: Free Mobile Use With GitHub Pages

1. Create a free GitHub account if you do not already have one.
2. Create a new repository, for example `life-os-university`.
3. Upload the project files exactly as they are, including:
   - `index.html`
   - `styles/`
   - `src/`
   - `roadmaps/`
   - `assets/icons/`
   - `manifest.webmanifest`
   - `service-worker.js`
4. In GitHub, open the repository settings.
5. Go to **Pages**.
6. Under **Build and deployment**, choose:
   - Source: **Deploy from a branch**
   - Branch: `main`
   - Folder: `/root`
7. Save. GitHub will create a free HTTPS URL.
8. Open that GitHub Pages URL on your phone.
9. Use the browser menu to add it to the home screen.

## Add To Home Screen

### iPhone

1. Open the GitHub Pages URL in Safari.
2. Tap the share button.
3. Tap **Add to Home Screen**.
4. Confirm the name `Life OS`.

### Android

1. Open the GitHub Pages URL in Chrome.
2. Tap the menu button.
3. Tap **Add to Home screen** or **Install app**.
4. Confirm the name `Life OS`.

## Offline Behavior

After the first successful visit from GitHub Pages, the service worker caches the app shell, scripts, styles, icons, and roadmap metadata. The dashboard can reopen offline and show saved progress from the device browser.

## Data Storage

Progress is stored locally on each device with `localStorage`. There is no automatic sync yet. Future sync can be added later with Google Calendar, Google Tasks, Notion, Garmin, ChatGPT API, SQLite, or Supabase without changing the daily dashboard concept.
