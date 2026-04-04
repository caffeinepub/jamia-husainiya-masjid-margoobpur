import { useState } from "react";
import type { Notice } from "../data/notices";
import type { Prayer } from "../data/prayers";
import { PRAYERS } from "../data/prayers";

const ADMIN_PIN = "786";
const NOTICES_KEY = "masjid_notices";
const PRAYER_TIMES_KEY = "masjid_prayer_times";
const AUTH_KEY = "masjid_admin_authed";

function loadNotices(): Notice[] {
  try {
    const s = localStorage.getItem(NOTICES_KEY);
    if (s) return JSON.parse(s) as Notice[];
  } catch {}
  return [];
}

function saveNotices(list: Notice[]) {
  localStorage.setItem(NOTICES_KEY, JSON.stringify(list));
}

type PrayerTimes = Record<string, string>;

function loadPrayerTimes(): PrayerTimes {
  try {
    const s = localStorage.getItem(PRAYER_TIMES_KEY);
    if (s) return JSON.parse(s) as PrayerTimes;
  } catch {}
  const defaults: PrayerTimes = {};
  for (const p of PRAYERS) {
    const hh = String(p.hour).padStart(2, "0");
    const mm = String(p.minute).padStart(2, "0");
    defaults[p.id] = `${hh}:${mm}`;
  }
  return defaults;
}

function savePrayerTimes(times: PrayerTimes) {
  localStorage.setItem(PRAYER_TIMES_KEY, JSON.stringify(times));
}

function to12h(t: string): string {
  const [hStr, mStr] = t.split(":");
  let h = Number.parseInt(hStr, 10);
  const m = mStr;
  const suffix = h >= 12 ? "PM" : "AM";
  if (h > 12) h -= 12;
  if (h === 0) h = 12;
  return `${h}:${m} ${suffix}`;
}

type AdminTab = "notices" | "prayers";

function LoginScreen({ onLogin }: { onLogin: () => void }) {
  const [pin, setPin] = useState("");
  const [error, setError] = useState("");

  function handleLogin() {
    if (pin === ADMIN_PIN) {
      sessionStorage.setItem(AUTH_KEY, "1");
      onLogin();
    } else {
      setError("गलत PIN है।");
      setPin("");
    }
  }

  return (
    <div
      className="px-4 py-5 flex flex-col items-center"
      data-ocid="admin.page"
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
                id="geo4"
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
            <rect width="100%" height="100%" fill="url(#geo4)" />
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

function NoticesManager() {
  const [notices, setNotices] = useState<Notice[]>(loadNotices);
  const [showForm, setShowForm] = useState(false);
  const today = new Date().toISOString().slice(0, 10);
  const [form, setForm] = useState({
    title: "",
    description: "",
    date: today,
    category: "",
    important: false,
  });
  const [formError, setFormError] = useState("");

  function handleAdd() {
    if (!form.title.trim()) {
      setFormError("शीर्षक ज़रूरी है।");
      return;
    }
    const newNotice: Notice = {
      id: Date.now().toString(),
      title: form.title.trim(),
      description: form.description.trim(),
      date: form.date,
      category: form.category.trim(),
      important: form.important,
    };
    const updated = [newNotice, ...notices];
    setNotices(updated);
    saveNotices(updated);
    setForm({
      title: "",
      description: "",
      date: today,
      category: "",
      important: false,
    });
    setFormError("");
    setShowForm(false);
  }

  function handleDelete(id: string) {
    const updated = notices.filter((n) => n.id !== id);
    setNotices(updated);
    saveNotices(updated);
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
              placeholder="विवरण"
              value={form.description}
              onChange={(e) =>
                setForm((f) => ({ ...f, description: e.target.value }))
              }
              rows={3}
              className="w-full border rounded-xl px-3 py-2 text-sm outline-none resize-none"
              style={{ borderColor: "#c8e6d4" }}
              data-ocid="admin.notice.description.textarea"
            />
            <input
              type="date"
              value={form.date}
              onChange={(e) => setForm((f) => ({ ...f, date: e.target.value }))}
              className="w-full border rounded-xl px-3 py-2 text-sm outline-none"
              style={{ borderColor: "#c8e6d4" }}
              data-ocid="admin.notice.date.input"
            />
            <input
              type="text"
              placeholder="श्रेणी (जैसे: कार्यक्रम, एलान)"
              value={form.category}
              onChange={(e) =>
                setForm((f) => ({ ...f, category: e.target.value }))
              }
              className="w-full border rounded-xl px-3 py-2 text-sm outline-none"
              style={{ borderColor: "#c8e6d4" }}
              data-ocid="admin.notice.category.input"
            />
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={form.important}
                onChange={(e) =>
                  setForm((f) => ({ ...f, important: e.target.checked }))
                }
                className="w-4 h-4 accent-green-700"
                data-ocid="admin.notice.important.checkbox"
              />
              <span className="text-sm text-gray-600">ज़रूरी सूचना</span>
            </label>
            {formError && <p className="text-xs text-red-500">{formError}</p>}
            <button
              type="button"
              onClick={handleAdd}
              className="w-full rounded-xl py-2 text-sm font-bold text-white"
              style={{ background: "#1a6b3c" }}
              data-ocid="admin.notice.submit_button"
            >
              सूचना सेव करें
            </button>
          </div>
        </div>
      )}

      {notices.length === 0 ? (
        <div
          className="bg-white rounded-2xl p-6 text-center text-sm text-gray-400"
          data-ocid="admin.notices.empty_state"
        >
          कोई सूचना नहीं है। &quot;+ सूचना जोड़ें&quot; दबाकर जोड़ें।
        </div>
      ) : (
        <div className="space-y-3">
          {notices.map((notice, i) => (
            <div
              key={notice.id}
              className="bg-white rounded-2xl p-4 shadow-card"
              data-ocid={`admin.notice.item.${i + 1}`}
            >
              <div className="flex items-start justify-between gap-2">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap">
                    <p className="font-bold text-sm text-gray-800">
                      {notice.title}
                    </p>
                    {notice.important && (
                      <span
                        className="text-xs px-2 py-0.5 rounded-full font-bold"
                        style={{ background: "#fff0f0", color: "#c0392b" }}
                      >
                        ज़रूरी
                      </span>
                    )}
                  </div>
                  <p className="text-xs text-gray-400 mt-0.5">
                    {notice.date}
                    {notice.category ? ` · ${notice.category}` : ""}
                  </p>
                  {notice.description && (
                    <p className="text-xs text-gray-600 mt-1 leading-relaxed">
                      {notice.description}
                    </p>
                  )}
                </div>
                <button
                  type="button"
                  onClick={() => handleDelete(notice.id)}
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

function PrayerTimesManager() {
  const [times, setTimes] = useState<PrayerTimes>(loadPrayerTimes);
  const [saved, setSaved] = useState(false);

  function handleChange(id: string, value: string) {
    setTimes((prev) => ({ ...prev, [id]: value }));
    setSaved(false);
  }

  function handleSave() {
    savePrayerTimes(times);
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  }

  const prayerLabels: Record<
    string,
    { arabic: string; hindi: string; icon: string; isSpecial?: boolean }
  > = {
    fajr: { arabic: "الفَجْر", hindi: "फ़जर", icon: "🌙" },
    khutba_juma: {
      arabic: "خُطْبَةُ الجُمُعَة",
      hindi: "ख़ुत्बा जुमा",
      icon: "🕌",
      isSpecial: true,
    },
    zohar: { arabic: "الظُّهْر", hindi: "ज़ोहर", icon: "🌅" },
    asr: { arabic: "العَصْر", hindi: "अस्र", icon: "☀️" },
    maghrib: { arabic: "المَغْرِب", hindi: "मग़रिब", icon: "🌇" },
    isha: { arabic: "العِشَاء", hindi: "इशा", icon: "🌃" },
  };

  return (
    <div data-ocid="admin.prayers.panel">
      <div className="flex items-center justify-between mb-4">
        <h3 className="font-bold text-base" style={{ color: "#1a6b3c" }}>
          नमाज़ के वक़्त
        </h3>
        <button
          type="button"
          onClick={handleSave}
          className="text-xs font-bold px-4 py-1.5 rounded-full text-white"
          style={{ background: saved ? "#25a85a" : "#1a6b3c" }}
          data-ocid="admin.prayers.save_button"
        >
          {saved ? "✓ सेव हो गया!" : "सेव करें"}
        </button>
      </div>

      <div className="space-y-3">
        {PRAYERS.map((p: Prayer, i: number) => {
          const label = prayerLabels[p.id];
          const val = times[p.id] || "";
          return (
            <div
              key={p.id}
              className="bg-white rounded-2xl p-4 shadow-card flex items-center gap-3"
              data-ocid={`admin.prayer.item.${i + 1}`}
            >
              <div
                className="w-10 h-10 rounded-xl flex items-center justify-center text-xl flex-shrink-0"
                style={{ background: "#e8f5ee" }}
              >
                {label.icon}
              </div>
              <div className="flex-1 min-w-0">
                <p
                  className="text-xs"
                  style={{ color: "#888", fontFamily: "serif" }}
                >
                  {label.arabic}
                </p>
                <p className="font-bold text-sm" style={{ color: "#1a6b3c" }}>
                  {label.hindi}
                </p>
                {label.isSpecial && (
                  <span
                    className="inline-block text-xs px-2 py-0.5 rounded-full font-bold mt-0.5"
                    style={{ background: "#c9a84c", color: "#3b2000" }}
                  >
                    सिर्फ़ जुमा
                  </span>
                )}
              </div>
              <div className="text-right">
                <p className="text-xs text-gray-400 mb-1">{to12h(val)}</p>
                <input
                  type="time"
                  value={val}
                  onChange={(e) => handleChange(p.id, e.target.value)}
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

export function AdminScreen() {
  const [authed, setAuthed] = useState(
    () => sessionStorage.getItem(AUTH_KEY) === "1",
  );
  const [tab, setTab] = useState<AdminTab>("notices");

  if (!authed) {
    return <LoginScreen onLogin={() => setAuthed(true)} />;
  }

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
        {(["notices", "prayers"] as AdminTab[]).map((t) => (
          <button
            key={t}
            type="button"
            onClick={() => setTab(t)}
            className="flex-1 py-2.5 text-sm font-bold transition-all"
            style={{
              background: tab === t ? "#1a6b3c" : "transparent",
              color: tab === t ? "white" : "#1a6b3c",
              borderRadius: "inherit",
            }}
            data-ocid={`admin.${t}.tab`}
          >
            {t === "notices" ? "📢 सूचनाएं" : "🕌 नमाज़ के वक़्त"}
          </button>
        ))}
      </div>

      {tab === "notices" && <NoticesManager />}
      {tab === "prayers" && <PrayerTimesManager />}
    </div>
  );
}
