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

export function PeopleScreen() {
  const [committee, setCommittee] = useState<CommitteeMember[]>(loadCommittee);

  useEffect(() => {
    function onStorage(e: StorageEvent) {
      if (e.key === STORAGE_KEY) setCommittee(loadCommittee());
    }
    window.addEventListener("storage", onStorage);
    const onFocus = () => setCommittee(loadCommittee());
    window.addEventListener("focus", onFocus);
    return () => {
      window.removeEventListener("storage", onStorage);
      window.removeEventListener("focus", onFocus);
    };
  }, []);

  return (
    <div className="px-4 py-5" data-ocid="people.page">
      <div className="mb-5">
        <h2 className="font-bold text-xl" style={{ color: "#1a6b3c" }}>
          मस्जिद कमेटी
        </h2>
        <p
          className="text-xs text-gray-500 mt-0.5"
          style={{ fontFamily: "serif" }}
        >
          أعضاء لجنة المسجد
        </p>
      </div>

      {/* Decorative banner */}
      <div
        className="rounded-2xl p-4 mb-5 text-center relative overflow-hidden"
        style={{ background: "#1a6b3c" }}
      >
        <div
          className="absolute inset-0 opacity-10 pointer-events-none"
          aria-hidden="true"
        >
          <svg role="img" aria-label="decorative" width="100%" height="100%">
            <defs>
              <pattern
                id="geo3"
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
            <rect width="100%" height="100%" fill="url(#geo3)" />
          </svg>
        </div>
        <p className="text-white font-bold text-base relative">👥 कमेटी सदस्य</p>
        <p className="text-xs relative mt-1" style={{ color: "#c9a84c" }}>
          जामिया हुसैनिया मस्जिद मरगूबपुर
        </p>
      </div>

      {committee.length === 0 ? (
        <div
          className="bg-white rounded-2xl p-8 text-center shadow-card"
          data-ocid="people.empty_state"
        >
          <div className="text-4xl mb-3">👤</div>
          <p className="text-sm text-gray-500 leading-relaxed">
            अभी कोई committee member नहीं जोड़ा गया है।
          </p>
          <p className="text-xs text-gray-400 mt-1">
            Admin panel से members जोड़ें।
          </p>
        </div>
      ) : (
        <div className="space-y-3" data-ocid="people.list">
          {committee.map((member, index) => (
            <div
              key={`${member.name}-${index}`}
              className="bg-white rounded-2xl p-4 shadow-card flex items-center gap-4"
              data-ocid={`people.item.${index + 1}`}
            >
              <div
                className="w-12 h-12 rounded-full flex items-center justify-center text-xl font-bold text-white flex-shrink-0"
                style={{ background: "#1a6b3c" }}
              >
                {member.name.charAt(0).toUpperCase()}
              </div>
              <div className="flex-1 min-w-0">
                <p className="font-bold text-sm text-gray-800">{member.name}</p>
                {member.role && (
                  <span
                    className="inline-block text-xs px-2 py-0.5 rounded-full font-medium mt-0.5"
                    style={{ background: "#e8f5ee", color: "#1a6b3c" }}
                  >
                    {member.role}
                  </span>
                )}
              </div>
              <a
                href={`tel:${member.phone}`}
                className="flex items-center gap-1.5 text-xs font-semibold px-3 py-2 rounded-full"
                style={{ background: "#e8f5ee", color: "#1a6b3c" }}
                data-ocid={`people.call.button.${index + 1}`}
              >
                <svg
                  role="img"
                  aria-label="कॉल करें"
                  width="12"
                  height="12"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07A19.5 19.5 0 0 1 4.4 12.07a19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 3.51 1.4h3a2 2 0 0 1 2 1.72c.127.96.361 1.903.7 2.81a2 2 0 0 1-.45 2.11L7.91 9.01a16 16 0 0 0 6.05 6.05l1.87-1.87a2 2 0 0 1 2.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0 1 22 16.92z" />
                </svg>
                {member.phone}
              </a>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
