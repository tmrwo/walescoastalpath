# Coast Path Planner — GitHub Pages version

Static site: no build step, no server. Everything is in this folder.

- `index.html`, `app.js`, `data.js` — the app (route, stages, elevation, stops)
- `config.js` — **the only file you edit**: your OS Maps API key and Firebase config
- `seed.json` — the trips exported from the Claude version (offered for import when a plan is empty)
- `firestore.rules` — paste into Firebase → Firestore → Rules
- `vendor/` — Leaflet, Proj4, Firebase (bundled so nothing depends on a CDN)

## Setup (once)

### 1. OS Data Hub → API key
1. https://osdatahub.os.uk → sign in → **API Dashboard** → **Add a new project** (any name).
2. **Add API to project** → **OS Maps API**.
3. Copy the **Project API Key** into `config.js` as `osKey`.
   The Leisure (Explorer/Landranger) style needs the Premium plan; you get £1,000/month free and won't get near it.

### 2. Firebase → shared storage
1. https://console.firebase.google.com → **Add project** → turn Analytics off.
2. **Build → Firestore Database → Create database** → location `europe-west2 (London)` → **Start in production mode**.
3. Firestore → **Rules** tab → replace everything with the contents of `firestore.rules` → **Publish**.
4. **Build → Authentication → Get started → Sign-in method → Anonymous → Enable**.
5. **Authentication → Settings → Authorized domains → Add domain** → `YOURNAME.github.io` (do this or sign-in fails on the live site).
6. Gear icon → **Project settings → Your apps → Web (</>)** → register (no Hosting) → copy the six values of `firebaseConfig` into `config.js`.

### 3. GitHub → hosting
1. https://github.com/new → repository name `coast-path` → **Public** → Create.
2. **uploading an existing file** → drag the *contents* of this folder in (including the `vendor` folder) → **Commit changes**.
3. **Settings → Pages → Build and deployment → Source: Deploy from a branch → Branch: main / (root) → Save.**
4. A minute later the site is at `https://YOURNAME.github.io/coast-path/`.
5. Open `config.js` on GitHub → pencil icon → paste your keys → **Commit changes**. Reload the site after a minute.

## Sharing
The first visit creates a secret plan key and puts it in the address bar (`…/#plan=xxxxxxxx`).
**Send that exact link.** Anyone with it can see and edit the plan; anyone without it sees an empty planner.
The link bar at the top has a Copy button. It only works once the Firebase config is in.

## Updating the app
When you get a new version, replace `index.html`, `app.js`, `data.js` on GitHub (upload again, overwrite). Never overwrite `config.js`.

## Data sources and licences
Route: Natural Resources Wales / Ordnance Survey (OGL v3). Heights: OS Terrain 50 (OGL v3). Map tiles: OS Maps API under your own OS Data Hub plan. Photos: Wikimedia Commons and Wikipedia, credited per image.
