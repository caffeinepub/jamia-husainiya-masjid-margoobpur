import { useEffect, useRef, useState } from "react";
import { PRAYERS, getNextPrayer } from "../data/prayers";
import type { Prayer } from "../data/prayers";

const PRAYER_TIMES_KEY = "masjid_prayer_times";
const AUTO_STOP_SECONDS = 900; // 15 minutes

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
  const isFriday = now.getDay() === 5;
  const currentMinutes = now.getHours() * 60 + now.getMinutes();
  const activePrayers = prayers
    .filter((p) => !p.isSpecial || isFriday)
    .slice()
    .sort((a, b) => a.hour * 60 + a.minute - (b.hour * 60 + b.minute));
  for (const prayer of activePrayers) {
    if (prayer.hour * 60 + prayer.minute > currentMinutes) return prayer;
  }
  return activePrayers[0] ?? prayers[0];
}

function sortPrayers(prayers: Prayer[], isFriday: boolean): Prayer[] {
  const special = prayers.filter((p) => p.isSpecial);
  const regular = prayers.filter((p) => !p.isSpecial);
  if (isFriday) return [...special, ...regular];
  return [...regular, ...special];
}

function createBellContext() {
  const ctx = new (
    window.AudioContext ||
    (window as unknown as { webkitAudioContext: typeof AudioContext })
      .webkitAudioContext
  )();
  return ctx;
}

function playBell(ctx: AudioContext) {
  const now = ctx.currentTime;
  const osc = ctx.createOscillator();
  const gain = ctx.createGain();
  osc.connect(gain);
  gain.connect(ctx.destination);
  osc.type = "sine";
  osc.frequency.setValueAtTime(880, now);
  osc.frequency.exponentialRampToValueAtTime(440, now + 1.5);
  gain.gain.setValueAtTime(0.8, now);
  gain.gain.exponentialRampToValueAtTime(0.001, now + 1.8);
  osc.start(now);
  osc.stop(now + 1.8);
}

function formatCountdown(seconds: number): string {
  const m = Math.floor(seconds / 60);
  const s = seconds % 60;
  return `${String(m).padStart(2, "0")}:${String(s).padStart(2, "0")}`;
}

// Build Android alarm intent URL
function buildAlarmIntentUrl(prayer: Prayer): string {
  const label = encodeURIComponent(`${prayer.english} Namaz`);
  return `intent:#Intent;action=android.intent.action.SET_ALARM;S.android.intent.extra.alarm.MESSAGE=${label};i.android.intent.extra.alarm.HOUR=${prayer.hour};i.android.intent.extra.alarm.MINUTES=${prayer.minute};END`;
}

// AlarmButton: uses <a href> which is more reliable than window.location for intent:// on Android
function AlarmButton({ prayer, isNext }: { prayer: Prayer; isNext: boolean }) {
  const isAndroid = /android/i.test(navigator.userAgent);
  const intentUrl = buildAlarmIntentUrl(prayer);

  const style: React.CSSProperties = {
    display: "inline-flex",
    alignItems: "center",
    gap: "4px",
    fontSize: "12px",
    padding: "4px 10px",
    borderRadius: "9999px",
    fontWeight: 600,
    textDecoration: "none",
    border: isNext ? "1.5px solid white" : "1.5px solid #1a6b3c",
    color: isNext ? "white" : "#1a6b3c",
    background: "transparent",
    cursor: "pointer",
  };

  if (isAndroid) {
    return (
      <a
        href={intentUrl}
        style={style}
        data-ocid={`namaz.${prayer.id}.alarm_btn`}
      >
        🔔 Alarm Set کریں
      </a>
    );
  }

  // Non-Android: show alert with time info
  return (
    <button
      type="button"
      style={style}
      onClick={() =>
        window.alert(
          `${prayer.english} Namaz\nWaqt: ${prayer.time}\n\nApne Clock app mein yeh alarm set karein.`,
        )
      }
      data-ocid={`namaz.${prayer.id}.alarm_btn`}
    >
      🔔 Alarm Set کریں
    </button>
  );
}

export function NamazScreen() {
  const [savedTimes, setSavedTimes] = useState<PrayerTimes | null>(
    loadPrayerTimes,
  );
  const [alarmActive, setAlarmActive] = useState(false);
  const [alarmPrayer, setAlarmPrayer] = useState<string | null>(null);
  const [alarmStopped, setAlarmStopped] = useState(false);
  const [countdown, setCountdown] = useState(AUTO_STOP_SECONDS);

  const audioCtxRef = useRef<AudioContext | null>(null);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const bellIntervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const autoStopRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const countdownRef = useRef<ReturnType<typeof setInterval> | null>(null);

  useEffect(() => {
    const onFocus = () => setSavedTimes(loadPrayerTimes());
    const onStorage = (e: StorageEvent) => {
      if (e.key === PRAYER_TIMES_KEY) setSavedTimes(loadPrayerTimes());
    };
    window.addEventListener("focus", onFocus);
    window.addEventListener("storage", onStorage);
    return () => {
      window.removeEventListener("focus", onFocus);
      window.removeEventListener("storage", onStorage);
    };
  }, []);

  useEffect(() => {
    const check = () => {
      if (alarmActive) return;
      const now = new Date();
      const prayers = getEffectivePrayers(loadPrayerTimes());
      for (const prayer of prayers) {
        if (prayer.isSpecial && now.getDay() !== 5) continue;
        if (
          prayer.hour === now.getHours() &&
          prayer.minute === now.getMinutes()
        ) {
          startAlarm(prayer.id);
          break;
        }
      }
    };
    check();
    intervalRef.current = setInterval(check, 60000);
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [alarmActive]);

  function startAlarm(prayerId: string) {
    setAlarmActive(true);
    setAlarmStopped(false);
    setAlarmPrayer(prayerId);
    setCountdown(AUTO_STOP_SECONDS);
    if (!audioCtxRef.current) audioCtxRef.current = createBellContext();
    const ctx = audioCtxRef.current;
    playBell(ctx);
    bellIntervalRef.current = setInterval(() => playBell(ctx), 3000);
    countdownRef.current = setInterval(() => {
      setCountdown((prev) => (prev <= 1 ? 0 : prev - 1));
    }, 1000);
    autoStopRef.current = setTimeout(
      () => stopAlarm(true),
      AUTO_STOP_SECONDS * 1000,
    );
  }

  function stopAlarm(auto = false) {
    setAlarmActive(false);
    setAlarmPrayer(null);
    if (auto) {
      setAlarmStopped(true);
      setTimeout(() => setAlarmStopped(false), 5000);
    }
    if (bellIntervalRef.current) {
      clearInterval(bellIntervalRef.current);
      bellIntervalRef.current = null;
    }
    if (autoStopRef.current) {
      clearTimeout(autoStopRef.current);
      autoStopRef.current = null;
    }
    if (countdownRef.current) {
      clearInterval(countdownRef.current);
      countdownRef.current = null;
    }
  }

  function testAlarm() {
    startAlarm("manual");
  }

  const prayers = getEffectivePrayers(savedTimes);
  const nextPrayer = savedTimes
    ? getNextPrayerFromList(prayers)
    : getNextPrayer();
  const isFriday = new Date().getDay() === 5;
  const sortedPrayers = sortPrayers(prayers, isFriday);
  const today = new Date().toLocaleDateString("en-IN", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  return (
    <div className="px-4 py-5" data-ocid="namaz.page">
      {alarmStopped && (
        <div
          className="rounded-2xl p-4 mb-4 text-center shadow-lg"
          style={{ background: "#1a6b3c" }}
          data-ocid="namaz.alarm.success_state"
        >
          <p className="text-white font-bold text-base">
            🕌 Bell بند ہو گئی — اگلی نماز کا انتظار
          </p>
        </div>
      )}

      {alarmActive && (
        <div
          className="rounded-2xl p-4 mb-4 flex flex-col items-center gap-3 shadow-lg"
          style={{ background: "#b91c1c" }}
          data-ocid="namaz.alarm.panel"
        >
          <div className="flex items-center gap-2">
            <span className="text-3xl animate-bounce">🔔</span>
            <div className="text-white text-center">
              <p className="font-bold text-base">
                {alarmPrayer === "manual"
                  ? "اذان کا وقت ہو گیا!"
                  : `${prayers.find((p) => p.id === alarmPrayer)?.english ?? ""} کا وقت ہو گیا!`}
              </p>
              <p className="text-xs opacity-80">مسجد کی طرف چلیں 🕌</p>
            </div>
          </div>
          <div
            className="px-4 py-1.5 rounded-full text-sm font-mono font-bold"
            style={{ background: "rgba(255,255,255,0.2)", color: "white" }}
          >
            ⏱ {formatCountdown(countdown)} میں auto-بند
          </div>
          <button
            type="button"
            onClick={() => stopAlarm(false)}
            className="w-full py-3 rounded-xl font-bold text-base"
            style={{ background: "white", color: "#b91c1c" }}
            data-ocid="namaz.alarm.close_button"
          >
            ✅ مسجد پہنچ گیا — Bell بند کرو
          </button>
        </div>
      )}

      <div className="mb-5 flex items-center justify-between">
        <div>
          <h2 className="font-bold text-xl" style={{ color: "#1a6b3c" }}>
            Prayer Times
          </h2>
          <p className="text-xs text-gray-500 mt-0.5">{today}</p>
        </div>
        {!alarmActive && (
          <button
            type="button"
            onClick={testAlarm}
            title="Alarm Test"
            className="w-10 h-10 rounded-full flex items-center justify-center text-xl shadow"
            style={{ background: "#1a6b3c", color: "white" }}
            data-ocid="namaz.alarm.toggle"
          >
            🔔
          </button>
        )}
      </div>

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
        {isFriday && (
          <p
            className="text-xs relative mt-1 font-bold"
            style={{ color: "#ffd700" }}
          >
            🕌 آج جمعہ مبارک ہے — Juma Mubarak!
          </p>
        )}
      </div>

      {/* Namaz Alarm Setup Section */}
      <div
        className="rounded-2xl p-4 mb-5 shadow"
        style={{ background: "#f0f9f4", border: "1.5px solid #1a6b3c" }}
        data-ocid="namaz.alarm_setup.section"
      >
        <h3 className="font-bold text-base mb-1" style={{ color: "#1a6b3c" }}>
          🕌 Namaz Alarm Setup
        </h3>
        <p className="text-xs text-gray-600 mb-3">
          Neeche diye gaye buttons par click karke apne phone ke Clock app mein
          alarm set karein.
        </p>
        <div className="flex flex-col gap-2">
          {sortedPrayers
            .filter((p) => !p.isSpecial)
            .map((prayer) => (
              <AlarmButton key={prayer.id} prayer={prayer} isNext={false} />
            ))}
        </div>
        <p className="text-xs text-gray-500 mt-3">
          Clock app khulega aur alarm pre-filled ho jayega. Alarm save karne ke
          liye Save/OK press karein.
        </p>
      </div>

      <div className="space-y-3">
        {sortedPrayers.map((prayer) => {
          const isNext = prayer.id === nextPrayer.id;
          const isKhutbaHidden = prayer.isSpecial && !isFriday;
          return (
            <div
              key={prayer.id}
              className="rounded-2xl p-4 shadow-card flex items-center gap-4 transition-all"
              style={{
                background: isNext ? "#1a6b3c" : "white",
                opacity: isKhutbaHidden ? 0.5 : 1,
              }}
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
                {prayer.isSpecial && (
                  <span
                    className="inline-block text-xs px-2 py-0.5 rounded-full font-bold mt-1"
                    style={{ background: "#c9a84c", color: "#3b2000" }}
                  >
                    {isFriday ? "آج Juma ہے ✨" : "Sirf Juma"}
                  </span>
                )}
              </div>
              <div className="text-right flex flex-col items-end gap-2">
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
