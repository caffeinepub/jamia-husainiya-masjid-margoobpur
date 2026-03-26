export interface Prayer {
  id: string;
  english: string;
  arabic: string;
  time: string;
  icon: string;
  hour: number;
  minute: number;
}

export const PRAYERS: Prayer[] = [
  {
    id: "fajr",
    english: "Fajr",
    arabic: "الفَجْر",
    time: "5:52 AM",
    icon: "🌙",
    hour: 5,
    minute: 52,
  },
  {
    id: "zohar",
    english: "Zohar",
    arabic: "الظُّهْر",
    time: "2:30 PM",
    icon: "🌅",
    hour: 14,
    minute: 30,
  },
  {
    id: "asr",
    english: "Asr",
    arabic: "العَصْر",
    time: "5:15 PM",
    icon: "☀️",
    hour: 17,
    minute: 15,
  },
  {
    id: "maghrib",
    english: "Maghrib",
    arabic: "المَغْرِب",
    time: "6:25 PM",
    icon: "🌇",
    hour: 18,
    minute: 25,
  },
  {
    id: "isha",
    english: "Isha",
    arabic: "العِشَاء",
    time: "8:30 PM",
    icon: "🌃",
    hour: 20,
    minute: 30,
  },
];

export function getNextPrayer(): Prayer {
  const now = new Date();
  const currentMinutes = now.getHours() * 60 + now.getMinutes();

  for (const prayer of PRAYERS) {
    const prayerMinutes = prayer.hour * 60 + prayer.minute;
    if (prayerMinutes > currentMinutes) {
      return prayer;
    }
  }
  // After Isha — next is Fajr
  return PRAYERS[0];
}
