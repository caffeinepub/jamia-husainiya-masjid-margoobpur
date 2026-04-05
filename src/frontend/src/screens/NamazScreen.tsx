import { useEffect, useRef, useState } from "react";
import { usePrayerTimes } from "../hooks/useQueries";
import { isBellRinging, startBell, stopBell } from "../utils/bellAudio";
import {
  ALARM_INTENTS,
  getCurrentPrayer,
  launchAndroidAlarm,
  parseTime,
} from "../utils/prayerUtils";

const DISPLAY_NAMES: Record<string, string> = {
  fajr: "Fajr",
  zuhr: "Zuhr",
  asr: "Asr",
  maghrib: "Maghrib",
  isha: "Isha",
  khutba_juma: "Khutba Juma",
};

export function NamazScreen() {
  const { data: prayers = [], isLoading } = usePrayerTimes();
  const [now, setNow] = useState(new Date());
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
    const currentPrayer = getCurrentPrayer(
      prayers.map((p) => ({ ...p, displayName: p.name, isJuma: false })),
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

  const isFriday = now.getDay() === 5;
  const currentMinutes = now.getHours() * 60 + now.getMinutes();

  const regularPrayers = prayers
    .filter((p) => p.name !== "khutba_juma" && p.name !== "juma")
    .sort((a, b) => parseTime(a.time) - parseTime(b.time));

  const jumaPrayer = prayers.find(
    (p) => p.name === "khutba_juma" || p.name === "juma",
  );

  const currentPrayerName = getCurrentPrayer(
    regularPrayers.map((p) => ({ ...p, displayName: p.name, isJuma: false })),
  );

  const formatCountdown = (secs: number) => {
    const m = Math.floor(secs / 60)
      .toString()
      .padStart(2, "0");
    const s = (secs % 60).toString().padStart(2, "0");
    return `${m}:${s}`;
  };

  const renderPrayerCard = (
    prayer: { name: string; time: string; enable: boolean },
    index: number,
    isDimmed = false,
  ) => {
    const isCurrent = prayer.name === currentPrayerName && !isDimmed;
    const isUpcoming =
      !isDimmed &&
      prayer.name !== currentPrayerName &&
      parseTime(prayer.time) > currentMinutes;
    const displayName = DISPLAY_NAMES[prayer.name] || prayer.name;

    return (
      <div
        key={prayer.name}
        className="rounded-xl overflow-hidden shadow-xs"
        style={{
          background: isCurrent ? "#1a6b3a" : isDimmed ? "#f5f5f5" : "white",
          opacity: isDimmed ? 0.6 : 1,
          border: isCurrent
            ? "none"
            : `1px solid ${isDimmed ? "#e0e0e0" : "#e8f5e9"}`,
        }}
        data-ocid={`namaz.item.${index + 1}`}
      >
        <div className="flex items-center px-4 py-3 gap-3">
          <div
            className="w-10 h-10 rounded-full flex items-center justify-center text-lg flex-shrink-0"
            style={{
              background: isCurrent
                ? "rgba(201,168,76,0.25)"
                : isDimmed
                  ? "#ececec"
                  : "#e8f5e9",
            }}
          >
            🕌
          </div>
          <div className="flex-1">
            <div
              className="font-bold text-sm"
              style={{
                color: isCurrent ? "white" : isDimmed ? "#999" : "#0f4a29",
              }}
            >
              {displayName}
            </div>
            <div
              className="text-xs"
              style={{
                color: isCurrent
                  ? "rgba(255,255,255,0.8)"
                  : isDimmed
                    ? "#bbb"
                    : "#555",
              }}
            >
              {prayer.time}
            </div>
          </div>
          <div className="flex items-center gap-2">
            {isCurrent && (
              <span
                className="text-xs font-bold px-2 py-0.5 rounded-full"
                style={{ background: "#c9a84c", color: "#0f4a29" }}
              >
                Abhi
              </span>
            )}
            {isUpcoming && (
              <span
                className="text-xs font-semibold px-2 py-0.5 rounded-full"
                style={{
                  background: "#e8f5e9",
                  color: "#1a6b3a",
                }}
              >
                Agle
              </span>
            )}
            {isDimmed && (
              <span
                className="text-xs px-2 py-0.5 rounded-full"
                style={{ background: "#ececec", color: "#999" }}
              >
                Sirf Juma
              </span>
            )}
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="flex flex-col">
      {/* Bell Banner */}
      {bellActive && (
        <div
          className="flex items-center justify-between px-4 py-3 gap-2"
          style={{ background: "#c0392b" }}
          data-ocid="namaz.bell_banner.panel"
        >
          <div>
            <div className="text-white font-bold text-sm">
              🔔 Namaz ka waqt ho gaya!
            </div>
            <div className="text-xs" style={{ color: "rgba(255,255,255,0.8)" }}>
              {formatCountdown(bellSecondsLeft)} mein band ho jayegi
            </div>
          </div>
          <button
            type="button"
            onClick={handleStopBell}
            className="text-xs font-bold px-3 py-2 rounded-lg flex-shrink-0"
            style={{ background: "white", color: "#c0392b" }}
            data-ocid="namaz.bell_stop.button"
          >
            ✅ Masjid pahunch gaya
          </button>
        </div>
      )}

      {/* Screen header */}
      <div
        className="flex items-center justify-between px-4 py-3"
        style={{ background: "#1a6b3a" }}
      >
        <div>
          <div className="text-white font-bold text-base">🕌 Namaz Times</div>
          <div className="text-xs" style={{ color: "rgba(255,255,255,0.7)" }}>
            Aaj ke namaz ke waqt
          </div>
        </div>
        <button
          type="button"
          onClick={() => (bellActive ? handleStopBell() : triggerBell())}
          className="w-10 h-10 rounded-full flex items-center justify-center text-lg"
          style={{
            background: bellActive ? "#c9a84c" : "rgba(255,255,255,0.15)",
          }}
          data-ocid="namaz.bell.button"
        >
          🔔
        </button>
      </div>

      <div className="p-4 flex flex-col gap-4">
        {/* Alarm Setup Section */}
        <div
          className="rounded-2xl overflow-hidden shadow-card"
          style={{ background: "white", border: "1px solid #e8f5e9" }}
        >
          <div
            className="px-4 py-3"
            style={{ background: "#e8f5e9", borderBottom: "1px solid #c8e6c9" }}
          >
            <div className="font-bold text-sm" style={{ color: "#0f4a29" }}>
              📱 Namaz Alarm Setup
            </div>
            <div className="text-xs mt-0.5" style={{ color: "#555" }}>
              Android mein Clock app kholkar alarm set karo
            </div>
          </div>
          <div className="p-4 flex flex-col gap-2">
            <p className="text-xs" style={{ color: "#555" }}>
              Neeche diye button dabao — Clock app khulega aur alarm
              automatically set ho jayega.
            </p>
            {(
              Object.entries(ALARM_INTENTS) as [
                keyof typeof ALARM_INTENTS,
                (typeof ALARM_INTENTS)[keyof typeof ALARM_INTENTS],
              ][]
            ).map(([key, alarm]) => (
              <button
                key={key}
                type="button"
                onClick={() =>
                  launchAndroidAlarm(
                    alarm.intent,
                    `${alarm.displayName} Namaz ka waqt: ${alarm.time}`,
                  )
                }
                className="flex items-center gap-3 px-4 py-3 rounded-xl font-semibold text-sm text-left"
                style={{ background: "#1a6b3a", color: "white" }}
                data-ocid={`namaz.alarm_${key}.button`}
              >
                <span className="text-base">🔔</span>
                <span>{alarm.displayName} Alarm Set karo</span>
                <span
                  className="ml-auto text-xs font-normal"
                  style={{ color: "rgba(255,255,255,0.7)" }}
                >
                  {alarm.time}
                </span>
              </button>
            ))}
            <p className="text-xs mt-1" style={{ color: "#888" }}>
              iPhone users: button dabao, time dekhkar manually Clock app mein
              set karo.
            </p>
          </div>
        </div>

        {/* Prayer Times List */}
        <div>
          <div className="flex items-center justify-between mb-3">
            <div className="font-bold text-sm" style={{ color: "#0f4a29" }}>
              Namaz ka Waqt
            </div>
            {isFriday && (
              <span
                className="text-xs font-bold px-2 py-1 rounded-full"
                style={{ background: "#c9a84c", color: "#0f4a29" }}
              >
                Aaj Juma Hai! 🕌
              </span>
            )}
          </div>

          {isLoading ? (
            <div
              className="flex flex-col gap-2"
              data-ocid="namaz.loading_state"
            >
              {[1, 2, 3, 4, 5].map((i) => (
                <div
                  key={i}
                  className="h-16 rounded-xl animate-pulse"
                  style={{ background: "#e8f5e9" }}
                />
              ))}
            </div>
          ) : (
            <div className="flex flex-col gap-2">
              {/* Friday: Juma card at top */}
              {isFriday && jumaPrayer && (
                <div
                  className="rounded-xl overflow-hidden shadow-xs"
                  style={{ background: "#1a6b3a", border: "2px solid #c9a84c" }}
                  data-ocid="namaz.juma.card"
                >
                  <div className="flex items-center px-4 py-3 gap-3">
                    <div
                      className="w-10 h-10 rounded-full flex items-center justify-center text-lg flex-shrink-0"
                      style={{ background: "rgba(201,168,76,0.25)" }}
                    >
                      🕌
                    </div>
                    <div className="flex-1">
                      <div className="font-bold text-sm text-white">
                        Khutba Juma
                      </div>
                      <div
                        className="text-xs"
                        style={{ color: "rgba(255,255,255,0.8)" }}
                      >
                        {jumaPrayer.time}
                      </div>
                    </div>
                    <span
                      className="text-xs font-bold px-2 py-0.5 rounded-full"
                      style={{ background: "#c9a84c", color: "#0f4a29" }}
                    >
                      Aaj Juma! 🕌
                    </span>
                  </div>
                </div>
              )}

              {/* Regular prayers */}
              {regularPrayers.map((prayer, i) => renderPrayerCard(prayer, i))}

              {/* Non-Friday: Juma card at bottom, dimmed */}
              {!isFriday &&
                jumaPrayer &&
                renderPrayerCard(jumaPrayer, regularPrayers.length, true)}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
