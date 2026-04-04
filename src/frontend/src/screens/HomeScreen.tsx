import type { Tab } from "../App";
import { NOTICES } from "../data/notices";
import { PRAYERS, getNextPrayer } from "../data/prayers";

interface Props {
  onTabChange: (tab: Tab) => void;
}

export function HomeScreen({ onTabChange }: Props) {
  const nextPrayer = getNextPrayer();
  const latestNotice = NOTICES[0] ?? null;

  const prayerHindiNames: Record<string, string> = {
    fajr: "फ़जर",
    khutba_juma: "ख़ुत्बा जुमा",
    zohar: "ज़ोहर",
    asr: "अस्र",
    maghrib: "मग़रिब",
    isha: "इशा",
  };

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
              {prayerHindiNames[nextPrayer.id] ?? nextPrayer.english}
            </p>
            <p className="text-xs" style={{ color: "rgba(255,255,255,0.7)" }}>
              {nextPrayer.arabic}
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
          {latestNotice ? (
            <div>
              <div className="flex items-center gap-2 mb-1">
                <span className="font-semibold text-sm text-gray-800">
                  {latestNotice.title}
                </span>
                {latestNotice.important && (
                  <span
                    className="text-xs px-2 py-0.5 rounded-full font-bold"
                    style={{ background: "#fff0f0", color: "#c0392b" }}
                  >
                    ज़रूरी
                  </span>
                )}
              </div>
              <p className="text-xs text-gray-500">{latestNotice.date}</p>
              <p className="text-xs text-gray-600 mt-1 line-clamp-2">
                {latestNotice.description}
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
            {PRAYERS.filter((p) => !p.isSpecial).map((p) => (
              <div key={p.id} className="flex flex-col items-center gap-1">
                <span className="text-lg">{p.icon}</span>
                <span className="text-[10px] text-gray-500">
                  {prayerHindiNames[p.id] ?? p.english}
                </span>
                <span
                  className="text-xs font-bold"
                  style={{ color: "#1a6b3c" }}
                >
                  {p.time}
                </span>
              </div>
            ))}
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
