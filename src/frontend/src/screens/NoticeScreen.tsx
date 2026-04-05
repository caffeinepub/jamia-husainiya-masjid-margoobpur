import type { Announcement } from "../backend.d";
import { useAnnouncements } from "../hooks/useQueries";

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

export function NoticeScreen() {
  const { data: announcements, isLoading } = useAnnouncements();

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

      {isLoading ? (
        <div className="space-y-3" data-ocid="notice.loading_state">
          {[1, 2, 3].map((i) => (
            <div
              key={i}
              className="rounded-2xl p-4 shadow-card animate-pulse"
              style={{ background: "#e8f5ee", height: "100px" }}
            />
          ))}
        </div>
      ) : !announcements || announcements.length === 0 ? (
        <div
          className="bg-white rounded-2xl p-8 text-center shadow-card"
          data-ocid="notice.empty_state"
        >
          <div className="text-4xl mb-3">📋</div>
          <p className="text-sm text-gray-500">कोई सूचना नहीं है।</p>
          <p className="text-xs text-gray-400 mt-1">Admin panel से सूचनाएं जोड़ें।</p>
        </div>
      ) : (
        <div className="space-y-3">
          {(announcements as Announcement[]).map((ann, index) => (
            <div
              key={String(ann.id)}
              className="bg-white rounded-2xl p-4 shadow-card"
              data-ocid={`notice.item.${index + 1}`}
            >
              <h3 className="font-bold text-sm text-gray-800 leading-snug mb-2">
                {ann.title}
              </h3>
              <p className="text-xs text-gray-600 leading-relaxed mb-2">
                {ann.body}
              </p>
              <span
                className="text-xs px-2 py-0.5 rounded-full font-medium"
                style={{ background: "#e8f5ee", color: "#1a6b3c" }}
              >
                {formatTimestamp(ann.timestamp)}
              </span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
