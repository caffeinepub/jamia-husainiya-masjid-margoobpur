# Jamia Husainiya Masjid Margoobpur

## Current State
Workspace is empty — full rebuild required. This is a strict restoration of the previously built mosque PWA app.

## Requested Changes (Diff)

### Add
- Full mosque PWA app with all original features restored exactly

### Modify
- N/A (fresh rebuild matching the exact previous version)

### Remove
- N/A

## Implementation Plan

### Backend (Motoko)
Manage prayer times, notices, committee members, and admin state:
- Prayer times: name (Fajr, Zuhr, Asr, Maghrib, Isha, Khutba Juma), time string, isJuma flag
- Notices: simple text entries (title + body)
- Committee members: name, role, phone
- Admin PIN check: PIN is 786
- CRUD operations for prayer times, notices, committee members

### Frontend — Exact Restoration

**Global Design:**
- Islamic green theme (`#1a7a3c` / `#145e2e` tones)
- Simple, clean layout — NO gradients, NO banners, NO modern cards with heavy shadows
- Mobile-first PWA
- Language: Hinglish (Hindi + English mix)

**Bottom Navigation — EXACTLY 5 buttons:**
1. Home
2. Namaz
3. Contact
4. Map
5. Admin

**Home Screen:**
- Top section: ☪ crescent icon on LEFT, AI-style mosque image in CENTER, ☪ crescent icon on RIGHT
- Masjid name: "Jamia Husainiya Masjid Margoobpur"
- Middle: "Assalamu Alaikum" text
- Below: "Coming Soon" next prayer display — format: "Zuhr prayer at 1:30 PM"
- Notices section below — simple plain text list, NO cards, NO boxes

**Namaz Screen:**
- Namaz Alarm Setup section at top (Hinglish labels, Android intent links for each prayer)
- Prayer times list: Fajr 5:41, Zuhr 1:30, Asr 5:00, Maghrib 6:45, Isha 8:30, Khutba Juma 1:30 (Sirf Juma badge)
- Juma logic: Friday = Khutba Juma at top with "Aaj Juma hai" badge; other days = dimmed at bottom
- 🔔 alarm bell button top-right; auto-rings at prayer time, stops after 15 min or on user confirmation

**Contact Screen:**
- Phone: 089589 99299 (Call Now + WhatsApp buttons)
- Masjid Committee section: add/remove members (name, role, phone)

**Map Screen:**
- Location: 29.8629687, 77.9740235
- "Google Maps par Directions len" button

**Admin Screen:**
- PIN: 786
- Edit prayer times
- Edit notices
- Manage committee members

### Alarm Intent URLs
- Fajr: `intent:#Intent;action=android.intent.action.SET_ALARM;S.android.intent.extra.alarm.MESSAGE=Fajr%20Namaz;i.android.intent.extra.alarm.HOUR=5;i.android.intent.extra.alarm.MINUTES=41;end`
- Zuhr: `intent:#Intent;action=android.intent.action.SET_ALARM;S.android.intent.extra.alarm.MESSAGE=Zuhr%20Namaz;i.android.intent.extra.alarm.HOUR=13;i.android.intent.extra.alarm.MINUTES=30;end`
- Asr: `intent:#Intent;action=android.intent.action.SET_ALARM;S.android.intent.extra.alarm.MESSAGE=Asr%20Namaz;i.android.intent.extra.alarm.HOUR=17;i.android.intent.extra.alarm.MINUTES=0;end`
- Maghrib: `intent:#Intent;action=android.intent.action.SET_ALARM;S.android.intent.extra.alarm.MESSAGE=Maghrib%20Namaz;i.android.intent.extra.alarm.HOUR=18;i.android.intent.extra.alarm.MINUTES=45;end`
- Isha: `intent:#Intent;action=android.intent.action.SET_ALARM;S.android.intent.extra.alarm.MESSAGE=Isha%20Namaz;i.android.intent.extra.alarm.HOUR=20;i.android.intent.extra.alarm.MINUTES=30;end`
