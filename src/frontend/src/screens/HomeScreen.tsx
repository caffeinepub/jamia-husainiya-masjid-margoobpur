import { useEffect, useRef, useState } from "react";
import type { Tab } from "../App";
import { useAnnouncements, usePrayerTimes } from "../hooks/useQueries";
import { isBellRinging, startBell, stopBell } from "../utils/bellAudio";
import {
  getCurrentPrayer,
  isJumaPrayer,
  normalizePrayerName,
  parseTime,
} from "../utils/prayerUtils";

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

export function HomeScreen({ onTabChange }: Props) {
  const [now, setNow] = useState(new Date());
  const { data: prayers = [] } = usePrayerTimes();
  const { data: announcements = [] } = useAnnouncements();
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
      (p) => p.enable && !isJumaPrayer(p.name),
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

  const currentMinutes = now.getHours() * 60 + now.getMinutes();

  const regularPrayers = prayers
    .filter((p) => p.enable && !isJumaPrayer(p.name))
    .sort((a, b) => parseTime(a.time) - parseTime(b.time));

  const nextPrayer =
    regularPrayers.find((p) => parseTime(p.time) > currentMinutes) ||
    regularPrayers[0];

  const displayName = nextPrayer
    ? DISPLAY_NAMES[normalizePrayerName(nextPrayer.name)] || nextPrayer.name
    : "Isha";
  const displayTime = nextPrayer ? nextPrayer.time : "8:30 PM";

  return (
    <div className="flex flex-col" style={{ background: "#f0f7f0" }}>
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
        className="px-4 py-3"
        style={{ background: "#1a6b3a", borderBottom: "3px solid #0d3d1f" }}
      >
        {/* Arabic Bismillah */}
        <div
          className="text-sm text-center mb-1"
          style={{
            color: "#c9a84c",
            fontFamily: "serif",
            direction: "rtl",
          }}
        >
          بسم الله الرحمن الرحيم
        </div>
        {/* Mosque name with crescents */}
        <div className="flex items-center justify-center gap-2">
          <span className="text-2xl" style={{ color: "#c9a84c" }}>
            ☪
          </span>
          <h1
            className="text-white font-bold text-center"
            style={{ fontSize: "14px" }}
          >
            Jamia Husainiya Masjid Margoobpur
          </h1>
          <span className="text-2xl" style={{ color: "#c9a84c" }}>
            ☪
          </span>
        </div>
        {/* Bell button */}
        <div className="flex justify-end mt-1">
          <button
            type="button"
            onClick={() => (bellActive ? handleStopBell() : triggerBell())}
            className="w-8 h-8 rounded-full flex items-center justify-center text-base"
            style={{
              background: bellActive ? "#c9a84c" : "rgba(255,255,255,0.15)",
            }}
            data-ocid="home.bell.button"
          >
            🔔
          </button>
        </div>
      </div>

      {/* Mosque Image in center */}
      <div className="flex items-center justify-center px-4 pt-4">
        <img
          src="/assets/generated/mosque-illustration.dim_800x400.png"
          alt="Jamia Husainiya Masjid"
          className="w-full rounded-xl shadow-md"
          style={{
            maxHeight: "170px",
            objectFit: "cover",
            objectPosition: "center top",
          }}
        />
      </div>

      <div className="px-4 pt-4 flex flex-col gap-4">
        {/* Assalamu Alaikum */}
        <div
          className="rounded-xl p-4"
          style={{ background: "white", border: "1px solid #c8e6c9" }}
        >
          <div className="font-bold text-base" style={{ color: "#0d3d1f" }}>
            Assalamu Alaikum
          </div>
          <div
            className="text-sm mt-0.5"
            style={{ color: "#1a6b3a", fontFamily: "serif", direction: "rtl" }}
          >
            وَعَلَيْكُمُ السَّلام
          </div>
          <p className="text-xs mt-1" style={{ color: "#555" }}>
            Welcome to Jamia Husainiya Masjid Margoobpur. May Allah bless you
            and your family.
          </p>
        </div>

        {/* Next Prayer - Coming Soon */}
        <div
          className="rounded-xl p-4"
          style={{ background: "#0d3d1f", border: "1px solid #c9a84c" }}
          data-ocid="home.next_prayer.card"
        >
          <div
            className="text-xs font-semibold uppercase mb-2"
            style={{ color: "rgba(255,255,255,0.6)", letterSpacing: "0.1em" }}
          >
            Coming Soon
          </div>
          <div className="flex items-center justify-between">
            <div className="font-bold text-white text-base">
              {displayName} prayer
            </div>
            <div className="flex flex-col items-end gap-1">
              <div className="font-bold text-xl" style={{ color: "white" }}>
                {displayTime}
              </div>
              <div
                className="px-2 py-0.5 rounded-full text-xs font-bold"
                style={{ background: "#c9a84c", color: "#0d3d1f" }}
              >
                Soon
              </div>
            </div>
          </div>
          <button
            type="button"
            onClick={() => onTabChange("namaz")}
            className="w-full mt-3 py-2 rounded-lg font-bold text-sm"
            style={{ background: "rgba(201,168,76,0.2)", color: "#c9a84c" }}
            data-ocid="home.namaz_times.button"
          >
            Sab Namaz Times dekhein →
          </button>
        </div>

        {/* Notices Section */}
        <div>
          <div className="font-bold text-sm mb-2" style={{ color: "#0d3d1f" }}>
            📢 Notices
          </div>
          {announcements.length === 0 ? (
            <div
              className="text-sm"
              style={{ color: "#888" }}
              data-ocid="home.notices.empty_state"
            >
              Abhi koi notice nahi hai.
            </div>
          ) : (
            <div className="flex flex-col gap-2">
              {announcements.map((notice, i) => (
                <div
                  key={`${notice.title}-${i}`}
                  className="py-2"
                  style={{
                    borderBottom:
                      i < announcements.length - 1
                        ? "1px solid #c8e6c9"
                        : "none",
                  }}
                  data-ocid={`home.notice.item.${i + 1}`}
                >
                  <div
                    className="font-semibold text-sm"
                    style={{ color: "#0d3d1f" }}
                  >
                    {notice.title}
                  </div>
                  <div className="text-xs mt-0.5" style={{ color: "#555" }}>
                    {notice.message}
                  </div>
                  <div className="text-xs mt-0.5" style={{ color: "#999" }}>
                    {notice.date}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="text-center py-2 text-xs" style={{ color: "#999" }}>
          © {new Date().getFullYear()} Jamia Husainiya Masjid Margoobpur
        </div>
      </div>
    </div>
  );
}
