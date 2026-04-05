export interface PrayerInfo {
  name: string;
  displayName: string;
  time: string;
  enable: boolean;
  isJuma?: boolean;
}

export const PRAYER_DISPLAY_NAMES: Record<string, string> = {
  fajr: "Fajr",
  zuhr: "Zuhr",
  asr: "Asr",
  maghrib: "Maghrib",
  isha: "Isha",
  khutba_juma: "Khutba Juma",
  juma: "Juma",
};

export function parseTime(timeStr: string): number {
  if (!timeStr) return 0;
  const clean = timeStr.trim();
  // Handle 12-hour format (e.g. "1:30 PM", "5:41 AM")
  const match12 = clean.match(/^(\d{1,2}):(\d{2})\s*(AM|PM)$/i);
  if (match12) {
    let h = Number.parseInt(match12[1], 10);
    const m = Number.parseInt(match12[2], 10);
    const meridiem = match12[3].toUpperCase();
    if (meridiem === "AM" && h === 12) h = 0;
    if (meridiem === "PM" && h !== 12) h += 12;
    return h * 60 + m;
  }
  // Handle 24-hour format (e.g. "13:30")
  const match24 = clean.match(/^(\d{1,2}):(\d{2})$/);
  if (match24) {
    const h = Number.parseInt(match24[1], 10);
    const m = Number.parseInt(match24[2], 10);
    return h * 60 + m;
  }
  return 0;
}

export function getCurrentPrayer(prayers: PrayerInfo[]): string | null {
  const now = new Date();
  const currentMinutes = now.getHours() * 60 + now.getMinutes();

  const sorted = [...prayers]
    .filter((p) => p.enable && p.name !== "khutba_juma" && p.name !== "juma")
    .sort((a, b) => parseTime(a.time) - parseTime(b.time));

  let current: string | null = null;
  for (const prayer of sorted) {
    if (parseTime(prayer.time) <= currentMinutes) {
      current = prayer.name;
    }
  }
  return current;
}

export function isAndroid(): boolean {
  return /android/i.test(navigator.userAgent);
}

export function launchAndroidAlarm(intentUrl: string, fallbackMsg: string) {
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
    label: "Fajr (5:41 AM)",
    displayName: "Fajr",
    time: "5:41 AM",
  },
  zuhr: {
    intent:
      "intent:#Intent;action=android.intent.action.SET_ALARM;S.android.intent.extra.alarm.MESSAGE=Zuhr%20Namaz;i.android.intent.extra.alarm.HOUR=13;i.android.intent.extra.alarm.MINUTES=30;end",
    label: "Zuhr (1:30 PM)",
    displayName: "Zuhr",
    time: "1:30 PM",
  },
  asr: {
    intent:
      "intent:#Intent;action=android.intent.action.SET_ALARM;S.android.intent.extra.alarm.MESSAGE=Asr%20Namaz;i.android.intent.extra.alarm.HOUR=17;i.android.intent.extra.alarm.MINUTES=0;end",
    label: "Asr (5:00 PM)",
    displayName: "Asr",
    time: "5:00 PM",
  },
  maghrib: {
    intent:
      "intent:#Intent;action=android.intent.action.SET_ALARM;S.android.intent.extra.alarm.MESSAGE=Maghrib%20Namaz;i.android.intent.extra.alarm.HOUR=18;i.android.intent.extra.alarm.MINUTES=45;end",
    label: "Maghrib (6:45 PM)",
    displayName: "Maghrib",
    time: "6:45 PM",
  },
  isha: {
    intent:
      "intent:#Intent;action=android.intent.action.SET_ALARM;S.android.intent.extra.alarm.MESSAGE=Isha%20Namaz;i.android.intent.extra.alarm.HOUR=20;i.android.intent.extra.alarm.MINUTES=30;end",
    label: "Isha (8:30 PM)",
    displayName: "Isha",
    time: "8:30 PM",
  },
};
