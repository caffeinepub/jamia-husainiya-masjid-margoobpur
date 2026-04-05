import { useState } from "react";
import {
  useAddAnnouncement,
  useAnnouncements,
  useCommitteeMembers,
  useDeleteAnnouncement,
  usePrayerTimes,
  useUpdateMultiplePrayerTimes,
} from "../hooks/useQueries";

const ADMIN_PIN = "786";

const PRAYER_DISPLAY_NAMES: Record<string, string> = {
  fajr: "Fajr",
  zuhr: "Zuhr",
  asr: "Asr",
  maghrib: "Maghrib",
  isha: "Isha",
  khutba_juma: "Khutba Juma",
  juma: "Juma",
};

export function AdminScreen() {
  const [pin, setPin] = useState("");
  const [unlocked, setUnlocked] = useState(false);
  const [activeSection, setActiveSection] = useState<
    "prayer" | "notice" | "committee"
  >("prayer");

  // Prayer times
  const { data: prayers = [] } = usePrayerTimes();
  const updatePrayerTimes = useUpdateMultiplePrayerTimes();
  const [editedTimes, setEditedTimes] = useState<Record<string, string>>({});
  const [saveMsg, setSaveMsg] = useState("");

  // Announcements
  const { data: announcements = [] } = useAnnouncements();
  const addAnnouncement = useAddAnnouncement();
  const deleteAnnouncement = useDeleteAnnouncement();
  const [noticeTitle, setNoticeTitle] = useState("");
  const [noticeMessage, setNoticeMessage] = useState("");
  const [noticeDate, setNoticeDate] = useState("");

  // Committee
  const { data: members = [] } = useCommitteeMembers();

  function handleUnlock(e: React.FormEvent) {
    e.preventDefault();
    if (pin === ADMIN_PIN) {
      setUnlocked(true);
    } else {
      alert("PIN galat hai! Sahi PIN dalo.");
      setPin("");
    }
  }

  function handleSavePrayerTimes() {
    const updates: Array<[string, string]> = Object.entries(editedTimes).filter(
      ([, v]) => v.trim() !== "",
    );
    if (updates.length === 0) {
      alert("Koi changes nahi kiye!");
      return;
    }
    updatePrayerTimes.mutate(
      { pin: ADMIN_PIN, times: updates },
      {
        onSuccess: () => {
          setSaveMsg("✅ Prayer times update ho gaye!");
          setEditedTimes({});
          setTimeout(() => setSaveMsg(""), 3000);
        },
        onError: () => {
          setSaveMsg("❌ Problem ho gayi. Dobara try karo.");
          setTimeout(() => setSaveMsg(""), 3000);
        },
      },
    );
  }

  function handleAddNotice(e: React.FormEvent) {
    e.preventDefault();
    if (!noticeTitle.trim() || !noticeMessage.trim() || !noticeDate.trim()) {
      alert("Sab fields bharo!");
      return;
    }
    addAnnouncement.mutate(
      {
        pin: ADMIN_PIN,
        title: noticeTitle.trim(),
        message: noticeMessage.trim(),
        date: noticeDate.trim(),
      },
      {
        onSuccess: () => {
          setNoticeTitle("");
          setNoticeMessage("");
          setNoticeDate("");
        },
        onError: () => alert("Problem ho gayi. Dobara try karo."),
      },
    );
  }

  function handleDeleteNotice(idx: number) {
    deleteAnnouncement.mutate(
      { pin: ADMIN_PIN, id: BigInt(idx) },
      {
        onError: () => alert("Problem ho gayi."),
      },
    );
  }

  if (!unlocked) {
    return (
      <div className="flex flex-col">
        <div
          className="px-4 py-4"
          style={{
            background: "linear-gradient(90deg, #0f4a29 0%, #1a6b3a 100%)",
          }}
        >
          <div className="text-white font-bold text-base">🔒 Admin Panel</div>
          <div className="text-xs" style={{ color: "rgba(255,255,255,0.7)" }}>
            Sirf admin ke liye
          </div>
        </div>
        <div className="p-6 flex flex-col items-center gap-6">
          <div className="text-5xl mt-4">🔐</div>
          <div className="text-center">
            <div className="font-bold text-lg" style={{ color: "#0f4a29" }}>
              Admin Login
            </div>
            <div className="text-sm mt-1" style={{ color: "#888" }}>
              PIN enter karke admin panel kholein
            </div>
          </div>
          <form
            onSubmit={handleUnlock}
            className="w-full max-w-xs flex flex-col gap-3"
          >
            <input
              type="password"
              value={pin}
              onChange={(e) => setPin(e.target.value)}
              placeholder="Admin PIN dalo"
              className="w-full px-4 py-3 rounded-xl border text-center text-lg tracking-widest"
              style={{ borderColor: "#c8e6c9", outline: "none" }}
              data-ocid="admin.pin.input"
            />
            <button
              type="submit"
              className="w-full py-3 rounded-xl font-bold text-base"
              style={{ background: "#1a6b3a", color: "white" }}
              data-ocid="admin.login.submit_button"
            >
              Login karo
            </button>
          </form>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col">
      {/* Header */}
      <div
        className="px-4 py-3 flex items-center justify-between"
        style={{
          background: "linear-gradient(90deg, #0f4a29 0%, #1a6b3a 100%)",
        }}
      >
        <div>
          <div className="text-white font-bold text-base">⚙️ Admin Panel</div>
          <div className="text-xs" style={{ color: "rgba(255,255,255,0.7)" }}>
            Masjid manage karo
          </div>
        </div>
        <button
          type="button"
          onClick={() => {
            setUnlocked(false);
            setPin("");
          }}
          className="text-xs px-3 py-1.5 rounded-full font-semibold"
          style={{ background: "rgba(255,255,255,0.15)", color: "white" }}
          data-ocid="admin.logout.button"
        >
          Logout
        </button>
      </div>

      {/* Section Tabs */}
      <div className="flex" style={{ background: "#0f4a29" }}>
        {(
          [
            { id: "prayer", label: "🕌 Prayer Times" },
            { id: "notice", label: "📢 Notices" },
            { id: "committee", label: "👥 Committee" },
          ] as const
        ).map((tab) => (
          <button
            key={tab.id}
            type="button"
            onClick={() => setActiveSection(tab.id)}
            className="flex-1 py-2.5 text-xs font-semibold"
            style={{
              color:
                activeSection === tab.id ? "#c9a84c" : "rgba(255,255,255,0.65)",
              borderBottom:
                activeSection === tab.id
                  ? "2px solid #c9a84c"
                  : "2px solid transparent",
            }}
            data-ocid={`admin.${tab.id}.tab`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      <div className="p-4">
        {/* Prayer Times Section */}
        {activeSection === "prayer" && (
          <div className="flex flex-col gap-3">
            <div className="font-bold text-sm" style={{ color: "#0f4a29" }}>
              Prayer Times Edit karo
            </div>
            {saveMsg && (
              <div
                className="px-4 py-2 rounded-xl text-sm font-semibold text-center"
                style={{
                  background: saveMsg.startsWith("✅") ? "#e8f5e9" : "#ffebee",
                  color: saveMsg.startsWith("✅") ? "#1a6b3a" : "#c0392b",
                }}
                data-ocid="admin.save_prayer_times.success_state"
              >
                {saveMsg}
              </div>
            )}
            {prayers.map((prayer) => (
              <div
                key={prayer.name}
                className="flex items-center gap-3 px-4 py-3 rounded-xl"
                style={{
                  background: "white",
                  border: "1px solid #e8f5e9",
                  boxShadow: "0 1px 4px rgba(0,0,0,0.06)",
                }}
              >
                <div className="flex-1">
                  <div
                    className="font-semibold text-sm"
                    style={{ color: "#0f4a29" }}
                  >
                    {PRAYER_DISPLAY_NAMES[prayer.name] || prayer.name}
                  </div>
                  <div className="text-xs" style={{ color: "#888" }}>
                    Abhi: {prayer.time}
                  </div>
                </div>
                <input
                  type="text"
                  value={editedTimes[prayer.name] ?? ""}
                  onChange={(e) =>
                    setEditedTimes((prev) => ({
                      ...prev,
                      [prayer.name]: e.target.value,
                    }))
                  }
                  placeholder={prayer.time}
                  className="w-28 px-2 py-1.5 rounded-lg border text-sm text-center"
                  style={{ borderColor: "#c8e6c9", outline: "none" }}
                  data-ocid={`admin.prayer_${prayer.name}.input`}
                />
              </div>
            ))}
            <button
              type="button"
              onClick={handleSavePrayerTimes}
              disabled={updatePrayerTimes.isPending}
              className="w-full py-3 rounded-xl font-bold"
              style={{
                background: "#1a6b3a",
                color: "white",
                opacity: updatePrayerTimes.isPending ? 0.7 : 1,
              }}
              data-ocid="admin.save_prayer_times.button"
            >
              {updatePrayerTimes.isPending
                ? "Save ho raha hai..."
                : "✅ Save karo"}
            </button>
          </div>
        )}

        {/* Notices Section */}
        {activeSection === "notice" && (
          <div className="flex flex-col gap-4">
            {/* Add Notice Form */}
            <div
              className="rounded-xl overflow-hidden"
              style={{
                background: "white",
                border: "1px solid #e8f5e9",
                boxShadow: "0 2px 8px rgba(0,0,0,0.06)",
              }}
            >
              <div className="px-4 py-2" style={{ background: "#e8f5e9" }}>
                <span
                  className="font-bold text-sm"
                  style={{ color: "#0f4a29" }}
                >
                  Naya Notice Add karo
                </span>
              </div>
              <form
                onSubmit={handleAddNotice}
                className="p-4 flex flex-col gap-3"
              >
                <input
                  type="text"
                  value={noticeTitle}
                  onChange={(e) => setNoticeTitle(e.target.value)}
                  placeholder="Notice Title"
                  className="px-3 py-2 rounded-lg border text-sm"
                  style={{ borderColor: "#c8e6c9", outline: "none" }}
                  data-ocid="admin.notice_title.input"
                />
                <input
                  type="text"
                  value={noticeDate}
                  onChange={(e) => setNoticeDate(e.target.value)}
                  placeholder="Date (jaise: 5 April 2026)"
                  className="px-3 py-2 rounded-lg border text-sm"
                  style={{ borderColor: "#c8e6c9", outline: "none" }}
                  data-ocid="admin.notice_date.input"
                />
                <textarea
                  value={noticeMessage}
                  onChange={(e) => setNoticeMessage(e.target.value)}
                  placeholder="Notice Message likhein..."
                  rows={3}
                  className="px-3 py-2 rounded-lg border text-sm resize-none"
                  style={{ borderColor: "#c8e6c9", outline: "none" }}
                  data-ocid="admin.notice_message.textarea"
                />
                <button
                  type="submit"
                  disabled={addAnnouncement.isPending}
                  className="py-2.5 rounded-xl font-bold text-sm"
                  style={{
                    background: "#1a6b3a",
                    color: "white",
                    opacity: addAnnouncement.isPending ? 0.7 : 1,
                  }}
                  data-ocid="admin.add_notice.submit_button"
                >
                  {addAnnouncement.isPending
                    ? "Add ho raha hai..."
                    : "+ Notice Add karo"}
                </button>
              </form>
            </div>

            {/* Existing Notices */}
            <div className="font-bold text-sm" style={{ color: "#0f4a29" }}>
              Purane Notices
            </div>
            {announcements.length === 0 ? (
              <div
                className="rounded-xl p-4 text-center"
                style={{ background: "#f5f5f5" }}
                data-ocid="admin.notices.empty_state"
              >
                <div className="text-sm" style={{ color: "#888" }}>
                  Koi notice nahi hai
                </div>
              </div>
            ) : (
              announcements.map((notice, i) => (
                <div
                  key={`${notice.title}-${i}`}
                  className="rounded-xl overflow-hidden"
                  style={{
                    background: "white",
                    border: "1px solid #e8f5e9",
                    boxShadow: "0 1px 4px rgba(0,0,0,0.06)",
                  }}
                  data-ocid={`admin.notice.item.${i + 1}`}
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
                    <button
                      type="button"
                      onClick={() => handleDeleteNotice(i)}
                      className="text-xs px-2 py-1 rounded-lg"
                      style={{ background: "#ffebee", color: "#c0392b" }}
                      data-ocid={`admin.delete_notice.button.${i + 1}`}
                    >
                      Delete
                    </button>
                  </div>
                  <div className="px-4 py-2">
                    <div className="text-xs" style={{ color: "#888" }}>
                      {notice.date}
                    </div>
                    <div className="text-sm mt-1" style={{ color: "#333" }}>
                      {notice.message}
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        )}

        {/* Committee Section */}
        {activeSection === "committee" && (
          <div className="flex flex-col gap-3">
            <div className="font-bold text-sm" style={{ color: "#0f4a29" }}>
              Committee Members
            </div>
            {members.length === 0 ? (
              <div
                className="rounded-xl p-4 text-center"
                style={{ background: "#f5f5f5" }}
                data-ocid="admin.committee.empty_state"
              >
                <div className="text-sm" style={{ color: "#888" }}>
                  Koi member nahi. Contact screen se add karein.
                </div>
              </div>
            ) : (
              members.map((member, i) => (
                <div
                  key={String(member.id)}
                  className="flex items-center gap-3 px-4 py-3 rounded-xl"
                  style={{
                    background: "white",
                    border: "1px solid #e8f5e9",
                    boxShadow: "0 1px 4px rgba(0,0,0,0.06)",
                  }}
                  data-ocid={`admin.member.item.${i + 1}`}
                >
                  <div
                    className="w-9 h-9 rounded-full flex items-center justify-center font-bold text-white text-sm flex-shrink-0"
                    style={{ background: "#1a6b3a" }}
                  >
                    {member.name.charAt(0).toUpperCase()}
                  </div>
                  <div className="flex-1">
                    <div
                      className="font-semibold text-sm"
                      style={{ color: "#0f4a29" }}
                    >
                      {member.name}
                    </div>
                    <div className="text-xs" style={{ color: "#888" }}>
                      {member.role} — {member.phoneNumber}
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        )}
      </div>
    </div>
  );
}
