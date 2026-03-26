import { useEffect, useState } from "react";
import type { CommitteeMember } from "../data/contacts";

const STORAGE_KEY = "masjid_committee";

function loadCommittee(): CommitteeMember[] {
  try {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) return JSON.parse(saved) as CommitteeMember[];
  } catch {}
  return [];
}

function saveCommittee(list: CommitteeMember[]) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(list));
}

export function ContactScreen() {
  const [committee, setCommittee] = useState<CommitteeMember[]>(loadCommittee);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({ name: "", role: "", phone: "" });
  const [error, setError] = useState("");

  useEffect(() => {
    saveCommittee(committee);
  }, [committee]);

  function handleAdd() {
    if (!form.name.trim() || !form.phone.trim()) {
      setError("नाम और फोन नंबर जरूरी है।");
      return;
    }
    setCommittee((prev) => [
      ...prev,
      {
        name: form.name.trim(),
        role: form.role.trim(),
        phone: form.phone.trim(),
      },
    ]);
    setForm({ name: "", role: "", phone: "" });
    setError("");
    setShowForm(false);
  }

  function handleDelete(index: number) {
    setCommittee((prev) => prev.filter((_, i) => i !== index));
  }

  return (
    <div className="px-4 py-5" data-ocid="contact.page">
      <div className="mb-5">
        <h2 className="font-bold text-xl" style={{ color: "#1a6b3c" }}>
          Contact Us
        </h2>
        <p className="text-xs text-gray-500 mt-0.5">
          Reach out to Jamia Husainiya Masjid Margoobpur
        </p>
      </div>

      {/* Mosque identity card */}
      <div
        className="rounded-2xl p-5 mb-4 relative overflow-hidden text-white"
        style={{ background: "#1a6b3c" }}
      >
        <div
          className="absolute inset-0 opacity-10 pointer-events-none"
          aria-hidden="true"
        >
          <svg
            role="img"
            aria-label="decorative pattern"
            width="100%"
            height="100%"
          >
            <defs>
              <pattern
                id="geo2"
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
            <rect width="100%" height="100%" fill="url(#geo2)" />
          </svg>
        </div>
        <div className="relative flex items-center gap-3">
          <span className="text-4xl">🕌</span>
          <div>
            <h3 className="font-bold text-base">
              Jamia Husainiya Masjid Margoobpur
            </h3>
            <p className="text-xs mt-0.5" style={{ color: "#c9a84c" }}>
              جامعه حسينيه مسجد مرقوبپور
            </p>
          </div>
        </div>
      </div>

      {/* Address card */}
      <div
        className="bg-white rounded-2xl p-4 shadow-card mb-4"
        data-ocid="contact.address.card"
      >
        <div className="flex items-start gap-3">
          <span className="text-xl mt-0.5">📍</span>
          <div>
            <p className="font-semibold text-sm" style={{ color: "#1a6b3c" }}>
              Address
            </p>
            <p className="text-sm text-gray-600 mt-0.5 leading-relaxed">
              Jamia Husainiya Masjid, Margoobpur Deedaheri,
              <br />
              Haridwar, Uttarakhand — 247667
            </p>
          </div>
        </div>
      </div>

      {/* Action buttons */}
      <div className="grid grid-cols-2 gap-3 mb-4">
        <a
          href="tel:+918958999299"
          className="flex items-center justify-center gap-2 rounded-2xl p-4 font-bold text-sm text-white shadow-card"
          style={{ background: "#1a6b3c" }}
          data-ocid="contact.call.button"
        >
          <span className="text-lg">📞</span>
          Call Now
        </a>
        <a
          href="https://wa.me/918958999299"
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center justify-center gap-2 rounded-2xl p-4 font-bold text-sm text-white shadow-card"
          style={{ background: "#25d366" }}
          data-ocid="contact.whatsapp.button"
        >
          <span className="text-lg">💬</span>
          WhatsApp
        </a>
      </div>

      {/* Committee contacts */}
      <div className="bg-white rounded-2xl shadow-card overflow-hidden mb-4">
        <div
          className="px-4 py-3 border-b flex items-center justify-between"
          style={{ borderColor: "#e8f5ee" }}
        >
          <h3 className="font-bold text-sm" style={{ color: "#1a6b3c" }}>
            Masjid Committee
          </h3>
          <button
            type="button"
            onClick={() => {
              setShowForm((v) => !v);
              setError("");
            }}
            className="text-xs font-bold px-3 py-1.5 rounded-full text-white"
            style={{ background: "#1a6b3c" }}
          >
            {showForm ? "✕ Cancel" : "+ Add"}
          </button>
        </div>

        {/* Add form */}
        {showForm && (
          <div
            className="px-4 py-4 border-b"
            style={{ borderColor: "#e8f5ee", background: "#f7fbf8" }}
          >
            <div className="flex flex-col gap-2">
              <input
                type="text"
                placeholder="नाम (Name) *"
                value={form.name}
                onChange={(e) =>
                  setForm((f) => ({ ...f, name: e.target.value }))
                }
                className="w-full border rounded-xl px-3 py-2 text-sm outline-none"
                style={{ borderColor: "#c8e6d4" }}
              />
              <input
                type="text"
                placeholder="Role (e.g. Imam, Secretary)"
                value={form.role}
                onChange={(e) =>
                  setForm((f) => ({ ...f, role: e.target.value }))
                }
                className="w-full border rounded-xl px-3 py-2 text-sm outline-none"
                style={{ borderColor: "#c8e6d4" }}
              />
              <input
                type="tel"
                placeholder="फोन नंबर (Phone) *"
                value={form.phone}
                onChange={(e) =>
                  setForm((f) => ({ ...f, phone: e.target.value }))
                }
                className="w-full border rounded-xl px-3 py-2 text-sm outline-none"
                style={{ borderColor: "#c8e6d4" }}
              />
              {error && <p className="text-xs text-red-500">{error}</p>}
              <button
                type="button"
                onClick={handleAdd}
                className="w-full rounded-xl py-2 text-sm font-bold text-white"
                style={{ background: "#1a6b3c" }}
              >
                Save
              </button>
            </div>
          </div>
        )}

        {committee.length === 0 && !showForm ? (
          <div className="px-4 py-6 text-center text-sm text-gray-400">
            कोई member नहीं है। &quot;+ Add&quot; दबाकर जोड़ें।
          </div>
        ) : (
          committee.map((member, index) => (
            <div
              key={`${member.name}-${index}`}
              className="flex items-center justify-between px-4 py-3"
              style={{
                borderBottom:
                  index < committee.length - 1 ? "1px solid #f0f7f0" : "none",
              }}
              data-ocid={`contact.committee.item.${index + 1}`}
            >
              <div className="flex-1 min-w-0">
                <p className="font-semibold text-sm text-gray-800 truncate">
                  {member.name}
                </p>
                {member.role && (
                  <p className="text-xs text-gray-500">{member.role}</p>
                )}
              </div>
              <div className="flex items-center gap-2 ml-2">
                <a
                  href={`tel:${member.phone}`}
                  className="text-xs font-semibold px-3 py-1.5 rounded-full"
                  style={{ background: "#e8f5ee", color: "#1a6b3c" }}
                >
                  {member.phone}
                </a>
                <button
                  type="button"
                  onClick={() => handleDelete(index)}
                  className="text-xs text-red-400 hover:text-red-600 px-1 py-1 rounded-full"
                  aria-label="Delete"
                >
                  ✕
                </button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
