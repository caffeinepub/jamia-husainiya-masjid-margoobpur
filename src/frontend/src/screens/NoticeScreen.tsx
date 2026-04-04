import { useEffect, useState } from "react";
import type { Notice } from "../data/notices";
import { NOTICES } from "../data/notices";

const NOTICES_KEY = "masjid_notices";

function loadNotices(): Notice[] {
  try {
    const s = localStorage.getItem(NOTICES_KEY);
    if (s) {
      const parsed = JSON.parse(s) as Notice[];
      if (parsed.length > 0) return parsed;
    }
  } catch {}
  return NOTICES;
}

export function NoticeScreen() {
  const [notices, setNotices] = useState<Notice[]>(loadNotices);

  useEffect(() => {
    function onStorage(e: StorageEvent) {
      if (e.key === NOTICES_KEY) setNotices(loadNotices());
    }
    window.addEventListener("storage", onStorage);
    const onFocus = () => setNotices(loadNotices());
    window.addEventListener("focus", onFocus);
    return () => {
      window.removeEventListener("storage", onStorage);
      window.removeEventListener("focus", onFocus);
    };
  }, []);

  return (
    <div className="px-4 py-5" data-ocid="notice.page">
      <div className="mb-5">
        <h2 className="font-bold text-xl" style={{ color: "#1a6b3c" }}>
          सूचनाएं और एलान
        </h2>
        <p className="text-xs text-gray-500 mt-0.5">
          मस्जिद की गतिविधियों से अपडेट रहें
        </p>
      </div>

      {notices.length === 0 ? (
        <div
          className="bg-white rounded-2xl p-8 text-center text-sm text-gray-400 shadow-card"
          data-ocid="notice.empty_state"
        >
          <div className="text-4xl mb-3">📋</div>
          <p>कोई सूचना नहीं है।</p>
          <p className="text-xs mt-1">Admin panel से सूचनाएं जोड़ें।</p>
        </div>
      ) : (
        <div className="space-y-3">
          {notices.map((notice, index) => (
            <div
              key={notice.id}
              className="bg-white rounded-2xl p-4 shadow-card"
              data-ocid={`notice.item.${index + 1}`}
            >
              <div className="flex items-start justify-between gap-2 mb-2">
                <h3 className="font-bold text-sm text-gray-800 leading-snug flex-1">
                  {notice.title}
                </h3>
                {notice.important && (
                  <span
                    className="flex-shrink-0 text-xs px-2 py-0.5 rounded-full font-bold"
                    style={{ background: "#fff0f0", color: "#c0392b" }}
                  >
                    ज़रूरी
                  </span>
                )}
              </div>
              <div className="flex items-center gap-2 mb-2">
                <span
                  className="text-xs px-2 py-0.5 rounded-full font-medium"
                  style={{ background: "#e8f5ee", color: "#1a6b3c" }}
                >
                  {notice.date}
                </span>
                {notice.category && (
                  <span className="text-xs text-gray-400">
                    {notice.category}
                  </span>
                )}
              </div>
              <p className="text-xs text-gray-600 leading-relaxed">
                {notice.description}
              </p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
