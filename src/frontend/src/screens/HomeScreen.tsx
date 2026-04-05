import type { Tab } from "../App";
import type { Announcement, PrayerTime } from "../backend.d";
import { useAnnouncements, usePrayerTimes } from "../hooks/useQueries";

const PRAYER_META: Record<string, { hindi: string; icon: string }> = {
  fajr: { hindi: "फ़ज्र", icon: "🌙" },
  zohar: { hindi: "ज़ोहर", icon: "🌅" },
  asr: { hindi: "अस्र", icon: "☀️" },
  maghrib: { hindi: "मग़रिब", icon: "🌇" },
  isha: { hindi: "इशा", icon: "🌃" },
  khutba_juma: { hindi: "ख़ुत्बा जुमा", icon: "🕌" },
};

const REGULAR_PRAYER_ORDER = ["fajr", "zohar", "asr", "maghrib", "isha"];

function to12h(timeStr: string): string {
  const trimmed = timeStr.trim();
  const ampmMatch = trimmed.match(/^(\d+):(\d+)\s*(AM|PM)$/i);
  if (ampmMatch) return trimmed;
  const parts = trimmed.split(":");
  let h = Number.parseInt(parts[0], 10);
  const m = parts[1] ?? "00";
  const suffix = h >= 12 ? "PM" : "AM";
  if (h > 12) h -= 12;
  if (h === 0) h = 12;
  return `${h}:${m} ${suffix}`;
}

function getNextPrayer(
  prayers: PrayerTime[],
): { hindi: string; icon: string; time: string; arabic: string } | null {
  const now = new Date();
  const curMin = now.getHours() * 60 + now.getMinutes();
  const isFriday = now.getDay() === 5;

  const parsed = prayers
    .filter((p) => {
      const id = p.name.toLowerCase().replace(/ /g, "_");
      if (id === "khutba_juma") return isFriday;
      return true;
    })
    .map((p) => {
      const id = p.name.toLowerCase().replace(/ /g, "_");
      const timeStr = p.time.trim();
      const ampmMatch = timeStr.match(/^(\d+):(\d+)\s*(AM|PM)$/i);
      let hour = 0;
      let minute = 0;
      if (ampmMatch) {
        hour = Number.parseInt(ampmMatch[1], 10);
        minute = Number.parseInt(ampmMatch[2], 10);
        if (ampmMatch[3].toUpperCase() === "PM" && hour !== 12) hour += 12;
        if (ampmMatch[3].toUpperCase() === "AM" && hour === 12) hour = 0;
      } else {
        const parts = timeStr.split(":");
        hour = Number.parseInt(parts[0], 10);
        minute = Number.parseInt(parts[1] ?? "0", 10);
      }
      const meta = PRAYER_META[id];
      return {
        hindi: meta?.hindi ?? p.name,
        icon: meta?.icon ?? "🕌",
        arabic: "",
        time: to12h(p.time),
        totalMin: hour * 60 + minute,
      };
    })
    .sort((a, b) => a.totalMin - b.totalMin);

  for (const p of parsed) {
    if (p.totalMin > curMin) return p;
  }
  return parsed[0] ?? null;
}

function formatTimestamp(ts: bigint): string {
  try {
    const ms = Number(ts / 1_000_000n);
    return new Date(ms).toLocaleDateString("hi-IN", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  } catch {
    return "";
  }
}

interface Props {
  onTabChange: (tab: Tab) => void;
}

export function HomeScreen({ onTabChange }: Props) {
  const { data: prayerTimes } = usePrayerTimes();
  const { data: announcements } = useAnnouncements();

  const nextPrayer = prayerTimes
    ? getNextPrayer(prayerTimes as PrayerTime[])
    : null;
  const latestAnn =
    announcements && announcements.length > 0
      ? (announcements[0] as Announcement)
      : null;

  // Build mini prayer strip (regular prayers only, in order)
  const prayerMap = new Map<string, string>();
  if (prayerTimes) {
    for (const pt of prayerTimes as PrayerTime[]) {
      prayerMap.set(pt.name.toLowerCase().replace(/ /g, "_"), pt.time);
    }
  }

  return (
    <div data-ocid="home.page">
      {/* Mosque illustration */}
      <div className="relative">
        <img
          src="/assets/generated/mosque-illustration.dim_800x400.png"
          alt="जामिया हुसैनिया मस्जिद मरगूबपुर"
          className="w-full object-cover"
          style={{
            maxHeight: "200px",
            borderBottomLeftRadius: "16px",
            borderBottomRightRadius: "16px",
          }}
        />
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            background:
              "linear-gradient(to bottom, transparent 50%, rgba(240,247,240,0.7) 100%)",
            borderBottomLeftRadius: "16px",
            borderBottomRightRadius: "16px",
          }}
        />
      </div>

      <div className="px-4 py-4 space-y-4">
        {/* Welcome card */}
        <div className="bg-white rounded-2xl p-4 shadow-card">
          <div className="flex items-center gap-2 mb-2">
            <span className="text-2xl">🕌</span>
            <div>
              <h2 className="font-bold text-lg" style={{ color: "#1a6b3c" }}>
                अस्सलामु अलैकुम
              </h2>
              <p
                className="text-xs"
                style={{ color: "#c9a84c", fontFamily: "serif" }}
              >
                وَعَلَيْكُمُ السَّلَام
              </p>
            </div>
          </div>
          <p className="text-sm text-gray-600 leading-relaxed">
            जामिया हुसैनिया मस्जिद मरगूबपुर में आपका स्वागत है। अल्लाह आपको और आपके परिवार
            को बरकत दे। रोज़ाना की नमाज़, जुमे की ख़ुत्बा और सामुदायिक कार्यक्रमों में शामिल
            हों।
          </p>
        </div>

        {/* Next prayer card */}
        {nextPrayer && (
          <button
            type="button"
            className="w-full text-left rounded-2xl p-4 shadow-card flex items-center gap-4"
            style={{ background: "#1a6b3c" }}
            onClick={() => onTabChange("namaz")}
            data-ocid="home.namaz.button"
          >
            <div className="text-3xl">{nextPrayer.icon}</div>
            <div className="flex-1">
              <p
                className="text-xs font-semibold mb-0.5"
                style={{ color: "#c9a84c" }}
              >
                अगली नमाज़
              </p>
              <p className="text-white font-bold text-base">
                {nextPrayer.hindi}
              </p>
            </div>
            <div className="text-right">
              <p className="text-white font-bold text-xl">{nextPrayer.time}</p>
              <span
                className="text-xs px-2 py-0.5 rounded-full font-semibold"
                style={{ background: "#c9a84c", color: "#0f4a29" }}
              >
                जल्द ही
              </span>
            </div>
          </button>
        )}

        {/* Latest announcement */}
        <div
          className="bg-white rounded-2xl p-4 shadow-card"
          data-ocid="home.notice.card"
        >
          <div className="flex items-center justify-between mb-3">
            <h3 className="font-bold text-sm" style={{ color: "#1a6b3c" }}>
              ताज़ा सूचना
            </h3>
            <button
              type="button"
              className="text-xs font-semibold px-3 py-1 rounded-full"
              style={{ background: "#e8f5ee", color: "#1a6b3c" }}
              onClick={() => onTabChange("notice")}
              data-ocid="home.view_all.button"
            >
              सभी देखें
            </button>
          </div>
          {latestAnn ? (
            <div>
              <p className="font-semibold text-sm text-gray-800 mb-1">
                {latestAnn.title}
              </p>
              <p className="text-xs text-gray-500 mb-1">
                {formatTimestamp(latestAnn.timestamp)}
              </p>
              <p className="text-xs text-gray-600 line-clamp-2">
                {latestAnn.body}
              </p>
            </div>
          ) : (
            <p className="text-xs text-gray-400">अभी कोई सूचना नहीं है।</p>
          )}
        </div>

        {/* Prayer times mini strip */}
        <div className="bg-white rounded-2xl p-4 shadow-card">
          <h3 className="font-bold text-sm mb-3" style={{ color: "#1a6b3c" }}>
            आज की नमाज़ के वक़्त
          </h3>
          <div className="flex justify-between">
            {REGULAR_PRAYER_ORDER.map((id) => {
              const meta = PRAYER_META[id];
              const time = prayerMap.get(id);
              return (
                <div key={id} className="flex flex-col items-center gap-1">
                  <span className="text-lg">{meta?.icon}</span>
                  <span className="text-[10px] text-gray-500">
                    {meta?.hindi}
                  </span>
                  <span
                    className="text-xs font-bold"
                    style={{ color: "#1a6b3c" }}
                  >
                    {time ? to12h(time) : "--"}
                  </span>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="text-center py-4 px-4">
        <p className="text-xs text-gray-400">
          © {new Date().getFullYear()}. Built with ❤️ using{" "}
          <a
            href={`https://caffeine.ai?utm_source=caffeine-footer&utm_medium=referral&utm_content=${encodeURIComponent(window.location.hostname)}`}
            target="_blank"
            rel="noopener noreferrer"
            className="underline"
          >
            caffeine.ai
          </a>
        </p>
      </footer>
    </div>
  );
}
