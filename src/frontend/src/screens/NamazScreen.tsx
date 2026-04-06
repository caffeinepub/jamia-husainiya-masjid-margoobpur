import { useEffect, useRef, useState } from "react";
import { usePrayerTimes } from "../hooks/useQueries";
import {
  ALARM_INTENTS,
  getDisplayName,
  isJumaPrayer,
  launchAlarm,
  parseTime,
} from "../utils/prayerUtils";

export function NamazScreen() {
  const [now, setNow] = useState(new Date());
  const { data: prayers = [], isLoading } = usePrayerTimes();

  const [bellActive, setBellActive] = useState(false);
  const [bellSecondsLeft, setBellSecondsLeft] = useState(15 * 60);
  const bellTimerRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const prevBellPrayerRef = useRef<string | null>(null);

  useEffect(() => {
    const timer = setInterval(() => setNow(new Date()), 10000);
    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    if (!prayers.length) return;
    const regularPrayers = prayers.filter((p) => !isJumaPrayer(p.name));
    const currentMinutes = now.getHours() * 60 + now.getMinutes();
    const currentPrayer = regularPrayers.find(
      (p) => parseTime(p.time) === currentMinutes,
    );
    if (currentPrayer && currentPrayer.name !== prevBellPrayerRef.current) {
      prevBellPrayerRef.current = currentPrayer.name;
      if (!bellActive) triggerBell();
    }
  });

  function triggerBell() {
    setBellActive(true);
    setBellSecondsLeft(15 * 60);
    if (bellTimerRef.current) clearInterval(bellTimerRef.current);
    bellTimerRef.current = setInterval(() => {
      setBellSecondsLeft((prev) => {
        if (prev <= 1) {
          if (bellTimerRef.current) clearInterval(bellTimerRef.current);
          setBellActive(false);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
  }

  function handleStopBell() {
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
  const isFriday = now.getDay() === 5;

  const regularPrayers = prayers
    .filter((p) => !isJumaPrayer(p.name))
    .sort((a, b) => Number(a.order) - Number(b.order));

  const jumaPrayer = prayers.find((p) => isJumaPrayer(p.name));

  const sortedRegular = [...regularPrayers].sort(
    (a, b) => parseTime(a.time) - parseTime(b.time),
  );
  const currentPrayerName = sortedRegular.reduce<string | null>((acc, p) => {
    if (parseTime(p.time) <= currentMinutes) return p.name;
    return acc;
  }, null);
  const nextPrayerName =
    sortedRegular.find((p) => parseTime(p.time) > currentMinutes)?.name ||
    sortedRegular[0]?.name;

  const alarmList = [
    ALARM_INTENTS.fajr,
    ALARM_INTENTS.zuhr,
    ALARM_INTENTS.asr,
    ALARM_INTENTS.maghrib,
    ALARM_INTENTS.isha,
  ];

  return (
    <div style={{ background: "#f0f9f0", minHeight: "100vh" }}>
      {bellActive && (
        <div
          style={{
            background: "#c0392b",
            padding: "10px 16px",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            gap: "8px",
          }}
          data-ocid="namaz.bell_banner.panel"
        >
          <div>
            <div
              style={{ color: "white", fontWeight: "bold", fontSize: "13px" }}
            >
              🔔 Namaz ka waqt ho gaya!
            </div>
            <div style={{ color: "rgba(255,255,255,0.8)", fontSize: "11px" }}>
              Bell {formatCountdown(bellSecondsLeft)} mein band ho jayegi
            </div>
          </div>
          <button
            type="button"
            onClick={handleStopBell}
            style={{
              background: "white",
              color: "#c0392b",
              border: "none",
              borderRadius: "8px",
              padding: "6px 8px",
              fontSize: "10px",
              fontWeight: "bold",
              cursor: "pointer",
              flexShrink: 0,
            }}
            data-ocid="namaz.bell_stop.button"
          >
            ✅ Masjid pahunch gaya
          </button>
        </div>
      )}

      <div
        style={{
          background: "#1a7a3c",
          padding: "12px 16px",
          borderBottom: "2px solid #145e2e",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
        }}
      >
        <h2
          style={{
            color: "white",
            fontWeight: "bold",
            fontSize: "16px",
            margin: 0,
          }}
        >
          🕌 Namaz ka Waqt
        </h2>
        <button
          type="button"
          onClick={() => (bellActive ? handleStopBell() : triggerBell())}
          style={{
            background: bellActive ? "#f5c518" : "rgba(255,255,255,0.2)",
            border: "none",
            borderRadius: "50%",
            width: "30px",
            height: "30px",
            fontSize: "15px",
            cursor: "pointer",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
          data-ocid="namaz.bell.button"
        >
          🔔
        </button>
      </div>

      {isFriday && (
        <div
          style={{
            background: "#e8f5e9",
            padding: "10px 16px",
            textAlign: "center",
            borderBottom: "1px solid #a5d6a7",
          }}
        >
          <span
            style={{ color: "#1a7a3c", fontWeight: "bold", fontSize: "14px" }}
          >
            🕌 Aaj Juma hai! Friday Mubarak
          </span>
        </div>
      )}

      <div style={{ padding: "16px" }}>
        {/* Alarm Setup */}
        <div style={{ marginBottom: "20px" }}>
          <div
            style={{
              fontWeight: "bold",
              fontSize: "14px",
              color: "#1a7a3c",
              marginBottom: "4px",
            }}
          >
            📱 Namaz Alarm Setup
          </div>
          <div
            style={{ fontSize: "12px", color: "#666", marginBottom: "10px" }}
          >
            Android mein Clock app kholkar alarm set karo. Neeche diye button
            dabao.
          </div>
          <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
            {alarmList.map((alarm, i) => (
              <button
                key={alarm.displayName}
                type="button"
                onClick={() =>
                  launchAlarm(
                    alarm.intent,
                    `${alarm.displayName} — ${alarm.time}`,
                  )
                }
                style={{
                  background: "#e8f5e9",
                  border: "1px solid #a5d6a7",
                  borderRadius: "8px",
                  padding: "10px 14px",
                  fontSize: "13px",
                  fontWeight: "600",
                  color: "#145e2e",
                  cursor: "pointer",
                  textAlign: "left",
                }}
                data-ocid={`namaz.alarm.button.${i + 1}`}
              >
                🔔 {alarm.displayName} Alarm Set karo — {alarm.time}
              </button>
            ))}
          </div>
          <div style={{ fontSize: "11px", color: "#888", marginTop: "8px" }}>
            iPhone users: button dabao, time dekhkar manually Clock app mein set
            karo.
          </div>
        </div>

        <div style={{ borderTop: "2px solid #a5d6a7", marginBottom: "16px" }} />

        <div
          style={{
            fontWeight: "bold",
            fontSize: "14px",
            color: "#1a7a3c",
            marginBottom: "10px",
          }}
        >
          Namaz ka Waqt
        </div>

        {isLoading ? (
          <div style={{ color: "#888", fontSize: "13px" }}>Loading...</div>
        ) : (
          <div>
            {isFriday && jumaPrayer && (
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  padding: "10px 12px",
                  borderLeft: "4px solid #f5c518",
                  background: "#fffde7",
                  marginBottom: "4px",
                }}
                data-ocid="namaz.juma.panel"
              >
                <div>
                  <div
                    style={{
                      fontWeight: "bold",
                      fontSize: "14px",
                      color: "#1a7a3c",
                    }}
                  >
                    🕌 {getDisplayName(jumaPrayer.name)}
                  </div>
                  <span
                    style={{
                      background: "#f5c518",
                      color: "#1a7a3c",
                      fontSize: "10px",
                      fontWeight: "bold",
                      padding: "1px 6px",
                      borderRadius: "4px",
                    }}
                  >
                    Sirf Juma
                  </span>
                </div>
                <div
                  style={{
                    fontWeight: "bold",
                    fontSize: "15px",
                    color: "#145e2e",
                  }}
                >
                  {jumaPrayer.time}
                </div>
              </div>
            )}

            {regularPrayers.map((prayer, i) => {
              const isCurrent = prayer.name === currentPrayerName;
              const isNext = prayer.name === nextPrayerName;
              return (
                <div
                  key={String(prayer.order)}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                    padding: "10px 12px",
                    borderLeft: `4px solid ${isCurrent ? "#f5c518" : isNext ? "#1a7a3c" : "#c8e6c9"}`,
                    background: isCurrent
                      ? "#f9fbe7"
                      : isNext
                        ? "#e8f5e9"
                        : "transparent",
                    borderBottom:
                      i < regularPrayers.length - 1
                        ? "1px solid #e8f5e9"
                        : "none",
                  }}
                  data-ocid={`namaz.prayer.item.${i + 1}`}
                >
                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: "8px",
                    }}
                  >
                    <span style={{ fontSize: "16px" }}>🕌</span>
                    <span
                      style={{
                        fontWeight: "600",
                        fontSize: "14px",
                        color: isCurrent ? "#1a7a3c" : "#333",
                      }}
                    >
                      {getDisplayName(prayer.name)}
                    </span>
                  </div>
                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: "8px",
                    }}
                  >
                    {isCurrent && (
                      <span
                        style={{
                          background: "#f5c518",
                          color: "#1a7a3c",
                          fontSize: "10px",
                          fontWeight: "bold",
                          padding: "1px 6px",
                          borderRadius: "4px",
                        }}
                      >
                        Abhi
                      </span>
                    )}
                    {isNext && !isCurrent && (
                      <span
                        style={{
                          background: "#1a7a3c",
                          color: "white",
                          fontSize: "10px",
                          fontWeight: "bold",
                          padding: "1px 6px",
                          borderRadius: "4px",
                        }}
                      >
                        Agle
                      </span>
                    )}
                    <span
                      style={{
                        fontWeight: "bold",
                        fontSize: "14px",
                        color: "#145e2e",
                      }}
                    >
                      {prayer.time}
                    </span>
                  </div>
                </div>
              );
            })}

            {!isFriday && jumaPrayer && (
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  padding: "10px 12px",
                  borderLeft: "4px solid #ccc",
                  opacity: 0.5,
                  marginTop: "4px",
                }}
              >
                <div>
                  <div
                    style={{
                      fontWeight: "600",
                      fontSize: "13px",
                      color: "#888",
                    }}
                  >
                    🕌 {getDisplayName(jumaPrayer.name)}
                  </div>
                  <span
                    style={{
                      background: "#e0e0e0",
                      color: "#888",
                      fontSize: "10px",
                      fontWeight: "bold",
                      padding: "1px 6px",
                      borderRadius: "4px",
                    }}
                  >
                    Sirf Juma
                  </span>
                </div>
                <span
                  style={{
                    fontWeight: "bold",
                    fontSize: "14px",
                    color: "#888",
                  }}
                >
                  {jumaPrayer.time}
                </span>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
