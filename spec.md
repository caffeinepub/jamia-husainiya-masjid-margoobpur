# Jamia Husainiya Masjid Margoobpur

## Current State
Workspace is empty — full rebuild required.

## Requested Changes (Diff)

### Add
- Full app rebuild with all previously implemented features
- Hindi language throughout UI
- Islamic green theme, mobile-first layout, bottom navigation

### Modify
- N/A (fresh build)

### Remove
- N/A

## Implementation Plan

### App Info
- Name: Jamia Husainiya Masjid Margoobpur
- Address: Margoobpur Deedaheri, Haridwar, Uttarakhand — 247667
- Contact: 089589 99299
- Map coordinates: 29.8629687, 77.9740235
- Admin PIN: 786

### Screens (Bottom Navigation)
1. **नमाज़ (Prayer Times)** - Home screen
2. **सूचना (Announcements)**
3. **संपर्क (Contact)**
4. **नक्शा (Map)**
5. **लोग (People/Committee)**

### Prayer Times Screen
- Prayer list stored in localStorage (admin-editable)
- Prayers: फ़ज्र (5:41 AM), ज़ोहर (1:30 PM), अस्र (5:00 PM), मग़रिब (6:45 PM), इशा (8:30 PM)
- Khutba Juma: 1:30 PM — with "सिर्फ जुमा" badge
- **Juma Display Logic:** On Friday: Khutba Juma appears at TOP with "आज जुमा है" badge. Other days: appears at BOTTOM, dimmed.
- Current prayer auto-highlighted based on time
- **Alarm Bell Feature:** 🔔 button top-right. Bell rings automatically at each prayer time. Red countdown banner appears: "✅ मस्जिद पहुँच गया — Bell बंद करो" button stops it. Auto-stops after 15 minutes.
- **Namaz Alarm Setup Section** at top of screen: Dedicated section with 5 buttons (one per prayer) using Android intent links:
  - फ़ज्र अलार्म: `intent:#Intent;action=android.intent.action.SET_ALARM;S.android.intent.extra.alarm.MESSAGE=Fajr%20Namaz;i.android.intent.extra.alarm.HOUR=5;i.android.intent.extra.alarm.MINUTES=41;end`
  - ज़ोहर अलार्म: `intent:#Intent;action=android.intent.action.SET_ALARM;S.android.intent.extra.alarm.MESSAGE=Zuhr%20Namaz;i.android.intent.extra.alarm.HOUR=13;i.android.intent.extra.alarm.MINUTES=30;end`
  - अस्र अलार्म: `intent:#Intent;action=android.intent.action.SET_ALARM;S.android.intent.extra.alarm.MESSAGE=Asr%20Namaz;i.android.intent.extra.alarm.HOUR=17;i.android.intent.extra.alarm.MINUTES=0;end`
  - मग़रिब अलार्म: `intent:#Intent;action=android.intent.action.SET_ALARM;S.android.intent.extra.alarm.MESSAGE=Maghrib%20Namaz;i.android.intent.extra.alarm.HOUR=18;i.android.intent.extra.alarm.MINUTES=45;end`
  - इशा अलार्म: `intent:#Intent;action=android.intent.action.SET_ALARM;S.android.intent.extra.alarm.MESSAGE=Isha%20Namaz;i.android.intent.extra.alarm.HOUR=20;i.android.intent.extra.alarm.MINUTES=30;end`
  - Use `document.createElement('a') + a.click()` pattern for Android intent links (NOT window.location.href)
  - On non-Android / unsupported: show alert with prayer name and time

### Announcements Screen
- List of notices/announcements
- Admin can add/remove notices via Admin panel
- Data stored in localStorage

### Contact Screen
- Masjid name, address, phone: 089589 99299
- "अभी Call करें" button (tel: link)
- "WhatsApp पर संपर्क करें" button
- **Masjid Committee section**: list of committee members (name, role, phone)
- Data stored in localStorage

### Map Screen
- Embedded map showing coordinates 29.8629687, 77.9740235
- "Google Maps पर Directions लें" button linking to Google Maps with those coordinates

### लोग (People) Panel
- Shows saved committee members from localStorage

### Admin Panel
- Accessible via bottom nav or button
- PIN: 786
- Can edit prayer times
- Can add/remove announcements
- Changes saved to localStorage and trigger `storage` event so NamazScreen updates immediately
- Prayer time highlight recalculates correctly after save (sort prayers by time before finding next)

### Technical Notes
- All UI text in Hindi
- Islamic green color theme
- Mobile-first, PWA-ready
- localStorage for all persistent data
- storage event listener on NamazScreen for real-time updates from Admin panel
