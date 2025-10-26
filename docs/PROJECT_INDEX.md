# OnTonight — Master Project Index (v1)

## Status Board
- ✅ Done: Branding, SPA routing, Light/Dark, Regulars counter, Share link, Vercel deploy
- 🚧 In Progress: Persona visuals, feed card polish, motion tweaks, pitch visuals
- 🔜 Next: Venue Pilot (Tampa), basic identity, analytics, intake form + playbook

## Product Narrative
Your night. Your people. **Where regulars are made.**
We turn guests into regulars through recognition, connection, and repeat visits.

## Screens & UX
- Splash → Explore Tonight
- Feed (Tonight Near You) → venue cards
- Profile (3 personas) → “Become a Regular”, Share link
- Bottom nav + toasts
- Ocean Night theme + glow accents

## Engineering
- Next.js (Pages Router), pretty hash routing (`/#/feed`, `/#/profile/ari`)
- Data via `public/data.json`
- LocalStorage: Regulars counter per profile
- Vercel ready (auto deploy per push)

## Roadmap
- **Sprint 1 (Pilot-ready)**: Persona images, card polish, analytics, venue intake
- **Sprint 2 (Retention loop)**: Identity (light), QR check-in (stub), “I’ll be there” toggle
- **Sprint 3 (Growth)**: Share flows, invite a regular, venue dashboard (skeleton)

## Pilot (Tampa)
Targets: Ulele, Haiku Tampa, Beacon Rooftop (plus 1–2 adds)
Metrics: profile views, “regular” taps, share link copies, check-in proxy

## Repo Structure
OnTonightApp/
├─ pages/
├─ public/
│ └─ data/
├─ styles/
├─ docs/
└─ README.md
