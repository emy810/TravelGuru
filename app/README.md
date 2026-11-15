# TravelGuru: frontend app

This folder contains the React + Vite app. For the project overview, features, architecture and roadmap, see the [main README](../README.md).

## Quick start

```bash
npm install
cp .env.example .env.local   # add your Firebase config values
npm run dev
```

The required environment variables are listed in the [main README](../README.md#environment-variables).

## Scripts

| Command              | What it does                                                |
| -------------------- | ----------------------------------------------------------- |
| `npm run dev`        | Starts the Vite dev server                                  |
| `npm run build`      | Builds for production into `dist/`                          |
| `npm run lint`       | Runs ESLint and fixes what it can                           |
| `npm run lint:ci`    | Runs ESLint with zero warnings allowed (used in CI)         |
| `npm run format`     | Formats the code with Prettier                              |
| `npm run format:ci`  | Checks formatting without changing files (used in CI)       |
| `npm run lighthouse` | Runs a Lighthouse accessibility audit on a production build |

## Folder overview

```
src/
├── pages/       Route-level screens
├── components/  Shared UI (Button, Card, Input) and feature components
├── context/     AuthContext, BookingContext, WishlistContext
├── services/    Data access: the only place that knows where data comes from
├── data/        Local package and review data
├── routes/      Route config, including the package loader
└── firebase.js  Firebase setup from environment variables
```

## Deployment

The app is deployed on Vercel. `vercel.json` sends every route to `index.html` so client-side routing works.
