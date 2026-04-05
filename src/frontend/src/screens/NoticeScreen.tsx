import { useAnnouncements } from "../hooks/useQueries";

export function NoticeScreen() {
  const { data: announcements = [], isLoading } = useAnnouncements();

  return (
    <div className="flex flex-col">
      {/* Header */}
      <div
        className="px-4 py-4"
        style={{
          background: "linear-gradient(90deg, #0f4a29 0%, #1a6b3a 100%)",
        }}
      >
        <div className="text-white font-bold text-base">📢 Notice Board</div>
        <div className="text-xs" style={{ color: "rgba(255,255,255,0.7)" }}>
          Masjid ki taaza khabren / Notices
        </div>
      </div>

      <div className="p-4 flex flex-col gap-3">
        {isLoading ? (
          <div className="flex flex-col gap-3" data-ocid="notice.loading_state">
            {[1, 2, 3].map((i) => (
              <div
                key={i}
                className="h-24 rounded-xl animate-pulse"
                style={{ background: "#e8f5e9" }}
              />
            ))}
          </div>
        ) : announcements.length === 0 ? (
          <div
            className="rounded-2xl p-8 flex flex-col items-center gap-3 text-center"
            style={{ background: "white", border: "1px solid #e8f5e9" }}
            data-ocid="notice.empty_state"
          >
            <span className="text-4xl">📭</span>
            <div className="font-bold" style={{ color: "#0f4a29" }}>
              Koi Notice Nahi
            </div>
            <div className="text-sm" style={{ color: "#888" }}>
              Abhi koi notice nahi hai. Jab koi announcement aayega, yahan
              dikhega.
            </div>
          </div>
        ) : (
          announcements.map((notice, i) => (
            <div
              key={`${notice.title}-${notice.date}`}
              className="rounded-xl overflow-hidden"
              style={{
                background: "white",
                border: "1px solid #e8f5e9",
                boxShadow: "0 2px 8px rgba(0,0,0,0.06)",
              }}
              data-ocid={`notice.item.${i + 1}`}
            >
              <div
                className="px-4 py-2 flex items-center justify-between"
                style={{ background: "#e8f5e9" }}
              >
                <span
                  className="font-bold text-sm"
                  style={{ color: "#0f4a29" }}
                >
                  {notice.title}
                </span>
                <span className="text-xs" style={{ color: "#555" }}>
                  📅 {notice.date}
                </span>
              </div>
              <div className="px-4 py-3">
                <p className="text-sm" style={{ color: "#333" }}>
                  {notice.message}
                </p>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
