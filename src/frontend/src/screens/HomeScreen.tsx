import { useEffect, useRef, useState } from "react";
import type { Tab } from "../App";
import { usePrayerTimes } from "../hooks/useQueries";
import { isBellRinging, startBell, stopBell } from "../utils/bellAudio";
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
  juma: "Juma",
};

const ARABIC_NAMES: Record<string, string> = {
  fajr: "الفجر",
  zuhr: "الظهر",
  asr: "العصر",
  maghrib: "المغرب",
  isha: "العشاء",
  khutba_juma: "خطبة الجمعة",
  juma: "الجمعة",
};

export function HomeScreen({ onTabChange }: Props) {
  const [now, setNow] = useState(new Date());
  const { data: prayers = [] } = usePrayerTimes();
  const [bellActive, setBellActive] = useState(isBellRinging());
  const [bellSecondsLeft, setBellSecondsLeft] = useState(15 * 60);
  const bellTimerRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const prevPrayerRef = useRef<string | null>(null);

  useEffect(() => {
    const timer = setInterval(() => setNow(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  // Auto-trigger bell at prayer time
  useEffect(() => {
    if (!prayers.length) return;
    const regularPrayers = prayers.filter(
      (p) => p.enable && p.name !== "khutba_juma" && p.name !== "juma",
    );
    const currentPrayer = getCurrentPrayer(
      regularPrayers.map((p) => ({ ...p, displayName: p.name, isJuma: false })),
    );
    if (currentPrayer && currentPrayer !== prevPrayerRef.current) {
      prevPrayerRef.current = currentPrayer;
      if (!bellActive) {
        triggerBell();
      }
    }
  });

  function triggerBell() {
    setBellActive(true);
    setBellSecondsLeft(15 * 60);
    startBell(() => {
      setBellActive(false);
      if (bellTimerRef.current) {
        clearInterval(bellTimerRef.current);
        bellTimerRef.current = null;
      }
    });
    if (bellTimerRef.current) clearInterval(bellTimerRef.current);
    bellTimerRef.current = setInterval(() => {
      setBellSecondsLeft((prev) => {
        if (prev <= 1) {
          if (bellTimerRef.current) clearInterval(bellTimerRef.current);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
  }

  function handleStopBell() {
    stopBell();
    setBellActive(false);
    if (bellTimerRef.current) {
      clearInterval(bellTimerRef.current);
      bellTimerRef.current = null;
    }
  }

  const formatCountdown = (secs: number) => {
    const m = Math.floor(secs / 60)
      .toString()
      .padStart(2, "0");
    const s = (secs % 60).toString().padStart(2, "0");
    return `${m}:${s}`;
  };

  const isFriday = now.getDay() === 5;
  const currentMinutes = now.getHours() * 60 + now.getMinutes();

  const regularPrayers = prayers
    .filter((p) => p.enable && p.name !== "khutba_juma" && p.name !== "juma")
    .sort((a, b) => parseTime(a.time) - parseTime(b.time));

  const nextPrayer =
    regularPrayers.find((p) => parseTime(p.time) > currentMinutes) ||
    regularPrayers[0];

  const minsUntilNext = nextPrayer
    ? parseTime(nextPrayer.time) - currentMinutes
    : null;
  const soonLabel =
    minsUntilNext !== null && minsUntilNext <= 30 && minsUntilNext >= 0
      ? "Soon"
      : null;

  return (
    <div className="flex flex-col">
      {/* Bell Banner */}
      {bellActive && (
        <div
          className="flex items-center justify-between px-4 py-3 gap-2"
          style={{ background: "#c0392b" }}
          data-ocid="home.bell_banner.panel"
        >
          <div>
            <div className="text-white font-bold text-sm">
              🔔 Namaz ka waqt ho gaya!
            </div>
            <div className="text-xs" style={{ color: "rgba(255,255,255,0.8)" }}>
              Bell {formatCountdown(bellSecondsLeft)} mein band ho jayegi
            </div>
          </div>
          <button
            type="button"
            onClick={handleStopBell}
            className="text-xs font-bold px-3 py-2 rounded-lg flex-shrink-0"
            style={{ background: "white", color: "#c0392b" }}
            data-ocid="home.bell_stop.button"
          >
            ✅ Masjid pahunch gaya — Bell band karo
          </button>
        </div>
      )}

      {/* Header */}
      <div
        className="relative overflow-hidden"
        style={{
          background:
            "linear-gradient(160deg, #0a3d1e 0%, #1a6b3a 60%, #0f4a29 100%)",
        }}
      >
        {/* Decorative star pattern */}
        <div
          className="absolute inset-0 opacity-10 pointer-events-none"
          aria-hidden="true"
        >
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

        {/* App title bar */}
        <div className="relative px-4 pt-4 pb-0 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="text-xl" style={{ color: "#c9a84c" }}>
              ☪
            </span>
            <h1 className="text-white font-bold text-sm leading-tight tracking-wide">
              Jamia Husainiya Masjid Margoobpur
            </h1>
            <span className="text-xl" style={{ color: "#c9a84c" }}>
              ☪
            </span>
          </div>
          <button
            type="button"
            onClick={() => (bellActive ? handleStopBell() : triggerBell())}
            className="w-9 h-9 rounded-full flex items-center justify-center text-base flex-shrink-0"
            style={{
              background: bellActive ? "#c9a84c" : "rgba(255,255,255,0.15)",
            }}
            data-ocid="home.bell.button"
          >
            🔔
          </button>
        </div>

        {/* Bismillah */}
        <div className="relative flex flex-col items-center py-5 px-4">
          <div
            className="text-2xl mb-4 text-center"
            style={{ color: "#c9a84c", fontFamily: "serif", lineHeight: 1.6 }}
          >
            بِسْمِ اللَّهِ الرَّحْمَٰنِ الرَّحِيمِ
          </div>

          {/* Greeting card */}
          <div
            className="w-full rounded-2xl px-5 py-4 mb-4 text-center"
            style={{
              background: "rgba(201,168,76,0.15)",
              border: "1px solid rgba(201,168,76,0.3)",
            }}
          >
            <div
              className="text-xl mb-1"
              style={{ color: "#c9a84c", fontFamily: "serif" }}
            >
              السَّلامُ عَلَيْكُمْ
            </div>
            <div className="text-white font-bold text-base">
              Assalamu Alaikum
            </div>
            <div
              className="text-sm mt-1"
              style={{ color: "rgba(255,255,255,0.7)", fontFamily: "serif" }}
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
                    border: "1px solid rgba(201,168,76,0.4)",
                  }}
                >
                  ⏰ {soonLabel}
                </div>
              )}
            </div>
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
        <div className="text-sm font-bold mb-1" style={{ color: "#0f4a29" }}>
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

        {/* Footer */}
        <div className="text-center py-2 text-xs" style={{ color: "#999" }}>
          © {new Date().getFullYear()}. Built with ❤️ using{" "}
          <a
            href={`https://caffeine.ai?utm_source=caffeine-footer&utm_medium=referral&utm_content=${encodeURIComponent(window.location.hostname)}`}
            target="_blank"
            rel="noreferrer"
            style={{ color: "#1a6b3a" }}
          >
            caffeine.ai
          </a>
        </div>
      </div>
    </div>
  );
}
