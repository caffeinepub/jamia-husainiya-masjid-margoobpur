# Jamia Husainiya Masjid Margoobpur

## Current State
Workspace is empty — full rebuild required. Previous version (v17) had all features but UI was entirely in pure Hindi. User wants Hinglish (Hindi + English mixed) language style.

## Requested Changes (Diff)

### Add
- Full app rebuild with Hinglish language (mix of Hindi script and English words)
- Example style: "Namaz ka Time", "Alarm Set karo", "Admin Panel", "Aaj ka Din"

### Modify
- All UI labels, headings, buttons, messages: Hinglish style instead of pure Hindi
- Navigation labels: Hinglish (e.g. "Home", "Namaz Time", "Notice", "Contact", "Map")
- Prayer names stay as-is (Fajr, Zuhr, Asr, Maghrib, Isha — standard transliteration)

### Remove
- Pure Hindi-only text

## Implementation Plan

### Backend (Motoko)
- Store prayer times: Fajr, Zuhr, Asr, Maghrib, Isha, Khutba Juma
- Store announcements/notices
- Store committee members (name, role, phone)
- Admin PIN validation (786)

### Frontend
- **Bottom navigation** (5 tabs): Home, Namaz Time, Notice, Contact, Map
- **Home screen**: App name, masjid address, current time, today's highlighted prayer
- **Namaz Time screen**:
  - Namaz Alarm Setup section at top with per-prayer alarm buttons (Android intent links)
  - Prayer time cards with current prayer highlighted
  - Juma display logic: Friday = Khutba at top with "Aaj Juma Hai" badge; other days = bottom dimmed
  - Alarm bell (🔔) in top-right, auto-rings at prayer time, stops after 15 min or manual dismiss
  - Red countdown banner with "Masjid pahunch gaya — Bell band karo" button
- **Notice screen**: List of announcements managed by admin
- **Contact screen**: Phone call + WhatsApp button (089589 99299), Masjid Committee section to add/remove members
- **Map screen**: Embedded map at coordinates 29.8629687, 77.9740235 + Google Maps directions button
- **Admin Panel**: PIN 786, manage prayer times and notices
- **Log (People) Panel**: Shows saved committee members
- **Language style**: Hinglish throughout — mix Hindi words written in Hindi script with common English words (Time, Alarm, Set, Admin, Notice, Contact, Map, etc.)
- **Theme**: Islamic green
- **PWA**: Mobile-first design

### Alarm intent links (pre-filled):
- Fajr: HOUR=5, MINUTES=41
- Zuhr: HOUR=13, MINUTES=30
- Asr: HOUR=17, MINUTES=0
- Maghrib: HOUR=18, MINUTES=45
- Isha: HOUR=20, MINUTES=30

### Key data:
- Masjid name: Jamia Husainiya Masjid Margoobpur
- Address: Margoobpur Deedaheri, Haridwar, Uttarakhand — 247667
- Phone: 089589 99299
- Map: 29.8629687, 77.9740235
- Admin PIN: 786
