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

export function getNextPrayer(prayers: PrayerInfo[]): PrayerInfo | null {
  const now = new Date();
  const currentMinutes = now.getHours() * 60 + now.getMinutes();

  const sorted = [...prayers]
    .filter((p) => p.enable && p.name !== "khutba_juma" && p.name !== "juma")
    .sort((a, b) => parseTime(a.time) - parseTime(b.time));

  return (
    sorted.find((p) => parseTime(p.time) > currentMinutes) || sorted[0] || null
  );
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

export function buildAlarmIntent(
  prayerName: string,
  hour: number,
  minute: number,
): string {
  const encodedName = encodeURIComponent(`${prayerName} Namaz`);
  return `intent:#Intent;action=android.intent.action.SET_ALARM;S.android.intent.extra.alarm.MESSAGE=${encodedName};i.android.intent.extra.alarm.HOUR=${hour};i.android.intent.extra.alarm.MINUTES=${minute};end`;
}

export const ALARM_INTENTS = {
  fajr: {
    intent: buildAlarmIntent("Fajr", 5, 41),
    label: "Fajr (5:41 AM)",
    displayName: "Fajr",
    time: "5:41 AM",
  },
  zuhr: {
    intent: buildAlarmIntent("Zuhr", 13, 30),
    label: "Zuhr (1:30 PM)",
    displayName: "Zuhr",
    time: "1:30 PM",
  },
  asr: {
    intent: buildAlarmIntent("Asr", 17, 0),
    label: "Asr (5:00 PM)",
    displayName: "Asr",
    time: "5:00 PM",
  },
  maghrib: {
    intent: buildAlarmIntent("Maghrib", 18, 45),
    label: "Maghrib (6:45 PM)",
    displayName: "Maghrib",
    time: "6:45 PM",
  },
  isha: {
    intent: buildAlarmIntent("Isha", 20, 30),
    label: "Isha (8:30 PM)",
    displayName: "Isha",
    time: "8:30 PM",
  },
};
