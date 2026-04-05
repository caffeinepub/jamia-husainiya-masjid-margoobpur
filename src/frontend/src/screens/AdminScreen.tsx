import { Loader2 } from "lucide-react";
import { useState } from "react";
import type { Announcement, CommitteeMember, PrayerTime } from "../backend.d";
import {
  useAddAnnouncement,
  useAddCommitteeMember,
  useAnnouncements,
  useCommitteeMembers,
  useDeleteAnnouncement,
  useDeleteCommitteeMember,
  usePrayerTimes,
  useUpdatePrayerTimes,
} from "../hooks/useQueries";

const ADMIN_PIN = "786";
const AUTH_KEY = "masjid_admin_authed";

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

const PRAYER_ORDER = ["fajr", "zohar", "asr", "maghrib", "isha", "khutba_juma"];

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

function to24h(timeStr: string): string {
  // If already HH:MM return as is
  if (/^\d{1,2}:\d{2}$/.test(timeStr)) return timeStr;
  // Parse 12h
  const m = timeStr.match(/^(\d+):(\d+)\s*(AM|PM)$/i);
  if (!m) return timeStr;
  let h = Number.parseInt(m[1], 10);
  const min = m[2];
  const meridiem = m[3].toUpperCase();
  if (meridiem === "PM" && h !== 12) h += 12;
  if (meridiem === "AM" && h === 12) h = 0;
  return `${String(h).padStart(2, "0")}:${min}`;
}

function to12h(timeStr: string): string {
  const [hStr, mStr] = timeStr.split(":");
  let h = Number.parseInt(hStr, 10);
  const m = mStr ?? "00";
  const suffix = h >= 12 ? "PM" : "AM";
  if (h > 12) h -= 12;
  if (h === 0) h = 12;
  return `${h}:${m} ${suffix}`;
}

// ---------- Login Screen ----------
function LoginScreen({ onLogin }: { onLogin: () => void }) {
  const [pin, setPin] = useState("");
  const [error, setError] = useState("");

  function handleLogin() {
    if (pin === ADMIN_PIN) {
      sessionStorage.setItem(AUTH_KEY, "1");
      onLogin();
    } else {
      setError("गलत PIN है। दोबारा कोशिश करें।");
      setPin("");
    }
  }

  return (
    <div
      className="px-4 py-5 flex flex-col items-center"
      data-ocid="admin.login.page"
    >
      <div
        className="rounded-2xl p-6 mb-6 text-center relative overflow-hidden w-full"
        style={{ background: "#1a6b3c" }}
      >
        <div
          className="absolute inset-0 opacity-10 pointer-events-none"
          aria-hidden="true"
        >
          <svg role="img" aria-label="decorative" width="100%" height="100%">
            <defs>
              <pattern
                id="apat"
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
            <rect width="100%" height="100%" fill="url(#apat)" />
          </svg>
        </div>
        <div className="relative">
          <div className="text-5xl mb-2">🔐</div>
          <h2 className="text-white font-bold text-lg">एडमिन पैनल</h2>
          <p className="text-xs mt-1" style={{ color: "#c9a84c" }}>
            जामिया हुसैनिया मस्जिद मरगूबपुर
          </p>
        </div>
      </div>

      <div className="bg-white rounded-2xl p-6 shadow-card w-full max-w-xs">
        <p className="text-sm font-semibold text-gray-700 mb-4 text-center">
          PIN दर्ज करें
        </p>
        <input
          type="password"
          inputMode="numeric"
          placeholder="••••"
          value={pin}
          onChange={(e) => {
            setPin(e.target.value);
            setError("");
          }}
          onKeyDown={(e) => e.key === "Enter" && handleLogin()}
          className="w-full border rounded-xl px-4 py-3 text-center text-xl tracking-widest outline-none mb-3"
          style={{ borderColor: "#c8e6d4" }}
          data-ocid="admin.pin.input"
        />
        {error && (
          <p
            className="text-xs text-red-500 text-center mb-3"
            data-ocid="admin.pin.error_state"
          >
            {error}
          </p>
        )}
        <button
          type="button"
          onClick={handleLogin}
          className="w-full rounded-xl py-3 font-bold text-white text-sm"
          style={{ background: "#1a6b3c" }}
          data-ocid="admin.login.button"
        >
          लॉगिन करें
        </button>
      </div>
    </div>
  );
}

// ---------- Prayer Times Manager ----------
function PrayerTimesManager() {
  const { data: prayerTimes, isLoading } = usePrayerTimes();
  const updateTimes = useUpdatePrayerTimes();

  // Build local edit state from backend data
  const [localTimes, setLocalTimes] = useState<Record<string, string>>({});
  const [saved, setSaved] = useState(false);

  // Merge backend data into localTimes on first load
  function getTimeValue(id: string): string {
    if (localTimes[id] !== undefined) return localTimes[id];
    if (!prayerTimes) return "";
    const found = (prayerTimes as PrayerTime[]).find(
      (p) => p.name.toLowerCase().replace(/ /g, "_") === id,
    );
    return found ? to24h(found.time) : "";
  }

  function handleChange(id: string, val: string) {
    setLocalTimes((prev) => ({ ...prev, [id]: val }));
    setSaved(false);
  }

  function handleSave() {
    const pairs: Array<[string, string]> = PRAYER_ORDER.map((id) => [
      id,
      getTimeValue(id),
    ]);
    updateTimes.mutate(pairs, {
      onSuccess: () => {
        setSaved(true);
        setTimeout(() => setSaved(false), 2500);
      },
    });
  }

  if (isLoading) {
    return (
      <div
        className="py-8 text-center text-sm text-gray-400"
        data-ocid="admin.prayers.loading_state"
      >
        लोड हो रहा है...
      </div>
    );
  }

  return (
    <div data-ocid="admin.prayers.panel">
      <div className="flex items-center justify-between mb-4">
        <h3 className="font-bold text-base" style={{ color: "#1a6b3c" }}>
          नमाज़ के वक़्त
        </h3>
        <button
          type="button"
          onClick={handleSave}
          disabled={updateTimes.isPending}
          className="text-xs font-bold px-4 py-1.5 rounded-full text-white flex items-center gap-1.5"
          style={{ background: saved ? "#25a85a" : "#1a6b3c" }}
          data-ocid="admin.prayers.save_button"
        >
          {updateTimes.isPending && (
            <Loader2 className="h-3 w-3 animate-spin" />
          )}
          {saved
            ? "✓ सेव हो गया!"
            : updateTimes.isPending
              ? "सेव हो रहा है..."
              : "सेव करें"}
        </button>
      </div>

      <div className="space-y-3">
        {PRAYER_ORDER.map((id, i) => {
          const meta = PRAYER_META[id];
          const val = getTimeValue(id);
          return (
            <div
              key={id}
              className="bg-white rounded-2xl p-4 shadow-card flex items-center gap-3"
              data-ocid={`admin.prayer.item.${i + 1}`}
            >
              <div
                className="w-10 h-10 rounded-xl flex items-center justify-center text-xl flex-shrink-0"
                style={{ background: "#e8f5ee" }}
              >
                {meta?.icon}
              </div>
              <div className="flex-1 min-w-0">
                <p
                  className="text-xs"
                  style={{ color: "#888", fontFamily: "serif" }}
                >
                  {meta?.arabic}
                </p>
                <p className="font-bold text-sm" style={{ color: "#1a6b3c" }}>
                  {meta?.hindi}
                </p>
                {meta?.isSpecial && (
                  <span
                    className="inline-block text-xs px-2 py-0.5 rounded-full font-bold mt-0.5"
                    style={{ background: "#c9a84c", color: "#3b2000" }}
                  >
                    सिर्फ़ जुमा
                  </span>
                )}
              </div>
              <div className="text-right">
                {val && (
                  <p className="text-xs text-gray-400 mb-1">{to12h(val)}</p>
                )}
                <input
                  type="time"
                  value={val}
                  onChange={(e) => handleChange(id, e.target.value)}
                  className="border rounded-lg px-2 py-1 text-sm outline-none"
                  style={{ borderColor: "#c8e6d4", color: "#1a6b3c" }}
                  data-ocid={`admin.prayer.time.input.${i + 1}`}
                />
              </div>
            </div>
          );
        })}
      </div>
      <p className="text-xs text-gray-400 mt-4 text-center">
        बदलाव तुरंत नमाज़ स्क्रीन पर दिखेंगे।
      </p>
    </div>
  );
}

// ---------- Announcements Manager ----------
function AnnouncementsManager() {
  const { data: announcements, isLoading } = useAnnouncements();
  const addAnn = useAddAnnouncement();
  const deleteAnn = useDeleteAnnouncement();

  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({ title: "", body: "" });
  const [formError, setFormError] = useState("");

  function handleAdd() {
    if (!form.title.trim()) {
      setFormError("शीर्षक ज़रूरी है।");
      return;
    }
    addAnn.mutate(
      { title: form.title.trim(), body: form.body.trim() },
      {
        onSuccess: () => {
          setForm({ title: "", body: "" });
          setFormError("");
          setShowForm(false);
        },
        onError: () => setFormError("जोड़ने में समस्या हुई।"),
      },
    );
  }

  return (
    <div data-ocid="admin.notices.panel">
      <div className="flex items-center justify-between mb-4">
        <h3 className="font-bold text-base" style={{ color: "#1a6b3c" }}>
          सूचनाएं
        </h3>
        <button
          type="button"
          onClick={() => {
            setShowForm((v) => !v);
            setFormError("");
          }}
          className="text-xs font-bold px-3 py-1.5 rounded-full text-white"
          style={{ background: "#1a6b3c" }}
          data-ocid="admin.notice.open_modal_button"
        >
          {showForm ? "✕ रद्द करें" : "+ सूचना जोड़ें"}
        </button>
      </div>

      {showForm && (
        <div
          className="bg-white rounded-2xl p-4 shadow-card mb-4"
          data-ocid="admin.notice.modal"
        >
          <div className="flex flex-col gap-2">
            <input
              type="text"
              placeholder="शीर्षक *"
              value={form.title}
              onChange={(e) =>
                setForm((f) => ({ ...f, title: e.target.value }))
              }
              className="w-full border rounded-xl px-3 py-2 text-sm outline-none"
              style={{ borderColor: "#c8e6d4" }}
              data-ocid="admin.notice.title.input"
            />
            <textarea
              placeholder="सूचना का विवरण"
              value={form.body}
              onChange={(e) => setForm((f) => ({ ...f, body: e.target.value }))}
              rows={3}
              className="w-full border rounded-xl px-3 py-2 text-sm outline-none resize-none"
              style={{ borderColor: "#c8e6d4" }}
              data-ocid="admin.notice.body.textarea"
            />
            {formError && (
              <p
                className="text-xs text-red-500"
                data-ocid="admin.notice.error_state"
              >
                {formError}
              </p>
            )}
            <button
              type="button"
              onClick={handleAdd}
              disabled={addAnn.isPending}
              className="w-full rounded-xl py-2 text-sm font-bold text-white flex items-center justify-center gap-2"
              style={{ background: "#1a6b3c" }}
              data-ocid="admin.notice.submit_button"
            >
              {addAnn.isPending && <Loader2 className="h-4 w-4 animate-spin" />}
              {addAnn.isPending ? "जोड़ा जा रहा है..." : "सूचना सेव करें"}
            </button>
          </div>
        </div>
      )}

      {isLoading ? (
        <div
          className="py-6 text-center text-sm text-gray-400"
          data-ocid="admin.notices.loading_state"
        >
          लोड हो रहा है...
        </div>
      ) : !announcements || announcements.length === 0 ? (
        <div
          className="bg-white rounded-2xl p-6 text-center text-sm text-gray-400"
          data-ocid="admin.notices.empty_state"
        >
          कोई सूचना नहीं है।
        </div>
      ) : (
        <div className="space-y-3">
          {(announcements as Announcement[]).map((ann, i) => (
            <div
              key={String(ann.id)}
              className="bg-white rounded-2xl p-4 shadow-card"
              data-ocid={`admin.notice.item.${i + 1}`}
            >
              <div className="flex items-start justify-between gap-2">
                <div className="flex-1 min-w-0">
                  <p className="font-bold text-sm text-gray-800">{ann.title}</p>
                  <p className="text-xs text-gray-400 mt-0.5">
                    {formatTimestamp(ann.timestamp)}
                  </p>
                  {ann.body && (
                    <p className="text-xs text-gray-600 mt-1 leading-relaxed">
                      {ann.body}
                    </p>
                  )}
                </div>
                <button
                  type="button"
                  onClick={() => deleteAnn.mutate(ann.id)}
                  disabled={deleteAnn.isPending}
                  className="text-xs text-red-400 hover:text-red-600 px-2 py-1 rounded-full flex-shrink-0"
                  aria-label="सूचना हटाएं"
                  data-ocid={`admin.notice.delete_button.${i + 1}`}
                >
                  🗑
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

// ---------- Committee Manager ----------
function CommitteeManager() {
  const { data: members, isLoading } = useCommitteeMembers();
  const addMember = useAddCommitteeMember();
  const deleteMember = useDeleteCommitteeMember();

  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({ name: "", role: "", phoneNumber: "" });
  const [formError, setFormError] = useState("");

  function handleAdd() {
    if (!form.name.trim() || !form.phoneNumber.trim()) {
      setFormError("नाम और फ़ोन नंबर ज़रूरी है।");
      return;
    }
    addMember.mutate(
      {
        name: form.name.trim(),
        role: form.role.trim(),
        phoneNumber: form.phoneNumber.trim(),
      },
      {
        onSuccess: () => {
          setForm({ name: "", role: "", phoneNumber: "" });
          setFormError("");
          setShowForm(false);
        },
        onError: () => setFormError("जोड़ने में समस्या हुई।"),
      },
    );
  }

  return (
    <div data-ocid="admin.committee.panel">
      <div className="flex items-center justify-between mb-4">
        <h3 className="font-bold text-base" style={{ color: "#1a6b3c" }}>
          कमेटी सदस्य
        </h3>
        <button
          type="button"
          onClick={() => {
            setShowForm((v) => !v);
            setFormError("");
          }}
          className="text-xs font-bold px-3 py-1.5 rounded-full text-white"
          style={{ background: "#1a6b3c" }}
          data-ocid="admin.committee.open_modal_button"
        >
          {showForm ? "✕ रद्द करें" : "+ सदस्य जोड़ें"}
        </button>
      </div>

      {showForm && (
        <div
          className="bg-white rounded-2xl p-4 shadow-card mb-4"
          data-ocid="admin.committee.modal"
        >
          <div className="flex flex-col gap-2">
            <input
              type="text"
              placeholder="नाम *"
              value={form.name}
              onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
              className="w-full border rounded-xl px-3 py-2 text-sm outline-none"
              style={{ borderColor: "#c8e6d4" }}
              data-ocid="admin.committee.name.input"
            />
            <input
              type="text"
              placeholder="पद (जैसे: इमाम, सेक्रेटरी)"
              value={form.role}
              onChange={(e) => setForm((f) => ({ ...f, role: e.target.value }))}
              className="w-full border rounded-xl px-3 py-2 text-sm outline-none"
              style={{ borderColor: "#c8e6d4" }}
              data-ocid="admin.committee.role.input"
            />
            <input
              type="tel"
              placeholder="फ़ोन नंबर *"
              value={form.phoneNumber}
              onChange={(e) =>
                setForm((f) => ({ ...f, phoneNumber: e.target.value }))
              }
              className="w-full border rounded-xl px-3 py-2 text-sm outline-none"
              style={{ borderColor: "#c8e6d4" }}
              data-ocid="admin.committee.phone.input"
            />
            {formError && (
              <p
                className="text-xs text-red-500"
                data-ocid="admin.committee.error_state"
              >
                {formError}
              </p>
            )}
            <button
              type="button"
              onClick={handleAdd}
              disabled={addMember.isPending}
              className="w-full rounded-xl py-2 text-sm font-bold text-white flex items-center justify-center gap-2"
              style={{ background: "#1a6b3c" }}
              data-ocid="admin.committee.submit_button"
            >
              {addMember.isPending && (
                <Loader2 className="h-4 w-4 animate-spin" />
              )}
              {addMember.isPending ? "जोड़ा जा रहा है..." : "सदस्य सेव करें"}
            </button>
          </div>
        </div>
      )}

      {isLoading ? (
        <div
          className="py-6 text-center text-sm text-gray-400"
          data-ocid="admin.committee.loading_state"
        >
          लोड हो रहा है...
        </div>
      ) : !members || members.length === 0 ? (
        <div
          className="bg-white rounded-2xl p-6 text-center text-sm text-gray-400"
          data-ocid="admin.committee.empty_state"
        >
          कोई सदस्य नहीं है।
        </div>
      ) : (
        <div className="space-y-3">
          {(members as CommitteeMember[]).map((m, i) => (
            <div
              key={String(m.id)}
              className="bg-white rounded-2xl p-4 shadow-card flex items-center gap-3"
              data-ocid={`admin.committee.item.${i + 1}`}
            >
              <div
                className="w-10 h-10 rounded-full flex items-center justify-center font-bold text-white flex-shrink-0"
                style={{ background: "#1a6b3c" }}
              >
                {m.name.charAt(0).toUpperCase()}
              </div>
              <div className="flex-1 min-w-0">
                <p className="font-bold text-sm text-gray-800">{m.name}</p>
                {m.role && <p className="text-xs text-gray-500">{m.role}</p>}
                <p className="text-xs text-gray-400">{m.phoneNumber}</p>
              </div>
              <button
                type="button"
                onClick={() => deleteMember.mutate(m.id)}
                disabled={deleteMember.isPending}
                className="text-xs text-red-400 hover:text-red-600 px-2 py-1 rounded-full flex-shrink-0"
                aria-label="हटाएं"
                data-ocid={`admin.committee.delete_button.${i + 1}`}
              >
                🗑
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

// ---------- Main Admin Panel ----------
type AdminTab = "prayers" | "notices" | "committee";

export function AdminScreen() {
  const [authed, setAuthed] = useState(
    () => sessionStorage.getItem(AUTH_KEY) === "1",
  );
  const [tab, setTab] = useState<AdminTab>("notices");

  if (!authed) {
    return <LoginScreen onLogin={() => setAuthed(true)} />;
  }

  const tabs: { id: AdminTab; label: string }[] = [
    { id: "notices", label: "📢 सूचनाएं" },
    { id: "prayers", label: "🕌 नमाज़" },
    { id: "committee", label: "👥 कमेटी" },
  ];

  return (
    <div className="px-4 py-5" data-ocid="admin.page">
      <div className="flex items-center justify-between mb-5">
        <div>
          <h2 className="font-bold text-xl" style={{ color: "#1a6b3c" }}>
            एडमिन पैनल
          </h2>
          <p className="text-xs text-gray-500 mt-0.5">मस्जिद प्रबंधन</p>
        </div>
        <button
          type="button"
          onClick={() => {
            sessionStorage.removeItem(AUTH_KEY);
            setAuthed(false);
          }}
          className="text-xs font-semibold px-3 py-1.5 rounded-full border"
          style={{ borderColor: "#1a6b3c", color: "#1a6b3c" }}
          data-ocid="admin.logout.button"
        >
          लॉगआउट
        </button>
      </div>

      {/* Tabs */}
      <div
        className="flex rounded-xl overflow-hidden mb-5"
        style={{ background: "#e8f5ee" }}
        data-ocid="admin.tab"
      >
        {tabs.map((t) => (
          <button
            key={t.id}
            type="button"
            onClick={() => setTab(t.id)}
            className="flex-1 py-2.5 text-xs font-bold transition-all"
            style={{
              background: tab === t.id ? "#1a6b3c" : "transparent",
              color: tab === t.id ? "white" : "#1a6b3c",
            }}
            data-ocid={`admin.${t.id}.tab`}
          >
            {t.label}
          </button>
        ))}
      </div>

      {tab === "notices" && <AnnouncementsManager />}
      {tab === "prayers" && <PrayerTimesManager />}
      {tab === "committee" && <CommitteeManager />}
    </div>
  );
}
