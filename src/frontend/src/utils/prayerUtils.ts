export function normalizePrayerName(name: string): string {
  const lower = name.toLowerCase().trim();
  if (
    lower === "khutbajuma" ||
    lower === "khutba juma" ||
    lower === "khutba_juma"
  ) {
    return "khutba_juma";
  }
  return lower.replace(/\s+/g, "_");
}

export function isJumaPrayer(name: string): boolean {
  const n = normalizePrayerName(name);
  return n === "khutba_juma" || n === "juma";
}

export function parseTime(timeStr: string): number {
  if (!timeStr) return 0;
  const clean = timeStr.trim();
  const match12 = clean.match(/^(\d{1,2}):(\d{2})\s*(AM|PM)$/i);
  if (match12) {
    let h = Number.parseInt(match12[1], 10);
    const m = Number.parseInt(match12[2], 10);
    const meridiem = match12[3].toUpperCase();
    if (meridiem === "AM" && h === 12) h = 0;
    if (meridiem === "PM" && h !== 12) h += 12;
    return h * 60 + m;
  }
  const match24 = clean.match(/^(\d{1,2}):(\d{2})$/);
  if (match24) {
    const h = Number.parseInt(match24[1], 10);
    const m = Number.parseInt(match24[2], 10);
    return h * 60 + m;
  }
  return 0;
}

export function getDisplayName(name: string): string {
  const n = normalizePrayerName(name);
  const map: Record<string, string> = {
    fajr: "Fajr",
    zuhr: "Zuhr",
    asr: "Asr",
    maghrib: "Maghrib",
    isha: "Isha",
    khutba_juma: "Khutba Juma",
    juma: "Juma",
  };
  return map[n] || name;
}

export function isAndroid(): boolean {
  return /android/i.test(navigator.userAgent);
}

export function launchAlarm(intentUrl: string, fallbackMsg: string) {
  if (isAndroid()) {
    const a = document.createElement("a");
    a.href = intentUrl;
    a.style.display = "none";
    document.body.appendChild(a);
    a.click();
    setTimeout(() => document.body.removeChild(a), 1000);
  } else {
    alert(`iPhone/Desktop: Clock app mein manually set karo\n\n${fallbackMsg}`);
  }
}

export const ALARM_INTENTS = {
  fajr: {
    intent:
      "intent:#Intent;action=android.intent.action.SET_ALARM;S.android.intent.extra.alarm.MESSAGE=Fajr%20Namaz;i.android.intent.extra.alarm.HOUR=5;i.android.intent.extra.alarm.MINUTES=41;end",
    displayName: "Fajr",
    time: "5:41 AM",
  },
  zuhr: {
    intent:
      "intent:#Intent;action=android.intent.action.SET_ALARM;S.android.intent.extra.alarm.MESSAGE=Zuhr%20Namaz;i.android.intent.extra.alarm.HOUR=13;i.android.intent.extra.alarm.MINUTES=30;end",
    displayName: "Zuhr",
    time: "1:30 PM",
  },
  asr: {
    intent:
      "intent:#Intent;action=android.intent.action.SET_ALARM;S.android.intent.extra.alarm.MESSAGE=Asr%20Namaz;i.android.intent.extra.alarm.HOUR=17;i.android.intent.extra.alarm.MINUTES=0;end",
    displayName: "Asr",
    time: "5:00 PM",
  },
  maghrib: {
    intent:
      "intent:#Intent;action=android.intent.action.SET_ALARM;S.android.intent.extra.alarm.MESSAGE=Maghrib%20Namaz;i.android.intent.extra.alarm.HOUR=18;i.android.intent.extra.alarm.MINUTES=45;end",
    displayName: "Maghrib",
    time: "6:45 PM",
  },
  isha: {
    intent:
      "intent:#Intent;action=android.intent.action.SET_ALARM;S.android.intent.extra.alarm.MESSAGE=Isha%20Namaz;i.android.intent.extra.alarm.HOUR=20;i.android.intent.extra.alarm.MINUTES=30;end",
    displayName: "Isha",
    time: "8:30 PM",
  },
};
