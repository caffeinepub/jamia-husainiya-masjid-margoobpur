import { useEffect, useRef, useState } from "react";
import type { PrayerTime } from "../backend.d";
import { usePrayerTimes } from "../hooks/useQueries";

const AUTO_STOP_SECONDS = 900; // 15 minutes

// Canonical prayer order
const PRAYER_ORDER = ["fajr", "zohar", "asr", "maghrib", "isha", "khutba_juma"];

const PRAYER_META: Record<
  string,
  { hindi: string; arabic: string; icon: string; isSpecial?: boolean }
> = {
  fajr: { hindi: "फ़ज्र", arabic: "الفَجْر", icon: "🌙" },
  zohar: { hindi: "ज़ोहर", arabic: "الظُّهْر", icon: "🌅" },
  asr: { hindi: "अस्र", arabic: "العَصْر", icon: "☀️" },
  maghrib: { hindi: "मग़रिब", arabic: "المَغْرِب", icon: "🌇" },
  isha: { hindi: "इशा", arabic: "العِشَاء", icon: "🌃" },
  khutba_juma: {
    hindi: "ख़ुत्बा जुमा",
    arabic: "خُطْبَةُ الجُمُعَة",
    icon: "🕌",
    isSpecial: true,
  },
};

// Static alarm data (default times for alarm setup section)
const STATIC_ALARMS = [
  { id: "fajr", hindi: "फ़ज्र", display: "5:41 AM", hour: 5, minute: 41 },
  { id: "zohar", hindi: "ज़ोहर", display: "1:30 PM", hour: 13, minute: 30 },
  { id: "asr", hindi: "अस्र", display: "5:00 PM", hour: 17, minute: 0 },
  { id: "maghrib", hindi: "मग़रिब", display: "6:45 PM", hour: 18, minute: 45 },
  { id: "isha", hindi: "इशा", display: "8:30 PM", hour: 20, minute: 30 },
];

function parseTime(timeStr: string): { hour: number; minute: number } {
  // Handle both 24h ("05:41") and 12h ("5:41 AM") formats
  const trimmed = timeStr.trim();
  const ampmMatch = trimmed.match(/^(\d+):(\d+)\s*(AM|PM)$/i);
  if (ampmMatch) {
    let h = Number.parseInt(ampmMatch[1], 10);
    const m = Number.parseInt(ampmMatch[2], 10);
    const meridiem = ampmMatch[3].toUpperCase();
    if (meridiem === "PM" && h !== 12) h += 12;
    if (meridiem === "AM" && h === 12) h = 0;
    return { hour: h, minute: m };
  }
  const parts = trimmed.split(":");
  return {
    hour: Number.parseInt(parts[0], 10),
    minute: Number.parseInt(parts[1] ?? "0", 10),
  };
}

function to12h(timeStr: string): string {
  const { hour, minute } = parseTime(timeStr);
  const suffix = hour >= 12 ? "PM" : "AM";
  let h = hour % 12;
  if (h === 0) h = 12;
  return `${h}:${String(minute).padStart(2, "0")} ${suffix}`;
}

function formatCountdown(seconds: number): string {
  const m = Math.floor(seconds / 60);
  const s = seconds % 60;
  return `${String(m).padStart(2, "0")}:${String(s).padStart(2, "0")}`;
}

function buildAlarmIntentUrl(
  hindi: string,
  hour: number,
  minute: number,
): string {
  const label = encodeURIComponent(`${hindi} Namaz`);
  return `intent:#Intent;action=android.intent.action.SET_ALARM;S.android.intent.extra.alarm.MESSAGE=${label};i.android.intent.extra.alarm.HOUR=${hour};i.android.intent.extra.alarm.MINUTES=${minute};end`;
}

function triggerAndroidAlarm(intentUrl: string) {
  const a = document.createElement("a");
  a.href = intentUrl;
  document.body.appendChild(a);
  a.click();
  setTimeout(() => {
    if (document.body.contains(a)) document.body.removeChild(a);
  }, 500);
}

function createAudioCtx() {
  return new (
    window.AudioContext ||
    (window as unknown as { webkitAudioContext: typeof AudioContext })
      .webkitAudioContext
  )();
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
  gain.gain.setValueAtTime(0.7, now);
  gain.gain.exponentialRampToValueAtTime(0.001, now + 1.8);
  osc.start(now);
  osc.stop(now + 1.8);
}

interface ParsedPrayer {
  id: string;
  hindi: string;
  arabic: string;
  icon: string;
  display: string;
  hour: number;
  minute: number;
  isSpecial: boolean;
}

function buildParsedPrayers(backendData: PrayerTime[]): ParsedPrayer[] {
  const map = new Map<string, string>();
  for (const pt of backendData) {
    map.set(pt.name.toLowerCase().replace(/ /g, "_"), pt.time);
  }
  return PRAYER_ORDER.map((id) => {
    const meta = PRAYER_META[id];
    const rawTime = map.get(id) ?? "";
    const parsed = rawTime ? parseTime(rawTime) : { hour: 0, minute: 0 };
    return {
      id,
      hindi: meta?.hindi ?? id,
      arabic: meta?.arabic ?? "",
      icon: meta?.icon ?? "🕌",
      display: rawTime ? to12h(rawTime) : "--:--",
      hour: parsed.hour,
      minute: parsed.minute,
      isSpecial: !!meta?.isSpecial,
    };
  });
}

function getNextPrayer(
  prayers: ParsedPrayer[],
  isFriday: boolean,
): ParsedPrayer | null {
  const now = new Date();
  const curMin = now.getHours() * 60 + now.getMinutes();
  const active = prayers
    .filter((p) => !p.isSpecial || isFriday)
    .slice()
    .sort((a, b) => a.hour * 60 + a.minute - (b.hour * 60 + b.minute));
  for (const p of active) {
    if (p.hour * 60 + p.minute > curMin) return p;
  }
  return active[0] ?? null;
}

// AlarmSetup Section
function AlarmSetupSection() {
  const isAndroid = /android/i.test(navigator.userAgent);
  const [open, setOpen] = useState(true);

  return (
    <div
      className="rounded-2xl mb-5 overflow-hidden shadow"
      style={{ border: "1.5px solid #1a6b3c" }}
      data-ocid="namaz.alarm_setup.section"
    >
      <button
        type="button"
        className="w-full flex items-center justify-between px-4 py-3"
        style={{ background: "#e8f5ee" }}
        onClick={() => setOpen((v) => !v)}
        data-ocid="namaz.alarm_setup.toggle"
      >
        <span className="font-bold text-sm" style={{ color: "#1a6b3c" }}>
          ⏰ नमाज़ अलार्म सेट करें
        </span>
        <span style={{ color: "#1a6b3c", fontSize: "18px" }}>
          {open ? "▲" : "▼"}
        </span>
      </button>

      {open && (
        <div className="px-4 pb-4 pt-2" style={{ background: "#f5fbf7" }}>
          <p className="text-xs text-gray-600 mb-3">
            अपने फ़ोन के Clock App में नमाज़ का अलार्म सेट करें
            {isAndroid
              ? " (Android Chrome में काम करेगा)"
              : " — iPhone पर manually set करें"}
          </p>
          <div className="flex flex-col gap-2">
            {STATIC_ALARMS.map((alarm) => (
              <button
                key={alarm.id}
                type="button"
                className="flex items-center justify-between rounded-xl px-4 py-3 text-white font-semibold text-sm w-full"
                style={{ background: "#1a6b3c" }}
                onClick={() => {
                  if (isAndroid) {
                    triggerAndroidAlarm(
                      buildAlarmIntentUrl(
                        alarm.hindi,
                        alarm.hour,
                        alarm.minute,
                      ),
                    );
                  } else {
                    window.alert(
                      `${alarm.hindi} नमाज़\nवक़्त: ${alarm.display}\n\nअपने Clock App में manually alarm set करें।`,
                    );
                  }
                }}
                data-ocid={`namaz.alarm.${alarm.id}.button`}
              >
                <span className="flex items-center gap-2">
                  <span>🔔</span>
                  <span>{alarm.hindi} अलार्म</span>
                </span>
                <span style={{ opacity: 0.85, fontSize: "12px" }}>
                  {alarm.display}
                </span>
              </button>
            ))}
          </div>
          {!isAndroid && (
            <p className="text-xs text-gray-500 mt-3">
              ⚠️ यह सुविधा Android के Chrome browser में काम करती है। iPhone पर नमाज़
              का वक़्त देखकर manually alarm set करें।
            </p>
          )}
        </div>
      )}
    </div>
  );
}

export function NamazScreen() {
  const { data: prayerTimesData, isLoading, refetch } = usePrayerTimes();

  const [alarmActive, setAlarmActive] = useState(false);
  const [alarmPrayerHindi, setAlarmPrayerHindi] = useState<string | null>(null);
  const [alarmStopped, setAlarmStopped] = useState(false);
  const [countdown, setCountdown] = useState(AUTO_STOP_SECONDS);
  const [, forceUpdate] = useState(0);

  const audioCtxRef = useRef<AudioContext | null>(null);
  const bellIntervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const autoStopRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const countdownRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const checkIntervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  // Listen for admin prayer time updates
  useEffect(() => {
    const onUpdate = () => refetch();
    window.addEventListener("prayerTimesUpdated", onUpdate);
    return () => window.removeEventListener("prayerTimesUpdated", onUpdate);
  }, [refetch]);

  // Force re-render every minute to update next prayer highlight
  useEffect(() => {
    const id = setInterval(() => forceUpdate((n) => n + 1), 60000);
    return () => clearInterval(id);
  }, []);

  const prayers: ParsedPrayer[] = prayerTimesData
    ? buildParsedPrayers(prayerTimesData)
    : [];

  const isFriday = new Date().getDay() === 5;
  const nextPrayer =
    prayers.length > 0 ? getNextPrayer(prayers, isFriday) : null;

  // Sort: on Friday, khutba_juma first; otherwise khutba_juma last
  const sorted = [
    ...prayers.filter((p) => !p.isSpecial),
    ...prayers.filter((p) => p.isSpecial),
  ];
  const displayPrayers = isFriday
    ? [
        ...prayers.filter((p) => p.isSpecial),
        ...prayers.filter((p) => !p.isSpecial),
      ]
    : sorted;

  // Auto alarm check
  useEffect(() => {
    function check() {
      if (alarmActive || prayers.length === 0) return;
      const now = new Date();
      for (const p of prayers) {
        if (p.isSpecial && !isFriday) continue;
        if (p.hour === now.getHours() && p.minute === now.getMinutes()) {
          startAlarm(p.hindi);
          break;
        }
      }
    }
    check();
    checkIntervalRef.current = setInterval(check, 30000);
    return () => {
      if (checkIntervalRef.current) clearInterval(checkIntervalRef.current);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [alarmActive, prayers, isFriday]);

  function startAlarm(prayerHindi: string) {
    setAlarmActive(true);
    setAlarmStopped(false);
    setAlarmPrayerHindi(prayerHindi);
    setCountdown(AUTO_STOP_SECONDS);

    if (!audioCtxRef.current) audioCtxRef.current = createAudioCtx();
    const ctx = audioCtxRef.current;
    playBell(ctx);
    bellIntervalRef.current = setInterval(() => playBell(ctx), 3000);

    countdownRef.current = setInterval(() => {
      setCountdown((prev) => {
        if (prev <= 1) {
          stopAlarm(true);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    autoStopRef.current = setTimeout(
      () => stopAlarm(true),
      AUTO_STOP_SECONDS * 1000,
    );
  }

  function stopAlarm(auto = false) {
    setAlarmActive(false);
    setAlarmPrayerHindi(null);
    if (auto) {
      setAlarmStopped(true);
      setTimeout(() => setAlarmStopped(false), 4000);
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

  const today = new Date().toLocaleDateString("hi-IN", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  return (
    <div className="px-4 py-5" data-ocid="namaz.page">
      {/* Bell stopped success banner */}
      {alarmStopped && (
        <div
          className="rounded-2xl p-4 mb-4 text-center shadow-lg"
          style={{ background: "#1a6b3c" }}
          data-ocid="namaz.alarm.success_state"
        >
          <p className="text-white font-bold text-sm">
            🕌 Bell बंद हो गई — अगली नमाज़ का इंतज़ार करें
          </p>
        </div>
      )}

      {/* Active alarm banner */}
      {alarmActive && (
        <div
          className="rounded-2xl p-4 mb-4 flex flex-col items-center gap-3 shadow-lg"
          style={{ background: "#b91c1c" }}
          data-ocid="namaz.alarm.panel"
        >
          <div className="flex items-center gap-3">
            <span className="text-3xl animate-bounce">🔔</span>
            <div className="text-white text-center">
              <p className="font-bold text-base">
                {alarmPrayerHindi
                  ? `${alarmPrayerHindi} का वक़्त हो गया!`
                  : "नमाज़ का वक़्त हो गया!"}
              </p>
              <p className="text-xs opacity-80">मस्जिद की तरफ़ चलें 🕌</p>
            </div>
          </div>
          <div
            className="px-4 py-1.5 rounded-full text-sm font-mono font-bold"
            style={{ background: "rgba(255,255,255,0.2)", color: "white" }}
          >
            ⏱ {formatCountdown(countdown)} में auto-बंद
          </div>
          <button
            type="button"
            onClick={() => stopAlarm(false)}
            className="w-full py-3 rounded-xl font-bold text-base"
            style={{ background: "white", color: "#b91c1c" }}
            data-ocid="namaz.alarm.close_button"
          >
            ✅ मस्जिद पहुँच गया — Bell बंद करो
          </button>
        </div>
      )}

      {/* Header row */}
      <div className="mb-5 flex items-center justify-between">
        <div>
          <h2 className="font-bold text-xl" style={{ color: "#1a6b3c" }}>
            नमाज़ के वक़्त
          </h2>
          <p className="text-xs text-gray-500 mt-0.5">{today}</p>
        </div>
        {!alarmActive && (
          <button
            type="button"
            onClick={() => startAlarm("नमाज़")}
            title="Bell Test करें"
            className="w-10 h-10 rounded-full flex items-center justify-center text-xl shadow"
            style={{ background: "#1a6b3c", color: "white" }}
            data-ocid="namaz.alarm.toggle"
          >
            🔔
          </button>
        )}
      </div>

      {/* Quran verse banner */}
      <div
        className="rounded-2xl p-4 mb-5 text-center relative overflow-hidden"
        style={{ background: "#1a6b3c" }}
      >
        <div
          className="absolute inset-0 opacity-10 pointer-events-none"
          aria-hidden="true"
        >
          <svg role="img" aria-label="pattern" width="100%" height="100%">
            <defs>
              <pattern
                id="geopat"
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
            <rect width="100%" height="100%" fill="url(#geopat)" />
          </svg>
        </div>
        <p className="text-white font-bold text-base relative">أَقِيمُوا الصَّلَاةَ</p>
        <p className="text-xs relative mt-1" style={{ color: "#c9a84c" }}>
          नमाज़ क़ायम करो
        </p>
        {isFriday && (
          <p
            className="text-xs relative mt-1 font-bold"
            style={{ color: "#ffd700" }}
          >
            🕌 आज जुमा मुबारक है!
          </p>
        )}
      </div>

      {/* Alarm Setup Section */}
      <AlarmSetupSection />

      {/* Prayer Times List */}
      {isLoading ? (
        <div className="space-y-3" data-ocid="namaz.loading_state">
          {[1, 2, 3, 4, 5].map((i) => (
            <div
              key={i}
              className="rounded-2xl p-4 shadow-card animate-pulse"
              style={{ background: "#e8f5ee", height: "80px" }}
            />
          ))}
        </div>
      ) : (
        <div className="space-y-3">
          {displayPrayers.map((prayer) => {
            const isNext = nextPrayer?.id === prayer.id;
            const isDimmed = prayer.isSpecial && !isFriday;
            return (
              <div
                key={prayer.id}
                className="rounded-2xl p-4 shadow-card flex items-center gap-4 transition-all"
                style={{
                  background: isNext ? "#1a6b3c" : "white",
                  opacity: isDimmed ? 0.5 : 1,
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
                    {prayer.hindi}
                  </p>
                  {prayer.isSpecial && (
                    <span
                      className="inline-block text-xs px-2 py-0.5 rounded-full font-bold mt-1"
                      style={{ background: "#c9a84c", color: "#3b2000" }}
                    >
                      {isFriday ? "आज जुमा है ✨" : "सिर्फ़ जुमा"}
                    </span>
                  )}
                </div>
                <div className="text-right flex flex-col items-end gap-2">
                  <p
                    className="font-bold text-xl"
                    style={{ color: isNext ? "white" : "#1a6b3c" }}
                  >
                    {prayer.display}
                  </p>
                  {isNext && (
                    <span
                      className="text-xs px-2 py-0.5 rounded-full font-bold"
                      style={{ background: "#c9a84c", color: "#0f4a29" }}
                    >
                      अगली नमाज़
                    </span>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}

      <p className="text-center text-xs text-gray-400 mt-5">
        नमाज़ के वक़्त अनुमानित हैं। स्थानीय इस्लामी संस्था से verify करें।
      </p>
    </div>
  );
}
