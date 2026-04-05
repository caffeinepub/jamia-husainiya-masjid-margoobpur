import { useEffect, useState } from "react";
import type { Tab } from "../App";
import { usePrayerTimes } from "../hooks/useQueries";
import { getCurrentPrayer, parseTime } from "../utils/prayerUtils";

interface Props {
  onTabChange: (tab: Tab) => void;
}

export function HomeScreen({ onTabChange }: Props) {
  const [now, setNow] = useState(new Date());
  const { data: prayers = [] } = usePrayerTimes();

  useEffect(() => {
    const timer = setInterval(() => setNow(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  const timeStr = now.toLocaleTimeString("en-IN", {
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
    hour12: true,
  });

  const dateStr = now.toLocaleDateString("hi-IN", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  const isFriday = now.getDay() === 5;
  const currentPrayerName = getCurrentPrayer(
    prayers.map((p) => ({ ...p, displayName: p.name, isJuma: false })),
  );

  const currentPrayerData = prayers.find((p) => p.name === currentPrayerName);

  const displayNames: Record<string, string> = {
    fajr: "Fajr",
    zuhr: "Zuhr",
    asr: "Asr",
    maghrib: "Maghrib",
    isha: "Isha",
    khutba_juma: "Khutba Juma",
  };

  // Find next prayer
  const currentMinutes = now.getHours() * 60 + now.getMinutes();
  const regularPrayers = prayers
    .filter((p) => p.enable && p.name !== "khutba_juma" && p.name !== "juma")
    .sort((a, b) => parseTime(a.time) - parseTime(b.time));

  const nextPrayer =
    regularPrayers.find((p) => parseTime(p.time) > currentMinutes) ||
    regularPrayers[0];

  return (
    <div className="flex flex-col">
      {/* Islamic Banner */}
      <div
        className="relative overflow-hidden"
        style={{
          background:
            "linear-gradient(135deg, #0f4a29 0%, #1a6b3a 50%, #0f4a29 100%)",
          minHeight: 160,
        }}
      >
        {/* Decorative pattern */}
        <div className="absolute inset-0 opacity-10" aria-hidden="true">
          <svg
            role="img"
            aria-label="Decorative Islamic pattern"
            width="100%"
            height="100%"
            xmlns="http://www.w3.org/2000/svg"
          >
            <title>Decorative pattern</title>
            <defs>
              <pattern
                id="homestar"
                x="0"
                y="0"
                width="50"
                height="50"
                patternUnits="userSpaceOnUse"
              >
                <polygon
                  points="25,3 29,17 43,17 32,26 36,40 25,31 14,40 18,26 7,17 21,17"
                  fill="white"
                  fillOpacity="0.5"
                />
              </pattern>
            </defs>
            <rect width="100%" height="100%" fill="url(#homestar)" />
          </svg>
        </div>
        <div className="relative z-10 flex flex-col items-center justify-center py-6 px-4">
          <div
            className="text-4xl font-bold"
            style={{ color: "#c9a84c", letterSpacing: 2 }}
          >
            {timeStr}
          </div>
          <div
            className="text-sm mt-1"
            style={{ color: "rgba(255,255,255,0.8)" }}
          >
            {dateStr}
          </div>
          {isFriday && (
            <div
              className="mt-2 px-3 py-1 rounded-full text-xs font-bold"
              style={{ background: "#c9a84c", color: "#0f4a29" }}
            >
              🕌 Aaj Juma Mubarak!
            </div>
          )}
        </div>
      </div>

      <div className="p-4 flex flex-col gap-4">
        {/* Current / Next Namaz Card */}
        <div
          className="rounded-2xl overflow-hidden shadow-card"
          style={{ background: "#1a6b3a" }}
        >
          <div className="p-4">
            <div className="flex items-center justify-between mb-3">
              <span className="text-white font-bold text-base">
                ⏰ Abhi ka Waqt
              </span>
              <button
                type="button"
                onClick={() => onTabChange("namaz")}
                className="text-xs px-3 py-1 rounded-full font-semibold"
                style={{ background: "#c9a84c", color: "#0f4a29" }}
                data-ocid="home.namaz_times.button"
              >
                Sab Times →
              </button>
            </div>

            {currentPrayerData ? (
              <div className="flex items-center gap-3">
                <div
                  className="w-12 h-12 rounded-full flex items-center justify-center text-xl"
                  style={{ background: "rgba(201,168,76,0.25)" }}
                >
                  🕌
                </div>
                <div>
                  <div className="text-white text-xs opacity-70">
                    Chal rahi namaz
                  </div>
                  <div className="text-white font-bold text-xl">
                    {displayNames[currentPrayerData.name] ||
                      currentPrayerData.name}
                  </div>
                  <div style={{ color: "#c9a84c" }} className="font-semibold">
                    {currentPrayerData.time}
                  </div>
                </div>
              </div>
            ) : (
              <div className="text-white text-sm opacity-80">
                Koi active namaz nahi
              </div>
            )}

            {nextPrayer && (
              <div
                className="mt-3 pt-3 flex items-center gap-2"
                style={{ borderTop: "1px solid rgba(255,255,255,0.15)" }}
              >
                <span
                  className="text-xs"
                  style={{ color: "rgba(255,255,255,0.7)" }}
                >
                  Agle Namaz:
                </span>
                <span className="text-white text-xs font-semibold">
                  {displayNames[nextPrayer.name] || nextPrayer.name} —{" "}
                  {nextPrayer.time}
                </span>
              </div>
            )}
          </div>
        </div>

        {/* Quick Action Cards */}
        <div className="text-sm font-bold" style={{ color: "#0f4a29" }}>
          Quick Access
        </div>
        <div className="grid grid-cols-2 gap-3">
          <button
            type="button"
            onClick={() => onTabChange("namaz")}
            className="rounded-xl p-4 flex flex-col items-start gap-2 shadow-card"
            style={{ background: "white" }}
            data-ocid="home.namaz.button"
          >
            <span className="text-2xl">🕌</span>
            <span className="font-bold text-sm" style={{ color: "#0f4a29" }}>
              Namaz Times
            </span>
            <span className="text-xs" style={{ color: "#666" }}>
              Sab waqt dekhein
            </span>
          </button>
          <button
            type="button"
            onClick={() => onTabChange("notice")}
            className="rounded-xl p-4 flex flex-col items-start gap-2 shadow-card"
            style={{ background: "white" }}
            data-ocid="home.notice.button"
          >
            <span className="text-2xl">📢</span>
            <span className="font-bold text-sm" style={{ color: "#0f4a29" }}>
              Notices
            </span>
            <span className="text-xs" style={{ color: "#666" }}>
              Announcements dekhein
            </span>
          </button>
          <button
            type="button"
            onClick={() => onTabChange("contact")}
            className="rounded-xl p-4 flex flex-col items-start gap-2 shadow-card"
            style={{ background: "white" }}
            data-ocid="home.contact.button"
          >
            <span className="text-2xl">📞</span>
            <span className="font-bold text-sm" style={{ color: "#0f4a29" }}>
              Contact karo
            </span>
            <span className="text-xs" style={{ color: "#666" }}>
              Masjid se milein
            </span>
          </button>
          <button
            type="button"
            onClick={() => onTabChange("map")}
            className="rounded-xl p-4 flex flex-col items-start gap-2 shadow-card"
            style={{ background: "white" }}
            data-ocid="home.map.button"
          >
            <span className="text-2xl">🗺️</span>
            <span className="font-bold text-sm" style={{ color: "#0f4a29" }}>
              Map dekhein
            </span>
            <span className="text-xs" style={{ color: "#666" }}>
              Location & Directions
            </span>
          </button>
        </div>

        {/* Masjid Info */}
        <div
          className="rounded-2xl p-4 shadow-card"
          style={{ background: "white" }}
        >
          <div className="flex items-center gap-2 mb-2">
            <span className="text-lg">☪️</span>
            <span className="font-bold text-sm" style={{ color: "#0f4a29" }}>
              Masjid ke baare mein
            </span>
          </div>
          <p className="text-xs" style={{ color: "#555" }}>
            📍 Margoobpur Deedaheri, Haridwar, Uttarakhand — 247667
          </p>
          <p className="text-xs mt-1" style={{ color: "#555" }}>
            📞 089589 99299
          </p>
        </div>
      </div>
    </div>
  );
}
