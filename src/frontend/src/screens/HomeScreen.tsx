import { useEffect, useState } from "react";
import type { Tab } from "../App";
import { usePrayerTimes } from "../hooks/useQueries";
import { getCurrentPrayer, parseTime } from "../utils/prayerUtils";

interface Props {
  onTabChange: (tab: Tab) => void;
}

const DISPLAY_NAMES: Record<string, string> = {
  fajr: "Fajr",
  zuhr: "Zuhr",
  asr: "Asr",
  maghrib: "Maghrib",
  isha: "Isha",
  khutba_juma: "Khutba Juma",
};

const ARABIC_NAMES: Record<string, string> = {
  fajr: "الفجر",
  zuhr: "الظهر",
  asr: "العصر",
  maghrib: "المغرب",
  isha: "العشاء",
  khutba_juma: "خطبة الجمعة",
};

export function HomeScreen({ onTabChange }: Props) {
  const [now, setNow] = useState(new Date());
  const { data: prayers = [] } = usePrayerTimes();

  useEffect(() => {
    const timer = setInterval(() => setNow(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  const isFriday = now.getDay() === 5;
  const currentMinutes = now.getHours() * 60 + now.getMinutes();

  const regularPrayers = prayers
    .filter((p) => p.enable && p.name !== "khutba_juma" && p.name !== "juma")
    .sort((a, b) => parseTime(a.time) - parseTime(b.time));

  const nextPrayer =
    regularPrayers.find((p) => parseTime(p.time) > currentMinutes) ||
    regularPrayers[0];

  const currentPrayerName = getCurrentPrayer(
    regularPrayers.map((p) => ({ ...p, displayName: p.name, isJuma: false })),
  );

  // How soon is next prayer (in minutes)
  const minsUntilNext = nextPrayer
    ? parseTime(nextPrayer.time) - currentMinutes
    : null;
  const soonLabel =
    minsUntilNext !== null && minsUntilNext <= 30 && minsUntilNext >= 0
      ? "Soon"
      : minsUntilNext !== null && minsUntilNext < 0
        ? "Coming up"
        : "";

  return (
    <div className="flex flex-col">
      {/* Hero Islamic Banner */}
      <div
        className="relative overflow-hidden flex flex-col items-center justify-center py-8 px-4"
        style={{
          background:
            "linear-gradient(160deg, #0a3d1e 0%, #1a6b3a 60%, #0f4a29 100%)",
          minHeight: 220,
        }}
      >
        {/* Decorative star pattern */}
        <div className="absolute inset-0 opacity-10" aria-hidden="true">
          <svg
            role="img"
            aria-label="Decorative pattern"
            width="100%"
            height="100%"
            xmlns="http://www.w3.org/2000/svg"
          >
            <title>Decorative Islamic pattern</title>
            <defs>
              <pattern
                id="herostar"
                x="0"
                y="0"
                width="60"
                height="60"
                patternUnits="userSpaceOnUse"
              >
                <polygon
                  points="30,4 35,20 52,20 38,30 43,46 30,36 17,46 22,30 8,20 25,20"
                  fill="white"
                  fillOpacity="0.5"
                />
              </pattern>
            </defs>
            <rect width="100%" height="100%" fill="url(#herostar)" />
          </svg>
        </div>

        {/* Masjid name */}
        <div className="relative z-10 text-center">
          <div className="flex items-center justify-center gap-2 mb-2">
            <span className="text-2xl" style={{ color: "#c9a84c" }}>
              ☪
            </span>
          </div>
          <h2
            className="font-bold text-white text-base mb-1"
            style={{ letterSpacing: "0.05em" }}
          >
            Jamia Husainiya Masjid Margoobpur
          </h2>

          {/* Bismillah */}
          <div
            className="text-lg mb-3"
            style={{ color: "#c9a84c", fontFamily: "serif" }}
          >
            بِسْمِ اللهِ الرَّحْمَنِ الرَّحِيمِ
          </div>

          {/* Greeting */}
          <div
            className="rounded-2xl px-5 py-3 mb-3"
            style={{
              background: "rgba(201,168,76,0.15)",
              border: "1px solid rgba(201,168,76,0.3)",
            }}
          >
            <div className="text-white font-bold text-base">
              Assalamu Alaikum
            </div>
            <div
              className="text-sm"
              style={{ color: "#c9a84c", fontFamily: "serif" }}
            >
              وَعَلَيْكُمُ السَّلام
            </div>
          </div>

          {/* Welcome message */}
          <p
            className="text-xs max-w-xs text-center leading-relaxed"
            style={{ color: "rgba(255,255,255,0.8)" }}
          >
            Welcome to Jamia Husainiya Masjid Margoobpur. May Allah bless you
            and your family. Join us for daily prayers, Friday Khutba, and
            community events.
          </p>

          {isFriday && (
            <div
              className="mt-3 px-3 py-1 rounded-full text-xs font-bold inline-block"
              style={{ background: "#c9a84c", color: "#0f4a29" }}
            >
              🕌 Aaj Juma Mubarak!
            </div>
          )}
        </div>
      </div>

      <div className="p-4 flex flex-col gap-4">
        {/* NEXT PRAYER Card */}
        {nextPrayer && (
          <div
            className="rounded-2xl overflow-hidden shadow-lg"
            style={{
              background: "linear-gradient(135deg, #1a6b3a 0%, #0f4a29 100%)",
              border: "1px solid rgba(201,168,76,0.3)",
            }}
          >
            <div
              className="px-4 py-2"
              style={{ background: "rgba(0,0,0,0.15)" }}
            >
              <div
                className="text-xs font-bold tracking-widest text-center"
                style={{ color: "#c9a84c" }}
              >
                NEXT PRAYER
              </div>
            </div>
            <div className="flex flex-col items-center py-5 px-4">
              <div className="font-bold text-white text-2xl">
                {DISPLAY_NAMES[nextPrayer.name] || nextPrayer.name}
              </div>
              <div
                className="text-xl mt-1 mb-2"
                style={{ color: "rgba(255,255,255,0.7)", fontFamily: "serif" }}
              >
                {ARABIC_NAMES[nextPrayer.name] || ""}
              </div>
              <div className="text-3xl font-bold" style={{ color: "#c9a84c" }}>
                {nextPrayer.time}
              </div>
              {soonLabel && (
                <div
                  className="mt-2 px-4 py-1 rounded-full text-xs font-bold"
                  style={{
                    background: "rgba(201,168,76,0.2)",
                    color: "#c9a84c",
                  }}
                >
                  {soonLabel}
                </div>
              )}
              {currentPrayerName && currentPrayerName !== nextPrayer.name && (
                <div
                  className="mt-2 text-xs"
                  style={{ color: "rgba(255,255,255,0.6)" }}
                >
                  Chal rahi namaz:{" "}
                  <span className="font-semibold text-white">
                    {DISPLAY_NAMES[currentPrayerName] || currentPrayerName}
                  </span>
                </div>
              )}
            </div>

            {/* See all times button */}
            <div className="px-4 pb-4">
              <button
                type="button"
                onClick={() => onTabChange("namaz")}
                className="w-full py-2.5 rounded-xl font-bold text-sm"
                style={{ background: "#c9a84c", color: "#0f4a29" }}
                data-ocid="home.namaz_times.button"
              >
                🕌 Sab Namaz Times Dekhein →
              </button>
            </div>
          </div>
        )}

        {/* Quick Action Grid */}
        <div className="text-sm font-bold" style={{ color: "#0f4a29" }}>
          Quick Access
        </div>
        <div className="grid grid-cols-2 gap-3">
          <button
            type="button"
            onClick={() => onTabChange("namaz")}
            className="rounded-xl p-4 flex flex-col items-start gap-2 shadow-sm"
            style={{ background: "white", border: "1px solid #e8f5e9" }}
            data-ocid="home.namaz.button"
          >
            <span className="text-2xl">🕌</span>
            <span className="font-bold text-sm" style={{ color: "#0f4a29" }}>
              Namaz
            </span>
            <span className="text-xs" style={{ color: "#666" }}>
              Sab waqt dekhein
            </span>
          </button>
          <button
            type="button"
            onClick={() => onTabChange("notice")}
            className="rounded-xl p-4 flex flex-col items-start gap-2 shadow-sm"
            style={{ background: "white", border: "1px solid #e8f5e9" }}
            data-ocid="home.notice.button"
          >
            <span className="text-2xl">📢</span>
            <span className="font-bold text-sm" style={{ color: "#0f4a29" }}>
              Notice
            </span>
            <span className="text-xs" style={{ color: "#666" }}>
              Announcements dekhein
            </span>
          </button>
          <button
            type="button"
            onClick={() => onTabChange("contact")}
            className="rounded-xl p-4 flex flex-col items-start gap-2 shadow-sm"
            style={{ background: "white", border: "1px solid #e8f5e9" }}
            data-ocid="home.contact.button"
          >
            <span className="text-2xl">📞</span>
            <span className="font-bold text-sm" style={{ color: "#0f4a29" }}>
              Contact
            </span>
            <span className="text-xs" style={{ color: "#666" }}>
              Masjid se milein
            </span>
          </button>
          <button
            type="button"
            onClick={() => onTabChange("map")}
            className="rounded-xl p-4 flex flex-col items-start gap-2 shadow-sm"
            style={{ background: "white", border: "1px solid #e8f5e9" }}
            data-ocid="home.map.button"
          >
            <span className="text-2xl">🗺️</span>
            <span className="font-bold text-sm" style={{ color: "#0f4a29" }}>
              Map
            </span>
            <span className="text-xs" style={{ color: "#666" }}>
              Location & Directions
            </span>
          </button>
        </div>

        {/* Masjid Info */}
        <div
          className="rounded-2xl p-4 shadow-sm"
          style={{ background: "white", border: "1px solid #e8f5e9" }}
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
