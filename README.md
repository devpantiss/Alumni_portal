# Pantiss Alumni Network

A frontend-only workforce alumni prototype built with React, Vite, Tailwind CSS, React Router, Lucide, Framer Motion, and Recharts. Profiles, coordinates, messages, and transactions are fictional; interactions persist in browser localStorage.

## Start

Requires Node.js 20.19+ or 22.12+.

```sh
npm install
npm run dev
```

Open the local URL printed by Vite. `npm run build` produces `dist/`; `npm run preview` serves that build. Deploy with an SPA fallback to `index.html` for nested routes.

## Demo credentials

| Workspace | Email | Password |
|---|---|---|
| Alumni | alumni@pantiss.com | password |
| Admin | admin@pantiss.com | password |

Admin sign-in and `/admin` open `/admin/connect`. The analytics overview is at `/admin/overview`. These client-side route guards are only for demonstration, not production security.

## Map

The admin map uses React Leaflet and Leaflet with a dark-styled OpenStreetMap tile layer. No API key is required. It supports native drag/touch panning, scroll and double-click zoom, keyboard navigation, clickable state clusters, alumni markers, tooltips, heatmap-style concentration circles, fullscreen, and recentering. Selecting a list entry flies to its marker and opens its profile. Tiles require internet access; local GeoJSON geography remains underneath if tiles are unavailable. OpenStreetMap attribution is visible on the map. Production deployments should configure an appropriate tile service for their traffic.

The previous Google Maps implementation has been replaced. `VITE_GOOGLE_MAPS_API_KEY` is no longer used.

## Routes

- Public: `/`, `/login`, `/login/alumni`, `/login/admin`.
- Alumni: `/alumni`, `/alumni/profile`, `/alumni/profile/:id`, `/alumni/batch`, `/alumni/directory`, `/alumni/connect`, `/alumni/messages`, `/alumni/calls`, `/alumni/jobs`, `/alumni/jobs/:id`, `/alumni/events`, `/alumni/events/:id`, `/alumni/groups`, `/alumni/groups/:id`, `/alumni/mentorship`, `/alumni/announcements`, `/alumni/resources`, `/alumni/settings`.
- Admin: `/admin` (redirect), `/admin/connect`, `/admin/overview`, `/admin/alumni`, `/admin/alumni/:id`, `/admin/verification`, `/admin/batches`, `/admin/programs`, `/admin/campuses`, `/admin/job-roles`, `/admin/companies`, `/admin/companies/:id`, `/admin/jobs`, `/admin/jobs/:id`, `/admin/events`, `/admin/events/:id`, `/admin/announcements`, `/admin/groups`, `/admin/groups/:id`, `/admin/mentorship`, `/admin/messages`, `/admin/reports`, `/admin/notifications`, `/admin/settings`.

## Structure

- `src/data/`: 48 alumni across nine states, jobs, events, batches, companies, messages, notifications.
- `src/context/AppContext.jsx`: local persistence, mock authentication, shared interaction state.
- `src/components/`: reusable layout, UI, feed, cards, analytics, map, and simulated calling.
- `src/pages/`: lazy-loaded public, alumni, and administrative workflows.
- `src/styles.css`: semantic theme tokens, responsive layouts, reduced-motion support.
- `public/countries.geo.json`: simplified geography from johan/world.geo.json (Natural Earth-derived data); illustrative boundaries.

External imagery is served by Unsplash and fonts by Google Fonts. These need internet access; map geometry and records are local. Photos are illustrative and do not identify the fictional alumni.

## Demo behavior and integration points

- Connections, applications, registrations, posts, messages, catalog edits, and preferences persist on this browser. Clear `pantiss:*` localStorage keys and `authRole` to reset the demo.
- Calls simulate calling, connected timers, controls, and ended states. No microphone, camera, WebRTC, or network calling.
- Attachments store only filenames in chat. Post images are limited to 500 KB to protect local storage.
- Export Excel downloads CSV; PDF uses browser print. Report totals are illustrative aggregate data, distinct from the 48 editable profiles. Scheduling saves a demo state and does not run a background scheduler.
- Future API seams: replace context persistence with backend repositories; replace mock login with server sessions and role authorization; connect chat transport and WebRTC signaling; add actual notifications, scheduling, verification documents, and report generation. Never use dummy location data for live tracking.

## Verification

`npm test` runs data/filter checks. With the dev server running at port 5174, `node tests/map-browser.mjs` tests the default admin route, map panning/zoom, selection, cluster interaction, call simulation, and mobile layout using installed Chrome. Override the URL through `BASE_URL` when using another port.
