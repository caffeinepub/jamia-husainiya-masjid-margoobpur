import { useEffect, useRef, useState } from "react";
import type { Tab } from "../App";
import { useNotices, usePrayerTimes } from "../hooks/useQueries";
import { getDisplayName, isJumaPrayer, parseTime } from "../utils/prayerUtils";

interface Props {
  onTabChange: (tab: Tab) => void;
}

export function HomeScreen({ onTabChange: _onTabChange }: Props) {
  const [now, setNow] = useState(new Date());
  const { data: prayers = [] } = usePrayerTimes();
  const { data: notices = [] } = useNotices();

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
  const regularPrayers = prayers
    .filter((p) => !isJumaPrayer(p.name))
    .sort((a, b) => parseTime(a.time) - parseTime(b.time));

  const nextPrayer =
    regularPrayers.find((p) => parseTime(p.time) > currentMinutes) ||
    regularPrayers[0];

  const nextPrayerDisplay = nextPrayer
    ? `${getDisplayName(nextPrayer.name)} prayer at ${nextPrayer.time}`
    : "Isha prayer at 8:30 PM";

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
          data-ocid="home.bell_banner.panel"
        >
          <div>
            <div
              style={{ color: "white", fontWeight: "bold", fontSize: "13px" }}
            >
              🔔 Namaz ka waqt ho gaya! Masjid pahunche.
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
              padding: "6px 10px",
              fontSize: "11px",
              fontWeight: "bold",
              cursor: "pointer",
              flexShrink: 0,
            }}
            data-ocid="home.bell_stop.button"
          >
            ✅ Masjid pahunch gaya — Bell band karo
          </button>
        </div>
      )}

      {/* Header */}
      <div
        style={{
          background: "#1a7a3c",
          padding: "10px 16px",
          borderBottom: "2px solid #145e2e",
        }}
      >
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
          }}
        >
          <span style={{ fontSize: "26px", color: "#f5c518" }}>☪</span>
          <h1
            style={{
              color: "white",
              fontSize: "13px",
              fontWeight: "bold",
              textAlign: "center",
              flex: 1,
              margin: "0 8px",
              lineHeight: 1.3,
            }}
          >
            Jamia Husainiya Masjid Margoobpur
          </h1>
          <span style={{ fontSize: "26px", color: "#f5c518" }}>☪</span>
        </div>
        <div
          style={{
            display: "flex",
            justifyContent: "flex-end",
            marginTop: "4px",
          }}
        >
          <button
            type="button"
            onClick={() => (bellActive ? handleStopBell() : triggerBell())}
            style={{
              background: bellActive ? "#f5c518" : "rgba(255,255,255,0.15)",
              border: "none",
              borderRadius: "50%",
              width: "28px",
              height: "28px",
              fontSize: "14px",
              cursor: "pointer",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
            data-ocid="home.bell.button"
          >
            🔔
          </button>
        </div>
      </div>

      {/* Mosque Image */}
      <div
        style={{
          background: "#f0f9f0",
          paddingTop: "12px",
          textAlign: "center",
        }}
      >
        <img
          src="/assets/generated/mosque-illustration-transparent.dim_400x200.png"
          alt="Jamia Husainiya Masjid"
          style={{ width: "100%", maxHeight: "180px", objectFit: "contain" }}
        />
      </div>

      <div style={{ padding: "12px 16px" }}>
        {/* Assalamu Alaikum */}
        <div style={{ textAlign: "center", marginBottom: "10px" }}>
          <div
            style={{ color: "#1a7a3c", fontWeight: "bold", fontSize: "20px" }}
          >
            Assalamu Alaikum
          </div>
        </div>

        {/* Coming Soon */}
        <div
          style={{ textAlign: "center", marginBottom: "16px" }}
          data-ocid="home.next_prayer.panel"
        >
          <div style={{ color: "#555", fontSize: "13px" }}>Coming Soon:</div>
          <div
            style={{
              color: "#1a7a3c",
              fontWeight: "bold",
              fontSize: "15px",
              marginTop: "2px",
            }}
          >
            {nextPrayerDisplay}
          </div>
        </div>

        <div style={{ borderTop: "1px solid #c8e6c9", marginBottom: "14px" }} />

        {/* Notices */}
        <div>
          <div
            style={{
              color: "#1a7a3c",
              fontWeight: "bold",
              fontSize: "15px",
              marginBottom: "10px",
            }}
          >
            Notices / Suchnaein
          </div>
          {notices.length === 0 ? (
            <p
              style={{ color: "#888", fontSize: "13px" }}
              data-ocid="home.notices.empty_state"
            >
              Koi suchna nahi
            </p>
          ) : (
            <div data-ocid="home.notices.list">
              {notices.map((notice, i) => (
                <div
                  key={String(notice.id)}
                  data-ocid={`home.notice.item.${i + 1}`}
                >
                  <div
                    style={{
                      fontWeight: "bold",
                      fontSize: "14px",
                      color: "#1a7a3c",
                    }}
                  >
                    {notice.title}
                  </div>
                  <p
                    style={{
                      fontSize: "13px",
                      color: "#444",
                      margin: "3px 0 10px 0",
                    }}
                  >
                    {notice.body}
                  </p>
                  {i < notices.length - 1 && (
                    <div
                      style={{
                        borderTop: "1px solid #a5d6a7",
                        marginBottom: "10px",
                      }}
                    />
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      <div
        style={{
          textAlign: "center",
          padding: "16px",
          color: "#888",
          fontSize: "11px",
          borderTop: "1px solid #c8e6c9",
        }}
      >
        © {new Date().getFullYear()}.{" "}
        <a
          href={`https://caffeine.ai?utm_source=caffeine-footer&utm_medium=referral&utm_content=${encodeURIComponent(window.location.hostname)}`}
          target="_blank"
          rel="noopener noreferrer"
          style={{ color: "#1a7a3c" }}
        >
          Built with ❤️ using caffeine.ai
        </a>
      </div>
    </div>
  );
}
