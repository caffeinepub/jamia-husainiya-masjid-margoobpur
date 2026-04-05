# Jamia Husainiya Masjid Margoobpur

## Current State
App exists with all screens but needs a full rebuild to restore all features with correct Hinglish UI, proper prayer times, alarm buttons, Juma logic, and full navigation.

## Requested Changes (Diff)

### Add
- Nothing new — rebuild to match best version

### Modify
- Full app rebuild with all features: Home screen (Bismillah, Assalamu Alaikum, NEXT PRAYER card), Namaz screen (alarm setup section + prayer list with Juma logic), Notice screen, Contact screen (committee management), Map screen, People screen, Admin panel (PIN 786)
- Hinglish UI throughout
- Bottom nav: Home, Namaz, Notice, Contact, Map, लोग, Admin (7 tabs)
- Alarm buttons using document.createElement('a') + a.click() method
- Juma display logic: Fridays Khutba Juma at top with badge, other days at bottom dimmed
- Bell feature with 15 min auto-stop

### Remove
- Nothing

## Implementation Plan
1. Rebuild HomeScreen with Bismillah, greeting, welcome, NEXT PRAYER card
2. Rebuild NamazScreen with alarm setup section and prayer cards with Juma logic
3. Rebuild all other screens (Notice, Contact, Map, People, Admin)
4. Ensure bottom nav has all 7 tabs
5. Validate and deploy
