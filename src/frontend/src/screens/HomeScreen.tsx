import { useEffect, useRef, useState } from "react";
import type { Tab } from "../App";
import { IslamicHeader } from "../components/IslamicHeader";
import { usePrayerTimes } from "../hooks/useQueries";
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

const ARABIC_NAMES: Record<string, string> = {
  fajr: "\u0627\u0644\u0641\u062c\u0631",
  zuhr: "\u0627\u0644\u0638\u0647\u0631",
  asr: "\u0627\u0644\u0639\u0635\u0631",
  maghrib: "\u0627\u0644\u0645\u063a\u0631\u0628",
  isha: "\u0627\u0644\u0639\u0634\u0627\u0621",
  khutba_juma: "\u062e\u0637\u0628\u0629 \u0627\u0644\u062c\u0645\u0639\u0629",
  juma: "\u0627\u0644\u062c\u0645\u0639\u0629",
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

  const isFriday = now.getDay() === 5;
  const currentMinutes = now.getHours() * 60 + now.getMinutes();

  // Normalize for filtering: backend sends "KhutbaJuma", frontend expects "khutba_juma"
  const regularPrayers = prayers
    .filter((p) => p.enable && !isJumaPrayer(p.name))
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

  // Fallback display values if no prayer data loaded yet
  const displayName = nextPrayer
    ? DISPLAY_NAMES[normalizePrayerName(nextPrayer.name)] || nextPrayer.name
    : "Isha";
  const displayArabic = nextPrayer
    ? ARABIC_NAMES[normalizePrayerName(nextPrayer.name)] || ""
    : "\u0627\u0644\u0639\u0634\u0627\u0621";
  const displayTime = nextPrayer ? nextPrayer.time : "8:30 PM";
  const displaySoon = soonLabel || "Soon";

  const bellButton = (
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
  );

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

      {/* Islamic Header with bell button */}
      <IslamicHeader rightElement={bellButton} />

      {/* Mosque Illustration */}
      <div className="px-4 pt-4">
        <div className="rounded-2xl overflow-hidden shadow">
          <img
            src="/assets/generated/mosque-illustration.dim_800x400.png"
            alt="Jamia Husainiya Masjid Margoobpur"
            className="w-full object-cover"
            style={{ height: "160px", objectPosition: "center top" }}
          />
        </div>
      </div>

      <div className="p-4 flex flex-col gap-3">
        {/* Assalamu Alaikum Card */}
        <div
          className="rounded-2xl p-4 shadow-sm flex items-start gap-3"
          style={{ background: "white", border: "1px solid #e8f5e9" }}
        >
          <div
            className="w-10 h-10 rounded-full flex items-center justify-center text-xl flex-shrink-0"
            style={{ background: "#e8f5e9" }}
          >
            🕌
          </div>
          <div className="flex-1 min-w-0">
            <div className="font-bold text-base" style={{ color: "#0d3d1f" }}>
              Assalamu Alaikum
            </div>
            <div
              className="text-sm mt-0.5"
              style={{
                color: "#c9a84c",
                fontFamily: "serif",
                direction: "rtl",
              }}
            >
              وَعَلَيْكُمُ السَّلَامُ
            </div>
            <p
              className="text-xs mt-1 leading-relaxed"
              style={{ color: "#666" }}
            >
              Welcome to Jamia Husainiya Masjid Margoobpur. May Allah bless you
              and your family. Join us for daily prayers, Friday Khutba, and
              community events.
            </p>
            {isFriday && (
              <div
                className="mt-2 inline-block px-2 py-0.5 rounded-full text-xs font-bold"
                style={{ background: "#c9a84c", color: "#0d3d1f" }}
              >
                🕌 Aaj Juma Mubarak!
              </div>
            )}
          </div>
        </div>

        {/* NEXT PRAYER Card */}
        <div
          className="rounded-2xl p-4 shadow-md"
          style={{
            background: "#0d3d1f",
            border: "1px solid rgba(201,168,76,0.25)",
          }}
          data-ocid="home.next_prayer.card"
        >
          <div
            className="text-xs font-bold tracking-widest uppercase mb-3"
            style={{
              color: "rgba(255,255,255,0.55)",
              letterSpacing: "0.18em",
            }}
          >
            NEXT PRAYER
          </div>
          <div className="flex items-center justify-between">
            <div>
              <div className="font-bold text-white text-lg">{displayName}</div>
              <div
                className="text-sm mt-0.5"
                style={{
                  color: "#c9a84c",
                  fontFamily: "serif",
                  direction: "rtl",
                }}
              >
                {displayArabic}
              </div>
            </div>
            <div className="flex flex-col items-end gap-1">
              <div className="font-bold text-2xl" style={{ color: "white" }}>
                {displayTime}
              </div>
              <div
                className="px-2 py-0.5 rounded-full text-xs font-bold"
                style={{ background: "#c9a84c", color: "#0d3d1f" }}
              >
                ⏰ {displaySoon}
              </div>
            </div>
          </div>
          <button
            type="button"
            onClick={() => onTabChange("namaz")}
            className="w-full mt-3 py-2 rounded-xl font-bold text-sm"
            style={{ background: "rgba(201,168,76,0.18)", color: "#c9a84c" }}
            data-ocid="home.namaz_times.button"
          >
            🕌 Sab Namaz Times Dekhein →
          </button>
        </div>

        {/* Quick Access Grid */}
        <div className="grid grid-cols-2 gap-3">
          <button
            type="button"
            onClick={() => onTabChange("namaz")}
            className="rounded-2xl p-4 flex flex-col items-start gap-1.5 shadow-sm"
            style={{ background: "white", border: "1px solid #e8f5e9" }}
            data-ocid="home.namaz.button"
          >
            <span className="text-2xl">🕌</span>
            <span className="font-bold text-sm" style={{ color: "#0d3d1f" }}>
              Namaz
            </span>
            <span className="text-xs" style={{ color: "#777" }}>
              Sab waqt dekhein
            </span>
          </button>
          <button
            type="button"
            onClick={() => onTabChange("notice")}
            className="rounded-2xl p-4 flex flex-col items-start gap-1.5 shadow-sm"
            style={{ background: "white", border: "1px solid #e8f5e9" }}
            data-ocid="home.notice.button"
          >
            <span className="text-2xl">📢</span>
            <span className="font-bold text-sm" style={{ color: "#0d3d1f" }}>
              Notice
            </span>
            <span className="text-xs" style={{ color: "#777" }}>
              Announcements dekhein
            </span>
          </button>
          <button
            type="button"
            onClick={() => onTabChange("contact")}
            className="rounded-2xl p-4 flex flex-col items-start gap-1.5 shadow-sm"
            style={{ background: "white", border: "1px solid #e8f5e9" }}
            data-ocid="home.contact.button"
          >
            <span className="text-2xl">📞</span>
            <span className="font-bold text-sm" style={{ color: "#0d3d1f" }}>
              Contact
            </span>
            <span className="text-xs" style={{ color: "#777" }}>
              Masjid se milein
            </span>
          </button>
          <button
            type="button"
            onClick={() => onTabChange("map")}
            className="rounded-2xl p-4 flex flex-col items-start gap-1.5 shadow-sm"
            style={{ background: "white", border: "1px solid #e8f5e9" }}
            data-ocid="home.map.button"
          >
            <span className="text-2xl">🗺️</span>
            <span className="font-bold text-sm" style={{ color: "#0d3d1f" }}>
              Map
            </span>
            <span className="text-xs" style={{ color: "#777" }}>
              Location &amp; Directions
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
            <span className="font-bold text-sm" style={{ color: "#0d3d1f" }}>
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
