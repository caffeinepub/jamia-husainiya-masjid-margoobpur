import { useEffect, useState } from "react";
import { PRAYERS, getNextPrayer } from "../data/prayers";
import type { Prayer } from "../data/prayers";

const PRAYER_TIMES_KEY = "masjid_prayer_times";

type PrayerTimes = Record<string, string>;

function loadPrayerTimes(): PrayerTimes | null {
  try {
    const s = localStorage.getItem(PRAYER_TIMES_KEY);
    if (s) return JSON.parse(s) as PrayerTimes;
  } catch {}
  return null;
}

function to12h(t: string): string {
  const [hStr, mStr] = t.split(":");
  let h = Number.parseInt(hStr, 10);
  const m = mStr;
  const suffix = h >= 12 ? "PM" : "AM";
  if (h > 12) h -= 12;
  if (h === 0) h = 12;
  return `${h}:${m} ${suffix}`;
}

function getEffectivePrayers(savedTimes: PrayerTimes | null): Prayer[] {
  if (!savedTimes) return PRAYERS;
  return PRAYERS.map((p) => {
    const t = savedTimes[p.id];
    if (!t) return p;
    const [hStr, mStr] = t.split(":");
    return {
      ...p,
      time: to12h(t),
      hour: Number.parseInt(hStr, 10),
      minute: Number.parseInt(mStr, 10),
    };
  });
}

function getNextPrayerFromList(prayers: Prayer[]): Prayer {
  const now = new Date();
  const currentMinutes = now.getHours() * 60 + now.getMinutes();
  for (const prayer of prayers) {
    if (prayer.hour * 60 + prayer.minute > currentMinutes) return prayer;
  }
  return prayers[0];
}

export function NamazScreen() {
  const [savedTimes, setSavedTimes] = useState<PrayerTimes | null>(
    loadPrayerTimes,
  );

  useEffect(() => {
    const onFocus = () => setSavedTimes(loadPrayerTimes());
    window.addEventListener("focus", onFocus);
    return () => window.removeEventListener("focus", onFocus);
  }, []);

  const prayers = getEffectivePrayers(savedTimes);
  const nextPrayer = savedTimes
    ? getNextPrayerFromList(prayers)
    : getNextPrayer();

  const today = new Date().toLocaleDateString("en-IN", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  return (
    <div className="px-4 py-5" data-ocid="namaz.page">
      {/* Title */}
      <div className="mb-5">
        <h2 className="font-bold text-xl" style={{ color: "#1a6b3c" }}>
          Prayer Times
        </h2>
        <p className="text-xs text-gray-500 mt-0.5">{today}</p>
      </div>

      {/* Decorative Islamic banner */}
      <div
        className="rounded-2xl p-4 mb-5 text-center relative overflow-hidden"
        style={{ background: "#1a6b3c" }}
      >
        <div
          className="absolute inset-0 opacity-10 pointer-events-none"
          aria-hidden="true"
        >
          <svg
            role="img"
            aria-label="decorative pattern"
            width="100%"
            height="100%"
          >
            <defs>
              <pattern
                id="geo"
                x="0"
                y="0"
                width="30"
                height="30"
                patternUnits="userSpaceOnUse"
              >
                <polygon
                  points="15,1 18,10 28,10 20,16 23,26 15,20 7,26 10,16 2,10 12,10"
                  fill="white"
                  fillOpacity="0.5"
                />
              </pattern>
            </defs>
            <rect width="100%" height="100%" fill="url(#geo)" />
          </svg>
        </div>
        <p className="text-white font-bold text-base relative">أَقِيمُوا الصَّلَاةَ</p>
        <p className="text-xs relative mt-1" style={{ color: "#c9a84c" }}>
          Establish the Prayer
        </p>
      </div>

      {/* Prayer cards */}
      <div className="space-y-3">
        {prayers.map((prayer) => {
          const isNext = prayer.id === nextPrayer.id;
          return (
            <div
              key={prayer.id}
              className="rounded-2xl p-4 shadow-card flex items-center gap-4 transition-all"
              style={{ background: isNext ? "#1a6b3c" : "white" }}
              data-ocid={`namaz.${prayer.id}.card`}
            >
              <div
                className="w-12 h-12 rounded-xl flex items-center justify-center text-2xl flex-shrink-0"
                style={{
                  background: isNext ? "rgba(255,255,255,0.15)" : "#e8f5ee",
                }}
              >
                {prayer.icon}
              </div>
              <div className="flex-1">
                <p
                  className="text-xs mb-0.5"
                  style={{
                    color: isNext ? "rgba(255,255,255,0.7)" : "#888",
                    fontFamily: "serif",
                  }}
                >
                  {prayer.arabic}
                </p>
                <p
                  className="font-bold text-base"
                  style={{ color: isNext ? "white" : "#1a6b3c" }}
                >
                  {prayer.english}
                </p>
              </div>
              <div className="text-right">
                <p
                  className="font-bold text-xl"
                  style={{ color: isNext ? "white" : "#1a6b3c" }}
                >
                  {prayer.time}
                </p>
                {isNext && (
                  <span
                    className="text-xs px-2 py-0.5 rounded-full font-bold"
                    style={{ background: "#c9a84c", color: "#0f4a29" }}
                  >
                    Next Prayer
                  </span>
                )}
              </div>
            </div>
          );
        })}
      </div>

      <p className="text-center text-xs text-gray-400 mt-5">
        Times are approximate. Verify with local Islamic authority.
      </p>
    </div>
  );
}
