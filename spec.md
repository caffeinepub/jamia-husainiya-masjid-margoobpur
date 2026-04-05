# Jamia Husainiya Masjid Margoobpur

## Current State
Workspace is empty — no existing code. Full rebuild required.

## Requested Changes (Diff)

### Add
- Full PWA mobile-first app for Jamia Husainiya Masjid Margoobpur
- Home screen: ☪ Jamia Husainiya Masjid Margoobpur ☪, Bismillah (Arabic), Assalamu Alaikum greeting (Arabic + English), welcome message, NEXT PRAYER card (English + Arabic name, time, Soon badge)
- Namaz screen: Prayer times list with current prayer highlighted, Khutba Juma with Sirf Juma badge, Juma display logic (Friday: top with 'Aaj Juma hai', other days: bottom dimmed), Namaz Alarm Setup section at top with per-prayer Android intent alarm buttons in Hinglish
- Notice screen: Announcements list managed by Admin
- Contact screen: Masjid info, Call Now (089589 99299), WhatsApp, Masjid Committee section (add/remove members: name, role, phone)
- Map screen: Embedded map at coordinates 29.8629687, 77.9740235, Google Maps directions button
- लोग (People) screen: Shows committee members
- Admin screen: PIN-protected (786), manage prayer times and notices
- Bottom navigation: Home, Namaz, Notice, Contact, Map, लोग, Admin
- 🔔 Alarm bell button in top-right on Namaz screen; auto-rings at prayer time, stops after 15 min or user confirms arrival
- Red banner with countdown and '✅ मस्जिद पहुँच गया — Bell बंद करो'
- All UI in Hinglish (Hindi + English mix)
- Data persists via localStorage

### Modify
- N/A (fresh build)

### Remove
- N/A

## Implementation Plan
1. Single-page React app with tab-based navigation (7 tabs)
2. localStorage for prayer times, notices, committee members
3. Prayer time logic: auto-highlight current prayer based on time
4. Juma logic: Friday = Khutba Juma at top with badge, other days = bottom dimmed
5. Android intent-based alarm buttons using document.createElement('a') + a.click()
6. Admin panel with PIN 786 protecting edit capabilities
7. Map using OpenStreetMap iframe embed
8. Committee CRUD in Contact screen
9. Bell alarm feature with countdown timer
10. Islamic green theme, mobile-first layout
