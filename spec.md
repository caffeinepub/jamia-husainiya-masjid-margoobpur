# Jamia Husainiya Masjid Margoobpur — UI Redesign

## Current State
The app is a full-stack mosque PWA with:
- `App.tsx` — root layout with bottom navigation (Home, Namaz, Notice, Contact, Map, लोग, Admin)
- `HomeScreen.tsx` — Home with Bismillah, Assalamu Alaikum, welcome msg, NEXT PRAYER card
- `NamazScreen.tsx` — Prayer times list + Namaz Alarm Setup section with per-prayer Android intent buttons
- `ContactScreen.tsx` — Masjid contact info + Committee member management
- `AdminScreen.tsx` — PIN-protected admin panel (PIN: 786) for managing prayer times, notices, committee
- `MapScreen.tsx` — OpenStreetMap embed + Google Maps directions button
- `NoticeScreen.tsx` — Announcements list
- `PeopleScreen.tsx` — Committee members directory

Current design uses flat dark-green headers, basic card styling, but lacks:
- Ornate Islamic header with Arabic Bismillah prominently displayed
- Mosque image banner
- Rich card-based sections with proper shadows and spacing
- Redesigned bottom navigation icons

## Requested Changes (Diff)

### Add
- **Header redesign**: Dark green Islamic theme (`#0d3d1f` to `#1a6b3a` gradient) with:
  - Arabic text `بسم الله الرحمن الرحيم` prominently at top
  - Mosque name `☪ Jamia Husainiya Masjid Margoobpur ☪` with crescent moon icons on both sides
  - Subtle star/geometric SVG pattern overlay on header background
- **Mosque image banner**: Large banner image `/assets/generated/mosque-banner.dim_800x300.jpg` below header on Home screen, with rounded bottom corners (`rounded-b-2xl`)
- **Welcome card**: Redesigned card with `Assalamu Alaikum` title, `السلام عليكم` Arabic subtitle, and welcome text, using white background with green accent border
- **Next Prayer card**: Dark green card (`#0d3d1f`) with `NEXT PRAYER` label, prayer name in English + Arabic, time, and `Soon` badge in gold/amber
- **Redesigned bottom navigation**: Modern icon-based nav with proper icons for Home, Namaz, Notice, Contact, Map, Login/People, Admin — cleaner tab bar with active state highlighting
- **Soft shadows** on all cards (`shadow-md`)
- **Proper spacing** — consistent `gap-4` / `p-4` throughout

### Modify
- **HomeScreen.tsx**: Full redesign to use mosque banner, welcome card, next prayer card
- **All screen headers**: Upgrade to ornate Islamic header with star pattern background, Bismillah, and masjid name with crescents
- **Bottom nav in App.tsx**: Redesign tab bar icons to be cleaner and more modern
- **Card styling**: All cards get `rounded-2xl`, `shadow-md`, proper padding throughout all screens

### Remove
- Nothing — all features must remain fully functional

## Implementation Plan
1. Update `App.tsx` bottom navigation: redesign tab items with SVG icons or emoji icons, improve active/inactive state styling, cleaner visual tab bar
2. Create a shared `IslamicHeader` component used across all screens — contains dark green gradient background with star pattern SVG overlay, Arabic Bismillah text, masjid name with ☪ crescents
3. Redesign `HomeScreen.tsx`:
   - Show IslamicHeader at top
   - Mosque image banner below header with rounded bottom corners
   - Welcome card (Assalamu Alaikum / السلام عليكم / welcome message)
   - NEXT PRAYER card with dark green style, prayer name, Arabic name, time, Soon badge
4. Update headers in `NamazScreen.tsx`, `ContactScreen.tsx`, `AdminScreen.tsx`, `MapScreen.tsx`, `NoticeScreen.tsx`, `PeopleScreen.tsx` to use richer design
5. Upgrade card styles across all screens: rounded-2xl, shadows, better spacing
6. Validate — typecheck + build
