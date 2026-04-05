import { Loader2 } from "lucide-react";
import { useState } from "react";
import type { CommitteeMember } from "../backend.d";
import {
  useAddCommitteeMember,
  useCommitteeMembers,
  useDeleteCommitteeMember,
} from "../hooks/useQueries";

export function ContactScreen() {
  const { data: members, isLoading } = useCommitteeMembers();
  const addMember = useAddCommitteeMember();
  const deleteMember = useDeleteCommitteeMember();

  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({ name: "", role: "", phoneNumber: "" });
  const [error, setError] = useState("");

  function handleAdd() {
    if (!form.name.trim() || !form.phoneNumber.trim()) {
      setError("नाम और फ़ोन नंबर ज़रूरी है।");
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
          setError("");
          setShowForm(false);
        },
        onError: () => setError("सेव करने में समस्या हुई। दोबारा कोशिश करें।"),
      },
    );
  }

  return (
    <div className="px-4 py-5" data-ocid="contact.page">
      <div className="mb-5">
        <h2 className="font-bold text-xl" style={{ color: "#1a6b3c" }}>
          संपर्क करें
        </h2>
        <p className="text-xs text-gray-500 mt-0.5">
          जामिया हुसैनिया मस्जिद मरगूबपुर से जुड़ें
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
          <svg role="img" aria-label="decorative" width="100%" height="100%">
            <defs>
              <pattern
                id="cpat"
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
            <rect width="100%" height="100%" fill="url(#cpat)" />
          </svg>
        </div>
        <div className="relative flex items-center gap-3">
          <span className="text-4xl">🕌</span>
          <div>
            <h3 className="font-bold text-base">जामिया हुसैनिया मस्जिद मरगूबपुर</h3>
            <p className="text-xs mt-0.5" style={{ color: "#c9a84c" }}>
              جامعه حسينيه مسجد مرقوبپور
            </p>
          </div>
        </div>
      </div>

      {/* Address */}
      <div
        className="bg-white rounded-2xl p-4 shadow-card mb-4"
        data-ocid="contact.address.card"
      >
        <div className="flex items-start gap-3">
          <span className="text-xl mt-0.5">📍</span>
          <div>
            <p className="font-semibold text-sm" style={{ color: "#1a6b3c" }}>
              पता
            </p>
            <p className="text-sm text-gray-600 mt-0.5 leading-relaxed">
              जामिया हुसैनिया मस्जिद, मरगूबपुर दीदहेरी,
              <br />
              हरिद्वार, उत्तराखंड — 247667
            </p>
          </div>
        </div>
      </div>

      {/* Action buttons */}
      <div className="grid grid-cols-2 gap-3 mb-5">
        <a
          href="tel:+918958999299"
          className="flex items-center justify-center gap-2 rounded-2xl p-4 font-bold text-sm text-white shadow-card"
          style={{ background: "#1a6b3c" }}
          data-ocid="contact.call.button"
        >
          <span className="text-lg">📞</span>
          अभी कॉल करें
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

      {/* Committee */}
      <div className="bg-white rounded-2xl shadow-card overflow-hidden mb-4">
        <div
          className="px-4 py-3 border-b flex items-center justify-between"
          style={{ borderColor: "#e8f5ee" }}
        >
          <h3 className="font-bold text-sm" style={{ color: "#1a6b3c" }}>
            मस्जिद कमेटी
          </h3>
          <button
            type="button"
            onClick={() => {
              setShowForm((v) => !v);
              setError("");
            }}
            className="text-xs font-bold px-3 py-1.5 rounded-full text-white"
            style={{ background: "#1a6b3c" }}
            data-ocid="contact.committee.open_modal_button"
          >
            {showForm ? "✕ रद्द करें" : "+ जोड़ें"}
          </button>
        </div>

        {showForm && (
          <div
            className="px-4 py-4 border-b"
            style={{ borderColor: "#e8f5ee", background: "#f7fbf8" }}
            data-ocid="contact.committee.modal"
          >
            <div className="flex flex-col gap-2">
              <input
                type="text"
                placeholder="नाम *"
                value={form.name}
                onChange={(e) =>
                  setForm((f) => ({ ...f, name: e.target.value }))
                }
                className="w-full border rounded-xl px-3 py-2 text-sm outline-none"
                style={{ borderColor: "#c8e6d4" }}
                data-ocid="contact.committee.name.input"
              />
              <input
                type="text"
                placeholder="पद (जैसे: इमाम, सेक्रेटरी)"
                value={form.role}
                onChange={(e) =>
                  setForm((f) => ({ ...f, role: e.target.value }))
                }
                className="w-full border rounded-xl px-3 py-2 text-sm outline-none"
                style={{ borderColor: "#c8e6d4" }}
                data-ocid="contact.committee.role.input"
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
                data-ocid="contact.committee.phone.input"
              />
              {error && (
                <p
                  className="text-xs text-red-500"
                  data-ocid="contact.committee.error_state"
                >
                  {error}
                </p>
              )}
              <button
                type="button"
                onClick={handleAdd}
                disabled={addMember.isPending}
                className="w-full rounded-xl py-2 text-sm font-bold text-white flex items-center justify-center gap-2"
                style={{ background: "#1a6b3c" }}
                data-ocid="contact.committee.submit_button"
              >
                {addMember.isPending && (
                  <Loader2 className="h-4 w-4 animate-spin" />
                )}
                {addMember.isPending ? "सेव हो रहा है..." : "सेव करें"}
              </button>
            </div>
          </div>
        )}

        {isLoading ? (
          <div
            className="px-4 py-6 text-center text-sm text-gray-400"
            data-ocid="contact.committee.loading_state"
          >
            लोड हो रहा है...
          </div>
        ) : !members || members.length === 0 ? (
          <div
            className="px-4 py-6 text-center text-sm text-gray-400"
            data-ocid="contact.committee.empty_state"
          >
            कोई सदस्य नहीं जोड़ा गया।
          </div>
        ) : (
          (members as CommitteeMember[]).map((member, index) => (
            <div
              key={String(member.id)}
              className="flex items-center justify-between px-4 py-3"
              style={{
                borderBottom:
                  index < members.length - 1 ? "1px solid #f0f7f0" : "none",
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
                  href={`tel:${member.phoneNumber}`}
                  className="text-xs font-semibold px-3 py-1.5 rounded-full"
                  style={{ background: "#e8f5ee", color: "#1a6b3c" }}
                  data-ocid={`contact.committee.call.button.${index + 1}`}
                >
                  {member.phoneNumber}
                </a>
                <button
                  type="button"
                  onClick={() => deleteMember.mutate(member.id)}
                  disabled={deleteMember.isPending}
                  className="text-xs text-red-400 hover:text-red-600 px-1 py-1 rounded-full"
                  aria-label="हटाएं"
                  data-ocid={`contact.committee.delete_button.${index + 1}`}
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
