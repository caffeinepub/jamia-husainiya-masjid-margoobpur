# Jamia Husainiya Masjid Margoobpur

## Current State
The app currently has all major features but the user says recent (last night) changes have altered things. The user wants the app restored to its March 26, 2026 state — which corresponds to Version 22/25/26 of the app.

Key features that must be present:
- Hinglish UI (Hindi + English mix)
- Home screen: IslamicHeader, mosque illustration, Assalamu Alaikum card, NEXT PRAYER card, quick access grid
- Namaz screen: Alarm Setup section at top, prayer times list with Juma logic
- Notice, Contact (with Committee management), Map (coordinates 29.8629687, 77.9740235), People, Admin screens
- Bottom nav: Home, Namaz, Notice, Contact, Map, लोग, Admin
- Admin panel PIN: 786
- Contact: 089589 99299
- Bell alarm feature
- Android intent alarm buttons

## Requested Changes (Diff)

### Add
- Nothing new to add

### Modify
- Restore all screens to their March 26 state with correct Hinglish text
- Ensure prayer data is clean (no duplicates like Zuhr/Dhuhr)
- Ensure all features work correctly

### Remove
- Any changes introduced after March 26 that broke the app

## Implementation Plan
1. Write a clean, complete App.tsx with proper bottom nav (7 tabs)
2. Rebuild HomeScreen with IslamicHeader, mosque image, greeting card, next prayer card
3. Rebuild NamazScreen with alarm setup section and clean prayer list
4. Rebuild ContactScreen with committee management
5. Rebuild MapScreen with correct coordinates
6. Rebuild AdminScreen (PIN: 786)
7. Rebuild NoticeScreen and PeopleScreen
8. Ensure all data files are correct
