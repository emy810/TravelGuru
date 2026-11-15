# TravelGuru ✈️

**A React and Firebase travel booking app. I helped build it in a team, and when its backend and data API shut down, I brought it back on my own.**

- **What it is:** a single-page app for browsing trip packages, saving favourites and booking a trip, from search through checkout to confirmation.
- **What I built:** the whole user account system (Firebase Authentication, `AuthContext`, Firestore profiles, Login, Registration and the Traveller Profile page) and the shared UI components the team built pages with.
- **Why it's interesting:** after the program ended, the app stopped working: the Firebase project was deleted and the trip data API expired. I diagnosed both problems and restored the app. Swapping the data source took one file and no UI changes.

![TravelGuru home page](app/screenshots/HomePage.png)

---

## 🔗 Live Demo

**👉 [travel-sync-self.vercel.app](https://travel-sync-self.vercel.app/)**

Try it in about 2 minutes:

1. **Register** a traveller account. I built this part.
2. Go to **Explore** and search or filter by category.
3. Open a package to see its itinerary, gallery and ratings.
4. Book it for adults and children, then go through **Checkout** to **Confirmation**.

---

## 📌 Project Overview

|             |                                                                                                                  |
| ----------- | ---------------------------------------------------------------------------------------------------------------- |
| **What**    | Travel booking single-page app                                                                                   |
| **My role** | Frontend developer. I owned authentication and user accounts in the team, and I now maintain the whole app alone |
| **Team**    | Abbas, Emebet and Iglesia at HackYourFuture, then independent                                                    |
| **Stack**   | React · Vite · React Router · Firebase Authentication · Firestore · CSS                                          |
| **Status**  | ✅ Live and working · 🚧 Wishlist migration and saved bookings in progress                                       |

---

## Features

**Working**

- 🔐 Email/password registration and login with Firebase Authentication
- 👤 Registration for two roles. Travellers give their name; businesses give a business name and CVR number. The profile is saved to Firestore
- 🧭 Explore page with search and category filters. Both are kept in the URL query string, so a filtered view can be shared or bookmarked
- 📄 Package detail page with itinerary, image gallery and ratings. The data loads through a React Router loader, and an unknown package shows a 404 page
- 🧳 Booking for adults and children, with a form for each traveller. Children pay 75% of the adult price. Checkout shows a price summary, and confirmation shows a booking reference
- 📱 Responsive layouts

**Partly working**

- ❤️ Wishlist: works in the UI, but the data is still on a temporary API (see [Known Limitations](#known-limitations))
- 🏢 Business accounts: businesses can register, but there's no dashboard yet

---

## Tech Stack

| Area       | Technology                       | How it's used                                                                             |
| ---------- | -------------------------------- | ----------------------------------------------------------------------------------------- |
| UI         | **React 18**                     | Function components and hooks. Shared state lives in Context                              |
| Build tool | **Vite**                         | Dev server, production build, and environment variables through `import.meta.env`         |
| Routing    | **React Router 6**               | Nested routes, a data loader for package pages that shows a 404 page for unknown packages |
| Auth       | **Firebase Authentication**      | Email/password sign-up, login and logout                                                  |
| Database   | **Cloud Firestore**              | Stores one profile per user at `users/{uid}`                                              |
| Styling    | **CSS**                          | Plain CSS per page, plus CSS Modules for the shared UI components                         |
| Quality    | ESLint, Prettier, GitHub Actions | Every pull request runs format, lint and build checks                                     |
| Hosting    | Vercel                           | Hosts the app and sends every route to `index.html` so client-side routing works          |

---

## My Contributions During the Team Project

There were three of us. I was responsible for **everything a user does with their account**, from sign-up to profile, and for the shared components the team used to build pages.

| What I built                            | Details                                                                                                                                                                              | Code                                                 |
| --------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ | ---------------------------------------------------- |
| **Firebase Authentication**             | Set up email/password sign-up, login and logout                                                                                                                                      | [`firebase.js`](app/src/firebase.js)                 |
| **`AuthContext`**                       | Subscribes once to `onAuthStateChanged` and loads the user's Firestore profile. Gives every component `user`, `register`, `login` and `logout`, so no page imports Firebase directly | [`AuthContext.jsx`](app/src/context/AuthContext.jsx) |
| **Firestore user profiles**             | Registration writes `users/{uid}` with the role and role-specific fields. Login reads it back and merges it with the Firebase user                                                   | [`AuthContext.jsx`](app/src/context/AuthContext.jsx) |
| **Registration page**                   | Choose traveller or business, see different required fields for each role, with validation before any network call                                                                   | [`RegisterPage/`](app/src/pages/RegisterPage)        |
| **Login page**                          | Checks the fields are filled in and the email format before sending, and shows auth errors to the user                                                                               | [`LoginPage/`](app/src/pages/LoginPage)              |
| **Traveller Profile page**              | Shows the signed-in user's name, email and role from their Firestore profile                                                                                                         | [`TravelerProfile/`](app/src/pages/TravelerProfile)  |
| **Shared `Button`, `Card` and `Input`** | Components with variants, styled with CSS Modules. Teammates used them across their pages                                                                                            | [`components/ui/`](app/src/components/ui)            |

All work was done through pull requests on a shared `develop` branch, with CI checks before merging.

---

## Independent Improvements

After the program, the deployed app still loaded but was unusable. Nobody could sign up or log in, and Explore showed no trips. There were two separate causes, and I fixed them one at a time.

| Engineering work                                                                                                                                                                 | Impact                                                                                                                       |
| -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ---------------------------------------------------------------------------------------------------------------------------- |
| **Set up a new Firebase backend.** Created a new Firebase project, turned on Email/Password auth and Firestore, and connected it through `VITE_FIREBASE_*` environment variables | The app has a working backend again. Anyone who clones the repo can use their own Firebase project without changing any code |
| **Restored authentication.** Tested each path (register, log in, log out, profile load) against the new project and fixed registration and login                                 | Users can create accounts and sign in again, and their profiles are saved to and read from Firestore                         |
| **Replaced the expired CrudCrud package endpoints.** Re-implemented `packageService.js` on the project's local package data and kept its public functions the same               | Trip data no longer depends on an API that expires. The UI didn't need a single change                                       |
| **Restored the Explore page.** Explore, the home page and package detail pages load trips through the new service                                                                | The app's main path (browse → detail → book) works end to end again                                                          |

---

## Technical Challenges and Solutions

### 1. The trip data API expired, and I fixed it without touching the UI

**Problem:** The packages came from [CrudCrud](https://crudcrud.com/), a free API whose endpoints expire. When ours expired, the Home, Explore and Package Detail pages had nothing to show.

**Decision:** Three places use package data: two pages and the route loader for package details. All of them call `services/packageService.js`, and none of them calls `fetch`. So I changed the service instead of the screens.

**Solution:** I rewrote `packageService.js` to read the project's existing local package data. I kept the async functions `getPackages()` and `getPackageById()` exactly as they were. I also kept `normalizePackage()`, which fills in defaults for missing fields. `getPackageById()` still throws an error when no package matches, so the route loader's 404 handling still works.

**Result:** One file changed and no UI changed. When packages move to Firestore, only this file changes again.

### 2. The original Firebase project was gone

**Problem:** Authentication and user profiles both lived in the team's original Firebase project, which had been deleted. Registration and login failed, and profiles had nowhere to be saved.

**Solution:** I created a new Firebase project, turned on Email/Password auth and Firestore, and set the six `VITE_FIREBASE_*` variables that `firebase.js` reads. Then I went through each auth path against the new backend and fixed registration and login.

**Result:** Authentication and profiles work again. Because all the config is in environment variables, switching Firebase projects is a matter of setup, not code.

### 3. Keeping login state in sync across the app

**Problem:** Firebase reports the signed-in user asynchronously. The navbar, the profile page and the booking flow all need that user, together with their Firestore profile (role, name).

**Solution:** `AuthContext` subscribes to `onAuthStateChanged` once. When someone signs in, it loads their `users/{uid}` document and merges it with the Firebase user. Components read the result through `useAuth()`. The subscription is removed when the provider unmounts.

---

## Architecture

```
┌──────────────────────── React app (Vite) ─────────────────────────┐
│                                                                   │
│  routes/  ──▶  pages/  ──uses──▶  components/ (Button, Card, ...) │
│    │             │                                                │
│    │             ├──reads──▶  context/   AuthContext ·            │
│    │             │                       BookingContext ·         │
│    │             │                       WishlistContext          │
│    │             │                                                │
│    └─loader──────┴──calls──▶  services/  packageService ·         │
│                                          wishlistService          │
└───────────────────────────────────┬───────────────────────────────┘
                                    │
       ┌──────────────┬─────────────┴──────┬──────────────────┐
       ▼              ▼                    ▼                  ▼
 Firebase Auth   Cloud Firestore     Local data (data/)   CrudCrud
 (sessions)      (users/{uid})       (trip packages)      (wishlist, temporary)
```

**Design rules:**

- **UI never talks to a data source directly.** Pages, components and route loaders go through `services/` or `context/`. That rule is why the CrudCrud fix took one file.
- **Firebase is imported in one place.** Only `firebase.js` and `AuthContext` know about it, and everything else uses `useAuth()`.
- **Each kind of shared state has its own provider.** Auth, the booking in progress and the wishlist are separate contexts, so a change in one doesn't re-render consumers of the others.

```
app/src/
├── pages/       Route-level screens (Explore, PackageDetail, Booking, Checkout, ...)
├── components/  Shared UI (Button, Card, Input) and feature components
├── context/     AuthContext, BookingContext, WishlistContext
├── services/    The only place that knows where data comes from
├── data/        Local package and review data
├── routes/      Route config, including the package loader
└── firebase.js  Firebase setup from environment variables
```

---

## Installation

**Requirements:** Node.js 20+, npm 10+, and a free [Firebase](https://firebase.google.com/) project.

```bash
git clone https://github.com/emy810/TravelGuru.git
cd TravelGuru/app
npm install
cp .env.example .env.local   # then add your Firebase values
npm run dev
```

**Firebase setup:**

1. Create a project in the [Firebase console](https://console.firebase.google.com/).
2. Turn on **Authentication → Sign-in method → Email/Password**.
3. Create a **Firestore** database.
4. Add a web app and copy its config values into `.env.local`.

### Environment Variables

| Variable                            | Description                                                          |
| ----------------------------------- | -------------------------------------------------------------------- |
| `VITE_FIREBASE_API_KEY`             | Firebase web API key                                                 |
| `VITE_FIREBASE_AUTH_DOMAIN`         | e.g. `your-project.firebaseapp.com`                                  |
| `VITE_FIREBASE_PROJECT_ID`          | Firebase project ID                                                  |
| `VITE_FIREBASE_STORAGE_BUCKET`      | e.g. `your-project.appspot.com`                                      |
| `VITE_FIREBASE_MESSAGING_SENDER_ID` | Firebase sender ID                                                   |
| `VITE_FIREBASE_APP_ID`              | Firebase web app ID                                                  |
| `VITE_CRUD_CRUD_API_KEY`            | Wishlist only. Temporary: it goes away after the Firestore migration |

### Scripts

| Command          | What it does          |
| ---------------- | --------------------- |
| `npm run dev`    | Starts the dev server |
| `npm run build`  | Builds for production |
| `npm run lint`   | Runs ESLint           |
| `npm run format` | Runs Prettier         |

---

## Known Limitations

What doesn't work yet, and why:

- **The wishlist still uses CrudCrud.** It will break when the endpoint expires, the same way the packages did. Moving it to Firestore is the next task.
- **The wishlist is shared.** It isn't tied to a user yet, so every visitor sees the same list.
- **Bookings aren't saved.** They live in React state and are lost when the page refreshes.
- **Pricing logic lives in the Checkout page.** It should be a separate pure function that can be tested.
- **The business dashboard isn't built.** Businesses can register, but they have nowhere to go after that.
- **There are no automated tests yet.**

---

## Roadmap

**Done**

- [x] Set up a new Firebase backend (Auth + Firestore)
- [x] Restore registration and login
- [x] Replace the expired CrudCrud package endpoints with local data behind the existing service
- [x] Restore Explore, Home and Package Detail

**Next**

- [ ] Move the wishlist to Firestore at `users/{uid}/wishlist`, with security rules
- [ ] Save bookings to Firestore and show booking history on the profile page
- [ ] Move pricing into a separate function and test it with Vitest
- [ ] Add React Testing Library tests for Login, Registration and the booking flow

**Later**

- [ ] Add loading skeletons, toast notifications and clearer error states
- [ ] Reach a Lighthouse accessibility score of 90+ on every page
- [ ] Move packages to Firestore
- [ ] Build the business dashboard

---

## Screenshots

### Home

![Home page with hero section and featured packages](app/screenshots/HomePage.png)

| Explore                                           | Package Detail                                            |
| ------------------------------------------------- | --------------------------------------------------------- |
| ![Explore page](app/screenshots/ExplorePage1.png) | ![Package detail page](app/screenshots/PackageDetail.png) |

| Booking                                          | Checkout                                           | Confirmation                                               |
| ------------------------------------------------ | -------------------------------------------------- | ---------------------------------------------------------- |
| ![Booking form](app/screenshots/BookingPage.png) | ![Checkout page](app/screenshots/CheckoutPage.png) | ![Confirmation page](app/screenshots/ConfirmationPage.png) |

| Wishlist                                        | Traveller Profile                                      |
| ----------------------------------------------- | ------------------------------------------------------ |
| ![Wishlist page](app/screenshots/Wishlist2.png) | ![Traveller profile page](app/screenshots/profile.png) |

---

## Credits

TravelGuru was first built as the final project of the [HackYourFuture](https://www.hackyourfuture.net/) program by **Abbas**, **Emebet** and **Iglesia**.

Since the program ended, **Emebet** has developed and maintained it independently.

---

## Contact

**Emebet Hunde**, Junior Frontend Developer

I'm looking for junior frontend roles. If you'd like to talk about this project or a role, please get in touch.

- 💼 LinkedIn: [linkedin.com/in/your-profile](https://www.linkedin.com/in/emebet-webdev/)
- 🐙 GitHub: [github.com/emy810](https://github.com/emy810)
